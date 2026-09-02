import { describe, it, expect } from "vitest";
import {
  planDay,
  buildSessions,
  buildWeeklyOperatingPlan,
  DEFAULT_WEIGHTS,
  LANES,
  type DayPlan,
} from "../../lib/missionControl";

const sum = (p: DayPlan) => p.lanes.reduce((s, b) => s + b.minutes, 0) + p.reviewMinutes;

describe("missionControl.planDay", () => {
  it("default weights sum to 1", () => {
    const w = DEFAULT_WEIGHTS;
    expect(w.cma + w.cpa + w.finance + w.cfo).toBeCloseTo(1, 6);
  });

  it("produces a balanced 75-minute day from the 45/30/20/5 mix", () => {
    const plan = planDay(75);
    const byLane = Object.fromEntries(plan.lanes.map((b) => [b.lane, b.minutes]));
    expect(byLane.cma).toBe(30);
    expect(byLane.cpa).toBe(20);
    expect(byLane.finance).toBe(15);
    expect(byLane.cfo).toBe(5);
    expect(plan.reviewMinutes).toBe(5);
    expect(sum(plan)).toBe(75);
  });

  it("always ties exactly to the total budget (various budgets)", () => {
    for (const total of [30, 45, 60, 75, 90, 120, 47, 53]) {
      expect(sum(planDay(total))).toBe(total);
    }
  });

  it("keeps CMA the largest lane (highest weight)", () => {
    const plan = planDay(120);
    expect(plan.lanes[0].lane).toBe("cma");
  });

  it("respects custom weights", () => {
    const plan = planDay(
      100,
      { cma: 0.25, cpa: 0.25, finance: 0.25, cfo: 0.25 },
      { reviewMinutes: 0 }
    );
    const minutes = plan.lanes.map((b) => b.minutes);
    expect(sum(plan)).toBe(100);
    // even weights → blocks within one rounding step of each other
    expect(Math.max(...minutes) - Math.min(...minutes)).toBeLessThanOrEqual(5);
  });

  it("drops a lane below the minimum block size", () => {
    // tiny cfo weight at a small budget should fall below minBlock and be dropped
    const plan = planDay(40, { cma: 0.6, cpa: 0.3, finance: 0.09, cfo: 0.01 });
    expect(plan.lanes.find((b) => b.lane === "cfo")).toBeUndefined();
    expect(sum(plan)).toBe(40);
  });

  it("handles a zero/empty budget", () => {
    const plan = planDay(0);
    expect(plan.lanes).toHaveLength(0);
    expect(plan.totalMinutes).toBe(0);
  });

  it("buildSessions appends a review block and labels via pickNext", () => {
    const plan = planDay(75);
    const sessions = buildSessions(plan, (lane, m) => `${lane.toUpperCase()} ${m}m`);
    expect(sessions[0].label).toMatch(/CMA 30m/);
    const review = sessions[sessions.length - 1];
    expect(review.lane).toBe("review");
    expect(review.minutes).toBe(5);
  });

  it("exposes all four lanes", () => {
    expect(LANES).toEqual(["cma", "cpa", "finance", "cfo"]);
  });
});

describe("missionControl.buildWeeklyOperatingPlan", () => {
  it("uses weakest observed skills in the weekly plan labels", () => {
    const plan = buildWeeklyOperatingPlan({
      hoursPerWeek: 9,
      weakestByLane: {
        cma: "wip-schedule",
        cpa: "audit-evidence",
        finance: "tvm",
        cfo: "journal-entries",
      },
    });

    expect(plan.hours).toBe(9);
    expect(plan.minutesPerDay).toBe(90);
    expect(plan.days.find((d) => d.day === "Mon")?.focus).toContain("wip-schedule");
    expect(plan.days.find((d) => d.day === "Tue")?.focus).toContain("audit-evidence");
    expect(plan.days.find((d) => d.day === "Wed")?.focus).toContain("tvm");
    expect(plan.days.find((d) => d.day === "Sat")?.focus).toContain("journal-entries");
  });

  it("routes a heavy SRS backlog to today's plan instead of waiting for Sunday", () => {
    const plan = buildWeeklyOperatingPlan({
      dueCount: 14,
      todayIndex: 2, // Tuesday
    });

    const tue = plan.days.find((d) => d.day === "Tue");
    expect(tue?.href).toBe("/mistakes");
    expect(tue?.focus).toBe("SRS backlog first: 14 due + Mistake Bank cleanup");
    expect(plan.days.find((d) => d.day === "Sun")?.focus).toContain("14 due");
  });
});
