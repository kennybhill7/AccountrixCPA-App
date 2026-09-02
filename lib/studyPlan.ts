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

import { areasForSection, type BlueprintArea } from "./examSections";

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

/* ===========================================================================
 * EXAM-DATE-DRIVEN PLANNING (M-1E)
 * ---------------------------------------------------------------------------
 * Everything above lays out day-by-day tasks. Everything below works BACKWARD
 * from a real exam date: which IMA window it falls in, what the phase structure
 * has to be, whether the hours even fit, and which blueprint area the next
 * drill should come from.
 * ======================================================================== */

/**
 * IMA CMA testing windows — VERIFIED 2026-09-02.
 * Source: IMA, "How to earn the CMA Certification",
 *   https://www.imaglobal.org/certifications/cma/how-to
 *   ("...testing windows are offered in January and February, May and June,
 *   and September and October.")
 * Corroborated by the CMA Handbook's testing-window/transfer language,
 *   https://prodcm.sfmagazine.com/-/media/IMA/Files/Home/IMA-Certifications/
 *   CMA-Certification/CMA-Handbook-3132024.ashx
 *
 * NOTE FOR 2027 PLANNING: IMA had not published dated 2027 windows as of
 * 2026-09-02. These are the recurring MONTHS, stable for years. Confirm exact
 * 2027 dates with IMA before paying for a registration.
 * Consequence: **July is NOT an IMA testing window.** A July 2027 target is not
 * sittable; isImaTestingWindow() returns false and names the real windows.
 */
export const IMA_TESTING_WINDOWS: { label: string; months: number[] }[] = [
  { label: "January/February", months: [1, 2] },
  { label: "May/June", months: [5, 6] },
  { label: "September/October", months: [9, 10] },
];

export interface TestingWindowCheck {
  /** true when the date's month is inside a published IMA window */
  inWindow: boolean;
  /** the window it falls in, or null */
  windowLabel: string | null;
  /** the next window at/after this date, for the "you must move it" message */
  nextWindowLabel: string;
  /** plain-language explanation, safe to render directly */
  note: string;
}

/** Is this date inside an IMA CMA testing window? */
export function isImaTestingWindow(examISO: string): TestingWindowCheck {
  const month = isoToDate(examISO).getMonth() + 1;
  const hit = IMA_TESTING_WINDOWS.find((w) => w.months.includes(month)) ?? null;
  // Next window whose first month is >= this month; wraps to Jan/Feb.
  const next = IMA_TESTING_WINDOWS.find((w) => w.months[0] >= month) ?? IMA_TESTING_WINDOWS[0];

  if (hit) {
    return {
      inWindow: true,
      windowLabel: hit.label,
      nextWindowLabel: hit.label,
      note: `${examISO} falls in the ${hit.label} IMA testing window.`,
    };
  }
  return {
    inWindow: false,
    windowLabel: null,
    nextWindowLabel: next.label,
    note:
      `${examISO} is NOT in an IMA testing window. The CMA exam is offered only in ` +
      `January/February, May/June, and September/October. Move the target into the ` +
      `${next.label} window.`,
  };
}

/**
 * Study-hours anchor per CMA part.
 *
 * PROVENANCE — **UNVERIFIED AGAINST A PRIMARY IMA SOURCE. Treat as a planning
 * assumption, not an IMA rule.** Checked 2026-09-02:
 *   - The CMA Handbook (https://prodcm.sfmagazine.com/-/media/IMA/Files/Home/
 *     IMA-Certifications/CMA-Certification/CMA-Handbook-3132024.ashx) contains
 *     NO study-hours recommendation — its full text was extracted and searched.
 *   - The Sept 1 2024 Content Specification Outlines carry no hours figure.
 *   - IMA's own article "How Long Does It Take to Pass the CMA Exam"
 *     (imanet.org/.../2022/8/4/how-long-does-it-take-to-pass-the-cma-exam) now
 *     301-redirects to https://www.imaglobal.org/ — the content is gone, so its
 *     figure could not be read first-hand.
 *   - Third-party review providers do NOT agree with each other: 150–170 h per
 *     part, 170 h for Part 1 and 130 h for Part 2, and 240–300 h per part are
 *     all in circulation.
 *
 * 300 h/part is therefore a deliberately CONSERVATIVE default (top of the
 * observed range) so the feasibility check errs toward warning the candidate
 * rather than flattering him. Override via ExamTimelineOpts.requiredHours once
 * a citable IMA figure is in hand.
 */
