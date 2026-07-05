import { describe, expect, it } from "vitest";
import { gradeTask } from "@/components/ApplyWorkflowClient";
import type { WorkflowTask } from "@/lib/case-workflows";
import tcp from "@/data/tbs/tcp-qbi-niit.json";

/**
 * Tie-out for the TCP QBI/NIIT sim: every graded value is recomputed from the
 * exhibit on the 2026 PL 119-21 baseline.
 */

const task = (id: string): WorkflowTask => {
  const t = tcp.tasks.find((x) => x.id === id);
  if (!t) throw new Error(`missing task ${id}`);
  return t as WorkflowTask;
};
const num = (t: WorkflowTask) => t.expected as Record<string, number>;

describe("TCP QBI + NIIT ties out (2026 baseline)", () => {
  const ex = tcp.exhibits[0].data as {
    qualifiedBusinessIncome: number;
    w2WagesPaid: number;
    ubiaQualifiedProperty: number;
    taxableIncomeBeforeQbi: number;
    netInvestmentIncome: number;
    modifiedAgi: number;
    niitThresholdSingle: number;
  };

  it("tentative QBI is 20% of QBI", () => {
    expect(num(task("t1-tentative")).tentativeQbi).toBe(0.2 * ex.qualifiedBusinessIncome);
  });

  it("wage limit is the greater of 50% wages or 25% wages + 2.5% UBIA", () => {
    const wageLimit = Math.max(
      0.5 * ex.w2WagesPaid,
      0.25 * ex.w2WagesPaid + 0.025 * ex.ubiaQualifiedProperty
    );
    expect(num(task("t2-wage-limit")).wageLimit).toBe(wageLimit);
  });

  it("allowable QBI is the lesser of tentative, wage limit, and 20% of taxable income", () => {
    const tentative = 0.2 * ex.qualifiedBusinessIncome;
    const wageLimit = Math.max(0.5 * ex.w2WagesPaid, 0.25 * ex.w2WagesPaid);
    const tiLimit = 0.2 * ex.taxableIncomeBeforeQbi;
    expect(num(task("t3-allowable")).allowableQbi).toBe(Math.min(tentative, wageLimit, tiLimit));
  });

  it("NIIT is 3.8% of the lesser of NII or MAGI excess over the threshold", () => {
    const niit = 0.038 * Math.min(ex.netInvestmentIncome, ex.modifiedAgi - ex.niitThresholdSingle);
    expect(num(task("t4-niit")).niit).toBe(niit);
  });

  it("grader accepts the allowable QBI with $/comma formatting", () => {
    expect(gradeTask(task("t3-allowable"), JSON.stringify({ allowableQbi: "$60,000" })).passed).toBe(
      true
    );
  });

  it("all tasks are calc with explanations", () => {
    for (const t of tcp.tasks as WorkflowTask[]) {
      expect(t.type).toBe("calc");
      expect(t.explanation).toBeTruthy();
    }
  });
});
