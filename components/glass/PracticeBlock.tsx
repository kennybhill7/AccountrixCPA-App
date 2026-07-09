"use client";

/**
 * PracticeBlock — an endless "work problems here" widget you can drop on any
 * page. Two modes:
 *   - "parametric": infinite self-verifying numeric finance drills from
 *     lib/parametric (optionally filtered by skills).
 *   - "mcq": multiple-choice questions streamed from the CPA item bank
 *     (/api/cpa/items?section=…), refetching when the queue drains.
 * Every submission is recorded to the shared attempt ledger (useAttempts), so
 * readiness / SRS / error-pattern engines see this work like any other attempt.
 * A session counter ("worked / correct") keeps the "do the reps" loop visible.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Check, Lightbulb, RefreshCw, Sparkles, X } from "lucide-react";
import { useAttempts } from "@/lib/store";
import { GENERATORS, generatorsForSkills, gradeTolerance, isWithinTolerance, hintForSkills } from "@/lib/parametric";
import { openAskAI } from "@/lib/noteActions";
import { GlassCard } from "./GlassCard";

export type CpaSection = "FAR" | "AUD" | "REG" | "BAR" | "ISC" | "TCP";

interface PracticeBlockProps {
  mode: "parametric" | "mcq";
  /** parametric: skill filter (omit = all finance generators) */
  skills?: string[];
  /** mcq: which CPA section to pull from */
  section?: CpaSection;
  heading?: string;
  subheading?: string;
}

interface McqItem {
  id: string;
  stem: string;
  choices: string[];
  answer: number; // 0-based
  explain?: string;
  topic?: string;
  difficulty?: string;
}

function SessionCounter({ worked, correct }: { worked: number; correct: number }) {
  return (
    <div className="flex items-center gap-3 text-xs font-medium text-text-muted">
      <span>
        <span className="font-display text-sm font-bold text-foreground">{worked}</span> worked
      </span>
      {worked > 0 && (
        <span>
          <span className="font-display text-sm font-bold text-status-done">
            {Math.round((correct / worked) * 100)}%
          </span>{" "}
          correct
        </span>
      )}
    </div>
  );
}

