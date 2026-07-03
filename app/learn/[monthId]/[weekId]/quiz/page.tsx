"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuizEngine } from "@/components/QuizEngine";
import { ArrowLeft, BookOpen } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function QuizPage() {
  const params = useParams();
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link href={`/learn/${monthId}/${weekId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lesson
              </Link>
            </Button>

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">{week.quiz.title}</h1>
              <p className="text-muted-foreground">
                {week.quiz.questions.length} questions • Month {monthId} • {week.title}
              </p>
            </div>
          </div>

          {/* Quiz Engine */}
          <QuizEngine monthId={monthId} weekId={weekId} questions={week.quiz.questions} />
        </div>
      </div>
    </div>
  );
}
