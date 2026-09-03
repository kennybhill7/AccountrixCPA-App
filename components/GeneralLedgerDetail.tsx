"use client";

/**
 * T-account / running-balance detail for one account — click an account on
 * the trial balance and see every line that ever posted to it, in order,
 * with a running balance. This is what "where did this number come from"
 * actually looks like in a real ledger.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Account } from "@/components/ChartOfAccountsBuilder";
import { computeAccountActivity, type JournalEntry } from "@/lib/ledger";

const money = (n: number) =>
  Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function GeneralLedgerDetail({
  account,
  entries,
}: {
  account: Account;
  entries: JournalEntry[];
}) {
  const { lines, endingBalance } = computeAccountActivity(account, entries);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="font-mono text-sm text-muted-foreground">{account.number}</span>{" "}
          {account.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lines.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No activity posted to this account yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Memo</th>
                  <th className="py-2 pr-3 text-right font-medium">Debit</th>
                  <th className="py-2 pr-3 text-right font-medium">Credit</th>
                  <th className="py-2 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={`${l.entryId}-${i}`} className="border-b last:border-0">
                    <td className="py-1.5 pr-3 font-mono text-xs">{l.date}</td>
                    <td className="py-1.5 pr-3">
                      {l.memo}
                      {l.reference && (
                        <span className="ml-1 text-xs text-muted-foreground">({l.reference})</span>
                      )}
                    </td>
                    <td className="py-1.5 pr-3 text-right font-mono tabular-nums">
                      {l.debit ? `$${money(l.debit)}` : ""}
                    </td>
                    <td className="py-1.5 pr-3 text-right font-mono tabular-nums">
                      {l.credit ? `$${money(l.credit)}` : ""}
                    </td>
                    <td className="py-1.5 text-right font-mono tabular-nums">
                      ${money(l.runningBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 font-semibold">
                  <td colSpan={4} className="py-2 pr-3 text-right">
                    Ending balance ({account.normalBalance === "DR" ? "debit" : "credit"} normal)
                  </td>
                  <td className="py-2 text-right font-mono tabular-nums">
                    ${money(endingBalance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
