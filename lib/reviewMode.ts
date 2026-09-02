/**
 * Review Mode — the defect-seeding engine.
 *
 * Every other surface in this app tests whether the learner can PRODUCE an
 * answer. Real controller/CFO work is roughly 20% building and 80% reviewing:
 * someone hands you a finished, plausible, confidently-formatted workpaper and
 * you decide whether to sign it. Review Mode inverts the exercise — it presents
 * a completed workpaper that is subtly WRONG (or, deliberately, correct) and
 * grades whether the reviewer caught it.
 *
 * ARCHITECTURE
 *   1. A workpaper is authored CLEAN and arithmetically correct: sections of
 *      rows, each row a set of per-column cells that are either inputs or
 *      DERIVED from a small formula vocabulary (sum / diff / product / ratio /
 *      pctOf / apportion / running).
 *   2. `recomputeSections` resolves every derived cell from its formula by
 *      recursive resolution with cycle detection — never from its authored
 *      value. `verifyWorkpaper` then compares the recomputed clean numbers to
 *      the authored ones, which is how the seed data's arithmetic is proven.
 *   3. A DEFECT is not a hand-typed corrupted copy. It is a list of ops that
 *      overwrite specific cells (with a literal, or with a formula evaluated
 *      against the CLEAN data), after which every derived cell is recomputed.
 *      Downstream absurdity — a negative loan balance, an 88% margin — falls
 *      out of the recompute instead of being authored, so it cannot drift out
 *      of sync with the seeded root cause.
 *   4. `buildReviewCase(workpaper, seed)` picks one variant from the workpaper's
 *      pool by a deterministic hash of (workpaper id, seed). The same seed
 *      always yields the same defect. Every pool contains a `none` (clean)
 *      variant, so "everything here is broken" is not a winning strategy.
 *
 * GRADING is three separate levels (see `gradeReviewSubmission`):
 *   detection — did they conclude something is wrong (or correctly sign off)?
 *   location  — did they point at the root-cause cell (not just a symptom)?
 *   cause     — did they state WHY, graded by lib/narrativeGrading?
 * Finding without locating is partial credit; the three never collapse into one
 * number, because "something smells" and "here is the broken formula" are
 * different skills and a reviewer needs to know which one they lack.
 *
 * All seed data is FICTIONAL. No real company, person, bank, or dollar figure.
 */

import {
  gradeNarrativeText,
  type ConceptSpec,
  type ExpectedConclusionSpec,
  type NarrativeResult,
} from "@/lib/narrativeGrading";

import equipmentYardAllocation from "@/data/review/equipment-yard-allocation.json";
import landDevSourcesUses from "@/data/review/land-dev-sources-uses.json";
import wipPercentComplete from "@/data/review/wip-percent-complete.json";
import intercompanyClearing from "@/data/review/intercompany-clearing.json";
import jobMarginScope from "@/data/review/job-margin-scope.json";
import retainageRollforward from "@/data/review/retainage-rollforward.json";
import tbVarianceReview from "@/data/review/tb-variance-review.json";

// ---------------------------------------------------------------------------
// Defect library
// ---------------------------------------------------------------------------

export type DefectType =
  | "none"
  | "footing-break"
  | "wrong-range-summary"
  | "scope-mismatch"
  | "clearing-not-zero"
  | "pct-complete-on-revenue"
  | "non-cumulative-ending-balance"
  | "tb-zero-suppression"
  | "billings-reversed"
  | "retainage-double-count"
  | "hardcoded-arithmetic";

export interface DefectDefinition {
  label: string;
  /** what the reviewer is looking for */
  description: string;
  /** the generic review technique that catches this class */
  technique: string;
}

