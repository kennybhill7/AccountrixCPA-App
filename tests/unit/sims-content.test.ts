import { describe, expect, it } from "vitest";
import { gradeTask } from "@/components/ApplyWorkflowClient";
import { gradeNarrativeText } from "@/lib/narrativeGrading";
import type { WorkflowTask } from "@/lib/case-workflows";
import farLeases from "@/data/tbs/far-leases-842.json";
import audSampling from "@/data/tbs/aud-ar-sampling.json";
import regBasis from "@/data/tbs/reg-scorp-basis.json";
import essayVariance from "@/data/essays/cma-p1-variance.json";
import essayCapBudget from "@/data/essays/cma-p2-capital-budgeting.json";

/**
 * Exam-sim content tie-outs: every graded number is recomputed from the
 * exhibit inputs, so a content edit that breaks internal consistency fails
 * here before it reaches a learner.
 */

const task = (sim: { tasks: WorkflowTask[] }, id: string): WorkflowTask => {
  const t = sim.tasks.find((x) => x.id === id);
  if (!t) throw new Error(`missing task ${id}`);
  return t;
};

const expectedOf = (t: WorkflowTask) => t.expected as Record<string, number>;

describe("FAR leases TBS ties out", () => {
  const ex = farLeases.exhibits[0].data as {
    leaseTermYears: number;
    annualPayment: number;
    usefulLifeYears: number;
    initialDirectCosts: number;
  };
  const rate = 0.06;
  const pvExact = (ex.annualPayment * (1 - Math.pow(1 + rate, -ex.leaseTermYears))) / rate;

  it("liability = PV of payments; ROU adds initial direct costs", () => {
    expect(Math.round(pvExact)).toBe(expectedOf(task(farLeases, "t2-liability")).initialLeaseLiability);
    expect(expectedOf(task(farLeases, "t3-rou")).initialRouAsset).toBe(
      Math.round(pvExact) + ex.initialDirectCosts
    );
  });

  it("year-1 interest, reduction, and ending liability chain", () => {
    const t5 = expectedOf(task(farLeases, "t5-year1-amounts"));
    const interest = pvExact * rate;
    expect(Math.abs(t5.interestExpense - interest)).toBeLessThanOrEqual(1);
    expect(t5.liabilityReduction).toBe(ex.annualPayment - t5.interestExpense);
    expect(t5.endingLeaseLiability).toBe(
      expectedOf(task(farLeases, "t2-liability")).initialLeaseLiability - t5.liabilityReduction
    );
  });

  it("both journal entries balance and tie to the calcs", () => {
    for (const id of ["t4-commencement-je", "t6-payment-je"]) {
      const entries = (task(farLeases, id).expected as { entries: Array<{ debit: number; credit: number }> })
        .entries;
      const dr = entries.reduce((n, e) => n + e.debit, 0);
      const cr = entries.reduce((n, e) => n + e.credit, 0);
      expect(dr).toBe(cr);
    }
    const commencement = (task(farLeases, "t4-commencement-je").expected as {
      entries: Array<{ account: string; debit: number; credit: number }>;
    }).entries;
    expect(commencement.find((e) => e.account === "1600")?.debit).toBe(
      expectedOf(task(farLeases, "t3-rou")).initialRouAsset
    );
  });

  it("finance-lease amortization = ROU / lease term (shorter than life)", () => {
    const rou = expectedOf(task(farLeases, "t3-rou")).initialRouAsset;
    expect(
      Math.abs(expectedOf(task(farLeases, "t7-amortization")).rouAmortization - rou / ex.leaseTermYears)
    ).toBeLessThanOrEqual(1);
  });

  it("the grader accepts the correct year-1 answers end-to-end", () => {
    const r = gradeTask(
      task(farLeases, "t5-year1-amounts"),
      JSON.stringify({ interestExpense: "15,165", liabilityReduction: "44,835", endingLeaseLiability: "$207,907" })
    );
    expect(r.passed).toBe(true);
    const je = gradeTask(
      task(farLeases, "t6-payment-je"),
      JSON.stringify({
        entries: [
          { account: "2400", debit: "44,835", credit: "" },
          { account: "6150", debit: "15,165", credit: "" },
          { account: "1000", debit: "", credit: "60,000" },
        ],
      })
    );
    expect(je.passed).toBe(true);
  });
});

