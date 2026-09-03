/**
 * A drawn-in checkmark stamp — the "tied out" moment, on-brand for a ledger
 * app (reconciliation, not a trophy). Circle and check both self-draw via
 * stroke-dasharray on mount; respects prefers-reduced-motion (renders fully
 * drawn immediately, no animation).
 */
export function TieOutStamp({
  tone = "good",
  size = 96,
}: {
  tone?: "good" | "warn";
  size?: number;
}) {
  const color = tone === "good" ? "hsl(var(--status-done))" : "hsl(var(--warn))";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label={tone === "good" ? "Tied out" : "Reconciled with notes"}
      className="tie-out-stamp"
    >
      <circle
        cx="48"
        cy="48"
        r="42"
        fill="none"
        stroke={color}
        strokeWidth="3"
        className="tie-out-stamp-ring"
      />
      {tone === "good" ? (
        <path
          d="M30 50 L42 62 L68 34"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="tie-out-stamp-check"
        />
      ) : (
        <path
          d="M48 30 L48 54 M48 64 L48 66"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          className="tie-out-stamp-check"
        />
      )}
      <style>{`
        .tie-out-stamp-ring {
          stroke-dasharray: 264;
          stroke-dashoffset: 264;
          animation: tie-out-draw 0.5s ease-out forwards;
        }
        .tie-out-stamp-check {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: tie-out-draw 0.3s ease-out 0.45s forwards;
        }
        @keyframes tie-out-draw {
          to { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tie-out-stamp-ring, .tie-out-stamp-check {
            animation: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </svg>
  );
}
