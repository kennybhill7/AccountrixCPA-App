import { describe, expect, it } from "vitest";
import { gradeTask } from "@/components/ApplyWorkflowClient";
import type { WorkflowTask } from "@/lib/case-workflows";
import farBonds from "@/data/tbs/far-bonds-payable.json";
import barCapital from "@/data/tbs/bar-capital-budgeting.json";
import reg1031 from "@/data/tbs/reg-1031-exchange.json";

/**
 * Tie-out tests for the added breadth sims: every graded number is recomputed
 * from the exhibit inputs, and every JE is checked for balance, so a content
 * edit that breaks internal consistency fails CI before a learner sees it.
 */

const task = (sim: { tasks: WorkflowTask[] }, id: string): WorkflowTask => {
  const t = sim.tasks.find((x) => x.id === id);
  if (!t) throw new Error(`missing task ${id}`);
  return t;
};
const num = (t: WorkflowTask) => t.expected as Record<string, number>;
const jeEntries = (t: WorkflowTask) =>
  (t.expected as { entries: Array<{ debit: number; credit: number }> }).entries;

describe("FAR bonds payable ties out (effective interest, gross method)", () => {
  const ex = farBonds.exhibits[0].data as {
    faceValue: number;
    annualCouponCash: number;
    pvOrdinaryAnnuity_8pct_5yr: number;
    pvSingleSum_8pct_5yr: number;
  };
  const y = 0.08;
  const issue =
    ex.annualCouponCash * ex.pvOrdinaryAnnuity_8pct_5yr + ex.faceValue * ex.pvSingleSum_8pct_5yr;

  it("issue price and discount", () => {
    expect(Math.abs(num(task(farBonds, "t1-issue-price")).issuePrice - issue)).toBeLessThanOrEqual(2);
    expect(num(task(farBonds, "t1-issue-price")).discount).toBe(
      ex.faceValue - num(task(farBonds, "t1-issue-price")).issuePrice
    );
  });

  it("year-1 effective-interest chain", () => {
    const t3 = num(task(farBonds, "t3-year1-amounts"));
    const interest = issue * y;
    expect(Math.abs(t3.interestExpense - interest)).toBeLessThanOrEqual(2);
    expect(t3.discountAmortized).toBe(t3.interestExpense - ex.annualCouponCash);
    expect(Math.abs(t3.endingCarryingValue - (issue + t3.discountAmortized))).toBeLessThanOrEqual(2);
  });

  it("both journal entries balance and use the face on issuance", () => {
    for (const id of ["t2-issuance-je", "t4-interest-je"]) {
      const e = jeEntries(task(farBonds, id));
      expect(e.reduce((n, x) => n + x.debit, 0)).toBe(e.reduce((n, x) => n + x.credit, 0));
    }
    const issuance = jeEntries(task(farBonds, "t2-issuance-je"));
    expect(issuance.reduce((n, x) => n + x.credit, 0)).toBe(ex.faceValue);
  });

  it("grader accepts the correct issuance JE with $/comma formatting", () => {
    const r = gradeTask(
      task(farBonds, "t2-issuance-je"),
      JSON.stringify({
        entries: [
          { account: "2500", debit: "", credit: "$1,000,000" },
          { account: "1000", debit: "920,146", credit: "" },
          { account: "2510", debit: "79,854", credit: "" },
        ],
      })
    );
    expect(r.passed).toBe(true);
  });
});

describe("BAR capital budgeting ties out", () => {
  const ex = barCapital.exhibits[0].data as {
    initialInvestment: number;
    annualAfterTaxInflow: number;
    pvOrdinaryAnnuity_12pct_5yr: number;
  };
  const pv = ex.annualAfterTaxInflow * ex.pvOrdinaryAnnuity_12pct_5yr;

  it("NPV and PV of inflows", () => {
    const t1 = num(task(barCapital, "t1-npv"));
    expect(Math.abs(t1.pvOfInflows - pv)).toBeLessThanOrEqual(2);
    expect(t1.npv).toBe(t1.pvOfInflows - ex.initialInvestment);
  });

  it("profitability index and payback", () => {
    const t2 = num(task(barCapital, "t2-pi-payback"));
    expect(Math.abs(t2.profitabilityIndex - pv / ex.initialInvestment)).toBeLessThanOrEqual(0.02);
    expect(
      Math.abs(t2.paybackYears - ex.initialInvestment / ex.annualAfterTaxInflow)
    ).toBeLessThanOrEqual(0.02);
  });

  it("grader accepts the PI/payback answer within its 0.02 tolerance", () => {
    const r = gradeTask(
      task(barCapital, "t2-pi-payback"),
      JSON.stringify({ profitabilityIndex: "1.04", paybackYears: "3.48" })
    );
    expect(r.passed).toBe(true);
  });
});

describe("REG §1031 like-kind exchange ties out", () => {
  const ex = reg1031.exhibits[0].data as {
    adjustedBasisRelinquished: number;
    fmvReplacementRealProperty: number;
    cashBootReceived: number;
  };
  const amountRealized = ex.fmvReplacementRealProperty + ex.cashBootReceived;
  const realized = amountRealized - ex.adjustedBasisRelinquished;
  const recognized = Math.min(realized, ex.cashBootReceived);

  it("realized, recognized, basis, and deferred chain", () => {
    expect(num(task(reg1031, "t1-realized")).realizedGain).toBe(realized);
    expect(num(task(reg1031, "t2-recognized")).recognizedGain).toBe(recognized);
    // substituted basis = old basis − boot + recognized
    expect(num(task(reg1031, "t3-basis")).basisReplacement).toBe(
      ex.adjustedBasisRelinquished - ex.cashBootReceived + recognized
    );
    expect(num(task(reg1031, "t4-deferred")).deferredGain).toBe(realized - recognized);
  });
});

describe("breadth sim schema hygiene", () => {
  it("all tasks are calc/je with non-negative tolerances and explanations", () => {
    for (const sim of [farBonds, barCapital, reg1031]) {
      expect(sim.tasks.length).toBeGreaterThanOrEqual(2);
      for (const t of sim.tasks as WorkflowTask[]) {
        expect(["calc", "je"]).toContain(t.type);
        if (t.tolerance != null) expect(t.tolerance).toBeGreaterThanOrEqual(0);
        expect(t.explanation).toBeTruthy();
      }
    }
  });
});
