import { describe, it, expect } from "vitest";
import { masteryLevel, masteryMap, overallReadiness } from "@/lib/mastery";
import type { AttemptEvent } from "@/lib/types";

function events(skill: string, n: number, correct: number): AttemptEvent[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `${skill}-${i}`,
    ts: 1_700_000_000_000 + i * 1000,
    source: "parametric" as const,
    track: "finance" as const,
    itemId: `parametric:${skill}:${i}`,
    skills: [skill],
    correct: i < correct,
    answer: 0,
  }));
}

describe("masteryLevel", () => {
  it("maps volume+accuracy to the 5 coarse levels", () => {
    expect(masteryLevel(0, 0)).toBe(0); // Not started
    expect(masteryLevel(2, 1)).toBe(1); // too few attempts → Know
    expect(masteryLevel(8, 0.4)).toBe(1); // low accuracy → Know
    expect(masteryLevel(8, 0.6)).toBe(2); // Apply
    expect(masteryLevel(8, 0.8)).toBe(3); // Analyze
    expect(masteryLevel(4, 0.95)).toBe(3); // high accuracy but thin → Analyze
    expect(masteryLevel(10, 0.9)).toBe(4); // Exam-Ready
  });
});

describe("masteryMap / overallReadiness", () => {
  it("is 0 with no data and rises as skills are mastered", () => {
    expect(overallReadiness([])).toBe(0);
    const map0 = masteryMap([]);
    expect(map0.length).toBeGreaterThan(10);
    expect(map0.every((m) => m.level === 0)).toBe(true);

    const strong = events("tvm", 10, 10); // all correct → Exam-Ready
    const r = overallReadiness(strong);
    expect(r).toBeGreaterThan(0);
    const tvm = masteryMap(strong).find((m) => m.skill === "tvm");
    expect(tvm?.level).toBe(4);
  });
});
