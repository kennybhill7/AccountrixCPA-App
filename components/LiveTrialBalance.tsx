"use client";

/**
 * A trial balance derived live from every posted entry — not a static
 * worksheet exercise. Zero-activity accounts are hidden by default (a real
 * TB is long; nobody wants to scroll past sixty untouched accounts to find
 * the ones that moved), toggle to see the full chart.
 */
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Account } from "@/components/ChartOfAccountsBuilder";
import { computeTrialBalance, type JournalEntry } from "@/lib/ledger";

const money = (n: number) =>
  Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function LiveTrialBalance({
  chartOfAccounts,
  entries,
  onSelectAccount,
}: {
  chartOfAccounts: Account[];
  entries: JournalEntry[];
  onSelectAccount?: (account: Account) => void;
}) {
  const [showZero, setShowZero] = useState(false);
  const tb = useMemo(
    () => computeTrialBalance(chartOfAccounts, entries),
    [chartOfAccounts, entries]
  );
  const rows = showZero
    ? tb.rows
    : tb.rows.filter((r) => r.totalDebits !== 0 || r.totalCredits !== 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Trial balance</CardTitle>
        <div className="flex items-center gap-3">
          <span
            className={
              "rounded px-2 py-0.5 text-xs font-medium " +
              (tb.ties
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive")
            }
          >
            {tb.ties ? "Ties" : "Does not tie"}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setShowZero((v) => !v)}>
            {showZero ? "Hide zero-activity accounts" : "Show all accounts"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Account</th>
                <th className="py-2 pr-3 text-right font-medium">Debit</th>
                <th className="py-2 font-medium text-right">Credit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const debitCol =
                  r.account.normalBalance === "DR"
                    ? Math.max(r.balance, 0)
                    : Math.max(-r.balance, 0);
                const creditCol =
                  r.account.normalBalance === "CR"
                    ? Math.max(r.balance, 0)
                    : Math.max(-r.balance, 0);
                return (
                  <tr
                    key={r.account.number}
                    className={
                      "border-b last:border-0" +
                      (onSelectAccount ? " cursor-pointer hover:bg-muted/40" : "")
                    }
                    onClick={() => onSelectAccount?.(r.account)}
                  >
                    <td className="py-1.5 pr-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {r.account.number}
                      </span>{" "}
                      {r.account.name}
                    </td>
                    <td className="py-1.5 pr-3 text-right font-mono tabular-nums">
                      {debitCol !== 0 ? `$${money(debitCol)}` : ""}
                    </td>
                    <td className="py-1.5 text-right font-mono tabular-nums">
                      {creditCol !== 0 ? `$${money(creditCol)}` : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-semibold">
                <td className="py-2 pr-3">Total</td>
                <td className="py-2 pr-3 text-right font-mono tabular-nums">
                  ${money(tb.totalDebits)}
                </td>
                <td className="py-2 text-right font-mono tabular-nums">
                  ${money(tb.totalCredits)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {rows.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nothing posted yet — post a journal entry to see it here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
