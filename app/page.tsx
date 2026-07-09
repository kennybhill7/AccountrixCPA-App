"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BookOpen, Calculator, ClipboardCheck, Dumbbell, GraduationCap, Play, RotateCcw,
} from "lucide-react";
import { useHydratedStore } from "@/lib/hooks";
import { useUserProgress, useAttempts, useSrs } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";
import { GlassCard } from "@/components/glass/GlassCard";
import { ProgressRing } from "@/components/glass/ProgressRing";

type ContentStats = {
  tracks?: number;
  months: number;
  weeks: number;
  lessons?: number;
  flashcards: number;
  quizQuestions: number;
};

const DAILY_GOAL = 20;

const lanes = [
  { label: "CMA / Controller", href: "/learn", icon: BookOpen, accent: "--unit-1", description: "Cost, WIP, controls, budgeting, performance, and analytics." },
  { label: "CPA", href: "/cpa", icon: GraduationCap, accent: "--unit-2", description: "FAR, AUD, REG, BAR, ISC, and TCP exam depth." },
  { label: "Finance", href: "/finance", icon: Calculator, accent: "--unit-3", description: "TVM, bonds, CAPM, WACC, capital budgeting, and pro formas." },
  { label: "Practice", href: "/practice", icon: Dumbbell, accent: "--unit-1", description: "Endless problems — numeric drills and exam MCQs. Do the reps." },
  { label: "Apply Lab", href: "/apply", icon: ClipboardCheck, accent: "--unit-2", description: "Fictional controller/CFO workflows and lender-ready workpapers." },
];

export default function HomePage() {
  const hydrated = useHydratedStore();
  const { xp, streak, getXPLevel } = useUserProgress();
  const events = useAttempts((s) => s.events);
  const dueCount = useSrs((s) => s.dueCount);
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

  const today = dayNumber(Date.now());
  const repsToday = hydrated ? events.filter((e) => dayNumber(e.ts) === today).length : 0;
  const due = hydrated ? dueCount(today) : 0;
  const goalPct = Math.min(100, Math.round((repsToday / DAILY_GOAL) * 100));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Hero */}
      <div
        className="relative overflow-hidden p-6 sm:p-8"
        style={{
          borderRadius: 26,
          background: "linear-gradient(120deg, rgba(37,99,235,0.94), rgba(124,58,237,0.92))",
          boxShadow: "0 28px 60px -24px rgba(59,80,220,0.7), inset 0 1px 0 rgba(255,255,255,0.28)",
        }}
      >
        <div
          aria-hidden
          className="animate-aurora-shimmer pointer-events-none absolute inset-y-0 left-0 w-[120px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
        />
        <div className="relative">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
            Learn → drill → apply → explain → review
          </div>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Finance · CMA · CPA · CFO mastery
          </h1>
          <p className="mt-2 max-w-2xl text-white/85">
            One daily loop: read a little, then work a lot of problems. You get good by doing the reps.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/practice"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-primary shadow-lg transition-transform hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              <Play className="h-4 w-4 fill-current" /> Work problems
            </Link>
            <Link
              href="/mission"
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/40 transition hover:bg-white/10"
            >
              Today&apos;s plan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Command strip: today's reps + review due + level/streak */}
      {hydrated && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <GlassCard className="flex items-center gap-4 p-5">
            <ProgressRing pct={goalPct} size={64} />
            <div className="min-w-0">
              <div className="font-display text-lg font-bold tracking-tight text-foreground">
                {repsToday} / {DAILY_GOAL} today
              </div>
              <div className="text-xs text-text-muted">
                {repsToday >= DAILY_GOAL ? "Goal hit — keep stacking reps." : "Problems worked today. Keep going."}
              </div>
              <Link href="/practice" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Work problems <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-center p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-light">Review due</div>
            <div className="font-display mt-1 text-2xl font-bold tracking-tight" style={{ color: due > 0 ? "hsl(var(--status-streak))" : "hsl(var(--status-done))" }}>
              {due}
            </div>
            {due > 0 ? (
              <Link href="/mistakes" className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <RotateCcw className="h-3 w-3" /> Clear your misses
              </Link>
            ) : (
              <div className="mt-0.5 text-xs text-text-muted">Nothing due — nice.</div>
            )}
          </GlassCard>

          <GlassCard className="flex flex-col justify-center p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-light">Level {getXPLevel()}</div>
            <div className="font-display mt-1 text-2xl font-bold tracking-tight text-primary">{xp.toLocaleString()} XP</div>
            <div className="mt-0.5 text-xs text-text-muted">🔥 {streak}-day streak</div>
          </GlassCard>
        </div>
      )}

      {/* Content stat line */}
      {stats && (
        <p className="px-1 text-sm text-text-muted">
          {stats.tracks ?? 1} tracks · {stats.lessons ?? stats.weeks} lessons · {stats.quizQuestions} questions · {stats.flashcards} flashcards
        </p>
      )}

      {/* Lane grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {lanes.map((lane) => {
          const Icon = lane.icon;
          return (
            <Link key={lane.href} href={lane.href}>
              <GlassCard hover className="flex h-full flex-col p-5">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `hsl(var(${lane.accent}) / 0.13)`, color: `hsl(var(${lane.accent}-ink))` }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">{lane.label}</h2>
                </div>
                <p className="mt-2 flex-1 text-sm text-text-muted">{lane.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open <ArrowRight className="h-4 w-4" />
                </span>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
