"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, ClipboardCheck, Flame, GraduationCap, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHydratedStore } from "@/lib/hooks";
import { useUserProgress } from "@/lib/store";

type ContentStats = {
  months: number;
  weeks: number;
  flashcards: number;
  quizQuestions: number;
};

const lanes = [
  {
    label: "CMA / Controller",
    href: "/learn",
    icon: BookOpen,
    description: "Cost, WIP, controls, budgeting, performance, and analytics.",
  },
  {
    label: "CPA",
    href: "/cpa",
    icon: GraduationCap,
    description: "FAR, AUD, REG, BAR, ISC, and TCP exam depth.",
  },
  {
    label: "Finance",
    href: "/finance",
    icon: Calculator,
    description: "Corporate-finance prep: TVM, bonds, CAPM, WACC, capital budgeting, and pro formas.",
  },
  {
    label: "Apply Lab",
    href: "/apply",
    icon: ClipboardCheck,
    description: "Fictional controller/CFO workflows and lender-ready workpapers.",
  },
];

export default function HomePage() {
  const hydrated = useHydratedStore();
  const { xp, streak, getXPLevel } = useUserProgress();
  const [stats, setStats] = useState<ContentStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.months === "number") setStats(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-500/10 to-orange-500/10 py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Learn → drill → apply → explain → review
            </Badge>
            <h1 className="text-4xl font-bold mb-3">
              Accountrix — Finance · CMA · CPA · CFO mastery
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mb-6">
              One daily loop across four lanes: lessons, drills, and graded controller workflows on a
              fictional construction case company.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link href="/mission">
                  Start today&apos;s plan
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/tracks">Browse tracks</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* XP / streak / content strip */}
          {hydrated && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border p-4 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">Level {getXPLevel()}</span>
                <span className="text-muted-foreground">{xp} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-semibold">{streak}</span>
                <span className="text-muted-foreground">day streak</span>
              </div>
              {stats && (
                <span className="text-muted-foreground ml-auto">
                  {stats.months} months · {stats.weeks} weeks · {stats.quizQuestions} questions ·{" "}
                  {stats.flashcards} flashcards
                </span>
              )}
            </div>
          )}

          {/* Lane grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {lanes.map((lane) => {
              const Icon = lane.icon;
              return (
                <Link key={lane.href} href={lane.href} className="group">
                  <Card className="h-full transition-colors group-hover:border-primary/50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <div className="rounded-full bg-primary/10 p-2 mr-3">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        {lane.label}
                      </CardTitle>
                      <CardDescription>{lane.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm font-medium text-primary inline-flex items-center">
                        Open
                        <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
