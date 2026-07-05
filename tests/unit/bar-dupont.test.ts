import { describe, expect, it } from "vitest";
import { gradeTask } from "@/components/ApplyWorkflowClient";
import type { WorkflowTask } from "@/lib/case-workflows";
import sim from "@/data/tbs/bar-dupont-analysis.json";

const task = (id: string): WorkflowTask => {
  const t = sim.tasks.find((x) => x.id === id);
  if (!t) throw new Error(`missing task ${id}`);
  return t as WorkflowTask;
};
const num = (t: WorkflowTask) => t.expected as Record<string, number>;

describe("BAR DuPont analysis ties out", () => {
  const ex = sim.exhibits[0].data as {
    netIncome: number;
    sales: number;
    totalAssets: number;
    totalEquity: number;
  };
  const margin = (ex.netIncome / ex.sales) * 100;
  const turnover = ex.sales / ex.totalAssets;
  const mult = ex.totalAssets / ex.totalEquity;

  it("the three DuPont components", () => {
    const t1 = num(task("t1-components"));
    expect(Math.abs(t1.netProfitMarginPercent - margin)).toBeLessThanOrEqual(0.05);
    expect(Math.abs(t1.assetTurnover - turnover)).toBeLessThanOrEqual(0.05);
    expect(Math.abs(t1.equityMultiplier - mult)).toBeLessThanOrEqual(0.05);
  });

  it("ROE equals the product of the three components and NI/equity", () => {
    const roe = num(task("t2-roe")).returnOnEquityPercent;
    expect(Math.abs(roe - (margin / 100) * turnover * mult * 100)).toBeLessThanOrEqual(0.1);
    expect(Math.abs(roe - (ex.netIncome / ex.totalEquity) * 100)).toBeLessThanOrEqual(0.1);
  });

  it("ROA = margin × turnover, and leverage contribution = ROE − ROA", () => {
    const t3 = num(task("t3-roa"));
    expect(Math.abs(t3.returnOnAssetsPercent - (margin / 100) * turnover * 100)).toBeLessThanOrEqual(0.1);
    expect(
      Math.abs(t3.roeFromLeveragePercent - (num(task("t2-roe")).returnOnEquityPercent - t3.returnOnAssetsPercent))
    ).toBeLessThanOrEqual(0.1);
  });

  it("grader accepts the components answer within tolerance", () => {
    const r = gradeTask(
      task("t1-components"),
      JSON.stringify({ netProfitMarginPercent: "7", assetTurnover: "2.0", equityMultiplier: "1.6" })
    );
    expect(r.passed).toBe(true);
  });
});
