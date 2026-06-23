/**
 * PDF Export System for Accountrix
 * Comprehensive PDF generation for lessons, quizzes, certificates, and accounting worksheets
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface LessonContent {
  title: string;
  content: string; // HTML or markdown content
  estimatedMinutes: number;
  moduleId?: string;
  weekId?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent?: number;
}

export interface QuizResults {
  quizTitle: string;
  userName: string;
  score: number;
  totalQuestions: number;
  questions: QuizQuestion[];
  answers: UserAnswer[];
  dateTaken: Date;
  moduleId?: string;
  weekId?: string;
}

export interface CertificateData {
  userName: string;
  completionDate: Date;
  finalScore: number;
  competencies: string[];
  courseTitle?: string;
  instructorName?: string;
  certificateId?: string;
}

export interface JournalEntry {
  date: Date | string;
  account: string;
  debit: number;
  credit: number;
  description?: string;
  reference?: string;
}

export interface TrialBalanceAccount {
  accountNumber?: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface TrialBalance {
  date: Date | string;
  companyName?: string;
  accounts: TrialBalanceAccount[];
}

export interface BankReconciliationItem {
  description: string;
  amount: number;
  type: 'addition' | 'deduction';
}

export interface BankReconciliation {
  date: Date | string;
  companyName?: string;
  bankBalance: number;
  bookBalance: number;
  bankAdjustments: BankReconciliationItem[];
  bookAdjustments: BankReconciliationItem[];
}

export interface AIAFormData {
  projectName: string;
  projectNumber: string;
  contractDate: Date | string;
  contractSum: number;
  changeOrders: Array<{
    number: string;
    description: string;
    amount: number;
  }>;
  workCompleted: number;
  materialsStored: number;
  totalCompleted: number;
  retainage: number;
  previousPayments: number;
  currentPaymentDue: number;
  date: Date | string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const BRAND_COLOR = '#2563eb'; // Primary blue
const BRAND_COLOR_RGB: [number, number, number] = [37, 99, 235];
const SECONDARY_COLOR_RGB: [number, number, number] = [241, 245, 249]; // Light gray
const HEADER_COLOR_RGB: [number, number, number] = [15, 23, 42]; // Dark slate
const TEXT_COLOR_RGB: [number, number, number] = [51, 65, 85]; // Slate gray
const SUCCESS_COLOR_RGB: [number, number, number] = [34, 197, 94]; // Green
const ERROR_COLOR_RGB: [number, number, number] = [239, 68, 68]; // Red

const MARGIN = 20; // 20mm margins
const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format currency values with proper accounting notation
 */
export function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Return negative amounts in parentheses (accounting notation)
  return amount < 0 ? `(${formatted})` : formatted;
}

/**
 * Format date in readable format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date for file names (YYYY-MM-DD)
 */
function formatDateForFilename(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Add header to each page with branding
 */
function addHeader(doc: jsPDF, title: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Brand name
  doc.setFontSize(20);
  doc.setTextColor(...BRAND_COLOR_RGB);
  doc.setFont('helvetica', 'bold');
  doc.text('Accountrix', MARGIN, MARGIN);

  // Title
  doc.setFontSize(12);
  doc.setTextColor(...TEXT_COLOR_RGB);
  doc.setFont('helvetica', 'normal');
  doc.text(title, MARGIN, MARGIN + 8);

  // Horizontal line
  doc.setDrawColor(...BRAND_COLOR_RGB);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, MARGIN + 12, pageWidth - MARGIN, MARGIN + 12);
}

/**
 * Add footer with page numbers
 */
function addFooter(doc: jsPDF, pageNumber: number, totalPages: number): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(9);
  doc.setTextColor(...TEXT_COLOR_RGB);
  doc.setFont('helvetica', 'normal');

  // Page number centered
  const pageText = `Page ${pageNumber} of ${totalPages}`;
  const textWidth = doc.getTextWidth(pageText);
  doc.text(pageText, (pageWidth - textWidth) / 2, pageHeight - 10);

  // Generated by text on right
  const generatedText = `Generated by Accountrix on ${formatDate(new Date())}`;
  const generatedWidth = doc.getTextWidth(generatedText);
  doc.text(generatedText, pageWidth - MARGIN - generatedWidth, pageHeight - 10);
}

