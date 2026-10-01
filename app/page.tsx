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
  RotateCcw,
  Timer,
} from "lucide-react";
import { useHydratedStore } from "@/lib/hooks";
import { useUserProgress, useAttempts, useSrs } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";
import { buildSession, weakSkills, type SessionItem } from "@/lib/session";
import { SessionRunner } from "@/components/glass/SessionRunner";
import { ControllerDesk } from "@/components/glass/ControllerDesk";
import { ActionBar } from "@/components/sheet/ActionBar";
import { StateGlyph } from "@/components/sheet/StateGlyph";

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
        <div
          className="inline-flex items-center"
          style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
        >
          {(["exam", "controller"] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="min-h-11 px-4 py-1.5 text-sm font-semibold transition"
              style={
                mode === m
                  ? { background: "hsl(var(--foreground))", color: "hsl(var(--background))" }
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
              <div className="mt-5">
                <ActionBar
                  primary={{ label: "Start session", onClick: () => start(10) }}
                  secondary={[{ label: "Quick 5", onClick: () => start(5) }]}
                />
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
            <div
              className="p-5 transition-colors hover:bg-accent/30"
              style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
            >
              <Link href="/diagnostic" className="flex items-center gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center"
                  style={{ background: "hsl(var(--foreground) / 0.06)", borderRadius: 2 }}
                >
                  <Compass className="h-5 w-5" style={{ color: "hsl(var(--foreground))" }} />
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
            </div>
          )}

          {/* Command strip */}
          {hydrated && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
              <div
                className="flex items-center gap-4 p-5"
                style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
              >
                <div>
                  <div className="blueprint-label">Today's goal</div>
                  <div className="ledger-number text-3xl font-semibold">{goalPct}%</div>
                </div>
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
              </div>
              <div
                className="flex flex-col justify-center p-5"
                style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
              >
                <div className="blueprint-label">Review due</div>
                <div className="ledger-number mt-1 text-2xl font-semibold">{due}</div>
                {due > 0 ? (
                  <Link
                    href="/mistakes"
                    className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-foreground underline"
                  >
                    <RotateCcw className="h-3 w-3" /> Clear your misses
                  </Link>
                ) : (
                  <div className="mt-0.5 text-xs text-text-muted">Nothing due — nice.</div>
                )}
              </div>
              <div
                className="flex flex-col justify-center p-5"
                style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
              >
                <div className="blueprint-label">Level {getXPLevel()}</div>
                <div className="ledger-number mt-1 text-2xl font-semibold">
                  {xp.toLocaleString()} XP
                </div>
                <div className="mt-0.5 text-xs text-text-muted">{streak}-day streak</div>
              </div>
            </div>
          )}

          {/* Weak spots */}
          {hydrated && weak.length > 0 && (
            <div
              className="p-5"
              style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                    Your weak spots
                  </h2>
                  <p className="text-sm text-text-muted">
                    Lowest-accuracy skills — these get front-loaded into every session.
                  </p>
                </div>
                <ActionBar secondary={[{ label: "Drill these", onClick: () => start(10) }]} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {weak.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium"
                    style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
                  >
                    <StateGlyph state="warn" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
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
                    <div
                      className="flex items-center gap-3 p-4 transition-colors hover:bg-accent/30"
                      style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
                    >
                      <span
                        className="flex h-9 w-9 items-center justify-center"
                        style={{ background: "hsl(var(--foreground) / 0.06)", borderRadius: 2 }}
                      >
                        <Icon
                          className="h-[18px] w-[18px]"
                          style={{ color: "hsl(var(--foreground))" }}
                        />
                      </span>
                      <span className="text-sm font-semibold text-foreground">{e.label}</span>
                      <ArrowRight className="ml-auto h-4 w-4 text-text-light" />
                    </div>
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
