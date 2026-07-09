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

/**
 * PV of an ordinary annuity: PV = PMT × [1 − (1+r)^−n] / r.
 * Hand check (seed 11): PMT=2750, r=7%, n=14 →
 *   (1.07)^14 = 2.578534…, 1 − 1/2.578534 = 0.612183…, ×2750/0.07 = 24,050.04.
 */
export const annuityPv: Generator = (seed) => {
  const g = rng(seed);
  const pmt = g.step(500, 5000, 250);
  const ratePct = g.int(3, 10);
  const n = g.int(5, 20);
  const r = ratePct / 100;
  const answer = g.round((pmt * (1 - (1 + r) ** -n)) / r, 2);
  return {
    id: "annuity-pv",
    seed,
    prompt: `An ordinary annuity pays $${pmt.toLocaleString()} at the end of each year for ${n} years. At a ${ratePct}% discount rate, what is the present value?`,
    params: { pmt, ratePct, n },
    answer,
    unit: "$",
    skills: ["tvm"],
  };
};

/**
 * Annual-coupon bond price: P = C × [1 − (1+y)^−n]/y + F/(1+y)^n, F = 1000.
 * Hand check (seed 5): coupon 7% → C=70, y=8%, n=8 →
 *   annuity factor = (1 − 1.08^−8)/0.08 = 5.746639…, PV coupons = 402.26;
 *   PV face = 1000/1.08^8 = 540.27; price = 942.53 (discount: coupon < yield ✓).
 * Sanity (seed 7): coupon 2% = yield 2% → price = 1000.00 = par ✓.
 */
export const bondPrice: Generator = (seed) => {
  const g = rng(seed);
  const face = 1000;
  const couponPct = g.int(2, 9);
  const yieldPct = g.int(2, 10);
  const n = g.int(5, 20);
  const c = (face * couponPct) / 100;
  const y = yieldPct / 100;
  const answer = g.round((c * (1 - (1 + y) ** -n)) / y + face * (1 + y) ** -n, 2);
  return {
    id: "bond-price",
    seed,
    prompt: `A $${face.toLocaleString()} face-value bond pays a ${couponPct}% annual coupon for ${n} years. If the market yield is ${yieldPct}%, what is the bond's price?`,
    params: { face, couponPct, yieldPct, n },
    answer,
    unit: "$",
    skills: ["bond-valuation", "tvm"],
  };
};

/**
 * CAPM required return: r = rf + β × MRP.
 * Hand check (seed 11): rf=4%, β=1.3, MRP=7% → 4 + 1.3×7 = 4 + 9.1 = 13.1%.
 */
export const capmRequired: Generator = (seed) => {
  const g = rng(seed);
  const rfPct = g.int(2, 5);
  const beta = g.round(g.int(6, 20) / 10, 1); // 0.6–2.0
  const mrpPct = g.int(4, 9);
  const answer = g.round(rfPct + beta * mrpPct, 2);
  return {
    id: "capm-required",
    seed,
    prompt: `The risk-free rate is ${rfPct}%, the market risk premium is ${mrpPct}%, and a stock's beta is ${beta}. Per CAPM, what is the required return?`,
    params: { rfPct, beta, mrpPct },
    answer,
    unit: "%",
    skills: ["risk-return"],
  };
};

/**
 * WACC = wE × kE + wD × kD × (1 − T)  (no preferred).
 * Hand check (seed 11): wD=40% (wE=60%), kD=7%, kE=12%, T=25% →
 *   0.60×12 + 0.40×7×0.75 = 7.2 + 2.1 = 9.3%.
 */
export const waccBasic: Generator = (seed) => {
  const g = rng(seed);
  const wdPct = g.step(20, 60, 5);
  const wePct = 100 - wdPct;
  const kdPct = g.int(4, 9);
  const kePct = g.int(8, 15);
  const taxPct = g.pick([21, 25, 30] as const);
  const answer = g.round(
    (wePct / 100) * kePct + (wdPct / 100) * kdPct * (1 - taxPct / 100),
    2
  );
  return {
    id: "wacc-basic",
    seed,
    prompt: `A firm is financed ${wePct}% with equity (cost ${kePct}%) and ${wdPct}% with debt (pre-tax cost ${kdPct}%). The tax rate is ${taxPct}%. What is the WACC?`,
    params: { wdPct, wePct, kdPct, kePct, taxPct },
    answer,
    unit: "%",
    skills: ["cost-of-capital"],
  };
};

