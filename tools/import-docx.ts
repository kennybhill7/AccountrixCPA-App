#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import mammoth from "mammoth";
import TurndownService from "turndown";
import * as yaml from "js-yaml";

interface LessonContent {
  month: number;
  week: number;
  title: string;
  estMinutes: number;
  tags: string[];
  content: string;
}

interface FlashcardContent {
  deck: string;
  cards: Array<{
    q: string;
    a: string;
  }>;
}

interface QuizContent {
  title: string;
  items: Array<{
    type: "mcq" | "calc";
    q: string;
    choices?: string[];
    answer: number | string;
    why: string;
    tolerance?: number;
  }>;
}

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
  strongDelimiter: "**",
});

// Configure turndown to preserve tables
turndownService.addRule("table", {
  filter: "table",
  replacement: function (content, node) {
    const table = node as HTMLTableElement;
    let markdown = "\n";

    for (let i = 0; i < table.rows.length; i++) {
      const row = table.rows[i];
      let rowMd = "|";

      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];
        rowMd += ` ${cell.textContent?.trim() || ""} |`;
      }

      markdown += rowMd + "\n";

      // Add header separator after first row
      if (i === 0) {
        let separatorMd = "|";
        for (let j = 0; j < row.cells.length; j++) {
          separatorMd += " --- |";
        }
        markdown += separatorMd + "\n";
      }
    }

    return markdown + "\n";
  },
});

// Add custom rule for preserving journal entries and code blocks
turndownService.addRule("codeBlock", {
  filter: function (node) {
    return (
      node.nodeName === "P" &&
      node.textContent?.includes("Dr.") &&
      node.textContent?.includes("Cr.")
    );
  },
  replacement: function (content) {
    return "\n```\n" + content + "\n```\n";
  },
});

async function extractDocxContent(filePath: string): Promise<string> {
  try {
    const result = await mammoth.convertToHtml({ path: filePath });
    if (result.messages.length > 0) {
      console.warn(`Warnings for ${filePath}:`, result.messages);
    }
    return result.value;
  } catch (error) {
    throw new Error(`Failed to extract content from ${filePath}: ${error}`);
  }
}

