import { describe, it, expect } from "vitest";
import {
  DEFAULT_EXAM_HOURS_PER_PART,
  IMA_TESTING_WINDOWS,
  allocateWeeksByWeight,
  buildExamTimeline,
  isImaTestingWindow,
  nextDrillArea,
  observedDrillMix,
  planDrillSequence,
  targetDrillMix,
  type ExamTimelineOpts,
} from "@/lib/studyPlan";
import { CMA_PART_1_AREAS, CMA_PART_2_AREAS } from "@/lib/examSections";

/**
 * Ken's real scenario: today 2026-09-02, sitting CMA Part 1 in the May/June
 * 2027 IMA window. ~39 weeks out.
 */
const BASE: ExamTimelineOpts = {
  startISO: "2026-09-02",
  examISO: "2027-06-01",
  sectionId: "cma-p1",
  weekdays: [1, 2, 3, 4, 5],
  minutesPerDay: 60,
};

/* ========================== IMA testing windows ========================== */

describe("isImaTestingWindow", () => {
  it("accepts the three published windows", () => {
    expect(isImaTestingWindow("2027-01-20").windowLabel).toBe("January/February");
    expect(isImaTestingWindow("2027-02-10").inWindow).toBe(true);
    expect(isImaTestingWindow("2027-05-15").windowLabel).toBe("May/June");
    expect(isImaTestingWindow("2027-06-30").inWindow).toBe(true);
    expect(isImaTestingWindow("2027-09-05").windowLabel).toBe("September/October");
    expect(isImaTestingWindow("2027-10-31").inWindow).toBe(true);
  });

  it("REJECTS July 2027 — July is not an IMA testing window", () => {
    const check = isImaTestingWindow("2027-07-15");
    expect(check.inWindow).toBe(false);
    expect(check.windowLabel).toBeNull();
    expect(check.nextWindowLabel).toBe("September/October");
    expect(check.note).toMatch(/NOT in an IMA testing window/);
  });

  it("rejects the other dead months and names the next real window", () => {
    expect(isImaTestingWindow("2027-03-10").nextWindowLabel).toBe("May/June");
    expect(isImaTestingWindow("2027-04-01").nextWindowLabel).toBe("May/June");
    expect(isImaTestingWindow("2027-08-20").nextWindowLabel).toBe("September/October");
    // November/December wrap around to the following January/February.
    expect(isImaTestingWindow("2027-11-04").nextWindowLabel).toBe("January/February");
    expect(isImaTestingWindow("2027-12-15").inWindow).toBe(false);
  });

  it("covers exactly six months of the year and no more", () => {
    const months = IMA_TESTING_WINDOWS.flatMap((w) => w.months);
    expect(months.sort((a, b) => a - b)).toEqual([1, 2, 5, 6, 9, 10]);
  });
});

/* ======================== weight-driven allocation ======================= */

describe("allocateWeeksByWeight", () => {
  it("sums to the total exactly (largest remainder, no drift)", () => {
    for (const weeks of [0, 1, 5, 6, 12, 13, 24, 25, 37, 100]) {
      const alloc = allocateWeeksByWeight(CMA_PART_2_AREAS, weeks);
      const sum = Object.values(alloc).reduce((a, b) => a + b, 0);
      expect(sum, `total ${weeks}`).toBe(Math.max(0, weeks));
    }
  });

  it("gives the 25% area more weeks than the 10% area — the flat-allocation fix", () => {
    const alloc = allocateWeeksByWeight(CMA_PART_2_AREAS, 20);
    // C = Business Decision Analysis 25%, D = Enterprise Risk Management 10%.
    expect(alloc["cma-p2-c"]).toBe(5);
    expect(alloc["cma-p2-d"]).toBe(2);
    expect(alloc["cma-p2-c"]).toBeGreaterThan(alloc["cma-p2-d"]);
  });

  it("tracks the blueprint proportions closely at realistic sizes", () => {
    const alloc = allocateWeeksByWeight(CMA_PART_1_AREAS, 24);
    // 15/20/20/15/15/15 of 24 → 3.6/4.8/4.8/3.6/3.6/3.6
    expect(alloc["cma-p1-b"]).toBe(5);
    expect(alloc["cma-p1-c"]).toBe(5);
    expect(Object.values(alloc).reduce((a, b) => a + b, 0)).toBe(24);
  });

  it("handles empty areas and non-positive totals without throwing", () => {
    expect(allocateWeeksByWeight([], 10)).toEqual({});
    const zero = allocateWeeksByWeight(CMA_PART_1_AREAS, 0);
    expect(Object.values(zero).every((v) => v === 0)).toBe(true);
    expect(Object.values(allocateWeeksByWeight(CMA_PART_1_AREAS, -5)).every((v) => v === 0)).toBe(
      true
    );
  });
});

