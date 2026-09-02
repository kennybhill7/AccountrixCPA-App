import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { gradeTask, gradeWriteup, gradeNarrative } from "@/components/ApplyWorkflowClient";
import type { CaseWorkflow, WorkflowTask } from "@/lib/case-workflows";

/**
 * Whitfield dissolution — forensic case tie-out.
 *
 * Two jobs. First, every graded figure in the four batch-2 workflows is
 * recomputed here from its own exhibit arithmetic, so a typo in an authored
 * `expected` fails the suite rather than teaching a wrong number. Second,
 * cross-file agreement: any figure that also appears in case.json's marital
 * balance sheet is asserted against case.json itself, so the case profile and
 * the workflows cannot drift apart silently.
 *
 * The fact pattern is entirely fictional (case.json `dataRule`).
 */

const CASE_DIR = path.join(process.cwd(), "data", "cases", "whitfield-dissolution");

function readJson<T>(...segments: string[]): T {
  return JSON.parse(fs.readFileSync(path.join(CASE_DIR, ...segments), "utf8")) as T;
}

interface MaritalRow {
  item: string;
  amount: number;
}
interface WhitfieldCase {
  id: string;
  status: string;
  keyDates: Record<string, string>;
  evidenceTiers: Array<{ id: string; label: string }>;
  maritalBalanceSheet: {
    assets: MaritalRow[];
    debts: MaritalRow[];
    netDivisibleEstate: number;
    halfShare: number;
  };
}

const caseFile = readJson<WhitfieldCase>("case.json");

const wf = {
  population: readJson<CaseWorkflow>("workflows", "population-correction.json"),
  trueup: readJson<CaseWorkflow>("workflows", "retirement-trueup-gap.json"),
  netNotDrawn: readJson<CaseWorkflow>("workflows", "net-not-drawn-back.json"),
  balanceSheet: readJson<CaseWorkflow>("workflows", "marital-balance-sheet.json"),
};

const NEW_WORKFLOWS: Array<[string, CaseWorkflow]> = [
  ["population-correction", wf.population],
  ["retirement-trueup-gap", wf.trueup],
  ["net-not-drawn-back", wf.netNotDrawn],
  ["marital-balance-sheet", wf.balanceSheet],
];

/** case.json balance-sheet rows, by the substring that identifies each. */
function caseAmount(match: string): number {
  const row = [...caseFile.maritalBalanceSheet.assets, ...caseFile.maritalBalanceSheet.debts].find(
    (r) => r.item.includes(match)
  );
  if (!row) throw new Error(`case.json marital balance sheet has no row matching "${match}"`);
  return row.amount;
}

const CASE = {
  checking: caseAmount("x2210"),
  taxable: caseAmount("x501"),
  retirement: caseAmount("x502/x503/x504"),
  kestrel: caseAmount("Kestrel"),
  residence: caseAmount("Residence equity"),
  commercialLoc: caseAmount("x3380"),
  heloc: caseAmount("x4415"),
  net: caseFile.maritalBalanceSheet.netDivisibleEstate,
  half: caseFile.maritalBalanceSheet.halfShare,
};

function task(workflow: CaseWorkflow, id: string): WorkflowTask {
  const found = workflow.tasks.find((t) => t.id === id);
  if (!found) throw new Error(`${workflow.id}: no task "${id}"`);
  return found;
}

/** A graded numeric field from a calc task's `expected` map. */
function field(workflow: CaseWorkflow, taskId: string, key: string): number {
  const expected = task(workflow, taskId).expected as Record<string, unknown>;
  if (!(key in expected)) throw new Error(`${workflow.id}/${taskId}: no expected field "${key}"`);
  return Number(expected[key]);
}

/** Numeric column value from an exhibit row, located by its first-cell label. */
function exhibitRow(workflow: CaseWorkflow, exhibitId: string, label: string): unknown[] {
  const exhibits = (workflow as unknown as { exhibits?: Array<{ id: string; rows?: unknown[][] }> })
    .exhibits;
  const ex = exhibits?.find((e) => e.id === exhibitId);
  if (!ex?.rows) throw new Error(`${workflow.id}: exhibit ${exhibitId} has no rows`);
  const row = ex.rows.find((r) => String(r[0]) === label);
  if (!row) throw new Error(`${workflow.id}/${exhibitId}: no row labelled "${label}"`);
  return row;
}

const near = (a: number, b: number) => expect(a).toBeCloseTo(b, 2);

