# Chart of Accounts Builder

A comprehensive, interactive React component for building and managing Chart of Accounts (COA) structures for construction companies and accounting education.

## Features

### Core Functionality
- **Hierarchical Account Structure**: Five main categories (Assets, Liabilities, Equity, Revenue, Expenses)
- **Account Numbering**: Standard numbering convention (1000-5999)
- **CRUD Operations**: Add, edit, delete accounts with full validation
- **Sub-Accounts**: Support for parent-child account relationships
- **Search & Filter**: Real-time search and type-based filtering
- **Templates**: Three pre-built COA templates
- **Import/Export**: CSV, JSON, and Excel support
- **Validation**: Comprehensive validation rules and error checking

### Educational Features
- Account type color coding
- Normal balance indicators (DR/CR)
- Best practices information panel
- Account statistics dashboard
- Tooltips and descriptions

### User Interface
- Expandable/collapsible categories
- Drag-and-drop reordering (planned)
- Modal dialogs for add/edit operations
- Confirmation dialogs for deletions
- Responsive design
- Dark mode support

## Installation

```bash
npm install
```

Required dependencies:
- React 19+
- Next.js 15+
- Radix UI components
- Lucide React icons
- Tailwind CSS
- xlsx (for Excel export)

## Usage

### Basic Usage

```tsx
import ChartOfAccountsBuilder from '@/components/ChartOfAccountsBuilder';

export default function MyPage() {
  return <ChartOfAccountsBuilder />;
}
```

### With Save Callback

```tsx
import ChartOfAccountsBuilder from '@/components/ChartOfAccountsBuilder';

export default function MyPage() {
  const handleSave = (accounts) => {
    console.log('Saving accounts:', accounts);
    // Save to database or API
  };

  return (
    <ChartOfAccountsBuilder
      onSave={handleSave}
      showTemplates={true}
      readOnly={false}
    />
  );
}
```

### With Initial Data

```tsx
import ChartOfAccountsBuilder from '@/components/ChartOfAccountsBuilder';

const myAccounts = [
  {
    number: '1000',
    name: 'Cash',
    type: 'Asset',
    normalBalance: 'DR',
    category: 'Current Asset',
    isSubAccount: false,
    isActive: true,
    hasSubAccounts: false,
    description: 'Primary operating account',
  },
  // ... more accounts
];

export default function MyPage() {
  return <ChartOfAccountsBuilder initialCOA={myAccounts} />;
}
```

### Read-Only Mode

```tsx
<ChartOfAccountsBuilder
  initialCOA={myAccounts}
  readOnly={true}
  showTemplates={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialCOA` | `Account[]` | Basic Construction COA | Starting chart of accounts |
| `onSave` | `(accounts: Account[]) => void` | `undefined` | Callback when Save button is clicked |
| `readOnly` | `boolean` | `false` | Disables all editing features |
| `showTemplates` | `boolean` | `true` | Shows template selector dropdown |

## Account Structure

```typescript
interface Account {
  number: string;          // "1000"
  name: string;            // "Cash"
  type: AccountType;       // "Asset" | "Liability" | "Equity" | "Revenue" | "Expense"
  normalBalance: 'DR' | 'CR';
  description?: string;
  isSubAccount: boolean;
  parentAccount?: string;
  category: AccountCategory;
  isActive: boolean;
  hasSubAccounts: boolean;
}
```

## Account Numbering Convention

| Type | Range | Examples |
|------|-------|----------|
| Assets | 1000-1999 | 1000 Cash, 1100 Accounts Receivable, 1400 Equipment |
| Liabilities | 2000-2999 | 2000 Accounts Payable, 2200 Notes Payable |
| Equity | 3000-3999 | 3000 Owner's Capital, 3100 Retained Earnings |
| Revenue | 4000-4999 | 4000 Construction Revenue, 4100 Service Revenue |
| Expenses | 5000-5999 | 5000 Direct Labor, 5100 Materials, 5500 Office Expenses |

## Templates

### 1. Basic Construction COA (50 accounts)
Standard chart for general contractors including:
- Current and fixed assets
- Short and long-term liabilities
- Owner's equity accounts
- Construction and service revenue
- Direct costs and overhead expenses

### 2. Multi-Entity Construction COA (80 accounts)
Expands basic template with:
- Intercompany receivable/payable accounts
- Management fee accounts
- Allocation accounts for shared costs

### 3. Real Estate Development COA (70 accounts)
Specialized for developers with:
- Land inventory accounts
- Development cost tracking
- Capitalized interest
- Pre-development expenses
- Impact fees

## Validation Rules

