import fs from "fs/promises";
import path from "path";
import { CurriculumSchema } from "./schemas";
import type { Curriculum, Month, Week, Flashcard, Quiz } from "./types";
import { loadCpaCurriculum } from "./cpa-content";
import { loadFinanceCurriculum } from "./finance-content";
import { readJsonCached } from "./jsonCache";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Repair the shape of a curriculum object that failed strict schema validation
 * (partial/hand-edited months) so downstream `month.weeks.map/find` can't throw:
 * a non-object becomes an empty curriculum, and every month is guaranteed a
 * `weeks` array. Authored content is preserved. Pure and unit-tested.
 */
export function coerceCurriculumShape(data: unknown): Curriculum {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {} as Curriculum;
  }
  for (const key of Object.keys(data as Record<string, unknown>)) {
    const month = (data as Record<string, { weeks?: unknown }>)[key];
    if (month && typeof month === "object" && !Array.isArray(month.weeks)) {
      month.weeks = [];
    }
  }
  return data as Curriculum;
}

export async function loadCurriculum(): Promise<Curriculum> {
  try {
    const curriculumPath = path.join(DATA_DIR, "curriculum.json");
    const data = await readJsonCached<unknown>(curriculumPath);

    const validationResult = CurriculumSchema.safeParse(data);
    if (!validationResult.success) {
      // Incremental authoring: unfinished months (e.g. m7–m12) may not yet have
      // four weeks, which fails the strict schema. Do NOT hard-fail — but
      // defensively guarantee every month has a `weeks` array so downstream
      // callers (loadWeek / searchContent / diagnostic pool) can't throw on a
      // partial or hand-edited month. Authored content is preserved.
      console.warn("Curriculum not fully schema-valid (partial/legacy months); normalizing.");
      return coerceCurriculumShape(data);
    }

    return validationResult.data;
  } catch (error) {
    console.error("Failed to load curriculum:", error);
    throw new Error("Could not load curriculum data");
  }
}

export async function loadMonth(monthId: string): Promise<Month> {
  // P0-4 fix: months are served from the current curriculum aggregate
  // (data/curriculum.json), never from the legacy data/m*.json bank.
  const curriculum = await loadCurriculum();
  const month = curriculum[monthId];

  if (!month) {
    throw new Error(`Month ${monthId} not found in curriculum.json`);
  }

  return month;
}

export async function loadWeek(monthId: string, weekId: string): Promise<Week> {
  try {
    const month = await loadMonth(monthId);
    const week = month.weeks.find((w) => w.id === weekId);

    if (!week) {
      throw new Error(`Week ${weekId} not found in month ${monthId}`);
    }

    return week;
  } catch (error) {
    console.error(`Failed to load week ${weekId} from month ${monthId}:`, error);
    throw new Error(`Could not load week ${weekId}`);
  }
}

export interface ConsolidatedFlashcard {
  deck: string;
  cards: Flashcard[];
}

async function loadCmaSkillSidecar(): Promise<Record<string, string[]>> {
  try {
    const p = path.join(DATA_DIR, "curriculum", "cma-skills.json");
    const raw = await fs.readFile(p, "utf-8");
    const data = JSON.parse(raw) as { weeks?: Record<string, { skills?: string[] }> };
    const out: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(data.weeks ?? {})) {
      out[key] = Array.isArray(value.skills) ? value.skills : [];
    }
    return out;
  } catch {
    return {};
  }
}

export async function loadConsolidatedFlashcards(): Promise<ConsolidatedFlashcard[]> {
  try {
    const [curriculum, cpaCurriculum, financeCurriculum, cmaSkills] = await Promise.all([
      loadCurriculum(),
      loadCpaCurriculum(),
      loadFinanceCurriculum(),
      loadCmaSkillSidecar(),
    ]);
    const flashcards: ConsolidatedFlashcard[] = [];

    for (const [monthId, month] of Object.entries(curriculum)) {
      const monthFlashcards: Flashcard[] = [];

      month.weeks.forEach((week) => {
        const skills = week.skills ?? cmaSkills[`${monthId}:${week.id}`] ?? [];
        monthFlashcards.push(
          ...(week.flashcards ?? []).map((card, index) => ({
            ...card,
            skills,
            track: "cma" as const,
            href: `/learn/${monthId}/${week.id}`,
            sourceId: `${monthId}:${week.id}:fc${index}`,
          }))
        );
      });

      if (monthFlashcards.length > 0) {
        flashcards.push({
          deck: month.title,
          cards: monthFlashcards,
        });
      }
    }

    for (const unit of cpaCurriculum.units) {
      const cards = unit.weeks.flatMap((week) =>
        (week.flashcards ?? []).map((card, index) => ({
          ...card,
          skills: week.skills ?? [],
          track: "cpa" as const,
          href: `/cpa/${unit.id}/${week.id}`,
          sourceId: `${unit.id}:${week.id}:fc${index}`,
        }))
      );
      if (cards.length > 0) {
        flashcards.push({
          deck: `${unit.section} Unit ${unit.unit}: ${unit.title}`,
          cards,
        });
      }
    }

    for (const unit of financeCurriculum.units) {
      const cards = unit.weeks.flatMap((week) =>
        (week.flashcards ?? []).map((card, index) => ({
          ...card,
          skills: week.skills ?? [],
          track: "finance" as const,
          href: `/finance/${unit.id}/${week.id}`,
          sourceId: `${unit.id}:${week.id}:fc${index}`,
        }))
      );
      if (cards.length > 0) {
        flashcards.push({
          deck: `Finance Unit ${unit.unit}: ${unit.title}`,
          cards,
        });
      }
    }

    return flashcards;
  } catch (error) {
    console.error("Failed to load consolidated flashcards:", error);
    throw new Error("Could not load flashcards");
  }
}

