"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Gauge, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAttempts, useSrs } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";
import { skillStatsFromAttempts, srStrengthFromSrsItems } from "@/lib/attemptStats";
import { computeExamReadiness, STATUS_LABEL, type ReadinessStatus } from "@/lib/examReadiness";
import { useReadinessHistory, baselineSnapshot, examDelta } from "@/lib/readinessHistory";
import { dayNumber } from "@/lib/spacedRepetition";
import type { SkillMap } from "@/lib/skillMap";
import type { ExamKind } from "@/lib/examSections";

const STATUS_STYLE: Record<ReadinessStatus, string> = {
  "not-ready": "bg-red-500/15 text-red-600",
  building: "bg-amber-500/15 text-amber-600",
  "on-track": "bg-blue-500/15 text-blue-600",
  "exam-ready": "bg-green-500/15 text-green-600",
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
      <div className="container mx-auto px-4 py-12">
        <p className="text-muted-foreground">Computing your readiness…</p>
      </div>
    );
  }

  const anyEvidence = report.sections.some((s) => s.testedSkills > 0);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-2 flex items-center gap-3">
        <Gauge className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Readiness Report</h1>
      </div>
      <p className="mb-6 text-muted-foreground">
        Section-level exam readiness from every signal the app collects — quiz and practice
        accuracy, timed simulations, confidence calibration, recency, and spaced-repetition
        retention. Target is {TARGET}%. The section percentage is <strong>coverage readiness</strong>:
        untested skills count against it, so it reflects real progress through the section, not a
        vanity score. Each section also shows <strong>mastery of practiced skills</strong> — how
        well you know what you have already studied, ignoring coverage.
      </p>

      {!anyEvidence && (
        <Card className="mb-6">
          <CardContent className="flex flex-col gap-3 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <span>
              No practice recorded yet. The fastest way to populate this report is the placement
              diagnostic — a short cross-section pass that seeds every section from real evidence.
            </span>
            <Button asChild className="shrink-0">
              <Link href="/diagnostic">Take the placement diagnostic</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Per-exam summary */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {EXAM_ORDER.map((exam) => {
          const e = report.byExam.find((x) => x.exam === exam)!;
          const delta = examDelta(currentByExam, baseline, exam);
          return (
            <Card key={exam}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center justify-between">
                  {exam}
                  {delta !== null && delta !== 0 && (
                    <span className={delta > 0 ? "text-green-600" : "text-red-600"}>
                      {delta > 0 ? "▲" : "▼"} {Math.abs(delta)} this wk
                    </span>
                  )}
                </CardDescription>
                <CardTitle className="text-3xl">{Math.round(e.readiness)}%</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-muted-foreground">
                ≈ {e.hoursToTarget} focused hrs to {TARGET}%
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sections grouped by exam */}
      {EXAM_ORDER.map((exam) => {
        const sections = report.sections.filter((s) => s.exam === exam);
        return (
          <div key={exam} className="mb-8">
            <h2 className="mb-3 text-xl font-semibold">{exam}</h2>
            <div className="space-y-3">
              {sections.map((s) => (
                <Card key={s.id}>
                  <CardContent className="pt-6">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{s.label}</span>
                      <div className="flex items-center gap-2">
                        <Badge className={STATUS_STYLE[s.status]}>{STATUS_LABEL[s.status]}</Badge>
                        <span className="font-mono text-lg font-semibold">
                          {Math.round(s.readiness)}%
                        </span>
                      </div>
                    </div>
                    <Progress value={s.readiness} className="h-2" />
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
                            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
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
                  </CardContent>
                </Card>
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
      </div>
    </div>
  );
}
