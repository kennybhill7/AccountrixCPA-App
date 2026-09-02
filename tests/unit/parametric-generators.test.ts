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
    "gross-margin-pct": ({ sales, cogs }) => ((sales - cogs) / sales) * 100,
    "net-profit-margin": ({ sales, ni }) => (ni / sales) * 100,
    "return-on-assets": ({ ni, assets }) => (ni / assets) * 100,
    "return-on-equity": ({ ni, equity }) => (ni / equity) * 100,
    "asset-turnover": ({ sales, assets }) => sales / assets,
    "quick-ratio": ({ ca, inv, cl }) => (ca - inv) / cl,
    "times-interest-earned": ({ ebit, interest }) => ebit / interest,
    "dividend-payout": ({ div, ni }) => (div / ni) * 100,
    "days-sales-outstanding": ({ ar, sales }) => ar / (sales / 365),
    "working-capital": ({ ca, cl }) => ca - cl,
    "payback-period": ({ cost, annualCF }) => cost / annualCF,
    "profitability-index": ({ cost, ratePct, cf1, cf2 }) =>
      (cf1 / (1 + ratePct / 100) + cf2 / (1 + ratePct / 100) ** 2) / cost,
    "holding-period-return": ({ begin, end, income }) => ((end - begin + income) / begin) * 100,
    "portfolio-expected-return": ({ w1, w2, r1, r2 }) => (w1 / 100) * r1 + (w2 / 100) * r2,
    "portfolio-beta": ({ w1, w2, b1, b2 }) => (w1 / 100) * b1 + (w2 / 100) * b2,
    "after-tax-cost-of-debt": ({ rd, taxPct }) => rd * (1 - taxPct / 100),
    "margin-of-safety": ({ fc, price, vc, actualSales }) => {
      const be = fc / ((price - vc) / price);
      return ((actualSales - be) / actualSales) * 100;
    },
    "operating-income-cvp": ({ price, vc, units, fc }) => (price - vc) * units - fc,
    "units-of-production-dep": ({ cost, salvage, totalUnits, unitsThisYear }) =>
      ((cost - salvage) / totalUnits) * unitsThisYear,
    "book-value-per-share": ({ equity, preferred, shares }) => (equity - preferred) / shares,
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
