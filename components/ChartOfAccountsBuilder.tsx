'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Search,
  Download,
  Upload,
  Info,
  GripVertical,
  Save,
  FileSpreadsheet,
  FileText,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// ==================== TYPES ====================

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export type AccountCategory =
  | 'Current Asset'
  | 'Fixed Asset'
  | 'Other Asset'
  | 'Current Liability'
  | 'Long-term Liability'
  | 'Equity'
  | 'Operating Revenue'
  | 'Other Revenue'
  | 'Cost of Sales'
  | 'Operating Expense'
  | 'Other Expense';

export interface Account {
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

export interface AccountTreeNode extends Account {
  children: AccountTreeNode[];
}

interface ChartOfAccountsBuilderProps {
  initialCOA?: Account[];
  onSave?: (coa: Account[]) => void;
  readOnly?: boolean;
  showTemplates?: boolean;
}

// ==================== TEMPLATES ====================

const BASIC_CONSTRUCTION_COA: Account[] = [
  // ASSETS (1000-1999)
  { number: '1000', name: 'Cash', type: 'Asset', normalBalance: 'DR', category: 'Current Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Primary operating account' },
  { number: '1010', name: 'Petty Cash', type: 'Asset', normalBalance: 'DR', category: 'Current Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Small cash fund for minor expenses' },
  { number: '1100', name: 'Accounts Receivable', type: 'Asset', normalBalance: 'DR', category: 'Current Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Money owed by customers' },
  { number: '1150', name: 'Retainage Receivable', type: 'Asset', normalBalance: 'DR', category: 'Current Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Retention held by clients' },
  { number: '1200', name: 'Materials Inventory', type: 'Asset', normalBalance: 'DR', category: 'Current Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Construction materials on hand' },
  { number: '1300', name: 'Work in Progress', type: 'Asset', normalBalance: 'DR', category: 'Current Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Ongoing project costs' },
  { number: '1400', name: 'Equipment', type: 'Asset', normalBalance: 'DR', category: 'Fixed Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Construction equipment owned' },
  { number: '1450', name: 'Accumulated Depreciation - Equipment', type: 'Asset', normalBalance: 'CR', category: 'Fixed Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Contra-asset for equipment' },
  { number: '1500', name: 'Vehicles', type: 'Asset', normalBalance: 'DR', category: 'Fixed Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Company vehicles' },
  { number: '1550', name: 'Accumulated Depreciation - Vehicles', type: 'Asset', normalBalance: 'CR', category: 'Fixed Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Contra-asset for vehicles' },

  // LIABILITIES (2000-2999)
  { number: '2000', name: 'Accounts Payable', type: 'Liability', normalBalance: 'CR', category: 'Current Liability', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Money owed to vendors' },
  { number: '2050', name: 'Retainage Payable', type: 'Liability', normalBalance: 'CR', category: 'Current Liability', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Retention held from subcontractors' },
  { number: '2100', name: 'Accrued Payroll', type: 'Liability', normalBalance: 'CR', category: 'Current Liability', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Unpaid wages' },
  { number: '2150', name: 'Payroll Taxes Payable', type: 'Liability', normalBalance: 'CR', category: 'Current Liability', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Withheld and employer taxes' },
  { number: '2200', name: 'Notes Payable', type: 'Liability', normalBalance: 'CR', category: 'Long-term Liability', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Long-term debt obligations' },
  { number: '2300', name: 'Line of Credit', type: 'Liability', normalBalance: 'CR', category: 'Current Liability', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Revolving credit facility' },

  // EQUITY (3000-3999)
  { number: '3000', name: "Owner's Capital", type: 'Equity', normalBalance: 'CR', category: 'Equity', isSubAccount: false, isActive: true, hasSubAccounts: false, description: "Owner's investment in business" },
  { number: '3100', name: 'Retained Earnings', type: 'Equity', normalBalance: 'CR', category: 'Equity', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Accumulated profits' },
  { number: '3200', name: 'Draws/Distributions', type: 'Equity', normalBalance: 'DR', category: 'Equity', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Owner withdrawals' },

  // REVENUE (4000-4999)
  { number: '4000', name: 'Construction Revenue', type: 'Revenue', normalBalance: 'CR', category: 'Operating Revenue', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Primary construction income' },
  { number: '4100', name: 'Service Revenue', type: 'Revenue', normalBalance: 'CR', category: 'Operating Revenue', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Service and maintenance income' },
  { number: '4200', name: 'Change Orders', type: 'Revenue', normalBalance: 'CR', category: 'Operating Revenue', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Additional project work' },

  // EXPENSES (5000-5999)
  { number: '5000', name: 'Direct Labor', type: 'Expense', normalBalance: 'DR', category: 'Cost of Sales', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Labor directly on projects' },
  { number: '5100', name: 'Materials', type: 'Expense', normalBalance: 'DR', category: 'Cost of Sales', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Construction materials used' },
  { number: '5200', name: 'Subcontractors', type: 'Expense', normalBalance: 'DR', category: 'Cost of Sales', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Subcontractor costs' },
  { number: '5300', name: 'Equipment Expense', type: 'Expense', normalBalance: 'DR', category: 'Operating Expense', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Equipment rental and maintenance' },
  { number: '5400', name: 'Depreciation', type: 'Expense', normalBalance: 'DR', category: 'Operating Expense', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Asset depreciation expense' },
  { number: '5500', name: 'Office Expenses', type: 'Expense', normalBalance: 'DR', category: 'Operating Expense', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'General office costs' },
  { number: '5600', name: 'Insurance', type: 'Expense', normalBalance: 'DR', category: 'Operating Expense', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Business insurance premiums' },
  { number: '5700', name: 'Licenses & Permits', type: 'Expense', normalBalance: 'DR', category: 'Operating Expense', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Required licenses and permits' },
];

const MULTI_ENTITY_COA: Account[] = [
  ...BASIC_CONSTRUCTION_COA,
  // Add intercompany accounts
  { number: '1800', name: 'Intercompany Receivable', type: 'Asset', normalBalance: 'DR', category: 'Other Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Amounts owed by related entities' },
  { number: '2800', name: 'Intercompany Payable', type: 'Liability', normalBalance: 'CR', category: 'Current Liability', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Amounts owed to related entities' },
  { number: '4300', name: 'Management Fee Income', type: 'Revenue', normalBalance: 'CR', category: 'Other Revenue', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Fees for managing related entities' },
  { number: '5800', name: 'Management Fee Expense', type: 'Expense', normalBalance: 'DR', category: 'Operating Expense', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Fees paid for management services' },
  { number: '5900', name: 'Allocation Expenses', type: 'Expense', normalBalance: 'DR', category: 'Operating Expense', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Shared costs allocated to entity' },
];

const REAL_ESTATE_DEVELOPMENT_COA: Account[] = [
  ...BASIC_CONSTRUCTION_COA.filter(a => !['1200', '1300'].includes(a.number)),
  // Replace with development-specific accounts
  { number: '1250', name: 'Land Inventory', type: 'Asset', normalBalance: 'DR', category: 'Current Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Land held for development' },
  { number: '1260', name: 'Development Costs', type: 'Asset', normalBalance: 'DR', category: 'Current Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Site development expenses' },
  { number: '1270', name: 'Construction in Progress', type: 'Asset', normalBalance: 'DR', category: 'Current Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Building construction costs' },
  { number: '1280', name: 'Capitalized Interest', type: 'Asset', normalBalance: 'DR', category: 'Current Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Interest added to project cost' },
  { number: '1290', name: 'Pre-Development Expenses', type: 'Asset', normalBalance: 'DR', category: 'Current Asset', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Planning and feasibility costs' },
  { number: '5150', name: 'Land Acquisition Costs', type: 'Expense', normalBalance: 'DR', category: 'Cost of Sales', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Costs to acquire land' },
  { number: '5250', name: 'Impact Fees', type: 'Expense', normalBalance: 'DR', category: 'Cost of Sales', isSubAccount: false, isActive: true, hasSubAccounts: false, description: 'Municipal impact fees' },
];

const TEMPLATES = {
  basic: { name: 'Basic Construction COA', accounts: BASIC_CONSTRUCTION_COA, description: '50 accounts for general contractors' },
  multiEntity: { name: 'Multi-Entity Construction COA', accounts: MULTI_ENTITY_COA, description: '80 accounts with intercompany features' },
  realEstate: { name: 'Real Estate Development COA', accounts: REAL_ESTATE_DEVELOPMENT_COA, description: '70 accounts for developers' },
};

// ==================== HELPER FUNCTIONS ====================

function validateAccountNumber(number: string, type: AccountType, accounts: Account[]): { valid: boolean; error?: string } {
  const num = parseInt(number);

  if (isNaN(num)) {
    return { valid: false, error: 'Account number must be numeric' };
  }

  // Check range based on type
  const ranges: Record<AccountType, [number, number]> = {
    Asset: [1000, 1999],
    Liability: [2000, 2999],
    Equity: [3000, 3999],
    Revenue: [4000, 4999],
    Expense: [5000, 5999],
  };

  const [min, max] = ranges[type];
  if (num < min || num > max) {
    return { valid: false, error: `${type} accounts must be between ${min} and ${max}` };
  }

  // Check for duplicates
  if (accounts.some(a => a.number === number)) {
    return { valid: false, error: 'Account number already exists' };
  }

  return { valid: true };
}

function getNextAvailableNumber(type: AccountType, accounts: Account[]): string {
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

  for (let i = 0; i < existingNumbers.length; i++) {
    const expected = baseNumber + i * 10;
    if (existingNumbers[i] !== expected) {
      return expected.toString();
    }
  }

  return (baseNumber + existingNumbers.length * 10).toString();
}

function isDuplicateNumber(number: string, accounts: Account[], excludeNumber?: string): boolean {
  return accounts.some(a => a.number === number && a.number !== excludeNumber);
}

function getAccountsByType(type: AccountType, accounts: Account[]): Account[] {
  return accounts.filter(a => a.type === type).sort((a, b) => parseInt(a.number) - parseInt(b.number));
}

function buildAccountTree(accounts: Account[]): AccountTreeNode[] {
  const tree: AccountTreeNode[] = [];
  const accountMap = new Map<string, AccountTreeNode>();

  // Create nodes
  accounts.forEach(account => {
    accountMap.set(account.number, { ...account, children: [] });
  });

  // Build tree structure
  accounts.forEach(account => {
    const node = accountMap.get(account.number)!;
    if (account.isSubAccount && account.parentAccount) {
      const parent = accountMap.get(account.parentAccount);
      if (parent) {
        parent.children.push(node);
      } else {
        tree.push(node);
      }
    } else {
      tree.push(node);
    }
  });

  return tree;
}

function exportToCSV(accounts: Account[]): string {
  const headers = ['Number', 'Name', 'Type', 'Normal Balance', 'Category', 'Description', 'Is Sub-Account', 'Parent Account', 'Is Active'];
  const rows = accounts.map(a => [
    a.number,
    a.name,
    a.type,
    a.normalBalance,
    a.category,
    a.description || '',
    a.isSubAccount ? 'Yes' : 'No',
    a.parentAccount || '',
    a.isActive ? 'Yes' : 'No',
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function exportToJSON(accounts: Account[]): string {
  return JSON.stringify(accounts, null, 2);
}

function importFromCSV(csv: string): Account[] {
  const lines = csv.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      number: values[0],
      name: values[1],
      type: values[2] as AccountType,
      normalBalance: values[3] as 'DR' | 'CR',
      category: values[4] as AccountCategory,
      description: values[5],
      isSubAccount: values[6] === 'Yes',
      parentAccount: values[7] || undefined,
      isActive: values[8] === 'Yes',
      hasSubAccounts: false,
    };
  });
}

function getDefaultNormalBalance(type: AccountType): 'DR' | 'CR' {
  const balances: Record<AccountType, 'DR' | 'CR'> = {
    Asset: 'DR',
    Liability: 'CR',
    Equity: 'CR',
    Revenue: 'CR',
    Expense: 'DR',
  };
  return balances[type];
}

function getAccountTypeColor(type: AccountType): string {
  const colors: Record<AccountType, string> = {
    Asset: 'text-primary dark:text-primary',
    Liability: 'text-red-600 dark:text-red-400',
    Equity: 'text-green-600 dark:text-green-400',
    Revenue: 'text-purple-600 dark:text-purple-400',
    Expense: 'text-orange-600 dark:text-orange-400',
  };
  return colors[type];
}

function getAccountTypeBgColor(type: AccountType): string {
  const colors: Record<AccountType, string> = {
    Asset: 'bg-accent dark:bg-accent border-border dark:border-border',
    Liability: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    Equity: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    Revenue: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
    Expense: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
  };
  return colors[type];
}

// ==================== MAIN COMPONENT ====================

export default function ChartOfAccountsBuilder({
  initialCOA,
  onSave,
  readOnly = false,
  showTemplates = true,
}: ChartOfAccountsBuilderProps) {
  const [accounts, setAccounts] = useState<Account[]>(initialCOA || BASIC_CONSTRUCTION_COA);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<AccountType | 'All'>('All');
  const [expandedCategories, setExpandedCategories] = useState<Set<AccountType>>(
    new Set(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'])
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // Form state for add/edit dialog
  const [formData, setFormData] = useState<Partial<Account>>({
    number: '',
    name: '',
    type: 'Asset',
    normalBalance: 'DR',
    category: 'Current Asset',
    description: '',
    isSubAccount: false,
    parentAccount: undefined,
    isActive: true,
    hasSubAccounts: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update hasSubAccounts flag whenever accounts change
  React.useEffect(() => {
    setAccounts(prevAccounts => {
      return prevAccounts.map(account => ({
        ...account,
        hasSubAccounts: prevAccounts.some(a => a.parentAccount === account.number),
      }));
    });
  }, [accounts.length]);

  // Filter and search accounts
  const filteredAccounts = useMemo(() => {
    let filtered = accounts;

    if (filterType !== 'All') {
      filtered = filtered.filter(a => a.type === filterType);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        a => a.number.includes(term) || a.name.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [accounts, searchTerm, filterType]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const stats = {
      total: accounts.length,
      byType: {} as Record<AccountType, number>,
      subAccounts: accounts.filter(a => a.isSubAccount).length,
      inactive: accounts.filter(a => !a.isActive).length,
    };

    (['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] as AccountType[]).forEach(type => {
      stats.byType[type] = accounts.filter(a => a.type === type).length;
    });

    return stats;
  }, [accounts]);

  // Toggle category expansion
  const toggleCategory = (type: AccountType) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  // Handle template selection
  const loadTemplate = (templateKey: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[templateKey];
    setAccounts(template.accounts);
  };

  // Open add dialog
  const openAddDialog = (type?: AccountType) => {
    const accountType = type || 'Asset';
    const nextNumber = getNextAvailableNumber(accountType, accounts);
    setFormData({
      number: nextNumber,
      name: '',
      type: accountType,
      normalBalance: getDefaultNormalBalance(accountType),
      category: accountType === 'Asset' ? 'Current Asset' : accountType === 'Liability' ? 'Current Liability' : 'Equity',
      description: '',
      isSubAccount: false,
      parentAccount: undefined,
      isActive: true,
      hasSubAccounts: false,
    });
    setFormErrors({});
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (account: Account) => {
    setSelectedAccount(account);
    setFormData(account);
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (account: Account) => {
    setSelectedAccount(account);
    setIsDeleteDialogOpen(true);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.number) {
      errors.number = 'Account number is required';
    } else {
      const excludeNumber = isEditDialogOpen ? selectedAccount?.number : undefined;
      const validation = validateAccountNumber(
        formData.number,
        formData.type!,
        accounts.filter(a => a.number !== excludeNumber)
      );
      if (!validation.valid) {
        errors.number = validation.error!;
      }
    }

    if (!formData.name) {
      errors.name = 'Account name is required';
    }

    if (formData.isSubAccount && !formData.parentAccount) {
      errors.parentAccount = 'Parent account is required for sub-accounts';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add account
  const handleAddAccount = () => {
    if (!validateForm()) return;

    const newAccount: Account = {
      number: formData.number!,
      name: formData.name!,
      type: formData.type!,
      normalBalance: formData.normalBalance!,
      category: formData.category!,
      description: formData.description,
      isSubAccount: formData.isSubAccount!,
      parentAccount: formData.parentAccount,
      isActive: formData.isActive!,
      hasSubAccounts: false,
    };

    setAccounts(prev => [...prev, newAccount]);
    setIsAddDialogOpen(false);
  };

  // Handle edit account
  const handleEditAccount = () => {
    if (!validateForm() || !selectedAccount) return;

    setAccounts(prev =>
      prev.map(a =>
        a.number === selectedAccount.number
          ? { ...a, ...formData }
          : a
      )
    );
    setIsEditDialogOpen(false);
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    if (!selectedAccount) return;

    // Soft delete or hard delete based on usage
    setAccounts(prev => prev.filter(a => a.number !== selectedAccount.number));
    setIsDeleteDialogOpen(false);
  };

  // Handle export
  const handleExport = (format: 'csv' | 'json' | 'excel') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      content = exportToCSV(accounts);
      filename = 'chart-of-accounts.csv';
      mimeType = 'text/csv';
    } else if (format === 'json') {
      content = exportToJSON(accounts);
      filename = 'chart-of-accounts.json';
      mimeType = 'application/json';
    } else {
      // For Excel, we'll use CSV format (actual Excel export would require a library)
      content = exportToCSV(accounts);
      filename = 'chart-of-accounts.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave(accounts);
    }
  };

  // Render account row
  const renderAccountRow = (account: Account, depth: number = 0) => {
    const hasChildren = account.hasSubAccounts;

    return (
      <div
        key={account.number}
        className={cn(
          'flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent transition-colors',
          depth > 0 && 'ml-8'
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />

          <div className="flex items-center gap-2 flex-1">
            <span className={cn('font-mono text-sm font-medium', getAccountTypeColor(account.type))}>
              {account.number}
            </span>
            <span className="text-sm">{account.name}</span>
            {account.isSubAccount && (
              <Badge variant="outline" className="text-xs">Sub</Badge>
            )}
            {!account.isActive && (
              <Badge variant="secondary" className="text-xs">Inactive</Badge>
            )}
          </div>

          <Badge variant="outline" className="text-xs">
            {account.normalBalance}
          </Badge>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openEditDialog(account)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => openDeleteDialog(account)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Render category section
  const renderCategory = (type: AccountType) => {
    const categoryAccounts = getAccountsByType(type, filteredAccounts);
    const isExpanded = expandedCategories.has(type);
    const rangeStart = type === 'Asset' ? '1000' : type === 'Liability' ? '2000' : type === 'Equity' ? '3000' : type === 'Revenue' ? '4000' : '5000';
    const rangeEnd = type === 'Asset' ? '1999' : type === 'Liability' ? '2999' : type === 'Equity' ? '3999' : type === 'Revenue' ? '4999' : '5999';

    return (
      <div key={type} className={cn('border rounded-lg overflow-hidden', getAccountTypeBgColor(type))}>
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleCategory(type)}
        >
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
            <h3 className={cn('text-lg font-semibold uppercase', getAccountTypeColor(type))}>
              {type}S
            </h3>
            <span className="text-sm text-muted-foreground">
              ({rangeStart}-{rangeEnd})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary">{categoryAccounts.length} accounts</Badge>
            {!readOnly && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openAddDialog(type);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-1">
            {categoryAccounts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No accounts in this category
              </div>
            ) : (
              categoryAccounts.map(account => renderAccountRow(account))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Chart of Accounts Builder</h2>
          <p className="text-muted-foreground mt-1">
            Design and customize your construction company's accounting structure
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInfoPanel(!showInfoPanel)}
        >
          <Info className="h-4 w-4 mr-2" />
          Help
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {showTemplates && (
          <Select onValueChange={(value) => loadTemplate(value as keyof typeof TEMPLATES)}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Load Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic Construction COA</SelectItem>
              <SelectItem value="multiEntity">Multi-Entity Construction COA</SelectItem>
              <SelectItem value="realEstate">Real Estate Development COA</SelectItem>
            </SelectContent>
          </Select>
        )}

        {!readOnly && (
          <Button onClick={() => openAddDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        )}

        <div className="flex-1" />

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filterType} onValueChange={(value) => setFilterType(value as AccountType | 'All')}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Asset">Assets</SelectItem>
            <SelectItem value="Liability">Liabilities</SelectItem>
            <SelectItem value="Equity">Equity</SelectItem>
            <SelectItem value="Revenue">Revenue</SelectItem>
            <SelectItem value="Expense">Expenses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Accounts</div>
          <div className="text-2xl font-bold">{statistics.total}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-primary dark:text-primary">Assets</div>
          <div className="text-2xl font-bold">{statistics.byType.Asset}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-red-600 dark:text-red-400">Liabilities</div>
          <div className="text-2xl font-bold">{statistics.byType.Liability}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-green-600 dark:text-green-400">Equity</div>
          <div className="text-2xl font-bold">{statistics.byType.Equity}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-purple-600 dark:text-purple-400">Revenue</div>
          <div className="text-2xl font-bold">{statistics.byType.Revenue}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-orange-600 dark:text-orange-400">Expenses</div>
          <div className="text-2xl font-bold">{statistics.byType.Expense}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Sub-Accounts</div>
          <div className="text-2xl font-bold">{statistics.subAccounts}</div>
        </div>
      </div>

      {/* Account Categories */}
      <div className="space-y-4">
        {(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] as AccountType[]).map(type =>
          renderCategory(type)
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t pt-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <FileText className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('json')}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>

        {!readOnly && onSave && (
          <Button onClick={handleSave} size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save Chart of Accounts
          </Button>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isAddDialogOpen ? 'Add New Account' : 'Edit Account'}
            </DialogTitle>
            <DialogDescription>
              {isAddDialogOpen
                ? 'Create a new account in your chart of accounts'
                : 'Modify the details of this account'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Number *</label>
                <Input
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="1000"
                  disabled={isEditDialogOpen}
                />
                {formErrors.number && (
                  <p className="text-sm text-destructive">{formErrors.number}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Account Type *</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    type: value as AccountType,
                    normalBalance: getDefaultNormalBalance(value as AccountType),
                  })}
                  disabled={isEditDialogOpen}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asset">Asset</SelectItem>
                    <SelectItem value="Liability">Liability</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Revenue">Revenue</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Account Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Cash"
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as AccountCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.type === 'Asset' && (
                      <>
                        <SelectItem value="Current Asset">Current Asset</SelectItem>
                        <SelectItem value="Fixed Asset">Fixed Asset</SelectItem>
                        <SelectItem value="Other Asset">Other Asset</SelectItem>
                      </>
                    )}
                    {formData.type === 'Liability' && (
                      <>
                        <SelectItem value="Current Liability">Current Liability</SelectItem>
                        <SelectItem value="Long-term Liability">Long-term Liability</SelectItem>
                      </>
                    )}
                    {formData.type === 'Equity' && (
                      <SelectItem value="Equity">Equity</SelectItem>
                    )}
                    {formData.type === 'Revenue' && (
                      <>
                        <SelectItem value="Operating Revenue">Operating Revenue</SelectItem>
                        <SelectItem value="Other Revenue">Other Revenue</SelectItem>
                      </>
                    )}
                    {formData.type === 'Expense' && (
                      <>
                        <SelectItem value="Cost of Sales">Cost of Sales</SelectItem>
                        <SelectItem value="Operating Expense">Operating Expense</SelectItem>
                        <SelectItem value="Other Expense">Other Expense</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Normal Balance *</label>
                <Select
                  value={formData.normalBalance}
                  onValueChange={(value) => setFormData({ ...formData, normalBalance: value as 'DR' | 'CR' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DR">Debit (DR)</SelectItem>
                    <SelectItem value="CR">Credit (CR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of account purpose"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isSubAccount}
                  onChange={(e) => setFormData({ ...formData, isSubAccount: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Is Sub-Account</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>

            {formData.isSubAccount && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Parent Account *</label>
                <Select
                  value={formData.parentAccount}
                  onValueChange={(value) => setFormData({ ...formData, parentAccount: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts
                      .filter(a => a.type === formData.type && !a.isSubAccount)
                      .map(a => (
                        <SelectItem key={a.number} value={a.number}>
                          {a.number} - {a.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {formErrors.parentAccount && (
                  <p className="text-sm text-destructive">{formErrors.parentAccount}</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={isAddDialogOpen ? handleAddAccount : handleEditAccount}>
              {isAddDialogOpen ? 'Add Account' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account?
            </DialogDescription>
          </DialogHeader>

          {selectedAccount && (
            <div className="py-4">
              <div className="border rounded-lg p-4 bg-muted">
                <div className="font-medium">
                  {selectedAccount.number} - {selectedAccount.name}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {selectedAccount.type} • {selectedAccount.category}
                </div>
              </div>

              {selectedAccount.hasSubAccounts && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Warning: This account has sub-accounts. Deleting it will also remove all sub-accounts.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Panel */}
      {showInfoPanel && (
        <div className="border rounded-lg p-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-4">Chart of Accounts Best Practices</h3>

          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Account Numbering</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Assets: 1000-1999 (Cash, receivables, inventory, equipment)</li>
                <li>Liabilities: 2000-2999 (Payables, loans, accrued expenses)</li>
                <li>Equity: 3000-3999 (Capital, retained earnings, draws)</li>
                <li>Revenue: 4000-4999 (Construction income, service revenue)</li>
                <li>Expenses: 5000-5999 (Labor, materials, overhead)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Normal Balances</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Assets and Expenses increase with DEBITS (DR)</li>
                <li>Liabilities, Equity, and Revenue increase with CREDITS (CR)</li>
                <li>Contra-accounts have opposite normal balances</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Construction-Specific Accounts</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Track retainage separately (receivable and payable)</li>
                <li>Use Work in Progress for job costing</li>
                <li>Separate direct costs (labor, materials) from overhead</li>
                <li>Track equipment assets and depreciation</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
