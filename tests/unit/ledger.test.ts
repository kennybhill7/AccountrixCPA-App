/**
 * Golden-scenario regression for the posting engine.
 *
 * The six-entry scenario below and every expected number were hand-computed
 * independently in Python before this file was written (a separate
 * implementation, not a re-derivation from lib/ledger.ts's own formulas) —
 * see the session record. A test that recomputes with the engine it is
 * testing proves nothing; these numbers are pinned externally.
 */
import { describe, it, expect } from "vitest";
import type { Account } from "@/components/ChartOfAccountsBuilder";
import {
  validateEntry,
  postEntry,
  buildReversal,
  computeTrialBalance,
  computeAccountActivity,
  computeIncomeStatement,
  computeBalanceSheet,
  type LedgerBook,
  type JournalEntry,
} from "@/lib/ledger";

function acct(
  number: string,
  name: string,
  type: Account["type"],
  normalBalance: "DR" | "CR"
): Account {
  return {
    number,
    name,
    type,
    normalBalance,
    category:
      type === "Asset"
        ? "Current Asset"
        : type === "Liability"
          ? "Current Liability"
          : type === "Equity"
            ? "Equity"
            : type === "Revenue"
              ? "Operating Revenue"
              : "Operating Expense",
    isSubAccount: false,
    isActive: true,
    hasSubAccounts: false,
  };
}

const coa: Account[] = [
  acct("1000", "Cash - Operating", "Asset", "DR"),
  acct("1100", "Accounts Receivable", "Asset", "DR"),
  acct("1300", "Work in Process", "Asset", "DR"),
  acct("2000", "Accounts Payable", "Liability", "CR"),
  acct("3000", "Member Capital", "Equity", "CR"),
  acct("4000", "Contract Revenue", "Revenue", "CR"),
  acct("5000", "Direct Labor", "Expense", "DR"),
  acct("6100", "Rent", "Expense", "DR"),
];

function makeBook(): LedgerBook {
  return {
    id: "test-book",
    name: "Test",
    company: "Fictional Co",
    createdAt: 0,
    chartOfAccounts: coa,
    entries: [],
  };
}

/** The six-entry scenario, independently hand-verified in Python. */
function postGoldenScenario(book: LedgerBook): LedgerBook {
  const drafts: Omit<JournalEntry, "id" | "postedAt">[] = [
    {
      date: "2027-01-05",
      memo: "Owner injects cash",
      lines: [
        { accountNumber: "1000", debit: 50000, credit: 0 },
        { accountNumber: "3000", debit: 0, credit: 50000 },
      ],
    },
    {
      date: "2027-01-10",
      memo: "Pay job costs into WIP",
      lines: [
        { accountNumber: "1300", debit: 12000, credit: 0 },
        { accountNumber: "1000", debit: 0, credit: 12000 },
      ],
    },
    {
      date: "2027-01-15",
      memo: "Bill customer, earn revenue",
      lines: [
        { accountNumber: "1100", debit: 20000, credit: 0 },
        { accountNumber: "4000", debit: 0, credit: 20000 },
      ],
    },
    {
      date: "2027-01-20",
      memo: "Collect cash from customer",
      lines: [
        { accountNumber: "1000", debit: 15000, credit: 0 },
        { accountNumber: "1100", debit: 0, credit: 15000 },
      ],
    },
    {
      date: "2027-01-25",
      memo: "Pay office rent",
      lines: [
        { accountNumber: "6100", debit: 2000, credit: 0 },
        { accountNumber: "1000", debit: 0, credit: 2000 },
      ],
    },
    {
      date: "2027-01-28",
      memo: "Accrue direct labor payable",
      lines: [
        { accountNumber: "5000", debit: 8000, credit: 0 },
        { accountNumber: "2000", debit: 0, credit: 8000 },
      ],
    },
  ];
  let entries = book.entries;
  for (const d of drafts) {
    const b = { ...book, entries };
    entries = postEntry(b, d);
  }
  return { ...book, entries };
}