// ---------------------------------------------------------------------------
// case.json itself — the anchor every workflow is asserted against
// ---------------------------------------------------------------------------

describe("Whitfield case.json — the anchor", () => {
  it("is flagged fictional", () => {
    expect(caseFile.status).toBe("fictional");
    expect(caseFile.id).toBe("whitfield-dissolution");
  });

  it("marital balance sheet foots to its own stated net and half share", () => {
    const assets = caseFile.maritalBalanceSheet.assets.reduce((n, r) => n + r.amount, 0);
    const debts = caseFile.maritalBalanceSheet.debts.reduce((n, r) => n + r.amount, 0);
    near(assets, 3244881.9);
    near(debts, -330300.0);
    near(assets + debts, CASE.net);
    near(CASE.net / 2, CASE.half);
  });

  it("carries the four evidence tiers the workflows label against", () => {
    expect(caseFile.evidenceTiers.map((t) => t.id).sort()).toEqual([
      "legal-premise",
      "not-produced",
      "party-annotation",
      "primary-source",
    ]);
  });

  it("separation and report dates bound the post-separation window", () => {
    expect(caseFile.keyDates.separation).toBe("2026-05-12");
    expect(caseFile.keyDates.reportDate).toBe("2027-04-30");
    expect(caseFile.keyDates.transferInQuestion).toBe("2026-03-14");
  });
});

// ---------------------------------------------------------------------------
// population-correction
// ---------------------------------------------------------------------------

describe("population-correction — arithmetic", () => {
  const w = wf.population;

  const vendors = (
    (w as unknown as { exhibits: Array<{ id: string; rows?: unknown[][] }> }).exhibits.find(
      (e) => e.id === "P2-vendor-population"
    )?.rows ?? []
  ).map((r) => ({
    name: String(r[0]),
    count: Number(r[1]),
    amount: Number(r[2]),
    matched: String(r[4]) === "Yes",
  }));

  it("P2 sums to the corrected population, and the missed amount is its complement", () => {
    const total = vendors.reduce((n, v) => n + v.amount, 0);
    const captured = vendors.filter((v) => v.matched).reduce((n, v) => n + v.amount, 0);
    near(total, 88415.0);
    near(captured, 54150.0);
    near(field(w, "t1-rebuild-population", "Corrected population"), total);
    near(field(w, "t1-rebuild-population", "Amount missed by the filter"), total - captured);
    near(field(w, "t2-filter-coverage", "Amount captured by the filter"), captured);
  });

  it("transaction and vendor miss counts recompute from P2", () => {
    const totalItems = vendors.reduce((n, v) => n + v.count, 0);
    const capturedItems = vendors.filter((v) => v.matched).reduce((n, v) => n + v.count, 0);
    expect(totalItems).toBe(27);
    expect(capturedItems).toBe(9);
    expect(field(w, "t2-filter-coverage", "Transactions missed")).toBe(totalItems - capturedItems);
    expect(field(w, "t2-filter-coverage", "Vendors missed")).toBe(
      vendors.filter((v) => !v.matched).length
    );
  });

  it("capture rate is 54,150.00 / 88,415.00 to two decimals", () => {
    const rate = (54150.0 / 88415.0) * 100;
    expect(rate).toBeCloseTo(61.2453, 3);
    const stated = field(w, "t3-capture-rate", "Capture rate by amount (%)");
    expect(stated).toBe(61.25);
    // graded within the task's own tolerance
    expect(Math.abs(rate - stated)).toBeLessThanOrEqual(
      task(w, "t3-capture-rate").tolerance as number
    );
  });

  it("rejected candidates total, and the over-corrected population is population + rejects", () => {
    const rejects = (
      (w as unknown as { exhibits: Array<{ id: string; rows?: unknown[][] }> }).exhibits.find(
        (e) => e.id === "P3-rejected-candidates"
      )?.rows ?? []
    ).map((r) => Number(r[2]));
    const rejectTotal = rejects.reduce((n, a) => n + a, 0);
    near(rejectTotal, 16290.0);
    near(field(w, "t4-bound-the-correction", "Rejected candidates total"), rejectTotal);
    near(field(w, "t4-bound-the-correction", "Over-corrected population"), 88415.0 + rejectTotal);
  });

  it("the rejected Anchorline duplicate is one of the two Anchorline items already counted", () => {
    const anchorline = vendors.find((v) => v.name.startsWith("Anchorline"))!;
    const dup = Number(
      exhibitRow(
        w,
        "P3-rejected-candidates",
        "Anchorline Refit Co. — one item appearing in both the May and the June export extracts"
      )[2]
    );
    expect(anchorline.count).toBe(2);
    near(dup, anchorline.amount / 2);
  });

  it("exposure converts at one half and the increase is half the understatement", () => {
    near(field(w, "t7-exposure", "Exposure at corrected population"), 88415.0 / 2);
    near(field(w, "t7-exposure", "Exposure at original figure"), 54150.0 / 2);
    near(field(w, "t7-exposure", "Increase from the correction"), 34265.0 / 2);
    near(
      field(w, "t7-exposure", "Exposure at corrected population") -
        field(w, "t7-exposure", "Exposure at original figure"),
      field(w, "t7-exposure", "Increase from the correction")
    );
  });

  it("every P2 item predates the case.json separation date, so the boundary claim holds", () => {
    const separation = caseFile.keyDates.separation;
    for (const r of (
      w as unknown as { exhibits: Array<{ id: string; rows?: unknown[][] }> }
    ).exhibits.find((e) => e.id === "P2-vendor-population")!.rows!) {
      const end = String(r[3]).split(" to ")[1];
      expect(end < separation, `${String(r[0])} ends ${end}`).toBe(true);
    }
  });

  it("ties to the claims-register workflow's C6 figures", () => {
    const register = readJson<CaseWorkflow>("workflows", "claims-register-tieout.json");
    const c6 = register.tasks.find((t) => t.id === "t6-c6-population")!.expected as Record<
      string,
      number
    >;
    near(field(w, "t1-rebuild-population", "Corrected population"), c6["C6 true population"]);
    near(field(w, "t1-rebuild-population", "Amount missed by the filter"), c6["C6 understatement"]);
  });
});

