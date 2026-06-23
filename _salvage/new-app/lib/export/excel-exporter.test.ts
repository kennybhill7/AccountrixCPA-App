/**
 * Excel Exporter Tests
 *
 * Simple test to verify exports work correctly
 * Uncomment and run to test all export functions
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
// TEST DATA
// ============================================================================

const testTrialBalance: TrialBalance = {
  date: new Date(),
  companyName: 'Test Company',
  accounts: [
    { number: '1000', name: 'Cash', debit: 10000, credit: 0 },
    { number: '2000', name: 'Accounts Payable', debit: 0, credit: 10000 },
  ],
};

const testJournalEntries: JournalEntry[] = [
  {
    date: new Date(),
    reference: 'TEST-001',
    account: 'Cash',
    debit: 1000,
    credit: 0,
    description: 'Test entry',
  },
  {
    date: new Date(),
    reference: 'TEST-001',
    account: 'Revenue',
    debit: 0,
    credit: 1000,
    description: 'Test entry',
  },
];

const testBankRec: BankReconciliation = {
  date: new Date(),
  companyName: 'Test Company',
  bankBalance: 10000,
  bookBalance: 9500,
  bankAdjustments: [
    { description: 'Outstanding checks', amount: 500, type: 'deduction' },
  ],
  bookAdjustments: [],
};

const testWIPSchedule: WIPSchedule = {
  asOfDate: new Date(),
  companyName: 'Test Construction',
  projects: [
    {
      name: 'Test Project',
      contractValue: 100000,
      costsToDate: 40000,
      estimatedTotalCosts: 80000,
      percentComplete: 0.5,
      revenueRecognized: 50000,
      grossProfit: 10000,
      grossProfitPercent: 0.2,
    },
  ],
};

const testChartOfAccounts: ChartOfAccounts = {
  companyName: 'Test Company',
  accounts: [
    {
      number: '1000',
      name: 'Cash',
      type: 'Asset',
      category: 'Current Assets',
      normalBalance: 'Debit',
      description: 'Test account',
    },
  ],
};

const testConsolidation: ConsolidationData = {
  consolidationDate: new Date(),
  entities: [
    {
      name: 'Parent',
      financials: {
        date: new Date(),
        accounts: [
          { number: '1000', name: 'Cash', debit: 5000, credit: 0 },
        ],
      },
    },
  ],
  eliminations: [
    {
      date: new Date(),
      reference: 'ELIM-001',
      account: 'Investment',
      debit: 0,
      credit: 5000,
      description: 'Test elimination',
    },
  ],
};

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

function testTrialBalanceExport() {
  console.log('Testing Trial Balance export...');
  try {
    exportTrialBalanceToExcel(testTrialBalance);
    console.log('✓ Trial Balance export test passed');
    return true;
  } catch (error) {
    console.error('✗ Trial Balance export test failed:', error);
    return false;
  }
}

function testJournalEntriesExport() {
  console.log('Testing Journal Entries export...');
  try {
    exportJournalEntriesToExcel(testJournalEntries);
    console.log('✓ Journal Entries export test passed');
    return true;
  } catch (error) {
    console.error('✗ Journal Entries export test failed:', error);
    return false;
  }
}

function testBankRecExport() {
  console.log('Testing Bank Reconciliation export...');
  try {
    exportBankRecToExcel(testBankRec);
    console.log('✓ Bank Reconciliation export test passed');
    return true;
  } catch (error) {
    console.error('✗ Bank Reconciliation export test failed:', error);
    return false;
  }
}

function testWIPScheduleExport() {
  console.log('Testing WIP Schedule export...');
  try {
    exportWIPScheduleToExcel(testWIPSchedule);
    console.log('✓ WIP Schedule export test passed');
    return true;
  } catch (error) {
    console.error('✗ WIP Schedule export test failed:', error);
    return false;
  }
}

function testChartOfAccountsExport() {
  console.log('Testing Chart of Accounts export...');
  try {
    exportChartOfAccountsToExcel(testChartOfAccounts);
    console.log('✓ Chart of Accounts export test passed');
    return true;
  } catch (error) {
    console.error('✗ Chart of Accounts export test failed:', error);
    return false;
  }
}

function testConsolidationExport() {
  console.log('Testing Consolidation Worksheet export...');
  try {
    exportConsolidationWorksheetToExcel(testConsolidation);
    console.log('✓ Consolidation Worksheet export test passed');
    return true;
  } catch (error) {
    console.error('✗ Consolidation Worksheet export test failed:', error);
    return false;
  }
}

function testAllTemplatesExport() {
  console.log('Testing All Templates export...');
  try {
    exportAllTemplatesWorkbook();
    console.log('✓ All Templates export test passed');
    return true;
  } catch (error) {
    console.error('✗ All Templates export test failed:', error);
    return false;
  }
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

export function runAllTests() {
  console.log('\n========================================');
  console.log('Excel Exporter - Running All Tests');
  console.log('========================================\n');

  const results = [
    testTrialBalanceExport(),
    testJournalEntriesExport(),
    testBankRecExport(),
    testWIPScheduleExport(),
    testChartOfAccountsExport(),
    testConsolidationExport(),
    testAllTemplatesExport(),
  ];

  const passed = results.filter(r => r).length;
  const total = results.length;

  console.log('\n========================================');
  console.log(`Test Results: ${passed}/${total} passed`);
  console.log('========================================\n');

  return passed === total;
}

// Uncomment to run tests
// runAllTests();

/**
 * Type checking tests
 * These will fail at compile time if types are incorrect
 */
function typeCheckingTests() {
  // These should all compile without errors

  // TrialBalance type check
  const tb: TrialBalance = testTrialBalance;

  // JournalEntry type check
  const je: JournalEntry = testJournalEntries[0];

  // BankReconciliation type check
  const br: BankReconciliation = testBankRec;

  // WIPSchedule type check
  const wip: WIPSchedule = testWIPSchedule;

  // ChartOfAccounts type check
  const coa: ChartOfAccounts = testChartOfAccounts;

  // ConsolidationData type check
  const cons: ConsolidationData = testConsolidation;

  console.log('All type checks passed');
}

export { typeCheckingTests };
