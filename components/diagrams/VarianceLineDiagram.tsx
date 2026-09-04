/**
 * A number-line diagram showing a standard vs. actual figure and the gap
 * between them. Parameterized from real data (a lesson's own worked example,
 * or a seeded parametric generator instance) — never a stock illustration.
 */
export interface VarianceLineDiagramProps {
  label: string;
  standardLabel: string;
  standardValue: number;
  actualLabel: string;
  actualValue: number;
  variance: number;
  unit?: string;
  favorable: boolean;
}

function fmt(n: number, unit?: string) {
  const abs = Math.abs(n);
  const body = abs.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return unit === "$" ? `$${body}` : unit ? `${body} ${unit}` : body;
}

export function VarianceLineDiagram({
  label,
  standardLabel,
  standardValue,
  actualLabel,
  actualValue,
  variance,
  unit,
  favorable,
}: VarianceLineDiagramProps) {
  const lo = Math.min(standardValue, actualValue);
  const hi = Math.max(standardValue, actualValue);
  const pad = Math.max((hi - lo) * 0.35, 1);
  const min = lo - pad;
  const max = hi + pad;
  const width = 640;
  const trackY = 56;
  const x = (v: number) => 24 + ((v - min) / (max - min)) * (width - 48);

  const sx = x(standardValue);
  const ax = x(actualValue);

  return (
    <svg
      viewBox={`0 0 ${width} 110`}
      role="img"
      aria-label={`${label}: ${standardLabel.toLowerCase()} ${fmt(standardValue, unit)}, ${actualLabel.toLowerCase()} ${fmt(actualValue, unit)}, gap ${fmt(variance, unit)} (${favorable ? "favorable" : "unfavorable"})`}
      className="w-full h-auto"
    >
      <line
        x1={24}
        y1={trackY}
        x2={width - 24}
        y2={trackY}
        stroke="hsl(var(--border))"
        strokeWidth={2}
      />
      {/* gap band between standard and actual */}
      <line
        x1={sx}
        y1={trackY}
        x2={ax}
        y2={trackY}
        stroke={favorable ? "hsl(var(--status-done))" : "hsl(var(--status-streak))"}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* standard marker */}
      <circle cx={sx} cy={trackY} r={6} fill="hsl(var(--muted-foreground))" />
      <text
        x={sx}
        y={trackY - 16}
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
        fill="hsl(var(--muted-foreground))"
      >
        {standardLabel}
      </text>
      <text x={sx} y={trackY + 26} textAnchor="middle" fontSize={12} fill="hsl(var(--foreground))">
        {fmt(standardValue, unit)}
      </text>

      {/* actual marker */}
      <circle
        cx={ax}
        cy={trackY}
        r={6}
        fill={favorable ? "hsl(var(--status-done))" : "hsl(var(--status-streak))"}
      />
      <text
        x={ax}
        y={trackY - 16}
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
        fill={favorable ? "hsl(var(--status-done))" : "hsl(var(--status-streak))"}
      >
        {actualLabel}
      </text>
      <text x={ax} y={trackY + 26} textAnchor="middle" fontSize={12} fill="hsl(var(--foreground))">
        {fmt(actualValue, unit)}
      </text>

      {/* variance callout */}
      <text
        x={(sx + ax) / 2}
        y={trackY + 44}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill={favorable ? "hsl(var(--status-done))" : "hsl(var(--status-streak))"}
      >
        {fmt(Math.abs(variance), unit)} {favorable ? "favorable" : "unfavorable"}
      </text>
    </svg>
  );
}
