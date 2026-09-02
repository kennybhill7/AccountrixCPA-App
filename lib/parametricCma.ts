/**
 * CMA parametric generators — blueprint-weighted drill supply.
 *
 * Companion to lib/parametric.ts (44 general finance/managerial generators).
 * This file targets the CMA blueprint areas with the largest weight-to-coverage
 * gap, measured 2026-09-02:
 *
 *   Part 2-C Decision Analysis      25% of Part 2 — highest weight, near-zero coverage
 *   Part 1-B Planning & Budgeting   20% of Part 1 — no budget-schedule generators existed
 *   Part 1-C Performance Management 20% of Part 1 — no variance generators existed
 *   Part 1-D Cost Management        15% of Part 1 — only high-low existed
 *   Part 2-A/B Analysis & Corp Fin  20% each      — ratios existed, cycle/leverage/EOQ did not
 *
 * Every generator is deterministic on its seed (mulberry32 via `rng`) and
 * self-verifying: the answer is computed from the same params the prompt
 * states. Golden (seed → answer) pairs for all 33 are pinned in
 * tests/unit/parametricCma.test.ts and were independently recomputed outside
 * TypeScript before being committed — a test that recomputes with the same
 * formula would pass a wrong formula.
 *
 * Skill ids are drawn ONLY from the frozen v1 taxonomy (docs/SKILL_TAXONOMY.md).
 */
import { rng, type Generator } from "./parametricCore";

const money = (n: number) => `$${n.toLocaleString()}`;

// ===========================================================================
// Part 1-B — Planning, Budgeting & Forecasting (20%)
// ===========================================================================

/**
 * Cash collections in the third month of a three-month sales sequence.
 * Collections = m3·p1 + m2·p2 + m1·p3, where p1+p2+p3 = 100.
 * Hand check (seed 101): see golden table in the test.
 */
export const cashCollectionsSchedule: Generator = (seed) => {
  const g = rng(seed);
  const s1 = g.step(80000, 200000, 5000);
  const s2 = g.step(80000, 200000, 5000);
  const s3 = g.step(80000, 200000, 5000);
  const p1 = g.step(40, 60, 5);
  const p2 = g.step(25, 40, 5);
  const p3 = 100 - p1 - p2;
  const answer = g.round((s3 * p1 + s2 * p2 + s1 * p3) / 100, 2);
  return {
    id: "cash-collections-schedule",
    seed,
    prompt: `Sales were ${money(s1)} in January, ${money(s2)} in February and ${money(s3)} in March. The company collects ${p1}% of a month's sales in the month of sale, ${p2}% in the following month, and the remaining ${p3}% in the second month after the sale. How much cash is collected in March?`,
    params: { s1, s2, s3, p1, p2, p3 },
    answer,
    unit: "$",
    skills: ["budgeting", "cash-forecasting"],
  };
};

/** Production budget: units produced = sales + desired ending FG − beginning FG. */
export const productionBudgetUnits: Generator = (seed) => {
  const g = rng(seed);
  const sales = g.step(5000, 40000, 500);
  const endFg = g.step(500, 6000, 100);
  const begFg = g.step(300, 5000, 100);
  const answer = sales + endFg - begFg;
  return {
    id: "production-budget-units",
    seed,
    prompt: `Budgeted sales are ${sales.toLocaleString()} units. Beginning finished-goods inventory is ${begFg.toLocaleString()} units and the desired ending finished-goods inventory is ${endFg.toLocaleString()} units. How many units must be produced?`,
    params: { sales, begFg, endFg },
    answer,
    unit: "units",
    skills: ["budgeting"],
  };
};

/**
 * Direct-materials purchases budget, in dollars.
 * Purchases (lbs) = production·lbsPerUnit + desired ending − beginning; × cost/lb.
 */
export const materialsPurchasesBudget: Generator = (seed) => {
  const g = rng(seed);
  const production = g.step(4000, 30000, 500);
  const lbsPerUnit = g.int(2, 6);
  const endLbs = g.step(1000, 9000, 500);
  const begLbs = g.step(500, 8000, 500);
  const costPerLb = g.step(2, 12, 1);
  const lbs = production * lbsPerUnit + endLbs - begLbs;
  const answer = g.round(lbs * costPerLb, 2);
  return {
    id: "materials-purchases-budget",
    seed,
    prompt: `Production is budgeted at ${production.toLocaleString()} units, each requiring ${lbsPerUnit} pounds of direct material. Beginning materials inventory is ${begLbs.toLocaleString()} pounds and desired ending materials inventory is ${endLbs.toLocaleString()} pounds. Material costs ${money(costPerLb)} per pound. What is the total cost of materials to be purchased?`,
    params: { production, lbsPerUnit, begLbs, endLbs, costPerLb },
    answer,
    unit: "$",
    skills: ["budgeting"],
  };
};

/**
 * Flexible-budget variance on total cost.
 * FB cost at actual volume = fixed + variablePerUnit·actualUnits.
 * Variance = actual cost − FB cost. Positive = unfavorable (overspent).
 */
