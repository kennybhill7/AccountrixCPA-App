"use client";

import { useState } from "react";
import { useAttempts, useSrs } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";

/**
 * CPA Practice.
 * Serves clean CPA exam-style items across FAR/AUD/REG/BAR/ISC/TCP.
 * Each answer writes to the shared attempt ledger; wrong answers seed SRS.
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

const SECTIONS: Array<{ key: string; label: string; note: string }> = [
  { key: "FAR", label: "FAR — Financial Accounting & Reporting", note: "Core · reporting and measurement" },
  { key: "AUD", label: "AUD — Auditing & Attestation", note: "Core · controls and evidence" },
  { key: "REG", label: "REG — Taxation & Regulation", note: "Core · tax and law" },
  { key: "BAR", label: "BAR — Business Analysis & Reporting", note: "Discipline · analysis and reporting" },
  { key: "ISC", label: "ISC — Information Systems & Controls", note: "Discipline · systems, SOC, and cybersecurity" },
  { key: "TCP", label: "TCP — Tax Compliance & Planning", note: "Discipline · planning and compliance" },
];

function itemSkills(item: Item): string[] {
  const raw = [item.section, item.blueprintArea, item.topic].filter(Boolean).join(" ");
  const normalized = raw
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return [normalized ? `cpa-${normalized}` : `cpa-${item.section.toLowerCase()}`];
}

export default function CrossoverPage() {
  const [phase, setPhase] = useState<"pick" | "practice" | "done">("pick");
  const [section, setSection] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [available, setAvailable] = useState<number>(0);
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recordAttempt = useAttempts((s) => s.record);
  const upsertMiss = useSrs((s) => s.upsertMiss);

  async function start(sec: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cpa/items?section=${sec}&n=10`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load items.");
      if (!data.items?.length) throw new Error("No usable items for this section yet.");
      setSection(sec);
      setItems(data.items);
      setAvailable(data.available || data.items.length);
      setI(0);
      setSelected(null);
      setRevealed(false);
      setScore(0);
      setPhase("practice");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function choose(idx: number) {
    if (revealed) return;
    const item = items[i];
    const correct = idx === item.answer;
    const skills = itemSkills(item);
    const itemId = `cpa-practice:${item.section}:${item.id}`;

    setSelected(idx);
    setRevealed(true);
    if (correct) setScore((s) => s + 1);

    recordAttempt({
      source: "quiz",
      track: "cpa",
      itemId,
      skills,
      correct,
      answer: idx,
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
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <div className="mt-6 grid gap-3 md:grid-cols-2">
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
              <span className="text-primary">{loading ? "…" : "Start →"}</span>
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
      <div className="container mx-auto max-w-2xl px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-primary">{section} practice complete</h1>
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
    );
  }

  const item = items[i];
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {section} · Question {i + 1}/{items.length} · {available} in bank
        </span>
        <span>Score: {score}</span>
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
          if (revealed && isCorrect) cls = "border-green-500 bg-green-50 dark:bg-green-950/20";
          else if (revealed && isPicked) cls = "border-red-500 bg-red-50 dark:bg-red-950/20";
          return (
            <button
              key={idx}
              onClick={() => choose(idx)}
              disabled={revealed}
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

      {revealed && (
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