// ---------------------------------------------------------------------------
// retirement-trueup-gap
// ---------------------------------------------------------------------------

describe("retirement-trueup-gap — arithmetic", () => {
  const w = wf.trueup;

  it("R1 retirement accounts sum to the case.json retirement row, with nil activity", () => {
    const rows = (
      w as unknown as { exhibits: Array<{ id: string; rows?: unknown[][] }> }
    ).exhibits.find((e) => e.id === "R1-retirement-values")!.rows!;
    const total = rows.reduce((n, r) => n + Number(r[2]), 0);
    near(total, 1043220.0);
    near(total, CASE.retirement);
    near(field(w, "t1-investment-total", "Retirement subtotal"), total);
    for (const r of rows) {
      expect(Number(r[3])).toBe(0); // withdrawals
      expect(Number(r[4])).toBe(0); // securities transferred out
    }
  });

  it("investment total is retirement plus the case.json taxable brokerage row", () => {
    near(field(w, "t1-investment-total", "Investment total"), CASE.retirement + CASE.taxable);
    near(field(w, "t1-investment-total", "Investment total"), 1251981.9);
  });

  it("R2 journals out 12,500.00 + 173,900.00 = 186,400.00 and ends at the case.json x501 value", () => {
    near(Math.abs(Number(exhibitRow(w, "R2-taxable-activity", "1")[2])), 12500.0);
    near(Math.abs(Number(exhibitRow(w, "R2-taxable-activity", "2")[2])), 173900.0);
    near(Math.abs(Number(exhibitRow(w, "R2-taxable-activity", "3")[2])), 186400.0);
    near(Number(exhibitRow(w, "R2-taxable-activity", "4")[2]), CASE.taxable);
    near(12500.0 + 173900.0, 186400.0);
  });

  it("R3 reproduces: difference, half, and equal post-transfer sides", () => {
    const c = Number(exhibitRow(w, "R3-asserted-equalization", "C")[2]);
    const d = Number(exhibitRow(w, "R3-asserted-equalization", "D")[2]);
    const e = Number(exhibitRow(w, "R3-asserted-equalization", "E")[2]);
    const f = Number(exhibitRow(w, "R3-asserted-equalization", "F")[2]);
    const g = Number(exhibitRow(w, "R3-asserted-equalization", "G")[2]);
    const h = Number(exhibitRow(w, "R3-asserted-equalization", "H")[2]);
    near(c - d, e);
    near(e / 2, f);
    near(f, 186400.0);
    near(c - f, g);
    near(d + f, h);
    near(g, h);
    near(field(w, "t2-reproduce-equalization", "Step E difference"), e);
    near(field(w, "t2-reproduce-equalization", "Step F transfer"), f);
    near(field(w, "t2-reproduce-equalization", "Post-transfer figure, each side"), g);
  });

  it("the asserted step D is algebraically derivable from the transfer — the circularity finding", () => {
    const c = Number(exhibitRow(w, "R3-asserted-equalization", "C")[2]);
    const d = Number(exhibitRow(w, "R3-asserted-equalization", "D")[2]);
    const backSolved = c - 2 * 186400.0;
    near(backSolved, d);
    near(field(w, "t3-circularity", "Back-solved pre-transfer value"), backSolved);
    near(field(w, "t3-circularity", "Difference from asserted step D"), 0);
  });

  it("the 13-month Kestrel movement uses the case.json Kestrel value", () => {
    const d = Number(exhibitRow(w, "R3-asserted-equalization", "D")[2]);
    near(
      field(w, "t5-closing-balance-test", "Movement over the intervening period"),
      CASE.kestrel - d
    );
    near(field(w, "t5-closing-balance-test", "Movement over the intervening period"), 485318.1);
  });

  it("the exclusion stake ties to case.json net estate and half share", () => {
    near(Number(exhibitRow(w, "R5-divisible-estate", "1")[2]), CASE.net);
    near(Number(exhibitRow(w, "R5-divisible-estate", "2")[2]), CASE.half);
    near(Number(exhibitRow(w, "R5-divisible-estate", "3")[2]), CASE.retirement);

    const revised = field(w, "t7-exclusion-stake", "Revised net divisible estate");
    const revisedHalf = field(w, "t7-exclusion-stake", "Revised half share");
    const reduction = field(w, "t7-exclusion-stake", "Reduction in the half share");
    near(revised, CASE.net - CASE.retirement);
    near(revisedHalf, revised / 2);
    near(reduction, CASE.half - revisedHalf);
    near(reduction, CASE.retirement / 2);
    near(reduction, 521610.0);
  });
});

