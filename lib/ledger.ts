/**
 * A real double-entry posting engine — not a graded single-scenario exercise.
 *
 * Existing simulators (JournalEntrySimulator, TrialBalanceWorksheet) hand you
 * a fixed scenario and check your answer against one stored solution. This
 * module is the opposite shape: an open-ended ledger you post to over time,
 * where every downstream report — trial balance, general ledger detail,
 * income statement, balance sheet — is *derived* from whatever has actually
 * been posted, the same way a real accounting system works.
 *
 * Append-only by design (matches ROADMAP.md's stated principle): a posted
 * entry is never edited or deleted. A correction is a new entry that reverses
 * the original, so the audit trail — and the reason a balance changed — is
 * never lost. This is exactly the discipline construction accounting expects
 * ("do not assume the GL is correct"; ties are proven, not assumed).
 *
 * Uses the existing `Account` shape from ChartOfAccountsBuilder, so a posted
 * book's chart of accounts round-trips through the same COA editor, importer,
 * and exporter already built for the static COA exercises.
 */
import type { Account, AccountType } from "@/components/ChartOfAccountsBuilder";

const TOLERANCE = 0.005;
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export interface JournalLine {
  accountNumber: string;
  /** Exactly one of debit/credit is > 0 on a given line; the other is 0. */
  debit: number;
  credit: number;
  memo?: string;
}

export interface JournalEntry {
  id: string;
  /** ISO date, e.g. "2027-03-14" */
  date: string;
  /** Human reference — check #, invoice #, "JE-0007" */
  reference?: string;
  memo: string;
  lines: JournalLine[];
  postedAt: number;
  /** Set when this entry reverses an earlier one; that entry is never edited. */
  reversalOf?: string;
}

export interface LedgerBook {
  id: string;
  name: string;
  /** Fictional company/scenario this book represents. */
  company: string;
  createdAt: number;
  chartOfAccounts: Account[];
  entries: JournalEntry[];
}

export interface EntryValidationError {
  code:
    | "too-few-lines"
    | "line-missing-account"
    | "unknown-account"
    | "inactive-account"
    | "line-both-sides"
    | "line-neither-side"
    | "line-negative"
    | "line-zero"
    | "unbalanced"
    | "missing-date"
    | "missing-memo";
  message: string;
  lineIndex?: number;
}

/** Validate a draft entry against a chart of accounts. Never mutates either. */
export function validateEntry(
  coa: Account[],
  draft: Omit<JournalEntry, "id" | "postedAt">
): EntryValidationError[] {
  const errors: EntryValidationError[] = [];
  const byNumber = new Map(coa.map((a) => [a.number, a]));

  if (!draft.date) errors.push({ code: "missing-date", message: "Entry date is required." });
  if (!draft.memo?.trim())
    errors.push({
      code: "missing-memo",
      message: "Entry needs a memo describing the transaction.",
    });

  if (draft.lines.length < 2) {
    errors.push({
      code: "too-few-lines",
      message: "A journal entry needs at least two lines — one debit side and one credit side.",
    });
  }

  let totalDebits = 0;
  let totalCredits = 0;

  draft.lines.forEach((line, i) => {
    if (!line.accountNumber) {
      errors.push({
        code: "line-missing-account",
        message: `Line ${i + 1} has no account selected.`,
        lineIndex: i,
      });
      return;
    }
    const acct = byNumber.get(line.accountNumber);
    if (!acct) {
      errors.push({
        code: "unknown-account",
        message: `Line ${i + 1}: account ${line.accountNumber} is not in this book's chart of accounts.`,
        lineIndex: i,
      });
      return;
    }
    if (!acct.isActive) {
      errors.push({
        code: "inactive-account",
        message: `Line ${i + 1}: account ${acct.number} ${acct.name} is inactive.`,
        lineIndex: i,
      });
    }

    const hasDebit = line.debit > 0;
    const hasCredit = line.credit > 0;
    if (hasDebit && hasCredit) {
      errors.push({
        code: "line-both-sides",
        message: `Line ${i + 1}: a single line cannot carry both a debit and a credit.`,
        lineIndex: i,
      });
    } else if (!hasDebit && !hasCredit) {
      errors.push({
        code: "line-neither-side",
        message: `Line ${i + 1}: enter an amount on either the debit or the credit side.`,
        lineIndex: i,
      });
    }
    if (line.debit < 0 || line.credit < 0) {
      errors.push({
        code: "line-negative",
        message: `Line ${i + 1}: amounts cannot be negative — post the offsetting side instead.`,
        lineIndex: i,
      });
    }

    totalDebits += line.debit || 0;
    totalCredits += line.credit || 0;
  });

  if (Math.abs(totalDebits - totalCredits) > TOLERANCE) {
    errors.push({
      code: "unbalanced",
      message: `Debits ($${round2(totalDebits).toLocaleString()}) must equal credits ($${round2(
        totalCredits
      ).toLocaleString()}). Off by $${round2(Math.abs(totalDebits - totalCredits)).toLocaleString()}.`,
    });
  }

  return errors;
}

