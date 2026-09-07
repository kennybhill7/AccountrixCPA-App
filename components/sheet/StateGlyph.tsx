/**
 * Glyph + color together, always — never color alone. This is what survives
 * a grayscale screenshot of a workpaper. Fixed meanings, not decorative:
 * ✓ tied/correct, △ trap/at-risk, ✗ incorrect/exception, ◇ marginalia/ref.
 */
export type GlyphState = "good" | "warn" | "bad" | "ref";

const GLYPH: Record<GlyphState, string> = {
  good: "✓",
  warn: "△",
  bad: "✗",
  ref: "◇",
};

const TOKEN: Record<GlyphState, string> = {
  good: "--good",
  warn: "--warn",
  bad: "--bad",
  ref: "--pen",
};

export function StateGlyph({
  state,
  label,
  size = 14,
}: {
  state: GlyphState;
  /** Optional visible label after the glyph, e.g. "TIES" or "EXCEPTION". */
  label?: string;
  size?: number;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 font-semibold"
      style={{ color: `hsl(var(${TOKEN[state]}))`, fontSize: size }}
    >
      <span aria-hidden>{GLYPH[state]}</span>
      {label && (
        <span className="blueprint-label" style={{ color: "inherit" }}>
          {label}
        </span>
      )}
    </span>
  );
}