// ---------------------------------------------------------------------------
// net-not-drawn-back
// ---------------------------------------------------------------------------

describe("net-not-drawn-back — arithmetic", () => {
  const w = wf.netNotDrawn;
  const HIGHER = 149204.15;
  const LOWER = 41390.2;
  const MARCUS_DEBITS = 6323.5;
  const PAIRED_DATES = 58;

  it("N1 credit legs are the values the computation uses", () => {
    near(
      Number(
        exhibitRow(w, "N1-paired-credits", "Higher-side credit on each paired date — total")[2]
      ),
      HIGHER
    );
    near(
      Number(
        exhibitRow(w, "N1-paired-credits", "Lower-side credit on each paired date — total")[2]
      ),
      LOWER
    );
    expect(
      Number(
        exhibitRow(w, "N1-paired-credits", "Pay dates carrying two Cedar Ridge payroll credits")[1]
      )
    ).toBe(PAIRED_DATES);
    near(field(w, "t1-credit-base", "Combined credits, both sides"), HIGHER + LOWER);
    near(field(w, "t1-credit-base", "Combined credits, both sides"), 190594.35);
    near(field(w, "t1-credit-base", "Higher-side base"), HIGHER);
  });

  it("the net is the higher-side base less only the debits that reach Marcus", () => {
    const debits = (
      w as unknown as { exhibits: Array<{ id: string; rows?: unknown[][] }> }
    ).exhibits.find((e) => e.id === "N2-debit-detail")!.rows!;
    const returning = debits
      .filter((r) => String(r[3]).startsWith("Yes"))
      .reduce((n, r) => n + Number(r[2]), 0);
    near(returning, MARCUS_DEBITS);
    near(field(w, "t2-net-not-drawn-back", "Debits that return funds to Marcus"), returning);
    near(field(w, "t2-net-not-drawn-back", "Net not drawn back"), HIGHER - returning);
    near(field(w, "t2-net-not-drawn-back", "Net not drawn back"), 142880.65);
  });

  it("the over-subtraction error is the full debit population less the returning debits", () => {
    const debits = (
      w as unknown as { exhibits: Array<{ id: string; rows?: unknown[][] }> }
    ).exhibits.find((e) => e.id === "N2-debit-detail")!.rows!;
    const all = debits.reduce((n, r) => n + Number(r[2]), 0);
    const count = debits.reduce((n, r) => n + Number(r[1]), 0);
    near(all, 54304.3);
    expect(count).toBe(45);
    near(field(w, "t3-over-subtraction", "Total debits in N2"), all);
    near(field(w, "t3-over-subtraction", "Figure if all debits subtracted"), HIGHER - all);
    near(field(w, "t3-over-subtraction", "Figure if all debits subtracted"), 94899.85);
    near(field(w, "t3-over-subtraction", "Understatement"), 142880.65 - (HIGHER - all));
    near(field(w, "t3-over-subtraction", "Understatement"), all - MARCUS_DEBITS);
  });

  it("the wrong-base error overstates by exactly the lower-side total", () => {
    near(
      field(w, "t4-wrong-base", "Figure if combined credits used"),
      HIGHER + LOWER - MARCUS_DEBITS
    );
    near(field(w, "t4-wrong-base", "Figure if combined credits used"), 184270.85);
    near(field(w, "t4-wrong-base", "Overstatement"), LOWER);
  });

  it("pay-pattern statistics round to the graded values within tolerance", () => {
    const tol = task(w, "t5-pay-pattern").tolerance as number;
    const avgHigh = HIGHER / PAIRED_DATES;
    const avgLow = LOWER / PAIRED_DATES;
    const ratio = HIGHER / LOWER;
    expect(avgHigh).toBeCloseTo(2572.4853, 3);
    expect(avgLow).toBeCloseTo(713.6241, 3);
    expect(ratio).toBeCloseTo(3.6048, 3);
    expect(
      Math.abs(avgHigh - field(w, "t5-pay-pattern", "Average higher-side credit"))
    ).toBeLessThanOrEqual(tol);
    expect(
      Math.abs(avgLow - field(w, "t5-pay-pattern", "Average lower-side credit"))
    ).toBeLessThanOrEqual(tol);
    expect(
      Math.abs(ratio - field(w, "t5-pay-pattern", "Higher-to-lower ratio"))
    ).toBeLessThanOrEqual(tol);
  });

  it("the flow-versus-balance gap uses the case.json x2210 balance", () => {
    near(Number(exhibitRow(w, "N4-account-balance", "1")[2]), CASE.checking);
    near(
      field(w, "t7-flow-vs-balance", "Difference between the net and the balance"),
      142880.65 - CASE.checking
    );
    near(field(w, "t7-flow-vs-balance", "Difference between the net and the balance"), 124480.65);
  });

  it("ties to the claims-register workflow's C5 figure", () => {
    const register = readJson<CaseWorkflow>("workflows", "claims-register-tieout.json");
    const c5 = register.tasks.find((t) => t.id === "t5-c5-payroll")!.expected as Record<
      string,
      number
    >;
    near(field(w, "t2-net-not-drawn-back", "Net not drawn back"), c5["C5 net not drawn back"]);
  });
});

