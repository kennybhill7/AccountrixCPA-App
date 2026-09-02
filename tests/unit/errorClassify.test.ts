import { describe, it, expect } from "vitest";
import {
  classify,
  tallyPatterns,
  topPatterns,
  ERROR_CATEGORIES,
  type MissEvent,
} from "../../lib/errorClassify";

describe("errorClassify", () => {
  it("classifies a concept gap as relearn", () => {
    const r = classify("concept-gap", ["revenue-recognition"]);
    expect(r.action).toBe("relearn");
    expect(r.reviewSkills).toContain("revenue-recognition");
  });

  it("adds the journal-entries anchor skill for je-direction errors", () => {
    const r = classify("je-direction", ["consolidations"]);
    expect(r.action).toBe("drill");
    expect(r.reviewSkills).toContain("consolidations");
    expect(r.reviewSkills).toContain("journal-entries");
  });

  it("does not duplicate an anchor skill already present", () => {
    const r = classify("audit-assertion", ["audit-evidence"]);
    expect(r.reviewSkills.filter((s) => s === "audit-evidence")).toHaveLength(1);
  });

  it("routes time-pressure to timed practice", () => {
    expect(classify("time-pressure").action).toBe("practice-timed");
  });

  it("every category has guidance", () => {
    for (const c of ERROR_CATEGORIES) {
      const r = classify(c);
      expect(r.label.length).toBeGreaterThan(0);
      expect(r.advice.length).toBeGreaterThan(0);
    }
  });

  const misses: MissEvent[] = [
    { skills: ["tvm"], category: "formula-math" },
    { skills: ["tvm"], category: "formula-math" },
    { skills: ["bond-valuation"], category: "formula-math" },
    { skills: ["consolidations"], category: "je-direction" },
    { skills: ["audit-evidence"], category: "audit-assertion" },
  ];

  it("tallies misses by category and skill", () => {
    const t = tallyPatterns(misses);
    expect(t.total).toBe(5);
    expect(t.byCategory["formula-math"]).toBe(3);
    expect(t.bySkill["tvm"]).toBe(2);
  });

  it("surfaces the top recurring patterns (deterministic tie-break)", () => {
    const top = topPatterns(misses, 2);
    expect(top[0]).toEqual({ key: "formula-math", type: "category", count: 3 });
    // next is tvm (skill, count 2) — highest remaining
    expect(top[1]).toEqual({ key: "tvm", type: "skill", count: 2 });
  });

  it("handles an empty miss history", () => {
    expect(topPatterns([])).toEqual([]);
    expect(tallyPatterns([]).total).toBe(0);
  });
});
