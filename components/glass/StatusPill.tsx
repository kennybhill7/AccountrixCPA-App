import { Check } from "lucide-react";

export type LessonStatus = "done" | "current" | "todo";

const LABEL: Record<LessonStatus, string> = {
  done: "Done",
  current: "In progress",
  todo: "Start",
};

/** The three lesson-status chips used in lesson rows and elsewhere. */
export function StatusPill({ status }: { status: LessonStatus }) {
  if (status === "done") {
    return (
      <span
        className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
        style={{ background: "hsl(var(--status-done) / 0.12)", color: "hsl(var(--status-done))" }}
      >
        <Check className="h-3 w-3" />
        {LABEL.done}
      </span>
    );
  }
  if (status === "current") {
    return (
      <span
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
        style={{ background: "hsl(var(--status-current) / 0.13)", color: "hsl(var(--status-current))" }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full animate-aurora-pulse"
          style={{ background: "hsl(var(--status-current))" }}
        />
        {LABEL.current}
      </span>
    );
  }
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: "hsl(var(--foreground) / 0.05)", color: "hsl(var(--text-light))" }}
    >
      {LABEL.todo}
    </span>
  );
}
