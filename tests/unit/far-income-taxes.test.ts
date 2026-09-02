import { describe, expect, it } from "vitest";
import { gradeTask } from "@/components/ApplyWorkflowClient";
import type { WorkflowTask } from "@/lib/case-workflows";
import sim from "@/data/tbs/far-income-taxes-740.json";

/**
 * Tie-out for the FAR ASC 740 sim: recomputes the current/deferred provision
 * chain from the book-to-tax exhibit and checks the provision entry balances.
 */

const task = (id: string): WorkflowTask => {
  const t = sim.tasks.find((x) => x.id === id);
  if (!t) throw new Error(`missing task ${id}`);
  return t as WorkflowTask;
};
const num = (t: WorkflowTask) => t.expected as Record<string, number>;

describe("FAR ASC 740 provision ties out", () => {
  const ex = sim.exhibits[0].data as {
    pretaxBookIncome: number;
    municipalBondInterest_permanent: number;
    excessTaxDepreciation_temporary: number;
    warrantyAccrual_temporary: number;
  };
  const rate = 0.21;
  const taxable =
    ex.pretaxBookIncome -
    ex.municipalBondInterest_permanent -
    ex.excessTaxDepreciation_temporary +
    ex.warrantyAccrual_temporary;

  it("taxable income nets permanent and temporary differences", () => {
    expect(num(task("t1-taxable-income")).taxableIncome).toBe(taxable);
  });

  it("current tax is the rate on taxable income", () => {
    expect(num(task("t2-current-tax")).currentTax).toBe(rate * taxable);
  });

  it("DTL, DTA, and net deferred expense", () => {
    const t3 = num(task("t3-deferreds"));
    expect(t3.deferredTaxLiability).toBe(rate * ex.excessTaxDepreciation_temporary);
    expect(t3.deferredTaxAsset).toBe(rate * ex.warrantyAccrual_temporary);
    expect(t3.netDeferredTaxExpense).toBe(t3.deferredTaxLiability - t3.deferredTaxAsset);
  });

  it("total tax expense and effective rate tie to the statutory rate on non-permanent income", () => {
    const t4 = num(task("t4-total-and-rate"));
    expect(t4.totalTaxExpense).toBe(rate * taxable + rate * ex.excessTaxDepreciation_temporary - rate * ex.warrantyAccrual_temporary);
    // statutory rate applied to book income less the permanent exclusion
    expect(t4.totalTaxExpense).toBe(rate * (ex.pretaxBookIncome - ex.municipalBondInterest_permanent));
    expect(Math.abs(t4.effectiveRatePercent - (t4.totalTaxExpense / ex.pretaxBookIncome) * 100)).toBeLessThanOrEqual(0.05);
  });

  it("the provision entry balances and books tax expense as the plug", () => {
    const entries = (task("t5-provision-je").expected as {
      entries: Array<{ account: string; debit: number; credit: number }>;
    }).entries;
    const dr = entries.reduce((n, e) => n + e.debit, 0);
    const cr = entries.reduce((n, e) => n + e.credit, 0);
    expect(dr).toBe(cr);
    expect(entries.find((e) => e.account === "6200")?.debit).toBe(
      num(task("t4-total-and-rate")).totalTaxExpense
    );
    expect(entries.find((e) => e.account === "2110")?.credit).toBe(
      num(task("t2-current-tax")).currentTax
    );
  });

  it("grader accepts the full provision JE with $/comma formatting", () => {
    const r = gradeTask(
      task("t5-provision-je"),
      JSON.stringify({
        entries: [
          { account: "2110", debit: "", credit: "$199,500" },
          { account: "2600", debit: "", credit: "12,600" },
          { account: "6200", debit: "205,800", credit: "" },
          { account: "1700", debit: "6,300", credit: "" },
        ],
      })
    );
    expect(r.passed).toBe(true);
  });
});
