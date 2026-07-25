import { describe, it, expect } from "vitest";
import { GENERATORS } from "@/lib/parametric";
import { instanceToMcq, formatValue } from "@/lib/parametricMcq";

const genIds = Object.keys(GENERATORS);

describe("instanceToMcq", () => {
  it("produces exactly 4 distinct choices for every generator across many seeds", () => {
    for (const id of genIds) {
      for (let seed = 1; seed <= 25; seed++) {
        const inst = GENERATORS[id](seed);
        const mcq = instanceToMcq(inst);
        expect(mcq.choices.length, `${id}#${seed} choice count`).toBe(4);
        const unique = new Set(mcq.choices);
        expect(unique.size, `${id}#${seed} distinct choices`).toBe(4);
      }
    }
  });

  it("marks the correct choice as the generator's verified answer", () => {
    for (const id of genIds) {
      for (let seed = 1; seed <= 25; seed++) {
        const inst = GENERATORS[id](seed);
        const mcq = instanceToMcq(inst);
        expect(mcq.answer, `${id}#${seed} answer index`).toBeGreaterThanOrEqual(0);
        expect(mcq.answer).toBeLessThan(4);
        expect(mcq.choices[mcq.answer], `${id}#${seed} correct label`).toBe(
          formatValue(inst.answer, inst.unit)
        );
      }
    }
  });

  it("is deterministic for a given instance", () => {
    const inst = GENERATORS["wacc-basic"](7);
    const a = instanceToMcq(inst);
    const b = instanceToMcq(inst);
    expect(a).toEqual(b);
  });

  it("carries the stem, skills, and a stable id", () => {
    const inst = GENERATORS["npv-two-year"](3);
    const mcq = instanceToMcq(inst);
    expect(mcq.stem).toBe(inst.prompt);
    expect(mcq.skills).toEqual(inst.skills);
    expect(mcq.id).toBe(`pmcq:${inst.id}:${inst.seed}`);
  });
});

describe("formatValue", () => {
  it("formats by unit", () => {
    expect(formatValue(9.3, "%")).toBe("9.3%");
    expect(formatValue(1435.03, "$")).toBe("$1,435.03");
    expect(formatValue(1000, "$")).toBe("$1,000");
    expect(formatValue(12, "days")).toBe("12 days");
    expect(formatValue(1.5, "")).toBe("1.5");
  });
});
