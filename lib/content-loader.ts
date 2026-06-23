import fs from "fs/promises";
import path from "path";
import { CurriculumSchema, CurriculumIndexSchema } from "./schemas";
import type { Curriculum, CurriculumIndex, Month, Week, Flashcard, Quiz } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

export async function loadCurriculum(): Promise<Curriculum> {
  try {
    const curriculumPath = path.join(DATA_DIR, "curriculum.json");
    const content = await fs.readFile(curriculumPath, "utf-8");
    const data = JSON.parse(content);

    const validationResult = CurriculumSchema.safeParse(data);
    if (!validationResult.success) {
      // Incremental authoring: unfinished months (e.g. m7–m12) may not yet have
      // four weeks, which fails the strict schema. Do NOT hard-fail — return the
      // data so the authored months still load (callers tolerate partial months).
      console.warn("Curriculum not fully schema-valid (partial/legacy months); returning as-is.");
      return data as Curriculum;
    }

    return validationResult.data;
  } catch (error) {
    console.error("Failed to load curriculum:", error);
    throw new Error("Could not load curriculum data");
  }
}

export async function loadCurriculumIndex(): Promise<CurriculumIndex> {
  try {
    const indexPath = path.join(DATA_DIR, "curriculum-index.json");
    const content = await fs.readFile(indexPath, "utf-8");
    const data = JSON.parse(content);

    const validationResult = CurriculumIndexSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("Curriculum index validation failed:", validationResult.error);
      throw new Error("Invalid curriculum index structure");
    }

    return validationResult.data;
  } catch (error) {
    console.error("Failed to load curriculum index:", error);
    throw new Error("Could not load curriculum index");
  }
}

export async function loadMonth(monthId: string): Promise<Month> {
  try {
    const monthPath = path.join(DATA_DIR, `${monthId}.json`);
    const content = await fs.readFile(monthPath, "utf-8");
    const data = JSON.parse(content);

    return data;
  } catch (error) {
    console.error(`Failed to load month ${monthId}:`, error);
    throw new Error(`Could not load month ${monthId}`);
  }
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

export async function loadConsolidatedFlashcards(): Promise<ConsolidatedFlashcard[]> {
  try {
    const curriculum = await loadCurriculum();
    const flashcards: ConsolidatedFlashcard[] = [];

    for (const [monthId, month] of Object.entries(curriculum)) {
      const monthFlashcards: Flashcard[] = [];

      month.weeks.forEach((week) => {
        monthFlashcards.push(...week.flashcards);
      });

      if (monthFlashcards.length > 0) {
        flashcards.push({
          deck: month.title,
          cards: monthFlashcards,
        });
      }
    }

    return flashcards;
  } catch (error) {
    console.error("Failed to load consolidated flashcards:", error);
    throw new Error("Could not load flashcards");
  }
}

export async function searchContent(query: string): Promise<{
  months: Array<{ monthId: string; month: Month; relevance: number }>;
  weeks: Array<{ monthId: string; weekId: string; week: Week; relevance: number }>;
}> {
  try {
    const Fuse = (await import("fuse.js")).default;
    const curriculum = await loadCurriculum();

    // Prepare data for Fuse.js search
    const monthData = Object.entries(curriculum).map(([monthId, month]) => ({
      monthId,
      month,
      searchText: `${month.title} ${month.description || ""}`,
      type: "month" as const,
    }));

    const weekData = Object.entries(curriculum).flatMap(([monthId, month]) =>
      month.weeks.map((week) => {
        // Extract text from HTML content (defensive: legacy/partial weeks may be
        // missing fields — never throw, which would 500 the assist endpoint).
        const contentText = (week.lessonHtml || "")
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        // Combine flashcard content
        const flashcardText = (week.flashcards || [])
          .map((card) => `${card.front} ${card.back}`)
          .join(" ");

        // Combine quiz content
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

    // Configure Fuse.js options
    const fuseOptions = {
      keys: ["searchText", "month.title", "month.description", "week.title"],
      threshold: 0.4, // Lower = more strict matching
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      findAllMatches: true,
    };

    // Search months
    const monthFuse = new Fuse(monthData, fuseOptions);
    const monthResults = monthFuse.search(query);

    // Search weeks
    const weekFuse = new Fuse(weekData, fuseOptions);
    const weekResults = weekFuse.search(query);

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
    await fs.access(path.join(DATA_DIR, "curriculum-index.json"));
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
