/**
 * Per-week diagram config, keyed by `${monthId}:${weekId}` — same pattern as
 * WEEK_TOOLS in app/learn/[monthId]/[weekId]/page.tsx. Each entry sources its
 * numbers from a real, deterministic parametric generator (lib/parametricCma.ts),
 * never fabricated or scraped from prose. A fixed seed keeps the same numbers
 * on every load, so the diagram matches whatever the page renders around it.
 *
 * Populating this map is a manual, per-lesson editorial task, not automatable:
 * most CMA lesson prose is conceptual (no embedded dollar figures to parse),
 * and lesson JSON carries no skills/topic tags of its own — only the parametric
 * generators' own ProblemInstance.skills do. Check a candidate week's title
 * and lessonHtml by hand, confirm a generator genuinely matches the week's
 * topic, then add an entry. Skip weeks with no clean match — no diagram beats
 * a forced one.
 */
import {
  materialPriceVariance,
  flexibleBudgetVariance,
  residualIncome,
  laborRateVariance,
  cashConversionCycle,
  degreeOperatingLeverage,
  transferPriceMinimum,
  abcDriverRate,
  makeOrBuyAdvantage,
  cashCollectionsSchedule,
  cmPerConstraintUnit,
} from "./parametricCma";
import type { VarianceLineDiagramProps } from "@/components/diagrams/VarianceLineDiagram";
import type { MetricBreakdownDiagramProps } from "@/components/diagrams/MetricBreakdownDiagram";

export type WeekDiagram =
  | { kind: "variance-line"; props: VarianceLineDiagramProps }
  | { kind: "metric-breakdown"; props: MetricBreakdownDiagramProps };

function varianceLineFromMaterialPrice(seed: number): VarianceLineDiagramProps {
  const p = materialPriceVariance(seed);
  const { ap, sp } = p.params;
  return {
    label: "Direct-materials price variance",
    standardLabel: "Standard price",
    standardValue: sp,
    actualLabel: "Actual price",
    actualValue: ap,
    variance: p.answer,
    unit: "$",
    favorable: p.answer < 0,
  };
}

function varianceLineFromFlexibleBudget(seed: number): VarianceLineDiagramProps {
  const p = flexibleBudgetVariance(seed);
  const { fixed, varPerUnit, actualUnits, actualCost } = p.params;
  const flexBudget = fixed + varPerUnit * actualUnits;
  return {
    label: "Flexible-budget variance",
    standardLabel: "Flexible budget",
    standardValue: flexBudget,
    actualLabel: "Actual cost",
    actualValue: actualCost,
    variance: p.answer,
    unit: "$",
    favorable: p.answer < 0,
  };
}

function varianceLineFromResidualIncome(seed: number): VarianceLineDiagramProps {
  const p = residualIncome(seed);
  const { assets, requiredPct, opIncome } = p.params;
  const minIncome = assets * (requiredPct / 100);
  return {
    label: "Residual income",
    standardLabel: "Minimum required income",
    standardValue: minIncome,
    actualLabel: "Actual operating income",
    actualValue: opIncome,
    variance: p.answer,
    unit: "$",
    // Opposite polarity from a cost variance: exceeding the minimum required
    // income is favorable (the division cleared its cost of capital), not
    // "over budget."
    favorable: p.answer > 0,
  };
}

function varianceLineFromLaborRate(seed: number): VarianceLineDiagramProps {
  const p = laborRateVariance(seed);
  const { ar, sr } = p.params;
  return {
    label: "Direct-labor rate variance",
    standardLabel: "Standard rate",
    standardValue: sr,
    actualLabel: "Actual rate",
    actualValue: ar,
    variance: p.answer,
    unit: "$",
    favorable: p.answer < 0,
  };
}

function metricBreakdownFromCashConversionCycle(seed: number): MetricBreakdownDiagramProps {
  const p = cashConversionCycle(seed);
  const { dso, dio, dpo } = p.params;
  return {
    label: "Cash conversion cycle",
    terms: [
      { label: "Days sales outstanding", value: dso, unit: "days" },
      { label: "Days inventory outstanding", value: dio, unit: "days" },
      { label: "Days payables outstanding", value: dpo, unit: "days" },
    ],
    operators: ["+", "−"],
    result: { label: "Cash conversion cycle", value: p.answer, unit: "days" },
  };
}

function metricBreakdownFromOperatingLeverage(seed: number): MetricBreakdownDiagramProps {
  const p = degreeOperatingLeverage(seed);
  const { sales, vcPct, fixed } = p.params;
  const cm = sales * (1 - vcPct / 100);
  const opIncome = cm - fixed;
  return {
    label: "Degree of operating leverage",
    terms: [
      { label: "Contribution margin", value: cm, unit: "$" },
      { label: "Operating income", value: opIncome, unit: "$" },
    ],
    operators: ["÷"],
    result: { label: "Degree of operating leverage", value: p.answer, unit: "x" },
  };
}

