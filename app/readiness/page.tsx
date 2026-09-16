"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TitleBlock } from "@/components/sheet/TitleBlock";
import { StateGlyph, type GlyphState } from "@/components/sheet/StateGlyph";
import { ActionBar } from "@/components/sheet/ActionBar";
import { useAttempts, useSrs } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { skillStatsFromAttempts, srStrengthFromSrsItems } from "@/lib/attemptStats";
import { computeExamReadiness, STATUS_LABEL, type ReadinessStatus } from "@/lib/examReadiness";
import { useReadinessHistory, baselineSnapshot, examDelta } from "@/lib/readinessHistory";
import { Sparkline } from "@/components/Sparkline";
import { dayNumber } from "@/lib/spacedRepetition";
import type { SkillMap } from "@/lib/skillMap";
import type { ExamKind } from "@/lib/examSections";

// Readiness is a 4-tier trajectory (not-ready -> building -> on-track ->
// exam-ready), not a right/wrong result, so it doesn't map onto StateGlyph's
// fixed good/warn/bad/ref meanings one-for-one — on-track borrows "warn"
// (still short of target, same as a trap-at-risk state) rather than reusing
// the page's accent color the way a shadcn Badge would by default.
const STATUS_GLYPH: Record<ReadinessStatus, GlyphState> = {
  "not-ready": "bad",
  building: "warn",
  "on-track": "warn",
  "exam-ready": "good",
};

const EXAM_ORDER: ExamKind[] = ["Finance", "CMA", "CPA"];

const TARGET = 75;

function prettySkill(skill: string): string {
  return skill.replace(/-/g, " ");
}

export default function ReadinessPage() {
  const hydrated = useHydratedStore();
  const eventsRaw = useAttempts((s) => s.events);
  const srsItems = useSrs((s) => s.items);
  const [nowDay] = useState(() => dayNumber(Date.now()));
  const [skillMap, setSkillMap] = useState<SkillMap>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/skills/map")
      .then((res) => (res.ok ? res.json() : {}))
      .then((map: SkillMap) => {
        if (!cancelled && map) setSkillMap(map);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const report = useMemo(() => {
    if (!hydrated) return null;
    const srStrengthBySkill = srStrengthFromSrsItems(Object.values(srsItems));
    const stats = skillStatsFromAttempts(eventsRaw, { srStrengthBySkill });
    return computeExamReadiness(stats, nowDay, { target: TARGET });
  }, [hydrated, eventsRaw, srsItems, nowDay]);

  // Progress-over-time: snapshot today's readiness (deduped per day) and compare
  // the current value against last week's baseline for the trend deltas.
  const snapshots = useReadinessHistory((s) => s.snapshots);
  const recordSnapshot = useReadinessHistory((s) => s.record);
  const currentByExam = useMemo(
    () => (report ? Object.fromEntries(report.byExam.map((e) => [e.exam, e.readiness])) : {}),
    [report]
  );

  useEffect(() => {
    if (!report) return;
    const anyEvidence = report.sections.some((s) => s.testedSkills > 0);
    if (!anyEvidence) return; // don't seed a flat 0% history before any practice
    recordSnapshot({
      day: nowDay,
      byExam: currentByExam,
      bySection: Object.fromEntries(report.sections.map((s) => [s.id, s.readiness])),
    });
  }, [report, currentByExam, nowDay, recordSnapshot]);

  const baseline = useMemo(() => baselineSnapshot(snapshots, nowDay), [snapshots, nowDay]);

  if (!hydrated || !report) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <p className="py-12 text-muted-foreground">Computing your readiness…</p>
      </div>
    );
  }

  const anyEvidence = report.sections.some((s) => s.testedSkills > 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <TitleBlock
        eyebrow={`Target ${TARGET}%`}
        title="Readiness Report"
        subtitle={`Section-level exam readiness from every signal the app collects — quiz and practice accuracy, timed simulations, confidence calibration, recency, and spaced-repetition retention. The section percentage is coverage readiness: untested skills count against it, so it reflects real progress through the section, not a vanity score. Each section also shows mastery of practiced skills — how well you know what you have already studied, ignoring coverage.`}
      />

      {!anyEvidence && (
        <div
          className="flex flex-col gap-3 p-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between"
          style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
        >
          <span>
            No practice recorded yet. The fastest way to populate this report is the placement
            diagnostic — a short cross-section pass that seeds every section from real evidence.
          </span>
          <ActionBar primary={{ label: "Take the placement diagnostic", href: "/diagnostic" }} />
        </div>
      )}

      {/* Per-exam summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        {EXAM_ORDER.map((exam) => {
          const e = report.byExam.find((x) => x.exam === exam)!;
          const delta = examDelta(currentByExam, baseline, exam);
          const series = snapshots.map((s) => s.byExam[exam] ?? 0);
          return (
            <div
              key={exam}
              className="p-5"
              style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
            >
              <div className="flex items-center justify-between">
                <span className="blueprint-label">{exam}</span>
                {delta !== null && delta !== 0 && (
                  <span
                    className="text-xs"
                    style={{ color: delta > 0 ? "hsl(var(--good))" : "hsl(var(--bad))" }}
                  >
                    {delta > 0 ? "▲" : "▼"} {Math.abs(delta)} this wk
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-end justify-between gap-2">
                <span className="ledger-number text-3xl font-semibold">
                  {Math.round(e.readiness)}%
                </span>
                {series.length >= 2 && <Sparkline values={series} className="mb-1 opacity-80" />}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                ≈ {e.hoursToTarget} focused hrs to {TARGET}%
              </p>
            </div>
          );
        })}
      </div>

      {/* Sections grouped by exam */}
      {EXAM_ORDER.map((exam) => {
        const sections = report.sections.filter((s) => s.exam === exam);
        return (
          <div key={exam} className="space-y-3">
            <h2 className="font-display text-xl font-semibold tracking-tight">{exam}</h2>
            <div className="space-y-3">
              {sections.map((s) => (
                <div
                  key={s.id}
                  className="p-5"
                  style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{s.label}</span>
                    <div className="flex items-center gap-3">
                      <StateGlyph state={STATUS_GLYPH[s.status]} label={STATUS_LABEL[s.status]} />
                      <span className="ledger-number text-lg font-semibold">
                        {Math.round(s.readiness)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>
                      {s.testedSkills}/{s.totalSkills} skills practiced · ≈ {s.hoursToTarget} hrs to{" "}
                      {TARGET}%
                    </span>
                    {s.masteryOfTested !== null && (
                      <span title="How well you know the skills you've practiced, ignoring coverage">
                        {Math.round(s.masteryOfTested)}% mastery of practiced skills
                      </span>
                    )}
                  </div>

                  {s.weakest.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.weakest.map((w) => {
                        const href = skillMap[w.skill]?.[0]?.href;
                        const chip = (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs"
                            style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
                          >
                            {prettySkill(w.skill)}
                            {w.tested ? ` · ${Math.round(w.score)}%` : " · untested"}
                            {href && <ArrowRight className="h-3 w-3" />}
                          </span>
                        );
                        return href ? (
                          <Link key={w.skill} href={href} className="hover:opacity-80">
                            {chip}
                          </Link>
                        ) : (
                          <span key={w.skill}>{chip}</span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/mission">Mission Control</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sims">Exam Sims</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/mistakes">Mistake Bank</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/reference">Formula Reference</Link>
        </Button>
      </div>
    </div>
  );
}
