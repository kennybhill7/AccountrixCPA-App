# Excel Export Integration Guide

## Quick Start

### 1. Import the Functions

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
  // ... other types
} from '@/lib/export';
```

### 2. Create Export Buttons

```typescript
'use client';

import { exportTrialBalanceToExcel, type TrialBalance } from '@/lib/export';
import { useState } from 'react';

export function TrialBalanceExportButton({ data }: { data: TrialBalance }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      exportTrialBalanceToExcel(data);
      // Optional: Show success toast
    } catch (error) {
      console.error('Export failed:', error);
      // Optional: Show error toast
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {isExporting ? 'Exporting...' : 'Export to Excel'}
    </button>
  );
}
```

## React Component Examples

### Example 1: Trial Balance Page with Export

```typescript
'use client';

import { useState, useEffect } from 'react';
import { exportTrialBalanceToExcel, type TrialBalance } from '@/lib/export';

export default function TrialBalancePage() {
  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch trial balance data
    fetchTrialBalance().then(data => {
      setTrialBalance(data);
      setLoading(false);
    });
  }, []);

  const handleExport = () => {
    if (!trialBalance) return;

    try {
      exportTrialBalanceToExcel(trialBalance);
      alert('Trial balance exported successfully!');
    } catch (error) {
      alert('Export failed. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!trialBalance) return <div>No data available</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trial Balance</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export to Excel
        </button>
      </div>

      {/* Display trial balance table */}
      <TrialBalanceTable data={trialBalance} />
    </div>
  );
}

async function fetchTrialBalance(): Promise<TrialBalance> {
  // Your data fetching logic here
  return {
    date: new Date(),
    companyName: 'My Company',
    accounts: [
      { number: '1000', name: 'Cash', debit: 10000, credit: 0 },
      // ... more accounts
    ],
  };
}
```

### Example 2: Journal Entries with Multi-Select Export

```typescript
'use client';

import { useState } from 'react';
import { exportJournalEntriesToExcel, type JournalEntry } from '@/lib/export';

export function JournalEntriesExporter({ entries }: { entries: JournalEntry[] }) {
  const [selectedEntries, setSelectedEntries] = useState<Set<number>>(new Set());

  const handleExport = () => {
    const entriesToExport = entries.filter((_, index) =>
      selectedEntries.has(index)
    );

    if (entriesToExport.length === 0) {
      alert('Please select at least one entry to export');
      return;
    }

    try {
      exportJournalEntriesToExcel(entriesToExport);
    } catch (error) {
      alert('Export failed. Please try again.');
    }
  };

  const toggleSelection = (index: number) => {
    const newSelection = new Set(selectedEntries);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedEntries(newSelection);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <div>
          <button
            onClick={() => setSelectedEntries(new Set(entries.map((_, i) => i)))}
            className="mr-2 px-3 py-1 bg-gray-200 rounded"
          >
            Select All
          </button>
          <button
            onClick={() => setSelectedEntries(new Set())}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Deselect All
          </button>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export Selected ({selectedEntries.size})
        </button>
      </div>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div
            key={index}
            className={`p-4 border rounded cursor-pointer ${
              selectedEntries.has(index) ? 'bg-blue-50 border-blue-300' : 'bg-white'
            }`}
            onClick={() => toggleSelection(index)}
          >
            <div className="flex justify-between">
              <span className="font-medium">{entry.reference}</span>
              <span>{entry.date.toLocaleDateString()}</span>
            </div>
            <div className="text-sm text-gray-600">{entry.account}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Example 3: Dropdown Menu with Multiple Export Options

```typescript
'use client';

import { useState } from 'react';
import {
  exportTrialBalanceToExcel,
  exportJournalEntriesToExcel,
  exportAllTemplatesWorkbook,
  type TrialBalance,
  type JournalEntry,
} from '@/lib/export';

interface ExportMenuProps {
  trialBalance?: TrialBalance;
  journalEntries?: JournalEntry[];
}

export function ExportMenu({ trialBalance, journalEntries }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (type: string) => {
    try {
      switch (type) {
        case 'trial-balance':
          if (!trialBalance) {
            alert('No trial balance data available');
            return;
          }
          exportTrialBalanceToExcel(trialBalance);
          break;
        case 'journal-entries':
          if (!journalEntries || journalEntries.length === 0) {
            alert('No journal entries available');
            return;
          }
          exportJournalEntriesToExcel(journalEntries);
          break;
        case 'templates':
          exportAllTemplatesWorkbook();
          break;
        default:
          return;
      }
      setIsOpen(false);
    } catch (error) {
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Export ▼
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg border z-10">
          <button
            onClick={() => handleExport('trial-balance')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            disabled={!trialBalance}
          >
            Export Trial Balance
          </button>
          <button
            onClick={() => handleExport('journal-entries')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            disabled={!journalEntries || journalEntries.length === 0}
          >
            Export Journal Entries
          </button>
          <hr className="my-2" />
          <button
            onClick={() => handleExport('templates')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Download All Templates
          </button>
        </div>
      )}
    </div>
  );
}
```

### Example 4: Date Range Export

```typescript
'use client';

import { useState } from 'react';
import { exportJournalEntriesToExcel, type JournalEntry } from '@/lib/export';

export function DateRangeExporter({ entries }: { entries: JournalEntry[] }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });

    if (filteredEntries.length === 0) {
      alert('No entries found in the selected date range');
      return;
    }

    try {
      exportJournalEntriesToExcel(filteredEntries);
    } catch (error) {
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Export Journal Entries by Date</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      <button
        onClick={handleExport}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Export Date Range
      </button>
    </div>
  );
}
```

### Example 5: Progress Indicator for Large Exports

```typescript
'use client';

import { useState } from 'react';
import { exportTrialBalanceToExcel, type TrialBalance } from '@/lib/export';

export function TrialBalanceExportWithProgress({ data }: { data: TrialBalance }) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);

    // Simulate progress for user feedback
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 100);

    try {
      // Perform the actual export
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
      exportTrialBalanceToExcel(data);
      setProgress(100);

      // Show success message
      setTimeout(() => {
        setIsExporting(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      alert('Export failed. Please try again.');
      setIsExporting(false);
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isExporting ? `Exporting... ${progress}%` : 'Export to Excel'}
      </button>

      {isExporting && (
        <div className="mt-2 w-64 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
```

## API Route Examples

### Example: Server-Side Export Preparation

```typescript
// app/api/export/trial-balance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { type TrialBalance } from '@/lib/export';
import { getTrialBalance } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');
    const date = searchParams.get('date');

    if (!companyId || !date) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Fetch data from database
    const trialBalance = await getTrialBalance(companyId, new Date(date));

    return NextResponse.json(trialBalance);
  } catch (error) {
    console.error('Error fetching trial balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
```

### Client-Side Usage with API

```typescript
'use client';

import { useState } from 'react';
import { exportTrialBalanceToExcel, type TrialBalance } from '@/lib/export';

export function FetchAndExportButton({ companyId, date }: { companyId: string; date: Date }) {
  const [loading, setLoading] = useState(false);

  const handleFetchAndExport = async () => {
    setLoading(true);
    try {
      // Fetch data from API
      const response = await fetch(
        `/api/export/trial-balance?companyId=${companyId}&date=${date.toISOString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const trialBalance: TrialBalance = await response.json();

      // Export to Excel
      exportTrialBalanceToExcel(trialBalance);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFetchAndExport}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Loading...' : 'Fetch & Export'}
    </button>
  );
}
```

## Best Practices

### 1. Error Handling

Always wrap exports in try-catch blocks:

```typescript
const handleExport = () => {
  try {
    exportTrialBalanceToExcel(data);
    // Success feedback
  } catch (error) {
    console.error('Export error:', error);
    // Error feedback to user
  }
};
```

### 2. Data Validation

Validate data before exporting:

```typescript
const handleExport = () => {
  if (!data || !data.accounts || data.accounts.length === 0) {
    alert('No data available to export');
    return;
  }

  try {
    exportTrialBalanceToExcel(data);
  } catch (error) {
    alert('Export failed');
  }
};
```

### 3. User Feedback

Provide clear feedback during export:

```typescript
import { toast } from 'sonner'; // or your preferred toast library

const handleExport = async () => {
  const toastId = toast.loading('Preparing export...');

  try {
    exportTrialBalanceToExcel(data);
    toast.success('Trial balance exported successfully!', { id: toastId });
  } catch (error) {
    toast.error('Export failed. Please try again.', { id: toastId });
  }
};
```

### 4. Accessibility

Ensure buttons are accessible:

```typescript
<button
  onClick={handleExport}
  disabled={isExporting}
  aria-label="Export trial balance to Excel"
  aria-busy={isExporting}
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  Export to Excel
</button>
```

### 5. Mobile Considerations

Inform mobile users about the download:

```typescript
const handleExport = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  try {
    exportTrialBalanceToExcel(data);

    if (isMobile) {
      alert('File will be downloaded to your Downloads folder');
    }
  } catch (error) {
    alert('Export failed');
  }
};
```

## Testing

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { exportTrialBalanceToExcel } from '@/lib/export';

describe('Excel Exporter', () => {
  it('should export trial balance without errors', () => {
    const data = {
      date: new Date(),
      accounts: [
        { number: '1000', name: 'Cash', debit: 10000, credit: 0 },
      ],
    };

    expect(() => exportTrialBalanceToExcel(data)).not.toThrow();
  });

  it('should handle empty accounts array', () => {
    const data = {
      date: new Date(),
      accounts: [],
    };

    expect(() => exportTrialBalanceToExcel(data)).not.toThrow();
  });
});
```

