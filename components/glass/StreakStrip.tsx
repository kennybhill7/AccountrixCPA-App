import { Flame } from "lucide-react";

export interface StreakDay {
  label: string; // "M", "T", ...
  done: boolean;
  today?: boolean;
}

/** Streak card: flame chip + count + a 7-dot week strip (done/today/future). */
export function StreakStrip({ count, days }: { count: number; days: StreakDay[] }) {
  return (
    <div
      className="p-4 sm:p-5"
      style={{
        border: "1px solid hsl(var(--border))",
        borderRadius: 2,
        background: "hsl(var(--card))",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center"
          style={{
            background: "hsl(var(--foreground) / 0.08)",
            color: "hsl(var(--foreground))",
            borderRadius: 2,
          }}
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
              className="flex h-7 w-7 items-center justify-center"
              style={{
                borderRadius: 2,
                ...(d.today
                  ? { border: "1px solid hsl(var(--foreground))", color: "hsl(var(--foreground))" }
                  : d.done
                    ? {
                        background: "hsl(var(--foreground) / 0.1)",
                        color: "hsl(var(--foreground))",
                      }
                    : {
                        background: "hsl(var(--foreground) / 0.06)",
                        color: "hsl(var(--text-light))",
                      }),
              }}
            >
              <Flame className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-medium text-text-light">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