export const flexibleBudgetVariance: Generator = (seed) => {
  const g = rng(seed);
  const actualUnits = g.step(4000, 20000, 500);
  const varPerUnit = g.step(3, 15, 1);
  const fixed = g.step(20000, 90000, 5000);
  const actualCost = g.step(60000, 300000, 1000);
  const flexBudget = fixed + varPerUnit * actualUnits;
  const answer = g.round(actualCost - flexBudget, 2);
  return {
    id: "flexible-budget-variance",
    seed,
    prompt: `The company produced ${actualUnits.toLocaleString()} units and incurred ${money(actualCost)} of total cost. The standard is ${money(varPerUnit)} of variable cost per unit plus ${money(fixed)} of fixed cost. What is the flexible-budget variance for total cost? Enter a positive number for unfavorable, negative for favorable.`,
    params: { actualUnits, varPerUnit, fixed, actualCost },
    answer,
    unit: "$",
    skills: ["budgeting", "variance-analysis"],
  };
};

/**
 * Learning curve, cumulative-average-time model.
 * At a `ratePct`% curve, cumulative average time per unit halves-doubles:
 * doubling output multiplies the cumulative average by rate. For 2^k units,
 * cumAvg = h1·rate^k and total = units·h1·rate^k.
 */
export const learningCurveTotalHours: Generator = (seed) => {
  const g = rng(seed);
  const h1 = g.step(80, 400, 20);
  const ratePct = g.pick([80, 90] as const);
  const units = g.pick([4, 8, 16] as const);
  const k = Math.log2(units);
  const rate = ratePct / 100;
  const answer = g.round(units * h1 * rate ** k, 2);
  return {
    id: "learning-curve-total-hours",
    seed,
    prompt: `The first unit required ${h1} direct labor hours. The company experiences a ${ratePct}% cumulative-average-time learning curve. What are the total direct labor hours for the first ${units} units?`,
    params: { h1, ratePct, units },
    answer,
    unit: "hours",
    skills: ["cost-behavior", "financial-forecasting"],
  };
};

/**
 * Cash-budget ending balance with a minimum-balance borrowing rule.
 * Available = beginning + collections − disbursements. If below the minimum,
 * borrow (in 1,000 increments) up to at least the minimum.
 */
export const cashBudgetEndingBalance: Generator = (seed) => {
  const g = rng(seed);
  const begin = g.step(10000, 60000, 1000);
  const collections = g.step(80000, 250000, 1000);
  const disbursements = g.step(90000, 280000, 1000);
  const minimum = g.step(20000, 50000, 5000);
  const available = begin + collections - disbursements;
  const shortfall = minimum - available;
  const borrowing = shortfall > 0 ? Math.ceil(shortfall / 1000) * 1000 : 0;
  const answer = g.round(available + borrowing, 2);
  return {
    id: "cash-budget-ending-balance",
    seed,
    prompt: `Beginning cash is ${money(begin)}. Budgeted collections are ${money(collections)} and budgeted disbursements are ${money(disbursements)}. The company must maintain a minimum cash balance of ${money(minimum)} and borrows in ${money(1000)} increments to do so. What is the ending cash balance?`,
    params: { begin, collections, disbursements, minimum },
    answer,
    unit: "$",
    skills: ["budgeting", "cash-forecasting", "working-capital-mgmt"],
  };
};

// ===========================================================================
// Part 1-C — Performance Management (20%)
// ===========================================================================

/** Direct-materials price variance = (AP − SP) × AQ purchased. Positive = unfavorable. */
export const materialPriceVariance: Generator = (seed) => {
  const g = rng(seed);
  const aqPurchased = g.step(5000, 40000, 500);
  const spCents = g.step(200, 900, 25);
  const apCents = spCents + g.step(-60, 60, 5);
  const sp = spCents / 100;
  const ap = apCents / 100;
  const answer = g.round((ap - sp) * aqPurchased, 2);
  return {
    id: "material-price-variance",
    seed,
    prompt: `The company purchased ${aqPurchased.toLocaleString()} pounds of direct material at ${money(ap)} per pound. The standard price is ${money(sp)} per pound. What is the direct-materials price variance? Enter a positive number for unfavorable, negative for favorable.`,
    params: { aqPurchased, ap, sp },
    answer,
    unit: "$",
    skills: ["variance-analysis", "performance-mgmt"],
  };
};

/** Direct-materials quantity variance = (AQ used − SQ allowed) × SP. */
export const materialQuantityVariance: Generator = (seed) => {
  const g = rng(seed);
  const output = g.step(2000, 12000, 100);
  const stdPerUnit = g.int(2, 6);
  const sqAllowed = output * stdPerUnit;
  const aqUsed = sqAllowed + g.step(-2000, 2000, 100);
  const sp = g.step(3, 12, 1);
  const answer = g.round((aqUsed - sqAllowed) * sp, 2);
  return {
    id: "material-quantity-variance",
    seed,
    prompt: `The company produced ${output.toLocaleString()} units. The standard is ${stdPerUnit} pounds per unit at ${money(sp)} per pound. Actual usage was ${aqUsed.toLocaleString()} pounds. What is the direct-materials quantity variance? Positive for unfavorable, negative for favorable.`,
    params: { output, stdPerUnit, aqUsed, sp },
    answer,
    unit: "$",
    skills: ["variance-analysis", "performance-mgmt"],
  };
};

