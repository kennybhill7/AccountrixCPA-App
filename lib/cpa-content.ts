import path from "path";
import type { Week } from "./types";
import { readJsonCached } from "./jsonCache";

const DATA_DIR = path.join(process.cwd(), "data");

export interface CpaUnit {
  id: string; // e.g. "far-u1"
  section: string; // e.g. "FAR"
  unit: number; // e.g. 1
  title: string;
  weeks: Week[];
}

export interface CpaCurriculum {
  units: CpaUnit[];
}

/** Load the assembled CPA curriculum (data/curriculum-cpa.json). */
export async function loadCpaCurriculum(): Promise<CpaCurriculum> {
  try {
    const p = path.join(DATA_DIR, "curriculum-cpa.json");
    const data = await readJsonCached<{ units?: unknown }>(p);
    if (!data || !Array.isArray(data.units)) return { units: [] };
    return data as CpaCurriculum;
  } catch {
    // Not built yet — return empty so callers can render an empty state, never 500.
    return { units: [] };
  }
}

export async function getCpaUnit(unitId: string): Promise<CpaUnit | null> {
  const { units } = await loadCpaCurriculum();
  return units.find((u) => u.id === unitId) ?? null;
}

export async function getCpaWeek(unitId: string, weekId: string): Promise<Week | null> {
  const unit = await getCpaUnit(unitId);
  if (!unit) return null;
  return unit.weeks.find((w) => w.id === weekId) ?? null;
}

export async function hasCpaData(): Promise<boolean> {
  const { units } = await loadCpaCurriculum();
  return units.length > 0;
}