// ---------------------------------------------------------------------------
// marital-balance-sheet
// ---------------------------------------------------------------------------

describe("marital-balance-sheet — arithmetic", () => {
  const w = wf.balanceSheet;

  const assetRows = (
    w as unknown as { exhibits: Array<{ id: string; rows?: unknown[][] }> }
  ).exhibits.find((e) => e.id === "B1-asset-rows")!.rows!;
  const debtRows = (
    w as unknown as { exhibits: Array<{ id: string; rows?: unknown[][] }> }
  ).exhibits.find((e) => e.id === "B2-debt-rows")!.rows!;

  it("every B1/B2 row agrees to case.json", () => {
    near(Number(exhibitRow(w, "B1-asset-rows", "A1")[3]), CASE.checking);
    near(Number(exhibitRow(w, "B1-asset-rows", "A2")[3]), CASE.taxable);
    near(Number(exhibitRow(w, "B1-asset-rows", "A3")[3]), CASE.retirement);
    near(Number(exhibitRow(w, "B1-asset-rows", "A4")[3]), CASE.kestrel);
    near(Number(exhibitRow(w, "B1-asset-rows", "A5")[3]), CASE.residence);
    near(Number(exhibitRow(w, "B2-debt-rows", "D1")[3]), CASE.commercialLoc);
    near(Number(exhibitRow(w, "B2-debt-rows", "D2")[3]), CASE.heloc);
  });

  it("the schedule foots to the case.json net estate and half share", () => {
    const assets = assetRows.reduce((n, r) => n + Number(r[3]), 0);
    const debts = debtRows.reduce((n, r) => n + Number(r[3]), 0);
    near(field(w, "t1-build-the-schedule", "Total assets"), assets);
    near(field(w, "t1-build-the-schedule", "Total debts"), debts);
    near(field(w, "t1-build-the-schedule", "Net divisible estate"), assets + debts);
    near(field(w, "t1-build-the-schedule", "Net divisible estate"), CASE.net);
    near(field(w, "t2-half-share", "One-half share"), CASE.half);
    near(field(w, "t2-half-share", "One-half share"), CASE.net / 2);
  });

  it("the equal-split rows are exactly the rows marked 'Equal split in kind'", () => {
    const equalRows = [...assetRows, ...debtRows].filter((r) =>
      String(r[5]).startsWith("Equal split in kind")
    );
    const equalNet = equalRows.reduce((n, r) => n + Number(r[3]), 0);
    expect(equalRows.length).toBe(4);
    near(equalNet, CASE.checking + CASE.residence + CASE.commercialLoc + CASE.heloc);
    near(equalNet, 298100.0);
    near(field(w, "t3-gap-neutral", "Net value of the equal-split rows"), equalNet);
    near(field(w, "t3-gap-neutral", "Amount to each party"), equalNet / 2);
    near(field(w, "t3-gap-neutral", "Amount to each party"), 149050.0);
  });

  it("the titled rows are the complement, and the partition loses nothing", () => {
    const titled = assetRows
      .filter((r) => String(r[5]).startsWith("Titled"))
      .reduce((n, r) => n + Number(r[3]), 0);
    expect(assetRows.filter((r) => String(r[5]).startsWith("Titled")).length).toBe(3);
    near(titled, 2616481.9);
    near(field(w, "t4-contested-subtotal", "Titled rows subtotal"), titled);
    near(field(w, "t4-contested-subtotal", "One half of the titled subtotal"), titled / 2);
    near(field(w, "t3-gap-neutral", "Net value of the equal-split rows") + titled, CASE.net);
  });

  it("the gap and the equalizing payment", () => {
    const marcus = field(w, "t5-the-gap", "Marcus — titled holdings");
    const dana = field(w, "t5-the-gap", "Dana — titled holdings");
    near(marcus, CASE.taxable + CASE.retirement);
    near(marcus, 1251981.9);
    near(dana, CASE.kestrel);
    near(field(w, "t5-the-gap", "Gap"), dana - marcus);
    near(field(w, "t5-the-gap", "Gap"), 112518.1);
    near(field(w, "t6-equalizing-payment", "Equalizing payment"), (dana - marcus) / 2);
    near(field(w, "t6-equalizing-payment", "Equalizing payment"), 56259.05);
  });

  it("the payment lands both parties on the case.json half share", () => {
    const payment = field(w, "t6-equalizing-payment", "Equalizing payment");
    const marcus = field(w, "t5-the-gap", "Marcus — titled holdings");
    const dana = field(w, "t5-the-gap", "Dana — titled holdings");
    const each = field(w, "t3-gap-neutral", "Amount to each party");
    near(marcus + payment, dana - payment);
    near(marcus + payment + each, CASE.half);
    near(dana - payment + each, CASE.half);
    near(field(w, "t8-proof", "Marcus — total received"), CASE.half);
    near(field(w, "t8-proof", "Dana — total received"), CASE.half);
  });

  it("the payment direction stated in t7 matches the arithmetic (Dana pays Marcus)", () => {
    const marcus = field(w, "t5-the-gap", "Marcus — titled holdings");
    const dana = field(w, "t5-the-gap", "Dana — titled holdings");
    expect(dana).toBeGreaterThan(marcus);
    expect(String(task(w, "t7-direction").expected).startsWith("Dana pays Marcus")).toBe(true);
  });

  it("the advance premise moves the payment by half the advance", () => {
    const ADVANCE = 186400.0;
    const titled = field(w, "t4-contested-subtotal", "Titled rows subtotal");
    const revised = field(w, "t9-premise-both-ways", "Revised titled subtotal");
    const midpoint = field(w, "t9-premise-both-ways", "Revised titled midpoint");
    const payment = field(w, "t9-premise-both-ways", "Revised payment");
    const swing = field(w, "t9-premise-both-ways", "Swing from the base case");

    near(revised, titled + ADVANCE);
    near(revised, 2802881.9);
    near(midpoint, revised / 2);
    near(payment, CASE.kestrel + ADVANCE - midpoint);
    near(payment, 149459.05);
    near(swing, payment - field(w, "t6-equalizing-payment", "Equalizing payment"));
    near(swing, ADVANCE / 2);
    near(swing, 93200.0);
    // the advance amount is the same 186,400.00 proven in the claims register
    const register = readJson<CaseWorkflow>("workflows", "claims-register-tieout.json");
    const c1 = register.tasks.find((t) => t.id === "t1-c1-transfer")!.expected as Record<
      string,
      number
    >;
    near(ADVANCE, c1["C1 transfer out"]);
  });
});

