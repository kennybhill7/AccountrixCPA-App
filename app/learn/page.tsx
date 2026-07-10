"use client";

import { useEffect, useState } from "react";
import type { Curriculum } from "@/lib/types";
import { PathMap } from "@/components/PathMap";
import { BookOpen } from "lucide-react";
import { useAppStore, useQuizResults } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { EmptyState } from "@/components/EmptyState";
import { MascotExcited } from "@/components/Mascot";
import { GlassCard } from "@/components/glass/GlassCard";
import { StatTile } from "@/components/glass/StatTile";
import { PracticeBlock } from "@/components/glass/PracticeBlock";

interface LocalMonth {
  id: string;
  title: string;
  description: string;
  locked: boolean;
  weeks: Week[];
}

interface Week {
  id: string;
  title: string;
  completed: boolean;
  locked: boolean;
  progress: number;
  stars: number;
}

export default function LearnPage() {
  const [months, setMonths] = useState<LocalMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hydrated = useHydratedStore();
  const quizResults = useQuizResults();
  const xp = useAppStore((state) => state.xp);
  const streak = useAppStore((state) => state.streak);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        const response = await fetch('/api/curriculum');
        if (!response.ok) {
          throw new Error('Failed to fetch curriculum');
        }
        const curriculum: Curriculum = await response.json();
        const allResults = quizResults.getAllResults();

        // Transform curriculum data to display format. Built iteratively (not
        // .map) because each month's lock state reads the PREVIOUS month's
        // completed weeks — referencing the array inside its own initializer
        // was a TDZ ReferenceError that crashed the whole hub.
        const displayMonths: LocalMonth[] = [];
        Object.entries(curriculum).forEach(([monthId, monthData]) => {
          // Nothing gated — every month/week is open so all content is testable.
          const monthLocked = false;

          const weeks: Week[] = monthData.weeks.map((week, weekIndex) => {
            const weekResults = quizResults.getResultsForWeek(monthId, week.id);
            const weekCompleted = weekResults.length > 0;

            return {
              id: week.id,
              title: week.title,
              completed: weekCompleted,
              locked: monthLocked && weekIndex === 0,
              progress: weekCompleted ? 100 : 0,
              stars: weekCompleted ? 3 : 0
            };
          });

          displayMonths.push({
            id: monthId,
            title: monthData.title,
            description: monthData.description || `Master the CMA and controller concepts in ${monthData.title}`,
            locked: monthLocked,
            weeks
          });
        });

        setMonths(displayMonths);
      } catch (error) {
        console.error("Failed to load content:", error);
        setError(error instanceof Error ? error.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [quizResults]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading curriculum...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <GlassCard className="p-8">
          <EmptyState
            icon={BookOpen}
            title="Content Loading Error"
            description={error}
          />
        </GlassCard>
      </div>
    );
  }

  if (months.length === 0) {
    return (
      <div className="mx-auto max-w-5xl">
        <GlassCard className="p-8">
          <EmptyState
            icon={BookOpen}
            title="No Content Available"
            description="The curriculum is being prepared. Please check back later."
          />
        </GlassCard>
      </div>
    );
  }

  const totalWeeks = months.reduce((acc, month) => acc + month.weeks.length, 0);
  const allResults = hydrated ? quizResults.getAllResults() : [];
  const completedWeeks = allResults.length;
  const progressPercentage = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;

  const totalStars = hydrated ? allResults.reduce((acc, quiz) => {
    const percentage = (quiz.score / quiz.totalQuestions) * 100;
    return acc + (percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0);
  }, 0) : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header Section */}
      <GlassCard className="p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <MascotExcited />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Your Learning Journey
            </h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              Work through the CMA path with exam-grade lessons, quizzes, flashcards, and applied practice.
              Use Finance and CPA alongside it when you need cross-track depth.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      {hydrated && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Progress" value={`${progressPercentage}%`} />
          <StatTile label="XP" value={String(xp)} accent="hsl(var(--status-done))" />
          <StatTile label="Streak" value={String(streak)} accent="hsl(var(--status-current))" />
          <StatTile label="Stars" value={String(totalStars)} />
        </div>
      )}

      {/* Warm up with problems */}
      <PracticeBlock
        mode="parametric"
        heading="Warm up — work a few problems"
        subheading="Numeric reps before you read. Two minutes here beats re-skimming a chapter."
      />

      {/* Learning Path */}
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
          CMA Controller-to-CFO Path
        </h2>
        <p className="text-muted-foreground">
          Follow the structured learning path below. Each month unlocks as you complete the previous one.
        </p>
      </div>

      <PathMap months={months as any} />
    </div>
  );
}