/**
 * Three-year NPV: −C0 + CF1/(1+r) + CF2/(1+r)^2 + CF3/(1+r)^3.
 * Hand check (seed 9): C0=18,000, CF=(18000, 6000, 17500), r=12% →
 *   18000/1.12 = 16,071.43; 6000/1.2544 = 4,783.16; 17500/1.404928 = 12,456.16;
 *   sum = 33,310.75 − 18,000 = 15,310.75.
 */
export const npvMultiYear: Generator = (seed) => {
  const g = rng(seed);
  const cost = g.step(10000, 50000, 1000);
  const cf1 = g.step(4000, 20000, 500);
  const cf2 = g.step(4000, 20000, 500);
  const cf3 = g.step(4000, 20000, 500);
  const ratePct = g.int(6, 14);
  const r = ratePct / 100;
  const answer = g.round(
    -cost + cf1 / (1 + r) + cf2 / (1 + r) ** 2 + cf3 / (1 + r) ** 3,
    2
  );
  return {
    id: "npv-multi-year",
    seed,
    prompt: `A project costs $${cost.toLocaleString()} today and returns $${cf1.toLocaleString()}, $${cf2.toLocaleString()}, and $${cf3.toLocaleString()} at the end of years 1–3. At a ${ratePct}% discount rate, what is the NPV?`,
    params: { cost, cf1, cf2, cf3, ratePct },
    answer,
    unit: "$",
    skills: ["capital-budgeting", "tvm"],
  };
};

/**
 * Gordon growth (constant-dividend-growth) price: P0 = D1 / (r − g).
 * r > g is guaranteed by construction: r = g + int(3, 8), so r − g ∈ [3%, 8%].
 * Hand check (seed 13): D1=$2.70, g=2%, r=5% → 2.70/(0.05 − 0.02) = 90.00.
 */
export const dividendGrowthPrice: Generator = (seed) => {
  const g = rng(seed);
  const d1 = g.round(g.int(10, 40) / 10, 2); // next dividend $1.00–$4.00
  const growthPct = g.int(1, 5);
  const requiredPct = growthPct + g.int(3, 8); // strictly > growthPct
  const answer = g.round(d1 / ((requiredPct - growthPct) / 100), 2);
  return {
    id: "dividend-growth-price",
    seed,
    prompt: `A stock will pay a dividend of $${d1.toFixed(2)} next year, growing ${growthPct}% forever. If the required return is ${requiredPct}%, what is the stock's price today?`,
    params: { d1, growthPct, requiredPct },
    answer,
    unit: "$",
    skills: ["stock-valuation"],
  };
};

// ---- Additional generators: accounting + finance blueprint coverage -------

/** Present value of a lump sum: PV = FV / (1 + r)^n. */
export const presentValueLump: Generator = (seed) => {
  const g = rng(seed);
  const fv = g.step(2000, 20000, 500);
  const ratePct = g.int(3, 10);
  const n = g.int(2, 10);
  const answer = g.round(fv / (1 + ratePct / 100) ** n, 2);
  return {
    id: "present-value-lump",
    seed,
    prompt: `You will receive $${fv.toLocaleString()} in ${n} years. At a ${ratePct}% annual discount rate, what is its present value today?`,
    params: { fv, ratePct, n },
    answer,
    unit: "$",
    skills: ["tvm"],
  };
};

/** Effective annual rate: EAR = (1 + i/m)^m − 1. */
export const effectiveAnnualRate: Generator = (seed) => {
  const g = rng(seed);
  const nominalPct = g.int(6, 18);
  const m = g.pick([2, 4, 12] as const);
  const word = m === 2 ? "semiannually" : m === 4 ? "quarterly" : "monthly";
  const answer = g.round(((1 + nominalPct / 100 / m) ** m - 1) * 100, 2);
  return {
    id: "effective-annual-rate",
    seed,
    prompt: `A ${nominalPct}% nominal annual rate is compounded ${word}. What is the effective annual rate (EAR)?`,
    params: { nominalPct, m },
    answer,
    unit: "%",
    skills: ["interest-rates"],
  };
};

/** Perpetuity present value: PV = C / r. */
export const perpetuityPv: Generator = (seed) => {
  const g = rng(seed);
  const c = g.step(50, 500, 10);
  const ratePct = g.int(4, 12);
  const answer = g.round(c / (ratePct / 100), 2);
  return {
    id: "perpetuity-pv",
    seed,
    prompt: `A perpetuity pays $${c.toLocaleString()} at the end of every year forever. At a ${ratePct}% required return, what is its present value?`,
    params: { c, ratePct },
    answer,
    unit: "$",
    skills: ["tvm"],
  };
};

