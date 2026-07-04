"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calculator, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { LessonBody } from "@/components/LessonBody";
import { LessonNotes } from "@/components/LessonNotes";
import { QuizComponent } from "@/components/QuizComponent";
import { CalculatorDrawer } from "@/components/CalculatorDrawer";
import { ParametricDrill } from "@/components/ParametricDrill";
import type { Flashcard, Quiz } from "@/lib/types";

interface FinanceWeek {
  id: string;
  title: string;
  lessonHtml: string;
  flashcards: Flashcard[];
  quiz: Quiz;
  /** Skill tags — authored on all Finance weeks. */
  skills?: string[];
}

interface FinanceUnit {
  id: string;
  title: string;
  weeks: FinanceWeek[];
}

export default function FinanceWeekPage() {
  const params = useParams();
  const unitId = params.unitId as string;
  const weekId = params.weekId as string;

  const [unit, setUnit] = useState<FinanceUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [takingQuiz, setTakingQuiz] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/finance/curriculum");
        const data = res.ok ? await res.json() : { units: [] };
        const found = (data.units as FinanceUnit[]).find((u) => u.id === unitId) ?? null;
        if (!found) setError(`Finance unit ${unitId} not found`);
        setUnit(found);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load Finance lesson");
      } finally {
        setLoading(false);
      }
    })();
  }, [unitId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        <p className="text-muted-foreground">Loading Finance lesson...</p>
      </div>
    );
  }

  const week = unit?.weeks.find((w) => w.id === weekId) ?? null;

  if (error || !unit || !week) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/finance">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Finance lessons
          </Link>
        </Button>
        <EmptyState
          icon={Calculator}
          title="Finance Lesson Not Found"
          description={error || `Week ${weekId} could not be loaded`}
        />
      </div>
    );
  }

  if (takingQuiz) {
    return (
      <QuizComponent
        quiz={week.quiz}
        monthId={unitId}
        weekId={weekId}
        track="finance"
        // Provisional coarse fallback until item-level tagging; finance weeks
        // are expected to carry real week-level skills.
        skills={week.skills ?? [`fin-${unitId}`]}
        itemIdPrefix={`finance:${unitId}:${weekId}`}
        onComplete={() => setTakingQuiz(false)}
        onExit={() => setTakingQuiz(false)}
      />
    );
  }

  const idx = unit.weeks.findIndex((w) => w.id === weekId);
  const prev = idx > 0 ? unit.weeks[idx - 1] : null;
  const next = idx >= 0 && idx < unit.weeks.length - 1 ? unit.weeks[idx + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/finance">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Finance lessons
                </Link>
              </Button>
              <div className="min-w-0">
                <h1 className="truncate font-semibold">{week.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {unit.id.toUpperCase()} · {week.id.toUpperCase()}
                </p>
              </div>
            </div>
            <Button onClick={() => setTakingQuiz(true)} className="shrink-0 bg-green-600 hover:bg-green-700">
              <Play className="mr-2 h-4 w-4" />
              Start Quiz
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <LessonBody html={week.lessonHtml} monthId={unitId} weekId={weekId} />

          <section className="mt-8 rounded-lg border bg-card p-5">
            <LessonNotes monthId={unitId} weekId={weekId} />
          </section>

          <div className="mt-8">
            <CalculatorDrawer skills={week.skills ?? []} />
          </div>

          <div className="mt-10">
            <h2 className="mb-1 text-xl font-semibold">Drill generator</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Numeric variations matched to this week&apos;s skills — new numbers every time.
            </p>
            <ParametricDrill skills={week.skills} />
          </div>

          {week.flashcards?.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-semibold">Flashcards ({week.flashcards.length})</h2>
              <div className="space-y-2">
                {week.flashcards.map((card, i) => (
                  <details key={i} className="rounded-lg border bg-card px-4 py-3">
                    <summary className="cursor-pointer font-medium">{card.front}</summary>
                    <p className="mt-2 text-muted-foreground">{card.back}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between gap-4 border-t pt-8">
            <div className="flex-1">
              {prev && (
                <Button asChild variant="outline">
                  <Link href={`/finance/${unit.id}/${prev.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Link>
                </Button>
              )}
            </div>
            <Button onClick={() => setTakingQuiz(true)} className="bg-green-600 hover:bg-green-700">
              <Play className="mr-2 h-4 w-4" />
              Start Quiz
            </Button>
            <div className="flex flex-1 justify-end">
              {next && (
                <Button asChild variant="outline">
                  <Link href={`/finance/${unit.id}/${next.id}`}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
