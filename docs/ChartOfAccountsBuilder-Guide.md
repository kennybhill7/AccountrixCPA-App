# Chart of Accounts Builder - Complete Usage Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Core Features](#core-features)
4. [Templates](#templates)
5. [Account Management](#account-management)
6. [Validation & Best Practices](#validation--best-practices)
7. [Import/Export](#importexport)
8. [Integration Examples](#integration-examples)
9. [Educational Use Cases](#educational-use-cases)
10. [API Reference](#api-reference)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

The Chart of Accounts Builder is a comprehensive, interactive React component designed specifically for construction accounting education. It helps students and professionals:

- **Learn** accounting principles through hands-on practice
- **Design** custom Chart of Accounts structures
- **Understand** construction-specific accounting needs
- **Export** COAs for use in real accounting software
- **Practice** with realistic scenarios and templates

### Key Benefits

- **Interactive Learning**: Immediate feedback on account structure decisions
- **Industry-Specific**: Pre-built templates for construction companies
- **Validation**: Built-in rules prevent common mistakes
- **Professional**: Export-ready formats for real-world use
- **Comprehensive**: Covers all five account types with detailed categorization

---

## Getting Started

### Installation

The component is already installed in your Accountrix application. To use it in a new page:

```tsx
import ChartOfAccountsBuilder from '@/components/ChartOfAccountsBuilder';

export default function MyPage() {
  return (
    <div className="container mx-auto py-8">
      <ChartOfAccountsBuilder />
    </div>
  );
}
```

### Quick Start

1. **Navigate** to `/coa-builder` in your application
2. **Select** a template or start from scratch
3. **Add** accounts using the "Add Account" button
4. **Edit** accounts by clicking the edit icon
5. **Save** your Chart of Accounts

### First Steps Tutorial

#### Step 1: Choose a Template

Start with one of three pre-built templates:

- **Basic Construction COA**: 50 accounts for general contractors
- **Multi-Entity COA**: 80 accounts with intercompany features
- **Real Estate Development COA**: 70 accounts for developers

#### Step 2: Customize Accounts

Modify existing accounts:
1. Click the edit icon next to any account
2. Change the name, description, or category
3. Mark as active/inactive
4. Save your changes

#### Step 3: Add New Accounts

Create custom accounts:
1. Click "Add Account" or the category-specific "Add" button
2. Enter account number (or use suggested number)
3. Enter account name and description
4. Select category and normal balance
5. Click "Add Account"

#### Step 4: Create Sub-Accounts

For detailed tracking:
1. Add a parent account first (e.g., 1000 - Cash)
2. Click "Add Account" in the same category
3. Check "Is Sub-Account"
4. Select the parent account
5. Enter sub-account details (e.g., 1001 - Cash - Operating)

#### Step 5: Export Your COA

Save your work:
1. Click "Export CSV" for spreadsheet format
2. Click "Export JSON" for backup
3. Use utility functions for Excel or PDF export
4. Click "Save" to persist changes (if callback provided)

---

## Core Features

### 1. Account Categories

Five main categories with standard numbering:

| Category | Range | Normal Balance | Examples |
|----------|-------|----------------|----------|
| **Assets** | 1000-1999 | Debit (DR) | Cash, Accounts Receivable, Equipment |
| **Liabilities** | 2000-2999 | Credit (CR) | Accounts Payable, Notes Payable |
| **Equity** | 3000-3999 | Credit (CR) | Owner's Capital, Retained Earnings |
| **Revenue** | 4000-4999 | Credit (CR) | Construction Revenue, Service Income |
| **Expenses** | 5000-5999 | Debit (DR) | Labor, Materials, Office Expenses |

### 2. Sub-Categories

Each main category has detailed sub-categories:

**Assets:**
- Current Assets (cash, receivables, inventory)
- Fixed Assets (equipment, vehicles, buildings)
- Other Assets (long-term investments, intangibles)

**Liabilities:**
- Current Liabilities (payables, accrued expenses)
- Long-term Liabilities (notes, mortgages)

**Equity:**
- Owner's Capital
- Retained Earnings
- Draws/Distributions

**Revenue:**
- Operating Revenue (primary business income)
- Other Revenue (non-operating income)

**Expenses:**
- Cost of Sales (direct project costs)
- Operating Expenses (overhead)
- Other Expenses (non-operating costs)

### 3. Account Properties

Each account has these properties:

```typescript
{
  number: string;          // Unique identifier (e.g., "1000")
  name: string;            // Descriptive name (e.g., "Cash")
  type: AccountType;       // Asset, Liability, etc.
  normalBalance: 'DR' | 'CR';  // Debit or Credit
  category: AccountCategory;   // Sub-classification
  description?: string;    // Optional explanation
  isSubAccount: boolean;   // Parent-child relationship
  parentAccount?: string;  // Parent's account number
  isActive: boolean;       // Currently in use
  hasSubAccounts: boolean; // Has children
}
```

### 4. Visual Features

- **Color Coding**: Each account type has a distinct color
- **Expandable Categories**: Click to show/hide accounts
- **Search**: Real-time filtering by number or name
- **Statistics Panel**: Live count of accounts by type
- **Responsive Design**: Works on all screen sizes
- **Dark Mode**: Automatically adapts to theme

---

## Templates

### Basic Construction COA

**Best For**: General contractors, small construction businesses

**Includes**:
- 10 Asset accounts (cash, receivables, equipment)
- 6 Liability accounts (payables, loans)
- 3 Equity accounts (capital, earnings)
- 3 Revenue accounts (construction, service)
- 8 Expense accounts (labor, materials, overhead)

**Key Features**:
- Retainage tracking (receivable and payable)
- Equipment and depreciation
- Work in Progress account
- Standard expense categories

### Multi-Entity Construction COA

**Best For**: Construction companies with multiple entities, holding companies

**Includes**:
- All Basic COA accounts
- Intercompany receivable/payable accounts
- Management fee accounts
- Allocation expense accounts

**Key Features**:
- Tracks inter-entity transactions
- Management fees between entities
- Shared cost allocations
- Consolidated reporting support

### Real Estate Development COA

**Best For**: Real estate developers, land development companies

**Includes**:
- Land inventory accounts
- Development cost tracking
- Construction in progress
- Pre-development expenses
- Capitalized interest

**Key Features**:
- Land acquisition and holding costs
- Site development expenses
- Building construction costs
- Impact fees and permits
- Interest capitalization

---

## Account Management

### Adding Accounts

**Method 1: Global Add**
1. Click "Add Account" in the toolbar
2. Select account type
3. Use suggested number or enter custom
4. Fill in details
5. Save

**Method 2: Category Add**
1. Expand desired category
2. Click "Add" button in category header
3. Account type is pre-selected
4. Fill in details
5. Save

**Best Practices**:
- Use consistent numbering (increment by 10)
- Choose descriptive names
- Add helpful descriptions
- Select appropriate category

### Editing Accounts

**To Edit an Account**:
1. Click the edit icon next to the account
2. Modify desired fields
3. Note: Account type cannot be changed
4. Click "Save Changes"

**Editable Fields**:
- Account name
- Description
- Category (within same type)
- Normal balance (with warning)
- Active status
- Sub-account parent

**Non-Editable Fields**:
- Account number (to maintain data integrity)
- Account type (would break financial structure)

### Deleting Accounts

**Safe Deletion Process**:
1. Click the delete icon next to account
2. Review confirmation dialog
3. Check for warnings:
   - Account has sub-accounts
   - Account has been used (future feature)
4. Confirm deletion

**Important Notes**:
- Deleting a parent account orphans sub-accounts
- Cannot undo deletion
- Consider marking as "inactive" instead

### Sub-Accounts

**Creating Sub-Accounts**:

Example: Breaking down Cash account

1. **Parent Account**: 1000 - Cash
2. **Sub-Accounts**:
   - 1001 - Cash - Operating Account
   - 1002 - Cash - Payroll Account
   - 1003 - Cash - Retention Account

**Guidelines**:
- Sub-accounts must be same type as parent
- Use sequential numbering
- Don't nest more than 2 levels deep
- Use for detailed tracking, not every account

**Common Sub-Account Structures**:

**Cash Accounts**:
```
1000 - Cash
  1001 - Cash - Operating
  1002 - Cash - Payroll
  1003 - Cash - Project Funds
```

**Revenue by Project Type**:
```
4000 - Construction Revenue
  4010 - Revenue - Residential
  4020 - Revenue - Commercial
  4030 - Revenue - Government
```

**Expense by Department**:
```
5500 - Office Expenses
  5510 - Office Supplies
  5520 - Postage & Shipping
  5530 - Software & Subscriptions
```

---

## Validation & Best Practices

### Automatic Validation

The component validates:

1. **Account Numbers**
   - Must be numeric
   - Must be unique
   - Must be in correct range for type

2. **Account Types**
   - Assets: 1000-1999
   - Liabilities: 2000-2999
   - Equity: 3000-3999
   - Revenue: 4000-4999
   - Expenses: 5000-5999

3. **Sub-Accounts**
   - Must have valid parent
   - Parent must exist
   - Must be same type as parent

4. **Normal Balances**
   - Assets: DR (except contra-accounts)
   - Liabilities: CR
   - Equity: CR (except draws)
   - Revenue: CR
   - Expenses: DR

### Using the Validation Utility

```typescript
import { validateCOA } from '@/lib/coa-utils';

const results = validateCOA(myAccounts);

if (!results.valid) {
  console.log('Errors:', results.errors);
}

if (results.warnings.length > 0) {
  console.log('Warnings:', results.warnings);
}
```

### Best Practices

#### Numbering Convention

✅ **Good**:
- 1000, 1010, 1020, 1030 (consistent increments)
- Leave gaps for future accounts
- Group related accounts together

❌ **Bad**:
- 1000, 1001, 1002, 1003 (no room to grow)
- 1000, 1050, 1075, 1090 (inconsistent)
- Random numbering

#### Account Names

✅ **Good**:
- "Cash - Operating Account"
- "Accounts Receivable - Trade"
- "Construction Revenue - Residential"

❌ **Bad**:
- "Cash Acct" (abbreviations)
- "Account 1" (not descriptive)
- "Various Expenses" (too vague)

#### Account Organization

✅ **Good**:
- Logical grouping by function
- Clear hierarchy with sub-accounts
- Balance between detail and simplicity

❌ **Bad**:
- Too many accounts (overwhelming)
- Too few accounts (not detailed enough)
- Inconsistent categorization

#### Construction-Specific Tips

1. **Track Retainage Separately**
   ```
   1150 - Retainage Receivable
   2050 - Retainage Payable
   ```

2. **Use Job Costing Accounts**
   ```
   1300 - Work in Progress
   5000 - Direct Labor
   5100 - Direct Materials
   5200 - Subcontractors
   ```

3. **Monitor Equipment Properly**
   ```
   1400 - Equipment (cost)
   1450 - Accumulated Depreciation - Equipment
   5400 - Depreciation Expense
   ```

4. **Separate Direct Costs from Overhead**
   ```
   5000-5299 - Direct Costs (Cost of Sales)
   5300-5999 - Overhead (Operating Expenses)
   ```

---

## Import/Export

### Export Formats

#### CSV Export

**What's Included**:
- All account details
- Formatted for Excel
- Compatible with most accounting software

**How to Use**:
```typescript
// Built into component
<Button onClick={() => handleExport('csv')}>
  Export CSV
</Button>
```

#### JSON Export

**What's Included**:
- Complete account objects
- Perfect for backup
- Easy to restore

**How to Use**:
```typescript
// Built into component
<Button onClick={() => handleExport('json')}>
  Export JSON
</Button>
```

#### Excel Export (Advanced)

**What's Included**:
- Formatted spreadsheet
- Column headers
- Styled cells

**How to Use**:
```typescript
import { exportToExcel } from '@/lib/coa-utils';

exportToExcel(accounts, 'my-chart-of-accounts.xlsx');
```

#### PDF Export (Advanced)

**What's Included**:
- Professional formatted document
- Statistics summary
- Print-ready

**How to Use**:
```typescript
import { exportToPDF } from '@/lib/coa-utils';

await exportToPDF(accounts, 'my-chart-of-accounts.pdf');
```

### Import Formats

#### CSV Import

**Requirements**:
- Specific column headers
- Valid account types
- Correct number ranges

**How to Use**:
```typescript
import { importFromExcel } from '@/lib/coa-utils';

const file = event.target.files[0];
const accounts = await importFromExcel(file);
```

**CSV Format**:
```csv
Number,Name,Type,Normal Balance,Category,Description,Is Sub-Account,Parent Account,Is Active
1000,Cash,Asset,DR,Current Asset,Operating cash,No,,Yes
1100,Accounts Receivable,Asset,DR,Current Asset,Customer balances,No,,Yes
```

---

## Integration Examples

### With Journal Entry Simulator

```typescript
import ChartOfAccountsBuilder from '@/components/ChartOfAccountsBuilder';
import JournalEntrySimulator from '@/components/JournalEntrySimulator';

export default function IntegratedPage() {
  const [coa, setCoa] = useState<Account[]>([]);

  return (
    <>
      <ChartOfAccountsBuilder
        onSave={setCoa}
      />

      {coa.length > 0 && (
        <JournalEntrySimulator
          availableAccounts={coa}
        />
      )}
    </>
  );
}
```

### With Trial Balance

```typescript
import { formatForFinancialStatements } from '@/lib/coa-utils';

const { balanceSheet, incomeStatement } = formatForFinancialStatements(accounts);

console.log('Balance Sheet Accounts:', balanceSheet);
console.log('Income Statement Accounts:', incomeStatement);
```

### With Financial Statements

```typescript
// Use COA to generate financial statements
const assets = accounts.filter(a => a.type === 'Asset' && a.isActive);
const liabilities = accounts.filter(a => a.type === 'Liability' && a.isActive);
// ... etc
```

---

## Educational Use Cases

### 1. Classroom Instruction

**Objective**: Teach Chart of Accounts fundamentals

**Activities**:
1. Students load Basic Construction template
2. Instructor explains each account category
3. Students add 5 custom accounts
4. Compare with classmates
5. Export and submit

### 2. Individual Practice

**Objective**: Build COA from scratch

**Activities**:
1. Start with empty COA
2. Research construction accounting
3. Create 25+ accounts
4. Validate structure
5. Export to PDF

### 3. Group Projects

**Objective**: Design COA for case study company

**Activities**:
1. Analyze company requirements
2. Choose appropriate template
3. Customize for specific needs
4. Present to class
5. Receive feedback

### 4. Homework Assignments

**Assignment Ideas**:
- Create COA for different business types
- Compare two COA structures
- Identify missing accounts in template
- Fix errors in provided COA
- Design sub-account structure

### 5. Exam Preparation

**Study Activities**:
- Memorize account number ranges
- Practice normal balance rules
- Create flashcards from COA
- Quiz on account classifications
- Timed COA building challenges

---

## API Reference

### Component Props

```typescript
interface ChartOfAccountsBuilderProps {
  initialCOA?: Account[];           // Starting accounts
  onSave?: (coa: Account[]) => void; // Save callback
  readOnly?: boolean;                // Disable editing
  showTemplates?: boolean;           // Show template selector
}
```

### Account Interface

```typescript
interface Account {
  number: string;
  name: string;
  type: AccountType;
  normalBalance: 'DR' | 'CR';
  description?: string;
  isSubAccount: boolean;
  parentAccount?: string;
  category: AccountCategory;
  isActive: boolean;
  hasSubAccounts: boolean;
}
```

### Utility Functions

#### validateCOA

```typescript
function validateCOA(accounts: Account[]): {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

#### exportToExcel

```typescript
function exportToExcel(
  accounts: Account[],
  filename?: string
): void
```

#### importFromExcel

```typescript
async function importFromExcel(
  file: File
): Promise<Account[]>
```

#### compareCOAs

```typescript
function compareCOAs(
  oldCOA: Account[],
  newCOA: Account[]
): {
  added: Account[];
  removed: Account[];
  modified: Account[];
}
```

#### suggestAccountNumbers

```typescript
function suggestAccountNumbers(
  type: AccountType,
  accounts: Account[]
): string[]
```

---

## Troubleshooting

### Common Issues

#### Issue: "Account number already exists"

**Cause**: Trying to create account with duplicate number

**Solution**:
1. Use suggested account number
2. Choose a different number
3. Check for existing accounts in range

#### Issue: "Account number outside valid range"

**Cause**: Number doesn't match account type

**Solution**:
- Assets: 1000-1999
- Liabilities: 2000-2999
- Equity: 3000-3999
- Revenue: 4000-4999
- Expenses: 5000-5999

#### Issue: "Parent account not found"

**Cause**: Sub-account references non-existent parent

**Solution**:
1. Create parent account first
2. Verify parent account number
3. Ensure parent is same type

#### Issue: Export not working

**Cause**: No accounts created or browser restrictions

**Solution**:
1. Create at least one account
2. Check browser console for errors
3. Try different export format
4. Ensure pop-ups are allowed

### Performance Issues

**If component is slow**:
- Reduce number of accounts (>500 may be slow)
- Close unnecessary browser tabs
- Clear browser cache
- Use latest browser version

### Browser Compatibility

**Supported Browsers**:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Not Supported**:
- Internet Explorer
- Very old browser versions

---

## Additional Resources

### Documentation

- [Component README](../components/ChartOfAccountsBuilder.md)
- [Utility Functions](../lib/coa-utils.ts)
- [Test Examples](../components/ChartOfAccountsBuilder.test.tsx)

### Example Pages

- Basic Usage: `/coa-builder`
- Advanced Examples: `/coa-builder/examples`
- Integration Demo: `/coa-builder/integration`

### Related Components

- Journal Entry Simulator
- Trial Balance Worksheet
- Bank Reconciliation Worksheet
- Financial Statements Generator

### External Resources

- Construction Financial Management Association (CFMA)
- Accounting standards for construction
- QuickBooks integration guides
- Generally Accepted Accounting Principles (GAAP)

---

## Support

For questions, issues, or feature requests:

1. Check this documentation
2. Review example pages
3. Examine test files
4. Contact instructor/administrator

---

## Version History

- **v1.0.0** (2025): Initial release
  - Five account types
  - Three templates
  - Import/Export functionality
  - Validation system
  - Sub-account support

---

**Last Updated**: 2025-01-13

**Component Location**: `components/ChartOfAccountsBuilder.tsx`

**Documentation**: `docs/ChartOfAccountsBuilder-Guide.md`
