import { Account, AccountType, AccountCategory } from '@/components/ChartOfAccountsBuilder';
import * as XLSX from 'xlsx';

/**
 * Export Chart of Accounts to Excel format
 */
export function exportToExcel(accounts: Account[], filename: string = 'chart-of-accounts.xlsx') {
  const data = accounts.map(account => ({
    'Account Number': account.number,
    'Account Name': account.name,
    'Account Type': account.type,
    'Category': account.category,
    'Normal Balance': account.normalBalance,
    'Description': account.description || '',
    'Sub-Account': account.isSubAccount ? 'Yes' : 'No',
    'Parent Account': account.parentAccount || '',
    'Active': account.isActive ? 'Yes' : 'No',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart of Accounts');

  // Set column widths
  const columnWidths = [
    { wch: 15 }, // Account Number
    { wch: 30 }, // Account Name
    { wch: 12 }, // Account Type
    { wch: 20 }, // Category
    { wch: 15 }, // Normal Balance
    { wch: 40 }, // Description
    { wch: 12 }, // Sub-Account
    { wch: 15 }, // Parent Account
    { wch: 10 }, // Active
  ];
  worksheet['!cols'] = columnWidths;

  XLSX.writeFile(workbook, filename);
}

/**
 * Import Chart of Accounts from Excel file
 */
export async function importFromExcel(file: File): Promise<Account[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const accounts: Account[] = jsonData.map((row: any) => ({
          number: String(row['Account Number']),
          name: String(row['Account Name']),
          type: row['Account Type'] as AccountType,
          category: row['Category'] as AccountCategory,
          normalBalance: row['Normal Balance'] as 'DR' | 'CR',
          description: row['Description'] || '',
          isSubAccount: row['Sub-Account'] === 'Yes',
          parentAccount: row['Parent Account'] || undefined,
          isActive: row['Active'] !== 'No',
          hasSubAccounts: false,
        }));

        // Update hasSubAccounts flag
        accounts.forEach(account => {
          account.hasSubAccounts = accounts.some(a => a.parentAccount === account.number);
        });

        resolve(accounts);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
}

/**
 * Generate PDF report of Chart of Accounts
 */
export async function exportToPDF(accounts: Account[], filename: string = 'chart-of-accounts.pdf') {
  // This would use jsPDF for PDF generation
  const jsPDFModule = await import('jspdf');
  const jsPDF = jsPDFModule.default;
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text('Chart of Accounts', 14, 20);

  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  // Statistics
  const stats = {
    total: accounts.length,
    assets: accounts.filter(a => a.type === 'Asset').length,
    liabilities: accounts.filter(a => a.type === 'Liability').length,
    equity: accounts.filter(a => a.type === 'Equity').length,
    revenue: accounts.filter(a => a.type === 'Revenue').length,
    expenses: accounts.filter(a => a.type === 'Expense').length,
  };

  doc.setFontSize(9);
  doc.text(`Total Accounts: ${stats.total} | Assets: ${stats.assets} | Liabilities: ${stats.liabilities} | Equity: ${stats.equity} | Revenue: ${stats.revenue} | Expenses: ${stats.expenses}`, 14, 35);

  // Account table
  const tableData = accounts.map(account => [
    account.number,
    account.name,
    account.type,
    account.normalBalance,
    account.category,
    account.description || '',
  ]);

  (doc as any).autoTable({
    head: [['Number', 'Name', 'Type', 'Balance', 'Category', 'Description']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 66, 66] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 },
      2: { cellWidth: 20 },
      3: { cellWidth: 15 },
      4: { cellWidth: 30 },
      5: { cellWidth: 'auto' },
    },
  });

  doc.save(filename);
}

/**
 * Validate Chart of Accounts for common issues
 */
export function validateCOA(accounts: Account[]): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for duplicate account numbers
  const numbers = accounts.map(a => a.number);
  const duplicates = numbers.filter((num, index) => numbers.indexOf(num) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate account numbers found: ${duplicates.join(', ')}`);
  }

  // Check for accounts outside valid ranges
  accounts.forEach(account => {
    const num = parseInt(account.number);
    const ranges: Record<AccountType, [number, number]> = {
      Asset: [1000, 1999],
      Liability: [2000, 2999],
      Equity: [3000, 3999],
      Revenue: [4000, 4999],
      Expense: [5000, 5999],
    };

    const [min, max] = ranges[account.type];
    if (num < min || num > max) {
      errors.push(`Account ${account.number} (${account.name}) is outside valid range for ${account.type}`);
    }
  });

  // Check for orphaned sub-accounts
  accounts.forEach(account => {
    if (account.isSubAccount && account.parentAccount) {
      const parent = accounts.find(a => a.number === account.parentAccount);
      if (!parent) {
        errors.push(`Account ${account.number} (${account.name}) has invalid parent account ${account.parentAccount}`);
      }
    }
  });

  // Check for mismatched normal balances (warnings only)
  accounts.forEach(account => {
    const expectedBalance = getExpectedNormalBalance(account.type, account.name);
    if (expectedBalance && account.normalBalance !== expectedBalance) {
      warnings.push(`Account ${account.number} (${account.name}) has unusual normal balance ${account.normalBalance}`);
    }
  });

  // Check for missing essential accounts
  const essentialAccounts = [
    { type: 'Asset', name: 'Cash' },
    { type: 'Equity', name: 'Retained Earnings' },
  ];

  essentialAccounts.forEach(essential => {
    const found = accounts.find(a => a.type === essential.type && a.name.toLowerCase().includes(essential.name.toLowerCase()));
    if (!found) {
      warnings.push(`Missing essential account: ${essential.name} (${essential.type})`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get expected normal balance for account type
 */
function getExpectedNormalBalance(type: AccountType, name: string): 'DR' | 'CR' | null {
  // Check for contra-accounts (they have opposite normal balance)
  const contraKeywords = ['accumulated depreciation', 'allowance', 'contra'];
  const isContra = contraKeywords.some(keyword => name.toLowerCase().includes(keyword));

  if (isContra) {
    return type === 'Asset' ? 'CR' : type === 'Expense' ? 'CR' : null;
  }

  // Special case: Draws/Distributions in Equity
  if (type === 'Equity' && name.toLowerCase().includes('draw')) {
    return 'DR';
  }

  // Normal balances
  const normalBalances: Record<AccountType, 'DR' | 'CR'> = {
    Asset: 'DR',
    Liability: 'CR',
    Equity: 'CR',
    Revenue: 'CR',
    Expense: 'DR',
  };

  return normalBalances[type];
}

/**
 * Generate account number suggestions based on existing accounts
 */
export function suggestAccountNumbers(type: AccountType, accounts: Account[]): string[] {
  const suggestions: string[] = [];
  const ranges: Record<AccountType, number> = {
    Asset: 1000,
    Liability: 2000,
    Equity: 3000,
    Revenue: 4000,
    Expense: 5000,
  };

  const baseNumber = ranges[type];
  const existingNumbers = accounts
    .filter(a => a.type === type)
    .map(a => parseInt(a.number))
    .sort((a, b) => a - b);

  // Find gaps in numbering
  for (let i = 0; i < existingNumbers.length - 1; i++) {
    const gap = existingNumbers[i + 1] - existingNumbers[i];
    if (gap > 10) {
      suggestions.push((existingNumbers[i] + 10).toString());
    }
  }

  // Add next sequential numbers
  if (existingNumbers.length > 0) {
    const lastNumber = existingNumbers[existingNumbers.length - 1];
    suggestions.push((lastNumber + 10).toString());
    suggestions.push((lastNumber + 20).toString());
  } else {
    suggestions.push(baseNumber.toString());
    suggestions.push((baseNumber + 10).toString());
    suggestions.push((baseNumber + 20).toString());
  }

  return suggestions.slice(0, 5);
}

/**
 * Compare two Charts of Accounts
 */
export function compareCOAs(oldCOA: Account[], newCOA: Account[]): {
  added: Account[];
  removed: Account[];
  modified: Account[];
} {
  const added = newCOA.filter(newAcc => !oldCOA.find(oldAcc => oldAcc.number === newAcc.number));
  const removed = oldCOA.filter(oldAcc => !newCOA.find(newAcc => newAcc.number === oldAcc.number));

  const modified = newCOA.filter(newAcc => {
    const oldAcc = oldCOA.find(old => old.number === newAcc.number);
    if (!oldAcc) return false;

    return (
      oldAcc.name !== newAcc.name ||
      oldAcc.type !== newAcc.type ||
      oldAcc.category !== newAcc.category ||
      oldAcc.normalBalance !== newAcc.normalBalance ||
      oldAcc.description !== newAcc.description ||
      oldAcc.isActive !== newAcc.isActive
    );
  });

  return { added, removed, modified };
}

/**
 * Merge two Charts of Accounts
 */
export function mergeCOAs(primaryCOA: Account[], secondaryCOA: Account[], strategy: 'primary' | 'secondary' | 'merge' = 'merge'): Account[] {
  const merged = new Map<string, Account>();

  // Add primary accounts
  primaryCOA.forEach(account => {
    merged.set(account.number, { ...account });
  });

  // Add/merge secondary accounts
  secondaryCOA.forEach(account => {
    if (!merged.has(account.number)) {
      merged.set(account.number, { ...account });
    } else if (strategy === 'secondary') {
      merged.set(account.number, { ...account });
    } else if (strategy === 'merge') {
      const existing = merged.get(account.number)!;
      merged.set(account.number, {
        ...existing,
        description: account.description || existing.description,
        isActive: account.isActive && existing.isActive,
      });
    }
  });

  return Array.from(merged.values()).sort((a, b) => parseInt(a.number) - parseInt(b.number));
}

/**
 * Create a financial statement-ready account list
 */
export function formatForFinancialStatements(accounts: Account[]): {
  balanceSheet: { assets: Account[]; liabilities: Account[]; equity: Account[] };
  incomeStatement: { revenue: Account[]; expenses: Account[] };
} {
  return {
    balanceSheet: {
      assets: accounts.filter(a => a.type === 'Asset' && a.isActive),
      liabilities: accounts.filter(a => a.type === 'Liability' && a.isActive),
      equity: accounts.filter(a => a.type === 'Equity' && a.isActive),
    },
    incomeStatement: {
      revenue: accounts.filter(a => a.type === 'Revenue' && a.isActive),
      expenses: accounts.filter(a => a.type === 'Expense' && a.isActive),
    },
  };
}
