import { describe, expect, it } from "vitest";
import { lessonHrefForContentId, trackForContentId } from "@/lib/trackForContentId";

describe("trackForContentId", () => {
  it("maps CMA month ids", () => {
    expect(trackForContentId("m1")).toBe("cma");
    expect(trackForContentId("m12")).toBe("cma");
  });

  it("maps finance unit ids (finance-, not fin-)", () => {
    expect(trackForContentId("finance-u1")).toBe("finance");
    expect(trackForContentId("finance-u3")).toBe("finance");
  });

  it("maps every CPA section unit id", () => {
    for (const id of ["far-u1", "aud-u3", "reg-u4", "bar-u2", "isc-u1", "tcp-u2"]) {
      expect(trackForContentId(id)).toBe("cpa");
    }
  });

  it("does not misroute ids that merely start with m", () => {
    // A hypothetical "misc-u1" CPA unit must not be treated as a CMA month.
    expect(trackForContentId("misc-u1")).toBe("cpa");
  });

  it("defaults to cma for missing ids (the /flashcards all-decks surface)", () => {
    expect(trackForContentId(undefined)).toBe("cma");
    expect(trackForContentId(null)).toBe("cma");
    expect(trackForContentId("")).toBe("cma");
  });
});

describe("lessonHrefForContentId", () => {
  it("routes each track to its lesson base path", () => {
    expect(lessonHrefForContentId("m4", "w2")).toBe("/learn/m4/w2");
    expect(lessonHrefForContentId("finance-u2", "w1")).toBe("/finance/finance-u2/w1");
    expect(lessonHrefForContentId("far-u1", "w3")).toBe("/cpa/far-u1/w3");
  });
});
