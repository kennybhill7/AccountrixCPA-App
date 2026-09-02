/**
 * Registry reachability — a generator that is not in GENERATORS is dead code.
 *
 * The CMA set shipped in lib/parametricCma.ts and nothing imported it, so all
 * 34 generators were unreachable by every practice surface while looking done.
 * These tests fail loudly if that happens again.
 */
import { describe, it, expect } from "vitest";
import { GENERATORS, GENERATOR_SKILLS, SKILL_HINTS, generatorsForSkills } from "@/lib/parametric";
import { CMA_GENERATORS, CMA_GENERATOR_AREA } from "@/lib/parametricCma";

describe("generator registry", () => {
  it("exposes every CMA generator through the shared registry", () => {
    for (const id of Object.keys(CMA_GENERATORS)) {
      expect(GENERATORS[id], `${id} is not reachable from GENERATORS`).toBeDefined();
    }
    expect(Object.keys(GENERATORS).length).toBeGreaterThanOrEqual(
      Object.keys(CMA_GENERATORS).length + 40
    );
  });

  it("gives every generator skill a solving hint", () => {
    const skills = new Set(Object.values(GENERATOR_SKILLS).flat());
    const missing = [...skills].filter((s) => !SKILL_HINTS[s]);
    expect(missing, `skills with no SKILL_HINTS entry: ${missing.join(", ")}`).toEqual([]);
  });

  it("routes the heaviest CMA blueprint areas to real drills", () => {
    // Decision Analysis is 25% of Part 2; Performance Management and Budgeting
    // are 20% each of Part 1. Weak-spot drilling must find something to serve.
    expect(generatorsForSkills(["decision-analysis"]).length).toBeGreaterThanOrEqual(5);
    expect(generatorsForSkills(["variance-analysis"]).length).toBeGreaterThanOrEqual(5);
    expect(generatorsForSkills(["budgeting"]).length).toBeGreaterThanOrEqual(4);
  });

  it("keeps the blueprint-area map aligned with the CMA registry", () => {
    expect(Object.keys(CMA_GENERATOR_AREA).sort()).toEqual(Object.keys(CMA_GENERATORS).sort());
  });

  it("produces a finite answer for every generator across a seed sweep", () => {
    for (const [id, gen] of Object.entries(GENERATORS)) {
      for (let seed = 1; seed <= 50; seed++) {
        expect(Number.isFinite(gen(seed).answer), `${id} seed ${seed}`).toBe(true);
      }
    }
  });
});
