"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Note { id: string; createdAt: number; monthId?: string; weekId?: string; path?: string; text: string }

export default function NotesPage() {
  const [q, setQ] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    try {
      const lessonRaw = localStorage.getItem('lesson-notes');
      const smartRaw = localStorage.getItem('smart-notes');
      const lesson: Note[] = lessonRaw ? JSON.parse(lessonRaw) : [];
      const smart: any[] = smartRaw ? JSON.parse(smartRaw) : [];
      const mappedSmart: Note[] = smart.map((n: any) => ({ id: n.id, createdAt: n.createdAt, path: n.path, text: n.text }));
      const all = [...lesson, ...mappedSmart].sort((a, b) => b.createdAt - a.createdAt);
      setNotes(all);
    } catch {}
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return notes;
    const t = q.toLowerCase();
    return notes.filter(n => (n.text || '').toLowerCase().includes(t));
  }, [q, notes]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">My Notes</h1>
          <p className="text-sm text-muted-foreground">Search and review notes captured across lessons and pages.</p>
        </div>
        <div className="w-full max-w-sm">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notes (e.g., bank rec beginning balance)" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground">No notes found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(n => (
            <Card key={n.id}>
              <CardHeader>
                <CardTitle className="text-base">{new Date(n.createdAt).toLocaleString()}</CardTitle>
                <CardDescription>{n.path ? n.path : n.monthId ? `Lesson ${n.monthId}/${n.weekId}` : 'Note'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-wrap">{n.text}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

