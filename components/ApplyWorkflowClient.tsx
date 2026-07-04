"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Calculator, CheckCircle2, MessageSquare, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAttempts, useSrs } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";
import type { CaseWorkflow, WorkflowTask } from "@/lib/case-workflows";

type Answers = Record<string, string>;

interface TaskResult {
  taskId: string;
  passed: boolean;
  score: number;
  max: number;
  message: string;
}

interface ApplyAttempt {
  workflowKey: string;
  completedAt: number;
  score: number;
  max: number;
  results: TaskResult[];
  answers: Answers;
}

const LEDGER_KEY = "apply-attempt-ledger";

function renderValue(value: unknown) {
  if (value === null || value === undefined) return <span className="text-muted-foreground">None</span>;

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return <span>{String(value)}</span>;
  }

  return (
    <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function getObjectKeys(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.keys(value as Record<string, unknown>);
}

function parseNumber(raw: string): number | null {
  const normalized = raw.replace(/[$,%\s,]/g, "");
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

/** User-entered amounts arrive as strings that may contain $ and commas. */
function toAmount(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = parseNumber(String(value ?? ""));
  return parsed ?? 0;
}

function parseJsonAnswer(raw: string): unknown | null {
  if (!raw.trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function containsAll(text: string, values: string[]): { matched: number; total: number } {
  const lower = text.toLowerCase();
  const matched = values.filter((v) => lower.includes(v.toLowerCase())).length;
  return { matched, total: values.length };
}

export function gradeCalc(task: WorkflowTask, answer: string): TaskResult {
  const expected = task.expected as Record<string, unknown>;
  const keys = getObjectKeys(expected);
  const tolerance = typeof task.tolerance === "number" ? task.tolerance : 0;
  const parsed = parseJsonAnswer(answer);
  const answerObject = parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? (parsed as Record<string, unknown>)
    : null;

  let correct = 0;
  const details: string[] = [];

  for (const key of keys) {
    const expectedNumber = Number(expected[key]);
    const raw = answerObject ? String(answerObject[key] ?? "") : answer;
    const actual = parseNumber(raw);
    const ok =
      actual !== null &&
      Number.isFinite(expectedNumber) &&
      Math.abs(actual - expectedNumber) <= tolerance;
    if (ok) correct += 1;
    details.push(`${key}: ${ok ? "ok" : "expected within tolerance"}`);
  }

  const passed = keys.length > 0 && correct === keys.length;
  return {
    taskId: task.id,
    passed,
    score: correct,
    max: Math.max(keys.length, 1),
    message: passed ? "Calculation ties." : details.join("; "),
  };
}

function expectedEntries(task: WorkflowTask): Array<{
  account: string;
  debit: number;
  credit: number;
}> {
  const expected = task.expected as { entries?: unknown };
  if (!Array.isArray(expected?.entries)) return [];
  return expected.entries
    .map((line) => {
      const row = line as { account?: unknown; debit?: unknown; credit?: unknown };
      return {
        account: String(row.account ?? "").trim(),
        debit: Number(row.debit ?? 0),
        credit: Number(row.credit ?? 0),
      };
    })
    .filter((line) => line.account);
}

export function gradeWriteup(task: WorkflowTask, answer: string): TaskResult {
  const expected = task.expected as { keywords?: string[] };
  const keywords = expected?.keywords ?? [];
  const minWords = typeof (task.input as { minWords?: unknown } | undefined)?.minWords === "number"
    ? ((task.input as { minWords: number }).minWords)
    : 0;
  return gradeNarrative(task.id, answer, keywords, minWords, "writeup");
}

export function gradeNarrative(
  taskId: string,
  answer: string,
  keywords: string[],
  minWords: number,
  label: "writeup" | "conversation"
): TaskResult {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const { matched, total } = containsAll(answer, keywords);
  const lower = answer.toLowerCase();
  const dimensions = [
    {
      name: "coverage",
      ok: total === 0 || matched / total >= 0.6,
      detail: `${matched}/${total} keywords`,
    },
    {
      name: "depth",
      ok: minWords === 0 || words >= minWords,
      detail: `${words}/${minWords || "any"} words`,
    },
    {
      name: "support",
      ok: /(\$|\d|%|account|acct|balance|ties|reconcile)/i.test(answer),
      detail: "uses numbers/accounts/tie-out evidence",
    },
    {
      name: "judgment",
      ok: /(because|therefore|so|risk|action|recommend|follow up|control|covenant|ready|not ready)/i.test(lower),
      detail: "explains implication or next action",
    },
  ];
  const score = dimensions.filter((d) => d.ok).length;

  return {
    taskId,
    passed: score >= 3,
    score,
    max: dimensions.length,
    message: `${label} rubric: ${dimensions
      .map((d) => `${d.name} ${d.ok ? "ok" : "miss"} (${d.detail})`)
      .join("; ")}.`,
  };
}

export function gradeJournalEntry(task: WorkflowTask, answer: string): TaskResult {
  const expected = expectedEntries(task);
  const tolerance = typeof task.tolerance === "number" ? task.tolerance : 0;

  const parsed = parseJsonAnswer(answer);
  const actualEntries =
    parsed && typeof parsed === "object"
      ? Array.isArray(parsed)
        ? parsed
        : Array.isArray((parsed as { entries?: unknown }).entries)
          ? (parsed as { entries: unknown[] }).entries
          : []
      : [];

  const actual = actualEntries.map((line) => {
    const row = line as { account?: unknown; debit?: unknown; credit?: unknown };
    return {
      account: String(row.account ?? "").trim(),
      debit: toAmount(row.debit),
      credit: toAmount(row.credit),
    };
  });

  const used = new Set<number>();
  let exactLines = 0;

  for (const exp of expected) {
    const idx = actual.findIndex((act, i) => {
      if (used.has(i)) return false;
      return (
        act.account === exp.account &&
        Math.abs(act.debit - exp.debit) <= tolerance &&
        Math.abs(act.credit - exp.credit) <= tolerance
      );
    });
    if (idx >= 0) {
      used.add(idx);
      exactLines += 1;
    }
  }

  const totals = actual.reduce(
    (acc, line) => ({ debit: acc.debit + line.debit, credit: acc.credit + line.credit }),
    { debit: 0, credit: 0 }
  );
  const balanced = Math.abs(totals.debit - totals.credit) <= tolerance;

  return {
    taskId: task.id,
    passed: expected.length > 0 && exactLines === expected.length && balanced,
    score: exactLines + (balanced ? 1 : 0),
    max: Math.max(expected.length, 1) + 1,
    message: `${exactLines}/${expected.length} exact account/debit/credit lines; ${
      balanced ? "entry balances" : "entry does not balance"
    }.`,
  };
}

export function gradeTask(task: WorkflowTask, answer: string): TaskResult {
  if (!answer.trim()) {
    return { taskId: task.id, passed: false, score: 0, max: 1, message: "No answer submitted." };
  }
  if (task.type === "calc") return gradeCalc(task, answer);
  if (task.type === "writeup") return gradeWriteup(task, answer);
  if (task.type === "je") return gradeJournalEntry(task, answer);
  return gradeWriteup(task, answer);
}

function saveAttempt(attempt: ApplyAttempt) {
  const existing = JSON.parse(localStorage.getItem(LEDGER_KEY) || "[]") as ApplyAttempt[];
  const next = [attempt, ...existing].slice(0, 100);
  localStorage.setItem(LEDGER_KEY, JSON.stringify(next));
}

function loadLatestAttempt(workflowKey: string): ApplyAttempt | null {
  if (typeof window === "undefined") return null;
  const existing = JSON.parse(localStorage.getItem(LEDGER_KEY) || "[]") as ApplyAttempt[];
  return existing.find((a) => a.workflowKey === workflowKey) ?? null;
}

export function ApplyWorkflowClient({
  workflow,
  companyId,
  workflowId,
}: {
  workflow: CaseWorkflow;
  /** Route params for the workflow page — used to link SRS reviews back here.
      Fall back to workflow.company / workflow.id when not supplied. */
  companyId?: string;
  workflowId?: string;
}) {
  const workflowKey = `${workflow.company}:${workflow.id}`;
  const workflowHref = `/apply/${companyId ?? workflow.company}/${workflowId ?? workflow.id}`;
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<TaskResult[] | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<ApplyAttempt | null>(() => loadLatestAttempt(workflowKey));
  const recordAttempt = useAttempts((s) => s.record);
  const upsertMiss = useSrs((s) => s.upsertMiss);

  const totalScore = useMemo(() => results?.reduce((sum, r) => sum + r.score, 0) ?? 0, [results]);
  const totalMax = useMemo(() => results?.reduce((sum, r) => sum + r.max, 0) ?? 0, [results]);

  function taskAnswer(task: WorkflowTask): string {
    if (task.type === "calc") {
      const keys = getObjectKeys(task.expected);
      if (keys.length > 1) {
        return JSON.stringify(Object.fromEntries(keys.map((key) => [key, answers[`${task.id}:${key}`] ?? ""])));
      }
    }
    if (task.type === "je") {
      const lineCount = Math.max(expectedEntries(task).length, 2);
      return JSON.stringify({
        entries: Array.from({ length: lineCount }, (_, i) => ({
          account: answers[`${task.id}:je:${i}:account`] ?? "",
          debit: answers[`${task.id}:je:${i}:debit`] ?? "",
          credit: answers[`${task.id}:je:${i}:credit`] ?? "",
        })),
      });
    }
    return answers[task.id] ?? "";
  }

  const submit = () => {
    const taskResults = workflow.tasks.map((task) => gradeTask(task, taskAnswer(task)));
    const conversationResult =
      workflow.conversationSim && (answers.__conversation ?? "").trim()
        ? gradeNarrative(
            "__conversation",
            answers.__conversation ?? "",
            (workflow.conversationSim.modelAnswer ?? "")
              .split(/\W+/)
              .filter((w) => w.length > 6)
              .slice(0, 8),
            35,
            "conversation"
          )
        : null;
    const graded = conversationResult ? [...taskResults, conversationResult] : taskResults;
    const attempt: ApplyAttempt = {
      workflowKey,
      completedAt: Date.now(),
      score: graded.reduce((sum, r) => sum + r.score, 0),
      max: graded.reduce((sum, r) => sum + r.max, 0),
      results: graded,
      answers,
    };
    saveAttempt(attempt);
    // Bridge into the unified attempt ledger (FABLE5_ANALYSIS §4a): one
    // AttemptEvent per graded task. The richer per-task detail stays in this
    // component's own "apply-attempt-ledger" localStorage history above.
    const nowDay = dayNumber(Date.now());
    workflow.tasks.forEach((task, i) => {
      const itemId = `${workflow.company}:${workflow.id}:${task.id}`;
      recordAttempt({
        source: "workflow-task",
        track: "apply",
        itemId,
        skills: workflow.skills ?? [],
        correct: graded[i].passed,
        answer: taskAnswer(task),
      });
      // Failed tasks seed the SRS queue with a route back to this workflow.
      if (!graded[i].passed) {
        const primarySkill = (workflow.skills ?? [])[0];
        upsertMiss(
          {
            itemId,
            skills: workflow.skills ?? [],
            track: "apply",
            source: "workflow-task",
            label: `Apply ${workflow.id} ${task.id}${primarySkill ? ` — ${primarySkill}` : ""}`,
            href: workflowHref,
          },
          nowDay
        );
      }
    });
    if (conversationResult) {
      const itemId = `${workflow.company}:${workflow.id}:conversation`;
      recordAttempt({
        source: "workflow-task",
        track: "apply",
        itemId,
        skills: workflow.skills ?? [],
        correct: conversationResult.passed,
        answer: answers.__conversation ?? "",
      });
      if (!conversationResult.passed) {
        upsertMiss(
          {
            itemId,
            skills: workflow.skills ?? [],
            track: "apply",
            source: "workflow-task",
            label: `Apply ${workflow.id} stakeholder response`,
            href: workflowHref,
          },
          nowDay
        );
      }
    }
    setResults(graded);
    setLatestAttempt(attempt);
  };

  return (
    <div className="space-y-8">
      {latestAttempt ? (
        <section className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Last attempt: {latestAttempt.score}/{latestAttempt.max} points on{" "}
          {new Date(latestAttempt.completedAt).toLocaleString()}.
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Workpaper Tasks</h2>
        </div>
        <div className="space-y-4">
          {workflow.tasks.map((task, index) => {
            const result = results?.find((r) => r.taskId === task.id);
            const inputFields = getObjectKeys(task.input && typeof task.input === "object" ? (task.input as { fields?: unknown }).fields ? {} : task.input : {});
            const calcKeys = task.type === "calc" ? getObjectKeys(task.expected) : [];
            const jeLineCount = task.type === "je" ? Math.max(expectedEntries(task).length, 2) : 0;

            return (
              <div key={task.id} className="rounded-lg border bg-card p-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-semibold">
                    {index + 1}. {task.prompt}
                  </h3>
                  <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                    {task.type}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="mb-1 text-sm font-medium">Given data</div>
                  {renderValue(task.input)}
                  {inputFields.length ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Fields: {inputFields.join(", ")}
                    </p>
                  ) : null}
                </div>

                {task.type === "calc" && calcKeys.length > 1 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {calcKeys.map((key) => (
                      <label key={key} className="space-y-1 text-sm">
                        <span className="font-medium">{key}</span>
                        <input
                          value={answers[`${task.id}:${key}`] ?? ""}
                          onChange={(event) =>
                            setAnswers((prev) => ({ ...prev, [`${task.id}:${key}`]: event.target.value }))
                          }
                          className="w-full rounded-md border bg-background p-2 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                          inputMode="decimal"
                        />
                      </label>
                    ))}
                  </div>
                ) : task.type === "je" ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="pb-2">Account</th>
                          <th className="pb-2">Debit</th>
                          <th className="pb-2">Credit</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        {Array.from({ length: jeLineCount }, (_, line) => (
                          <tr key={line}>
                            <td className="pr-2 pb-2">
                              <input
                                value={answers[`${task.id}:je:${line}:account`] ?? ""}
                                onChange={(event) =>
                                  setAnswers((prev) => ({
                                    ...prev,
                                    [`${task.id}:je:${line}:account`]: event.target.value,
                                  }))
                                }
                                className="w-full rounded-md border bg-background p-2"
                                placeholder="Account #"
                              />
                            </td>
                            <td className="pr-2 pb-2">
                              <input
                                value={answers[`${task.id}:je:${line}:debit`] ?? ""}
                                onChange={(event) =>
                                  setAnswers((prev) => ({
                                    ...prev,
                                    [`${task.id}:je:${line}:debit`]: event.target.value,
                                  }))
                                }
                                className="w-full rounded-md border bg-background p-2"
                                inputMode="decimal"
                                placeholder="0"
                              />
                            </td>
                            <td className="pb-2">
                              <input
                                value={answers[`${task.id}:je:${line}:credit`] ?? ""}
                                onChange={(event) =>
                                  setAnswers((prev) => ({
                                    ...prev,
                                    [`${task.id}:je:${line}:credit`]: event.target.value,
                                  }))
                                }
                                className="w-full rounded-md border bg-background p-2"
                                inputMode="decimal"
                                placeholder="0"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <textarea
                    value={answers[task.id] ?? ""}
                    onChange={(event) => setAnswers((prev) => ({ ...prev, [task.id]: event.target.value }))}
                    placeholder={task.type === "calc" && calcKeys.length === 1 ? `Enter ${calcKeys[0]}` : "Write your response..."}
                    className="min-h-28 w-full rounded-md border bg-background p-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                  />
                )}

                {result ? (
                  <div className={`mt-3 rounded-md border p-3 text-sm ${result.passed ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                    <div className="flex items-center gap-2 font-medium">
                      {result.passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {result.score}/{result.max} — {result.message}
                    </div>
                  </div>
                ) : null}

                {results ? (
                  <details className="mt-3 rounded-md border p-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      <span className="inline-flex items-center gap-1">
                        <BadgeCheck className="h-4 w-4 text-green-600" />
                        Show answer key and explanation
                      </span>
                    </summary>
                    <div className="mt-3 space-y-3 text-sm">
                      {renderValue(task.expected)}
                      {task.explanation ? <p className="text-muted-foreground">{task.explanation}</p> : null}
                    </div>
                  </details>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg border bg-card p-4">
          <div>
            <div className="font-semibold">Attempt Ledger</div>
            <p className="text-sm text-muted-foreground">
              Submit stores this attempt locally and unlocks the answer key.
            </p>
          </div>
          <Button onClick={submit}>Grade Attempt</Button>
        </div>

        {results ? (
          <div className="mt-4 rounded-lg border bg-card p-4">
            <div className="text-lg font-semibold">Score: {totalScore}/{totalMax}</div>
            <p className="text-sm text-muted-foreground">
              This is deterministic grading for calculations, keyword writeups, and exact
              journal-entry account/debit/credit lines.
            </p>
          </div>
        ) : null}
      </section>

      {workflow.outputArtifact ? (
        <section className="rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">Output Artifact</h2>
          {renderValue(workflow.outputArtifact)}
        </section>
      ) : null}

      {workflow.conversationSim ? (
        <section className="rounded-lg border bg-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">
              Conversation Sim
              {workflow.conversationSim.stakeholder ? ` · ${workflow.conversationSim.stakeholder}` : ""}
            </h2>
          </div>
          <p className="mb-4 leading-7 text-muted-foreground">{workflow.conversationSim.prompt}</p>
          <textarea
            value={answers.__conversation ?? ""}
            onChange={(event) => setAnswers((prev) => ({ ...prev, __conversation: event.target.value }))}
            placeholder="Draft your stakeholder response..."
            className="min-h-32 w-full rounded-md border bg-background p-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
          {results && workflow.conversationSim.modelAnswer ? (
            <details className="mt-3 rounded-md border p-4">
              <summary className="cursor-pointer font-medium">Show rubric and model answer</summary>
              {results.find((r) => r.taskId === "__conversation") ? (
                <div
                  className={`mb-3 rounded-md border p-3 text-sm ${
                    results.find((r) => r.taskId === "__conversation")?.passed
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {(() => {
                    const r = results.find((x) => x.taskId === "__conversation");
                    return r ? `${r.score}/${r.max} — ${r.message}` : null;
                  })()}
                </div>
              ) : null}
              <p className="mt-3 text-sm text-muted-foreground">{workflow.conversationSim.modelAnswer}</p>
            </details>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
