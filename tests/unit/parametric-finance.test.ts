/**
 * Finance-sprint parametric generators (FABLE5_ANALYSIS §5 wk4).
 *
 * Each generator gets: (1) determinism — the same seed twice yields the same
 * instance; (2) two fixed-seed spot checks whose expected answers were
 * hand-computed from the printed params (values in comments); (3) formula
 * re-derivation from params. Plus the r > g guarantee for Gordon growth over
 * 50 seeds and the explicit grading-tolerance rules.
 */

import { describe, it, expect } from "vitest";
import {
  annuityPv,
  bondPrice,
  capmRequired,
  waccBasic,
  npvMultiYear,
  dividendGrowthPrice,
  GENERATORS,
  GENERATOR_SKILLS,
  generatorsForSkills,
  gradeTolerance,
  isWithinTolerance,
  type Generator,
} from "../../lib/parametric";

const round = (n: number, dp = 2) => Math.round(n * 10 ** dp) / 10 ** dp;

const NEW_GENERATORS: Array<[string, Generator]> = [
  ["annuity-pv", annuityPv],
  ["bond-price", bondPrice],
  ["capm-required", capmRequired],
  ["wacc-basic", waccBasic],
  ["npv-multi-year", npvMultiYear],
  ["dividend-growth-price", dividendGrowthPrice],
];

describe("finance generators — determinism", () => {
  it.each(NEW_GENERATORS)("%s: same seed yields an identical instance", (_id, gen) => {
    for (const seed of [1, 77, 2026]) {
      expect(gen(seed)).toEqual(gen(seed));
    }
  });

  it("all six are registered under their instance id", () => {
    for (const [id, gen] of NEW_GENERATORS) {
      expect(GENERATORS[id]).toBe(gen);
      expect(gen(5).id).toBe(id);
    }
  });
});

describe("annuityPv — PV = PMT × [1 − (1+r)^−n]/r", () => {
  // seed 11: PMT=2750, r=7%, n=14 → 2750 × (1 − 1.07^−14)/0.07 = 24,050.04
  it("seed 11 hand check", () => {
    const p = annuityPv(11);
    expect(p.params).toEqual({ pmt: 2750, ratePct: 7, n: 14 });
    expect(p.answer).toBe(24050.04);
  });

  // seed 42: PMT=3250, r=6%, n=18 → 3250 × (1 − 1.06^−18)/0.06 = 35,189.71
  it("seed 42 hand check", () => {
    const p = annuityPv(42);
    expect(p.params).toEqual({ pmt: 3250, ratePct: 6, n: 18 });
    expect(p.answer).toBe(35189.71);
  });

  it("matches the formula and carries tvm", () => {
    const p = annuityPv(999);
    const r = p.params.ratePct / 100;
    expect(p.answer).toBe(round((p.params.pmt * (1 - (1 + r) ** -p.params.n)) / r));
    expect(p.skills).toEqual(["tvm"]);
    expect(p.unit).toBe("$");
  });
});

describe("bondPrice — P = C×[1 − (1+y)^−n]/y + F/(1+y)^n", () => {
  // seed 5: C=70, y=8%, n=8 → 70×5.746639 + 1000×0.540269 = 402.26 + 540.27 = 942.53 (discount)
  it("seed 5 hand check (coupon < yield → discount)", () => {
    const p = bondPrice(5);
    expect(p.params).toEqual({ face: 1000, couponPct: 7, yieldPct: 8, n: 8 });
    expect(p.answer).toBe(942.53);
    expect(p.answer).toBeLessThan(1000);
  });

  // seed 101: C=30, y=8%, n=13 → 30×7.903776 + 1000×0.367698 = 237.11 + 367.70 = 604.81
  it("seed 101 hand check", () => {
    const p = bondPrice(101);
    expect(p.params).toEqual({ face: 1000, couponPct: 3, yieldPct: 8, n: 13 });
    expect(p.answer).toBe(604.81);
  });

  // seed 7: coupon 2% = yield 2% → price must be exactly par.
  it("seed 7 sanity: coupon = yield prices at par", () => {
    const p = bondPrice(7);
    expect(p.params.couponPct).toBe(p.params.yieldPct);
    expect(p.answer).toBe(1000);
  });

  it("carries bond-valuation + tvm", () => {
    expect(bondPrice(1).skills).toEqual(["bond-valuation", "tvm"]);
  });
});

