import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { loadEssaySims } from "@/lib/sims-content";
import { gradeNarrativeText } from "@/lib/narrativeGrading";
import type { EssayRequirement, EssaySim } from "@/lib/sims-content";

/**
 * CMA essay content tie-outs.
 *
 * Two jobs:
 *  1. Blueprint coverage — the essay bank must carry two scenarios per IMA
 *     blueprint section across both parts, so the thinnest-weighted format on
 *     the exam cannot silently regress.
 *  2. Arithmetic — every computational requirement's model answer is recomputed
 *     FROM THE EXHIBIT INPUTS here. A model answer that asserts a number the
 *     exhibits do not produce teaches the wrong thing, so it fails the build.
 *
 * The generic structural guarantees (a model answer that passes its own
 * narrative grader, reachable word floors, checklists present) live in
 * sims-structural.test.ts and apply to these files automatically.
 */

const essays = await loadEssaySims();
const byId = new Map(essays.map((e) => [e.id, e]));

const essay = (id: string): EssaySim => {
  const e = byId.get(id);
  if (!e) throw new Error(`missing essay ${id}`);
  return e;
};

const exhibit = (id: string, index = 0): Record<string, number> =>
  essay(id).exhibits![index].data as Record<string, number>;

const req = (id: string, reqId: string): EssayRequirement => {
  const r = essay(id).requirements.find((x) => x.id === reqId);
  if (!r) throw new Error(`missing requirement ${id}/${reqId}`);
  return r;
};

/** Model answer must literally contain each figure, formatted with thousands separators. */
const answerHas = (essayId: string, reqId: string, ...values: Array<number | string>) => {
  const text = req(essayId, reqId).modelAnswer;
  for (const v of values) {
    const needle = typeof v === "number" ? v.toLocaleString("en-US") : v;
    expect(text, `${essayId}/${reqId} should state ${needle}`).toContain(needle);
  }
};

/**
 * Blueprint sections. The id prefix encodes part + section; the four legacy
 * essays predate the convention and are mapped explicitly.
 */
const LEGACY_SECTION: Record<string, string> = {
  "cma-p1-roi-ri": "p1c",
  "cma-p1-variance": "p1c",
  "cma-p2-capital-budgeting": "p2e",
  "cma-p2-special-order": "p2c",
};

const SECTIONS = [
  "p1a",
  "p1b",
  "p1c",
  "p1d",
  "p1e",
  "p1f",
  "p2a",
  "p2b",
  "p2c",
  "p2d",
  "p2e",
  "p2f",
];

function sectionOf(id: string): string {
  if (LEGACY_SECTION[id]) return LEGACY_SECTION[id];
  const m = /^cma-(p[12][a-f])-/.exec(id);
  if (!m) throw new Error(`essay id ${id} does not encode a blueprint section`);
  return m[1];
}

describe("CMA essay bank — blueprint coverage", () => {
  it("carries exactly two scenarios for every blueprint section of both parts", () => {
    const counts = new Map<string, string[]>(SECTIONS.map((s) => [s, []]));
    for (const e of essays) counts.get(sectionOf(e.id))!.push(e.id);
    for (const s of SECTIONS) {
      expect(counts.get(s)!.length, `section ${s}: ${counts.get(s)!.join(", ")}`).toBe(2);
    }
    expect(essays.length).toBe(24);
  });

  it("declares the part that matches the id prefix", () => {
    for (const e of essays) {
      const expected = sectionOf(e.id).startsWith("p1") ? "CMA Part 1" : "CMA Part 2";
      expect(e.part, e.id).toBe(expected);
    }
  });

  it("tags skills only with canonical ids from the frozen taxonomy", () => {
    const md = fs.readFileSync(path.join(process.cwd(), "docs", "SKILL_TAXONOMY.md"), "utf-8");
    const canonical = new Set([...md.matchAll(/`([a-z][a-z0-9-]*)`/g)].map((m) => m[1]));
    expect(canonical.size).toBeGreaterThan(50);
    for (const e of essays) {
      expect(e.skills.length).toBeGreaterThan(0);
      for (const s of e.skills) {
        expect(canonical.has(s), `${e.id} tags unknown skill "${s}"`).toBe(true);
      }
    }
  });

  it("gives every essay exam-format shape: exhibits, two requirements, a 30-minute clock", () => {
    for (const e of essays) {
      expect(e.timeMinutes, e.id).toBe(30);
      expect((e.exhibits ?? []).length, e.id).toBeGreaterThan(0);
      expect(e.requirements.length, e.id).toBeGreaterThanOrEqual(2);
      for (const r of e.requirements) {
        expect((r.concepts ?? []).length, `${e.id}/${r.id}`).toBeGreaterThanOrEqual(4);
        expect((r.conclusions ?? []).length, `${e.id}/${r.id}`).toBeGreaterThanOrEqual(1);
        expect(r.minWords, `${e.id}/${r.id}`).toBeGreaterThanOrEqual(80);
      }
    }
  });

  it("uses unique ids and unique titles", () => {
    expect(new Set(essays.map((e) => e.id)).size).toBe(essays.length);
    expect(new Set(essays.map((e) => e.title)).size).toBe(essays.length);
  });
});

