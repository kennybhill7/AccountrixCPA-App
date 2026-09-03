/**
 * Score-bound completion graphic. The two columns are the session result and
 * its target; they only lock with a check when the score clears the mastery
 * threshold supplied by the caller.
 */
export function PracticeTieOut({ percent, balanced }: { percent: number; balanced: boolean }) {
  const color = balanced ? "hsl(var(--status-done))" : "hsl(var(--warn))";
  return (
    <svg
      viewBox="0 0 360 116"
      role="img"
      aria-label={
        balanced ? `Session tied out at ${percent}%` : `Session requires review at ${percent}%`
      }
      className="h-auto w-full max-w-[360px]"
    >
      <line x1="30" y1="86" x2="330" y2="86" stroke="hsl(var(--border))" strokeWidth="2" />
      <g
        className="practice-target"
        fill="hsl(var(--muted-foreground) / 0.2)"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
      >
        <rect x="68" y="34" width="72" height="52" />
        <rect x="74" y="26" width="60" height="8" />
      </g>
      <g className="practice-actual" fill={color} opacity="0.82">
        <rect x="220" y="34" width="72" height="52" />
        <rect x="226" y="26" width="60" height="8" />
      </g>
      <g
        fill="hsl(var(--muted-foreground))"
        fontFamily="var(--font-mono)"
        fontSize="10"
        letterSpacing="1"
      >
        <text x="104" y="103" textAnchor="middle">
          TARGET
        </text>
        <text x="256" y="103" textAnchor="middle">
          ACTUAL
        </text>
      </g>
      <circle
        cx="180"
        cy="58"
        r="15"
        fill="hsl(var(--background))"
        stroke={color}
        strokeWidth="2"
      />
      {balanced ? (
        <path
          d="M172 58l5 5 10-12"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M180 50v10M180 65v1"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      <style>{`
        .practice-target { transform-origin: 104px 60px; animation: practice-close-left 0.45s ease-out both; }
        .practice-actual { transform-origin: 256px 60px; animation: practice-close-right 0.45s ease-out 0.1s both; }
        @keyframes practice-close-left { from { transform: translateX(-16px); } to { transform: translateX(0); } }
        @keyframes practice-close-right { from { transform: translateX(16px); } to { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) { .practice-target, .practice-actual { animation: none; transform: none; } }
      `}</style>
    </svg>
  );
}
