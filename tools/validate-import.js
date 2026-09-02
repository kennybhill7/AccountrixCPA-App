#!/usr/bin/env node

/**
 * Validation and Reporting Tool for Imported Data
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

function printHeader(title) {
  console.log("\n" + "═".repeat(60));
  console.log("  " + title);
  console.log("═".repeat(60));
}

function printSection(title) {
  console.log("\n" + "─".repeat(60));
  console.log("  " + title);
  console.log("─".repeat(60));
}

async function validateMonth(monthNum) {
  const filePath = path.join(dataDir, `m${monthNum}.json`);

  if (!fs.existsSync(filePath)) {
    return {
      monthNum,
      exists: false,
      errors: [`File not found: m${monthNum}.json`],
      warnings: [],
      stats: {},
    };
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);

    const errors = [];
    const warnings = [];
    const stats = {
      weeks: 0,
      totalHtmlSize: 0,
      avgHtmlSize: 0,
      quizQuestions: 0,
      hasContent: false,
    };

    // Validate structure
    if (!data.id || data.id !== `m${monthNum}`) {
      errors.push(`Invalid month ID: expected m${monthNum}, got ${data.id}`);
    }

    if (!data.title) {
      errors.push("Missing month title");
    }

    if (!data.weeks || !Array.isArray(data.weeks)) {
      errors.push("Missing or invalid weeks array");
    } else {
      stats.weeks = data.weeks.length;

      if (data.weeks.length === 0) {
        errors.push("No weeks found");
      } else if (data.weeks.length !== 4) {
        warnings.push(`Expected 4 weeks, found ${data.weeks.length}`);
      }

      // Validate each week
      data.weeks.forEach((week, index) => {
        if (!week.id) {
          errors.push(`Week ${index + 1}: Missing week ID`);
        }

        if (!week.title) {
          warnings.push(`Week ${index + 1}: Missing week title`);
        }

        if (!week.html) {
          errors.push(`Week ${index + 1}: Missing HTML content`);
        } else {
          const htmlSize = week.html.length;
          stats.totalHtmlSize += htmlSize;

          if (htmlSize < 100) {
            warnings.push(`Week ${index + 1}: Very short content (${htmlSize} chars)`);
          } else if (htmlSize > 1000) {
            stats.hasContent = true;
          }
        }

        if (!week.quiz) {
          warnings.push(`Week ${index + 1}: Missing quiz`);
        } else {
          if (!week.quiz.questions || week.quiz.questions.length === 0) {
            warnings.push(`Week ${index + 1}: No quiz questions (placeholder)`);
          } else {
            stats.quizQuestions += week.quiz.questions.length;
          }
        }
      });

      if (stats.weeks > 0) {
        stats.avgHtmlSize = Math.round(stats.totalHtmlSize / stats.weeks);
      }
    }

    return {
      monthNum,
      exists: true,
      errors,
      warnings,
      stats,
      fileSize: content.length,
    };
  } catch (error) {
    return {
      monthNum,
      exists: true,
      errors: [`Failed to parse JSON: ${error.message}`],
      warnings: [],
      stats: {},
    };
  }
}

async function validateFlashcards() {
  const filePath = path.join(dataDir, "flashcards.json");

  if (!fs.existsSync(filePath)) {
    return {
      exists: false,
      errors: ["Flashcards file not found"],
      warnings: [],
      stats: {},
    };
  }

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const cards = JSON.parse(content);

    const errors = [];
    const warnings = [];
    const stats = {
      total: cards.length,
      byMonth: {},
      avgQLength: 0,
      avgALength: 0,
      emptyCards: 0,
    };

    if (!Array.isArray(cards)) {
      errors.push("Flashcards data is not an array");
      return { exists: true, errors, warnings, stats };
    }

    let totalQLength = 0;
    let totalALength = 0;

    cards.forEach((card, index) => {
      if (!card.id) {
        errors.push(`Card ${index}: Missing ID`);
      }

      if (!card.monthId) {
        errors.push(`Card ${index}: Missing monthId`);
      } else {
        stats.byMonth[card.monthId] = (stats.byMonth[card.monthId] || 0) + 1;
      }

      if (!card.q || card.q.trim().length === 0) {
        errors.push(`Card ${index}: Missing question`);
        stats.emptyCards++;
      } else {
        totalQLength += card.q.length;
      }

      if (!card.a || card.a.trim().length === 0) {
        errors.push(`Card ${index}: Missing answer`);
        stats.emptyCards++;
      } else {
        totalALength += card.a.length;
      }

      // Check for placeholder patterns
      if (card.q && card.q.match(/^What is Q\d+\?$/)) {
        warnings.push(`Card ${card.id}: Placeholder question pattern detected`);
      }
    });

    if (cards.length > 0) {
      stats.avgQLength = Math.round(totalQLength / cards.length);
      stats.avgALength = Math.round(totalALength / cards.length);
    }

    if (cards.length < 50) {
      warnings.push(`Only ${cards.length} flashcards found - expected more`);
    }

    return {
      exists: true,
      errors,
      warnings,
      stats,
      fileSize: content.length,
    };
  } catch (error) {
    return {
      exists: true,
      errors: [`Failed to parse JSON: ${error.message}`],
      warnings: [],
      stats: {},
    };
  }
}

async function main() {
  printHeader("ACCOUNTRIX IMPORT VALIDATION REPORT");

  console.log("\nGenerated:", new Date().toLocaleString());
  console.log("Data directory:", dataDir);

  // Validate months 1-4
  printSection("MONTH DATA VALIDATION");

  const monthResults = [];
  let totalErrors = 0;
  let totalWarnings = 0;

  for (let i = 1; i <= 4; i++) {
    const result = await validateMonth(i);
    monthResults.push(result);

    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;

    // Print month summary
    const status = result.exists ? (result.errors.length === 0 ? "✅" : "❌") : "⚠️ ";

    console.log(`\n${status} Month ${i}:`);
    console.log(
      `   File: ${result.exists ? "EXISTS" : "MISSING"} ${result.fileSize ? `(${(result.fileSize / 1024).toFixed(1)} KB)` : ""}`
    );

    if (result.stats.weeks !== undefined) {
      console.log(`   Weeks: ${result.stats.weeks}`);
      console.log(
        `   Content: ${result.stats.hasContent ? "YES" : "MINIMAL"} (avg ${result.stats.avgHtmlSize} chars/week)`
      );
      console.log(`   Quiz Questions: ${result.stats.quizQuestions}`);
    }

    if (result.errors.length > 0) {
      console.log(`   ❌ Errors (${result.errors.length}):`);
      result.errors.forEach((err) => console.log(`      - ${err}`));
    }

    if (result.warnings.length > 0) {
      console.log(`   ⚠️  Warnings (${result.warnings.length}):`);
      result.warnings.slice(0, 3).forEach((warn) => console.log(`      - ${warn}`));
      if (result.warnings.length > 3) {
        console.log(`      ... and ${result.warnings.length - 3} more`);
      }
    }
  }

  // Validate flashcards
  printSection("FLASHCARD DATA VALIDATION");

  const flashcardResult = await validateFlashcards();

  totalErrors += flashcardResult.errors.length;
  totalWarnings += flashcardResult.warnings.length;

  const fcStatus = flashcardResult.exists
    ? flashcardResult.errors.length === 0
      ? "✅"
      : "❌"
    : "⚠️ ";

  console.log(`\n${fcStatus} Flashcards:`);
  console.log(
    `   File: ${flashcardResult.exists ? "EXISTS" : "MISSING"} ${flashcardResult.fileSize ? `(${(flashcardResult.fileSize / 1024).toFixed(1)} KB)` : ""}`
  );

  if (flashcardResult.stats.total !== undefined) {
    console.log(`   Total Cards: ${flashcardResult.stats.total}`);
    console.log(`   Distribution:`);
    Object.entries(flashcardResult.stats.byMonth || {}).forEach(([month, count]) => {
      console.log(`      Month ${month}: ${count} cards`);
    });
    console.log(`   Avg Question Length: ${flashcardResult.stats.avgQLength} chars`);
    console.log(`   Avg Answer Length: ${flashcardResult.stats.avgALength} chars`);
  }

  if (flashcardResult.errors.length > 0) {
    console.log(`   ❌ Errors (${flashcardResult.errors.length}):`);
    flashcardResult.errors.slice(0, 5).forEach((err) => console.log(`      - ${err}`));
    if (flashcardResult.errors.length > 5) {
      console.log(`      ... and ${flashcardResult.errors.length - 5} more`);
    }
  }

  if (flashcardResult.warnings.length > 0) {
    console.log(`   ⚠️  Warnings (${flashcardResult.warnings.length}):`);
    flashcardResult.warnings.slice(0, 3).forEach((warn) => console.log(`      - ${warn}`));
    if (flashcardResult.warnings.length > 3) {
      console.log(`      ... and ${flashcardResult.warnings.length - 3} more`);
    }
  }

  // Summary
  printSection("SUMMARY");

  console.log("\n📊 Statistics:");
  const totalWeeks = monthResults.reduce((sum, r) => sum + (r.stats.weeks || 0), 0);
  const totalContent = monthResults.reduce((sum, r) => sum + (r.stats.totalHtmlSize || 0), 0);
  const totalQuizQuestions = monthResults.reduce((sum, r) => sum + (r.stats.quizQuestions || 0), 0);

  console.log(`   Months processed: ${monthResults.filter((r) => r.exists).length}/4`);
  console.log(`   Weeks created: ${totalWeeks}`);
  console.log(`   Total content: ${(totalContent / 1024).toFixed(1)} KB`);
  console.log(`   Quiz questions: ${totalQuizQuestions}`);
  console.log(`   Flashcards: ${flashcardResult.stats.total || 0}`);

  console.log("\n📋 Validation Results:");
  console.log(`   Total Errors: ${totalErrors}`);
  console.log(`   Total Warnings: ${totalWarnings}`);

  if (totalErrors === 0) {
    console.log("\n✅ VALIDATION PASSED");
    console.log("   All required data files are present and valid.");
  } else {
    console.log("\n❌ VALIDATION FAILED");
    console.log("   Please review errors above and fix before proceeding.");
  }

  if (totalWarnings > 0) {
    console.log(`\n⚠️  ${totalWarnings} WARNINGS FOUND`);
    console.log("   Review warnings above for potential issues.");
  }

  // Recommendations
  printSection("RECOMMENDATIONS");

  console.log("\n📝 Next Steps:");

  if (totalQuizQuestions === 0) {
    console.log("   1. ❗ Create quiz questions for each week");
  } else {
    console.log("   1. ✅ Quiz questions present (review and enhance)");
  }

  if (flashcardResult.warnings.some((w) => w.includes("placeholder"))) {
    console.log("   2. ⚠️  Clean up flashcard placeholder patterns");
  } else {
    console.log("   2. ✅ Flashcards look good");
  }

  const avgContentSize = totalWeeks > 0 ? totalContent / totalWeeks : 0;
  if (avgContentSize < 10000) {
    console.log("   3. ⚠️  Content seems short - review week content splitting");
  } else {
    console.log("   3. ✅ Content size looks reasonable");
  }

  console.log("   4. Review and manually organize content by week");
  console.log("   5. Test the application: npm run dev");
  console.log("   6. Run content validation: npm run validate:content");

  console.log("\n💡 Tips:");
  console.log("   - Each week should have substantial content (10-20 KB)");
  console.log("   - Quiz questions should be specific to week content");
  console.log("   - Flashcards should have clear, concise Q&A pairs");
  console.log("   - All months should have exactly 4 weeks");

  printHeader("END OF REPORT");

  // Exit code
  process.exit(totalErrors > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("\n❌ Validation script failed:", error);
  process.exit(1);
});
