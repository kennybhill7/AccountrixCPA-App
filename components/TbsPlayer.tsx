"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gradeTask, type TaskResult } from "@/components/ApplyWorkflowClient";
import type { WorkflowTask } from "@/lib/case-workflows";
import type { TbsSim } from "@/lib/sims-content";
import { useAttempts, useSrs } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";

/**
 * CPA task-based simulation player — exam framing over the deterministic
 * Apply grading engine. Timed, tabbed requirements, nothing revealed until
 * submission; every requirement records a CPA attempt and misses seed SRS.
 */

function fmtClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function calcKeys(task: WorkflowTask): string[] {
  const expected = task.expected;
  if (!expected || typeof expected !== "object" || Array.isArray(expected)) return [];
  return Object.keys(expected as Record<string, unknown>);
}

function jeLineCount(task: WorkflowTask): number {
  const expected = task.expected as { entries?: unknown[] };
  return Math.max(Array.isArray(expected?.entries) ? expected.entries.length : 2, 2);
}

function renderExhibitValue(value: unknown): string {
  if (typeof value === "number") return value.toLocaleString("en-US");
  return String(value);
}

export function TbsPlayer({ sim }: { sim: TbsSim }) {
  const [tab, setTab] = useState(0); // 0 = scenario, 1..n = tasks
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<TaskResult[] | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(sim.timeMinutes * 60);
  const startedAtRef = useRef(Date.now());
  const recordAttempt = useAttempts((s) => s.record);
  const upsertMiss = useSrs((s) => s.upsertMiss);

  const submitted = results !== null;

  function taskAnswer(task: WorkflowTask): string {
    if (task.type === "calc") {
      const keys = calcKeys(task);
      if (keys.length > 1) {
        return JSON.stringify(
          Object.fromEntries(keys.map((key) => [key, answers[`${task.id}:${key}`] ?? ""]))
        );
      }
      if (keys.length === 1) return answers[`${task.id}:${keys[0]}`] ?? "";
    }
    if (task.type === "je") {
      return JSON.stringify({
        entries: Array.from({ length: jeLineCount(task) }, (_, i) => ({
          account: answers[`${task.id}:je:${i}:account`] ?? "",
          debit: answers[`${task.id}:je:${i}:debit`] ?? "",
          credit: answers[`${task.id}:je:${i}:credit`] ?? "",
        })),
      });
    }
    return answers[task.id] ?? "";
  }

  function submit() {
    if (submitted) return;
    const graded = sim.tasks.map((task) => gradeTask(task, taskAnswer(task)));
    const nowDay = dayNumber(Date.now());
    const elapsed = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    const perTask = Math.round(elapsed / sim.tasks.length);

    sim.tasks.forEach((task, i) => {
      const itemId = `tbs:${sim.id}:${task.id}`;
      recordAttempt({
        source: "workflow-task",
        track: "cpa",
        itemId,
        skills: sim.skills,
        correct: graded[i].passed,
        answer: taskAnswer(task),
        timeSec: perTask,
      });
      if (!graded[i].passed) {
        upsertMiss(
          {
            itemId,
            skills: sim.skills,
            track: "cpa",
            source: "workflow-task",
            label: `${sim.section} TBS — ${sim.title} (Req ${i + 1})`,
            href: `/sims/tbs/${sim.id}`,
          },
          nowDay
        );
      }
    });
    setResults(graded);
    setTab(0);
  }

  // Countdown; expiry auto-submits whatever is entered.
  useEffect(() => {
    if (submitted) return;
    if (secondsLeft <= 0) {
      submit();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, submitted]);

  const totalScore = useMemo(() => results?.reduce((n, r) => n + r.score, 0) ?? 0, [results]);
  const totalMax = useMemo(() => results?.reduce((n, r) => n + r.max, 0) ?? 0, [results]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <Badge variant="outline">{sim.section} · Task-Based Simulation</Badge>
          <h1 className="mt-1 text-2xl font-bold">{sim.title}</h1>
        </div>
        {!submitted ? (
          <span
            className={`font-mono text-lg font-semibold ${secondsLeft <= 120 ? "text-red-500" : ""}`}
          >
            {fmtClock(secondsLeft)}
          </span>
        ) : (
          <span className="text-lg font-semibold">
            Score: {totalScore}/{totalMax}
          </span>
        )}
      </div>

      {/* Tab strip: scenario + one tab per requirement */}
      <div className="mb-4 flex flex-wrap gap-1 border-b">
        <button
          onClick={() => setTab(0)}
          className={`rounded-t-md px-3 py-2 text-sm ${
            tab === 0 ? "border border-b-0 bg-card font-medium" : "text-muted-foreground"
          }`}
        >
          Scenario &amp; Exhibits
        </button>
        {sim.tasks.map((task, i) => {
          const r = results?.[i];
          return (
            <button
              key={task.id}
              onClick={() => setTab(i + 1)}
              className={`rounded-t-md px-3 py-2 text-sm ${
                tab === i + 1 ? "border border-b-0 bg-card font-medium" : "text-muted-foreground"
              }`}
            >
              Req {i + 1}
              {r ? (r.passed ? " ✓" : " ✗") : ""}
            </button>
          );
        })}
      </div>

      {tab === 0 ? (
        <div className="space-y-4">
          {submitted && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {sim.tasks.map((task, i) => {
                  const r = results![i];
                  return (
                    <div key={task.id} className="flex items-center justify-between rounded border p-2">
                      <span>
                        Req {i + 1}: {r.passed ? "Correct" : "Review needed"} ({r.score}/{r.max})
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => setTab(i + 1)}>
                        Open
                      </Button>
                    </div>
                  );
                })}
                <p className="pt-2 text-muted-foreground">
                  Missed requirements were added to your SRS queue and Mistake Bank.
                </p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{sim.scenario}</p>
            </CardContent>
          </Card>
          {sim.exhibits.map((ex) => (
            <Card key={ex.id}>
              <CardHeader>
                <CardTitle className="text-base">{ex.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {ex.data && typeof ex.data === "object" && !Array.isArray(ex.data) ? (
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(ex.data as Record<string, unknown>).map(([k, v]) => (
                        <tr key={k} className="border-b last:border-0">
                          <td className="py-1.5 pr-4 font-medium">{k}</td>
                          <td className="py-1.5 text-right font-mono">{renderExhibitValue(v)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
                    {JSON.stringify(ex.data, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        (() => {
          const i = tab - 1;
          const task = sim.tasks[i];
          const keys = task.type === "calc" ? calcKeys(task) : [];
          const result = results?.[i];
          return (
            <Card>
              <CardContent className="space-y-4 pt-6">
                <p className="font-medium">{task.prompt}</p>

                {task.type === "calc" ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {keys.map((key) => (
                      <label key={key} className="space-y-1 text-sm">
                        <span className="font-medium">{key}</span>
                        <input
                          value={answers[`${task.id}:${key}`] ?? ""}
                          onChange={(e) =>
                            setAnswers((prev) => ({ ...prev, [`${task.id}:${key}`]: e.target.value }))
                          }
                          disabled={submitted}
                          className="w-full rounded-md border bg-background p-2"
                          inputMode="decimal"
                          placeholder="0"
                        />
                      </label>
                    ))}
                  </div>
                ) : task.type === "je" ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="pb-2">Account #</th>
                          <th className="pb-2">Debit</th>
                          <th className="pb-2">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: jeLineCount(task) }, (_, line) => (
                          <tr key={line}>
                            {(["account", "debit", "credit"] as const).map((col) => (
                              <td key={col} className="pb-2 pr-2">
                                <input
                                  value={answers[`${task.id}:je:${line}:${col}`] ?? ""}
                                  onChange={(e) =>
                                    setAnswers((prev) => ({
                                      ...prev,
                                      [`${task.id}:je:${line}:${col}`]: e.target.value,
                                    }))
                                  }
                                  disabled={submitted}
                                  className="w-full rounded-md border bg-background p-2"
                                  inputMode={col === "account" ? "text" : "decimal"}
                                  placeholder={col === "account" ? "Account #" : "0"}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <textarea
                    value={answers[task.id] ?? ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [task.id]: e.target.value }))}
                    disabled={submitted}
                    className="min-h-32 w-full rounded-md border bg-background p-3 text-sm"
                    placeholder="Write your response..."
                  />
                )}

                {result && (
                  <div
                    className={`rounded-md border p-3 text-sm ${
                      result.passed
                        ? "border-green-500/40 bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-300"
                        : "border-red-500/40 bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-300"
                    }`}
                  >
                    <p className="font-medium">
                      {result.score}/{result.max} — {result.message}
                    </p>
                    {task.explanation && <p className="mt-2">{task.explanation}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })()
      )}

      <div className="mt-6 flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/sims">Back to Exam Sims</Link>
        </Button>
        {!submitted && <Button onClick={submit}>Submit simulation</Button>}
      </div>
    </div>
  );
}
