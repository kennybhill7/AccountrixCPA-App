"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarDays,
  Compass,
  Dumbbell,
  FlaskConical,
  LineChart,
  NotebookPen,
  Play,
  RotateCcw,
  Timer,
  Zap,
} from "lucide-react";
import { useHydratedStore } from "@/lib/hooks";
import { useUserProgress, useAttempts, useSrs } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";
import { buildSession, weakSkills, type SessionItem } from "@/lib/session";
import { GlassCard } from "@/components/glass/GlassCard";
import { ProgressRing } from "@/components/glass/ProgressRing";
import { SessionRunner } from "@/components/glass/SessionRunner";
import { ControllerDesk } from "@/components/glass/ControllerDesk";

const EXAM_KEY = "exam:corpfin:date";
const DAILY_GOAL = 20;

const EXPLORE = [
  { label: "Study Plan", href: "/planner", icon: CalendarDays },
  { label: "Mock Exam", href: "/exam", icon: Timer },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Practice", href: "/practice", icon: Dumbbell },
  { label: "Calculator Lab", href: "/calculator", icon: Calculator },
  { label: "Finance", href: "/finance", icon: LineChart },
  { label: "Apply Lab", href: "/apply", icon: FlaskConical },
  { label: "Notebook", href: "/scratchpad", icon: NotebookPen },
];

