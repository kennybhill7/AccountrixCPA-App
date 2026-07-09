"use client";

/**
 * SessionRunner — runs a bounded practice session (from lib/session) one
 * problem at a time with a progress bar, instant feedback, hint, AI "why wrong"
 * coach, and a confidence tap, then a recap. Finishable by design: the whole
 * point of a session is that it ends and tells you how you did.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Lightbulb, Sparkles, X, Trophy } from "lucide-react";
import { useAttempts } from "@/lib/store";
import { GENERATORS, gradeTolerance, isWithinTolerance, hintForSkills } from "@/lib/parametric";
import type { SessionItem } from "@/lib/session";
import { GlassCard } from "./GlassCard";

interface Result { skill: string; correct: boolean }

export function SessionRunner({ items, title = "Today's session", onExit }: { items: SessionItem[]; title?: string; onExit: () => void }) {
  const record = useAttempts((s) => s.record);
  const setConfidence = useAttempts((s) => s.setConfidence);

  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [done, setDone] = useState<{ ok: boolean } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [lastId, setLastId] = useState<string | null>(null);
  const [conf, setConf] = useState<0 | 1 | 2 | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [finished, setFinished] = useState(false);
  const shownAt = useRef<number>(Date.now());

  const item = items[idx];
  const instance = useMemo(() => (item ? GENERATORS[item.genId](item.seed) : null), [item]);

  useEffect(() => {
    setInput("");
    setDone(null);
    setShowHint(false);
    setLastId(null);
    setConf(null);
    shownAt.current = Date.now();
  }, [idx]);

  if (!instance) {
    return null;
  }

  const tol = gradeTolerance(instance.answer, instance.unit);
  const fmt = instance.unit === "%" ? `${instance.answer}%` : `$${instance.answer.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  const hint = hintForSkills(instance.skills);
  const progress = Math.round((idx / items.length) * 100);

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
    setResults((r) => [...r, { skill: instance.skills[0] ?? "finance", correct: ok }]);
  };

  const next = () => {
    if (idx + 1 >= items.length) setFinished(true);
    else setIdx((i) => i + 1);
  };

  const explain = () => {
    openExplain(instance.prompt, input, fmt);
  };

  if (finished) {
    return <SessionRecap results={results} onExit={onExit} />;
  }

  return (
    <GlassCard className="p-5 sm:p-6">
      {/* Progress header */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-display font-semibold text-foreground">{title}</span>
          <div className="flex items-center gap-3">
            <span className="text-text-muted">
              {idx + 1} / {items.length}
            </span>
            <button onClick={onExit} className="text-xs font-medium text-text-light hover:text-foreground">
              Exit
            </button>
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "hsl(var(--foreground) / 0.08)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg, hsl(var(--primary)), hsl(262 83% 58%))" }} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {item.reason === "weak" && (
          <span className="rounded-md px-2 py-0.5 text-xs font-semibold" style={{ background: "hsl(var(--status-streak) / 0.14)", color: "hsl(var(--status-streak))" }}>
            weak spot
          </span>
        )}
        {instance.skills.map((s) => (
          <span key={s} className="rounded-md px-2 py-0.5 text-xs text-text-muted" style={{ background: "hsl(var(--foreground) / 0.05)" }}>
            {s}
          </span>
        ))}
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-foreground">{instance.prompt}</p>

      {hint && (
        <div className="mt-3">
          <button onClick={() => setShowHint((v) => !v)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Lightbulb className="h-3.5 w-3.5" /> {showHint ? "Hide hint" : "Show hint"}
          </button>
          {showHint && <p className="mt-2 rounded-xl px-4 py-3 text-sm text-foreground" style={{ background: "hsl(var(--primary) / 0.07)" }}>{hint}</p>}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
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
          <button onClick={submit} disabled={input.trim() === ""} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50">
            Submit
          </button>
        ) : (
          <button onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover">
            {idx + 1 >= items.length ? "Finish" : "Next"} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {done && (
        <div className="mt-3 space-y-3">
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: done.ok ? "hsl(var(--status-done) / 0.1)" : "hsl(var(--destructive) / 0.1)" }}>
            <p className="flex items-center gap-2 font-semibold" style={{ color: done.ok ? "hsl(var(--status-done))" : "hsl(var(--destructive))" }}>
              {done.ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              {done.ok ? "Correct" : "Not quite"}
              <span className="font-normal text-text-muted">— answer {fmt} (±{tol.toFixed(2)})</span>
            </p>
          </div>
          {!done.ok && (
            <button onClick={explain} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-primary" style={{ background: "hsl(var(--primary) / 0.1)" }}>
              <Sparkles className="h-3.5 w-3.5" /> Explain why I&apos;m wrong (AI)
            </button>
          )}
          {lastId && (
            <ConfidenceRow rated={conf} onRate={(v) => { setConf(v); setConfidence(lastId, v); }} />
          )}
        </div>
      )}
    </GlassCard>
  );
}

