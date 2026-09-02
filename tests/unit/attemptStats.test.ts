import { describe, it, expect } from "vitest";
import { skillStatsFromAttempts, missEventsFromAttempts } from "@/lib/attemptStats";
import { dayNumber } from "@/lib/spacedRepetition";
import { topPatterns } from "@/lib/errorClassify";
import type { AttemptEvent } from "@/lib/types";

const DAY = 86_400_000;

function ev(overrides: Partial<AttemptEvent> = {}): AttemptEvent {
  return {
    id: Math.random().toString(36).slice(2),
    source: "quiz",
    itemId: "cma:m1:w1:q0",
    track: "cma",
    skills: ["budgeting"],
    correct: true,
    answer: 0,
    ts: 10 * DAY,
    ...overrides,
  };
}

describe("skillStatsFromAttempts", () => {
  it("fans a multi-skill event out to every skill it is tagged with", () => {
    const stats = skillStatsFromAttempts([
      ev({ skills: ["budgeting", "variance-analysis"], correct: false }),
      ev({ skills: ["budgeting"] }),
    ]);

    const budgeting = stats.find((s) => s.skill === "budgeting");
    const variance = stats.find((s) => s.skill === "variance-analysis");
    expect(budgeting).toMatchObject({ attempts: 2, correct: 1 });
    expect(variance).toMatchObject({ attempts: 1, correct: 0 });
    expect(stats).toHaveLength(2);
  });

  it("computes lastDay as dayNumber of the most recent ts per skill", () => {
    const stats = skillStatsFromAttempts([
      ev({ ts: 3 * DAY }),
      ev({ ts: 7 * DAY + 5000 }),
      ev({ ts: 5 * DAY }),
    ]);
    expect(stats[0].lastDay).toBe(dayNumber(7 * DAY + 5000));
    expect(stats[0].lastDay).toBe(7);
  });

  it("averages timeSec only over events that carry it", () => {
    const stats = skillStatsFromAttempts([
      ev({ timeSec: 30 }),
      ev({ timeSec: 60 }),
      ev({}), // no timeSec — excluded from the average
    ]);
    expect(stats[0].attempts).toBe(3);
    expect(stats[0].avgTimeSec).toBe(45);
  });

  it("omits avgTimeSec when no event has timeSec", () => {
    const stats = skillStatsFromAttempts([ev({})]);
    expect(stats[0].avgTimeSec).toBeUndefined();
  });

  it("maps confidence 0/1/2 to 0.25/0.6/0.9 averaged over events that carry it", () => {
    const stats = skillStatsFromAttempts([
      ev({ confidence: 0 }),
      ev({ confidence: 2 }),
      ev({}), // no confidence — excluded
    ]);
    expect(stats[0].avgConfidence).toBeCloseTo((0.25 + 0.9) / 2, 10);

    const medOnly = skillStatsFromAttempts([ev({ confidence: 1 })]);
    expect(medOnly[0].avgConfidence).toBeCloseTo(0.6, 10);

    const none = skillStatsFromAttempts([ev({})]);
    expect(none[0].avgConfidence).toBeUndefined();
  });

  it("takes targetTimeSec from opts per skill", () => {
    const stats = skillStatsFromAttempts(
      [ev({ skills: ["budgeting", "tvm"], timeSec: 90 })],
      { targetTimeSec: { budgeting: 75 } }
    );
    expect(stats.find((s) => s.skill === "budgeting")?.targetTimeSec).toBe(75);
    expect(stats.find((s) => s.skill === "tvm")?.targetTimeSec).toBeUndefined();
  });
});

describe("missEventsFromAttempts", () => {
  it("keeps only wrong answers that carry an errorCategory", () => {
    const misses = missEventsFromAttempts([
      ev({ correct: false, errorCategory: "je-direction", itemId: "x:t1" }),
      ev({ correct: false }), // untagged miss — excluded
      ev({ correct: true, errorCategory: "misread" }), // correct — excluded
    ]);

    expect(misses).toHaveLength(1);
    expect(misses[0]).toEqual({
      skills: ["budgeting"],
      category: "je-direction",
      itemId: "x:t1",
    });
  });

  it("feeds topPatterns to surface the recurring error pattern", () => {
    const events: AttemptEvent[] = [
      ev({ correct: false, errorCategory: "je-direction", skills: ["journal-entries"] }),
      ev({ correct: false, errorCategory: "je-direction", skills: ["journal-entries"] }),
      ev({ correct: false, errorCategory: "misread", skills: ["budgeting"] }),
      ev({ correct: true }),
    ];

    const patterns = topPatterns(missEventsFromAttempts(events), 2);
    // je-direction (category) and journal-entries (skill) both count 2
    expect(patterns).toHaveLength(2);
    expect(patterns.map((p) => p.key).sort()).toEqual(["je-direction", "journal-entries"]);
    expect(patterns.every((p) => p.count === 2)).toBe(true);
  });
});
