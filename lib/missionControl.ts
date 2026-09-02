/**
 * Mission Control — weighted cross-track daily planner.
 *
 * Turns the strategic lane weights (default CMA/controller 45%, CPA 30%,
 * Finance 20%, CFO 5%) and a daily time budget into a balanced study plan —
 * minutes per lane plus a review slice. It does NOT ask "which track?"; it
 * prescribes the mix. Item selection (which lesson/drill fills each block) is
 * supplied by the caller via `pickNext`, keeping this module pure and testable.
 */

export type Lane = "cma" | "cpa" | "finance" | "cfo";

export const LANES: Lane[] = ["cma", "cpa", "finance", "cfo"];

export interface LaneWeights {
  cma: number;
  cpa: number;
  finance: number;
  cfo: number;
}

/** Owner default mix (PRODUCT_MASTER_PLAN §11): 45 / 30 / 20 / 5. */
export const DEFAULT_WEIGHTS: LaneWeights = {
  cma: 0.45,
  cpa: 0.3,
  finance: 0.2,
  cfo: 0.05,
};

export interface PlanOptions {
  /** minutes reserved for spaced-repetition / missed-item review */
  reviewMinutes?: number;
  /** round each block to this many minutes */
  roundTo?: number;
  /** drop a lane whose block falls below this many minutes */
  minBlock?: number;
}

export interface LaneBlock {
  lane: Lane;
  minutes: number;
}

export interface DayPlan {
  lanes: LaneBlock[];
  reviewMinutes: number;
  totalMinutes: number;
}

function normalize(w: LaneWeights): LaneWeights {
  const sum = w.cma + w.cpa + w.finance + w.cfo;
  if (sum <= 0) throw new Error("weights must sum to a positive number");
  return { cma: w.cma / sum, cpa: w.cpa / sum, finance: w.finance / sum, cfo: w.cfo / sum };
}

/**
 * Allocate a daily plan. Works in `roundTo` units and uses largest-remainder
 * apportionment so the blocks + review always sum exactly to totalMinutes.
 */
export function planDay(
  totalMinutes: number,
  weights: LaneWeights = DEFAULT_WEIGHTS,
  opts: PlanOptions = {}
): DayPlan {
  const reviewWanted = opts.reviewMinutes ?? 5;
  const roundTo = opts.roundTo ?? 5;
  const minBlock = opts.minBlock ?? 5;
  if (totalMinutes <= 0) return { lanes: [], reviewMinutes: 0, totalMinutes: 0 };

  const review = Math.min(reviewWanted, totalMinutes);
  const study = totalMinutes - review;
  const w = normalize(weights);
  const totalUnits = Math.floor(study / roundTo);

  // largest-remainder apportionment of whole units across lanes
  const ideal = LANES.map((l) => ({ lane: l, exact: w[l] * totalUnits }));
  const floors = ideal.map((x) => ({
    ...x,
    units: Math.floor(x.exact),
    frac: x.exact - Math.floor(x.exact),
  }));
  let remaining = totalUnits - floors.reduce((s, x) => s + x.units, 0);
  floors
    .slice()
    .sort((a, b) => b.frac - a.frac)
    .forEach((x) => {
      if (remaining > 0) {
        floors.find((f) => f.lane === x.lane)!.units += 1;
        remaining -= 1;
      }
    });

  let blocks: LaneBlock[] = floors
    .map((x) => ({ lane: x.lane, minutes: x.units * roundTo }))
    .filter((b) => b.minutes >= minBlock);

  // absorb the sub-roundTo remainder into review so the day ties exactly
  const allocated = blocks.reduce((s, b) => s + b.minutes, 0);
  const reviewMinutes = totalMinutes - allocated;

  // keep blocks in weight order (largest first) for display
  blocks = blocks.sort((a, b) => b.minutes - a.minutes);

  return { lanes: blocks, reviewMinutes, totalMinutes };
}

export interface SessionItem {
  lane: Lane | "review";
  minutes: number;
  /** caller-provided label, e.g. "CMA — WIP / over-under billing" */
  label?: string;
}

/**
 * Build the ordered session list for a day. `pickNext(lane, minutes)` returns a
 * label for what to study in that block (e.g. the next weak-skill item) — or
 * undefined to leave it unlabeled. The review block is appended last.
 */
