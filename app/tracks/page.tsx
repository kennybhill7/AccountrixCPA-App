import Link from "next/link";
import type { Metadata } from "next";
import { TRACKS, type Track, type TrackStatus } from "@/lib/tracks";

export const metadata: Metadata = {
  title: "Study Tracks - Accountrix",
  description: "Choose a study track: Finance, CMA, CPA lessons, CPA practice, or Apply Lab.",
};

const STATUS_STYLE: Record<TrackStatus, string> = {
  live: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "in-progress": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  planned: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const STATUS_LABEL: Record<TrackStatus, string> = {
  live: "Available now",
  "in-progress": "In progress",
  planned: "Planned",
};

function trackSummary(track: Track): string {
  if (track.kind === "practice") return `${track.sections?.join(" · ")} practice`;
  if (track.months?.length) return `${track.months.length} months of lessons`;
  if (track.sections?.length) return `${track.sections.join(" · ")} lessons`;
  return "Lessons";
}

function TrackCard({ track }: { track: Track }) {
  const interactive = track.status !== "planned";
  const body = (
    <div
      className={`flex h-full flex-col rounded-lg border border-border bg-card p-5 transition ${
        interactive ? "hover:border-[#2e75b6]" : "opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold">{track.label}</h3>
        <span className={`shrink-0 rounded px-2 py-0.5 text-xs ${STATUS_STYLE[track.status]}`}>
          {STATUS_LABEL[track.status]}
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{track.description}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{trackSummary(track)}</span>
        {interactive && <span className="font-medium text-[#2e75b6]">Open →</span>}
      </div>
    </div>
  );

  return interactive ? (
    <Link href={track.href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

function TrackSection({ title, tracks }: { title: string; tracks: Track[] }) {
  if (tracks.length === 0) return null;
  return (
    <>
      <h2 className="mt-8 text-lg font-semibold">{title}</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {tracks.map((t) => (
          <TrackCard key={t.id} track={t} />
        ))}
      </div>
    </>
  );
}

export default function TracksPage() {
  const finance = TRACKS.filter((t) => t.exam === "Finance");
  const cma = TRACKS.filter((t) => t.exam === "CMA");
  const cpa = TRACKS.filter((t) => t.exam === "CPA");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-[#2e75b6]">Study Tracks</h1>
      <p className="mt-2 text-muted-foreground">
        Master Finance, CMA, and CPA through fictional construction-finance lessons, exam practice,
        and Apply Lab workflows.
      </p>

      <TrackSection title="Finance" tracks={finance} />
      <TrackSection title="CMA" tracks={cma} />
      <TrackSection title="CPA" tracks={cpa} />
    </div>
  );
}
