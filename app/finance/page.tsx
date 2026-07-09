"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, GraduationCap } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { GradeTargetCard } from "@/components/GradeTargetCard";
import { ParametricDrill } from "@/components/ParametricDrill";
import { useUserProgress } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { GlassCard } from "@/components/glass/GlassCard";
import { ResumeHero } from "@/components/glass/ResumeHero";
import { StatTile } from "@/components/glass/StatTile";
import { StreakStrip, type StreakDay } from "@/components/glass/StreakStrip";
import { ProgressRing } from "@/components/glass/ProgressRing";
import { UnitCard } from "@/components/glass/UnitCard";
import { LessonRow } from "@/components/glass/LessonRow";
import { FilterTabs } from "@/components/glass/FilterTabs";
import type { LessonStatus } from "@/components/glass/StatusPill";

interface FinanceWeek {
  id: string;
  title: string;
  quiz?: { questions?: unknown[] };
  flashcards?: unknown[];
}
interface FinanceUnit {
  id: string;
  unit: number;
  title: string;
  weeks: FinanceWeek[];
}

const FILTERS = ["All", "In progress", "Not started", "Bookmarked"] as const;
type Filter = (typeof FILTERS)[number];

const cleanUnit = (t: string) =>
  t.replace(/^Finance Unit\s*\d+\s*[—–-]\s*/i, "").replace(/,\s*/g, " · ");
const cleanWeek = (t: string) =>
  t.replace(/^Finance\s*U\d+[·.\-]W\d+\s*[—–-]\s*/i, "");
const unitVar = (n: number) => `--unit-${((n - 1) % 3) + 1}`;
const estMins = (q: number, cards: number) => Math.max(6, Math.round(q * 1.2 + cards * 0.7));

const weekdayStrip = (streak: number): StreakDay[] => {
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0
  return labels.map((label, i) => ({
    label,
    today: i === todayIdx,
    done: i < todayIdx && todayIdx - i < streak,
  }));
};

export default function FinancePage() {
  const [units, setUnits] = useState<FinanceUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("All");

  const hydrated = useHydratedStore();
  const { xp, streak, getXPLevel, isQuizCompleted, getBookmarks } = useUserProgress();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/finance/curriculum");
        const data = res.ok ? await res.json() : { units: [] };
        setUnits(Array.isArray(data.units) ? data.units : []);
      } catch {
        setUnits([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const bookmarkSet = useMemo(
    () => new Set(hydrated ? getBookmarks().map((b) => `${b.monthId}:${b.weekId}`) : []),
    [hydrated, getBookmarks]
  );

  // Flatten to compute the "current" (first incomplete) lesson + course progress.
  const flat = useMemo(
    () => units.flatMap((u) => u.weeks.map((w) => ({ u, w }))),
    [units]
  );
  const doneKey = (uId: string, wId: string) => (hydrated ? isQuizCompleted(uId, wId) : false);
  const completedCount = flat.filter(({ u, w }) => doneKey(u.id, w.id)).length;
  const total = flat.length;
  const coursePct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const current = flat.find(({ u, w }) => !doneKey(u.id, w.id)) ?? null;

  const statusOf = (uId: string, wId: string): LessonStatus => {
    if (doneKey(uId, wId)) return "done";
    if (current && current.u.id === uId && current.w.id === wId) return "current";
    return "todo";
  };

  const passesFilter = (uId: string, wId: string): boolean => {
    const s = statusOf(uId, wId);
    if (filter === "In progress") return s === "current";
    if (filter === "Not started") return s === "todo";
    if (filter === "Bookmarked") return bookmarkSet.has(`${uId}:${wId}`);
    return true;
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        <p className="text-muted-foreground">Loading Finance…</p>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <GlassCard className="p-8">
        <EmptyState
          icon={Calculator}
          title="Finance lessons not built yet"
          description="Run npm run build:finance-curriculum to assemble the corporate-finance units."
        />
      </GlassCard>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Resume hero */}
      {current && (
        <ResumeHero
          title={cleanWeek(current.w.title)}
          meta={`Finance Unit ${current.u.unit} · ${current.w.quiz?.questions?.length ?? 0} questions · ${
            current.w.flashcards?.length ?? 0
          } cards`}
          progress={coursePct}
          href={`/finance/${current.u.id}/${current.w.id}`}
          nextUp={(() => {
            const idx = flat.findIndex(({ u, w }) => u.id === current.u.id && w.id === current.w.id);
            const next = flat[idx + 1];
            return next ? cleanWeek(next.w.title) : undefined;
          })()}
        />
      )}

      {/* Momentum strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <StreakStrip count={hydrated ? streak : 0} days={weekdayStrip(hydrated ? streak : 0)} />
        <StatTile
          label="Experience"
          value={`${(hydrated ? xp : 0).toLocaleString()} XP`}
          sub={`Level ${hydrated ? getXPLevel() : 1}`}
        />
        <GlassCard className="flex items-center gap-4 p-4 sm:p-5">
          <ProgressRing pct={coursePct} size={66} />
          <div>
            <div className="text-sm font-semibold text-foreground">Course progress</div>
            <div className="text-xs text-text-muted">
              {completedCount} of {total} lessons
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Units heading + filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground">Your units</h1>
        <FilterTabs tabs={FILTERS} active={filter} onChange={setFilter} />
      </div>

      {/* Unit cards */}
      <div className="space-y-5">
        {units.map((unit) => {
          const visible = unit.weeks.filter((w) => passesFilter(unit.id, w.id));
          if (visible.length === 0) return null;
          const done = unit.weeks.filter((w) => doneKey(unit.id, w.id)).length;
          const accent = unitVar(unit.unit);
          return (
            <UnitCard
              key={unit.id}
              code={`FIN ${unit.unit}`}
              title={cleanUnit(unit.title)}
              accentVar={accent}
              done={done}
              total={unit.weeks.length}
            >
              {visible.map((week) => {
                const q = week.quiz?.questions?.length ?? 0;
                const cards = week.flashcards?.length ?? 0;
                return (
                  <LessonRow
                    key={week.id}
                    href={`/finance/${unit.id}/${week.id}`}
                    title={cleanWeek(week.title)}
                    q={q}
                    cards={cards}
                    mins={estMins(q, cards)}
                    status={statusOf(unit.id, week.id)}
                    accentVar={accent}
                  />
                );
              })}
            </UnitCard>
          );
        })}
      </div>

      {/* Grade target */}
      <section className="pt-2">
        <h2 className="font-display mb-1 text-xl font-bold tracking-tight text-foreground">Grade target</h2>
        <p className="mb-4 text-sm text-text-muted">
          Solve the final-exam score needed for your target course grade.
        </p>
        <GlassCard className="p-5 sm:p-6">
          <GradeTargetCard />
        </GlassCard>
      </section>

      {/* Drill generator */}
      <section>
        <h2 className="font-display mb-1 text-xl font-bold tracking-tight text-foreground">Drill generator</h2>
        <p className="mb-4 text-sm text-text-muted">
          Self-verifying numeric variations across all finance generators. Every submission lands in the attempt ledger.
        </p>
        <GlassCard className="p-5 sm:p-6">
          <ParametricDrill />
        </GlassCard>
      </section>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-sm text-text-muted">Small reps, every day — that&apos;s how the CFO judgment compounds.</p>
        <Link
          href="/tracks"
          className="glass glass-hover inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground"
          style={{ borderRadius: 14 }}
        >
          <GraduationCap className="h-4 w-4" />
          All tracks
        </Link>
      </div>
    </div>
  );
}
