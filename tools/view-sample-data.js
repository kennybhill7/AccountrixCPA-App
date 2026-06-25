#!/usr/bin/env node

/**
 * Sample Data Viewer
 * Quick tool to preview imported content
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

function truncate(str, maxLen = 100) {
  if (!str || str.length <= maxLen) return str;
  return str.substring(0, maxLen) + '...';
}

function printHeader(title) {
  console.log('\n' + '═'.repeat(70));
  console.log('  ' + title);
  console.log('═'.repeat(70));
}

function printSection(title) {
  console.log('\n' + '─'.repeat(70));
  console.log('  ' + title);
  console.log('─'.repeat(70));
}

function viewMonth(monthNum) {
  const filePath = path.join(dataDir, `m${monthNum}.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`\n❌ Month ${monthNum} file not found`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    printSection(`Month ${monthNum}: ${data.title}`);

    console.log(`\n📊 Overview:`);
    console.log(`   ID: ${data.id}`);
    console.log(`   Weeks: ${data.weeks.length}`);

    data.weeks.forEach((week, index) => {
      console.log(`\n📘 Week ${index + 1}: ${week.title}`);
      console.log(`   ID: ${week.id}`);
      console.log(`   Content: ${week.html.length.toLocaleString()} characters`);
      console.log(`   Quiz: ${week.quiz.questions.length} questions`);

      // Show content preview
      const textContent = week.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log(`   Preview: ${truncate(textContent, 120)}`);
    });

  } catch (error) {
    console.error(`\n❌ Error reading month ${monthNum}:`, error.message);
  }
}

function viewFlashcards() {
  const filePath = path.join(dataDir, 'flashcards.json');

  if (!fs.existsSync(filePath)) {
    console.log('\n❌ Flashcards file not found');
    return;
  }

  try {
    const flashcards = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    printSection('Flashcards');

    console.log(`\n📊 Overview:`);
    console.log(`   Total Cards: ${flashcards.length}`);

    // Count by month
    const byMonth = {};
    flashcards.forEach(card => {
      byMonth[card.monthId] = (byMonth[card.monthId] || 0) + 1;
    });

    console.log(`\n📈 Distribution:`);
    Object.entries(byMonth).sort().forEach(([month, count]) => {
      console.log(`   Month ${month}: ${count} cards`);
    });

    // Show samples
    console.log(`\n📋 Sample Flashcards (first 5):`);
    flashcards.slice(0, 5).forEach((card, index) => {
      console.log(`\n   ${index + 1}. ${card.id} (Month ${card.monthId})`);
      console.log(`      Q: ${truncate(card.q, 60)}`);
      console.log(`      A: ${truncate(card.a, 60)}`);
    });

  } catch (error) {
    console.error('\n❌ Error reading flashcards:', error.message);
  }
}

function viewSummary() {
  printHeader('ACCOUNTRIX DATA SUMMARY');

  console.log('\n📁 Data Directory:', dataDir);

  // Check all files
  const files = {
    m1: fs.existsSync(path.join(dataDir, 'm1.json')),
    m2: fs.existsSync(path.join(dataDir, 'm2.json')),
    m3: fs.existsSync(path.join(dataDir, 'm3.json')),
    m4: fs.existsSync(path.join(dataDir, 'm4.json')),
    flashcards: fs.existsSync(path.join(dataDir, 'flashcards.json'))
  };

  console.log('\n📊 File Status:');
  Object.entries(files).forEach(([name, exists]) => {
    const status = exists ? '✅' : '❌';
    const size = exists
      ? (fs.statSync(path.join(dataDir, `${name}.json`)).size / 1024).toFixed(1) + ' KB'
      : 'N/A';
    console.log(`   ${status} ${name.padEnd(12)} ${size}`);
  });

  // Calculate totals
  let totalWeeks = 0;
  let totalContent = 0;
  let totalQuizQuestions = 0;

  for (let i = 1; i <= 4; i++) {
    const filePath = path.join(dataDir, `m${i}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        totalWeeks += data.weeks.length;
        data.weeks.forEach(week => {
          totalContent += week.html.length;
          totalQuizQuestions += week.quiz.questions.length;
        });
      } catch (error) {
        // Skip invalid files
      }
    }
  }

  let totalFlashcards = 0;
  const fcPath = path.join(dataDir, 'flashcards.json');
  if (fs.existsSync(fcPath)) {
    try {
      const flashcards = JSON.parse(fs.readFileSync(fcPath, 'utf-8'));
      totalFlashcards = flashcards.length;
    } catch (error) {
      // Skip invalid file
    }
  }

  console.log('\n📈 Statistics:');
  console.log(`   Total Weeks: ${totalWeeks}`);
  console.log(`   Total Content: ${(totalContent / 1024).toFixed(1)} KB`);
  console.log(`   Quiz Questions: ${totalQuizQuestions}`);
  console.log(`   Flashcards: ${totalFlashcards}`);

  console.log('\n💡 Quick Commands:');
  console.log('   node tools/view-sample-data.js m1    - View Month 1 details');
  console.log('   node tools/view-sample-data.js m2    - View Month 2 details');
  console.log('   node tools/view-sample-data.js m3    - View Month 3 details');
  console.log('   node tools/view-sample-data.js m4    - View Month 4 details');
  console.log('   node tools/view-sample-data.js fc    - View Flashcards');
  console.log('   node tools/view-sample-data.js all   - View All Data');
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'summary';

  if (command === 'summary') {
    viewSummary();
  } else if (command === 'm1') {
    viewMonth(1);
  } else if (command === 'm2') {
    viewMonth(2);
  } else if (command === 'm3') {
    viewMonth(3);
  } else if (command === 'm4') {
    viewMonth(4);
  } else if (command === 'fc' || command === 'flashcards') {
    viewFlashcards();
  } else if (command === 'all') {
    viewSummary();
    viewMonth(1);
    viewMonth(2);
    viewMonth(3);
    viewMonth(4);
    viewFlashcards();
  } else {
    console.log('Usage:');
    console.log('  node tools/view-sample-data.js [command]');
    console.log('');
    console.log('Commands:');
    console.log('  summary     - Show overview (default)');
    console.log('  m1          - View Month 1 details');
    console.log('  m2          - View Month 2 details');
    console.log('  m3          - View Month 3 details');
    console.log('  m4          - View Month 4 details');
    console.log('  fc          - View Flashcards');
    console.log('  all         - View everything');
  }
}

main();
