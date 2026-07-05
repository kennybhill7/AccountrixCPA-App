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

  // IMA Part 2 D/E/F: Risk 10%; Investment Decisions 10%; Ethics 15%
  "risk-mgmt": 0.1,
  "capital-budgeting": 0.05,
  "risk-return": 0.05,
  "professional-ethics": 0.15,
};

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
    skills: ["it-governance", "internal-controls", "soc-engagements", "security-privacy", "data-analytics"],
  },
  {
    id: "tcp",
    label: "TCP - Tax Compliance & Planning",
    exam: "CPA",
    skills: ["tax-planning", "entity-taxation", "property-transactions", "gift-estate-tax", "tax-procedures-ethics"],
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
      return Object.fromEntries(Object.entries(raw).map(([skill, weight]) => [skill, weight / sum]));
    }
  }

  const w = 1 / section.skills.length;
  return Object.fromEntries(section.skills.map((s) => [s, w]));
}

export function sectionsForExam(exam: ExamKind): ExamSection[] {
  return EXAM_SECTIONS.filter((s) => s.exam === exam);
}
