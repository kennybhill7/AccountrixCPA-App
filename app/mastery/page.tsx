"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useAttempts, DEFAULT_EXAM_TARGET } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import {
  masteryMap,
  overallReadiness,
  LEVEL_NAMES,
  AREA_ORDER,
  type MasteryLevel,
  type SkillMastery,
} from "@/lib/mastery";
import { ActionBar } from "@/components/sheet/ActionBar";

// A 5-tier mastery scale, not a right/wrong result, so it draws from the
// app's tokens without ever reaching for --primary: this renders once per
// skill row (dozens on a full mastery map), and the page's one accent slot
// belongs to "Drill weak spots" (rule 4.4), not a level indicator repeated
// that many times. Level 3 ("Proficient" — one tier under Exam-Ready)
// borrows --pen, the app's one remaining non-status token, since good/warn/
// bad are already spent on levels 4/2/1.
const LEVEL_COLOR: Record<MasteryLevel, string> = {
  0: "hsl(var(--foreground) / 0.18)",
  1: "hsl(var(--bad))",
  2: "hsl(var(--warn))",
  3: "hsl(var(--pen))",
  4: "hsl(var(--good))",
};

function LevelBar({ level }: { level: MasteryLevel }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4].map((seg) => (
        <span
          key={seg}
          className="h-1.5 w-6 rounded-full"
          style={{
            background: level >= seg ? LEVEL_COLOR[level] : "hsl(var(--foreground) / 0.08)",
          }}
        />
      ))}
    </div>
  );
}

function SkillRow({ m }: { m: SkillMastery }) {
  return (
    <Link
      href={`/practice?skill=${encodeURIComponent(m.skill)}`}
      className="lesson-row -mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5"
      style={{ "--row-accent": "var(--foreground)" } as CSSProperties}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">{m.label}</div>
        <div className="text-xs text-text-light">
          {m.attempts > 0
            ? `${Math.round(m.accuracy * 100)}% over ${m.attempts} attempts`
            : "Not attempted yet"}
        </div>
      </div>
      <LevelBar level={m.level} />
      <span
        className="w-24 shrink-0 text-right text-xs font-semibold"
        style={{ color: LEVEL_COLOR[m.level] }}
      >
        {LEVEL_NAMES[m.level]}
      </span>
    </Link>
  );
}

export default function MasteryPage() {
  const hydrated = useHydratedStore();
  const events = useAttempts((s) => s.events);
  const [examDate, setExamDate] = useState("");

  useEffect(() => {
    try {
      setExamDate(localStorage.getItem("exam:corpfin:date") || DEFAULT_EXAM_TARGET.examDate);
    } catch {
      /* ignore */
    }
  }, []);

  const map = useMemo(() => (hydrated ? masteryMap(events) : []), [events, hydrated]);
  const readiness = useMemo(() => (hydrated ? overallReadiness(events) : 0), [events, hydrated]);
  const examReady = map.filter((m) => m.level === 4).length;

  const daysLeft = useMemo(() => {
    if (!examDate) return null;
    const t = new Date(`${examDate}T00:00:00`).getTime();
    return Number.isFinite(t) ? Math.ceil((t - Date.now()) / 86_400_000) : null;
  }, [examDate]);

  const byArea = useMemo(() => {
    const groups = new Map<string, SkillMastery[]>();
    for (const m of map) {
      const arr = groups.get(m.area) ?? [];
      arr.push(m);
      groups.set(m.area, arr);
    }
    return AREA_ORDER.filter((a) => groups.has(a)).map((area) => ({
      area,
      skills: (groups.get(area) ?? []).sort((a, b) => b.level - a.level || b.accuracy - a.accuracy),
    }));
  }, [map]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Readiness header */}
      <div
        className="p-6 sm:p-8"
        style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div>
              <div className="blueprint-label">Ready</div>
              <div className="ledger-number text-4xl font-semibold text-foreground">
                {readiness}%
              </div>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                Mastery
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {examReady} of {map.length} skills at Exam-Ready.
                {daysLeft != null && daysLeft >= 0
                  ? ` Corporate Finance exam in ${daysLeft} days.`
                  : ""}
              </p>
            </div>
          </div>
          <ActionBar primary={{ label: "Drill weak spots", href: "/practice" }} />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-1 text-xs text-text-muted">
        {([1, 2, 3, 4] as MasteryLevel[]).map((lv) => (
          <span key={lv} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: LEVEL_COLOR[lv] }} />
            {LEVEL_NAMES[lv]}
          </span>
        ))}
      </div>

      {/* Areas */}
      {byArea.map(({ area, skills }) => (
        <div
          key={area}
          className="p-5 sm:p-6"
          style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
        >
          <h2 className="font-display mb-1 text-lg font-bold tracking-tight text-foreground">
            {area}
          </h2>
          <div className="divide-y" style={{ borderColor: "hsl(var(--foreground) / 0.06)" }}>
            {skills.map((m) => (
              <SkillRow key={m.skill} m={m} />
            ))}
          </div>
        </div>
      ))}

      {!hydrated && <p className="text-center text-sm text-text-muted">Loading your progress…</p>}
    </div>
  );
}
