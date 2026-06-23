# PDF Export System Documentation

## Overview

The PDF export system provides comprehensive functionality to export various accounting education materials and worksheets as professionally formatted PDF documents.

## Installation

The following dependencies are required:

```bash
npm install jspdf jspdf-autotable @types/jspdf
```

## Available Export Functions

### 1. exportLessonToPDF(lesson: LessonContent)

Export lesson content with proper formatting.

**Usage:**
```typescript
import { exportLessonToPDF } from '@/lib/export/pdf-exporter';

const lesson = {
  title: "Introduction to Double-Entry Bookkeeping",
  content: "Double-entry bookkeeping is a system where every transaction affects at least two accounts...",
  estimatedMinutes: 45,
  moduleId: "M1",
  weekId: "W1"
};

exportLessonToPDF(lesson);
```

**Output:** `Accountrix_Lesson_M1W1_2025-10-13.pdf`

---

### 2. exportQuizResultsToPDF(quizResults: QuizResults)

Export quiz results with questions, user answers, and explanations.

**Usage:**
```typescript
import { exportQuizResultsToPDF } from '@/lib/export/pdf-exporter';

const quizResults = {
  quizTitle: "Module 1 Week 1 Quiz",
  userName: "John Doe",
  score: 8,
  totalQuestions: 10,
  dateTaken: new Date(),
  questions: [
    {
      id: "q1",
      question: "What is the accounting equation?",
      options: [
        "Assets = Liabilities + Equity",
        "Assets = Liabilities - Equity",
        "Assets + Liabilities = Equity",
        "Assets - Liabilities = Equity"
      ],
      correctAnswer: 0,
      explanation: "The fundamental accounting equation shows that assets must equal the sum of liabilities and equity."
    }
    // ... more questions
  ],
  answers: [
    {
      questionId: "q1",
      selectedAnswer: 0,
      isCorrect: true
    }
    // ... more answers
  ]
};

exportQuizResultsToPDF(quizResults);
```

**Output:** `Accountrix_Quiz_Results_M1W1_2025-10-13.pdf`

---

### 3. exportCertificateToPDF(userData: CertificateData)

Generate a professional certificate of completion.

**Usage:**
```typescript
import { exportCertificateToPDF } from '@/lib/export/pdf-exporter';

const certificateData = {
  userName: "John Doe",
  completionDate: new Date(),
  finalScore: 92,
  courseTitle: "Accounting Fundamentals",
  competencies: [
    "Understanding of Double-Entry Bookkeeping",
    "Journal Entry Preparation",
    "Trial Balance Creation",
    "Bank Reconciliation",
    "Financial Statement Analysis"
  ],
  instructorName: "Prof. Jane Smith",
  certificateId: "CERT-2025-001234"
};

exportCertificateToPDF(certificateData);
```

**Output:** `Accountrix_Certificate_JohnDoe_2025-10-13.pdf`

---

### 4. exportJournalEntriesToPDF(entries: JournalEntry[])

Export journal entries in a formatted table.

**Usage:**
```typescript
import { exportJournalEntriesToPDF } from '@/lib/export/pdf-exporter';

const journalEntries = [
  {
    date: new Date('2025-01-15'),
    account: "Cash",
    debit: 5000,
    credit: 0,
    description: "Initial investment"
  },
  {
    date: new Date('2025-01-15'),
    account: "Owner's Capital",
    debit: 0,
    credit: 5000,
    description: "Initial investment"
  },
  {
    date: new Date('2025-01-20'),
    account: "Office Supplies",
    debit: 350,
    credit: 0,
    description: "Purchased supplies"
  },
  {
    date: new Date('2025-01-20'),
    account: "Cash",
    debit: 0,
    credit: 350,
    description: "Purchased supplies"
  }
];

exportJournalEntriesToPDF(journalEntries);
```

**Output:** `Accountrix_JournalEntries_2025-10-13.pdf`

---

### 5. exportTrialBalanceToPDF(trialBalance: TrialBalance)

Export trial balance with automatic balance verification.

**Usage:**
```typescript
import { exportTrialBalanceToPDF } from '@/lib/export/pdf-exporter';

const trialBalance = {
  date: new Date(),
  companyName: "ABC Company",
  accounts: [
    { accountNumber: "1000", accountName: "Cash", debit: 15000, credit: 0 },
    { accountNumber: "1200", accountName: "Accounts Receivable", debit: 5000, credit: 0 },
    { accountNumber: "2000", accountName: "Accounts Payable", debit: 0, credit: 3000 },
    { accountNumber: "3000", accountName: "Owner's Capital", debit: 0, credit: 17000 }
  ]
};

exportTrialBalanceToPDF(trialBalance);
```

**Output:** `Accountrix_TrialBalance_2025-10-13.pdf`

The PDF will show a green indicator if the trial balance is balanced (debits = credits), or a red indicator with the difference if not balanced.

---

### 6. exportBankRecToPDF(bankRec: BankReconciliation)

Export bank reconciliation statement.