describe("validateEntry", () => {
  it("rejects an unbalanced entry", () => {
    const errors = validateEntry(coa, {
      date: "2027-01-01",
      memo: "x",
      lines: [
        { accountNumber: "1000", debit: 100, credit: 0 },
        { accountNumber: "3000", debit: 0, credit: 90 },
      ],
    });
    expect(errors.some((e) => e.code === "unbalanced")).toBe(true);
  });

  it("rejects an account not in the chart of accounts", () => {
    const errors = validateEntry(coa, {
      date: "2027-01-01",
      memo: "x",
      lines: [
        { accountNumber: "9999", debit: 100, credit: 0 },
        { accountNumber: "3000", debit: 0, credit: 100 },
      ],
    });
    expect(errors.some((e) => e.code === "unknown-account")).toBe(true);
  });

  it("rejects a line carrying both a debit and a credit", () => {
    const errors = validateEntry(coa, {
      date: "2027-01-01",
      memo: "x",
      lines: [
        { accountNumber: "1000", debit: 50, credit: 50 },
        { accountNumber: "3000", debit: 0, credit: 0 },
      ],
    });
    expect(errors.some((e) => e.code === "line-both-sides")).toBe(true);
    expect(errors.some((e) => e.code === "line-neither-side")).toBe(true);
  });

  it("rejects fewer than two lines", () => {
    const errors = validateEntry(coa, {
      date: "2027-01-01",
      memo: "x",
      lines: [{ accountNumber: "1000", debit: 100, credit: 0 }],
    });
    expect(errors.some((e) => e.code === "too-few-lines")).toBe(true);
  });

  it("accepts a balanced, valid entry with zero errors", () => {
    const errors = validateEntry(coa, {
      date: "2027-01-01",
      memo: "valid",
      lines: [
        { accountNumber: "1000", debit: 100, credit: 0 },
        { accountNumber: "3000", debit: 0, credit: 100 },
      ],
    });
    expect(errors).toEqual([]);
  });

  it("tolerates sub-cent floating point noise but not a real cent-level mismatch", () => {
    const noisy = validateEntry(coa, {
      date: "2027-01-01",
      memo: "x",
      lines: [
        { accountNumber: "1000", debit: 0.1 + 0.2, credit: 0 },
        { accountNumber: "3000", debit: 0, credit: 0.3 },
      ],
    });
    expect(noisy.some((e) => e.code === "unbalanced")).toBe(false);

    const real = validateEntry(coa, {
      date: "2027-01-01",
      memo: "x",
      lines: [
        { accountNumber: "1000", debit: 100.02, credit: 0 },
        { accountNumber: "3000", debit: 0, credit: 100 },
      ],
    });
    expect(real.some((e) => e.code === "unbalanced")).toBe(true);
  });
});

describe("postEntry", () => {
  it("throws rather than silently posting an invalid entry", () => {
    const book = makeBook();
    expect(() =>
      postEntry(book, {
        date: "2027-01-01",
        memo: "x",
        lines: [
          { accountNumber: "1000", debit: 100, credit: 0 },
          { accountNumber: "3000", debit: 0, credit: 50 },
        ],
      })
    ).toThrow();
  });

  it("is append-only — posting returns a new array and does not mutate the book", () => {
    const book = makeBook();
    const before = book.entries;
    postEntry(book, {
      date: "2027-01-01",
      memo: "x",
      lines: [
        { accountNumber: "1000", debit: 100, credit: 0 },
        { accountNumber: "3000", debit: 0, credit: 100 },
      ],
    });
    expect(book.entries).toBe(before);
    expect(book.entries.length).toBe(0);
  });
});

