import { describe, expect, it } from "vitest";
import {
  conceptsCovered,
  gradeNarrativeText,
  isProse,
  type ConceptSpec,
} from "@/lib/narrativeGrading";

const CONCEPTS: ConceptSpec[] = [
  { id: "dscr", anyOf: ["dscr", "debt service coverage"] },
  { id: "covenant", anyOf: ["covenant"] },
  { id: "headroom", anyOf: ["headroom", "cushion"] },
];

describe("conceptsCovered — distinct, synonym-aware", () => {
  it("counts each concept once regardless of repetition", () => {
    expect(conceptsCovered("dscr dscr dscr", CONCEPTS)).toBe(1);
  });

  it("matches any alternate of a concept", () => {
    expect(conceptsCovered("the debt service coverage cushion is thin", CONCEPTS)).toBe(2);
  });
});

describe("isProse — anti-stuffing gate", () => {
  it("rejects a keyword dump (low unique ratio, no function words)", () => {
    expect(isProse("covenant dscr headroom covenant dscr headroom covenant dscr headroom").ok).toBe(
      false
    );
  });

  it("rejects a bare list of distinct terms (no connective prose)", () => {
    expect(isProse("covenant dscr headroom cushion tolerable misstatement projected").ok).toBe(false);
  });

  it("accepts a genuine sentence", () => {
    expect(
      isProse(
        "The DSCR is 3.22x against the 1.25x covenant, so the headroom is strong and I would not draw on the revolver."
      ).ok
    ).toBe(true);
  });
});

describe("gradeNarrativeText — the gaming attack fails, real prose passes", () => {
  const input = { concepts: CONCEPTS, minWords: 25 };

  it("FAILS a keyword-stuffed answer even though coverage is 100%", () => {
    const r = gradeNarrativeText(
      "covenant dscr headroom covenant dscr headroom covenant dscr headroom covenant dscr headroom",
      input
    );
    expect(r.dimensions.find((d) => d.name === "coverage")!.ok).toBe(true); // all concepts "present"
    expect(r.dimensions.find((d) => d.name === "prose")!.ok).toBe(false); // but it's a dump
    expect(r.passed).toBe(false); // prose is a mandatory gate
  });

  it("FAILS a bare comma list of the concepts", () => {
    const r = gradeNarrativeText("covenant, dscr, headroom, cushion, coverage, ratio", input);
    expect(r.passed).toBe(false);
  });

  it("PASSES a substantive on-topic paragraph with numbers and a recommendation", () => {
    const r = gradeNarrativeText(
      "The DSCR of 3.22x is well above the 1.25x covenant, so there is meaningful headroom. " +
        "Because the trough week still clears the minimum, I recommend that we do not draw on the revolver " +
        "and instead schedule a follow-up review of the debt balance at the next close.",
      input
    );
    expect(r.passed).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(4);
  });

  it("FAILS a fluent but off-topic paragraph (covers no concepts)", () => {
    const r = gradeNarrativeText(
      "I spent the weekend reorganizing my desk and thinking about how the weather has been unusually mild " +
        "for this time of year, which made it pleasant to take a long walk around the neighborhood.",
      input
    );
    expect(r.dimensions.find((d) => d.name === "prose")!.ok).toBe(true);
    expect(r.dimensions.find((d) => d.name === "coverage")!.ok).toBe(false);
    expect(r.passed).toBe(false); // coverage is also a mandatory gate
  });

  it("still works with the legacy flat keyword list", () => {
    const r = gradeNarrativeText(
      "The receivables balance ties to the trial balance and I reconciled the account before concluding.",
      { keywords: ["ties", "reconcile", "account"], minWords: 10 }
    );
    expect(r.dimensions.find((d) => d.name === "coverage")!.ok).toBe(true);
  });
});
