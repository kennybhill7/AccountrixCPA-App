import { describe, it, expect } from "vitest";
import { KEYSTROKES, lookup, bySkill } from "../../lib/calculatorKeystrokes";

describe("calculatorKeystrokes", () => {
  it("every entry has a unique id, skills, >=2 steps, and notes", () => {
    const ids = new Set<string>();
    for (const e of KEYSTROKES) {
      expect(e.id.length).toBeGreaterThan(0);
      expect(ids.has(e.id)).toBe(false);
      ids.add(e.id);
      expect(e.skills.length).toBeGreaterThan(0);
      expect(e.steps.length).toBeGreaterThanOrEqual(2);
      expect(e.notes.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("looks up by exact id", () => {
    const r = lookup("semiannual-bond");
    expect(r).toHaveLength(1);
    expect(r[0].skills).toContain("bond-valuation");
  });

  it("looks up by skill id", () => {
    const r = lookup("tvm");
    expect(r.length).toBeGreaterThan(1);
    expect(r.every((e) => e.skills.includes("tvm"))).toBe(true);
  });

  it("looks up by topic substring", () => {
    const r = lookup("annuity due");
    expect(r.some((e) => e.id === "annuity-due-bgn")).toBe(true);
  });

  it("bySkill returns only matching entries", () => {
    expect(bySkill("capital-budgeting").map((e) => e.id)).toEqual(["npv-irr"]);
  });

  it("returns empty for no match or empty query", () => {
    expect(lookup("")).toEqual([]);
    expect(lookup("xyzzy")).toEqual([]);
  });

  it("the BGN entry reminds you to reset to END", () => {
    const due = lookup("annuity-due-bgn")[0];
    expect(due.notes.join(" ").toLowerCase()).toContain("end");
  });
});
