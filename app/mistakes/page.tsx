"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="container mx-auto px-4 py-12">
        <p className="text-muted-foreground">Loading your mistake bank…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-2 flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Mistake Bank</h1>
      </div>
      <p className="mb-6 text-muted-foreground">
        Every miss across CMA, CPA, Finance, and Apply Lab, with why it happened and where to fix
        it. A mistake clears when you answer that item correctly after the miss.
      </p>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open mistakes</CardDescription>
            <CardTitle className="text-3xl">{openCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Due for review now</CardDescription>
            <CardTitle className="text-3xl">{dueCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Top error pattern</CardDescription>
            <CardTitle className="text-lg leading-tight">
              {topCategory ? `${classify(topCategory[0]).label} ×${topCategory[1]}` : "None tagged yet"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {topCategory && (
        <div className="mb-6 rounded-lg border bg-card p-4 text-sm">
          <span className="font-medium">{classify(topCategory[0]).label}: </span>
          <span className="text-muted-foreground">{classify(topCategory[0]).advice}</span>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
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
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
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
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {rows.length === 0
              ? "No mistakes recorded yet. Miss a quiz, practice, drill, or Apply task and it lands here with a route back."
              : "Nothing matches these filters."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.itemId}
              className={`rounded-lg border p-4 ${r.resolved ? "opacity-60" : ""}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{TRACK_LABEL[r.track]}</Badge>
                {r.errorCategory && <Badge variant="secondary">{classify(r.errorCategory).label}</Badge>}
                {r.dueNow && !r.resolved && (
                  <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/15">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
