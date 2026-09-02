#!/usr/bin/env node

/**
 * Simple DOCX Lesson Import (JavaScript version)
 * Bypasses TypeScript compilation issues
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mammoth = require("mammoth");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const TurndownService = require("turndown").default;

// Configuration
const CONFIG = {
  lessonsDir: path.join(__dirname, "..", "New Accountrix App", "Lessons"),
  outputDir: path.join(__dirname, "..", "data"),

  files: [
    {
      path: "Revised 1-4 (1).docx",
      months: [1, 2],
      name: "Lessons 1-4",
    },
    {
      path: "Revised 5-8.docx",
      months: [3],
      name: "Lessons 5-8",
    },
    {
      path: "Revised 9-12 (1).docx",
      months: [4],
      name: "Lessons 9-12",
    },
  ],
};

// Turndown service
const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
});

// Add table rule
turndownService.addRule("table", {
  filter: "table",
  replacement: function (content, node) {
    let markdown = "\n";

    for (let i = 0; i < node.rows.length; i++) {
      const row = node.rows[i];
      let rowMd = "|";

      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];
        rowMd += ` ${(cell.textContent || "").trim()} |`;
      }

      markdown += rowMd + "\n";

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

// Extract content from DOCX
async function extractDocx(filePath) {
  console.log(`  📄 Reading: ${path.basename(filePath)}`);

  try {
    const result = await mammoth.convertToHtml({ path: filePath });
    const html = result.value;
    const markdown = turndownService.turndown(html);

    return { html, markdown, warnings: result.messages };
  } catch (error) {
    throw new Error(`Failed to extract: ${error.message}`);
  }
}

// Parse weeks from content
function parseWeeks(html, markdown) {
  const weeks = [];

  // Try to find Week headers
  const weekPattern = /Week\s+(\d+)[:\s]*(.*?)(?=\n|$)/gim;
  const matches = Array.from(markdown.matchAll(weekPattern));

  if (matches.length === 0) {
    // No week structure, create single week
    return [
      {
        id: "w1",
        title: "Construction CFO Fundamentals",
        html: html,
        quiz: { id: "quiz-1", title: "Week 1 Quiz", questions: [] },
      },
    ];
  }

  // Parse each week
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const weekNum = parseInt(match[1]);
    const weekTitle = match[2].trim() || `Week ${weekNum}`;

    const startIndex = match.index + match[0].length;
    const nextMatch = matches[i + 1];
    const endIndex = nextMatch ? nextMatch.index : markdown.length;
    const weekContent = markdown.slice(startIndex, endIndex).trim();

    // Find corresponding HTML
    const htmlStart = html.indexOf(`<h3>Week ${weekNum}`);
    const htmlEnd = i < matches.length - 1 ? html.indexOf(`<h3>Week ${weekNum + 1}`) : html.length;
    const weekHtml =
      htmlStart >= 0
        ? html.slice(htmlStart, htmlEnd > 0 ? htmlEnd : html.length)
        : `<div>${weekContent}</div>`;

    weeks.push({
      id: `w${weekNum}`,
      title: weekTitle,
      html: weekHtml,
      quiz: {
        id: `quiz-${weekNum}`,
        title: `Week ${weekNum} Quiz`,
        questions: [],
      },
    });
  }

  return weeks;
}

// Process a single file
async function processFile(fileConfig) {
  const filePath = path.join(CONFIG.lessonsDir, fileConfig.path);

  console.log(`\n📁 Processing: ${fileConfig.name}`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ File not found: ${filePath}`);
    return [];
  }

  try {
    const { html, markdown, warnings } = await extractDocx(filePath);

    if (warnings.length > 0) {
      console.log(`  ⚠️  ${warnings.length} warnings`);
    }

    const weeks = parseWeeks(html, markdown);
    console.log(`  ✅ Extracted ${weeks.length} weeks`);

    // Distribute weeks across months
    const weeksPerMonth = Math.ceil(weeks.length / fileConfig.months.length);
    const results = [];

    for (let i = 0; i < fileConfig.months.length; i++) {
      const monthNum = fileConfig.months[i];
      const startWeek = i * weeksPerMonth;
      const endWeek = Math.min((i + 1) * weeksPerMonth, weeks.length);
      const monthWeeks = weeks.slice(startWeek, endWeek);

      if (monthWeeks.length > 0) {
        // Renumber weeks for this month (w1, w2, w3, w4)
        const renumberedWeeks = monthWeeks.map((week, idx) => ({
          ...week,
          id: `w${idx + 1}`,
        }));

        results.push({
          monthNum,
          data: {
            id: `m${monthNum}`,
            title: `Month ${monthNum}: Construction CFO Fundamentals`,
            weeks: renumberedWeeks,
          },
        });
      }
    }

    return results;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return [];
  }
}

// Main function
async function main() {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   ACCOUNTRIX LESSON IMPORTER          ║");
  console.log("╚════════════════════════════════════════╝\n");

  console.log("Source:", CONFIG.lessonsDir);
  console.log("Output:", CONFIG.outputDir);

  try {
    // Ensure output directory exists
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    let totalWeeks = 0;

    // Process each file
    for (const fileConfig of CONFIG.files) {
      const results = await processFile(fileConfig);

      // Save each month
      for (const { monthNum, data } of results) {
        const outputPath = path.join(CONFIG.outputDir, `m${monthNum}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");
        console.log(`  💾 Saved: m${monthNum}.json (${data.weeks.length} weeks)`);
        totalWeeks += data.weeks.length;
      }
    }

    console.log("\n✅ Import complete!");
    console.log(`   Total weeks created: ${totalWeeks}`);
    console.log("\n📝 Next steps:");
    console.log("   1. Review JSON files in data/ directory");
    console.log("   2. Create quiz questions for each week");
    console.log("   3. Run flashcard import: npm run import:flashcards");
  } catch (error) {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  main();
}

module.exports = { extractDocx, parseWeeks, processFile };
