const fs = require('fs');
const path = require('path');

console.log('🔍 ACCOUNTRIX CURRICULUM AUDIT\n');
console.log('=' .repeat(80));

const auditResults = [];

for (let monthNum = 1; monthNum <= 12; monthNum++) {
  const filePath = path.join(__dirname, 'data', `m${monthNum}.json`);

  try {
    const monthData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    console.log(`\n📚 MONTH ${monthNum}: ${monthData.title}`);
    console.log('-'.repeat(80));

    const audit = {
      monthNum,
      title: monthData.title,
      description: monthData.description || '',
      weeks: [],
      issues: []
    };

    // Check if weeks array exists
    if (!monthData.weeks || !Array.isArray(monthData.weeks)) {
      audit.issues.push('❌ No weeks array found');
      console.log('❌ CRITICAL: No weeks array found');
      auditResults.push(audit);
      continue;
    }

    // Check if we have exactly 4 weeks
    if (monthData.weeks.length !== 4) {
      audit.issues.push(`⚠️  Expected 4 weeks, found ${monthData.weeks.length}`);
      console.log(`⚠️  Expected 4 weeks, found ${monthData.weeks.length}`);
    }

    // Audit each week
    monthData.weeks.forEach((week, idx) => {
      const weekNum = idx + 1;
      console.log(`\n  Week ${weekNum}: ${week.title || 'NO TITLE'}`);

      const weekAudit = {
        weekNum,
        title: week.title || 'NO TITLE',
        hasHtml: false,
        htmlLength: 0,
        hasQuiz: false,
        quizCount: 0,
        hasFlashcards: false,
        flashcardCount: 0,
        issues: []
      };

      // Check lessonHtml
      if (!week.lessonHtml || typeof week.lessonHtml !== 'string') {
        weekAudit.issues.push('❌ Missing lessonHtml');
        console.log('    HTML: ❌ MISSING');
      } else if (week.lessonHtml.length < 100) {
        weekAudit.issues.push('⚠️  lessonHtml too short (< 100 chars)');
        console.log(`    HTML: ⚠️  TOO SHORT (${week.lessonHtml.length} chars)`);
        weekAudit.hasHtml = true;
        weekAudit.htmlLength = week.lessonHtml.length;
      } else {
        weekAudit.hasHtml = true;
        weekAudit.htmlLength = week.lessonHtml.length;
        const wordCount = Math.round(week.lessonHtml.length / 5);
        console.log(`    HTML: ✅ ${week.lessonHtml.length.toLocaleString()} chars (~${wordCount.toLocaleString()} words)`);
      }

      // Check quiz (handle both nested {quiz: {questions: []}} and direct array formats)
      let quizQuestions = [];

      if (!week.quiz) {
        weekAudit.issues.push('❌ Missing quiz');
        console.log('    Quiz: ❌ MISSING');
      } else if (Array.isArray(week.quiz)) {
        // Direct array format (Months 6-12)
        quizQuestions = week.quiz;
      } else if (typeof week.quiz === 'object' && 'questions' in week.quiz) {
        // Nested format (Months 1-5)
        quizQuestions = week.quiz.questions || [];
      }

      if (quizQuestions.length === 0) {
        if (week.quiz) {
          weekAudit.issues.push('⚠️  Empty quiz');
          console.log('    Quiz: ⚠️  EMPTY');
        }
      } else {
        weekAudit.hasQuiz = true;
        weekAudit.quizCount = quizQuestions.length;

        // Check quiz structure
        const invalidQuestions = quizQuestions.filter(q =>
          !q.question || !q.options || q.correctAnswer === undefined || !q.explanation
        );

        if (invalidQuestions.length > 0) {
          weekAudit.issues.push(`⚠️  ${invalidQuestions.length} quiz questions missing fields`);
          console.log(`    Quiz: ⚠️  ${quizQuestions.length} questions (${invalidQuestions.length} incomplete)`);
        } else {
          console.log(`    Quiz: ✅ ${quizQuestions.length} questions (all complete)`);
        }
      }

      // Check flashcards
      if (!week.flashcards || !Array.isArray(week.flashcards)) {
        weekAudit.issues.push('❌ Missing flashcards array');
        console.log('    Flashcards: ❌ MISSING');
      } else if (week.flashcards.length === 0) {
        weekAudit.issues.push('⚠️  Empty flashcards array');
        console.log('    Flashcards: ⚠️  EMPTY');
      } else {
        weekAudit.hasFlashcards = true;
        weekAudit.flashcardCount = week.flashcards.length;

        // Check flashcard structure
        const invalidCards = week.flashcards.filter(f =>
          !f.question || !f.answer
        );

        if (invalidCards.length > 0) {
          weekAudit.issues.push(`⚠️  ${invalidCards.length} flashcards missing fields`);
          console.log(`    Flashcards: ⚠️  ${week.flashcards.length} cards (${invalidCards.length} incomplete)`);
        } else {
          console.log(`    Flashcards: ✅ ${week.flashcards.length} cards (all complete)`);
        }
      }

      // Add week audit to month audit
      audit.weeks.push(weekAudit);

      // Add week issues to month issues
      if (weekAudit.issues.length > 0) {
        audit.issues.push(`Week ${weekNum}: ${weekAudit.issues.join(', ')}`);
      }
    });

    auditResults.push(audit);

  } catch (error) {
    console.log(`\n📚 MONTH ${monthNum}: ❌ ERROR`);
    console.log('-'.repeat(80));
    console.log(`❌ Failed to read/parse: ${error.message}`);
    auditResults.push({
      monthNum,
      title: 'ERROR',
      issues: [`Failed to read/parse: ${error.message}`],
      weeks: []
    });
  }
}

