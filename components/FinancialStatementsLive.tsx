"use client";

/**
 * Income statement and balance sheet, computed live from posted entries —
 * including the balance sheet's current-year-earnings roll-up, so it
 * actually ties without a manual closing entry. This is the payoff screen:
 * the moment a learner sees that posting real transactions produces real
 * financial statements, not a graded worksheet.
 */
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Account } from "@/components/ChartOfAccountsBuilder";
import { computeIncomeStatement, computeBalanceSheet, type JournalEntry } from "@/lib/ledger";

const money = (n: number) =>
  (n < 0 ? "(" : "") +
  Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
  (n < 0 ? ")" : "");

export function FinancialStatementsLive({
  chartOfAccounts,
  entries,
  fiscalYearStart,
  asOfDate,
}: {
  chartOfAccounts: Account[];
  entries: JournalEntry[];
  fiscalYearStart: string;
  asOfDate: string;
}) {
  const is = useMemo(
    () => computeIncomeStatement(chartOfAccounts, entries, fiscalYearStart, asOfDate),
    [chartOfAccounts, entries, fiscalYearStart, asOfDate]
  );
  const bs = useMemo(
    () => computeBalanceSheet(chartOfAccounts, entries, asOfDate, fiscalYearStart),
    [chartOfAccounts, entries, asOfDate, fiscalYearStart]
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Income statement</CardTitle>
          <p className="text-xs text-muted-foreground">
            {fiscalYearStart} through {asOfDate}
          </p>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td
                  colSpan={2}
                  className="pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Revenue
                </td>
              </tr>
              {is.revenue.map((r) => (
                <tr key={r.account.number}>
                  <td className="py-0.5 pl-2">{r.account.name}</td>
                  <td className="py-0.5 text-right font-mono tabular-nums">${money(r.amount)}</td>
                </tr>
              ))}
              <tr className="border-t font-medium">
                <td className="py-1">Total revenue</td>
                <td className="py-1 text-right font-mono tabular-nums">
                  ${money(is.totalRevenue)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className="pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Expenses
                </td>
              </tr>
              {is.expenses.map((e) => (
                <tr key={e.account.number}>
                  <td className="py-0.5 pl-2">{e.account.name}</td>
                  <td className="py-0.5 text-right font-mono tabular-nums">${money(e.amount)}</td>
                </tr>
              ))}
              <tr className="border-t font-medium">
                <td className="py-1">Total expenses</td>
                <td className="py-1 text-right font-mono tabular-nums">
                  ${money(is.totalExpenses)}
                </td>
              </tr>
              <tr className="border-t-2 font-semibold">
                <td className="py-2">Net income</td>
                <td className="py-2 text-right font-mono tabular-nums">${money(is.netIncome)}</td>
              </tr>
            </tbody>
          </table>
          {is.revenue.length === 0 && is.expenses.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No revenue or expense activity this period yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Balance sheet</CardTitle>
          <span
            className={
              "rounded px-2 py-0.5 text-xs font-medium " +
              (bs.ties
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive")
            }
          >
            {bs.ties ? "Balances" : "Does not balance"}
          </span>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td
                  colSpan={2}
                  className="pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Assets
                </td>
              </tr>
              {bs.assets.map((a) => (
                <tr key={a.account.number}>
                  <td className="py-0.5 pl-2">{a.account.name}</td>
                  <td className="py-0.5 text-right font-mono tabular-nums">${money(a.amount)}</td>
                </tr>
              ))}
              <tr className="border-t font-medium">
                <td className="py-1">Total assets</td>
                <td className="py-1 text-right font-mono tabular-nums">${money(bs.totalAssets)}</td>
              </tr>

              <tr>
                <td
                  colSpan={2}
                  className="pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Liabilities
                </td>
              </tr>
              {bs.liabilities.map((l) => (
                <tr key={l.account.number}>
                  <td className="py-0.5 pl-2">{l.account.name}</td>
                  <td className="py-0.5 text-right font-mono tabular-nums">${money(l.amount)}</td>
                </tr>
              ))}
              <tr className="border-t font-medium">
                <td className="py-1">Total liabilities</td>
                <td className="py-1 text-right font-mono tabular-nums">
                  ${money(bs.totalLiabilities)}
                </td>
              </tr>

              <tr>
                <td
                  colSpan={2}
                  className="pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Equity
                </td>
              </tr>
              {bs.equity.map((e) => (
                <tr key={e.account.number}>
                  <td className="py-0.5 pl-2">{e.account.name}</td>
                  <td className="py-0.5 text-right font-mono tabular-nums">${money(e.amount)}</td>
                </tr>
              ))}
              <tr>
                <td className="py-0.5 pl-2 italic text-muted-foreground">Current-year earnings</td>
                <td className="py-0.5 text-right font-mono tabular-nums text-muted-foreground">
                  ${money(bs.currentYearEarnings)}
                </td>
              </tr>
              <tr className="border-t font-medium">
                <td className="py-1">Total equity</td>
                <td className="py-1 text-right font-mono tabular-nums">${money(bs.totalEquity)}</td>
              </tr>

              <tr className="border-t-2 font-semibold">
                <td className="py-2">Total liabilities + equity</td>
                <td className="py-2 text-right font-mono tabular-nums">
                  ${money(bs.totalLiabilities + bs.totalEquity)}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
