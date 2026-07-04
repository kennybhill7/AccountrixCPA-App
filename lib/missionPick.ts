/**
 * Mission Control item selection (FABLE5_ANALYSIS §5 Week 3).
 *
 * Pure `pickNext` for lib/missionControl buildSessions: given real evidence
 * (weakest tested skill per track from the attempt ledger, SRS due count) it
 * returns a concrete block label ("Drill your weakest skill: wip-schedule");
 * with no data it falls back to the canned guidance strings.
 */

import type { Lane } from "./missionControl";
import type { AttemptTrack } from "./types";

export interface WeakSkillTarget {
  skill: string;
  /** lesson href resolved via the skill→lesson map, when available */
  href?: string;
}

export interface PickNextContext {
  weakestByTrack: Partial<Record<AttemptTrack, WeakSkillTarget | undefined>>;
  /** SRS items due today (lib/store useSrs dueCount) */
  dueCount: number;
}

/** Mission lanes map onto attempt-ledger tracks; the CFO lane is "apply". */
export const LANE_TO_TRACK: Record<Lane, AttemptTrack> = {
  cma: "cma",
  cpa: "cpa",
  finance: "finance",
  cfo: "apply",
};

const FALLBACK_LABELS: Record<Lane, string> = {
  cma: "Continue CMA lessons, then close with one Apply Lab workflow.",
  cpa: "Continue CPA lessons and write down every missed-rule reason.",
  finance: "Work corporate-finance problems before reading explanations.",
  cfo: "Complete one fictional case workflow like a controller deliverable.",
};

/** Label for a lane's study block — concrete when evidence exists. */
export function pickNext(lane: Lane, ctx: PickNextContext): string {
  const weak = ctx.weakestByTrack[LANE_TO_TRACK[lane]];
  if (weak?.skill) {
    return `Drill your weakest skill: ${weak.skill}`;
  }
  return FALLBACK_LABELS[lane];
}

/** Label for the review block — shows the live SRS due count. */
export function reviewLabel(dueCount: number): string {
  if (dueCount > 0) {
    return `${dueCount} item${dueCount === 1 ? "" : "s"} due`;
  }
  return "Review — missed items / flashcards";
}
