/**
 * Exam-section blueprints — the rollup layer between per-skill readiness and
 * the section-level "am I ready for FAR?" number a candidate actually tracks.
 *
 * A skill can belong to more than one section on purpose: ratio-analysis
 * mastery genuinely counts toward CMA Part 1, Part 2, AND Finance, so it
 * appears in each of their blueprints. computeReadiness (lib/readiness) is run
 * once per section with that section's blueprint, reusing the audited engine.
 *
 * Weights are equal-per-skill within a section for v1 — a defensible ordering
 * of coverage, NOT the official AICPA/IMA blueprint percentages. Swapping in
 * real blueprint weights later is a data-only change here.
 */

export type ExamKind = "CPA" | "CMA" | "Finance";

export interface ExamSection {
  id: string;
  label: string;
  exam: ExamKind;
  /** Canonical SKILL_TAXONOMY ids that make up this section. */
  skills: string[];
}

export const EXAM_SECTIONS: ExamSection[] = [
  // ---- CPA (six CPA Evolution sections) ----
  {
    id: "far",
    label: "FAR — Financial Accounting & Reporting",
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
    label: "AUD — Auditing & Attestation",
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
    label: "REG — Taxation & Regulation",
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
    label: "BAR — Business Analysis & Reporting",
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
    label: "ISC — Information Systems & Controls",
    exam: "CPA",
    skills: ["it-governance", "internal-controls", "soc-engagements", "security-privacy", "data-analytics"],
  },
  {
    id: "tcp",
    label: "TCP — Tax Compliance & Planning",
    exam: "CPA",
    skills: ["tax-planning", "entity-taxation", "property-transactions", "gift-estate-tax", "tax-procedures-ethics"],
  },
  // ---- CMA ----
  {
    id: "cma-p1",
    label: "CMA Part 1 — Planning, Performance & Analytics",
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
  },
  {
    id: "cma-p2",
    label: "CMA Part 2 — Financial Decision Making",
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
  },
  // ---- Finance ----
  {
    id: "finance",
    label: "Finance — Corporate Finance",
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

/** Blueprint (equal weight per listed skill) for one section id. */
export function sectionBlueprint(section: ExamSection): Record<string, number> {
  const w = 1 / section.skills.length;
  return Object.fromEntries(section.skills.map((s) => [s, w]));
}

export function sectionsForExam(exam: ExamKind): ExamSection[] {
  return EXAM_SECTIONS.filter((s) => s.exam === exam);
}