// Prebuilt Fuse indexes for search, cached by curriculum.json mtime so repeated
// (per-keystroke) queries don't re-flatten the whole curriculum and rebuild the
// indexes each time. Invalidates automatically when the content file changes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let searchIndexCache: { mtimeMs: number; monthFuse: any; weekFuse: any } | null = null;

async function getSearchIndexes() {
  const curriculumPath = path.join(DATA_DIR, "curriculum.json");
  let mtimeMs = 0;
  try {
    mtimeMs = (await fs.stat(curriculumPath)).mtimeMs;
  } catch {
    // stat failed — fall through and rebuild from whatever loadCurriculum gives.
  }
  if (searchIndexCache && searchIndexCache.mtimeMs === mtimeMs) return searchIndexCache;

  const Fuse = (await import("fuse.js")).default;
  const curriculum = await loadCurriculum();

  const monthData = Object.entries(curriculum).map(([monthId, month]) => ({
    monthId,
    month,
    searchText: `${month.title} ${month.description || ""}`,
    type: "month" as const,
  }));

  const weekData = Object.entries(curriculum).flatMap(([monthId, month]) =>
    (month.weeks || []).map((week) => {
      // Defensive: legacy/partial weeks may miss fields — never throw.
      const contentText = (week.lessonHtml || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const flashcardText = (week.flashcards || [])
        .map((card) => `${card.front} ${card.back}`)
        .join(" ");
      const quizText = (week.quiz?.questions || [])
        .map((q) => `${q.q} ${(q.choices || []).join(" ")} ${q.explain || ""}`)
        .join(" ");
      return {
        monthId,
        weekId: week.id,
        week,
        searchText: `${week.title} ${contentText} ${flashcardText} ${quizText}`,
        type: "week" as const,
      };
    })
  );

  const fuseOptions = {
    keys: ["searchText", "month.title", "month.description", "week.title"],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
    findAllMatches: true,
  };

  searchIndexCache = {
    mtimeMs,
    monthFuse: new Fuse(monthData, fuseOptions),
    weekFuse: new Fuse(weekData, fuseOptions),
  };
  return searchIndexCache;
}

export async function searchContent(query: string): Promise<{
  months: Array<{ monthId: string; month: Month; relevance: number }>;
  weeks: Array<{ monthId: string; weekId: string; week: Week; relevance: number }>;
}> {
  try {
    const { monthFuse, weekFuse } = await getSearchIndexes();
    const monthResults: Array<{ item: { monthId: string; month: Month }; score?: number }> =
      monthFuse.search(query);
    const weekResults: Array<{
      item: { monthId: string; weekId: string; week: Week };
      score?: number;
    }> = weekFuse.search(query);

    // Transform results and calculate relevance
    const results = {
      months: monthResults.map((result) => ({
        monthId: result.item.monthId,
        month: result.item.month,
        relevance: Math.round((1 - (result.score || 0)) * 100), // Convert score to relevance
      })),
      weeks: weekResults.map((result) => ({
        monthId: result.item.monthId,
        weekId: result.item.weekId,
        week: result.item.week,
        relevance: Math.round((1 - (result.score || 0)) * 100),
      })),
    };

    // Sort by relevance
    results.months.sort((a, b) => b.relevance - a.relevance);
    results.weeks.sort((a, b) => b.relevance - a.relevance);

    return results;
  } catch (error) {
    console.error("Search failed:", error);
    throw new Error("Search functionality unavailable");
  }
}

// Helper function to check if data exists
export async function hasData(): Promise<boolean> {
  try {
    await fs.access(path.join(DATA_DIR, "curriculum.json"));
    return true;
  } catch {
    return false;
  }
}

// Helper function to get data statistics
export async function getDataStats(): Promise<{
  months: number;
  weeks: number;
  flashcards: number;
  quizQuestions: number;
} | null> {
  try {
    const curriculum = await loadCurriculum();
    let weeks = 0;
    let flashcards = 0;
    let quizQuestions = 0;

    Object.values(curriculum).forEach((month) => {
      weeks += month.weeks?.length || 0;
      (month.weeks || []).forEach((week) => {
        flashcards += week.flashcards?.length || 0;
        quizQuestions += week.quiz?.questions?.length || 0;
      });
    });

    return {
      months: Object.keys(curriculum).length,
      weeks,
      flashcards,
      quizQuestions,
    };
  } catch {
    return null;
  }
}

// Export aliases for compatibility
export const loadWeekContent = loadWeek;
export const loadMonthData = loadMonth;

export { type Flashcard, type Quiz, type Week, type Month, type Curriculum };
