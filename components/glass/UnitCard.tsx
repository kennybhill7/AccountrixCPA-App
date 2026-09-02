import * as React from "react";
import { GlassCard } from "./GlassCard";

interface UnitCardProps {
  /** e.g. "FIN 1" */
  code: string;
  title: string;
  /** CSS var name of the unit accent, e.g. "--unit-1". */
  accentVar?: string;
  done?: number;
  total?: number;
  children?: React.ReactNode;
}

/** A unit container: tinted code chip + title + progress, with a lesson-row slot. */
export function UnitCard({ code, title, accentVar = "--primary", done = 0, total = 0, children }: UnitCardProps) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <GlassCard className="overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
        <span
          className="font-display shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold tracking-tight"
          style={{ background: `hsl(var(${accentVar}) / 0.14)`, color: `hsl(var(${accentVar}-ink))` }}
        >
          {code}
        </span>
        <h2 className="min-w-0 flex-1 truncate text-base font-semibold text-foreground">{title}</h2>
        {total > 0 && (
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs font-medium text-text-light">
              {done}/{total} done
            </span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full" style={{ background: "hsl(var(--foreground) / 0.08)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, hsl(var(${accentVar})), hsl(var(${accentVar}-ink)))`,
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="unit-rows" style={{ borderTop: "1px solid hsl(var(--foreground) / 0.06)" }}>
        {children}
      </div>
    </GlassCard>
  );
}