/** Direct-labor rate variance = (AR − SR) × AH. */
export const laborRateVariance: Generator = (seed) => {
  const g = rng(seed);
  const ah = g.step(2000, 20000, 100);
  const srCents = g.step(1500, 4000, 50);
  const arCents = srCents + g.step(-300, 300, 25);
  const sr = srCents / 100;
  const ar = arCents / 100;
  const answer = g.round((ar - sr) * ah, 2);
  return {
    id: "labor-rate-variance",
    seed,
    prompt: `Employees worked ${ah.toLocaleString()} direct labor hours at an average actual rate of ${money(ar)} per hour. The standard rate is ${money(sr)} per hour. What is the direct-labor rate variance? Positive for unfavorable, negative for favorable.`,
    params: { ah, ar, sr },
    answer,
    unit: "$",
    skills: ["variance-analysis", "performance-mgmt"],
  };
};

/** Direct-labor efficiency variance = (AH − SH allowed) × SR. */
export const laborEfficiencyVariance: Generator = (seed) => {
  const g = rng(seed);
  const output = g.step(1000, 9000, 100);
  const stdHrsPerUnit = g.pick([1, 2, 3, 4] as const);
  const sh = output * stdHrsPerUnit;
  // Deviate by a bounded PERCENTAGE of standard hours, never a flat band —
  // a flat ±1,500 on a 1,000-hour standard can produce negative actual hours.
  const deviationPct = g.step(-15, 15, 1);
  const ah = Math.round((sh * (1 + deviationPct / 100)) / 50) * 50;
  const sr = g.step(15, 40, 1);
  const answer = g.round((ah - sh) * sr, 2);
  return {
    id: "labor-efficiency-variance",
    seed,
    prompt: `The company produced ${output.toLocaleString()} units with a standard of ${stdHrsPerUnit} direct labor hour(s) per unit at ${money(sr)} per hour. Employees actually worked ${ah.toLocaleString()} hours. What is the direct-labor efficiency variance? Positive for unfavorable, negative for favorable.`,
    params: { output, stdHrsPerUnit, ah, sr },
    answer,
    unit: "$",
    skills: ["variance-analysis", "performance-mgmt"],
  };
};

/** Variable-overhead spending variance = actual VOH − (AH × standard VOH rate). */
export const vohSpendingVariance: Generator = (seed) => {
  const g = rng(seed);
  const ah = g.step(3000, 20000, 100);
  const stdRate = g.step(3, 12, 1);
  const actualVoh = g.step(15000, 200000, 500);
  const answer = g.round(actualVoh - ah * stdRate, 2);
  return {
    id: "voh-spending-variance",
    seed,
    prompt: `Actual variable overhead was ${money(actualVoh)} for ${ah.toLocaleString()} actual direct labor hours. The standard variable overhead rate is ${money(stdRate)} per direct labor hour. What is the variable-overhead spending variance? Positive for unfavorable, negative for favorable.`,
    params: { ah, stdRate, actualVoh },
    answer,
    unit: "$",
    skills: ["variance-analysis", "costing-systems"],
  };
};

/**
 * Fixed-overhead production-volume variance = budgeted FOH − applied FOH,
 * where applied = SH allowed × (budgeted FOH / denominator hours).
 * Positive = unfavorable (under-applied capacity).
 */
export const fohVolumeVariance: Generator = (seed) => {
  const g = rng(seed);
  const budgetedFoh = g.step(100000, 600000, 10000);
  const denominatorHours = g.step(10000, 50000, 1000);
  const shAllowed = denominatorHours + g.step(-6000, 6000, 500);
  const rate = budgetedFoh / denominatorHours;
  const answer = g.round(budgetedFoh - shAllowed * rate, 2);
  return {
    id: "foh-volume-variance",
    seed,
    prompt: `Budgeted fixed overhead is ${money(budgetedFoh)} at a denominator level of ${denominatorHours.toLocaleString()} standard direct labor hours. Standard hours allowed for actual output were ${shAllowed.toLocaleString()}. What is the fixed-overhead production-volume variance? Positive for unfavorable, negative for favorable.`,
    params: { budgetedFoh, denominatorHours, shAllowed },
    answer,
    unit: "$",
    skills: ["variance-analysis", "costing-systems"],
  };
};

