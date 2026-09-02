/**
 * Parametric MCQ engine — turns any numeric ProblemInstance into an
 * exam-format multiple-choice question by generating plausible distractors from
 * common student error patterns (rate/rounding slips, doubling or halving the
 * base, decimal-place shifts, sign errors). Because it wraps the 43 seeded
 * generators, this yields an effectively unlimited, self-verifying MCQ bank —
 * the correct choice is always the generator's verified answer, and the wrong
 * choices are the mistakes people actually make.
 *
 * Deterministic given the instance (distractors + shuffle are seeded off
 * instance.seed) so the same question always renders the same way — testable.
 */

import { rng, hintForSkills, type ProblemInstance } from "./parametric";

export interface McqInstance {
  id: string;
  stem: string;
  /** four formatted option strings */
  choices: string[];
  /** index (0–3) of the correct choice */
  answer: number;
  skills: string[];
  /** short method hint, shown in review */
  explain?: string;
  unit: string;
}

function roundTo(v: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(v * f) / f;
}

/** Format a value the same way the rest of the app does (unit-aware). */
export function formatValue(v: number, unit?: string): string {
  const r = roundTo(v, 2);
  if (unit === "%") return `${r}%`;
  if (unit === "$")
    return `$${r.toLocaleString(undefined, {
      minimumFractionDigits: Number.isInteger(r) ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  if (unit === "days" || unit === "units" || unit === "years") return `${r} ${unit}`;
  return `${r}`;
}

function approxEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < Math.max(0.01, Math.abs(a) * 0.0005);
}

/** Common wrong-answer transforms applied to the verified answer A. */
function candidateDistractors(A: number, unit: string): number[] {
  const isInt = Number.isInteger(A);
  const prec = isInt ? 0 : 2;
  const out: number[] = [];
  const push = (v: number) => out.push(roundTo(v, prec));

  // rate / rounding slips
  for (const m of [0.9, 1.1, 0.85, 1.15, 1.25, 0.8]) push(A * m);
  // wrong base — doubled or halved
  push(A * 2);
  push(A / 2);
  // decimal-place shift (classic units error)
  push(A * 10);
  push(A / 10);
  // additive near-miss
  const d = Math.max(isInt ? 1 : 0.5, Math.abs(A) * 0.12);
  push(A + d);
  push(A - d);
  // sign error — only meaningful for money
  if (unit === "$") push(-A);

  return out;
}

function plausible(v: number, A: number, unit: string): boolean {
  if (!Number.isFinite(v)) return false;
  if (approxEqual(v, A)) return false;
  // no non-positive distractors for rates, counts, or ratios (too obviously wrong)
  if (A > 0 && v <= 0 && unit !== "$") return false;
  // absurd percentages give the answer away
  if (unit === "%" && (v > 300 || v < -100)) return false;
  return true;
}

/** Build one MCQ from a numeric instance. Deterministic in instance.seed. */
export function instanceToMcq(inst: ProblemInstance): McqInstance {
  const unit = inst.unit ?? "";
  const A = inst.answer;
  const R = rng((inst.seed | 0) ^ 0x5f3759df);

  // Collect distinct, plausible distractors in a seeded order.
  const pool = candidateDistractors(A, unit);
  // Fisher–Yates shuffle the pool for variety across seeds.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = R.int(0, i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Dedup on the *displayed* label — two numbers that render identically
  // (e.g. 3.14 vs 3.0 "years" once formatted) must never both appear.
  const isInt = Number.isInteger(A);
  const chosen: number[] = [];
  const seenStr = new Set([formatValue(A, unit)]);
  for (const v of pool) {
    if (!plausible(v, A, unit)) continue;
    const label = formatValue(v, unit);
    if (seenStr.has(label)) continue;
    chosen.push(v);
    seenStr.add(label);
    if (chosen.length === 3) break;
  }
  // Guaranteed padding if the pool collapsed (tiny answers, etc.).
  let step = 1;
  while (chosen.length < 3 && step < 80) {
    const pad = roundTo(A + step * Math.max(isInt ? 1 : 0.25, Math.abs(A) * 0.1), isInt ? 0 : 2);
    const label = formatValue(pad, unit);
    if (plausible(pad, A, unit) && !seenStr.has(label)) {
      chosen.push(pad);
      seenStr.add(label);
    }
    step++;
  }

  // Assemble and shuffle the four options.
  const values = [A, ...chosen];
  for (let i = values.length - 1; i > 0; i--) {
    const j = R.int(0, i);
    [values[i], values[j]] = [values[j], values[i]];
  }
  const answer = values.findIndex((v) => approxEqual(v, A));

  return {
    id: `pmcq:${inst.id}:${inst.seed}`,
    stem: inst.prompt,
    choices: values.map((v) => formatValue(v, unit)),
    answer: answer < 0 ? 0 : answer,
    skills: inst.skills,
    explain: hintForSkills(inst.skills) ?? undefined,
    unit,
  };
}
