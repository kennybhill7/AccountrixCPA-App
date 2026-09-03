"use client";

/**
 * A real journal-entry posting form — not a graded exercise against one
 * stored solution. Every line references a live chart of accounts; the
 * running debit/credit totals update as you type; posting is blocked until
 * the entry actually balances, the same discipline a real system enforces.
 */
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Check, AlertCircle } from "lucide-react";
import type { Account } from "@/components/ChartOfAccountsBuilder";
import { validateEntry, type JournalEntry } from "@/lib/ledger";

interface DraftLine {
  key: string;
  accountNumber: string;
  side: "debit" | "credit";
  amount: string;
}

const money = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function PostJournalEntry({
  chartOfAccounts,
  onPost,
  defaultDate,
}: {
  chartOfAccounts: Account[];
  onPost: (
    draft: Omit<JournalEntry, "id" | "postedAt">
  ) => { ok: true } | { ok: false; errors: string[] };
  defaultDate: string;
}) {
  const [date, setDate] = useState(defaultDate);
  const [reference, setReference] = useState("");
  const [memo, setMemo] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([
    { key: "l0", accountNumber: "", side: "debit", amount: "" },
    { key: "l1", accountNumber: "", side: "credit", amount: "" },
  ]);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [justPosted, setJustPosted] = useState(false);

  const activeAccounts = useMemo(
    () =>
      [...chartOfAccounts]
        .filter((a) => a.isActive)
        .sort((a, b) => a.number.localeCompare(b.number)),
    [chartOfAccounts]
  );

  const draftForValidation = useMemo(
    () => ({
      date,
      reference: reference || undefined,
      memo,
      lines: lines.map((l) => ({
        accountNumber: l.accountNumber,
        debit: l.side === "debit" ? Number(l.amount) || 0 : 0,
        credit: l.side === "credit" ? Number(l.amount) || 0 : 0,
      })),
    }),
    [date, reference, memo, lines]
  );

  const totalDebits = draftForValidation.lines.reduce((s, l) => s + l.debit, 0);
  const totalCredits = draftForValidation.lines.reduce((s, l) => s + l.credit, 0);
  const diff = Math.round((totalDebits - totalCredits) * 100) / 100;

  const liveErrors = useMemo(() => {
    // Only surface errors once every line has something entered — an empty
    // form shouldn't scream "unbalanced" before the user has typed anything.
    const started = lines.some((l) => l.accountNumber || l.amount);
    if (!started) return [];
    return validateEntry(chartOfAccounts, draftForValidation);
  }, [chartOfAccounts, draftForValidation, lines]);

  function updateLine(key: string, patch: Partial<DraftLine>) {
    setJustPosted(false);
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  }

  function addLine() {
    setJustPosted(false);
    setLines((prev) => [
      ...prev,
      { key: `l${prev.length}-${Date.now()}`, accountNumber: "", side: "debit", amount: "" },
    ]);
  }

  function removeLine(key: string) {
    setJustPosted(false);
    setLines((prev) => (prev.length <= 2 ? prev : prev.filter((l) => l.key !== key)));
  }

  function handlePost() {
    const result = onPost(draftForValidation);
    if (result.ok) {
      setSubmitErrors([]);
      setJustPosted(true);
      setMemo("");
      setReference("");
      setLines([
        { key: `l0-${Date.now()}`, accountNumber: "", side: "debit", amount: "" },
        { key: `l1-${Date.now()}`, accountNumber: "", side: "credit", amount: "" },
      ]);
    } else {
      setSubmitErrors(result.errors);
      setJustPosted(false);
    }
  }

  const canPost = lines.length >= 2 && liveErrors.length === 0 && memo.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a journal entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Reference (optional)
            </label>
            <Input
              placeholder="Check #, invoice #, JE-0007…"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          <div className="sm:col-span-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Memo</label>
            <Input
              placeholder="What is this transaction?"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          {lines.map((line) => (
            <div key={line.key} className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-5">
                <Select
                  value={line.accountNumber}
                  onValueChange={(v) => updateLine(line.key, { accountNumber: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account…" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeAccounts.map((a) => (
                      <SelectItem key={a.number} value={a.number}>
                        {a.number} · {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Select
                  value={line.side}
                  onValueChange={(v) => updateLine(line.key, { side: v as "debit" | "credit" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="0.00"
                  value={line.amount}
                  onChange={(e) => updateLine(line.key, { amount: e.target.value })}
                  className="text-right font-mono tabular-nums"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLine(line.key)}
                  disabled={lines.length <= 2}
                  aria-label="Remove line"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addLine} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add line
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-md border px-3 py-2 font-mono text-sm tabular-nums">
          <span>
            Debits <strong>${money(totalDebits)}</strong>
          </span>
          <span>
            Credits <strong>${money(totalCredits)}</strong>
          </span>
          <span
            className={
              diff === 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }
          >
            {diff === 0 ? "Balanced" : `Off by $${money(Math.abs(diff))}`}
          </span>
        </div>

        {(liveErrors.length > 0 || submitErrors.length > 0) && (
          <div className="space-y-1 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {(submitErrors.length > 0 ? submitErrors : liveErrors.map((e) => e.message)).map(
              (msg, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{msg}</span>
                </div>
              )
            )}
          </div>
        )}

        {justPosted && (
          <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-400">
            <Check className="h-4 w-4" /> Posted. The trial balance and general ledger updated.
          </div>
        )}

        <Button onClick={handlePost} disabled={!canPost} className="w-full">
          Post entry
        </Button>
      </CardContent>
    </Card>
  );
}
