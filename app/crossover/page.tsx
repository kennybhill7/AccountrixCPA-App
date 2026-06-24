"use client";

import { useState } from "react";

/**
 * /crossover — CPA Crossover practice mode (S1-C4).
 * Practice real CPA exam items (FAR/AUD/REG/BAR) that reinforce the CMA topics
 * you're studying. Items come from /api/cpa/items (clean, template-broken ones
 * excluded). Pick a section → answer MCQs → see the rationale + ASC/standard refs.
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
  { key: "AUD", label: "AUD — Auditing & Attestation", note: "Core · fully clean bank" },
  { key: "FAR", label: "FAR — Financial Accounting & Reporting", note: "Core · feeds CMA P1" },
  { key: "REG", label: "REG — Taxation & Regulation", note: "Core" },
  {
    key: "BAR",
    label: "BAR — Business Analysis & Reporting",
    note: "Discipline · recommended for the owner",
  },
];

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
    setSelected(idx);
    setRevealed(true);
    if (idx === items[i].answer) setScore((s) => s + 1);
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
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold text-[#2e75b6]">CPA Crossover Practice</h1>
        <p className="mt-2 text-muted-foreground">
          Real CPA exam-style questions that reinforce the CMA topics you're studying. Pick a
          section to practice 10 questions with full rationale and standard references.
        </p>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <div className="mt-6 grid gap-3">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              disabled={loading}
              onClick={() => start(s.key)}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 text-left transition hover:border-[#2e75b6] disabled:opacity-50"
            >
              <span>
                <span className="font-medium">{s.label}</span>
                <span className="block text-xs text-muted-foreground">{s.note}</span>
              </span>
              <span className="text-[#2e75b6]">{loading ? "…" : "Start →"}</span>
            </button>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          ISC &amp; TCP item banks need reformatting before they can be served; FAR/REG show only
          the clean subset (template-broken items are excluded).
        </p>
      </div>
    );
  }

  if (phase === "done") {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="container mx-auto max-w-2xl px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-[#2e75b6]">{section} practice complete</h1>
        <p className="mt-4 text-4xl font-bold">
          {score}/{items.length} <span className="text-lg text-muted-foreground">({pct}%)</span>
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => start(section)}
            className="rounded bg-[#2e75b6] px-4 py-2 font-semibold text-white hover:bg-[#3a86cc]"
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
        <div className="mb-2 text-xs font-medium text-[#2e75b6]">
          {item.topic}
          {item.difficulty ? ` · ${item.difficulty}` : ""}
        </div>
      )}
      <p className="text-lg font-medium">{item.stem}</p>

      <div className="mt-4 space-y-2">
        {item.choices.map((c, idx) => {
          const isCorrect = idx === item.answer;
          const isPicked = idx === selected;
          let cls = "border-border hover:border-[#2e75b6]";
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
            className="mt-3 rounded bg-[#2e75b6] px-4 py-2 font-semibold text-white hover:bg-[#3a86cc]"
          >
            {i + 1 >= items.length ? "See results" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
