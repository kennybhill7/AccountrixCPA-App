"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  BookOpen,
  Calculator,
  ClipboardCheck,
  Compass,
  GraduationCap,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SrsReviewCard } from "@/components/SrsReviewCard";
import { GlassCard } from "@/components/glass/GlassCard";
import { useHydratedStore } from "@/lib/hooks";
import { useAttempts, useSrs, useExamTarget } from "@/lib/store";
import {
  buildSessions,
  buildWeeklyOperatingPlan,
  planDay,
  type SessionItem,
} from "@/lib/missionControl";
import { pickNext, reviewLabel, type PickNextContext } from "@/lib/missionPick";
import { skillStatsFromAttempts } from "@/lib/attemptStats";
import { computeReadiness } from "@/lib/readiness";
import { dayNumber, isDue } from "@/lib/spacedRepetition";
import type { SkillMap } from "@/lib/skillMap";
import type { AttemptTrack } from "@/lib/types";

const TRACKS: AttemptTrack[] = ["cma", "cpa", "finance", "apply"];

interface MissionIntake {
  role?: string;
  goals?: string[];
  timeline?: string;
  hoursPerWeek?: number;
  financeTargetGrade?: string;
  financeClassStart?: string;
  financeCurrentAverage?: number;
  notes?: string;
}

const laneMeta: Record<
  SessionItem["lane"],
  {
    label: string;
    href: string;
    icon: typeof BookOpen;
    description: string;
  }
> = {
  cma: {
    label: "CMA / Controller",
    href: "/learn",
    icon: BookOpen,
    description: "Cost, WIP, controls, budgeting, performance, and analytics.",
  },
  cpa: {
    label: "CPA",
    href: "/cpa",
    icon: GraduationCap,
    description: "FAR, AUD, REG, BAR, ISC, and TCP exam depth.",
  },
  finance: {
    label: "Finance",
    href: "/finance",
    icon: Calculator,
    description:
      "Corporate-finance prep: TVM, bonds, CAPM, WACC, capital budgeting, and pro formas.",
  },
  cfo: {
    label: "Apply Lab",
    href: "/apply",
    icon: ClipboardCheck,
    description: "Fictional controller/CFO workflows and lender-ready workpapers.",
  },
  review: {
    label: "Review",
    href: "/profile",
    icon: Target,
    description: "Missed items, flashcards, and weak-topic review.",
  },
};