describe("golden scenario — trial balance", () => {
  const book = postGoldenScenario(makeBook());
  const tb = computeTrialBalance(book.chartOfAccounts, book.entries);

  it("ties", () => {
    expect(tb.ties).toBe(true);
    expect(tb.totalDebits).toBeCloseTo(tb.totalCredits, 2);
  });

  it.each([
    ["1000", 51000],
    ["1100", 5000],
    ["1300", 12000],
    ["2000", 8000],
    ["3000", 50000],
    ["4000", 20000],
    ["5000", 8000],
    ["6100", 2000],
  ])("account %s balance is %d (hand-verified independently)", (number, expected) => {
    const row = tb.rows.find((r) => r.account.number === number);
    expect(row?.balance).toBeCloseTo(expected as number, 2);
  });
});

describe("golden scenario — general ledger detail", () => {
  const book = postGoldenScenario(makeBook());
  const cash = book.chartOfAccounts.find((a) => a.number === "1000")!;
  const activity = computeAccountActivity(cash, book.entries);

  it("shows every posting to the account in date order with a running balance", () => {
    expect(activity.lines.map((l) => l.runningBalance)).toEqual([50000, 38000, 53000, 51000]);
    expect(activity.endingBalance).toBeCloseTo(51000, 2);
  });
});

describe("golden scenario — income statement", () => {
  const book = postGoldenScenario(makeBook());
  const is = computeIncomeStatement(book.chartOfAccounts, book.entries, "2027-01-01", "2027-01-31");

  it("nets revenue 20,000 against expenses 10,000 for 10,000 net income", () => {
    expect(is.totalRevenue).toBeCloseTo(20000, 2);
    expect(is.totalExpenses).toBeCloseTo(10000, 2);
    expect(is.netIncome).toBeCloseTo(10000, 2);
  });
});

describe("golden scenario — balance sheet ties without a manual closing entry", () => {
  const book = postGoldenScenario(makeBook());
  const bs = computeBalanceSheet(book.chartOfAccounts, book.entries, "2027-01-31", "2027-01-01");

  it("assets = liabilities + equity, with current-year earnings rolled into equity live", () => {
    expect(bs.totalAssets).toBeCloseTo(68000, 2);
    expect(bs.totalLiabilities).toBeCloseTo(8000, 2);
    expect(bs.currentYearEarnings).toBeCloseTo(10000, 2);
    expect(bs.totalEquity).toBeCloseTo(60000, 2);
    expect(bs.ties).toBe(true);
  });
});

describe("reversal", () => {
  it("a posted entry followed by its reversal nets every account back to its pre-entry balance", () => {
    let book = makeBook();
    book = {
      ...book,
      entries: postEntry(book, {
        date: "2027-02-01",
        memo: "Error to be reversed",
        lines: [
          { accountNumber: "1000", debit: 500, credit: 0 },
          { accountNumber: "4000", debit: 0, credit: 500 },
        ],
      }),
    };
    const original = book.entries[0];
    const reversalDraft = buildReversal(original, "2027-02-02");
    book = { ...book, entries: postEntry(book, reversalDraft) };

    expect(book.entries).toHaveLength(2);
    expect(book.entries[0]).toBe(original); // append-only: original is untouched, not edited
    const tb = computeTrialBalance(book.chartOfAccounts, book.entries);
    expect(tb.rows.find((r) => r.account.number === "1000")?.balance).toBeCloseTo(0, 2);
    expect(tb.rows.find((r) => r.account.number === "4000")?.balance).toBeCloseTo(0, 2);
  });
});

describe("standard construction COA seed", () => {
  it("loads, every account is unique, and it balances to zero with no entries posted", async () => {
    const seed = (await import("@/data/coa/standard-construction-coa.json")).default as {
      accounts: Account[];
    };
    const numbers = seed.accounts.map((a) => a.number);
    expect(new Set(numbers).size).toBe(numbers.length);
    const tb = computeTrialBalance(seed.accounts, []);
    expect(tb.ties).toBe(true);
    expect(tb.totalDebits).toBe(0);
    for (const acct of seed.accounts) {
      if (acct.isSubAccount) {
        expect(seed.accounts.some((a) => a.number === acct.parentAccount)).toBe(true);
      }
    }
  });
});
