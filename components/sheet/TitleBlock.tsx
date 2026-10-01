/**
 * The header strip every route-level page gets. Highest-leverage single
 * change in the drafting-table redesign — this one element does most of the
 * work of feeling drafted rather than dashboarded.
 */
export interface TitleBlockMeta {
  label: string;
  value: string;
}

export function TitleBlock({
  eyebrow,
  title,
  subtitle,
  meta,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  meta?: TitleBlockMeta[];
}) {
  return (
    <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="blueprint-label mb-1.5">{eyebrow}</div>}
        <h1
          style={{
            fontFamily: "var(--font-source-serif), Georgia, serif",
            fontSize: 26,
            fontWeight: 600,
            lineHeight: 1.25,
            color: "hsl(var(--foreground))",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            {subtitle}
          </p>
        )}
      </div>

      {meta && meta.length > 0 && (
        <div
          className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-2"
          style={{ borderLeft: "1px solid hsl(var(--border))", paddingLeft: "1.25rem" }}
        >
          {meta.map((m) => (
            <div key={m.label}>
              <div className="blueprint-label">{m.label}</div>
              <div className="ledger-number text-[13px]">{m.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