function metricBreakdownFromTransferPrice(seed: number): MetricBreakdownDiagramProps {
  const p = transferPriceMinimum(seed);
  const { varCost, outsidePrice } = p.params;
  const opportunityCost = outsidePrice - varCost;
  return {
    label: "Minimum transfer price (at full capacity)",
    terms: [
      { label: "Variable cost", value: varCost, unit: "$" },
      { label: "Opportunity cost", value: opportunityCost, unit: "$" },
    ],
    operators: ["+"],
    result: { label: "Minimum transfer price", value: p.answer, unit: "$" },
  };
}

function metricBreakdownFromAbcDriverRate(seed: number): MetricBreakdownDiagramProps {
  const p = abcDriverRate(seed);
  const { poolCost, totalDriver, productDriver } = p.params;
  const rate = poolCost / totalDriver;
  return {
    label: "ABC cost assigned to Product A",
    terms: [
      { label: "Rate per setup", value: rate, unit: "$" },
      { label: "Product A's setups", value: productDriver },
    ],
    operators: ["×"],
    result: { label: "Cost assigned to Product A", value: p.answer, unit: "$" },
  };
}

function varianceLineFromMakeOrBuy(seed: number): VarianceLineDiagramProps {
  const p = makeOrBuyAdvantage(seed);
  const { dm, dl, voh, avoidableFoh, buyPrice } = p.params;
  const makeCost = dm + dl + voh + avoidableFoh;
  return {
    label: "Make-or-buy: cost per unit",
    standardLabel: "Cost to make",
    standardValue: makeCost,
    actualLabel: "Cost to buy",
    actualValue: buyPrice,
    variance: buyPrice - makeCost,
    unit: "$",
    // Cheaper to make is favorable (keep making); cheaper to buy is unfavorable
    // to the make option, i.e. the plant should buy instead.
    favorable: makeCost < buyPrice,
  };
}

function metricBreakdownFromCashCollections(seed: number): MetricBreakdownDiagramProps {
  const p = cashCollectionsSchedule(seed);
  const { s1, s2, s3, p1, p2, p3 } = p.params;
  return {
    label: "Cash collected in March",
    terms: [
      { label: "March sales collected now", value: (s3 * p1) / 100, unit: "$" },
      { label: "February sales collected", value: (s2 * p2) / 100, unit: "$" },
      { label: "January sales collected", value: (s1 * p3) / 100, unit: "$" },
    ],
    operators: ["+", "+"],
    result: { label: "Cash collected in March", value: p.answer, unit: "$" },
  };
}

function metricBreakdownFromConstraintCM(seed: number): MetricBreakdownDiagramProps {
  const p = cmPerConstraintUnit(seed);
  const { price, vc, hoursPerUnit } = p.params;
  const cm = price - vc;
  return {
    label: "Contribution margin per constraint hour",
    terms: [
      { label: "Contribution margin per unit", value: cm, unit: "$" },
      { label: "Machine hours per unit", value: hoursPerUnit },
    ],
    operators: ["÷"],
    result: { label: "CM per machine hour", value: p.answer, unit: "$" },
  };
}

export const WEEK_DIAGRAMS: Record<string, WeekDiagram> = {
  // CMA (keyed monthId:weekId, e.g. "m3:w1")
  "m2:w2": { kind: "variance-line", props: varianceLineFromFlexibleBudget(2201) },
  "m2:w3": { kind: "metric-breakdown", props: metricBreakdownFromCashCollections(2301) },
  "m3:w1": { kind: "variance-line", props: varianceLineFromMaterialPrice(3001) },
  "m3:w2": { kind: "metric-breakdown", props: metricBreakdownFromTransferPrice(3201) },
  "m3:w3": { kind: "variance-line", props: varianceLineFromResidualIncome(3301) },
  "m4:w4": { kind: "metric-breakdown", props: metricBreakdownFromAbcDriverRate(4401) },
  "m8:w3": { kind: "metric-breakdown", props: metricBreakdownFromCashConversionCycle(4801) },
  "m9:w1": { kind: "metric-breakdown", props: metricBreakdownFromOperatingLeverage(9101) },
  "m9:w2": { kind: "variance-line", props: varianceLineFromMakeOrBuy(9201) },
  "m9:w4": { kind: "metric-breakdown", props: metricBreakdownFromConstraintCM(9402) },
  // CPA (keyed unitId:weekId, e.g. "bar-u1:w2")
  "bar-u1:w2": { kind: "variance-line", props: varianceLineFromLaborRate(1802) },
  // Finance (keyed unitId:weekId, e.g. "finance-u3:w3")
  "finance-u3:w3": {
    kind: "metric-breakdown",
    props: metricBreakdownFromCashConversionCycle(3303),
  },
};