// Summary Report
console.log('\n\n');
console.log('=' .repeat(80));
console.log('📊 AUDIT SUMMARY');
console.log('=' .repeat(80));

let totalWeeks = 0;
let weeksWithHtml = 0;
let weeksWithQuiz = 0;
let weeksWithFlashcards = 0;
let totalQuestions = 0;
let totalFlashcards = 0;
let totalHtmlChars = 0;
let monthsWithIssues = 0;
let totalIssues = 0;

auditResults.forEach(month => {
  const monthIssues = month.issues.length;
  if (monthIssues > 0) {
    monthsWithIssues++;
    totalIssues += monthIssues;
  }

  month.weeks.forEach(week => {
    totalWeeks++;
    if (week.hasHtml) {
      weeksWithHtml++;
      totalHtmlChars += week.htmlLength;
    }
    if (week.hasQuiz) {
      weeksWithQuiz++;
      totalQuestions += week.quizCount;
    }
    if (week.hasFlashcards) {
      weeksWithFlashcards++;
      totalFlashcards += week.flashcardCount;
    }
  });
});

console.log(`\nTotal Months: 12`);
console.log(`Total Weeks: ${totalWeeks} (expected: 48)`);
console.log(`\nContent Completeness:`);
console.log(`  Weeks with HTML: ${weeksWithHtml}/${totalWeeks} (${Math.round(weeksWithHtml/totalWeeks*100)}%)`);
console.log(`  Weeks with Quiz: ${weeksWithQuiz}/${totalWeeks} (${Math.round(weeksWithQuiz/totalWeeks*100)}%)`);
console.log(`  Weeks with Flashcards: ${weeksWithFlashcards}/${totalWeeks} (${Math.round(weeksWithFlashcards/totalWeeks*100)}%)`);
console.log(`\nContent Metrics:`);
console.log(`  Total HTML Characters: ${totalHtmlChars.toLocaleString()}`);
console.log(`  Estimated Word Count: ~${Math.round(totalHtmlChars/5).toLocaleString()} words`);
console.log(`  Total Quiz Questions: ${totalQuestions}`);
console.log(`  Total Flashcards: ${totalFlashcards}`);
console.log(`\nIssues Found:`);
console.log(`  Months with Issues: ${monthsWithIssues}/12`);
console.log(`  Total Issues: ${totalIssues}`);

// Detailed issues by month
if (monthsWithIssues > 0) {
  console.log('\n\n');
  console.log('=' .repeat(80));
  console.log('⚠️  DETAILED ISSUES BY MONTH');
  console.log('=' .repeat(80));

  auditResults.forEach(month => {
    if (month.issues.length > 0) {
      console.log(`\nMonth ${month.monthNum}: ${month.title}`);
      month.issues.forEach(issue => {
        console.log(`  • ${issue}`);
      });
    }
  });
}

// Final verdict
console.log('\n\n');
console.log('=' .repeat(80));
console.log('🎯 FINAL VERDICT');
console.log('=' .repeat(80));

if (totalWeeks === 48 && weeksWithHtml === 48 && weeksWithQuiz === 48 && weeksWithFlashcards === 48 && totalIssues === 0) {
  console.log('✅ PERFECT: All 12 months are complete with no issues!');
  console.log('✅ All 48 weeks have complete HTML, quiz, and flashcard content.');
  console.log('✅ Curriculum is 100% production-ready.');
} else {
  console.log('⚠️  ISSUES DETECTED: See detailed report above.');
  if (totalWeeks !== 48) console.log(`   • Expected 48 weeks total, found ${totalWeeks}`);
  if (weeksWithHtml !== 48) console.log(`   • ${48 - weeksWithHtml} weeks missing HTML content`);
  if (weeksWithQuiz !== 48) console.log(`   • ${48 - weeksWithQuiz} weeks missing quiz content`);
  if (weeksWithFlashcards !== 48) console.log(`   • ${48 - weeksWithFlashcards} weeks missing flashcard content`);
  if (totalIssues > 0) console.log(`   • ${totalIssues} quality issues detected`);
}

console.log('\n');

// Save audit report to JSON
const reportPath = path.join(__dirname, 'AUDIT_REPORT.json');
fs.writeFileSync(reportPath, JSON.stringify({
  auditDate: new Date().toISOString(),
  summary: {
    totalMonths: 12,
    totalWeeks,
    weeksWithHtml,
    weeksWithQuiz,
    weeksWithFlashcards,
    totalHtmlChars,
    estimatedWords: Math.round(totalHtmlChars/5),
    totalQuestions,
    totalFlashcards,
    monthsWithIssues,
    totalIssues
  },
  monthDetails: auditResults
}, null, 2));

console.log(`📄 Detailed JSON report saved to: AUDIT_REPORT.json\n`);
