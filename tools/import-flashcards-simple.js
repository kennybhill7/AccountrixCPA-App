#!/usr/bin/env node

/**
 * Simple Flashcard Import (JavaScript version with OneDrive workaround)
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs").promises;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fsSync = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

async function main() {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   FLASHCARD IMPORT TOOL               ║");
  console.log("╚════════════════════════════════════════╝\n");

  const baseDir = path.resolve(__dirname, "..");
  console.log("Working directory:", baseDir);

  // Load dependencies with workaround
  console.log("\n📦 Loading dependencies...");

  let mammoth, TurndownService;

  try {
    const mammothPath = path.join(baseDir, "node_modules", "mammoth", "lib", "index.js");
    const turndownPath = path.join(baseDir, "node_modules", "turndown", "lib", "turndown.cjs.js");

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mammoth = require(mammothPath);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    TurndownService = require(turndownPath);

    console.log("  ✅ Dependencies loaded");
  } catch (error) {
    console.error("  ❌ Failed to load dependencies:", error.message);
    process.exit(1);
  }

  // Configuration
  const CONFIG = {
    lessonsDir: path.join(baseDir, "New Accountrix App", "Lessons"),
    outputFile: path.join(baseDir, "data", "flashcards.json"),
    files: [
      { path: "1-4 Flash Cards.docx", months: [1, 2], name: "Flashcards 1-4" },
      { path: "5-8 Flash Cards.docx", months: [3], name: "Flashcards 5-8" },
      { path: "9-12 Flash Cards.docx", months: [4], name: "Flashcards 9-12" },
    ],
  };

  const turndown = new TurndownService({ headingStyle: "atx" });

  console.log("\n📁 Checking flashcard files...");

  const allFlashcards = [];
  let cardIdCounter = 1;

  try {
    for (const fileConfig of CONFIG.files) {
      const filePath = path.join(CONFIG.lessonsDir, fileConfig.path);

      console.log(`\n📄 Processing: ${fileConfig.name}`);
      console.log(`   Path: ${fileConfig.path}`);

      if (!fsSync.existsSync(filePath)) {
        console.log("   ❌ File not found");
        continue;
      }

      // Extract content
      console.log("   📋 Extracting content...");
      const result = await mammoth.convertToHtml({ path: filePath });
      const markdown = turndown.turndown(result.value);

      // Parse flashcards using multiple strategies
      const cards = parseFlashcards(markdown, fileConfig.months);

      console.log(`   ✅ Found ${cards.length} flashcards`);

      // Format flashcards
      for (const card of cards) {
        const monthId = card.monthId;
        allFlashcards.push({
          id: `m${monthId.padStart(2, "0")}-fc-${String(cardIdCounter).padStart(3, "0")}`,
          monthId: monthId,
          q: card.q,
          a: card.a,
        });
        cardIdCounter++;
      }
    }

    // Save to file
    if (allFlashcards.length > 0) {
      await fs.mkdir(path.dirname(CONFIG.outputFile), { recursive: true });
      await fs.writeFile(CONFIG.outputFile, JSON.stringify(allFlashcards, null, 2), "utf-8");

      console.log("\n✅ SUCCESS!");
      console.log(`   Total flashcards: ${allFlashcards.length}`);
      console.log(`   Output file: ${CONFIG.outputFile}`);

      // Show distribution
      const byMonth = {};
      allFlashcards.forEach((card) => {
        byMonth[card.monthId] = (byMonth[card.monthId] || 0) + 1;
      });

      console.log("\n📊 Distribution by month:");
      Object.entries(byMonth).forEach(([month, count]) => {
        console.log(`   Month ${month}: ${count} cards`);
      });

      // Show sample
      if (allFlashcards.length > 0) {
        console.log("\n📋 Sample flashcard:");
        const sample = allFlashcards[0];
        console.log(`   Q: ${sample.q.substring(0, 60)}${sample.q.length > 60 ? "..." : ""}`);
        console.log(`   A: ${sample.a.substring(0, 60)}${sample.a.length > 60 ? "..." : ""}`);
      }
    } else {
      console.log("\n⚠️  No flashcards were extracted");
      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ ERROR:", error);
    process.exit(1);
  }
}

// Parse flashcards using multiple strategies
function parseFlashcards(content, months) {
  const cards = [];
  const seen = new Set();

  // Strategy 1: Q&A Pattern
  const qaCards = parseQAPattern(content);
  qaCards.forEach((card) => {
    const key = `${card.q}|${card.a}`;
    if (!seen.has(key)) {
      seen.add(key);
      cards.push(card);
    }
  });

  // Strategy 2: Term-Definition Pattern
  const termCards = parseTermDefinitionPattern(content);
  termCards.forEach((card) => {
    const key = `${card.q}|${card.a}`;
    if (!seen.has(key)) {
      seen.add(key);
      cards.push(card);
    }
  });

  // Strategy 3: Question Mark Pattern
  const questionCards = parseQuestionMarkPattern(content);
  questionCards.forEach((card) => {
    const key = `${card.q}|${card.a}`;
    if (!seen.has(key)) {
      seen.add(key);
      cards.push(card);
    }
  });

  // Assign month IDs
  const cardsPerMonth = Math.ceil(cards.length / months.length);
  return cards.map((card, index) => {
    const monthIndex = Math.floor(index / cardsPerMonth);
    const monthId = months[Math.min(monthIndex, months.length - 1)].toString();
    return { ...card, monthId };
  });
}

// Strategy 1: Q&A Pattern
function parseQAPattern(content) {
  const cards = [];
  const lines = content.split("\n");
  let currentQ = "";
  let currentA = "";
  let mode = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (/^(?:Q|Question)[:\.]?\s*/i.test(trimmed)) {
      if (currentQ && currentA) {
        cards.push({ q: currentQ.trim(), a: currentA.trim() });
      }
      currentQ = trimmed.replace(/^(?:Q|Question)[:\.]?\s*/i, "");
      currentA = "";
      mode = "q";
      continue;
    }

    if (/^(?:A|Answer)[:\.]?\s*/i.test(trimmed)) {
      currentA = trimmed.replace(/^(?:A|Answer)[:\.]?\s*/i, "");
      mode = "a";
      continue;
    }

    if (mode === "q") {
      currentQ += " " + trimmed;
    } else if (mode === "a") {
      currentA += " " + trimmed;
    }
  }

  if (currentQ && currentA) {
    cards.push({ q: currentQ.trim(), a: currentA.trim() });
  }

  return cards;
}

// Strategy 2: Term-Definition Pattern
function parseTermDefinitionPattern(content) {
  const cards = [];
  const pattern = /\*\*([^*]+)\*\*\s*[:\-–—]\s*([^*\n]+)/g;
  const matches = content.matchAll(pattern);

  for (const match of matches) {
    const term = match[1].trim();
    const definition = match[2].trim();

    if (term.length > 2 && definition.length > 10) {
      cards.push({
        q: `What is ${term}?`,
        a: definition,
      });
    }
  }

  return cards;
}

// Strategy 3: Question Mark Pattern
function parseQuestionMarkPattern(content) {
  const cards = [];
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("#")) continue;

    if (line.endsWith("?") && line.length > 10) {
      const question = line;
      let answer = "";

      for (let j = i + 1; j < lines.length && j < i + 3; j++) {
        const nextLine = lines[j];
        if (nextLine.startsWith("#") || nextLine.endsWith("?")) break;
        answer += (answer ? " " : "") + nextLine;
        if (answer.length > 50) break;
      }

      if (answer.length > 10) {
        cards.push({ q: question, a: answer.trim() });
      }
    }
  }

  return cards;
}

main().catch(console.error);
