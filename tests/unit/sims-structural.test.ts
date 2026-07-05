import { describe, expect, it } from "vitest";
import { loadTbsSims, loadEssaySims } from "@/lib/sims-content";
import { gradeTask } from "@/components/ApplyWorkflowClient";
import { gradeNarrativeText } from "@/lib/narrativeGrading";
import type { WorkflowTask } from "@/lib/case-workflows";

/**
 * Generic structural validation over EVERY authored sim (auto-discovered by the
 * loaders), so any new TBS or essay — even one without a bespoke tie-out test —
 * still gets baseline guarantees: valid task shapes, balanced journal entries,
 * and model answers that are reachable and actually pass their own grader.
 *
 * This complements the per-sim arithmetic tie-out tests; it catches the class
 * of mistake (unbalanced JE, unreachable word floor, a model answer the grader
 * would reject) rather than specific numbers.
 */

const tbs = await loadTbsSims();
const essays = await loadEssaySims();

describe("TBS sims — structural invariants", () => {
  it("at least one TBS sim is authored", () => {
    expect(tbs.length).toBeGreaterThan(0);
  });

  for (const sim of tbs) {
    describe(sim.id, () => {
      it("has core metadata", () => {
        expect(sim.section).toBeTruthy();
        expect(sim.title).toBeTruthy();
        expect(sim.timeMinutes).toBeGreaterThan(0);
        expect(sim.skills.length).toBeGreaterThan(0);
        expect(sim.scenario.length).toBeGreaterThan(20);
        expect(sim.tasks.length).toBeGreaterThan(0);
      });

      for (const task of sim.tasks as WorkflowTask[]) {
        it(`task ${task.id}: valid shape`, () => {
          expect(task.prompt).toBeTruthy();
          expect(["calc", "je", "writeup", "select"]).toContain(task.type);
          expect(task.explanation, `${sim.id}/${task.id} needs an explanation`).toBeTruthy();
          if (task.tolerance != null) expect(task.tolerance).toBeGreaterThanOrEqual(0);
        });

        if (task.type === "calc") {
          it(`task ${task.id}: calc expects finite numbers`, () => {
            const expected = task.expected as Record<string, unknown>;
            const keys = Object.keys(expected);
            expect(keys.length).toBeGreaterThan(0);
            for (const k of keys) expect(Number.isFinite(Number(expected[k]))).toBe(true);
          });

          it(`task ${task.id}: calc accepts its own expected answer`, () => {
            const expected = task.expected as Record<string, unknown>;
            const result = gradeTask(task, JSON.stringify(expected));
            expect(result.passed, `${sim.id}/${task.id}: ${result.message}`).toBe(true);
          });
        }

        if (task.type === "je") {
          it(`task ${task.id}: journal entry balances`, () => {
            const entries = (task.expected as { entries?: Array<{ account: string; debit: number; credit: number }> })
              .entries;
            expect(Array.isArray(entries)).toBe(true);
            expect(entries!.length).toBeGreaterThanOrEqual(2);
            const dr = entries!.reduce((n, e) => n + Number(e.debit || 0), 0);
            const cr = entries!.reduce((n, e) => n + Number(e.credit || 0), 0);
            expect(Math.abs(dr - cr), `${sim.id}/${task.id} JE dr=${dr} cr=${cr}`).toBeLessThanOrEqual(
              typeof task.tolerance === "number" ? task.tolerance : 0
            );
            for (const e of entries!) expect(String(e.account).length).toBeGreaterThan(0);
          });
        }

        if (task.type === "writeup") {
          it(`task ${task.id}: writeup has a concept/keyword checklist`, () => {
            const expected = task.expected as { keywords?: unknown[]; concepts?: unknown[] };
            const hasChecklist =
              (Array.isArray(expected.keywords) && expected.keywords.length > 0) ||
              (Array.isArray(expected.concepts) && expected.concepts.length > 0);
            expect(hasChecklist).toBe(true);
          });
        }
      }
    });
  }
});

describe("Essay sims — structural invariants", () => {
  for (const essay of essays) {
    describe(essay.id, () => {
      it("has core metadata and requirements", () => {
        expect(essay.part).toBeTruthy();
        expect(essay.title).toBeTruthy();
        expect(essay.timeMinutes).toBeGreaterThan(0);
        expect(essay.skills.length).toBeGreaterThan(0);
        expect(essay.requirements.length).toBeGreaterThan(0);
      });

      for (const req of essay.requirements) {
        it(`req ${req.id}: has a checklist, a reachable word floor, and a model answer`, () => {
          const hasChecklist =
            (req.concepts?.length ?? 0) > 0 || (req.keywords?.length ?? 0) > 0;
          expect(hasChecklist).toBe(true);
          expect(req.minWords).toBeGreaterThan(0);
          expect(req.modelAnswer.trim().length).toBeGreaterThan(0);
          // reachable: the model answer meets its own word floor
          expect(req.modelAnswer.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(
            req.minWords
          );
        });

        it(`req ${req.id}: model answer PASSES its own narrative grader`, () => {
          const r = gradeNarrativeText(req.modelAnswer, {
            concepts: req.concepts,
            keywords: req.keywords,
            conclusions: req.conclusions,
            minWords: req.minWords,
          });
          expect(r.passed, `${essay.id}/${req.id}: ${r.message}`).toBe(true);
        });
      }
    });
  }
});

describe("TBS writeup model soundness (where an explanation reads as a model)", () => {
  it("every calc task's expected values are self-consistent under the grader", () => {
    // Feed each calc task its own expected values as the answer; it must pass.
    for (const sim of tbs) {
      for (const task of sim.tasks as WorkflowTask[]) {
        if (task.type !== "calc") continue;
        const expected = task.expected as Record<string, number>;
        const answer = JSON.stringify(
          Object.fromEntries(Object.keys(expected).map((k) => [k, String(expected[k])]))
        );
        const r = gradeTask(task, answer);
        expect(r.passed, `${sim.id}/${task.id} should accept its own expected values`).toBe(true);
      }
    }
  });
});
