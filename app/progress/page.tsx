"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUserProgress, useQuizResults } from "@/lib/store";

export default function ProgressPage() {
  const [stats, setStats] = useState<{ months: number; weeks: number; flashcards: number; quizQuestions: number } | null>(null);
  const progress = useUserProgress();
  const quizResults = useQuizResults();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) setStats(await res.json());
      } catch {}
    })();
  }, []);

  const unlocked = progress.getUnlockedAchievements();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Progress</h1>
          <p className="text-sm text-muted-foreground">Your learning stats and achievements</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link href="/plan">View Plan</Link></Button>
          <Button asChild className="btn-primary"><Link href="/months">Continue Learning</Link></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{progress.xp}</CardTitle>
            <CardDescription>XP</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{progress.totalLessonsCompleted}</CardTitle>
            <CardDescription>Lessons Completed</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{progress.totalQuizzesCompleted || quizResults.getAllResults().length}</CardTitle>
            <CardDescription>Quizzes Completed</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card><CardHeader><CardTitle>{stats.months}</CardTitle><CardDescription>Months</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle>{stats.weeks}</CardTitle><CardDescription>Weeks</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle>{stats.flashcards}</CardTitle><CardDescription>Flashcards</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle>{stats.quizQuestions}</CardTitle><CardDescription>Questions</CardDescription></CardHeader></Card>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Achievements</h2>
        {unlocked.length === 0 ? (
          <p className="text-sm text-muted-foreground">No achievements yet. Complete lessons and quizzes to unlock!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {unlocked.map(a => (
              <Card key={a.id}><CardHeader><CardTitle>{a.title}</CardTitle><CardDescription>{a.description}</CardDescription></CardHeader></Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

