"use client";

/**
 * Grade-target card (FABLE5_ANALYSIS §5 wk4) — solves the final-exam score
 * needed to hit a target grade in the corporate-finance track. Pure UI over
 * lib/gradeTarget; inputs persist to localStorage ("grade-target-inputs").
 * No personal data — the learner supplies their own numbers at runtime.
 */

import { useEffect, useMemo, useState } from "react";
import { Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  weightsSumToOne,
  projectGrade,
  finalNeeded,
  finalNeededDetailed,
  applyMidtermReplacement,
  sensitivityTable,
  type GradeWeights,
  type FinalNeededResult,
} from "@/lib/gradeTarget";

const STORAGE_KEY = "grade-target-inputs";
const OTHER_AVERAGES = [70, 75, 80, 85, 90, 95];

const TARGETS = [
  { label: "A (93)", value: 93 },
  { label: "A− (90)", value: 90 },
  { label: "B+ (87)", value: 87 },
  { label: "B (83)", value: 83 },
] as const;

interface SavedInputs {
  wMidterm: number;
  wFinal: number;
  wOther: number;
  midterm: number;
  midterm2: number;
  other: number;
  target: number;
  replacement: boolean;
}

const DEFAULTS: SavedInputs = {
  wMidterm: 0.2,
  wFinal: 0.5,
  wOther: 0.3,
  midterm: 80,
  midterm2: 80,
  other: 85,
  target: 87, // B+
  replacement: false,
};

/**
 * Final needed when the final replaces the lowest of two midterms (if higher).
 * The projected grade is piecewise-linear and increasing in the final score f:
 *  - f ≤ min(m1,m2): no replacement — kept midterm avg is (m1+m2)/2.
 *  - f > min(m1,m2): lowest is replaced — kept avg is (max(m1,m2)+f)/2, so
 *    target = w.mid×(max+f)/2 + w.final×f + w.other×other solves linearly.
 * Exactly one region contains the crossing (continuity + monotonicity).
 */
function finalNeededWithReplacement(
  w: GradeWeights,
  m1: number,
  m2: number,
  other: number,
  target: number
): FinalNeededResult {
  const lo = Math.min(m1, m2);
  const hi = Math.max(m1, m2);
  // Region 1: no replacement.
  const f0 = finalNeeded(w, { midterm: (m1 + m2) / 2, other }, target);
  if (f0 <= lo) return { needed: f0, achievable: f0 <= 100, alreadyLocked: f0 <= 0 };
  // Region 2: lowest midterm replaced by the final.
  const f1 = (target - (w.midterm * hi) / 2 - w.other * other) / (w.final + w.midterm / 2);
  return { needed: f1, achievable: f1 <= 100, alreadyLocked: f1 <= 0 };
}

