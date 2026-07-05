"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAttempts, useSrs } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";
import { skillsForCpaItem } from "@/lib/cpaSkillMap";

/**
 * Diagnostic placement — a one-time, cross-section CPA assessment that seeds
 * the Readiness Report and SRS on first run. It reuses the existing clean item
 * bank (2 items per section) rather than authoring new questions, records each
 * answer to the shared attempt ledger exactly like CPA Practice, and ends with
 * a section breakdown pointing at the full readiness view. No per-question
 * feedback — this measures, it does not teach.
 */

type Item = {
  id: string;
  section: string;
  topic?: string;
  blueprintArea?: string;
  stem: string;
  choices: string[];
  answer: number;
};

const SECTIONS = ["FAR", "AUD", "REG", "BAR", "ISC", "TCP"];
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
      const perSection = await Promise.all(
        SECTIONS.map(async (sec) => {
          const res = await fetch(`/api/cpa/items?section=${sec}&n=${PER_SECTION}`);
          const data = await res.json();
          return (data.items ?? []) as Item[];
        })
      );
      const all = shuffle(perSection.flat());
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
    const skills = skillsForCpaItem(item.section, [item.topic, item.blueprintArea].filter(Boolean).join(" "));
    const itemId = `cpa-practice:${item.section}:${item.id}`;

    recordAttempt({ source: "quiz", track: "cpa", itemId, skills, correct, answer: choice });
    if (!correct) {
      upsertMiss(
        {
          itemId,
          skills,
          track: "cpa",
          source: "quiz",
          label: `${item.section} — ${item.topic || item.blueprintArea || item.id}`,
          href: "/crossover",
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
      const acc = map.get(item.section) ?? { correct: 0, total: 0 };
      acc.total += 1;
      if (picks[idx] === item.answer) acc.correct += 1;
      map.set(item.section, acc);
    });
    return SECTIONS.filter((s) => map.has(s)).map((s) => ({ section: s, ...map.get(s)! }));
  }, [phase, items, picks]);

  if (phase === "intro") {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="mb-3 flex items-center gap-3">
          <Compass className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Placement Diagnostic</h1>
        </div>
        <p className="mb-6 text-muted-foreground">
          A quick {SECTIONS.length * PER_SECTION}-question pass across all six CPA sections. There is
          no feedback during the diagnostic — it measures where you stand so your Readiness Report
          and review queue start from real evidence instead of zero. Takes about 10 minutes.
        </p>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <div className="flex gap-3">
          <Button onClick={begin} disabled={loading}>
            {loading ? "Loading…" : "Start diagnostic"}
          </Button>
          <Button asChild variant="outline">
            <Link href="/readiness">Skip to Readiness</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const total = items.length;
    const correct = picks.filter((p, idx) => p === items[idx].answer).length;
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-bold text-primary">Diagnostic complete</h1>
        <p className="mt-3 text-4xl font-bold">
          {correct}/{total}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          These answers now feed your Readiness Report, weak-skill routing, and SRS queue. Missed
          items were added to review.
        </p>
        <div className="mt-6 space-y-2">
          {bySection.map((s) => (
            <div key={s.section} className="rounded-lg border p-3">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{s.section}</span>
                <span className="text-muted-foreground">
                  {s.correct}/{s.total}
                </span>
              </div>
              <Progress value={(s.correct / s.total) * 100} className="h-2" />
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
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
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {i + 1} of {items.length}
        </span>
        <span>{item.section}</span>
      </div>
      <Progress value={((i + 1) / items.length) * 100} className="mb-6 h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium leading-relaxed">{item.stem}</CardTitle>
          <CardDescription>Pick the best answer. No feedback until the end.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {item.choices.map((c, idx) => (
            <button
              key={idx}
              onClick={() => answer(idx)}
              className="block w-full rounded-lg border border-border p-3 text-left transition hover:border-primary"
            >
              <span className="mr-2 font-mono text-xs text-muted-foreground">
                {String.fromCharCode(65 + idx)}
              </span>
              {c}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
