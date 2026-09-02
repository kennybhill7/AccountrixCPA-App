import type { AttemptEvent } from "./types";

export interface SimProgressSummary {
  submissions: number;
  lastAccuracy: number | null;
  bestAccuracy: number | null;
  lastAttemptAt: number | null;
}

function taskKey(itemId: string): string {
  const parts = itemId.split(":");
  return parts[2] ?? itemId;
}

function isEventForSim(event: AttemptEvent, prefix: "tbs" | "essay", simId: string): boolean {
  return event.source === "workflow-task" && event.itemId.startsWith(`${prefix}:${simId}:`);
}

function accuracy(events: AttemptEvent[]): number | null {
  if (events.length === 0) return null;
  return Math.round((events.filter((e) => e.correct).length / events.length) * 100);
}

/**
 * Summarize per-requirement AttemptEvents back into a sim-level card metric.
 * Players currently record one event per requirement, not a submission ID.
 * The latest attempt is reconstructed from the latest event for each task.
 */
export function summarizeSimProgress(
  events: AttemptEvent[],
  prefix: "tbs" | "essay",
  simId: string,
  requirementCount: number
): SimProgressSummary {
  const relevant = events
    .filter((event) => isEventForSim(event, prefix, simId))
    .sort((a, b) => a.ts - b.ts);

  if (relevant.length === 0 || requirementCount <= 0) {
    return { submissions: 0, lastAccuracy: null, bestAccuracy: null, lastAttemptAt: null };
  }

  const latestByTask = new Map<string, AttemptEvent>();
  for (const event of relevant) latestByTask.set(taskKey(event.itemId), event);

  const lastEvents = [...latestByTask.values()].sort((a, b) => b.ts - a.ts).slice(0, requirementCount);
  const chunks: AttemptEvent[][] = [];
  for (let i = 0; i < relevant.length; i += requirementCount) {
    chunks.push(relevant.slice(i, i + requirementCount));
  }
  const chunkAccuracies = chunks
    .map((chunk) => accuracy(chunk))
    .filter((value): value is number => value !== null);

  return {
    submissions: Math.ceil(relevant.length / requirementCount),
    lastAccuracy: accuracy(lastEvents),
    bestAccuracy: chunkAccuracies.length > 0 ? Math.max(...chunkAccuracies) : null,
    lastAttemptAt: relevant[relevant.length - 1]?.ts ?? null,
  };
}

