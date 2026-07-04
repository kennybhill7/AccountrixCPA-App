import { describe, it, expect, beforeEach } from "vitest";
import { useSrs, type SrsMissMeta } from "@/lib/store";
import { DEFAULT_EASINESS } from "@/lib/spacedRepetition";

const meta = (itemId: string, overrides: Partial<SrsMissMeta> = {}): SrsMissMeta => ({
  itemId,
  skills: ["wip-schedule"],
  track: "cma",
  source: "quiz",
  label: `CMA m4-w1 ${itemId} — wip-schedule`,
  href: "/learn/m4/w1/quiz",
  ...overrides,
});

describe("useSrs (SRS queue store)", () => {
  beforeEach(() => {
    // zustand stores are module singletons; reset state between tests.
    useSrs.setState({ items: {} });
  });

  describe("upsertMiss", () => {
    it("creates a fresh item due today with routing metadata", () => {
      useSrs.getState().upsertMiss(meta("q1"), 100);

      const item = useSrs.getState().items["q1"];
      expect(item).toBeDefined();
      expect(item.dueDay).toBe(100); // due immediately
      expect(item.interval).toBe(0);
      expect(item.repetitions).toBe(0);
      expect(item.easiness).toBe(DEFAULT_EASINESS);
      expect(item.skills).toEqual(["wip-schedule"]);
      expect(item.track).toBe("cma");
      expect(item.source).toBe("quiz");
      expect(item.label).toBe("CMA m4-w1 q1 — wip-schedule");
      expect(item.href).toBe("/learn/m4/w1/quiz");
    });

    it("treats a repeat miss as a failed review (relearn: reps 0, interval 1)", () => {
      useSrs.getState().upsertMiss(meta("q1"), 100);
      // learner passed two reviews, then misses the item again in a quiz
      useSrs.getState().reviewItem("q1", 5, 100); // rep 1 → interval 1
      useSrs.getState().reviewItem("q1", 5, 101); // rep 2 → interval 6
      expect(useSrs.getState().items["q1"].repetitions).toBe(2);

      useSrs.getState().upsertMiss(meta("q1"), 107);

      const item = useSrs.getState().items["q1"];
      expect(item.repetitions).toBe(0); // relearn from scratch
      expect(item.interval).toBe(1);
      expect(item.dueDay).toBe(108); // nowDay + 1
      expect(item.easiness).toBeLessThan(DEFAULT_EASINESS); // quality-0 penalty
    });

    it("refreshes label/href metadata on a repeat miss", () => {
      useSrs.getState().upsertMiss(meta("q1"), 100);
      useSrs.getState().upsertMiss(meta("q1", { label: "new label", href: "/cpa/far-u1/w1" }), 101);

      const item = useSrs.getState().items["q1"];
      expect(item.label).toBe("new label");
      expect(item.href).toBe("/cpa/far-u1/w1");
    });
  });

  describe("reviewItem", () => {
    it("pass (quality 5) follows SM-2 intervals: 1, 6, then interval*easiness", () => {
      useSrs.getState().upsertMiss(meta("q1"), 100);

      useSrs.getState().reviewItem("q1", 5, 100);
      let item = useSrs.getState().items["q1"];
      expect(item.repetitions).toBe(1);
      expect(item.interval).toBe(1);
      expect(item.dueDay).toBe(101);

      useSrs.getState().reviewItem("q1", 5, 101);
      item = useSrs.getState().items["q1"];
      expect(item.repetitions).toBe(2);
      expect(item.interval).toBe(6);
      expect(item.dueDay).toBe(107);

      useSrs.getState().reviewItem("q1", 5, 107);
      item = useSrs.getState().items["q1"];
      expect(item.repetitions).toBe(3);
      expect(item.interval).toBe(Math.round(6 * item.easiness));
      expect(item.dueDay).toBe(107 + item.interval);
    });

    it("fail (quality 1) resets repetitions and reschedules for tomorrow", () => {
      useSrs.getState().upsertMiss(meta("q1"), 100);
      useSrs.getState().reviewItem("q1", 5, 100);
      useSrs.getState().reviewItem("q1", 5, 101);

      useSrs.getState().reviewItem("q1", 1, 107);

      const item = useSrs.getState().items["q1"];
      expect(item.repetitions).toBe(0);
      expect(item.interval).toBe(1);
      expect(item.dueDay).toBe(108);
    });

    it("is a no-op for an unknown itemId", () => {
      useSrs.getState().upsertMiss(meta("q1"), 100);
      useSrs.getState().reviewItem("nope", 5, 100);
      expect(Object.keys(useSrs.getState().items)).toEqual(["q1"]);
    });

    it("preserves routing metadata across reviews", () => {
      useSrs.getState().upsertMiss(meta("q1"), 100);
      useSrs.getState().reviewItem("q1", 5, 100);
      const item = useSrs.getState().items["q1"];
      expect(item.label).toBe("CMA m4-w1 q1 — wip-schedule");
      expect(item.href).toBe("/learn/m4/w1/quiz");
      expect(item.track).toBe("cma");
    });
  });

  describe("due / dueCount", () => {
    it("returns only items due on/before nowDay, most overdue first", () => {
      useSrs.getState().upsertMiss(meta("a"), 95); // most overdue
      useSrs.getState().upsertMiss(meta("b"), 100); // due today
      useSrs.getState().upsertMiss(meta("c"), 98);
      useSrs.getState().upsertMiss(meta("d"), 100);
      // push d into the future
      useSrs.getState().reviewItem("d", 5, 100); // dueDay 101

      const due = useSrs.getState().due(100);
      expect(due.map((i) => i.id)).toEqual(["a", "c", "b"]);
      expect(useSrs.getState().dueCount(100)).toBe(3);
    });

    it("honors the limit", () => {
      useSrs.getState().upsertMiss(meta("a"), 95);
      useSrs.getState().upsertMiss(meta("b"), 96);
      useSrs.getState().upsertMiss(meta("c"), 97);

      const due = useSrs.getState().due(100, 2);
      expect(due.map((i) => i.id)).toEqual(["a", "b"]);
    });

    it("counts nothing when everything is scheduled in the future", () => {
      useSrs.getState().upsertMiss(meta("a"), 100);
      useSrs.getState().reviewItem("a", 5, 100); // due 101
      expect(useSrs.getState().dueCount(100)).toBe(0);
      expect(useSrs.getState().due(100)).toEqual([]);
    });
  });

  it("clear empties the queue", () => {
    useSrs.getState().upsertMiss(meta("a"), 100);
    useSrs.getState().clear();
    expect(useSrs.getState().items).toEqual({});
  });
});