export const DEFECT_LIBRARY: Record<DefectType, DefectDefinition> = {
  none: {
    label: "No defect",
    description: "The workpaper is correct and supports sign-off.",
    technique: "Foot it, tie it, and sign it. Refusing to sign correct work is also a failure.",
  },
  "footing-break": {
    label: "Footing break",
    description: "An allocation's parts do not sum to the total being allocated.",
    technique: "Cross-foot every allocation: the sum of the pieces must equal the pool.",
  },
  "wrong-range-summary": {
    label: "Wrong-range summary",
    description: "A cell labeled as a grand total sums only a sub-block of the schedule.",
    technique: "Re-add the total by hand from the line items, never from the label.",
  },
  "scope-mismatch": {
    label: "Scope mismatch",
    description: "Full-scope revenue is compared against partial-scope cost.",
    technique: "Confirm the numerator and denominator cover the same scope and period.",
  },
  "clearing-not-zero": {
    label: "Clearing account does not net to zero",
    description: "A transfer/clearing account carries a residual balance across entities.",
    technique: "Sum a clearing account across every entity — it must net to 0.00.",
  },
  "pct-complete-on-revenue": {
    label: "Percent complete computed on revenue",
    description: "Percent complete was measured on billings/revenue instead of cost.",
    technique: "Percent complete = cost to date / estimated total cost. Never billings.",
  },
  "non-cumulative-ending-balance": {
    label: "Period activity presented as an ending balance",
    description: "An 'ending balance' column actually holds the period's movement only.",
    technique: "Roll the balance forward: prior balance + additions - reductions.",
  },
  "tb-zero-suppression": {
    label: "False-positive variance from a suppressed trial balance row",
    description:
      "Accounts with a zero prior-year balance are omitted from the TB export, so the missing row is read as an unexplained variance.",
    technique: "A missing prior-period row means a zero balance, not a difference to investigate.",
  },
  "billings-reversed": {
    label: "Over/under billing reversed",
    description: "Billed-to-date and earned revenue were subtracted in the wrong order.",
    technique: "Billed > earned = liability (overbilled). Earned > billed = asset (underbilled).",
  },
  "retainage-double-count": {
    label: "Retainage double-counted",
    description: "Retainage is both left inside a receivable balance and added again.",
    technique: "Tie the presented total back to the aging; retainage may appear exactly once.",
  },
  "hardcoded-arithmetic": {
    label: "Hardcoded number inside a formula",
    description: "A typed-in constant replaced a computed cell and ties to no source.",
    technique: "Every number must be traceable to an input or a formula. Plugs are defects.",
  },
};

// ---------------------------------------------------------------------------
// Workpaper shape
// ---------------------------------------------------------------------------

export type CellValue = number | string | null;

export interface ReviewColumn {
  id: string;
  label: string;
  /** "number" (default) right-aligns and formats; "text" renders as prose */
  kind?: "number" | "text";
  /** display decimals (default 2 for money, author-set for rates/percents) */
  decimals?: number;
  /** appended to the formatted value, e.g. "%" or " hrs" */
  suffix?: string;
  /** rendered with a $ prefix */
  currency?: boolean;
}

export type RowKind = "input" | "derived" | "subtotal" | "total" | "memo" | "check";

/**
 * Cell reference grammar (deliberately tiny and unambiguous):
 *   "row"              same section, same column
 *   "row@col"          same section, explicit column
 *   "sec:row"          other section, same column
 *   "sec:row@col"      other section, explicit column
 */
export type Ref = string;

export type RowFormula =
  /** SUM — nulls are skipped, exactly like a spreadsheet SUM over blanks */
  | { kind: "sum"; of: Ref[] }
  /** from - sum(less); a null `from` yields null */
  | { kind: "diff"; from: Ref; less: Ref[] }
  | { kind: "product"; of: Ref[] }
  /** numerator / denominator * (scale ?? 1); null when the denominator is 0/null */
  | { kind: "ratio"; numerator: Ref; denominator: Ref; scale?: number }
  /** base * pct / 100 */
  | { kind: "pctOf"; base: Ref; pct: Ref }
  /** pool * share / base — a pro-rata allocation */
  | { kind: "apportion"; pool: Ref; share: Ref; base: Ref }
  /** rollforward: this row's PRIOR-column value + adds - lesses */
  | { kind: "running"; add?: Ref[]; less?: Ref[]; opening?: Ref };

export interface ReviewRow {
  id: string;
  label: string;
  kind?: RowKind;
  /** authored values; derived cells are recomputed and the authored value is the arithmetic check */
  values: Record<string, CellValue>;
  /** per-column formulas — a column with a formula is a derived cell */
  formulas?: Record<string, RowFormula>;
  /** per-column provenance shown to the reviewer, e.g. "=SUM(soft costs)" */
  notes?: Record<string, string>;
  /** indentation level for presentation */
  indent?: number;
}

