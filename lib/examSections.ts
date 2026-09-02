/**
 * Exam-section blueprints: the rollup layer between per-skill readiness and the
 * section-level "am I ready for FAR?" number a candidate actually tracks.
 *
 * A skill can belong to more than one section on purpose: ratio-analysis
 * mastery genuinely counts toward CMA Part 1, Part 2, AND Finance, so it
 * appears in each of their blueprints. computeReadiness (lib/readiness) is run
 * once per section with that section's blueprint, reusing the audited engine.
 *
 * CMA weights use IMA's published part-area percentages, mapped onto this app's
 * skill taxonomy. CPA and Finance remain equal-per-skill until their official
 * blueprint areas are mapped with the same discipline.
 *
 * ---------------------------------------------------------------------------
 * BLUEPRINT PROVENANCE — CMA content-area weights (VERIFIED 2026-09-02)
 * ---------------------------------------------------------------------------
 * Source document : ICMA, "Content Specification Outlines, Certified Management
 *                   Accountant (CMA) Examinations", Effective September 1, 2024.
 * Source URL      : https://prodcm.sfmagazine.com/-/media/IMA/Files/Home/
 *                   IMA-Certifications/CMA-Certification/
 *                   2024-CMA-Content-Specification-Outlines-Final.ashx
 *                   (IMA-operated host. The www.imanet.org path for this same
 *                   file now 301-redirects to https://www.imaglobal.org/.)
 * Retrieved       : 2026-09-02. Percentages were read out of the PDF's own
 *                   "CMA Content Specification Overview" table by extracting
 *                   the document text — not from memory, and not from a
 *                   third-party summary.
 *
 * Part 1 — Financial Planning, Performance, and Analytics
 *   (4 hours, 100 questions and 2 essay questions)
 *     A. External Financial Reporting Decisions ....... 15%  Level C
 *     B. Planning, Budgeting, and Forecasting ......... 20%  Level C
 *     C. Performance Management ....................... 20%  Level C
 *     D. Cost Management .............................. 15%  Level C
 *     E. Internal Controls ............................ 15%  Level C
 *     F. Technology and Analytics ..................... 15%  Level C
 *
 * Part 2 — Strategic Financial Management
 *   (4 hours, 100 questions and 2 essay questions)
 *     A. Financial Statement Analysis ................. 20%  Level C
 *     B. Corporate Finance ............................ 20%  Level C
 *     C. Business Decision Analysis ................... 25%  Level C
 *     D. Enterprise Risk Management ................... 10%  Level C
 *     E. Capital Investment Decisions ................. 10%  Level C
 *     F. Professional Ethics .......................... 15%  Level C
 *
 * RECONCILIATION RESULT: every percentage already encoded in
 * CMA_PART_1_WEIGHTS / CMA_PART_2_WEIGHTS matched the source document exactly.
 * NO WEIGHT WAS CHANGED. The only additions were this citation block and the
 * CMA_*_AREAS structures below, which expose the area level that the
 * blueprint-weighted drill selector in lib/studyPlan.ts needs.
 *
 * 2026 FORMAT CHANGE — CONTENT UNAFFECTED: from the Sep/Oct 2026 window the two
 * essays are replaced by Case-Based Questions. Multiple third-party review
 * providers state the CSO and Learning Outcome Statements — hence these weights
 * — are unchanged by that switch; that "unchanged" claim is NOT verified here
 * against a primary IMA document. It is a format change, so these weights stand
 * either way, but re-check the CSO effective date before the 2027 sitting.
 *
 * SCOPE LIMIT — the intra-area SPLIT across this app's skills (e.g. Part 1 A's
 * 15% divided 5/5/5 over three skills) is an app-level modelling choice, NOT an
 * IMA publication. IMA publishes weights at the AREA level only. What is
 * verifiable, and what is asserted in tests/unit/blueprintWeights.test.ts, is
 * that each area's skill weights sum to that area's official percentage.
 */

export type ExamKind = "CPA" | "CMA" | "Finance";

export interface ExamSection {
  id: string;
  label: string;
  exam: ExamKind;
  /** Canonical SKILL_TAXONOMY ids that make up this section. */
  skills: string[];
  /** Optional per-skill blueprint weights. Values are normalized at read time. */
  weights?: Record<string, number>;
}

