"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gradeNarrative, type TaskResult } from "@/components/ApplyWorkflowClient";
import type { EssaySim } from "@/lib/sims-content";
import { useAttempts, useSrs } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";

/**
 * CMA essay player — timed written requirements graded by the deterministic
 * 4-dimension narrative rubric (coverage/depth/support/judgment), with model
 * answers revealed only after submission. Attempts land in the CMA ledger;
 * weak responses seed SRS.
 */

function fmtClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function EssayPlayer({ essay }: { essay: EssaySim }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<TaskResult[] | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(essay.timeMinutes * 60);
  const startedAtRef = useRef(Date.now());
  const recordAttempt = useAttempts((s) => s.record);
  const upsertMiss = useSrs((s) => s.upsertMiss);

  const submitted = results !== null;

  function submit() {
    if (submitted) return;
    const graded = essay.requirements.map((req) =>
      gradeNarrative(
        req.id,
        answers[req.id] ?? "",
        req.keywords ?? [],
        req.minWords,
        "writeup",
        req.concepts,
        req.conclusions
      )
    );
    const nowDay = dayNumber(Date.now());
    const elapsed = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    const perReq = Math.round(elapsed / essay.requirements.length);

    essay.requirements.forEach((req, i) => {
      const itemId = `essay:${essay.id}:${req.id}`;
      recordAttempt({
        source: "workflow-task",
        track: "cma",
        itemId,
        skills: essay.skills,
        correct: graded[i].passed,
        answer: answers[req.id] ?? "",
        timeSec: perReq,
      });
      if (!graded[i].passed) {
        upsertMiss(
          {
            itemId,
            skills: essay.skills,
            track: "cma",
            source: "workflow-task",
            label: `${essay.part} essay — ${essay.title} (Req ${i + 1})`,
            href: `/sims/essay/${essay.id}`,
          },
          nowDay
        );
      }
    });
    setResults(graded);
  }

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

  const totalScore = results?.reduce((n, r) => n + r.score, 0) ?? 0;
  const totalMax = results?.reduce((n, r) => n + r.max, 0) ?? 0;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <Badge variant="outline">{essay.part} · Essay</Badge>
          <h1 className="mt-1 text-2xl font-bold">{essay.title}</h1>
        </div>
        {!submitted ? (
          <span
            className={`font-mono text-lg font-semibold ${secondsLeft <= 120 ? "text-red-500" : ""}`}
          >
            {fmtClock(secondsLeft)}
          </span>
        ) : (
          <span className="text-lg font-semibold">
            Rubric: {totalScore}/{totalMax}
          </span>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Scenario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{essay.scenario}</p>
          {(essay.exhibits ?? []).map((ex) => (
            <div key={ex.id}>
              <p className="mb-1 text-sm font-medium">{ex.label}</p>
              {ex.data && typeof ex.data === "object" && !Array.isArray(ex.data) ? (
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(ex.data as Record<string, unknown>).map(([k, v]) => (
                      <tr key={k} className="border-b last:border-0">
                        <td className="py-1 pr-4 font-medium">{k}</td>
                        <td className="py-1 text-right font-mono">
                          {typeof v === "number" ? v.toLocaleString("en-US") : String(v)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <pre className="rounded bg-muted p-3 text-xs">{JSON.stringify(ex.data, null, 2)}</pre>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-6">
        {essay.requirements.map((req, i) => {
          const result = results?.[i];
          return (
            <Card key={req.id}>
              <CardContent className="space-y-3 pt-6">
                <p className="font-medium">{req.prompt}</p>
                <textarea
                  value={answers[req.id] ?? ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [req.id]: e.target.value }))}
                  disabled={submitted}
                  className="min-h-40 w-full rounded-md border bg-background p-3 text-sm"
                  placeholder={`Write at least ${req.minWords} words in complete sentences...`}
                />
                {!submitted && (
                  <p className="text-xs text-muted-foreground">
                    {(answers[req.id] ?? "").trim().split(/\s+/).filter(Boolean).length} words ·
                    target {req.minWords}+
                  </p>
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
                    <details className="mt-2">
                      <summary className="cursor-pointer font-medium">Model answer</summary>
                      <p className="mt-2 leading-relaxed">{req.modelAnswer}</p>
                    </details>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/sims">Back to Exam Sims</Link>
        </Button>
        {!submitted && <Button onClick={submit}>Submit essay</Button>}
      </div>
    </div>
  );
}
