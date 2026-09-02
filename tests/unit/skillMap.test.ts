import { describe, it, expect } from "vitest";
import { buildSkillMap } from "@/lib/skillMap";

describe("buildSkillMap", () => {
  it("returns an empty map for empty sources", () => {
    expect(buildSkillMap({})).toEqual({});
  });

  it("maps CMA weeks via the sidecar when weeks carry no inline skills", () => {
    const map = buildSkillMap({
      cmaCurriculum: {
        m4: {
          weeks: [
            { id: "w1", title: "Job-Order Costing" },
            { id: "w2", title: "WIP Schedule" },
          ],
        },
      },
      cmaSkillsSidecar: {
        weeks: {
          "m4:w1": { skills: ["costing-systems", "wip-schedule"] },
          "m4:w2": { skills: ["wip-schedule"] },
        },
      },
    });

    expect(map["wip-schedule"]).toEqual([
      { track: "cma", title: "Job-Order Costing", href: "/learn/m4/w1" },
      { track: "cma", title: "WIP Schedule", href: "/learn/m4/w2" },
    ]);
    expect(map["costing-systems"]).toEqual([
      { track: "cma", title: "Job-Order Costing", href: "/learn/m4/w1" },
    ]);
  });

  it("prefers inline CMA week skills over the sidecar", () => {
    const map = buildSkillMap({
      cmaCurriculum: {
        m1: { weeks: [{ id: "w1", title: "Statements", skills: ["financial-statements"] }] },
      },
      cmaSkillsSidecar: { weeks: { "m1:w1": { skills: ["sidecar-only"] } } },
    });

    expect(map["financial-statements"]).toHaveLength(1);
    expect(map["sidecar-only"]).toBeUndefined();
  });

  it("merges CPA and Finance units with track-specific hrefs", () => {
    const map = buildSkillMap({
      cpaUnits: [
        {
          id: "isc-u1",
          weeks: [
            { id: "w1", title: "IT Governance", skills: ["it-governance"] },
            { id: "w2", title: "Untagged week" }, // skipped — no skills
          ],
        },
      ],
      financeUnits: [
        { id: "finance-u1", weeks: [{ id: "w3", title: "TVM Basics", skills: ["tvm"] }] },
      ],
    });

    expect(map["it-governance"]).toEqual([
      { track: "cpa", title: "IT Governance", href: "/cpa/isc-u1/w1" },
    ]);
    expect(map["tvm"]).toEqual([
      { track: "finance", title: "TVM Basics", href: "/finance/finance-u1/w3" },
    ]);
    expect(Object.keys(map)).toEqual(["it-governance", "tvm"]);
  });

  it("collects the same skill across tracks, CMA first", () => {
    const map = buildSkillMap({
      cmaCurriculum: {
        m2: { weeks: [{ id: "w3", title: "13-Week Cash Forecast", skills: ["cash-forecasting"] }] },
      },
      financeUnits: [
        { id: "finance-u2", weeks: [{ id: "w1", title: "Cash Planning", skills: ["cash-forecasting"] }] },
      ],
    });

    expect(map["cash-forecasting"]).toEqual([
      { track: "cma", title: "13-Week Cash Forecast", href: "/learn/m2/w3" },
      { track: "finance", title: "Cash Planning", href: "/finance/finance-u2/w1" },
    ]);
  });

  it("dedupes repeat refs to the same lesson href", () => {
    const map = buildSkillMap({
      cmaCurriculum: {
        m1: { weeks: [{ id: "w1", title: "Statements", skills: ["financial-statements"] }] },
      },
      cmaSkillsSidecar: { weeks: {} },
    });
    // build twice from overlapping sources shouldn't matter; also a week
    // repeating a skill tag must not produce duplicates
    const map2 = buildSkillMap({
      cmaCurriculum: {
        m1: {
          weeks: [
            {
              id: "w1",
              title: "Statements",
              skills: ["financial-statements", "financial-statements"],
            },
          ],
        },
      },
    });

    expect(map["financial-statements"]).toHaveLength(1);
    expect(map2["financial-statements"]).toHaveLength(1);
  });
});
