"use client";

import { useEffect, useState } from "react";
import { useAppStore, heartsWithRefill, msUntilNextHeart, MAX_HEARTS } from "@/lib/store";
import { useHydratedStore } from "@/lib/hooks";

/** Vertical hairline between the three ledger stats. */
function Divider() {
  return <span className="h-3 w-px shrink-0" style={{ background: "hsl(var(--border))" }} />;
}

/** One label/value pair, in the same blueprint-label + ledger-number
 * vocabulary as everything else — plain digits, no icon standing in for
 * hierarchy or state (rule 4.4: this bar renders on every screen, so it
 * cannot spend the page's one accent). */
function Stat({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <span className="flex items-baseline gap-1.5" title={title}>
      <span className="blueprint-label">{label}</span>
      <span className="ledger-number text-sm font-semibold">{value}</span>
    </span>
  );
}

export function StreakHeartsXp() {
  const hydrated = useHydratedStore();
  const xp = useAppStore((state) => state.xp);
  const rawHearts = useAppStore((state) => state.hearts);
  const lastHeartLossAt = useAppStore((state) => state.lastHeartLossAt);
  const streak = useAppStore((state) => state.streak);

  // Minute tick so time-based heart refill shows up without a reload.
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex items-center gap-3">
        <Stat label="XP" value="0" />
        <Divider />
        <Stat label="Hearts" value={`0/${MAX_HEARTS}`} />
        <Divider />
        <Stat label="Streak" value="0d" />
      </div>
    );
  }

  const heartState = { hearts: rawHearts, lastHeartLossAt };
  const hearts = heartsWithRefill(heartState, nowMs);
  const nextMs = msUntilNextHeart(heartState, nowMs);
  const nextMin = nextMs != null ? Math.max(1, Math.ceil(nextMs / 60_000)) : null;
  const heartsTitle =
    hearts < MAX_HEARTS && nextMin != null ? `Next heart in ${nextMin}m` : "Hearts full";

  return (
    <div className="flex items-center gap-3">
      <Stat label="XP" value={String(xp)} />
      <Divider />
      <Stat label="Hearts" value={`${hearts}/${MAX_HEARTS}`} title={heartsTitle} />
      <Divider />
      <Stat label="Streak" value={`${streak}d`} />
    </div>
  );
}
