# Excel Export Quick Reference

## Installation

```bash
npm install xlsx @types/node
```

## Import

```typescript
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
} from '@/lib/export';
```

## Usage

### Trial Balance

```typescript
const data: TrialBalance = {
  date: new Date(),
  companyName: 'ABC Company',
  accounts: [
    { number: '1000', name: 'Cash', debit: 10000, credit: 0 },
    { number: '2000', name: 'A/P', debit: 0, credit: 5000 },
  ],
};

exportTrialBalanceToExcel(data);
// Output: Accountrix_TrialBalance_2025-10-13.xlsx
```

### Journal Entries

```typescript
const entries: JournalEntry[] = [
  {
    date: new Date(),
    reference: 'JE-001',
    account: 'Cash',
    debit: 5000,
    credit: 0,
    description: 'Investment',
  },
  {
    date: new Date(),
    reference: 'JE-001',
    account: 'Common Stock',
    debit: 0,
    credit: 5000,
    description: 'Investment',
  },
];

exportJournalEntriesToExcel(entries);
// Output: Accountrix_JournalEntries_2025-10-13.xlsx
```

### Bank Reconciliation

```typescript
const bankRec: BankReconciliation = {
  date: new Date(),
  companyName: 'ABC Company',
  bankBalance: 28500,
  bookBalance: 25000,
  bankAdjustments: [
    { description: 'Deposits in transit', amount: 5000, type: 'addition' },
    { description: 'Outstanding checks', amount: 3500, type: 'deduction' },
  ],
  bookAdjustments: [
    { description: 'Bank fees', amount: 50, type: 'deduction' },
    { description: 'Interest', amount: 25, type: 'addition' },
  ],
};

exportBankRecToExcel(bankRec);
// Output: Accountrix_BankRec_2025-10-13.xlsx
```

### WIP Schedule

```typescript
const wip: WIPSchedule = {
  asOfDate: new Date(),
  companyName: 'ABC Construction',
  projects: [
    {
      name: 'Tower One',
      contractValue: 5000000,
      costsToDate: 2000000,
      estimatedTotalCosts: 4000000,
      percentComplete: 0.5,
      revenueRecognized: 2500000,
      grossProfit: 500000,
      grossProfitPercent: 0.2,
    },
  ],
};

exportWIPScheduleToExcel(wip);
// Output: Accountrix_WIP_2025-10-13.xlsx
```

### Chart of Accounts

```typescript
const coa: ChartOfAccounts = {
  companyName: 'ABC Company',
  accounts: [
    {
      number: '1000',
      name: 'Cash',
      type: 'Asset',
      category: 'Current Assets',
      normalBalance: 'Debit',
      description: 'Cash on hand',
    },
  ],
};

exportChartOfAccountsToExcel(coa);
// Output: Accountrix_ChartOfAccounts_2025-10-13.xlsx
```

### Consolidation

```typescript
const consol: ConsolidationData = {
  consolidationDate: new Date(),
  entities: [
    {
      name: 'Parent Corp',
      financials: {
        date: new Date(),
        accounts: [
          { number: '1000', name: 'Cash', debit: 50000, credit: 0 },
        ],
      },
    },
    {
      name: 'Subsidiary A',
      financials: {
        date: new Date(),
        accounts: [
          { number: '1000', name: 'Cash', debit: 20000, credit: 0 },
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
      credit: 100000,
      description: 'Eliminate investment',
    },
  ],
};

exportConsolidationWorksheetToExcel(consol);
// Output: Accountrix_Consolidation_2025-12-31.xlsx
```

### All Templates

```typescript
exportAllTemplatesWorkbook();
// Output: Accountrix_Templates_Complete.xlsx
```

## React Component

```typescript
'use client';

import { exportTrialBalanceToExcel, type TrialBalance } from '@/lib/export';
import { useState } from 'react';

export function ExportButton({ data }: { data: TrialBalance }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      exportTrialBalanceToExcel(data);
      alert('Exported successfully!');
    } catch (error) {
      alert('Export failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleExport} disabled={loading}>
      {loading ? 'Exporting...' : 'Export to Excel'}
    </button>
  );
}
```

## Excel Features

### Headers
- Font: Calibri 12pt Bold
- Color: White on Blue (#4472C4)
- Borders: Thin all sides
- Frozen panes for scrolling

### Data
- Font: Calibri 11pt
- Alternating rows: Light gray (#F2F2F2)
- Currency: Accounting format
- Borders: Thin all sides

### Formulas
```excel
=SUM(C5:C100)                    // Total
=IF(C8=D8,"✓ BALANCED","✗")     // Balance check
=C5/D5                           // % Complete
=B5*E5                           // Revenue
=ABS(B8-B14)                     // Difference
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Module not found | `npm install xlsx` |
| File not downloading | Check browser console |
| Formulas not calculating | Open file in Excel |
| Wrong file extension | Filename must end with .xlsx |

## File Outputs

| Function | Output Filename |
|----------|----------------|
| Trial Balance | `Accountrix_TrialBalance_YYYY-MM-DD.xlsx` |
| Journal Entries | `Accountrix_JournalEntries_YYYY-MM-DD.xlsx` |
| Bank Rec | `Accountrix_BankRec_YYYY-MM-DD.xlsx` |
| WIP Schedule | `Accountrix_WIP_YYYY-MM-DD.xlsx` |
| Chart of Accounts | `Accountrix_ChartOfAccounts_YYYY-MM-DD.xlsx` |
| Consolidation | `Accountrix_Consolidation_YYYY-MM-DD.xlsx` |
| All Templates | `Accountrix_Templates_Complete.xlsx` |

## Documentation

- 📖 **Complete API**: `EXCEL_EXPORT_README.md`
- 🔧 **Integration Guide**: `EXCEL_INTEGRATION_GUIDE.md`
- 📝 **Examples**: `excel-exporter.example.ts`
- 🧪 **Tests**: `excel-exporter.test.ts`
- 📊 **Summary**: `EXCEL_EXPORT_SUMMARY.md`

## Support

1. Check documentation
2. Review examples
3. Run tests
4. Visit: https://docs.sheetjs.com/

---

**Quick Reference v1.0.0** | Accountrix Education Platform