export interface ReviewSection {
  id: string;
  title: string;
  columns: ReviewColumn[];
  rows: ReviewRow[];
  footnote?: string;
}

export interface DefectOp {
  /** the cell this op overwrites */
  cell: Ref;
  /** literal replacement value */
  value?: CellValue;
  /** replacement computed from the CLEAN workpaper (order-independent) */
  formula?: RowFormula;
  /** replacement provenance note shown in the corrupted workpaper */
  note?: string;
}

export interface DefectCauseRubric {
  concepts?: ConceptSpec[];
  conclusions?: ExpectedConclusionSpec[];
  minWords?: number;
}

export interface ReviewVariant {
  id: string;
  type: DefectType;
  /** the one cell a reviewer must point at; "" for a clean variant */
  rootCell: Ref;
  /** other cells accepted as "located" (e.g. the row that fails to foot) */
  acceptedCells?: string[];
  ops?: DefectOp[];
  cause?: DefectCauseRubric;
  /** model answer revealed after grading */
  causeSummary: string;
  /** the specific tell that should have caught it */
  tell: string;
}

export interface ReviewWorkpaper {
  id: string;
  title: string;
  company: string;
  period: string;
  preparedBy: string;
  purpose: string;
  /** what the preparer is asking the reviewer to sign */
  assertion: string;
  skills: string[];
  difficulty: "core" | "stretch";
  sections: ReviewSection[];
  variants: ReviewVariant[];
}

// ---------------------------------------------------------------------------
// Ref parsing + evaluation
// ---------------------------------------------------------------------------

const REF_RE = /^(?:([A-Za-z0-9_-]+):)?([A-Za-z0-9_-]+)(?:@([A-Za-z0-9_-]+))?$/;

export interface ParsedRef {
  sectionId: string | null;
  rowId: string;
  columnId: string | null;
}

export function parseRef(ref: Ref): ParsedRef {
  const m = REF_RE.exec(ref.trim());
  if (!m) throw new Error(`reviewMode: malformed cell ref "${ref}"`);
  return { sectionId: m[1] ?? null, rowId: m[2], columnId: m[3] ?? null };
}

/** Canonical "section/row/column" key used for selection, diffs and grading. */
export function cellKey(sectionId: string, rowId: string, columnId: string): string {
  return `${sectionId}/${rowId}/${columnId}`;
}

/** Resolve a possibly-shorthand ref against the cell that referenced it. */
export function resolveRef(ref: Ref, ctxSectionId: string, ctxColumnId: string): string {
  const p = parseRef(ref);
  return cellKey(p.sectionId ?? ctxSectionId, p.rowId, p.columnId ?? ctxColumnId);
}

/**
 * Kill float noise (0.1+0.2 style) without rounding away real precision.
 * 10dp, not 2dp: intermediate rounding is itself a defect — a percent complete
 * rounded to 2dp and multiplied by a contract price leaves a phantom over/under
 * billing of a few hundred dollars.
 */
function roundFloat(n: number): number {
  return Math.round(n * 1e10) / 1e10;
}

function asNumber(v: CellValue): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

interface EvalContext {
  byRow: Map<string, { section: ReviewSection; row: ReviewRow }>;
  memo: Map<string, CellValue>;
  visiting: Set<string>;
  /** cells pinned to their authored/seeded value — formulas do not run on them */
  overrides: Set<string>;
}

function indexSections(
  sections: ReviewSection[]
): Map<string, { section: ReviewSection; row: ReviewRow }> {
  const byRow = new Map<string, { section: ReviewSection; row: ReviewRow }>();
  for (const section of sections) {
    for (const row of section.rows) {
      byRow.set(`${section.id}/${row.id}`, { section, row });
    }
  }
  return byRow;
}