describe("Part 1 Section A — external financial reporting", () => {
  it("over-time revenue: percent complete, revenue, and gross profit tie to the exhibit", () => {
    const ex = exhibit("cma-p1a-revenue-recognition");
    const pct1 = ex.year1CostIncurred / ex.originalEstimatedTotalCost;
    const rev1 = pct1 * ex.contractPrice;
    expect(pct1).toBe(0.3);
    expect(rev1).toBe(2400000);
    expect(rev1 - ex.year1CostIncurred).toBe(480000);

    const pct2 = ex.cumulativeCostThroughYear2 / ex.revisedEstimatedTotalCost;
    const rev2 = pct2 * ex.contractPrice - rev1;
    expect(pct2).toBe(0.8);
    expect(rev2).toBe(4000000);
    expect(rev2 - ex.year2CostIncurred).toBe(720000);
    // cumulative gross profit = percent complete x total expected profit
    expect(pct2 * (ex.contractPrice - ex.revisedEstimatedTotalCost)).toBe(480000 + 720000);
    // cumulative cost ties to the two annual amounts
    expect(ex.year1CostIncurred + ex.year2CostIncurred).toBe(ex.cumulativeCostThroughYear2);

    answerHas("cma-p1a-revenue-recognition", "r1-compute", 2400000, 480000, 4000000, 720000);
  });

  it("contract asset equals year 1 revenue less year 1 billings", () => {
    const ex = exhibit("cma-p1a-revenue-recognition");
    const rev1 = (ex.year1CostIncurred / ex.originalEstimatedTotalCost) * ex.contractPrice;
    expect(rev1 - ex.year1Billings).toBe(400000);
    answerHas("cma-p1a-revenue-recognition", "r2-criteria-balance-sheet", 400000);
  });

  it("FIFO vs weighted-average and SL vs DDB tie to the exhibits", () => {
    const inv = exhibit("cma-p1a-inventory-depreciation", 0);
    const available =
      inv.beginningUnits * inv.beginningCostPerUnit +
      inv.purchase1Units * inv.purchase1CostPerUnit +
      inv.purchase2Units * inv.purchase2CostPerUnit;
    const units = inv.beginningUnits + inv.purchase1Units + inv.purchase2Units;
    expect(available).toBe(131000);
    expect(units).toBe(inv.unitsSold + inv.endingUnits);

    // FIFO: newest layer remains
    const fifoEnding = inv.endingUnits * inv.purchase2CostPerUnit;
    expect(fifoEnding).toBe(45000);
    expect(available - fifoEnding).toBe(86000);

    const avgRate = available / units;
    expect(avgRate).toBe(13.1);
    expect(inv.endingUnits * avgRate).toBeCloseTo(39300, 6);
    expect(inv.unitsSold * avgRate).toBeCloseTo(91700, 6);
    // rising prices => average charges MORE to COGS than FIFO
    expect(inv.unitsSold * avgRate - (available - fifoEnding)).toBeCloseTo(5700, 6);

    const dep = exhibit("cma-p1a-inventory-depreciation", 1);
    const sl = (dep.acquisitionCost - dep.salvageValue) / dep.usefulLifeYears;
    expect(sl).toBe(43200);
    const ddbRate = 2 / dep.usefulLifeYears;
    const ddb1 = dep.acquisitionCost * ddbRate;
    const ddb2 = (dep.acquisitionCost - ddb1) * ddbRate;
    expect(ddb1).toBe(96000);
    expect(ddb2).toBe(57600);
    expect(dep.acquisitionCost - ddb1 - ddb2).toBe(86400);
    expect(dep.acquisitionCost - 2 * sl).toBe(153600);

    answerHas(
      "cma-p1a-inventory-depreciation",
      "r1-inventory",
      131000,
      45000,
      86000,
      39300,
      91700,
      5700
    );
    answerHas(
      "cma-p1a-inventory-depreciation",
      "r2-depreciation",
      43200,
      96000,
      57600,
      86400,
      153600
    );
  });
});

