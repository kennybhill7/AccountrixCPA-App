import { describe, expect, it } from "vitest";
import { coerceCurriculumShape } from "@/lib/content-loader";

/**
 * The schema-invalid fall-through in loadCurriculum previously returned data
 * raw, so a month missing its `weeks` array would crash every downstream route
 * that does month.weeks.map/find. coerceCurriculumShape repairs the shape.
 */

describe("coerceCurriculumShape", () => {
  it("guarantees every month has a weeks array", () => {
    const out = coerceCurriculumShape({
      m1: { title: "ok", weeks: [{ id: "w1" }] },
      m7: { title: "partial" }, // no weeks
      m8: { title: "bad weeks", weeks: "nope" },
    });
    expect(Array.isArray(out.m1.weeks)).toBe(true);
    expect(out.m1.weeks).toHaveLength(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Array.isArray((out as any).m7.weeks)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((out as any).m7.weeks).toHaveLength(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(Array.isArray((out as any).m8.weeks)).toBe(true);
  });

  it("downstream week iteration cannot throw after coercion", () => {
    const out = coerceCurriculumShape({ m7: { title: "partial" } });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => Object.values(out).forEach((m: any) => m.weeks.map((w: any) => w))).not.toThrow();
  });

  it("returns an empty curriculum for non-object input", () => {
    expect(coerceCurriculumShape(null)).toEqual({});
    expect(coerceCurriculumShape("nope")).toEqual({});
    expect(coerceCurriculumShape([1, 2, 3])).toEqual({});
  });
});
