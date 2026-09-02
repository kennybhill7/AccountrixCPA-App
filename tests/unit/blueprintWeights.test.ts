import { describe, it, expect } from "vitest";
import {
  CMA_PART_1_AREAS,
  CMA_PART_2_AREAS,
  EXAM_SECTIONS,
  areasForSection,
  sectionBlueprint,
  type BlueprintArea,
} from "@/lib/examSections";

/**
 * Reconciliation guard for the IMA CMA blueprint weights.
 *
 * These figures are transcribed from ICMA's "Content Specification Outlines,
 * Certified Management Accountant (CMA) Examinations", Effective September 1,
 * 2024, retrieved 2026-09-02 from
 * https://prodcm.sfmagazine.com/-/media/IMA/Files/Home/IMA-Certifications/
 * CMA-Certification/2024-CMA-Content-Specification-Outlines-Final.ashx
 *
 * If IMA republishes the CSO, these expectations are the thing that must be
 * updated FIRST — deliberately hard-coded here so a weight can never drift
 * silently out of agreement with the published exam.
 */
const OFFICIAL_PART_1: Array<[string, number]> = [
  ["External Financial Reporting Decisions", 0.15],
  ["Planning, Budgeting, and Forecasting", 0.2],
  ["Performance Management", 0.2],
  ["Cost Management", 0.15],
  ["Internal Controls", 0.15],
  ["Technology and Analytics", 0.15],
];

const OFFICIAL_PART_2: Array<[string, number]> = [
  ["Financial Statement Analysis", 0.2],
  ["Corporate Finance", 0.2],
  ["Business Decision Analysis", 0.25],
  ["Enterprise Risk Management", 0.1],
  ["Capital Investment Decisions", 0.1],
  ["Professional Ethics", 0.15],
];

function checkAreas(areas: BlueprintArea[], official: Array<[string, number]>) {
  expect(areas.map((a) => [a.label, a.weight])).toEqual(official);
  expect(areas.map((a) => a.letter)).toEqual(["A", "B", "C", "D", "E", "F"]);
  const sum = areas.reduce((s, a) => s + a.weight, 0);
  expect(sum).toBeCloseTo(1, 10);
}

describe("CMA blueprint areas match the Sept 1 2024 IMA CSO", () => {
  it("Part 1 areas, names and weights are the published ones", () => {
    checkAreas(CMA_PART_1_AREAS, OFFICIAL_PART_1);
  });

  it("Part 2 areas, names and weights are the published ones", () => {
    checkAreas(CMA_PART_2_AREAS, OFFICIAL_PART_2);
  });

  it("areasForSection resolves the CMA parts and refuses to invent others", () => {
    expect(areasForSection("cma-p1")).toBe(CMA_PART_1_AREAS);
    expect(areasForSection("cma-p2")).toBe(CMA_PART_2_AREAS);
    // CPA/Finance have no IMA-published area map — must stay empty, not guessed.
    expect(areasForSection("far")).toEqual([]);
    expect(areasForSection("finance")).toEqual([]);
  });
});

describe("per-skill weights reconcile to the official area weights", () => {
  it.each([
    ["cma-p1", CMA_PART_1_AREAS],
    ["cma-p2", CMA_PART_2_AREAS],
  ] as const)("%s: each area's skills sum to its published percentage", (sectionId, areas) => {
    const section = EXAM_SECTIONS.find((s) => s.id === sectionId);
    expect(section).toBeDefined();
    const bp = sectionBlueprint(section!);

    for (const area of areas) {
      const areaSum = area.skills.reduce((s, skill) => s + (bp[skill] ?? 0), 0);
      expect(
        Math.abs(areaSum - area.weight),
        `${sectionId} area ${area.letter} (${area.label}) summed to ${areaSum}, expected ${area.weight}`
      ).toBeLessThan(1e-6);
    }
  });

  it.each([
    ["cma-p1", CMA_PART_1_AREAS],
    ["cma-p2", CMA_PART_2_AREAS],
  ] as const)("%s: areas partition the section's skills exactly", (sectionId, areas) => {
    const section = EXAM_SECTIONS.find((s) => s.id === sectionId)!;
    const fromAreas = areas.flatMap((a) => a.skills);
    // No skill counted twice inside one part, and no skill left out.
    expect(new Set(fromAreas).size).toBe(fromAreas.length);
    expect([...fromAreas].sort()).toEqual([...section.skills].sort());
  });

  it("Part 2 C (25%) really does outweigh Part 2 D (10%) in the blueprint", () => {
    // The bug this whole task exists to fix: flat content allocation gave
    // Decision Analysis and Risk Management identical shelf space.
    const c = CMA_PART_2_AREAS.find((a) => a.letter === "C")!;
    const d = CMA_PART_2_AREAS.find((a) => a.letter === "D")!;
    expect(c.weight / d.weight).toBeCloseTo(2.5, 10);
  });
});
