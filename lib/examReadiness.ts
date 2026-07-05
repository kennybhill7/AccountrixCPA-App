/**
 * Exam-section readiness rollup — turns per-skill readiness into the
 * section-level report a candidate tracks ("FAR: 62%, on track; weakest:
 * leases, pensions").
 *
 * Honesty rule: a section's score includes its UNTESTED skills as zeros, so
 * studying 3 of 11 FAR skills perfectly reads ~27% ready, not 100%. That
 * prevents the vanity-inflation the readiness engine header warns against.
 */

import type { SkillStats, SkillReadiness, ReadinessOptions } from "./readiness";
import { computeReadiness } from "./readiness";
import { EXAM_SECTIONS, sectionBlueprint, type ExamKind, type ExamSection } from "./examSections";

export type ReadinessStatus = "not-ready" | "building" | "on-track" | "exam-ready";

export interface SectionReadiness {
  id: string;
  label: string;
  exam: ExamKind;
  /** 0–100, blueprint-weighted over ALL section skills (untested count as 0). */
  readiness: number;
  /**
   * 0–100 over ONLY the tested skills — how well you know what you HAVE
   * practiced, independent of coverage. High mastery + low readiness = "you
   * know your material but haven't covered the section yet." null if untested.
   */
  masteryOfTested: number | null;
  status: ReadinessStatus;
  testedSkills: number;
  totalSkills: number;
  /** weakest section skills (lowest score first), for "study this" routing */
  weakest: SkillReadiness[];
  /** estimated focused study hours to reach the target readiness */
  hoursToTarget: number;
}

export interface ExamReadinessOptions extends ReadinessOptions {
  /** target readiness a candidate is aiming for, 0–100 (default 75) */
  target?: number;
  /** focused hours budgeted to move one skill from 0 to target (default 3) */
  hoursPerSkill?: number;
}

export function statusFor(readiness: number): ReadinessStatus {
  if (readiness >= 85) return "exam-ready";
  if (readiness >= 70) return "on-track";
  if (readiness >= 40) return "building";
  return "not-ready";
}

export const STATUS_LABEL: Record<ReadinessStatus, string> = {
  "not-ready": "Not ready",
  building: "Building",
  "on-track": "On track",
  "exam-ready": "Exam ready",
};

function sectionReadiness(
  section: ExamSection,
  statsBySkill: Map<string, SkillStats>,
  nowDay: number,
  opts: ExamReadinessOptions
): SectionReadiness {
  const target = opts.target ?? 75;
  const hoursPerSkill = opts.hoursPerSkill ?? 3;

  // Cover every section skill: real stats where present, synthetic zero-attempt
  // stats for untested ones (so coverage gaps drag the score down honestly).
  const stats: SkillStats[] = section.skills.map(
    (skill) => statsBySkill.get(skill) ?? { skill, attempts: 0, correct: 0 }
  );

  const result = computeReadiness(stats, sectionBlueprint(section), nowDay, {
    ...opts,
    weakestCount: section.skills.length,
  });

  const testedStats = stats.filter((s) => (s.attempts ?? 0) > 0);
  const testedSkills = result.bySkill.filter((s) => s.tested).length;
  // Mastery over only what has been practiced (equal weight) — separate from
  // coverage readiness so "know it well but barely covered" is visible.
  const masteryOfTested =
    testedSkills > 0 ? computeReadiness(testedStats, {}, nowDay, opts).overall : null;

  // Study-hours estimate: sum the per-skill gap to target, scaled by the
  // hours it takes to close a full 0→target gap. A defensible planning
  // heuristic, not a guarantee.
  const hoursToTarget = Math.round(
    result.bySkill.reduce(
      (h, s) => h + (Math.max(0, target - s.score) / target) * hoursPerSkill,
      0
    )
  );

  return {
    id: section.id,
    label: section.label,
    exam: section.exam,
    readiness: result.overall,
    masteryOfTested,
    status: statusFor(result.overall),
    testedSkills,
    totalSkills: section.skills.length,
    weakest: result.weakest.filter((s) => s.score < target).slice(0, 4),
    hoursToTarget,
  };
}

export interface ExamReadinessReport {
  sections: SectionReadiness[];
  /** overall readiness per exam kind (simple mean of its sections) */
  byExam: Array<{ exam: ExamKind; readiness: number; hoursToTarget: number }>;
}

export function computeExamReadiness(
  stats: SkillStats[],
  nowDay = 0,
  opts: ExamReadinessOptions = {}
): ExamReadinessReport {
  const statsBySkill = new Map(stats.map((s) => [s.skill, s]));
  const sections = EXAM_SECTIONS.map((section) =>
    sectionReadiness(section, statsBySkill, nowDay, opts)
  );

  const exams: ExamKind[] = ["CPA", "CMA", "Finance"];
  const byExam = exams.map((exam) => {
    const secs = sections.filter((s) => s.exam === exam);
    const readiness =
      secs.length > 0
        ? Math.round((secs.reduce((n, s) => n + s.readiness, 0) / secs.length) * 10) / 10
        : 0;
    const hoursToTarget = secs.reduce((n, s) => n + s.hoursToTarget, 0);
    return { exam, readiness, hoursToTarget };
  });

  return { sections, byExam };
}
