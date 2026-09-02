/**
 * CPA Practice item → frozen SKILL_TAXONOMY skill mapping.
 *
 * /crossover previously generated ad-hoc skill ids from the raw section/topic
 * string (e.g. "cpa-isc-application-controls-input"), which readiness could
 * aggregate but /api/skills/map could never resolve to a lesson, and which
 * fragmented one concept into dozens of one-attempt skills. This maps each
 * item onto ONE canonical taxonomy id (docs/SKILL_TAXONOMY.md, frozen v1) via
 * ordered keyword rules per section, with a section-level default.
 *
 * ISC/TCP items carry rich topic strings and their lesson weeks are skill-
 * tagged, so Study-this links resolve end-to-end there. FAR/AUD/REG/BAR items
 * mostly lack topics today and fall through to the section default.
 */

type Rule = [pattern: RegExp, skill: string];

const RULES: Record<string, { rules: Rule[]; fallback: string }> = {
  FAR: {
    rules: [
      [/government|gasb|fund/i, "governmental-accounting"],
      [/not-for-profit|nfp/i, "nfp-accounting"],
      [/revenue|asc 606/i, "revenue-recognition"],
      [/lease/i, "leases"],
      [/inventory/i, "inventory"],
      [/pension|stock comp/i, "pensions-stock-comp"],
      [/consolidat|nci|business combination/i, "consolidations"],
      [/receivable|cecl/i, "cash-receivables-cecl"],
      [/contingen/i, "contingencies"],
      [/fair value/i, "fair-value"],
    ],
    fallback: "conceptual-framework",
  },
  AUD: {
    rules: [
      [/ethic|independence/i, "professional-ethics"],
      [/sampl/i, "audit-sampling"],
      [/risk/i, "audit-risk-model"],
      [/report|opinion/i, "audit-reports"],
      [/control/i, "internal-controls"],
      [/it |information technology|itgc/i, "it-auditing"],
    ],
    fallback: "audit-evidence",
  },
  REG: {
    rules: [
      [/contract|ucc|agency|secured|bankrupt|law|suret/i, "business-law"],
      [/gift|estate/i, "gift-estate-tax"],
      [/corporation|partnership|s corp|entity/i, "entity-taxation"],
      [/property|1031|1245|1250|exchange/i, "property-transactions"],
      [/procedur|circular|penalt|preparer/i, "tax-procedures-ethics"],
    ],
    fallback: "individual-taxation",
  },
  BAR: {
    rules: [
      [/combination|goodwill|asc 805/i, "consolidations"],
      [/ratio|dupont/i, "ratio-analysis"],
      // ASC 830 (foreign currency translation/remeasurement) is NOT hedge
      // accounting; ASC 815 is. Routing translation items to hedge-accounting
      // sent every BAR FX item to the wrong remediation. Order matters: the
      // ASC 815 rule must be tested before the broader currency rule.
      [/hedge|asc 815|derivative/i, "hedge-accounting"],
      [/foreign|currency|translation|remeasure|asc 830/i, "consolidations"],
      [/cost|variance|cvp|activity-based/i, "cost-accounting"],
      [/sec |public|eps|10-k|10-q|8-k|reg g/i, "public-company-reporting"],
      [/data|analytic|regression/i, "data-analytics"],
      [/capital budget|npv|irr|payback/i, "capital-budgeting"],
      [/wacc|cost of capital|valuation/i, "cost-of-capital"],
    ],
    fallback: "financial-analysis",
  },
  ISC: {
    rules: [
      [
        /\bsoc\b|type 1|type 2|trust services|tsc|subservice|carve-out|user-entity|bridge letter|points of focus|processing integrity|confidentiality vs\.? privacy/i,
        "soc-engagements",
      ],
      [
        /security|encryption|key management|attack|incident|zero trust|penetration|vulnerabilit|social engineering|bec|defense|cia triad|injection|bcp|drp|recovery|backup|rpo|rto|business impact|disaster/i,
        "security-privacy",
      ],
      [
        /etl|database|oltp|analytical|data lake|data governance|data quality|data life|data conversion/i,
        "data-analytics",
      ],
      [
        /governance|outsourcing|third-party|emerging technology|segregation|organization/i,
        "it-governance",
      ],
      [
        /control|change management|authentication|authorization|access|sdlc|conversion|development|implementation|test environment|testing/i,
        "internal-controls",
      ],
    ],
    fallback: "it-governance",
  },
  TCP: {
    rules: [
      [/gift|estate|dsue|portability|crummey|2503|annual exclusion/i, "gift-estate-tax"],
      [
        /s corporation|c corporation|partnership|guaranteed payment|check-the-box|built-in gains|1202|qsbs|reasonable compensation|hot assets|outside basis/i,
        "entity-taxation",
      ],
      [
        /§ ?121|residence|like-kind|1031|1245|1250|recapture|§ ?267|installment|wash sale|capital loss/i,
        "property-transactions",
      ],
      [/penalt|statute of limitations|estimated tax|failure-to/i, "tax-procedures-ethics"],
    ],
    fallback: "tax-planning",
  },
};

/**
 * Map one CPA Practice item to a single canonical taxonomy skill id.
 * `topicText` is the item's topic and/or blueprint area, concatenated.
 */
export function skillForCpaItem(section: string, topicText?: string | null): string {
  const config = RULES[section.toUpperCase()];
  if (!config) return "conceptual-framework";
  const text = (topicText ?? "").trim();
  if (text) {
    for (const [pattern, skill] of config.rules) {
      if (pattern.test(text)) return skill;
    }
  }
  return config.fallback;
}

/** Array form used by AttemptEvent.skills / SrsMissMeta.skills. */
export function skillsForCpaItem(section: string, topicText?: string | null): string[] {
  return [skillForCpaItem(section, topicText)];
}
