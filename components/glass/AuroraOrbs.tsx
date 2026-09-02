/**
 * AuroraOrbs — three large blurred radial orbs that drift slowly behind the
 * glass shell. Decorative only (aria-hidden, pointer-events-none), sits at the
 * lowest layer so frosted panels refract the color.
 */
export function AuroraOrbs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute rounded-full animate-aurora-float dark:opacity-60"
        style={{
          width: "44vw",
          height: "44vw",
          left: "-9vw",
          top: "-12vw",
          background: "radial-gradient(circle, #60a5fa 0%, transparent 62%)",
          filter: "blur(60px)",
          opacity: 0.44,
        }}
      />
      <div
        className="absolute rounded-full animate-aurora-float2 dark:opacity-55"
        style={{
          width: "40vw",
          height: "40vw",
          right: "-7vw",
          top: "0vw",
          background: "radial-gradient(circle, #c084fc 0%, transparent 62%)",
          filter: "blur(60px)",
          opacity: 0.4,
        }}
      />
      <div
        className="absolute rounded-full animate-aurora-float dark:opacity-50"
        style={{
          width: "38vw",
          height: "38vw",
          left: "26vw",
          bottom: "-18vw",
          background: "radial-gradient(circle, #2dd4bf 0%, transparent 62%)",
          filter: "blur(64px)",
          opacity: 0.36,
        }}
      />
    </div>
  );
}
