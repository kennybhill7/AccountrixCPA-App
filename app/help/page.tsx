import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Help & How-To — Accountrix",
  description: "How to use Accountrix: diagnostic, Mission Control, exam sims, readiness, and backups.",
};

const SECTIONS: Array<{ q: string; a: string; href?: string; hrefLabel?: string }> = [
  {
    q: "Where do I start?",
    a: "Take the placement diagnostic — a short cross-section pass that seeds your Readiness Report from real evidence instead of zero. Then open Mission Control for a prescribed daily plan.",
    href: "/diagnostic",
    hrefLabel: "Start the diagnostic",
  },
  {
    q: "What is Mission Control?",
    a: "Your daily study cockpit. It prescribes a cross-track mix (CMA, CPA, Finance, applied work) and a weekly operating plan tuned to your goals, and highlights your weakest skills with links straight to the right lesson.",
    href: "/mission",
    hrefLabel: "Open Mission Control",
  },
  {
    q: "How does practice work?",
    a: "CPA Practice serves exam-style MCQs across all six sections with instant feedback or a timed set. Exam Sims add CPA task-based simulations and CMA essays — graded on exact journal-entry lines, tolerance-checked calculations, and a rubric for written answers.",
    href: "/sims",
    hrefLabel: "Open Exam Sims",
  },
  {
    q: "What is the Readiness Report?",
    a: "A section-by-section readiness percentage built from everything you do — quiz and practice accuracy, timed simulations, confidence, recency, and spaced-repetition retention. Untested skills count against a section, so it reflects real coverage, and each section also shows your mastery of the skills you have practiced.",
    href: "/readiness",
    hrefLabel: "Open Readiness",
  },
  {
    q: "What happens when I get something wrong?",
    a: "Every miss lands in the Mistake Bank with why it happened and a route back to the source, and it seeds a spaced-repetition review so weak material comes back on schedule.",
    href: "/mistakes",
    hrefLabel: "Open Mistake Bank",
  },
  {
    q: "How do notes work?",
    a: "Use the floating Notes button anywhere, or the notes box under any lesson. Tag inline with #hashtags, then turn any note into a flashcard (it joins your review queue) or send it to the AI tutor.",
    href: "/notes",
    hrefLabel: "Open Notes",
  },
  {
    q: "Will I lose my progress?",
    a: "Your progress is stored locally in this browser. Before switching machines or clearing browser data, export a backup from the State page, and import it on the other device. Everything — progress, attempts, SRS queue, notes — is included.",
    href: "/state",
    hrefLabel: "Backup / Restore",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <HelpCircle className="h-7 w-7 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display tracking-tight">
            Help &amp; How-To
          </h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          A quick guide to getting the most out of Accountrix. Questions not covered here? Reach out
          at{" "}
          <a className="text-primary underline" href="mailto:support@accountrix.app">
            support@accountrix.app
          </a>
          .
        </p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <GlassCard key={s.q} className="p-5 space-y-3">
            <h2 className="text-base font-semibold text-foreground font-display tracking-tight">
              {s.q}
            </h2>
            <p className="text-sm text-muted-foreground">{s.a}</p>
            {s.href && (
              <Button asChild variant="outline" size="sm">
                <Link href={s.href}>{s.hrefLabel}</Link>
              </Button>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
