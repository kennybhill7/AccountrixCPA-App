"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass/GlassCard";
import { StatTile } from "@/components/glass/StatTile";
import { useAttempts, useSrs } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { dayNumber } from "@/lib/spacedRepetition";
import { classify, ERROR_CATEGORIES, type ErrorCategory } from "@/lib/errorClassify";
import type { AttemptEvent, AttemptTrack } from "@/lib/types";

/**
 * Mistake Bank — every miss across CMA, CPA, Finance, and Apply in one place.
 *
 * Folds the attempt ledger's wrong answers into per-item rows (miss count,
 * last miss, error category, resolved-or-not) and joins the SRS queue for
 * labels/routes/due status. This is the review surface the market-readiness
 * audit called for: not just "you got it wrong" but why, and what to do next.
 */

const TRACK_FILTERS: Array<{ key: AttemptTrack | "all"; label: string }> = [
  { key: "all", label: "All tracks" },
  { key: "cma", label: "CMA" },
  { key: "cpa", label: "CPA" },
  { key: "finance", label: "Finance" },
  { key: "apply", label: "Apply Lab" },
];

const TRACK_LABEL: Record<AttemptTrack, string> = {
  cma: "CMA",
  cpa: "CPA",
  finance: "Finance",
  apply: "Apply",
};

interface MistakeRow {
  itemId: string;
  track: AttemptTrack;
  skills: string[];
  missCount: number;
  lastMissTs: number;
  /** correct answer recorded after the last miss → treated as resolved */
  resolved: boolean;
  errorCategory?: ErrorCategory;
  label: string;
  href: string;
  dueNow: boolean;
  inQueue: boolean;
}

function foldMistakes(
  events: AttemptEvent[],
  srsItems: Record<string, { label: string; href: string; dueDay: number }>,
  nowDay: number
): MistakeRow[] {
  const byItem = new Map<
    string,
    { misses: AttemptEvent[]; lastCorrectTs: number }
  >();

  for (const ev of events) {
    let acc = byItem.get(ev.itemId);
    if (!acc) {
      acc = { misses: [], lastCorrectTs: 0 };
      byItem.set(ev.itemId, acc);
    }
    if (ev.correct) {
      if (ev.ts > acc.lastCorrectTs) acc.lastCorrectTs = ev.ts;
    } else {
      acc.misses.push(ev);
    }
  }

  const rows: MistakeRow[] = [];
  for (const [itemId, acc] of byItem) {
    if (acc.misses.length === 0) continue;
    const lastMiss = acc.misses.reduce((a, b) => (a.ts > b.ts ? a : b));
    const categorized = [...acc.misses].reverse().find((m) => m.errorCategory);
    const srs = srsItems[itemId];
    rows.push({
      itemId,
      track: lastMiss.track,
      skills: lastMiss.skills,
      missCount: acc.misses.length,
      lastMissTs: lastMiss.ts,
      resolved: acc.lastCorrectTs > lastMiss.ts,
      errorCategory: categorized?.errorCategory,
      label: srs?.label ?? itemId,
      href: srs?.href ?? "",
      dueNow: srs ? srs.dueDay <= nowDay : false,
      inQueue: Boolean(srs),
    });
  }

  return rows.sort((a, b) => Number(a.resolved) - Number(b.resolved) || b.lastMissTs - a.lastMissTs);
}

export default function MistakeBankPage() {
  const hydrated = useHydratedStore();
  const events = useAttempts((s) => s.events);
  const srsItems = useSrs((s) => s.items);
  const [trackFilter, setTrackFilter] = useState<AttemptTrack | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ErrorCategory | "all">("all");
  const [showResolved, setShowResolved] = useState(false);

  const nowDay = dayNumber(Date.now());

  const rows = useMemo(
    () => (hydrated ? foldMistakes(events, srsItems, nowDay) : []),
    [hydrated, events, srsItems, nowDay]
  );

  const filtered = rows.filter(
    (r) =>
      (trackFilter === "all" || r.track === trackFilter) &&
      (categoryFilter === "all" || r.errorCategory === categoryFilter) &&
      (showResolved || !r.resolved)
  );

  const openCount = rows.filter((r) => !r.resolved).length;
  const dueCount = rows.filter((r) => r.dueNow && !r.resolved).length;
  const categoryTally = new Map<ErrorCategory, number>();
  for (const r of rows) {
    if (r.errorCategory && !r.resolved) {
      categoryTally.set(r.errorCategory, (categoryTally.get(r.errorCategory) ?? 0) + 1);
    }
  }
  const topCategory = [...categoryTally.entries()].sort((a, b) => b[1] - a[1])[0];

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <p className="py-12 text-muted-foreground">Loading your mistake bank…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "hsl(var(--primary) / 0.1)" }}
        >
          <AlertTriangle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Mistake Bank</h1>
          <p className="mt-1 text-muted-foreground">
            Every miss across CMA, CPA, Finance, and Apply Lab, with why it happened and where to fix
            it. A mistake clears when you answer that item correctly after the miss.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile label="Open mistakes" value={String(openCount)} />
        <StatTile
          label="Due for review now"
          value={String(dueCount)}
          accent="hsl(var(--status-streak))"
        />
        <StatTile
          label="Top error pattern"
          value={topCategory ? `${classify(topCategory[0]).label} ×${topCategory[1]}` : "None tagged yet"}
        />
      </div>

      {topCategory && (
        <GlassCard className="p-4 text-sm">
          <span className="font-medium">{classify(topCategory[0]).label}: </span>
          <span className="text-muted-foreground">{classify(topCategory[0]).advice}</span>
        </GlassCard>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {TRACK_FILTERS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTrackFilter(t.key)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              trackFilter === t.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
        <span className="mx-1 text-muted-foreground">·</span>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ErrorCategory | "all")}
          className="glass rounded-lg px-2 py-1 text-sm"
        >
          <option value="all">All error types</option>
          {ERROR_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {classify(c).label}
            </option>
          ))}
        </select>
        <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
          />
          Show cleared
        </label>
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="p-10 text-center text-muted-foreground">
          {rows.length === 0
            ? "No mistakes recorded yet. Miss a quiz, practice, drill, or Apply task and it lands here with a route back."
            : "Nothing matches these filters."}
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <GlassCard key={r.itemId} className={`p-4 ${r.resolved ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{TRACK_LABEL[r.track]}</Badge>
                {r.errorCategory && <Badge variant="secondary">{classify(r.errorCategory).label}</Badge>}
                {r.dueNow && !r.resolved && (
                  <Badge
                    className="text-status-streak hover:bg-transparent"
                    style={{ background: "hsl(var(--status-streak) / 0.14)" }}
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    Due now
                  </Badge>
                )}
                {r.resolved && <Badge variant="outline">Cleared</Badge>}
                <span className="ml-auto text-xs text-muted-foreground">
                  Missed ×{r.missCount} · last {new Date(r.lastMissTs).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{r.label}</p>
              {r.skills.length > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">{r.skills.join(" · ")}</p>
              )}
              {r.href && (
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link href={r.href}>
                    Review at source
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
