import { describe, it, expect, vi, beforeEach } from "vitest";
import { hasData, getDataStats, loadMonth, loadConsolidatedFlashcards } from "@/lib/content-loader";
import { clearJsonCache } from "@/lib/jsonCache";
import fs from "fs/promises";

// Mock fs module
vi.mock("fs/promises", () => ({
  default: {
    access: vi.fn(),
    readFile: vi.fn(),
    stat: vi.fn(),
  },
  access: vi.fn(),
  readFile: vi.fn(),
  stat: vi.fn(),
}));

const mockFs = vi.mocked(fs);

describe("Content Loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // The curriculum loaders now go through the mtime-keyed JSON cache; reset it
    // between tests and give stat a stable mtime so each test's mocked readFile
    // content is used.
    clearJsonCache();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFs.stat.mockResolvedValue({ mtimeMs: 1 } as any);
  });

  describe("hasData", () => {
    it("should return true when data files exist", async () => {
      mockFs.access.mockResolvedValue(undefined);

      const result = await hasData();

      expect(result).toBe(true);
      expect(mockFs.access).toHaveBeenCalledWith(expect.stringContaining("curriculum.json"));
    });

    it("should return false when data files do not exist", async () => {
      mockFs.access.mockRejectedValue(new Error("File not found"));

      const result = await hasData();

      expect(result).toBe(false);
    });
  });

  describe("loadMonth", () => {
    const mockCurriculum = {
      m1: { id: "m1", title: "Month 1", weeks: [] },
    };

    it("serves months from curriculum.json, not legacy m*.json (P0-4 regression)", async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockCurriculum));

      const month = await loadMonth("m1");

      expect(month.title).toBe("Month 1");
      expect(mockFs.readFile).toHaveBeenCalledWith(
        expect.stringContaining("curriculum.json"),
        "utf-8"
      );
      // Must never read data/m1.json directly.
      const readPaths = mockFs.readFile.mock.calls.map((c) => String(c[0]));
      expect(readPaths.every((p) => p.includes("curriculum.json"))).toBe(true);
    });

    it("throws a clear error when the month id is absent", async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockCurriculum));

      await expect(loadMonth("m99")).rejects.toThrow(
        "Month m99 not found in curriculum.json"
      );
    });
  });

  describe("getDataStats", () => {
    it("should return statistics when curriculum exists", async () => {
      const mockCurriculum = {
        m1: {
          title: "Month 1",
          weeks: [
            {
              id: "w1",
              flashcards: [
                { front: "Q1", back: "A1" },
                { front: "Q2", back: "A2" },
              ],
              quiz: {
                questions: [
                  { q: "Question 1", choices: ["A", "B", "C"], answer: 0 },
                  { q: "Question 2", choices: ["A", "B", "C"], answer: 1 },
                ],
              },
            },
          ],
        },
        m2: {
          title: "Month 2",
          weeks: [
            {
              id: "w1",
              flashcards: [{ front: "Q3", back: "A3" }],
              quiz: {
                questions: [{ q: "Question 3", choices: ["A", "B", "C"], answer: 2 }],
              },
            },
          ],
        },
      };

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockCurriculum));

      const result = await getDataStats();

      expect(result).toEqual({
        months: 2,
        weeks: 2,
        flashcards: 3,
        quizQuestions: 3,
      });
    });

    it("should return null when curriculum cannot be loaded", async () => {
      mockFs.readFile.mockRejectedValue(new Error("File not found"));

      const result = await getDataStats();

      expect(result).toBe(null);
    });

    it("should handle empty curriculum", async () => {
      mockFs.readFile.mockResolvedValue("{}");

      const result = await getDataStats();

      expect(result).toEqual({
        months: 0,
        weeks: 0,
        flashcards: 0,
        quizQuestions: 0,
      });
    });
  });

  describe("loadConsolidatedFlashcards", () => {
    it("loads CMA, CPA, and Finance decks with source track, skill, and href metadata", async () => {
      mockFs.readFile.mockImplementation(async (file) => {
        const p = String(file);
        if (p.includes("curriculum-cpa.json")) {
          return JSON.stringify({
            units: [
              {
                id: "far-u1",
                section: "FAR",
                unit: 1,
                title: "FAR Unit 1",
                weeks: [
                  {
                    id: "w1",
                    title: "FAR Week",
                    skills: ["financial-statements"],
                    flashcards: [{ front: "FAR front", back: "FAR back" }],
                    quiz: { id: "q", title: "q", questions: [] },
                  },
                ],
              },
            ],
          });
        }
        if (p.includes("curriculum-finance.json")) {
          return JSON.stringify({
            units: [
              {
                id: "finance-u1",
                unit: 1,
                title: "Finance Unit 1",
                weeks: [
                  {
                    id: "w1",
                    title: "Finance Week",
                    skills: ["tvm"],
                    flashcards: [{ front: "Finance front", back: "Finance back" }],
                    quiz: { id: "q", title: "q", questions: [] },
                  },
                ],
              },
            ],
          });
        }
        if (p.includes("cma-skills.json")) {
          return JSON.stringify({
            weeks: {
              "m1:w1": { skills: ["wip-schedule"] },
            },
          });
        }
        return JSON.stringify({
          m1: {
            id: "m1",
            title: "CMA Month 1",
            weeks: [
              {
                id: "w1",
                order: 1,
                title: "CMA Week",
                lessonHtml: "<p>CMA</p>",
                flashcards: [{ front: "CMA front", back: "CMA back" }],
                quiz: { id: "q", title: "q", questions: [] },
              },
            ],
          },
        });
      });

      const decks = await loadConsolidatedFlashcards();
      const cards = decks.flatMap((deck) => deck.cards);

      expect(cards).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            front: "CMA front",
            track: "cma",
            skills: ["wip-schedule"],
            href: "/learn/m1/w1",
            sourceId: "m1:w1:fc0",
          }),
          expect.objectContaining({
            front: "FAR front",
            track: "cpa",
            skills: ["financial-statements"],
            href: "/cpa/far-u1/w1",
            sourceId: "far-u1:w1:fc0",
          }),
          expect.objectContaining({
            front: "Finance front",
            track: "finance",
            skills: ["tvm"],
            href: "/finance/finance-u1/w1",
            sourceId: "finance-u1:w1:fc0",
          }),
        ])
      );
    });
  });
});
