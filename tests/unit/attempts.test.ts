import { describe, it, expect, beforeEach } from "vitest";
import { useAttempts } from "@/lib/store";
import type { AttemptEvent } from "@/lib/types";

const base = {
  source: "quiz" as const,
  itemId: "cma:m1:w1:q0",
  track: "cma" as const,
  skills: ["budgeting"],
  correct: true,
  answer: 2,
};

function seedEvent(i: number, overrides: Partial<AttemptEvent> = {}): AttemptEvent {
  return {
    id: `e${i}`,
    ts: i,
    source: "quiz",
    itemId: `item-${i}`,
    track: "cma",
    skills: [],
    correct: true,
    answer: 0,
    ...overrides,
  };
}

describe("useAttempts (attempt-ledger store)", () => {
  beforeEach(() => {
    // zustand stores are module singletons; reset state between tests.
    useAttempts.setState({ events: [] });
  });

  it("record fills id and ts and returns the id", () => {
    const before = Date.now();
    const id = useAttempts.getState().record({ ...base });
    const after = Date.now();

    const events = useAttempts.getState().events;
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe(id);
    expect(id).toBeTruthy();
    expect(events[0].ts).toBeGreaterThanOrEqual(before);
    expect(events[0].ts).toBeLessThanOrEqual(after);
    expect(events[0].itemId).toBe("cma:m1:w1:q0");
    expect(events[0].correct).toBe(true);
  });

  it("record honors an explicit ts and generates unique ids", () => {
    const id1 = useAttempts.getState().record({ ...base, ts: 1234 });
    const id2 = useAttempts.getState().record({ ...base, ts: 5678 });

    const events = useAttempts.getState().events;
    expect(events[0].ts).toBe(1234);
    expect(events[1].ts).toBe(5678);
    expect(id1).not.toBe(id2);
  });

  it("drops the oldest 2,000 events once the 20,000 soft cap is exceeded", () => {
    const seed = Array.from({ length: 20_000 }, (_, i) => seedEvent(i));
    useAttempts.setState({ events: seed });

    const id = useAttempts.getState().record({ ...base });

    const events = useAttempts.getState().events;
    expect(events).toHaveLength(18_001);
    // oldest 2,000 shed; e2000 is now the head, the new event is the tail
    expect(events[0].id).toBe("e2000");
    expect(events[events.length - 1].id).toBe(id);
  });

  it("setErrorCategory tags only the target event", () => {
    const id1 = useAttempts.getState().record({ ...base, correct: false });
    const id2 = useAttempts.getState().record({ ...base, correct: false });

    useAttempts.getState().setErrorCategory(id1, "je-direction");

    const events = useAttempts.getState().events;
    expect(events.find((e) => e.id === id1)?.errorCategory).toBe("je-direction");
    expect(events.find((e) => e.id === id2)?.errorCategory).toBeUndefined();
  });

  it("setConfidence tags only the target event", () => {
    const id1 = useAttempts.getState().record({ ...base });
    const id2 = useAttempts.getState().record({ ...base });

    useAttempts.getState().setConfidence(id2, 2);

    const events = useAttempts.getState().events;
    expect(events.find((e) => e.id === id2)?.confidence).toBe(2);
    expect(events.find((e) => e.id === id1)?.confidence).toBeUndefined();
  });

  it("clear empties the ledger", () => {
    useAttempts.getState().record({ ...base });
    useAttempts.getState().clear();
    expect(useAttempts.getState().events).toHaveLength(0);
  });

  it("getBySkill matches any event tagged with the skill", () => {
    useAttempts.getState().record({ ...base, skills: ["budgeting", "variance-analysis"] });
    useAttempts.getState().record({ ...base, skills: ["tvm"] });

    expect(useAttempts.getState().getBySkill("variance-analysis")).toHaveLength(1);
    expect(useAttempts.getState().getBySkill("budgeting")).toHaveLength(1);
    expect(useAttempts.getState().getBySkill("wip")).toHaveLength(0);
  });

  it("getByTrack filters by track", () => {
    useAttempts.getState().record({ ...base, track: "cma" });
    useAttempts.getState().record({ ...base, track: "cpa" });
    useAttempts.getState().record({ ...base, track: "apply", source: "workflow-task" });

    expect(useAttempts.getState().getByTrack("cpa")).toHaveLength(1);
    expect(useAttempts.getState().getByTrack("apply")).toHaveLength(1);
    expect(useAttempts.getState().getByTrack("finance")).toHaveLength(0);
  });

  it("getRecent returns the n newest events, newest first", () => {
    useAttempts.getState().record({ ...base, itemId: "a", ts: 100 });
    useAttempts.getState().record({ ...base, itemId: "b", ts: 300 });
    useAttempts.getState().record({ ...base, itemId: "c", ts: 200 });

    const recent = useAttempts.getState().getRecent(2);
    expect(recent.map((e) => e.itemId)).toEqual(["b", "c"]);
    // does not mutate the stored order
    expect(useAttempts.getState().events.map((e) => e.itemId)).toEqual(["a", "b", "c"]);
  });
});
