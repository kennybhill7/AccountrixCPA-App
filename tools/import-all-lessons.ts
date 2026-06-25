#!/usr/bin/env node

/**
 * Comprehensive DOCX Lesson Import System for Accountrix
 *
 * This tool imports lesson content from DOCX files and converts them
 * into structured JSON format for the Accountrix application.
 *
 * Usage:
 *   npm run import:lessons
 *   npm run import:all
 */

import * as fs from "node:fs";
import * as path from "node:path";
import mammoth from "mammoth";
import TurndownService from "turndown";
import type { Month, Week, Question, Choice, Flashcard } from "../types/content.js";

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  lessonsDir: path.join(process.cwd(), "New Accountrix App", "Lessons"),
  outputDir: path.join(process.cwd(), "data"),
  contentDir: path.join(process.cwd(), "content"),

  files: {
    lessons: [
      {
        path: "Revised 1-4 (1).docx",
        months: [1, 2],
        weeks: [1, 2, 3, 4, 5, 6, 7, 8],
        name: "Lessons 1-4 (Months 1-2)",
      },
      {
        path: "Revised 5-8.docx",
        months: [3],
        weeks: [9, 10, 11, 12],
        name: "Lessons 5-8 (Month 3)",
      },
      {
        path: "Revised 9-12 (1).docx",
        months: [4],
        weeks: [13, 14, 15, 16],
        name: "Lessons 9-12 (Month 4)",
      },
    ],
    flashcards: [
      { path: "1-4 Flash Cards.docx", months: [1, 2], name: "Flashcards 1-4" },
      { path: "5-8 Flash Cards.docx", months: [3], name: "Flashcards 5-8" },
      { path: "9-12 Flash Cards.docx", months: [4], name: "Flashcards 9-12" },
    ],
  },
};

// ============================================================================
// TURNDOWN SERVICE CONFIGURATION
// ============================================================================

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

