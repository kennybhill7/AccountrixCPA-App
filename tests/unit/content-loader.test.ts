import { describe, it, expect, vi, beforeEach } from "vitest";
import { hasData, getDataStats, loadMonth } from "@/lib/content-loader";
import fs from "fs/promises";

// Mock fs module
vi.mock("fs/promises", () => ({
  default: {
    access: vi.fn(),
    readFile: vi.fn(),
  },
  access: vi.fn(),
  readFile: vi.fn(),
}));

const mockFs = vi.mocked(fs);

describe("Content Loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