/** Residual income = operating income − (required return × operating assets). */
export const residualIncome: Generator = (seed) => {
  const g = rng(seed);
  const assets = g.step(500000, 4000000, 50000);
  const opIncome = g.step(60000, 700000, 5000);
  const requiredPct = g.int(8, 16);
  const answer = g.round(opIncome - assets * (requiredPct / 100), 2);
  return {
    id: "residual-income",
    seed,
    prompt: `A division has operating assets of ${money(assets)} and operating income of ${money(opIncome)}. The required rate of return is ${requiredPct}%. What is the division's residual income?`,
    params: { assets, opIncome, requiredPct },
    answer,
    unit: "$",
    skills: ["performance-mgmt", "ratio-analysis"],
  };
};

/** EVA = NOPAT − (WACC × invested capital), NOPAT = EBIT × (1 − t). */
export const economicValueAdded: Generator = (seed) => {
  const g = rng(seed);
  const ebit = g.step(200000, 2000000, 10000);
  const taxPct = g.step(20, 35, 1);
  const capital = g.step(1000000, 9000000, 100000);
  const waccPct = g.int(7, 14);
  const nopat = ebit * (1 - taxPct / 100);
  const answer = g.round(nopat - capital * (waccPct / 100), 2);
  return {
    id: "economic-value-added",
    seed,
    prompt: `A company reports EBIT of ${money(ebit)}, a tax rate of ${taxPct}%, invested capital of ${money(capital)} and a WACC of ${waccPct}%. What is its economic value added (EVA)?`,
    params: { ebit, taxPct, capital, waccPct },
    answer,
    unit: "$",
    skills: ["performance-mgmt", "cost-of-capital"],
  };
};

/**
 * Minimum acceptable transfer price when the selling division is at capacity:
 * variable cost + opportunity cost (contribution margin forgone on outside sales).
 */
export const transferPriceMinimum: Generator = (seed) => {
  const g = rng(seed);
  const varCost = g.step(20, 90, 2);
  const outsidePrice = g.step(100, 200, 5);
  const answer = g.round(varCost + (outsidePrice - varCost), 2);
  return {
    id: "transfer-price-minimum",
    seed,
    prompt: `A selling division operates at full capacity. Its variable cost per unit is ${money(varCost)} and it sells externally at ${money(outsidePrice)} per unit. What is the minimum transfer price it should accept from an internal division?`,
    params: { varCost, outsidePrice },
    answer,
    unit: "$",
    skills: ["transfer-pricing", "decision-analysis"],
  };
};

// ===========================================================================
// Part 1-D — Cost Management (15%)
// ===========================================================================

/** Applied overhead = actual base × POHR, POHR = estimated OH / estimated base. */
export const pohrAppliedOverhead: Generator = (seed) => {
  const g = rng(seed);
  const estOh = g.step(200000, 1200000, 10000);
  const estBase = g.step(20000, 80000, 1000);
  const actualBase = estBase + g.step(-8000, 8000, 500);
  const pohr = estOh / estBase;
  const answer = g.round(actualBase * pohr, 2);
  return {
    id: "pohr-applied-overhead",
    seed,
    prompt: `Estimated overhead for the year is ${money(estOh)} and the estimated allocation base is ${estBase.toLocaleString()} machine hours. Actual machine hours were ${actualBase.toLocaleString()}. How much overhead was applied?`,
    params: { estOh, estBase, actualBase },
    answer,
    unit: "$",
    skills: ["costing-systems"],
  };
};

/** Over/(under)applied overhead = applied − actual. Positive = overapplied. */
export const overUnderAppliedOverhead: Generator = (seed) => {
  const g = rng(seed);
  const pohr = g.step(10, 40, 1);
  const actualBase = g.step(15000, 60000, 500);
  const actualOh = g.step(200000, 2000000, 5000);
  const answer = g.round(actualBase * pohr - actualOh, 2);
  return {
    id: "over-under-applied-overhead",
    seed,
    prompt: `The predetermined overhead rate is ${money(pohr)} per machine hour. Actual machine hours were ${actualBase.toLocaleString()} and actual overhead incurred was ${money(actualOh)}. What is the over- or underapplied overhead? Positive for overapplied, negative for underapplied.`,
    params: { pohr, actualBase, actualOh },
    answer,
    unit: "$",
    skills: ["costing-systems"],
  };
};

/** Weighted-average equivalent units = units completed + (ending WIP × % complete). */
export const equivalentUnitsWeightedAvg: Generator = (seed) => {
  const g = rng(seed);
  const completed = g.step(8000, 50000, 500);
  const endWip = g.step(1000, 12000, 500);
  const pctComplete = g.step(20, 90, 5);
  const answer = g.round(completed + endWip * (pctComplete / 100), 2);
  return {
    id: "equivalent-units-weighted-avg",
    seed,
    prompt: `Under weighted-average process costing, ${completed.toLocaleString()} units were completed and transferred out. Ending work in process is ${endWip.toLocaleString()} units, ${pctComplete}% complete as to conversion. What are the equivalent units of production for conversion costs?`,
    params: { completed, endWip, pctComplete },
    answer,
    unit: "units",
    skills: ["costing-systems"],
  };
};