export function buildSessions(
  plan: DayPlan,
  pickNext?: (lane: Lane, minutes: number) => string | undefined
): SessionItem[] {
  const sessions: SessionItem[] = plan.lanes.map((b) => ({
    lane: b.lane,
    minutes: b.minutes,
    label: pickNext ? pickNext(b.lane, b.minutes) : undefined,
  }));
  if (plan.reviewMinutes > 0) {
    sessions.push({
      lane: "review",
      minutes: plan.reviewMinutes,
      label: "Review — missed items / flashcards",
    });
  }
  return sessions;
}

export interface WeeklyPlanDay {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  focus: string;
  href: string;
}

export interface WeeklyOperatingPlan {
  hours: number;
  minutesPerDay: number;
  days: WeeklyPlanDay[];
}

export interface WeeklyOperatingPlanOptions {
  hoursPerWeek?: number;
  goals?: string[];
  dueCount?: number;
  /** JS getDay() index: 0=Sun, 1=Mon, etc.; injected in tests. */
  todayIndex?: number;
  weakestByLane?: Partial<Record<Lane, string | undefined>>;
}

function hasGoal(goals: string[] | undefined, pattern: RegExp, defaultValue = true): boolean {
  return goals?.some((g) => pattern.test(g)) ?? defaultValue;
}

export function buildWeeklyOperatingPlan(opts: WeeklyOperatingPlanOptions = {}): WeeklyOperatingPlan {
  const hrs = Math.max(3, Math.min(20, opts.hoursPerWeek ?? 8));
  const goals = opts.goals;
  const dueCount = Math.max(0, opts.dueCount ?? 0);
  const weak = opts.weakestByLane ?? {};

  const financeHeavy = hasGoal(goals, /finance|b\+/i);
  const cmaHeavy = hasGoal(goals, /cma/i);
  const cpaHeavy = hasGoal(goals, /cpa/i);
  const applyHeavy = hasGoal(goals, /controller|cfo|work|promotion/i);

  const days: WeeklyPlanDay[] = [
    {
      day: "Mon",
      focus: weak.cma
        ? `CMA weak skill: ${weak.cma} + quiz retake`
        : cmaHeavy
          ? "CMA + controller lesson quiz"
          : "CMA review",
      href: "/learn",
    },
    {
      day: "Tue",
      focus: weak.cpa
        ? `CPA weak skill: ${weak.cpa} + 10-question set`
        : cpaHeavy
          ? "CPA lesson + 10 practice questions"
          : "CPA review",
      href: "/cpa",
    },
    {
      day: "Wed",
      focus: weak.finance
        ? `Finance weak skill: ${weak.finance} + calculator reps`
        : financeHeavy
          ? "Finance class drill + calculator reps"
          : "Finance maintenance",
      href: "/finance",
    },
    {
      day: "Thu",
      focus: weak.cma
        ? `CMA weak-skill reinforcement: ${weak.cma}`
        : cmaHeavy
          ? "CMA weak-skill review + quiz retake"
          : "CMA maintenance",
      href: "/mission",
    },
    {
      day: "Fri",
      focus: weak.cpa
        ? `CPA timed set focused on ${weak.cpa}`
        : cpaHeavy
          ? "CPA Practice timed set + mistake review"
          : "CPA maintenance",
      href: "/crossover",
    },
    {
      day: "Sat",
      focus: weak.cfo
        ? `Apply Lab: ${weak.cfo} writeup + stakeholder explanation`
        : applyHeavy
          ? "Apply Lab workflow + stakeholder explanation"
          : "Applied review",
      href: "/apply",
    },
    {
      day: "Sun",
      focus:
        dueCount > 0
          ? `SRS review (${dueCount} due), notes cleanup, next-week reset`
          : "SRS review, notes cleanup, next-week reset",
      href: dueCount > 0 ? "/mistakes" : "/profile",
    },
  ];

  if (dueCount >= 10) {
    const todayIndex = opts.todayIndex ?? new Date().getDay();
    const monFirstIndex = (todayIndex + 6) % 7;
    days[monFirstIndex] = {
      ...days[monFirstIndex],
      focus: `SRS backlog first: ${dueCount} due + Mistake Bank cleanup`,
      href: "/mistakes",
    };
  }

  const minutesPerDay = Math.max(25, Math.round((hrs * 60) / 6 / 5) * 5);
  return { hours: hrs, minutesPerDay, days };
}
