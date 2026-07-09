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

/** Purpose-driven hero: gradient panel + shimmer + progress + one-tap resume. */
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
      className="relative overflow-hidden p-6 sm:p-7"
      style={{
        borderRadius: 26,
        background: "linear-gradient(120deg, rgba(37,99,235,0.94), rgba(124,58,237,0.92))",
        boxShadow: "0 28px 60px -24px rgba(59,80,220,0.7), inset 0 1px 0 rgba(255,255,255,0.28)",
      }}
    >
      {/* shimmer sweep */}
      <div
        aria-hidden
        className="animate-aurora-shimmer pointer-events-none absolute inset-y-0 left-0 w-[120px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }}
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">{eyebrow}</div>
          <h2 className="font-display mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
          <p className="mt-1.5 text-sm text-white/85">{meta}</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 w-full max-w-sm overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.28)" }}>
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${pct}%`, boxShadow: "0 0 12px rgba(255,255,255,0.7)" }}
              />
            </div>
            <span className="font-display text-sm font-semibold text-white">{pct}%</span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-primary shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.02]"
          >
            <Play className="h-4 w-4 fill-current" />
            {cta}
          </Link>
          {nextUp && <span className="max-w-[240px] text-right text-xs text-white/70">Next up · {nextUp}</span>}
        </div>
      </div>
    </div>
  );
}