describe("Part 1 Section B — planning, budgeting, forecasting", () => {
  it("cash collections apply the 30/60/8 lag to the right months", () => {
    const s = exhibit("cma-p1b-cash-budget", 0);
    const collect = (m0: number, m1: number, m2: number) => 0.3 * m0 + 0.6 * m1 + 0.08 * m2;
    const july = collect(s.julySales, s.juneSales, s.maySales);
    const august = collect(s.augustSales, s.julySales, s.juneSales);
    const september = collect(s.septemberSales, s.augustSales, s.julySales);
    expect(july).toBeCloseTo(418000, 6);
    expect(august).toBeCloseTo(512000, 6);
    expect(september).toBeCloseTo(565000, 6);
    expect(july + august + september).toBeCloseTo(1495000, 6);
    // quarter collections fall short of quarter sales (lag + 2% never collected)
    expect(july + august + september).toBeLessThan(s.julySales + s.augustSales + s.septemberSales);
    answerHas("cma-p1b-cash-budget", "r1-collections", 418000, 512000, 565000, 1495000, 1650000);
  });

  it("the financing line borrows to the minimum in July and clears by September", () => {
    const s = exhibit("cma-p1b-cash-budget", 0);
    const f = exhibit("cma-p1b-cash-budget", 1);
    const collect = (m0: number, m1: number, m2: number) => 0.3 * m0 + 0.6 * m1 + 0.08 * m2;
    const july = collect(s.julySales, s.juneSales, s.maySales);
    const august = collect(s.augustSales, s.julySales, s.juneSales);
    const september = collect(s.septemberSales, s.augustSales, s.julySales);

    const julyBefore = f.beginningCashJuly1 + july - f.julyDisbursements;
    expect(julyBefore).toBeCloseTo(-42000, 6);
    const borrow = f.minimumCashBalance - julyBefore;
    expect(borrow).toBeCloseTo(92000, 6);

    const augBefore = f.minimumCashBalance + august - f.augustDisbursements;
    const augRepay = Math.min(borrow, augBefore - f.minimumCashBalance);
    expect(augRepay).toBeCloseTo(42000, 6);
    const loanAfterAug = borrow - augRepay;
    expect(loanAfterAug).toBeCloseTo(50000, 6);

    const sepBefore = f.minimumCashBalance + september - f.septemberDisbursements;
    expect(sepBefore).toBeCloseTo(135000, 6);
    // the remaining balance is fully repaid and cash still ends above the minimum
    expect(sepBefore - loanAfterAug).toBeCloseTo(85000, 6);
    expect(sepBefore - loanAfterAug).toBeGreaterThan(f.minimumCashBalance);

    answerHas("cma-p1b-cash-budget", "r2-financing", 92000, 42000, 85000, 135000);
  });

  it("high-low reproduces its own two data points and both forecasts are stated", () => {
    const reg = exhibit("cma-p1b-regression-forecast", 0);
    const hl = exhibit("cma-p1b-regression-forecast", 1);
    const rate = (hl.highMonthCost - hl.lowMonthCost) / (hl.highMonthHours - hl.lowMonthHours);
    expect(rate).toBe(6.3);
    const fixed = hl.highMonthCost - rate * hl.highMonthHours;
    expect(fixed).toBeCloseTo(18500, 6);
    // the same intercept must fall out of the low point
    expect(hl.lowMonthCost - rate * hl.lowMonthHours).toBeCloseTo(fixed, 6);

    const hlForecast = fixed + rate * hl.plannedMonthlyHours;
    const regForecast = reg.intercept + reg.slopePerMachineHour * hl.plannedMonthlyHours;
    expect(hlForecast).toBeCloseTo(68900, 6);
    expect(regForecast).toBeCloseTo(68400, 6);
    expect(hlForecast - regForecast).toBeCloseTo(500, 6);
    // the second-shift volume sits outside the fitted sample
    expect(hl.secondShiftHours).toBeGreaterThan(hl.highMonthHours);

    answerHas("cma-p1b-regression-forecast", "r1-forecast", 68900, 68400, "$6.30", "18,500");
  });
});

describe("Part 1 Section D — cost management", () => {
  it("ABC reassigns the same overhead pool and reverses the per-unit costs", () => {
    const a = exhibit("cma-p1d-activity-based-costing", 0);
    const b = exhibit("cma-p1d-activity-based-costing", 1);
    expect(a.standardDirectLaborHours + a.customDirectLaborHours).toBe(a.totalDirectLaborHours);
    expect(b.machineSetupsPool + b.machiningPool + b.inspectionPool).toBe(a.totalOverhead);

    const plantwide = a.totalOverhead / a.totalDirectLaborHours;
    expect(plantwide).toBe(30);
    const stdTradUnit = (plantwide * a.standardDirectLaborHours) / a.standardUnits;
    const cusTradUnit = (plantwide * a.customDirectLaborHours) / a.customUnits;
    expect(stdTradUnit).toBe(60);
    expect(cusTradUnit).toBe(120);

    const setupRate = b.machineSetupsPool / (b.setupsStandard + b.setupsCustom);
    const mhRate = b.machiningPool / (b.machineHoursStandard + b.machineHoursCustom);
    const inspRate = b.inspectionPool / (b.inspectionsStandard + b.inspectionsCustom);
    expect([setupRate, mhRate, inspRate]).toEqual([1000, 20, 50]);

    const stdAbc =
      b.setupsStandard * setupRate +
      b.machineHoursStandard * mhRate +
      b.inspectionsStandard * inspRate;
    const cusAbc =
      b.setupsCustom * setupRate + b.machineHoursCustom * mhRate + b.inspectionsCustom * inspRate;
    // ABC redistributes, it does not create or destroy overhead
    expect(stdAbc + cusAbc).toBe(a.totalOverhead);
    expect(stdAbc / a.standardUnits).toBe(40);
    expect(cusAbc / a.customUnits).toBe(240);
    // the direction of the distortion the essay asserts
    expect(stdTradUnit - stdAbc / a.standardUnits).toBe(20);
    expect(cusAbc / a.customUnits - cusTradUnit).toBe(120);

    answerHas("cma-p1d-activity-based-costing", "r1-compute", "$30", "$60", "$120", "$40", "$240");
  });

  it("weighted-average process costing reconciles cost to account for", () => {
    const ex = exhibit("cma-p1d-process-costing", 0);
    expect(ex.beginningWipUnits + ex.unitsStarted).toBe(ex.unitsTransferredOut + ex.endingWipUnits);

    const eupMaterials = ex.unitsTransferredOut + ex.endingWipUnits; // 100% complete for materials
    const eupConversion = ex.unitsTransferredOut + ex.endingWipUnits * 0.5;
    expect(eupMaterials).toBe(30000);
    expect(eupConversion).toBe(27000);

    const costMaterials = (ex.beginningWipMaterialsCost + ex.materialsCostAdded) / eupMaterials;
    const costConversion = (ex.beginningWipConversionCost + ex.conversionCostAdded) / eupConversion;
    expect(costMaterials).toBeCloseTo(2.4, 10);
    expect(costConversion).toBeCloseTo(2.8, 10);

    const transferredOut = ex.unitsTransferredOut * (costMaterials + costConversion);
    const endingWip = ex.endingWipUnits * costMaterials + ex.endingWipUnits * 0.5 * costConversion;
    const toAccountFor =
      ex.beginningWipMaterialsCost +
      ex.beginningWipConversionCost +
      ex.materialsCostAdded +
      ex.conversionCostAdded;
    expect(transferredOut).toBeCloseTo(124800, 6);
    expect(endingWip).toBeCloseTo(22800, 6);
    expect(transferredOut + endingWip).toBeCloseTo(toAccountFor, 6);
    expect(toAccountFor).toBe(147600);

    answerHas("cma-p1d-process-costing", "r1-eup", 124800, 22800, 147600, "$5.20");
  });

  it("spoilage splits at the 2% policy and the abnormal loss is valued at total cost per unit", () => {
    const a = exhibit("cma-p1d-process-costing", 0);
    const b = exhibit("cma-p1d-process-costing", 1);
    const perUnit =
      (a.beginningWipMaterialsCost + a.materialsCostAdded) /
        (a.unitsTransferredOut + a.endingWipUnits) +
      (a.beginningWipConversionCost + a.conversionCostAdded) /
        (a.unitsTransferredOut + a.endingWipUnits * 0.5);
    const normal = 0.02 * b.unitsStartedSeptember;
    const abnormal = b.spoiledUnitsIdentified - normal;
    expect(normal).toBe(520);
    expect(abnormal).toBe(380);
    expect(abnormal * perUnit).toBeCloseTo(1976, 6);
    answerHas("cma-p1d-process-costing", "r2-spoilage", 1976, "520", "380");
  });
});

