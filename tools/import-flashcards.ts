#!/usr/bin/env node

/**
 * Standalone Flashcard Import Tool
 *
 * Extracts flashcards from DOCX files and converts them to JSON format
 *
 * Usage:
 *   npm run import:flashcards
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import mammoth from 'mammoth';
import TurndownService from 'turndown';
import type { Flashcard } from '../types/content.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  lessonsDir: path.join(process.cwd(), 'New Accountrix App', 'Lessons'),
  outputFile: path.join(process.cwd(), 'data', 'flashcards.json'),

  files: [
    { path: '1-4 Flash Cards.docx', months: [1, 2], name: 'Flashcards 1-4' },
    { path: '5-8 Flash Cards.docx', months: [3], name: 'Flashcards 5-8' },
    { path: '9-12 Flash Cards.docx', months: [4], name: 'Flashcards 9-12' }
  ]
};

// ============================================================================
// TURNDOWN SERVICE
// ============================================================================

const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-'
});

// ============================================================================
// EXTRACTION
// ============================================================================

async function extractDocxContent(filePath: string): Promise<string> {
  const result = await mammoth.convertToHtml({ path: filePath });
  return turndownService.turndown(result.value);
}

// ============================================================================
// PARSING STRATEGIES
// ============================================================================

interface RawFlashcard {
  q: string;
  a: string;
}

/**
 * Strategy 1: Q&A Pattern
 * Looks for explicit "Q:" and "A:" patterns
 */
function parseQAPattern(content: string): RawFlashcard[] {
  const cards: RawFlashcard[] = [];
  const lines = content.split('\n');

  let currentQ = '';
  let currentA = '';
  let mode: 'q' | 'a' | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    // Detect Q: or Question:
    if (/^(?:Q|Question)[:\.]?\s*/i.test(trimmed)) {
      // Save previous card
      if (currentQ && currentA) {
        cards.push({ q: currentQ.trim(), a: currentA.trim() });
      }

      currentQ = trimmed.replace(/^(?:Q|Question)[:\.]?\s*/i, '');
      currentA = '';
      mode = 'q';
      continue;
    }

    // Detect A: or Answer:
    if (/^(?:A|Answer)[:\.]?\s*/i.test(trimmed)) {
      currentA = trimmed.replace(/^(?:A|Answer)[:\.]?\s*/i, '');
      mode = 'a';
      continue;
    }

    // Accumulate text
    if (mode === 'q') {
      currentQ += ' ' + trimmed;
    } else if (mode === 'a') {
      currentA += ' ' + trimmed;
    }
  }

  // Save final card
  if (currentQ && currentA) {
    cards.push({ q: currentQ.trim(), a: currentA.trim() });
  }

  return cards;
}

/**
 * Strategy 2: Term-Definition Pattern
 * Looks for bold terms followed by definitions
 */
function parseTermDefinitionPattern(content: string): RawFlashcard[] {
  const cards: RawFlashcard[] = [];

  // Match: **Term**: Definition or **Term** - Definition
  const pattern = /\*\*([^*]+)\*\*\s*[:\-–—]\s*([^*\n]+)/g;
  const matches = content.matchAll(pattern);

  for (const match of matches) {
    const term = match[1].trim();
    const definition = match[2].trim();

    if (term.length > 2 && definition.length > 10) {
      cards.push({
        q: `What is ${term}?`,
        a: definition
      });
    }
  }

  return cards;
}

/**
 * Strategy 3: Numbered List Pattern
 * Looks for numbered questions and subsequent answers
 */
function parseNumberedListPattern(content: string): RawFlashcard[] {
  const cards: RawFlashcard[] = [];
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  let currentQ = '';
  let currentA = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this is a numbered item (1. or 1) )
    const numberMatch = line.match(/^\d+[\.\)]\s+(.+)/);

    if (numberMatch) {
      // Save previous card
      if (currentQ && currentA) {
        cards.push({ q: currentQ, a: currentA });
      }

      currentQ = numberMatch[1];
      currentA = '';

      // Look ahead for answer (next non-numbered line)
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        if (!nextLine.match(/^\d+[\.\)]/)) {
          currentA = nextLine;
        }
      }
    } else if (currentQ && !currentA) {
      // This might be the answer to the previous question
      currentA = line;
    }
  }

  // Save final card
  if (currentQ && currentA) {
    cards.push({ q: currentQ, a: currentA });
  }

  return cards;
}

/**
 * Strategy 4: Question Mark Pattern
 * Looks for questions (ending with ?) followed by answers
 */
function parseQuestionMarkPattern(content: string): RawFlashcard[] {
  const cards: RawFlashcard[] = [];
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip headers
    if (line.startsWith('#')) continue;

    // Check if this is a question
    if (line.endsWith('?') && line.length > 10) {
      const question = line;
      let answer = '';

      // Look ahead for answer (next non-question line)
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];

        if (nextLine.startsWith('#')) break;
        if (nextLine.endsWith('?')) break;

        answer += (answer ? ' ' : '') + nextLine;

        // Stop after collecting a reasonable answer
        if (answer.length > 50) break;
      }

      if (answer.length > 10) {
        cards.push({ q: question, a: answer.trim() });
      }
    }
  }

  return cards;
}

