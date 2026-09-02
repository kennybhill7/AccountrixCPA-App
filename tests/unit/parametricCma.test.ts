/**
 * CMA parametric generators — golden-value regression.
 *
 * Every expected answer below was produced by the generator AND independently
 * recomputed in a separate implementation written from the accounting
 * definitions rather than from lib/parametricCma.ts. 6,800 instances (34
 * generators x 200 seeds) were cross-checked that way on 2026-09-02 with zero
 * mismatches; these 102 pairs are pinned so a future edit to a formula
 * fails loudly instead of silently teaching the wrong arithmetic.
 *
 * A test that recomputes using the same formula it is testing proves nothing.
 * Do not "fix" a failure here by copying the new output — re-derive the number
 * by hand first, then decide which side is wrong.
 */
import { describe, it, expect } from "vitest";
import { CMA_GENERATORS, CMA_GENERATOR_AREA } from "@/lib/parametricCma";

const GOLDEN: [string, number, number][] = [
  ["abc-driver-rate", 7, 73548.39],
  ["abc-driver-rate", 42, 96386.14],
  ["abc-driver-rate", 113, 43648.65],
  ["absorption-vs-variable-income", 7, -206500],
  ["absorption-vs-variable-income", 42, -9464.29],
  ["absorption-vs-variable-income", 113, 20952.38],
  ["cash-budget-ending-balance", 7, 40000],
  ["cash-budget-ending-balance", 42, 40000],
  ["cash-budget-ending-balance", 113, 68000],
  ["cash-collections-schedule", 7, 147750],
  ["cash-collections-schedule", 42, 166500],
  ["cash-collections-schedule", 113, 151500],
  ["cash-conversion-cycle", 7, -18],
  ["cash-conversion-cycle", 42, 74],
  ["cash-conversion-cycle", 113, 135],
  ["cm-per-constraint-unit", 7, 10],
  ["cm-per-constraint-unit", 42, 26],
  ["cm-per-constraint-unit", 113, 36.67],
  ["cost-of-trade-credit", 7, 7.37],
  ["cost-of-trade-credit", 42, 14.9],
  ["cost-of-trade-credit", 113, 37.63],
  ["degree-operating-leverage", 7, 3.3333],
  ["degree-operating-leverage", 42, 2.8537],
  ["degree-operating-leverage", 113, 2.0192],
  ["economic-order-quantity", 7, 141.42],
  ["economic-order-quantity", 42, 1027.4],
  ["economic-order-quantity", 113, 1849.86],
  ["economic-value-added", 7, -892000],
  ["economic-value-added", 42, -13600],
  ["economic-value-added", 113, 596100],
  ["equivalent-units-weighted-avg", 7, 9350],
  ["equivalent-units-weighted-avg", 42, 38300],
  ["equivalent-units-weighted-avg", 113, 42950],
  ["expected-value-decision", 7, 156500],
  ["expected-value-decision", 42, 64250],
  ["expected-value-decision", 113, 38000],
  ["flexible-budget-variance", 7, 126000],
  ["flexible-budget-variance", 42, 33000],
  ["flexible-budget-variance", 113, -99000],
  ["foh-volume-variance", 7, -50000],
  ["foh-volume-variance", 42, -64285.71],
  ["foh-volume-variance", 113, 5897.44],
  ["joint-cost-sales-value", 7, 19354.84],
  ["joint-cost-sales-value", 42, 202222.22],
  ["joint-cost-sales-value", 113, 344117.65],
  ["keep-or-drop-segment", 7, 135000],
  ["keep-or-drop-segment", 42, -28000],
  ["keep-or-drop-segment", 113, -75000],
  ["labor-efficiency-variance", 7, 4950],
  ["labor-efficiency-variance", 42, 41600],
  ["labor-efficiency-variance", 113, -4600],
  ["labor-rate-variance", 7, 6600],
  ["labor-rate-variance", 42, 28800],
  ["labor-rate-variance", 113, -3725],
  ["learning-curve-total-hours", 7, 524.29],
  ["learning-curve-total-hours", 42, 1835.01],
  ["learning-curve-total-hours", 113, 1866.24],
  ["make-or-buy-advantage", 7, -8000],
  ["make-or-buy-advantage", 42, -13000],
  ["make-or-buy-advantage", 113, -210000],
  ["material-price-variance", 7, 3000],
  ["material-price-variance", 42, 11700],
  ["material-price-variance", 113, -1500],
  ["material-quantity-variance", 7, 18000],
  ["material-quantity-variance", 42, 12600],
  ["material-quantity-variance", 113, -600],
  ["materials-purchases-budget", 7, 77000],
  ["materials-purchases-budget", 42, 241500],
  ["materials-purchases-budget", 113, 684000],
  ["modified-irr", 7, 26.005],
  ["modified-irr", 42, 14.345],
  ["modified-irr", 113, 15.0661],
  ["multiproduct-breakeven-units", 7, 6600],
  ["multiproduct-breakeven-units", 42, 11946.67],
  ["multiproduct-breakeven-units", 113, 6166.67],
  ["over-under-applied-overhead", 7, -1785000],
  ["over-under-applied-overhead", 42, -755000],
  ["over-under-applied-overhead", 113, 459000],
  ["pohr-applied-overhead", 7, 283043.48],
  ["pohr-applied-overhead", 42, 902127.66],
  ["pohr-applied-overhead", 113, 912698.41],
  ["production-budget-units", 7, 900],
  ["production-budget-units", 42, 24700],
  ["production-budget-units", 113, 31900],
  ["residual-income", 7, 15000],
  ["residual-income", 42, -45000],
  ["residual-income", 113, 155000],
  ["sell-or-process-further", 7, -40000],
  ["sell-or-process-further", 42, 81000],
  ["sell-or-process-further", 113, 63500],
  ["special-order-profit", 7, -44500],
  ["special-order-profit", 42, -5000],
  ["special-order-profit", 113, 260000],
  ["sustainable-growth-rate", 7, 5.4],
  ["sustainable-growth-rate", 42, 11.7],
  ["sustainable-growth-rate", 113, 9.45],
  ["transfer-price-minimum", 7, 105],
  ["transfer-price-minimum", 42, 145],
  ["transfer-price-minimum", 113, 170],
  ["voh-spending-variance", 7, 186400],
  ["voh-spending-variance", 42, 80600],
  ["voh-spending-variance", 113, -50000],
];

