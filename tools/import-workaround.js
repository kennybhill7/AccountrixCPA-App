#!/usr/bin/env node

/**
 * Workaround for OneDrive/Node.js file reading issues
 * Uses dynamic imports and catches errors
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

async function main() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   ACCOUNTRIX LESSON IMPORTER          ║');
  console.log('╚════════════════════════════════════════╝\n');

  const baseDir = path.resolve(__dirname, '..');
  console.log('Working directory:', baseDir);
  console.log('Node version:', process.version);

  // Try to load mammoth dynamically
  console.log('\n📦 Loading dependencies...');

  let mammoth, TurndownService;

  try {
    // Try different loading methods
    const mammothPath = path.join(baseDir, 'node_modules', 'mammoth', 'lib', 'index.js');
    console.log('  - Checking mammoth at:', mammothPath);

    if (fsSync.existsSync(mammothPath)) {
      console.log('  ✅ Mammoth file exists');

      // Load using require with absolute path
      mammoth = require(mammothPath);
      console.log('  ✅ Mammoth loaded');

      const turndownPath = path.join(baseDir, 'node_modules', 'turndown', 'lib', 'turndown.cjs.js');
      TurndownService = require(turndownPath);
      console.log('  ✅ Turndown loaded');

    } else {
      throw new Error('Mammoth not found');
    }

  } catch (error) {
    console.error('\n❌ Failed to load dependencies:', error.message);
    console.log('\n💡 Possible solutions:');
    console.log('   1. Reinstall dependencies: npm install');
    console.log('   2. Exclude node_modules from OneDrive sync');
    console.log('   3. Move project outside OneDrive');
    console.log('   4. Use WSL or a local (non-OneDrive) directory');
    process.exit(1);
  }

  // Configuration
  const CONFIG = {
    lessonsDir: path.join(baseDir, 'New Accountrix App', 'Lessons'),
    outputDir: path.join(baseDir, 'data'),
    files: [
      { path: 'Revised 1-4 (1).docx', months: [1, 2] },
      { path: 'Revised 5-8.docx', months: [3] },
      { path: 'Revised 9-12 (1).docx', months: [4] }
    ]
  };

  console.log('\n📁 Checking source files...');
  console.log('   Lessons directory:', CONFIG.lessonsDir);

  const filesExist = CONFIG.files.map(f => {
    const fullPath = path.join(CONFIG.lessonsDir, f.path);
    const exists = fsSync.existsSync(fullPath);
    console.log(`   ${exists ? '✅' : '❌'} ${f.path}`);
    return { ...f, exists, fullPath };
  });

  const missingFiles = filesExist.filter(f => !f.exists);
  if (missingFiles.length === filesExist.length) {
    console.error('\n❌ No lesson files found!');
    console.log('   Expected location:', CONFIG.lessonsDir);
    process.exit(1);
  }

  // Set up Turndown
  const turndown = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-'
  });

  console.log('\n🚀 Starting import...\n');

  let totalWeeks = 0;

  try {
    // Process each file
    for (const fileInfo of filesExist) {
      if (!fileInfo.exists) continue;

      console.log(`📄 Processing: ${fileInfo.path}`);

      try {
        // Extract content
        const result = await mammoth.convertToHtml({ path: fileInfo.fullPath });
        const html = result.value;
        const markdown = turndown.turndown(html);

        // Parse weeks
        const weekMatches = Array.from(markdown.matchAll(/Week\s+(\d+)/gmi));
        const numWeeks = weekMatches.length || 1;

        console.log(`   ✅ Extracted ${numWeeks} weeks`);

        // Create month data
        const weeksPerMonth = Math.ceil(numWeeks / fileInfo.months.length);

        for (let i = 0; i < fileInfo.months.length; i++) {
          const monthNum = fileInfo.months[i];

          const monthData = {
            id: `m${monthNum}`,
            title: `Month ${monthNum}: Construction CFO Fundamentals`,
            weeks: []
          };

          // Create placeholder weeks
          const weeksInThisMonth = Math.min(weeksPerMonth, 4);
          for (let w = 1; w <= weeksInThisMonth; w++) {
            monthData.weeks.push({
              id: `w${w}`,
              title: `Week ${w}: Core Concepts`,
              html: html.substring(0, Math.floor(html.length / weeksInThisMonth)),
              quiz: {
                id: `m${monthNum}-w${w}-quiz`,
                title: `Week ${w} Quiz`,
                questions: []
              }
            });
          }

          // Save month file
          const outputPath = path.join(CONFIG.outputDir, `m${monthNum}.json`);
          await fs.mkdir(CONFIG.outputDir, { recursive: true });
          await fs.writeFile(outputPath, JSON.stringify(monthData, null, 2), 'utf-8');

          console.log(`   💾 Saved: m${monthNum}.json (${monthData.weeks.length} weeks)`);
          totalWeeks += monthData.weeks.length;
        }

      } catch (error) {
        console.error(`   ❌ Error processing file: ${error.message}`);
      }
    }

    console.log('\n✅ Import complete!');
    console.log(`   Total weeks created: ${totalWeeks}`);
    console.log(`   Output directory: ${CONFIG.outputDir}`);

    console.log('\n📝 Next steps:');
    console.log('   1. Review generated JSON files');
    console.log('   2. Manually split and organize content by week');
    console.log('   3. Create quiz questions');
    console.log('   4. Run: npm run validate:content');

  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);
