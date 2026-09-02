# Excel Export System Documentation

## Overview

The Excel Export System provides comprehensive Excel file generation for accounting worksheets and templates. Built with SheetJS (xlsx), it creates professional, formula-driven Excel workbooks with proper formatting, column sizing, and accounting-style number formats.

## Installation

```bash
npm install xlsx @types/node
```

## Features

### Professional Formatting
- **Headers**: Bold, white text on blue background (#4472C4)
- **Alternating Rows**: Light gray (#F2F2F2) for readability
- **Total Rows**: Light blue background (#D9E1F2) with bold text
- **Currency Format**: Accounting format `_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)`
- **Borders**: Thin borders on all data cells
- **Column Widths**: Auto-sized for optimal readability
- **Freeze Panes**: Headers frozen for easy scrolling

### Excel Formulas
All exports use native Excel formulas (not pre-calculated values):
- `SUM()` for totals
- `IF()` for conditional logic
- Cell references for dynamic calculations
- Formula-driven percent complete and profit margins

## Export Functions

### 1. Trial Balance Export

```typescript
import { exportTrialBalanceToExcel, type TrialBalance } from '@/lib/export';

const trialBalance: TrialBalance = {
  date: new Date('2025-10-31'),
  companyName: 'ABC Company',
  accounts: [
    { number: '1000', name: 'Cash', debit: 25000, credit: 0 },
    { number: '2000', name: 'Accounts Payable', debit: 0, credit: 15000 },
    // ... more accounts
  ],
};

exportTrialBalanceToExcel(trialBalance);
```

**Output**: `Accountrix_TrialBalance_YYYY-MM-DD.xlsx`

**Features**:
- Account number and name columns
- Debit and credit columns with accounting format
- SUM formulas for totals
- Balance check formula: `IF(C_total=D_total,"✓ BALANCED","✗ NOT BALANCED")`
- Freeze panes at row 5

**Template Structure**:
```
Row 1: Company Name / "TRIAL BALANCE"
Row 2: As of [Date]
Row 3: [blank]
Row 4: Headers (Account #, Account Name, Debit, Credit)
Row 5+: Account data
Last-1: TOTALS with SUM formulas
Last: BALANCED? check
```

### 2. Journal Entries Export

```typescript
import { exportJournalEntriesToExcel, type JournalEntry } from '@/lib/export';

const entries: JournalEntry[] = [
  {
    date: new Date('2025-10-15'),
    reference: 'JE-001',
    account: 'Cash',
    debit: 5000,
    credit: 0,
    description: 'Investment by owner',
  },
  {
    date: new Date('2025-10-15'),
    reference: 'JE-001',
    account: 'Common Stock',
    debit: 0,
    credit: 5000,
    description: 'Investment by owner',
  },
  // ... more entries
];

exportJournalEntriesToExcel(entries);
```

**Output**: `Accountrix_JournalEntries_YYYY-MM-DD.xlsx`

**Features**:
- Date column with date formatting
- Reference number tracking
- Account, Debit, Credit, and Description columns
- Totals with SUM formulas
- Balance check: `IF(D_total=E_total,"✓","✗")`

### 3. Bank Reconciliation Export

```typescript
import { exportBankRecToExcel, type BankReconciliation } from '@/lib/export';

const bankRec: BankReconciliation = {
  date: new Date('2025-10-31'),
  companyName: 'ABC Company',
  bankBalance: 28500,
  bookBalance: 25000,
  bankAdjustments: [
    { description: 'Deposits in transit', amount: 5000, type: 'addition' },
    { description: 'Outstanding checks', amount: 3500, type: 'deduction' },
  ],
  bookAdjustments: [
    { description: 'Bank service charges', amount: 50, type: 'deduction' },
    { description: 'Interest earned', amount: 25, type: 'addition' },
  ],
};

exportBankRecToExcel(bankRec);
```

**Output**: `Accountrix_BankRec_YYYY-MM-DD.xlsx`

**Features**:
- Bank balance section with adjustments
- Book balance section with adjustments
- Formulas for adjusted balances
- Reconciliation status check
- Difference calculation

**Template Structure**:
```
Bank Statement Balance
  Balance per bank: $28,500.00
  Add: Deposits in transit: $5,000.00
  Less: Outstanding checks: ($3,500.00)
  Adjusted bank balance: =SUM formula

Book Balance
  Balance per books: $25,000.00
  Add: Interest earned: $25.00
  Less: Bank service charges: ($50.00)
  Adjusted book balance: =SUM formula

Status: =IF(ABS(adjusted_bank-adjusted_book)<0.01,"✓ RECONCILED","✗ NOT RECONCILED")
Difference: =ABS(adjusted_bank-adjusted_book)
```

### 4. WIP Schedule Export (Construction-Specific)

```typescript
import { exportWIPScheduleToExcel, type WIPSchedule } from '@/lib/export';

const wipSchedule: WIPSchedule = {
  asOfDate: new Date('2025-10-31'),
  companyName: 'ABC Construction',
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
    // ... more projects
  ],
};

exportWIPScheduleToExcel(wipSchedule);
```

**Output**: `Accountrix_WIP_YYYY-MM-DD.xlsx`

**Features**:
- Project tracking columns
- Percentage completion formula: `=Costs_to_Date/Est_Total_Costs`
- Revenue recognition formula: `=Contract_Value*Percent_Complete`
- Gross profit formula: `=Revenue-Costs_to_Date`
- GP% formula: `=Gross_Profit/Revenue`
- Totals row with SUM formulas

**Columns**:
- Project name
- Contract Value
- Costs to Date
- Estimated Total Costs
- % Complete (formula-driven)
- Revenue Recognized (formula-driven)
- Gross Profit (formula-driven)
- GP % (formula-driven)

### 5. Chart of Accounts Export

```typescript
import { exportChartOfAccountsToExcel, type ChartOfAccounts } from '@/lib/export';

const coa: ChartOfAccounts = {
  companyName: 'ABC Company',
  accounts: [
    {
      number: '1000',
      name: 'Cash',
      type: 'Asset',
      category: 'Current Assets',
      normalBalance: 'Debit',
      description: 'Cash on hand and in bank accounts',
    },
    // ... more accounts
  ],
};

exportChartOfAccountsToExcel(coa);
```

**Output**: `Accountrix_ChartOfAccounts_YYYY-MM-DD.xlsx`

**Features**:
- Account number, name, type, category
- Normal balance (Debit/Credit)
- Description field
- Organized with alternating row colors
- Sortable by account number

### 6. Consolidation Worksheet Export (Multi-Sheet)

```typescript
import { exportConsolidationWorksheetToExcel, type ConsolidationData } from '@/lib/export';

const consolidation: ConsolidationData = {
  consolidationDate: new Date('2025-12-31'),
  entities: [
    {
      name: 'Parent Corp',
      financials: {
        date: new Date('2025-12-31'),
        accounts: [
          { number: '1000', name: 'Cash', debit: 50000, credit: 0 },
          // ... more accounts
        ],
      },
    },
    {
      name: 'Subsidiary A',
      financials: {
        date: new Date('2025-12-31'),
        accounts: [
          { number: '1000', name: 'Cash', debit: 20000, credit: 0 },
          // ... more accounts
        ],
      },
    },
    // ... more entities
  ],
  eliminations: [
    {
      date: new Date('2025-12-31'),
      reference: 'ELIM-001',
      account: 'Investment in Subsidiary',
      debit: 0,
      credit: 100000,
      description: 'Eliminate investment',
    },
    // ... more eliminations
  ],
};

exportConsolidationWorksheetToExcel(consolidation);
```

**Output**: `Accountrix_Consolidation_YYYY-MM-DD.xlsx`

**Features**:
- **Multiple Sheets**: One sheet per entity + Eliminations + Consolidated
- **Entity Sheets**: Individual trial balances for each entity
- **Eliminations Sheet**: All elimination journal entries
- **Consolidated Sheet**: Combined trial balance with formulas
- **Cross-sheet formulas**: (if needed for advanced users)

**Sheet Structure**:
```
Sheet 1: Parent Corp (Trial Balance)
Sheet 2: Subsidiary A (Trial Balance)
Sheet 3: Subsidiary B (Trial Balance)
Sheet 4: Eliminations (Journal Entries)
Sheet 5: Consolidated (Consolidated Trial Balance)
```

### 7. All Templates Workbook Export

```typescript
import { exportAllTemplatesWorkbook } from '@/lib/export';

exportAllTemplatesWorkbook();
```

**Output**: `Accountrix_Templates_Complete.xlsx`

**Features**:
- **One Workbook**: All templates in a single file
- **Multiple Sheets**: Trial Balance, Journal Entries, WIP Schedule, Bank Rec, Chart of Accounts
- **Sample Data**: Pre-populated with example data
- **Ready to Use**: Students can copy and modify
- **Teaching Tool**: Perfect for classroom demonstrations

**Sheets Included**:
1. Trial Balance Template (with sample accounts)
2. Journal Entries Template (with sample transactions)
3. WIP Schedule Template (with sample projects)
4. Bank Reconciliation Template (with sample adjustments)
5. Chart of Accounts Template (with sample account structure)

## TypeScript Types

### TrialBalance
```typescript
interface TrialBalance {
  date: Date;
  companyName?: string;
  accounts: {
    number: string;
    name: string;
    debit: number;
    credit: number;
  }[];
}
```

### JournalEntry
```typescript
interface JournalEntry {
  date: Date;
  reference: string;
  account: string;
  debit: number;
  credit: number;
  description?: string;
}
```

### BankReconciliation
```typescript
interface BankReconciliation {
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
```

### WIPSchedule
```typescript
interface WIPSchedule {
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
```

### ChartOfAccounts
```typescript
interface ChartOfAccounts {
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
```

### ConsolidationData
```typescript
interface ConsolidationData {
  consolidationDate: Date;
  entities: {
    name: string;
    financials: TrialBalance;
  }[];
  eliminations: JournalEntry[];
}
```

## File Naming Convention

All exported files follow this convention:
```
Accountrix_[ReportType]_YYYY-MM-DD.xlsx
```

Examples:
- `Accountrix_TrialBalance_2025-10-13.xlsx`
- `Accountrix_JournalEntries_2025-10-13.xlsx`
- `Accountrix_WIP_2025-10-13.xlsx`
- `Accountrix_Consolidation_2025-12-31.xlsx`
- `Accountrix_Templates_Complete.xlsx` (no date for templates)

## Error Handling

All export functions include try-catch blocks:

```typescript
try {
  exportTrialBalanceToExcel(data);
} catch (error) {
  console.error('Export failed:', error);
  // Error is thrown with user-friendly message
}
```

Error messages are user-friendly:
- "Failed to export trial balance. Please try again."
- "Failed to export journal entries. Please try again."

## Browser Compatibility

The xlsx library works in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Node.js environments

Files are saved using `XLSX.writeFile()` which triggers browser download.

## Integration with React/Next.js

### Button Component Example

```typescript
'use client';

import { exportTrialBalanceToExcel, type TrialBalance } from '@/lib/export';

export function ExportTrialBalanceButton({ data }: { data: TrialBalance }) {
  const handleExport = () => {
    try {
      exportTrialBalanceToExcel(data);
    } catch (error) {
      alert('Failed to export. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Export to Excel
    </button>
  );
}
```

### API Route Example (Next.js)

```typescript
// app/api/export/trial-balance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exportTrialBalanceToExcel } from '@/lib/export';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    exportTrialBalanceToExcel(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}
```

## Testing

Run the example file to test all exports:

```typescript
// In your test file
import { runAllExamples } from '@/lib/export/excel-exporter.example';

runAllExamples();
```

This will generate all Excel files with sample data.

## Best Practices

### 1. Data Validation
Always validate data before exporting:

```typescript
function validateTrialBalance(tb: TrialBalance): boolean {
  if (!tb.date || !tb.accounts || tb.accounts.length === 0) {
    return false;
  }
  return true;
}

if (validateTrialBalance(data)) {
  exportTrialBalanceToExcel(data);
} else {
  alert('Invalid data');
}
```

### 2. User Feedback
Provide feedback during export:

```typescript
const handleExport = async () => {
  setLoading(true);
  try {
    exportTrialBalanceToExcel(data);
    toast.success('Trial balance exported successfully!');
  } catch (error) {
    toast.error('Export failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### 3. Large Datasets
For very large datasets (1000+ rows), consider:
- Showing a loading indicator
- Chunking data export
- Using Web Workers for processing

### 4. Mobile Considerations
On mobile devices, the file will download to the default downloads folder. Inform users about this behavior.

## Customization

### Custom Colors
Modify constants in `excel-exporter.ts`:

```typescript
const HEADER_COLOR = '4472C4'; // Change to your brand color
const ALT_ROW_COLOR = 'F2F2F2'; // Change alternating row color
```

### Custom Column Widths
Modify column width arrays in each function:

```typescript
setColumnWidths(ws, [15, 40, 18, 18]); // Adjust as needed
```

### Custom Formulas
Add your own formulas:

```typescript
ws[`E5`] = {
  t: 'n',
  f: 'C5*D5', // Custom formula
  z: '0.00%'  // Custom format
};
```

## Advanced Features

### Sheet Protection
Add protection to prevent formula editing:

```typescript
ws['!protect'] = {
  password: 'yourpassword',
  formatCells: false,
  formatColumns: false,
  formatRows: false,
  insertColumns: false,
  insertRows: false,
  insertHyperlinks: false,
  deleteColumns: false,
  deleteRows: false,
  selectLockedCells: true,
  sort: false,
  autoFilter: false,
  pivotTables: false,
  selectUnlockedCells: true
};
```

### Data Validation
Add dropdown lists for data entry:

```typescript
ws['!dataValidation'] = [{
  sqref: 'A5:A100',
  type: 'list',
  formula1: '"Asset,Liability,Equity,Revenue,Expense"'
}];
```

### Conditional Formatting
While xlsx doesn't directly support conditional formatting, you can apply cell styles based on values:

```typescript
if (account.debit > 10000) {
  ws[cellRef].s = {
    ...ws[cellRef].s,
    fill: { fgColor: { rgb: 'FFFF00' } } // Yellow highlight
  };
}
```

## Troubleshooting

### Issue: File doesn't download
**Solution**: Check browser console for errors. Ensure data is valid.

### Issue: Formulas not calculating
**Solution**: Formulas calculate when Excel opens the file. They appear as formulas until then.

### Issue: Currency format not showing
**Solution**: Ensure the number format string is correct: `_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)`

### Issue: Sheet name too long
**Solution**: Sheet names are limited to 31 characters. Names are automatically truncated.

### Issue: Performance slow with large datasets
**Solution**: Consider pagination or chunking data. SheetJS handles up to 100,000 rows well.

## Support

For issues or questions:
1. Check this documentation
2. Review `excel-exporter.example.ts` for usage examples
3. Check SheetJS documentation: https://docs.sheetjs.com/
4. Contact support@accountrix.com

## Version History

- **v1.0.0** (2025-10-13): Initial release
  - Trial Balance export
  - Journal Entries export
  - Bank Reconciliation export
  - WIP Schedule export
  - Chart of Accounts export
  - Consolidation Worksheet export
  - All Templates workbook export

## License

Copyright © 2025 Accountrix. All rights reserved.