describe("CMA parametric generators", () => {
  it("registry and blueprint-area map cover the same generators", () => {
    expect(Object.keys(CMA_GENERATORS).sort()).toEqual(Object.keys(CMA_GENERATOR_AREA).sort());
  });

  it("every generator id matches the instance id it emits", () => {
    for (const [id, gen] of Object.entries(CMA_GENERATORS)) {
      expect(gen(1).id).toBe(id);
    }
  });

  it("is deterministic — same seed yields the same answer", () => {
    for (const gen of Object.values(CMA_GENERATORS)) {
      expect(gen(99).answer).toBe(gen(99).answer);
      expect(gen(99).params).toEqual(gen(99).params);
    }
  });

  it("produces finite, defined answers across a seed sweep", () => {
    for (const [id, gen] of Object.entries(CMA_GENERATORS)) {
      for (let seed = 1; seed <= 200; seed++) {
        const a = gen(seed).answer;
        expect(Number.isFinite(a), `${id} seed ${seed} produced ${a}`).toBe(true);
      }
    }
  });

  it("never emits a nonsensical instance", () => {
    for (let seed = 1; seed <= 200; seed++) {
      // Actual hours must be positive — a flat deviation band on a small
      // standard used to produce negative hours.
      expect(CMA_GENERATORS["labor-efficiency-variance"](seed).params.ah).toBeGreaterThan(0);
      // Operating income must be positive or the leverage ratio is meaningless.
      const d = CMA_GENERATORS["degree-operating-leverage"](seed);
      expect(d.answer).toBeGreaterThan(1);
      // Probabilities must be a valid distribution.
      const e = CMA_GENERATORS["expected-value-decision"](seed).params;
      expect(e.p1 + e.p2 + e.p3).toBe(100);
      expect(Math.min(e.p1, e.p2, e.p3)).toBeGreaterThan(0);
    }
  });

  it.each(GOLDEN)("%s (seed %i) computes the verified answer", (id, seed, expected) => {
    expect(CMA_GENERATORS[id](seed).answer).toBeCloseTo(expected, 2);
  });

  it("weights coverage toward the heaviest blueprint areas", () => {
    const areas = Object.values(CMA_GENERATOR_AREA);
    const count = (a: string) => areas.filter((x) => x === a).length;
    // Decision Analysis is 25% of Part 2; Budgeting and Performance Management
    // are 20% each of Part 1. They had near-zero generator coverage before this.
    expect(count("P2-C")).toBeGreaterThanOrEqual(6);
    expect(count("P1-B")).toBeGreaterThanOrEqual(6);
    expect(count("P1-C")).toBeGreaterThanOrEqual(6);
  });
});