/**
 * Strategy 5: Table Pattern
 * Extracts Q&A from markdown tables
 */
function parseTablePattern(content: string): RawFlashcard[] {
  const cards: RawFlashcard[] = [];

  // Match markdown tables
  const tablePattern = /\|[^\n]+\|\n\|[-:\s|]+\|\n((?:\|[^\n]+\|\n?)+)/g;
  const tables = content.matchAll(tablePattern);

  for (const table of tables) {
    const rows = table[1].split('\n').filter(r => r.trim().startsWith('|'));

    for (const row of rows) {
      const cells = row.split('|').map(c => c.trim()).filter(c => c);

      if (cells.length >= 2) {
        const q = cells[0];
        const a = cells[1];

        if (q.length > 5 && a.length > 5) {
          cards.push({ q, a });
        }
      }
    }
  }

  return cards;
}

// ============================================================================
// COMBINED PARSING
// ============================================================================

function parseFlashcards(content: string, months: number[]): RawFlashcard[] {
  console.log('  📋 Trying multiple parsing strategies...');

  const strategies = [
    { name: 'Q&A Pattern', fn: parseQAPattern },
    { name: 'Term-Definition Pattern', fn: parseTermDefinitionPattern },
    { name: 'Numbered List Pattern', fn: parseNumberedListPattern },
    { name: 'Question Mark Pattern', fn: parseQuestionMarkPattern },
    { name: 'Table Pattern', fn: parseTablePattern }
  ];

  const allCards: RawFlashcard[] = [];
  const seen = new Set<string>();

  for (const strategy of strategies) {
    const cards = strategy.fn(content);
    const uniqueCards = cards.filter(card => {
      const key = `${card.q}|${card.a}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (uniqueCards.length > 0) {
      console.log(`    ✓ ${strategy.name}: ${uniqueCards.length} cards`);
      allCards.push(...uniqueCards);
    }
  }

  return allCards;
}

// ============================================================================
// FORMATTING
// ============================================================================

function formatFlashcards(rawCards: RawFlashcard[], months: number[], startId: number): Flashcard[] {
  const formatted: Flashcard[] = [];
  const cardsPerMonth = Math.ceil(rawCards.length / months.length);

  rawCards.forEach((card, index) => {
    const monthIndex = Math.floor(index / cardsPerMonth);
    const monthId = months[Math.min(monthIndex, months.length - 1)].toString();

    formatted.push({
      id: `m${monthId.padStart(2, '0')}-fc-${(startId + index).toString().padStart(3, '0')}`,
      monthId,
      q: card.q,
      a: card.a
    });
  });

  return formatted;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   FLASHCARD IMPORT TOOL               ║');
  console.log('╚════════════════════════════════════════╝\n');

  const allFlashcards: Flashcard[] = [];
  let cardIdCounter = 1;

  try {
    for (const fileConfig of CONFIG.files) {
      const filePath = path.join(CONFIG.lessonsDir, fileConfig.path);

      console.log(`\n📁 Processing: ${fileConfig.name}`);
      console.log(`   Path: ${fileConfig.path}`);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.log(`   ❌ File not found: ${filePath}`);
        continue;
      }

      // Extract content
      console.log('   📄 Extracting content from DOCX...');
      const markdown = await extractDocxContent(filePath);

      // Parse flashcards
      console.log('   🧠 Parsing flashcards...');
      const rawCards = parseFlashcards(markdown, fileConfig.months);

      if (rawCards.length === 0) {
        console.log('   ⚠️  No flashcards found');
        continue;
      }

      // Format flashcards
      const formatted = formatFlashcards(rawCards, fileConfig.months, cardIdCounter);
      allFlashcards.push(...formatted);
      cardIdCounter += formatted.length;

      console.log(`   ✅ Extracted ${formatted.length} flashcards`);
    }

    // Save to file
    if (allFlashcards.length > 0) {
      await fs.promises.mkdir(path.dirname(CONFIG.outputFile), { recursive: true });
      await fs.promises.writeFile(
        CONFIG.outputFile,
        JSON.stringify(allFlashcards, null, 2),
        'utf-8'
      );

      console.log(`\n✅ SUCCESS!`);
      console.log(`   Total flashcards: ${allFlashcards.length}`);
      console.log(`   Output file: ${CONFIG.outputFile}`);

      // Show sample
      if (allFlashcards.length > 0) {
        console.log('\n📋 Sample flashcard:');
        const sample = allFlashcards[0];
        console.log(`   Q: ${sample.q.substring(0, 60)}...`);
        console.log(`   A: ${sample.a.substring(0, 60)}...`);
      }

      // Show distribution
      const byMonth = allFlashcards.reduce((acc, card) => {
        acc[card.monthId] = (acc[card.monthId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('\n📊 Distribution by month:');
      Object.entries(byMonth).forEach(([month, count]) => {
        console.log(`   Month ${month}: ${count} cards`);
      });

    } else {
      console.log('\n⚠️  No flashcards were extracted from any file');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { parseFlashcards, formatFlashcards };
