/**
 * Small onboarding schematic: the first accounting idea is that both sides
 * land on the same total. It is intentionally a graphic, not a decoration.
 */
export function LedgerBalanceDiagram() {
  return (
    <svg
      viewBox="0 0 520 190"
      role="img"
      aria-label="Debit and credit ledger entries settle at the same total"
      className="h-auto w-full"
    >
      <g fill="none" stroke="hsl(var(--border))" strokeWidth="1">
        <path d="M24 28H496M24 64H496M24 100H496M24 136H496M24 172H496" />
        <path d="M260 20V178" />
      </g>
      <g
        fill="hsl(var(--muted-foreground))"
        fontFamily="var(--font-mono)"
        fontSize="11"
        letterSpacing="1"
      >
        <text x="36" y="18">
          DEBIT
        </text>
        <text x="278" y="18">
          CREDIT
        </text>
      </g>
      <g
        className="ledger-values ledger-debit"
        fill="hsl(var(--foreground))"
        fontFamily="var(--font-mono)"
        fontSize="16"
      >
        <text x="54" y="52">
          1,250
        </text>
        <text x="54" y="88">
          640
        </text>
        <text x="54" y="124">
          610
        </text>
      </g>
      <g
        className="ledger-values ledger-credit"
        fill="hsl(var(--foreground))"
        fontFamily="var(--font-mono)"
        fontSize="16"
      >
        <text x="296" y="52">
          1,250
        </text>
        <text x="296" y="88">
          400
        </text>
        <text x="296" y="124">
          850
        </text>
      </g>
      <g
        fill="hsl(var(--status-done))"
        fontFamily="var(--font-mono)"
        fontSize="13"
        fontWeight="700"
      >
        <text x="54" y="164">
          TOTAL 1,250
        </text>
        <text x="296" y="164">
          TOTAL 1,250
        </text>
      </g>
      <circle className="ledger-lock" cx="476" cy="164" r="7" fill="hsl(var(--status-done))" />
      <path
        className="ledger-lock-check"
        d="M472 164l3 3 5-7"
        fill="none"
        stroke="hsl(var(--background))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <style>{`
        .ledger-debit { animation: ledger-settle-left 0.7s ease-out both; }
        .ledger-credit { animation: ledger-settle-right 0.7s ease-out 0.12s both; }
        .ledger-lock { transform-origin: 476px 164px; animation: ledger-lock-in 0.35s ease-out 0.72s both; }
        .ledger-lock-check { stroke-dasharray: 18; stroke-dashoffset: 18; animation: ledger-check-in 0.25s ease-out 0.9s forwards; }
        @keyframes ledger-settle-left { from { transform: translateX(-18px); opacity: 0.25; } to { transform: translateX(0); opacity: 1; } }
        @keyframes ledger-settle-right { from { transform: translateX(18px); opacity: 0.25; } to { transform: translateX(0); opacity: 1; } }
        @keyframes ledger-lock-in { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes ledger-check-in { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .ledger-debit, .ledger-credit, .ledger-lock, .ledger-lock-check { animation: none; opacity: 1; transform: none; stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}
