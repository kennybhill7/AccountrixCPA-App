# PDF Export System - Quick Start Guide

## Installation Complete

The PDF export system has been installed and is ready to use!

## Installed Packages

- `jspdf` - Core PDF generation library
- `jspdf-autotable` - Table generation plugin
- `@types/jspdf` - TypeScript definitions

## File Structure

```
lib/export/
├── pdf-exporter.ts      # Main export system with all functions
├── example-usage.tsx    # React component examples
├── index.ts             # Convenient imports
├── README.md            # Full documentation
└── QUICKSTART.md        # This file
```

## Quick Usage Examples

### 1. Export a Journal Entry (Most Common Use Case)

```typescript
import { exportJournalEntriesToPDF } from '@/lib/export';

const entries = [
  {
    date: new Date(),
    account: "Cash",
    debit: 5000,
    credit: 0,
    description: "Initial investment"
  },
  {
    date: new Date(),
    account: "Owner's Capital",
    debit: 0,
    credit: 5000,
    description: "Initial investment"
  }
];

// In your component:
<button onClick={() => exportJournalEntriesToPDF(entries)}>
  Export to PDF
</button>
```

### 2. Export Quiz Results

```typescript
import { exportQuizResultsToPDF } from '@/lib/export';

const quizResults = {
  quizTitle: "Module 1 Quiz",
  userName: "John Doe",
  score: 8,
  totalQuestions: 10,
  dateTaken: new Date(),
  questions: [...], // Your quiz questions
  answers: [...]    // User's answers
};

<button onClick={() => exportQuizResultsToPDF(quizResults)}>
  Download Results
</button>
```

### 3. Generate Certificate

```typescript
import { exportCertificateToPDF } from '@/lib/export';

const certificateData = {
  userName: "John Doe",
  completionDate: new Date(),
  finalScore: 92,
  competencies: [
    "Double-Entry Bookkeeping",
    "Journal Entries",
    "Trial Balance"
  ]
};

<button onClick={() => exportCertificateToPDF(certificateData)}>
  Download Certificate
</button>
```

### 4. Export Trial Balance

```typescript
import { exportTrialBalanceToPDF } from '@/lib/export';

const trialBalance = {
  date: new Date(),
  companyName: "ABC Company",
  accounts: [
    { accountName: "Cash", debit: 10000, credit: 0 },
    { accountName: "Owner's Capital", debit: 0, credit: 10000 }
  ]
};

<button onClick={() => exportTrialBalanceToPDF(trialBalance)}>
  Export Trial Balance
</button>
```

## What Happens When You Export?

1. **PDF is generated** client-side in the browser
2. **File is automatically downloaded** to the user's Downloads folder
3. **Filename is automatically created** with format: `Accountrix_[Type]_YYYY-MM-DD.pdf`
4. **Professional styling** is applied with Accountrix branding

## Common Integration Pattern

```typescript
'use client';

import { useState } from 'react';
import { exportJournalEntriesToPDF, type JournalEntry } from '@/lib/export';

export default function MyWorksheet() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const handleExport = () => {
    try {
      exportJournalEntriesToPDF(entries);
      // Optional: Show success message
      alert('PDF exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  return (
    <div>
      {/* Your worksheet UI */}
      <button onClick={handleExport}>
        Export to PDF
      </button>
    </div>
  );
}
```

## Testing the System

See `example-usage.tsx` for complete working examples of all export functions.

To test in your app, you can create a demo page:

```typescript
// app/pdf-demo/page.tsx
import { PDFExportDemo } from '@/lib/export/example-usage';

export default function PDFDemoPage() {
  return <PDFExportDemo />;
}
```

Then visit `/pdf-demo` in your browser and click any export button to test.

## Features You Get

All exported PDFs include:

- **Professional branding** with Accountrix logo
- **Page headers** with title
- **Page footers** with page numbers
- **Consistent styling** with blue color scheme
- **Tables** with alternating row colors
- **Right-aligned numbers** in Courier font
- **Automatic page breaks** when content is too long
- **Balance verification** for accounting worksheets
- **Color coding** (green for success, red for errors)

## Troubleshooting

### PDF not downloading?
- Check browser popup blocker
- Ensure the data passed is valid
- Look at browser console for errors

### TypeScript errors?
- Make sure you're importing types: `import type { JournalEntry } from '@/lib/export'`
- Check that your data matches the required interface

### Styling issues?
- All PDFs use standard fonts (Helvetica, Courier)
- No special fonts needed - works in all browsers

## Next Steps

1. Read the full `README.md` for detailed documentation
2. Check `example-usage.tsx` for component integration examples
3. Start integrating export buttons into your worksheets
4. Customize the styling if needed (edit `pdf-exporter.ts`)

## Need Help?

- Check the console for error messages
- Verify your data matches the TypeScript interfaces
- Look at the example components in `example-usage.tsx`
- Review the full documentation in `README.md`

---

**Ready to go!** Start adding export buttons to your worksheets now.
