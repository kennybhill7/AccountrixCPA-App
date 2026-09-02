"use client";

/**
 * BA II Plus keystroke drawer (FABLE5_ANALYSIS §5 wk4) — collapsible quick-ref
 * over lib/calculatorKeystrokes, filtered to the skills of the current lesson.
 * If no entry matches the given skills, falls back to showing all sequences.
 */

import { useMemo, useState } from "react";
import { Calculator, ChevronDown, ChevronRight } from "lucide-react";
import { KEYSTROKES, bySkill, type KeystrokeEntry } from "@/lib/calculatorKeystrokes";

interface CalculatorDrawerProps {
  /** SKILL_TAXONOMY ids — entries tagged with any of these are shown. */
  skills: string[];
}

export function CalculatorDrawer({ skills }: CalculatorDrawerProps) {
  const [open, setOpen] = useState(false);

  const { entries, showingAll } = useMemo(() => {
    const seen = new Set<string>();
    const matched: KeystrokeEntry[] = [];
    for (const skill of skills) {
      for (const e of bySkill(skill)) {
        if (!seen.has(e.id)) {
          seen.add(e.id);
          matched.push(e);
        }
      }
    }
    return matched.length > 0
      ? { entries: matched, showingAll: false }
      : { entries: KEYSTROKES, showingAll: true };
  }, [skills]);

  return (
    <section className="rounded-lg border bg-card" aria-label="Calculator keystrokes">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-accent/50"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <Calculator className="h-5 w-5 text-primary" />
          <span className="font-semibold">
            BA II Plus keystrokes
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {entries.length} sequence{entries.length === 1 ? "" : "s"}
              {showingAll && " · showing all (no skill match)"}
            </span>
          </span>
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="divide-y border-t">
          {entries.map((entry) => (
            <div key={entry.id} className="px-5 py-4">
              <h3 className="mb-2 text-sm font-semibold">{entry.topic}</h3>
              <ol className="mb-2 list-decimal space-y-1 pl-5 font-mono text-sm">
                {entry.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              <ul className="space-y-0.5 text-xs text-muted-foreground">
                {entry.notes.map((note, i) => (
                  <li key={i}>⚠ {note}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