/** Straight-line depreciation = (cost − salvage) / life. */
export const straightLineDepreciation: Generator = (seed) => {
  const g = rng(seed);
  const cost = g.step(20000, 100000, 1000);
  const salvage = g.step(1000, 10000, 500);
  const life = g.int(3, 10);
  const answer = g.round((cost - salvage) / life, 2);
  return {
    id: "straight-line-depreciation",
    seed,
    prompt: `Equipment costs $${cost.toLocaleString()} with a $${salvage.toLocaleString()} salvage value and a ${life}-year useful life. What is the annual straight-line depreciation?`,
    params: { cost, salvage, life },
    answer,
    unit: "$",
    skills: ["depreciation"],
  };
};

/** Double-declining-balance depreciation, year 1 = cost × (2 / life). */
export const doubleDecliningYear1: Generator = (seed) => {
  const g = rng(seed);
  const cost = g.step(20000, 100000, 1000);
  const life = g.int(4, 10);
  const answer = g.round(cost * (2 / life), 2);
  return {
    id: "ddb-year1",
    seed,
    prompt: `An asset costs $${cost.toLocaleString()} with a ${life}-year life. What is Year-1 depreciation under double-declining-balance (ignore salvage in the rate)?`,
    params: { cost, life },
    answer,
    unit: "$",
    skills: ["depreciation"],
  };
};

/** Cost of goods sold = beginning inventory + purchases − ending inventory. */
export const cogsSchedule: Generator = (seed) => {
  const g = rng(seed);
  const beg = g.step(10000, 50000, 1000);
  const purch = g.step(60000, 200000, 1000);
  const end = g.step(10000, 50000, 1000);
  const answer = beg + purch - end;
  return {
    id: "cogs-schedule",
    seed,
    prompt: `Beginning inventory is $${beg.toLocaleString()}, purchases were $${purch.toLocaleString()}, and ending inventory is $${end.toLocaleString()}. What is cost of goods sold?`,
    params: { beg, purch, end },
    answer,
    unit: "$",
    skills: ["inventory"],
  };
};

/** Basic EPS = (net income − preferred dividends) / weighted-average shares. */
export const epsBasic: Generator = (seed) => {
  const g = rng(seed);
  const ni = g.step(500000, 5000000, 50000);
  const pref = g.step(0, 200000, 10000);
  const shares = g.step(100000, 1000000, 50000);
  const answer = g.round((ni - pref) / shares, 2);
  return {
    id: "eps-basic",
    seed,
    prompt: `Net income is $${ni.toLocaleString()}, preferred dividends are $${pref.toLocaleString()}, and weighted-average common shares are ${shares.toLocaleString()}. What is basic EPS?`,
    params: { ni, pref, shares },
    answer,
    unit: "$",
    skills: ["eps"],
  };
};

/** Break-even in units = fixed costs / (price − variable cost). */
export const breakEvenUnits: Generator = (seed) => {
  const g = rng(seed);
  const price = g.int(20, 100);
  const vc = g.int(5, price - 5);
  const cm = price - vc;
  const units = g.int(500, 5000);
  const fc = cm * units; // constructed so break-even is exact
  return {
    id: "break-even-units",
    seed,
    prompt: `Fixed costs are $${fc.toLocaleString()}, the selling price is $${price}/unit, and variable cost is $${vc}/unit. What is the break-even point in units?`,
    params: { fc, price, vc },
    answer: units,
    unit: "units",
    skills: ["cvp"],
  };
};

/** Contribution margin ratio = (price − variable cost) / price. */
export const contributionMarginRatio: Generator = (seed) => {
  const g = rng(seed);
  const price = g.int(20, 100);
  const vc = g.int(5, price - 5);
  const answer = g.round(((price - vc) / price) * 100, 2);
  return {
    id: "cm-ratio",
    seed,
    prompt: `A product sells for $${price} with $${vc} variable cost per unit. What is the contribution margin ratio?`,
    params: { price, vc },
    answer,
    unit: "%",
    skills: ["cvp"],
  };
};

/** Current ratio = current assets / current liabilities. */
export const currentRatio: Generator = (seed) => {
  const g = rng(seed);
  const ca = g.step(50000, 500000, 5000);
  const cl = g.step(20000, 200000, 5000);
  const answer = g.round(ca / cl, 2);
  return {
    id: "current-ratio",
    seed,
    prompt: `Current assets are $${ca.toLocaleString()} and current liabilities are $${cl.toLocaleString()}. What is the current ratio? (Answer as a multiple, e.g. 2.10)`,
    params: { ca, cl },
    answer,
    skills: ["ratio-analysis"],
  };
};

