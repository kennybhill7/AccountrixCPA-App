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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Star, Flame, Heart, BookOpen, Bookmark, Calendar, Trophy, Target, GraduationCap, Calculator } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { SrsReviewCard } from "@/components/SrsReviewCard";
import { GlassCard } from "@/components/glass/GlassCard";
import { StatTile } from "@/components/glass/StatTile";
import { StreakStrip, type StreakDay } from "@/components/glass/StreakStrip";

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
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="text-center py-12">
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

  const streakDays: StreakDay[] = (() => {
    const labels = ["M", "T", "W", "T", "F", "S", "S"];
    const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0
    return labels.map((label, i) => ({
      label,
      today: i === todayIdx,
      done: i < todayIdx && todayIdx - i < streak,
    }));
  })();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}
        >
          <User className="h-7 w-7" />
        </span>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Learning Profile</h1>
          <p className="text-muted-foreground">
            Track your Finance, CMA, CPA, and applied-work readiness in one place
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Experience Points"
          value={String(xp)}
          sub={`Level ${level.level}: ${level.name}`}
        />
        <StreakStrip count={streak} days={streakDays} />
        <GlassCard className="flex flex-col justify-center p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-light">Hearts</div>
            <Heart className="h-4 w-4" style={{ color: "hsl(var(--status-error, 0 72% 51%))" }} />
          </div>
          <div className="mt-2 flex items-center space-x-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Heart
                key={i}
                className="h-5 w-5"
                style={{
                  color: i < hearts ? "hsl(var(--status-error, 0 72% 51%))" : "hsl(var(--text-light))",
                  fill: i < hearts ? "currentColor" : "none",
                }}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {hearts === 5
              ? "Full hearts!"
              : `${hearts}/5 hearts${nextHeartMin != null ? ` — next heart in ${nextHeartMin}m` : ""}`}
          </p>
        </GlassCard>
        <StatTile
          label="Quiz Average"
          value={`${averageScore}%`}
          sub={`${completedQuizzes.length} quizzes completed`}
          accent="hsl(var(--status-done))"
        />
      </div>

      {level.level < 6 && (
        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Progress to {level.name === "CFO Ready" ? level.name : "next level"}</span>
            <span className="text-muted-foreground">{Math.round(progressToNext)}%</span>
          </div>
          <Progress value={progressToNext} className="mt-2 h-1.5" />
        </GlassCard>
      )}

      {/* SRS review queue — missed items due for spaced-repetition review */}
      <SrsReviewCard />

      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href="/mistakes">Open Mistake Bank</Link>
        </Button>
      </div>

      {/* Recent Quiz Results */}
      <GlassCard className="p-6">
        <div className="mb-4">
          <h2 className="font-display flex items-center text-lg font-semibold tracking-tight">
            <Trophy className="h-5 w-5 mr-2 text-primary" />
            Recent Quiz Results
          </h2>
          <p className="text-sm text-muted-foreground">Your latest quiz performances</p>
        </div>
        <div>
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
                             className="glass flex items-center justify-between p-3">
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
        </div>
      </GlassCard>

      {/* Finance lesson quizzes — tracked separately from CMA and CPA */}
      <GlassCard className="p-6">
        <div className="mb-4">
          <h2 className="font-display flex items-center text-lg font-semibold tracking-tight">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            Finance — Lesson Quizzes
          </h2>
          <p className="text-sm text-muted-foreground">
            {financeResults.length > 0
              ? `${financeResults.length} Finance quiz${financeResults.length === 1 ? "" : "zes"} completed · ${(() => {
                  const tq = financeResults.reduce((a, q) => a + q.totalQuestions, 0);
                  const tc = financeResults.reduce((a, q) => a + q.score, 0);
                  return tq > 0 ? Math.round((tc / tq) * 100) : 0;
                })()}% average · tracked separately from CMA/CPA`
              : "Your corporate-finance lesson quiz performances"}
          </p>
        </div>
        <div>
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
                      const label = `Finance Unit ${unitPart} · Week ${quiz.weekId.replace("w", "")}`;

                      return (
                        <div
                          key={`${quiz.monthId}-${quiz.weekId}-${index}`}
                          className="glass flex items-center justify-between p-3"
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
        </div>
      </GlassCard>

      {/* CPA lesson quizzes - tracked separately from CMA */}
      <GlassCard className="p-6">
        <div className="mb-4">
          <h2 className="font-display flex items-center text-lg font-semibold tracking-tight">
            <GraduationCap className="h-5 w-5 mr-2 text-primary" />
            CPA Lessons — Quiz Progress
          </h2>
          <p className="text-sm text-muted-foreground">
            {cpaResults.length > 0
              ? `${cpaResults.length} CPA quiz${cpaResults.length === 1 ? "" : "zes"} completed · ${(() => {
                  const tq = cpaResults.reduce((a, q) => a + q.totalQuestions, 0);
                  const tc = cpaResults.reduce((a, q) => a + q.score, 0);
                  return tq > 0 ? Math.round((tc / tq) * 100) : 0;
                })()}% average · tracked separately from CMA`
              : "Your CPA lesson quiz performances across Core and Discipline sections"}
          </p>
        </div>
        <div>
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
                      const label = `${(section || "").toUpperCase()} Unit ${unitPart ?? ""} · Week ${quiz.weekId.replace("w", "")}`;

                      return (
                        <div
                          key={`${quiz.monthId}-${quiz.weekId}-${index}`}
                          className="glass flex items-center justify-between p-3"
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
        </div>
      </GlassCard>

      {/* Bookmarks */}
      <GlassCard className="p-6">
        <div className="mb-4">
          <h2 className="font-display flex items-center text-lg font-semibold tracking-tight">
            <Bookmark className="h-5 w-5 mr-2 text-primary" />
            Bookmarked Content
          </h2>
          <p className="text-sm text-muted-foreground">Quick access to your saved content</p>
        </div>
        <div>
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
                         className="glass flex items-center justify-between p-3">
                      <div className="flex items-center space-x-3">
                        <Bookmark className="h-4 w-4 text-primary" />
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
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="mb-4">
          <h2 className="font-display flex items-center text-lg font-semibold tracking-tight">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Weekly Operating Plan
          </h2>
          <p className="text-sm text-muted-foreground">Your daily targets are managed from Mission Control</p>
        </div>
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
      </GlassCard>
    </div>
  );
}