// ---------------------------------------------------------------------------
// Structural guarantees across all four new workflows
// ---------------------------------------------------------------------------

describe("Whitfield batch 2 — structural invariants", () => {
  for (const [fileId, workflow] of NEW_WORKFLOWS) {
    describe(fileId, () => {
      it("carries the required top-level fields", () => {
        expect(workflow.id.startsWith("whitfield-")).toBe(true);
        expect(workflow.company).toBe("In re the Marriage of Whitfield");
        expect(workflow.competency).toBe("cfo");
        expect((workflow.skills ?? []).length).toBeGreaterThan(0);
        expect(workflow.scenario.length).toBeGreaterThan(200);
        expect((workflow.exhibits ?? []).length).toBeGreaterThan(0);
        expect(workflow.tasks.length).toBeGreaterThanOrEqual(9);
        expect(workflow.gradingRules).toBeTruthy();
        expect(workflow.outputArtifact).toBeTruthy();
        expect(workflow.conversationSim?.modelAnswer).toBeTruthy();
        expect(
          (workflow as unknown as { answerKeyChecks?: Record<string, string> }).answerKeyChecks
        ).toBeTruthy();
      });

      it("task ids are unique and every task has a prompt, a type and an explanation", () => {
        const ids = workflow.tasks.map((t) => t.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const t of workflow.tasks) {
          expect(t.prompt.length, `${t.id}`).toBeGreaterThan(20);
          expect(["calc", "select", "writeup", "je"]).toContain(t.type);
          expect(t.explanation, `${t.id} needs an explanation`).toBeTruthy();
          expect((t.explanation ?? "").length).toBeGreaterThan(80);
        }
      });

      it("every calc task expects finite numbers and accepts its own expected answer", () => {
        for (const t of workflow.tasks.filter((x) => x.type === "calc")) {
          const expected = t.expected as Record<string, unknown>;
          const keys = Object.keys(expected);
          expect(keys.length, `${t.id}`).toBeGreaterThan(0);
          for (const k of keys) {
            expect(Number.isFinite(Number(expected[k])), `${t.id}/${k}`).toBe(true);
          }
          const result = gradeTask(t, JSON.stringify(expected));
          expect(result.passed, `${t.id}: ${result.message}`).toBe(true);
        }
      });

      it("every select task's expected answer is one of its offered choices", () => {
        for (const t of workflow.tasks.filter((x) => x.type === "select")) {
          const choices = (t.input as { choices?: string[] })?.choices ?? [];
          expect(choices.length, `${t.id} needs choices`).toBeGreaterThanOrEqual(3);
          expect(new Set(choices).size, `${t.id} has duplicate choices`).toBe(choices.length);
          expect(choices, `${t.id}`).toContain(String(t.expected));
        }
      });

      it("every writeup task has a keyword checklist and a reachable word floor", () => {
        for (const t of workflow.tasks.filter((x) => x.type === "writeup")) {
          const keywords = (t.expected as { keywords?: string[] }).keywords ?? [];
          expect(keywords.length, `${t.id}`).toBeGreaterThanOrEqual(4);
          const minWords = (t.input as { minWords?: number })?.minWords ?? 0;
          expect(minWords).toBeGreaterThan(0);
        }
      });

      it("the conversation model answer passes its own conversation grader", () => {
        const model = workflow.conversationSim!.modelAnswer!;
        const keywords = model
          .split(/\W+/)
          .filter((word) => word.length > 6)
          .slice(0, 8);
        const r = gradeNarrative("__conversation", model, keywords, 35, "conversation");
        expect(r.passed, `${fileId}: ${r.message}`).toBe(true);
      });

      it("contains no real-world identifier smuggled into the fiction", () => {
        const blob = JSON.stringify(workflow);
        // The invented universe is closed: only these institutions/parties appear.
        for (const banned of [
          "Green River",
          "Horizon Builder",
          "Cedar Ridge Bank",
          "Kenneth",
          "Accountrix",
        ]) {
          expect(blob.includes(banned), `${fileId} mentions "${banned}"`).toBe(false);
        }
        expect(
          (workflow as unknown as { answerKeyChecks: Record<string, string> }).answerKeyChecks
            .fictionCheck
        ).toContain("invented");
      });
    });
  }
});

