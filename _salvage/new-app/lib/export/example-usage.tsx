/**
 * Example Usage of PDF Export System
 * Demonstrates how to integrate PDF export functionality into React components
 */

'use client';

import { useState } from 'react';
import {
  exportLessonToPDF,
  exportQuizResultsToPDF,
  exportCertificateToPDF,
  exportJournalEntriesToPDF,
  exportTrialBalanceToPDF,
  exportBankRecToPDF,
  exportAIAFormToPDF,
  type LessonContent,
  type QuizResults,
  type CertificateData,
  type JournalEntry,
  type TrialBalance,
  type BankReconciliation,
  type AIAFormData,
} from './pdf-exporter';

// ============================================================================
// EXAMPLE 1: Export Lesson Component
// ============================================================================

export function ExportLessonButton({ lesson }: { lesson: LessonContent }) {
  const handleExport = () => {
    try {
      exportLessonToPDF(lesson);
    } catch (error) {
      console.error('Failed to export lesson:', error);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Export Lesson to PDF
    </button>
  );
}

// Example usage:
const exampleLesson: LessonContent = {
  title: "Introduction to the Accounting Equation",
  content: `
    <h2>Understanding Assets, Liabilities, and Equity</h2>

    <p>The accounting equation is the foundation of double-entry bookkeeping. It states that:</p>

    <p><strong>Assets = Liabilities + Equity</strong></p>

    <h3>Assets</h3>
    <p>Assets are resources owned by a business that have economic value. Examples include:</p>
    <ul>
      <li>Cash</li>
      <li>Accounts Receivable</li>
      <li>Inventory</li>
      <li>Equipment</li>
      <li>Buildings</li>
    </ul>

    <h3>Liabilities</h3>
    <p>Liabilities are obligations that a business owes to others. Examples include:</p>
    <ul>
      <li>Accounts Payable</li>
      <li>Notes Payable</li>
      <li>Loans</li>
      <li>Salaries Payable</li>
    </ul>

    <h3>Equity</h3>
    <p>Equity represents the owner's investment in the business plus retained earnings. It includes:</p>
    <ul>
      <li>Owner's Capital</li>
      <li>Retained Earnings</li>
      <li>Common Stock</li>
    </ul>

    <h3>Key Principle</h3>
    <p>The accounting equation must always balance. Every transaction affects at least two accounts,
    maintaining the equality of the equation.</p>
  `,
  estimatedMinutes: 30,
  moduleId: "M1",
  weekId: "W1",
};

// ============================================================================
// EXAMPLE 2: Export Quiz Results Component
// ============================================================================

export function ExportQuizResultsButton({ results }: { results: QuizResults }) {
  const handleExport = () => {
    try {
      exportQuizResultsToPDF(results);
    } catch (error) {
      console.error('Failed to export quiz results:', error);
    }
  };

  const scorePercent = (results.score / results.totalQuestions) * 100;
  const scoreColor = scorePercent >= 70 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">{results.quizTitle}</h3>
          <p className={`text-2xl font-bold ${scoreColor}`}>
            Score: {results.score}/{results.totalQuestions} ({scorePercent.toFixed(1)}%)
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export Results to PDF
        </button>
      </div>
    </div>
  );
}

// Example quiz results data:
const exampleQuizResults: QuizResults = {
  quizTitle: "Module 1 Week 1 Assessment",
  userName: "John Doe",
  score: 8,
  totalQuestions: 10,
  dateTaken: new Date(),
  moduleId: "M1",
  weekId: "W1",
  questions: [
    {
      id: "q1",
      question: "What is the fundamental accounting equation?",
      options: [
        "Assets = Liabilities + Equity",
        "Assets = Liabilities - Equity",
        "Assets + Liabilities = Equity",
        "Assets - Equity = Liabilities"
      ],
      correctAnswer: 0,
      explanation: "The fundamental accounting equation shows that a company's assets are equal to the sum of its liabilities and equity. This equation must always balance."
    },
    {
      id: "q2",
      question: "Which of the following is an example of an asset?",
      options: [
        "Accounts Payable",
        "Notes Payable",
        "Accounts Receivable",
        "Owner's Capital"
      ],
      correctAnswer: 2,
      explanation: "Accounts Receivable represents money owed to the company by customers, making it an asset. The other options are either liabilities or equity."
    },
    // Add more questions...
  ],
  answers: [
    { questionId: "q1", selectedAnswer: 0, isCorrect: true },
    { questionId: "q2", selectedAnswer: 2, isCorrect: true },
    // Add more answers...
  ]
};

