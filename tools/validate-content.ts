#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';
import * as yaml from 'js-yaml';

// Zod schemas for validation
const FrontMatterSchema = z.object({
  month: z.number().min(1).max(12),
  week: z.number().min(1).max(4),
  title: z.string().min(1),
  estMinutes: z.number().min(1).max(120),
  tags: z.array(z.string()).min(1)
});

const FlashcardSchema = z.object({
  deck: z.string().min(1),
  cards: z.array(z.object({
    q: z.string().min(1),
    a: z.string().min(1)
  }))
});

const QuizItemSchema = z.object({
  type: z.enum(['mcq', 'calc']),
  q: z.string().min(1),
  choices: z.array(z.string()).optional(),
  answer: z.union([z.number(), z.string()]),
  why: z.string().min(1),
  tolerance: z.number().optional()
});

const QuizSchema = z.object({
  title: z.string().min(1),
  items: z.array(QuizItemSchema).min(1)
});

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
}

interface ContentStats {
  months: number;
  weeks: number;
  lessons: number;
  flashcards: number;
  quizzes: number;
  tests: number;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function validateMDXFile(filePath: string): Promise<ValidationResult> {
  const result: ValidationResult = { success: true, errors: [], warnings: [] };
  
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    
    // Extract front matter
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontMatterMatch) {
      result.errors.push('No front matter found');
      result.success = false;
      return result;
    }
    
    // Parse and validate front matter
    const frontMatterYaml = frontMatterMatch[1];
    const frontMatter = yaml.load(frontMatterYaml);
    
    const validation = FrontMatterSchema.safeParse(frontMatter);
    if (!validation.success) {
      result.errors.push(`Invalid front matter: ${validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`);
      result.success = false;
    }
    
    // Check content length
    const contentAfterFrontMatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    if (contentAfterFrontMatter.trim().length < 100) {
      result.warnings.push('Content is very short (< 100 characters)');
    }
    
    // Check for common issues
    if (!contentAfterFrontMatter.includes('#')) {
      result.warnings.push('No headings found in content');
    }
    
  } catch (error) {
    result.errors.push(`Failed to read file: ${error}`);
    result.success = false;
  }
  
  return result;
}

async function validateYAMLFile(filePath: string): Promise<ValidationResult> {
  const result: ValidationResult = { success: true, errors: [], warnings: [] };
  
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const data = yaml.load(content);
    
    const validation = FlashcardSchema.safeParse(data);
    if (!validation.success) {
      result.errors.push(`Invalid flashcard format: ${validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`);
      result.success = false;
    } else {
      // Additional checks
      const flashcards = validation.data;
      if (flashcards.cards.length === 0) {
        result.warnings.push('No flashcards found');
      }
      
      // Check for duplicate questions
      const questions = flashcards.cards.map(c => c.q.toLowerCase());
      const duplicates = questions.filter((q, i) => questions.indexOf(q) !== i);
      if (duplicates.length > 0) {
        result.warnings.push(`Duplicate questions found: ${duplicates.length}`);
      }
    }
    
  } catch (error) {
    result.errors.push(`Failed to parse YAML: ${error}`);
    result.success = false;
  }
  
  return result;
}

async function validateJSONFile(filePath: string, isTest: boolean = false): Promise<ValidationResult> {
  const result: ValidationResult = { success: true, errors: [], warnings: [] };
  
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const data = JSON.parse(content);
    
    const validation = QuizSchema.safeParse(data);
    if (!validation.success) {
      result.errors.push(`Invalid ${isTest ? 'test' : 'quiz'} format: ${validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`);
      result.success = false;
    } else {
      // Additional checks
      const quiz = validation.data;
      if (quiz.items.length === 0) {
        result.warnings.push('No questions found');
      }
      
      // Validate MCQ choices
      for (const [index, item] of quiz.items.entries()) {
        if (item.type === 'mcq') {
          if (!item.choices || item.choices.length < 2) {
            result.errors.push(`Question ${index + 1}: MCQ must have at least 2 choices`);
            result.success = false;
          }
          
          if (typeof item.answer !== 'number' || item.answer < 0 || item.answer >= (item.choices?.length || 0)) {
            result.errors.push(`Question ${index + 1}: MCQ answer index is invalid`);
            result.success = false;
          }
        }
        
        if (item.type === 'calc') {
          if (typeof item.answer !== 'number') {
            result.errors.push(`Question ${index + 1}: Calc question answer must be a number`);
            result.success = false;
          }
        }
      }
    }
    
  } catch (error) {
    result.errors.push(`Failed to parse JSON: ${error}`);
    result.success = false;
  }
  
  return result;
}

