"use client";

import { useEffect, useRef, useState } from "react";
import { useAttempts, useSrs } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";
import { skillsForCpaItem } from "@/lib/cpaSkillMap";

/**
 * CPA Practice.
 * Serves clean CPA exam-style items across FAR/AUD/REG/BAR/ISC/TCP.
 * Two modes: Practice (instant feedback per question) and Timed set
 * (90s/question budget, no feedback until the end-of-set review).
 * Each answer writes to the shared attempt ledger; wrong answers seed SRS
 * with frozen-taxonomy skill tags so readiness and Study-this links resolve.
 */

type Item = {
  id: string;
  section: string;
  difficulty?: string;
  topic?: string;
  blueprintArea?: string;
  stem: string;
  choices: string[];
  answer: number;
  explain?: string;
  refs?: string[];
};

type Mode = "practice" | "timed";

const SECTIONS: Array<{ key: string; label: string; note: string }> = [
  { key: "FAR", label: "FAR — Financial Accounting & Reporting", note: "Core · reporting and measurement" },
  { key: "AUD", label: "AUD — Auditing & Attestation", note: "Core · controls and evidence" },
  { key: "REG", label: "REG — Taxation & Regulation", note: "Core · tax and law" },
  { key: "BAR", label: "BAR — Business Analysis & Reporting", note: "Discipline · analysis and reporting" },
  { key: "ISC", label: "ISC — Information Systems & Controls", note: "Discipline · systems, SOC, and cybersecurity" },
  { key: "TCP", label: "TCP — Tax Compliance & Planning", note: "Discipline · planning and compliance" },
];

const SECONDS_PER_QUESTION = 90;

function itemSkills(item: Item): string[] {
  return skillsForCpaItem(item.section, [item.topic, item.blueprintArea].filter(Boolean).join(" "));
}

function fmtClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function CrossoverPage() {
  const [phase, setPhase] = useState<"pick" | "practice" | "done">("pick");
  const [mode, setMode] = useState<Mode>("practice");
  const [section, setSection] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [available, setAvailable] = useState<number>(0);
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Timed-set state: picks per question (null = unanswered) + countdown.
  const [picks, setPicks] = useState<Array<number | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const startedAtRef = useRef(0);
  const recordAttempt = useAttempts((s) => s.record);
  const upsertMiss = useSrs((s) => s.upsertMiss);

  async function start(sec: string, m: Mode = mode) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cpa/items?section=${sec}&n=10`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load items.");
      if (!data.items?.length) throw new Error("No usable items for this section yet.");
      setSection(sec);
      setMode(m);
      setItems(data.items);
      setAvailable(data.available || data.items.length);
      setI(0);
      setSelected(null);
      setRevealed(false);
      setScore(0);
      setPicks(new Array(data.items.length).fill(null));
      setSecondsLeft(data.items.length * SECONDS_PER_QUESTION);
      startedAtRef.current = Date.now();
      setPhase("practice");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function recordOne(item: Item, choice: number | null, timeSec?: number) {
    const correct = choice === item.answer;
    const skills = itemSkills(item);
    const itemId = `cpa-practice:${item.section}:${item.id}`;

    recordAttempt({
      source: "quiz",
      track: "cpa",
      itemId,
      skills,
      correct,
      answer: choice,
      ...(timeSec !== undefined ? { timeSec } : {}),
    });

    if (!correct) {
      upsertMiss(
        {
          itemId,
          skills,
          track: "cpa",
          source: "quiz",
          label: `${item.section} practice — ${item.topic || item.blueprintArea || item.id}`,
          href: "/crossover",
        },
        dayNumber(Date.now())
      );
    }
    return correct;
  }

  function finishTimedSet(currentPicks: Array<number | null>) {
    const elapsed = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    const perItem = Math.round(elapsed / items.length);
    let total = 0;
    items.forEach((item, idx) => {
      if (recordOne(item, currentPicks[idx], perItem)) total += 1;
    });
    setScore(total);
    setPhase("done");
  }

  // Countdown for timed sets; expiry submits whatever is picked so far.
  useEffect(() => {
    if (phase !== "practice" || mode !== "timed") return;
    if (secondsLeft <= 0) {
      finishTimedSet(picks);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, mode, secondsLeft]);

  function choose(idx: number) {
    const item = items[i];

    if (mode === "timed") {
      const nextPicks = [...picks];
      nextPicks[i] = idx;
      setPicks(nextPicks);
      if (i + 1 >= items.length) {
        finishTimedSet(nextPicks);
      } else {
        setI(i + 1);
      }
      return;
    }

    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    if (recordOne(item, idx)) setScore((s) => s + 1);
  }

  function skipTimed() {
    if (i + 1 >= items.length) {
      finishTimedSet(picks);
    } else {
      setI(i + 1);
    }
  }

  function next() {
    if (i + 1 >= items.length) {
      setPhase("done");
    } else {
      setI(i + 1);
      setSelected(null);
      setRevealed(false);
    }
  }

  if (phase === "pick") {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-primary">CPA Practice</h1>
        <p className="mt-2 text-muted-foreground">
          Exam-style questions across all CPA Evolution sections. Pick a section to practice 10
          questions with full rationale and standard references. Wrong answers feed Mission
          Control review through the shared attempt ledger and SRS queue.
        </p>

        <div className="mt-5 inline-flex rounded-lg border border-border p-1 text-sm">
          <button
            onClick={() => setMode("practice")}
            className={`rounded-md px-3 py-1.5 transition ${
              mode === "practice" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Practice — instant feedback
          </button>
          <button
            onClick={() => setMode("timed")}
            className={`rounded-md px-3 py-1.5 transition ${
              mode === "timed" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Timed set — 10 Q · 15:00
          </button>
        </div>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              disabled={loading}
              onClick={() => start(s.key)}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 text-left transition hover:border-primary disabled:opacity-50"
            >
              <span>
                <span className="font-medium">{s.label}</span>
                <span className="block text-xs text-muted-foreground">{s.note}</span>
              </span>
              <span className="text-primary">{loading ? "…" : mode === "timed" ? "Start timed →" : "Start →"}</span>
            </button>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Bank coverage currently totals 1,178 clean items: FAR, AUD, REG, BAR, ISC, and TCP.
        </p>
      </div>
    );
  }

  if (phase === "done") {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">
            {section} {mode === "timed" ? "timed set" : "practice"} complete
          </h1>
          <p className="mt-4 text-4xl font-bold">
            {score}/{items.length} <span className="text-lg text-muted-foreground">({pct}%)</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Missed questions were added to review. Strong sessions still count in the attempt ledger
            for readiness trends.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => start(section)}
              className="rounded bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90"
            >
              New 10 questions
            </button>
            <button
              onClick={() => setPhase("pick")}
              className="rounded border border-border px-4 py-2 hover:bg-muted"
            >
              Change section
            </button>
          </div>
        </div>

        {mode === "timed" && (
          <div className="mt-10 space-y-4 text-left">
            <h2 className="text-lg font-semibold">Review</h2>
            {items.map((item, idx) => {
              const pick = picks[idx];
              const correct = pick === item.answer;
              return (
                <div
                  key={item.id}
                  className={`rounded-lg border p-4 text-sm ${
                    correct ? "border-green-500/40" : "border-red-500/40"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Q{idx + 1}
                      {item.topic ? ` · ${item.topic}` : ""}
                    </span>
                    <span className={correct ? "font-medium text-green-600" : "font-medium text-red-600"}>
                      {correct ? "Correct" : pick === null ? "Unanswered" : "Incorrect"}
                    </span>
                  </div>
                  <p className="font-medium">{item.stem}</p>
                  <p className="mt-2">
                    Your answer:{" "}
                    <span className={correct ? "text-green-600" : "text-red-600"}>
                      {pick === null ? "—" : `${String.fromCharCode(65 + pick)}. ${item.choices[pick]}`}
                    </span>
                  </p>
                  {!correct && (
                    <p className="mt-1">
                      Correct: {String.fromCharCode(65 + item.answer)}. {item.choices[item.answer]}
                    </p>
                  )}
                  {item.explain && <p className="mt-2 text-muted-foreground">{item.explain}</p>}
                  {item.refs && item.refs.length > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">Refs: {item.refs.join(", ")}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const item = items[i];
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {section} · Question {i + 1}/{items.length} · {available} in bank
        </span>
        {mode === "timed" ? (
          <span className={`font-mono font-semibold ${secondsLeft <= 60 ? "text-red-500" : ""}`}>
            {fmtClock(secondsLeft)}
          </span>
        ) : (
          <span>Score: {score}</span>
        )}
      </div>
      {item.topic && (
        <div className="mb-2 text-xs font-medium text-primary">
          {item.topic}
          {item.difficulty ? ` · ${item.difficulty}` : ""}
        </div>
      )}
      <p className="text-lg font-medium">{item.stem}</p>

      <div className="mt-4 space-y-2">
        {item.choices.map((c, idx) => {
          const isCorrect = idx === item.answer;
          const isPicked = idx === selected;
          let cls = "border-border hover:border-primary";
          if (mode === "practice") {
            if (revealed && isCorrect) cls = "border-green-500 bg-green-50 dark:bg-green-950/20";
            else if (revealed && isPicked) cls = "border-red-500 bg-red-50 dark:bg-red-950/20";
          }
          return (
            <button
              key={idx}
              onClick={() => choose(idx)}
              disabled={mode === "practice" && revealed}
              className={`block w-full rounded-lg border p-3 text-left transition disabled:cursor-default ${cls}`}
            >
              <span className="mr-2 font-mono text-xs text-muted-foreground">
                {String.fromCharCode(65 + idx)}
              </span>
              {c}
            </button>
          );
        })}
      </div>

      {mode === "timed" && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Answers lock at the end of the set — no feedback until review.
          </span>
          <button onClick={skipTimed} className="rounded border border-border px-3 py-1.5 hover:bg-muted">
            {i + 1 >= items.length ? "Finish set" : "Skip"}
          </button>
        </div>
      )}

      {mode === "practice" && revealed && (
        <div className="mt-4 rounded-lg border border-border bg-card p-4 text-sm">
          <p
            className={
              selected === item.answer ? "font-medium text-green-600" : "font-medium text-red-600"
            }
          >
            {selected === item.answer ? "Correct" : "Incorrect"} — answer{" "}
            {String.fromCharCode(65 + item.answer)}
          </p>
          {item.explain && <p className="mt-2 text-muted-foreground">{item.explain}</p>}
          {item.refs && item.refs.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">Refs: {item.refs.join(", ")}</p>
          )}
          <button
            onClick={next}
            className="mt-3 rounded bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90"
          >
            {i + 1 >= items.length ? "See results" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
