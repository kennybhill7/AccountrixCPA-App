/**
 * Mastery model — turns the attempt ledger into a per-skill mastery level and
 * an overall exam-readiness projection. Levels are deliberately coarse and
 * legible (Know → Apply → Analyze → Exam-Ready) so progress is visible and
 * motivating, and so weak areas are obvious at a glance.
 *
 * Pure/deterministic given events → unit-testable.
 */

import type { AttemptEvent } from "./types";
import { GENERATOR_SKILLS } from "./parametric";
import { skillStatsFromAttempts } from "./attemptStats";

export type MasteryLevel = 0 | 1 | 2 | 3 | 4;
export const LEVEL_NAMES = ["Not started", "Know", "Apply", "Analyze", "Exam-Ready"] as const;

export const SKILL_LABELS: Record<string, string> = {
  tvm: "Time Value of Money",
  "interest-rates": "Interest Rates (EAR)",
  "capital-budgeting": "Capital Budgeting (NPV/IRR)",
  "bond-valuation": "Bond Valuation",
  "risk-return": "Risk & Return (CAPM)",
  "cost-of-capital": "Cost of Capital (WACC)",
  "stock-valuation": "Stock Valuation",
  dupont: "DuPont Analysis",
  "ratio-analysis": "Ratio Analysis",
  depreciation: "Depreciation",
  inventory: "Inventory & COGS",
  eps: "Earnings Per Share",
  cvp: "Cost-Volume-Profit",
  "financial-statements": "Financial Statements",
  "cost-behavior": "Cost Behavior",
  performance: "Performance (ROI)",
};

export const SKILL_AREAS: Record<string, string> = {
  tvm: "Corporate Finance",
  "interest-rates": "Corporate Finance",
  "capital-budgeting": "Corporate Finance",
  "bond-valuation": "Corporate Finance",
  "risk-return": "Corporate Finance",
  "cost-of-capital": "Corporate Finance",
  "stock-valuation": "Corporate Finance",
  dupont: "Accounting & CMA",
  "ratio-analysis": "Accounting & CMA",
  depreciation: "Accounting & CMA",
  inventory: "Accounting & CMA",
  eps: "Accounting & CMA",
  cvp: "Accounting & CMA",
  "financial-statements": "Accounting & CMA",
  "cost-behavior": "Accounting & CMA",
  performance: "Accounting & CMA",
};

export const AREA_ORDER = ["Corporate Finance", "Accounting & CMA", "Other"] as const;

/** Coarse mastery from volume + accuracy. */
export function masteryLevel(attempts: number, accuracy: number): MasteryLevel {
  if (attempts < 1) return 0;
  if (attempts < 3 || accuracy < 0.5) return 1; // Know
  if (accuracy < 0.7) return 2; // Apply
  if (accuracy < 0.85 || attempts < 6) return 3; // Analyze
  return 4; // Exam-Ready
}

export interface SkillMastery {
  skill: string;
  label: string;
  area: string;
  attempts: number;
  accuracy: number;
  level: MasteryLevel;
}

/** All measurable (generator-drillable) skills with their current mastery. */
export function masteryMap(events: AttemptEvent[]): SkillMastery[] {
  const stats = new Map(skillStatsFromAttempts(events).map((s) => [s.skill, s]));
  const skills = Array.from(new Set(Object.values(GENERATOR_SKILLS).flat()));
  return skills
    .map((skill) => {
      const st = stats.get(skill);
      const attempts = st?.attempts ?? 0;
      const accuracy = attempts > 0 ? st!.correct / attempts : 0;
      return {
        skill,
        label: SKILL_LABELS[skill] ?? skill,
        area: SKILL_AREAS[skill] ?? "Other",
        attempts,
        accuracy,
        level: masteryLevel(attempts, accuracy),
      };
    })
    .sort((a, b) => a.level - b.level || b.attempts - a.attempts);
}

/** Overall exam-readiness projection (0–100): mean of level/4 across skills. */
export function overallReadiness(events: AttemptEvent[]): number {
  const m = masteryMap(events);
  if (m.length === 0) return 0;
  const sum = m.reduce((n, s) => n + s.level / 4, 0);
  return Math.round((sum / m.length) * 100);
}
