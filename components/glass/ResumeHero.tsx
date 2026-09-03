import Link from "next/link";
import { Play } from "lucide-react";

interface ResumeHeroProps {
  title: string;
  /** small line under the title, e.g. "Finance Unit 1 · Week 4 · 6 questions · 7 cards · ~11 min left" */
  meta: string;
  /** 0–100 */
  progress: number;
  href: string;
  nextUp?: string;
  eyebrow?: string;
  cta?: string;
}

/** Purpose-driven resume panel: a ruled work surface with one clear action. */
export function ResumeHero({
  title,
  meta,
  progress,
  href,
  nextUp,
  eyebrow = "Continue where you left off",
  cta = "Resume lesson",
}: ResumeHeroProps) {
  const pct = Math.min(Math.max(progress, 0), 100);
  return (
    <div
      className="relative overflow-hidden border border-border bg-card p-6 sm:p-7"
      style={{
        borderRadius: 2,
        backgroundImage: "linear-gradient(hsl(var(--border) / 0.18) 1px, transparent 1px)",
        backgroundSize: "100% 2.25rem",
      }}
    >
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="blueprint-label">{eyebrow}</div>
          <h2 className="font-display mt-1.5 text-2xl font-bold text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{meta}</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 w-full max-w-sm overflow-hidden rounded-sm bg-muted">
              <div className="h-full rounded-sm bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <span className="ledger-number text-sm font-semibold text-foreground">{pct}%</span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <Link
            href={href}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary-hover"
          >
            <Play className="h-4 w-4 fill-current" />
            {cta}
          </Link>
          {nextUp && (
            <span className="max-w-[240px] text-right text-xs text-muted-foreground">
              Next up · {nextUp}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
