import { describe, expect, it } from "vitest";
import { gradeTask } from "@/components/ApplyWorkflowClient";
import type { WorkflowTask } from "@/lib/case-workflows";
import sim from "@/data/tbs/aud-materiality.json";

const task = (id: string): WorkflowTask => {
  const t = sim.tasks.find((x) => x.id === id);
  if (!t) throw new Error(`missing task ${id}`);
  return t as WorkflowTask;
};
const num = (t: WorkflowTask) => t.expected as Record<string, number>;

describe("AUD materiality ties out to firm policy", () => {
  const ex = sim.exhibits[0].data as {
    pretaxIncome: number;
    aggregatedUncorrectedMisstatements: number;
  };
  const overall = 0.05 * ex.pretaxIncome;

  it("overall = 5% of pretax income", () => {
    expect(num(task("t1-overall")).overallMateriality).toBe(overall);
  });

  it("performance = 75% of overall", () => {
    expect(num(task("t2-performance")).performanceMateriality).toBe(0.75 * overall);
  });

  it("clearly-trivial = 5% of overall", () => {
    expect(num(task("t3-trivial")).clearlyTrivialThreshold).toBe(0.05 * overall);
  });

  it("excess of aggregated misstatements over overall materiality", () => {
    expect(num(task("t4-excess")).excessOverMateriality).toBe(
      ex.aggregatedUncorrectedMisstatements - overall
    );
  });

  it("performance materiality is below overall, and trivial below performance", () => {
    const overallV = num(task("t1-overall")).overallMateriality;
    const perfV = num(task("t2-performance")).performanceMateriality;
    const trivV = num(task("t3-trivial")).clearlyTrivialThreshold;
    expect(perfV).toBeLessThan(overallV);
    expect(trivV).toBeLessThan(perfV);
  });

  it("grader accepts the overall-materiality answer with $/comma", () => {
    expect(gradeTask(task("t1-overall"), JSON.stringify({ overallMateriality: "$200,000" })).passed).toBe(
      true
    );
  });
});
