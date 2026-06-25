#!/usr/bin/env tsx

import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
import { JSDOM } from 'jsdom';
import sanitizeHtml from 'sanitize-html';
import matter from 'gray-matter';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CurriculumSchema, type Curriculum, type Week, type Flashcard, type Quiz } from '../lib/schemas';

interface DocxContent {
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

interface GeneratedFlashcard {
  front: string;
  back: string;
}

interface GeneratedQuiz {
  questions: Array<{
    q: string;
    choices: string[];
    correct: number;
    explain?: string;
  }>;
}

const argv = await yargs(hideBin(process.argv))
  .option('contentDir', {
    alias: 'c',
    type: 'string',
    description: 'Path to directory containing DOCX files',
    demandOption: true
  })
  .option('outputDir', {
    alias: 'o',
    type: 'string',
    description: 'Output directory for generated JSON files',
    default: './data'
  })
  .option('force', {
    alias: 'f',
    type: 'boolean',
    description: 'Force regeneration of existing files',
    default: false
  })
  .help()
  .argv;

async function readDocxFile(filePath: string): Promise<DocxContent> {
  try {
    console.log(`📖 Reading DOCX file: ${filePath}`);
    
    const { value: html } = await mammoth.convertToHtml({ path: filePath });
    
    // Clean and sanitize HTML
    const cleanHtml = sanitizeHtml(html, {
      allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'em', 'br'],
      allowedAttributes: {}
    });

    // Extract title from filename or first heading
    const dom = new JSDOM(cleanHtml);
    const document = dom.window.document;
    const firstHeading = document.querySelector('h1, h2, h3');
    const titleFromDoc = firstHeading?.textContent?.trim();
    const titleFromFilename = path.basename(filePath, '.docx');
    
    const title = titleFromDoc || titleFromFilename;
    
    return {
      title,
      content: cleanHtml,
      metadata: {
        originalFile: filePath,
        processedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error(`❌ Error reading DOCX file ${filePath}:`, error);
    throw error;
  }
}

function generateFlashcardsFromContent(content: string, title: string): Flashcard[] {
  console.log(`🃏 Generating flashcards for: ${title}`);
  
  // Simple content-based flashcard generation
  // In a real implementation, this would use AI or more sophisticated parsing
  const flashcards: Flashcard[] = [];
  
  // Extract key terms and concepts (simplified approach)
  const dom = new JSDOM(content);
  const document = dom.window.document;
  const paragraphs = Array.from(document.querySelectorAll('p'));
  
  // Generate flashcards from strong/bold terms
  paragraphs.forEach((p, index) => {
    const strongElements = p.querySelectorAll('strong, b');
    strongElements.forEach((strong) => {
      const term = strong.textContent?.trim();
      const context = p.textContent?.trim();
      
      if (term && context && term.length > 3 && context.length > term.length + 10) {
        flashcards.push({
          front: `What is ${term}?`,
          back: context.replace(term, `**${term}**`)
        });
      }
    });
  });
  
  // Generate definition-style flashcards from headings and following content
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
  headings.forEach((heading) => {
    const headingText = heading.textContent?.trim();
    const nextElement = heading.nextElementSibling;
    
    if (headingText && nextElement && nextElement.textContent) {
      const definition = nextElement.textContent.trim();
      if (definition.length > 20 && definition.length < 300) {
        flashcards.push({
          front: headingText,
          back: definition
        });
      }
    }
  });
  
  // Fallback: generate generic flashcards if none found
  if (flashcards.length === 0) {
    flashcards.push(
      {
        front: `What is the main topic of "${title}"?`,
        back: `The lesson covers key concepts in ${title.toLowerCase()}, including fundamental principles and practical applications.`
      },
      {
        front: `What are the key learning objectives for ${title}?`,
        back: `Students will understand the core concepts, be able to apply the principles in practice, and demonstrate mastery through assessment.`
      }
    );
  }
  
  // Limit to reasonable number of flashcards
  return flashcards.slice(0, 8);
}

function generateQuizFromContent(content: string, title: string): Quiz {
  console.log(`📝 Generating quiz for: ${title}`);
  
  // Simple content-based quiz generation
  // In a real implementation, this would use AI or more sophisticated parsing
  const questions: Quiz['questions'] = [];
  
  const dom = new JSDOM(content);
  const document = dom.window.document;
  
  // Generate questions from headings
  const headings = Array.from(document.querySelectorAll('h2, h3, h4'));
  headings.slice(0, 3).forEach((heading, index) => {
    const headingText = heading.textContent?.trim();
    if (headingText) {
      questions.push({
        q: `Which of the following best describes "${headingText}"?`,
        choices: [
          `${headingText} is a fundamental concept in construction finance`,
          `${headingText} is primarily used for project management`,
          `${headingText} is only relevant to large projects`,
          `${headingText} is not important for CFOs`
        ],
        correct: 0,
        explain: `${headingText} is indeed a key concept covered in this lesson and is fundamental to understanding construction finance.`
      });
    }
  });
  
  // Generate vocabulary questions from strong terms
  const strongElements = Array.from(document.querySelectorAll('strong, b'));
  const terms = strongElements
    .map(el => el.textContent?.trim())
    .filter(term => term && term.length > 3 && term.length < 30)
    .slice(0, 2);
  
  terms.forEach(term => {
    if (term) {
      questions.push({
        q: `What does "${term}" refer to in construction finance?`,
        choices: [
          `A key concept covered in this lesson`,
          `A type of construction equipment`,
          `A project management methodology`,
          `A legal requirement`
        ],
        correct: 0,
        explain: `"${term}" is an important term defined and explained in this lesson.`
      });
    }
  });
  
  // Fallback: generate generic questions if none found
  if (questions.length === 0) {
    questions.push(
      {
        q: `What is the primary focus of the "${title}" lesson?`,
        choices: [
          'Construction finance concepts and principles',
          'Project management techniques',
          'Legal compliance requirements',
          'Marketing strategies'
        ],
        correct: 0,
        explain: 'This lesson focuses on key construction finance concepts that are essential for CFOs.'
      },
      {
        q: `How should the concepts from "${title}" be applied in practice?`,
        choices: [
          'Through careful analysis and professional judgment',
          'Only during emergency situations',
          'Without considering company context',
          'By following rigid procedures only'
        ],
        correct: 0,
        explain: 'Construction finance concepts should be applied thoughtfully, considering the specific context and requirements of each situation.'
      }
    );
  }
  
  return { questions: questions.slice(0, 5) };
}

async function processDocxFiles(contentDir: string): Promise<DocxContent[]> {
  console.log(`🔍 Scanning directory: ${contentDir}`);
  
  try {
    const files = await fs.readdir(contentDir);
    const docxFiles = files.filter(file => file.toLowerCase().endsWith('.docx'));
    
    if (docxFiles.length === 0) {
      console.warn(`⚠️  No DOCX files found in ${contentDir}`);
      return [];
    }
    
    console.log(`📄 Found ${docxFiles.length} DOCX files`);
    
    const contents: DocxContent[] = [];
    
    for (const file of docxFiles) {
      const filePath = path.join(contentDir, file);
      try {
        const content = await readDocxFile(filePath);
        contents.push(content);
      } catch (error) {
        console.error(`❌ Failed to process ${file}:`, error);
        // Continue with other files
      }
    }
    
    return contents;
  } catch (error) {
    console.error(`❌ Error scanning directory ${contentDir}:`, error);
    throw error;
  }
}

function organizeContentIntoCurriculum(contents: DocxContent[]): Curriculum {
  console.log(`🏗️  Organizing ${contents.length} documents into curriculum structure`);
  
  const curriculum: Curriculum = {};
  
  // For this example, we'll create a simple structure
  // In a real implementation, this would use better heuristics or metadata
  const monthIds = ['m1', 'm5', 'm9'] as const;
  const monthTitles = [
    'Fundamentals of Construction Finance',
    'Advanced Financial Analysis',
    'Strategic Financial Management'
  ];
  
  // Distribute content across months and weeks
  const contentsPerMonth = Math.ceil(contents.length / 3);
  
  monthIds.forEach((monthId, monthIndex) => {
    const monthContents = contents.slice(
      monthIndex * contentsPerMonth,
      (monthIndex + 1) * contentsPerMonth
    );
    
    const weeks: Week[] = [];
    
    // Create 4 weeks per month
    for (let weekNum = 1; weekNum <= 4; weekNum++) {
      const weekId = `w${weekNum}` as const;
      const contentIndex = weekNum - 1;
      const weekContent = monthContents[contentIndex];
      
      let lessonHtml: string;
      let title: string;
      
      if (weekContent) {
        lessonHtml = weekContent.content;
        title = weekContent.title;
      } else {
        // Generate placeholder content
        title = `Week ${weekNum}: Additional Concepts`;
        lessonHtml = `
          <h2>${title}</h2>
          <p>This week covers additional important concepts in ${monthTitles[monthIndex].toLowerCase()}.</p>
          <p>Key learning objectives include:</p>
          <ul>
            <li>Understanding fundamental principles</li>
            <li>Practical application techniques</li>
            <li>Real-world case studies</li>
            <li>Best practices and guidelines</li>
          </ul>
          <p>Students will gain practical knowledge that can be immediately applied in their professional roles.</p>
        `;
      }
      
      const flashcards = generateFlashcardsFromContent(lessonHtml, title);
      const quiz = generateQuizFromContent(lessonHtml, title);
      
      weeks.push({
        id: weekId,
        order: weekNum,
        title,
        lessonHtml,
        flashcards,
        quiz
      });
    }
    
    curriculum[monthId] = {
      title: monthTitles[monthIndex],
      description: `Comprehensive coverage of ${monthTitles[monthIndex].toLowerCase()} for construction industry CFOs.`,
      weeks
    };
  });
  
  return curriculum;
}

async function generateCurriculumIndex(curriculum: Curriculum) {
  const months = Object.entries(curriculum).map(([id, month]) => ({
    id,
    order: id === 'm1' ? 1 : id === 'm5' ? 2 : 3,
    title: month.title,
    weeks: 4,
    lessons: 4
  }));
  
  return { months };
}

async function saveCurriculumData(curriculum: Curriculum, outputDir: string) {
  console.log(`💾 Saving curriculum data to ${outputDir}`);
  
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Validate curriculum structure
    const validationResult = CurriculumSchema.safeParse(curriculum);
    if (!validationResult.success) {
      console.error('❌ Curriculum validation failed:', validationResult.error);
      throw new Error('Generated curriculum does not match expected schema');
    }
    
    // Save main curriculum file
    const curriculumPath = path.join(outputDir, 'curriculum.json');
    await fs.writeFile(curriculumPath, JSON.stringify(curriculum, null, 2));
    console.log(`✅ Saved curriculum to ${curriculumPath}`);
    
    // Generate and save curriculum index
    const index = await generateCurriculumIndex(curriculum);
    const indexPath = path.join(outputDir, 'curriculum-index.json');
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
    console.log(`✅ Saved curriculum index to ${indexPath}`);
    
    // Save individual month files for easier loading
    for (const [monthId, month] of Object.entries(curriculum)) {
      const monthPath = path.join(outputDir, `${monthId}.json`);
      await fs.writeFile(monthPath, JSON.stringify(month, null, 2));
      console.log(`✅ Saved ${monthId} to ${monthPath}`);
    }
    
    console.log(`🎉 Successfully generated curriculum with ${Object.keys(curriculum).length} months`);
    
  } catch (error) {
    console.error('❌ Error saving curriculum data:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting DOCX ingestion process...');
    console.log(`📂 Content directory: ${argv.contentDir}`);
    console.log(`📁 Output directory: ${argv.outputDir}`);
    
    // Check if content directory exists
    try {
      await fs.access(argv.contentDir);
    } catch {
      console.error(`❌ Content directory does not exist: ${argv.contentDir}`);
      console.log('💡 Please provide a valid path to a directory containing DOCX files');
      process.exit(1);
    }
    
    // Process DOCX files
    const contents = await processDocxFiles(argv.contentDir);
    
    if (contents.length === 0) {
      console.error('❌ No DOCX files could be processed');
      process.exit(1);
    }
    
    // Organize into curriculum structure
    const curriculum = organizeContentIntoCurriculum(contents);
    
    // Save the generated data
    await saveCurriculumData(curriculum, argv.outputDir);
    
    console.log('✨ DOCX ingestion completed successfully!');
    console.log(`📊 Generated curriculum with:`);
    console.log(`   • ${Object.keys(curriculum).length} months`);
    console.log(`   • ${Object.values(curriculum).reduce((sum, month) => sum + month.weeks.length, 0)} weeks total`);
    console.log(`   • ${Object.values(curriculum).reduce((sum, month) => 
      sum + month.weeks.reduce((weekSum, week) => weekSum + week.flashcards.length, 0), 0)} flashcards total`);
    console.log(`   • ${Object.values(curriculum).reduce((sum, month) => 
      sum + month.weeks.reduce((weekSum, week) => weekSum + week.quiz.questions.length, 0), 0)} quiz questions total`);
    
  } catch (error) {
    console.error('💥 Ingestion process failed:', error);
    process.exit(1);
  }
}

// Run the script
main();