async function validateContent(): Promise<ContentStats> {
  console.log('🔍 Starting content validation...\n');
  
  const stats: ContentStats = {
    months: 0,
    weeks: 0,
    lessons: 0,
    flashcards: 0,
    quizzes: 0,
    tests: 0
  };
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  const contentDir = path.join(process.cwd(), 'content');
  
  if (!(await fileExists(contentDir))) {
    console.error('❌ Content directory not found. Run the import script first.');
    process.exit(1);
  }
  
  // Validate month directories
  for (let month = 1; month <= 12; month++) {
    const monthDir = path.join(contentDir, `m${month.toString().padStart(2, '0')}`);
    
    if (!(await fileExists(monthDir))) {
      console.warn(`⚠️  Month ${month} directory not found`);
      continue;
    }
    
    stats.months++;
    console.log(`📅 Validating Month ${month}...`);
    
    // Validate week directories
    for (let week = 1; week <= 4; week++) {
      const weekDir = path.join(monthDir, `w${week.toString().padStart(2, '0')}`);
      
      if (!(await fileExists(weekDir))) {
        // Week missing is just a warning for now
        continue;
      }
      
      stats.weeks++;
      console.log(`  📝 Week ${week}:`);
      
      // Validate lesson.mdx
      const lessonPath = path.join(weekDir, 'lesson.mdx');
      if (await fileExists(lessonPath)) {
        const result = await validateMDXFile(lessonPath);
        if (result.success) {
          console.log(`    ✅ lesson.mdx`);
          stats.lessons++;
        } else {
          console.log(`    ❌ lesson.mdx: ${result.errors.join(', ')}`);
          totalErrors += result.errors.length;
        }
        
        if (result.warnings.length > 0) {
          console.log(`    ⚠️  lesson.mdx warnings: ${result.warnings.join(', ')}`);
          totalWarnings += result.warnings.length;
        }
      } else {
        console.log(`    ❌ lesson.mdx not found`);
        totalErrors++;
      }
      
      // Validate flashcards.yaml
      const flashcardsPath = path.join(weekDir, 'flashcards.yaml');
      if (await fileExists(flashcardsPath)) {
        const result = await validateYAMLFile(flashcardsPath);
        if (result.success) {
          console.log(`    ✅ flashcards.yaml`);
          stats.flashcards++;
        } else {
          console.log(`    ❌ flashcards.yaml: ${result.errors.join(', ')}`);
          totalErrors += result.errors.length;
        }
        
        if (result.warnings.length > 0) {
          console.log(`    ⚠️  flashcards.yaml warnings: ${result.warnings.join(', ')}`);
          totalWarnings += result.warnings.length;
        }
      } else {
        console.log(`    ❌ flashcards.yaml not found`);
        totalErrors++;
      }
      
      // Validate quiz.json
      const quizPath = path.join(weekDir, 'quiz.json');
      if (await fileExists(quizPath)) {
        const result = await validateJSONFile(quizPath, false);
        if (result.success) {
          console.log(`    ✅ quiz.json`);
          stats.quizzes++;
        } else {
          console.log(`    ❌ quiz.json: ${result.errors.join(', ')}`);
          totalErrors += result.errors.length;
        }
        
        if (result.warnings.length > 0) {
          console.log(`    ⚠️  quiz.json warnings: ${result.warnings.join(', ')}`);
          totalWarnings += result.warnings.length;
        }
      } else {
        console.log(`    ❌ quiz.json not found`);
        totalErrors++;
      }
      
      // Validate test.json
      const testPath = path.join(weekDir, 'test.json');
      if (await fileExists(testPath)) {
        const result = await validateJSONFile(testPath, true);
        if (result.success) {
          console.log(`    ✅ test.json`);
          stats.tests++;
        } else {
          console.log(`    ❌ test.json: ${result.errors.join(', ')}`);
          totalErrors += result.errors.length;
        }
        
        if (result.warnings.length > 0) {
          console.log(`    ⚠️  test.json warnings: ${result.warnings.join(', ')}`);
          totalWarnings += result.warnings.length;
        }
      } else {
        console.log(`    ❌ test.json not found`);
        totalErrors++;
      }
    }
  }
  
  // Validate consolidated flashcards
  const flashcardsDir = path.join(contentDir, 'flashcards');
  if (await fileExists(flashcardsDir)) {
    console.log('\n🧠 Validating consolidated flashcards...');
    const files = await fs.promises.readdir(flashcardsDir);
    for (const file of files) {
      if (file.endsWith('.yaml')) {
        const filePath = path.join(flashcardsDir, file);
        const result = await validateYAMLFile(filePath);
        if (result.success) {
          console.log(`  ✅ ${file}`);
        } else {
          console.log(`  ❌ ${file}: ${result.errors.join(', ')}`);
          totalErrors += result.errors.length;
        }
        
        if (result.warnings.length > 0) {
          console.log(`  ⚠️  ${file} warnings: ${result.warnings.join(', ')}`);
          totalWarnings += result.warnings.length;
        }
      }
    }
  }
  
  // Print summary
  console.log('\n📊 Validation Summary:');
  console.log(`📅 Months: ${stats.months}/12`);
  console.log(`📝 Weeks: ${stats.weeks}`);
  console.log(`📖 Lessons: ${stats.lessons}`);
  console.log(`🧠 Flashcard files: ${stats.flashcards}`);
  console.log(`❓ Quizzes: ${stats.quizzes}`);
  console.log(`📋 Tests: ${stats.tests}`);
  console.log(`⚠️  Warnings: ${totalWarnings}`);
  console.log(`❌ Errors: ${totalErrors}`);
  
  if (totalErrors === 0) {
    console.log('\n🎉 All content is valid!');
  } else {
    console.log(`\n💥 Found ${totalErrors} error(s). Please fix before proceeding.`);
    process.exit(1);
  }
  
  return stats;
}

async function main() {
  try {
    await validateContent();
  } catch (error) {
    console.error('💥 Validation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}