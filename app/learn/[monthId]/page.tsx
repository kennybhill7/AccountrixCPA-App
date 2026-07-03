"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WeekStepper } from "@/components/WeekStepper";
import { ArrowLeft, BookOpen, Play } from "lucide-react";
import { useQuizResults } from "@/lib/store";
import { EmptyState } from "@/components/EmptyState";

export default function MonthPage() {
  const params = useParams();
  const monthId = params.monthId as string;

  // Loosely-typed month view-model (includes view-only fields like subtitle).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [month, setMonth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quizResults = useQuizResults();

  useEffect(() => {
    async function loadMonth() {
      try {
        setLoading(true);
        const monthRes = await fetch(`/api/curriculum/month/${monthId}`);
        const monthData = monthRes.ok ? await monthRes.json() : null;
        if (!monthData || monthData.weeks.length === 0) {
          setError(`Month ${monthId} not found or has no content`);
        } else {
          setMonth({
            id: monthId,
            title: monthData.title,
            subtitle: monthData.description || `Master essential skills for ${monthData.title}`,
            weeks: monthData.weeks,
          });
        }
      } catch (error) {
        console.error("Failed to load month:", error);
        setError(error instanceof Error ? error.message : "Failed to load month");
      } finally {
        setLoading(false);
      }
    }

    if (monthId) {
      loadMonth();
    }
  }, [monthId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading month content...</p>
        </div>
      </div>
    );
  }

  if (error || !month) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/learn">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Curriculum
          </Link>
        </Button>
        <EmptyState
          icon={BookOpen}
          title="Month Not Found"
          description={error || `Month ${monthId} could not be loaded`}
        />
      </div>
    );
  }

  const allResults = quizResults.getAllResults();
  const completedWeeksForMonth = allResults.filter((q) => q.monthId === monthId);
  const progressPercentage = Math.round((completedWeeksForMonth.length / month.weeks.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="ghost">
              <Link href="/learn">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Curriculum
              </Link>
            </Button>
          </div>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/20 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">Month {monthId}</div>
            </div>

            <h1 className="text-4xl font-bold mb-4">{month.title}</h1>
            {month.subtitle && (
              <p className="text-lg text-muted-foreground mb-6">{month.subtitle}</p>
            )}

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Progress:</span>
                <div className="w-32">
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                <span className="text-sm font-medium">{progressPercentage}%</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {completedWeeksForMonth.length} of {month.weeks.length} weeks completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <WeekStepper monthId={monthId} weeks={month.weeks} />

          <div className="grid gap-6 mt-8">
            {month.weeks.map(
              (
                week: {
                  id: string;
                  title: string;
                  lessonHtml?: string;
                  quiz?: { questions?: unknown[] };
                },
                index: number
              ) => {
                const weekResults = quizResults.getResultsForWeek(monthId, week.id);
                const isCompleted = weekResults.length > 0;
                const quizResult =
                  weekResults.length > 0 ? weekResults[weekResults.length - 1] : null;

                return (
                  <Card
                    key={week.id}
                    className={
                      isCompleted
                        ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                        : ""
                    }
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm font-medium">
                              Week {index + 1}
                            </span>
                            {isCompleted && (
                              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-sm font-medium">
                                Completed
                              </span>
                            )}
                          </div>
                          <CardTitle className="text-xl">{week.title}</CardTitle>
                          {quizResult && (
                            <CardDescription className="mt-2">
                              Quiz Score: {quizResult.score}/{quizResult.totalQuestions} (
                              {Math.round((quizResult.score / quizResult.totalQuestions) * 100)}%)
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button asChild>
                            <Link href={`/learn/${monthId}/${week.id}`}>
                              <Play className="h-4 w-4 mr-2" />
                              {isCompleted ? "Review" : "Start"}
                            </Link>
                          </Button>
                          {isCompleted && (
                            <Button asChild variant="outline">
                              <Link href={`/learn/${monthId}/${week.id}/quiz`}>Retake Quiz</Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="text-sm text-muted-foreground mb-3">
                        Quiz: {week.quiz?.questions?.length || 0} questions
                      </div>

                      {week.lessonHtml && (
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {week.lessonHtml
                            .replace(/<[^>]*>/g, "")
                            .replace(/[#*]/g, "")
                            .substring(0, 150)}
                          ...
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
