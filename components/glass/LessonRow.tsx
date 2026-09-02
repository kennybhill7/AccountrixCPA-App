import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, type LucideIcon } from "lucide-react";
import { StatusPill, type LessonStatus } from "./StatusPill";

interface LessonRowProps {
  href: string;
  title: string;
  q?: number;
  cards?: number;
  mins?: number;
  status?: LessonStatus;
  /** CSS var name of the unit accent, e.g. "--unit-1". */
  accentVar?: string;
  icon?: LucideIcon;
}

/** Two-line lesson row: type icon + title/meta, status pill, hover-slide. */
export function LessonRow({
  href,
  title,
  q,
  cards,
  mins,
  status = "todo",
  accentVar = "--primary",
  icon: Icon = BookOpen,
}: LessonRowProps) {
  const meta = [
    q != null ? `${q} Q` : null,
    cards != null ? `${cards} cards` : null,
    mins != null ? `${mins} min` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={href}
      className="lesson-row flex items-center gap-3 px-5 py-3.5 sm:px-6"
      style={{ "--row-accent": `var(${accentVar})` } as React.CSSProperties}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `hsl(var(${accentVar}) / 0.12)`, color: `hsl(var(${accentVar}))` }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">{title}</div>
        {meta && <div className="mt-0.5 text-xs font-medium text-text-light">{meta}</div>}
      </div>
      <StatusPill status={status} />
      <ArrowRight className="h-4 w-4 shrink-0 text-text-light" />
    </Link>
  );
}
