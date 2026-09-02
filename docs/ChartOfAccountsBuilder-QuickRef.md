# Chart of Accounts Builder - Quick Reference Card

## 🎯 Quick Start

```tsx
import ChartOfAccountsBuilder from '@/components/ChartOfAccountsBuilder';

<ChartOfAccountsBuilder />
```

**Routes**:
- `/coa-builder` - Basic demo
- `/coa-builder/examples` - Advanced examples
- `/coa-builder/integration` - Workflow integration

---

## 📊 Account Number Ranges

| Type | Range | Normal Balance | Color |
|------|-------|----------------|-------|
| **Assets** | 1000-1999 | DR | 🔵 Blue |
| **Liabilities** | 2000-2999 | CR | 🔴 Red |
| **Equity** | 3000-3999 | CR | 🟢 Green |
| **Revenue** | 4000-4999 | CR | 🟣 Purple |
| **Expenses** | 5000-5999 | DR | 🟠 Orange |

---

## 🎨 Templates

| Template | Accounts | Best For |
|----------|----------|----------|
| **Basic Construction** | 50 | General contractors |
| **Multi-Entity** | 80 | Multiple entities |
| **Real Estate Development** | 70 | Developers |

---

## ⚡ Quick Actions

### Add Account
1. Click "Add Account" button
2. Enter number (or use suggestion)
3. Fill details
4. Click "Add Account"

### Edit Account
1. Click edit icon next to account
2. Modify fields
3. Click "Save Changes"

### Delete Account
1. Click delete icon
2. Confirm deletion
3. Account removed

### Create Sub-Account
1. Add parent account first
2. Click "Add Account"
3. Check "Is Sub-Account"
4. Select parent
5. Save

---

## 🔍 Search & Filter

**Search**: Type account number or name

**Filter**: Select account type or "All Types"

**Expand/Collapse**: Click category header

---

## 💾 Export Options

| Format | Use Case |
|--------|----------|
| **CSV** | Spreadsheets, import to accounting software |
| **JSON** | Backup, data transfer |
| **Excel** | Formatted reports (via utility) |
| **PDF** | Printing, sharing (via utility) |

---

## ✅ Validation Rules

✅ Account numbers must be unique
✅ Numbers must match account type range
✅ Sub-accounts must have valid parent
✅ Normal balance should match type
✅ All fields required except description

---

## 🎓 Normal Balance Rules

**Debit (DR)**:
- Assets (except contra-accounts)
- Expenses
- Draws/Distributions

**Credit (CR)**:
- Liabilities
- Equity (except draws)
- Revenue
- Contra-accounts (e.g., Accumulated Depreciation)

---

## 🏗️ Construction-Specific Accounts

**Essential Accounts**:
```
1150 - Retainage Receivable
2050 - Retainage Payable
1300 - Work in Progress
5000 - Direct Labor
5100 - Materials
5200 - Subcontractors
1400 - Equipment
1450 - Accumulated Depreciation - Equipment
```

---

## 🔧 Utility Functions

### Validation
```tsx
import { validateCOA } from '@/lib/coa-utils';
const result = validateCOA(accounts);
```

### Export Excel
```tsx
import { exportToExcel } from '@/lib/coa-utils';
exportToExcel(accounts, 'my-coa.xlsx');
```

### Export PDF
```tsx
import { exportToPDF } from '@/lib/coa-utils';
await exportToPDF(accounts, 'my-coa.pdf');
```

### Compare Versions
```tsx
import { compareCOAs } from '@/lib/coa-utils';
const diff = compareCOAs(oldCOA, newCOA);
```

### Suggest Numbers
```tsx
import { suggestAccountNumbers } from '@/lib/coa-utils';
const suggestions = suggestAccountNumbers('Asset', accounts);
```

---

## 🎯 Component Props

```tsx
interface Props {
  initialCOA?: Account[];           // Starting accounts
  onSave?: (coa: Account[]) => void; // Save callback
  readOnly?: boolean;                // Disable editing
  showTemplates?: boolean;           // Show templates
}
```

---

## 📝 Account Interface

```tsx
interface Account {
  number: string;          // "1000"
  name: string;            // "Cash"
  type: AccountType;       // "Asset"
  normalBalance: 'DR' | 'CR';
  description?: string;
  isSubAccount: boolean;
  parentAccount?: string;
  category: AccountCategory;
  isActive: boolean;
  hasSubAccounts: boolean;
}
```

---

## 🚨 Common Errors

