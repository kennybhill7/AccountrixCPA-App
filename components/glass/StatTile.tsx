interface StatTileProps {
  label: string;
  value: string;
  sub?: string;
  /**
   * Color for the value text (any CSS color). Defaults to ink, not the page
   * accent — every one of this component's five callers either passes a
   * distinct semantic token (status-done, etc.) or nothing at all, and none
   * of those "nothing" cases actually want that tile to be the page's one
   * accent (rule 4.4); a stat tile is informational, not a call to action.
   */
  accent?: string;
  subPositive?: boolean;
}

/** A labeled numeric tile (XP, totals, deltas) in the momentum strip. */
export function StatTile({
  label,
  value,
  sub,
  accent = "hsl(var(--foreground))",
  subPositive,
}: StatTileProps) {
  return (
    <div
      className="flex flex-col justify-center p-4 sm:p-5"
      style={{
        border: "1px solid hsl(var(--border))",
        borderRadius: 2,
        background: "hsl(var(--card))",
      }}
    >
      <div className="text-[11px] font-semibold uppercase tracking-wider text-text-light">
        {label}
      </div>
      <div className="ledger-number mt-1 text-2xl font-semibold" style={{ color: accent }}>
        {value}
      </div>
      {sub && (
        <div
          className="mt-0.5 text-xs font-medium"
          style={{ color: subPositive ? "hsl(var(--good))" : "hsl(var(--text-muted))" }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
