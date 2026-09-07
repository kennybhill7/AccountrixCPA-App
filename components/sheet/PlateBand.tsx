/**
 * The image band. object-fit: cover with an explicit object-position
 * (subjects sit in the middle third, crops are tight), a caps annotation
 * strip always directly beneath, hairline top and bottom. The annotation is
 * written in the app's own voice — job, scope, the line or period it
 * relates to — never a caption describing the photograph. No image floats
 * without its strip.
 */
export function PlateBand({
  src,
  alt,
  height = 158,
  focus = "center 46%",
  scope,
  stamp,
}: {
  src: string;
  alt: string;
  height?: number;
  focus?: string;
  /** Left side of the annotation strip — job/scope, in caps. */
  scope: string;
  /** Right side of the annotation strip — the line/period/ref it relates to. */
  stamp: string;
}) {
  return (
    <div style={{ borderBottom: "1px solid hsl(var(--border))" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{
          display: "block",
          width: "100%",
          height,
          objectFit: "cover",
          objectPosition: focus,
        }}
      />
      <div
        className="flex"
        style={{ borderTop: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
      >
        <div className="blueprint-label flex-1 px-6 py-2.5">{scope}</div>
        <div
          className="ledger-number px-6 py-2.5 text-[11px]"
          style={{ borderLeft: "1px solid hsl(var(--border))" }}
        >
          {stamp}
        </div>
      </div>
    </div>
  );
}
