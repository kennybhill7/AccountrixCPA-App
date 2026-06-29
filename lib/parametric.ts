/**
 * Parametric problem generator — infinite, verified practice variations.
 *
 * A generator takes a seed and produces a fully-worked problem instance: the
 * prompt with random-but-clean numbers, the parameters, and the computed
 * answer. Because the answer is derived from the same params, every variation
 * is self-verifying. Proven in the Fluency app ("New variation"); generalized
 * per PRODUCT_MASTER_PLAN §6 to drill a learner's weak skills endlessly.
 *
 * Deterministic: a given seed always yields the same instance (mulberry32 RNG),
 * so output is reproducible and unit-testable — no hidden Math.random().
 */

/** mulberry32 — a small, fast, deterministic seeded PRNG returning [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Rng {
  next(): number;
  /** inclusive integer in [min, max] */
  int(min: number, max: number): number;
  /** integer multiple of `step` in [min, max] */
  step(min: number, max: number, step: number): number;
  pick<T>(arr: readonly T[]): T;
  round(n: number, dp?: number): number;
}

export function rng(seed: number): Rng {
  const r = mulberry32(seed);
  const int = (min: number, max: number) => min + Math.floor(r() * (max - min + 1));
  return {
    next: r,
    int,
    step: (min, max, step) => {
      const steps = Math.floor((max - min) / step);
      return min + int(0, steps) * step;
    },
    pick: <T>(arr: readonly T[]): T => arr[int(0, arr.length - 1)],
    round: (n, dp = 2) => {
      const f = 10 ** dp;
      return Math.round(n * f) / f;
    },
  };
}

export interface ProblemInstance {
  id: string;
  seed: number;
  prompt: string;
  params: Record<string, number>;
  answer: number;
  unit?: string;
  skills: string[];
}

export type Generator = (seed: number) => ProblemInstance;

/** Generate one instance per seed. */
export function generate(gen: Generator, seeds: number[]): ProblemInstance[] {
  return seeds.map((s) => gen(s));
}

// ---- Example finance generators (each self-verifying) --------------------

/** Future value of a lump sum: FV = PV(1 + r)^n. */
export const tvmFutureValue: Generator = (seed) => {
  const g = rng(seed);
  const pv = g.step(1000, 10000, 500);
  const ratePct = g.int(3, 10);
  const n = g.int(2, 10);
  const r = ratePct / 100;
  const answer = g.round(pv * (1 + r) ** n, 2);
  return {
    id: "tvm-future-value",
    seed,
    prompt: `You invest $${pv.toLocaleString()} for ${n} years at ${ratePct}% compounded annually. What is the future value?`,
    params: { pv, ratePct, n },
    answer,
    unit: "$",
    skills: ["tvm"],
  };
};

/** NPV of a two-year project: −cost + CF1/(1+r) + CF2/(1+r)^2. */
export const npvTwoYear: Generator = (seed) => {
  const g = rng(seed);
  const cost = g.step(5000, 20000, 1000);
  const cf1 = g.step(3000, 12000, 500);
  const cf2 = g.step(3000, 12000, 500);
  const ratePct = g.int(5, 12);
  const r = ratePct / 100;
  const answer = g.round(-cost + cf1 / (1 + r) + cf2 / (1 + r) ** 2, 2);
  return {
    id: "npv-two-year",
    seed,
    prompt: `A project costs $${cost.toLocaleString()} now and returns $${cf1.toLocaleString()} in year 1 and $${cf2.toLocaleString()} in year 2. At a ${ratePct}% discount rate, what is the NPV?`,
    params: { cost, cf1, cf2, ratePct },
    answer,
    unit: "$",
    skills: ["capital-budgeting", "tvm"],
  };
};

/** DuPont ROE = net profit margin × total asset turnover × equity multiplier. */
export const dupontRoe: Generator = (seed) => {
  const g = rng(seed);
  const marginPct = g.int(4, 15);
  const tat = g.round(g.int(10, 25) / 10, 1); // 1.0–2.5
  const em = g.round(g.int(15, 30) / 10, 1); // 1.5–3.0
  const answer = g.round((marginPct / 100) * tat * em * 100, 2); // ROE %
  return {
    id: "dupont-roe",
    seed,
    prompt: `A firm has a net profit margin of ${marginPct}%, total asset turnover of ${tat}, and an equity multiplier of ${em}. What is its ROE (DuPont)?`,
    params: { marginPct, tat, em },
    answer,
    unit: "%",
    skills: ["dupont", "ratio-analysis"],
  };
};

export const GENERATORS: Record<string, Generator> = {
  "tvm-future-value": tvmFutureValue,
  "npv-two-year": npvTwoYear,
  "dupont-roe": dupontRoe,
};
