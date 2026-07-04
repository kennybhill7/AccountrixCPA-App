"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LessonBody } from "@/components/LessonBody";
import { LessonNotes } from "@/components/LessonNotes";
import { QuizComponent } from "@/components/QuizComponent";
import { EmptyState } from "@/components/EmptyState";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import type { Quiz, Flashcard } from "@/lib/types";

interface CpaWeek {
  id: string;
  title: string;
  lessonHtml: string;
  flashcards: Flashcard[];
  quiz: Quiz;
  /** Skill tags — present on ISC/TCP weeks; older sections not yet tagged. */
  skills?: string[];
}
interface CpaUnit {
  id: string;
  section: string;
  title: string;
  weeks: CpaWeek[];
}

export default function CpaWeekPage() {
  const params = useParams();
  const unitId = params.unitId as string;
  const weekId = params.weekId as string;

  const [unit, setUnit] = useState<CpaUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [takingQuiz, setTakingQuiz] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/cpa/curriculum");
        const data = res.ok ? await res.json() : { units: [] };
        const found = (data.units as CpaUnit[]).find((u) => u.id === unitId) ?? null;
        if (!found) setError(`Unit ${unitId} not found`);
        setUnit(found);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    })();
  }, [unitId]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading lesson...</p>
      </div>
    );
  }

  const week = unit?.weeks.find((w) => w.id === weekId) ?? null;

  if (error || !unit || !week) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/cpa">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to CPA lessons
          </Link>
        </Button>
        <EmptyState
          icon={Play}
          title="Lesson Not Found"
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
        track="cpa"
        // Provisional coarse tag for units without week-level skills (FAR/AUD/
        // REG/BAR) until item-level tagging lands; ISC/TCP weeks carry real tags.
        skills={week.skills ?? [`cpa-${unitId}`]}
        itemIdPrefix={`cpa:${unitId}:${weekId}`}
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
      {/* Sticky Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0">
              <Button asChild variant="ghost" size="sm">
                <Link href="/cpa">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  CPA lessons
                </Link>
              </Button>
              <div className="min-w-0">
                <h1 className="font-semibold truncate">{week.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {unit.section} • {unit.id.toUpperCase()} • {week.id.toUpperCase()}
                </p>
              </div>
            </div>
            <Button onClick={() => setTakingQuiz(true)} className="bg-green-600 hover:bg-green-700 shrink-0">
              <Play className="h-4 w-4 mr-2" />
              Start Quiz
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <LessonBody html={week.lessonHtml} monthId={unitId} weekId={weekId} />

          <section className="mt-8 rounded-lg border bg-card p-5">
            <LessonNotes monthId={unitId} weekId={weekId} />
          </section>

          {/* Flashcards */}
          {week.flashcards?.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Flashcards ({week.flashcards.length})</h2>
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

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t gap-4">
            <div className="flex-1">
              {prev && (
                <Button asChild variant="outline">
                  <Link href={`/cpa/${unit.id}/${prev.id}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Link>
                </Button>
              )}
            </div>
            <Button onClick={() => setTakingQuiz(true)} className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              Start Quiz
            </Button>
            <div className="flex-1 flex justify-end">
              {next && (
                <Button asChild variant="outline">
                  <Link href={`/cpa/${unit.id}/${next.id}`}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
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