/** ABC: cost assigned = (pool cost / total driver units) × product driver units. */
export const abcDriverRate: Generator = (seed) => {
  const g = rng(seed);
  const poolCost = g.step(120000, 900000, 10000);
  const totalDriver = g.step(2000, 20000, 100);
  const productDriver = g.step(100, 1900, 50);
  const answer = g.round((poolCost / totalDriver) * productDriver, 2);
  return {
    id: "abc-driver-rate",
    seed,
    prompt: `An activity cost pool totals ${money(poolCost)} and is driven by ${totalDriver.toLocaleString()} total setups. Product A required ${productDriver.toLocaleString()} setups. How much of the pool is assigned to Product A?`,
    params: { poolCost, totalDriver, productDriver },
    answer,
    unit: "$",
    skills: ["costing-systems", "cost-behavior"],
  };
};

/** Joint cost allocated by relative sales value at split-off. */
export const jointCostSalesValue: Generator = (seed) => {
  const g = rng(seed);
  const jointCost = g.step(100000, 800000, 10000);
  const svA = g.step(100000, 500000, 10000);
  const svB = g.step(100000, 500000, 10000);
  const answer = g.round(jointCost * (svA / (svA + svB)), 2);
  return {
    id: "joint-cost-sales-value",
    seed,
    prompt: `Joint costs of ${money(jointCost)} produce two products. At the split-off point Product A has a sales value of ${money(svA)} and Product B ${money(svB)}. Using the relative sales value method, how much joint cost is allocated to Product A?`,
    params: { jointCost, svA, svB },
    answer,
    unit: "$",
    skills: ["costing-systems"],
  };
};

/**
 * Absorption income − variable income = fixed OH per unit × (produced − sold).
 * Inventory build defers fixed overhead on the balance sheet under absorption.
 */
export const absorptionVsVariableIncome: Generator = (seed) => {
  const g = rng(seed);
  const produced = g.step(10000, 40000, 500);
  const sold = produced - g.step(-4000, 4000, 500);
  const fixedOh = g.step(100000, 600000, 10000);
  const fohPerUnit = fixedOh / produced;
  const answer = g.round(fohPerUnit * (produced - sold), 2);
  return {
    id: "absorption-vs-variable-income",
    seed,
    prompt: `The company produced ${produced.toLocaleString()} units and sold ${sold.toLocaleString()} units. Total fixed manufacturing overhead was ${money(fixedOh)}. By how much does absorption-costing operating income exceed variable-costing operating income? A negative answer means absorption income is lower.`,
    params: { produced, sold, fixedOh },
    answer,
    unit: "$",
    skills: ["costing-systems", "cvp-analysis"],
  };
};

// ===========================================================================
// Part 2-C — Decision Analysis (25% — the heaviest area in Part 2)
// ===========================================================================

/** Special order with idle capacity: incremental profit = (price − VC)·units − incremental fixed. */
export const specialOrderProfit: Generator = (seed) => {
  const g = rng(seed);
  const units = g.step(1000, 12000, 500);
  const price = g.step(20, 70, 1);
  const vc = g.step(10, 45, 1);
  const incFixed = g.step(0, 30000, 2500);
  const answer = g.round((price - vc) * units - incFixed, 2);
  return {
    id: "special-order-profit",
    seed,
    prompt: `A customer offers to buy ${units.toLocaleString()} units at ${money(price)} each. Variable cost is ${money(vc)} per unit and the order would add ${money(incFixed)} of incremental fixed cost. The company has idle capacity and the order will not affect regular sales. What is the incremental profit from accepting?`,
    params: { units, price, vc, incFixed },
    answer,
    unit: "$",
    skills: ["decision-analysis", "pricing-margin-analysis", "cvp-analysis"],
  };
};

/**
 * Make or buy: advantage of making = (buy price − relevant make cost) × units.
 * Relevant make cost excludes unavoidable allocated fixed overhead.
 */
export const makeOrBuyAdvantage: Generator = (seed) => {
  const g = rng(seed);
  const units = g.step(2000, 20000, 500);
  const dm = g.step(4, 20, 1);
  const dl = g.step(3, 18, 1);
  const voh = g.step(2, 10, 1);
  const avoidableFoh = g.step(1, 6, 1);
  const buyPrice = g.step(15, 55, 1);
  const makeCost = dm + dl + voh + avoidableFoh;
  const answer = g.round((buyPrice - makeCost) * units, 2);
  return {
    id: "make-or-buy-advantage",
    seed,
    prompt: `A part can be purchased for ${money(buyPrice)} each. Making it costs ${money(dm)} direct materials, ${money(dl)} direct labor and ${money(voh)} variable overhead per unit, plus ${money(avoidableFoh)} per unit of fixed overhead that would be avoided if the part were purchased. Allocated unavoidable fixed overhead is excluded. For ${units.toLocaleString()} units, what is the advantage of making rather than buying? A negative answer favors buying.`,
    params: { units, dm, dl, voh, avoidableFoh, buyPrice },
    answer,
    unit: "$",
    skills: ["decision-analysis", "pricing-margin-analysis"],
  };
};

