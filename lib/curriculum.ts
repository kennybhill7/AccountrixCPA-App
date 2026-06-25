import fs from "fs/promises";
import path from "path";
import { loadCurriculum } from "@/lib/content-loader";

const KNOWLEDGE_DIR = path.join(process.cwd(), "data", "knowledge");

/**
 * Load optional knowledge files. Each file may contain additions or overrides,
 * e.g. { id: "m1:w2", title?: string, lessonHtml?: string, flashcards?: [], quiz?: {...} }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadKnowledgeFiles(): Promise<any[]> {
  try {
    const entries = await fs.readdir(KNOWLEDGE_DIR, { withFileTypes: true });
    const files = entries.filter((e) => e.isFile() && e.name.endsWith(".json"));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payloads: any[] = [];
    for (const f of files) {
      try {
        const txt = await fs.readFile(path.join(KNOWLEDGE_DIR, f.name), "utf-8");
        const json = JSON.parse(txt);
        payloads.push(json);
      } catch {}
    }
    return payloads;
  } catch {
    return [];
  }
}

/**
 * Merge knowledge overlays into the existing curriculum structure (non-destructive).
 */
export async function getMergedCurriculum() {
  const base = await loadCurriculum();
  const overlays = await loadKnowledgeFiles();

  for (const o of overlays) {
    if (!o || !o.id) continue;
    const [monthId, weekId] = parseId(o.id);
    if (!monthId || !weekId) continue;
    const month = base[monthId];
    if (!month) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const week = month.weeks.find((w: any) => w.id === weekId);
    if (!week) continue;
    if (o.title) week.title = o.title;
    if (o.lessonHtml) week.lessonHtml = o.lessonHtml;
    if (Array.isArray(o.flashcards)) week.flashcards = o.flashcards;
    if (o.quiz) week.quiz = o.quiz;
  }

  return base;
}

function parseId(raw: string): [string | null, string | null] {
  // Accept formats: "m1:w2" or "m1/w2" or "m1-w2"
  const s = String(raw).trim().toLowerCase();
  const parts = s.split(/[:/\-]/);
  if (parts.length !== 2) return [null, null];
  const [m, w] = parts;
  if (!/^m(\d{1,2})$/.test(m)) return [null, null];
  if (!/^w[1-4]$/.test(w)) return [null, null];
  return [m, w];
}
