import type { ReactNode } from "react";

/**
 * The outer bordered surface that replaces stacked GlassCards. Regions touch
 * at a shared hairline instead of sitting in gaps — a bordered card in a gap
 * still reads as a card, shadow or no shadow. See docs/design/ (drafting-
 * table brief) §4.1-4.2: 0-2px radius, 1px hairline separation, never a
 * drop shadow, never margin between regions.
 */
export function Sheet({
  number,
  title,
  annotation,
  children,
  className = "",
}: {
  number?: string;
  title?: string;
  annotation?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        border: "1px solid hsl(var(--foreground))",
        borderRadius: 2,
        background: "hsl(var(--card))",
      }}
    >
      {(number || title || annotation) && (
        <div
          className="flex items-center justify-between gap-4 px-5 py-2.5"
          style={{
            borderBottom: "1px solid hsl(var(--foreground))",
            background: "hsl(var(--secondary))",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {number && <span className="blueprint-label shrink-0">{number}</span>}
            {title && (
              <span
                className="blueprint-label truncate"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {title}
              </span>
            )}
          </div>
          {annotation && <span className="blueprint-label shrink-0 text-right">{annotation}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * A region within a Sheet. Siblings share a hairline via `& > * + *`, never
 * margin — that's the rule that makes a Sheet read as one drafted surface
 * instead of a stack of cards. Do not wrap SheetRegions in space-y-*.
 */
export function SheetRegion({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return <div className={`sheet-region ${padded ? "p-5" : ""} ${className}`}>{children}</div>;
}