/** Sell or process further: incremental revenue − incremental processing cost. */
export const sellOrProcessFurther: Generator = (seed) => {
  const g = rng(seed);
  const units = g.step(1000, 10000, 500);
  const priceSplit = g.step(10, 40, 1);
  const priceFinal = priceSplit + g.step(3, 25, 1);
  const processCost = g.step(5000, 90000, 1000);
  const answer = g.round((priceFinal - priceSplit) * units - processCost, 2);
  return {
    id: "sell-or-process-further",
    seed,
    prompt: `${units.toLocaleString()} units can be sold at split-off for ${money(priceSplit)} each, or processed further at a total additional cost of ${money(processCost)} and sold for ${money(priceFinal)} each. Joint costs already incurred are not relevant. What is the incremental profit from processing further?`,
    params: { units, priceSplit, priceFinal, processCost },
    answer,
    unit: "$",
    skills: ["decision-analysis", "costing-systems"],
  };
};

/**
 * Keep or drop a segment: effect on operating income of DROPPING =
 * avoidable fixed costs − segment contribution margin.
 * Positive means dropping improves income.
 */
export const keepOrDropSegment: Generator = (seed) => {
  const g = rng(seed);
  const sales = g.step(200000, 900000, 10000);
  const vcPct = g.step(45, 80, 5);
  const avoidableFixed = g.step(30000, 250000, 5000);
  const cm = sales * (1 - vcPct / 100);
  const answer = g.round(avoidableFixed - cm, 2);
  return {
    id: "keep-or-drop-segment",
    seed,
    prompt: `A segment generates ${money(sales)} of sales with variable costs equal to ${vcPct}% of sales. Of its fixed costs, ${money(avoidableFixed)} would be avoided if the segment were dropped; the remainder would be reallocated. What is the effect on total operating income of dropping the segment? A positive answer means income increases.`,
    params: { sales, vcPct, avoidableFixed },
    answer,
    unit: "$",
    skills: ["decision-analysis", "performance-mgmt"],
  };
};

/** Constrained resource: contribution margin per unit of the scarce resource. */
export const cmPerConstraintUnit: Generator = (seed) => {
  const g = rng(seed);
  const price = g.step(40, 160, 5);
  const vc = g.step(15, 90, 5);
  const hoursPerUnit = g.pick([0.5, 1, 1.5, 2, 2.5] as const);
  const answer = g.round((price - vc) / hoursPerUnit, 2);
  return {
    id: "cm-per-constraint-unit",
    seed,
    prompt: `A product sells for ${money(price)} with variable cost of ${money(vc)} per unit and requires ${hoursPerUnit} machine hours per unit. Machine hours are the binding constraint. What is the contribution margin per machine hour?`,
    params: { price, vc, hoursPerUnit },
    answer,
    unit: "$",
    skills: ["decision-analysis", "cvp-analysis"],
  };
};

/** Expected monetary value across three states = Σ p·outcome. */
export const expectedValueDecision: Generator = (seed) => {
  const g = rng(seed);
  const p1 = g.step(10, 50, 5);
  const p2 = g.step(10, 100 - p1 - 10, 5);
  const p3 = 100 - p1 - p2;
  const o1 = g.step(-80000, 40000, 5000);
  const o2 = g.step(0, 120000, 5000);
  const o3 = g.step(50000, 300000, 5000);
  const answer = g.round((p1 * o1 + p2 * o2 + p3 * o3) / 100, 2);
  return {
    id: "expected-value-decision",
    seed,
    prompt: `An investment has three possible outcomes: ${money(o1)} with probability ${p1}%, ${money(o2)} with probability ${p2}%, and ${money(o3)} with probability ${p3}%. What is the expected value?`,
    params: { p1, p2, p3, o1, o2, o3 },
    answer,
    unit: "$",
    skills: ["decision-analysis", "risk-mgmt", "scenario-planning"],
  };
};

/**
 * Multi-product breakeven: units of Product A at breakeven.
 * Weighted-average CM per unit = Σ(mix share × CM); BE total units = fixed / WACM;
 * units of A = BE total × mix share of A.
 */
export const multiproductBreakevenUnits: Generator = (seed) => {
  const g = rng(seed);
  const mixA = g.step(40, 80, 10);
  const mixB = 100 - mixA;
  const cmA = g.step(10, 60, 5);
  const cmB = g.step(10, 60, 5);
  const fixed = g.step(100000, 900000, 10000);
  const wacm = (mixA * cmA + mixB * cmB) / 100;
  const answer = g.round((fixed / wacm) * (mixA / 100), 2);
  return {
    id: "multiproduct-breakeven-units",
    seed,
    prompt: `A company sells two products in a constant mix of ${mixA}% Product A and ${mixB}% Product B by unit volume. Contribution margins are ${money(cmA)} per unit for A and ${money(cmB)} for B. Total fixed costs are ${money(fixed)}. How many units of Product A must be sold to break even?`,
    params: { mixA, mixB, cmA, cmB, fixed },
    answer,
    unit: "units",
    skills: ["cvp-analysis", "decision-analysis"],
  };
};

