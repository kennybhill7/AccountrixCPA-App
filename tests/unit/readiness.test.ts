import { describe, it, expect } from "vitest";
import { skillReadiness, computeReadiness, type SkillStats } from "../../lib/readiness";

describe("readiness", () => {
  it("scores an untested skill as 0 (not tested)", () => {
    const r = skillReadiness({ skill: "tvm", attempts: 0, correct: 0 }, 100);
    expect(r.tested).toBe(false);
    expect(r.score).toBe(0);
  });

  it("a strong, recent, well-calibrated skill scores high", () => {
    const s: SkillStats = {
      skill: "tvm",
      attempts: 20,
      correct: 19,
      lastDay: 100,
      avgConfidence: 0.95,
      avgTimeSec: 40,
      targetTimeSec: 60,
      simAccuracy: 0.9,
      srStrength: 0.9,
    };
    const r = skillReadiness(s, 100);
    expect(r.score).toBeGreaterThan(85);
    expect(r.components.speed).toBe(1); // faster than target caps at 1
  });

  it("penalizes overconfidence via the calibration component", () => {
    const base: SkillStats = { skill: "x", attempts: 10, correct: 5, lastDay: 0 };
    const calibrated = skillReadiness({ ...base, avgConfidence: 0.5 }, 0);
    const overconfident = skillReadiness({ ...base, avgConfidence: 0.95 }, 0);
    expect(calibrated.components.calibration).toBeCloseTo(1, 5);
    expect(overconfident.components.calibration).toBeCloseTo(0.55, 5);
    expect(overconfident.score).toBeLessThan(calibrated.score);
  });

  it("decays the recency component over time (half-life)", () => {
    const s: SkillStats = { skill: "x", attempts: 10, correct: 10, lastDay: 0 };
    const fresh = skillReadiness(s, 0, { recencyHalfLifeDays: 14 });
    const stale = skillReadiness(s, 14, { recencyHalfLifeDays: 14 });
    expect(fresh.components.recency).toBeCloseTo(1, 5);
    expect(stale.components.recency).toBeCloseTo(0.5, 5);
    expect(stale.score).toBeLessThan(fresh.score);
  });

  it("rolls up overall readiness weighted by blueprint", () => {
    const stats: SkillStats[] = [
      { skill: "strong", attempts: 10, correct: 10, lastDay: 0 },
      { skill: "weak", attempts: 10, correct: 2, lastDay: 0 },
    ];
    const evenly = computeReadiness(stats, {}, 0).overall;
    // weighting the weak skill heavily drags the overall down
    const weakHeavy = computeReadiness(stats, { strong: 1, weak: 4 }, 0).overall;
    expect(weakHeavy).toBeLessThan(evenly);
  });

  it("surfaces the weakest topics", () => {
    const stats: SkillStats[] = [
      { skill: "a", attempts: 10, correct: 9, lastDay: 0 },
      { skill: "b", attempts: 10, correct: 3, lastDay: 0 },
      { skill: "c", attempts: 10, correct: 6, lastDay: 0 },
    ];
    const res = computeReadiness(stats, {}, 0, { weakestCount: 2 });
    expect(res.weakest.map((w) => w.skill)).toEqual(["b", "c"]);
  });

  it("works with sparse data (only accuracy) by renormalizing", () => {
    const r = skillReadiness({ skill: "x", attempts: 4, correct: 3 }, 0);
    // only accuracy present → score = accuracy × 100 = 75
    expect(r.score).toBe(75);
    expect(Object.keys(r.components)).toEqual(["accuracy"]);
  });
});