/** Inventory turnover = COGS / average inventory. */
export const inventoryTurnover: Generator = (seed) => {
  const g = rng(seed);
  const cogs = g.step(100000, 1000000, 10000);
  const avgInv = g.step(20000, 200000, 5000);
  const answer = g.round(cogs / avgInv, 2);
  return {
    id: "inventory-turnover",
    seed,
    prompt: `Cost of goods sold is $${cogs.toLocaleString()} and average inventory is $${avgInv.toLocaleString()}. What is inventory turnover (times per year)?`,
    params: { cogs, avgInv },
    answer,
    skills: ["ratio-analysis"],
  };
};

/** Debt-to-equity = total debt / total equity. */
export const debtToEquity: Generator = (seed) => {
  const g = rng(seed);
  const debt = g.step(50000, 500000, 5000);
  const equity = g.step(50000, 500000, 5000);
  const answer = g.round(debt / equity, 2);
  return {
    id: "debt-to-equity",
    seed,
    prompt: `Total debt is $${debt.toLocaleString()} and total equity is $${equity.toLocaleString()}. What is the debt-to-equity ratio? (Answer as a multiple.)`,
    params: { debt, equity },
    answer,
    skills: ["ratio-analysis"],
  };
};

/** Ending retained earnings = beginning + net income − dividends. */
export const retainedEarningsEnding: Generator = (seed) => {
  const g = rng(seed);
  const beg = g.step(50000, 500000, 5000);
  const ni = g.step(20000, 300000, 5000);
  const div = g.step(0, 100000, 5000);
  const answer = beg + ni - div;
  return {
    id: "retained-earnings-ending",
    seed,
    prompt: `Beginning retained earnings are $${beg.toLocaleString()}, net income is $${ni.toLocaleString()}, and dividends declared are $${div.toLocaleString()}. What are ending retained earnings?`,
    params: { beg, ni, div },
    answer,
    unit: "$",
    skills: ["financial-statements"],
  };
};

/** High-low method: variable cost per unit = Δcost / Δunits. */
export const highLowVariableCost: Generator = (seed) => {
  const g = rng(seed);
  const vcPerUnit = g.int(3, 12);
  const fixed = g.step(10000, 40000, 1000);
  const unitsLow = g.step(2000, 7000, 500);
  const unitsHigh = unitsLow + g.step(3000, 10000, 500);
  const costLow = fixed + vcPerUnit * unitsLow;
  const costHigh = fixed + vcPerUnit * unitsHigh;
  return {
    id: "high-low-variable-cost",
    seed,
    prompt: `Using the high-low method: the high month had ${unitsHigh.toLocaleString()} units at $${costHigh.toLocaleString()} total cost; the low month had ${unitsLow.toLocaleString()} units at $${costLow.toLocaleString()}. What is the variable cost per unit?`,
    params: { unitsHigh, costHigh, unitsLow, costLow },
    answer: vcPerUnit,
    unit: "$",
    skills: ["cost-behavior"],
  };
};

/** Return on investment = operating income / invested capital. */
export const returnOnInvestment: Generator = (seed) => {
  const g = rng(seed);
  const income = g.step(50000, 500000, 5000);
  const investment = g.step(500000, 5000000, 50000);
  const answer = g.round((income / investment) * 100, 2);
  return {
    id: "return-on-investment",
    seed,
    prompt: `A division earns $${income.toLocaleString()} operating income on $${investment.toLocaleString()} of invested capital. What is its ROI?`,
    params: { income, investment },
    answer,
    unit: "%",
    skills: ["performance"],
  };
};

export const GENERATORS: Record<string, Generator> = {
  "tvm-future-value": tvmFutureValue,
  "npv-two-year": npvTwoYear,
  "dupont-roe": dupontRoe,
  "annuity-pv": annuityPv,
  "bond-price": bondPrice,
  "capm-required": capmRequired,
  "wacc-basic": waccBasic,
  "npv-multi-year": npvMultiYear,
  "dividend-growth-price": dividendGrowthPrice,
  "present-value-lump": presentValueLump,
  "effective-annual-rate": effectiveAnnualRate,
  "perpetuity-pv": perpetuityPv,
  "straight-line-depreciation": straightLineDepreciation,
  "ddb-year1": doubleDecliningYear1,
  "cogs-schedule": cogsSchedule,
  "eps-basic": epsBasic,
  "break-even-units": breakEvenUnits,
  "cm-ratio": contributionMarginRatio,
  "current-ratio": currentRatio,
  "inventory-turnover": inventoryTurnover,
  "debt-to-equity": debtToEquity,
  "retained-earnings-ending": retainedEarningsEnding,
  "high-low-variable-cost": highLowVariableCost,
  "return-on-investment": returnOnInvestment,
};

