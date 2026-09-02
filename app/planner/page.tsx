"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  RotateCcw,
  Settings2,
  Timer,
  Sparkles,
} from "lucide-react";
import { useHydratedStore } from "@/lib/hooks";
import { useAttempts } from "@/lib/store";
import { masteryMap } from "@/lib/mastery";
import {
  generateStudyPlan,
  summarizePlan,
  type PlanFocus,
  type PlanTask,
  type PlanTaskType,
} from "@/lib/studyPlan";
import { GlassCard } from "@/components/glass/GlassCard";
import { ProgressRing } from "@/components/glass/ProgressRing";

const EXAM_KEY = "exam:corpfin:date";
const CFG_KEY = "planner:config";
const DONE_KEY = "planner:done";

const WEEKDAYS = [
  ["Sun", 0],
  ["Mon", 1],
  ["Tue", 2],
  ["Wed", 3],
  ["Thu", 4],
  ["Fri", 5],
  ["Sat", 6],
] as const;

const FOCI: { id: PlanFocus; label: string }[] = [
  { id: "finance", label: "Corporate Finance" },
  { id: "cma", label: "CMA / Accounting" },
  { id: "cpa", label: "CPA sections" },
];

interface Config {
  weekdays: number[];
  minutesPerDay: number;
  focus: PlanFocus;
}

const DEFAULT_CFG: Config = { weekdays: [1, 2, 3, 4, 5], minutesPerDay: 45, focus: "finance" };

const TASK_ICON: Record<PlanTaskType, typeof BookOpen> = {
  learn: BookOpen,
  drill: Dumbbell,
  mock: Timer,
  review: RotateCcw,
};
const TASK_COLOR: Record<PlanTaskType, string> = {
  learn: "var(--primary)",
  drill: "var(--unit-3)",
  mock: "var(--status-streak)",
  review: "var(--status-done)",
};