/* ============================= backward pass ============================= */

describe("buildExamTimeline — backward pass", () => {
  it("phases tile the window contiguously and end exactly on the exam date", () => {
    const t = buildExamTimeline(BASE);
    expect(t.phases.length).toBeGreaterThan(2);
    expect(t.phases[0].startISO).toBe(BASE.startISO);
    expect(t.phases[t.phases.length - 1].endISO).toBe(BASE.examISO);

    // Each phase starts the day after the previous one ends — no gaps, no overlap.
    for (let i = 1; i < t.phases.length; i++) {
      const prevEnd = new Date(`${t.phases[i - 1].endISO}T00:00:00`);
      const start = new Date(`${t.phases[i].startISO}T00:00:00`);
      expect(Math.round((start.getTime() - prevEnd.getTime()) / 86_400_000)).toBe(1);
    }
  });

  it("runs first-pass → coverage → exam-mode in that order", () => {
    const kinds = buildExamTimeline(BASE).phases.map((p) => p.kind);
    expect(kinds[0]).toBe("first-pass");
    expect(kinds[kinds.length - 1]).toBe("exam-mode");
    expect(kinds.filter((k) => k === "exam-mode")).toHaveLength(1);
    expect(kinds.filter((k) => k === "first-pass")).toHaveLength(1);
    // Coverage sits strictly between them.
    const firstCoverage = kinds.indexOf("coverage");
    const lastCoverage = kinds.lastIndexOf("coverage");
    expect(firstCoverage).toBe(1);
    expect(lastCoverage).toBe(kinds.length - 2);
  });

  it("closes with an ~8-week exam-mode block", () => {
    const t = buildExamTimeline(BASE);
    const examMode = t.phases[t.phases.length - 1];
    expect(examMode.kind).toBe("exam-mode");
    // 8 weeks plus any remainder days the whole-week tiling left over.
    expect(examMode.weeks).toBeGreaterThanOrEqual(8);
    expect(examMode.weeks).toBeLessThan(9.2);
  });

  it("honours an overridden exam-mode length", () => {
    const t = buildExamTimeline({ ...BASE, examModeWeeks: 12 });
    const examMode = t.phases[t.phases.length - 1];
    expect(examMode.weeks).toBeGreaterThanOrEqual(12);
  });

  it("weights coverage blocks by the IMA blueprint, not flatly", () => {
    const t = buildExamTimeline({ ...BASE, sectionId: "cma-p2" });
    const coverage = t.phases.filter((p) => p.kind === "coverage");
    const byArea = new Map(coverage.map((p) => [p.areaId!, p.weeks]));
    // 25% Business Decision Analysis must beat 10% Enterprise Risk Management.
    expect(byArea.get("cma-p2-c")!).toBeGreaterThan(byArea.get("cma-p2-d")!);
    // Every coverage phase carries its official weight for the UI to show.
    for (const p of coverage) {
      expect(p.areaWeight).toBeGreaterThan(0);
      expect(p.label).toContain(`${Math.round(p.areaWeight! * 100)}%`);
    }
  });

  it("returns no phases when the exam is not after the start", () => {
    const t = buildExamTimeline({ ...BASE, examISO: "2026-08-01" });
    expect(t.phases).toEqual([]);
    expect(t.feasibility.feasible).toBe(false);
    expect(t.feasibility.verdict).toMatch(/no plan to build/);
  });

  it("surfaces the testing-window verdict on the timeline itself", () => {
    expect(buildExamTimeline(BASE).window.inWindow).toBe(true);
    const july = buildExamTimeline({ ...BASE, examISO: "2027-07-14" });
    expect(july.window.inWindow).toBe(false);
    // Still builds a plan — it just tells the truth about the date.
    expect(july.phases.length).toBeGreaterThan(0);
  });

  it("degrades to exam-mode only, and names the starved areas, in a short window", () => {
    const t = buildExamTimeline({ ...BASE, examISO: "2026-10-14" }); // ~6 weeks
    expect(t.totalWeeks).toBeLessThan(8);
    expect(t.phases.map((p) => p.kind)).toEqual(["exam-mode"]);
    expect(t.unallocatedAreas).toHaveLength(CMA_PART_1_AREAS.length);
  });
});

/* ============================== feasibility ============================== */

