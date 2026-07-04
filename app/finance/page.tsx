"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { GradeTargetCard } from "@/components/GradeTargetCard";
import { ParametricDrill } from "@/components/ParametricDrill";

interface FinanceWeek {
  id: string;
  title: string;
  quiz?: { questions?: unknown[] };
  flashcards?: unknown[];
}

interface FinanceUnit {
  id: string;
  unit: number;
  title: string;
  weeks: FinanceWeek[];
}

export default function FinanceLessonsPage() {
  const [units, setUnits] = useState<FinanceUnit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/finance/curriculum");
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
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        <p className="text-muted-foreground">Loading Finance lessons...</p>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={Calculator}
          title="Finance lessons not built yet"
          description="Run npm run build:finance-curriculum to assemble the corporate-finance units."
        />
      </div>
    );
  }

  const totalWeeks = units.reduce((n, u) => n + u.weeks.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-2 flex items-center gap-3">
            <Calculator className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">Finance Lessons</h1>
          </div>
          <p className="mb-1 text-muted-foreground">
            Corporate-finance track: statements, TVM, bonds, stocks, CAPM, WACC,
            capital budgeting, project cash flows, pro formas, working capital, and planning.
            {` ${units.length} units · ${totalWeeks} lessons.`}
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            Built for class readiness and future CFO finance judgment. For controller workpapers, use{" "}
            <Link href="/apply" className="text-primary underline">
              Apply Lab
            </Link>
            .
          </p>

          <div className="mb-8">
            <GradeTargetCard />
          </div>

          <div className="space-y-6">
            {units.map((unit) => (
              <div key={unit.id} className="rounded-lg border bg-card">
                <div className="flex items-center gap-3 border-b px-5 py-4">
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                    FIN {unit.unit}
                  </span>
                  <h2 className="font-semibold">{unit.title}</h2>
                </div>
                <ul className="divide-y">
                  {unit.weeks.map((week) => (
                    <li key={week.id}>
                      <Link
                        href={`/finance/${unit.id}/${week.id}`}
                        className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate">{week.title}</span>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
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
            <h2 className="mb-1 text-xl font-semibold">Drill generator</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Self-verifying numeric variations across all finance generators. Every submission
              lands in the attempt ledger.
            </p>
            <ParametricDrill />
          </div>

          <div className="mt-10">
            <Button asChild variant="outline">
              <Link href="/tracks">
                <GraduationCap className="mr-2 h-4 w-4" />
                All tracks
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