function todayISO(): string {
  const d = new Date();
  const p = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export default function PlannerPage() {
  const hydrated = useHydratedStore();
  const events = useAttempts((s) => s.events);

  const [examDate, setExamDate] = useState("");
  const [cfg, setCfg] = useState<Config>(DEFAULT_CFG);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState(false);

  // Load persisted config + exam date + completion.
  useEffect(() => {
    try {
      setExamDate(localStorage.getItem(EXAM_KEY) ?? "");
      const raw = localStorage.getItem(CFG_KEY);
      if (raw) setCfg({ ...DEFAULT_CFG, ...JSON.parse(raw) });
      else setEditing(true);
      const d = localStorage.getItem(DONE_KEY);
      if (d) setDone(JSON.parse(d));
    } catch {
      /* ignore */
    }
  }, []);

  const saveExam = (v: string) => {
    setExamDate(v);
    try {
      localStorage.setItem(EXAM_KEY, v);
    } catch {
      /* ignore */
    }
  };
  const saveCfg = (next: Config) => {
    setCfg(next);
    try {
      localStorage.setItem(CFG_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };
  const toggleDay = (n: number) => {
    const set = new Set(cfg.weekdays);
    if (set.has(n)) set.delete(n);
    else set.add(n);
    saveCfg({ ...cfg, weekdays: [...set].sort((a, b) => a - b) });
  };
  const toggleTask = (key: string) => {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(DONE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  // Weakest 3 skill labels feed drill targeting.
  const weakLabels = useMemo(() => {
    if (!hydrated) return [];
    return masteryMap(events)
      .filter((m) => m.attempts >= 2 && m.accuracy < 0.7)
      .slice(0, 3)
      .map((m) => m.label);
  }, [events, hydrated]);

  const start = todayISO();
  const plan = useMemo(() => {
    if (!examDate) return [];
    return generateStudyPlan({
      startISO: start,
      examISO: examDate,
      weekdays: cfg.weekdays,
      minutesPerDay: cfg.minutesPerDay,
      focus: cfg.focus,
      weakLabels,
    });
  }, [examDate, start, cfg, weakLabels]);

  const summary = useMemo(() => summarizePlan(plan), [plan]);

  const daysLeft = useMemo(() => {
    if (!examDate) return null;
    const exam = new Date(`${examDate}T00:00:00`).getTime();
    if (!Number.isFinite(exam)) return null;
    return Math.ceil((exam - Date.now()) / 86_400_000);
  }, [examDate]);

  const totalTasks = plan.reduce((n, d) => n + d.tasks.length, 0);
  const doneTasks = plan.reduce(
    (n, d) => n + d.tasks.filter((_, ti) => done[`${d.dateISO}#${ti}`]).length,
    0
  );
  const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Hero */}
      <div
        className="relative overflow-hidden p-6 sm:p-7"
        style={{
          borderRadius: 26,
          background: "linear-gradient(120deg, rgba(37,99,235,0.94), rgba(13,148,136,0.92))",
          boxShadow: "0 28px 60px -24px rgba(20,90,140,0.7), inset 0 1px 0 rgba(255,255,255,0.28)",
        }}
      >
        <div className="relative">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
            <CalendarDays className="h-4 w-4" /> Study planner
          </div>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {examDate ? "Your plan to exam day" : "Build your plan to exam day"}
          </h1>
          <p className="mt-2 max-w-2xl text-white/85">
            {examDate
              ? `${daysLeft} days out · ${summary.studyDays} study days · ${summary.mockCount} timed mocks · ~${summary.totalHours}h total.`
              : "Set your exam date and how you study — I'll lay out a dated, day-by-day schedule that phases from learning into drilling and drops timed mocks along the way."}
          </p>
        </div>
      </div>

      {/* Setup */}
      {(editing || !examDate) && (
        <GlassCard className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">
                Exam date
              </label>
              <input
                type="date"
                value={examDate}
                min={start}
                onChange={(e) => saveExam(e.target.value)}
                className="glass h-11 w-full px-3 text-sm text-foreground outline-none"
                style={{ borderRadius: 12 }}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">
                Minutes per study day: <span className="text-primary">{cfg.minutesPerDay}</span>
              </label>
              <input
                type="range"
                min={15}
                max={180}
                step={15}
                value={cfg.minutesPerDay}
                onChange={(e) => saveCfg({ ...cfg, minutesPerDay: Number(e.target.value) })}
                className="mt-3 w-full accent-[hsl(var(--primary))]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Days you can study
            </label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map(([lbl, n]) => {
                const on = cfg.weekdays.includes(n);
                return (
                  <button
                    key={n}
                    onClick={() => toggleDay(n)}
                    className="rounded-xl px-3.5 py-2 text-sm font-medium transition"
                    style={
                      on
                        ? { background: "hsl(var(--primary) / 0.14)", color: "hsl(var(--primary))" }
                        : {
                            background: "hsl(var(--foreground) / 0.05)",
                            color: "hsl(var(--text-muted))",
                          }
                    }
                  >
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Focus</label>
            <div className="flex flex-wrap gap-2">
              {FOCI.map((f) => {
                const on = cfg.focus === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => saveCfg({ ...cfg, focus: f.id })}
                    className="rounded-xl px-4 py-2 text-sm font-medium transition"
                    style={
                      on
                        ? { background: "hsl(var(--primary) / 0.14)", color: "hsl(var(--primary))" }
                        : {
                            background: "hsl(var(--foreground) / 0.05)",
                            color: "hsl(var(--text-muted))",
                          }
                    }
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {examDate && (
            <div className="flex justify-end">
              <button
                onClick={() => setEditing(false)}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
              >
                Build my plan
              </button>
            </div>
          )}
        </GlassCard>
      )}

      {/* Plan */}
      {examDate && !editing && (
        <>
          <GlassCard className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-4">
              <ProgressRing pct={pct} size={64} />
              <div>
                <div className="font-display text-lg font-bold tracking-tight text-foreground">
                  {doneTasks} / {totalTasks} tasks done
                </div>
                <div className="text-xs text-text-muted">
                  {cfg.weekdays.length} days/week · {cfg.minutesPerDay} min/day ·{" "}
                  {FOCI.find((f) => f.id === cfg.focus)?.label}
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="glass glass-hover inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-muted"
              style={{ borderRadius: 12 }}
            >
              <Settings2 className="h-4 w-4" /> Edit
            </button>
          </GlassCard>

          {weakLabels.length > 0 && (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-foreground"
              style={{ background: "hsl(var(--primary) / 0.07)" }}
            >
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              Drills are targeted at your weak spots: <strong>{weakLabels.join(", ")}</strong>.
            </div>
          )}

          {plan.length === 0 ? (
            <GlassCard className="p-6 text-center text-sm text-text-muted">
              No study days land in that window — add more weekdays or move the exam date out.
            </GlassCard>
          ) : (
            <WeekGroups plan={plan} done={done} onToggle={toggleTask} todayIso={start} />
          )}
        </>
      )}
    </div>
  );
}

function WeekGroups({
  plan,
  done,
  onToggle,
  todayIso,
}: {
  plan: ReturnType<typeof generateStudyPlan>;
  done: Record<string, boolean>;
  onToggle: (key: string) => void;
  todayIso: string;
}) {
  const weeks = new Map<number, typeof plan>();
  for (const d of plan) {
    const arr = weeks.get(d.weekIndex) ?? [];
    arr.push(d);
    weeks.set(d.weekIndex, arr);
  }
  return (
    <div className="space-y-6">
      {[...weeks.entries()].map(([wi, days]) => (
        <div key={wi}>
          <h2 className="font-display mb-3 text-sm font-bold uppercase tracking-wider text-text-light">
            Week {wi + 1}
          </h2>
          <div className="space-y-3">
            {days.map((d) => {
              const isToday = d.dateISO === todayIso;
              return (
                <GlassCard
                  key={d.dateISO}
                  className="p-4 sm:p-5"
                  style={
                    isToday ? { boxShadow: "inset 0 0 0 2px hsl(var(--primary) / 0.5)" } : undefined
                  }
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-foreground">
                      {d.label}
                    </span>
                    {isToday && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary"
                        style={{ background: "hsl(var(--primary) / 0.14)" }}
                      >
                        Today
                      </span>
                    )}
                    {d.isMock && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: "hsl(var(--status-streak) / 0.14)",
                          color: "hsl(var(--status-streak))",
                        }}
                      >
                        Mock day
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {d.tasks.map((t, ti) => (
                      <TaskRow
                        key={ti}
                        task={t}
                        checked={!!done[`${d.dateISO}#${ti}`]}
                        onToggle={() => onToggle(`${d.dateISO}#${ti}`)}
                      />
                    ))}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskRow({
  task,
  checked,
  onToggle,
}: {
  task: PlanTask;
  checked: boolean;
  onToggle: () => void;
}) {
  const Icon = TASK_ICON[task.type];
  const color = TASK_COLOR[task.type];
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        aria-label={checked ? "Mark not done" : "Mark done"}
        className="shrink-0"
        style={{ color: checked ? "hsl(var(--status-done))" : "hsl(var(--text-light))" }}
      >
        <CheckCircle2
          className="h-5 w-5"
          style={checked ? { fill: "hsl(var(--status-done) / 0.15)" } : undefined}
        />
      </button>
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div
          className={`truncate text-sm font-medium ${checked ? "text-text-light line-through" : "text-foreground"}`}
        >
          {task.title}
        </div>
        <div className="text-xs text-text-light">{task.minutes} min</div>
      </div>
      <Link
        href={task.href}
        className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary"
        style={{ background: "hsl(var(--primary) / 0.1)" }}
      >
        Start →
      </Link>
    </div>
  );
}