// Add custom rule for preserving code-like content
turndownService.addRule("codeBlock", {
  filter: function (node) {
    const text = node.textContent || "";
    return node.nodeName === "P" && text.includes("Dr.") && text.includes("Cr.");
  },
  replacement: function (content) {
    return "\n```\n" + content + "\n```\n";
  },
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function printBanner(message: string) {
  const width = 60;
  const padding = Math.max(0, Math.floor((width - message.length - 2) / 2));
  console.log("\n" + "═".repeat(width));
  console.log(
    "║" + " ".repeat(padding) + message + " ".repeat(width - padding - message.length - 2) + "║"
  );
  console.log("═".repeat(width) + "\n");
}

function printProgress(label: string, current: number, total: number) {
  const barWidth = 30;
  const progress = Math.floor((current / total) * barWidth);
  const bar = "█".repeat(progress) + "░".repeat(barWidth - progress);
  const percent = Math.floor((current / total) * 100);
  console.log(`${label}: [${bar}] ${percent}% (${current}/${total})`);
}

function estimateReadingTime(content: string): number {
  // Average reading speed: 200 words per minute
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
}

function cleanHtml(html: string): string {
  // Remove excessive whitespace
  let cleaned = html.replace(/\s+/g, " ");

  // Remove empty paragraphs
  cleaned = cleaned.replace(/<p>\s*<\/p>/g, "");

  // Normalize headings
  cleaned = cleaned.replace(/<h(\d)>\s*<\/h\1>/g, "");

  return cleaned.trim();
}

async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

// ============================================================================
// DOCX EXTRACTION
// ============================================================================

interface ExtractedContent {
  html: string;
  markdown: string;
  warnings: string[];
}

async function extractDocxContent(filePath: string): Promise<ExtractedContent> {
  try {
    const result = await mammoth.convertToHtml({ path: filePath });
    const html = cleanHtml(result.value);
    const markdown = turndownService.turndown(html);

    return {
      html,
      markdown,
      warnings: result.messages.map((m) => m.message),
    };
  } catch (error) {
    throw new Error(`Failed to extract content from ${filePath}: ${error}`);
  }
}

// ============================================================================
// CONTENT PARSING
// ============================================================================

interface ParsedWeek {
  weekNumber: number;
  title: string;
  content: string;
  html: string;
  learningObjectives: string[];
  keyTerms: string[];
  examples: string[];
}

interface ParsedMonth {
  monthNumber: number;
  title: string;
  weeks: ParsedWeek[];
}

function extractLearningObjectives(content: string): string[] {
  const objectives: string[] = [];

  // Look for common patterns
  const patterns = [
    /Learning Objectives?[:\s]+(.+?)(?=\n\n|$)/gis,
    /By the end of this (?:lesson|week), you will be able to[:\s]+(.+?)(?=\n\n|$)/gis,
    /Objectives?[:\s]+(.+?)(?=\n\n|$)/gis,
  ];

  for (const pattern of patterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      const text = match[1];
      // Split by bullet points or line breaks
      const items = text.split(/[-•*]\s+/).filter((s) => s.trim().length > 10);
      objectives.push(...items.map((s) => s.trim()));
    }
  }

  return [...new Set(objectives)]; // Remove duplicates
}

function extractKeyTerms(content: string): string[] {
  const terms: string[] = [];

  // Look for bold terms or definitions
  const boldPattern = /\*\*([A-Z][a-zA-Z\s]{2,30})\*\*/g;
  const matches = content.matchAll(boldPattern);

  for (const match of matches) {
    const term = match[1].trim();
    if (term.length > 3 && term.length < 50) {
      terms.push(term);
    }
  }

  return [...new Set(terms)].slice(0, 20); // Limit to 20 unique terms
}

function extractExamples(content: string): string[] {
  const examples: string[] = [];

  // Look for example sections
  const examplePattern = /Example[:\s]+(.+?)(?=\n\n|Example|$)/gis;
  const matches = content.matchAll(examplePattern);

  for (const match of matches) {
    const example = match[1].trim();
    if (example.length > 50) {
      examples.push(example.substring(0, 200) + "...");
    }
  }

  return examples.slice(0, 5); // Limit to 5 examples
}

function parseWeekContent(markdown: string, html: string): ParsedWeek[] {
  const weeks: ParsedWeek[] = [];

  // Try to split by week headers
  const weekPattern = /(?:^|\n)(?:#+\s*)?Week\s+(\d+)[:\s]*(.*?)(?=\n|$)/gim;
  const weekMatches = Array.from(markdown.matchAll(weekPattern));

  if (weekMatches.length === 0) {
    // No week structure found, treat as single week
    return [
      {
        weekNumber: 1,
        title: "Construction CFO Fundamentals",
        content: markdown,
        html: html,
        learningObjectives: extractLearningObjectives(markdown),
        keyTerms: extractKeyTerms(markdown),
        examples: extractExamples(markdown),
      },
    ];
  }

  // Process each week
  for (let i = 0; i < weekMatches.length; i++) {
    const match = weekMatches[i];
    const weekNum = parseInt(match[1]);
    const weekTitle = match[2].trim() || `Week ${weekNum}`;

    // Get content for this week
    const startIndex = match.index! + match[0].length;
    const nextMatch = weekMatches[i + 1];
    const endIndex = nextMatch ? nextMatch.index! : markdown.length;
    const weekContent = markdown.slice(startIndex, endIndex).trim();

    // Extract corresponding HTML
    const htmlStart = html.indexOf("<h3>Week " + weekNum);
    const htmlEnd =
      i < weekMatches.length - 1 ? html.indexOf("<h3>Week " + (weekNum + 1)) : html.length;
    const weekHtml =
      htmlStart >= 0 ? html.slice(htmlStart, htmlEnd > 0 ? htmlEnd : html.length) : html;

    weeks.push({
      weekNumber: weekNum,
      title: weekTitle,
      content: weekContent,
      html: weekHtml,
      learningObjectives: extractLearningObjectives(weekContent),
      keyTerms: extractKeyTerms(weekContent),
      examples: extractExamples(weekContent),
    });
  }

  return weeks;
}

function parseMonthsFromContent(
  markdown: string,
  html: string,
  expectedMonths: number[]
): ParsedMonth[] {
  const months: ParsedMonth[] = [];

  // Try to split by month headers
  const monthPattern = /(?:^|\n)(?:#+\s*)?Month\s+(\d+)[:\s]*(.*?)(?=\n|$)/gim;
  const monthMatches = Array.from(markdown.matchAll(monthPattern));

  if (monthMatches.length === 0) {
    // No month structure, parse weeks directly
    const weeks = parseWeekContent(markdown, html);

    // Distribute weeks across expected months (4 weeks per month)
    const weeksPerMonth = Math.ceil(weeks.length / expectedMonths.length);

    for (let i = 0; i < expectedMonths.length; i++) {
      const monthNum = expectedMonths[i];
      const startWeek = i * weeksPerMonth;
      const endWeek = Math.min((i + 1) * weeksPerMonth, weeks.length);
      const monthWeeks = weeks.slice(startWeek, endWeek);

      if (monthWeeks.length > 0) {
        months.push({
          monthNumber: monthNum,
          title: `Month ${monthNum}: Construction CFO Fundamentals`,
          weeks: monthWeeks,
        });
      }
    }

    return months;
  }

  // Process each month
  for (let i = 0; i < monthMatches.length; i++) {
    const match = monthMatches[i];
    const monthNum = parseInt(match[1]);

    // Only process expected months
    if (!expectedMonths.includes(monthNum)) {
      continue;
    }

    const monthTitle = match[2].trim() || `Month ${monthNum}: Construction CFO Fundamentals`;

    // Get content for this month
    const startIndex = match.index! + match[0].length;
    const nextMatch = monthMatches[i + 1];
    const endIndex = nextMatch ? nextMatch.index! : markdown.length;
    const monthMarkdown = markdown.slice(startIndex, endIndex);

    // Extract corresponding HTML
    const htmlStart = html.indexOf("<h3>Month " + monthNum);
    const htmlEnd =
      i < monthMatches.length - 1 ? html.indexOf("<h3>Month " + (monthNum + 1)) : html.length;
    const monthHtml =
      htmlStart >= 0 ? html.slice(htmlStart, htmlEnd > 0 ? htmlEnd : html.length) : html;

    const weeks = parseWeekContent(monthMarkdown, monthHtml);

    months.push({
      monthNumber: monthNum,
      title: monthTitle,
      weeks,
    });
  }

  return months;
}

// ============================================================================
// QUIZ GENERATION
// ============================================================================

function generatePlaceholderQuiz(
  monthNum: number,
  weekNum: number
): { id: string; title: string; questions: Question[] } {
  return {
    id: `m${monthNum}-w${weekNum}-quiz`,
    title: `Month ${monthNum}, Week ${weekNum} Quiz`,
    questions: [
      {
        id: `m${monthNum}w${weekNum}q1`,
        prompt: "Which accounting standard governs revenue recognition in construction?",
        choices: [
          { id: "a", text: "ASC 605" },
          { id: "b", text: "ASC 606" },
          { id: "c", text: "ASC 842" },
          { id: "d", text: "ASC 810" },
        ],
        correctId: "b",
        explanation:
          "ASC 606 is the current standard for revenue recognition across all industries, including construction.",
      },
    ],
  };
}

// ============================================================================
// FLASHCARD EXTRACTION
// ============================================================================

interface ParsedFlashcard {
  monthId: string;
  q: string;
  a: string;
  ref?: string;
}

function parseFlashcardsFromContent(markdown: string, months: number[]): ParsedFlashcard[] {
  const flashcards: ParsedFlashcard[] = [];

  // Split by lines
  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let currentQ = "";
  let currentA = "";
  let cardIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip headers
    if (line.startsWith("#")) {
      continue;
    }

    // Detect question patterns
    const isQuestion =
      line.endsWith("?") ||
      line.match(/^\d+[\.\)]\s/) || // Numbered list
      line.includes("**") || // Bold text
      line.toLowerCase().includes("what is") ||
      line.toLowerCase().includes("define") ||
      line.toLowerCase().includes("explain");

    if (isQuestion) {
      // Save previous flashcard
      if (currentQ && currentA) {
        const monthId =
          months[Math.floor(cardIndex / Math.max(1, Math.floor(100 / months.length)))].toString();
        flashcards.push({
          monthId,
          q: currentQ.replace(/\*\*/g, "").trim(),
          a: currentA.trim(),
        });
        cardIndex++;
      }

      // Start new question
      currentQ = line
        .replace(/^\d+[\.\)]\s/, "")
        .replace(/\*\*/g, "")
        .trim();
      currentA = "";
    } else if (currentQ) {
      // This is the answer
      if (currentA) {
        currentA += " " + line;
      } else {
        currentA = line;
      }
    }
  }

  // Save final flashcard
  if (currentQ && currentA) {
    const monthId =
      months[Math.floor(cardIndex / Math.max(1, Math.floor(100 / months.length)))].toString();
    flashcards.push({
      monthId,
      q: currentQ,
      a: currentA,
    });
  }

  return flashcards;
}

