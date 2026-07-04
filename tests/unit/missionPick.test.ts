import { describe, it, expect } from "vitest";
import { pickNext, reviewLabel, LANE_TO_TRACK, type PickNextContext } from "@/lib/missionPick";
import { LANES } from "@/lib/missionControl";

const emptyCtx: PickNextContext = { weakestByTrack: {}, dueCount: 0 };

describe("pickNext", () => {
  it("falls back to the canned guidance strings when no data exists", () => {
    expect(pickNext("cma", emptyCtx)).toBe(
      "Continue CMA lessons, then close with one Apply Lab workflow."
    );
    expect(pickNext("cpa", emptyCtx)).toBe(
      "Continue CPA lessons and write down every missed-rule reason."
    );
    expect(pickNext("finance", emptyCtx)).toBe(
      "Work corporate-finance problems before reading explanations."
    );
    expect(pickNext("cfo", emptyCtx)).toBe(
      "Complete one fictional case workflow like a controller deliverable."
    );
  });

  it("returns a concrete weakest-skill drill label when evidence exists", () => {
    const ctx: PickNextContext = {
      weakestByTrack: { cma: { skill: "wip-schedule", href: "/learn/m4/w2" } },
      dueCount: 0,
    };
    expect(pickNext("cma", ctx)).toBe("Drill your weakest skill: wip-schedule");
    // other lanes still fall back
    expect(pickNext("cpa", ctx)).toBe(
      "Continue CPA lessons and write down every missed-rule reason."
    );
  });

  it("maps the cfo lane onto the apply track", () => {
    const ctx: PickNextContext = {
      weakestByTrack: { apply: { skill: "ar-aging" } },
      dueCount: 3,
    };
    expect(LANE_TO_TRACK.cfo).toBe("apply");
    expect(pickNext("cfo", ctx)).toBe("Drill your weakest skill: ar-aging");
  });

  it("covers every mission lane", () => {
    for (const lane of LANES) {
      expect(pickNext(lane, emptyCtx)).toBeTruthy();
    }
  });
});

describe("reviewLabel", () => {
  it("shows the live due count when items are due", () => {
    expect(reviewLabel(7)).toBe("7 items due");
    expect(reviewLabel(1)).toBe("1 item due");
  });

  it("falls back to the generic review label at zero due", () => {
    expect(reviewLabel(0)).toBe("Review — missed items / flashcards");
  });
});