describe("capmRequired — r = rf + β × MRP", () => {
  // seed 11: 4 + 1.3×7 = 4 + 9.1 = 13.1%
  it("seed 11 hand check", () => {
    const p = capmRequired(11);
    expect(p.params).toEqual({ rfPct: 4, beta: 1.3, mrpPct: 7 });
    expect(p.answer).toBe(13.1);
  });

  // seed 5: 4 + 1.7×5 = 4 + 8.5 = 12.5%
  it("seed 5 hand check", () => {
    const p = capmRequired(5);
    expect(p.params).toEqual({ rfPct: 4, beta: 1.7, mrpPct: 5 });
    expect(p.answer).toBe(12.5);
  });

  it("is a % answer tagged risk-return", () => {
    const p = capmRequired(321);
    expect(p.unit).toBe("%");
    expect(p.skills).toEqual(["risk-return"]);
    expect(p.answer).toBe(round(p.params.rfPct + p.params.beta * p.params.mrpPct));
  });
});

describe("waccBasic — wE×kE + wD×kD×(1−T)", () => {
  // seed 11: 0.60×12 + 0.40×7×(1−0.25) = 7.2 + 2.1 = 9.3%
  it("seed 11 hand check", () => {
    const p = waccBasic(11);
    expect(p.params).toEqual({ wdPct: 40, wePct: 60, kdPct: 7, kePct: 12, taxPct: 25 });
    expect(p.answer).toBe(9.3);
  });

  // seed 101: 0.75×12 + 0.25×8×(1−0.25) = 9.0 + 1.5 = 10.5%
  it("seed 101 hand check", () => {
    const p = waccBasic(101);
    expect(p.params).toEqual({ wdPct: 25, wePct: 75, kdPct: 8, kePct: 12, taxPct: 25 });
    expect(p.answer).toBe(10.5);
  });

  it("weights always sum to 100 and skill is cost-of-capital", () => {
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      const p = waccBasic(seed);
      expect(p.params.wdPct + p.params.wePct).toBe(100);
    }
    expect(waccBasic(1).skills).toEqual(["cost-of-capital"]);
  });
});

describe("npvMultiYear — −C0 + ΣCFt/(1+r)^t, t=1..3", () => {
  // seed 9: −18000 + 18000/1.12 + 6000/1.2544 + 17500/1.404928
  //       = −18000 + 16071.43 + 4783.16 + 12456.16 = 15,310.75
  it("seed 9 hand check", () => {
    const p = npvMultiYear(9);
    expect(p.params).toEqual({ cost: 18000, cf1: 18000, cf2: 6000, cf3: 17500, ratePct: 12 });
    expect(p.answer).toBe(15310.75);
  });

  // seed 11: −30000 + 12500/1.13 + 14000/1.2769 + 13500/1.442897
  //        = −30000 + 11061.95 + 10964.05 + 9356.18 = 1,382.18
  it("seed 11 hand check", () => {
    const p = npvMultiYear(11);
    expect(p.params).toEqual({ cost: 30000, cf1: 12500, cf2: 14000, cf3: 13500, ratePct: 13 });
    expect(p.answer).toBe(1382.18);
  });

  it("matches the formula and carries capital-budgeting + tvm", () => {
    const p = npvMultiYear(500);
    const r = p.params.ratePct / 100;
    const expected = round(
      -p.params.cost +
        p.params.cf1 / (1 + r) +
        p.params.cf2 / (1 + r) ** 2 +
        p.params.cf3 / (1 + r) ** 3
    );
    expect(p.answer).toBe(expected);
    expect(p.skills).toEqual(["capital-budgeting", "tvm"]);
  });
});