export const DEFAULT_EXAM_HOURS_PER_PART = 300;

export type PhaseKind = "first-pass" | "coverage" | "exam-mode";

export interface PlanPhase {
  kind: PhaseKind;
  label: string;
  /** inclusive yyyy-mm-dd */
  startISO: string;
  /** inclusive yyyy-mm-dd */
  endISO: string;
  weeks: number;
  days: number;
  /** coverage phases only: the IMA blueprint area this block covers */
  areaId?: string;
  areaLabel?: string;
  /** coverage phases only: the official IMA weight (0.25 = 25%) */
  areaWeight?: number;
}

export interface ExamFeasibility {
  /** exact weeks from start to exam, 1 decimal */
  weeksRemaining: number;
  /** the hours anchor in force */
  requiredHours: number;
  /** hours/week needed to hit the anchor in the time left */
  requiredHoursPerWeek: number;
  /** hours/week the configured schedule actually supplies */
  plannedHoursPerWeek: number;
  plannedTotalHours: number;
  feasible: boolean;
  /** hours short of the anchor; 0 when feasible */
  shortfallHours: number;
  /** plain-language verdict — render this, do not re-derive it */
  verdict: string;
}

export interface ExamTimelineOpts {
  startISO: string;
  examISO: string;
  /** which section's blueprint drives the coverage blocks, e.g. "cma-p1" */
  sectionId: string;
  /** available weekdays, 0=Sun … 6=Sat — drives the hours check */
  weekdays: number[];
  minutesPerDay: number;
  /** length of the closing exam-mode block; default 8 weeks */
  examModeWeeks?: number;
  /** share of the pre-exam-mode time given to the first pass; default 0.2 */
  firstPassShare?: number;
  /** hours anchor; default DEFAULT_EXAM_HOURS_PER_PART */
  requiredHours?: number;
}

export interface ExamTimeline {
  phases: PlanPhase[];
  feasibility: ExamFeasibility;
  window: TestingWindowCheck;
  /** whole weeks available start→exam */
  totalWeeks: number;
  /** areas that got zero coverage weeks because the window is too short */
  unallocatedAreas: string[];
  /**
   * Non-fatal problems the caller must surface. Empty means the plan is sound.
   * An unknown sectionId used to fail OPEN here: coverage blocks silently
   * vanished, exam mode absorbed the whole window, and unallocatedAreas came
   * back empty — a plan that looked fine and taught nothing in blueprint order.
   */
  warnings: string[];
}

function daysInclusive(startISO: string, examISO: string): number {
  const ms = isoToDate(examISO).getTime() - isoToDate(startISO).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

/**
 * Split N whole weeks across blueprint areas in proportion to their official
 * IMA weights, using largest-remainder so the parts sum to N exactly — no
 * silent rounding drift, no area quietly collecting an extra week.
 */
export function allocateWeeksByWeight(
  areas: BlueprintArea[],
  totalWeeks: number
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const a of areas) out[a.id] = 0;
  if (areas.length === 0 || totalWeeks <= 0) return out;

  const weightSum = areas.reduce((s, a) => s + a.weight, 0) || 1;
  const exact = areas.map((a) => ({ id: a.id, q: (a.weight / weightSum) * totalWeeks }));
  let used = 0;
  for (const e of exact) {
    out[e.id] = Math.floor(e.q);
    used += out[e.id];
  }
  // Hand leftover weeks to the largest fractional remainders; ties break by the
  // areas' declared order so the result is deterministic.
  const order = exact
    .map((e, i) => ({ id: e.id, rem: e.q - Math.floor(e.q), i }))
    .sort((a, b) => b.rem - a.rem || a.i - b.i);
  let leftover = totalWeeks - used;
  for (let k = 0; leftover > 0; k++, leftover--) out[order[k % order.length].id] += 1;
  return out;
}

/**
 * Backward pass from the exam date.
 *
 * Structure, reading forward:
 *   [ first pass ] → [ coverage blocks, one per IMA area, weighted ] → [ exam mode ]
 *
 * The exam-mode block is carved off the END first (it is the non-negotiable
 * part), then the first pass, then whatever remains is distributed across the
 * blueprint areas by their official weights. Exam mode absorbs any leftover
 * days so the phases tile the window exactly and end on the exam date.
 */
