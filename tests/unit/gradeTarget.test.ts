import { describe, it, expect } from "vitest";
import {
  weightsSumToOne,
  projectGrade,
  finalNeeded,
  finalNeededDetailed,
  applyMidtermReplacement,
  sensitivityTable,
  type GradeWeights,
} from "../../lib/gradeTarget";

// Post-replacement weighting used to scope a B+ target (generic, no personal data).
const W: GradeWeights = { midterm: 0.15, final: 0.5, other: 0.35 };
const KEPT_MIDTERM = 55; // illustrative input
const TARGET = 87; // B+

describe("gradeTarget", () => {
  it("weights sum to one", () => {
    expect(weightsSumToOne(W)).toBe(true);
  });

  it("finalNeeded reproduces the B+ sensitivity table", () => {
    const round = (n: number) => Math.round(n * 10) / 10;
    expect(round(finalNeeded(W, { midterm: KEPT_MIDTERM, other: 100 }, TARGET))).toBe(87.5);
    expect(round(finalNeeded(W, { midterm: KEPT_MIDTERM, other: 95 }, TARGET))).toBe(91.0);
    expect(round(finalNeeded(W, { midterm: KEPT_MIDTERM, other: 90 }, TARGET))).toBe(94.5);
    expect(round(finalNeeded(W, { midterm: KEPT_MIDTERM, other: 85 }, TARGET))).toBe(98.0);
    expect(round(finalNeeded(W, { midterm: KEPT_MIDTERM, other: 80 }, TARGET))).toBe(101.5);
  });

  it("flags an impossible (>100) final as not achievable", () => {
    const r = finalNeededDetailed(W, { midterm: KEPT_MIDTERM, other: 80 }, TARGET);
    expect(r.achievable).toBe(false);
    const ok = finalNeededDetailed(W, { midterm: KEPT_MIDTERM, other: 95 }, TARGET);
    expect(ok.achievable).toBe(true);
  });

  it("projectGrade is the inverse of finalNeeded", () => {
    const s = { midterm: KEPT_MIDTERM, other: 92 };
    const needed = finalNeeded(W, s, TARGET);
    expect(projectGrade(W, s, needed)).toBeCloseTo(TARGET, 6);
  });

  it("applies lowest-midterm replacement only when the final is higher", () => {
    // final (70) replaces the lowest midterm (27.5) but not the higher one (55)
    expect(applyMidtermReplacement([55, 27.5], 70)).toEqual([55, 70]);
    // final lower than both midterms changes nothing
    expect(applyMidtermReplacement([55, 27.5], 20)).toEqual([55, 27.5]);
  });

  it("builds a sensitivity table", () => {
    const rows = sensitivityTable(W, KEPT_MIDTERM, TARGET, [100, 95, 90, 85, 80]);
    expect(rows).toHaveLength(5);
    expect(rows[0]).toEqual({ other: 100, finalNeeded: 87.5, achievable: true });
    expect(rows[4]).toEqual({ other: 80, finalNeeded: 101.5, achievable: false });
  });
});
