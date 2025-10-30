"use client";

import { useEffect, useState } from "react";
import type { Curriculum } from "@/lib/types";
import { PathMap } from "@/components/PathMap";
import { StatPills } from "@/components/StatPills";
import { BookOpen, Target, Users, Star, Trophy, Zap } from "lucide-react";
import { useAppStore, useQuizResults } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { EmptyState } from "@/components/EmptyState";
import { MascotExcited } from "@/components/Mascot";

interface LocalMonth {
  id: string;
  title: string;
  description: string;
  locked: boolean;
  weeks: Week[];
}

interface Week {
  id: number;
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

        // Transform curriculum data to display format
        const displayMonths: LocalMonth[] = Object.entries(curriculum).map(([monthId, monthData], index) => {
          const weeks: Week[] = monthData.weeks.map((week, weekIndex) => {
            const weekResults = quizResults.getResultsForWeek(monthId, week.id);
            const weekCompleted = weekResults.length > 0;

            return {
              id: weekIndex + 1,
              title: week.title,
              completed: weekCompleted,
              locked: index > 0 && weekIndex === 0 && !displayMonths[index - 1]?.weeks.some(w => w.completed),
              progress: weekCompleted ? 100 : 0,
              stars: weekCompleted ? 3 : 0
            };
          });

          return {
            id: monthId,
            title: monthData.title,
            description: monthData.description || `Master essential construction CFO concepts in ${monthData.title}`,
            locked: index > 0 && !displayMonths[index - 1]?.weeks.some(w => w.completed),
            weeks
          };
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
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading curriculum...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <EmptyState 
          icon={BookOpen}
          title="Content Loading Error"
          description={error}
        />
      </div>
    );
  }

  if (months.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <EmptyState 
          icon={BookOpen}
          title="No Content Available"
          description="The curriculum is being prepared. Please check back later."
        />
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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-surface-blue via-surface-indigo to-surface-blue py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <MascotExcited className="mr-4" />
              <h1 className="text-5xl font-heading font-bold text-text">
                Your Learning Journey
              </h1>
            </div>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Master construction financial management through our gamified 12-month program. 
              Complete lessons, earn XP, and unlock new challenges on your path to CFO expertise.
            </p>
          </div>

          {/* Stats */}
          {hydrated && (
            <div className="max-w-4xl mx-auto">
              <StatPills
                stats={[
                  { icon: Trophy, label: "Progress", value: `${progressPercentage}%`, variant: "primary" },
                  { icon: Star, label: "XP", value: xp, variant: "success" },
                  { icon: Zap, label: "Streak", value: streak, variant: "warning" },
                  { icon: Target, label: "Stars", value: totalStars, variant: "default" },
                ]}
                className="justify-center"
              />
            </div>
          )}
        </div>
      </div>

      {/* Learning Path */}
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-text mb-4">
              Construction CFO Mastery Path
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Follow the structured learning path below. Each month unlocks as you complete the previous one.
            </p>
          </div>
          
          <PathMap months={months as any} />
        </div>
      </div>
    </div>
  );
}