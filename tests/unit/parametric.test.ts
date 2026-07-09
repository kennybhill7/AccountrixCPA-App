import { describe, it, expect } from "vitest";
import {
  mulberry32,
  rng,
  generate,
  tvmFutureValue,
  npvTwoYear,
  dupontRoe,
  GENERATORS,
} from "../../lib/parametric";

const round = (n: number, dp = 2) => Math.round(n * 10 ** dp) / 10 ** dp;

describe("parametric generator", () => {
  it("mulberry32 is deterministic and in [0,1)", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const xs = [a(), a(), a()];
    const ys = [b(), b(), b()];
    expect(xs).toEqual(ys);
    for (const x of xs) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });

  it("rng helpers stay within range", () => {
    const g = rng(7);
    for (let i = 0; i < 200; i++) {
      const v = g.int(3, 9);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(9);
      const s = g.step(1000, 5000, 500);
      expect(s % 500).toBe(0);
      expect(s).toBeGreaterThanOrEqual(1000);
      expect(s).toBeLessThanOrEqual(5000);
    }
  });

  it("same seed yields an identical instance", () => {
    expect(tvmFutureValue(123)).toEqual(tvmFutureValue(123));
  });

  it("TVM future-value answer matches the formula", () => {
    const p = tvmFutureValue(99);
    const expected = round(p.params.pv * (1 + p.params.ratePct / 100) ** p.params.n, 2);
    expect(p.answer).toBe(expected);
    expect(p.skills).toContain("tvm");
  });

  it("NPV answer matches the formula", () => {
    const p = npvTwoYear(2024);
    const r = p.params.ratePct / 100;
    const expected = round(
      -p.params.cost + p.params.cf1 / (1 + r) + p.params.cf2 / (1 + r) ** 2,
      2
    );
    expect(p.answer).toBe(expected);
  });

  it("DuPont ROE answer matches margin × turnover × multiplier", () => {
    const p = dupontRoe(555);
    const expected = round((p.params.marginPct / 100) * p.params.tat * p.params.em * 100, 2);
    expect(p.answer).toBe(expected);
    expect(p.unit).toBe("%");
  });

  it("generate produces one verified instance per seed", () => {
    const items = generate(npvTwoYear, [1, 2, 3, 4, 5]);
    expect(items).toHaveLength(5);
    for (const p of items) {
      const r = p.params.ratePct / 100;
      const expected = round(
        -p.params.cost + p.params.cf1 / (1 + r) + p.params.cf2 / (1 + r) ** 2,
        2
      );
      expect(p.answer).toBe(expected);
    }
  });

  it("different seeds usually give different problems", () => {
    const prompts = new Set(
      generate(tvmFutureValue, [1, 2, 3, 4, 5, 6, 7, 8]).map((p) => p.prompt)
    );
    expect(prompts.size).toBeGreaterThan(1);
  });

  it("registry exposes the core generators and every entry is callable", () => {
    const ids = new Set(Object.keys(GENERATORS));
    // Original core set must remain registered (regression guard).
    for (const core of [
      "annuity-pv",
      "bond-price",
      "capm-required",
      "dividend-growth-price",
      "dupont-roe",
      "npv-multi-year",
      "npv-two-year",
      "tvm-future-value",
      "wacc-basic",
    ]) {
      expect(ids.has(core), `${core} registered`).toBe(true);
    }
    // Every registered entry is a callable generator producing a finite answer.
    for (const [id, gen] of Object.entries(GENERATORS)) {
      expect(typeof gen, `${id} is a function`).toBe("function");
      expect(Number.isFinite(gen(1).answer), `${id} finite`).toBe(true);
    }
  });
});
