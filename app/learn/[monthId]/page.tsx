"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WeekStepper } from "@/components/WeekStepper";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useQuizResults } from "@/lib/store";
import { EmptyState } from "@/components/EmptyState";
import { GlassCard } from "@/components/glass/GlassCard";
import { UnitCard } from "@/components/glass/UnitCard";
import { LessonRow } from "@/components/glass/LessonRow";
import { ProgressRing } from "@/components/glass/ProgressRing";

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
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading month content...</p>
      </div>
    );
  }

  if (error || !month) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Button asChild variant="ghost">
          <Link href="/learn">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Curriculum
          </Link>
        </Button>
        <GlassCard className="p-8">
          <EmptyState
            icon={BookOpen}
            title="Month Not Found"
            description={error || `Month ${monthId} could not be loaded`}
          />
        </GlassCard>
      </div>
    );
  }

  const allResults = quizResults.getAllResults();
  const completedWeeksForMonth = allResults.filter((q) => q.monthId === monthId);
  const progressPercentage = Math.round((completedWeeksForMonth.length / month.weeks.length) * 100);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link href="/learn">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Curriculum
        </Link>
      </Button>

      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 text-primary" />
              Month {monthId}
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {month.title}
            </h1>
            {month.subtitle && (
              <p className="mt-2 text-muted-foreground">{month.subtitle}</p>
            )}
            <p className="mt-3 text-sm text-text-light">
              {completedWeeksForMonth.length} of {month.weeks.length} weeks completed
            </p>
          </div>
          <div className="shrink-0">
            <ProgressRing pct={progressPercentage} size={88} />
          </div>
        </div>
      </GlassCard>

      <WeekStepper monthId={monthId} weeks={month.weeks} />

      <UnitCard
        code={`M${monthId}`}
        title={`${month.title} — weeks`}
        accentVar="--unit-1"
        done={completedWeeksForMonth.length}
        total={month.weeks.length}
      >
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
            const accentVar = `--unit-${(index % 3) + 1}`;

            return (
              <LessonRow
                key={week.id}
                href={`/learn/${monthId}/${week.id}`}
                title={`Week ${index + 1}: ${week.title}`}
                q={week.quiz?.questions?.length || 0}
                status={isCompleted ? "done" : "todo"}
                accentVar={accentVar}
              />
            );
          }
        )}
      </UnitCard>
    </div>
  );
}
