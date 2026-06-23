/**
 * Excel Exporter Usage Examples
 *
 * This file demonstrates how to use all the Excel export functions
 * with sample data for testing and development purposes.
 */

import {
  exportTrialBalanceToExcel,
  exportJournalEntriesToExcel,
  exportBankRecToExcel,
  exportWIPScheduleToExcel,
  exportChartOfAccountsToExcel,
  exportConsolidationWorksheetToExcel,
  exportAllTemplatesWorkbook,
  type TrialBalance,
  type JournalEntry,
  type BankReconciliation,
  type WIPSchedule,
  type ChartOfAccounts,
  type ConsolidationData,
} from './excel-exporter';

// ============================================================================
// SAMPLE DATA
// ============================================================================

/**
 * Sample Trial Balance
 */
const sampleTrialBalance: TrialBalance = {
  date: new Date('2025-10-13'),
  companyName: 'Accountrix Demo Company',
  accounts: [
    { number: '1000', name: 'Cash', debit: 25000, credit: 0 },
    { number: '1100', name: 'Accounts Receivable', debit: 15000, credit: 0 },
    { number: '1200', name: 'Inventory', debit: 30000, credit: 0 },
    { number: '1500', name: 'Equipment', debit: 50000, credit: 0 },
    { number: '1600', name: 'Accumulated Depreciation', debit: 0, credit: 10000 },
    { number: '2000', name: 'Accounts Payable', debit: 0, credit: 18000 },
    { number: '2100', name: 'Notes Payable', debit: 0, credit: 30000 },
    { number: '3000', name: 'Common Stock', debit: 0, credit: 50000 },
    { number: '3100', name: 'Retained Earnings', debit: 0, credit: 5000 },
    { number: '4000', name: 'Sales Revenue', debit: 0, credit: 75000 },
    { number: '5000', name: 'Cost of Goods Sold', debit: 40000, credit: 0 },
    { number: '6000', name: 'Salaries Expense', debit: 20000, credit: 0 },
    { number: '6100', name: 'Rent Expense', debit: 5000, credit: 0 },
    { number: '6200', name: 'Utilities Expense', debit: 3000, credit: 0 },
  ],
};

/**
 * Sample Journal Entries
 */
const sampleJournalEntries: JournalEntry[] = [
  {
    date: new Date('2025-10-01'),
    reference: 'JE-001',
    account: 'Cash',
    debit: 10000,
    credit: 0,
    description: 'Investment by owner',
  },
  {
    date: new Date('2025-10-01'),
    reference: 'JE-001',
    account: 'Common Stock',
    debit: 0,
    credit: 10000,
    description: 'Investment by owner',
  },
  {
    date: new Date('2025-10-05'),
    reference: 'JE-002',
    account: 'Equipment',
    debit: 5000,
    credit: 0,
    description: 'Purchase of office equipment',
  },
  {
    date: new Date('2025-10-05'),
    reference: 'JE-002',
    account: 'Cash',
    debit: 0,
    credit: 5000,
    description: 'Purchase of office equipment',
  },
  {
    date: new Date('2025-10-10'),
    reference: 'JE-003',
    account: 'Accounts Receivable',
    debit: 8000,
    credit: 0,
    description: 'Sales on credit',
  },
  {
    date: new Date('2025-10-10'),
    reference: 'JE-003',
    account: 'Sales Revenue',
    debit: 0,
    credit: 8000,
    description: 'Sales on credit',
  },
  {
    date: new Date('2025-10-10'),
    reference: 'JE-003',
    account: 'Cost of Goods Sold',
    debit: 4500,
    credit: 0,
    description: 'Cost of goods sold',
  },
  {
    date: new Date('2025-10-10'),
    reference: 'JE-003',
    account: 'Inventory',
    debit: 0,
    credit: 4500,
    description: 'Cost of goods sold',
  },
];

/**
 * Sample Bank Reconciliation
 */
const sampleBankRec: BankReconciliation = {
  date: new Date('2025-10-31'),
  companyName: 'Accountrix Demo Company',
  bankBalance: 28500,
  bookBalance: 25000,
  bankAdjustments: [
    { description: 'Deposits in transit', amount: 5000, type: 'addition' },
    { description: 'Outstanding checks', amount: 3500, type: 'deduction' },
  ],
  bookAdjustments: [
    { description: 'Bank service charges', amount: 50, type: 'deduction' },
    { description: 'Interest earned', amount: 25, type: 'addition' },
    { description: 'NSF check', amount: 500, type: 'deduction' },
  ],
};

