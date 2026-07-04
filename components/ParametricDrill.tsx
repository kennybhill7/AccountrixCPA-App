"use client";

/**
 * Parametric drill (FABLE5_ANALYSIS §5 wk4) — infinite "New variation" numeric
 * drills over lib/parametric generators, optionally filtered by skill. Every
 * submission is recorded to the Attempt Ledger (useAttempts, source
 * "parametric") so readiness/SRS see parametric work like any other attempt.
 *
 * Seed handling: the last seed persists in localStorage so a page refresh
 * resumes at the same variation instead of repeating from seed 1; "New
 * variation" advances the seed (which also rotates the active generator).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAttempts } from "@/lib/store";
import {
  GENERATORS,
  generatorsForSkills,
  gradeTolerance,
  isWithinTolerance,
} from "@/lib/parametric";

const SEED_KEY = "parametric-drill-seed";

interface ParametricDrillProps {
  /** Skill filter — generators whose skills overlap; omit for all generators. */
  skills?: string[];
}

interface SubmitResult {
  correct: boolean;
  entered: number;
}

export function ParametricDrill({ skills }: ParametricDrillProps) {
  const record = useAttempts((s) => s.record);

  // null until mounted — the seed comes from localStorage, so rendering the
  // problem on the server would mismatch the client on hydration.
  const [seed, setSeed] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<SubmitResult | null>(null);
  const shownAtRef = useRef<number>(Date.now());

  const skillsKey = (skills ?? []).join(",");
  const genIds = useMemo(
    () => generatorsForSkills(skills),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [skillsKey]
  );

  useEffect(() => {
    let initial = 1;
    try {
      const raw = localStorage.getItem(SEED_KEY);
      const n = raw === null ? NaN : parseInt(raw, 10);
      if (Number.isFinite(n) && n >= 0) initial = n;
    } catch {
      /* storage blocked — start at 1 */
    }
    setSeed(initial);
  }, []);

  // New instance shown: persist the seed, reset the answer state, start timing.
  useEffect(() => {
    if (seed === null) return;
    try {
      localStorage.setItem(SEED_KEY, String(seed));
    } catch {
      /* non-fatal */
    }
    setInput("");
    setResult(null);
    shownAtRef.current = Date.now();
  }, [seed, skillsKey]);

  const instance = useMemo(() => {
    if (seed === null) return null;
    const genId = genIds[seed % genIds.length];
    return GENERATORS[genId](seed);
  }, [seed, genIds]);

  if (seed === null || !instance) {
    return (
      <div className="rounded-lg border bg-card px-5 py-4 text-sm text-muted-foreground">
        Loading drill...
      </div>
    );
  }

  const tolerance = gradeTolerance(instance.answer, instance.unit);
  const submitted = result !== null;

  const handleSubmit = () => {
    if (submitted) return;
    // Accept "$1,234.56", "9.3%", plain numbers, etc.
    const entered = parseFloat(input.replace(/[$,%\s]/g, ""));
    if (!Number.isFinite(entered)) return;

    const correct = isWithinTolerance(entered, instance.answer, instance.unit);
    const timeSec = Math.max(0, Math.round((Date.now() - shownAtRef.current) / 1000));

    // Ledger entry — the substrate readiness/SRS/error-pattern engines read.
    record({
      source: "parametric",
      track: "finance",
      itemId: `parametric:${instance.id}:${instance.seed}`,
      skills: instance.skills,
      correct,
      answer: entered,
      timeSec,
    });

    setResult({ correct, entered });
  };

  const fmtAnswer =
    instance.unit === "%"
      ? `${instance.answer}%`
      : `$${instance.answer.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {instance.id}
          </span>
          {instance.skills.map((s) => (
            <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">seed {instance.seed}</span>
      </div>

      <div className="space-y-4 px-5 py-4">
        <p className="text-sm leading-relaxed">{instance.prompt}</p>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-[220px]"
            inputMode="decimal"
            placeholder={instance.unit === "%" ? "e.g. 9.30" : "e.g. 1435.03"}
            value={input}
            disabled={submitted}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            aria-label="Your answer"
          />
          <span className="text-sm text-muted-foreground">{instance.unit}</span>
          <Button onClick={handleSubmit} disabled={submitted || input.trim() === ""}>
            Submit
          </Button>
          <Button variant="outline" onClick={() => setSeed(seed + 1)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New variation
          </Button>
        </div>

        {result && (
          <div
            className={
              "rounded-md border px-4 py-3 text-sm " +
              (result.correct
                ? "border-green-600/40 bg-green-500/10"
                : "border-red-600/40 bg-red-500/10")
            }
          >
            <p className="mb-2 flex items-center gap-2 font-semibold">
              {result.correct ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> Correct
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" /> Incorrect
                </>
              )}
              <span className="font-normal text-muted-foreground">
                — answer {fmtAnswer} (±{tolerance.toFixed(2)})
              </span>
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
              {Object.entries(instance.params).map(([k, v]) => (
                <span key={k}>
                  {k} = {v.toLocaleString()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