// ============================================================================
// DATA FORMATTING
// ============================================================================

function formatMonthData(month: ParsedMonth): Month {
  const weeks: Week[] = month.weeks.map((week, index) => ({
    id: `w${index + 1}` as "w1" | "w2" | "w3" | "w4",
    title: week.title,
    html: week.html || `<div>${week.content}</div>`,
    quiz: generatePlaceholderQuiz(month.monthNumber, week.weekNumber),
  }));

  return {
    id: `m${month.monthNumber}`,
    title: month.title,
    weeks,
  };
}

// ============================================================================
// IMPORT STATISTICS
// ============================================================================

interface ImportStats {
  lessonsProcessed: number;
  weeksCreated: number;
  flashcardsCreated: number;
  learningObjectives: number;
  keyTerms: number;
  examples: number;
  estimatedMinutes: number;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// MAIN IMPORT FUNCTIONS
// ============================================================================

async function importLessons(): Promise<ImportStats> {
  const stats: ImportStats = {
    lessonsProcessed: 0,
    weeksCreated: 0,
    flashcardsCreated: 0,
    learningObjectives: 0,
    keyTerms: 0,
    examples: 0,
    estimatedMinutes: 0,
    errors: [],
    warnings: [],
  };

  printBanner("LESSON IMPORT");

  for (const fileConfig of CONFIG.files.lessons) {
    const filePath = path.join(CONFIG.lessonsDir, fileConfig.path);

    console.log(`\nProcessing: ${fileConfig.name}`);
    console.log(`File: ${fileConfig.path}`);

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        stats.errors.push(`File not found: ${filePath}`);
        console.log(`  ❌ File not found`);
        continue;
      }

      // Extract content
      console.log(`  📄 Extracting content...`);
      const extracted = await extractDocxContent(filePath);

      if (extracted.warnings.length > 0) {
        stats.warnings.push(...extracted.warnings);
        console.log(`  ⚠️  ${extracted.warnings.length} warnings`);
      }

      // Parse months and weeks
      console.log(`  📖 Parsing structure...`);
      const months = parseMonthsFromContent(extracted.markdown, extracted.html, fileConfig.months);

      console.log(
        `  ✅ Found ${months.length} months, ${months.reduce((sum, m) => sum + m.weeks.length, 0)} weeks`
      );

      // Save each month
      for (const month of months) {
        const monthData = formatMonthData(month);
        const outputPath = path.join(CONFIG.outputDir, `m${month.monthNumber}.json`);

        await fs.promises.writeFile(outputPath, JSON.stringify(monthData, null, 2), "utf-8");

        console.log(`  💾 Saved: data/m${month.monthNumber}.json`);

        // Update stats
        stats.lessonsProcessed++;
        stats.weeksCreated += month.weeks.length;

        for (const week of month.weeks) {
          stats.learningObjectives += week.learningObjectives.length;
          stats.keyTerms += week.keyTerms.length;
          stats.examples += week.examples.length;
          stats.estimatedMinutes += estimateReadingTime(week.content);
        }
      }
    } catch (error) {
      const errorMsg = `Error processing ${fileConfig.name}: ${error}`;
      stats.errors.push(errorMsg);
      console.error(`  ❌ ${errorMsg}`);
    }
  }

  return stats;
}

