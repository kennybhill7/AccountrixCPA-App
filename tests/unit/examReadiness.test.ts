import { describe, expect, it } from "vitest";
import { EXAM_SECTIONS, sectionBlueprint, sectionsForExam } from "@/lib/examSections";
import { computeExamReadiness, statusFor } from "@/lib/examReadiness";
import {
  skillStatsFromAttempts,
  srStrengthFromSrsItems,
} from "@/lib/attemptStats";
import type { AttemptEvent } from "@/lib/types";

const ev = (over: Partial<AttemptEvent>): AttemptEvent => ({
  id: Math.random().toString(36).slice(2),
  source: "quiz",
  itemId: "x",
  track: "cpa",
  skills: [],
  correct: true,
  answer: 0,
  ts: 0,
  ...over,
});

describe("examSections", () => {
  it("every section blueprint weight sums to ~1", () => {
    for (const section of EXAM_SECTIONS) {
      const bp = sectionBlueprint(section);
      const sum = Object.values(bp).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1, 6);
    }
  });

  it("groups the six CPA sections, two CMA parts, and Finance", () => {
    expect(sectionsForExam("CPA").map((s) => s.id)).toEqual([
      "far",
      "aud",
      "reg",
      "bar",
      "isc",
      "tcp",
    ]);
    expect(sectionsForExam("CMA").map((s) => s.id)).toEqual(["cma-p1", "cma-p2"]);
    expect(sectionsForExam("Finance")).toHaveLength(1);
  });
});

describe("statusFor thresholds", () => {
  it("maps readiness to a status band", () => {
    expect(statusFor(10)).toBe("not-ready");
    expect(statusFor(55)).toBe("building");
    expect(statusFor(72)).toBe("on-track");
    expect(statusFor(90)).toBe("exam-ready");
  });
});

describe("computeExamReadiness honesty", () => {
  it("starts every section at 0 with no evidence", () => {
    const report = computeExamReadiness([], 0);
    for (const s of report.sections) {
      expect(s.readiness).toBe(0);
      expect(s.testedSkills).toBe(0);
      expect(s.status).toBe("not-ready");
    }
  });

  it("does NOT inflate a section when only some skills are tested", () => {
    // Perfect on 1 of FAR's 11 skills → far below 100%.
    const far = EXAM_SECTIONS.find((s) => s.id === "far")!;
    const stats = skillStatsFromAttempts([
      ev({ skills: [far.skills[0]], correct: true, itemId: "cpa-practice:FAR:1" }),
      ev({ skills: [far.skills[0]], correct: true, itemId: "cpa-practice:FAR:2" }),
    ]);
    const report = computeExamReadiness(stats, 0);
    const section = report.sections.find((s) => s.id === "far")!;
    expect(section.testedSkills).toBe(1);
    expect(section.totalSkills).toBe(far.skills.length);
    // 1 skill at ~100% out of 11 equal-weighted skills ≈ 9%.
    expect(section.readiness).toBeGreaterThan(0);
    expect(section.readiness).toBeLessThan(20);
  });

  it("separates coverage readiness from tested-only mastery", () => {
    const far = EXAM_SECTIONS.find((s) => s.id === "far")!;
    // Perfect on 1 of 11 skills: low coverage, but high mastery of what's tested.
    const stats = skillStatsFromAttempts([
      ev({ skills: [far.skills[0]], correct: true, itemId: "q1" }),
      ev({ skills: [far.skills[0]], correct: true, itemId: "q2" }),
    ]);
    const section = computeExamReadiness(stats, 0).sections.find((s) => s.id === "far")!;
    expect(section.readiness).toBeLessThan(20); // coverage is low
    expect(section.masteryOfTested).toBeGreaterThan(section.readiness); // but mastery is high
    // untested sections report null mastery
    const aud = computeExamReadiness(stats, 0).sections.find((s) => s.id === "aud")!;
    expect(aud.masteryOfTested).toBeNull();
  });

  it("hours-to-target shrinks as more skills reach the target", () => {
    const far = EXAM_SECTIONS.find((s) => s.id === "far")!;
    const noEvidence = computeExamReadiness([], 0).sections.find((s) => s.id === "far")!;
    const someEvidence = computeExamReadiness(
      skillStatsFromAttempts(
        far.skills.slice(0, 5).flatMap((skill, i) => [
          ev({ skills: [skill], correct: true, itemId: `q${i}a` }),
          ev({ skills: [skill], correct: true, itemId: `q${i}b` }),
        ])
      ),
      0
    ).sections.find((s) => s.id === "far")!;
    expect(someEvidence.hoursToTarget).toBeLessThan(noEvidence.hoursToTarget);
  });
});

describe("simAccuracy + srStrength wiring", () => {
  it("populates simAccuracy only from tbs:/essay: attempts", () => {
    const stats = skillStatsFromAttempts([
      ev({ skills: ["leases"], correct: true, itemId: "tbs:far-leases-842:t1" }),
      ev({ skills: ["leases"], correct: false, itemId: "tbs:far-leases-842:t2" }),
      ev({ skills: ["leases"], correct: true, itemId: "cpa-practice:FAR:9" }),
    ]);
    const leases = stats.find((s) => s.skill === "leases")!;
    expect(leases.simAccuracy).toBe(0.5); // 1 of 2 sim attempts; the practice one excluded
    expect(leases.attempts).toBe(3); // all still count toward plain accuracy
  });

  it("essay attempts also feed simAccuracy", () => {
    const stats = skillStatsFromAttempts([
      ev({ skills: ["variance-analysis"], correct: true, itemId: "essay:cma-p1-variance:r1", track: "cma" }),
    ]);
    expect(stats[0].simAccuracy).toBe(1);
  });

  it("srStrengthFromSrsItems averages SM-2 repetitions to a 0–1 strength", () => {
    const map = srStrengthFromSrsItems([
      { skills: ["leases"], repetitions: 0 }, // relearning → 0
      { skills: ["leases"], repetitions: 4 }, // recovered → 1
      { skills: ["inventory"], repetitions: 2 }, // → 0.5
    ]);
    expect(map["leases"]).toBeCloseTo(0.5, 6);
    expect(map["inventory"]).toBeCloseTo(0.5, 6);
  });

  it("feeds srStrength through to SkillStats", () => {
    const stats = skillStatsFromAttempts(
      [ev({ skills: ["leases"], correct: true, itemId: "q1" })],
      { srStrengthBySkill: { leases: 0.25 } }
    );
    expect(stats.find((s) => s.skill === "leases")!.srStrength).toBe(0.25);
  });
});
