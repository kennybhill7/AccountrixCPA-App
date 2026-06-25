#!/usr/bin/env tsx

import fs from 'fs/promises';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { 
  CurriculumSchema, 
  CurriculumIndexSchema,
  MonthSchema,
  type Curriculum,
  type CurriculumIndex 
} from '../lib/schemas';

const argv = await yargs(hideBin(process.argv))
  .option('dataDir', {
    alias: 'd',
    type: 'string',
    description: 'Path to directory containing curriculum JSON files',
    default: './data'
  })
  .option('fix', {
    alias: 'f',
    type: 'boolean',
    description: 'Attempt to fix validation errors automatically',
    default: false
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Show detailed validation results',
    default: false
  })
  .help()
  .argv;

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface ValidationSummary {
  totalFiles: number;
  validFiles: number;
  errorFiles: number;
  results: ValidationResult[];
}

async function validateJsonFile(filePath: string, schema: any, schemaName: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    file: path.basename(filePath),
    valid: false,
    errors: [],
    warnings: []
  };

  try {
    // Check if file exists
    await fs.access(filePath);
    
    // Read and parse JSON
    const content = await fs.readFile(filePath, 'utf-8');
    let data: any;
    
    try {
      data = JSON.parse(content);
    } catch (parseError) {
      result.errors.push(`Invalid JSON format: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
      return result;
    }

    // Validate against schema
    const validationResult = schema.safeParse(data);
    
    if (validationResult.success) {
      result.valid = true;
      
      // Additional content-specific validations
      if (schemaName === 'Curriculum') {
        const additionalValidation = validateCurriculumContent(data);
        result.warnings.push(...additionalValidation.warnings);
        if (additionalValidation.errors.length > 0) {
          result.valid = false;
          result.errors.push(...additionalValidation.errors);
        }
      }
      
    } else {
      result.valid = false;
      result.errors.push(`Schema validation failed for ${schemaName}:`);
      
      // Format Zod errors nicely
      validationResult.error.issues.forEach(issue => {
        const path = issue.path.length > 0 ? ` at ${issue.path.join('.')}` : '';
        result.errors.push(`  • ${issue.message}${path}`);
      });
    }

  } catch (error) {
    result.errors.push(`File access error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

function validateCurriculumContent(curriculum: Curriculum): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check month IDs are correct
  const expectedMonthIds = ['m1', 'm5', 'm9'];
  const actualMonthIds = Object.keys(curriculum);
  
  expectedMonthIds.forEach(expectedId => {
    if (!actualMonthIds.includes(expectedId)) {
      errors.push(`Missing required month: ${expectedId}`);
    }
  });

  actualMonthIds.forEach(actualId => {
    if (!expectedMonthIds.includes(actualId)) {
      warnings.push(`Unexpected month ID: ${actualId}`);
    }
  });

  // Validate each month
  Object.entries(curriculum).forEach(([monthId, month]) => {
    // Check week consistency
    if (month.weeks.length !== 4) {
      errors.push(`Month ${monthId} should have exactly 4 weeks, found ${month.weeks.length}`);
    }

    month.weeks.forEach((week, index) => {
      const expectedWeekId = `w${index + 1}`;
      if (week.id !== expectedWeekId) {
        errors.push(`Month ${monthId}, week ${index + 1}: expected ID ${expectedWeekId}, found ${week.id}`);
      }

      if (week.order !== index + 1) {
        errors.push(`Month ${monthId}, week ${week.id}: expected order ${index + 1}, found ${week.order}`);
      }

      // Check content quality
      if (week.lessonHtml.length < 100) {
        warnings.push(`Month ${monthId}, week ${week.id}: lesson content seems too short (${week.lessonHtml.length} chars)`);
      }

      if (week.flashcards.length === 0) {
        warnings.push(`Month ${monthId}, week ${week.id}: no flashcards defined`);
      }

      if (week.flashcards.length > 20) {
        warnings.push(`Month ${monthId}, week ${week.id}: unusually high number of flashcards (${week.flashcards.length})`);
      }

      if (week.quiz.questions.length === 0) {
        errors.push(`Month ${monthId}, week ${week.id}: quiz has no questions`);
      }

      if (week.quiz.questions.length > 10) {
        warnings.push(`Month ${monthId}, week ${week.id}: quiz has many questions (${week.quiz.questions.length}), consider splitting`);
      }

      // Validate quiz questions
      week.quiz.questions.forEach((question, qIndex) => {
        if (question.correct >= question.choices.length) {
          errors.push(`Month ${monthId}, week ${week.id}, question ${qIndex + 1}: correct answer index (${question.correct}) exceeds choices length (${question.choices.length})`);
        }

        if (question.choices.length < 2) {
          errors.push(`Month ${monthId}, week ${week.id}, question ${qIndex + 1}: must have at least 2 choices`);
        }

        if (question.q.length < 10) {
          warnings.push(`Month ${monthId}, week ${week.id}, question ${qIndex + 1}: question text seems too short`);
        }
      });
    });
  });

  return { errors, warnings };
}

async function validateCurriculumIndex(indexPath: string, curriculumPath: string): Promise<ValidationResult> {
  const result = await validateJsonFile(indexPath, CurriculumIndexSchema, 'CurriculumIndex');
  
  if (result.valid) {
    try {
      // Cross-validate with actual curriculum
      const [indexContent, curriculumContent] = await Promise.all([
        fs.readFile(indexPath, 'utf-8'),
        fs.readFile(curriculumPath, 'utf-8')
      ]);

      const index: CurriculumIndex = JSON.parse(indexContent);
      const curriculum: Curriculum = JSON.parse(curriculumContent);

      // Check consistency
      const curriculumMonthIds = Object.keys(curriculum);
      const indexMonthIds = index.months.map(m => m.id);

      curriculumMonthIds.forEach(monthId => {
        if (!indexMonthIds.includes(monthId)) {
          result.errors.push(`Curriculum month ${monthId} not found in index`);
          result.valid = false;
        }
      });

      indexMonthIds.forEach(monthId => {
        if (!curriculumMonthIds.includes(monthId)) {
          result.errors.push(`Index month ${monthId} not found in curriculum`);
          result.valid = false;
        }
      });

      // Validate month details
      index.months.forEach(indexMonth => {
        const curriculumMonth = curriculum[indexMonth.id];
        if (curriculumMonth) {
          if (indexMonth.title !== curriculumMonth.title) {
            result.warnings.push(`Month ${indexMonth.id}: title mismatch between index and curriculum`);
          }
          
          if (indexMonth.weeks !== curriculumMonth.weeks.length) {
            result.errors.push(`Month ${indexMonth.id}: week count mismatch (index: ${indexMonth.weeks}, curriculum: ${curriculumMonth.weeks.length})`);
            result.valid = false;
          }
        }
      });

    } catch (error) {
      result.errors.push(`Cross-validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      result.valid = false;
    }
  }

  return result;
}

async function validateDataDirectory(dataDir: string): Promise<ValidationSummary> {
  console.log(`🔍 Validating data directory: ${dataDir}`);
  
  const summary: ValidationSummary = {
    totalFiles: 0,
    validFiles: 0,
    errorFiles: 0,
    results: []
  };

  try {
    // Check if directory exists
    await fs.access(dataDir);
    
    // Define expected files and their schemas
    const expectedFiles = [
      { file: 'curriculum.json', schema: CurriculumSchema, name: 'Curriculum' },
      { file: 'curriculum-index.json', schema: CurriculumIndexSchema, name: 'CurriculumIndex' },
      { file: 'm1.json', schema: MonthSchema, name: 'Month' },
      { file: 'm5.json', schema: MonthSchema, name: 'Month' },
      { file: 'm9.json', schema: MonthSchema, name: 'Month' }
    ];

    // Validate each expected file
    for (const { file, schema, name } of expectedFiles) {
      const filePath = path.join(dataDir, file);
      let result: ValidationResult;
      
      if (file === 'curriculum-index.json') {
        // Special validation for index file
        const curriculumPath = path.join(dataDir, 'curriculum.json');
        result = await validateCurriculumIndex(filePath, curriculumPath);
      } else {
        result = await validateJsonFile(filePath, schema, name);
      }
      
      summary.results.push(result);
      summary.totalFiles++;
      
      if (result.valid) {
        summary.validFiles++;
      } else {
        summary.errorFiles++;
      }
    }

    // Check for unexpected files
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    const expectedFileNames = expectedFiles.map(f => f.file);
    
    jsonFiles.forEach(file => {
      if (!expectedFileNames.includes(file)) {
        summary.results.push({
          file,
          valid: true,
          errors: [],
          warnings: [`Unexpected file found: ${file}`]
        });
      }
    });

  } catch (error) {
    console.error(`❌ Error accessing data directory: ${error}`);
    summary.results.push({
      file: 'directory',
      valid: false,
      errors: [`Cannot access data directory: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    });
    summary.errorFiles++;
    summary.totalFiles++;
  }

  return summary;
}

function printValidationResults(summary: ValidationSummary, verbose: boolean) {
  console.log('\n📊 Validation Results');
  console.log('=' .repeat(50));
  
  if (summary.totalFiles === 0) {
    console.log('❌ No files found to validate');
    return;
  }

  console.log(`📁 Total files: ${summary.totalFiles}`);
  console.log(`✅ Valid files: ${summary.validFiles}`);
  console.log(`❌ Files with errors: ${summary.errorFiles}`);
  console.log(`📊 Success rate: ${Math.round((summary.validFiles / summary.totalFiles) * 100)}%`);

  if (verbose || summary.errorFiles > 0) {
    console.log('\n📋 Detailed Results:');
    console.log('-'.repeat(30));

    summary.results.forEach(result => {
      const status = result.valid ? '✅' : '❌';
      console.log(`\n${status} ${result.file}`);
      
      if (result.errors.length > 0) {
        console.log('  Errors:');
        result.errors.forEach(error => console.log(`    🔴 ${error}`));
      }
      
      if (result.warnings.length > 0 && (verbose || result.errors.length === 0)) {
        console.log('  Warnings:');
        result.warnings.forEach(warning => console.log(`    🟡 ${warning}`));
      }
    });
  }

  console.log('\n' + '='.repeat(50));
  
  if (summary.errorFiles === 0) {
    console.log('🎉 All validation checks passed!');
  } else {
    console.log(`💥 ${summary.errorFiles} file(s) failed validation`);
  }
}

async function main() {
  try {
    console.log('🔍 Starting data validation...');
    console.log(`📂 Data directory: ${argv.dataDir}`);
    
    const summary = await validateDataDirectory(argv.dataDir);
    printValidationResults(summary, argv.verbose);
    
    // Exit with appropriate code
    process.exit(summary.errorFiles > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('💥 Validation process failed:', error);
    process.exit(1);
  }
}

// Run the script
main();