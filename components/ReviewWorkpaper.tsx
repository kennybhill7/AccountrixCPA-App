"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Crosshair,
  Eye,
  FileSignature,
  RotateCw,
  Search,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAttempts, useSrs } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";
import {
  DEFECT_LIBRARY,
  buildReviewCase,
  cellKey,
  gradeReviewSubmission,
  type CellValue,
  type ReviewColumn,
  type ReviewGrade,
  type ReviewRow,
  type ReviewVerdict,
  type ReviewWorkpaper as ReviewWorkpaperData,
} from "@/lib/reviewMode";

const LEDGER_KEY = "review-attempt-ledger";

interface ReviewAttempt {
  caseKey: string;
  completedAt: number;
  score: number;
  max: number;
  verdict: ReviewVerdict;
  selectedCell: string | null;
  defectType: string;
}

function saveAttempt(attempt: ReviewAttempt) {
  try {
    const existing = JSON.parse(localStorage.getItem(LEDGER_KEY) || "[]") as ReviewAttempt[];
    localStorage.setItem(LEDGER_KEY, JSON.stringify([attempt, ...existing].slice(0, 100)));
  } catch {
    // A full or blocked localStorage must never take the exercise down.
  }
}

function loadLatestAttempt(caseKey: string): ReviewAttempt | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = JSON.parse(localStorage.getItem(LEDGER_KEY) || "[]") as ReviewAttempt[];
    return existing.find((a) => a.caseKey === caseKey) ?? null;
  } catch {
    return null;
  }
}

function formatCell(value: CellValue, column: ReviewColumn): string {
  if (value === null || value === undefined) return column.kind === "text" ? "" : "—";
  if (typeof value === "string") return value;
  const decimals = column.decimals ?? 2;
  const negative = value < 0;
  const body = Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const withPrefix = `${column.currency ? "$" : ""}${body}${column.suffix ?? ""}`;
  // Accounting presentation: negatives in parentheses, because a reviewer reads
  // for sign before they read for magnitude.
  return negative ? `(${withPrefix})` : withPrefix;
}

const ROW_STYLE: Record<string, string> = {
  total: "font-semibold",
  subtotal: "font-medium",
  check: "italic",
  memo: "",
};