/**
 * Post a validated entry. Throws if invalid — callers should run
 * validateEntry first and surface errors in the UI rather than relying on
 * this throwing. Append-only: returns a NEW entries array, never mutates.
 */
export function postEntry(
  book: LedgerBook,
  draft: Omit<JournalEntry, "id" | "postedAt">
): JournalEntry[] {
  const errors = validateEntry(book.chartOfAccounts, draft);
  if (errors.length > 0) {
    throw new Error(`Cannot post: ${errors.map((e) => e.message).join(" ")}`);
  }
  const entry: JournalEntry = {
    ...draft,
    id: `je-${book.entries.length + 1}-${Date.now().toString(36)}`,
    postedAt: Date.now(),
  };
  return [...book.entries, entry];
}

/**
 * Build the entry that reverses a posted one — debit/credit swapped on every
 * line, dated today (or a supplied date) unless the caller wants the
 * original date. The original entry is left untouched.
 */
export function buildReversal(
  original: JournalEntry,
  asOfDate: string,
  memoSuffix = "reversal"
): Omit<JournalEntry, "id" | "postedAt"> {
  return {
    date: asOfDate,
    reference: original.reference ? `${original.reference}-REV` : undefined,
    memo: `${original.memo} (${memoSuffix} of ${original.reference ?? original.id})`,
    lines: original.lines.map((l) => ({
      accountNumber: l.accountNumber,
      debit: l.credit,
      credit: l.debit,
      memo: l.memo,
    })),
    reversalOf: original.id,
  };
}

export interface TrialBalanceRow {
  account: Account;
  /** Sum of every debit line posted to this account. */
  totalDebits: number;
  /** Sum of every credit line posted to this account. */
  totalCredits: number;
  /** Signed per the account's normal balance — positive means a normal balance. */
  balance: number;
}

/**
 * The trial balance as of a date (inclusive). Every account in the COA
 * appears, even at zero, so a reviewer can see what was NOT touched.
 */
export function computeTrialBalance(
  coa: Account[],
  entries: JournalEntry[],
  asOfDate?: string
): { rows: TrialBalanceRow[]; totalDebits: number; totalCredits: number; ties: boolean } {
  const sums = new Map<string, { debit: number; credit: number }>();
  for (const acct of coa) sums.set(acct.number, { debit: 0, credit: 0 });

  for (const entry of entries) {
    if (asOfDate && entry.date > asOfDate) continue;
    for (const line of entry.lines) {
      const s = sums.get(line.accountNumber);
      if (!s) continue; // account since removed from the COA; activity still posted historically
      s.debit += line.debit || 0;
      s.credit += line.credit || 0;
    }
  }

  const rows: TrialBalanceRow[] = coa.map((account) => {
    const s = sums.get(account.number) ?? { debit: 0, credit: 0 };
    const net = s.debit - s.credit;
    const balance = account.normalBalance === "DR" ? net : -net;
    return {
      account,
      totalDebits: round2(s.debit),
      totalCredits: round2(s.credit),
      balance: round2(balance),
    };
  });

  // Which column a balance sits in on a real trial balance is decided by the
  // sign of its RAW net (debit activity minus credit activity), not by the
  // account's textbook "normal balance" — an account can sit on its
  // abnormal side (a bank account overdrawn, a contra account with no
  // offsetting entries yet) and still belongs in a real column. Re-deriving
  // this from the already-normalized `balance` field by comparing signs
  // against `normalBalance` double-counted the normalization and broke the
  // tie-out; go back to the raw debit/credit sums instead.
  let totalDebits = 0;
  let totalCredits = 0;
  for (const account of coa) {
    const s = sums.get(account.number) ?? { debit: 0, credit: 0 };
    const net = round2(s.debit - s.credit);
    if (net >= 0) totalDebits += net;
    else totalCredits += -net;
  }

  return {
    rows,
    totalDebits: round2(totalDebits),
    totalCredits: round2(totalCredits),
    ties: Math.abs(totalDebits - totalCredits) <= TOLERANCE,
  };
}

export interface LedgerLine {
  entryId: string;
  date: string;
  reference?: string;
  memo: string;
  debit: number;
  credit: number;
  /** Running balance after this line, signed per the account's normal side. */
  runningBalance: number;
}

