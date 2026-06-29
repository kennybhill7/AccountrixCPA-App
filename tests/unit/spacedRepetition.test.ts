import { describe, it, expect } from "vitest";
import {
  newItem,
  review,
  isDue,
  dueItems,
  reviewQueue,
  nextEasiness,
  dayNumber,
  DEFAULT_EASINESS,
  MIN_EASINESS,
} from "../../lib/spacedRepetition";

describe("spacedRepetition (SM-2)", () => {
  it("a new item is due immediately", () => {
    const it0 = newItem("a", 100);
    expect(it0.easiness).toBe(DEFAULT_EASINESS);
    expect(it0.repetitions).toBe(0);
    expect(isDue(it0, 100)).toBe(true);
  });

  it("expands intervals 1 → 6 → ~interval×EF on consecutive passes", () => {
    let card = newItem("a", 0);
    card = review(card, 5, 0);
    expect(card.interval).toBe(1);
    expect(card.repetitions).toBe(1);
    expect(card.dueDay).toBe(1);

    card = review(card, 5, 1);
    expect(card.interval).toBe(6);
    expect(card.repetitions).toBe(2);
    expect(card.dueDay).toBe(7);

    card = review(card, 5, 7);
    // interval = round(6 × easiness); easiness has risen above 2.5
    expect(card.interval).toBeGreaterThan(6);
    expect(card.repetitions).toBe(3);
    expect(card.dueDay).toBe(7 + card.interval);
  });

  it("a failing grade (<3) resets repetitions and shortens the interval", () => {
    let card = newItem("a", 0);
    card = review(card, 5, 0);
    card = review(card, 5, 1); // interval 6, reps 2
    const failed = review(card, 1, 7);
    expect(failed.repetitions).toBe(0);
    expect(failed.interval).toBe(1);
    expect(failed.dueDay).toBe(8);
  });

  it("easiness rises on good reviews and never falls below the floor", () => {
    expect(nextEasiness(2.5, 5)).toBeCloseTo(2.6, 4);
    // many bad reviews clamp at the minimum
    let ef = 2.5;
    for (let i = 0; i < 20; i++) ef = nextEasiness(ef, 0);
    expect(ef).toBe(MIN_EASINESS);
  });

  it("dueItems returns only due cards, most overdue first", () => {
    const cards = [
      { ...newItem("a", 0), dueDay: 12 },
      { ...newItem("b", 0), dueDay: 8 },
      { ...newItem("c", 0), dueDay: 20 },
    ];
    const due = dueItems(cards, 10);
    expect(due.map((c) => c.id)).toEqual(["b"]);
    const dueLater = dueItems(cards, 15);
    expect(dueLater.map((c) => c.id)).toEqual(["b", "a"]);
  });

  it("reviewQueue caps the session size", () => {
    const cards = [0, 1, 2, 3, 4].map((d) => ({ ...newItem(String(d), 0), dueDay: d }));
    expect(reviewQueue(cards, 100, 3)).toHaveLength(3);
    expect(reviewQueue(cards, 100)).toHaveLength(5);
  });

  it("dayNumber converts a timestamp to an integer day", () => {
    expect(dayNumber(0)).toBe(0);
    expect(dayNumber(86_400_000)).toBe(1);
    expect(dayNumber(86_400_000 * 2 + 123)).toBe(2);
  });
});