function ConfidenceRow({ rated, onRate }: { rated: 0 | 1 | 2 | null; onRate: (v: 0 | 1 | 2) => void }) {
  const opts: Array<[string, 0 | 1 | 2]> = [["Guessed", 0], ["Unsure", 1], ["Confident", 2]];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-text-light">How sure were you?</span>
      {opts.map(([label, v]) => (
        <button key={v} onClick={() => onRate(v)} className="rounded-lg px-2.5 py-1 text-xs font-medium transition" style={rated === v ? { background: "hsl(var(--primary) / 0.13)", color: "hsl(var(--primary))" } : { background: "hsl(var(--foreground) / 0.05)", color: "hsl(var(--text-muted))" }}>
          {label}
        </button>
      ))}
    </div>
  );
}

function openExplain(prompt: string, input: string, fmt: string) {
  // lazy import to avoid a hard dep in a leaf component
  import("@/lib/noteActions").then(({ openAskAI }) =>
    openAskAI(
      `I'm learning finance/accounting and got this wrong.\n\nProblem: "${prompt}"\nMy answer: ${input || "(blank)"}\nCorrect: ${fmt}\n\nIn plain language: what concept this tests, why my answer is wrong, the step-by-step correct solution, and the rule to remember.`
    )
  );
}

function SessionRecap({ results, onExit }: { results: Result[]; onExit: () => void }) {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;

  const bySkill = new Map<string, { n: number; ok: number }>();
  for (const r of results) {
    const s = bySkill.get(r.skill) ?? { n: 0, ok: 0 };
    s.n += 1;
    if (r.correct) s.ok += 1;
    bySkill.set(r.skill, s);
  }
  const rows = Array.from(bySkill.entries())
    .map(([skill, v]) => ({ skill, acc: v.ok / v.n, n: v.n }))
    .sort((a, b) => a.acc - b.acc);
  const weakest = rows.find((r) => r.acc < 1);

  return (
    <GlassCard className="p-6 sm:p-8">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)" }}>
          <Trophy className="h-7 w-7" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Session complete</h2>
          <p className="text-muted-foreground">
            You worked <strong>{total}</strong> problems at <strong className="text-aurora-gradient font-display">{pct}%</strong>.
            {pct >= 80 ? " Sharp." : pct >= 50 ? " Solid — keep stacking." : " Rough set — that's where the growth is."}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-light">By topic</h3>
        {rows.map((r) => (
          <div key={r.skill} className="flex items-center gap-3">
            <div className="w-40 shrink-0 truncate text-sm text-foreground">{r.skill}</div>
            <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "hsl(var(--foreground) / 0.08)" }}>
              <div className="h-full rounded-full" style={{ width: `${Math.round(r.acc * 100)}%`, background: r.acc >= 0.8 ? "hsl(var(--status-done))" : r.acc >= 0.5 ? "hsl(var(--status-streak))" : "hsl(var(--destructive))" }} />
            </div>
            <div className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums text-text-muted">{Math.round(r.acc * 100)}%</div>
          </div>
        ))}
      </div>

      {weakest && (
        <p className="mt-4 rounded-xl px-4 py-3 text-sm text-foreground" style={{ background: "hsl(var(--status-streak) / 0.08)" }}>
          Hit next: <strong>{weakest.skill}</strong> was your softest spot this session — it&apos;ll be front-loaded into tomorrow&apos;s session automatically.
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={onExit} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover">
          Done
        </button>
      </div>
    </GlassCard>
  );
}
