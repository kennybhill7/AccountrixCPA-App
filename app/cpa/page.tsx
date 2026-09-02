"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { GlassCard } from "@/components/glass/GlassCard";
import { UnitCard } from "@/components/glass/UnitCard";
import { LessonRow } from "@/components/glass/LessonRow";
import { StatTile } from "@/components/glass/StatTile";
import { PracticeBlock, type CpaSection } from "@/components/glass/PracticeBlock";
import { useCpaProgress } from "@/lib/store";

interface CpaWeek {
  id: string;
  title: string;
  quiz?: { questions?: unknown[] };
  flashcards?: unknown[];
}
interface CpaUnit {
  id: string;
  section: string;
  unit: number;
  title: string;
  weeks: CpaWeek[];
}

const SECTION_ORDER = ["FAR", "AUD", "REG", "BAR", "ISC", "TCP"];

export default function CpaLessonsPage() {
  const [units, setUnits] = useState<CpaUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [practiceSection, setPracticeSection] = useState<CpaSection>("FAR");
  const completed = useCpaProgress((s) => s.completedQuizzes);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/cpa/curriculum");
        const data = res.ok ? await res.json() : { units: [] };
        setUnits(Array.isArray(data.units) ? data.units : []);
      } catch {
        setUnits([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, CpaUnit[]>();
    for (const unit of units) {
      const arr = map.get(unit.section) ?? [];
      arr.push(unit);
      map.set(unit.section, arr);
    }
    return SECTION_ORDER.filter((section) => map.has(section)).map((section) => ({
      section,
      units: (map.get(section) ?? []).sort((a, b) => a.unit - b.unit),
    }));
  }, [units]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        <p className="text-muted-foreground">Loading CPA lessons...</p>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="mx-auto max-w-5xl">
        <GlassCard className="p-8">
          <EmptyState
            icon={GraduationCap}
            title="CPA lessons not built yet"
            description="Run npm run build:cpa-curriculum to assemble the CPA units."
          />
        </GlassCard>
      </div>
    );
  }

  const totalWeeks = units.reduce((n, u) => n + u.weeks.length, 0);
  const totalQuestions = units.reduce(
    (n, u) => n + u.weeks.reduce((m, w) => m + (w.quiz?.questions?.length ?? 0), 0),
    0
  );
  const totalCards = units.reduce(
    (n, u) => n + u.weeks.reduce((m, w) => m + (w.flashcards?.length ?? 0), 0),
    0
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <GraduationCap className="h-7 w-7 text-primary" />
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            CPA Lessons — Core + Disciplines
          </h1>
        </div>
        <p className="text-muted-foreground">
          Full CPA Evolution coverage across FAR, AUD, REG, BAR, ISC, and TCP.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Units" value={String(units.length)} />
        <StatTile label="Lessons" value={String(totalWeeks)} />
        <StatTile label="Lesson questions" value={String(totalQuestions)} />
        <StatTile label="Flashcards" value={String(totalCards)} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/crossover">
            <ListChecks className="mr-2 h-4 w-4" />
            CPA Practice
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sims">Task-Based Simulations</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/mission">Back to Mission Control</Link>
        </Button>
      </div>

      {/* Quick practice — endless MCQs, pick a section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-semibold text-foreground">Quick practice:</span>
          {grouped.map(({ section }) => {
            const on = section === practiceSection;
            return (
              <button
                key={section}
                onClick={() => setPracticeSection(section as CpaSection)}
                className={on ? "rounded-xl px-3 py-1.5 text-xs font-semibold" : "glass glass-hover rounded-xl px-3 py-1.5 text-xs font-medium text-text-muted"}
                style={on ? { background: "hsl(var(--primary) / 0.13)", color: "hsl(var(--primary))" } : { borderRadius: 11 }}
              >
                {section}
              </button>
            );
          })}
        </div>
        <PracticeBlock
          key={practiceSection}
          mode="mcq"
          section={practiceSection}
          heading={`Work ${practiceSection} problems`}
          subheading="Endless exam-style MCQs — answer, read the rationale, keep going."
        />
      </div>

      <div className="space-y-6">
        {grouped.map(({ section, units: sectionUnits }, sectionIndex) => {
          const sectionWeeks = sectionUnits.flatMap((u) =>
            u.weeks.map((w) => ({ unit: u, week: w }))
          );
          const sectionCompleted = sectionWeeks.filter(({ unit, week }) =>
            completed.includes(`${unit.id}:${week.id}`)
          ).length;
          const accentVar = `--unit-${(sectionIndex % 3) + 1}`;

          return (
            <UnitCard
              key={section}
              code={section}
              title={`${section} lessons`}
              accentVar={accentVar}
              done={sectionCompleted}
              total={sectionWeeks.length}
            >
              {sectionUnits.map((unit) => (
                <div key={unit.id}>
                  <div
                    className="px-5 py-3 text-sm font-medium text-text-light sm:px-6"
                    style={{ background: "hsl(var(--foreground) / 0.03)" }}
                  >
                    {unit.title}
                  </div>
                  {unit.weeks.map((week) => {
                    const done = completed.includes(`${unit.id}:${week.id}`);
                    return (
                      <LessonRow
                        key={week.id}
                        href={`/cpa/${unit.id}/${week.id}`}
                        title={week.title}
                        q={week.quiz?.questions?.length ?? 0}
                        cards={week.flashcards?.length ?? 0}
                        status={done ? "done" : "todo"}
                        accentVar={accentVar}
                      />
                    );
                  })}
                </div>
              ))}
            </UnitCard>
          );
        })}
      </div>

      <div>
        <Button asChild variant="outline">
          <Link href="/tracks">
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            All tracks
          </Link>
        </Button>
      </div>
    </div>
  );
}
