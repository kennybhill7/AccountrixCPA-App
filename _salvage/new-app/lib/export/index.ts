/**
 * Export System - Main Export File
 *
 * Import all PDF and Excel export functions and types from this single entry point
 *
 * @example
 * ```typescript
 * import { exportLessonToPDF, exportTrialBalanceToExcel } from '@/lib/export';
 * ```
 */

// ============================================================================
// PDF EXPORTS
// ============================================================================

export {
  exportLessonToPDF,
  exportQuizResultsToPDF,
  exportCertificateToPDF,
  exportJournalEntriesToPDF,
  exportTrialBalanceToPDF,
  exportBankRecToPDF,
  exportAIAFormToPDF,
  formatCurrency,
  formatDate,
} from './pdf-exporter';

// PDF Export Types
export type {
  LessonContent,
  QuizQuestion,
  UserAnswer,
  QuizResults,
  CertificateData,
  JournalEntry as PDFJournalEntry,
  TrialBalanceAccount,
  TrialBalance as PDFTrialBalance,
  BankReconciliationItem,
  BankReconciliation as PDFBankReconciliation,
  AIAFormData,
} from './pdf-exporter';

// ============================================================================
// EXCEL EXPORTS
// ============================================================================

export {
  exportTrialBalanceToExcel,
  exportJournalEntriesToExcel,
  exportBankRecToExcel,
  exportWIPScheduleToExcel,
  exportChartOfAccountsToExcel,
  exportConsolidationWorksheetToExcel,
  exportAllTemplatesWorkbook,
} from './excel-exporter';

// Excel Export Types
export type {
  TrialBalance,
  JournalEntry,
  BankReconciliation,
  WIPSchedule,
  ChartOfAccounts,
  ConsolidationData,
} from './excel-exporter';