describe("Part 1 Section E — internal controls", () => {
  it("segregation essay quantifies the unmatched invoice population", () => {
    const ex = essay("cma-p1e-segregation-of-duties").exhibits![0].data as Record<string, unknown>;
    const invoices = ex.annualSubcontractorInvoices as number;
    const pct = parseFloat(String(ex.percentBelowThreshold)) / 100;
    expect(Math.round(invoices * pct)).toBe(2976);
    answerHas("cma-p1e-segregation-of-duties", "r1-weaknesses", 2976, 9400000);
  });

  it("deficiency severity compares unapproved memos to the materiality threshold", () => {
    const ex = exhibit("cma-p1e-control-deficiency");
    const avgMemo = ex.creditMemoDollars / ex.creditMemosIssued;
    expect(avgMemo).toBe(2000);
    const unapproved = ex.memosWithoutApproval * avgMemo;
    const materiality = 0.05 * ex.preTaxIncome;
    expect(unapproved).toBe(930000);
    expect(materiality).toBe(310000);
    // the classification the model answer reaches depends on this inequality
    expect(unapproved).toBeGreaterThan(materiality);
    expect(unapproved / materiality).toBe(3);
    expect(ex.memosWithoutApproval / ex.creditMemosIssued).toBeCloseTo(0.375, 10);
    answerHas("cma-p1e-control-deficiency", "r1-severity", 930000, 310000, "$2,000", "37.5%");
  });
});

describe("Part 1 Section F — technology and analytics", () => {
  it("duplicate-payment analytic: flag rate, precision, and net benefit", () => {
    const ex = exhibit("cma-p1f-data-analytics");
    expect(ex.invoicesFlagged / ex.annualInvoices).toBeCloseTo(0.03, 10);
    expect(ex.trueDuplicatesFound / ex.invoicesFlagged).toBeCloseTo(0.15, 10);
    expect(ex.dollarsRecovered / ex.trueDuplicatesFound).toBe(1500);
    const cost = ex.annualLicenseCost + 0.5 * ex.analystFullyBurdenedCost;
    expect(cost).toBe(96000);
    expect(ex.dollarsRecovered - cost).toBe(228000);
    // the "continue running it" conclusion requires a positive net benefit
    expect(ex.dollarsRecovered).toBeGreaterThan(cost);
    expect(ex.invoicesFlagged - ex.trueDuplicatesFound).toBe(1224);
    answerHas(
      "cma-p1f-data-analytics",
      "r1-evaluate",
      96000,
      228000,
      "1,500",
      "1,224",
      "15%",
      "3%"
    );
  });

  it("RPA business case: savings, first-year net, steady state, and payback", () => {
    const a = exhibit("cma-p1f-rpa-system-integration", 0);
    const b = exhibit("cma-p1f-rpa-system-integration", 1);
    const monthlyHours = a.analysts * a.hoursPerAnalystPerMonth;
    const annualManual = monthlyHours * a.fullyBurdenedRatePerHour * a.monthsPerYear;
    expect(monthlyHours).toBe(120);
    expect(annualManual).toBe(72000);

    const pct = parseFloat(String(b.hoursEliminated)) / 100;
    const savings = annualManual * pct;
    expect(savings).toBe(54000);
    const yearOne = savings - b.oneTimeBuildCost - b.annualLicenseAndMaintenance;
    const steady = savings - b.annualLicenseAndMaintenance;
    expect(yearOne).toBe(-18000);
    expect(steady).toBe(42000);
    expect(b.oneTimeBuildCost / steady).toBeCloseTo(1.4286, 4);
    answerHas(
      "cma-p1f-rpa-system-integration",
      "r1-business-case",
      72000,
      54000,
      18000,
      42000,
      "1.4"
    );
  });
});

