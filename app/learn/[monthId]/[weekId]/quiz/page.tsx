"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuizComponent } from "@/components/QuizComponent";
import { ArrowLeft, BookOpen } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const monthId = params.monthId as string;
  const weekId = params.weekId as string;

  // Loosely-typed quiz view-model (id/title/quiz/flashcards).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [week, setWeek] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWeek() {
      try {
        setLoading(true);
        const weekRes = await fetch(`/api/curriculum/week/${monthId}/${weekId}`);
        const weekData = weekRes.ok ? await weekRes.json() : null;

        if (!weekData || !weekData.quiz) {
          setError(`Quiz for week ${weekId} not found in month ${monthId}`);
        } else {
          setWeek({
            title: weekData.title,
            quiz: weekData.quiz,
            // Attached by the week API route from the cma-skills sidecar.
            skills: weekData.skills,
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
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !week) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/learn/${monthId}/${weekId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lesson
          </Link>
        </Button>
        <EmptyState
          icon={BookOpen}
          title="Quiz Not Found"
          description={error || `Quiz for week ${weekId} could not be loaded`}
        />
      </div>
    );
  }

  // QuizComponent natively consumes the curriculum question shape
  // ({q, choices, answer, explain}), records to useQuizResults (the store the
  // learn pages read completion from), the attempt ledger, and SRS. QuizEngine
  // expects a different legacy schema and crashed on all curriculum quizzes.
  return (
    <QuizComponent
      quiz={week.quiz}
      monthId={monthId}
      weekId={weekId}
      track="cma"
      skills={week.skills ?? []}
      itemIdPrefix={`cma:${monthId}:${weekId}`}
      onComplete={() => router.push(`/learn/${monthId}/${weekId}`)}
      onExit={() => router.push(`/learn/${monthId}/${weekId}`)}
    />
  );
}
