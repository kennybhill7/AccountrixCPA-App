import { describe, expect, it } from "vitest";
import { filterFormulas, countEntries, type FormulaGroup } from "@/lib/reference";
import catalog from "@/data/reference/formulas.json";

const GROUPS = catalog.groups as FormulaGroup[];

describe("filterFormulas", () => {
  it("returns the whole catalog for an empty query", () => {
    expect(filterFormulas(GROUPS, "")).toBe(GROUPS);
    expect(filterFormulas(GROUPS, "   ")).toBe(GROUPS);
  });

  it("keeps an entire group when the group label matches", () => {
    const r = filterFormulas(GROUPS, "finance");
    expect(r.some((g) => g.id === "finance")).toBe(true);
    const fin = r.find((g) => g.id === "finance")!;
    // label match keeps all entries
    expect(fin.entries.length).toBe(GROUPS.find((g) => g.id === "finance")!.entries.length);
  });

  it("narrows to matching entries when only entries match", () => {
    const r = filterFormulas(GROUPS, "goodwill");
    const total = countEntries(r);
    expect(total).toBeGreaterThan(0);
    // every surviving entry mentions the query somewhere
    for (const g of r) {
      for (const e of g.entries) {
        const hay = `${e.name} ${e.formula} ${e.note ?? ""}`.toLowerCase();
        expect(hay.includes("goodwill")).toBe(true);
      }
    }
  });

  it("is case-insensitive and searches formula text", () => {
    const r = filterFormulas(GROUPS, "WACC");
    expect(countEntries(r)).toBeGreaterThan(0);
  });

  it("returns nothing for a non-existent term", () => {
    expect(filterFormulas(GROUPS, "zzzznotarealformula")).toHaveLength(0);
  });
});

describe("reference catalog integrity", () => {
  it("every entry has a name and a formula", () => {
    for (const g of GROUPS) {
      expect(g.id).toBeTruthy();
      expect(g.label).toBeTruthy();
      expect(g.entries.length).toBeGreaterThan(0);
      for (const e of g.entries) {
        expect(e.name.length).toBeGreaterThan(0);
        expect(e.formula.length).toBeGreaterThan(0);
      }
    }
  });

  it("group ids are unique", () => {
    const ids = GROUPS.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