// ============================================================================
// EXAMPLE 3: Export Certificate Component
// ============================================================================

export function ExportCertificateButton({ userData }: { userData: CertificateData }) {
  const handleExport = () => {
    try {
      exportCertificateToPDF(userData);
    } catch (error) {
      console.error('Failed to export certificate:', error);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">Congratulations!</h2>
        <p className="text-lg text-gray-700">
          You have completed the course with a score of <span className="font-bold text-green-600">{userData.finalScore}%</span>
        </p>
      </div>

      <button
        onClick={handleExport}
        className="w-full px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
      >
        Download Certificate
      </button>
    </div>
  );
}

// Example certificate data:
const exampleCertificate: CertificateData = {
  userName: "John Doe",
  completionDate: new Date(),
  finalScore: 92,
  courseTitle: "Accounting Fundamentals",
  competencies: [
    "Understanding of Double-Entry Bookkeeping",
    "Journal Entry Preparation and Analysis",
    "Trial Balance Creation and Verification",
    "Bank Reconciliation Procedures",
    "Financial Statement Interpretation"
  ],
  instructorName: "Prof. Jane Smith",
  certificateId: "ACCT-2025-001234"
};

// ============================================================================
// EXAMPLE 4: Export Journal Entries Component
// ============================================================================

export function JournalEntryWorksheet() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      date: new Date('2025-01-15'),
      account: "Cash",
      debit: 10000,
      credit: 0,
      description: "Initial capital investment",
      reference: "JE-001"
    },
    {
      date: new Date('2025-01-15'),
      account: "Owner's Capital",
      debit: 0,
      credit: 10000,
      description: "Initial capital investment",
      reference: "JE-001"
    },
    {
      date: new Date('2025-01-20'),
      account: "Office Supplies",
      debit: 500,
      credit: 0,
      description: "Purchased office supplies",
      reference: "JE-002"
    },
    {
      date: new Date('2025-01-20'),
      account: "Cash",
      debit: 0,
      credit: 500,
      description: "Purchased office supplies",
      reference: "JE-002"
    },
  ]);

  const handleExport = () => {
    try {
      exportJournalEntriesToPDF(entries);
    } catch (error) {
      console.error('Failed to export journal entries:', error);
    }
  };

  const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Journal Entries</h2>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export to PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Account</th>
              <th className="border border-gray-300 px-4 py-2">Debit</th>
              <th className="border border-gray-300 px-4 py-2">Credit</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{entry.account}</td>
                <td className="border border-gray-300 px-4 py-2 text-right font-mono">
                  {entry.debit > 0 ? entry.debit.toFixed(2) : ''}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right font-mono">
                  {entry.credit > 0 ? entry.credit.toFixed(2) : ''}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{entry.description}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-200 font-bold">
            <tr>
              <td className="border border-gray-300 px-4 py-2" colSpan={2}>TOTALS</td>
              <td className="border border-gray-300 px-4 py-2 text-right font-mono">
                {totalDebit.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right font-mono">
                {totalCredit.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {isBalanced ? (
                  <span className="text-green-600">Balanced</span>
                ) : (
                  <span className="text-red-600">Not Balanced</span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Export Trial Balance Component
// ============================================================================

export function TrialBalanceWorksheet() {
  const trialBalance: TrialBalance = {
    date: new Date(),
    companyName: "ABC Company",
    accounts: [
      { accountNumber: "1000", accountName: "Cash", debit: 15000, credit: 0 },
      { accountNumber: "1100", accountName: "Accounts Receivable", debit: 8500, credit: 0 },
      { accountNumber: "1200", accountName: "Inventory", debit: 12000, credit: 0 },
      { accountNumber: "1500", accountName: "Equipment", debit: 25000, credit: 0 },
      { accountNumber: "2000", accountName: "Accounts Payable", debit: 0, credit: 5500 },
      { accountNumber: "2100", accountName: "Notes Payable", debit: 0, credit: 20000 },
      { accountNumber: "3000", accountName: "Owner's Capital", debit: 0, credit: 30000 },
      { accountNumber: "4000", accountName: "Service Revenue", debit: 0, credit: 15000 },
      { accountNumber: "5000", accountName: "Rent Expense", debit: 3000, credit: 0 },
      { accountNumber: "5100", accountName: "Salaries Expense", debit: 7000, credit: 0 },
    ]
  };

  const handleExport = () => {
    try {
      exportTrialBalanceToPDF(trialBalance);
    } catch (error) {
      console.error('Failed to export trial balance:', error);
    }
  };

  const totalDebit = trialBalance.accounts.reduce((sum, acc) => sum + acc.debit, 0);
  const totalCredit = trialBalance.accounts.reduce((sum, acc) => sum + acc.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{trialBalance.companyName}</h2>
          <p className="text-gray-600">Trial Balance - {new Date(trialBalance.date).toLocaleDateString()}</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export to PDF
        </button>
      </div>

      <div className={`p-4 rounded-lg ${isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2`}>
        <p className={`font-semibold ${isBalanced ? 'text-green-700' : 'text-red-700'}`}>
          {isBalanced ? '✓ Trial Balance is balanced' : '✗ Trial Balance is NOT balanced'}
        </p>
        {!isBalanced && (
          <p className="text-sm text-red-600">
            Difference: ${Math.abs(totalDebit - totalCredit).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Export Bank Reconciliation Component
// ============================================================================

export function BankReconciliationWorksheet() {
  const bankRec: BankReconciliation = {
    date: new Date(),
    companyName: "ABC Company",
    bankBalance: 15750,
    bookBalance: 14650,
    bankAdjustments: [
      { description: "Outstanding check #1001", amount: 850, type: 'deduction' },
      { description: "Outstanding check #1002", amount: 425, type: 'deduction' },
      { description: "Deposit in transit", amount: 1200, type: 'addition' }
    ],
    bookAdjustments: [
      { description: "NSF check from customer", amount: 500, type: 'deduction' },
      { description: "Bank service charge", amount: 25, type: 'deduction' },
      { description: "Interest earned", amount: 150, type: 'addition' }
    ]
  };

  const handleExport = () => {
    try {
      exportBankRecToPDF(bankRec);
    } catch (error) {
      console.error('Failed to export bank reconciliation:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bank Reconciliation</h2>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Export AIA Form Component
// ============================================================================

export function AIAFormWorksheet() {
  const aiaData: AIAFormData = {
    projectName: "Downtown Office Building Renovation",
    projectNumber: "2025-001",
    contractDate: new Date('2025-01-01'),
    contractSum: 750000,
    changeOrders: [
      { number: "001", description: "Additional electrical outlets", amount: 12000 },
      { number: "002", description: "Upgraded flooring material", amount: 18000 },
      { number: "003", description: "Added security system", amount: 25000 }
    ],
    workCompleted: 450000,
    materialsStored: 75000,
    totalCompleted: 525000,
    retainage: 52500,
    previousPayments: 350000,
    currentPaymentDue: 122500,
    date: new Date()
  };

  const handleExport = () => {
    try {
      exportAIAFormToPDF(aiaData);
    } catch (error) {
      console.error('Failed to export AIA form:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AIA G702 Application for Payment</h2>
          <p className="text-gray-600">{aiaData.projectName}</p>
          <p className="text-sm text-gray-500">Project #{aiaData.projectNumber}</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export to PDF
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-lg font-semibold text-blue-900">
          Current Payment Due: ${aiaData.currentPaymentDue.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DEMO COMPONENT
// ============================================================================

export function PDFExportDemo() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">PDF Export System Demo</h1>
        <p className="text-lg text-gray-600">
          Comprehensive PDF generation for accounting education materials
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">1. Lesson Export</h2>
        <ExportLessonButton lesson={exampleLesson} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">2. Quiz Results Export</h2>
        <ExportQuizResultsButton results={exampleQuizResults} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">3. Certificate Export</h2>
        <ExportCertificateButton userData={exampleCertificate} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">4. Journal Entries Export</h2>
        <JournalEntryWorksheet />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">5. Trial Balance Export</h2>
        <TrialBalanceWorksheet />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">6. Bank Reconciliation Export</h2>
        <BankReconciliationWorksheet />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">7. AIA Form Export</h2>
        <AIAFormWorksheet />
      </section>
    </div>
  );
}