describe("buildExamTimeline — hours feasibility", () => {
  it("uses the 300 h/part anchor by default", () => {
    expect(DEFAULT_EXAM_HOURS_PER_PART).toBe(300);
    expect(buildExamTimeline(BASE).feasibility.requiredHours).toBe(300);
  });

  it("passes a schedule that clears the anchor", () => {
    // 6 days x 90 min = 9 h/wk over ~39.1 weeks ≈ 352 h > 300.
    const f = buildExamTimeline({
      ...BASE,
      weekdays: [1, 2, 3, 4, 5, 6],
      minutesPerDay: 90,
    }).feasibility;
    expect(f.plannedHoursPerWeek).toBe(9);
    expect(f.plannedTotalHours).toBeGreaterThanOrEqual(300);
    expect(f.feasible).toBe(true);
    expect(f.shortfallHours).toBe(0);
    expect(f.verdict).toMatch(/^Workable:/);
  });

  it("catches a NEAR miss rather than rounding it away", () => {
    // Ken's likely setup — weeknights only, 90 min/day: 5 x 1.5 = 7.5 h/wk over
    // ~39.1 weeks = 293 h. Seven hours short of 300, and it must SAY so.
    const f = buildExamTimeline({ ...BASE, minutesPerDay: 90 }).feasibility;
    expect(f.plannedHoursPerWeek).toBe(7.5);
    expect(f.plannedTotalHours).toBe(293);
    expect(f.feasible).toBe(false);
    expect(f.shortfallHours).toBe(7);
    expect(f.verdict).toMatch(/THIS PLAN CANNOT WORK AS CONFIGURED/);
  });

  it("says plainly that the plan CANNOT work when the hours do not fit", () => {
    // 2 days x 45 min = 1.5 h/wk over ~39 weeks ≈ 59 h against a 300 h anchor.
    const f = buildExamTimeline({ ...BASE, weekdays: [2, 4], minutesPerDay: 45 }).feasibility;
    expect(f.feasible).toBe(false);
    expect(f.shortfallHours).toBeGreaterThan(200);
    expect(f.verdict).toMatch(/THIS PLAN CANNOT WORK AS CONFIGURED/);
    // It must quantify the gap and name the remedies rather than just failing.
    expect(f.verdict).toContain(`${f.shortfallHours} h short`);
    expect(f.verdict).toMatch(/Add study days, raise minutes\/day, or move the exam/);
  });

  it("reports required hours/week from the weeks actually remaining", () => {
    const f = buildExamTimeline(BASE).feasibility;
    expect(f.weeksRemaining).toBeCloseTo(39, 0);
    // 300 h / ~39 wk ≈ 7.7 h/wk
    expect(f.requiredHoursPerWeek).toBeGreaterThan(7);
    expect(f.requiredHoursPerWeek).toBeLessThan(8.5);
  });

  it("respects an overridden hours anchor", () => {
    const f = buildExamTimeline({ ...BASE, requiredHours: 170 }).feasibility;
    expect(f.requiredHours).toBe(170);
    expect(f.feasible).toBe(true); // 5 h/wk x 39 wk = 195 h > 170
  });

  it("flags a window too short for the hours at any sane intensity", () => {
    const f = buildExamTimeline({ ...BASE, examISO: "2026-10-01" }).feasibility;
    expect(f.feasible).toBe(false);
    expect(f.requiredHoursPerWeek).toBeGreaterThan(60);
  });
});

/* ======================= blueprint-weighted drills ======================= */