describe("Part 2 Section A — financial statement analysis", () => {
  it("DuPont factors multiply back to ROE and the industry composite", () => {
    const ex = exhibit("cma-p2a-dupont-leverage", 0);
    const npm = ex.netIncome / ex.sales;
    const tat = ex.sales / ex.totalAssets;
    const em = ex.totalAssets / ex.totalEquity;
    expect(npm).toBeCloseTo(0.06, 10);
    expect(tat).toBe(2);
    expect(em).toBe(2.5);
    // the decomposition must equal the direct computation
    expect(npm * tat * em).toBeCloseTo(ex.netIncome / ex.totalEquity, 10);
    expect(ex.netIncome / ex.totalEquity).toBeCloseTo(0.3, 10);

    const ind = essay("cma-p2a-dupont-leverage").exhibits![1].data as Record<string, unknown>;
    const indRoe =
      (parseFloat(String(ind.industryNetProfitMargin)) / 100) *
      (ind.industryTotalAssetTurnover as number) *
      (ind.industryEquityMultiplier as number);
    expect(indRoe).toBeCloseTo(0.16, 10);
    // the essay's claim: Harbor Point wins on turnover and leverage, loses on margin
    expect(npm).toBeLessThan(parseFloat(String(ind.industryNetProfitMargin)) / 100);
    expect(tat).toBeGreaterThan(ind.industryTotalAssetTurnover as number);
    expect(em).toBeGreaterThan(ind.industryEquityMultiplier as number);
    answerHas("cma-p2a-dupont-leverage", "r1-dupont", "6.0%", "2.0", "2.5", "30%", "16.0%");
  });

  it("liquidity, leverage, and coverage ratios tie to the same balance sheet", () => {
    const ex = exhibit("cma-p2a-dupont-leverage", 0);
    expect(ex.currentAssets / ex.currentLiabilities).toBe(1.5);
    const quick = ex.currentAssets - ex.inventory - ex.prepaidExpenses;
    expect(quick / ex.currentLiabilities).toBe(1);
    const debt = ex.totalAssets - ex.totalEquity;
    expect(debt).toBe(42000000);
    expect(debt / ex.totalEquity).toBe(1.5);
    expect(ex.ebit / ex.interestExpense).toBe(4);
    answerHas("cma-p2a-dupont-leverage", "r2-quality", "1.5", "1.0", "4.0", "42,000,000");
  });

  it("earnings-quality ratios diverge exactly as the model answer states", () => {
    const ex = exhibit("cma-p2a-earnings-quality");
    expect(ex.year1CashFlowFromOperations / ex.year1NetIncome).toBeCloseTo(1.2, 10);
    expect(ex.year2CashFlowFromOperations / ex.year2NetIncome).toBeCloseTo(0.25, 10);
    // income up, cash down — the whole point of the scenario
    expect(ex.year2NetIncome).toBeGreaterThan(ex.year1NetIncome);
    expect(ex.year2CashFlowFromOperations).toBeLessThan(ex.year1CashFlowFromOperations);

    const dso = (ar: number, sales: number) => (ar / sales) * 360;
    expect(dso(ex.year1AccountsReceivable, ex.year1Sales)).toBeCloseTo(60, 10);
    expect(dso(ex.year2AccountsReceivable, ex.year2Sales)).toBeCloseTo(90, 10);
    expect(ex.year1CostOfGoodsSold / ex.year1Inventory).toBeCloseTo(3, 10);
    expect(ex.year2CostOfGoodsSold / ex.year2Inventory).toBeCloseTo(2.5, 10);

    const growth = (a: number, b: number) => (b - a) / a;
    expect(growth(ex.year1Sales, ex.year2Sales)).toBeCloseTo(0.25, 10);
    expect(growth(ex.year1AccountsReceivable, ex.year2AccountsReceivable)).toBeCloseTo(0.875, 10);
    expect(growth(ex.year1Inventory, ex.year2Inventory)).toBeCloseTo(0.5, 10);
    answerHas(
      "cma-p2a-earnings-quality",
      "r1-compute",
      "1.2",
      "0.25",
      "60 days",
      "90 days",
      "87.5%"
    );
  });
});

