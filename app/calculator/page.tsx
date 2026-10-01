"use client";

import { useMemo, useState } from "react";
import { Check, Eye, EyeOff, RotateCcw } from "lucide-react";
import { PracticeBlock } from "@/components/glass/PracticeBlock";
import { KEYSTROKES, type KeystrokeEntry } from "@/lib/calculatorKeystrokes";
import { TitleBlock } from "@/components/sheet/TitleBlock";
import { StateGlyph } from "@/components/sheet/StateGlyph";

const boxStyle = { border: "1px solid hsl(var(--border))", borderRadius: 2 } as const;

/** BA II Plus warm-up — the settings that cause most "easy" misses when stale. */
const WARMUP = [
  "2ND → CLR TVM  (clear the time-value registers)",
  "2ND → CE|C  then  2ND → CLR WORK  in the CF worksheet (clear old cash flows)",
  "2ND → P/Y → set P/Y = 1, C/Y = 1  (unless the problem says otherwise)",
  "Confirm BGN is OFF (END mode) — turn BGN on only for an annuity due",
  "2ND → FORMAT → set decimals (e.g. 4) so rounding doesn't bite",
];

// Lanes, in Corporate-Finance priority order. `practiceSkill` links the
// keystroke layer to a live numeric problem (the logic layer).
const LANES: Array<{ key: string; label: string; practiceSkill?: string }> = [
  { key: "tvm", label: "TVM & Annuities", practiceSkill: "tvm" },
  { key: "capital-budgeting", label: "NPV / IRR", practiceSkill: "capital-budgeting" },
  { key: "bond-valuation", label: "Bonds", practiceSkill: "bond-valuation" },
  { key: "debt-schedule", label: "Amortization", practiceSkill: "tvm" },
];

function KeystrokeCard({ entry }: { entry: KeystrokeEntry }) {
  const [reveal, setReveal] = useState(false);
  return (
    <div className="p-5" style={boxStyle}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display font-semibold tracking-tight text-foreground">{entry.topic}</h3>
        <button
          onClick={() => setReveal((v) => !v)}
          className="inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-foreground"
          style={{ border: "1px solid hsl(var(--foreground) / 0.3)", borderRadius: 2 }}
        >
          {reveal ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {reveal ? "Hide" : "Reveal keystrokes"}
        </button>
      </div>
      {!reveal ? (
        <p className="mt-2 text-sm text-text-muted">
          Try to recall the full sequence from memory first, then reveal to check.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          <ol className="space-y-1.5">
            {entry.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                <span
                  className="font-display mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-[11px] font-bold"
                  style={{
                    background: "hsl(var(--foreground) / 0.08)",
                    color: "hsl(var(--foreground))",
                    borderRadius: 2,
                  }}
                >
                  {i + 1}
                </span>
                <span className="font-mono">{s}</span>
              </li>
            ))}
          </ol>
          {entry.notes.length > 0 && (
            <ul
              className="space-y-1.5 px-4 py-3"
              style={{ background: "hsl(var(--warn) / 0.08)", borderRadius: 2 }}
            >
              {entry.notes.map((n, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                  <StateGlyph state="warn" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function CalculatorLabPage() {
  const [lane, setLane] = useState(LANES[0]);
  const [checks, setChecks] = useState<boolean[]>(() => WARMUP.map(() => false));
  const ready = checks.every(Boolean);

  const entries = useMemo(() => KEYSTROKES.filter((k) => k.skills.includes(lane.key)), [lane]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <TitleBlock
        eyebrow="BA II Plus mastery"
        title="Calculator Lab"
        subtitle="Most calculator misses are stale settings, not bad math — warm up, then drill keystrokes until they're automatic."
      />

      {/* Warm-up checklist */}
      <div className="p-5 sm:p-6" style={boxStyle}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
            Warm-up — reset before every problem
          </h2>
          <button
            onClick={() => setChecks(WARMUP.map(() => false))}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
        <div className="space-y-2">
          {WARMUP.map((w, i) => (
            <button
              key={i}
              onClick={() => setChecks((c) => c.map((v, j) => (j === i ? !v : v)))}
              className="flex w-full items-center gap-3 border px-4 py-2.5 text-left text-sm transition"
              style={{
                borderColor: "hsl(var(--border))",
                background: checks[i] ? "hsl(var(--good) / 0.1)" : "transparent",
                borderRadius: 2,
              }}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center border"
                style={{
                  borderColor: checks[i] ? "hsl(var(--good))" : "hsl(var(--border))",
                  background: checks[i] ? "hsl(var(--good))" : "transparent",
                  borderRadius: 2,
                }}
              >
                {checks[i] && <Check className="h-3.5 w-3.5 text-white" />}
              </span>
              <span
                className={checks[i] ? "font-mono text-foreground" : "font-mono text-text-muted"}
              >
                {w}
              </span>
            </button>
          ))}
        </div>
        {ready && (
          <p
            className="mt-3 flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: "hsl(var(--good))" }}
          >
            <StateGlyph state="good" /> Registers clear, settings verified — you&apos;re ready.
          </p>
        )}
      </div>

      {/* Skill lanes */}
      <div
        className="inline-flex flex-wrap"
        style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
      >
        {LANES.map((l) => {
          const on = l.key === lane.key;
          return (
            <button
              key={l.key}
              onClick={() => setLane(l)}
              className="px-4 py-2 text-sm font-semibold transition"
              style={
                on
                  ? { background: "hsl(var(--foreground))", color: "hsl(var(--background))" }
                  : { color: "hsl(var(--text-muted))" }
              }
            >
              {l.label}
            </button>
          );
        })}
      </div>

      {/* Keystroke drills for the lane */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="p-6" style={boxStyle}>
            <p className="text-sm text-text-muted">No keystroke sequences for this lane yet.</p>
          </div>
        ) : (
          entries.map((e) => <KeystrokeCard key={e.id} entry={e} />)
        )}
      </div>

      {/* Logic layer — run a real problem with those keystrokes */}
      {lane.practiceSkill && (
        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
            Now run one on your calculator
          </h2>
          <p className="text-sm text-text-muted">
            Use the keystrokes above to solve this. Two layers, one rep: recognize the problem type,
            then execute the sequence.
          </p>
          <PracticeBlock key={lane.key} mode="parametric" skills={[lane.practiceSkill]} />
        </div>
      )}
    </div>
  );
}
