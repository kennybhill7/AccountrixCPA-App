/**
 * Formula reference types + a pure, tested search filter shared by the
 * /reference page. Kept out of the component so the matching logic is unit
 * testable.
 */

export interface FormulaEntry {
  name: string;
  formula: string;
  note?: string;
}

export interface FormulaGroup {
  id: string;
  label: string;
  entries: FormulaEntry[];
}

/**
 * Case-insensitive filter over a formula catalog. A group is kept if its label
 * matches, or with only the entries that match name/formula/note. Empty query
 * returns the catalog unchanged.
 */
export function filterFormulas(groups: FormulaGroup[], query: string): FormulaGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  const out: FormulaGroup[] = [];
  for (const group of groups) {
    if (group.label.toLowerCase().includes(q)) {
      out.push(group);
      continue;
    }
    const entries = group.entries.filter((e) =>
      [e.name, e.formula, e.note ?? ""].some((f) => f.toLowerCase().includes(q))
    );
    if (entries.length > 0) out.push({ ...group, entries });
  }
  return out;
}

export function countEntries(groups: FormulaGroup[]): number {
  return groups.reduce((n, g) => n + g.entries.length, 0);
}
