/**
 * Defensible exam-readiness score (PRODUCT_MASTER_PLAN §4).
 *
 * NOT a vanity percentage. For each skill it blends real signals — accuracy,
 * recency, time-per-item, confidence calibration, simulation performance, and
 * spaced-repetition strength — into a 0–100 score, then rolls the skills up by
 * blueprint weight into an overall readiness with the weakest topics surfaced.
 *
 * Pure and time-injected (pass `nowDay`); components that have no data are
 * dropped and the remaining weights renormalized, so the score stays meaningful
 * when evidence is sparse. A skill with zero attempts is "untested" (score 0).
 */

export interface SkillStats {
  skill: string;
  attempts: number;
  correct: number;
  /** epoch-day of the most recent attempt (see lib/spacedRepetition dayNumber) */
  lastDay?: number;
  /** average seconds per item, and the target pace */
  avgTimeSec?: number;
  targetTimeSec?: number;
  /** average stated confidence, 0–1, for calibration vs actual accuracy */
  avgConfidence?: number;
  /** exam-mode (simulation) accuracy, 0–1 */
  simAccuracy?: number;
  /** spaced-repetition retention strength, 0–1 (1 = well retained) */
  srStrength?: number;
}

export type Blueprint = Record<string, number>;

export interface ComponentScores {
  accuracy?: number;
  recency?: number;
  calibration?: number;
  speed?: number;
  simulation?: number;
  retention?: number;
}

export interface SkillReadiness {
  skill: string;
  score: number; // 0–100
  weight: number; // blueprint weight used in the rollup
  tested: boolean;
  components: ComponentScores;
}

export interface ReadinessResult {
  overall: number; // 0–100, blueprint-weighted
  bySkill: SkillReadiness[];
  weakest: SkillReadiness[];
}

export interface ReadinessOptions {
  /** recency half-life in days (default 14) */
  recencyHalfLifeDays?: number;
  /** relative importance of each component (renormalized over those present) */
  componentWeights?: Required<Record<keyof ComponentScores, number>>;
  /** how many weakest topics to surface (default 5) */
  weakestCount?: number;
}

const DEFAULT_COMPONENT_WEIGHTS: Required<Record<keyof ComponentScores, number>> = {
  accuracy: 0.35,
  recency: 0.15,
  calibration: 0.1,
  speed: 0.1,
  simulation: 0.2,
  retention: 0.1,
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Compute the 0–100 readiness for a single skill. */
export function skillReadiness(
  s: SkillStats,
  nowDay: number,
  opts: ReadinessOptions = {}
): SkillReadiness {
  const weights = opts.componentWeights ?? DEFAULT_COMPONENT_WEIGHTS;
  const halfLife = opts.recencyHalfLifeDays ?? 14;

  if (s.attempts <= 0) {
    return { skill: s.skill, score: 0, weight: 1, tested: false, components: {} };
  }

  const accuracy = clamp01(s.correct / s.attempts);
  const components: ComponentScores = { accuracy };

  if (s.lastDay !== undefined) {
    const days = Math.max(0, nowDay - s.lastDay);
    components.recency = clamp01(0.5 ** (days / halfLife));
  }
  if (s.avgConfidence !== undefined) {
    components.calibration = clamp01(1 - Math.abs(s.avgConfidence - accuracy));
  }
  if (s.avgTimeSec !== undefined && s.targetTimeSec !== undefined && s.avgTimeSec > 0) {
    components.speed = clamp01(s.targetTimeSec / s.avgTimeSec);
  }
  if (s.simAccuracy !== undefined) {
    components.simulation = clamp01(s.simAccuracy);
  }
  if (s.srStrength !== undefined) {
    components.retention = clamp01(s.srStrength);
  }

  // weighted average over the components that have data (renormalized)
  let num = 0;
  let den = 0;
  for (const key of Object.keys(components) as (keyof ComponentScores)[]) {
    const w = weights[key];
    num += w * (components[key] as number);
    den += w;
  }
  const score = den > 0 ? (num / den) * 100 : 0;

  return {
    skill: s.skill,
    score: Math.round(score * 10) / 10,
    weight: 1,
    tested: true,
    components,
  };
}

/** Roll skills up into an overall blueprint-weighted readiness. */
export function computeReadiness(
  stats: SkillStats[],
  blueprint: Blueprint = {},
  nowDay = 0,
  opts: ReadinessOptions = {}
): ReadinessResult {
  const bySkill = stats.map((s) => {
    const r = skillReadiness(s, nowDay, opts);
    r.weight = blueprint[s.skill] ?? 1;
    return r;
  });

  let num = 0;
  let den = 0;
  for (const r of bySkill) {
    num += r.weight * r.score;
    den += r.weight;
  }
  const overall = den > 0 ? Math.round((num / den) * 10) / 10 : 0;

  const weakest = [...bySkill]
    .sort((a, b) => a.score - b.score || a.skill.localeCompare(b.skill))
    .slice(0, opts.weakestCount ?? 5);

  return { overall, bySkill, weakest };
}