**Usage:**
```typescript
import { exportBankRecToPDF } from '@/lib/export/pdf-exporter';

const bankReconciliation = {
  date: new Date(),
  companyName: "ABC Company",
  bankBalance: 12500,
  bookBalance: 11800,
  bankAdjustments: [
    { description: "Outstanding checks", amount: 1200, type: 'deduction' },
    { description: "Deposits in transit", amount: 800, type: 'addition' }
  ],
  bookAdjustments: [
    { description: "Bank service charge", amount: 25, type: 'deduction' },
    { description: "Interest earned", amount: 125, type: 'addition' }
  ]
};

exportBankRecToPDF(bankReconciliation);
```

**Output:** `Accountrix_BankReconciliation_2025-10-13.pdf`

---

### 7. exportAIAFormToPDF(aiaData: AIAFormData)

Export AIA G702 Application for Payment form.

**Usage:**
```typescript
import { exportAIAFormToPDF } from '@/lib/export/pdf-exporter';

const aiaForm = {
  projectName: "Downtown Office Building",
  projectNumber: "2025-001",
  contractDate: new Date('2025-01-01'),
  contractSum: 500000,
  changeOrders: [
    { number: "001", description: "Additional electrical work", amount: 15000 },
    { number: "002", description: "Upgraded HVAC system", amount: 25000 }
  ],
  workCompleted: 350000,
  materialsStored: 50000,
  totalCompleted: 400000,
  retainage: 40000,
  previousPayments: 250000,
  currentPaymentDue: 110000,
  date: new Date()
};

exportAIAFormToPDF(aiaForm);
```

**Output:** `Accountrix_AIA_G702_2025001_2025-10-13.pdf`

---

## Helper Functions

The module also exports useful helper functions:

### formatCurrency(amount: number): string

Formats numbers as currency with accounting notation (negative values in parentheses).

```typescript
import { formatCurrency } from '@/lib/export/pdf-exporter';

formatCurrency(1234.56);  // "1,234.56"
formatCurrency(-1234.56); // "(1,234.56)"
```

### formatDate(date: Date | string): string

Formats dates in a readable format.

```typescript
import { formatDate } from '@/lib/export/pdf-exporter';

formatDate(new Date('2025-10-13')); // "October 13, 2025"
```

---

## Component Integration Example

### React Component with Export Button

```tsx
'use client';

import { useState } from 'react';
import { exportJournalEntriesToPDF, JournalEntry } from '@/lib/export/pdf-exporter';
import { Button } from '@/components/ui/button';

export default function JournalEntryWorksheet() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      date: new Date(),
      account: "Cash",
      debit: 5000,
      credit: 0,
      description: "Initial investment"
    },
    // ... more entries
  ]);

  const handleExportPDF = () => {
    try {
      exportJournalEntriesToPDF(entries);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Journal Entries</h2>

      {/* Display entries table */}
      <div className="overflow-x-auto">
        {/* ... table content ... */}
      </div>

      <Button onClick={handleExportPDF} className="mt-4">
        Export to PDF
      </Button>
    </div>
  );
}
```

---

## PDF Styling Features

All PDFs include:

- **Professional branding**: Accountrix logo and color scheme
- **Primary color**: #2563eb (blue) for headers and accents
- **Consistent typography**: Helvetica for text, Courier for numbers
- **Page headers**: Logo and title on each page
- **Page footers**: Page numbers and generation date
- **Proper margins**: 20mm on all sides
- **Table formatting**: Alternating row colors, bold headers, right-aligned numbers
- **Color coding**: Green for success/balanced, red for errors/unbalanced

---

## Error Handling

All export functions include:

- Try/catch blocks to handle errors gracefully
- Console logging for debugging
- User-friendly alert messages on failure
- Validation of required data

---

## Browser Compatibility

The PDF export system works in all modern browsers:

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

PDFs are generated client-side and downloaded directly to the user's device.

---

## File Naming Convention

All exported PDFs follow this pattern:

```
Accountrix_[Type]_[Identifier]_YYYY-MM-DD.pdf
```

Examples:
- `Accountrix_Lesson_M1W1_2025-10-13.pdf`
- `Accountrix_Quiz_Results_M1W1_2025-10-13.pdf`
- `Accountrix_Certificate_JohnDoe_2025-10-13.pdf`
- `Accountrix_JournalEntries_2025-10-13.pdf`

---

## Troubleshooting

### PDF not downloading

1. Check browser popup blocker settings
2. Ensure the data passed to the function is valid
3. Check console for error messages

### Formatting issues

1. Ensure all required fields are provided in the data object
2. Check that numeric values are actual numbers, not strings
3. Verify dates are valid Date objects or ISO strings

### Missing fonts

The system uses standard fonts (Helvetica, Courier) that are available in all PDF viewers.

---

## Future Enhancements

Possible future additions:

- QR codes for certificate verification
- Digital signatures
- Custom company logos
- Multi-language support
- Email integration
- Batch export functionality
- PDF encryption/password protection