function resolveCell(
  sectionId: string,
  rowId: string,
  columnId: string,
  ctx: EvalContext
): CellValue {
  const key = cellKey(sectionId, rowId, columnId);
  const memo = ctx.memo.get(key);
  if (memo !== undefined) return memo;
  if (ctx.visiting.has(key)) {
    throw new Error(`reviewMode: circular reference at ${key}`);
  }
  const hit = ctx.byRow.get(`${sectionId}/${rowId}`);
  if (!hit) throw new Error(`reviewMode: unknown row "${sectionId}/${rowId}"`);
  const { section, row } = hit;

  const formula = row.formulas?.[columnId];
  if (!formula || ctx.overrides.has(key)) {
    const raw = row.values[columnId];
    const value = raw === undefined ? null : raw;
    ctx.memo.set(key, value);
    return value;
  }

  ctx.visiting.add(key);
  let value: CellValue;
  try {
    value = evaluateFormula(formula, section, row, columnId, ctx);
  } finally {
    ctx.visiting.delete(key);
  }
  ctx.memo.set(key, value);
  return value;
}

function get(ref: Ref, section: ReviewSection, columnId: string, ctx: EvalContext): CellValue {
  const p = parseRef(ref);
  return resolveCell(p.sectionId ?? section.id, p.rowId, p.columnId ?? columnId, ctx);
}

function evaluateFormula(
  formula: RowFormula,
  section: ReviewSection,
  row: ReviewRow,
  columnId: string,
  ctx: EvalContext
): CellValue {
  const num = (ref: Ref) => asNumber(get(ref, section, columnId, ctx));

  switch (formula.kind) {
    case "sum": {
      // SUM skips blanks, as a spreadsheet does. A suppressed (null) row must
      // not poison a total — that behaviour is itself part of defect #7.
      let total = 0;
      for (const ref of formula.of) {
        const v = num(ref);
        if (v !== null) total += v;
      }
      return roundFloat(total);
    }
    case "diff": {
      const from = num(formula.from);
      if (from === null) return null;
      let total = from;
      for (const ref of formula.less) {
        const v = num(ref);
        if (v !== null) total -= v;
      }
      return roundFloat(total);
    }
    case "product": {
      let total = 1;
      for (const ref of formula.of) {
        const v = num(ref);
        if (v === null) return null;
        total *= v;
      }
      return roundFloat(total);
    }
    case "ratio": {
      const n = num(formula.numerator);
      const d = num(formula.denominator);
      if (n === null || d === null || d === 0) return null;
      return roundFloat((n / d) * (formula.scale ?? 1));
    }
    case "pctOf": {
      const base = num(formula.base);
      const pct = num(formula.pct);
      if (base === null || pct === null) return null;
      return roundFloat((base * pct) / 100);
    }
    case "apportion": {
      const pool = num(formula.pool);
      const share = num(formula.share);
      const base = num(formula.base);
      if (pool === null || share === null || base === null || base === 0) return null;
      return roundFloat((pool * share) / base);
    }
    case "running": {
      const colIdx = section.columns.findIndex((c) => c.id === columnId);
      let opening = 0;
      if (colIdx > 0) {
        const prior = asNumber(
          resolveCell(section.id, row.id, section.columns[colIdx - 1].id, ctx)
        );
        opening = prior ?? 0;
      } else if (formula.opening) {
        opening = num(formula.opening) ?? 0;
      }
      let total = opening;
      for (const ref of formula.add ?? []) total += num(ref) ?? 0;
      for (const ref of formula.less ?? []) total -= num(ref) ?? 0;
      return roundFloat(total);
    }
    default: {
      const exhaustive: never = formula;
      throw new Error(`reviewMode: unknown formula ${JSON.stringify(exhaustive)}`);
    }
  }
}

function cloneSections(sections: ReviewSection[]): ReviewSection[] {
  return sections.map((section) => ({
    ...section,
    columns: section.columns.map((c) => ({ ...c })),
    rows: section.rows.map((r) => ({
      ...r,
      values: { ...r.values },
      formulas: r.formulas ? { ...r.formulas } : undefined,
      notes: r.notes ? { ...r.notes } : undefined,
    })),
  }));
}

/**
 * Resolve every derived cell from its formula and write the result back.
 * Cells listed in `overrides` keep their authored value (that is how a seeded
 * defect survives the recompute while everything downstream of it moves).
 */
export function recomputeSections(
  sections: ReviewSection[],
  overrides: Set<string> = new Set()
): ReviewSection[] {
  const next = cloneSections(sections);
  const ctx: EvalContext = {
    byRow: indexSections(next),
    memo: new Map(),
    visiting: new Set(),
    overrides,
  };
  for (const section of next) {
    for (const row of section.rows) {
      if (!row.formulas) continue;
      for (const columnId of Object.keys(row.formulas)) {
        row.values[columnId] = resolveCell(section.id, row.id, columnId, ctx);
      }
    }
  }
  return next;
}

