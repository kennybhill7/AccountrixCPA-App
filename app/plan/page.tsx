"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/EmptyState";
import { ProgressRing } from "@/components/ProgressRing";

type Urgency = 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW';

interface PlanItem { week: number; urgency: Urgency; title: string; hours: number; deliverables: string[]; mapping?: { monthId: string; weekId: string } | null; rationale?: string }

export default function PlanPage() {
  const [userId, setUserId] = useState('demo-user');
  const [items, setItems] = useState<PlanItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'claude'|'fallback'|'none'>('none');
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [aiMTime, setAiMTime] = useState<number>(0);
  const [dueDates, setDueDates] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/ai/plan-resolve?userId=${encodeURIComponent(userId)}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
          setSource((data.source as any) || 'none');
          try {
            const key = `plan-done-${userId}`;
            const raw = localStorage.getItem(key);
            if (raw) setDone(JSON.parse(raw));
            const dkey = `plan-due-${userId}`;
            const draw = localStorage.getItem(dkey);
            if (draw) setDueDates(JSON.parse(draw));
          } catch {}
        } else {
          setItems([]);
          setSource('none');
        }
      } catch {
        setItems([]);
        setSource('none');
      }
      setLoading(false);
    }
    load();
  }, [userId]);

  // Poll AI folder mtime and refresh when it changes
  useEffect(() => {
    let timer: any;
    let mounted = true;
    async function tick() {
      try {
        const res = await fetch('/api/ai/mtime');
        if (res.ok) {
          const d = await res.json();
          if (mounted && d.mtime && d.mtime !== aiMTime) {
            setAiMTime(d.mtime);
            // Re-fetch plan on change
            const r = await fetch(`/api/ai/plan-resolve?userId=${encodeURIComponent(userId)}`);
            if (r.ok) {
              const data = await r.json();
              setItems(data.items || []);
              setSource((data.source as any) || 'none');
            }
          }
        }
      } catch {}
      timer = setTimeout(tick, 5000);
    }
    tick();
    return () => { mounted = false; if (timer) clearTimeout(timer); };
  }, [userId, aiMTime]);

  function toggleDeliverable(itemKey: string) {
    setDone(prev => {
      const next = { ...prev, [itemKey]: !prev[itemKey] };
      try { localStorage.setItem(`plan-done-${userId}`, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function setDue(key: string, dateStr: string) {
    setDueDates(prev => {
      const next = { ...prev, [key]: dateStr };
      try { localStorage.setItem(`plan-due-${userId}`, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  async function refreshPlan() {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/plan-resolve?userId=${encodeURIComponent(userId)}&refresh=1`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setSource((data.source as any) || 'none');
      }
    } catch {}
    setLoading(false);
  }

  function exportICS() {
    const lines: string[] = [];
    lines.push('BEGIN:VCALENDAR');
    lines.push('VERSION:2.0');
    lines.push('PRODID:-//Accountrix//Plan//EN');
    (items || []).forEach((it) => {
      const key = `${it.urgency}-${it.week}-${it.title}`;
      const d = dueDates[key];
      if (!d) return;
      const dt = d.replace(/-/g, '') + 'T090000Z';
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${Math.random().toString(36).slice(2)}@accountrix`);
      lines.push(`DTSTAMP:${dt}`);
      lines.push(`DTSTART:${dt}`);
      lines.push(`SUMMARY:${escapeICS(`Week ${it.week}: ${it.title}`)}`);
      lines.push(`DESCRIPTION:${escapeICS(it.deliverables.join(', '))}`);
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accountrix-plan.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function escapeICS(s: string) {
    return s.replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  const grouped = useMemo(() => {
    const g: Record<Urgency, PlanItem[]> = { CRITICAL: [], HIGH: [], MEDIUM: [], LOW: [] };
    (items || []).forEach(i => g[i.urgency].push(i));
    return g;
  }, [items]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-muted-foreground">Loading plan…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Your Personalized Plan</h1>
          <p className="text-sm text-muted-foreground">Source: {source === 'claude' ? 'Claude' : source === 'fallback' ? 'Local mapping' : 'None'} — User: {userId}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link href="/onboarding">Edit Onboarding</Link></Button>
          <Button asChild className="btn-primary"><Link href="/months">Browse Lessons</Link></Button>
          <Button onClick={refreshPlan} variant="secondary">Re-prioritize with AI</Button>
          <Button onClick={exportICS} variant="outline">Export iCal</Button>
        </div>
      </div>

      {(items && items.length === 0) ? (
        <EmptyState
          icon={undefined as any}
          title="No Plan Yet"
          description={source === 'none' ? 'No intake or plan found. Complete onboarding or wait for AI to generate your plan.' : 'Your plan is empty. Try re-prioritizing or completing onboarding.'}
        />
      ) : (
      ['CRITICAL','HIGH','MEDIUM','LOW'].map((u) => (
        <div key={u} className="mb-8">
          <h2 className={`text-xl font-semibold mb-3 ${u==='CRITICAL'?'text-red-600':u==='HIGH'?'text-yellow-700':u==='MEDIUM'?'text-green-700':'text-slate-700'}`}>{u}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped[u as Urgency]?.map((it) => (
              <Card key={`${u}-${it.week}-${it.title}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Week {it.week}: {it.title}</CardTitle>
                      <CardDescription>{it.hours} hours • {it.deliverables.join(' • ')}</CardDescription>
                    </div>
                    {(() => {
                      const total = it.deliverables.length || 0;
                      const doneCount = it.deliverables.reduce((acc: number, d: string, idx: number) => acc + (done[`${u}-${it.week}-${idx}-${d}`] ? 1 : 0), 0);
                      const pct = total ? Math.round((doneCount / total) * 100) : 0;
                      return (
                        <ProgressRing progress={pct} size={48} strokeWidth={5} showText />
                      );
                    })()}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-muted-foreground">Due date:</span>
                    <Input type="date" className="h-8 w-44" value={dueDates[`${it.urgency}-${it.week}-${it.title}`] || ''} onChange={(e) => setDue(`${it.urgency}-${it.week}-${it.title}`, e.target.value)} />
                  </div>
                  <div className="space-y-2 mb-3">
                    {it.deliverables.map((d, idx) => {
                      const key = `${u}-${it.week}-${idx}-${d}`;
                      const checked = !!done[key];
                      return (
                        <label key={key} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={checked} onChange={() => toggleDeliverable(key)} />
                          <span className={checked ? 'line-through text-muted-foreground' : ''}>{d}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                  {it.mapping ? (
                    <Button asChild className="btn-primary"><Link href={`/learn/${it.mapping.monthId}/${it.mapping.weekId}`}>Go to Lesson</Link></Button>
                  ) : (
                    <Button asChild variant="outline"><Link href={`/search?query=${encodeURIComponent(it.title)}`}>Find Related</Link></Button>
                  )}
                  {it.rationale && <span className="text-xs text-muted-foreground">{it.rationale}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )))}
    </div>
  );
}
