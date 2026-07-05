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

  it("a NEGATED support phrase no longer counts as supporting the conclusion", () => {
    const conclusions: ExpectedConclusionSpec[] = [
      { id: "accept", anyOf: ["accept the project"], noneOf: [] },
    ];
    // "would not accept the project" must NOT be credited as support, even
    // though the substring "accept the project" is present.
    const d = conclusionDim(
      "Given the weak forecast, the manager would not accept the project and keeps the current plan.",
      conclusions
    );
    expect(d.ok).toBe(false);
  });

  it("handles contraction negators (doesn't) before a support phrase", () => {
    const conclusions: ExpectedConclusionSpec[] = [
      { id: "accept", anyOf: ["accept it"], noneOf: [] },
    ];
    // "doesn't accept it" is negated support → not credited.
    expect(
      conclusionDim("After weighing the forecast, the manager doesn't accept it for this project.", conclusions).ok
    ).toBe(false);
    // plain "accept it" is credited.
    expect(
      conclusionDim("After weighing the forecast, the manager will accept it for this project.", conclusions).ok
    ).toBe(true);
  });

  it("does not let a negator leak across a clause boundary", () => {
    // "not" belongs to the first clause; it must NOT negate "below the covenant".
    const conclusions: ExpectedConclusionSpec[] = [
      { id: "healthy", anyOf: ["strong headroom"], noneOf: ["below the covenant"] },
    ];
    const d = conclusionDim(
      "The forecast is not a concern; still, DSCR is below the covenant for this project so strong headroom is absent.",
      conclusions
    );
    // "below the covenant" is a real (unnegated) blocker here → contradiction.
    expect(d.ok).toBe(false);
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
