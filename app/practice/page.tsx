"use client";

import { useMemo, useState } from "react";
import { Dumbbell, Zap } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { PracticeBlock, type CpaSection } from "@/components/glass/PracticeBlock";
import { useAttempts } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { skillStatsFromAttempts } from "@/lib/attemptStats";
import { GENERATOR_SKILLS } from "@/lib/parametric";

type TrackKey = "weak" | "finance" | CpaSection;
interface Track {
  key: TrackKey;
  label: string;
  mode: "parametric" | "mcq";
}

const TRACKS: Track[] = [
  { key: "weak", label: "⚡ Weak spots", mode: "parametric" },
  { key: "finance", label: "Finance (numeric)", mode: "parametric" },
  { key: "FAR", label: "FAR", mode: "mcq" },
  { key: "AUD", label: "AUD", mode: "mcq" },
  { key: "REG", label: "REG", mode: "mcq" },
  { key: "BAR", label: "BAR", mode: "mcq" },
  { key: "ISC", label: "ISC", mode: "mcq" },
  { key: "TCP", label: "TCP", mode: "mcq" },
];

// Skills that at least one finance generator can drill.
const DRILLABLE = new Set(Object.values(GENERATOR_SKILLS).flat());

export default function PracticePage() {
  const [active, setActive] = useState<Track>(TRACKS[0]);
  const hydrated = useHydratedStore();
  const events = useAttempts((s) => s.events);

  // Weakest drillable finance skills: lowest accuracy first, ≥2 attempts.
  const weakSkills = useMemo(() => {
    if (!hydrated) return [];
    return skillStatsFromAttempts(events)
      .filter((s) => DRILLABLE.has(s.skill) && s.attempts >= 2)
      .map((s) => ({ skill: s.skill, acc: s.correct / s.attempts }))
      .sort((a, b) => a.acc - b.acc)
      .slice(0, 4)
      .map((s) => s.skill);
  }, [events, hydrated]);

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

      {active.key === "weak" ? (
        weakSkills.length > 0 ? (
          <PracticeBlock
            key={`weak-${weakSkills.join(",")}`}
            mode="parametric"
            skills={weakSkills}
            heading="Your weak spots"
            subheading={`Targeting your lowest-accuracy skills: ${weakSkills.join(", ")}. Drill until they climb.`}
          />
        ) : (
          <GlassCard className="p-6">
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">Not enough data yet</h3>
                <p className="mt-1 text-sm text-text-muted">
                  Work a dozen or so problems across Finance and the CPA sections. Once the ledger sees where you miss,
                  this tab targets your weakest skills automatically.
                </p>
              </div>
            </div>
          </GlassCard>
        )
      ) : active.mode === "parametric" ? (
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
