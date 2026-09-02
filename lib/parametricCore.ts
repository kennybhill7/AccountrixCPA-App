/**
 * Parametric core — the seeded RNG and the problem-instance contract.
 *
 * Extracted from lib/parametric.ts so that generator modules (parametric.ts,
 * parametricCma.ts, …) can all depend on the primitives while a single registry
 * composes them. Without this split, parametric.ts importing the CMA registry
 * while parametricCma.ts imports `rng` from parametric.ts is a module cycle.
 *
 * Deterministic: a given seed always yields the same instance — no hidden
 * Math.random(), so every generated problem is reproducible and unit-testable.
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
