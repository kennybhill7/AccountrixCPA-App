import { describe, it, expect } from "vitest";
import { GENERATORS, isWithinTolerance } from "@/lib/parametric";

// Every generator instance must be finite, deterministic, and self-consistent.
describe("parametric generators — integrity", () => {
  it("produce finite, deterministic answers with non-empty prompts", () => {
    for (const [id, gen] of Object.entries(GENERATORS)) {
      for (let s = 1; s <= 40; s++) {
        const p = gen(s);
        expect(Number.isFinite(p.answer), `${id}#${s} finite`).toBe(true);
        expect(p.prompt.length, `${id}#${s} prompt`).toBeGreaterThan(10);
        expect(p.skills.length, `${id}#${s} skills`).toBeGreaterThan(0);
        expect(gen(s).answer, `${id}#${s} deterministic`).toBe(p.answer);
      }
    }
  });
});

// Independently recompute each NEW generator's answer from its params and
// confirm it matches within the grader's tolerance, across many seeds.
describe("parametric generators — new generators are mathematically correct", () => {
  const recompute: Record<string, (p: Record<string, number>) => number> = {
    "present-value-lump": ({ fv, ratePct, n }) => fv / (1 + ratePct / 100) ** n,
    "effective-annual-rate": ({ nominalPct, m }) => ((1 + nominalPct / 100 / m) ** m - 1) * 100,
    "perpetuity-pv": ({ c, ratePct }) => c / (ratePct / 100),
    "straight-line-depreciation": ({ cost, salvage, life }) => (cost - salvage) / life,
    "ddb-year1": ({ cost, life }) => cost * (2 / life),
    "cogs-schedule": ({ beg, purch, end }) => beg + purch - end,
    "eps-basic": ({ ni, pref, shares }) => (ni - pref) / shares,
    "break-even-units": ({ fc, price, vc }) => fc / (price - vc),
    "cm-ratio": ({ price, vc }) => ((price - vc) / price) * 100,
    "current-ratio": ({ ca, cl }) => ca / cl,
    "inventory-turnover": ({ cogs, avgInv }) => cogs / avgInv,
    "debt-to-equity": ({ debt, equity }) => debt / equity,
    "retained-earnings-ending": ({ beg, ni, div }) => beg + ni - div,
    "high-low-variable-cost": ({ unitsHigh, costHigh, unitsLow, costLow }) =>
      (costHigh - costLow) / (unitsHigh - unitsLow),
    "return-on-investment": ({ income, investment }) => (income / investment) * 100,
  };

  for (const [id, fn] of Object.entries(recompute)) {
    it(`${id} matches an independent recomputation`, () => {
      const gen = GENERATORS[id];
      expect(gen, `${id} registered`).toBeDefined();
      for (let s = 1; s <= 60; s++) {
        const p = gen(s);
        const expected = fn(p.params);
        expect(
          isWithinTolerance(expected, p.answer, p.unit),
          `${id}#${s}: gen=${p.answer} expected=${expected} params=${JSON.stringify(p.params)}`
        ).toBe(true);
      }
    });
  }
});