async function importFlashcards(): Promise<Flashcard[]> {
  printBanner("FLASHCARD IMPORT");

  const allFlashcards: Flashcard[] = [];
  let cardIdCounter = 1;

  for (const fileConfig of CONFIG.files.flashcards) {
    const filePath = path.join(CONFIG.lessonsDir, fileConfig.path);

    console.log(`\nProcessing: ${fileConfig.name}`);
    console.log(`File: ${fileConfig.path}`);

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.log(`  ❌ File not found`);
        continue;
      }

      // Extract content
      console.log(`  📄 Extracting content...`);
      const extracted = await extractDocxContent(filePath);

      // Parse flashcards
      console.log(`  🧠 Parsing flashcards...`);
      const parsedCards = parseFlashcardsFromContent(extracted.markdown, fileConfig.months);

      // Format flashcards
      for (const card of parsedCards) {
        const flashcard: Flashcard = {
          id: `m${card.monthId.padStart(2, "0")}-fc-${cardIdCounter.toString().padStart(3, "0")}`,
          monthId: card.monthId,
          q: card.q,
          a: card.a,
          ref: card.ref,
        };
        allFlashcards.push(flashcard);
        cardIdCounter++;
      }

      console.log(`  ✅ Extracted ${parsedCards.length} flashcards`);
    } catch (error) {
      console.error(`  ❌ Error: ${error}`);
    }
  }

  // Save consolidated flashcards
  if (allFlashcards.length > 0) {
    const outputPath = path.join(CONFIG.outputDir, "flashcards.json");
    await fs.promises.writeFile(outputPath, JSON.stringify(allFlashcards, null, 2), "utf-8");
    console.log(`\n  💾 Saved: data/flashcards.json (${allFlashcards.length} cards)`);
  }

  return allFlashcards;
}

