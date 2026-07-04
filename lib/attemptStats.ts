/**
 * Attempt Ledger → engine adapters (FABLE5_ANALYSIS §4a).
 *
 * Pure functions that fold the raw AttemptEvent stream (lib/store useAttempts)
 * into the shapes the analysis engines consume:
 *   - SkillStats (lib/readiness) for the exam-readiness score, and
 *   - MissEvent (lib/errorClassify) for error-pattern mining.
 *
 * No store/UI dependency — fully unit-testable.
 */

import type { AttemptEvent } from "./types";
import type { SkillStats } from "./readiness";
import type { MissEvent } from "./errorClassify";
import { dayNumber } from "./spacedRepetition";

/** Self-reported confidence (0 low / 1 med / 2 high) → 0–1 calibration scale. */
const CONFIDENCE_VALUE: Record<0 | 1 | 2, number> = { 0: 0.25, 1: 0.6, 2: 0.9 };

export interface SkillStatsOptions {
  /** Target seconds-per-item by skill id (feeds the readiness speed component). */
  targetTimeSec?: Record<string, number>;
}

interface Accumulator {
  attempts: number;
  correct: number;
  maxTs: number;
  timeSum: number;
  timeCount: number;
  confidenceSum: number;
  confidenceCount: number;
}

/**
 * Group attempt events by skill tag into lib/readiness SkillStats.
 * Multi-skill events count toward EVERY skill they are tagged with.
 */
export function skillStatsFromAttempts(
  events: AttemptEvent[],
  opts?: SkillStatsOptions
): SkillStats[] {
  const bySkill = new Map<string, Accumulator>();

  for (const ev of events) {
    for (const skill of ev.skills) {
      let acc = bySkill.get(skill);
      if (!acc) {
        acc = {
          attempts: 0,
          correct: 0,
          maxTs: -Infinity,
          timeSum: 0,
          timeCount: 0,
          confidenceSum: 0,
          confidenceCount: 0,
        };
        bySkill.set(skill, acc);
      }
      acc.attempts += 1;
      if (ev.correct) acc.correct += 1;
      if (ev.ts > acc.maxTs) acc.maxTs = ev.ts;
      if (ev.timeSec !== undefined) {
        acc.timeSum += ev.timeSec;
        acc.timeCount += 1;
      }
      if (ev.confidence !== undefined) {
        acc.confidenceSum += CONFIDENCE_VALUE[ev.confidence];
        acc.confidenceCount += 1;
      }
    }
  }

  const stats: SkillStats[] = [];
  for (const [skill, acc] of bySkill) {
    const s: SkillStats = {
      skill,
      attempts: acc.attempts,
      correct: acc.correct,
      lastDay: Number.isFinite(acc.maxTs) ? dayNumber(acc.maxTs) : undefined,
    };
    if (acc.timeCount > 0) s.avgTimeSec = acc.timeSum / acc.timeCount;
    const target = opts?.targetTimeSec?.[skill];
    if (target !== undefined) s.targetTimeSec = target;
    if (acc.confidenceCount > 0) s.avgConfidence = acc.confidenceSum / acc.confidenceCount;
    stats.push(s);
  }
  return stats;
}

/**
 * Misses that carry a post-hoc error tag, as lib/errorClassify MissEvents
 * (feeds tallyPatterns/topPatterns).
 */
export function missEventsFromAttempts(events: AttemptEvent[]): MissEvent[] {
  const misses: MissEvent[] = [];
  for (const ev of events) {
    if (!ev.correct && ev.errorCategory) {
      misses.push({ skills: ev.skills, category: ev.errorCategory, itemId: ev.itemId });
    }
  }
  return misses;
}