/**
 * Strip HTML tags from content (basic implementation)
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Split text into lines that fit within the specified width
 */
function splitTextToLines(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

/**
 * Add page numbers to all pages
 */
function addPageNumbers(doc: jsPDF): void {
  const totalPages = (doc as any).internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Export lesson content as formatted PDF
 */
export function exportLessonToPDF(lesson: LessonContent): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add header
    addHeader(doc, 'Lesson Content');

    let yPosition = MARGIN + 20;

    // Lesson title
    doc.setFontSize(18);
    doc.setTextColor(...HEADER_COLOR_RGB);
    doc.setFont('helvetica', 'bold');
    doc.text(lesson.title, MARGIN, yPosition);
    yPosition += 10;

    // Estimated time
    doc.setFontSize(10);
    doc.setTextColor(...TEXT_COLOR_RGB);
    doc.setFont('helvetica', 'italic');
    doc.text(`Estimated time: ${lesson.estimatedMinutes} minutes`, MARGIN, yPosition);
    yPosition += 12;

    // Content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const cleanContent = stripHtml(lesson.content);
    const lines = splitTextToLines(doc, cleanContent, CONTENT_WIDTH);

    lines.forEach((line) => {
      // Check if we need a new page
      if (yPosition > PAGE_HEIGHT - 30) {
        doc.addPage();
        addHeader(doc, 'Lesson Content');
        yPosition = MARGIN + 20;
      }

      doc.text(line, MARGIN, yPosition);
      yPosition += 6;
    });

    // Add page numbers
    addPageNumbers(doc);

    // Generate filename
    const moduleWeek = lesson.moduleId && lesson.weekId
      ? `_${lesson.moduleId}${lesson.weekId}`
      : '';
    const filename = `Accountrix_Lesson${moduleWeek}_${formatDateForFilename()}.pdf`;

    // Save the PDF
    doc.save(filename);

    console.log(`Lesson PDF exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting lesson to PDF:', error);
    alert('Failed to export lesson. Please try again.');
  }
}

/**
 * Export quiz results with questions, answers, and explanations
 */
export function exportQuizResultsToPDF(quizResults: QuizResults): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add header
    addHeader(doc, 'Quiz Results');

    let yPosition = MARGIN + 20;

    // Quiz title
    doc.setFontSize(18);
    doc.setTextColor(...HEADER_COLOR_RGB);
    doc.setFont('helvetica', 'bold');
    doc.text(quizResults.quizTitle, MARGIN, yPosition);
    yPosition += 10;

    // User info
    doc.setFontSize(11);
    doc.setTextColor(...TEXT_COLOR_RGB);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student: ${quizResults.userName}`, MARGIN, yPosition);
    yPosition += 6;
    doc.text(`Date: ${formatDate(quizResults.dateTaken)}`, MARGIN, yPosition);
    yPosition += 6;

    // Score with color
    const scorePercent = (quizResults.score / quizResults.totalQuestions) * 100;
    const scoreColor = scorePercent >= 70 ? SUCCESS_COLOR_RGB : ERROR_COLOR_RGB;
    doc.setTextColor(...scoreColor);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Score: ${quizResults.score}/${quizResults.totalQuestions} (${scorePercent.toFixed(1)}%)`,
      MARGIN,
      yPosition
    );
    yPosition += 12;

    // Questions and answers
    quizResults.questions.forEach((question, index) => {
      const userAnswer = quizResults.answers.find(a => a.questionId === question.id);

      // Check if we need a new page
      if (yPosition > PAGE_HEIGHT - 60) {
        doc.addPage();
        addHeader(doc, 'Quiz Results');
        yPosition = MARGIN + 20;
      }

      // Question number and text
      doc.setFontSize(11);
      doc.setTextColor(...HEADER_COLOR_RGB);
      doc.setFont('helvetica', 'bold');
      doc.text(`Question ${index + 1}:`, MARGIN, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...TEXT_COLOR_RGB);
      const questionLines = splitTextToLines(doc, question.question, CONTENT_WIDTH);
      questionLines.forEach(line => {
        doc.text(line, MARGIN, yPosition);
        yPosition += 5;
      });
      yPosition += 2;

      // Options
      question.options.forEach((option, optIndex) => {
        const isCorrect = optIndex === question.correctAnswer;
        const isSelected = userAnswer && optIndex === userAnswer.selectedAnswer;

        if (isCorrect) {
          doc.setTextColor(...SUCCESS_COLOR_RGB);
          doc.setFont('helvetica', 'bold');
        } else if (isSelected && !isCorrect) {
          doc.setTextColor(...ERROR_COLOR_RGB);
          doc.setFont('helvetica', 'normal');
        } else {
          doc.setTextColor(...TEXT_COLOR_RGB);
          doc.setFont('helvetica', 'normal');
        }

        const prefix = isSelected ? '> ' : '  ';
        const suffix = isCorrect ? ' (Correct)' : '';
        doc.text(`${prefix}${String.fromCharCode(65 + optIndex)}. ${option}${suffix}`, MARGIN + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 2;

      // Explanation
      if (question.explanation) {
        doc.setFontSize(10);
        doc.setTextColor(...TEXT_COLOR_RGB);
        doc.setFont('helvetica', 'italic');
        doc.text('Explanation:', MARGIN + 5, yPosition);
        yPosition += 5;

        const explanationLines = splitTextToLines(doc, question.explanation, CONTENT_WIDTH - 10);
        explanationLines.forEach(line => {
          doc.text(line, MARGIN + 5, yPosition);
          yPosition += 4;
        });
      }

      yPosition += 5;
    });

    // Add page numbers
    addPageNumbers(doc);

    // Generate filename
    const moduleWeek = quizResults.moduleId && quizResults.weekId
      ? `_${quizResults.moduleId}${quizResults.weekId}`
      : '';
    const filename = `Accountrix_Quiz_Results${moduleWeek}_${formatDateForFilename()}.pdf`;

    // Save the PDF
    doc.save(filename);

    console.log(`Quiz results PDF exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting quiz results to PDF:', error);
    alert('Failed to export quiz results. Please try again.');
  }
}