/**
 * Sample WIP Schedule (Construction)
 */
const sampleWIPSchedule: WIPSchedule = {
  asOfDate: new Date('2025-10-31'),
  companyName: 'ABC Construction Company',
  projects: [
    {
      name: 'Tower One Downtown',
      contractValue: 5000000,
      costsToDate: 2000000,
      estimatedTotalCosts: 4000000,
      percentComplete: 0.5,
      revenueRecognized: 2500000,
      grossProfit: 500000,
      grossProfitPercent: 0.2,
    },
    {
      name: 'Plaza East Renovation',
      contractValue: 3000000,
      costsToDate: 1500000,
      estimatedTotalCosts: 2500000,
      percentComplete: 0.6,
      revenueRecognized: 1800000,
      grossProfit: 300000,
      grossProfitPercent: 0.1667,
    },
    {
      name: 'Office Complex Phase 2',
      contractValue: 8000000,
      costsToDate: 3200000,
      estimatedTotalCosts: 6500000,
      percentComplete: 0.4923,
      revenueRecognized: 3938400,
      grossProfit: 738400,
      grossProfitPercent: 0.1875,
    },
    {
      name: 'Retail Center Expansion',
      contractValue: 2500000,
      costsToDate: 500000,
      estimatedTotalCosts: 2000000,
      percentComplete: 0.25,
      revenueRecognized: 625000,
      grossProfit: 125000,
      grossProfitPercent: 0.2,
    },
  ],
};

/**
 * Sample Chart of Accounts
 */
const sampleChartOfAccounts: ChartOfAccounts = {
  companyName: 'Accountrix Demo Company',
  accounts: [
    {
      number: '1000',
      name: 'Cash',
      type: 'Asset',
      category: 'Current Assets',
      normalBalance: 'Debit',
      description: 'Cash on hand and in bank accounts',
    },
    {
      number: '1100',
      name: 'Accounts Receivable',
      type: 'Asset',
      category: 'Current Assets',
      normalBalance: 'Debit',
      description: 'Amounts owed by customers',
    },
    {
      number: '1200',
      name: 'Inventory',
      type: 'Asset',
      category: 'Current Assets',
      normalBalance: 'Debit',
      description: 'Merchandise held for resale',
    },
    {
      number: '1300',
      name: 'Prepaid Insurance',
      type: 'Asset',
      category: 'Current Assets',
      normalBalance: 'Debit',
      description: 'Insurance paid in advance',
    },
    {
      number: '1500',
      name: 'Equipment',
      type: 'Asset',
      category: 'Fixed Assets',
      normalBalance: 'Debit',
      description: 'Office and production equipment',
    },
    {
      number: '1600',
      name: 'Accumulated Depreciation - Equipment',
      type: 'Asset',
      category: 'Fixed Assets',
      normalBalance: 'Credit',
      description: 'Contra-asset account for equipment depreciation',
    },
    {
      number: '2000',
      name: 'Accounts Payable',
      type: 'Liability',
      category: 'Current Liabilities',
      normalBalance: 'Credit',
      description: 'Amounts owed to suppliers',
    },
    {
      number: '2100',
      name: 'Notes Payable',
      type: 'Liability',
      category: 'Current Liabilities',
      normalBalance: 'Credit',
      description: 'Short-term loans payable',
    },
    {
      number: '2500',
      name: 'Long-term Debt',
      type: 'Liability',
      category: 'Long-term Liabilities',
      normalBalance: 'Credit',
      description: 'Loans payable beyond one year',
    },
    {
      number: '3000',
      name: 'Common Stock',
      type: 'Equity',
      category: "Stockholders' Equity",
      normalBalance: 'Credit',
      description: 'Par value of shares issued',
    },
    {
      number: '3100',
      name: 'Retained Earnings',
      type: 'Equity',
      category: "Stockholders' Equity",
      normalBalance: 'Credit',
      description: 'Cumulative net income retained in business',
    },
    {
      number: '4000',
      name: 'Sales Revenue',
      type: 'Revenue',
      category: 'Operating Revenue',
      normalBalance: 'Credit',
      description: 'Revenue from sale of goods',
    },
    {
      number: '4100',
      name: 'Service Revenue',
      type: 'Revenue',
      category: 'Operating Revenue',
      normalBalance: 'Credit',
      description: 'Revenue from services provided',
    },
    {
      number: '5000',
      name: 'Cost of Goods Sold',
      type: 'Expense',
      category: 'Cost of Sales',
      normalBalance: 'Debit',
      description: 'Direct costs of products sold',
    },
    {
      number: '6000',
      name: 'Salaries Expense',
      type: 'Expense',
      category: 'Operating Expenses',
      normalBalance: 'Debit',
      description: 'Employee compensation',
    },
    {
      number: '6100',
      name: 'Rent Expense',
      type: 'Expense',
      category: 'Operating Expenses',
      normalBalance: 'Debit',
      description: 'Rent for office space',
    },
    {
      number: '6200',
      name: 'Utilities Expense',
      type: 'Expense',
      category: 'Operating Expenses',
      normalBalance: 'Debit',
      description: 'Electric, water, gas, internet',
    },
    {
      number: '6300',
      name: 'Depreciation Expense',
      type: 'Expense',
      category: 'Operating Expenses',
      normalBalance: 'Debit',
      description: 'Depreciation of fixed assets',
    },
  ],
};