const CMA_PART_1_WEIGHTS: Record<string, number> = {
  // IMA Part 1 A: External Financial Reporting Decisions - 15%
  "financial-statements": 0.05,
  "revenue-recognition": 0.05,
  "asset-liability-measurement": 0.05,

  // IMA Part 1 B: Planning, Budgeting, and Forecasting - 20%
  budgeting: 0.1,
  "scenario-planning": 0.1,

  // IMA Part 1 C: Performance Management - 20%
  "variance-analysis": 0.1,
  "performance-mgmt": 0.1,

  // IMA Part 1 D: Cost Management - 15%
  "cost-behavior": 0.03,
  "costing-systems": 0.03,
  "wip-schedule": 0.03,
  "over-under-billing": 0.03,
  "month-end-close": 0.03,

  // IMA Part 1 E/F: Internal Controls 15%; Technology and Analytics 15%
  "internal-controls": 0.15,
  "data-analytics": 0.15,
};

const CMA_PART_2_WEIGHTS: Record<string, number> = {
  // IMA Part 2 A: Financial Statement Analysis - 20%
  "financial-analysis": 0.1,
  "ratio-analysis": 0.1,

  // IMA Part 2 B: Corporate Finance - 20%
  "cost-of-capital": 0.0666666667,
  "working-capital-mgmt": 0.0666666667,
  tvm: 0.0666666666,

  // IMA Part 2 C: Business Decision Analysis - 25%
  "cvp-analysis": 0.0833333334,
  "decision-analysis": 0.0833333333,
  "pricing-margin-analysis": 0.0833333333,

  // IMA Part 2 D: Enterprise Risk Management 10%; E: Capital Investment
  // Decisions 10%; F: Professional Ethics 15%
  "risk-mgmt": 0.1,
  "capital-budgeting": 0.05,
  "risk-return": 0.05,
  "professional-ethics": 0.15,
};

/**
 * One IMA content area (the level at which IMA actually publishes weights).
 * `weight` is the official decimal share of the part; `skills` are the app
 * taxonomy ids that roll up into it.
 */
export interface BlueprintArea {
  /** stable id, e.g. "cma-p1-a" */
  id: string;
  /** IMA area letter, "A"–"F" */
  letter: string;
  /** official IMA area name, verbatim from the CSO */
  label: string;
  /** official decimal weight (0.15 = 15%) */
  weight: number;
  skills: string[];
}

/** CMA Part 1 areas — weights verbatim from the Sept 1 2024 CSO (see header). */
export const CMA_PART_1_AREAS: BlueprintArea[] = [
  {
    id: "cma-p1-a",
    letter: "A",
    label: "External Financial Reporting Decisions",
    weight: 0.15,
    skills: ["financial-statements", "revenue-recognition", "asset-liability-measurement"],
  },
  {
    id: "cma-p1-b",
    letter: "B",
    label: "Planning, Budgeting, and Forecasting",
    weight: 0.2,
    skills: ["budgeting", "scenario-planning"],
  },
  {
    id: "cma-p1-c",
    letter: "C",
    label: "Performance Management",
    weight: 0.2,
    skills: ["variance-analysis", "performance-mgmt"],
  },
  {
    id: "cma-p1-d",
    letter: "D",
    label: "Cost Management",
    weight: 0.15,
    skills: [
      "cost-behavior",
      "costing-systems",
      "wip-schedule",
      "over-under-billing",
      "month-end-close",
    ],
  },
  {
    id: "cma-p1-e",
    letter: "E",
    label: "Internal Controls",
    weight: 0.15,
    skills: ["internal-controls"],
  },
  {
    id: "cma-p1-f",
    letter: "F",
    label: "Technology and Analytics",
    weight: 0.15,
    skills: ["data-analytics"],
  },
];

/** CMA Part 2 areas — weights verbatim from the Sept 1 2024 CSO (see header). */
export const CMA_PART_2_AREAS: BlueprintArea[] = [
  {
    id: "cma-p2-a",
    letter: "A",
    label: "Financial Statement Analysis",
    weight: 0.2,
    skills: ["financial-analysis", "ratio-analysis"],
  },
  {
    id: "cma-p2-b",
    letter: "B",
    label: "Corporate Finance",
    weight: 0.2,
    skills: ["cost-of-capital", "working-capital-mgmt", "tvm"],
  },
  {
    id: "cma-p2-c",
    letter: "C",
    label: "Business Decision Analysis",
    weight: 0.25,
    skills: ["cvp-analysis", "decision-analysis", "pricing-margin-analysis"],
  },
  {
    id: "cma-p2-d",
    letter: "D",
    label: "Enterprise Risk Management",
    weight: 0.1,
    skills: ["risk-mgmt"],
  },
  {
    id: "cma-p2-e",
    letter: "E",
    label: "Capital Investment Decisions",
    weight: 0.1,
    skills: ["capital-budgeting", "risk-return"],
  },
  {
    id: "cma-p2-f",
    letter: "F",
    label: "Professional Ethics",
    weight: 0.15,
    skills: ["professional-ethics"],
  },
];

/**
 * Blueprint areas for a section id, or [] where no official area map exists.
 * Only the CMA parts have IMA-published area weights; CPA and Finance return []
 * rather than inventing a structure.
 */
