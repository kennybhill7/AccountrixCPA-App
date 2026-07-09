"use client";

import * as React from "react";

interface ProgressRingProps {
  /** 0–100 */
  pct: number;
  size?: number;
  stroke?: number;
  /** gradient start / end (any CSS color) */
  from?: string;
  to?: string;
  /** centered content (defaults to the % label) */
  children?: React.ReactNode;
  className?: string;
}

/**
 * SVG progress ring with a gradient stroke and round caps — the Aurora
 * momentum ring. Distinct from the legacy components/ProgressRing.tsx.
 */
export function ProgressRing({
  pct,
  size = 66,
  stroke = 7,
  from = "hsl(var(--primary))",
  to = "hsl(262 83% 58%)",
  children,
  className,
}: ProgressRingProps) {
  const gid = React.useId();
  const clamped = Math.min(Math.max(pct, 0), 100);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (clamped / 100) * c;
  const center = size / 2;

  return (
    <div
      className={className}
      style={{ position: "relative", width: size, height: size, display: "inline-flex" }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={stroke}
        />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: "stroke-dasharray 1s cubic-bezier(0.2,0.8,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ?? (
          <span className="font-display text-sm font-semibold text-foreground">
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    </div>
  );
}
