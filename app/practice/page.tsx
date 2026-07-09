"use client";

import { useState } from "react";
import { Dumbbell } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { PracticeBlock, type CpaSection } from "@/components/glass/PracticeBlock";

type Track =
  | { key: "finance"; label: string; mode: "parametric" }
  | { key: CpaSection; label: string; mode: "mcq" };

const TRACKS: Track[] = [
  { key: "finance", label: "Finance (numeric)", mode: "parametric" },
  { key: "FAR", label: "FAR", mode: "mcq" },
  { key: "AUD", label: "AUD", mode: "mcq" },
  { key: "REG", label: "REG", mode: "mcq" },
  { key: "BAR", label: "BAR", mode: "mcq" },
  { key: "ISC", label: "ISC", mode: "mcq" },
  { key: "TCP", label: "TCP", mode: "mcq" },
];

export default function PracticePage() {
  const [active, setActive] = useState<Track>(TRACKS[0]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <GlassCard className="p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: "linear-gradient(135deg,#3b82f6,#7c3aed)" }}>
            <Dumbbell className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Practice</h1>
            <p className="mt-1 text-muted-foreground">
              You only get good at accounting and finance by doing the work. Pick a track and keep the reps coming — it&apos;s endless.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Track selector */}
      <div className="flex flex-wrap gap-2">
        {TRACKS.map((t) => {
          const on = t.key === active.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t)}
              className={on ? "rounded-xl px-4 py-2 text-sm font-semibold" : "glass glass-hover rounded-xl px-4 py-2 text-sm font-medium text-text-muted"}
              style={on ? { background: "hsl(var(--primary) / 0.13)", color: "hsl(var(--primary))" } : { borderRadius: 12 }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Endless practice — remount on track change to reset the session counter */}
      {active.mode === "parametric" ? (
        <PracticeBlock key="finance" mode="parametric" heading="Finance drills" subheading="Self-checking numeric problems — infinite variations." />
      ) : (
        <PracticeBlock
          key={active.key}
          mode="mcq"
          section={active.key as CpaSection}
          heading={`${active.label} multiple choice`}
          subheading="Answer, read the rationale, keep going. Wrong answers feed your review queue."
        />
      )}
    </div>
  );
}