export function areasForSection(sectionId: string): BlueprintArea[] {
  if (sectionId === "cma-p1") return CMA_PART_1_AREAS;
  if (sectionId === "cma-p2") return CMA_PART_2_AREAS;
  return [];
}

export const EXAM_SECTIONS: ExamSection[] = [
  // ---- CPA (six CPA Evolution sections) ----
  {
    id: "far",
    label: "FAR - Financial Accounting & Reporting",
    exam: "CPA",
    skills: [
      "conceptual-framework",
      "revenue-recognition",
      "leases",
      "inventory",
      "pensions-stock-comp",
      "consolidations",
      "cash-receivables-cecl",
      "contingencies",
      "fair-value",
      "governmental-accounting",
      "nfp-accounting",
    ],
  },
  {
    id: "aud",
    label: "AUD - Auditing & Attestation",
    exam: "CPA",
    skills: [
      "audit-risk-model",
      "internal-controls",
      "audit-evidence",
      "audit-sampling",
      "substantive-procedures",
      "audit-reports",
      "it-auditing",
      "professional-ethics",
    ],
  },
  {
    id: "reg",
    label: "REG - Taxation & Regulation",
    exam: "CPA",
    skills: [
      "individual-taxation",
      "entity-taxation",
      "property-transactions",
      "gift-estate-tax",
      "tax-procedures-ethics",
      "business-law",
    ],
  },
  {
    id: "bar",
    label: "BAR - Business Analysis & Reporting",
    exam: "CPA",
    skills: [
      "financial-analysis",
      "ratio-analysis",
      "cost-accounting",
      "public-company-reporting",
      "data-analytics",
      "capital-budgeting",
      "cost-of-capital",
      "hedge-accounting",
      "consolidations",
    ],
  },
  {
    id: "isc",
    label: "ISC - Information Systems & Controls",
    exam: "CPA",
    skills: [
      "it-governance",
      "internal-controls",
      "soc-engagements",
      "security-privacy",
      "data-analytics",
    ],
  },
  {
    id: "tcp",
    label: "TCP - Tax Compliance & Planning",
    exam: "CPA",
    skills: [
      "tax-planning",
      "entity-taxation",
      "property-transactions",
      "gift-estate-tax",
      "tax-procedures-ethics",
    ],
  },
  // ---- CMA ----
  {
    id: "cma-p1",
    label: "CMA Part 1 - Planning, Performance & Analytics",
    exam: "CMA",
    skills: [
      "financial-statements",
      "revenue-recognition",
      "asset-liability-measurement",
      "budgeting",
      "scenario-planning",
      "cost-behavior",
      "costing-systems",
      "variance-analysis",
      "performance-mgmt",
      "internal-controls",
      "data-analytics",
      "wip-schedule",
      "over-under-billing",
      "month-end-close",
    ],
    weights: CMA_PART_1_WEIGHTS,
  },
  {
    id: "cma-p2",
    label: "CMA Part 2 - Financial Decision Making",
    exam: "CMA",
    skills: [
      "financial-analysis",
      "ratio-analysis",
      "cost-of-capital",
      "capital-budgeting",
      "cvp-analysis",
      "decision-analysis",
      "pricing-margin-analysis",
      "risk-mgmt",
      "risk-return",
      "working-capital-mgmt",
      "tvm",
      "professional-ethics",
    ],
    weights: CMA_PART_2_WEIGHTS,
  },
  // ---- Finance ----
  {
    id: "finance",
    label: "Finance - Corporate Finance",
    exam: "Finance",
    skills: [
      "tvm",
      "financial-statements",
      "cash-flow-analysis",
      "ratio-analysis",
      "dupont",
      "stock-valuation",
      "bond-valuation",
      "cost-of-capital",
      "capital-budgeting",
      "risk-return",
      "working-capital-mgmt",
      "pro-forma",
      "financial-forecasting",
    ],
  },
];

/** Blueprint weights for one section id; explicit weights are normalized defensively. */
export function sectionBlueprint(section: ExamSection): Record<string, number> {
  if (section.weights) {
    const raw = Object.fromEntries(section.skills.map((s) => [s, section.weights?.[s] ?? 0]));
    const sum = Object.values(raw).reduce((a, b) => a + b, 0);
    if (sum > 0) {
      return Object.fromEntries(
        Object.entries(raw).map(([skill, weight]) => [skill, weight / sum])
      );
    }
  }

  const w = 1 / section.skills.length;
  return Object.fromEntries(section.skills.map((s) => [s, w]));
}

export function sectionsForExam(exam: ExamKind): ExamSection[] {
  return EXAM_SECTIONS.filter((s) => s.exam === exam);
}
