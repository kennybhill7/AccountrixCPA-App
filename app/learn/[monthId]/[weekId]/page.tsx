"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LessonBody } from "@/components/LessonBody";
import { LessonNotes } from "@/components/LessonNotes";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useQuizResults } from "@/lib/store";
import { EmptyState } from "@/components/EmptyState";

// Weeks that have an associated interactive practice tool. Keyed by `${monthId}:${weekId}`.
const WEEK_TOOLS: Record<string, { href: string; label: string; description: string }> = {
  "m4:w1": {
    href: "/tools/cost-codes",
    label: "Open the live Cost-Code → WIP simulator",
    description: "Post a job cost and watch it roll up to a WIP control account (1401–1405).",
  },
};

export default function WeekPage() {
  const params = useParams();
  const monthId = params.monthId as string;
  const weekId = params.weekId as string;

  // Loosely-typed lesson view-model (id/title/html/content/quiz/flashcards).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [week, setWeek] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quizResults = useQuizResults();
  const results = quizResults.getResultsForWeek(monthId, weekId);
  const quizResult = results.length > 0 ? results[results.length - 1] : null;

  useEffect(() => {
    async function loadWeek() {
      try {
        setLoading(true);
        const weekRes = await fetch(`/api/curriculum/week/${monthId}/${weekId}`);
        const weekData = weekRes.ok ? await weekRes.json() : null;

        if (!weekData || !weekData.lessonHtml) {
          setError(`Week ${weekId} not found in month ${monthId}`);
        } else {
          setWeek({
            id: weekId,
            title: weekData.title,
            html: weekData.lessonHtml,
            content: weekData.lessonHtml,
            quiz: weekData.quiz,
            flashcards: weekData.flashcards,
          });
        }
      } catch (error) {
        console.error("Failed to load week:", error);
        setError(error instanceof Error ? error.message : "Failed to load week");
      } finally {
        setLoading(false);
      }
    }

    if (monthId && weekId) {
      loadWeek();
    }
  }, [monthId, weekId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !week) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/learn/${monthId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Month
          </Link>
        </Button>
        <EmptyState
          icon={Play}
          title="Week Not Found"
          description={error || `Week ${weekId} could not be loaded`}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/learn/${monthId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Month
                </Link>
              </Button>
              <div>
                <h1 className="font-semibold">{week.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Month {monthId} • {week.id.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <BookmarkButton monthId={monthId} weekId={weekId} anchor="top" title={week.title} />
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href={`/learn/${monthId}/${weekId}/quiz`}>
                  <Play className="h-4 w-4 mr-2" />
                  {quizResult ? "Retake Quiz" : "Start Quiz"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Result Banner */}
          {quizResult && (
            <div className="mb-8 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-green-900 dark:text-green-100">
                    Quiz Completed!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Score: {quizResult.score}/{quizResult.totalQuestions} (
                    {Math.round((quizResult.score / quizResult.totalQuestions) * 100)}%)
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/learn/${monthId}/${weekId}/quiz`}>Review Quiz</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Lesson Content */}
          <LessonBody html={week.html} monthId={monthId} weekId={weekId} />

          <section className="mt-8 rounded-lg border bg-card p-5">
            <LessonNotes monthId={monthId} weekId={weekId} />
          </section>

          {/* Interactive practice tool (e.g. m4-w1 → cost-code simulator) */}
          {WEEK_TOOLS[`${monthId}:${weekId}`] && (
            <div className="mt-8 p-4 rounded-lg border border-border dark:border-border bg-accent dark:bg-accent/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium text-foreground dark:text-foreground">
                    {WEEK_TOOLS[`${monthId}:${weekId}`].label}
                  </h3>
                  <p className="text-sm text-primary dark:text-primary">
                    {WEEK_TOOLS[`${monthId}:${weekId}`].description}
                  </p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary-hover shrink-0">
                  <Link href={WEEK_TOOLS[`${monthId}:${weekId}`].href}>
                    <Play className="h-4 w-4 mr-2" />
                    Launch
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t">
            <div className="flex-1">{/* Previous week navigation could go here */}</div>

            <div className="flex space-x-4">
              <Button asChild variant="outline">
                <Link href={`/learn/${monthId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Month
                </Link>
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href={`/learn/${monthId}/${weekId}/quiz`}>
                  <Play className="h-4 w-4 mr-2" />
                  {quizResult ? "Retake Quiz" : "Start Quiz"}
                </Link>
              </Button>
            </div>

            <div className="flex-1 flex justify-end">
              {/* Next week navigation could go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