describe("dividendGrowthPrice — P0 = D1/(r − g)", () => {
  // seed 13: 2.70/(0.05 − 0.02) = 2.70/0.03 = 90.00
  it("seed 13 hand check", () => {
    const p = dividendGrowthPrice(13);
    expect(p.params).toEqual({ d1: 2.7, growthPct: 2, requiredPct: 5 });
    expect(p.answer).toBe(90);
  });

  // seed 3: 3.20/(0.06 − 0.01) = 3.20/0.05 = 64.00
  it("seed 3 hand check", () => {
    const p = dividendGrowthPrice(3);
    expect(p.params).toEqual({ d1: 3.2, growthPct: 1, requiredPct: 6 });
    expect(p.answer).toBe(64);
  });

  it("guarantees r > g across 50 seeds (denominator never ≤ 0)", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const p = dividendGrowthPrice(seed);
      expect(p.params.requiredPct).toBeGreaterThan(p.params.growthPct);
      // spread is bounded by construction: r − g ∈ [3, 8] points
      expect(p.params.requiredPct - p.params.growthPct).toBeGreaterThanOrEqual(3);
      expect(p.params.requiredPct - p.params.growthPct).toBeLessThanOrEqual(8);
      expect(p.answer).toBeGreaterThan(0);
      expect(Number.isFinite(p.answer)).toBe(true);
    }
  });

  it("carries stock-valuation", () => {
    expect(dividendGrowthPrice(1).skills).toEqual(["stock-valuation"]);
  });
});

describe("gradeTolerance / isWithinTolerance", () => {
  it("% answers use a flat ±0.05", () => {
    expect(gradeTolerance(9.3, "%")).toBe(0.05);
    expect(gradeTolerance(150, "%")).toBe(0.05);
    expect(isWithinTolerance(9.34, 9.3, "%")).toBe(true);
    expect(isWithinTolerance(9.36, 9.3, "%")).toBe(false);
  });

  it("$ answers use max(1% of |answer|, 0.51)", () => {
    expect(gradeTolerance(10, "$")).toBe(0.51); // floor wins on small answers
    expect(gradeTolerance(-10, "$")).toBe(0.51); // |answer|, not answer
    expect(gradeTolerance(10000, "$")).toBe(100); // 1% wins on large answers
    expect(isWithinTolerance(10099, 10000, "$")).toBe(true);
    expect(isWithinTolerance(10101, 10000, "$")).toBe(false);
    // 0.51 floor absorbs penny-rounding around small dollar answers
    expect(isWithinTolerance(90.5, 90, "$")).toBe(true);
  });

  it("unitless answers grade like $", () => {
    expect(gradeTolerance(10)).toBe(0.51);
    expect(gradeTolerance(10000)).toBe(100);
  });
});

describe("generatorsForSkills / GENERATOR_SKILLS", () => {
  it("filters by skill overlap", () => {
    expect(generatorsForSkills(["stock-valuation"])).toEqual(["dividend-growth-price"]);
    expect(generatorsForSkills(["cost-of-capital"])).toEqual(["wacc-basic"]);
    const tvm = generatorsForSkills(["tvm"]);
    expect(tvm).toContain("tvm-future-value");
    expect(tvm).toContain("annuity-pv");
    expect(tvm).toContain("bond-price");
    expect(tvm).toContain("npv-multi-year");
    expect(tvm).not.toContain("capm-required");
  });

  it("falls back to all generators when the filter is empty or matches nothing", () => {
    const all = Object.keys(GENERATORS);
    expect(generatorsForSkills()).toEqual(all);
    expect(generatorsForSkills([])).toEqual(all);
    expect(generatorsForSkills(["no-such-skill"])).toEqual(all);
  });

  it("GENERATOR_SKILLS mirrors each generator's instance skills", () => {
    for (const [id, gen] of Object.entries(GENERATORS)) {
      expect(GENERATOR_SKILLS[id]).toEqual(gen(123).skills);
    }
  });
});
