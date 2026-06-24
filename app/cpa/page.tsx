"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { BookOpen, ArrowRight, GraduationCap } from "lucide-react";

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

export default function CpaLessonsPage() {
  const [units, setUnits] = useState<CpaUnit[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading CPA lessons...</p>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4">
        <EmptyState
          icon={GraduationCap}
          title="CPA lessons not built yet"
          description="Run npm run build:cpa-curriculum to assemble the FAR/AUD units."
        />
      </div>
    );
  }

  const totalWeeks = units.reduce((n, u) => n + u.weeks.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">CPA Core — Full Lessons</h1>
          </div>
          <p className="text-muted-foreground mb-1">
            Discipline-agnostic CPA Core lessons (FAR · AUD), each built on the same construction
            case as the CMA track and cross-referenced to it. {units.length} units · {totalWeeks}{" "}
            lessons.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Looking for exam-style drills instead?{" "}
            <Link href="/crossover" className="text-primary underline">
              CPA crossover practice
            </Link>
            .
          </p>

          <div className="space-y-6">
            {units.map((unit) => (
              <div key={unit.id} className="rounded-lg border bg-card">
                <div className="px-5 py-4 border-b flex items-center gap-3">
                  <span className="inline-flex items-center rounded-md bg-primary/10 text-primary text-xs font-semibold px-2 py-1">
                    {unit.section}
                  </span>
                  <h2 className="font-semibold">{unit.title}</h2>
                </div>
                <ul className="divide-y">
                  {unit.weeks.map((week) => (
                    <li key={week.id}>
                      <Link
                        href={`/cpa/${unit.id}/${week.id}`}
                        className="flex items-center justify-between px-5 py-3 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="truncate">{week.title}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                          <span>{week.quiz?.questions?.length ?? 0} Q</span>
                          <span>{week.flashcards?.length ?? 0} cards</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button asChild variant="outline">
              <Link href="/tracks">
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                All tracks
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
