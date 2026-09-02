import { describe, expect, it } from "vitest";
import {
  cmaDiagnosticPool,
  cmaDiagnosticSection,
  financeDiagnosticPool,
  sampleDiagnosticItems,
  type DiagnosticItem,
} from "@/lib/diagnosticItems";
import type { Curriculum, Week } from "@/lib/types";

function week(id: string, skills: string[] = []): Week {
  return {
    id,
    order: Number(id.replace("w", "")),
    title: `Week ${id}`,
    lessonHtml: "<p>x</p>",
    flashcards: [],
    skills,
    quiz: {
      id: `${id}-quiz`,
      title: "Quiz",
      questions: [
        { q: `${id} q1`, choices: ["a", "b"], answer: 0 },
        { q: `${id} q2`, choices: ["a", "b"], answer: 1 },
      ],
    },
  };
}

describe("diagnosticItems", () => {
  it("assigns CMA months to the right exam part", () => {
    expect(cmaDiagnosticSection("m1")).toBe("CMA Part 1");
    expect(cmaDiagnosticSection("m6")).toBe("CMA Part 1");
    expect(cmaDiagnosticSection("m7")).toBe("CMA Part 2");
    expect(cmaDiagnosticSection("m12")).toBe("CMA Part 2");
  });

  it("builds CMA diagnostic items with sidecar skills and lesson hrefs", () => {
    const curriculum: Curriculum = {
      m4: { id: "m4", title: "Cost", weeks: [week("w1")] },
      m8: { id: "m8", title: "Corp Finance", weeks: [week("w2")] },
    };
    const items = cmaDiagnosticPool(curriculum, {
      "m4:w1": ["costing-systems"],
      "m8:w2": ["cost-of-capital"],
    });
    expect(items).toHaveLength(4);
    expect(items[0]).toMatchObject({
      track: "cma",
      section: "CMA Part 1",
      skills: ["costing-systems"],
      href: "/learn/m4/w1",
    });
    expect(items[2]).toMatchObject({
      track: "cma",
      section: "CMA Part 2",
      skills: ["cost-of-capital"],
      href: "/learn/m8/w2",
    });
  });

  it("builds Finance diagnostic items from inline week skills", () => {
    const items = financeDiagnosticPool([{ id: "finance-u1", weeks: [week("w1", ["tvm"])] }]);
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      track: "finance",
      section: "Finance",
      skills: ["tvm"],
      href: "/finance/finance-u1/w1",
    });
  });

  it("samples per section in diagnostic display order", () => {
    const make = (section: string, n: number): DiagnosticItem[] =>
      Array.from({ length: n }, (_, i) => ({
        id: `${section}-${i}`,
        track: "cpa",
        section,
        sectionLabel: section,
        stem: "q",
        choices: ["a", "b"],
        answer: 0,
        skills: ["conceptual-framework"],
        href: "/x",
      }));

    const picked = sampleDiagnosticItems(
      [...make("REG", 3), ...make("Finance", 3), ...make("CMA Part 1", 1)],
      2,
      () => 0
    );
    expect(picked.map((i) => i.section)).toEqual([
      "Finance",
      "Finance",
      "CMA Part 1",
      "REG",
      "REG",
    ]);
  });
});
