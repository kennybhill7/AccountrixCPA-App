"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { useCpaProgress } from "@/lib/store";

interface CpaWeek {
  id: string;
  title: string;
  quiz?: { questions?: unknown[] };
  flashcards?: unknown[];
}
interface CpaUnit {
  id: string;
  section: string;
  unit: number;
  title: string;
  weeks: CpaWeek[];
}

const SECTION_ORDER = ["FAR", "AUD", "REG", "BAR", "ISC", "TCP"];

export default function CpaLessonsPage() {
  const [units, setUnits] = useState<CpaUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const completed = useCpaProgress((s) => s.completedQuizzes);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/cpa/curriculum");
        const data = res.ok ? await res.json() : { units: [] };
        setUnits(Array.isArray(data.units) ? data.units : []);
      } catch {
        setUnits([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, CpaUnit[]>();
    for (const unit of units) {
      const arr = map.get(unit.section) ?? [];
      arr.push(unit);
      map.set(unit.section, arr);
    }
    return SECTION_ORDER.filter((section) => map.has(section)).map((section) => ({
      section,
      units: (map.get(section) ?? []).sort((a, b) => a.unit - b.unit),
    }));
  }, [units]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        <p className="text-muted-foreground">Loading CPA lessons...</p>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={GraduationCap}
          title="CPA lessons not built yet"
          description="Run npm run build:cpa-curriculum to assemble the CPA units."
        />
      </div>
    );
  }

  const totalWeeks = units.reduce((n, u) => n + u.weeks.length, 0);
  const totalQuestions = units.reduce(
    (n, u) => n + u.weeks.reduce((m, w) => m + (w.quiz?.questions?.length ?? 0), 0),
    0
  );
  const totalCards = units.reduce(
    (n, u) => n + u.weeks.reduce((m, w) => m + (w.flashcards?.length ?? 0), 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2 flex items-center gap-3">
            <GraduationCap className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">CPA Lessons — Core + Disciplines</h1>
          </div>
          <p className="mb-4 text-muted-foreground">
            Full CPA Evolution coverage across FAR, AUD, REG, BAR, ISC, and TCP. {units.length}{" "}
            units · {totalWeeks} lessons · {totalQuestions} lesson questions · {totalCards}{" "}
            flashcards.
          </p>

          <div className="mb-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/crossover">
                <ListChecks className="mr-2 h-4 w-4" />
                CPA Practice
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sims">Task-Based Simulations</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/mission">Back to Mission Control</Link>
            </Button>
          </div>

          <div className="space-y-8">
            {grouped.map(({ section, units: sectionUnits }) => {
              const sectionWeeks = sectionUnits.flatMap((u) =>
                u.weeks.map((w) => ({ unit: u, week: w }))
              );
              const sectionCompleted = sectionWeeks.filter(({ unit, week }) =>
                completed.includes(`${unit.id}:${week.id}`)
              ).length;
              const pct =
                sectionWeeks.length > 0 ? Math.round((sectionCompleted / sectionWeeks.length) * 100) : 0;

              return (
                <section key={section} className="rounded-lg border bg-card">
                  <div className="border-b px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                          {section}
                        </span>
                        <h2 className="font-semibold">{section} lessons</h2>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {sectionCompleted}/{sectionWeeks.length} complete · {pct}%
                      </div>
                    </div>
                  </div>

                  <div className="divide-y">
                    {sectionUnits.map((unit) => (
                      <div key={unit.id}>
                        <div className="bg-muted/40 px-5 py-3 text-sm font-medium">{unit.title}</div>
                        <ul className="divide-y">
                          {unit.weeks.map((week) => {
                            const done = completed.includes(`${unit.id}:${week.id}`);
                            return (
                              <li key={week.id}>
                                <Link
                                  href={`/cpa/${unit.id}/${week.id}`}
                                  className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-accent/50"
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <span className="truncate">{week.title}</span>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                                    {done ? <span className="text-green-600">Done</span> : null}
                                    <span>{week.quiz?.questions?.length ?? 0} Q</span>
                                    <span>{week.flashcards?.length ?? 0} cards</span>
                                    <ArrowRight className="h-4 w-4" />
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-10">
            <Button asChild variant="outline">
              <Link href="/tracks">
                <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                All tracks
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