// ---------------------------------------------------------------------------
// Writeup rubrics are satisfiable — a model answer must pass its own grader
// ---------------------------------------------------------------------------

const MODEL_WRITEUPS: Array<[CaseWorkflow, string, string]> = [
  [
    wf.population,
    "t9-disclosure-paragraph",
    "We are correcting a figure in our own schedule, and the correction is against our client. The earlier personal-spending number of 54,150 was understated. The corrected population, built from every marine-related vendor paid out of the joint household account, is 88,415, so the earlier figure was understated by 34,265. The error happened because the original procedure was a vendor filter that matched only two payee names; it never caught the marina slip fees and it never named two of the five vendors. We declined to add three further items, two paid from the company account, two dated after the separation, and one already counted, because they fall outside the population or would be counted twice. This correction reaches only spending dated before the separation, so the separate conclusion about payroll deposited after separation and not drawn back is unaffected.",
  ],
  [
    wf.trueup,
    "t9-document-request",
    "We are requesting three documents from Kestrel Bank & Trust, and each one answers a specific question. First, the monthly statement covering the transfer date, which would show whether a credit of 186,400 was received. Second, the deposit advice or journal confirmation for that credit, which would tie the journal reference on the brokerage statement to an account at that institution. Third, the registration or owner detail for the receiving account, which would establish whose account it is. The account-value confirmation already produced states a balance thirteen months later and carries no transaction history, so it cannot answer any of the three questions. If these are not produced, the report will state the amount and the source as established and the recipient as unestablished, and it will not infer receipt from a closing balance.",
  ],
  [
    wf.netNotDrawn,
    "t9-summary-sentence",
    "From the date of separation forward, the company deposited pay into the joint household account on 58 dates, with two deposits on each date. Taking the larger deposit on each date gives 149,204.15, and subtracting the 6,323.50 later transferred out to his own account leaves 142,880.65. The bank records establish the date and the amount of every one of those deposits; which of the two was his pay comes from the company payroll registers, because the bank's own description is identical on both and names no employee, so that identification is not the bank's. This is a measure of money that went in and was not taken back out, not money still sitting in the account, which held 18,400.00 at the report date.",
  ],
  [
    wf.balanceSheet,
    "t11-bottom-line-summary",
    "The divisible estate is 2,914,581.90, half of it is 1,457,290.95, and a payment of 56,259.05 from Ms. Whitfield to Mr. Whitfield brings both parties to that figure. Four items, the joint checking account, the residence, and the two credit lines, are divided equally by both sides, so their values change the size of the estate and both halves together but cannot change the payment between the parties; together they are 298,100.00 net, or 149,050.00 to each. The payment is set instead by the three investment accounts titled in one name, because each of those sits entirely on one side until money moves. One question remains open, and it is stated as a premise rather than a conclusion: if the court finds that a transfer of 186,400 was received and consumed, the payment rises to 149,459.05. That finding depends on a bank statement that has not been produced.",
  ],
];

describe("Whitfield batch 2 — writeup rubrics are satisfiable", () => {
  for (const [workflow, taskId, model] of MODEL_WRITEUPS) {
    it(`${workflow.id}/${taskId}: a model answer passes the authored rubric`, () => {
      const t = task(workflow, taskId);
      const minWords = (t.input as { minWords?: number })?.minWords ?? 0;
      expect(model.trim().split(/\s+/).length).toBeGreaterThanOrEqual(minWords);
      const r = gradeWriteup(t, model);
      expect(r.passed, `${workflow.id}/${taskId}: ${r.message}`).toBe(true);
    });

    it(`${workflow.id}/${taskId}: a keyword dump fails the prose gate`, () => {
      const t = task(workflow, taskId);
      const keywords = (t.expected as { keywords: string[] }).keywords;
      const stuffed = Array.from({ length: 12 }, () => keywords.join(" ")).join(" ");
      expect(gradeWriteup(t, stuffed).passed).toBe(false);
    });
  }
});