/**
 * Generate certificate of completion
 */
export function exportCertificateToPDF(userData: CertificateData): void {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Decorative border
    doc.setDrawColor(...BRAND_COLOR_RGB);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setLineWidth(0.5);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Certificate title
    doc.setFontSize(36);
    doc.setTextColor(...BRAND_COLOR_RGB);
    doc.setFont('helvetica', 'bold');
    const titleText = 'Certificate of Completion';
    const titleWidth = doc.getTextWidth(titleText);
    doc.text(titleText, (pageWidth - titleWidth) / 2, 40);

    // Brand name
    doc.setFontSize(14);
    doc.setTextColor(...TEXT_COLOR_RGB);
    doc.setFont('helvetica', 'normal');
    const brandText = 'Accountrix - Accounting Education Platform';
    const brandWidth = doc.getTextWidth(brandText);
    doc.text(brandText, (pageWidth - brandWidth) / 2, 50);

    // Main text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    const mainText = 'This certifies that';
    const mainWidth = doc.getTextWidth(mainText);
    doc.text(mainText, (pageWidth - mainWidth) / 2, 70);

    // User name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...HEADER_COLOR_RGB);
    const nameWidth = doc.getTextWidth(userData.userName);
    doc.text(userData.userName, (pageWidth - nameWidth) / 2, 85);

    // Achievement text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_COLOR_RGB);
    const courseTitle = userData.courseTitle || 'the Accounting Fundamentals Course';
    const achievementText = `has successfully completed ${courseTitle}`;
    const achievementWidth = doc.getTextWidth(achievementText);
    doc.text(achievementText, (pageWidth - achievementWidth) / 2, 100);

    // Score
    const scoreText = `with a final score of ${userData.finalScore}%`;
    const scoreWidth = doc.getTextWidth(scoreText);
    doc.text(scoreText, (pageWidth - scoreWidth) / 2, 110);

    // Competencies section
    if (userData.competencies && userData.competencies.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const competenciesTitle = 'Competencies Mastered:';
      const competenciesTitleWidth = doc.getTextWidth(competenciesTitle);
      doc.text(competenciesTitle, (pageWidth - competenciesTitleWidth) / 2, 125);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      let yPos = 132;
      userData.competencies.slice(0, 5).forEach(competency => {
        const compText = `• ${competency}`;
        const compWidth = doc.getTextWidth(compText);
        doc.text(compText, (pageWidth - compWidth) / 2, yPos);
        yPos += 6;
      });
    }

    // Date and certificate ID
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const dateText = `Date of Completion: ${formatDate(userData.completionDate)}`;
    doc.text(dateText, 30, pageHeight - 40);

    if (userData.certificateId) {
      const certIdText = `Certificate ID: ${userData.certificateId}`;
      doc.text(certIdText, 30, pageHeight - 33);
    }

    // Signature line
    doc.setLineWidth(0.5);
    doc.setDrawColor(...TEXT_COLOR_RGB);
    doc.line(pageWidth - 100, pageHeight - 40, pageWidth - 30, pageHeight - 40);

    doc.setFontSize(10);
    const sigText = userData.instructorName || 'Accountrix Education Team';
    const sigWidth = doc.getTextWidth(sigText);
    doc.text(sigText, pageWidth - 65 - (sigWidth / 2), pageHeight - 33);

    // Generate filename
    const sanitizedName = userData.userName.replace(/[^a-zA-Z0-9]/g, '');
    const filename = `Accountrix_Certificate_${sanitizedName}_${formatDateForFilename()}.pdf`;

    // Save the PDF
    doc.save(filename);

    console.log(`Certificate PDF exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting certificate to PDF:', error);
    alert('Failed to export certificate. Please try again.');
  }
}

/**
 * Export journal entries worksheet
 */
export function exportJournalEntriesToPDF(entries: JournalEntry[]): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add header
    addHeader(doc, 'Journal Entries');

    let yPosition = MARGIN + 20;

    // Title
    doc.setFontSize(16);
    doc.setTextColor(...HEADER_COLOR_RGB);
    doc.setFont('helvetica', 'bold');
    doc.text('Journal Entries', MARGIN, yPosition);
    yPosition += 10;

    // Table data
    const tableData = entries.map(entry => [
      typeof entry.date === 'string' ? entry.date : formatDate(entry.date),
      entry.account,
      entry.debit > 0 ? formatCurrency(entry.debit) : '',
      entry.credit > 0 ? formatCurrency(entry.credit) : '',
      entry.description || '',
    ]);

    // Calculate totals
    const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);

    // Add totals row
    tableData.push([
      '',
      'TOTALS',
      formatCurrency(totalDebit),
      formatCurrency(totalCredit),
      '',
    ]);

    // Generate table
    autoTable(doc, {
      startY: yPosition,
      head: [['Date', 'Account', 'Debit', 'Credit', 'Description']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: BRAND_COLOR_RGB,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left',
      },
      bodyStyles: {
        textColor: TEXT_COLOR_RGB,
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'left' },
        1: { cellWidth: 50, halign: 'left' },
        2: { cellWidth: 25, halign: 'right', font: 'courier' },
        3: { cellWidth: 25, halign: 'right', font: 'courier' },
        4: { cellWidth: 45, halign: 'left', fontSize: 9 },
      },
      alternateRowStyles: {
        fillColor: SECONDARY_COLOR_RGB,
      },
      didParseCell: (data) => {
        // Bold the totals row
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [226, 232, 240]; // Lighter blue-gray
        }
      },
      margin: { left: MARGIN, right: MARGIN },
    });

    // Add page numbers
    addPageNumbers(doc);

    // Generate filename
    const filename = `Accountrix_JournalEntries_${formatDateForFilename()}.pdf`;

    // Save the PDF
    doc.save(filename);

    console.log(`Journal entries PDF exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting journal entries to PDF:', error);
    alert('Failed to export journal entries. Please try again.');
  }
}

