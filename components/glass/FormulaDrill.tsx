"use client";

/**
 * FormulaDrill — active recall over the Method Cards. Shows the trigger, you
 * recall the formula from memory, reveal to check, then self-rate. "Review"
 * cards recycle to the end of the round so you close gaps before finishing.
 * Recognition-first memorization for the exam (blueprint: formulas/traps recall).
 */

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { METHODS } from "@/lib/methods";
import { ActionBar } from "@/components/sheet/ActionBar";
import { StateGlyph } from "@/components/sheet/StateGlyph";

const boxStyle = { border: "1px solid hsl(var(--border))", borderRadius: 2 } as const;

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
    setQueue(
      shuffled(
        METHODS.map((_, i) => i),
        s
      )
    );
    setPos(0);
    setRevealed(false);
    setGot(0);
    setDone(false);
    setRunning(true);
  };

  if (!running) {
    return (
      <div className="p-5" style={boxStyle}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold tracking-tight text-foreground">
              Drill formulas from memory
            </h3>
            <p className="text-sm text-text-muted">
              Active recall over all {METHODS.length} plays — see the trigger, recall the formula.
            </p>
          </div>
          <div className="shrink-0">
            <ActionBar primary={{ label: "Start", onClick: start }} />
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="p-6" style={boxStyle}>
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
            Round complete
          </h3>
          <p className="text-sm text-muted-foreground">
            You recalled {got} of {METHODS.length} on the first try.
          </p>
        </div>
        <div className="mt-4">
          <ActionBar
            primary={{ label: "Again", onClick: start }}
            secondary={[{ label: "Done", onClick: () => setRunning(false) }]}
          />
        </div>
      </div>
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
    <div className="p-5 sm:p-6" style={boxStyle}>
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-display font-semibold text-foreground">Formula recall</span>
          <div className="flex items-center gap-3">
            <span className="ledger-number text-text-muted">
              {pos + 1} / {queue.length}
            </span>
            <button
              onClick={() => setRunning(false)}
              className="text-xs font-medium text-text-light hover:text-foreground"
            >
              Exit
            </button>
          </div>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden"
          style={{ background: "hsl(var(--foreground) / 0.08)", borderRadius: 2 }}
        >
          <div
            className="h-full transition-all"
            style={{ width: `${progress}%`, background: "hsl(var(--foreground))" }}
          />
        </div>
      </div>

      <div className="text-[11px] font-semibold uppercase tracking-wider text-text-light">
        {m.area}
      </div>
      <h3 className="font-display mt-1 text-lg font-bold tracking-tight text-foreground">
        {m.label}
      </h3>
      <p className="mt-2 text-sm text-text-muted">
        <span className="font-semibold text-foreground">If you see:</span> {m.trigger}
      </p>

      {!revealed ? (
        <div className="mt-4">
          <ActionBar primary={{ label: "Reveal formula", onClick: () => setRevealed(true) }} />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div
            className="px-4 py-3 font-mono text-sm text-foreground"
            style={{ background: "hsl(var(--secondary))", borderRadius: 2 }}
          >
            {m.formula}
          </div>
          <p
            className="flex items-start gap-2 px-4 py-2.5 text-sm text-foreground"
            style={{ background: "hsl(var(--warn) / 0.08)", borderRadius: 2 }}
          >
            <StateGlyph state="warn" />
            <span>
              <span className="font-semibold">Trap:</span> {m.trap}
            </span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => advance(false)}
              className="glass glass-hover inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-text-muted"
            >
              <RotateCcw className="h-4 w-4" /> Review
            </button>
            <button
              onClick={() => advance(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold"
              style={{
                background: "hsl(var(--good) / 0.14)",
                color: "hsl(var(--good))",
                borderRadius: 2,
              }}
            >
              <Check className="h-4 w-4" /> Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
