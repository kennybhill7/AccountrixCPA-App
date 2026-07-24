import { describe, it, expect } from "vitest";
import { generateStudyPlan, studyDates, summarizePlan } from "@/lib/studyPlan";

// Fixed dates so the generator stays deterministic and tz-agnostic-enough for CI.
const OPTS = {
  startISO: "2026-08-03", // Monday
  examISO: "2026-08-31", // Monday, 4 weeks out
  weekdays: [1, 3, 5], // Mon/Wed/Fri
  minutesPerDay: 60,
  focus: "finance" as const,
};

describe("studyDates", () => {
  it("enumerates only the selected weekdays within range, inclusive", () => {
    const dates = studyDates(OPTS.startISO, OPTS.examISO, OPTS.weekdays);
    expect(dates.length).toBe(13); // 4 full M/W/F weeks + the final Monday
    expect(dates.every((d) => OPTS.weekdays.includes(d.getDay()))).toBe(true);
  });

  it("returns [] when the exam is before the start or no weekdays are chosen", () => {
    expect(studyDates("2026-08-31", "2026-08-03", OPTS.weekdays)).toEqual([]);
    expect(studyDates(OPTS.startISO, OPTS.examISO, [])).toEqual([]);
  });
});

describe("generateStudyPlan", () => {
  it("produces one PlanDay per study date", () => {
    const plan = generateStudyPlan(OPTS);
    expect(plan.length).toBe(13);
    expect(plan[0].dateISO).toBe("2026-08-03");
  });

  it("ends on a full mock + review the final study day", () => {
    const plan = generateStudyPlan(OPTS);
    const last = plan[plan.length - 1];
    expect(last.isMock).toBe(true);
    expect(last.tasks.map((t) => t.type)).toEqual(["mock", "review"]);
    expect(last.tasks[0].href).toBe("/exam");
  });

  it("schedules at least one interim mock checkpoint", () => {
    const plan = generateStudyPlan(OPTS);
    expect(plan.filter((d) => d.isMock).length).toBeGreaterThanOrEqual(2);
  });

  it("targets drills at supplied weak-area labels", () => {
    const plan = generateStudyPlan({ ...OPTS, weakLabels: ["Bond Valuation"] });
    const drill = plan.find((d) => d.tasks.some((t) => t.type === "drill"));
    expect(drill?.tasks.some((t) => t.title.includes("Bond Valuation"))).toBe(true);
  });

  it("summarizes days, mocks, and total time", () => {
    const plan = generateStudyPlan(OPTS);
    const s = summarizePlan(plan);
    expect(s.studyDays).toBe(13);
    expect(s.mockCount).toBeGreaterThanOrEqual(2);
    expect(s.totalMinutes).toBeGreaterThan(0);
  });

  it("returns [] with an impossible window", () => {
    expect(generateStudyPlan({ ...OPTS, examISO: "2026-07-01" })).toEqual([]);
  });
});