/**
 * Export trial balance
 */
export function exportTrialBalanceToPDF(trialBalance: TrialBalance): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add header
    addHeader(doc, 'Trial Balance');

    let yPosition = MARGIN + 20;

    // Company name and title
    if (trialBalance.companyName) {
      doc.setFontSize(14);
      doc.setTextColor(...HEADER_COLOR_RGB);
      doc.setFont('helvetica', 'bold');
      doc.text(trialBalance.companyName, MARGIN, yPosition);
      yPosition += 7;
    }

    doc.setFontSize(16);
    doc.text('Trial Balance', MARGIN, yPosition);
    yPosition += 6;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `As of ${typeof trialBalance.date === 'string' ? trialBalance.date : formatDate(trialBalance.date)}`,
      MARGIN,
      yPosition
    );
    yPosition += 10;

    // Table data
    const tableData = trialBalance.accounts.map(account => [
      account.accountNumber || '',
      account.accountName,
      account.debit > 0 ? formatCurrency(account.debit) : '',
      account.credit > 0 ? formatCurrency(account.credit) : '',
    ]);

    // Calculate totals
    const totalDebit = trialBalance.accounts.reduce((sum, acc) => sum + acc.debit, 0);
    const totalCredit = trialBalance.accounts.reduce((sum, acc) => sum + acc.credit, 0);

    // Add totals row
    tableData.push([
      '',
      'TOTALS',
      formatCurrency(totalDebit),
      formatCurrency(totalCredit),
    ]);

    // Check if balanced
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    // Generate table
    autoTable(doc, {
      startY: yPosition,
      head: [['Account #', 'Account Name', 'Debit', 'Credit']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: BRAND_COLOR_RGB,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left',
      },
      bodyStyles: {
        textColor: TEXT_COLOR_RGB,
      },
      columnStyles: {
        0: { cellWidth: 25, halign: 'left' },
        1: { cellWidth: 85, halign: 'left' },
        2: { cellWidth: 30, halign: 'right', font: 'courier' },
        3: { cellWidth: 30, halign: 'right', font: 'courier' },
      },
      alternateRowStyles: {
        fillColor: SECONDARY_COLOR_RGB,
      },
      didParseCell: (data) => {
        // Bold and highlight the totals row
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = isBalanced
            ? [220, 252, 231] // Light green if balanced
            : [254, 226, 226]; // Light red if not balanced
        }
      },
      margin: { left: MARGIN, right: MARGIN },
    });

    // Add balance status
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    if (isBalanced) {
      doc.setTextColor(...SUCCESS_COLOR_RGB);
      doc.text('✓ Trial Balance is balanced', MARGIN, finalY);
    } else {
      doc.setTextColor(...ERROR_COLOR_RGB);
      doc.text('✗ Trial Balance is NOT balanced', MARGIN, finalY);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Difference: ${formatCurrency(Math.abs(totalDebit - totalCredit))}`,
        MARGIN,
        finalY + 6
      );
    }

    // Add page numbers
    addPageNumbers(doc);

    // Generate filename
    const filename = `Accountrix_TrialBalance_${formatDateForFilename()}.pdf`;

    // Save the PDF
    doc.save(filename);

    console.log(`Trial balance PDF exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting trial balance to PDF:', error);
    alert('Failed to export trial balance. Please try again.');
  }
}