| Error | Solution |
|-------|----------|
| "Account number already exists" | Use different number |
| "Number outside valid range" | Check type-specific range |
| "Parent account not found" | Create parent first |
| "Parent account required" | Select parent or uncheck sub-account |

---

## 💡 Best Practices

✅ Use consistent numbering (increment by 10)
✅ Leave gaps for future accounts
✅ Choose descriptive names
✅ Add helpful descriptions
✅ Group related accounts
✅ Create sub-accounts for detail
✅ Validate regularly
✅ Export for backup

---

## 📚 Documentation

- **Component Docs**: `components/ChartOfAccountsBuilder.md`
- **Usage Guide**: `docs/ChartOfAccountsBuilder-Guide.md`
- **File Summary**: `docs/ChartOfAccountsBuilder-FileSummary.md`
- **Quick Reference**: `docs/ChartOfAccountsBuilder-QuickRef.md`

---

## 🎓 Learning Objectives

After using this component, students should be able to:

✅ Explain the five account types
✅ Apply normal balance rules
✅ Create properly structured Chart of Accounts
✅ Understand account numbering conventions
✅ Recognize construction-specific accounts
✅ Validate COA for errors
✅ Export COA for real-world use

---

## 🔗 Integration

### With Journal Entries
```tsx
<ChartOfAccountsBuilder onSave={setCoa} />
{coa.length > 0 && <JournalEntrySimulator accounts={coa} />}
```

### With Financial Statements
```tsx
import { formatForFinancialStatements } from '@/lib/coa-utils';
const { balanceSheet, incomeStatement } = formatForFinancialStatements(coa);
```

---

## 🎯 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl/Cmd + F` | Focus search |
| `Esc` | Close dialog |
| `Enter` | Submit form |
| `Tab` | Navigate fields |

---

## 📊 Statistics Panel

Displays real-time counts:
- Total Accounts
- Assets
- Liabilities
- Equity
- Revenue
- Expenses
- Sub-Accounts

---

## 🎨 Color Coding

Categories are color-coded for easy identification:
- **Blue** = Assets (1000s)
- **Red** = Liabilities (2000s)
- **Green** = Equity (3000s)
- **Purple** = Revenue (4000s)
- **Orange** = Expenses (5000s)

---

## ⚙️ Configuration

### Read-Only Mode
```tsx
<ChartOfAccountsBuilder readOnly={true} />
```

### Without Templates
```tsx
<ChartOfAccountsBuilder showTemplates={false} />
```

### With Initial Data
```tsx
<ChartOfAccountsBuilder initialCOA={myAccounts} />
```

### With Save Handler
```tsx
<ChartOfAccountsBuilder onSave={(accounts) => {
  console.log('Saved:', accounts);
}} />
```

---

## 🐛 Troubleshooting

**Component not rendering?**
- Check imports
- Verify dependencies installed
- Check console for errors

**Export not working?**
- Create accounts first
- Check browser console
- Allow pop-ups
- Try different format

**Validation errors?**
- Review validation rules
- Check account numbers
- Verify parent accounts exist
- Ensure normal balances match

---

## 📱 Responsive Design

Works on all screen sizes:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1920px+)

---

## 🌙 Dark Mode

Automatically adapts to system theme:
- Light mode support
- Dark mode support
- Smooth transitions
- Accessible contrast ratios

---

## ♿ Accessibility

- Keyboard navigation
- Screen reader support
- ARIA labels
- Focus management
- High contrast support

---

## 🚀 Performance

- Memoized filtering
- Efficient re-renders
- Fast search
- Smooth animations
- Optimized for 500+ accounts

---

## 📞 Support

**Need Help?**
1. Check documentation
2. Review examples
3. Run tests
4. Check troubleshooting guide
5. Contact instructor

---

## ✨ Quick Tips

💡 **Tip 1**: Start with a template to see best practices

💡 **Tip 2**: Use the search function for large COAs

💡 **Tip 3**: Export regularly to save your work

💡 **Tip 4**: Validate before sharing with others

💡 **Tip 5**: Use sub-accounts for detailed tracking

💡 **Tip 6**: Read descriptions for account guidance

💡 **Tip 7**: Check the help panel for learning resources

💡 **Tip 8**: Use consistent numbering (10, 20, 30...)

💡 **Tip 9**: Add meaningful descriptions to all accounts

💡 **Tip 10**: Review the examples page for advanced usage

---

**Version**: 1.0.0 | **Updated**: October 2025 | **Platform**: Accountrix