describe("Part 2 Section B — corporate finance", () => {
  it("WACC components and the weighted average tie to market-value weights", () => {
    const ex = essay("cma-p2b-wacc-capital-structure").exhibits![0].data as Record<string, unknown>;
    const d = ex.marketValueDebt as number;
    const p = ex.marketValuePreferred as number;
    const e = ex.marketValueCommonEquity as number;
    const total = d + p + e;
    expect(total).toBe(100000000);

    const tax = parseFloat(String(ex.marginalTaxRate)) / 100;
    const kd = (parseFloat(String(ex.preTaxCostOfDebt)) / 100) * (1 - tax);
    const kp = (ex.preferredDividend as number) / (ex.preferredPrice as number);
    const ke =
      parseFloat(String(ex.riskFreeRate)) / 100 +
      (ex.beta as number) * (parseFloat(String(ex.marketRiskPremium)) / 100);
    expect(kd).toBeCloseTo(0.057, 10);
    expect(kp).toBeCloseTo(0.1, 10);
    expect(ke).toBeCloseTo(0.112, 10);

    const wacc = (d / total) * kd + (p / total) * kp + (e / total) * ke;
    expect(wacc).toBeCloseTo(0.0888, 10);
    answerHas("cma-p2b-wacc-capital-structure", "r1-wacc", "5.7%", "10%", "11.2%", "8.88%");
  });

  it("the levered structure raises WACC, which is why the proposal is rejected", () => {
    const cur = essay("cma-p2b-wacc-capital-structure").exhibits![0].data as Record<
      string,
      unknown
    >;
    const pro = essay("cma-p2b-wacc-capital-structure").exhibits![1].data as Record<
      string,
      unknown
    >;
    const tax = parseFloat(String(cur.marginalTaxRate)) / 100;
    const kd2 = (parseFloat(String(pro.proposedPreTaxCostOfDebt)) / 100) * (1 - tax);
    const ke2 =
      parseFloat(String(cur.riskFreeRate)) / 100 +
      (pro.proposedBeta as number) * (parseFloat(String(cur.marketRiskPremium)) / 100);
    expect(kd2).toBeCloseTo(0.0722, 10);
    expect(ke2).toBeCloseTo(0.136, 10);

    const wd = parseFloat(String(pro.proposedDebtWeight)) / 100;
    const we = parseFloat(String(pro.proposedCommonEquityWeight)) / 100;
    expect(wd + we).toBe(1);
    const wacc2 = wd * kd2 + we * ke2;
    expect(wacc2).toBeCloseTo(0.09772, 10);
    expect(wacc2).toBeGreaterThan(0.0888);
    expect((wacc2 - 0.0888) * 10000).toBeCloseTo(89.2, 1);
    answerHas("cma-p2b-wacc-capital-structure", "r2-structure", "7.22%", "13.6%", "9.77%");
  });

  it("cash conversion cycle, cash released, and the cost of forgoing 2/10 net 45", () => {
    const a = essay("cma-p2b-working-capital").exhibits![0].data as Record<string, unknown>;
    const dso = a.daysSalesOutstanding as number;
    const dio = a.daysInventoryOnHand as number;
    const dpo = a.daysPayablesOutstanding as number;
    expect(dio + dso).toBe(120);
    expect(dio + dso - dpo).toBe(85);

    const dailySales = (a.annualSales as number) / 365;
    expect(dailySales).toBe(400000);
    const freed = (a.targetCycleReductionDays as number) * dailySales;
    expect(freed).toBe(6000000);
    expect(freed * (parseFloat(String(a.shortTermBorrowingRate)) / 100)).toBe(540000);

    // terms 2/10, net 45 => 35 extra days of credit for a 2% discount
    const days = 45 - 10;
    const nominal = (2 / 98) * (365 / days);
    const effective = Math.pow(1 + 2 / 98, 365 / days) - 1;
    expect(nominal).toBeCloseTo(0.2128, 4);
    expect(effective).toBeCloseTo(0.2345, 4);
    // the recommendation only holds if both exceed the borrowing rate
    expect(nominal).toBeGreaterThan(parseFloat(String(a.shortTermBorrowingRate)) / 100);
    answerHas(
      "cma-p2b-working-capital",
      "r1-cycle",
      "120 days",
      "85 days",
      400000,
      6000000,
      540000
    );
    answerHas("cma-p2b-working-capital", "r2-discount", "21.3%", "23.5%");
  });
});

describe("Part 2 Section C — decision analysis", () => {
  it("CVP: break-even, target volume, margin of safety, and operating leverage", () => {
    const a = essay("cma-p2c-cvp-operating-leverage").exhibits![0].data as Record<string, unknown>;
    const price = a.sellingPricePerUnit as number;
    const vc = a.variableCostPerUnit as number;
    const fc = a.annualFixedCost as number;
    const q = a.currentVolumeUnits as number;
    const taxRate = parseFloat(String(a.taxRate)) / 100;

    const cm = price - vc;
    expect(cm).toBe(32);
    expect(cm / price).toBeCloseTo(0.4, 10);
    expect(fc / cm).toBe(30000);
    expect((fc / cm) * price).toBe(2400000);

    const preTaxTarget = 360000 / (1 - taxRate);
    expect(preTaxTarget).toBe(480000);
    expect((fc + preTaxTarget) / cm).toBe(45000);

    const oi = cm * q - fc;
    expect(oi).toBe(640000);
    expect(q - fc / cm).toBe(20000);
    expect((q - fc / cm) / q).toBeCloseTo(0.4, 10);
    const dol = (cm * q) / oi;
    expect(dol).toBe(2.5);
    // the leverage prediction must equal the direct recomputation at +10% volume
    expect(oi * (1 + dol * 0.1)).toBeCloseTo(cm * q * 1.1 - fc, 6);
    expect(cm * q * 1.1 - fc).toBeCloseTo(800000, 6);
    answerHas(
      "cma-p2c-cvp-operating-leverage",
      "r1-breakeven",
      30000,
      2400000,
      45000,
      480000,
      800000,
      "2.5"
    );
  });

  it("automation raises break-even and leverage, and 60,000 units is the indifference point", () => {
    const a = essay("cma-p2c-cvp-operating-leverage").exhibits![0].data as Record<string, unknown>;
    const b = essay("cma-p2c-cvp-operating-leverage").exhibits![1].data as Record<string, unknown>;
    const price = a.sellingPricePerUnit as number;
    const q = a.currentVolumeUnits as number;
    const cm1 = price - (a.variableCostPerUnit as number);
    const fc1 = a.annualFixedCost as number;
    const cm2 = price - (b.proposedVariableCostPerUnit as number);
    const fc2 = b.proposedAnnualFixedCost as number;

    expect(cm2).toBe(40);
    expect(fc2 / cm2).toBe(36000);
    const oi2 = cm2 * q - fc2;
    expect(oi2).toBe(560000);
    // automation is worse at current volume
    expect(oi2).toBeLessThan(cm1 * q - fc1);

    const indifference = (fc2 - fc1) / (cm2 - cm1);
    expect(indifference).toBe(60000);
    expect(cm1 * indifference - fc1).toBe(cm2 * indifference - fc2);
    expect((cm2 * q) / oi2).toBeCloseTo(3.5714, 4);
    answerHas("cma-p2c-cvp-operating-leverage", "r2-automation", 36000, 560000, 60000, "3.57");
  });
});

