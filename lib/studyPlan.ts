/**
 * Study-plan generator — the Becker-style "customizable study planner": given an
 * exam date, the weekdays you can study, and minutes/day, it lays out a dated,
 * day-by-day schedule from today to the exam. The plan phases itself — learn-led
 * early, drill-led later — drops periodic timed mock checkpoints, and ends on a
 * full mock + review the day before the exam.
 *
 * Pure and deterministic given its options (dates passed in as ISO strings, no
 * Date.now()) so it is unit-testable; the page supplies today + weak-area labels.
 */

export type PlanFocus = "finance" | "cma" | "cpa";
export type PlanTaskType = "learn" | "drill" | "mock" | "review";

export interface PlanTask {
  type: PlanTaskType;
  title: string;
  minutes: number;
  href: string;
}

export interface PlanDay {
  /** yyyy-mm-dd */
  dateISO: string;
  /** e.g. "Mon Jul 28" */
  label: string;
  /** 0-based week bucket from the start date */
  weekIndex: number;
  isMock: boolean;
  tasks: PlanTask[];
}

export interface StudyPlanOpts {
  /** today, yyyy-mm-dd */
  startISO: string;
  /** exam day, yyyy-mm-dd */
  examISO: string;
  /** available weekdays, 0=Sun … 6=Sat */
  weekdays: number[];
  minutesPerDay: number;
  focus: PlanFocus;
  /** optional weak-area labels (from mastery) to target drills at */
  weakLabels?: string[];
}

const TOPICS: Record<PlanFocus, { label: string; href: string }[]> = {
  finance: [
    { label: "Time Value of Money", href: "/finance" },
    { label: "Bond Valuation", href: "/finance" },
    { label: "Cost of Capital (WACC)", href: "/finance" },
    { label: "Capital Budgeting (NPV/IRR)", href: "/finance" },
    { label: "Risk & Return (CAPM)", href: "/finance" },
    { label: "Stock Valuation", href: "/finance" },
    { label: "Ratio & DuPont Analysis", href: "/finance" },
  ],
  cma: [
    { label: "Financial Statements", href: "/learn" },
    { label: "Cost-Volume-Profit", href: "/learn" },
    { label: "Cost Behavior & Allocation", href: "/learn" },
    { label: "Performance & ROI", href: "/learn" },
    { label: "Depreciation & Inventory", href: "/learn" },
    { label: "Ratio Analysis", href: "/learn" },
  ],
  cpa: [
    { label: "FAR — Financial Reporting", href: "/cpa" },
    { label: "AUD — Auditing", href: "/cpa" },
    { label: "REG — Regulation & Tax", href: "/cpa" },
    { label: "BAR — Business Analysis", href: "/cpa" },
    { label: "ISC — Information Systems", href: "/cpa" },
    { label: "TCP — Tax Compliance", href: "/cpa" },
  ],
};

const DRILL_HREF: Record<PlanFocus, string> = {
  finance: "/practice",
  cma: "/practice",
  cpa: "/crossover",
};

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}
function isoToDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}
function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function labelFor(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

/** Enumerate available study dates (inclusive) between start and exam. */
export function studyDates(startISO: string, examISO: string, weekdays: number[]): Date[] {
  const start = isoToDate(startISO);
  const exam = isoToDate(examISO);
  if (!(exam >= start) || weekdays.length === 0) return [];
  const days: Date[] = [];
  for (let d = new Date(start); d <= exam; d = addDays(d, 1)) {
    if (weekdays.includes(d.getDay())) days.push(new Date(d));
  }
  return days;
}

export function generateStudyPlan(opts: StudyPlanOpts): PlanDay[] {
  const mpd = Math.max(10, Math.round(opts.minutesPerDay));
  const days = studyDates(opts.startISO, opts.examISO, opts.weekdays);
  if (days.length === 0) return [];

  const topics = TOPICS[opts.focus];
  const drillHref = DRILL_HREF[opts.focus];
  const start = isoToDate(opts.startISO);
  const n = days.length;
  const weak = (opts.weakLabels ?? []).filter(Boolean);

  return days.map((date, i) => {
    const isLast = i === n - 1;
    const phase = n > 1 ? i / (n - 1) : 1; // 0 = start, 1 = exam
    const weekIndex = Math.floor(Math.round((date.getTime() - start.getTime()) / 86_400_000) / 7);
    // Mock checkpoints: every 5th study day once past the first few, plus the finale.
    const isMock = isLast || (i >= 3 && i % 5 === 4);

    const tasks: PlanTask[] = [];
    if (isLast) {
      tasks.push({
        type: "mock",
        title: "Full timed mock exam",
        minutes: Math.max(mpd, 45),
        href: "/exam",
      });
      tasks.push({
        type: "review",
        title: "Review every miss + weak spots",
        minutes: 30,
        href: "/mistakes",
      });
    } else if (isMock) {
      const mockMin = Math.round(mpd * 0.7);
      tasks.push({
        type: "mock",
        title: "Timed mock — checkpoint",
        minutes: mockMin,
        href: "/exam",
      });
      tasks.push({
        type: "review",
        title: "Review misses from the mock",
        minutes: mpd - mockMin,
        href: "/mistakes",
      });
    } else {
      const learnFrac = phase < 0.5 ? 0.5 : phase < 0.8 ? 0.35 : 0.2;
      const learnMin = Math.round(mpd * learnFrac);
      const drillMin = mpd - learnMin;
      const topic = topics[i % topics.length];
      if (learnMin >= 5) {
        tasks.push({
          type: "learn",
          title: `Study: ${topic.label}`,
          minutes: learnMin,
          href: topic.href,
        });
      }
      const drillLabel = weak.length ? weak[i % weak.length] : topic.label;
      tasks.push({
        type: "drill",
        title: `Drill: ${drillLabel}`,
        minutes: drillMin || mpd,
        href: drillHref,
      });
    }

    return { dateISO: toISO(date), label: labelFor(date), weekIndex, isMock, tasks };
  });
}

export interface PlanSummary {
  studyDays: number;
  mockCount: number;
  totalMinutes: number;
  totalHours: number;
}

export function summarizePlan(plan: PlanDay[]): PlanSummary {
  const totalMinutes = plan.reduce((sum, d) => sum + d.tasks.reduce((s, t) => s + t.minutes, 0), 0);
  return {
    studyDays: plan.length,
    mockCount: plan.filter((d) => d.isMock).length,
    totalMinutes,
    totalHours: Math.round(totalMinutes / 60),
  };
}
