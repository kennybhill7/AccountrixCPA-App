/**
 * Exam-sim content loaders (server-side only).
 *
 * Two sim types close the two biggest exam-format gaps:
 *  - CPA task-based simulations (data/tbs/*.json) — exhibit-driven multi-part
 *    requirements graded by the deterministic Apply engine (calc/je/writeup).
 *  - CMA essays (data/essays/*.json) — scenario + written requirements graded
 *    by the narrative rubric with model answers revealed after submission.
 *
 * Task shapes reuse lib/case-workflows WorkflowTask so components/grading
 * are shared with Apply Lab.
 */

import fs from "fs/promises";
import path from "path";
import type { WorkflowExhibit, WorkflowTask } from "./case-workflows";

const TBS_DIR = path.join(process.cwd(), "data", "tbs");
const ESSAYS_DIR = path.join(process.cwd(), "data", "essays");

export interface TbsSim {
  id: string;
  section: "FAR" | "AUD" | "REG" | "BAR" | "ISC" | "TCP" | string;
  title: string;
  timeMinutes: number;
  skills: string[];
  scenario: string;
  exhibits: WorkflowExhibit[];
  tasks: WorkflowTask[];
}

export interface EssayConcept {
  id: string;
  anyOf: string[];
}

export interface EssayConclusion {
  id: string;
  anyOf: string[];
  noneOf?: string[];
}

export interface EssayRequirement {
  id: string;
  prompt: string;
  /** legacy flat keywords; used only when concepts is absent */
  keywords?: string[];
  /** concept checklist (each satisfied by any alternate) — preferred */
  concepts?: EssayConcept[];
  /** expected conclusion check; catches fluent answers with inverted judgment */
  conclusions?: EssayConclusion[];
  minWords: number;
  modelAnswer: string;
}

export interface EssaySim {
  id: string;
  part: string;
  title: string;
  timeMinutes: number;
  skills: string[];
  scenario: string;
  exhibits?: WorkflowExhibit[];
  requirements: EssayRequirement[];
}

async function loadJsonDir<T extends { id: string }>(dir: string): Promise<T[]> {
  let files: string[] = [];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  const out: T[] = [];
  for (const file of files.sort()) {
    try {
      const raw = await fs.readFile(path.join(dir, file), "utf-8");
      out.push(JSON.parse(raw) as T);
    } catch (e) {
      console.error(`sims-content: failed to load ${file}:`, e);
    }
  }
  return out;
}

export async function loadTbsSims(): Promise<TbsSim[]> {
  return loadJsonDir<TbsSim>(TBS_DIR);
}

export async function loadTbsSim(id: string): Promise<TbsSim | null> {
  const sims = await loadTbsSims();
  return sims.find((s) => s.id === id) ?? null;
}

export async function loadEssaySims(): Promise<EssaySim[]> {
  return loadJsonDir<EssaySim>(ESSAYS_DIR);
}

export async function loadEssaySim(id: string): Promise<EssaySim | null> {
  const sims = await loadEssaySims();
  return sims.find((s) => s.id === id) ?? null;
}