The component enforces these validation rules:

1. **Account Numbers**:
   - Must be numeric
   - Must be unique
   - Must be in correct range for account type

2. **Account Types**:
   - Cannot be changed after creation (to maintain data integrity)
   - Must match number range

3. **Normal Balances**:
   - Assets: DR (except contra-accounts like Accumulated Depreciation: CR)
   - Liabilities: CR
   - Equity: CR (except Draws: DR)
   - Revenue: CR
   - Expenses: DR

4. **Sub-Accounts**:
   - Must have a valid parent account
   - Parent must exist in same account type

5. **Deletions**:
   - Warns if account has sub-accounts
   - Warns if account has been used in transactions (planned)

## Export Functionality

### CSV Export
```typescript
// Exports all account data to CSV format
// Includes: Number, Name, Type, Balance, Category, Description, etc.
```

### JSON Export
```typescript
// Exports accounts as JSON array
// Useful for backup and restore
```

### Excel Export (via utility)
```typescript
import { exportToExcel } from '@/lib/coa-utils';

exportToExcel(accounts, 'my-coa.xlsx');
```

### PDF Export (via utility)
```typescript
import { exportToPDF } from '@/lib/coa-utils';

exportToPDF(accounts, 'my-coa.pdf');
```

## Utility Functions

The `coa-utils.ts` file provides additional utilities:

### Validation
```typescript
import { validateCOA } from '@/lib/coa-utils';

const result = validateCOA(accounts);
console.log(result.valid); // true/false
console.log(result.errors); // Array of error messages
console.log(result.warnings); // Array of warning messages
```

### Comparison
```typescript
import { compareCOAs } from '@/lib/coa-utils';

const diff = compareCOAs(oldAccounts, newAccounts);
console.log(diff.added); // Newly added accounts
console.log(diff.removed); // Deleted accounts
console.log(diff.modified); // Changed accounts
```

### Merging
```typescript
import { mergeCOAs } from '@/lib/coa-utils';

const merged = mergeCOAs(primaryCOA, secondaryCOA, 'merge');
```

### Account Suggestions
```typescript
import { suggestAccountNumbers } from '@/lib/coa-utils';

const suggestions = suggestAccountNumbers('Asset', existingAccounts);
// Returns: ['1030', '1040', '1050']
```

## Best Practices

### Account Structure
- Use consistent numbering increments (typically 10)
- Leave gaps for future accounts
- Group related accounts together
- Use descriptive names

### Sub-Accounts
- Create sub-accounts for detailed tracking
- Example: 1000 Cash → 1001 Cash-Operating, 1002 Cash-Payroll
- Don't nest more than 2 levels deep

### Account Categories
- Current Assets: Cash, receivables, inventory (< 1 year)
- Fixed Assets: Equipment, vehicles, buildings
- Current Liabilities: Payables, accrued expenses (< 1 year)
- Long-term Liabilities: Notes payable, mortgages

### Construction-Specific
- Track retainage separately (receivable and payable)
- Use Work in Progress for job costing
- Separate direct costs from overhead
- Monitor equipment depreciation

## Styling

The component uses:
- **Color Coding**:
  - Assets: Blue
  - Liabilities: Red
  - Equity: Green
  - Revenue: Purple
  - Expenses: Orange

- **Tailwind CSS** classes for styling
- **Dark mode** support via `next-themes`
- **Responsive design** for mobile/tablet/desktop

## Testing

Run tests with:

```bash
npm test
```

The component includes:
- Unit tests for helper functions
- Integration tests for UI interactions
- Validation tests
- Export/import tests

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus management in modals
- High contrast mode support

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome)

## Performance

- Optimized with `useMemo` for filtering
- Efficient tree building
- Lazy loading for large COAs (planned)
- Virtual scrolling for 1000+ accounts (planned)

## Future Enhancements

- [ ] Drag-and-drop reordering
- [ ] Bulk import from QuickBooks/Xero
- [ ] Transaction history per account
- [ ] Financial statement preview
- [ ] Account usage analytics
- [ ] Custom templates
- [ ] Collaborative editing
- [ ] Version history
- [ ] Audit trail

## License

MIT

## Support

For issues, questions, or contributions, please visit the project repository.

## Related Components

- `JournalEntrySimulator` - Practice journal entries using your COA
- `TrialBalanceWorksheet` - Generate trial balances from accounts
- `FinancialStatements` - Create financial reports using your COA

## Examples

See `/app/coa-builder/page.tsx` for a complete implementation example.

## Credits

Built for Accountrix - Accounting Education Platform for Construction Industry
