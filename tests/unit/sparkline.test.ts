import { describe, expect, it } from "vitest";
import { sparklinePoints } from "@/components/Sparkline";

describe("sparklinePoints", () => {
  it("returns empty for fewer than two points", () => {
    expect(sparklinePoints([], 100, 20)).toBe("");
    expect(sparklinePoints([5], 100, 20)).toBe("");
  });

  it("maps first and last points to the horizontal extremes", () => {
    const pts = sparklinePoints([0, 50, 100], 100, 20).split(" ");
    expect(pts[0].startsWith("0.0,")).toBe(true);
    expect(pts[pts.length - 1].startsWith("100.0,")).toBe(true);
  });

  it("puts the max at the top (y=0) and the min at the bottom (y=height)", () => {
    // rising series: last value is the max → y=0; first is the min → y=height
    const [first, , last] = sparklinePoints([10, 20, 30], 90, 24).split(" ");
    expect(first.endsWith(",24.0")).toBe(true);
    expect(last.endsWith(",0.0")).toBe(true);
  });

  it("handles a flat series without dividing by zero", () => {
    const pts = sparklinePoints([42, 42, 42], 60, 20);
    expect(pts).not.toContain("NaN");
    expect(pts).not.toContain("Infinity");
  });
});
