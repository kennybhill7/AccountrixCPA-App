"use client";

/**
 * FormulaDrill — active recall over the Method Cards. Shows the trigger, you
 * recall the formula from memory, reveal to check, then self-rate. "Review"
 * cards recycle to the end of the round so you close gaps before finishing.
 * Recognition-first memorization for the exam (blueprint: formulas/traps recall).
 */

import { useState } from "react";
import { Brain, Check, Eye, RotateCcw, Trophy } from "lucide-react";
import { METHODS } from "@/lib/methods";
import { GlassCard } from "./GlassCard";

// Deterministic shuffle from a numeric seed (no Math.random at import time).
function shuffled<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FormulaDrill() {
  const [running, setRunning] = useState(false);
  const [seed, setSeed] = useState(1);
  const [queue, setQueue] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [got, setGot] = useState(0);
  const [done, setDone] = useState(false);

  const start = () => {
    const s = Date.now() % 100000 || 1;
    setSeed(s);
    setQueue(shuffled(METHODS.map((_, i) => i), s));
    setPos(0);
    setRevealed(false);
    setGot(0);
    setDone(false);
    setRunning(true);
  };

  if (!running) {
    return (
      <GlassCard className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}>
              <Brain className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display font-bold tracking-tight text-foreground">Drill formulas from memory</h3>
              <p className="text-sm text-text-muted">Active recall over all {METHODS.length} plays — see the trigger, recall the formula.</p>
            </div>
          </div>
          <button onClick={start} className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover">
            Start
          </button>
        </div>
      </GlassCard>
    );
  }

  if (done) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)" }}>
            <Trophy className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight text-foreground">Round complete</h3>
            <p className="text-sm text-muted-foreground">You recalled {got} of {METHODS.length} on the first try.</p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={start} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover">
            <RotateCcw className="mr-1.5 inline h-4 w-4" /> Again
          </button>
          <button onClick={() => setRunning(false)} className="glass glass-hover rounded-xl px-4 py-2.5 text-sm font-medium text-foreground" style={{ borderRadius: 12 }}>
            Done
          </button>
        </div>
      </GlassCard>
    );
  }

  const idx = queue[pos];
  const m = METHODS[idx];
  const progress = Math.round((pos / queue.length) * 100);

  const advance = (knew: boolean) => {
    if (knew) setGot((g) => g + 1);
    // "Review" cards recycle to the end of the round.
    const nextQueue = knew ? queue : [...queue, idx];
    if (pos + 1 >= nextQueue.length) {
      setQueue(nextQueue);
      setDone(true);
      return;
    }
    setQueue(nextQueue);
    setPos(pos + 1);
    setRevealed(false);
  };

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-display font-semibold text-foreground">Formula recall</span>
          <div className="flex items-center gap-3">
            <span className="text-text-muted">{pos + 1} / {queue.length}</span>
            <button onClick={() => setRunning(false)} className="text-xs font-medium text-text-light hover:text-foreground">Exit</button>
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "hsl(var(--foreground) / 0.08)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg, hsl(var(--primary)), hsl(262 83% 58%))" }} />
        </div>
      </div>

      <div className="text-[11px] font-semibold uppercase tracking-wider text-text-light">{m.area}</div>
      <h3 className="font-display mt-1 text-lg font-bold tracking-tight text-foreground">{m.label}</h3>
      <p className="mt-2 text-sm text-text-muted"><span className="font-semibold text-foreground">If you see:</span> {m.trigger}</p>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover">
          <Eye className="h-4 w-4" /> Reveal formula
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl px-4 py-3 font-mono text-sm text-foreground" style={{ background: "hsl(var(--primary) / 0.08)" }}>{m.formula}</div>
          <p className="rounded-xl px-4 py-2.5 text-sm text-foreground" style={{ background: "hsl(var(--status-streak) / 0.1)" }}>
            <span className="font-semibold">⚠ Trap:</span> {m.trap}
          </p>
          <div className="flex gap-2">
            <button onClick={() => advance(false)} className="glass glass-hover inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-text-muted" style={{ borderRadius: 12 }}>
              <RotateCcw className="h-4 w-4" /> Review
            </button>
            <button onClick={() => advance(true)} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: "hsl(var(--status-done) / 0.14)", color: "hsl(var(--status-done))" }}>
              <Check className="h-4 w-4" /> Got it
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