export default function TodayPage() {
  const hydrated = useHydratedStore();
  const { xp, streak, getXPLevel } = useUserProgress();
  const events = useAttempts((s) => s.events);
  const dueCount = useSrs((s) => s.dueCount);

  const [examDate, setExamDate] = useState("");
  const [session, setSession] = useState<SessionItem[] | null>(null);

  useEffect(() => {
    try {
      setExamDate(localStorage.getItem(EXAM_KEY) ?? "");
    } catch {
      /* ignore */
    }
  }, []);

  const saveExamDate = (v: string) => {
    setExamDate(v);
    try {
      localStorage.setItem(EXAM_KEY, v);
    } catch {
      /* ignore */
    }
  };

  const today = dayNumber(Date.now());
  const repsToday = hydrated ? events.filter((e) => dayNumber(e.ts) === today).length : 0;
  const due = hydrated ? dueCount(today) : 0;
  const goalPct = Math.min(100, Math.round((repsToday / DAILY_GOAL) * 100));
  const weak = useMemo(() => (hydrated ? weakSkills(events).slice(0, 3) : []), [events, hydrated]);

  const daysLeft = useMemo(() => {
    if (!examDate) return null;
    const exam = new Date(`${examDate}T00:00:00`).getTime();
    if (!Number.isFinite(exam)) return null;
    return Math.ceil((exam - Date.now()) / 86_400_000);
  }, [examDate]);

  const start = (length: number) => {
    setSession(buildSession(events, { length, seedBase: Date.now() % 100000 }));
  };

  // Role mode: exam-prep (session engine) vs controller (day-job case desk).
  const [mode, setMode] = useState<"exam" | "controller">("exam");
  useEffect(() => {
    try {
      setMode(localStorage.getItem("ui:mode") === "controller" ? "controller" : "exam");
    } catch {
      /* ignore */
    }
  }, []);
  const switchMode = (m: "exam" | "controller") => {
    setMode(m);
    try {
      localStorage.setItem("ui:mode", m);
    } catch {
      /* ignore */
    }
  };

  if (session) {
    return (
      <div className="mx-auto max-w-3xl">
        <SessionRunner items={session} onExit={() => setSession(null)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Role toggle — exam prep vs the controller day job */}
      <div className="flex justify-center">
        <div className="glass inline-flex items-center gap-1 p-1">
          {(["exam", "controller"] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="min-h-11 rounded-sm px-4 py-1.5 text-sm font-semibold transition"
              style={
                mode === m
                  ? { background: "hsl(var(--primary) / 0.14)", color: "hsl(var(--primary))" }
                  : { color: "hsl(var(--text-muted))" }
              }
            >
              {m === "exam" ? "Exam prep" : "Controller"}
            </button>
          ))}
        </div>
      </div>

      {mode === "controller" ? (
        <ControllerDesk />
      ) : (
        <>
          {/* Today hero */}
          <div className="relative overflow-hidden border border-border bg-card p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                backgroundImage: "linear-gradient(hsl(var(--border) / 0.18) 1px, transparent 1px)",
                backgroundSize: "100% 2.25rem",
              }}
            />
            <div className="relative">
              <div className="blueprint-label flex items-center gap-3">
                <span>Today / study desk</span>
                {daysLeft != null && (
                  <span className="rounded-sm border border-border bg-muted px-2.5 py-1 text-text-muted">
                    Corporate Finance exam ·{" "}
                    {daysLeft > 0 ? `${daysLeft} days` : daysLeft === 0 ? "today" : "passed"}
                  </span>
                )}
              </div>
              <h1 className="font-display mt-2 text-3xl font-bold text-foreground sm:text-4xl">
                One session. Weak spots first.
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {weak.length > 0
                  ? `~15 min, weighted to what you keep missing (${weak.join(", ")}). Read a little, work a lot.`
                  : "~15 min of mixed reps to find your weak spots. Read a little, work a lot."}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => start(10)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  <Play className="h-4 w-4 fill-current" /> Start session
                </button>
                <button
                  onClick={() => start(5)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <Zap className="h-4 w-4" /> Quick 5
                </button>
              </div>
              {!examDate && (
                <div className="mt-4 flex items-center gap-2 text-xs text-white/80">
                  <span className="text-muted-foreground">Set your exam date:</span>
                  <input
                    type="date"
                    onChange={(e) => saveExamDate(e.target.value)}
                    className="rounded-sm border border-border bg-card px-2 py-1 text-foreground outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* First-run: point at the diagnostic so early sessions are targeted */}
          {hydrated && events.length === 0 && (
            <GlassCard hover className="p-5">
              <Link href="/diagnostic" className="flex items-center gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-accent text-primary"
                  style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}
                >
                  <Compass className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-bold tracking-tight text-foreground">
                    New here? Take the 5-minute diagnostic
                  </div>
                  <div className="text-sm text-text-muted">
                    It finds your weak spots so your very first sessions target the right topics.
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-text-light" />
              </Link>
            </GlassCard>
          )}

          {/* Command strip */}
          {hydrated && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
              <GlassCard className="flex items-center gap-4 p-5">
                <ProgressRing pct={goalPct} size={64} />
                <div className="min-w-0">
                  <div className="font-display text-lg font-bold tracking-tight text-foreground">
                    {repsToday} / {DAILY_GOAL} today
                  </div>
                  <div className="text-xs text-text-muted">
                    {repsToday >= DAILY_GOAL
                      ? "Goal hit — anything more is a bonus."
                      : "Problems worked today."}
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="flex flex-col justify-center p-5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-text-light">
                  Review due
                </div>
                <div
                  className="font-display mt-1 text-2xl font-bold tracking-tight"
                  style={{
                    color: due > 0 ? "hsl(var(--status-streak))" : "hsl(var(--status-done))",
                  }}
                >
                  {due}
                </div>
                {due > 0 ? (
                  <Link
                    href="/mistakes"
                    className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-primary"
                  >
                    <RotateCcw className="h-3 w-3" /> Clear your misses
                  </Link>
                ) : (
                  <div className="mt-0.5 text-xs text-text-muted">Nothing due — nice.</div>
                )}
              </GlassCard>
              <GlassCard className="flex flex-col justify-center p-5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-text-light">
                  Level {getXPLevel()}
                </div>
                <div className="font-display mt-1 text-2xl font-bold tracking-tight text-primary">
                  {xp.toLocaleString()} XP
                </div>
                <div className="mt-0.5 text-xs text-text-muted">🔥 {streak}-day streak</div>
              </GlassCard>
            </div>
          )}

          {/* Weak spots */}
          {hydrated && weak.length > 0 && (
            <GlassCard className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                    Your weak spots
                  </h2>
                  <p className="text-sm text-text-muted">
                    Lowest-accuracy skills — these get front-loaded into every session.
                  </p>
                </div>
                <button
                  onClick={() => start(10)}
                  className="min-h-11 shrink-0 rounded-sm border border-primary/30 px-4 py-2 text-sm font-semibold text-primary"
                  style={{ background: "hsl(var(--primary) / 0.12)" }}
                >
                  Drill these
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {weak.map((s) => (
                  <span
                    key={s}
                    className="rounded-sm border border-border px-3 py-1 text-sm font-medium"
                    style={{
                      background: "hsl(var(--warn) / 0.12)",
                      color: "hsl(var(--status-streak))",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Explore */}
          <div>
            <h2 className="font-display mb-3 text-sm font-bold uppercase tracking-wider text-text-light">
              Explore
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {EXPLORE.map((e) => {
                const Icon = e.icon;
                return (
                  <Link key={e.href} href={e.href}>
                    <GlassCard hover className="flex items-center gap-3 p-4">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-muted text-primary"
                        style={{
                          background: "hsl(var(--primary) / 0.12)",
                          color: "hsl(var(--primary))",
                        }}
                      >
                        <Icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
                      </span>
                      <span className="text-sm font-semibold text-foreground">{e.label}</span>
                      <ArrowRight className="ml-auto h-4 w-4 text-text-light" />
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
