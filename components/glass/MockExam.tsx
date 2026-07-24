"use client";

/**
 * MockExam — a full, timed, scored practice exam (the Becker "simulated exam"
 * pillar). Pick a format and length; answer under a countdown with a question
 * navigator, flag-for-review, and no per-question feedback (exam conditions);
 * then get a scored report with a pass line, per-topic breakdown, and a review
 * mode that wires each miss into the AI tutor. Every question is written to the
 * shared attempt ledger on submit, so mastery / SRS treat it like real reps.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Flag,
  Sparkles,
  Timer,
  Trophy,
  X,
} from "lucide-react";
import { useAttempts } from "@/lib/store";
import { GENERATORS, GENERATOR_SKILLS, gradeTolerance, isWithinTolerance } from "@/lib/parametric";
import { SKILL_AREAS, SKILL_LABELS } from "@/lib/mastery";
import { openAskAI } from "@/lib/noteActions";
import { GlassCard } from "./GlassCard";

type Format = "finance" | "cma" | "cpa";
type Section = "FAR" | "AUD" | "REG" | "BAR" | "ISC" | "TCP";

type NumQ = {
  kind: "numeric";
  id: string;
  prompt: string;
  answer: number;
  unit: string;
  skills: string[];
};
type McqQ = {
  kind: "mcq";
  id: string;
  stem: string;
  choices: string[];
  answer: number;
  skills: string[];
  explain?: string;
};
type Q = NumQ | McqQ;

type Phase = "config" | "loading" | "running" | "results";

const PASS_PCT = 75;
const SECTIONS: Section[] = ["FAR", "AUD", "REG", "BAR", "ISC", "TCP"];

const FORMATS: { id: Format; label: string; blurb: string }[] = [
  { id: "finance", label: "Corporate Finance", blurb: "Numeric — TVM, WACC, NPV, bonds, CAPM" },
  { id: "cma", label: "CMA / Accounting", blurb: "Numeric — CVP, ratios, ROI, depreciation" },
  { id: "cpa", label: "CPA section", blurb: "Multiple-choice from the CPA item bank" },
];

const AREA_FOR: Record<Format, string> = {
  finance: "Corporate Finance",
  cma: "Accounting & CMA",
  cpa: "",
};

function genIdsForArea(area: string): string[] {
  return Object.keys(GENERATORS).filter((id) =>
    (GENERATOR_SKILLS[id] ?? []).some((s) => SKILL_AREAS[s] === area)
  );
}

/** Spread N generator picks across a pool, deterministically per seedBase. */
function pickGenIds(pool: string[], n: number, seedBase: number): string[] {
  if (pool.length === 0) return [];
  const step = 1 + (seedBase % Math.max(1, pool.length - 1));
  let idx = seedBase % pool.length;
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(pool[idx % pool.length]);
    idx += step;
  }
  return out;
}

function skillLabel(s: string): string {
  return SKILL_LABELS[s] ?? s;
}