// ===========================================================================
// Part 2-A / 2-B — Financial Statement Analysis & Corporate Finance (20% each)
// ===========================================================================

/** Cash conversion cycle = DSO + DIO − DPO. */
export const cashConversionCycle: Generator = (seed) => {
  const g = rng(seed);
  const dso = g.int(20, 90);
  const dio = g.int(30, 140);
  const dpo = g.int(15, 75);
  const answer = dso + dio - dpo;
  return {
    id: "cash-conversion-cycle",
    seed,
    prompt: `Days sales outstanding is ${dso} days, days inventory outstanding is ${dio} days, and days payables outstanding is ${dpo} days. What is the cash conversion cycle in days?`,
    params: { dso, dio, dpo },
    answer,
    unit: "days",
    skills: ["working-capital-mgmt", "ratio-analysis"],
  };
};

/** Sustainable growth rate = ROE × retention ratio. */
export const sustainableGrowthRate: Generator = (seed) => {
  const g = rng(seed);
  const roePct = g.step(6, 26, 1);
  const payoutPct = g.step(10, 70, 5);
  const answer = g.round(roePct * (1 - payoutPct / 100), 2);
  return {
    id: "sustainable-growth-rate",
    seed,
    prompt: `A company earns a return on equity of ${roePct}% and pays out ${payoutPct}% of net income as dividends. What is its sustainable growth rate?`,
    params: { roePct, payoutPct },
    answer,
    unit: "%",
    skills: ["ratio-analysis", "financial-forecasting"],
  };
};

/** Degree of operating leverage = contribution margin / operating income. */
export const degreeOperatingLeverage: Generator = (seed) => {
  const g = rng(seed);
  const sales = g.step(500000, 4000000, 50000);
  const vcPct = g.step(40, 75, 5);
  const cm = sales * (1 - vcPct / 100);
  // Derive fixed cost as a share of contribution margin so operating income is
  // always positive. A flat fixed-cost band produces negative operating income
  // on low-CM draws, and a negative DOL teaches nothing.
  const fixedSharePct = g.step(30, 70, 5);
  const fixed = Math.round((cm * fixedSharePct) / 100 / 10000) * 10000;
  const opIncome = cm - fixed;
  const answer = g.round(cm / opIncome, 4);
  return {
    id: "degree-operating-leverage",
    seed,
    prompt: `Sales are ${money(sales)}, variable costs are ${vcPct}% of sales, and fixed costs are ${money(fixed)}. What is the degree of operating leverage?`,
    params: { sales, vcPct, fixed },
    answer,
    unit: "x",
    skills: ["cvp-analysis", "ratio-analysis", "risk-mgmt"],
  };
};

/** Economic order quantity = sqrt(2DS / H). */
export const economicOrderQuantity: Generator = (seed) => {
  const g = rng(seed);
  const demand = g.step(5000, 80000, 1000);
  const orderCost = g.step(20, 400, 10);
  const holdingCost = g.step(1, 20, 1);
  const answer = g.round(Math.sqrt((2 * demand * orderCost) / holdingCost), 2);
  return {
    id: "economic-order-quantity",
    seed,
    prompt: `Annual demand is ${demand.toLocaleString()} units, the cost to place an order is ${money(orderCost)}, and the annual cost to carry one unit in inventory is ${money(holdingCost)}. What is the economic order quantity?`,
    params: { demand, orderCost, holdingCost },
    answer,
    unit: "units",
    skills: ["working-capital-mgmt", "decision-analysis"],
  };
};

/**
 * Annualized cost of forgoing a trade discount:
 * (d / (100 − d)) × (365 / (net period − discount period)).
 */
export const costOfTradeCredit: Generator = (seed) => {
  const g = rng(seed);
  const discPct = g.pick([1, 2, 3] as const);
  const discDays = g.pick([10, 15] as const);
  const netDays = g.pick([30, 45, 60] as const);
  const answer = g.round((discPct / (100 - discPct)) * (365 / (netDays - discDays)) * 100, 2);
  return {
    id: "cost-of-trade-credit",
    seed,
    prompt: `A supplier offers terms of ${discPct}/${discDays}, net ${netDays}. What is the approximate annualized cost of forgoing the discount, using a 365-day year?`,
    params: { discPct, discDays, netDays },
    answer,
    unit: "%",
    skills: ["working-capital-mgmt", "cost-of-capital"],
  };
};