export function buildExamTimeline(opts: ExamTimelineOpts): ExamTimeline {
  const window = isImaTestingWindow(opts.examISO);
  const requiredHours = opts.requiredHours ?? DEFAULT_EXAM_HOURS_PER_PART;
  const mpd = Math.max(0, Math.round(opts.minutesPerDay));
  const plannedHoursPerWeek = Math.round(((opts.weekdays.length * mpd) / 60) * 10) / 10;

  const totalDays = daysInclusive(opts.startISO, opts.examISO);
  const weeksRemaining = Math.round((totalDays / 7) * 10) / 10;
  const plannedTotalHours = Math.round(plannedHoursPerWeek * (totalDays / 7));
  const requiredHoursPerWeek =
    totalDays > 0 ? Math.round((requiredHours / (totalDays / 7)) * 10) / 10 : Infinity;

  const feasible = totalDays > 0 && plannedTotalHours >= requiredHours;
  const shortfallHours = feasible ? 0 : Math.max(0, requiredHours - Math.max(0, plannedTotalHours));

  let verdict: string;
  if (totalDays <= 0) {
    verdict =
      `The exam date ${opts.examISO} is on or before the start date ${opts.startISO}. ` +
      `There is no plan to build.`;
  } else if (feasible) {
    verdict =
      `Workable: ${weeksRemaining} weeks x ${plannedHoursPerWeek} h/wk = ${plannedTotalHours} h ` +
      `against a ${requiredHours} h anchor (needs ${requiredHoursPerWeek} h/wk).`;
  } else {
    const needMinutes = Math.ceil((requiredHoursPerWeek * 60) / Math.max(1, opts.weekdays.length));
    verdict =
      `THIS PLAN CANNOT WORK AS CONFIGURED. ${weeksRemaining} weeks at ${plannedHoursPerWeek} h/wk ` +
      `yields ${plannedTotalHours} h, which is ${shortfallHours} h short of the ${requiredHours} h ` +
      `anchor. You need ${requiredHoursPerWeek} h/wk — that is ${needMinutes} min/day across ` +
      `${opts.weekdays.length} study day(s)/week. Add study days, raise minutes/day, or move the ` +
      `exam to a later IMA window.`;
  }

  const feasibility: ExamFeasibility = {
    weeksRemaining: Math.max(0, weeksRemaining),
    requiredHours,
    requiredHoursPerWeek,
    plannedHoursPerWeek,
    plannedTotalHours: Math.max(0, plannedTotalHours),
    feasible,
    shortfallHours,
    verdict,
  };

  if (totalDays <= 0) {
    return {
      phases: [],
      feasibility,
      window,
      totalWeeks: 0,
      unallocatedAreas: [],
      warnings: [],
    };
  }

  const areas = areasForSection(opts.sectionId);
  const warnings: string[] = [];
  if (areas.length === 0) {
    warnings.push(
      `No blueprint areas are defined for sectionId "${opts.sectionId}". The plan has ` +
        `NO weighted coverage blocks — every week outside the first pass falls into exam ` +
        `mode. Use "cma-p1" or "cma-p2".`
    );
  }
  const totalWeeks = Math.floor(totalDays / 7);
  const examModeWeeks = Math.min(Math.max(0, opts.examModeWeeks ?? 8), totalWeeks);
  const spare = totalWeeks - examModeWeeks;
  const firstPassShare = opts.firstPassShare ?? 0.2;
  const firstPassWeeks = spare >= 2 ? Math.max(1, Math.round(spare * firstPassShare)) : 0;
  const coverageWeeks = spare - firstPassWeeks;

  const alloc = allocateWeeksByWeight(areas, coverageWeeks);
  const unallocatedAreas = areas.filter((a) => (alloc[a.id] ?? 0) === 0).map((a) => a.label);

  const phases: PlanPhase[] = [];
  let cursor = isoToDate(opts.startISO);
  const exam = isoToDate(opts.examISO);

  const pushPhase = (kind: PhaseKind, label: string, weeks: number, area?: BlueprintArea) => {
    if (weeks <= 0) return;
    const start = new Date(cursor);
    const end = addDays(start, weeks * 7 - 1);
    phases.push({
      kind,
      label,
      startISO: toISO(start),
      endISO: toISO(end),
      weeks,
      days: weeks * 7,
      ...(area ? { areaId: area.id, areaLabel: area.label, areaWeight: area.weight } : {}),
    });
    cursor = addDays(end, 1);
  };

  pushPhase("first-pass", "First pass — read the whole blueprint end to end", firstPassWeeks);
  for (const area of areas) {
    pushPhase(
      "coverage",
      `${area.letter}. ${area.label} (${Math.round(area.weight * 100)}% of the exam)`,
      alloc[area.id] ?? 0,
      area
    );
  }

  // Exam mode closes the window and absorbs any remainder days, so the phases
  // always end exactly on the exam date.
  if (cursor <= exam) {
    const days = Math.round((exam.getTime() - cursor.getTime()) / 86_400_000) + 1;
    phases.push({
      kind: "exam-mode",
      label: "Exam mode — timed mocks, case-based questions, weak-area drilling",
      startISO: toISO(cursor),
      endISO: toISO(exam),
      weeks: Math.round((days / 7) * 10) / 10,
      days,
    });
  }

  return { phases, feasibility, window, totalWeeks, unallocatedAreas, warnings };
}

