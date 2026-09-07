"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SrsReviewCard } from "@/components/SrsReviewCard";
import { Sheet, SheetRegion } from "@/components/sheet/Sheet";
import { TitleBlock } from "@/components/sheet/TitleBlock";
import { LedgerTable, type LedgerColumn, type LedgerRow } from "@/components/sheet/LedgerTable";
import { StateGlyph } from "@/components/sheet/StateGlyph";
import { ActionBar } from "@/components/sheet/ActionBar";
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

// No decorative icons per rule 4.4/§3 — hierarchy comes from ref numbers,
// caps eyebrows, and hairlines, not from Lucide glyphs standing in for them.
const laneMeta: Record<SessionItem["lane"], { label: string; href: string; description: string }> =
  {
    cma: {
      label: "CMA / Controller",
      href: "/learn",
      description: "Cost, WIP, controls, budgeting, performance, and analytics.",
    },
    cpa: {
      label: "CPA",
      href: "/cpa",
      description: "FAR, AUD, REG, BAR, ISC, and TCP exam depth.",
    },
    finance: {
      label: "Finance",
      href: "/finance",
      description:
        "Corporate-finance prep: TVM, bonds, CAPM, WACC, capital budgeting, and pro formas.",
    },
    cfo: {
      label: "Apply Lab",
      href: "/apply",
      description: "Fictional controller/CFO workflows and lender-ready workpapers.",
    },
    review: {
      label: "Review",
      href: "/profile",
      description: "Missed items, flashcards, and weak-topic review.",
    },
  };

/** Small bordered readout, matching the canvas's exam-window box — not a
 * GlassCard, a sheet fragment: hairlines only, no radius, no shadow. */
