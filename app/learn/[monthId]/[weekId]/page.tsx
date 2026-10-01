"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LessonBody, type LessonSection } from "@/components/LessonBody";
import { LessonTOC } from "@/components/LessonTOC";
import { LessonNotes } from "@/components/LessonNotes";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ArrowLeft, Play } from "lucide-react";
import { useQuizResults } from "@/lib/store";
import { EmptyState } from "@/components/EmptyState";
import { PracticeBlock } from "@/components/glass/PracticeBlock";
import { Sheet, SheetRegion } from "@/components/sheet/Sheet";
import { StateGlyph } from "@/components/sheet/StateGlyph";
import { ActionBar } from "@/components/sheet/ActionBar";
import { WEEK_DIAGRAMS } from "@/lib/lessonDiagrams";
import { VarianceLineDiagram } from "@/components/diagrams/VarianceLineDiagram";
import { MetricBreakdownDiagram } from "@/components/diagrams/MetricBreakdownDiagram";

// Weeks that have an associated interactive practice tool. Keyed by `${monthId}:${weekId}`.
const WEEK_TOOLS: Record<string, { href: string; label: string; description: string }> = {
  "m4:w1": {
    href: "/tools/cost-codes",
    label: "Open the live Cost-Code → WIP simulator",
    description: "Post a job cost and watch it roll up to a WIP control account (1401–1405).",
  },
};

export default function WeekPage() {
  const params = useParams();
  const monthId = params.monthId as string;
  const weekId = params.weekId as string;

  // Loosely-typed lesson view-model (id/title/html/content/quiz/flashcards).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [week, setWeek] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<LessonSection[]>([]);

  const quizResults = useQuizResults();
  const results = quizResults.getResultsForWeek(monthId, weekId);
  const quizResult = results.length > 0 ? results[results.length - 1] : null;

  useEffect(() => {
    async function loadWeek() {
      try {
        setLoading(true);
        const weekRes = await fetch(`/api/curriculum/week/${monthId}/${weekId}`);
        const weekData = weekRes.ok ? await weekRes.json() : null;

        if (!weekData || !weekData.lessonHtml) {
          setError(`Week ${weekId} not found in month ${monthId}`);
        } else {
          setWeek({
            id: weekId,
            title: weekData.title,
            html: weekData.lessonHtml,
            content: weekData.lessonHtml,
            quiz: weekData.quiz,
            flashcards: weekData.flashcards,
          });
        }
      } catch (error) {
        console.error("Failed to load week:", error);
        setError(error instanceof Error ? error.message : "Failed to load week");
      } finally {
        setLoading(false);
      }
    }

    if (monthId && weekId) {
      loadWeek();
    }
  }, [monthId, weekId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !week) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/learn/${monthId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Month
          </Link>
        </Button>
        <EmptyState
          icon={Play}
          title="Week Not Found"
          description={error || `Week ${weekId} could not be loaded`}
        />
      </div>
    );
  }

  const quizPct = quizResult
    ? Math.round((quizResult.score / quizResult.totalQuestions) * 100)
    : null;
  const quizState =
    quizPct == null ? null : quizPct >= 70 ? "good" : quizPct >= 50 ? "warn" : "bad";
  const weekTool = WEEK_TOOLS[`${monthId}:${weekId}`];
  const diagram = WEEK_DIAGRAMS[`${monthId}:${weekId}`];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Sticky title block — stays visible through a long lesson body so the
          quiz action (this page's one accent element, rule 4.4) is always reachable. */}
      <div className="sticky top-16 z-40">
        <Sheet>
          <SheetRegion className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/learn/${monthId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to month
                </Link>
              </Button>
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-semibold tracking-tight">
                  {week.title}
                </h1>
                <p className="blueprint-label">
                  Month {monthId} · {week.id.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <BookmarkButton monthId={monthId} weekId={weekId} anchor="top" title={week.title} />
              <ActionBar
                primary={{
                  label: quizResult ? "Retake quiz" : "Start quiz",
                  href: `/learn/${monthId}/${weekId}/quiz`,
                }}
              />
            </div>
          </SheetRegion>

          {quizResult && quizState && (
            <SheetRegion className="flex items-center justify-between gap-4">
              <StateGlyph
                state={quizState}
                label={`Last attempt: ${quizResult.score}/${quizResult.totalQuestions} (${quizPct}%)`}
              />
              <Link href={`/learn/${monthId}/${weekId}/quiz`} className="blueprint-label underline">
                Review quiz
              </Link>
            </SheetRegion>
          )}
        </Sheet>
      </div>

      {/* Week diagram — real numbers from a seeded generator, not stock art */}
      {diagram && (
        <div className="p-5" style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}>
          {diagram.kind === "variance-line" && <VarianceLineDiagram {...diagram.props} />}
          {diagram.kind === "metric-breakdown" && <MetricBreakdownDiagram {...diagram.props} />}
        </div>
      )}

      {/* Lesson content, with an in-lesson section TOC alongside it once one exists */}
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        {sections.length > 0 && (
          <div className="hidden lg:block">
            <LessonTOC sections={sections} />
          </div>
        )}
        <div className="min-w-0 space-y-6">
          <LessonBody
            html={week.html}
            monthId={monthId}
            weekId={weekId}
            onOutlineReady={setSections}
          />

          <div className="p-5" style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}>
            <LessonNotes monthId={monthId} weekId={weekId} />
          </div>
        </div>
      </div>

      {/* Interactive practice tool (e.g. m4-w1 → cost-code simulator) — a
          secondary action, since the quiz CTA above already holds this
          page's one primary. */}
      {weekTool && (
        <div className="p-5" style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground">{weekTool.label}</h3>
              <p className="text-sm text-muted-foreground">{weekTool.description}</p>
            </div>
            <ActionBar secondary={[{ label: "Launch", href: weekTool.href }]} />
          </div>
        </div>
      )}

      {/* Work problems — numeric drills to build fluency */}
      <PracticeBlock
        mode="parametric"
        heading="Work problems"
        subheading="Numeric drills to build fluency — new numbers every time. Reps beat re-reading."
      />

      {/* Navigation */}
      <div
        className="flex items-center justify-between p-5"
        style={{ border: "1px solid hsl(var(--border))", borderRadius: 2 }}
      >
        <Button asChild variant="outline">
          <Link href={`/learn/${monthId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to month
          </Link>
        </Button>
        {/* Previous/next week navigation isn't built yet — left as before rather than invented. */}
      </div>
    </div>
  );
}
