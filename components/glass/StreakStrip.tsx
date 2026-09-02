import { Flame } from "lucide-react";
import { GlassCard } from "./GlassCard";

export interface StreakDay {
  label: string; // "M", "T", ...
  done: boolean;
  today?: boolean;
}

/** Streak card: flame chip + count + a 7-dot week strip (done/today/future). */
export function StreakStrip({ count, days }: { count: number; days: StreakDay[] }) {
  return (
    <GlassCard className="p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: "hsl(var(--status-streak) / 0.14)", color: "hsl(var(--status-streak))" }}
        >
          <Flame className="h-5 w-5" />
        </span>
        <div>
          <div className="font-display text-[17px] font-semibold leading-tight text-foreground">
            {count}-day streak
          </div>
          <div className="text-xs text-text-muted">Keep it lit — study today</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-1.5">
        {days.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={
                d.today
                  ? { background: "hsl(var(--primary) / 0.14)", boxShadow: "inset 0 0 0 2px hsl(var(--primary) / 0.5)", color: "hsl(var(--primary))" }
                  : d.done
                    ? { background: "linear-gradient(135deg,#fb923c,#f97316)", color: "#fff" }
                    : { background: "hsl(var(--foreground) / 0.06)", color: "hsl(var(--text-light))" }
              }
            >
              <Flame className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-medium text-text-light">{d.label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