### Integration Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TrialBalanceExportButton } from './TrialBalanceExportButton';

describe('TrialBalanceExportButton', () => {
  it('should render export button', () => {
    const data = {
      date: new Date(),
      accounts: [{ number: '1000', name: 'Cash', debit: 10000, credit: 0 }],
    };

    render(<TrialBalanceExportButton data={data} />);
    expect(screen.getByText('Export to Excel')).toBeInTheDocument();
  });

  it('should call export function on click', () => {
    const data = {
      date: new Date(),
      accounts: [{ number: '1000', name: 'Cash', debit: 10000, credit: 0 }],
    };

    render(<TrialBalanceExportButton data={data} />);
    const button = screen.getByText('Export to Excel');

    fireEvent.click(button);

    // Assert that export was called (you may need to mock the export function)
  });
});
```

## Common Issues

### Issue: "Module not found: xlsx"

**Solution**: Ensure xlsx is installed:
```bash
npm install xlsx
```

### Issue: Export button not responding

**Solution**: Check for JavaScript errors in console. Ensure data is properly formatted.

### Issue: File downloads as .xls instead of .xlsx

**Solution**: The file extension is determined by `XLSX.writeFile()`. Ensure the filename ends with `.xlsx`.

### Issue: Formulas not calculating in Excel

**Solution**: Formulas calculate when Excel opens the file. They will appear as text until then.

## Performance Tips

### 1. Debounce Export Clicks

Prevent multiple rapid exports:

```typescript
import { debounce } from 'lodash';

const handleExport = debounce(() => {
  exportTrialBalanceToExcel(data);
}, 1000);
```

### 2. Memoize Large Data

Use React.useMemo for large datasets:

```typescript
const processedData = useMemo(() => {
  return {
    date: new Date(),
    accounts: accounts.map(/* processing */),
  };
}, [accounts]);
```

### 3. Lazy Load Export Function

Load the export function only when needed:

```typescript
const handleExport = async () => {
  const { exportTrialBalanceToExcel } = await import('@/lib/export');
  exportTrialBalanceToExcel(data);
};
```

## Conclusion

The Excel export system is designed to be simple to integrate while providing powerful functionality. Use these examples as a starting point and customize them to fit your specific needs.

For more details, see:
- `EXCEL_EXPORT_README.md` - Full API documentation
- `excel-exporter.example.ts` - Usage examples with sample data
- `excel-exporter.test.ts` - Test suite