// ============================================================================
// VALIDATION
// ============================================================================

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateMonth(month: Month): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!month.title || month.title.trim().length === 0) {
    errors.push(`Month ${month.id}: Missing title`);
  }

  if (!month.weeks || month.weeks.length === 0) {
    errors.push(`Month ${month.id}: No weeks found`);
  } else {
    month.weeks.forEach((week, index) => {
      if (!week.html || week.html.length < 100) {
        warnings.push(
          `Month ${month.id}, Week ${index + 1}: Minimal content (${week.html?.length || 0} chars)`
        );
      }

      if (!week.quiz || !week.quiz.questions || week.quiz.questions.length === 0) {
        warnings.push(`Month ${month.id}, Week ${index + 1}: No quiz questions (placeholder)`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

async function validateImportedData(): Promise<ValidationResult> {
  printBanner("VALIDATION");

  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Validate each month file
  for (let i = 1; i <= 4; i++) {
    const filePath = path.join(CONFIG.outputDir, `m${i}.json`);

    if (!fs.existsSync(filePath)) {
      allWarnings.push(`Month ${i}: File not found`);
      continue;
    }

    try {
      const content = await fs.promises.readFile(filePath, "utf-8");
      const month: Month = JSON.parse(content);

      const result = validateMonth(month);
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);

      console.log(`  ${result.valid ? "✅" : "⚠️ "} Month ${i}: ${month.weeks.length} weeks`);
    } catch (error) {
      allErrors.push(`Month ${i}: Failed to read/parse - ${error}`);
    }
  }

  // Validate flashcards
  const flashcardsPath = path.join(CONFIG.outputDir, "flashcards.json");
  if (fs.existsSync(flashcardsPath)) {
    try {
      const content = await fs.promises.readFile(flashcardsPath, "utf-8");
      const flashcards: Flashcard[] = JSON.parse(content);
      console.log(`  ✅ Flashcards: ${flashcards.length} cards`);
    } catch (error) {
      allErrors.push(`Flashcards: Failed to read/parse - ${error}`);
    }
  } else {
    allWarnings.push("Flashcards: File not found");
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.clear();

  printBanner("ACCOUNTRIX LESSON IMPORTER");

  console.log("Starting comprehensive lesson import...\n");
  console.log(`Source directory: ${CONFIG.lessonsDir}`);
  console.log(`Output directory: ${CONFIG.outputDir}`);

  try {
    // Ensure output directory exists
    await ensureDirectory(CONFIG.outputDir);

    // Import lessons
    const lessonStats = await importLessons();

    // Import flashcards
    const flashcards = await importFlashcards();

    // Validate imported data
    const validation = await validateImportedData();

    // Print summary
    printBanner("IMPORT SUMMARY");

    console.log("📊 Statistics:");
    console.log(`  Lessons processed: ${lessonStats.lessonsProcessed}`);
    console.log(`  Weeks created: ${lessonStats.weeksCreated}`);
    console.log(`  Flashcards created: ${flashcards.length}`);
    console.log(`  Learning objectives: ${lessonStats.learningObjectives}`);
    console.log(`  Key terms: ${lessonStats.keyTerms}`);
    console.log(`  Examples: ${lessonStats.examples}`);
    console.log(`  Estimated reading time: ${lessonStats.estimatedMinutes} minutes`);

    if (validation.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${validation.warnings.length}):`);
      validation.warnings.forEach((w) => console.log(`  - ${w}`));
    }

    if (validation.errors.length > 0 || lessonStats.errors.length > 0) {
      console.log(`\n❌ Errors (${validation.errors.length + lessonStats.errors.length}):`);
      [...lessonStats.errors, ...validation.errors].forEach((e) => console.log(`  - ${e}`));
    }

    if (validation.valid && lessonStats.errors.length === 0) {
      console.log("\n✅ Import completed successfully!");
      console.log("\n📝 Next steps:");
      console.log("  1. Review generated JSON files in data/ directory");
      console.log("  2. Manually create quiz questions for each week");
      console.log("  3. Review and enhance flashcards");
      console.log("  4. Run: npm run validate:content");
      console.log("  5. Start the app: npm run dev");
    } else {
      console.log("\n⚠️  Import completed with issues. Please review errors above.");
      process.exit(1);
    }
  } catch (error) {
    console.error("\n💥 Import failed:", error);
    console.error("Stack:", error instanceof Error ? error.stack : "No stack trace");
    process.exit(1);
  }
}

// ============================================================================
// RUN
// ============================================================================

if (require.main === module) {
  main().catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });
}

export { importLessons, importFlashcards, validateImportedData };
