/**
 * Grade-target calculator — generic, no personal data.
 *
 * Models a course grade as a weighted sum of components and solves for the
 * final-exam score needed to hit a target grade. Supports a "lowest-midterm
 * replacement" rule (the final replaces the lowest midterm if it is higher).
 *
 * All scores are percentages (0–100). The caller supplies their own numbers at
 * runtime — nothing personal is stored here.
 */

export interface GradeWeights {
  /** weight on the kept midterm (e.g. 0.15) */
  midterm: number;
  /** weight on the final exam (e.g. 0.50) */
  final: number;
  /** weight on all other components — quizzes/homework/participation (e.g. 0.35) */
  other: number;
}

export interface GradeScores {
  /** midterm percentage kept (after any replacement), 0–100 */
  midterm: number;
  /** other-components average, 0–100 */
  other: number;
}

const EPS = 1e-9;

export function weightsSumToOne(w: GradeWeights): boolean {
  return Math.abs(w.midterm + w.final + w.other - 1) < 1e-6;
}

/** Project the course grade given a final-exam score. */
export function projectGrade(w: GradeWeights, s: GradeScores, finalScore: number): number {
  return w.midterm * s.midterm + w.final * finalScore + w.other * s.other;
}

/**
 * Final-exam score needed to reach `target` course grade.
 * May return > 100 (impossible) or <= 0 (already locked regardless of the final).
 */
export function finalNeeded(w: GradeWeights, s: GradeScores, target: number): number {
  if (w.final <= EPS) throw new Error("final weight must be > 0");
  return (target - w.midterm * s.midterm - w.other * s.other) / w.final;
}

export interface FinalNeededResult {
  needed: number;
  /** reachable with a final of 100 or less */
  achievable: boolean;
  /** target already met no matter the final */
  alreadyLocked: boolean;
}

export function finalNeededDetailed(
  w: GradeWeights,
  s: GradeScores,
  target: number
): FinalNeededResult {
  const needed = finalNeeded(w, s, target);
  return {
    needed,
    achievable: needed <= 100 + EPS,
    alreadyLocked: needed <= 0 + EPS,
  };
}

/**
 * Lowest-midterm-replacement rule: the final replaces the lowest midterm when
 * the final score is higher. Returns the adjusted midterm array.
 */
export function applyMidtermReplacement(midterms: number[], finalScore: number): number[] {
  if (midterms.length === 0) return [...midterms];
  let lowestIdx = 0;
  for (let i = 1; i < midterms.length; i++) {
    if (midterms[i] < midterms[lowestIdx]) lowestIdx = i;
  }
  const out = [...midterms];
  if (finalScore > out[lowestIdx]) out[lowestIdx] = finalScore;
  return out;
}

export interface SensitivityRow {
  other: number;
  finalNeeded: number;
  achievable: boolean;
}

/**
 * Sensitivity table: for each "other-components" average, the final-exam score
 * needed to hit the target. (Reproduces the kind of table used to scope a B+.)
 */
export function sensitivityTable(
  w: GradeWeights,
  midterm: number,
  target: number,
  otherAverages: number[]
): SensitivityRow[] {
  return otherAverages.map((other) => {
    const r = finalNeededDetailed(w, { midterm, other }, target);
    return {
      other,
      finalNeeded: Math.round(r.needed * 10) / 10,
      achievable: r.achievable,
    };
  });
}