describe("blueprint-weighted drill selection", () => {
  const areas = CMA_PART_2_AREAS;

  it("targets the raw blueprint when there is no weakness signal", () => {
    const mix = targetDrillMix({ areas });
    expect(mix["cma-p2-c"]).toBeCloseTo(0.25, 10);
    expect(mix["cma-p2-d"]).toBeCloseTo(0.1, 10);
    expect(Object.values(mix).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });

  it("ignores weakness entirely at boost 0", () => {
    const mix = targetDrillMix({
      areas,
      weakness: { "cma-p2-d": 1 },
      weaknessBoost: 0,
    });
    expect(mix["cma-p2-d"]).toBeCloseTo(0.1, 10);
  });

  it("tilts toward measured weakness without abandoning the blueprint", () => {
    const mix = targetDrillMix({ areas, weakness: { "cma-p2-d": 1 }, weaknessBoost: 0.5 });
    // Weak 10% area gains share…
    expect(mix["cma-p2-d"]).toBeGreaterThan(0.1);
    // …but a 25% area it is not weak in still outranks it.
    expect(mix["cma-p2-c"]).toBeGreaterThan(mix["cma-p2-d"]);
    expect(Object.values(mix).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });

  it("clamps out-of-range weakness values", () => {
    const hi = targetDrillMix({ areas, weakness: { "cma-p2-d": 99 } });
    const one = targetDrillMix({ areas, weakness: { "cma-p2-d": 1 } });
    expect(hi["cma-p2-d"]).toBeCloseTo(one["cma-p2-d"], 10);
    const lo = targetDrillMix({ areas, weakness: { "cma-p2-d": -5 } });
    expect(lo["cma-p2-d"]).toBeCloseTo(0.1, 10);
  });

  it("converges the observed mix on the blueprint over a long run", () => {
    const seq = planDrillSequence(400, { areas });
    const counts: Record<string, number> = {};
    for (const id of seq) counts[id] = (counts[id] ?? 0) + 1;
    const mix = observedDrillMix(areas, counts);
    for (const a of areas) {
      expect(
        Math.abs(mix[a.id] - a.weight),
        `${a.label}: observed ${mix[a.id]} vs blueprint ${a.weight}`
      ).toBeLessThan(0.01);
    }
  });

  it("keeps every area within ~1 item of its fair share at all times", () => {
    const target = targetDrillMix({ areas });
    const counts: Record<string, number> = {};
    const seq = planDrillSequence(120, { areas });
    seq.forEach((id, i) => {
      counts[id] = (counts[id] ?? 0) + 1;
      const n = i + 1;
      for (const a of areas) {
        const fair = target[a.id] * n;
        expect(Math.abs((counts[a.id] ?? 0) - fair)).toBeLessThan(1.5);
      }
    });
  });

  it("self-corrects a mix that is already skewed", () => {
    // 30 items all dumped into the 10% Risk area: the next picks must avoid it.
    const seq = planDrillSequence(20, { areas, observed: { "cma-p2-d": 30 } });
    expect(seq).not.toContain("cma-p2-d");
    expect(seq[0]).toBe("cma-p2-c"); // biggest deficit = the 25% area
  });

  it("is deterministic — same input, same sequence", () => {
    const opts = { areas, weakness: { "cma-p2-a": 0.8 }, weaknessBoost: 0.5 };
    expect(planDrillSequence(50, opts)).toEqual(planDrillSequence(50, opts));
  });

  it("drills a weak area more often than the blueprint alone would", () => {
    const flat = planDrillSequence(200, { areas }).filter((id) => id === "cma-p2-d").length;
    const weak = planDrillSequence(200, {
      areas,
      weakness: { "cma-p2-d": 1 },
      weaknessBoost: 0.5,
    }).filter((id) => id === "cma-p2-d").length;
    expect(weak).toBeGreaterThan(flat);
  });

  it("returns null / empty when there are no areas to draw from", () => {
    expect(nextDrillArea({ areas: [] })).toBeNull();
    expect(planDrillSequence(10, { areas: [] })).toEqual([]);
    expect(planDrillSequence(-3, { areas })).toEqual([]);
  });

  it("observedDrillMix reports all-zero shares before anything is drilled", () => {
    const mix = observedDrillMix(areas, {});
    expect(Object.values(mix).every((v) => v === 0)).toBe(true);
  });

  it("works the same way for Part 1 areas", () => {
    const seq = planDrillSequence(200, { areas: CMA_PART_1_AREAS });
    const counts: Record<string, number> = {};
    for (const id of seq) counts[id] = (counts[id] ?? 0) + 1;
    const mix = observedDrillMix(CMA_PART_1_AREAS, counts);
    // B and C are 20% each; A, D, E, F are 15% each.
    expect(mix["cma-p1-b"]).toBeGreaterThan(mix["cma-p1-a"]);
    expect(mix["cma-p1-c"]).toBeCloseTo(0.2, 2);
  });
});

describe("buildExamTimeline — unknown section fails loudly, not open", () => {
  const base = {
    startISO: "2026-09-02",
    examISO: "2027-06-01",
    weekdays: [1, 2, 3, 4, 5, 6],
    minutesPerDay: 90,
  };

  it("warns when the sectionId yields no blueprint areas", () => {
    const t = buildExamTimeline({ ...base, sectionId: "bogus-section" });
    expect(t.warnings.length).toBeGreaterThan(0);
    expect(t.warnings[0]).toMatch(/no blueprint areas/i);
    expect(t.phases.some((p) => p.kind === "coverage")).toBe(false);
  });

  it("emits no warning and full weighted coverage for a real section", () => {
    const t = buildExamTimeline({ ...base, sectionId: "cma-p1" });
    expect(t.warnings).toEqual([]);
    const coverage = t.phases.filter((p) => p.kind === "coverage");
    expect(coverage).toHaveLength(6);
    // Coverage weeks must track the 15/20/20/15/15/15 blueprint, so the two
    // 20% areas each get more weeks than any 15% area.
    const byId = Object.fromEntries(coverage.map((p) => [p.areaId, p.weeks]));
    expect(byId["cma-p1-b"]).toBeGreaterThan(byId["cma-p1-a"]);
    expect(byId["cma-p1-c"]).toBeGreaterThan(byId["cma-p1-f"]);
    // Exam mode stays the closing block, not the whole window.
    expect(t.phases.at(-1)?.kind).toBe("exam-mode");
    expect(t.phases.at(-1)?.weeks).toBe(8);
  });
});
