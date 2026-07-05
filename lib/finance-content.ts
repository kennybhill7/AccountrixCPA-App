import path from "path";
import type { Week } from "./types";
import { readJsonCached } from "./jsonCache";

const DATA_DIR = path.join(process.cwd(), "data");

export interface FinanceUnit {
  id: string;
  unit: number;
  title: string;
  weeks: Week[];
}

export interface FinanceCurriculum {
  units: FinanceUnit[];
}

export async function loadFinanceCurriculum(): Promise<FinanceCurriculum> {
  try {
    const p = path.join(DATA_DIR, "curriculum-finance.json");
    const data = await readJsonCached<{ units?: unknown }>(p);
    if (!data || !Array.isArray(data.units)) return { units: [] };
    return data as FinanceCurriculum;
  } catch {
    return { units: [] };
  }
}

export async function getFinanceUnit(unitId: string): Promise<FinanceUnit | null> {
  const { units } = await loadFinanceCurriculum();
  return units.find((u) => u.id === unitId) ?? null;
}

export async function getFinanceWeek(unitId: string, weekId: string): Promise<Week | null> {
  const unit = await getFinanceUnit(unitId);
  if (!unit) return null;
  return unit.weeks.find((w) => w.id === weekId) ?? null;
}

