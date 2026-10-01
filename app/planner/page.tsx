"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Dumbbell, RotateCcw, Settings2, Timer } from "lucide-react";
import { useHydratedStore } from "@/lib/hooks";
import { useAttempts, DEFAULT_EXAM_TARGET } from "@/lib/store";
import { masteryMap } from "@/lib/mastery";
import {
  buildExamTimeline,
  generateStudyPlan,
  summarizePlan,
  type PlanFocus,
  type PlanTask,
  type PlanTaskType,
} from "@/lib/studyPlan";
import { TitleBlock } from "@/components/sheet/TitleBlock";
import { StateGlyph } from "@/components/sheet/StateGlyph";
import { ActionBar } from "@/components/sheet/ActionBar";

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
      // Fall back to the committed sitting so the plan is populated on a fresh
      // device instead of showing an empty schedule.
      setExamDate(localStorage.getItem(EXAM_KEY) || DEFAULT_EXAM_TARGET.examDate);
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

  // Exam-date-driven backward pass (M-1E). CMA is the only focus with an
  // IMA-published blueprint, so it is the only one that gets coverage blocks;
  // the window + hours check is useful for any focus.
  const timeline = useMemo(() => {
    if (!examDate) return null;
    return buildExamTimeline({
      startISO: start,
      examISO: examDate,
      sectionId: cfg.focus === "cma" ? "cma-p1" : cfg.focus,
      weekdays: cfg.weekdays,
      minutesPerDay: cfg.minutesPerDay,
    });
  }, [examDate, start, cfg]);

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
      <TitleBlock
        eyebrow="Study planner"
        title={examDate ? "Your plan to exam day" : "Build your plan to exam day"}
        subtitle={
          examDate
            ? undefined
            : "Set your exam date and how you study — I'll lay out a dated, day-by-day schedule that phases from learning into drilling and drops timed mocks along the way."
        }
        meta={
          examDate
            ? [
                { label: "Days out", value: daysLeft != null ? String(daysLeft) : "—" },
                { label: "Study days", value: String(summary.studyDays) },
                { label: "Timed mocks", value: String(summary.mockCount) },
                { label: "Total hours", value: `~${summary.totalHours}h` },
              ]
            : undefined
        }
      />

      {/* Exam-date reality check: IMA window + hours feasibility + phase blocks */}
      {timeline && (
        <div
          className="space-y-4 p-5 sm:p-6"
          style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
        >
          <div className="blueprint-label">Exam-date reality check</div>

          {!timeline.window.inWindow && (
            <div className="flex items-start gap-2 p-3 text-sm">
              <StateGlyph state="bad" />
              <p>{timeline.window.note}</p>
            </div>
          )}

          {timeline.warnings.map((w) => (
            <div key={w} className="flex items-start gap-2 p-3 text-sm">
              <StateGlyph state="warn" />
              <p>{w}</p>
            </div>
          ))}

          <div className="flex items-start gap-2 p-3 text-sm">
            <StateGlyph state={timeline.feasibility.feasible ? "good" : "bad"} />
            <p>{timeline.feasibility.verdict}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <div className="blueprint-label">Weeks left</div>
              <div className="ledger-number font-semibold">
                {timeline.feasibility.weeksRemaining}
              </div>
            </div>
            <div>
              <div className="blueprint-label">Needed / wk</div>
              <div className="ledger-number font-semibold">
                {timeline.feasibility.requiredHoursPerWeek}h
              </div>
            </div>
            <div>
              <div className="blueprint-label">Planned / wk</div>
              <div className="ledger-number font-semibold">
                {timeline.feasibility.plannedHoursPerWeek}h
              </div>
            </div>
            <div>
              <div className="blueprint-label">Anchor</div>
              <div className="ledger-number font-semibold">
                {timeline.feasibility.requiredHours}h
              </div>
            </div>
          </div>

          {timeline.phases.length > 0 && (
            <ul className="space-y-1.5 text-sm">
              {timeline.phases.map((ph) => (
                <li key={ph.startISO} className="flex items-baseline justify-between gap-3">
                  <span>{ph.label}</span>
                  <span className="ledger-number shrink-0 text-xs text-muted-foreground">
                    {ph.weeks}w · {ph.startISO} → {ph.endISO}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Setup */}
      {(editing || !examDate) && (
        <div
          className="space-y-5 p-5 sm:p-6"
          style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
        >
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
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">
                Minutes per study day: <span className="ledger-number">{cfg.minutesPerDay}</span>
              </label>
              <input
                type="range"
                min={15}
                max={180}
                step={15}
                value={cfg.minutesPerDay}
                onChange={(e) => saveCfg({ ...cfg, minutesPerDay: Number(e.target.value) })}
                className="mt-3 w-full accent-[hsl(var(--foreground))]"
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
                    className="px-3.5 py-2 text-sm font-medium transition"
                    style={
                      on
                        ? {
                            background: "hsl(var(--foreground))",
                            color: "hsl(var(--background))",
                            borderRadius: 2,
                          }
                        : {
                            background: "hsl(var(--foreground) / 0.05)",
                            color: "hsl(var(--text-muted))",
                            borderRadius: 2,
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
                    className="px-4 py-2 text-sm font-medium transition"
                    style={
                      on
                        ? {
                            background: "hsl(var(--foreground))",
                            color: "hsl(var(--background))",
                            borderRadius: 2,
                          }
                        : {
                            background: "hsl(var(--foreground) / 0.05)",
                            color: "hsl(var(--text-muted))",
                            borderRadius: 2,
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
              <ActionBar primary={{ label: "Build my plan", onClick: () => setEditing(false) }} />
            </div>
          )}
        </div>
      )}

      {/* Plan */}
      {examDate && !editing && (
        <>
          <div
            className="flex items-center justify-between gap-4 p-5"
            style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
          >
            <div className="flex items-center gap-4">
              <div>
                <div className="blueprint-label">Progress</div>
                <div className="ledger-number text-3xl font-semibold">{pct}%</div>
              </div>
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
            >
              <Settings2 className="h-4 w-4" /> Edit
            </button>
          </div>

          {weakLabels.length > 0 && (
            <div
              className="flex items-start gap-2 p-4 text-sm text-foreground"
              style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
            >
              <StateGlyph state="ref" />
              <p>
                Drills are targeted at your weak spots: <strong>{weakLabels.join(", ")}</strong>.
              </p>
            </div>
          )}

          {plan.length === 0 ? (
            <div
              className="p-6 text-center text-sm text-text-muted"
              style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
            >
              No study days land in that window — add more weekdays or move the exam date out.
            </div>
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
                <div
                  key={d.dateISO}
                  className="p-4 sm:p-5"
                  style={{
                    border: isToday
                      ? "1px solid hsl(var(--foreground))"
                      : "1px solid hsl(var(--border))",
                    borderRadius: 2,
                  }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-foreground">
                      {d.label}
                    </span>
                    {isToday && <span className="blueprint-label">Today</span>}
                    {d.isMock && (
                      <span
                        className="blueprint-label px-2 py-0.5"
                        style={{
                          border: "1px solid hsl(var(--foreground) / 0.3)",
                          borderRadius: 2,
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
                </div>
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
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        aria-label={checked ? "Mark not done" : "Mark done"}
        className="shrink-0"
        style={{ color: checked ? "hsl(var(--good))" : "hsl(var(--text-light))" }}
      >
        <CheckCircle2
          className="h-5 w-5"
          style={checked ? { fill: "hsl(var(--good) / 0.15)" } : undefined}
        />
      </button>
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center"
        style={{ background: "hsl(var(--foreground) / 0.06)", borderRadius: 2 }}
      >
        <Icon className="h-4 w-4" style={{ color: "hsl(var(--foreground))" }} />
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
        className="shrink-0 px-3 py-1.5 text-xs font-semibold text-foreground"
        style={{ border: "1px solid hsl(var(--foreground) / 0.3)", borderRadius: 2 }}
      >
        Start →
      </Link>
    </div>
  );
}
