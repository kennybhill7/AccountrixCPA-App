import { describe, expect, it } from "vitest";
import { summarizeSimProgress } from "@/lib/simProgress";
import type { AttemptEvent } from "@/lib/types";

const ev = (overrides: Partial<AttemptEvent>): AttemptEvent => ({
  id: crypto.randomUUID(),
  source: "workflow-task",
  itemId: "tbs:far-bonds-payable:t1",
  track: "cpa",
  skills: ["bonds-payable"],
  correct: true,
  answer: "x",
  ts: 1000,
  ...overrides,
});

describe("summarizeSimProgress", () => {
  it("returns empty state for a never-attempted sim", () => {
    expect(summarizeSimProgress([], "tbs", "far-bonds-payable", 4)).toEqual({
      submissions: 0,
      lastAccuracy: null,
      bestAccuracy: null,
      lastAttemptAt: null,
    });
  });

  it("summarizes latest and best accuracy from per-requirement TBS events", () => {
    const events = [
      ev({ itemId: "tbs:far-bonds-payable:t1", correct: true, ts: 100 }),
      ev({ itemId: "tbs:far-bonds-payable:t2", correct: false, ts: 101 }),
      ev({ itemId: "tbs:far-bonds-payable:t3", correct: false, ts: 102 }),
      ev({ itemId: "tbs:far-bonds-payable:t4", correct: false, ts: 103 }),
      ev({ itemId: "tbs:far-bonds-payable:t1", correct: true, ts: 200 }),
      ev({ itemId: "tbs:far-bonds-payable:t2", correct: true, ts: 201 }),
      ev({ itemId: "tbs:far-bonds-payable:t3", correct: true, ts: 202 }),
      ev({ itemId: "tbs:far-bonds-payable:t4", correct: false, ts: 203 }),
    ];

    const summary = summarizeSimProgress(events, "tbs", "far-bonds-payable", 4);
    expect(summary.submissions).toBe(2);
    expect(summary.lastAccuracy).toBe(75);
    expect(summary.bestAccuracy).toBe(75);
    expect(summary.lastAttemptAt).toBe(203);
  });

  it("ignores attempts from other sims and prefixes", () => {
    const events = [
      ev({ itemId: "essay:cma-p1-variance:r1", track: "cma", correct: false, ts: 200 }),
      ev({ itemId: "tbs:other:t1", correct: false, ts: 300 }),
      ev({ itemId: "tbs:far-bonds-payable:t1", correct: true, ts: 400 }),
    ];

    expect(summarizeSimProgress(events, "tbs", "far-bonds-payable", 1)).toMatchObject({
      submissions: 1,
      lastAccuracy: 100,
      bestAccuracy: 100,
    });
  });
});