describe("Part 2 Section D — risk management", () => {
  it("expected loss, residual loss, and the net benefit of the control package", () => {
    const ex = essay("cma-p2d-erm-risk-response").exhibits![0].data as Record<string, unknown>;
    const loss = ex.estimatedLossIfItOccurs as number;
    const p0 = parseFloat(String(ex.inherentAnnualProbability)) / 100;
    const p1 = parseFloat(String(ex.probabilityAfterControls)) / 100;
    const controlCost = ex.controlPackageAnnualCost as number;

    expect(p0 * loss).toBeCloseTo(360000, 6);
    expect(p1 * loss).toBeCloseTo(90000, 6);
    expect(p0 * loss - p1 * loss - controlCost).toBeCloseTo(120000, 6);
    // controls are worth doing only because the reduction exceeds their cost
    expect(p0 * loss - p1 * loss).toBeGreaterThan(controlCost);

    const withControlsOnly = controlCost + p1 * loss;
    const withInsurance =
      controlCost + (ex.insurancePremium as number) + p1 * (ex.insuranceRetention as number);
    expect(withControlsOnly).toBeCloseTo(240000, 6);
    expect(withInsurance).toBeCloseTo(270000, 6);
    // the essay's key nuance: insurance costs MORE in expected value
    expect(withInsurance - withControlsOnly).toBeCloseTo(30000, 6);
    expect(loss / (ex.totalEquity as number)).toBeCloseTo(0.1607, 4);

    answerHas("cma-p2d-erm-risk-response", "r1-expected-loss", 360000, 90000, 270000, 120000);
    answerHas("cma-p2d-erm-risk-response", "r2-responses", 240000, 270000, 30000);
  });

  it("forward hedge outcomes under both spot scenarios", () => {
    const ex = exhibit("cma-p2d-fx-hedging");
    const n = ex.receivableEuros;
    const hedged = n * ex.forwardRate90Day;
    expect(hedged).toBeCloseTo(5400000, 6);
    expect(n * ex.spotRateToday).toBeCloseTo(5500000, 6);

    const weak = n * ex.weakEuroScenarioSpot;
    const strong = n * ex.strongEuroScenarioSpot;
    expect(weak).toBeCloseTo(5100000, 6);
    expect(strong).toBeCloseTo(5750000, 6);
    // the hedge helps in one scenario and hurts in the other — never both
    expect(hedged - weak).toBeCloseTo(300000, 6);
    expect(strong - hedged).toBeCloseTo(350000, 6);
    expect(n * ex.spotRateToday - hedged).toBeCloseTo(100000, 6);
    expect((n * ex.spotRateToday - hedged) / (n * ex.spotRateToday)).toBeCloseTo(0.0182, 4);
    answerHas(
      "cma-p2d-fx-hedging",
      "r1-compute",
      5400000,
      5100000,
      5750000,
      300000,
      350000,
      100000
    );
  });
});

describe("Part 2 Section E — investment decisions", () => {
  it("profitability indexes, the IRR-order set, and the true NPV-maximizing set", () => {
    const ex = essay("cma-p2e-capital-rationing").exhibits![0].data as Record<string, unknown>;
    const budget = ex.budget as number;
    type P = { name: string; outlay: number; npv: number; irr: number };
    const projects: P[] = ["W", "X", "Y", "Z"].map((n) => {
      const p = ex[`project${n}`] as Record<string, unknown>;
      return {
        name: n,
        outlay: p.initialOutlay as number,
        npv: p.netPresentValue as number,
        irr: parseFloat(String(p.internalRateOfReturn)) / 100,
      };
    });

    const pi = Object.fromEntries(projects.map((p) => [p.name, 1 + p.npv / p.outlay]));
    expect(pi.W).toBeCloseTo(1.28, 10);
    expect(pi.X).toBeCloseTo(1.23, 10);
    expect(pi.Y).toBeCloseTo(1.3, 10);
    expect(pi.Z).toBeCloseTo(1.18, 10);

    // greedy selection in IRR order, skipping anything that no longer fits
    let remaining = budget;
    const irrSet: string[] = [];
    let irrNpv = 0;
    for (const p of [...projects].sort((a, b) => b.irr - a.irr)) {
      if (p.outlay <= remaining) {
        remaining -= p.outlay;
        irrSet.push(p.name);
        irrNpv += p.npv;
      }
    }
    expect(irrSet.sort()).toEqual(["W", "X", "Z"]);
    expect(irrNpv).toBe(148000);
    expect(remaining).toBe(0);

    // exhaustive search over every affordable subset
    let best = { names: [] as string[], npv: 0, cost: 0 };
    for (let mask = 1; mask < 1 << projects.length; mask++) {
      const chosen = projects.filter((_, i) => (mask >> i) & 1);
      const cost = chosen.reduce((n, p) => n + p.outlay, 0);
      if (cost > budget) continue;
      const npv = chosen.reduce((n, p) => n + p.npv, 0);
      if (npv > best.npv) best = { names: chosen.map((p) => p.name), npv, cost };
    }
    expect(best.names.sort()).toEqual(["X", "Y"]);
    expect(best.npv).toBe(166000);
    expect(best.cost).toBe(budget);
    // the value the IRR ranking forgoes
    expect(best.npv - irrNpv).toBe(18000);

    answerHas("cma-p2e-capital-rationing", "r1-select", 148000, 166000, 18000, "1.28", "1.30");
  });
});

