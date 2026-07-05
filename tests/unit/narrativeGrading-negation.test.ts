import { describe, expect, it } from "vitest";
import { gradeNarrativeText, type ExpectedConclusionSpec } from "@/lib/narrativeGrading";

/**
 * Reviewer-added coverage (Fable audit of narrative-expected-conclusions-p1):
 * the acceptance criterion explicitly requires that a NEGATED blocker phrase
 * does not create a false rejection ("not immune to" must not trigger the
 * "immune to" blocker), yet there was no direct test for hasUnnegatedPhrase.
 * These exercise the conclusion dimension through the public grader.
 */

const conclusionDim = (answer: string, conclusions: ExpectedConclusionSpec[]) =>
  gradeNarrativeText(answer, {
    concepts: [{ id: "topic", anyOf: ["project", "forecast"] }],
    minWords: 15,
    conclusions,
  }).dimensions.find((d) => d.name === "conclusion")!;

const ROBUST: ExpectedConclusionSpec[] = [
  { id: "robust-not-immune", anyOf: ["reasonably robust"], noneOf: ["immune to"] },
];

describe("conclusion grading — negation-aware blockers", () => {
  it("a negated blocker phrase does NOT trigger a contradiction", () => {
    const d = conclusionDim(
      "The forecast makes the project reasonably robust, but it is not immune to an aggressive revenue estimate that could erode the margin.",
      ROBUST
    );
    expect(d.ok).toBe(true);
    expect(d.detail).not.toContain("contradiction");
  });

  it("an UNNEGATED blocker phrase DOES trigger a contradiction", () => {
    const d = conclusionDim(
      "The forecast shows the project is immune to any change; the decision carries no downside at all for this project.",
      ROBUST
    );
    expect(d.ok).toBe(false);
    expect(d.detail).toContain("contradiction");
  });

  it("catches the classic accept/reject inversion via the blocker", () => {
    const conclusions: ExpectedConclusionSpec[] = [
      {
        id: "accept",
        anyOf: ["accept the project", "should accept"],
        noneOf: ["reject the project", "should reject"],
      },
    ];
    const wrong = conclusionDim(
      "Because the project return trails the hurdle rate on this forecast, the manager should reject the project outright.",
      conclusions
    );
    expect(wrong.ok).toBe(false);

    const right = conclusionDim(
      "Because the project return beats the hurdle rate on this forecast, the manager should accept the project.",
      conclusions
    );
    expect(right.ok).toBe(true);
  });

  it("requires ALL expected conclusions to be supported", () => {
    const two: ExpectedConclusionSpec[] = [
      { id: "a", anyOf: ["higher roi"], noneOf: [] },
      { id: "b", anyOf: ["higher residual income"], noneOf: [] },
    ];
    const onlyOne = conclusionDim(
      "Division B posts the higher roi on this forecast, which is what the project analysis highlights for management.",
      two
    );
    expect(onlyOne.ok).toBe(false); // second conclusion unsupported
  });
});
