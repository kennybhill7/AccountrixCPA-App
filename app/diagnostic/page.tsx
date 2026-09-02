"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/glass/GlassCard";
import { ProgressRing } from "@/components/glass/ProgressRing";
import { useAttempts, useSrs } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";
import type { AttemptTrack } from "@/lib/types";

/**
 * Diagnostic placement - a one-time, cross-track assessment that seeds the
 * Readiness Report and SRS on first run. It reuses existing clean quiz/item
 * banks rather than authoring new questions, records each answer to the shared
 * attempt ledger, and ends with a section breakdown pointing at the full
 * readiness view. No per-question feedback - this measures, it does not teach.
 */

type Item = {
  id: string;
  track: Exclude<AttemptTrack, "apply">;
  section: string;
  sectionLabel: string;
  topic?: string;
  stem: string;
  choices: string[];
  answer: number;
  skills: string[];
  href: string;
};

const PER_SECTION = 2;
const DONE_KEY = "diagnostic-completed";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DiagnosticPage() {
  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Array<number | null>>([]);
  const recordAttempt = useAttempts((s) => s.record);
  const upsertMiss = useSrs((s) => s.upsertMiss);

  async function begin() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/diagnostic/items?perSection=${PER_SECTION}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Could not load diagnostic items.");
      const all = shuffle((data.items ?? []) as Item[]);
      if (all.length === 0) throw new Error("No items available for the diagnostic yet.");
      setItems(all);
      setPicks(new Array(all.length).fill(null));
      setI(0);
      setPhase("run");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the diagnostic.");
    } finally {
      setLoading(false);
    }
  }

  function answer(choice: number) {
    const item = items[i];
    const correct = choice === item.answer;
    const itemId = `diagnostic:${item.id}`;

    recordAttempt({
      source: "quiz",
      track: item.track,
      itemId,
      skills: item.skills,
      correct,
      answer: choice,
    });

    if (!correct) {
      upsertMiss(
        {
          itemId,
          skills: item.skills,
          track: item.track,
          source: "quiz",
          label: `${item.sectionLabel} - ${item.topic || item.id}`,
          href: item.href,
        },
        dayNumber(Date.now())
      );
    }

    const next = [...picks];
    next[i] = choice;
    setPicks(next);

    if (i + 1 >= items.length) {
      try {
        localStorage.setItem(DONE_KEY, new Date().toISOString());
      } catch {}
      setPhase("done");
    } else {
      setI(i + 1);
    }
  }

  const bySection = useMemo(() => {
    if (phase !== "done") return [];
    const map = new Map<string, { correct: number; total: number }>();
    items.forEach((item, idx) => {
      const key = item.sectionLabel;
      const acc = map.get(key) ?? { correct: 0, total: 0 };
      acc.total += 1;
      if (picks[idx] === item.answer) acc.correct += 1;
      map.set(key, acc);
    });
    return Array.from(map.entries()).map(([section, value]) => ({ section, ...value }));
  }, [phase, items, picks]);

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <GlassCard strong className="mx-auto max-w-2xl p-6">
          <div className="mb-3 flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: "hsl(var(--primary) / 0.1)" }}
            >
              <Compass className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Placement Diagnostic
            </h1>
          </div>
          <p className="mb-6 text-muted-foreground">
            A quick cross-track pass across Finance, CMA, and all six CPA sections. There is no
            feedback during the diagnostic - it measures where you stand so your Readiness Report and
            review queue start from real evidence instead of zero. Takes about 15 minutes.
          </p>
          {error && <p className="mb-4 text-destructive">{error}</p>}
          <div className="flex gap-3">
            <Button onClick={begin} disabled={loading}>
              {loading ? "Loading..." : "Start diagnostic"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/readiness">Skip to Readiness</Link>
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (phase === "done") {
    const total = items.length;
    const correct = picks.filter((p, idx) => p === items[idx].answer).length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <GlassCard strong className="p-6">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
            <ProgressRing pct={pct} size={96} stroke={9} />
            <div className="text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold tracking-tight">Diagnostic complete</h1>
              <p className="mt-1 font-display text-3xl font-bold">
                {correct}/{total}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                These answers now feed your Readiness Report, weak-skill routing, and SRS queue.
                Missed items were added to review.
              </p>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-3">
          {bySection.map((s) => (
            <GlassCard key={s.section} className="p-4">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{s.section}</span>
                <span className="text-muted-foreground">
                  {s.correct}/{s.total}
                </span>
              </div>
              <Progress value={(s.correct / s.total) * 100} className="h-2" />
            </GlassCard>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/readiness">See full Readiness Report</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/mission">Build my plan</Link>
          </Button>
        </div>
      </div>
    );
  }

  const item = items[i];
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {i + 1} of {items.length}
          </span>
          <span>{item.sectionLabel}</span>
        </div>
        <Progress value={((i + 1) / items.length) * 100} className="mb-6 h-2" />

        <GlassCard strong className="p-6">
          <h2 className="text-base font-medium leading-relaxed">{item.stem}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick the best answer. No feedback until the end.
          </p>
          <div className="mt-4 space-y-2">
            {item.choices.map((c, idx) => (
              <button
                key={idx}
                onClick={() => answer(idx)}
                className="block w-full rounded-xl border border-border p-3 text-left transition hover:border-primary"
              >
                <span className="mr-2 font-mono text-xs text-muted-foreground">
                  {String.fromCharCode(65 + idx)}
                </span>
                {c}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