function mmss(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

interface McqRaw {
  id: string;
  stem: string;
  choices: string[];
  answer: number;
  explain?: string;
  topic?: string;
}

export function MockExam() {
  const record = useAttempts((s) => s.record);

  const [phase, setPhase] = useState<Phase>("config");
  const [format, setFormat] = useState<Format>("finance");
  const [section, setSection] = useState<Section>("FAR");
  const [count, setCount] = useState(20);
  const [minutes, setMinutes] = useState(40);
  const [error, setError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [cur, setCur] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const startedAt = useRef<number>(0);

  const suggestedMin = useMemo(
    () => Math.max(5, Math.round(count * (format === "cpa" ? 1.5 : 2))),
    [count, format]
  );
  useEffect(() => setMinutes(suggestedMin), [suggestedMin]);

  /* --------------------------------- grading -------------------------------- */

  const isCorrect = useCallback((q: Q, a: string | number | undefined): boolean => {
    if (a === undefined || a === "") return false;
    if (q.kind === "numeric") {
      const entered = typeof a === "string" ? parseFloat(a.replace(/[$,%\s]/g, "")) : Number(a);
      return Number.isFinite(entered) && isWithinTolerance(entered, q.answer, q.unit);
    }
    return a === q.answer;
  }, []);

  const submit = useCallback(() => {
    setPhase((p) => {
      if (p !== "running") return p;
      const usedSec = Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));
      const perQ = Math.round(usedSec / Math.max(1, questions.length));
      questions.forEach((q, i) => {
        const a = answers[i];
        const ok = isCorrect(q, a);
        if (q.kind === "numeric") {
          const entered = typeof a === "string" ? parseFloat(a.replace(/[$,%\s]/g, "")) : NaN;
          record({
            source: "parametric",
            track: format === "cma" ? "cma" : "finance",
            itemId: q.id,
            skills: q.skills,
            correct: ok,
            answer: Number.isFinite(entered) ? entered : null,
            timeSec: perQ,
          });
        } else {
          record({
            source: "quiz",
            track: "cpa",
            itemId: q.id,
            skills: q.skills,
            correct: ok,
            answer: a ?? null,
            timeSec: perQ,
          });
        }
      });
      return "results";
    });
  }, [answers, questions, isCorrect, record, format]);

  // keep the latest submit for the timer without re-arming the interval
  const submitRef = useRef(submit);
  submitRef.current = submit;

  /* -------------------------------- countdown ------------------------------- */

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          submitRef.current();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  /* --------------------------------- start ---------------------------------- */

  const start = useCallback(async () => {
    setError(null);
    setPhase("loading");
    const seedBase = (Date.now() % 100000) + 1;
    let qs: Q[] = [];
    try {
      if (format === "cpa") {
        const res = await fetch(`/api/cpa/items?section=${section}&n=${count}`);
        const data = res.ok ? await res.json() : null;
        const items: McqRaw[] = Array.isArray(data?.items) ? data.items : [];
        qs = items.map((it) => ({
          kind: "mcq" as const,
          id: it.id,
          stem: it.stem,
          choices: it.choices,
          answer: it.answer,
          explain: it.explain,
          skills: it.topic ? [it.topic] : [],
        }));
        if (qs.length === 0) {
          setError(
            `No ${section} questions are available yet. Try another section or a numeric format.`
          );
          setPhase("config");
          return;
        }
      } else {
        const pool = genIdsForArea(AREA_FOR[format]);
        const ids = pickGenIds(pool, count, seedBase);
        qs = ids.map((genId, i) => {
          const inst = GENERATORS[genId](seedBase + i * 13 + 1);
          return {
            kind: "numeric" as const,
            id: `parametric:${inst.id}:${inst.seed}`,
            prompt: inst.prompt,
            answer: inst.answer,
            unit: inst.unit ?? "",
            skills: inst.skills,
          };
        });
      }
    } catch {
      setError("Couldn't load the exam. Check your connection and try again.");
      setPhase("config");
      return;
    }
    setQuestions(qs);
    setAnswers({});
    setFlags(new Set());
    setCur(0);
    setTimeLeft(minutes * 60);
    startedAt.current = Date.now();
    setPhase("running");
  }, [format, section, count, minutes]);

  const setAnswer = (i: number, v: string | number) => setAnswers((prev) => ({ ...prev, [i]: v }));
  const toggleFlag = (i: number) =>
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  /* --------------------------------- render --------------------------------- */

  if (phase === "config") {
    return (
      <ConfigScreen
        format={format}
        setFormat={setFormat}
        section={section}
        setSection={setSection}
        count={count}
        setCount={setCount}
        minutes={minutes}
        setMinutes={setMinutes}
        suggestedMin={suggestedMin}
        error={error}
        onStart={start}
      />
    );
  }

  if (phase === "loading") {
    return (
      <GlassCard className="p-10 text-center text-sm text-text-muted">
        Building your exam…
      </GlassCard>
    );
  }

  if (phase === "results") {
    return (
      <ResultsScreen
        questions={questions}
        answers={answers}
        isCorrect={isCorrect}
        onRetake={() => setPhase("config")}
      />
    );
  }

  // running
  const q = questions[cur];
  const answered = Object.keys(answers).length;
  const lowTime = timeLeft <= 60;

  return (
    <div className="space-y-4">
      {/* Sticky exam bar */}
      <GlassCard strong className="flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2 text-sm">
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono font-bold tabular-nums"
            style={{
              background: lowTime
                ? "hsl(var(--destructive) / 0.14)"
                : "hsl(var(--foreground) / 0.06)",
              color: lowTime ? "hsl(var(--destructive))" : "hsl(var(--foreground))",
            }}
          >
            <Timer className="h-4 w-4" /> {mmss(timeLeft)}
          </span>
          <span className="text-text-muted">
            {answered} / {questions.length} answered
          </span>
        </div>
        <button
          onClick={submit}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          Submit exam
        </button>
      </GlassCard>

      {/* Navigator */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((_, i) => {
          const isCur = i === cur;
          const isAns = answers[i] !== undefined && answers[i] !== "";
          const isFlag = flags.has(i);
          return (
            <button
              key={i}
              onClick={() => setCur(i)}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition"
              style={
                isCur
                  ? { background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
                  : isAns
                    ? { background: "hsl(var(--primary) / 0.16)", color: "hsl(var(--primary))" }
                    : {
                        background: "hsl(var(--foreground) / 0.06)",
                        color: "hsl(var(--text-muted))",
                      }
              }
            >
              {i + 1}
              {isFlag && (
                <Flag
                  className="absolute -right-1 -top-1 h-3 w-3"
                  style={{ color: "hsl(var(--status-streak))" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Question */}
      <GlassCard className="p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-light">
            Question {cur + 1} of {questions.length}
          </span>
          <button
            onClick={() => toggleFlag(cur)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition"
            style={
              flags.has(cur)
                ? {
                    background: "hsl(var(--status-streak) / 0.14)",
                    color: "hsl(var(--status-streak))",
                  }
                : { background: "hsl(var(--foreground) / 0.05)", color: "hsl(var(--text-muted))" }
            }
          >
            <Flag className="h-3.5 w-3.5" /> {flags.has(cur) ? "Flagged" : "Flag"}
          </button>
        </div>

        {q.kind === "numeric" ? (
          <>
            <p className="text-[15px] leading-relaxed text-foreground">{q.prompt}</p>
            <div className="mt-4 flex items-center gap-2">
              <input
                className="glass h-11 max-w-[240px] flex-1 px-4 text-sm text-foreground outline-none placeholder:text-text-light"
                style={{ borderRadius: 12 }}
                inputMode="decimal"
                placeholder={q.unit === "%" ? "e.g. 9.30" : "e.g. 1435.03"}
                value={(answers[cur] as string) ?? ""}
                onChange={(e) => setAnswer(cur, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && cur + 1 < questions.length) setCur(cur + 1);
                }}
                aria-label="Your answer"
              />
              {q.unit && <span className="text-sm text-text-muted">{q.unit}</span>}
            </div>
          </>
        ) : (
          <>
            <p className="text-[15px] leading-relaxed text-foreground">{q.stem}</p>
            <div className="mt-4 space-y-2">
              {q.choices.map((c, i) => {
                const picked = answers[cur] === i;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswer(cur, i)}
                    className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition"
                    style={{
                      borderColor: picked ? "hsl(var(--primary) / 0.6)" : "hsl(var(--border))",
                      background: picked ? "hsl(var(--primary) / 0.1)" : undefined,
                    }}
                  >
                    <span
                      className="font-display flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                      style={{ background: "hsl(var(--foreground) / 0.06)" }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 text-foreground">{c}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => setCur((c) => Math.max(0, c - 1))}
            disabled={cur === 0}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-text-muted transition disabled:opacity-40"
            style={{ background: "hsl(var(--foreground) / 0.05)" }}
          >
            <ArrowLeft className="h-4 w-4" /> Prev
          </button>
          {cur + 1 < questions.length ? (
            <button
              onClick={() => setCur((c) => c + 1)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={submit}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              Finish <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

/* ------------------------------ config screen ----------------------------- */

function ConfigScreen({
  format,
  setFormat,
  section,
  setSection,
  count,
  setCount,
  minutes,
  setMinutes,
  suggestedMin,
  error,
  onStart,
}: {
  format: Format;
  setFormat: (f: Format) => void;
  section: Section;
  setSection: (s: Section) => void;
  count: number;
  setCount: (n: number) => void;
  minutes: number;
  setMinutes: (n: number) => void;
  suggestedMin: number;
  error: string | null;
  onStart: () => void;
}) {
  return (
    <div className="space-y-5">
      <div
        className="relative overflow-hidden p-6 sm:p-7"
        style={{
          borderRadius: 26,
          background: "linear-gradient(120deg, rgba(124,58,237,0.94), rgba(37,99,235,0.92))",
          boxShadow: "0 28px 60px -24px rgba(80,60,220,0.7), inset 0 1px 0 rgba(255,255,255,0.28)",
        }}
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
          <Timer className="h-4 w-4" /> Mock exam
        </div>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Sit a timed exam
        </h1>
        <p className="mt-2 max-w-2xl text-white/85">
          Real conditions: a countdown, a question navigator, flag-and-return, and no answers until
          you submit. Then a scored report with a {PASS_PCT}% pass line and every miss explained.
        </p>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
          style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}
        >
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <GlassCard className="space-y-5 p-5 sm:p-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">Format</label>
          <div className="grid gap-2 sm:grid-cols-3">
            {FORMATS.map((f) => {
              const on = format === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className="rounded-xl border p-3 text-left transition"
                  style={{
                    borderColor: on ? "hsl(var(--primary) / 0.6)" : "hsl(var(--border))",
                    background: on ? "hsl(var(--primary) / 0.08)" : undefined,
                  }}
                >
                  <div className="text-sm font-semibold text-foreground">{f.label}</div>
                  <div className="mt-0.5 text-xs text-text-muted">{f.blurb}</div>
                </button>
              );
            })}
          </div>
        </div>

        {format === "cpa" && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">CPA section</label>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map((s) => {
                const on = section === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSection(s)}
                    className="rounded-xl px-4 py-2 text-sm font-semibold transition"
                    style={
                      on
                        ? { background: "hsl(var(--primary) / 0.14)", color: "hsl(var(--primary))" }
                        : {
                            background: "hsl(var(--foreground) / 0.05)",
                            color: "hsl(var(--text-muted))",
                          }
                    }
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">Questions</label>
            <div className="flex gap-2">
              {[10, 20, 30].map((n) => {
                const on = count === n;
                return (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className="flex-1 rounded-xl py-2 text-sm font-semibold transition"
                    style={
                      on
                        ? { background: "hsl(var(--primary) / 0.14)", color: "hsl(var(--primary))" }
                        : {
                            background: "hsl(var(--foreground) / 0.05)",
                            color: "hsl(var(--text-muted))",
                          }
                    }
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Time limit: <span className="text-primary">{minutes} min</span>{" "}
              {minutes !== suggestedMin && (
                <button
                  onClick={() => setMinutes(suggestedMin)}
                  className="ml-1 text-xs text-text-light underline"
                >
                  reset to {suggestedMin}
                </button>
              )}
            </label>
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="mt-2 w-full accent-[hsl(var(--primary))]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onStart}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            Start exam →
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

/* ------------------------------ results screen ---------------------------- */

function ResultsScreen({
  questions,
  answers,
  isCorrect,
  onRetake,
}: {
  questions: Q[];
  answers: Record<number, string | number>;
  isCorrect: (q: Q, a: string | number | undefined) => boolean;
  onRetake: () => void;
}) {
  const total = questions.length;
  const correct = questions.reduce((n, q, i) => n + (isCorrect(q, answers[i]) ? 1 : 0), 0);
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const passed = pct >= PASS_PCT;

  // per-topic breakdown
  const byTopic = new Map<string, { n: number; ok: number }>();
  questions.forEach((q, i) => {
    const key = q.skills[0] ?? "general";
    const s = byTopic.get(key) ?? { n: 0, ok: 0 };
    s.n += 1;
    if (isCorrect(q, answers[i])) s.ok += 1;
    byTopic.set(key, s);
  });
  const rows = [...byTopic.entries()]
    .map(([skill, v]) => ({ skill, acc: v.ok / v.n, n: v.n }))
    .sort((a, b) => a.acc - b.acc);

  return (
    <div className="space-y-5">
      <GlassCard className="p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white"
            style={{
              background: passed
                ? "linear-gradient(135deg,#10b981,#3b82f6)"
                : "linear-gradient(135deg,#f59e0b,#ef4444)",
            }}
          >
            <Trophy className="h-8 w-8" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-4xl font-bold tracking-tight text-foreground">
                {pct}%
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                style={{
                  background: passed
                    ? "hsl(var(--status-done) / 0.14)"
                    : "hsl(var(--destructive) / 0.14)",
                  color: passed ? "hsl(var(--status-done))" : "hsl(var(--destructive))",
                }}
              >
                {passed ? "Pass" : "Below pass"}
              </span>
            </div>
            <p className="mt-1 text-muted-foreground">
              {correct} of {total} correct · pass line {PASS_PCT}%.{" "}
              {passed ? "Exam-ready on this set." : "Close the gap on the weak topics below."}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-light">
            By topic
          </h3>
          {rows.map((r) => (
            <div key={r.skill} className="flex items-center gap-3">
              <div className="w-44 shrink-0 truncate text-sm text-foreground">
                {skillLabel(r.skill)}
              </div>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full"
                style={{ background: "hsl(var(--foreground) / 0.08)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round(r.acc * 100)}%`,
                    background:
                      r.acc >= 0.8
                        ? "hsl(var(--status-done))"
                        : r.acc >= 0.5
                          ? "hsl(var(--status-streak))"
                          : "hsl(var(--destructive))",
                  }}
                />
              </div>
              <div className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-text-muted">
                {Math.round(r.acc * 100)}%
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={onRetake}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            New exam
          </button>
        </div>
      </GlassCard>

      {/* Review */}
      <div>
        <h3 className="font-display mb-3 text-sm font-bold uppercase tracking-wider text-text-light">
          Review every question
        </h3>
        <div className="space-y-3">
          {questions.map((q, i) => (
            <ReviewRow key={i} index={i} q={q} a={answers[i]} ok={isCorrect(q, answers[i])} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({
  index,
  q,
  a,
  ok,
}: {
  index: number;
  q: Q;
  a: string | number | undefined;
  ok: boolean;
}) {
  const yourAnswer =
    a === undefined || a === ""
      ? "(blank)"
      : q.kind === "mcq"
        ? String.fromCharCode(65 + Number(a))
        : String(a);
  const correctAnswer =
    q.kind === "mcq"
      ? String.fromCharCode(65 + q.answer)
      : q.unit === "%"
        ? `${q.answer}%`
        : `$${q.answer.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  const explain = () => {
    if (q.kind === "numeric") {
      const tol = gradeTolerance(q.answer, q.unit);
      openAskAI(
        `I'm studying finance/accounting and missed this on a timed mock exam.\n\nProblem: "${q.prompt}"\nMy answer: ${yourAnswer}\nCorrect answer: ${correctAnswer} (±${tol.toFixed(2)})\n\nIn plain language: (1) what concept/formula this tests, (2) why my answer is wrong, (3) the step-by-step correct solution with these numbers, and (4) the rule to remember so I don't miss this type again.`
      );
    } else {
      const letters = q.choices.map((c, j) => `${String.fromCharCode(65 + j)}. ${c}`).join("\n");
      openAskAI(
        `I'm studying for the CPA exam and missed this multiple-choice question on a timed mock.\n\nQuestion: ${q.stem}\n${letters}\n\nI chose ${yourAnswer}. The correct answer is ${correctAnswer}.\n\nExplain the concept it tests, the misconception that makes my choice tempting but wrong, why the right answer is right, and the rule to remember. Keep it concise.`
      );
    }
  };

  return (
    <GlassCard className="p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white"
          style={{ background: ok ? "hsl(var(--status-done))" : "hsl(var(--destructive))" }}
        >
          {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground">
            <span className="text-text-light">Q{index + 1}. </span>
            {q.kind === "numeric" ? q.prompt : q.stem}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className={ok ? "text-status-done" : "text-destructive"}>
              You: <strong>{yourAnswer}</strong>
            </span>
            {!ok && (
              <span className="text-text-muted">
                Correct: <strong className="text-foreground">{correctAnswer}</strong>
              </span>
            )}
          </div>
          {q.kind === "mcq" && q.explain && !ok && (
            <p
              className="mt-2 rounded-lg px-3 py-2 text-xs text-foreground"
              style={{ background: "hsl(var(--primary) / 0.07)" }}
            >
              <span className="font-semibold">Why: </span>
              {q.explain}
            </p>
          )}
          {!ok && (
            <button
              onClick={explain}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary"
              style={{ background: "hsl(var(--primary) / 0.1)" }}
            >
              <Sparkles className="h-3.5 w-3.5" /> Explain this (AI)
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
