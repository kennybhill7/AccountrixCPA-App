/**
 * Excel Export System for Accountrix
 * Comprehensive Excel generation for accounting worksheets with professional formatting
 * Uses SheetJS (xlsx) library for Excel file generation
 */

import * as XLSX from 'xlsx';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TrialBalance {
  date: Date;
  companyName?: string;
  accounts: {
    number: string;
    name: string;
    debit: number;
    credit: number;
  }[];
}

export interface JournalEntry {
  date: Date;
  reference: string;
  account: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface BankReconciliation {
  date: Date;
  companyName?: string;
  bankBalance: number;
  bookBalance: number;
  bankAdjustments: {
    description: string;
    amount: number;
    type: 'addition' | 'deduction';
  }[];
  bookAdjustments: {
    description: string;
    amount: number;
    type: 'addition' | 'deduction';
  }[];
}

export interface WIPSchedule {
  asOfDate: Date;
  companyName?: string;
  projects: {
    name: string;
    contractValue: number;
    costsToDate: number;
    estimatedTotalCosts: number;
    percentComplete: number;
    revenueRecognized: number;
    grossProfit: number;
    grossProfitPercent: number;
  }[];
}

export interface ChartOfAccounts {
  companyName?: string;
  accounts: {
    number: string;
    name: string;
    type: string;
    category: string;
    normalBalance: 'Debit' | 'Credit';
    description?: string;
  }[];
}

export interface ConsolidationData {
  consolidationDate: Date;
  entities: {
    name: string;
    financials: TrialBalance;
  }[];
  eliminations: JournalEntry[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const HEADER_COLOR = '4472C4'; // Light blue
const HEADER_FONT_COLOR = 'FFFFFF'; // White
const ALT_ROW_COLOR = 'F2F2F2'; // Light gray
const TOTAL_ROW_COLOR = 'D9E1F2'; // Lighter blue
const SUCCESS_COLOR = '00B050'; // Green
const ERROR_COLOR = 'FF0000'; // Red
const BORDER_STYLE = 'thin';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date for file names (YYYY-MM-DD)
 */
function formatDateForFilename(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format date for display
 */
function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Set column widths for worksheet
 */
function setColumnWidths(ws: XLSX.WorkSheet, widths: number[]): void {
  ws['!cols'] = widths.map(w => ({ wch: w }));
}

/**
 * Apply cell style
 */
function applyCellStyle(
  ws: XLSX.WorkSheet,
  cell: string,
  style: Partial<XLSX.CellObject>
): void {
  if (!ws[cell]) {
    ws[cell] = { t: 's', v: '' };
  }
  ws[cell] = { ...ws[cell], ...style };
}

/**
 * Apply header style to a row
 */
function applyHeaderStyle(ws: XLSX.WorkSheet, row: number, cols: string[]): void {
  cols.forEach(col => {
    const cellRef = `${col}${row}`;
    if (!ws[cellRef]) return;

    ws[cellRef].s = {
      font: { bold: true, sz: 12, color: { rgb: HEADER_FONT_COLOR }, name: 'Calibri' },
      fill: { fgColor: { rgb: HEADER_COLOR } },
      alignment: { horizontal: 'left', vertical: 'center' },
      border: {
        top: { style: BORDER_STYLE, color: { rgb: '000000' } },
        bottom: { style: BORDER_STYLE, color: { rgb: '000000' } },
        left: { style: BORDER_STYLE, color: { rgb: '000000' } },
        right: { style: BORDER_STYLE, color: { rgb: '000000' } },
      },
    };
  });
}

/**
 * Apply total row style
 */
function applyTotalRowStyle(ws: XLSX.WorkSheet, row: number, cols: string[]): void {
  cols.forEach(col => {
    const cellRef = `${col}${row}`;
    if (!ws[cellRef]) return;

    ws[cellRef].s = {
      font: { bold: true, sz: 11, name: 'Calibri' },
      fill: { fgColor: { rgb: TOTAL_ROW_COLOR } },
      alignment: { horizontal: col === 'A' || col === 'B' ? 'left' : 'right', vertical: 'center' },
      border: {
        top: { style: BORDER_STYLE, color: { rgb: '000000' } },
        bottom: { style: 'medium', color: { rgb: '000000' } },
        left: { style: BORDER_STYLE, color: { rgb: '000000' } },
        right: { style: BORDER_STYLE, color: { rgb: '000000' } },
      },
    };
  });
}

/**
 * Apply alternating row colors
 */
function applyAlternatingRows(
  ws: XLSX.WorkSheet,
  startRow: number,
  endRow: number,
  cols: string[]
): void {
  for (let row = startRow; row <= endRow; row++) {
    if (row % 2 === 0) {
      cols.forEach(col => {
        const cellRef = `${col}${row}`;
        if (!ws[cellRef]) return;

        ws[cellRef].s = {
          ...ws[cellRef].s,
          fill: { fgColor: { rgb: ALT_ROW_COLOR } },
        };
      });
    }
  }
}

/**
 * Apply borders to range
 */
function applyBordersToRange(
  ws: XLSX.WorkSheet,
  startRow: number,
  endRow: number,
  cols: string[]
): void {
  for (let row = startRow; row <= endRow; row++) {
    cols.forEach(col => {
      const cellRef = `${col}${row}`;
      if (!ws[cellRef]) return;

      ws[cellRef].s = {
        ...ws[cellRef].s,
        border: {
          top: { style: BORDER_STYLE, color: { rgb: '000000' } },
          bottom: { style: BORDER_STYLE, color: { rgb: '000000' } },
          left: { style: BORDER_STYLE, color: { rgb: '000000' } },
          right: { style: BORDER_STYLE, color: { rgb: '000000' } },
        },
      };
    });
  }
}

/**
 * Format cell as currency
 */
function formatCellAsCurrency(ws: XLSX.WorkSheet, cell: string): void {
  if (!ws[cell]) return;
  ws[cell].z = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
}

/**
 * Format range as currency
 */
function formatRangeAsCurrency(ws: XLSX.WorkSheet, cells: string[]): void {
  cells.forEach(cell => formatCellAsCurrency(ws, cell));
}

/**
 * Freeze panes at specified cell
 */
function freezePane(ws: XLSX.WorkSheet, cell: string): void {
  const cellRef = XLSX.utils.decode_cell(cell);
  ws['!freeze'] = { xSplit: cellRef.c, ySplit: cellRef.r };
}

/**
 * Column letter from index (0 = A, 1 = B, etc.)
 */
function getColumnLetter(index: number): string {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode(65 + (index % 26)) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Export trial balance to Excel with formulas
 */
export function exportTrialBalanceToExcel(trialBalance: TrialBalance): void {
  try {
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = {};

    // Title
    ws['A1'] = { t: 's', v: trialBalance.companyName || 'TRIAL BALANCE' };
    ws['A2'] = { t: 's', v: `As of ${formatDateForDisplay(trialBalance.date)}` };

    // Headers
    ws['A4'] = { t: 's', v: 'Account #' };
    ws['B4'] = { t: 's', v: 'Account Name' };
    ws['C4'] = { t: 's', v: 'Debit' };
    ws['D4'] = { t: 's', v: 'Credit' };

    // Apply header style
    applyHeaderStyle(ws, 4, ['A', 'B', 'C', 'D']);

    // Data rows
    let currentRow = 5;
    trialBalance.accounts.forEach((account, index) => {
      ws[`A${currentRow}`] = { t: 's', v: account.number };
      ws[`B${currentRow}`] = { t: 's', v: account.name };
      ws[`C${currentRow}`] = { t: 'n', v: account.debit || 0 };
      ws[`D${currentRow}`] = { t: 'n', v: account.credit || 0 };

      // Format currency
      formatCellAsCurrency(ws, `C${currentRow}`);
      formatCellAsCurrency(ws, `D${currentRow}`);

      currentRow++;
    });

    // Totals row
    const totalRow = currentRow;
    ws[`A${totalRow}`] = { t: 's', v: '' };
    ws[`B${totalRow}`] = { t: 's', v: 'TOTALS' };
    ws[`C${totalRow}`] = { t: 'n', f: `SUM(C5:C${totalRow - 1})` };
    ws[`D${totalRow}`] = { t: 'n', f: `SUM(D5:D${totalRow - 1})` };

    formatCellAsCurrency(ws, `C${totalRow}`);
    formatCellAsCurrency(ws, `D${totalRow}`);
    applyTotalRowStyle(ws, totalRow, ['A', 'B', 'C', 'D']);

    // Balanced check row
    const balanceRow = totalRow + 1;
    ws[`A${balanceRow}`] = { t: 's', v: '' };
    ws[`B${balanceRow}`] = { t: 's', v: 'BALANCED?' };
    ws[`C${balanceRow}`] = {
      t: 's',
      f: `IF(C${totalRow}=D${totalRow},"✓ BALANCED","✗ NOT BALANCED")`,
    };

    // Apply formatting
    if (ws[`C${balanceRow}`]) {
      ws[`C${balanceRow}`].s = {
        font: { bold: true, sz: 11, name: 'Calibri' },
        alignment: { horizontal: 'left' },
      };
    }

    // Apply borders
    applyBordersToRange(ws, 4, totalRow, ['A', 'B', 'C', 'D']);

    // Apply alternating rows
    applyAlternatingRows(ws, 5, totalRow - 1, ['A', 'B', 'C', 'D']);

    // Set column widths
    setColumnWidths(ws, [15, 40, 18, 18]);

    // Set range
    ws['!ref'] = `A1:D${balanceRow}`;

    // Freeze panes (freeze header row)
    freezePane(ws, 'A5');

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Trial Balance');

    // Generate filename and save
    const filename = `Accountrix_TrialBalance_${formatDateForFilename(trialBalance.date)}.xlsx`;
    XLSX.writeFile(wb, filename);

    console.log(`Trial balance exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting trial balance to Excel:', error);
    throw new Error('Failed to export trial balance. Please try again.');
  }
}

/**
 * Export journal entries to Excel
 */
export function exportJournalEntriesToExcel(entries: JournalEntry[]): void {
  try {
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = {};

    // Title
    ws['A1'] = { t: 's', v: 'JOURNAL ENTRIES' };

    // Headers
    ws['A3'] = { t: 's', v: 'Date' };
    ws['B3'] = { t: 's', v: 'Ref #' };
    ws['C3'] = { t: 's', v: 'Account' };
    ws['D3'] = { t: 's', v: 'Debit' };
    ws['E3'] = { t: 's', v: 'Credit' };
    ws['F3'] = { t: 's', v: 'Description' };

    applyHeaderStyle(ws, 3, ['A', 'B', 'C', 'D', 'E', 'F']);

    // Data rows
    let currentRow = 4;
    entries.forEach(entry => {
      ws[`A${currentRow}`] = {
        t: 'd',
        v: entry.date,
        z: 'mm/dd/yyyy',
      };
      ws[`B${currentRow}`] = { t: 's', v: entry.reference };
      ws[`C${currentRow}`] = { t: 's', v: entry.account };
      ws[`D${currentRow}`] = { t: 'n', v: entry.debit || 0 };
      ws[`E${currentRow}`] = { t: 'n', v: entry.credit || 0 };
      ws[`F${currentRow}`] = { t: 's', v: entry.description || '' };

      formatCellAsCurrency(ws, `D${currentRow}`);
      formatCellAsCurrency(ws, `E${currentRow}`);

      currentRow++;
    });

    // Totals row
    const totalRow = currentRow + 1;
    ws[`A${totalRow}`] = { t: 's', v: '' };
    ws[`B${totalRow}`] = { t: 's', v: '' };
    ws[`C${totalRow}`] = { t: 's', v: 'TOTALS' };
    ws[`D${totalRow}`] = { t: 'n', f: `SUM(D4:D${currentRow - 1})` };
    ws[`E${totalRow}`] = { t: 'n', f: `SUM(E4:E${currentRow - 1})` };
    ws[`F${totalRow}`] = { t: 's', v: '' };

    formatCellAsCurrency(ws, `D${totalRow}`);
    formatCellAsCurrency(ws, `E${totalRow}`);
    applyTotalRowStyle(ws, totalRow, ['A', 'B', 'C', 'D', 'E', 'F']);

    // Balanced check row
    const balanceRow = totalRow + 1;
    ws[`C${balanceRow}`] = { t: 's', v: 'BALANCED?' };
    ws[`D${balanceRow}`] = {
      t: 's',
      f: `IF(D${totalRow}=E${totalRow},"✓","✗")`,
    };

    // Apply borders
    applyBordersToRange(ws, 3, totalRow, ['A', 'B', 'C', 'D', 'E', 'F']);

    // Apply alternating rows
    applyAlternatingRows(ws, 4, currentRow - 1, ['A', 'B', 'C', 'D', 'E', 'F']);

    // Set column widths
    setColumnWidths(ws, [12, 12, 35, 18, 18, 40]);

    // Set range
    ws['!ref'] = `A1:F${balanceRow}`;

    // Freeze panes
    freezePane(ws, 'A4');

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Journal Entries');

    // Generate filename and save
    const filename = `Accountrix_JournalEntries_${formatDateForFilename()}.xlsx`;
    XLSX.writeFile(wb, filename);

    console.log(`Journal entries exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting journal entries to Excel:', error);
    throw new Error('Failed to export journal entries. Please try again.');
  }
}

/**
 * Export bank reconciliation to Excel
 */
export function exportBankRecToExcel(bankRec: BankReconciliation): void {
  try {
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = {};

    // Title
    ws['A1'] = { t: 's', v: bankRec.companyName || 'BANK RECONCILIATION' };
    ws['A2'] = { t: 's', v: `As of ${formatDateForDisplay(bankRec.date)}` };

    let currentRow = 4;

    // Bank Balance Section
    ws[`A${currentRow}`] = { t: 's', v: 'Bank Statement Balance' };
    if (ws[`A${currentRow}`]) {
      ws[`A${currentRow}`].s = {
        font: { bold: true, sz: 12, name: 'Calibri' },
      };
    }
    currentRow += 1;

    ws[`A${currentRow}`] = { t: 's', v: 'Balance per bank:' };
    ws[`B${currentRow}`] = { t: 'n', v: bankRec.bankBalance };
    formatCellAsCurrency(ws, `B${currentRow}`);
    currentRow += 1;

    const bankAdjStartRow = currentRow;
    bankRec.bankAdjustments.forEach(adj => {
      const prefix = adj.type === 'addition' ? 'Add: ' : 'Less: ';
      ws[`A${currentRow}`] = { t: 's', v: prefix + adj.description };
      ws[`B${currentRow}`] = {
        t: 'n',
        v: adj.type === 'addition' ? adj.amount : -adj.amount,
      };
      formatCellAsCurrency(ws, `B${currentRow}`);
      currentRow++;
    });

    // Adjusted bank balance
    ws[`A${currentRow}`] = { t: 's', v: 'Adjusted bank balance:' };
    if (ws[`A${currentRow}`]) {
      ws[`A${currentRow}`].s = {
        font: { bold: true, sz: 11, name: 'Calibri' },
      };
    }

    const adjBankRow = currentRow;
    ws[`B${currentRow}`] = {
      t: 'n',
      f: `B${bankAdjStartRow - 1}+SUM(B${bankAdjStartRow}:B${currentRow - 1})`,
    };
    formatCellAsCurrency(ws, `B${currentRow}`);
    currentRow += 2;

    // Book Balance Section
    ws[`A${currentRow}`] = { t: 's', v: 'Book Balance' };
    if (ws[`A${currentRow}`]) {
      ws[`A${currentRow}`].s = {
        font: { bold: true, sz: 12, name: 'Calibri' },
      };
    }
    currentRow += 1;

    ws[`A${currentRow}`] = { t: 's', v: 'Balance per books:' };
    ws[`B${currentRow}`] = { t: 'n', v: bankRec.bookBalance };
    formatCellAsCurrency(ws, `B${currentRow}`);
    currentRow += 1;

    const bookAdjStartRow = currentRow;
    bankRec.bookAdjustments.forEach(adj => {
      const prefix = adj.type === 'addition' ? 'Add: ' : 'Less: ';
      ws[`A${currentRow}`] = { t: 's', v: prefix + adj.description };
      ws[`B${currentRow}`] = {
        t: 'n',
        v: adj.type === 'addition' ? adj.amount : -adj.amount,
      };
      formatCellAsCurrency(ws, `B${currentRow}`);
      currentRow++;
    });

    // Adjusted book balance
    ws[`A${currentRow}`] = { t: 's', v: 'Adjusted book balance:' };
    if (ws[`A${currentRow}`]) {
      ws[`A${currentRow}`].s = {
        font: { bold: true, sz: 11, name: 'Calibri' },
      };
    }

    const adjBookRow = currentRow;
    ws[`B${currentRow}`] = {
      t: 'n',
      f: `B${bookAdjStartRow - 1}+SUM(B${bookAdjStartRow}:B${currentRow - 1})`,
    };
    formatCellAsCurrency(ws, `B${currentRow}`);
    currentRow += 2;

    // Reconciliation status
    ws[`A${currentRow}`] = { t: 's', v: 'Status:' };
    ws[`B${currentRow}`] = {
      t: 's',
      f: `IF(ABS(B${adjBankRow}-B${adjBookRow})<0.01,"✓ RECONCILED","✗ NOT RECONCILED")`,
    };
    if (ws[`B${currentRow}`]) {
      ws[`B${currentRow}`].s = {
        font: { bold: true, sz: 11, name: 'Calibri' },
      };
    }
    currentRow += 1;

    ws[`A${currentRow}`] = { t: 's', v: 'Difference:' };
    ws[`B${currentRow}`] = {
      t: 'n',
      f: `ABS(B${adjBankRow}-B${adjBookRow})`,
    };
    formatCellAsCurrency(ws, `B${currentRow}`);

    // Set column widths
    setColumnWidths(ws, [40, 20]);

    // Set range
    ws['!ref'] = `A1:B${currentRow}`;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Bank Reconciliation');

    // Generate filename and save
    const filename = `Accountrix_BankRec_${formatDateForFilename(bankRec.date)}.xlsx`;
    XLSX.writeFile(wb, filename);

    console.log(`Bank reconciliation exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting bank reconciliation to Excel:', error);
    throw new Error('Failed to export bank reconciliation. Please try again.');
  }
}

/**
 * Export WIP schedule to Excel (construction-specific)
 */
export function exportWIPScheduleToExcel(wipData: WIPSchedule): void {
  try {
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = {};

    // Title
    ws['A1'] = { t: 's', v: wipData.companyName || 'WORK IN PROGRESS SCHEDULE' };
    ws['A2'] = { t: 's', v: `As of ${formatDateForDisplay(wipData.asOfDate)}` };

    // Headers
    ws['A4'] = { t: 's', v: 'Project' };
    ws['B4'] = { t: 's', v: 'Contract Value' };
    ws['C4'] = { t: 's', v: 'Costs to Date' };
    ws['D4'] = { t: 's', v: 'Est. Total Costs' };
    ws['E4'] = { t: 's', v: '% Complete' };
    ws['F4'] = { t: 's', v: 'Revenue Recognized' };
    ws['G4'] = { t: 's', v: 'Gross Profit' };
    ws['H4'] = { t: 's', v: 'GP %' };

    applyHeaderStyle(ws, 4, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);

    // Data rows
    let currentRow = 5;
    wipData.projects.forEach((project, index) => {
      ws[`A${currentRow}`] = { t: 's', v: project.name };
      ws[`B${currentRow}`] = { t: 'n', v: project.contractValue };
      ws[`C${currentRow}`] = { t: 'n', v: project.costsToDate };
      ws[`D${currentRow}`] = { t: 'n', v: project.estimatedTotalCosts };

      // % Complete formula: Costs to Date / Est. Total Costs
      ws[`E${currentRow}`] = {
        t: 'n',
        f: `C${currentRow}/D${currentRow}`,
        z: '0.0%',
      };

      // Revenue formula: Contract Value * % Complete
      ws[`F${currentRow}`] = {
        t: 'n',
        f: `B${currentRow}*E${currentRow}`,
      };

      // Gross Profit formula: Revenue - Costs to Date
      ws[`G${currentRow}`] = {
        t: 'n',
        f: `F${currentRow}-C${currentRow}`,
      };

      // GP % formula: Gross Profit / Revenue
      ws[`H${currentRow}`] = {
        t: 'n',
        f: `IF(F${currentRow}=0,0,G${currentRow}/F${currentRow})`,
        z: '0.0%',
      };

      // Format currency
      formatRangeAsCurrency(ws, [
        `B${currentRow}`,
        `C${currentRow}`,
        `D${currentRow}`,
        `F${currentRow}`,
        `G${currentRow}`,
      ]);

      currentRow++;
    });

    // Totals row
    const totalRow = currentRow;
    ws[`A${totalRow}`] = { t: 's', v: 'TOTALS' };
    ws[`B${totalRow}`] = { t: 'n', f: `SUM(B5:B${totalRow - 1})` };
    ws[`C${totalRow}`] = { t: 'n', f: `SUM(C5:C${totalRow - 1})` };
    ws[`D${totalRow}`] = { t: 'n', f: `SUM(D5:D${totalRow - 1})` };
    ws[`E${totalRow}`] = { t: 's', v: '' };
    ws[`F${totalRow}`] = { t: 'n', f: `SUM(F5:F${totalRow - 1})` };
    ws[`G${totalRow}`] = { t: 'n', f: `SUM(G5:G${totalRow - 1})` };
    ws[`H${totalRow}`] = {
      t: 'n',
      f: `IF(F${totalRow}=0,0,G${totalRow}/F${totalRow})`,
      z: '0.0%',
    };

    formatRangeAsCurrency(ws, [
      `B${totalRow}`,
      `C${totalRow}`,
      `D${totalRow}`,
      `F${totalRow}`,
      `G${totalRow}`,
    ]);
    applyTotalRowStyle(ws, totalRow, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);

    // Apply borders
    applyBordersToRange(ws, 4, totalRow, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);

    // Apply alternating rows
    applyAlternatingRows(ws, 5, totalRow - 1, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);

    // Set column widths
    setColumnWidths(ws, [25, 18, 18, 18, 12, 20, 18, 10]);

    // Set range
    ws['!ref'] = `A1:H${totalRow}`;

    // Freeze panes
    freezePane(ws, 'A5');

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'WIP Schedule');

    // Generate filename and save
    const filename = `Accountrix_WIP_${formatDateForFilename(wipData.asOfDate)}.xlsx`;
    XLSX.writeFile(wb, filename);

    console.log(`WIP schedule exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting WIP schedule to Excel:', error);
    throw new Error('Failed to export WIP schedule. Please try again.');
  }
}

/**
 * Export chart of accounts to Excel
 */
export function exportChartOfAccountsToExcel(coa: ChartOfAccounts): void {
  try {
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = {};

    // Title
    ws['A1'] = { t: 's', v: coa.companyName || 'CHART OF ACCOUNTS' };

    // Headers
    ws['A3'] = { t: 's', v: 'Account #' };
    ws['B3'] = { t: 's', v: 'Account Name' };
    ws['C3'] = { t: 's', v: 'Type' };
    ws['D3'] = { t: 's', v: 'Category' };
    ws['E3'] = { t: 's', v: 'Normal Balance' };
    ws['F3'] = { t: 's', v: 'Description' };

    applyHeaderStyle(ws, 3, ['A', 'B', 'C', 'D', 'E', 'F']);

    // Data rows
    let currentRow = 4;
    coa.accounts.forEach(account => {
      ws[`A${currentRow}`] = { t: 's', v: account.number };
      ws[`B${currentRow}`] = { t: 's', v: account.name };
      ws[`C${currentRow}`] = { t: 's', v: account.type };
      ws[`D${currentRow}`] = { t: 's', v: account.category };
      ws[`E${currentRow}`] = { t: 's', v: account.normalBalance };
      ws[`F${currentRow}`] = { t: 's', v: account.description || '' };

      currentRow++;
    });

    // Apply borders
    applyBordersToRange(ws, 3, currentRow - 1, ['A', 'B', 'C', 'D', 'E', 'F']);

    // Apply alternating rows
    applyAlternatingRows(ws, 4, currentRow - 1, ['A', 'B', 'C', 'D', 'E', 'F']);

    // Set column widths
    setColumnWidths(ws, [15, 35, 15, 20, 15, 50]);

    // Set range
    ws['!ref'] = `A1:F${currentRow - 1}`;

    // Freeze panes
    freezePane(ws, 'A4');

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Chart of Accounts');

    // Generate filename and save
    const filename = `Accountrix_ChartOfAccounts_${formatDateForFilename()}.xlsx`;
    XLSX.writeFile(wb, filename);

    console.log(`Chart of accounts exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting chart of accounts to Excel:', error);
    throw new Error('Failed to export chart of accounts. Please try again.');
  }
}

/**
 * Export consolidation worksheet to Excel (multi-sheet workbook)
 */
export function exportConsolidationWorksheetToExcel(data: ConsolidationData): void {
  try {
    const wb = XLSX.utils.book_new();

    // Create a sheet for each entity
    data.entities.forEach((entity, entityIndex) => {
      const ws: XLSX.WorkSheet = {};

      // Title
      ws['A1'] = { t: 's', v: entity.name };
      ws['A2'] = {
        t: 's',
        v: `Trial Balance - ${formatDateForDisplay(data.consolidationDate)}`,
      };

      // Headers
      ws['A4'] = { t: 's', v: 'Account #' };
      ws['B4'] = { t: 's', v: 'Account Name' };
      ws['C4'] = { t: 's', v: 'Debit' };
      ws['D4'] = { t: 's', v: 'Credit' };

      applyHeaderStyle(ws, 4, ['A', 'B', 'C', 'D']);

      // Data rows
      let currentRow = 5;
      entity.financials.accounts.forEach(account => {
        ws[`A${currentRow}`] = { t: 's', v: account.number };
        ws[`B${currentRow}`] = { t: 's', v: account.name };
        ws[`C${currentRow}`] = { t: 'n', v: account.debit || 0 };
        ws[`D${currentRow}`] = { t: 'n', v: account.credit || 0 };

        formatCellAsCurrency(ws, `C${currentRow}`);
        formatCellAsCurrency(ws, `D${currentRow}`);

        currentRow++;
      });

      // Totals row
      const totalRow = currentRow;
      ws[`A${totalRow}`] = { t: 's', v: '' };
      ws[`B${totalRow}`] = { t: 's', v: 'TOTALS' };
      ws[`C${totalRow}`] = { t: 'n', f: `SUM(C5:C${totalRow - 1})` };
      ws[`D${totalRow}`] = { t: 'n', f: `SUM(D5:D${totalRow - 1})` };

      formatCellAsCurrency(ws, `C${totalRow}`);
      formatCellAsCurrency(ws, `D${totalRow}`);
      applyTotalRowStyle(ws, totalRow, ['A', 'B', 'C', 'D']);

      // Apply borders
      applyBordersToRange(ws, 4, totalRow, ['A', 'B', 'C', 'D']);

      // Apply alternating rows
      applyAlternatingRows(ws, 5, totalRow - 1, ['A', 'B', 'C', 'D']);

      // Set column widths
      setColumnWidths(ws, [15, 40, 18, 18]);

      // Set range
      ws['!ref'] = `A1:D${totalRow}`;

      // Freeze panes
      freezePane(ws, 'A5');

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, entity.name.substring(0, 31)); // Sheet names limited to 31 chars
    });

    // Create eliminations sheet
    if (data.eliminations && data.eliminations.length > 0) {
      const elimWs: XLSX.WorkSheet = {};

      // Title
      elimWs['A1'] = { t: 's', v: 'ELIMINATION ENTRIES' };
      elimWs['A2'] = { t: 's', v: formatDateForDisplay(data.consolidationDate) };

      // Headers
      elimWs['A4'] = { t: 's', v: 'Date' };
      elimWs['B4'] = { t: 's', v: 'Ref #' };
      elimWs['C4'] = { t: 's', v: 'Account' };
      elimWs['D4'] = { t: 's', v: 'Debit' };
      elimWs['E4'] = { t: 's', v: 'Credit' };
      elimWs['F4'] = { t: 's', v: 'Description' };

      applyHeaderStyle(elimWs, 4, ['A', 'B', 'C', 'D', 'E', 'F']);

      // Data rows
      let currentRow = 5;
      data.eliminations.forEach(entry => {
        elimWs[`A${currentRow}`] = {
          t: 'd',
          v: entry.date,
          z: 'mm/dd/yyyy',
        };
        elimWs[`B${currentRow}`] = { t: 's', v: entry.reference };
        elimWs[`C${currentRow}`] = { t: 's', v: entry.account };
        elimWs[`D${currentRow}`] = { t: 'n', v: entry.debit || 0 };
        elimWs[`E${currentRow}`] = { t: 'n', v: entry.credit || 0 };
        elimWs[`F${currentRow}`] = { t: 's', v: entry.description || '' };

        formatCellAsCurrency(elimWs, `D${currentRow}`);
        formatCellAsCurrency(elimWs, `E${currentRow}`);

        currentRow++;
      });

      // Totals row
      const totalRow = currentRow + 1;
      elimWs[`C${totalRow}`] = { t: 's', v: 'TOTALS' };
      elimWs[`D${totalRow}`] = { t: 'n', f: `SUM(D5:D${currentRow - 1})` };
      elimWs[`E${totalRow}`] = { t: 'n', f: `SUM(E5:E${currentRow - 1})` };

      formatCellAsCurrency(elimWs, `D${totalRow}`);
      formatCellAsCurrency(elimWs, `E${totalRow}`);
      applyTotalRowStyle(elimWs, totalRow, ['A', 'B', 'C', 'D', 'E', 'F']);

      // Apply borders
      applyBordersToRange(elimWs, 4, totalRow, ['A', 'B', 'C', 'D', 'E', 'F']);

      // Apply alternating rows
      applyAlternatingRows(elimWs, 5, currentRow - 1, ['A', 'B', 'C', 'D', 'E', 'F']);

      // Set column widths
      setColumnWidths(elimWs, [12, 12, 35, 18, 18, 40]);

      // Set range
      elimWs['!ref'] = `A1:F${totalRow}`;

      // Freeze panes
      freezePane(elimWs, 'A5');

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, elimWs, 'Eliminations');
    }

    // Create consolidated sheet with formulas
    const consWs: XLSX.WorkSheet = {};

    // Title
    consWs['A1'] = { t: 's', v: 'CONSOLIDATED TRIAL BALANCE' };
    consWs['A2'] = { t: 's', v: formatDateForDisplay(data.consolidationDate) };

    // Get all unique accounts across all entities
    const accountMap = new Map<
      string,
      { number: string; name: string; debit: number; credit: number }
    >();

    data.entities.forEach(entity => {
      entity.financials.accounts.forEach(account => {
        const key = `${account.number}-${account.name}`;
        const existing = accountMap.get(key);
        if (existing) {
          existing.debit += account.debit;
          existing.credit += account.credit;
        } else {
          accountMap.set(key, {
            number: account.number,
            name: account.name,
            debit: account.debit,
            credit: account.credit,
          });
        }
      });
    });

    // Headers
    consWs['A4'] = { t: 's', v: 'Account #' };
    consWs['B4'] = { t: 's', v: 'Account Name' };
    consWs['C4'] = { t: 's', v: 'Debit' };
    consWs['D4'] = { t: 's', v: 'Credit' };

    applyHeaderStyle(consWs, 4, ['A', 'B', 'C', 'D']);

    // Data rows
    let currentRow = 5;
    Array.from(accountMap.values())
      .sort((a, b) => a.number.localeCompare(b.number))
      .forEach(account => {
        consWs[`A${currentRow}`] = { t: 's', v: account.number };
        consWs[`B${currentRow}`] = { t: 's', v: account.name };
        consWs[`C${currentRow}`] = { t: 'n', v: account.debit };
        consWs[`D${currentRow}`] = { t: 'n', v: account.credit };

        formatCellAsCurrency(consWs, `C${currentRow}`);
        formatCellAsCurrency(consWs, `D${currentRow}`);

        currentRow++;
      });

    // Totals row
    const totalRow = currentRow;
    consWs[`A${totalRow}`] = { t: 's', v: '' };
    consWs[`B${totalRow}`] = { t: 's', v: 'TOTALS' };
    consWs[`C${totalRow}`] = { t: 'n', f: `SUM(C5:C${totalRow - 1})` };
    consWs[`D${totalRow}`] = { t: 'n', f: `SUM(D5:D${totalRow - 1})` };

    formatCellAsCurrency(consWs, `C${totalRow}`);
    formatCellAsCurrency(consWs, `D${totalRow}`);
    applyTotalRowStyle(consWs, totalRow, ['A', 'B', 'C', 'D']);

    // Balanced check
    const balanceRow = totalRow + 1;
    consWs[`B${balanceRow}`] = { t: 's', v: 'BALANCED?' };
    consWs[`C${balanceRow}`] = {
      t: 's',
      f: `IF(C${totalRow}=D${totalRow},"✓ BALANCED","✗ NOT BALANCED")`,
    };

    // Apply borders
    applyBordersToRange(consWs, 4, totalRow, ['A', 'B', 'C', 'D']);

    // Apply alternating rows
    applyAlternatingRows(consWs, 5, totalRow - 1, ['A', 'B', 'C', 'D']);

    // Set column widths
    setColumnWidths(consWs, [15, 40, 18, 18]);

    // Set range
    consWs['!ref'] = `A1:D${balanceRow}`;

    // Freeze panes
    freezePane(consWs, 'A5');

    // Add worksheet to workbook (at the end)
    XLSX.utils.book_append_sheet(wb, consWs, 'Consolidated');

    // Generate filename and save
    const filename = `Accountrix_Consolidation_${formatDateForFilename(data.consolidationDate)}.xlsx`;
    XLSX.writeFile(wb, filename);

    console.log(`Consolidation worksheet exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting consolidation worksheet to Excel:', error);
    throw new Error('Failed to export consolidation worksheet. Please try again.');
  }
}

/**
 * Export all templates as a comprehensive workbook
 */
export function exportAllTemplatesWorkbook(): void {
  try {
    const wb = XLSX.utils.book_new();

    // Sample date for templates
    const sampleDate = new Date();

    // 1. Trial Balance Template
    const tbWs: XLSX.WorkSheet = {};
    tbWs['A1'] = { t: 's', v: 'TRIAL BALANCE TEMPLATE' };
    tbWs['A2'] = { t: 's', v: `As of ${formatDateForDisplay(sampleDate)}` };
    tbWs['A4'] = { t: 's', v: 'Account #' };
    tbWs['B4'] = { t: 's', v: 'Account Name' };
    tbWs['C4'] = { t: 's', v: 'Debit' };
    tbWs['D4'] = { t: 's', v: 'Credit' };
    applyHeaderStyle(tbWs, 4, ['A', 'B', 'C', 'D']);

    // Sample data
    const tbSampleData = [
      { acct: '1000', name: 'Cash', debit: 10000, credit: 0 },
      { acct: '1100', name: 'Accounts Receivable', debit: 5000, credit: 0 },
      { acct: '1200', name: 'Inventory', debit: 8000, credit: 0 },
      { acct: '2000', name: 'Accounts Payable', debit: 0, credit: 3000 },
      { acct: '3000', name: 'Common Stock', debit: 0, credit: 15000 },
      { acct: '4000', name: 'Revenue', debit: 0, credit: 10000 },
      { acct: '5000', name: 'Cost of Goods Sold', debit: 4000, credit: 0 },
      { acct: '6000', name: 'Operating Expenses', debit: 1000, credit: 0 },
    ];

    let row = 5;
    tbSampleData.forEach(item => {
      tbWs[`A${row}`] = { t: 's', v: item.acct };
      tbWs[`B${row}`] = { t: 's', v: item.name };
      tbWs[`C${row}`] = { t: 'n', v: item.debit };
      tbWs[`D${row}`] = { t: 'n', v: item.credit };
      formatCellAsCurrency(tbWs, `C${row}`);
      formatCellAsCurrency(tbWs, `D${row}`);
      row++;
    });

    // Totals
    tbWs[`B${row}`] = { t: 's', v: 'TOTALS' };
    tbWs[`C${row}`] = { t: 'n', f: `SUM(C5:C${row - 1})` };
    tbWs[`D${row}`] = { t: 'n', f: `SUM(D5:D${row - 1})` };
    formatCellAsCurrency(tbWs, `C${row}`);
    formatCellAsCurrency(tbWs, `D${row}`);
    applyTotalRowStyle(tbWs, row, ['A', 'B', 'C', 'D']);

    // Balance check
    tbWs[`B${row + 1}`] = { t: 's', v: 'BALANCED?' };
    tbWs[`C${row + 1}`] = { t: 's', f: `IF(C${row}=D${row},"✓ BALANCED","✗ NOT BALANCED")` };

    applyBordersToRange(tbWs, 4, row, ['A', 'B', 'C', 'D']);
    applyAlternatingRows(tbWs, 5, row - 1, ['A', 'B', 'C', 'D']);
    setColumnWidths(tbWs, [15, 40, 18, 18]);
    tbWs['!ref'] = `A1:D${row + 1}`;
    freezePane(tbWs, 'A5');
    XLSX.utils.book_append_sheet(wb, tbWs, 'Trial Balance');

    // 2. Journal Entries Template
    const jeWs: XLSX.WorkSheet = {};
    jeWs['A1'] = { t: 's', v: 'JOURNAL ENTRIES TEMPLATE' };
    jeWs['A3'] = { t: 's', v: 'Date' };
    jeWs['B3'] = { t: 's', v: 'Ref #' };
    jeWs['C3'] = { t: 's', v: 'Account' };
    jeWs['D3'] = { t: 's', v: 'Debit' };
    jeWs['E3'] = { t: 's', v: 'Credit' };
    jeWs['F3'] = { t: 's', v: 'Description' };
    applyHeaderStyle(jeWs, 3, ['A', 'B', 'C', 'D', 'E', 'F']);

    // Sample entries
    const jeSampleData = [
      {
        date: sampleDate,
        ref: 'JE-001',
        account: 'Cash',
        debit: 5000,
        credit: 0,
        desc: 'Revenue received',
      },
      {
        date: sampleDate,
        ref: 'JE-001',
        account: 'Revenue',
        debit: 0,
        credit: 5000,
        desc: 'Revenue received',
      },
      {
        date: sampleDate,
        ref: 'JE-002',
        account: 'Supplies Expense',
        debit: 500,
        credit: 0,
        desc: 'Office supplies',
      },
      {
        date: sampleDate,
        ref: 'JE-002',
        account: 'Cash',
        debit: 0,
        credit: 500,
        desc: 'Office supplies',
      },
    ];

    row = 4;
    jeSampleData.forEach(entry => {
      jeWs[`A${row}`] = { t: 'd', v: entry.date, z: 'mm/dd/yyyy' };
      jeWs[`B${row}`] = { t: 's', v: entry.ref };
      jeWs[`C${row}`] = { t: 's', v: entry.account };
      jeWs[`D${row}`] = { t: 'n', v: entry.debit };
      jeWs[`E${row}`] = { t: 'n', v: entry.credit };
      jeWs[`F${row}`] = { t: 's', v: entry.desc };
      formatCellAsCurrency(jeWs, `D${row}`);
      formatCellAsCurrency(jeWs, `E${row}`);
      row++;
    });

    // Totals
    row += 1;
    jeWs[`C${row}`] = { t: 's', v: 'TOTALS' };
    jeWs[`D${row}`] = { t: 'n', f: 'SUM(D4:D7)' };
    jeWs[`E${row}`] = { t: 'n', f: 'SUM(E4:E7)' };
    formatCellAsCurrency(jeWs, `D${row}`);
    formatCellAsCurrency(jeWs, `E${row}`);
    applyTotalRowStyle(jeWs, row, ['A', 'B', 'C', 'D', 'E', 'F']);

    // Balance check
    jeWs[`C${row + 1}`] = { t: 's', v: 'BALANCED?' };
    jeWs[`D${row + 1}`] = { t: 's', f: `IF(D${row}=E${row},"✓","✗")` };

    applyBordersToRange(jeWs, 3, row, ['A', 'B', 'C', 'D', 'E', 'F']);
    applyAlternatingRows(jeWs, 4, row - 1, ['A', 'B', 'C', 'D', 'E', 'F']);
    setColumnWidths(jeWs, [12, 12, 35, 18, 18, 40]);
    jeWs['!ref'] = `A1:F${row + 1}`;
    freezePane(jeWs, 'A4');
    XLSX.utils.book_append_sheet(wb, jeWs, 'Journal Entries');

    // 3. WIP Schedule Template
    const wipWs: XLSX.WorkSheet = {};
    wipWs['A1'] = { t: 's', v: 'WORK IN PROGRESS SCHEDULE' };
    wipWs['A2'] = { t: 's', v: `As of ${formatDateForDisplay(sampleDate)}` };
    wipWs['A4'] = { t: 's', v: 'Project' };
    wipWs['B4'] = { t: 's', v: 'Contract Value' };
    wipWs['C4'] = { t: 's', v: 'Costs to Date' };
    wipWs['D4'] = { t: 's', v: 'Est. Total Costs' };
    wipWs['E4'] = { t: 's', v: '% Complete' };
    wipWs['F4'] = { t: 's', v: 'Revenue' };
    wipWs['G4'] = { t: 's', v: 'Gross Profit' };
    wipWs['H4'] = { t: 's', v: 'GP %' };
    applyHeaderStyle(wipWs, 4, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);

    // Sample projects
    const wipSampleData = [
      { name: 'Tower One', contract: 5000000, costs: 2000000, est: 4000000 },
      { name: 'Plaza East', contract: 3000000, costs: 1500000, est: 2500000 },
      { name: 'Office Complex', contract: 8000000, costs: 3200000, est: 6500000 },
    ];

    row = 5;
    wipSampleData.forEach(project => {
      wipWs[`A${row}`] = { t: 's', v: project.name };
      wipWs[`B${row}`] = { t: 'n', v: project.contract };
      wipWs[`C${row}`] = { t: 'n', v: project.costs };
      wipWs[`D${row}`] = { t: 'n', v: project.est };
      wipWs[`E${row}`] = { t: 'n', f: `C${row}/D${row}`, z: '0.0%' };
      wipWs[`F${row}`] = { t: 'n', f: `B${row}*E${row}` };
      wipWs[`G${row}`] = { t: 'n', f: `F${row}-C${row}` };
      wipWs[`H${row}`] = { t: 'n', f: `IF(F${row}=0,0,G${row}/F${row})`, z: '0.0%' };

      formatRangeAsCurrency(wipWs, [
        `B${row}`,
        `C${row}`,
        `D${row}`,
        `F${row}`,
        `G${row}`,
      ]);
      row++;
    });

    // Totals
    wipWs[`A${row}`] = { t: 's', v: 'TOTALS' };
    wipWs[`B${row}`] = { t: 'n', f: 'SUM(B5:B7)' };
    wipWs[`C${row}`] = { t: 'n', f: 'SUM(C5:C7)' };
    wipWs[`D${row}`] = { t: 'n', f: 'SUM(D5:D7)' };
    wipWs[`F${row}`] = { t: 'n', f: 'SUM(F5:F7)' };
    wipWs[`G${row}`] = { t: 'n', f: 'SUM(G5:G7)' };
    wipWs[`H${row}`] = { t: 'n', f: `IF(F${row}=0,0,G${row}/F${row})`, z: '0.0%' };

    formatRangeAsCurrency(wipWs, [
      `B${row}`,
      `C${row}`,
      `D${row}`,
      `F${row}`,
      `G${row}`,
    ]);
    applyTotalRowStyle(wipWs, row, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);

    applyBordersToRange(wipWs, 4, row, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
    applyAlternatingRows(wipWs, 5, row - 1, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
    setColumnWidths(wipWs, [25, 18, 18, 18, 12, 20, 18, 10]);
    wipWs['!ref'] = `A1:H${row}`;
    freezePane(wipWs, 'A5');
    XLSX.utils.book_append_sheet(wb, wipWs, 'WIP Schedule');

    // 4. Bank Reconciliation Template
    const brWs: XLSX.WorkSheet = {};
    brWs['A1'] = { t: 's', v: 'BANK RECONCILIATION TEMPLATE' };
    brWs['A2'] = { t: 's', v: `As of ${formatDateForDisplay(sampleDate)}` };
    brWs['A4'] = { t: 's', v: 'Bank Statement Balance' };
    brWs['A5'] = { t: 's', v: 'Balance per bank:' };
    brWs['B5'] = { t: 'n', v: 25000 };
    formatCellAsCurrency(brWs, 'B5');

    brWs['A6'] = { t: 's', v: 'Add: Deposits in transit' };
    brWs['B6'] = { t: 'n', v: 5000 };
    formatCellAsCurrency(brWs, 'B6');

    brWs['A7'] = { t: 's', v: 'Less: Outstanding checks' };
    brWs['B7'] = { t: 'n', v: -3000 };
    formatCellAsCurrency(brWs, 'B7');

    brWs['A8'] = { t: 's', v: 'Adjusted bank balance:' };
    brWs['B8'] = { t: 'n', f: 'B5+B6+B7' };
    formatCellAsCurrency(brWs, 'B8');
    if (brWs['A8']) {
      brWs['A8'].s = { font: { bold: true, sz: 11, name: 'Calibri' } };
    }

    brWs['A10'] = { t: 's', v: 'Book Balance' };
    brWs['A11'] = { t: 's', v: 'Balance per books:' };
    brWs['B11'] = { t: 'n', v: 28000 };
    formatCellAsCurrency(brWs, 'B11');

    brWs['A12'] = { t: 's', v: 'Add: Interest earned' };
    brWs['B12'] = { t: 'n', v: 50 };
    formatCellAsCurrency(brWs, 'B12');

    brWs['A13'] = { t: 's', v: 'Less: Bank fees' };
    brWs['B13'] = { t: 'n', v: -50 };
    formatCellAsCurrency(brWs, 'B13');

    brWs['A14'] = { t: 's', v: 'Adjusted book balance:' };
    brWs['B14'] = { t: 'n', f: 'B11+B12+B13' };
    formatCellAsCurrency(brWs, 'B14');
    if (brWs['A14']) {
      brWs['A14'].s = { font: { bold: true, sz: 11, name: 'Calibri' } };
    }

    brWs['A16'] = { t: 's', v: 'Status:' };
    brWs['B16'] = { t: 's', f: 'IF(ABS(B8-B14)<0.01,"✓ RECONCILED","✗ NOT RECONCILED")' };
    if (brWs['B16']) {
      brWs['B16'].s = { font: { bold: true, sz: 11, name: 'Calibri' } };
    }

    brWs['A17'] = { t: 's', v: 'Difference:' };
    brWs['B17'] = { t: 'n', f: 'ABS(B8-B14)' };
    formatCellAsCurrency(brWs, 'B17');

    setColumnWidths(brWs, [40, 20]);
    brWs['!ref'] = 'A1:B17';
    XLSX.utils.book_append_sheet(wb, brWs, 'Bank Reconciliation');

    // 5. Chart of Accounts Template
    const coaWs: XLSX.WorkSheet = {};
    coaWs['A1'] = { t: 's', v: 'CHART OF ACCOUNTS TEMPLATE' };
    coaWs['A3'] = { t: 's', v: 'Account #' };
    coaWs['B3'] = { t: 's', v: 'Account Name' };
    coaWs['C3'] = { t: 's', v: 'Type' };
    coaWs['D3'] = { t: 's', v: 'Category' };
    coaWs['E3'] = { t: 's', v: 'Normal Balance' };
    coaWs['F3'] = { t: 's', v: 'Description' };
    applyHeaderStyle(coaWs, 3, ['A', 'B', 'C', 'D', 'E', 'F']);

    const coaSampleData = [
      {
        num: '1000',
        name: 'Cash',
        type: 'Asset',
        cat: 'Current Assets',
        balance: 'Debit',
        desc: 'Cash on hand and in bank',
      },
      {
        num: '1100',
        name: 'Accounts Receivable',
        type: 'Asset',
        cat: 'Current Assets',
        balance: 'Debit',
        desc: 'Amounts owed by customers',
      },
      {
        num: '1500',
        name: 'Equipment',
        type: 'Asset',
        cat: 'Fixed Assets',
        balance: 'Debit',
        desc: 'Office and production equipment',
      },
      {
        num: '2000',
        name: 'Accounts Payable',
        type: 'Liability',
        cat: 'Current Liabilities',
        balance: 'Credit',
        desc: 'Amounts owed to suppliers',
      },
      {
        num: '3000',
        name: 'Common Stock',
        type: 'Equity',
        cat: "Stockholders' Equity",
        balance: 'Credit',
        desc: 'Shares issued to stockholders',
      },
      {
        num: '4000',
        name: 'Revenue',
        type: 'Revenue',
        cat: 'Operating Revenue',
        balance: 'Credit',
        desc: 'Sales revenue',
      },
      {
        num: '5000',
        name: 'Cost of Goods Sold',
        type: 'Expense',
        cat: 'Cost of Sales',
        balance: 'Debit',
        desc: 'Direct costs of products sold',
      },
      {
        num: '6000',
        name: 'Operating Expenses',
        type: 'Expense',
        cat: 'Operating Expenses',
        balance: 'Debit',
        desc: 'General operating expenses',
      },
    ];

    row = 4;
    coaSampleData.forEach(account => {
      coaWs[`A${row}`] = { t: 's', v: account.num };
      coaWs[`B${row}`] = { t: 's', v: account.name };
      coaWs[`C${row}`] = { t: 's', v: account.type };
      coaWs[`D${row}`] = { t: 's', v: account.cat };
      coaWs[`E${row}`] = { t: 's', v: account.balance };
      coaWs[`F${row}`] = { t: 's', v: account.desc };
      row++;
    });

    applyBordersToRange(coaWs, 3, row - 1, ['A', 'B', 'C', 'D', 'E', 'F']);
    applyAlternatingRows(coaWs, 4, row - 1, ['A', 'B', 'C', 'D', 'E', 'F']);
    setColumnWidths(coaWs, [15, 35, 15, 20, 15, 50]);
    coaWs['!ref'] = `A1:F${row - 1}`;
    freezePane(coaWs, 'A4');
    XLSX.utils.book_append_sheet(wb, coaWs, 'Chart of Accounts');

    // Save workbook
    const filename = 'Accountrix_Templates_Complete.xlsx';
    XLSX.writeFile(wb, filename);

    console.log(`All templates exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting templates workbook:', error);
    throw new Error('Failed to export templates. Please try again.');
  }
}
