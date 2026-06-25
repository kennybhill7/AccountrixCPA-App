const fs = require('fs');
const path = require('path');
const { z } = require('zod');

// Define schemas
const ChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
});

const QuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  choices: z.array(ChoiceSchema),
  correctId: z.string(),
  explanation: z.string(),
});

const WeekSchema = z.object({
  id: z.enum(['w1', 'w2', 'w3', 'w4']),
  title: z.string(),
  html: z.string(),
  quiz: z.object({
    id: z.string(),
    title: z.string(),
    questions: z.array(QuestionSchema),
  }),
});

const MonthSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  weeks: z.array(WeekSchema),
});

const FlashcardSchema = z.object({
  id: z.string(),
  monthId: z.string(),
  q: z.string(),
  a: z.string(),
  ref: z.string().optional(),
});

// Validation functions
function validateFile(filePath, schema, label) {
  console.log(`Validating ${label}: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  ${label} not found: ${filePath}`);
    return { valid: false, error: 'File not found' };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    schema.parse(data);
    console.log(`✅ ${label} is valid`);
    return { valid: true, data };
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`❌ Invalid JSON in ${label}:`, error.message);
    } else if (error instanceof z.ZodError) {
      console.error(`❌ Schema validation failed for ${label}:`);
      error.errors.forEach(err => {
        console.error(`   - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error(`❌ Error validating ${label}:`, error.message);
    }
    return { valid: false, error };
  }
}

function validateQuestionIntegrity(questions, monthId, weekId) {
  const errors = [];
  
  questions.forEach((question, index) => {
    // Check if correctId exists in choices
    const hasCorrectChoice = question.choices.some(choice => choice.id === question.correctId);
    if (!hasCorrectChoice) {
      errors.push(`Question ${index + 1}: correctId "${question.correctId}" not found in choices`);
    }

    // Check for duplicate choice IDs
    const choiceIds = question.choices.map(c => c.id);
    const duplicates = choiceIds.filter((id, i) => choiceIds.indexOf(id) !== i);
    if (duplicates.length > 0) {
      errors.push(`Question ${index + 1}: duplicate choice IDs: ${duplicates.join(', ')}`);
    }

    // Check minimum choices
    if (question.choices.length < 2) {
      errors.push(`Question ${index + 1}: must have at least 2 choices`);
    }
  });

  return errors;
}

// Main validation
async function validateData() {
  console.log('🔍 Starting data validation...\n');
  
  let totalErrors = 0;
  const dataDir = path.join(process.cwd(), 'public', 'data');
  const monthsDir = path.join(dataDir, 'months');
  const flashcardsFile = path.join(dataDir, 'flashcards.json');

  // Validate months
  console.log('📚 Validating month files...');
  const monthIds = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  
  for (const monthId of monthIds) {
    const monthFile = path.join(monthsDir, `m${monthId}.json`);
    const result = validateFile(monthFile, MonthSchema, `Month ${monthId}`);
    
    if (!result.valid) {
      totalErrors++;
      continue;
    }

    // Additional validation for quiz questions
    const month = result.data;
    month.weeks.forEach((week, weekIndex) => {
      const questionErrors = validateQuestionIntegrity(week.quiz.questions, monthId, week.id);
      if (questionErrors.length > 0) {
        console.error(`❌ Question integrity errors in Month ${monthId}, Week ${weekIndex + 1}:`);
        questionErrors.forEach(error => console.error(`   - ${error}`));
        totalErrors++;
      }
    });
  }

  // Validate flashcards
  console.log('\n🧠 Validating flashcards...');
  const flashcardResult = validateFile(flashcardsFile, z.array(FlashcardSchema), 'Flashcards');
  
  if (!flashcardResult.valid) {
    totalErrors++;
  } else {
    // Check flashcard integrity
    const flashcards = flashcardResult.data;
    const invalidMonthRefs = flashcards.filter(card => {
      const monthId = parseInt(card.monthId);
      return isNaN(monthId) || monthId < 1 || monthId > 12;
    });
    
    if (invalidMonthRefs.length > 0) {
      console.error(`❌ Flashcards with invalid monthId references:`);
      invalidMonthRefs.forEach(card => {
        console.error(`   - Card "${card.id}": monthId "${card.monthId}" is not valid`);
      });
      totalErrors++;
    }
  }

  // Summary
  console.log('\n📊 Validation Summary:');
  if (totalErrors === 0) {
    console.log('🎉 All data files are valid!');
    process.exit(0);
  } else {
    console.log(`💥 Found ${totalErrors} error(s) in data files.`);
    console.log('Please fix the errors above before running the application.');
    process.exit(1);
  }
}

validateData().catch(console.error);