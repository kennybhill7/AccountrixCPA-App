"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  useAppStore,
  useQuizResults,
  useCpaProgress,
  useFinanceProgress,
  heartsWithRefill,
  msUntilNextHeart,
} from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Star, Flame, Heart, BookOpen, Bookmark, Calendar, Trophy, Target, GraduationCap, Calculator } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { SrsReviewCard } from "@/components/SrsReviewCard";

export default function ProfilePage() {
  const hydrated = useHydratedStore();

  const xp = useAppStore((state) => state.xp);
  const rawHearts = useAppStore((state) => state.hearts);
  const lastHeartLossAt = useAppStore((state) => state.lastHeartLossAt);
  const streak = useAppStore((state) => state.streak);

  // Time-based refill applied for display (1 heart per 30 min up to 5).
  const heartState = { hearts: rawHearts, lastHeartLossAt };
  const hearts = heartsWithRefill(heartState, Date.now());
  const nextHeartMs = msUntilNextHeart(heartState, Date.now());
  const nextHeartMin = nextHeartMs != null ? Math.max(1, Math.ceil(nextHeartMs / 60_000)) : null;
  const lastVisit = useAppStore((state) => state.lastVisit);
  const getBookmarks = useAppStore((state) => state.getBookmarks);
  const updateStreak = useAppStore((state) => state.updateStreak);
  const quizResults = useQuizResults();

  const bookmarks = hydrated ? getBookmarks() : [];
  const completedQuizzes = hydrated ? quizResults.getAllResults() : [];

  // CPA progress is tracked in a SEPARATE store (track isolation). Surface it as
  // its own section so it never mixes into the CMA stats above.
  const cpaResultsRaw = useCpaProgress((s) => s.results);
  const cpaResults = hydrated ? cpaResultsRaw : [];

  // Finance progress is tracked in a separate store as well. It shares global
  // XP, but it never mixes into CMA or CPA quiz-result lists.
  const financeResultsRaw = useFinanceProgress((s) => s.results);
  const financeResults = hydrated ? financeResultsRaw : [];

  useEffect(() => {
    if (hydrated) {
      updateStreak();
    }
  }, [updateStreak, hydrated]);

  if (!hydrated) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const totalQuestions = completedQuizzes.reduce((acc, quiz) => acc + quiz.totalQuestions, 0);
  const totalCorrect = completedQuizzes.reduce((acc, quiz) => acc + quiz.score, 0);
  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const getStreakStatus = () => {
    if (!lastVisit) return "broken";
    const now = Date.now();
    const lastVisitTime = lastVisit instanceof Date ? lastVisit.getTime() : new Date(lastVisit).getTime();
    const daysSinceLastVisit = Math.floor((now - lastVisitTime) / (24 * 60 * 60 * 1000));

    if (daysSinceLastVisit === 0) return "active";
    if (daysSinceLastVisit === 1) return "at-risk";
    return "broken";
  };

  const streakStatus = getStreakStatus();

  const getXPLevel = (xp: number) => {
    if (xp < 100) return { level: 1, name: "Apprentice", next: 100 };
    if (xp < 250) return { level: 2, name: "Learner", next: 250 };
    if (xp < 500) return { level: 3, name: "Scholar", next: 500 };
    if (xp < 1000) return { level: 4, name: "Expert", next: 1000 };
    if (xp < 2000) return { level: 5, name: "Master", next: 2000 };
    return { level: 6, name: "CFO Ready", next: 2000 };
  };

  const level = getXPLevel(xp);
  const progressToNext = level.level < 6 ? ((xp % level.next) / level.next) * 100 : 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/20 p-4 rounded-full">
                <User className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Learning Profile</h1>
            <p className="text-lg text-muted-foreground">
              Track your progress on the path to Construction CFO mastery
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Experience Points</CardTitle>
                <Star className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{xp}</div>
                <p className="text-xs text-muted-foreground">
                  Level {level.level}: {level.name}
                </p>
                {level.level < 6 && (
                  <Progress value={progressToNext} className="mt-2 h-1" />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Day Streak</CardTitle>
                <Flame className={`h-4 w-4 ${streakStatus === 'active' ? 'text-orange-500' : 'text-gray-400'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${streakStatus === 'active' ? 'text-orange-500' : 'text-gray-400'}`}>
                  {streak}
                </div>
                <p className="text-xs text-muted-foreground">
                  {streakStatus === 'active' && "Keep it up!"}
                  {streakStatus === 'at-risk' && "Study today to keep your streak!"}
                  {streakStatus === 'broken' && "Start a new streak by studying today"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hearts</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Heart
                      key={i}
                      className={`h-5 w-5 ${
                        i < hearts
                          ? "text-red-500 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {hearts === 5
                    ? "Full hearts!"
                    : `${hearts}/5 hearts${nextHeartMin != null ? ` â€” next heart in ${nextHeartMin}m` : ""}`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quiz Average</CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{averageScore}%</div>
                <p className="text-xs text-muted-foreground">
                  {completedQuizzes.length} quizzes completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* SRS review queue â€” missed items due for spaced-repetition review */}
          <SrsReviewCard />

          {/* Recent Quiz Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Recent Quiz Results
              </CardTitle>
              <CardDescription>
                Your latest quiz performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              {completedQuizzes.length === 0 ? (
                <EmptyState 
                  icon={BookOpen}
                  title="No Quizzes Completed"
                  description="Complete your first quiz to see your progress here."
                  action={
                    <Button asChild>
                      <Link href="/learn">Start Learning</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {completedQuizzes
                    .sort((a, b) => b.completedAt - a.completedAt)
                    .slice(0, 10)
                    .map((quiz, index) => {
                      const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);
                      const isPerfect = percentage === 100;
                      
                      return (
                        <div key={`${quiz.monthId}-${quiz.weekId}-${index}`} 
                             className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm">
                              <div className="font-medium">
                                Month {quiz.monthId} - Week {quiz.weekId.replace('w', '')}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {new Date(quiz.completedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="text-right text-sm">
                              <div className="font-medium">{quiz.score}/{quiz.totalQuestions}</div>
                              <div className="text-muted-foreground text-xs">{percentage}%</div>
                            </div>
                            <Badge variant={isPerfect ? "default" : percentage >= 80 ? "secondary" : "outline"}>
                              {isPerfect ? "Perfect!" : percentage >= 80 ? "Great" : "Review"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Finance lesson quizzes â€” tracked separately from CMA and CPA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Finance â€” Lesson Quizzes
              </CardTitle>
              <CardDescription>
                {financeResults.length > 0
                  ? `${financeResults.length} Finance quiz${financeResults.length === 1 ? "" : "zes"} completed Â· ${(() => {
                      const tq = financeResults.reduce((a, q) => a + q.totalQuestions, 0);
                      const tc = financeResults.reduce((a, q) => a + q.score, 0);
                      return tq > 0 ? Math.round((tc / tq) * 100) : 0;
                    })()}% average Â· tracked separately from CMA/CPA`
                  : "Your corporate-finance lesson quiz performances"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {financeResults.length === 0 ? (
                <EmptyState
                  icon={Calculator}
                  title="No Finance Quizzes Yet"
                  description="Complete a Finance lesson quiz to see your progress here."
                  action={
                    <Button asChild>
                      <Link href="/finance">Open Finance Lessons</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {[...financeResults]
                    .sort((a, b) => b.completedAt - a.completedAt)
                    .slice(0, 10)
                    .map((quiz, index) => {
                      const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);
                      const isPerfect = percentage === 100;
                      const unitPart = quiz.monthId.split("-u")[1] ?? quiz.monthId;
                      const label = `Finance Unit ${unitPart} Â· Week ${quiz.weekId.replace("w", "")}`;

                      return (
                        <div
                          key={`${quiz.monthId}-${quiz.weekId}-${index}`}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-sm">
                              <div className="font-medium">{label}</div>
                              <div className="text-muted-foreground text-xs">
                                {new Date(quiz.completedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="text-right text-sm">
                              <div className="font-medium">
                                {quiz.score}/{quiz.totalQuestions}
                              </div>
                              <div className="text-muted-foreground text-xs">{percentage}%</div>
                            </div>
                            <Badge variant={isPerfect ? "default" : percentage >= 80 ? "secondary" : "outline"}>
                              {isPerfect ? "Perfect!" : percentage >= 80 ? "Great" : "Review"}
                            </Badge>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/finance/${quiz.monthId}/${quiz.weekId}`}>View</Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* CPA lesson quizzes - tracked separately from CMA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                CPA Lessons — Quiz Progress
              </CardTitle>
              <CardDescription>
                {cpaResults.length > 0
                  ? `${cpaResults.length} CPA quiz${cpaResults.length === 1 ? "" : "zes"} completed Â· ${(() => {
                      const tq = cpaResults.reduce((a, q) => a + q.totalQuestions, 0);
                      const tc = cpaResults.reduce((a, q) => a + q.score, 0);
                      return tq > 0 ? Math.round((tc / tq) * 100) : 0;
                    })()}% average Â· tracked separately from CMA`
                  : "Your CPA lesson quiz performances across Core and Discipline sections"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cpaResults.length === 0 ? (
                <EmptyState
                  icon={GraduationCap}
                  title="No CPA Quizzes Yet"
                  description="Complete a CPA lesson quiz to see your progress here."
                  action={
                    <Button asChild>
                      <Link href="/cpa">Open CPA Lessons</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {[...cpaResults]
                    .sort((a, b) => b.completedAt - a.completedAt)
                    .slice(0, 10)
                    .map((quiz, index) => {
                      const percentage = Math.round((quiz.score / quiz.totalQuestions) * 100);
                      const isPerfect = percentage === 100;
                      // quiz.monthId holds the CPA unit id, e.g. "far-u1".
                      const [section, unitPart] = quiz.monthId.split("-u");
                      const label = `${(section || "").toUpperCase()} Unit ${unitPart ?? ""} Â· Week ${quiz.weekId.replace("w", "")}`;

                      return (
                        <div
                          key={`${quiz.monthId}-${quiz.weekId}-${index}`}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-sm">
                              <div className="font-medium">{label}</div>
                              <div className="text-muted-foreground text-xs">
                                {new Date(quiz.completedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="text-right text-sm">
                              <div className="font-medium">
                                {quiz.score}/{quiz.totalQuestions}
                              </div>
                              <div className="text-muted-foreground text-xs">{percentage}%</div>
                            </div>
                            <Badge variant={isPerfect ? "default" : percentage >= 80 ? "secondary" : "outline"}>
                              {isPerfect ? "Perfect!" : percentage >= 80 ? "Great" : "Review"}
                            </Badge>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/cpa/${quiz.monthId}/${quiz.weekId}`}>View</Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bookmarks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bookmark className="h-5 w-5 mr-2" />
                Bookmarked Content
              </CardTitle>
              <CardDescription>
                Quick access to your saved content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookmarks.length === 0 ? (
                <EmptyState 
                  icon={Bookmark}
                  title="No Bookmarks Yet"
                  description="Bookmark important sections while reading lessons for quick reference."
                />
              ) : (
                <div className="space-y-3">
                  {bookmarks.slice(0, 10).map((bookmark, index) => (
                    <div key={`${bookmark.monthId}-${bookmark.weekId}-${bookmark.anchor}-${index}`} 
                         className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bookmark className="h-4 w-4 text-blue-600" />
                        <div className="text-sm">
                          <div className="font-medium">{bookmark.title}</div>
                          <div className="text-muted-foreground text-xs">
                            Month {bookmark.monthId} - Week {bookmark.weekId.replace('w', '')}
                          </div>
                        </div>
                      </div>
                      
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/learn/${bookmark.monthId}/${bookmark.weekId}#${bookmark.anchor}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Weekly Operating Plan
              </CardTitle>
              <CardDescription>
                Your daily targets are managed from Mission Control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 text-muted-foreground md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-foreground">Follow the 7-day Mission Control plan.</p>
                  <p className="mt-1 text-sm">
                    Use it to balance Finance class prep, CMA work, CPA practice, Apply Lab, and SRS review.
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/mission">Open Mission Control</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