export function ReviewWorkpaper({
  workpaper,
  seed,
}: {
  workpaper: ReviewWorkpaperData;
  seed: number;
}) {
  const reviewCase = useMemo(() => buildReviewCase(workpaper, seed), [workpaper, seed]);
  const caseKey = `${workpaper.id}#${seed}`;

  const [verdict, setVerdict] = useState<ReviewVerdict | null>(null);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [cause, setCause] = useState("");
  const [grade, setGrade] = useState<ReviewGrade | null>(null);
  const [priorAttempt, setPriorAttempt] = useState<ReviewAttempt | null>(null);

  const recordAttempt = useAttempts((s) => s.record);
  const upsertMiss = useSrs((s) => s.upsertMiss);

  // Read the ledger after mount: reading localStorage in the initializer makes
  // the server and client first renders disagree (hydration mismatch).
  useEffect(() => {
    setPriorAttempt(loadLatestAttempt(caseKey));
  }, [caseKey]);

  // A new seed is a new case — never carry one case's answers into the next.
  useEffect(() => {
    setVerdict(null);
    setSelectedCell(null);
    setCause("");
    setGrade(null);
  }, [caseKey]);

  const submit = () => {
    if (!verdict) return;
    const result = gradeReviewSubmission(reviewCase, {
      verdict,
      selectedCell: verdict === "exception" ? selectedCell : null,
      cause: verdict === "exception" ? cause : "",
    });
    setGrade(result);

    const attempt: ReviewAttempt = {
      caseKey,
      completedAt: Date.now(),
      score: result.score,
      max: result.max,
      verdict,
      selectedCell,
      defectType: reviewCase.variant.type,
    };
    saveAttempt(attempt);
    setPriorAttempt(attempt);

    const itemId = `review:${workpaper.id}:${reviewCase.variant.id}`;
    recordAttempt({
      source: "workflow-task",
      track: "apply",
      itemId,
      skills: workpaper.skills,
      correct: result.passed,
      answer: { verdict, selectedCell, cause },
    });
    if (!result.passed) {
      upsertMiss(
        {
          itemId,
          skills: workpaper.skills,
          track: "apply",
          source: "workflow-task",
          label: `Review Mode — ${workpaper.title}`,
          href: `/review/${workpaper.id}?seed=${seed}`,
        },
        dayNumber(Date.now())
      );
    }
  };

  const graded = grade !== null;
  const defect = DEFECT_LIBRARY[reviewCase.variant.type];

  return (
    <div className="space-y-8">
      {priorAttempt && !graded ? (
        <section className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          You have reviewed this exact case before: {priorAttempt.score}/{priorAttempt.max} on{" "}
          {new Date(priorAttempt.completedAt).toLocaleString()}. Try a different case number for a
          fresh draw.
        </section>
      ) : null}

      <section className="rounded-lg border bg-card p-6">
        <div className="mb-3 flex items-center gap-2">
          <FileSignature className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">What you are being asked to sign</h2>
        </div>
        <p className="mb-3 leading-7 text-muted-foreground">{workpaper.purpose}</p>
        <p className="rounded-md border-l-4 border-primary/60 bg-primary/5 p-3 text-sm leading-6">
          <span className="font-medium">Preparer&rsquo;s assertion: </span>
          {workpaper.assertion}
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* The workpaper itself                                              */}
      {/* ---------------------------------------------------------------- */}
      {reviewCase.sections.map((section) => (
        <section key={section.id}>
          <h2 className="mb-1 text-lg font-semibold">{section.title}</h2>
          {section.footnote ? (
            <p className="mb-3 text-sm text-muted-foreground">{section.footnote}</p>
          ) : null}
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-3 py-2 text-left font-semibold">Line</th>
                  {section.columns.map((column) => (
                    <th
                      key={column.id}
                      className={`px-3 py-2 font-semibold ${
                        column.kind === "text" ? "text-left" : "text-right"
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row: ReviewRow) => (
                  <tr key={row.id} className="border-t align-top">
                    <td
                      className={`px-3 py-2 ${ROW_STYLE[row.kind ?? "input"] ?? ""}`}
                      style={{ paddingLeft: `${0.75 + (row.indent ?? 0) * 1}rem` }}
                    >
                      {row.label}
                    </td>
                    {section.columns.map((column) => {
                      const key = cellKey(section.id, row.id, column.id);
                      const value = row.values[column.id] ?? null;
                      const note = row.notes?.[column.id];
                      const selectable = value !== null && value !== "";
                      const isSelected = selectedCell === key;
                      const changed = graded && reviewCase.changedCells.find((c) => c.key === key);
                      return (
                        <td
                          key={column.id}
                          onClick={() => {
                            if (!selectable || graded) return;
                            setSelectedCell(isSelected ? null : key);
                            if (!verdict) setVerdict("exception");
                          }}
                          className={`px-3 py-2 ${column.kind === "text" ? "text-left" : "text-right tabular-nums"} ${
                            selectable && !graded ? "cursor-pointer hover:bg-accent/40" : ""
                          } ${isSelected ? "bg-primary/15 outline outline-2 outline-primary" : ""} ${
                            changed
                              ? changed.isRoot
                                ? "bg-red-500/15 outline outline-2 outline-red-500"
                                : "bg-amber-500/10"
                              : ""
                          } ${ROW_STYLE[row.kind ?? "input"] ?? ""}`}
                        >
                          <div>{formatCell(value, column)}</div>
                          {note ? (
                            <div className="mt-0.5 text-[11px] font-normal italic text-muted-foreground">
                              {note}
                            </div>
                          ) : null}
                          {changed ? (
                            <div className="mt-1 text-[11px] font-medium not-italic text-muted-foreground">
                              {changed.isRoot ? "Seeded defect · " : "Consequence · "}
                              correct value {formatCell(changed.cleanValue, column)}
                            </div>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {/* ---------------------------------------------------------------- */}
      {/* The reviewer's decision                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Your review</h2>
        </div>

        <div className="mb-5">
          <div className="mb-2 text-sm font-medium">1. Do you sign it?</div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={graded}
              onClick={() => setVerdict("sign-off")}
              className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors ${
                verdict === "sign-off"
                  ? "border-primary bg-primary/10 font-medium"
                  : "hover:bg-accent/40"
              } ${graded ? "opacity-70" : ""}`}
            >
              <BadgeCheck className="h-4 w-4" />
              Sign off — no exception
            </button>
            <button
              type="button"
              disabled={graded}
              onClick={() => setVerdict("exception")}
              className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors ${
                verdict === "exception"
                  ? "border-primary bg-primary/10 font-medium"
                  : "hover:bg-accent/40"
              } ${graded ? "opacity-70" : ""}`}
            >
              <AlertTriangle className="h-4 w-4" />
              Raise an exception — something is wrong
            </button>
          </div>
        </div>

        {verdict === "exception" ? (
          <>
            <div className="mb-5">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                <Crosshair className="h-4 w-4" />
                2. Which cell is the source?
              </div>
              <p className="mb-2 text-xs text-muted-foreground">
                Click the cell in the workpaper above. Point at the cause, not at the number that
                looks strangest — a wrong total is usually a symptom of a wrong input or formula.
              </p>
              <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                {selectedCell ? (
                  <span className="font-mono text-xs">{selectedCell}</span>
                ) : (
                  <span className="text-muted-foreground">No cell selected yet.</span>
                )}
              </div>
            </div>

            <div className="mb-5">
              <div className="mb-1 text-sm font-medium">3. What is the cause?</div>
              <p className="mb-2 text-xs text-muted-foreground">
                Write what went wrong and what it does to the numbers — the way you would in a
                review note back to the preparer.
              </p>
              <textarea
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                disabled={graded}
                placeholder="e.g. The total sums only the soft-cost block, so land and hard costs drop out and the loan draw computes negative..."
                className="min-h-32 w-full rounded-md border bg-background p-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={submit} disabled={!verdict || graded}>
            Submit review
          </Button>
          <Button asChild variant="outline">
            <Link href={`/review/${workpaper.id}?seed=${seed + 1}`}>
              <RotateCw className="mr-2 h-4 w-4" />
              {graded ? "Next case" : "Draw a different case"}
            </Link>
          </Button>
          {!verdict ? (
            <span className="text-xs text-muted-foreground">
              Choose sign-off or exception first.
            </span>
          ) : null}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Result                                                            */}
      {/* ---------------------------------------------------------------- */}
      {grade ? (
        <section className="space-y-4">
          <div
            className={`rounded-lg border p-5 ${
              grade.passed
                ? "border-green-600/40 bg-green-500/10"
                : "border-amber-600/40 bg-amber-500/10"
            }`}
          >
            <div className="text-lg font-semibold">
              {grade.score}/{grade.max} — {grade.headline}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {grade.levels.map((level) => (
              <div
                key={level.level}
                className={`rounded-lg border p-4 ${level.applicable ? "" : "opacity-60"}`}
              >
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold capitalize">
                  {!level.applicable ? (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  ) : level.ok ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  {level.level}
                  <span className="ml-auto tabular-nums text-muted-foreground">
                    {level.points}/{level.max}
                  </span>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">{level.detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-2 font-semibold">
              {reviewCase.isClean ? "This workpaper was clean" : `Defect: ${defect.label}`}
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">{defect.description}</p>
            <p className="mb-3 text-sm">
              <span className="font-medium">The tell: </span>
              {reviewCase.variant.tell}
            </p>
            <p className="mb-3 text-sm">
              <span className="font-medium">Review technique: </span>
              {defect.technique}
            </p>
            <details className="rounded-md border p-3">
              <summary className="cursor-pointer text-sm font-medium">Model review note</summary>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {reviewCase.variant.causeSummary}
              </p>
            </details>
            {grade.narrative ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Cause rubric: {grade.narrative.message}
              </p>
            ) : null}
          </div>

          {reviewCase.changedCells.length > 0 ? (
            <div className="rounded-lg border bg-card p-5">
              <h3 className="mb-3 font-semibold">What the corruption touched</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-2 pr-3">Cell</th>
                      <th className="py-2 pr-3">Role</th>
                      <th className="py-2 pr-3 text-right">Correct</th>
                      <th className="py-2 text-right">As presented</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewCase.changedCells.map((c) => (
                      <tr key={c.key} className="border-t">
                        <td className="py-2 pr-3">
                          {c.rowLabel}
                          <span className="text-muted-foreground"> · {c.columnLabel}</span>
                        </td>
                        <td className="py-2 pr-3">
                          {c.isRoot ? (
                            <span className="rounded bg-red-500/15 px-2 py-0.5 text-xs font-medium">
                              root cause
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">consequence</span>
                          )}
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums">
                          {typeof c.cleanValue === "number"
                            ? c.cleanValue.toLocaleString(undefined, { maximumFractionDigits: 2 })
                            : String(c.cleanValue ?? "—")}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          {typeof c.shownValue === "number"
                            ? c.shownValue.toLocaleString(undefined, { maximumFractionDigits: 2 })
                            : String(c.shownValue ?? "—")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