/**
 * Sample Consolidation Data
 */
const sampleConsolidationData: ConsolidationData = {
  consolidationDate: new Date('2025-12-31'),
  entities: [
    {
      name: 'Parent Corp',
      financials: {
        date: new Date('2025-12-31'),
        companyName: 'Parent Corp',
        accounts: [
          { number: '1000', name: 'Cash', debit: 50000, credit: 0 },
          { number: '1100', name: 'Accounts Receivable', debit: 30000, credit: 0 },
          { number: '1300', name: 'Investment in Subsidiary', debit: 100000, credit: 0 },
          { number: '2000', name: 'Accounts Payable', debit: 0, credit: 20000 },
          { number: '3000', name: 'Common Stock', debit: 0, credit: 100000 },
          { number: '3100', name: 'Retained Earnings', debit: 0, credit: 60000 },
        ],
      },
    },
    {
      name: 'Subsidiary A',
      financials: {
        date: new Date('2025-12-31'),
        companyName: 'Subsidiary A',
        accounts: [
          { number: '1000', name: 'Cash', debit: 20000, credit: 0 },
          { number: '1100', name: 'Accounts Receivable', debit: 15000, credit: 0 },
          { number: '2000', name: 'Accounts Payable', debit: 0, credit: 10000 },
          { number: '2100', name: 'Intercompany Payable', debit: 0, credit: 5000 },
          { number: '3000', name: 'Common Stock', debit: 0, credit: 15000 },
          { number: '3100', name: 'Retained Earnings', debit: 0, credit: 5000 },
        ],
      },
    },
    {
      name: 'Subsidiary B',
      financials: {
        date: new Date('2025-12-31'),
        companyName: 'Subsidiary B',
        accounts: [
          { number: '1000', name: 'Cash', debit: 15000, credit: 0 },
          { number: '1100', name: 'Accounts Receivable', debit: 10000, credit: 0 },
          { number: '1200', name: 'Intercompany Receivable', debit: 5000, credit: 0 },
          { number: '2000', name: 'Accounts Payable', debit: 0, credit: 8000 },
          { number: '3000', name: 'Common Stock', debit: 0, credit: 18000 },
          { number: '3100', name: 'Retained Earnings', debit: 0, credit: 4000 },
        ],
      },
    },
  ],
  eliminations: [
    {
      date: new Date('2025-12-31'),
      reference: 'ELIM-001',
      account: 'Investment in Subsidiary',
      debit: 0,
      credit: 100000,
      description: 'Eliminate investment in subsidiaries',
    },
    {
      date: new Date('2025-12-31'),
      reference: 'ELIM-001',
      account: 'Common Stock - Subsidiary A',
      debit: 15000,
      credit: 0,
      description: 'Eliminate subsidiary A equity',
    },
    {
      date: new Date('2025-12-31'),
      reference: 'ELIM-001',
      account: 'Retained Earnings - Subsidiary A',
      debit: 5000,
      credit: 0,
      description: 'Eliminate subsidiary A equity',
    },
    {
      date: new Date('2025-12-31'),
      reference: 'ELIM-001',
      account: 'Common Stock - Subsidiary B',
      debit: 18000,
      credit: 0,
      description: 'Eliminate subsidiary B equity',
    },
    {
      date: new Date('2025-12-31'),
      reference: 'ELIM-001',
      account: 'Retained Earnings - Subsidiary B',
      debit: 4000,
      credit: 0,
      description: 'Eliminate subsidiary B equity',
    },
    {
      date: new Date('2025-12-31'),
      reference: 'ELIM-001',
      account: 'Goodwill',
      debit: 58000,
      credit: 0,
      description: 'Record goodwill on acquisition',
    },
    {
      date: new Date('2025-12-31'),
      reference: 'ELIM-002',
      account: 'Intercompany Payable',
      debit: 5000,
      credit: 0,
      description: 'Eliminate intercompany balances',
    },
    {
      date: new Date('2025-12-31'),
      reference: 'ELIM-002',
      account: 'Intercompany Receivable',
      debit: 0,
      credit: 5000,
      description: 'Eliminate intercompany balances',
    },
  ],
};