/** Skill tags per generator (skills are seed-invariant, so derive from seed 1). */
export const GENERATOR_SKILLS: Record<string, string[]> = Object.fromEntries(
  Object.entries(GENERATORS).map(([id, gen]) => [id, gen(1).skills])
);

/**
 * Generator ids whose skills overlap `skills`. Empty/omitted filter — or a
 * filter that matches nothing — falls back to ALL generators, so a drill
 * surface never renders empty.
 */
export function generatorsForSkills(skills?: string[]): string[] {
  const all = Object.keys(GENERATORS);
  if (!skills || skills.length === 0) return all;
  const wanted = new Set(skills);
  const matched = all.filter((id) => GENERATOR_SKILLS[id].some((s) => wanted.has(s)));
  return matched.length > 0 ? matched : all;
}

/**
 * Plain-language "how to solve it" hints, keyed by skill. Shown on demand so a
 * learner with no accounting background can see the method (not the answer)
 * before attempting. Every generator skill has an entry.
 */
export const SKILL_HINTS: Record<string, string> = {
  tvm: "Money has time value. Discount a future amount with PV = FV ÷ (1 + r)^n; grow with FV = PV × (1 + r)^n. Keep the rate r and periods n on the same time basis.",
  "capital-budgeting": "NPV = (sum of each cash flow ÷ (1 + r)^t) − the up-front cost. Discount every future inflow to today, add them, subtract what you paid.",
  dupont: "DuPont: ROE = Net Profit Margin × Asset Turnover × Equity Multiplier. Multiply the three pieces.",
  "ratio-analysis": "A ratio is just one line item ÷ another. Identify the two numbers the ratio names, then divide. Answer as a multiple (e.g., 2.10).",
  "bond-valuation": "A bond's price = present value of its coupon payments (an annuity) + present value of the face value, both discounted at the market yield.",
  "risk-return": "CAPM: required return = risk-free rate + beta × (market return − risk-free rate). The bracket is the market risk premium.",
  "cost-of-capital": "WACC = (weight of debt × after-tax cost of debt) + (weight of equity × cost of equity). Weights are each source ÷ total capital.",
  "stock-valuation": "Gordon growth model: Price = next year's dividend ÷ (required return − growth rate). Both rates as decimals; required return must exceed growth.",
  "interest-rates": "Effective annual rate (EAR) = (1 + nominal ÷ m)^m − 1, where m = compounding periods per year (semiannual 2, quarterly 4, monthly 12).",
  depreciation: "Straight-line = (cost − salvage) ÷ useful life. Double-declining Year 1 = cost × (2 ÷ life), ignoring salvage in the rate.",
  inventory: "Cost of goods sold = beginning inventory + purchases − ending inventory. (What you started with, plus what you bought, minus what's left.)",
  eps: "Basic EPS = (net income − preferred dividends) ÷ weighted-average common shares outstanding.",
  cvp: "Contribution margin per unit = price − variable cost. Break-even units = fixed costs ÷ CM per unit. CM ratio = CM per unit ÷ price.",
  "financial-statements": "Ending retained earnings = beginning retained earnings + net income − dividends declared.",
  "cost-behavior": "High-low method: variable cost per unit = (highest cost − lowest cost) ÷ (highest units − lowest units).",
  performance: "Return on investment (ROI) = operating income ÷ invested capital.",
};

/** Best hint for a set of skills (first matching skill wins). */
export function hintForSkills(skills: string[]): string | null {
  for (const s of skills) if (SKILL_HINTS[s]) return SKILL_HINTS[s];
  return null;
}

// ---- Grading tolerance ----------------------------------------------------

/**
 * Numeric grading tolerance, explicit by unit:
 *  - "%" answers: flat ±0.05 percentage points.
 *  - "$" (and unitless) answers: ±max(1% of |answer|, 0.51) — the 0.51 floor
 *    absorbs penny-rounding on small dollar answers.
 */
export function gradeTolerance(answer: number, unit?: string): number {
  if (unit === "%") return 0.05;
  return Math.max(0.01 * Math.abs(answer), 0.51);
}

/** True when `entered` is within gradeTolerance of `answer`. */
export function isWithinTolerance(entered: number, answer: number, unit?: string): boolean {
  return Math.abs(entered - answer) <= gradeTolerance(answer, unit);
}
