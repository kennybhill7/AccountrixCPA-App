"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, BookOpen, Calculator, ClipboardCheck, GraduationCap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useHydratedStore } from "@/lib/hooks";
import { useQuizResults, useCpaProgress, useFinanceProgress } from "@/lib/store";
import { buildSessions, planDay, type Lane, type SessionItem } from "@/lib/missionControl";
import { computeReadiness, type SkillStats } from "@/lib/readiness";

type QuizResultLike = {
  score: number;
  totalQuestions: number;
  completedAt: number;
};

const dayNumber = (ms: number) => Math.floor(ms / 86_400_000);

const laneMeta: Record<
  SessionItem["lane"],
  {
    label: string;
    href: string;
    icon: typeof BookOpen;
    description: string;
  }
> = {
  cma: {
    label: "CMA / Controller",
    href: "/learn",
    icon: BookOpen,
    description: "Cost, WIP, controls, budgeting, performance, and analytics.",
  },
  cpa: {
    label: "CPA",
    href: "/cpa",
    icon: GraduationCap,
    description: "FAR, AUD, REG, BAR, ISC, and TCP exam depth.",
  },
  finance: {
    label: "Finance",
    href: "/finance",
    icon: Calculator,
    description: "FI3300 prep: TVM, bonds, CAPM, WACC, capital budgeting, and pro formas.",
  },
  cfo: {
    label: "Apply Lab",
    href: "/apply",
    icon: ClipboardCheck,
    description: "Fictional controller/CFO workflows and lender-ready workpapers.",
  },
  review: {
    label: "Review",
    href: "/profile",
    icon: Target,
    description: "Missed items, flashcards, and weak-topic review.",
  },
};

function statsFor(skill: string, results: QuizResultLike[]): SkillStats {
  const attempts = results.reduce((sum, r) => sum + r.totalQuestions, 0);
  const correct = results.reduce((sum, r) => sum + r.score, 0);
  const last = results.length > 0 ? Math.max(...results.map((r) => r.completedAt)) : undefined;

  return {
    skill,
    attempts,
    correct,
    lastDay: last === undefined ? undefined : dayNumber(last),
  };
}

function pickNext(lane: Lane): string {
  switch (lane) {
    case "cma":
      return "Continue CMA lessons, then close with one Apply Lab workflow.";
    case "cpa":
      return "Continue CPA lessons and write down every missed-rule reason.";
    case "finance":
      return "Work FI3300 finance problems before reading explanations.";
    case "cfo":
      return "Complete one fictional case workflow like a controller deliverable.";
  }
}

export default function MissionControlPage() {
  const hydrated = useHydratedStore();
  const [minutes, setMinutes] = useState(75);

  const cmaResultsStore = useQuizResults();
  const cpaResultsRaw = useCpaProgress((s) => s.results);
  const financeResultsRaw = useFinanceProgress((s) => s.results);

  const cmaResults = hydrated ? cmaResultsStore.getAllResults() : [];
  const cpaResults = hydrated ? cpaResultsRaw : [];
  const financeResults = hydrated ? financeResultsRaw : [];

  const plan = useMemo(() => planDay(minutes), [minutes]);
  const sessions = useMemo(() => buildSessions(plan, pickNext), [plan]);

  const readiness = useMemo(() => {
    const now = dayNumber(Date.now());
    return computeReadiness(
      [
        statsFor("CMA / Controller execution", cmaResults),
        statsFor("CPA exam depth", cpaResults),
        statsFor("Corporate finance", financeResults),
        { skill: "Fictional CFO workflows", attempts: 0, correct: 0 },
      ],
      {
        "CMA / Controller execution": 0.45,
        "CPA exam depth": 0.3,
        "Corporate finance": 0.2,
        "Fictional CFO workflows": 0.05,
      },
      now,
      { weakestCount: 4 }
    );
  }, [cmaResults, cpaResults, financeResults]);

  if (!hydrated) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center text-muted-foreground">Loading Mission Control...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Finance + CMA + CPA + CFO execution
            </Badge>
            <h1 className="text-4xl font-bold mb-3">Mission Control</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              A daily study plan that prescribes the mix instead of asking you to choose. Default weighting is
              45% CMA/controller, 30% CPA, 20% finance, and 5% applied CFO workflow practice.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="grid gap-4 md:grid-cols-4">
            {[45, 60, 75, 90].map((option) => (
              <Button
                key={option}
                variant={minutes === option ? "default" : "outline"}
                onClick={() => setMinutes(option)}
              >
                {option} minutes
              </Button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Today&apos;s prescribed loop
                </CardTitle>
                <CardDescription>
                  Learn → drill → apply → explain mistake → schedule review. Cards and MCQ are warm-up, not the whole product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessions.map((session) => {
                  const meta = laneMeta[session.lane];
                  const Icon = meta.icon;
                  const pct = Math.round((session.minutes / plan.totalMinutes) * 100);

                  return (
                    <div key={session.lane} className="rounded-lg border p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{meta.label}</div>
                            <div className="text-sm text-muted-foreground">{session.label ?? meta.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{session.minutes} min</Badge>
                          <Button asChild size="sm">
                            <Link href={meta.href}>Open</Link>
                          </Button>
                        </div>
                      </div>
                      <Progress value={pct} className="mt-3 h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Readiness signal
                </CardTitle>
                <CardDescription>Based on quiz evidence already in your local progress stores.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{readiness.overall}%</div>
                <p className="text-sm text-muted-foreground mb-4">Blueprint-weighted across the unified path.</p>
                <div className="space-y-3">
                  {readiness.weakest.map((skill) => (
                    <div key={skill.skill}>
                      <div className="flex items-center justify-between text-sm">
                        <span>{skill.skill}</span>
                        <span className="font-medium">{skill.tested ? `${skill.score}%` : "untested"}</span>
                      </div>
                      <Progress value={skill.score} className="mt-1 h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Operating rule</CardTitle>
              <CardDescription>
                Use this screen as the default start page when time is limited.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="font-semibold">1. Do the block</div>
                <p className="text-sm text-muted-foreground">Start with the assigned track. Do not browse for what feels easiest.</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="font-semibold">2. Explain misses</div>
                <p className="text-sm text-muted-foreground">For every miss, write the rule, the trap, and the corrected method.</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="font-semibold">3. Apply it</div>
                <p className="text-sm text-muted-foreground">End with a fictional workpaper or workflow whenever the topic touches controller work.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