function ConfidenceRow({ rated, onRate }: { rated: 0 | 1 | 2 | null; onRate: (v: 0 | 1 | 2) => void }) {
  const opts: Array<[string, 0 | 1 | 2]> = [["Guessed", 0], ["Unsure", 1], ["Confident", 2]];
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <span className="text-xs text-text-light">How sure were you?</span>
      {opts.map(([label, v]) => (
        <button
          key={v}
          onClick={() => onRate(v)}
          className="rounded-lg px-2.5 py-1 text-xs font-medium transition"
          style={rated === v ? { background: "hsl(var(--primary) / 0.13)", color: "hsl(var(--primary))" } : { background: "hsl(var(--foreground) / 0.05)", color: "hsl(var(--text-muted))" }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------- parametric mode ---------------------------- */

function ParametricPractice({ skills, worked, correct, bump }: { skills?: string[]; worked: number; correct: number; bump: (ok: boolean) => void }) {
  const record = useAttempts((s) => s.record);
  const setConfidence = useAttempts((s) => s.setConfidence);
  const skillsKey = (skills ?? []).join(",");
  const genIds = useMemo(() => generatorsForSkills(skills), [skillsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const [seed, setSeed] = useState(1);
  const [input, setInput] = useState("");
  const [done, setDone] = useState<{ ok: boolean } | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);
  const [conf, setConf] = useState<0 | 1 | 2 | null>(null);
  const [showHint, setShowHint] = useState(false);
  const shownAt = useRef<number>(Date.now());

  const instance = useMemo(() => {
    const id = genIds[seed % genIds.length];
    return GENERATORS[id](seed);
  }, [seed, genIds]);

  useEffect(() => {
    setInput("");
    setDone(null);
    setLastId(null);
    setConf(null);
    setShowHint(false);
    shownAt.current = Date.now();
  }, [seed]);

  const tol = gradeTolerance(instance.answer, instance.unit);
  const fmt =
    instance.unit === "%"
      ? `${instance.answer}%`
      : `$${instance.answer.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  const hint = hintForSkills(instance.skills);

  const submit = () => {
    if (done) return;
    const entered = parseFloat(input.replace(/[$,%\s]/g, ""));
    if (!Number.isFinite(entered)) return;
    const ok = isWithinTolerance(entered, instance.answer, instance.unit);
    const id = record({
      source: "parametric",
      track: "finance",
      itemId: `parametric:${instance.id}:${instance.seed}`,
      skills: instance.skills,
      correct: ok,
      answer: entered,
      timeSec: Math.max(0, Math.round((Date.now() - shownAt.current) / 1000)),
    });
    setLastId(id);
    setDone({ ok });
    bump(ok);
  };

  const explain = () => {
    openAskAI(
      `I'm learning finance/accounting and got this practice problem wrong.\n\nProblem: "${instance.prompt}"\nMy answer: ${input || "(blank)"}\nCorrect answer: ${fmt}\n\nIn plain language for a beginner, explain: (1) what concept/formula this tests, (2) why my answer is wrong, (3) the step-by-step correct solution with these numbers, and (4) the rule to remember so I don't miss this type again.`
    );
  };

  // Keyboard: once answered, Enter or "n" moves on (ignore while typing an answer).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (done && (e.key === "Enter" || e.key.toLowerCase() === "n")) setSeed((s) => s + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {instance.skills.map((s) => (
          <span key={s} className="rounded-md px-2 py-0.5 text-xs text-text-muted" style={{ background: "hsl(var(--foreground) / 0.05)" }}>
            {s}
          </span>
        ))}
        <span className="ml-auto"><SessionCounter worked={worked} correct={correct} /></span>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground">{instance.prompt}</p>

      {hint && (
        <div>
          <button
            onClick={() => setShowHint((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
          >
            <Lightbulb className="h-3.5 w-3.5" /> {showHint ? "Hide hint" : "Show hint"}
          </button>
          {showHint && (
            <p className="mt-2 rounded-xl px-4 py-3 text-sm text-foreground" style={{ background: "hsl(var(--primary) / 0.07)" }}>
              {hint}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          className="glass h-11 max-w-[220px] flex-1 px-4 text-sm text-foreground outline-none placeholder:text-text-light"
          style={{ borderRadius: 12 }}
          inputMode="decimal"
          placeholder={instance.unit === "%" ? "e.g. 9.30" : "e.g. 1435.03"}
          value={input}
          disabled={!!done}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          aria-label="Your answer"
        />
        {instance.unit && <span className="text-sm text-text-muted">{instance.unit}</span>}
        {!done ? (
          <button
            onClick={submit}
            disabled={input.trim() === ""}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            Next problem <ArrowRight className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="glass glass-hover inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-muted"
          style={{ borderRadius: 12 }}
          title="Skip / new variation"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {done && (
        <div className="space-y-3">
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ background: done.ok ? "hsl(var(--status-done) / 0.1)" : "hsl(var(--destructive) / 0.1)" }}
          >
            <p className="mb-1.5 flex items-center gap-2 font-semibold" style={{ color: done.ok ? "hsl(var(--status-done))" : "hsl(var(--destructive))" }}>
              {done.ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              {done.ok ? "Correct" : "Not quite"}
              <span className="font-normal text-text-muted">— answer {fmt} (±{tol.toFixed(2)})</span>
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-text-light">
              {Object.entries(instance.params).map(([k, v]) => (
                <span key={k}>{k} = {v.toLocaleString()}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!done.ok && (
              <button
                onClick={explain}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-primary"
                style={{ background: "hsl(var(--primary) / 0.1)" }}
              >
                <Sparkles className="h-3.5 w-3.5" /> Explain why I&apos;m wrong (AI)
              </button>
            )}
          </div>
          {lastId && (
            <ConfidenceRow
              rated={conf}
              onRate={(v) => {
                setConf(v);
                setConfidence(lastId, v);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- mcq mode ------------------------------- */

function McqPractice({ section, worked, correct, bump }: { section: CpaSection; worked: number; correct: number; bump: (ok: boolean) => void }) {
  const record = useAttempts((s) => s.record);
  const setConfidence = useAttempts((s) => s.setConfidence);
  const [queue, setQueue] = useState<McqItem[]>([]);
  const [item, setItem] = useState<McqItem | null>(null);
  const [pick, setPick] = useState<number | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);
  const [conf, setConf] = useState<0 | 1 | 2 | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  const shownAt = useRef<number>(Date.now());

  const refill = useCallback(async (): Promise<McqItem[]> => {
    try {
      const res = await fetch(`/api/cpa/items?section=${section}&n=25`);
      const data = res.ok ? await res.json() : null;
      return Array.isArray(data?.items) ? (data.items as McqItem[]) : [];
    } catch {
      return [];
    }
  }, [section]);

  const advance = useCallback(
    async (from: McqItem[]) => {
      let pool = from;
      if (pool.length === 0) {
        setLoading(true);
        pool = await refill();
        setLoading(false);
      }
      const [next, ...rest] = pool;
      setItem(next ?? null);
      setQueue(rest);
      setPick(null);
      setLastId(null);
      setConf(null);
      setShowHint(false);
      shownAt.current = Date.now();
    },
    [refill]
  );

  // initial load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const pool = await refill();
      if (cancelled) return;
      setLoading(false);
      const [next, ...rest] = pool;
      setItem(next ?? null);
      setQueue(rest);
      setPick(null);
      shownAt.current = Date.now();
    })();
    return () => {
      cancelled = true;
    };
  }, [refill]);

  const choose = (i: number) => {
    if (pick !== null || !item) return;
    const ok = i === item.answer;
    const id = record({
      source: "quiz",
      track: "cpa",
      itemId: item.id,
      skills: item.topic ? [item.topic] : [],
      correct: ok,
      answer: i,
      timeSec: Math.max(0, Math.round((Date.now() - shownAt.current) / 1000)),
    });
    setLastId(id);
    setPick(i);
    bump(ok);
  };

  const explain = () => {
    if (!item || pick === null) return;
    const letters = item.choices.map((c, i) => `${String.fromCharCode(65 + i)}. ${c}`).join("\n");
    openAskAI(
      `I'm learning for the CPA exam (${section}) and got this multiple-choice question wrong.\n\nQuestion: ${item.stem}\n${letters}\n\nI chose ${String.fromCharCode(65 + pick)}. The correct answer is ${String.fromCharCode(65 + item.answer)}.\n\nIn plain language for someone still learning: explain what concept this tests, the specific misconception that makes my choice tempting but wrong, why the correct answer is right, and the rule to remember. Keep it concise.`
    );
  };

  // Keyboard: number keys pick a choice; once answered, Enter/"n" moves on.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!item) return;
      if (pick === null) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= item.choices.length) choose(n - 1);
      } else if (e.key === "Enter" || e.key.toLowerCase() === "n") {
        advance(queue);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, pick, queue]);

  if (loading && !item) {
    return <p className="py-6 text-center text-sm text-text-muted">Loading {section} problems…</p>;
  }
  if (!item) {
    return <p className="py-6 text-center text-sm text-text-muted">No {section} problems available yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {item.topic && (
          <span className="rounded-md px-2 py-0.5 text-xs font-semibold text-primary" style={{ background: "hsl(var(--primary) / 0.1)" }}>
            {item.topic}
          </span>
        )}
        {item.difficulty && (
          <span className="rounded-md px-2 py-0.5 text-xs text-text-muted" style={{ background: "hsl(var(--foreground) / 0.05)" }}>
            {item.difficulty}
          </span>
        )}
        <span className="ml-auto"><SessionCounter worked={worked} correct={correct} /></span>
      </div>

      <p className="text-[15px] leading-relaxed text-foreground">{item.stem}</p>

      {pick === null && item.topic && (
        <div>
          <button onClick={() => setShowHint((v) => !v)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Lightbulb className="h-3.5 w-3.5" /> {showHint ? "Hide hint" : "Show hint"}
          </button>
          {showHint && (
            <p className="mt-2 rounded-xl px-4 py-3 text-sm text-foreground" style={{ background: "hsl(var(--primary) / 0.07)" }}>
              This tests <strong>{item.topic}</strong>. Identify the rule or formula that applies, then eliminate the choices that violate it before computing.
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        {item.choices.map((c, i) => {
          const answered = pick !== null;
          const isAnswer = i === item.answer;
          const isPick = i === pick;
          let style: CSSProperties = {};
          if (answered && isAnswer) style = { background: "hsl(var(--status-done) / 0.12)", borderColor: "hsl(var(--status-done) / 0.5)" };
          else if (answered && isPick) style = { background: "hsl(var(--destructive) / 0.1)", borderColor: "hsl(var(--destructive) / 0.5)" };
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={answered}
              className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition disabled:cursor-default"
              style={{ borderColor: "hsl(var(--border))", ...style }}
            >
              <span className="font-display flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold" style={{ background: "hsl(var(--foreground) / 0.06)" }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-foreground">{c}</span>
              {answered && isAnswer && <Check className="h-4 w-4 shrink-0 text-status-done" />}
              {answered && isPick && !isAnswer && <X className="h-4 w-4 shrink-0 text-destructive" />}
            </button>
          );
        })}
      </div>

      {pick !== null && (
        <div className="space-y-3">
          {item.explain && (
            <div className="rounded-xl px-4 py-3 text-sm text-foreground" style={{ background: "hsl(var(--primary) / 0.07)" }}>
              <span className="font-semibold">Why: </span>
              {item.explain}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => advance(queue)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              Next problem <ArrowRight className="h-4 w-4" />
            </button>
            {pick !== item.answer && (
              <button
                onClick={explain}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-primary"
                style={{ background: "hsl(var(--primary) / 0.1)" }}
              >
                <Sparkles className="h-3.5 w-3.5" /> Explain my mistake (AI)
              </button>
            )}
          </div>
          {lastId && (
            <ConfidenceRow
              rated={conf}
              onRate={(v) => {
                setConf(v);
                setConfidence(lastId, v);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- wrapper -------------------------------- */

export function PracticeBlock({ mode, skills, section = "FAR", heading, subheading }: PracticeBlockProps) {
  const [worked, setWorked] = useState(0);
  const [correct, setCorrect] = useState(0);
  const bump = useCallback((ok: boolean) => {
    setWorked((w) => w + 1);
    if (ok) setCorrect((c) => c + 1);
  }, []);

  return (
    <GlassCard className="p-5 sm:p-6">
      {(heading || subheading) && (
        <div className="mb-4">
          {heading && <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{heading}</h3>}
          {subheading && <p className="mt-0.5 text-sm text-text-muted">{subheading}</p>}
        </div>
      )}
      {mode === "parametric" ? (
        <ParametricPractice skills={skills} worked={worked} correct={correct} bump={bump} />
      ) : (
        <McqPractice section={section} worked={worked} correct={correct} bump={bump} />
      )}
    </GlassCard>
  );
}
