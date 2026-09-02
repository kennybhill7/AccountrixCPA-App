import { describe, expect, it } from "vitest";
import {
  baselineSnapshot,
  examDelta,
  type ReadinessSnapshot,
} from "@/lib/readinessHistory";

const snap = (day: number, cpa: number): ReadinessSnapshot => ({
  day,
  byExam: { CPA: cpa, CMA: 0, Finance: 0 },
  bySection: {},
});

describe("baselineSnapshot", () => {
  it("returns null with no history", () => {
    expect(baselineSnapshot([], 100)).toBeNull();
  });

  it("picks the most recent snapshot at least `withinDays` old", () => {
    const history = [snap(90, 10), snap(93, 20), snap(96, 30)];
    // day 100, within 7 → cutoff 93; latest <= 93 is day 93.
    expect(baselineSnapshot(history, 100, 7)!.day).toBe(93);
  });

  it("falls back to the earliest prior snapshot when none is old enough", () => {
    const history = [snap(98, 10), snap(99, 20)];
    // day 100, cutoff 93 → none that old → earliest prior = day 98.
    expect(baselineSnapshot(history, 100, 7)!.day).toBe(98);
  });

  it("never returns today's own snapshot as the baseline", () => {
    expect(baselineSnapshot([snap(100, 50)], 100, 7)).toBeNull();
  });
});

describe("examDelta", () => {
  it("computes a signed rounded delta vs the baseline", () => {
    const baseline = snap(93, 20);
    expect(examDelta({ CPA: 30 }, baseline, "CPA")).toBe(10);
    expect(examDelta({ CPA: 15 }, baseline, "CPA")).toBe(-5);
  });

  it("returns null when there is no baseline or the exam is absent from it", () => {
    expect(examDelta({ CPA: 30 }, null, "CPA")).toBeNull();
    const baselineWithoutFinance: ReadinessSnapshot = { day: 93, byExam: { CPA: 20 }, bySection: {} };
    expect(examDelta({ Finance: 30 }, baselineWithoutFinance, "Finance")).toBeNull();
  });
});