/**
 * Export bank reconciliation
 */
export function exportBankRecToPDF(bankRec: BankReconciliation): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add header
    addHeader(doc, 'Bank Reconciliation');

    let yPosition = MARGIN + 20;

    // Company name and title
    if (bankRec.companyName) {
      doc.setFontSize(14);
      doc.setTextColor(...HEADER_COLOR_RGB);
      doc.setFont('helvetica', 'bold');
      doc.text(bankRec.companyName, MARGIN, yPosition);
      yPosition += 7;
    }

    doc.setFontSize(16);
    doc.text('Bank Reconciliation', MARGIN, yPosition);
    yPosition += 6;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `As of ${typeof bankRec.date === 'string' ? bankRec.date : formatDate(bankRec.date)}`,
      MARGIN,
      yPosition
    );
    yPosition += 12;

    // Bank balance section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...HEADER_COLOR_RGB);
    doc.text('Bank Statement Balance', MARGIN, yPosition);
    yPosition += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_COLOR_RGB);

    // Bank balance
    doc.text('Balance per bank:', MARGIN + 5, yPosition);
    doc.setFont('courier', 'normal');
    doc.text(formatCurrency(bankRec.bankBalance), MARGIN + 100, yPosition, { align: 'right' });
    yPosition += 8;

    // Bank adjustments
    if (bankRec.bankAdjustments && bankRec.bankAdjustments.length > 0) {
      doc.setFont('helvetica', 'normal');

      bankRec.bankAdjustments.forEach(adj => {
        const prefix = adj.type === 'addition' ? 'Add: ' : 'Less: ';
        doc.text(prefix + adj.description, MARGIN + 5, yPosition);
        doc.setFont('courier', 'normal');
        const amount = adj.type === 'addition' ? adj.amount : -adj.amount;
        doc.text(formatCurrency(amount), MARGIN + 100, yPosition, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        yPosition += 6;
      });
    }

    // Adjusted bank balance
    yPosition += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Adjusted bank balance:', MARGIN + 5, yPosition);
    const adjustedBankBalance = bankRec.bankBalance +
      bankRec.bankAdjustments.reduce((sum, adj) =>
        sum + (adj.type === 'addition' ? adj.amount : -adj.amount), 0);
    doc.setFont('courier', 'bold');
    doc.text(formatCurrency(adjustedBankBalance), MARGIN + 100, yPosition, { align: 'right' });
    yPosition += 12;

    // Book balance section
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...HEADER_COLOR_RGB);
    doc.text('Book Balance', MARGIN, yPosition);
    yPosition += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_COLOR_RGB);

    // Book balance
    doc.text('Balance per books:', MARGIN + 5, yPosition);
    doc.setFont('courier', 'normal');
    doc.text(formatCurrency(bankRec.bookBalance), MARGIN + 100, yPosition, { align: 'right' });
    yPosition += 8;

    // Book adjustments
    if (bankRec.bookAdjustments && bankRec.bookAdjustments.length > 0) {
      doc.setFont('helvetica', 'normal');

      bankRec.bookAdjustments.forEach(adj => {
        const prefix = adj.type === 'addition' ? 'Add: ' : 'Less: ';
        doc.text(prefix + adj.description, MARGIN + 5, yPosition);
        doc.setFont('courier', 'normal');
        const amount = adj.type === 'addition' ? adj.amount : -adj.amount;
        doc.text(formatCurrency(amount), MARGIN + 100, yPosition, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        yPosition += 6;
      });
    }

    // Adjusted book balance
    yPosition += 2;
    doc.setFont('helvetica', 'bold');
    doc.text('Adjusted book balance:', MARGIN + 5, yPosition);
    const adjustedBookBalance = bankRec.bookBalance +
      bankRec.bookAdjustments.reduce((sum, adj) =>
        sum + (adj.type === 'addition' ? adj.amount : -adj.amount), 0);
    doc.setFont('courier', 'bold');
    doc.text(formatCurrency(adjustedBookBalance), MARGIN + 100, yPosition, { align: 'right' });
    yPosition += 12;

    // Reconciliation status
    const isReconciled = Math.abs(adjustedBankBalance - adjustedBookBalance) < 0.01;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    if (isReconciled) {
      doc.setTextColor(...SUCCESS_COLOR_RGB);
      doc.text('✓ Bank Reconciliation is balanced', MARGIN, yPosition);
    } else {
      doc.setTextColor(...ERROR_COLOR_RGB);
      doc.text('✗ Bank Reconciliation is NOT balanced', MARGIN, yPosition);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Difference: ${formatCurrency(Math.abs(adjustedBankBalance - adjustedBookBalance))}`,
        MARGIN,
        yPosition + 6
      );
    }

    // Add page numbers
    addPageNumbers(doc);

    // Generate filename
    const filename = `Accountrix_BankReconciliation_${formatDateForFilename()}.pdf`;

    // Save the PDF
    doc.save(filename);

    console.log(`Bank reconciliation PDF exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting bank reconciliation to PDF:', error);
    alert('Failed to export bank reconciliation. Please try again.');
  }
}