/** T-account / general-ledger detail for one account, in posting order. */
export function computeAccountActivity(
  account: Account,
  entries: JournalEntry[],
  asOfDate?: string
): { lines: LedgerLine[]; endingBalance: number } {
  const relevant = entries
    .filter((e) => !asOfDate || e.date <= asOfDate)
    .flatMap((e) =>
      e.lines.filter((l) => l.accountNumber === account.number).map((l) => ({ entry: e, line: l }))
    )
    .sort(
      (a, b) => a.entry.date.localeCompare(b.entry.date) || a.entry.postedAt - b.entry.postedAt
    );

  let running = 0;
  const lines: LedgerLine[] = relevant.map(({ entry, line }) => {
    const delta =
      account.normalBalance === "DR"
        ? (line.debit || 0) - (line.credit || 0)
        : (line.credit || 0) - (line.debit || 0);
    running = round2(running + delta);
    return {
      entryId: entry.id,
      date: entry.date,
      reference: entry.reference,
      memo: line.memo || entry.memo,
      debit: line.debit || 0,
      credit: line.credit || 0,
      runningBalance: running,
    };
  });

  return { lines, endingBalance: running };
}

export interface IncomeStatementResult {
  revenue: { account: Account; amount: number }[];
  expenses: { account: Account; amount: number }[];
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
}

/** Revenue and expense activity between two dates (inclusive), a period P&L. */
export function computeIncomeStatement(
  coa: Account[],
  entries: JournalEntry[],
  periodStart: string,
  periodEnd: string
): IncomeStatementResult {
  const inPeriod = entries.filter((e) => e.date >= periodStart && e.date <= periodEnd);
  const tb = computeTrialBalance(coa, inPeriod);

  const revenue = tb.rows
    .filter((r) => r.account.type === "Revenue" && r.account.isActive)
    .map((r) => ({ account: r.account, amount: r.balance }));
  const expenses = tb.rows
    .filter((r) => r.account.type === "Expense" && r.account.isActive)
    .map((r) => ({ account: r.account, amount: r.balance }));

  const totalRevenue = round2(revenue.reduce((s, r) => s + r.amount, 0));
  const totalExpenses = round2(expenses.reduce((s, e) => s + e.amount, 0));
  return {
    revenue,
    expenses,
    totalRevenue,
    totalExpenses,
    netIncome: round2(totalRevenue - totalExpenses),
  };
}

export interface BalanceSheetResult {
  assets: { account: Account; amount: number }[];
  liabilities: { account: Account; amount: number }[];
  equity: { account: Account; amount: number }[];
  totalAssets: number;
  totalLiabilities: number;
  /** Prior-period equity plus current-year net income to date — the roll-up
   *  that makes the sheet actually balance without a manual closing entry. */
  currentYearEarnings: number;
  totalEquity: number;
  ties: boolean;
}

/**
 * Balance sheet as of a date, with current-year earnings rolled up live from
 * the income statement — the test of whether the engine is doing real
 * accounting: Assets must equal Liabilities + Equity without anyone posting
 * a manual closing entry to force it.
 */
export function computeBalanceSheet(
  coa: Account[],
  entries: JournalEntry[],
  asOfDate: string,
  fiscalYearStart: string
): BalanceSheetResult {
  const tb = computeTrialBalance(coa, entries, asOfDate);
  const assets = tb.rows
    .filter((r) => r.account.type === "Asset" && r.account.isActive)
    .map((r) => ({ account: r.account, amount: r.balance }));
  const liabilities = tb.rows
    .filter((r) => r.account.type === "Liability" && r.account.isActive)
    .map((r) => ({ account: r.account, amount: r.balance }));
  const equity = tb.rows
    .filter((r) => r.account.type === "Equity" && r.account.isActive)
    .map((r) => ({ account: r.account, amount: r.balance }));

  const is = computeIncomeStatement(coa, entries, fiscalYearStart, asOfDate);
  const totalAssets = round2(assets.reduce((s, a) => s + a.amount, 0));
  const totalLiabilities = round2(liabilities.reduce((s, l) => s + l.amount, 0));
  const equityExCurrentYear = round2(equity.reduce((s, e) => s + e.amount, 0));
  const totalEquity = round2(equityExCurrentYear + is.netIncome);

  return {
    assets,
    liabilities,
    equity,
    totalAssets,
    totalLiabilities,
    currentYearEarnings: is.netIncome,
    totalEquity,
    ties: Math.abs(totalAssets - (totalLiabilities + totalEquity)) <= TOLERANCE,
  };
}
