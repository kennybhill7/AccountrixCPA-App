/**
 * Session composition — turns the attempt ledger into a bounded, ordered
 * practice session weighted toward weak areas. A "session" is finishable (fixed
 * length) with a defined start and end, which is what makes the daily habit
 * feel like a level you can beat instead of an open-ended slog.
 *
 * Pure and deterministic given (events, opts) so it's unit-testable; the client
 * passes a time-derived seedBase for day-to-day variety.
 */

import type { AttemptEvent } from "./types";
import { GENERATORS, GENERATOR_SKILLS, generatorsForSkills } from "./parametric";
import { skillStatsFromAttempts } from "./attemptStats";

export interface SessionItem {
  genId: string;
  seed: number;
  /** why this item is in the session */
  reason: "weak" | "new";
}

export interface BuildSessionOpts {
  length?: number;
  /** varies the mix/seeds run-to-run; pass a time-derived value on the client */
  seedBase?: number;
  /** fraction of the session drawn from weak skills (0–1) */
  weakBias?: number;
}

/** Skills at least one generator can drill. */
const DRILLABLE = new Set(Object.values(GENERATOR_SKILLS).flat());

/** Weakest drillable skills first (lowest accuracy, ≥2 attempts). */
export function weakSkills(events: AttemptEvent[]): string[] {
  return skillStatsFromAttempts(events)
    .filter((s) => DRILLABLE.has(s.skill) && s.attempts >= 2)
    .map((s) => ({ skill: s.skill, acc: s.correct / s.attempts }))
    .sort((a, b) => a.acc - b.acc || a.skill.localeCompare(b.skill))
    .map((s) => s.skill);
}

export function buildSession(events: AttemptEvent[], opts: BuildSessionOpts = {}): SessionItem[] {
  const length = Math.max(1, opts.length ?? 10);
  const seedBase = Math.abs(Math.trunc(opts.seedBase ?? 1)) || 1;
  const weakBias = opts.weakBias ?? 0.5;

  const weak = weakSkills(events);
  const allGens = Object.keys(GENERATORS);
  const weakN = weak.length ? Math.min(length, Math.round(length * weakBias)) : 0;

  const items: SessionItem[] = [];
  for (let i = 0; i < length; i++) {
    let genId: string;
    let reason: "weak" | "new";
    if (i < weakN) {
      const skill = weak[i % weak.length];
      const gens = generatorsForSkills([skill]);
      genId = gens[(seedBase + i) % gens.length];
      reason = "weak";
    } else {
      genId = allGens[(seedBase + i) % allGens.length];
      reason = "new";
    }
    items.push({ genId, seed: seedBase + i * 7 + 1, reason });
  }
  return items;
}