/**
 * Export AIA G702 Application for Payment form
 */
export function exportAIAFormToPDF(aiaData: AIAFormData): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add header
    addHeader(doc, 'AIA G702 - Application for Payment');

    let yPosition = MARGIN + 20;

    // Form title
    doc.setFontSize(16);
    doc.setTextColor(...HEADER_COLOR_RGB);
    doc.setFont('helvetica', 'bold');
    doc.text('APPLICATION AND CERTIFICATE FOR PAYMENT', MARGIN, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('AIA Document G702', MARGIN, yPosition);
    yPosition += 10;

    // Project information
    doc.setFontSize(11);
    doc.setTextColor(...TEXT_COLOR_RGB);

    doc.setFont('helvetica', 'bold');
    doc.text('Project:', MARGIN, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(aiaData.projectName, MARGIN + 30, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Project No:', MARGIN, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(aiaData.projectNumber, MARGIN + 30, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'bold');
    doc.text('Application Date:', MARGIN, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(
      typeof aiaData.date === 'string' ? aiaData.date : formatDate(aiaData.date),
      MARGIN + 40,
      yPosition
    );
    yPosition += 10;

    // Contract summary table
    const summaryData = [
      ['Original Contract Sum', formatCurrency(aiaData.contractSum)],
    ];

    // Add change orders
    if (aiaData.changeOrders && aiaData.changeOrders.length > 0) {
      aiaData.changeOrders.forEach(co => {
        summaryData.push([
          `Change Order #${co.number}: ${co.description}`,
          formatCurrency(co.amount),
        ]);
      });

      const totalChangeOrders = aiaData.changeOrders.reduce((sum, co) => sum + co.amount, 0);
      summaryData.push([
        'Net Change by Change Orders',
        formatCurrency(totalChangeOrders),
      ]);
    }

    const adjustedContractSum = aiaData.contractSum +
      (aiaData.changeOrders?.reduce((sum, co) => sum + co.amount, 0) || 0);
    summaryData.push([
      'Contract Sum to Date',
      formatCurrency(adjustedContractSum),
    ]);

    autoTable(doc, {
      startY: yPosition,
      body: summaryData,
      theme: 'grid',
      styles: {
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: 120, halign: 'left' },
        1: { cellWidth: 50, halign: 'right', font: 'courier', fontStyle: 'bold' },
      },
      margin: { left: MARGIN, right: MARGIN },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // Work completed table
    const workData = [
      ['Work Completed', formatCurrency(aiaData.workCompleted)],
      ['Materials Stored', formatCurrency(aiaData.materialsStored)],
      ['Total Completed and Stored to Date', formatCurrency(aiaData.totalCompleted)],
      ['Retainage', `(${formatCurrency(aiaData.retainage)})`],
      ['Total Earned Less Retainage', formatCurrency(aiaData.totalCompleted - aiaData.retainage)],
      ['Less Previous Certificates for Payment', `(${formatCurrency(aiaData.previousPayments)})`],
      ['Current Payment Due', formatCurrency(aiaData.currentPaymentDue)],
    ];

    autoTable(doc, {
      startY: yPosition,
      body: workData,
      theme: 'grid',
      styles: {
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: 120, halign: 'left' },
        1: { cellWidth: 50, halign: 'right', font: 'courier' },
      },
      didParseCell: (data) => {
        // Bold the last row (current payment due)
        if (data.row.index === workData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [220, 252, 231]; // Light green
        }
      },
      margin: { left: MARGIN, right: MARGIN },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // Signature section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('This form is based on AIA Document G702-1992', MARGIN, yPosition);

    // Add page numbers
    addPageNumbers(doc);

    // Generate filename
    const sanitizedProject = aiaData.projectNumber.replace(/[^a-zA-Z0-9]/g, '');
    const filename = `Accountrix_AIA_G702_${sanitizedProject}_${formatDateForFilename()}.pdf`;

    // Save the PDF
    doc.save(filename);

    console.log(`AIA form PDF exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting AIA form to PDF:', error);
    alert('Failed to export AIA form. Please try again.');
  }
}