describe("Part 2 Section F — professional ethics", () => {
  it("the reserve release lands exactly on the bonus target and is material", () => {
    const ex = exhibit("cma-p2f-ima-ethics-reserve");
    expect(ex.operatingIncomeBeforeAdjustment + ex.requestedRelease).toBe(ex.bonusTarget);
    expect(ex.requestedRelease / ex.operatingIncomeBeforeAdjustment).toBeCloseTo(0.1382, 4);
    // the release would push the reserve below what the claims analysis supports
    expect(ex.warrantyReserveBalance - ex.requestedRelease).toBe(2900000);
    expect(ex.warrantyReserveBalance - ex.requestedRelease).toBeLessThan(
      ex.reserveSupportedByClaimsAnalysis
    );
    answerHas("cma-p2f-ima-ethics-reserve", "r1-analysis", 7000000, 6150000, 2900000, "13.8%");
  });

  it("the FCPA scenario quantifies the pressure that must not change the answer", () => {
    const ex = essay("cma-p2f-fcpa-compliance").exhibits![0].data as Record<string, unknown>;
    const delay = (ex.idleCrewCostPerDay as number) * (ex.daysHeld as number);
    expect(delay).toBe(54000);
    expect(delay + (ex.lateStartContractPenalty as number)).toBe(304000);
    // the pressure dwarfs the requested payment — that is the rationalization trap
    expect(delay + (ex.lateStartContractPenalty as number)).toBeGreaterThan(
      ex.requestedCashPayment as number
    );
    answerHas("cma-p2f-fcpa-compliance", "r1-evaluate", 54000, 304000);
  });
});

describe("CMA essay bank — grader behavior on authored rubrics", () => {
  it("every model answer passes its own narrative grader", () => {
    for (const e of essays) {
      for (const r of e.requirements) {
        const result = gradeNarrativeText(r.modelAnswer, {
          concepts: r.concepts,
          keywords: r.keywords,
          conclusions: r.conclusions,
          minWords: r.minWords,
        });
        expect(result.passed, `${e.id}/${r.id}: ${result.message}`).toBe(true);
      }
    }
  });

  it("every model answer covers ALL of its concepts, not merely the 60% floor", () => {
    for (const e of essays) {
      for (const r of e.requirements) {
        const lower = r.modelAnswer.toLowerCase();
        const missed = (r.concepts ?? [])
          .filter((c) => !c.anyOf.some((alt) => lower.includes(alt.toLowerCase())))
          .map((c) => c.id);
        expect(missed, `${e.id}/${r.id} model answer misses ${missed.join(", ")}`).toEqual([]);
      }
    }
  });

  it("concept alternates are genuine synonyms, not one keyword repeated", () => {
    for (const e of essays) {
      for (const r of e.requirements) {
        for (const c of r.concepts ?? []) {
          expect(c.anyOf.length, `${e.id}/${r.id}/${c.id}`).toBeGreaterThan(0);
          const normalized = c.anyOf.map((a) => a.toLowerCase().trim());
          expect(new Set(normalized).size, `${e.id}/${r.id}/${c.id} has duplicate alternates`).toBe(
            normalized.length
          );
        }
        // requirement-level: concept ids must be distinct so coverage counts distinct ideas
        const ids = (r.concepts ?? []).map((c) => c.id);
        expect(new Set(ids).size, `${e.id}/${r.id} has duplicate concept ids`).toBe(ids.length);
      }
    }
  });

  it("an inverted conclusion fails even when the concepts are all present", () => {
    // Take each essay's first requirement and invert it by asserting a blocker phrase.
    let checked = 0;
    for (const e of essays) {
      const r = e.requirements[0];
      const blocker = (r.conclusions ?? []).flatMap((c) => c.noneOf ?? [])[0];
      if (!blocker) continue;
      const inverted = `${r.modelAnswer} On reflection, ${blocker}.`;
      const result = gradeNarrativeText(inverted, {
        concepts: r.concepts,
        conclusions: r.conclusions,
        minWords: r.minWords,
      });
      expect(
        result.dimensions.find((d) => d.name === "conclusion")!.ok,
        `${e.id}/${r.id} accepted a contradicting statement`
      ).toBe(false);
      expect(result.passed, `${e.id}/${r.id} passed with a contradiction`).toBe(false);
      checked += 1;
    }
    expect(checked).toBeGreaterThanOrEqual(20);
  });

  it("a keyword dump of the concept alternates fails the prose gate", () => {
    const r = req("cma-p2b-wacc-capital-structure", "r1-wacc");
    const dump = (r.concepts ?? [])
      .flatMap((c) => c.anyOf)
      .concat((r.conclusions ?? []).flatMap((c) => c.anyOf))
      .join(" ")
      .repeat(3);
    const result = gradeNarrativeText(dump, {
      concepts: r.concepts,
      conclusions: r.conclusions,
      minWords: r.minWords,
    });
    expect(result.dimensions.find((d) => d.name === "prose")!.ok).toBe(false);
    expect(result.passed).toBe(false);
  });
});