// ---------------------------------------------------------------------------
// Defect seeding
// ---------------------------------------------------------------------------

/** Deterministic 32-bit FNV-1a — the whole variant pick hinges on this. */
export function hashSeed(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export interface ChangedCell {
  key: string;
  sectionTitle: string;
  rowLabel: string;
  columnLabel: string;
  cleanValue: CellValue;
  shownValue: CellValue;
  /** true for the seeded root cause; false for a downstream consequence */
  isRoot: boolean;
}

export interface ReviewCase {
  workpaperId: string;
  title: string;
  company: string;
  period: string;
  preparedBy: string;
  purpose: string;
  assertion: string;
  skills: string[];
  seed: number;
  variant: ReviewVariant;
  isClean: boolean;
  /** what the reviewer sees */
  sections: ReviewSection[];
  /** the correct workpaper, revealed after grading */
  cleanSections: ReviewSection[];
  /** root cause first, then downstream consequences */
  changedCells: ChangedCell[];
  /** cells accepted as a correct location answer */
  acceptedCells: string[];
}

function labelFor(sections: ReviewSection[], key: string) {
  const [sectionId, rowId, columnId] = key.split("/");
  const section = sections.find((s) => s.id === sectionId);
  const row = section?.rows.find((r) => r.id === rowId);
  const column = section?.columns.find((c) => c.id === columnId);
  return {
    sectionTitle: section?.title ?? sectionId,
    rowLabel: row?.label ?? rowId,
    columnLabel: column?.label ?? columnId,
  };
}

/**
 * Build the corrupted workpaper from the clean one.
 *
 * Op replacement values are evaluated against the CLEAN, fully-recomputed
 * workpaper, so a defect never depends on the order its ops are applied — and a
 * defect authored as "sum the wrong range" stays tied to the real line items
 * rather than to a hand-typed constant.
 */
export function applyVariant(
  workpaper: ReviewWorkpaper,
  variant: ReviewVariant
): { sections: ReviewSection[]; cleanSections: ReviewSection[]; changedCells: ChangedCell[] } {
  const cleanSections = recomputeSections(workpaper.sections);
  if (variant.type === "none" || !variant.ops || variant.ops.length === 0) {
    return { sections: cleanSections, cleanSections, changedCells: [] };
  }

  // Evaluate every op's replacement against the clean workpaper first.
  const cleanCtx: EvalContext = {
    byRow: indexSections(cleanSections),
    memo: new Map(),
    visiting: new Set(),
    overrides: new Set(),
  };

  const seeded = cloneSections(workpaper.sections);
  const seededIndex = indexSections(seeded);
  const overrides = new Set<string>();
  const rootKeys: string[] = [];

  for (const op of variant.ops) {
    const p = parseRef(op.cell);
    if (!p.sectionId || !p.columnId) {
      throw new Error(
        `reviewMode: defect op needs a full "section:row@column" ref, got "${op.cell}"`
      );
    }
    const hit = seededIndex.get(`${p.sectionId}/${p.rowId}`);
    if (!hit) throw new Error(`reviewMode: defect op targets unknown row "${op.cell}"`);
    const key = cellKey(p.sectionId, p.rowId, p.columnId);

    let replacement: CellValue;
    if (op.formula) {
      replacement = evaluateFormula(op.formula, hit.section, hit.row, p.columnId, cleanCtx);
    } else if (op.value !== undefined) {
      replacement = op.value;
    } else {
      replacement = hit.row.values[p.columnId] ?? null;
    }

    hit.row.values[p.columnId] = replacement;
    if (op.note !== undefined) {
      hit.row.notes = { ...(hit.row.notes ?? {}), [p.columnId]: op.note };
    }
    overrides.add(key);
    rootKeys.push(key);
  }

  const sections = recomputeSections(seeded, overrides);

  // Diff clean vs seeded across every cell: the ops are the root cause, and
  // anything else that moved is a downstream consequence of the recompute.
  const changedCells: ChangedCell[] = [];
  for (const section of sections) {
    for (const row of section.rows) {
      for (const column of section.columns) {
        const key = cellKey(section.id, row.id, column.id);
        const cleanRow = cleanSections
          .find((s) => s.id === section.id)
          ?.rows.find((r) => r.id === row.id);
        const cleanValue = cleanRow?.values[column.id] ?? null;
        const shownValue = row.values[column.id] ?? null;
        if (cleanValue === shownValue) continue;
        changedCells.push({
          key,
          ...labelFor(sections, key),
          cleanValue,
          shownValue,
          isRoot: rootKeys.includes(key),
        });
      }
    }
  }
  changedCells.sort((a, b) => Number(b.isRoot) - Number(a.isRoot) || a.key.localeCompare(b.key));

  return { sections, cleanSections, changedCells };
}

/**
 * Deterministic variant pick: the same (workpaper, seed) always yields the same
 * defect — or the same clean paper. Seeds are exposed in the URL so a learner
 * can share or replay an exact case.
 */
export function pickVariant(workpaper: ReviewWorkpaper, seed: number): ReviewVariant {
  if (workpaper.variants.length === 0) {
    throw new Error(`reviewMode: workpaper "${workpaper.id}" has no variants`);
  }
  const index = hashSeed(`${workpaper.id}#${seed}`) % workpaper.variants.length;
  return workpaper.variants[index];
}

export function buildReviewCase(workpaper: ReviewWorkpaper, seed: number): ReviewCase {
  const variant = pickVariant(workpaper, seed);
  const { sections, cleanSections, changedCells } = applyVariant(workpaper, variant);
  const rootKey = variant.rootCell ? resolveRef(variant.rootCell, "", "") : "";
  const acceptedCells =
    variant.type === "none" ? [] : [rootKey, ...(variant.acceptedCells ?? [])].filter(Boolean);

  return {
    workpaperId: workpaper.id,
    title: workpaper.title,
    company: workpaper.company,
    period: workpaper.period,
    preparedBy: workpaper.preparedBy,
    purpose: workpaper.purpose,
    assertion: workpaper.assertion,
    skills: workpaper.skills,
    seed,
    variant,
    isClean: variant.type === "none",
    sections,
    cleanSections,
    changedCells,
    acceptedCells,
  };
}

// ---------------------------------------------------------------------------
// Grading — three separately-scored levels
// ---------------------------------------------------------------------------

export type ReviewVerdict = "sign-off" | "exception";
export type ReviewLevel = "detection" | "location" | "cause";

export interface ReviewSubmission {
  verdict: ReviewVerdict;
  /** canonical "section/row/column" key of the cell the reviewer flagged */
  selectedCell?: string | null;
  /** the reviewer's written explanation of the cause */
  cause?: string;
}

export interface ReviewLevelResult {
  level: ReviewLevel;
  /** false when the level does not apply (clean papers have nothing to locate) */
  applicable: boolean;
  ok: boolean;
  points: number;
  max: number;
  detail: string;
}

export interface ReviewGrade {
  levels: ReviewLevelResult[];
  score: number;
  max: number;
  /** every applicable level passed */
  passed: boolean;
  /** detection passed but location and/or cause did not */
  partial: boolean;
  /** the reviewer flagged a downstream consequence instead of the root cause */
  flaggedSymptom: boolean;
  headline: string;
  narrative?: NarrativeResult;
}

const SIGN_OFF_HEADLINE = "Signed off on correct work — that is the other half of the job.";

export function gradeReviewSubmission(
  reviewCase: ReviewCase,
  submission: ReviewSubmission
): ReviewGrade {
  const levels: ReviewLevelResult[] = [];
  let narrative: NarrativeResult | undefined;
  let flaggedSymptom = false;

  if (reviewCase.isClean) {
    const ok = submission.verdict === "sign-off";
    levels.push({
      level: "detection",
      applicable: true,
      ok,
      points: ok ? 1 : 0,
      max: 1,
      detail: ok
        ? "Correctly signed off — this workpaper has no defect."
        : "False positive: this workpaper is correct and should have been signed.",
    });
    levels.push({
      level: "location",
      applicable: false,
      ok: false,
      points: 0,
      max: 0,
      detail: "Not applicable — nothing to locate.",
    });
    levels.push({
      level: "cause",
      applicable: false,
      ok: false,
      points: 0,
      max: 0,
      detail: "Not applicable — nothing to explain.",
    });
    const score = levels.reduce((s, l) => s + l.points, 0);
    return {
      levels,
      score,
      max: 1,
      passed: ok,
      partial: false,
      flaggedSymptom: false,
      headline: ok ? SIGN_OFF_HEADLINE : "Raised an exception on a clean workpaper.",
      narrative: undefined,
    };
  }

  const detected = submission.verdict === "exception";
  levels.push({
    level: "detection",
    applicable: true,
    ok: detected,
    points: detected ? 1 : 0,
    max: 1,
    detail: detected
      ? "Caught that the workpaper is not signable."
      : "Signed off on a defective workpaper.",
  });

  const selected = submission.selectedCell ?? null;
  const located = detected && !!selected && reviewCase.acceptedCells.includes(selected);
  if (!located && detected && selected) {
    flaggedSymptom = reviewCase.changedCells.some((c) => c.key === selected);
  }
  levels.push({
    level: "location",
    applicable: true,
    ok: located,
    points: located ? 1 : 0,
    max: 1,
    detail: located
      ? "Pointed at the root-cause cell."
      : !detected
        ? "No cell flagged — the workpaper was signed."
        : !selected
          ? "No cell flagged. Knowing something is wrong is not the same as finding it."
          : flaggedSymptom
            ? "That cell is a downstream consequence, not the source. Trace it back one more step."
            : "That cell is correct as presented.",
  });

  const causeText = (submission.cause ?? "").trim();
  if (detected && causeText) {
    narrative = gradeNarrativeText(causeText, {
      concepts: reviewCase.variant.cause?.concepts,
      conclusions: reviewCase.variant.cause?.conclusions,
      minWords: reviewCase.variant.cause?.minWords ?? 25,
    });
  }
  const causeOk = !!narrative?.passed;
  levels.push({
    level: "cause",
    applicable: true,
    ok: causeOk,
    points: causeOk ? 1 : 0,
    max: 1,
    detail: causeOk
      ? "Stated the cause, not just the symptom."
      : !detected
        ? "No explanation — the workpaper was signed."
        : !causeText
          ? "No explanation written."
          : `Explanation incomplete: ${narrative?.message ?? "unscored"}`,
  });

  const score = levels.reduce((s, l) => s + l.points, 0);
  const passed = levels.every((l) => !l.applicable || l.ok);
  return {
    levels,
    score,
    max: 3,
    passed,
    partial: detected && !passed,
    flaggedSymptom,
    headline: passed
      ? "Full review credit: found it, located it, and explained it."
      : detected
        ? flaggedSymptom
          ? "Found the smell and followed it to a symptom — not yet to the source."
          : "Caught that something is wrong — partial credit."
        : "Signed off on a defective workpaper.",
    narrative,
  };
}

// ---------------------------------------------------------------------------
// Authoring verification — the arithmetic gate for data/review/*.json
// ---------------------------------------------------------------------------

export interface VerificationProblem {
  workpaperId: string;
  where: string;
  message: string;
}

/**
 * Prove the seed data. For the clean workpaper: every derived cell's authored
 * value must equal what its own formula produces (this is what makes "the clean
 * version foots" a checked claim rather than an assertion). For every defect
 * variant: it must actually change the root cell, and the root cell must be
 * among the changed cells.
 */
export function verifyWorkpaper(
  workpaper: ReviewWorkpaper,
  tolerance = 0.005
): VerificationProblem[] {
  const problems: VerificationProblem[] = [];
  const push = (where: string, message: string) =>
    problems.push({ workpaperId: workpaper.id, where, message });

  let recomputed: ReviewSection[];
  try {
    recomputed = recomputeSections(workpaper.sections);
  } catch (err) {
    push("clean", (err as Error).message);
    return problems;
  }

  for (const section of workpaper.sections) {
    for (const row of section.rows) {
      if (!row.formulas) continue;
      for (const columnId of Object.keys(row.formulas)) {
        const authored = row.values[columnId];
        if (authored === undefined) {
          push(
            cellKey(section.id, row.id, columnId),
            "derived cell has no authored value to check"
          );
          continue;
        }
        const computed =
          recomputed.find((s) => s.id === section.id)?.rows.find((r) => r.id === row.id)?.values[
            columnId
          ] ?? null;
        if (typeof authored === "number" && typeof computed === "number") {
          if (Math.abs(authored - computed) > tolerance) {
            push(
              cellKey(section.id, row.id, columnId),
              `authored ${authored} != computed ${computed}`
            );
          }
        } else if (authored !== computed) {
          push(
            cellKey(section.id, row.id, columnId),
            `authored ${JSON.stringify(authored)} != computed ${JSON.stringify(computed)}`
          );
        }
      }
    }
  }

  const seenTypes = new Set<DefectType>();
  for (const variant of workpaper.variants) {
    if (seenTypes.has(variant.type)) {
      push(variant.id, `duplicate variant type "${variant.type}" in one workpaper`);
    }
    seenTypes.add(variant.type);

    let built: ReturnType<typeof applyVariant>;
    try {
      built = applyVariant(workpaper, variant);
    } catch (err) {
      push(variant.id, (err as Error).message);
      continue;
    }

    if (variant.type === "none") {
      // applyVariant short-circuits a clean variant, so an authoring mistake
      // (ops attached to the clean case) would otherwise pass silently.
      if (built.changedCells.length > 0 || (variant.ops?.length ?? 0) > 0) {
        push(variant.id, "clean variant must not change any cell");
      }
      if (variant.rootCell) push(variant.id, "clean variant must not name a root cell");
      continue;
    }

    if (!variant.rootCell) {
      push(variant.id, "defect variant must name a root cell");
      continue;
    }
    if (built.changedCells.length === 0) {
      push(variant.id, "defect variant changed nothing — the corrupted paper equals the clean one");
    }
    const rootKey = resolveRef(variant.rootCell, "", "");
    if (!built.changedCells.some((c) => c.key === rootKey && c.isRoot)) {
      push(variant.id, `root cell "${rootKey}" is not among the seeded changes`);
    }
    for (const accepted of variant.acceptedCells ?? []) {
      if (!built.changedCells.some((c) => c.key === accepted)) {
        push(variant.id, `accepted cell "${accepted}" did not change — it cannot be the answer`);
      }
    }
    if (!variant.cause?.concepts?.length) {
      push(variant.id, "defect variant needs a cause rubric with at least one concept");
    }
  }

  if (!workpaper.variants.some((v) => v.type === "none")) {
    push("variants", "every workpaper needs a clean variant so the drill is not pattern-matching");
  }

  return problems;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/**
 * Static registry. JSON is imported (not read via fs) so the same module works
 * in a server component, a client component, and vitest without a loader split.
 */
export const REVIEW_WORKPAPERS: ReviewWorkpaper[] = [
  equipmentYardAllocation,
  landDevSourcesUses,
  wipPercentComplete,
  intercompanyClearing,
  jobMarginScope,
  retainageRollforward,
  tbVarianceReview,
] as unknown as ReviewWorkpaper[];

export interface ReviewWorkpaperSummary {
  id: string;
  title: string;
  company: string;
  period: string;
  purpose: string;
  skills: string[];
  difficulty: "core" | "stretch";
  /** defect types this paper can seed (excluding the clean variant) */
  defectTypes: DefectType[];
  variantCount: number;
}

export function listReviewWorkpapers(): ReviewWorkpaperSummary[] {
  return REVIEW_WORKPAPERS.map((wp) => ({
    id: wp.id,
    title: wp.title,
    company: wp.company,
    period: wp.period,
    purpose: wp.purpose,
    skills: wp.skills,
    difficulty: wp.difficulty,
    defectTypes: wp.variants.filter((v) => v.type !== "none").map((v) => v.type),
    variantCount: wp.variants.length,
  }));
}

export function getReviewWorkpaper(id: string): ReviewWorkpaper | null {
  return REVIEW_WORKPAPERS.find((wp) => wp.id === id) ?? null;
}

/** Every defect type the seeded library actually covers. */
export function seededDefectTypes(): DefectType[] {
  const set = new Set<DefectType>();
  for (const wp of REVIEW_WORKPAPERS) for (const v of wp.variants) set.add(v.type);
  return Array.from(set);
}