function ExamWindowReadout({
  examDate,
  examWindow,
}: {
  examDate: string;
  examWindow: {
    days: number;
    weeks: number;
    remainderDays: number;
    sessions: number;
    sessionsPerWeek: number;
  };
}) {
  return (
    <div
      className="flex shrink-0 flex-col gap-3 p-4"
      style={{ borderLeft: "1px solid hsl(var(--border))", minWidth: 220 }}
    >
      <div>
        <div className="blueprint-label">Exam window</div>
        <div
          style={{
            fontFamily: "var(--font-source-serif), Georgia, serif",
            fontSize: 17,
            fontWeight: 600,
          }}
        >
          {new Date(examDate + "T00:00:00").toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
      <div className="h-px" style={{ background: "hsl(var(--border))" }} />
      <div>
        <div className="blueprint-label">Time to planning date {examDate}</div>
        <div className="ledger-number text-3xl font-semibold">
          {examWindow.days}
          <span
            className="ml-1.5 text-sm font-normal"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            days
          </span>
        </div>
        <p className="mt-1 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          {examWindow.weeks} weeks {examWindow.remainderDays} days · {examWindow.sessions} sessions
          at {examWindow.sessionsPerWeek}/wk
        </p>
      </div>
    </div>
  );
}

const LOOP_COLUMNS: LedgerColumn[] = [
  { key: "ref", label: "Ref", width: "40px" },
  { key: "lane", label: "Lane / Assigned item" },
  { key: "min", label: "Min", numeric: true, width: "60px" },
  { key: "pct", label: "% Day", numeric: true, unit: "%", width: "64px" },
  { key: "action", label: "", width: "80px" },
];

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

  // Presentation-only from here down — planDay/buildSessions/readiness math
  // is untouched from the pre-redesign version.
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
      <div className="mx-auto max-w-6xl">
        <div className="py-12 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
          Loading Mission Control...
        </div>
      </div>
    );
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const loopRows: LedgerRow[] = sessions.map((session, idx) => {
    const meta = laneMeta[session.lane];
    const pct = plan.totalMinutes > 0 ? Math.round((session.minutes / plan.totalMinutes) * 100) : 0;
    return {
      id: session.lane,
      cells: {
        ref: String(idx + 1).padStart(2, "0"),
        lane: (
          <div>
            <div className="font-semibold">{meta.label}</div>
            <div className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
              {session.label ?? meta.description}
            </div>
          </div>
        ),
        min: session.minutes,
        pct,
        action: (
          <Link
            href={meta.href}
            className="blueprint-label"
            style={{
              border: "1px solid hsl(var(--foreground))",
              borderRadius: 2,
              padding: "4px 10px",
            }}
          >
            Open
          </Link>
        ),
      },
    };
  });
  loopRows.push({
    id: "total",
    kind: "total",
    cells: {
      ref: "",
      lane: "Total — ties to budget",
      min: totalMinutes,
      pct: plan.totalMinutes > 0 ? Math.round((totalMinutes / plan.totalMinutes) * 100) : 0,
      action: "",
    },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <Sheet
        number="01"
        title="Mission Control"
        annotation={hydrated ? `${examWindow?.days ?? "—"} DAYS TO PLANNING DATE` : undefined}
      >
        <SheetRegion padded={false}>
          <div className="flex flex-col md:flex-row md:items-stretch">
            <div className="flex-1">
              <TitleBlock
                eyebrow="Finance + CMA + CPA + CFO execution"
                title="Mission Control"
                subtitle="A daily study plan that prescribes the mix instead of asking you to choose. Default weighting is 45% CMA/controller, 30% CPA, 20% finance, and 5% applied CFO workflow practice."
              />
            </div>
            {examWindow && <ExamWindowReadout examDate={examDate} examWindow={examWindow} />}
          </div>
        </SheetRegion>

        <SheetRegion>
          <div className="blueprint-label mb-2.5">Today&apos;s budget</div>
          <div
            className="flex gap-0"
            style={{ border: "1px solid hsl(var(--border))", width: "fit-content" }}
          >
            {[45, 60, 75, 90].map((option, i) => (
              <button
                key={option}
                type="button"
                onClick={() => setMinutes(option)}
                className="ledger-number px-5 py-2 text-sm font-semibold"
                style={{
                  borderLeft: i > 0 ? "1px solid hsl(var(--border))" : undefined,
                  background: minutes === option ? "hsl(var(--foreground))" : "transparent",
                  color: minutes === option ? "hsl(var(--card))" : "hsl(var(--foreground))",
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Largest-remainder apportionment — the blocks and the review slice always tie to the
            budget exactly.
          </p>
        </SheetRegion>

        {!intake && (
          <SheetRegion className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold">Need a baseline?</div>
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                Take the cross-track placement diagnostic to seed Finance, CMA, CPA, SRS, and the
                weekly plan.
              </p>
            </div>
            <ActionBar primary={{ label: "Run diagnostic", href: "/diagnostic" }} />
          </SheetRegion>
        )}

        {intake && (
          <SheetRegion>
            <div className="blueprint-label mb-3">Weekly operating plan</div>
            <div
              className="grid gap-px md:grid-cols-7"
              style={{ background: "hsl(var(--border))" }}
            >
              {weeklyPlan.days.map((day, idx) => {
                const isToday = idx === (new Date().getDay() + 6) % 7;
                const showDue = day.day === "Sun" && dueCount > 0;
                return (
                  <Link
                    key={day.day}
                    href={day.href}
                    className="p-3"
                    style={{
                      background: "hsl(var(--card))",
                      borderLeft: isToday ? "3px solid hsl(var(--foreground))" : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="blueprint-label">{day.day}</span>
                      {isToday && <span className="blueprint-label">Today</span>}
                    </div>
                    <div className="mt-1 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {day.focus}
                      {showDue ? ` · ${dueCount} due` : ""}
                    </div>
                  </Link>
                );
              })}
            </div>
          </SheetRegion>
        )}

        <SheetRegion padded={false}>
          <div className="grid lg:grid-cols-[2fr_1fr]">
            <div className="p-5">
              <div className="blueprint-label mb-1">Today&apos;s prescribed loop</div>
              <p className="mb-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                Learn → drill → apply → explain mistake → schedule review. Cards and MCQ are
                warm-up, not the whole product.
              </p>
              <LedgerTable columns={LOOP_COLUMNS} rows={loopRows} />
            </div>

            <div
              className="p-5 lg:border-l"
              style={{
                borderTop: "1px solid hsl(var(--border))",
                borderLeftColor: "hsl(var(--border))",
              }}
            >
              <>
                <div className="blueprint-label mb-1">Readiness signal</div>
                <p className="mb-3 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Per-skill evidence from the attempt ledger — every quiz question and Apply Lab
                  task you answer.
                </p>
                {events.length === 0 ? (
                  <div>
                    <div className="ledger-number text-3xl font-semibold">Untested</div>
                    <p className="my-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                      No recorded attempts. Take a lesson quiz — CMA, CPA, or Finance — or grade an
                      Apply Lab workflow and per-skill readiness builds automatically.
                    </p>
                    <div className="mt-3">
                      {["—", "—", "—"].map((dash, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 text-sm"
                          style={{
                            borderTop: "1px dashed hsl(var(--border))",
                            color: "hsl(var(--muted-foreground))",
                          }}
                        >
                          <span>Weakest skill {i + 1}</span>
                          <span className="ledger-number">{dash}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild size="sm" className="mt-3">
                      <Link href="/learn">Start a quiz</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1.5">
                      <span className="ledger-number text-3xl font-semibold">
                        {readiness.overall}
                      </span>
                      <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                        %
                      </span>
                    </div>
                    <p
                      className="mb-2 mt-1 text-sm"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      Weighted across {readiness.bySkill.length} skill
                      {readiness.bySkill.length === 1 ? "" : "s"} · based on {events.length}{" "}
                      recorded attempt{events.length === 1 ? "" : "s"}.
                    </p>
                    <Link href="/readiness" className="blueprint-label mb-3 inline-block">
                      See section-by-section readiness →
                    </Link>
                    <div>
                      {readiness.weakest.map((skill) => {
                        const studyHref = skillMap[skill.skill]?.[0]?.href;
                        return (
                          <div
                            key={skill.skill}
                            className="flex items-center justify-between gap-2 py-2 text-sm"
                            style={{ borderTop: "1px solid hsl(var(--border))" }}
                          >
                            <span className="truncate">{skill.skill}</span>
                            <span className="flex shrink-0 items-center gap-2">
                              {skill.tested ? (
                                <StateGlyph
                                  state={skill.score >= 70 ? "good" : "warn"}
                                  label={`${skill.score}%`}
                                />
                              ) : (
                                <span
                                  className="ledger-number"
                                  style={{ color: "hsl(var(--muted-foreground))" }}
                                >
                                  untested
                                </span>
                              )}
                              {studyHref && (
                                <Link href={studyHref} className="blueprint-label">
                                  Study
                                </Link>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            </div>
          </div>
        </SheetRegion>

        <SheetRegion>
          <SrsReviewCard />
        </SheetRegion>

        <SheetRegion className="flex justify-end">
          <Link href="/mistakes" className="blueprint-label">
            Open Mistake Bank — every miss, why, and where to fix it →
          </Link>
        </SheetRegion>

        <SheetRegion padded={false}>
          <div className="blueprint-label px-5 pt-4">Operating rule</div>
          <p className="px-5 pb-1 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            Use this screen as the default start page when time is limited.
          </p>
          <div className="grid md:grid-cols-3">
            {[
              {
                n: "1",
                label: "Do the block",
                body: "Start with the assigned track. Do not browse for what feels easiest.",
              },
              {
                n: "2",
                label: "Explain misses",
                body: "For every miss, write the rule, the trap, and the corrected method.",
              },
              {
                n: "3",
                label: "Apply it",
                body: "End with a fictional workpaper or workflow whenever the topic touches controller work.",
              },
            ].map((rule, i) => (
              <div
                key={rule.n}
                className="p-5"
                style={{
                  borderTop: "1px solid hsl(var(--border))",
                  borderLeft: i > 0 ? "1px solid hsl(var(--border))" : undefined,
                }}
              >
                <div
                  className="ledger-number mb-1 text-xs"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {rule.n}
                </div>
                <div className="font-semibold">{rule.label}</div>
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {rule.body}
                </p>
              </div>
            ))}
          </div>
        </SheetRegion>
      </Sheet>
    </div>
  );
}
