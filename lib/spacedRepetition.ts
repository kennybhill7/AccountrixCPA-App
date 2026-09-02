/**
 * Spaced-repetition scheduler — SM-2 algorithm.
 *
 * Schedules review of flashcards / missed quiz items so they resurface at
 * expanding intervals until mastered (the mechanic proven in the Fluency app,
 * adopted across all tracks per PRODUCT_MASTER_PLAN §6).
 *
 * Pure and time-injected: the caller passes the current day number (an integer
 * epoch-day), so scheduling is deterministic and unit-testable — no hidden
 * `Date.now()`. Convert a timestamp to a day number with `dayNumber(ms)`.
 */

export interface SrsItem {
  id: string;
  /** SM-2 easiness factor (>= MIN_EASINESS) */
  easiness: number;
  /** days until the next review */
  interval: number;
  /** consecutive successful repetitions */
  repetitions: number;
  /** epoch-day the item is next due */
  dueDay: number;
}

/** Review quality, SM-2 scale 0–5 (>= 3 is a pass). */
export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export const DEFAULT_EASINESS = 2.5;
export const MIN_EASINESS = 1.3;
export const PASS_THRESHOLD = 3;

/** Convert a millisecond timestamp to an integer day number. */
export function dayNumber(ms: number): number {
  return Math.floor(ms / 86_400_000);
}

/** Create a fresh item, due immediately. */
export function newItem(id: string, nowDay: number): SrsItem {
  return { id, easiness: DEFAULT_EASINESS, interval: 0, repetitions: 0, dueDay: nowDay };
}

function clampQuality(q: number): Quality {
  return Math.max(0, Math.min(5, Math.round(q))) as Quality;
}

/** Updated easiness factor after a review of the given quality (SM-2). */
export function nextEasiness(easiness: number, quality: Quality): number {
  const ef = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  return Math.max(MIN_EASINESS, Number(ef.toFixed(4)));
}

/**
 * Apply a review and return the updated item (does not mutate the input).
 * Pass `nowDay` = the day the review happened.
 */
export function review(item: SrsItem, quality: number, nowDay: number): SrsItem {
  const q = clampQuality(quality);
  const easiness = nextEasiness(item.easiness, q);

  let repetitions: number;
  let interval: number;
  if (q < PASS_THRESHOLD) {
    // failed — relearn from the start
    repetitions = 0;
    interval = 1;
  } else {
    repetitions = item.repetitions + 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(item.interval * easiness);
  }

  return { id: item.id, easiness, interval, repetitions, dueDay: nowDay + interval };
}

/** Is the item due for review on (or before) nowDay? */
export function isDue(item: SrsItem, nowDay: number): boolean {
  return item.dueDay <= nowDay;
}

/** Items due on/before nowDay, most overdue first. */
export function dueItems(items: SrsItem[], nowDay: number): SrsItem[] {
  return items.filter((i) => isDue(i, nowDay)).sort((a, b) => a.dueDay - b.dueDay);
}

/**
 * Build the review queue for a session: up to `limit` due items, most overdue
 * first. (Item selection beyond the limit is the caller's concern.)
 */
export function reviewQueue(items: SrsItem[], nowDay: number, limit = Infinity): SrsItem[] {
  const due = dueItems(items, nowDay);
  return Number.isFinite(limit) ? due.slice(0, limit) : due;
}
