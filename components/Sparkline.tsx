/**
 * Sparkline — a tiny dependency-free inline trend line for a numeric series
 * (used for readiness-over-time on the Readiness Report). The point geometry is
 * an exported pure function so it can be unit-tested without rendering.
 */

export function sparklinePoints(values: number[], width: number, height: number): string {
  if (values.length < 2) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function Sparkline({
  values,
  width = 84,
  height = 24,
  className,
}: {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
}) {
  if (values.length < 2) return null;
  const points = sparklinePoints(values, width, height);
  const rising = values[values.length - 1] >= values[0];
  const stroke = rising ? "#16a34a" : "#dc2626";
  return (
    <svg width={width} height={height} className={className} aria-hidden="true">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}
