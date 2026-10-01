"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PracticeBlock, type CpaSection } from "@/components/glass/PracticeBlock";
import { TitleBlock } from "@/components/sheet/TitleBlock";
import { useAttempts } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { skillStatsFromAttempts } from "@/lib/attemptStats";
import { GENERATOR_SKILLS } from "@/lib/parametric";
import { SKILL_LABELS } from "@/lib/mastery";

type TrackKey = "weak" | "finance" | CpaSection;
interface Track {
  key: TrackKey;
  label: string;
  mode: "parametric" | "mcq";
}

const TRACKS: Track[] = [
  { key: "weak", label: "Weak spots", mode: "parametric" },
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

function PracticeInner() {
  const [active, setActive] = useState<Track>(TRACKS[0]);
  const hydrated = useHydratedStore();
  const events = useAttempts((s) => s.events);
  const focusSkill = useSearchParams().get("skill");
  const focused = focusSkill && DRILLABLE.has(focusSkill) ? focusSkill : null;

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
      <TitleBlock
        eyebrow="Endless reps"
        title="Practice"
        subtitle="You only get good at accounting and finance by doing the work. Pick a track and keep the reps coming — it's endless."
      />

      {focused && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
              Focused: {SKILL_LABELS[focused] ?? focused}
            </h2>
            <Link href="/practice" className="blueprint-label underline">
              Clear
            </Link>
          </div>
          <PracticeBlock
            key={`focus-${focused}`}
            mode="parametric"
            skills={[focused]}
            subheading="Deep-linked from a Method Card — drilling just this skill until it climbs."
          />
        </div>
      )}

      {/* Track selector — a bordered segmented strip, not accent-tinted pills:
          the active track is ink-filled, matching rule 4.4 (PracticeBlock
          below already spends this page's ink but never its accent). */}
      <div
        className="inline-flex flex-wrap"
        style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
      >
        {TRACKS.map((t) => {
          const on = t.key === active.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t)}
              className="px-4 py-2 text-sm font-semibold transition"
              style={
                on
                  ? { background: "hsl(var(--foreground))", color: "hsl(var(--background))" }
                  : { color: "hsl(var(--text-muted))" }
              }
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
          <div className="p-6" style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}>
            <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
              Not enough data yet
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Work a dozen or so problems across Finance and the CPA sections. Once the ledger sees
              where you miss, this tab targets your weakest skills automatically.
            </p>
          </div>
        )
      ) : active.mode === "parametric" ? (
        <PracticeBlock
          key="finance"
          mode="parametric"
          heading="Finance drills"
          subheading="Self-checking numeric problems — infinite variations."
        />
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

export default function PracticePage() {
  return (
    <Suspense
      fallback={<div className="py-16 text-center text-sm text-text-muted">Loading practice…</div>}
    >
      <PracticeInner />
    </Suspense>
  );
}