/* ---------------------------------------------------------------------------
 * BLUEPRINT-WEIGHTED DRILL SELECTION
 * ------------------------------------------------------------------------ */

export interface DrillMixOpts {
  /** blueprint areas to draw from */
  areas: BlueprintArea[];
  /** items already drilled, keyed by area id */
  observed?: Record<string, number>;
  /**
   * measured weakness per area, 0 (mastered) … 1 (cold). Derive from readiness
   * as `1 - readiness/100`. Missing areas are treated as 0 weakness.
   */
  weakness?: Record<string, number>;
  /**
   * how far weakness may bend the mix away from the blueprint.
   * 0 = pure blueprint; 1 = a totally cold area gets double its blueprint share
   * before renormalisation. Default 0.5.
   */
  weaknessBoost?: number;
}

/**
 * The mix the drill stream should converge on: official blueprint weights,
 * tilted toward measured weakness, renormalised to 1.
 *
 * With weaknessBoost = 0 (or no weakness data) this returns the IMA blueprint
 * weights unchanged — the exam blueprint is the default, and weakness is a tilt
 * on top of it, never a replacement for it.
 */
export function targetDrillMix(opts: DrillMixOpts): Record<string, number> {
  const boost = opts.weaknessBoost ?? 0.5;
  const weakness = opts.weakness ?? {};
  const raw = opts.areas.map((a) => {
    const w = Math.min(1, Math.max(0, weakness[a.id] ?? 0));
    return { id: a.id, v: a.weight * (1 + boost * w) };
  });
  const sum = raw.reduce((s, r) => s + r.v, 0);
  const out: Record<string, number> = {};
  for (const r of raw) out[r.id] = sum > 0 ? r.v / sum : 0;
  return out;
}

/** Observed share per area from raw counts (sums to 1, or all zeros when empty). */
export function observedDrillMix(
  areas: BlueprintArea[],
  observed: Record<string, number> = {}
): Record<string, number> {
  const total = areas.reduce((s, a) => s + (observed[a.id] ?? 0), 0);
  const out: Record<string, number> = {};
  for (const a of areas) out[a.id] = total > 0 ? (observed[a.id] ?? 0) / total : 0;
  return out;
}

/**
 * Pick the area the NEXT practice item should come from.
 *
 * Largest-deficit apportionment: for each area compare the count it *should*
 * hold once one more item is drawn (target share x (n+1)) against what it
 * actually holds, and serve the biggest shortfall. Repeated application drives
 * the observed mix to the target mix, with no area ever more than about one
 * item off its fair share. Deterministic: ties break by declared area order.
 */
export function nextDrillArea(opts: DrillMixOpts): string | null {
  if (opts.areas.length === 0) return null;
  const target = targetDrillMix(opts);
  const observed = opts.observed ?? {};
  const n = opts.areas.reduce((s, a) => s + (observed[a.id] ?? 0), 0);

  let bestId: string | null = null;
  let bestDeficit = -Infinity;
  for (const a of opts.areas) {
    const deficit = target[a.id] * (n + 1) - (observed[a.id] ?? 0);
    if (deficit > bestDeficit + 1e-9) {
      bestDeficit = deficit;
      bestId = a.id;
    }
  }
  return bestId;
}

/**
 * Roll nextDrillArea forward `count` times, returning the ordered area ids.
 * Useful for previewing a session and for asserting convergence in tests.
 */
export function planDrillSequence(count: number, opts: DrillMixOpts): string[] {
  const observed: Record<string, number> = { ...(opts.observed ?? {}) };
  const seq: string[] = [];
  for (let i = 0; i < Math.max(0, count); i++) {
    const id = nextDrillArea({ ...opts, observed });
    if (!id) break;
    seq.push(id);
    observed[id] = (observed[id] ?? 0) + 1;
  }
  return seq;
}
