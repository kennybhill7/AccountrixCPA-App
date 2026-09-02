"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useAttempts, useSrs } from "@/lib/store";
import { dayNumber } from "@/lib/spacedRepetition";
import { skillsForCpaItem } from "@/lib/cpaSkillMap";
import { GlassCard } from "@/components/glass/GlassCard";
import { StatTile } from "@/components/glass/StatTile";
import { ProgressRing } from "@/components/glass/ProgressRing";

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
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">CPA Practice</h1>
          <p className="mt-2 text-muted-foreground">
            Exam-style questions across all CPA Evolution sections. Pick a section to practice 10
            questions with full rationale and standard references. Wrong answers feed Mission
            Control review through the shared attempt ledger and SRS queue.
          </p>
        </div>

        <div className="glass inline-flex rounded-xl p-1 text-sm">
          <button
            onClick={() => setMode("practice")}
            className={`rounded-lg px-3 py-1.5 transition ${
              mode === "practice" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Practice — instant feedback
          </button>
          <button
            onClick={() => setMode("timed")}
            className={`rounded-lg px-3 py-1.5 transition ${
              mode === "timed" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Timed set — 10 Q · 15:00
          </button>
        </div>

        {error && <p className="text-destructive">{error}</p>}
        <div className="grid gap-3 md:grid-cols-2">
          {SECTIONS.map((s) => (
            <GlassCard
              key={s.key}
              hover
              className="p-0"
            >
              <button
                disabled={loading}
                onClick={() => start(s.key)}
                className="flex w-full items-center justify-between p-4 text-left disabled:opacity-50"
              >
                <span>
                  <span className="font-medium">{s.label}</span>
                  <span className="block text-xs text-muted-foreground">{s.note}</span>
                </span>
                <span className="text-primary">{loading ? "…" : mode === "timed" ? "Start timed →" : "Start →"}</span>
              </button>
            </GlassCard>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          All six sections are served from the clean item bank; template-broken source items are
          repaired or excluded at build time, and each section shows its live count in-session.
        </p>
      </div>
    );
  }

  if (phase === "done") {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <GlassCard strong className="p-6">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
            <ProgressRing pct={pct} size={96} stroke={9} />
            <div className="text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold tracking-tight">
                {section} {mode === "timed" ? "timed set" : "practice"} complete
              </h1>
              <p className="mt-1 font-display text-3xl font-bold">
                {score}/{items.length}{" "}
                <span className="text-lg text-muted-foreground">({pct}%)</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Missed questions were added to review. Strong sessions still count in the attempt
                ledger for readiness trends.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
            <button
              onClick={() => start(section)}
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90"
            >
              New 10 questions
            </button>
            <button
              onClick={() => setPhase("pick")}
              className="glass glass-hover rounded-lg px-4 py-2"
            >
              Change section
            </button>
          </div>
        </GlassCard>

        {mode === "timed" && (
          <div className="space-y-4 text-left">
            <h2 className="font-display text-lg font-semibold tracking-tight">Review</h2>
            {items.map((item, idx) => {
              const pick = picks[idx];
              const correct = pick === item.answer;
              return (
                <GlassCard
                  key={item.id}
                  className="p-4 text-sm"
                  style={{
                    borderColor: correct
                      ? "hsl(var(--status-done) / 0.4)"
                      : "hsl(var(--destructive) / 0.4)",
                  }}
                >
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Q{idx + 1}
                      {item.topic ? ` · ${item.topic}` : ""}
                    </span>
                    <span className={correct ? "font-medium text-status-done" : "font-medium text-destructive"}>
                      {correct ? "Correct" : pick === null ? "Unanswered" : "Incorrect"}
                    </span>
                  </div>
                  <p className="font-medium">{item.stem}</p>
                  <p className="mt-2">
                    Your answer:{" "}
                    <span className={correct ? "text-status-done" : "text-destructive"}>
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
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const item = items[i];
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <GlassCard strong className="p-6">
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {section} · Question {i + 1}/{items.length} · {available} in bank
          </span>
          {mode === "timed" ? (
            <span
              className={`font-display font-semibold ${secondsLeft <= 60 ? "text-destructive" : "text-foreground"}`}
            >
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
            const style: CSSProperties = {};
            if (mode === "practice" && revealed) {
              if (isCorrect) {
                style.borderColor = "hsl(var(--status-done))";
                style.background = "hsl(var(--status-done) / 0.1)";
              } else if (isPicked) {
                style.borderColor = "hsl(var(--destructive))";
                style.background = "hsl(var(--destructive) / 0.1)";
              }
            }
            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                disabled={mode === "practice" && revealed}
                style={style}
                className="block w-full rounded-xl border border-border p-3 text-left transition hover:border-primary disabled:cursor-default"
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
            <button onClick={skipTimed} className="glass glass-hover rounded-lg px-3 py-1.5">
              {i + 1 >= items.length ? "Finish set" : "Skip"}
            </button>
          </div>
        )}

        {mode === "practice" && revealed && (
          <div
            className="mt-4 rounded-xl p-4 text-sm"
            style={{ background: "hsl(var(--foreground) / 0.04)" }}
          >
            <p
              className={
                selected === item.answer
                  ? "font-medium text-status-done"
                  : "font-medium text-destructive"
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
              className="mt-3 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90"
            >
              {i + 1 >= items.length ? "See results" : "Next question"}
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