function numOr(v: string, fallback: number): number {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

export function GradeTargetCard() {
  const [inputs, setInputs] = useState<SavedInputs>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  // Load persisted inputs once on mount (client only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setInputs({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<SavedInputs>) });
    } catch {
      /* corrupt storage — keep defaults */
    }
    setLoaded(true);
  }, []);

  // Persist on every change after the initial load.
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      /* storage full/blocked — non-fatal */
    }
  }, [inputs, loaded]);

  const set = (patch: Partial<SavedInputs>) => setInputs((prev) => ({ ...prev, ...patch }));

  const weights: GradeWeights = {
    midterm: inputs.wMidterm,
    final: inputs.wFinal,
    other: inputs.wOther,
  };
  const weightsOk = weightsSumToOne(weights) && weights.final > 0;

  const keptMidterm = inputs.replacement ? (inputs.midterm + inputs.midterm2) / 2 : inputs.midterm;

  const result = useMemo<FinalNeededResult | null>(() => {
    if (!weightsOk) return null;
    return inputs.replacement
      ? finalNeededWithReplacement(
          weights,
          inputs.midterm,
          inputs.midterm2,
          inputs.other,
          inputs.target
        )
      : finalNeededDetailed(weights, { midterm: inputs.midterm, other: inputs.other }, inputs.target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, weightsOk]);

  const bestCase = useMemo(() => {
    if (!weightsOk) return null;
    const midtermAt100 = inputs.replacement
      ? applyMidtermReplacement([inputs.midterm, inputs.midterm2], 100).reduce((a, b) => a + b, 0) / 2
      : inputs.midterm;
    return projectGrade(weights, { midterm: midtermAt100, other: inputs.other }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, weightsOk]);

  const rows = useMemo(
    () => (weightsOk ? sensitivityTable(weights, keptMidterm, inputs.target, OTHER_AVERAGES) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputs, weightsOk, keptMidterm]
  );

  const numField = (
    label: string,
    value: number,
    onChange: (n: number) => void,
    opts?: { step?: number; min?: number; max?: number }
  ) => (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        inputMode="decimal"
        step={opts?.step ?? 1}
        min={opts?.min}
        max={opts?.max}
        value={value}
        onChange={(e) => onChange(numOr(e.target.value, 0))}
      />
    </div>
  );

  return (
    <section className="rounded-lg border bg-card" aria-label="Grade target">
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <Target className="h-5 w-5 text-primary" />
        <div>
          <h2 className="font-semibold">Grade target</h2>
          <p className="text-xs text-muted-foreground">
            Solve the final-exam score needed for your target course grade.
          </p>
        </div>
      </div>

      <div className="grid gap-5 px-5 py-4 md:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Component weights (must sum to 1)</p>
            <div className="grid grid-cols-3 gap-2">
              {numField("Midterm", inputs.wMidterm, (n) => set({ wMidterm: n }), {
                step: 0.05,
                min: 0,
                max: 1,
              })}
              {numField("Final", inputs.wFinal, (n) => set({ wFinal: n }), {
                step: 0.05,
                min: 0,
                max: 1,
              })}
              {numField("Other", inputs.wOther, (n) => set({ wOther: n }), {
                step: 0.05,
                min: 0,
                max: 1,
              })}
            </div>
            {!weightsOk && (
              <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
                Weights must sum to 1.00 (currently{" "}
                {(inputs.wMidterm + inputs.wFinal + inputs.wOther).toFixed(2)}) with final weight
                &gt; 0.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {inputs.replacement ? (
              <>
                {numField("Midterm 1 %", inputs.midterm, (n) => set({ midterm: n }), {
                  min: 0,
                  max: 100,
                })}
                {numField("Midterm 2 %", inputs.midterm2, (n) => set({ midterm2: n }), {
                  min: 0,
                  max: 100,
                })}
              </>
            ) : (
              numField("Midterm %", inputs.midterm, (n) => set({ midterm: n }), {
                min: 0,
                max: 100,
              })
            )}
            {numField("Other average %", inputs.other, (n) => set({ other: n }), {
              min: 0,
              max: 100,
            })}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground" htmlFor="grade-target-select">
                Target grade
              </Label>
              <select
                id="grade-target-select"
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={inputs.target}
                onChange={(e) => set({ target: numOr(e.target.value, DEFAULTS.target) })}
              >
                {TARGETS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={inputs.replacement}
                onChange={(e) => set({ replacement: e.target.checked })}
              />
              Final replaces lowest midterm
            </label>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          {result && (
            <div
              className={
                "rounded-md border px-4 py-3 " +
                (result.alreadyLocked
                  ? "border-green-600/40 bg-green-500/10"
                  : result.achievable
                    ? "border-primary/40 bg-primary/5"
                    : "border-red-600/40 bg-red-500/10")
              }
            >
              {result.alreadyLocked ? (
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Target locked in — even a 0 on the final keeps you at {inputs.target}%+.
                </p>
              ) : result.achievable ? (
                <p className="text-sm">
                  <span className="text-2xl font-bold text-primary">
                    {Math.max(0, result.needed).toFixed(1)}%
                  </span>{" "}
                  <span className="font-medium">needed on the final</span> for a {inputs.target}%
                  course grade.
                </p>
              ) : (
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                  Not reachable — you&apos;d need {result.needed.toFixed(1)}% on the final.
                  {bestCase !== null && (
                    <span className="block font-normal">
                      Best case with a perfect final: {bestCase.toFixed(1)}%.
                    </span>
                  )}
                </p>
              )}
            </div>
          )}

          {rows.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Final needed vs. other-average (midterm {keptMidterm.toFixed(0)}%, target{" "}
                {inputs.target}%)
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="py-1 pr-2 font-medium">Other avg</th>
                    {rows.map((r) => (
                      <th key={r.other} className="py-1 pr-2 text-right font-medium">
                        {r.other}%
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 pr-2 text-xs text-muted-foreground">Final needed</td>
                    {rows.map((r) => (
                      <td
                        key={r.other}
                        className={
                          "py-1 pr-2 text-right tabular-nums " +
                          (r.achievable
                            ? "font-medium"
                            : "font-medium text-red-600 dark:text-red-400")
                        }
                      >
                        {r.achievable ? `${Math.max(0, r.finalNeeded).toFixed(1)}%` : "—"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