export default function MissionControlPage() {
  const hydrated = useHydratedStore();
  const [minutes, setMinutes] = useState(75);
  const [intake, setIntake] = useState<MissionIntake | null>(null);
  // Stamp "today" once per mount so plan/readiness stay stable within a visit.
  const [nowDay] = useState(() => dayNumber(Date.now()));

  const eventsRaw = useAttempts((s) => s.events);
  const srsItems = useSrs((s) => s.items);
  // Memoized so the empty-array fallback is a stable reference and doesn't
  // re-fire the readiness useMemos on every render.
  const events = useMemo(() => (hydrated ? eventsRaw : []), [hydrated, eventsRaw]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const raw = localStorage.getItem("ai-intake");
      setIntake(raw ? JSON.parse(raw) : null);
    } catch {
      setIntake(null);
    }
  }, [hydrated]);

  // Skill → lesson map for "Study this" links; fallback is simply no link.
  const [skillMap, setSkillMap] = useState<SkillMap>({});
  useEffect(() => {
    let cancelled = false;
    fetch("/api/skills/map")
      .then((res) => (res.ok ? res.json() : {}))
      .then((map: SkillMap) => {
        if (!cancelled && map) setSkillMap(map);
      })
      .catch(() => {
        // Map is a nice-to-have; readiness renders without links.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const dueCount = useMemo(
    () => (hydrated ? Object.values(srsItems).filter((i) => isDue(i, nowDay)).length : 0),
    [srsItems, hydrated, nowDay]
  );

  // Per-skill readiness straight from the attempt ledger (weight 1 per skill).
  const readiness = useMemo(() => {
    const stats = skillStatsFromAttempts(events);
    return computeReadiness(stats, {}, nowDay, { weakestCount: 5 });
  }, [events, nowDay]);

  // Weakest tested skill per track, with a study link when the map resolves it.
  const weakestByTrack = useMemo(() => {
    const out: PickNextContext["weakestByTrack"] = {};
    for (const track of TRACKS) {
      const trackEvents = events.filter((e) => e.track === track);
      if (trackEvents.length === 0) continue;
      const trackReadiness = computeReadiness(skillStatsFromAttempts(trackEvents), {}, nowDay, {
        weakestCount: 1,
      });
      const weakest = trackReadiness.weakest[0];
      if (!weakest) continue;
      const refs = skillMap[weakest.skill] ?? [];
      const href = (refs.find((r) => r.track === track) ?? refs[0])?.href;
      out[track] = { skill: weakest.skill, href };
    }
    return out;
  }, [events, skillMap, nowDay]);

  const examDate = useExamTarget((s) => s.examDate);
  const examWindow = useMemo(() => {
    if (!examDate) return null;
    const target = new Date(examDate + "T00:00:00");
    const msPerDay = 86_400_000;
    const days = Math.max(0, Math.round((target.getTime() - Date.now()) / msPerDay));
    const weeks = Math.floor(days / 7);
    const remainderDays = days % 7;
    const sessionsPerWeek = 4;
    const sessions = weeks * sessionsPerWeek + Math.round((remainderDays / 7) * sessionsPerWeek);
    return { days, weeks, remainderDays, sessions, sessionsPerWeek };
  }, [examDate]);

  const plan = useMemo(() => planDay(minutes), [minutes]);
  const sessions = useMemo(() => {
    const ctx: PickNextContext = { weakestByTrack, dueCount };
    return buildSessions(plan, (lane) => pickNext(lane, ctx)).map((session) =>
      session.lane === "review" ? { ...session, label: reviewLabel(dueCount) } : session
    );
  }, [plan, weakestByTrack, dueCount]);

  const weeklyPlan = useMemo(() => {
    return buildWeeklyOperatingPlan({
      hoursPerWeek: intake?.hoursPerWeek,
      goals: intake?.goals,
      dueCount,
      weakestByLane: {
        cma: weakestByTrack.cma?.skill,
        cpa: weakestByTrack.cpa?.skill,
        finance: weakestByTrack.finance?.skill,
        cfo: weakestByTrack.apply?.skill,
      },
    });
  }, [intake, dueCount, weakestByTrack]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="py-12 text-center text-muted-foreground">Loading Mission Control...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div>
          <Badge variant="secondary" className="mb-4">
            Finance + CMA + CPA + CFO execution
          </Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Mission Control
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            A daily study plan that prescribes the mix instead of asking you to choose. Default
            weighting is 45% CMA/controller, 30% CPA, 20% finance, and 5% applied CFO workflow
            practice.
          </p>
        </div>

        {examWindow && (
          <GlassCard className="flex flex-col gap-3 p-5">
            <div>
              <div className="blueprint-label">Exam window</div>
              <div className="font-display text-lg font-semibold tracking-tight">
                {new Date(examDate + "T00:00:00").toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="h-px" style={{ background: "hsl(var(--border))" }} />
            <div>
              <div className="blueprint-label">Time to planning date {examDate}</div>
              <div className="ledger-number font-display text-3xl font-bold tracking-tight">
                {examWindow.days}
                <span className="ml-1.5 text-sm font-normal text-muted-foreground">days</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {examWindow.weeks} weeks {examWindow.remainderDays} days · {examWindow.sessions}{" "}
                sessions at {examWindow.sessionsPerWeek}/wk
              </p>
            </div>
          </GlassCard>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[45, 60, 75, 90].map((option) => (
          <Button
            key={option}
            variant={minutes === option ? "default" : "outline"}
            onClick={() => setMinutes(option)}
          >
            {option} minutes
          </Button>
        ))}
      </div>

      <GlassCard className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Compass className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <div className="font-medium">Need a baseline?</div>
            <p className="text-sm text-muted-foreground">
              Take the cross-track placement diagnostic to seed Finance, CMA, CPA, SRS, and the
              weekly plan.
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/diagnostic">Run diagnostic</Link>
        </Button>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Weekly operating plan
          </h2>
          <p className="text-sm text-muted-foreground">
            Built from onboarding. Default is tuned for Finance class prep, CMA in 12-18 months, CPA
            after CMA, and controller/CFO execution practice.
          </p>
        </div>
        <div>
          {!intake ? (
            <div className="glass flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-medium">No onboarding plan saved yet.</div>
                <p className="text-sm text-muted-foreground">
                  Save your goals once and this card becomes your 7-day operating plan.
                </p>
              </div>
              <Button asChild>
                <Link href="/onboarding">Build my plan</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{intake.role || "Learner"}</Badge>
                <Badge variant="outline">{weeklyPlan.hours} hrs/week</Badge>
                <Badge variant="outline">{weeklyPlan.minutesPerDay} min/session target</Badge>
                {intake.financeTargetGrade && (
                  <Badge variant="outline">Finance target {intake.financeTargetGrade}</Badge>
                )}
                {intake.financeClassStart && (
                  <Badge variant="outline">Finance date {intake.financeClassStart}</Badge>
                )}
                {typeof intake.financeCurrentAverage === "number" && (
                  <Badge variant="outline">Finance avg {intake.financeCurrentAverage}%</Badge>
                )}
                {(intake.goals ?? []).slice(0, 4).map((goal) => (
                  <Badge key={goal} variant="secondary">
                    {goal}
                  </Badge>
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-7">
                {weeklyPlan.days.map((day, idx) => {
                  // days[] is Mon-first; JS getDay() is 0=Sun.
                  const isToday = idx === (new Date().getDay() + 6) % 7;
                  const showDue = day.day === "Sun" && dueCount > 0;
                  return (
                    <Link
                      key={day.day}
                      href={day.href}
                      className={`glass glass-hover p-3 transition ${
                        isToday ? "ring-1 ring-primary/50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        {day.day}
                        {isToday && <Badge variant="secondary">Today</Badge>}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {day.focus}
                        {showDue ? ` · ${dueCount} due` : ""}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <GlassCard className="p-6">
          <div className="mb-4">
            <h2 className="font-display flex items-center text-lg font-semibold tracking-tight">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Today&apos;s prescribed loop
            </h2>
            <p className="text-sm text-muted-foreground">
              Learn → drill → apply → explain mistake → schedule review. Cards and MCQ are warm-up,
              not the whole product.
            </p>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: "hsl(var(--border))" }}>
                <th className="blueprint-label w-10 py-2 text-left font-normal">Ref</th>
                <th className="blueprint-label py-2 text-left font-normal">Lane / Assigned item</th>
                <th className="blueprint-label w-16 py-2 text-right font-normal">Min</th>
                <th className="blueprint-label w-16 py-2 text-right font-normal">% Day</th>
                <th className="w-16 py-2" aria-hidden />
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, idx) => {
                const meta = laneMeta[session.lane];
                const pct =
                  plan.totalMinutes > 0
                    ? Math.round((session.minutes / plan.totalMinutes) * 100)
                    : 0;

                return (
                  <tr
                    key={session.lane}
                    className="border-b"
                    style={{ borderColor: "hsl(var(--border) / 0.6)" }}
                  >
                    <td className="ledger-number py-3 align-top text-sm text-muted-foreground">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3 align-top">
                      <div className="font-semibold">{meta.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.label ?? meta.description}
                      </div>
                    </td>
                    <td className="ledger-number py-3 text-right align-top text-sm">
                      {session.minutes}
                    </td>
                    <td className="ledger-number py-3 text-right align-top text-sm text-muted-foreground">
                      {pct}%
                    </td>
                    <td className="py-3 text-right align-top">
                      <Button asChild size="sm" variant="outline">
                        <Link href={meta.href}>Open</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr
                className="border-t-2 border-double"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <td />
                <td className="blueprint-label py-3">Total — ties to budget</td>
                <td className="ledger-number py-3 text-right text-sm font-semibold">
                  {sessions.reduce((sum, s) => sum + s.minutes, 0)}
                </td>
                <td className="ledger-number py-3 text-right text-sm font-semibold">
                  {plan.totalMinutes > 0
                    ? Math.round(
                        (sessions.reduce((sum, s) => sum + s.minutes, 0) / plan.totalMinutes) * 100
                      )
                    : 0}
                  %
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-4">
            <h2 className="font-display flex items-center text-lg font-semibold tracking-tight">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Readiness signal
            </h2>
            <p className="text-sm text-muted-foreground">
              Per-skill evidence from the attempt ledger — every quiz question and Apply Lab task
              you answer.
            </p>
          </div>
          <div>
            {events.length === 0 ? (
              <div className="space-y-3">
                <div className="font-display text-4xl font-bold">Untested</div>
                <p className="text-sm text-muted-foreground">
                  No recorded attempts yet. Take a lesson quiz — CMA, CPA, or Finance — or grade an
                  Apply Lab workflow and your per-skill readiness builds automatically.
                </p>
                <Button asChild size="sm">
                  <Link href="/learn">Start a quiz</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="font-display text-aurora-gradient text-4xl font-bold">
                  {readiness.overall}%
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Weighted across {readiness.bySkill.length} skill
                  {readiness.bySkill.length === 1 ? "" : "s"} · based on {events.length} recorded
                  attempt{events.length === 1 ? "" : "s"}.
                </p>
                <Button asChild variant="link" size="sm" className="mb-2 h-auto p-0">
                  <Link href="/readiness">See section-by-section readiness →</Link>
                </Button>
                <div className="space-y-3">
                  {readiness.weakest.map((skill) => {
                    const studyHref = skillMap[skill.skill]?.[0]?.href;
                    return (
                      <div key={skill.skill}>
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="truncate">{skill.skill}</span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="font-medium">
                              {skill.tested ? `${skill.score}%` : "untested"}
                            </span>
                            {studyHref && (
                              <Link href={studyHref} className="text-primary hover:underline">
                                Study this
                              </Link>
                            )}
                          </span>
                        </div>
                        <Progress value={skill.score} className="mt-1 h-2" />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </GlassCard>
      </div>

      <SrsReviewCard />

      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href="/mistakes">Open Mistake Bank — every miss, why, and where to fix it</Link>
        </Button>
      </div>

      <GlassCard className="p-6">
        <div className="mb-4">
          <h2 className="font-display text-lg font-semibold tracking-tight">Operating rule</h2>
          <p className="text-sm text-muted-foreground">
            Use this screen as the default start page when time is limited.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass p-4">
            <div className="font-semibold">1. Do the block</div>
            <p className="text-sm text-muted-foreground">
              Start with the assigned track. Do not browse for what feels easiest.
            </p>
          </div>
          <div className="glass p-4">
            <div className="font-semibold">2. Explain misses</div>
            <p className="text-sm text-muted-foreground">
              For every miss, write the rule, the trap, and the corrected method.
            </p>
          </div>
          <div className="glass p-4">
            <div className="font-semibold">3. Apply it</div>
            <p className="text-sm text-muted-foreground">
              End with a fictional workpaper or workflow whenever the topic touches controller work.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
