/**
 * Readiness history — a lightweight daily snapshot store so the Readiness
 * Report can show progress over time ("FAR up 6 points this week") instead of
 * only a point-in-time number. Kept in its own persisted store (not lib/store)
 * so it composes without touching the core stores.
 *
 * One snapshot per calendar day (deduped); revisiting the page the same day
 * overwrites that day's snapshot with the latest evidence.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ReadinessSnapshot {
  /** epoch-day (lib/spacedRepetition dayNumber) */
  day: number;
  /** overall readiness per exam kind, e.g. { CPA: 41, CMA: 12, Finance: 55 } */
  byExam: Record<string, number>;
  /** per-section readiness, keyed by section id */
  bySection: Record<string, number>;
}

const MAX_SNAPSHOTS = 180;

interface ReadinessHistoryStore {
  snapshots: ReadinessSnapshot[];
  /** Record today's snapshot, replacing any existing one for the same day. */
  record: (snapshot: ReadinessSnapshot) => void;
  clear: () => void;
}

export const useReadinessHistory = create<ReadinessHistoryStore>()(
  persist(
    (set) => ({
      snapshots: [],
      record: (snapshot) =>
        set((state) => {
          const others = state.snapshots.filter((s) => s.day !== snapshot.day);
          const next = [...others, snapshot].sort((a, b) => a.day - b.day);
          return { snapshots: next.slice(-MAX_SNAPSHOTS) };
        }),
      clear: () => set({ snapshots: [] }),
    }),
    {
      name: "readiness-history",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * The most recent snapshot on/before `day − withinDays` (the baseline the
 * current value is compared against). Falls back to the earliest snapshot if
 * none is that old yet, so a brand-new user still sees movement within a week.
 */
export function baselineSnapshot(
  snapshots: ReadinessSnapshot[],
  day: number,
  withinDays = 7
): ReadinessSnapshot | null {
  if (snapshots.length === 0) return null;
  const cutoff = day - withinDays;
  const older = snapshots.filter((s) => s.day <= cutoff);
  if (older.length > 0) return older[older.length - 1];
  // No snapshot that old — use the earliest we have (but not today's own).
  const earlier = snapshots.filter((s) => s.day < day);
  return earlier.length > 0 ? earlier[0] : null;
}

/** Signed delta for one exam vs a baseline snapshot (null if no baseline). */
export function examDelta(
  current: Record<string, number>,
  baseline: ReadinessSnapshot | null,
  exam: string
): number | null {
  if (!baseline) return null;
  const before = baseline.byExam[exam];
  if (before === undefined) return null;
  return Math.round(((current[exam] ?? 0) - before) * 10) / 10;
}