/** Modified IRR over n years: MIRR = (FV of inflows / PV of outflow)^(1/n) − 1. */
export const modifiedIrr: Generator = (seed) => {
  const g = rng(seed);
  const cost = g.step(50000, 400000, 10000);
  const cf = g.step(20000, 150000, 5000);
  const years = g.pick([3, 4, 5] as const);
  const ratePct = g.int(6, 14);
  const r = ratePct / 100;
  let fv = 0;
  for (let t = 1; t <= years; t++) fv += cf * (1 + r) ** (years - t);
  const answer = g.round(((fv / cost) ** (1 / years) - 1) * 100, 4);
  return {
    id: "modified-irr",
    seed,
    prompt: `A project costs ${money(cost)} today and generates ${money(cf)} at the end of each of the next ${years} years. Reinvestment occurs at the ${ratePct}% cost of capital. What is the modified internal rate of return (MIRR)?`,
    params: { cost, cf, years, ratePct },
    answer,
    unit: "%",
    skills: ["capital-budgeting", "cost-of-capital"],
  };
};

// ===========================================================================
// Registry
// ===========================================================================

export const CMA_GENERATORS: Record<string, Generator> = {
  // Part 1-B Planning, Budgeting & Forecasting
  "cash-collections-schedule": cashCollectionsSchedule,
  "production-budget-units": productionBudgetUnits,
  "materials-purchases-budget": materialsPurchasesBudget,
  "flexible-budget-variance": flexibleBudgetVariance,
  "learning-curve-total-hours": learningCurveTotalHours,
  "cash-budget-ending-balance": cashBudgetEndingBalance,
  // Part 1-C Performance Management
  "material-price-variance": materialPriceVariance,
  "material-quantity-variance": materialQuantityVariance,
  "labor-rate-variance": laborRateVariance,
  "labor-efficiency-variance": laborEfficiencyVariance,
  "voh-spending-variance": vohSpendingVariance,
  "foh-volume-variance": fohVolumeVariance,
  "residual-income": residualIncome,
  "economic-value-added": economicValueAdded,
  "transfer-price-minimum": transferPriceMinimum,
  // Part 1-D Cost Management
  "pohr-applied-overhead": pohrAppliedOverhead,
  "over-under-applied-overhead": overUnderAppliedOverhead,
  "equivalent-units-weighted-avg": equivalentUnitsWeightedAvg,
  "abc-driver-rate": abcDriverRate,
  "joint-cost-sales-value": jointCostSalesValue,
  "absorption-vs-variable-income": absorptionVsVariableIncome,
  // Part 2-C Decision Analysis
  "special-order-profit": specialOrderProfit,
  "make-or-buy-advantage": makeOrBuyAdvantage,
  "sell-or-process-further": sellOrProcessFurther,
  "keep-or-drop-segment": keepOrDropSegment,
  "cm-per-constraint-unit": cmPerConstraintUnit,
  "expected-value-decision": expectedValueDecision,
  "multiproduct-breakeven-units": multiproductBreakevenUnits,
  // Part 2-A / 2-B Analysis & Corporate Finance
  "cash-conversion-cycle": cashConversionCycle,
  "sustainable-growth-rate": sustainableGrowthRate,
  "degree-operating-leverage": degreeOperatingLeverage,
  "economic-order-quantity": economicOrderQuantity,
  "cost-of-trade-credit": costOfTradeCredit,
  "modified-irr": modifiedIrr,
};

/**
 * CMA blueprint area each generator drills. Used by the blueprint-weighted
 * drill mix so practice volume tracks exam weight rather than convenience.
 */
export const CMA_GENERATOR_AREA: Record<string, string> = {
  "cash-collections-schedule": "P1-B",
  "production-budget-units": "P1-B",
  "materials-purchases-budget": "P1-B",
  "flexible-budget-variance": "P1-B",
  "learning-curve-total-hours": "P1-B",
  "cash-budget-ending-balance": "P1-B",
  "material-price-variance": "P1-C",
  "material-quantity-variance": "P1-C",
  "labor-rate-variance": "P1-C",
  "labor-efficiency-variance": "P1-C",
  "voh-spending-variance": "P1-C",
  "foh-volume-variance": "P1-C",
  "residual-income": "P1-C",
  "economic-value-added": "P1-C",
  "transfer-price-minimum": "P1-C",
  "pohr-applied-overhead": "P1-D",
  "over-under-applied-overhead": "P1-D",
  "equivalent-units-weighted-avg": "P1-D",
  "abc-driver-rate": "P1-D",
  "joint-cost-sales-value": "P1-D",
  "absorption-vs-variable-income": "P1-D",
  "special-order-profit": "P2-C",
  "make-or-buy-advantage": "P2-C",
  "sell-or-process-further": "P2-C",
  "keep-or-drop-segment": "P2-C",
  "cm-per-constraint-unit": "P2-C",
  "expected-value-decision": "P2-C",
  "multiproduct-breakeven-units": "P2-C",
  "cash-conversion-cycle": "P2-A",
  "sustainable-growth-rate": "P2-A",
  "degree-operating-leverage": "P2-A",
  "economic-order-quantity": "P2-B",
  "cost-of-trade-credit": "P2-B",
  "modified-irr": "P2-E",
};