// ============================================================================
// EXAMPLE USAGE FUNCTIONS
// ============================================================================

/**
 * Example 1: Export Trial Balance
 */
export function example1_ExportTrialBalance() {
  console.log('Example 1: Exporting Trial Balance...');
  exportTrialBalanceToExcel(sampleTrialBalance);
  console.log('✓ Trial Balance exported successfully!');
}

/**
 * Example 2: Export Journal Entries
 */
export function example2_ExportJournalEntries() {
  console.log('Example 2: Exporting Journal Entries...');
  exportJournalEntriesToExcel(sampleJournalEntries);
  console.log('✓ Journal Entries exported successfully!');
}

/**
 * Example 3: Export Bank Reconciliation
 */
export function example3_ExportBankReconciliation() {
  console.log('Example 3: Exporting Bank Reconciliation...');
  exportBankRecToExcel(sampleBankRec);
  console.log('✓ Bank Reconciliation exported successfully!');
}

/**
 * Example 4: Export WIP Schedule
 */
export function example4_ExportWIPSchedule() {
  console.log('Example 4: Exporting WIP Schedule...');
  exportWIPScheduleToExcel(sampleWIPSchedule);
  console.log('✓ WIP Schedule exported successfully!');
}

/**
 * Example 5: Export Chart of Accounts
 */
export function example5_ExportChartOfAccounts() {
  console.log('Example 5: Exporting Chart of Accounts...');
  exportChartOfAccountsToExcel(sampleChartOfAccounts);
  console.log('✓ Chart of Accounts exported successfully!');
}

/**
 * Example 6: Export Consolidation Worksheet
 */
export function example6_ExportConsolidation() {
  console.log('Example 6: Exporting Consolidation Worksheet...');
  exportConsolidationWorksheetToExcel(sampleConsolidationData);
  console.log('✓ Consolidation Worksheet exported successfully!');
}

/**
 * Example 7: Export All Templates
 */
export function example7_ExportAllTemplates() {
  console.log('Example 7: Exporting All Templates...');
  exportAllTemplatesWorkbook();
  console.log('✓ All Templates exported successfully!');
}

/**
 * Run all examples
 */
export function runAllExamples() {
  console.log('===================================');
  console.log('Excel Exporter - Running All Examples');
  console.log('===================================\n');

  try {
    example1_ExportTrialBalance();
    console.log('');

    example2_ExportJournalEntries();
    console.log('');

    example3_ExportBankReconciliation();
    console.log('');

    example4_ExportWIPSchedule();
    console.log('');

    example5_ExportChartOfAccounts();
    console.log('');

    example6_ExportConsolidation();
    console.log('');

    example7_ExportAllTemplates();
    console.log('');

    console.log('===================================');
    console.log('✓ All examples completed successfully!');
    console.log('===================================');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Uncomment to run all examples when this file is executed
// runAllExamples();
