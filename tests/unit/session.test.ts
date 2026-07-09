import { describe, it, expect } from "vitest";
import { buildSession, weakSkills } from "@/lib/session";
import { GENERATORS } from "@/lib/parametric";
import type { AttemptEvent } from "@/lib/types";

function ev(skill: string, correct: boolean, i: number): AttemptEvent {
  return {
    id: `e${i}`,
    ts: 1_700_000_000_000 + i * 1000,
    source: "parametric",
    track: "finance",
    itemId: `parametric:${skill}:${i}`,
    skills: [skill],
    correct,
    answer: correct ? 1 : 0,
  };
}

describe("buildSession", () => {
  it("returns exactly `length` items that reference real generators, deterministically", () => {
    const s1 = buildSession([], { length: 10, seedBase: 42 });
    const s2 = buildSession([], { length: 10, seedBase: 42 });
    expect(s1).toHaveLength(10);
    expect(s2).toEqual(s1); // deterministic
    for (const it of s1) expect(GENERATORS[it.genId]).toBeDefined();
  });

  it("honors Quick-5 length", () => {
    expect(buildSession([], { length: 5, seedBase: 1 })).toHaveLength(5);
  });

  it("weights the front of the session toward weak skills when data exists", () => {
    // 'tvm' answered mostly wrong → weakest; 'ratio-analysis' mostly right.
    const events: AttemptEvent[] = [];
    let i = 0;
    for (let k = 0; k < 6; k++) events.push(ev("tvm", false, i++));
    for (let k = 0; k < 6; k++) events.push(ev("ratio-analysis", true, i++));
    expect(weakSkills(events)[0]).toBe("tvm");

    const s = buildSession(events, { length: 10, seedBase: 3, weakBias: 0.5 });
    const weakItems = s.filter((it) => it.reason === "weak");
    expect(weakItems.length).toBe(5);
    // Every weak item must be a generator that actually drills a weak skill.
    const tvmGens = Object.entries(
      Object.fromEntries(Object.keys(GENERATORS).map((id) => [id, GENERATORS[id](1).skills]))
    );
    const weakSkillSet = new Set(weakSkills(events));
    for (const it of weakItems) {
      const skills = GENERATORS[it.genId](it.seed).skills;
      expect(skills.some((sk) => weakSkillSet.has(sk))).toBe(true);
    }
    expect(tvmGens.length).toBeGreaterThan(0);
  });
});
