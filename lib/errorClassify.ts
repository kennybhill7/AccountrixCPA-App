/**
 * "Explain my mistake" error-classifier.
 *
 * After a wrong answer, the learner (or the app) tags WHY it was missed. This
 * module turns that tag + the item's skills into a targeted-review
 * recommendation, and aggregates misses over time to surface recurring error
 * patterns ("you keep reversing journal-entry direction"). Proven in the
 * Fluency app's error-tag dashboard; generalized per PRODUCT_MASTER_PLAN §6.
 *
 * Pure and data-only — no app/UI dependency, so it is fully unit-testable.
 */

export type ErrorCategory =
  | "concept-gap"
  | "formula-math"
  | "misread"
  | "je-direction"
  | "tax-exception"
  | "audit-assertion"
  | "time-pressure";

export const ERROR_CATEGORIES: ErrorCategory[] = [
  "concept-gap",
  "formula-math",
  "misread",
  "je-direction",
  "tax-exception",
  "audit-assertion",
  "time-pressure",
];

/** What the learner should do next about an error of this kind. */
export type RemediationAction = "relearn" | "drill" | "reread" | "practice-timed";

export interface MissEvent {
  /** skill ids the missed item was tagged with (from SKILL_TAXONOMY) */
  skills: string[];
  category: ErrorCategory;
  itemId?: string;
}

export interface Recommendation {
  category: ErrorCategory;
  label: string;
  advice: string;
  action: RemediationAction;
  /** skills to route the learner back to (may add a canonical skill, e.g. journal-entries) */
  reviewSkills: string[];
}

interface Guidance {
  label: string;
  advice: string;
  action: RemediationAction;
  /** a canonical skill to always add to the review set for this error kind */
  anchorSkill?: string;
}

const GUIDANCE: Record<ErrorCategory, Guidance> = {
  "concept-gap": {
    label: "Concept gap",
    advice: "You don't yet hold the underlying concept — relearn the lesson before drilling.",
    action: "relearn",
  },
  "formula-math": {
    label: "Formula / math error",
    advice:
      "You knew the approach but slipped on the computation — redo the worked example, then drill.",
    action: "drill",
  },
  misread: {
    label: "Misread the question",
    advice:
      "Slow down: reread the stem, underline what is actually asked, and note any 'except/not'.",
    action: "reread",
  },
  "je-direction": {
    label: "Journal-entry direction",
    advice: "You reversed a debit/credit — drill the entry direction until it is automatic.",
    action: "drill",
    anchorSkill: "journal-entries",
  },
  "tax-exception": {
    label: "Tax rule exception",
    advice:
      "You applied the general rule but missed an exception — relearn the special rule on the current (2026) baseline.",
    action: "relearn",
  },
  "audit-assertion": {
    label: "Audit assertion confusion",
    advice: "Re-map assertion → procedure (e.g., existence vs completeness, vouch vs trace).",
    action: "relearn",
    anchorSkill: "audit-evidence",
  },
  "time-pressure": {
    label: "Time pressure",
    advice: "You knew it but ran out of time — practice in timed exam mode to build speed.",
    action: "practice-timed",
  },
};

/** Classify a single miss into a targeted-review recommendation. */
export function classify(category: ErrorCategory, skills: string[] = []): Recommendation {
  const g = GUIDANCE[category];
  const reviewSkills = [...skills];
  if (g.anchorSkill && !reviewSkills.includes(g.anchorSkill)) reviewSkills.push(g.anchorSkill);
  return { category, label: g.label, advice: g.advice, action: g.action, reviewSkills };
}

export interface PatternTally {
  byCategory: Record<string, number>;
  bySkill: Record<string, number>;
  total: number;
}

/** Aggregate misses by error category and by skill. */
export function tallyPatterns(misses: MissEvent[]): PatternTally {
  const byCategory: Record<string, number> = {};
  const bySkill: Record<string, number> = {};
  for (const m of misses) {
    byCategory[m.category] = (byCategory[m.category] ?? 0) + 1;
    for (const s of m.skills) bySkill[s] = (bySkill[s] ?? 0) + 1;
  }
  return { byCategory, bySkill, total: misses.length };
}

export interface Pattern {
  key: string;
  type: "category" | "skill";
  count: number;
}

/**
 * The most frequent error patterns across categories and skills — what to drill
 * next. Ties broken alphabetically for deterministic output.
 */
export function topPatterns(misses: MissEvent[], n = 3): Pattern[] {
  const t = tallyPatterns(misses);
  const all: Pattern[] = [
    ...Object.entries(t.byCategory).map(([key, count]) => ({
      key,
      type: "category" as const,
      count,
    })),
    ...Object.entries(t.bySkill).map(([key, count]) => ({ key, type: "skill" as const, count })),
  ];
  all.sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
  return all.slice(0, n);
}