function parseMonthWeekContent(html: string, fileMonthRange: number[]): LessonContent[] {
  const lessons: LessonContent[] = [];

  // Convert HTML to markdown
  const markdown = turndownService.turndown(html);

  // Split by month headers (more flexible patterns)
  const monthPatterns = [
    /(?:^|\n)(?:#+\s*)?MONTH\s*(\d+)[:\s]*(.*?)(?=\n|$)/gim,
    /(?:^|\n)(?:#+\s*)?Month\s*(\d+)[:\s]*(.*?)(?=\n|$)/gim,
    /(?:^|\n)(?:#+\s*)?M(\d+)[:\s]*(.*?)(?=\n|$)/gim,
  ];

  let monthMatches: RegExpMatchArray[] = [];
  for (const pattern of monthPatterns) {
    const matches = Array.from(markdown.matchAll(pattern));
    if (matches.length > 0) {
      monthMatches = matches;
      break;
    }
  }

  if (monthMatches.length === 0) {
    console.warn("No month headers found, treating entire content as single lesson");

    // If no month structure, create lessons for expected months
    for (const monthNum of fileMonthRange) {
      const lesson: LessonContent = {
        month: monthNum,
        week: 1,
        title: `Month ${monthNum}: Construction CFO Fundamentals`,
        estMinutes: 30,
        tags: ["construction", "cfo", "finance"],
        content: markdown.slice(0, Math.floor(markdown.length / fileMonthRange.length)),
      };
      lessons.push(lesson);
    }
    return lessons;
  }

  // Process each month
  for (let i = 0; i < monthMatches.length; i++) {
    const match = monthMatches[i];
    const monthNum = parseInt(match[1]);
    const monthTitle = match[2] || `Month ${monthNum}`;

    // Only process if this month is in the expected range for this file
    if (!fileMonthRange.includes(monthNum)) {
      continue;
    }

    // Get content for this month (until next month or end)
    const startIndex = match.index! + match[0].length;
    const nextMatch = monthMatches[i + 1];
    const endIndex = nextMatch ? nextMatch.index! : markdown.length;
    const monthContent = markdown.slice(startIndex, endIndex);

    // Split by week headers
    const weekPatterns = [
      /(?:^|\n)(?:#+\s*)?WEEK\s*(\d+)[:\s]*(.*?)(?=\n|$)/gim,
      /(?:^|\n)(?:#+\s*)?Week\s*(\d+)[:\s]*(.*?)(?=\n|$)/gim,
      /(?:^|\n)(?:#+\s*)?W(\d+)[:\s]*(.*?)(?=\n|$)/gim,
    ];

    let weekMatches: RegExpMatchArray[] = [];
    for (const pattern of weekPatterns) {
      const matches = Array.from(monthContent.matchAll(pattern));
      if (matches.length > 0) {
        weekMatches = matches;
        break;
      }
    }

    if (weekMatches.length === 0) {
      // No week structure, create single week
      const lesson: LessonContent = {
        month: monthNum,
        week: 1,
        title: monthTitle.trim(),
        estMinutes: 30,
        tags: ["construction", "cfo", "finance"],
        content: monthContent.trim(),
      };
      lessons.push(lesson);
    } else {
      // Process each week
      for (let j = 0; j < weekMatches.length; j++) {
        const weekMatch = weekMatches[j];
        const weekNum = parseInt(weekMatch[1]);
        const weekTitle = weekMatch[2] || `Week ${weekNum}`;

        const weekStartIndex = weekMatch.index! + weekMatch[0].length;
        const nextWeekMatch = weekMatches[j + 1];
        const weekEndIndex = nextWeekMatch ? nextWeekMatch.index! : monthContent.length;
        const weekContent = monthContent.slice(weekStartIndex, weekEndIndex);

        const lesson: LessonContent = {
          month: monthNum,
          week: weekNum,
          title: `${monthTitle.trim()}: ${weekTitle.trim()}`,
          estMinutes: 35,
          tags: ["construction", "cfo", "finance"],
          content: weekContent.trim(),
        };
        lessons.push(lesson);
      }
    }
  }

  return lessons;
}

function parseFlashcards(html: string, fileMonthRange: number[]): FlashcardContent {
  const markdown = turndownService.turndown(html);
  const cards: Array<{ q: string; a: string }> = [];

  // Split content into potential Q&A pairs
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let currentQ = "";
  let currentA = "";
  let inAnswer = false;

  for (const line of lines) {
    // Skip headers and very short lines
    if (line.startsWith("#") || line.length < 5) {
      continue;
    }

    // Detect questions (bold text, ends with ?, or contains key question words)
    const isQuestion =
      line.includes("**") ||
      line.endsWith("?") ||
      line.toLowerCase().includes("what is") ||
      line.toLowerCase().includes("define") ||
      line.toLowerCase().includes("explain") ||
      line.toLowerCase().includes("how") ||
      line.toLowerCase().includes("why");

    if (isQuestion && !inAnswer) {
      // Save previous Q&A if complete
      if (currentQ && currentA) {
        cards.push({
          q: currentQ.trim(),
          a: currentA.trim(),
        });
      }

      // Start new question
      currentQ = line.replace(/\*\*/g, "").trim();
      currentA = "";
      inAnswer = false;
    } else if (currentQ && !isQuestion) {
      // This is part of the answer
      if (currentA) {
        currentA += " " + line;
      } else {
        currentA = line;
      }
      inAnswer = true;
    }
  }

  // Save final Q&A
  if (currentQ && currentA) {
    cards.push({
      q: currentQ.trim(),
      a: currentA.trim(),
    });
  }

  // If no Q&A pairs found, create some from content
  if (cards.length === 0) {
    const sentences = markdown
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);
    for (let i = 0; i < Math.min(sentences.length, 10); i += 2) {
      if (sentences[i] && sentences[i + 1]) {
        cards.push({
          q: `What does this mean: "${sentences[i].substring(0, 50)}..."?`,
          a: sentences[i + 1],
        });
      }
    }
  }

  return {
    deck: `Months ${fileMonthRange[0]}-${fileMonthRange[fileMonthRange.length - 1]}`,
    cards,
  };
}

function generateSampleQuiz(monthNum: number, weekNum: number): QuizContent {
  return {
    title: `M${monthNum}W${weekNum} Quiz`,
    items: [
      {
        type: "mcq",
        q: `Which accounting standard governs revenue recognition in construction?`,
        choices: ["ASC 605", "ASC 606", "ASC 842", "ASC 810"],
        answer: 1,
        why: "ASC 606 is the current standard for revenue recognition, replacing ASC 605.",
      },
      {
        type: "calc",
        q: `If a project has incurred $2,000,000 in costs and total estimated costs are $5,000,000, what is the percentage of completion?`,
        answer: 40,
        tolerance: 1,
        why: "Percentage of completion = Costs incurred / Total estimated costs = $2M / $5M = 40%",
      },
    ],
  };
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Directory already exists or other error
  }
}

async function writeContentFiles(
  lessons: LessonContent[],
  flashcards: FlashcardContent
): Promise<void> {
  const contentDir = path.join(process.cwd(), "content");
  await ensureDirectoryExists(contentDir);

  // Group lessons by month
  const lessonsByMonth: { [month: number]: LessonContent[] } = {};
  for (const lesson of lessons) {
    if (!lessonsByMonth[lesson.month]) {
      lessonsByMonth[lesson.month] = [];
    }
    lessonsByMonth[lesson.month].push(lesson);
  }

  // Write lesson files
  for (const [monthNum, monthLessons] of Object.entries(lessonsByMonth)) {
    const monthDir = path.join(contentDir, `m${monthNum.padStart(2, "0")}`);
    await ensureDirectoryExists(monthDir);

    // Group by week
    const lessonsByWeek: { [week: number]: LessonContent[] } = {};
    for (const lesson of monthLessons) {
      if (!lessonsByWeek[lesson.week]) {
        lessonsByWeek[lesson.week] = [];
      }
      lessonsByWeek[lesson.week].push(lesson);
    }

    for (const [weekNum, weekLessons] of Object.entries(lessonsByWeek)) {
      const weekDir = path.join(monthDir, `w${weekNum.padStart(2, "0")}`);
      await ensureDirectoryExists(weekDir);

      // Combine all lessons for this week
      const combinedLesson = weekLessons[0];
      const combinedContent = weekLessons.map((l) => l.content).join("\n\n");

      // Write lesson.mdx
      const frontMatter = {
        month: parseInt(monthNum),
        week: parseInt(weekNum),
        title: combinedLesson.title,
        estMinutes: combinedLesson.estMinutes,
        tags: combinedLesson.tags,
      };

      const mdxContent = `---\n${yaml.dump(frontMatter)}---\n\n${combinedContent}`;
      await fs.promises.writeFile(path.join(weekDir, "lesson.mdx"), mdxContent, "utf8");

      // Write empty flashcards.yaml as placeholder
      const emptyFlashcards = {
        deck: `Month ${monthNum} • Week ${weekNum}`,
        cards: [],
      };
      await fs.promises.writeFile(
        path.join(weekDir, "flashcards.yaml"),
        yaml.dump(emptyFlashcards),
        "utf8"
      );

      // Write quiz.json
      const quiz = generateSampleQuiz(parseInt(monthNum), parseInt(weekNum));
      await fs.promises.writeFile(
        path.join(weekDir, "quiz.json"),
        JSON.stringify(quiz, null, 2),
        "utf8"
      );

      // Write test.json (copy of quiz for now)
      await fs.promises.writeFile(
        path.join(weekDir, "test.json"),
        JSON.stringify({ ...quiz, title: quiz.title.replace("Quiz", "Test") }, null, 2),
        "utf8"
      );
    }
  }

  // Write consolidated flashcards file
  if (flashcards.cards.length > 0) {
    const flashcardsDir = path.join(contentDir, "flashcards");
    await ensureDirectoryExists(flashcardsDir);

    await fs.promises.writeFile(
      path.join(flashcardsDir, `${flashcards.deck.toLowerCase().replace(/[^a-z0-9]/g, "-")}.yaml`),
      yaml.dump(flashcards),
      "utf8"
    );
  }

  console.log(`✅ Content written to ${contentDir}`);
}

interface Arguments {
  m14?: string;
  m58?: string;
  m912?: string;
  fc14?: string;
  fc58?: string;
  fc912?: string;
}

async function main() {
  const argv = (await yargs(hideBin(process.argv))
    .option("m14", {
      alias: "months-1-4",
      type: "string",
      description: "Path to Months 1-4 DOCX file",
    })
    .option("m58", {
      alias: "months-5-8",
      type: "string",
      description: "Path to Months 5-8 DOCX file",
    })
    .option("m912", {
      alias: "months-9-12",
      type: "string",
      description: "Path to Months 9-12 DOCX file",
    })
    .option("fc14", {
      alias: "flashcards-1-4",
      type: "string",
      description: "Path to Flashcards 1-4 DOCX file",
    })
    .option("fc58", {
      alias: "flashcards-5-8",
      type: "string",
      description: "Path to Flashcards 5-8 DOCX file",
    })
    .option("fc912", {
      alias: "flashcards-9-12",
      type: "string",
      description: "Path to Flashcards 9-12 DOCX file",
    })
    .help().argv) as Arguments;

  console.log("🚀 Starting DOCX import process...\n");

  const allLessons: LessonContent[] = [];
  const allFlashcards: FlashcardContent[] = [];

  // Process lesson files
  const lessonFiles = [
    { path: argv.m14, range: [1, 2, 3, 4], name: "Months 1-4" },
    { path: argv.m58, range: [5, 6, 7, 8], name: "Months 5-8" },
    { path: argv.m912, range: [9, 10, 11, 12], name: "Months 9-12" },
  ];

  for (const file of lessonFiles) {
    if (file.path) {
      console.log(`📖 Processing ${file.name}: ${file.path}`);
      try {
        const html = await extractDocxContent(file.path);
        const lessons = parseMonthWeekContent(html, file.range);
        allLessons.push(...lessons);
        console.log(`   ✅ Extracted ${lessons.length} lessons`);
      } catch (error) {
        console.error(`   ❌ Error processing ${file.name}:`, error);
      }
    }
  }

  // Process flashcard files
  const flashcardFiles = [
    { path: argv.fc14, range: [1, 2, 3, 4], name: "Flashcards 1-4" },
    { path: argv.fc58, range: [5, 6, 7, 8], name: "Flashcards 5-8" },
    { path: argv.fc912, range: [9, 10, 11, 12], name: "Flashcards 9-12" },
  ];

  for (const file of flashcardFiles) {
    if (file.path) {
      console.log(`🧠 Processing ${file.name}: ${file.path}`);
      try {
        const html = await extractDocxContent(file.path);
        const flashcards = parseFlashcards(html, file.range);
        allFlashcards.push(flashcards);
        console.log(`   ✅ Extracted ${flashcards.cards.length} flashcards`);
      } catch (error) {
        console.error(`   ❌ Error processing ${file.name}:`, error);
      }
    }
  }

  // Combine all flashcards
  const combinedFlashcards: FlashcardContent = {
    deck: "Complete Construction CFO Course",
    cards: allFlashcards.flatMap((fc) => fc.cards),
  };

  // Write all content files
  if (allLessons.length > 0 || combinedFlashcards.cards.length > 0) {
    await writeContentFiles(allLessons, combinedFlashcards);

    console.log("\n📊 Import Summary:");
    console.log(`   Lessons created: ${allLessons.length}`);
    console.log(`   Flashcards created: ${combinedFlashcards.cards.length}`);
    console.log(
      `   Months covered: ${Math.min(...allLessons.map((l) => l.month))} - ${Math.max(...allLessons.map((l) => l.month))}`
    );
    console.log("\n🎉 Import completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Run: npm run validate:content");
    console.log("2. Start the app: npm run dev");
  } else {
    console.log("\n⚠️  No content was extracted. Please check your file paths.");
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("💥 Import failed:", error);
    process.exit(1);
  });
}
