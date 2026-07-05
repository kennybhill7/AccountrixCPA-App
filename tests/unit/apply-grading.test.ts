import { describe, expect, it } from "vitest";
import {
  gradeCalc,
  gradeJournalEntry,
  gradeNarrative,
  gradeTask,
  gradeWriteup,
} from "@/components/ApplyWorkflowClient";
import type { WorkflowTask } from "@/lib/case-workflows";

function jeTask(overrides: Partial<WorkflowTask> = {}): WorkflowTask {
  return {
    id: "t-je",
    prompt: "Record the payroll accrual.",
    type: "je",
    tolerance: 0,
    expected: {
      entries: [
        { account: "5000", debit: 148216, credit: 0 },
        { account: "2100", debit: 0, credit: 148216 },
      ],
    },
    ...overrides,
  };
}

const jeAnswer = (entries: Array<{ account: string; debit: string; credit: string }>) =>
  JSON.stringify({ entries });

describe("gradeJournalEntry", () => {
  it("passes an exact entry", () => {
    const r = gradeJournalEntry(
      jeTask(),
      jeAnswer([
        { account: "5000", debit: "148216", credit: "0" },
        { account: "2100", debit: "0", credit: "148216" },
      ])
    );
    expect(r.passed).toBe(true);
    expect(r.score).toBe(3); // 2 exact lines + balanced
    expect(r.max).toBe(3);
  });

  it("is order-insensitive across lines", () => {
    const r = gradeJournalEntry(
      jeTask(),
      jeAnswer([
        { account: "2100", debit: "0", credit: "148216" },
        { account: "5000", debit: "148216", credit: "0" },
      ])
    );
    expect(r.passed).toBe(true);
  });

  it("accepts $ and comma formatting in user amounts", () => {
    const r = gradeJournalEntry(
      jeTask(),
      jeAnswer([
        { account: "5000", debit: "$148,216", credit: "" },
        { account: "2100", debit: "", credit: "148,216.00" },
      ])
    );
    expect(r.passed).toBe(true);
  });

  it("fails a flipped debit/credit direction even when balanced", () => {
    const r = gradeJournalEntry(
      jeTask(),
      jeAnswer([
        { account: "5000", debit: "0", credit: "148216" },
        { account: "2100", debit: "148216", credit: "0" },
      ])
    );
    expect(r.passed).toBe(false);
    expect(r.score).toBe(1); // balanced only, no exact lines
  });

  it("fails a wrong amount on one line", () => {
    const r = gradeJournalEntry(
      jeTask(),
      jeAnswer([
        { account: "5000", debit: "148000", credit: "0" },
        { account: "2100", debit: "0", credit: "148216" },
      ])
    );
    expect(r.passed).toBe(false);
    expect(r.message).toContain("1/2 exact");
  });

  it("fails a wrong account even with correct amounts", () => {
    const r = gradeJournalEntry(
      jeTask(),
      jeAnswer([
        { account: "6100", debit: "148216", credit: "0" },
        { account: "2100", debit: "0", credit: "148216" },
      ])
    );
    expect(r.passed).toBe(false);
  });

  it("does not double-count one user line against two expected lines", () => {
    const task = jeTask({
      expected: {
        entries: [
          { account: "5000", debit: 100, credit: 0 },
          { account: "5000", debit: 100, credit: 0 },
        ],
      },
    });
    const r = gradeJournalEntry(
      task,
      jeAnswer([{ account: "5000", debit: "100", credit: "0" }])
    );
    expect(r.passed).toBe(false);
    expect(r.message).toContain("1/2 exact");
  });

  it("respects tolerance on amounts", () => {
    const r = gradeJournalEntry(
      jeTask({ tolerance: 1 }),
      jeAnswer([
        { account: "5000", debit: "148216.50", credit: "0" },
        { account: "2100", debit: "0", credit: "148216.50" },
      ])
    );
    expect(r.passed).toBe(true);
  });
});

describe("gradeCalc", () => {
  const calcTask = (expected: Record<string, number>, tolerance = 0): WorkflowTask => ({
    id: "t-calc",
    prompt: "Compute.",
    type: "calc",
    tolerance,
    expected,
  });

  it("grades a single-key answer with $ and commas", () => {
    const r = gradeCalc(calcTask({ netIncome: 173800 }), "$173,800");
    expect(r.passed).toBe(true);
  });

  it("grades a multi-key JSON answer per field", () => {
    const r = gradeCalc(
      calcTask({ overbillings: 190000, underbillings: 42000 }),
      JSON.stringify({ overbillings: "190,000", underbillings: "42000" })
    );
    expect(r.passed).toBe(true);
    expect(r.score).toBe(2);
  });

  it("fails when one field is outside tolerance", () => {
    const r = gradeCalc(
      calcTask({ overbillings: 190000, underbillings: 42000 }, 5),
      JSON.stringify({ overbillings: "190000", underbillings: "42010" })
    );
    expect(r.passed).toBe(false);
    expect(r.score).toBe(1);
  });
});

describe("gradeNarrative / gradeWriteup rubric", () => {
  const writeupTask: WorkflowTask = {
    id: "t-writeup",
    prompt: "Explain the variance to the lender.",
    type: "writeup",
    input: { minWords: 20 },
    expected: { keywords: ["covenant", "DSCR", "headroom"] },
  };

  it("passes a supported, judgment-bearing answer", () => {
    const answer =
      "DSCR is 3.22x against the 1.25x covenant, so headroom is strong. " +
      "Because the trough week stays above $250,000, I recommend no revolver draw " +
      "and a follow up review of the account 2300 balance next close.";
    const r = gradeWriteup(writeupTask, answer);
    expect(r.passed).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(3);
  });

  it("fails keyword stuffing with no numbers and no judgment", () => {
    const r = gradeWriteup(writeupTask, "covenant DSCR headroom");
    expect(r.passed).toBe(false);
  });

  it("reports each rubric dimension in the message", () => {
    const r = gradeNarrative("x", "short answer", ["cash"], 50, "conversation");
    expect(r.max).toBe(5);
    expect(r.message).toContain("coverage");
    expect(r.message).toContain("depth");
    expect(r.message).toContain("support");
    expect(r.message).toContain("judgment");
    expect(r.message).toContain("prose");
  });
});

describe("gradeTask routing", () => {
  it("returns a zero-score result for an empty answer", () => {
    const r = gradeTask(
      { id: "t", prompt: "p", type: "calc", expected: { x: 1 } },
      "   "
    );
    expect(r.passed).toBe(false);
    expect(r.score).toBe(0);
  });
});