describe("AUD sampling TBS ties out", () => {
  const ex = audSampling.exhibits[0].data as {
    populationInvoices: number;
    populationBookValue: number;
    sampleInvoices: number;
    sampleBookValue: number;
    sampleAuditedValue: number;
  };

  it("sample, ratio, and difference projections", () => {
    const misstatement = ex.sampleBookValue - ex.sampleAuditedValue;
    expect(expectedOf(task(audSampling, "t1-sample-misstatement")).sampleMisstatement).toBe(misstatement);
    expect(expectedOf(task(audSampling, "t2-ratio-projection")).projectedMisstatementRatio).toBe(
      (misstatement / ex.sampleBookValue) * ex.populationBookValue
    );
    expect(expectedOf(task(audSampling, "t3-difference-projection")).projectedMisstatementDifference).toBe(
      (misstatement / ex.sampleInvoices) * ex.populationInvoices
    );
  });
});

describe("REG S corp basis TBS ties out", () => {
  const ex = regBasis.exhibits[0].data as Record<string, number>;

  it("follows the §1367 default ordering chain", () => {
    const afterIncome =
      ex.beginningStockBasis + ex.ordinaryBusinessIncome + ex.taxExemptInterest;
    expect(expectedOf(task(regBasis, "t1-income-first")).basisAfterIncome).toBe(afterIncome);

    const t2 = expectedOf(task(regBasis, "t2-distribution"));
    expect(t2.capitalGain).toBe(Math.max(0, ex.cashDistribution - afterIncome));
    expect(t2.basisAfterDistribution).toBe(afterIncome - ex.cashDistribution);

    const t3 = expectedOf(task(regBasis, "t3-ending-basis"));
    expect(t3.endingStockBasis).toBe(
      t2.basisAfterDistribution - ex.nondeductiblePenalties - ex.section179Deduction
    );
    expect(t3.endingDebtBasis).toBe(ex.beginningDebtBasis);
    expect(expectedOf(task(regBasis, "t4-deductible-179")).deductible179).toBe(ex.section179Deduction);
  });
});

describe("CMA essays tie out and carry complete rubrics", () => {
  it("variance essay model answers contain the correct computed variances", () => {
    const ex = essayVariance.exhibits[0].data as Record<string, number>;
    const priceVariance = (ex.actualPricePerLb - ex.standardPricePerLb) * ex.actualLbsUsed; // -4,620 (F)
    const sqAllowed = ex.actualUnits * ex.standardLbsPerUnit; // 22,000
    const quantityVariance = (ex.actualLbsUsed - sqAllowed) * ex.standardPricePerLb; // 5,500 (U)
    expect(Math.round(priceVariance)).toBe(-4620);
    expect(Math.round(quantityVariance)).toBe(5500);
    expect(essayVariance.requirements[0].modelAnswer).toContain("4,620");
    expect(essayVariance.requirements[0].modelAnswer).toContain("5,500");
  });

  it("capital-budgeting essay model answer contains the correct NPV", () => {
    const ex = essayCapBudget.exhibits[0].data as {
      initialInvestment: number;
      annualAfterTaxCashInflow: number;
      pvAnnuityFactor_10pct_5yr: number;
    };
    const npv = Math.round(
      ex.annualAfterTaxCashInflow * ex.pvAnnuityFactor_10pct_5yr - ex.initialInvestment
    );
    expect(npv).toBe(68619);
    expect(essayCapBudget.requirements[0].modelAnswer).toContain("68,619");
  });

  it("every essay requirement has a concept checklist, an exam-depth floor, and a model answer", () => {
    for (const essay of [essayVariance, essayCapBudget]) {
      for (const req of essay.requirements) {
        expect((req.concepts ?? []).length).toBeGreaterThanOrEqual(4);
        expect(req.minWords).toBeGreaterThanOrEqual(80); // raised for exam depth
        expect(req.modelAnswer.split(/\s+/).length).toBeGreaterThanOrEqual(req.minWords);
      }
    }
  });

  it("every essay model answer actually PASSES the stricter narrative grader", () => {
    for (const essay of [essayVariance, essayCapBudget]) {
      for (const req of essay.requirements) {
        const r = gradeNarrativeText(req.modelAnswer, {
          concepts: req.concepts,
          minWords: req.minWords,
        });
        expect(r.passed, `${essay.id}/${req.id}: ${r.message}`).toBe(true);
      }
    }
  });
});

describe("sim schema hygiene", () => {
  it("all TBS tasks use grader-supported types and valid tolerances", () => {
    for (const sim of [farLeases, audSampling, regBasis]) {
      expect(sim.tasks.length).toBeGreaterThanOrEqual(4);
      for (const t of sim.tasks as WorkflowTask[]) {
        expect(["calc", "je", "writeup"]).toContain(t.type);
        if (t.tolerance != null) expect(t.tolerance).toBeGreaterThanOrEqual(0);
        expect(t.explanation).toBeTruthy();
      }
    }
  });
});
