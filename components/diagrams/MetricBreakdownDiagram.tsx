/**
 * A horizontal chip flow: N labeled input terms combined by real arithmetic
 * operators into one derived result. For metrics that are computed from
 * named components (cash conversion cycle, sustainable growth rate, degree
 * of operating leverage) rather than a standard-vs-actual comparison — a
 * genuinely different shape from VarianceLineDiagram, not a reskin of it.
 */
export interface MetricTerm {
  label: string;
  value: number;
  unit?: string;
}

export interface MetricBreakdownDiagramProps {
  label: string;
  terms: MetricTerm[];
  operators: ("+" | "−" | "×" | "÷")[];
  result: MetricTerm;
}

function fmt(n: number, unit?: string) {
  const body = n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (unit === "$") return `$${body}`;
  if (unit === "%") return `${body}%`;
  if (unit) return `${body} ${unit}`;
  return body;
}

function Chip({ term, emphasize }: { term: MetricTerm; emphasize?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 px-3">
      <span
        className="font-display text-[11px] font-semibold uppercase tracking-wide"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {term.label}
      </span>
      <span
        className="font-mono text-base tabular-nums"
        style={{
          color: emphasize ? "hsl(var(--primary))" : "hsl(var(--foreground))",
          fontWeight: emphasize ? 700 : 500,
        }}
      >
        {fmt(term.value, term.unit)}
      </span>
    </div>
  );
}

export function MetricBreakdownDiagram({ terms, operators, result }: MetricBreakdownDiagramProps) {
  return (
    <div
      role="img"
      aria-label={`${result.label} = ${terms
        .map((t, i) => `${fmt(t.value, t.unit)}${operators[i] ? ` ${operators[i]} ` : ""}`)
        .join("")} = ${fmt(result.value, result.unit)}`}
      className="flex flex-wrap items-center justify-center gap-1 py-2"
    >
      {terms.map((t, i) => (
        <div key={i} className="flex items-center gap-1">
          <Chip term={t} />
          {i < operators.length && (
            <span
              className="font-mono text-lg"
              style={{ color: "hsl(var(--muted-foreground))" }}
              aria-hidden
            >
              {operators[i]}
            </span>
          )}
        </div>
      ))}
      <span
        className="font-mono text-lg"
        style={{ color: "hsl(var(--muted-foreground))" }}
        aria-hidden
      >
        =
      </span>
      <Chip term={result} emphasize />
    </div>
  );
}
