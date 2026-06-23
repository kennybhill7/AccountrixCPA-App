"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Circle, Lock, Play, Trophy } from "lucide-react";
import { useUserProgress } from "@/lib/store";
import type { CurriculumIndex } from "@/lib/types";

export default function MonthsPage() {
  const [curriculumIndex, setCurriculumIndex] = useState<CurriculumIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { completedQuizzes, isQuizCompleted } = useUserProgress();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const res = await fetch("/api/months");
        if (!res.ok) throw new Error("Failed to load curriculum");
        const data = await res.json();
        if (!data.hasData) {
          setError("No curriculum data found. Please import your content first.");
          return;
        }
        setCurriculumIndex(data.index);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load curriculum");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading curriculum...</p>
        </div>
      </div>
    );
  }

  if (error || !curriculumIndex) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
            <BookOpen className="h-16 w-16 text-error mx-auto mb-6" />
            <h1 className="text-2xl font-heading font-bold text-blue-900 mb-4">
              No Curriculum Found
            </h1>
            <p className="text-slate-600 mb-6">
              {error || "Unable to load curriculum data. Please check your setup."}
            </p>
            <Button asChild className="btn-primary">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getMonthProgress = (monthId: string) => {
    const weekIds = ["w1", "w2", "w3", "w4"];
    const completedWeeks = weekIds.filter((weekId) => isQuizCompleted(monthId, weekId));
    return (completedWeeks.length / weekIds.length) * 100;
  };

  const getMonthStatus = (monthIndex: number) => {
    if (monthIndex === 0) return "available"; // First month always available

    // Check if previous month is completed
    const previousMonth = curriculumIndex.months[monthIndex - 1];
    const previousProgress = getMonthProgress(previousMonth.id);

    if (previousProgress === 100) return "available";
    if (previousProgress > 0) return "in-progress";
    return "locked";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold text-blue-900 mb-2">
              Construction CFO Curriculum
            </h1>
            <p className="text-slate-600">
              Master construction finance through our structured 3-month program
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Overall Progress */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold text-blue-900">Overall Progress</h2>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-warning" />
                <span className="font-heading font-bold text-blue-900">
                  {completedQuizzes.length} / 12 lessons completed
                </span>
              </div>
            </div>
            <Progress value={(completedQuizzes.length / 12) * 100} className="h-3" />
          </div>

          {/* Month Cards */}
          <div className="space-y-6">
            {curriculumIndex.months.map((month, index) => {
              const progress = getMonthProgress(month.id);
              const status = getMonthStatus(index);
              const isLocked = status === "locked";
              const isCompleted = progress === 100;

              return (
                <div
                  key={month.id}
                  className={`card-duolingo transition-all duration-300 ${
                    isLocked ? "opacity-60" : "hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Month Icon/Status */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        isCompleted
                          ? "bg-success text-white"
                          : isLocked
                            ? "bg-gray-200 text-gray-400"
                            : "bg-primary text-white"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-8 w-8" />
                      ) : isLocked ? (
                        <Lock className="h-8 w-8" />
                      ) : (
                        <BookOpen className="h-8 w-8" />
                      )}
                    </div>

                    {/* Month Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-heading font-bold text-blue-900 mb-1">
                        {month.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-3">
                        {month.weeks} weeks • {month.lessons} lessons
                      </p>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-3">
                        <Progress value={progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium text-slate-600">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isLocked ? (
                        <div className="text-center">
                          <Lock className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-400">Complete previous month</p>
                        </div>
                      ) : (
                        <Button
                          asChild
                          size="lg"
                          className={isCompleted ? "btn-secondary" : "btn-primary"}
                        >
                          <Link href={`/months/${month.id}`}>
                            <Play className="h-4 w-4 mr-2" />
                            {isCompleted ? "Review" : progress > 0 ? "Continue" : "Start"}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Week Indicators */}
                  <div className="flex gap-2 mt-4 pl-22">
                    {Array.from({ length: 4 }).map((_, weekIndex) => {
                      const weekId = `w${weekIndex + 1}`;
                      const weekCompleted = isQuizCompleted(month.id, weekId);

                      return (
                        <div
                          key={weekIndex}
                          className={`w-3 h-3 rounded-full ${
                            weekCompleted ? "bg-success" : isLocked ? "bg-gray-200" : "bg-border"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-duolingo text-center">
              <CardContent className="p-6">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-heading font-bold text-blue-900 mb-2">Practice Flashcards</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Review key concepts with spaced repetition
                </p>
                <Button asChild className="btn-secondary">
                  <Link href="/flashcards">Start Practice</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-duolingo text-center">
              <CardContent className="p-6">
                <Trophy className="h-12 w-12 text-warning mx-auto mb-4" />
                <h3 className="font-heading font-bold text-blue-900 mb-2">View Progress</h3>
                <p className="text-slate-600 text-sm mb-4">Track your learning achievements</p>
                <Button asChild className="btn-secondary">
                  <Link href="/progress">View Stats</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
