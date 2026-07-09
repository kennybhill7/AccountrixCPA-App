import { GlassCard } from "./GlassCard";

interface StatTileProps {
  label: string;
  value: string;
  sub?: string;
  /** color for the value text (any CSS color) */
  accent?: string;
  subPositive?: boolean;
}

/** A labeled numeric tile (XP, totals, deltas) in the momentum strip. */
export function StatTile({ label, value, sub, accent = "hsl(var(--primary))", subPositive }: StatTileProps) {
  return (
    <GlassCard className="flex flex-col justify-center p-4 sm:p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-text-light">{label}</div>
      <div className="font-display mt-1 text-2xl font-bold tracking-tight" style={{ color: accent }}>
        {value}
      </div>
      {sub && (
        <div
          className="mt-0.5 text-xs font-medium"
          style={{ color: subPositive ? "hsl(var(--status-done))" : "hsl(var(--text-muted))" }}
        >
          {sub}
        </div>
      )}
    </GlassCard>
  );
}
