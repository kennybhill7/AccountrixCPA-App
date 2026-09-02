import { describe, expect, it } from "vitest";
import { gradeTask } from "@/components/ApplyWorkflowClient";
import type { WorkflowTask } from "@/lib/case-workflows";
import sim from "@/data/tbs/far-consolidation-goodwill.json";

const task = (id: string): WorkflowTask => {
  const t = sim.tasks.find((x) => x.id === id);
  if (!t) throw new Error(`missing task ${id}`);
  return t as WorkflowTask;
};
const num = (t: WorkflowTask) => t.expected as Record<string, number>;

describe("FAR consolidation goodwill/NCI ties out (full-goodwill method)", () => {
  const ex = sim.exhibits[0].data as {
    considerationTransferred_80pct: number;
    nciFairValue_20pct: number;
    bookValueIdentifiableNetAssets: number;
    fairValueIdentifiableNetAssets: number;
    nciPercent: number;
  };
  const fullFV = ex.considerationTransferred_80pct + ex.nciFairValue_20pct;

  it("acquiree fair value = consideration + NCI fair value", () => {
    expect(num(task("t1-full-fv")).fairValueOfAcquiree).toBe(fullFV);
  });

  it("total goodwill = acquiree FV − identifiable net assets FV", () => {
    expect(num(task("t2-goodwill")).goodwill).toBe(fullFV - ex.fairValueIdentifiableNetAssets);
  });

  it("fair-value step-up = FV − BV of identifiable net assets", () => {
    expect(num(task("t3-excess")).fairValueStepUp).toBe(
      ex.fairValueIdentifiableNetAssets - ex.bookValueIdentifiableNetAssets
    );
  });

  it("NCI and parent goodwill split, summing to total goodwill", () => {
    const t4 = num(task("t4-nci-goodwill"));
    const nciGoodwill = ex.nciFairValue_20pct - ex.nciPercent * ex.fairValueIdentifiableNetAssets;
    expect(t4.nciGoodwill).toBe(nciGoodwill);
    expect(t4.nciGoodwill + t4.parentGoodwill).toBe(num(task("t2-goodwill")).goodwill);
  });

  it("grader accepts the goodwill answer with $/comma", () => {
    expect(gradeTask(task("t2-goodwill"), JSON.stringify({ goodwill: "$800,000" })).passed).toBe(true);
  });
});
