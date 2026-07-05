'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Save,
  FileDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

type AccountCategory = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

interface Account {
  id: string;
  name: string;
  category: AccountCategory;
  debit: number;
  credit: number;
}

interface AdjustingEntry {
  id: string;
  description: string;
  accountName: string;
  debitAdjustment: number;
  creditAdjustment: number;
}

interface TrialBalance {
  accounts: Account[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  difference: number;
}

interface PracticeScenario {
  id: string;
  name: string;
  description: string;
  accounts: Account[];
  hasError?: boolean;
  errorType?: string;
  hint?: string;
}

// ============================================================================
// PRACTICE SCENARIOS
// ============================================================================

const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: 'scenario-1',
    name: 'Balanced Trial Balance',
    description: 'A perfectly balanced trial balance with 15 accounts',
    accounts: [
      { id: '1', name: 'Cash', category: 'Asset', debit: 25000, credit: 0 },
      { id: '2', name: 'Accounts Receivable', category: 'Asset', debit: 15000, credit: 0 },
      { id: '3', name: 'Inventory', category: 'Asset', debit: 30000, credit: 0 },
      { id: '4', name: 'Equipment', category: 'Asset', debit: 50000, credit: 0 },
      { id: '5', name: 'Accumulated Depreciation', category: 'Asset', debit: 0, credit: 10000 },
      { id: '6', name: 'Accounts Payable', category: 'Liability', debit: 0, credit: 18000 },
      { id: '7', name: 'Notes Payable', category: 'Liability', debit: 0, credit: 25000 },
      { id: '8', name: 'Common Stock', category: 'Equity', debit: 0, credit: 40000 },
      { id: '9', name: 'Retained Earnings', category: 'Equity', debit: 0, credit: 12000 },
      { id: '10', name: 'Service Revenue', category: 'Revenue', debit: 0, credit: 75000 },
      { id: '11', name: 'Sales Revenue', category: 'Revenue', debit: 0, credit: 30000 },
      { id: '12', name: 'Salaries Expense', category: 'Expense', debit: 45000, credit: 0 },
      { id: '13', name: 'Rent Expense', category: 'Expense', debit: 24000, credit: 0 },
      { id: '14', name: 'Utilities Expense', category: 'Expense', debit: 8000, credit: 0 },
      { id: '15', name: 'Supplies Expense', category: 'Expense', debit: 13000, credit: 0 },
    ],
    hasError: false,
  },
  {
    id: 'scenario-2',
    name: 'Transposition Error',
    description: 'Find the transposition error: $1,450 recorded as $1,540',
    accounts: [
      { id: '1', name: 'Cash', category: 'Asset', debit: 20000, credit: 0 },
      { id: '2', name: 'Accounts Receivable', category: 'Asset', debit: 12000, credit: 0 },
      { id: '3', name: 'Supplies', category: 'Asset', debit: 1540, credit: 0 }, // Should be 1450
      { id: '4', name: 'Equipment', category: 'Asset', debit: 35000, credit: 0 },
      { id: '5', name: 'Accounts Payable', category: 'Liability', debit: 0, credit: 15000 },
      { id: '6', name: 'Notes Payable', category: 'Liability', debit: 0, credit: 20000 },
      { id: '7', name: 'Common Stock', category: 'Equity', debit: 0, credit: 25000 },
      { id: '8', name: 'Retained Earnings', category: 'Equity', debit: 0, credit: 5000 },
      { id: '9', name: 'Service Revenue', category: 'Revenue', debit: 0, credit: 40000 },
      { id: '10', name: 'Salaries Expense', category: 'Expense', debit: 25000, credit: 0 },
      { id: '11', name: 'Rent Expense', category: 'Expense', debit: 10000, credit: 0 },
      { id: '12', name: 'Utilities Expense', category: 'Expense', debit: 1460, credit: 0 },
    ],
    hasError: true,
    errorType: 'transposition',
    hint: 'Check the Supplies account - digits may be reversed',
  },
  {
    id: 'scenario-3',
    name: 'Wrong Column Error',
    description: 'An account has been placed in the wrong column',
    accounts: [
      { id: '1', name: 'Cash', category: 'Asset', debit: 18000, credit: 0 },
      { id: '2', name: 'Accounts Receivable', category: 'Asset', debit: 9000, credit: 0 },
      { id: '3', name: 'Prepaid Insurance', category: 'Asset', debit: 3000, credit: 0 },
      { id: '4', name: 'Equipment', category: 'Asset', debit: 25000, credit: 0 },
      { id: '5', name: 'Accounts Payable', category: 'Liability', debit: 8000, credit: 0 }, // Wrong column!
      { id: '6', name: 'Salaries Payable', category: 'Liability', debit: 0, credit: 4000 },
      { id: '7', name: 'Common Stock', category: 'Equity', debit: 0, credit: 20000 },
      { id: '8', name: 'Retained Earnings', category: 'Equity', debit: 0, credit: 7000 },
      { id: '9', name: 'Service Revenue', category: 'Revenue', debit: 0, credit: 35000 },
      { id: '10', name: 'Salaries Expense', category: 'Expense', debit: 15000, credit: 0 },
      { id: '11', name: 'Rent Expense', category: 'Expense', debit: 6000, credit: 0 },
      { id: '12', name: 'Insurance Expense', category: 'Expense', debit: 2000, credit: 0 },
    ],
    hasError: true,
    errorType: 'wrong_column',
    hint: 'Accounts Payable should normally have a credit balance',
  },
  {
    id: 'scenario-4',
    name: 'Missing Account',
    description: 'A liability account is missing from the trial balance',
    accounts: [
      { id: '1', name: 'Cash', category: 'Asset', debit: 22000, credit: 0 },
      { id: '2', name: 'Accounts Receivable', category: 'Asset', debit: 14000, credit: 0 },
      { id: '3', name: 'Inventory', category: 'Asset', debit: 18000, credit: 0 },
      { id: '4', name: 'Equipment', category: 'Asset', debit: 40000, credit: 0 },
      // Missing: Unearned Revenue (Liability) $6,000 CR
      { id: '5', name: 'Accounts Payable', category: 'Liability', debit: 0, credit: 12000 },
      { id: '6', name: 'Common Stock', category: 'Equity', debit: 0, credit: 30000 },
      { id: '7', name: 'Retained Earnings', category: 'Equity', debit: 0, credit: 8000 },
      { id: '8', name: 'Service Revenue', category: 'Revenue', debit: 0, credit: 50000 },
      { id: '9', name: 'Cost of Goods Sold', category: 'Expense', debit: 20000, credit: 0 },
      { id: '10', name: 'Salaries Expense', category: 'Expense', debit: 18000, credit: 0 },
      { id: '11', name: 'Rent Expense', category: 'Expense', debit: 12000, credit: 0 },
      { id: '12', name: 'Advertising Expense', category: 'Expense', debit: 4000, credit: 0 },
    ],
    hasError: true,
    errorType: 'missing_account',
    hint: 'Check if all liability accounts are included. Unearned Revenue ($6,000) may be missing.',
  },
  {
    id: 'scenario-5',
    name: 'Adjusting Entries Practice',
    description: 'Balanced TB that needs adjusting entries',
    accounts: [
      { id: '1', name: 'Cash', category: 'Asset', debit: 15000, credit: 0 },
      { id: '2', name: 'Accounts Receivable', category: 'Asset', debit: 8000, credit: 0 },
      { id: '3', name: 'Prepaid Insurance', category: 'Asset', debit: 12000, credit: 0 },
      { id: '4', name: 'Supplies', category: 'Asset', debit: 3000, credit: 0 },
      { id: '5', name: 'Equipment', category: 'Asset', debit: 30000, credit: 0 },
      { id: '6', name: 'Accumulated Depreciation', category: 'Asset', debit: 0, credit: 5000 },
      { id: '7', name: 'Accounts Payable', category: 'Liability', debit: 0, credit: 10000 },
      { id: '8', name: 'Unearned Revenue', category: 'Liability', debit: 0, credit: 6000 },
      { id: '9', name: 'Common Stock', category: 'Equity', debit: 0, credit: 25000 },
      { id: '10', name: 'Retained Earnings', category: 'Equity', debit: 0, credit: 8000 },
      { id: '11', name: 'Service Revenue', category: 'Revenue', debit: 0, credit: 35000 },
      { id: '12', name: 'Salaries Expense', category: 'Expense', debit: 18000, credit: 0 },
      { id: '13', name: 'Rent Expense', category: 'Expense', debit: 8000, credit: 0 },
    ],
    hasError: false,
    hint: 'Consider: Insurance expired ($2,000), Supplies used ($1,500), Depreciation ($500), Revenue earned ($2,000)',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
}

function categorizeBySuggestion(accountName: string): AccountCategory {
  const name = accountName.toLowerCase();

  // Assets
  if (name.includes('cash') || name.includes('receivable') || name.includes('inventory') ||
      name.includes('prepaid') || name.includes('supplies') || name.includes('equipment') ||
      name.includes('building') || name.includes('land') || name.includes('vehicle')) {
    return 'Asset';
  }

  // Liabilities
  if (name.includes('payable') || name.includes('unearned') || name.includes('notes payable') ||
      name.includes('loan') || name.includes('mortgage')) {
    return 'Liability';
  }

  // Equity
  if (name.includes('stock') || name.includes('capital') || name.includes('retained') ||
      name.includes('drawings') || name.includes('dividends')) {
    return 'Equity';
  }

  // Revenue
  if (name.includes('revenue') || name.includes('sales') || name.includes('income') ||
      name.includes('fees earned')) {
    return 'Revenue';
  }

  // Expenses (default)
  if (name.includes('expense') || name.includes('cost')) {
    return 'Expense';
  }

  return 'Expense'; // Default
}

function detectErrorType(difference: number, accounts: Account[]): string[] {
  const suggestions: string[] = [];

  if (difference === 0) {
    return ['Trial balance is perfectly balanced!'];
  }

  // Check if difference is divisible by 9 (transposition error)
  if (difference % 9 === 0) {
    suggestions.push('Possible transposition error detected (digits reversed)');
  }

  // Check if any single account equals the difference
  const matchingAccount = accounts.find(
    acc => Math.abs(acc.debit - acc.credit) === Math.abs(difference)
  );
  if (matchingAccount) {
    suggestions.push(`Check ${matchingAccount.name} - it might be in the wrong column`);
  }

  // Check for accounts with unusual balances for their category
  accounts.forEach(acc => {
    if (acc.category === 'Asset' && acc.credit > acc.debit && acc.name !== 'Accumulated Depreciation') {
      suggestions.push(`${acc.name} (Asset) has a credit balance - verify if correct`);
    }
    if ((acc.category === 'Liability' || acc.category === 'Revenue' || acc.category === 'Equity') &&
        acc.debit > acc.credit) {
      suggestions.push(`${acc.name} may be in the wrong column`);
    }
  });

  if (suggestions.length === 0) {
    suggestions.push('Review all account balances for accuracy');
    suggestions.push('Check if any accounts are missing');
    suggestions.push('Verify decimal points and commas');
  }

  return suggestions;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TrialBalanceWorksheet() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [adjustingEntries, setAdjustingEntries] = useState<AdjustingEntry[]>([]);
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [showAdjusted, setShowAdjusted] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [sortBy, setSortBy] = useState<'category' | 'name'>('category');
  const [inputMode, setInputMode] = useState<'manual' | 'scenario'>('manual');

  // Initialize with empty account
  useEffect(() => {
    if (accounts.length === 0 && inputMode === 'manual') {
      addNewAccount();
    }
  }, [inputMode]);

  // Calculate trial balance
  const trialBalance: TrialBalance = useMemo(() => {
    const totalDebits = accounts.reduce((sum, acc) => sum + acc.debit, 0);
    const totalCredits = accounts.reduce((sum, acc) => sum + acc.credit, 0);
    const difference = totalDebits - totalCredits;

    return {
      accounts,
      totalDebits,
      totalCredits,
      isBalanced: Math.abs(difference) < 0.01,
      difference,
    };
  }, [accounts]);

  // Calculate adjusted trial balance
  const adjustedTrialBalance: TrialBalance = useMemo(() => {
    if (!showAdjusted || adjustingEntries.length === 0) {
      return trialBalance;
    }

    const adjustedAccounts = accounts.map(acc => {
      const adjustments = adjustingEntries.filter(adj => adj.accountName === acc.name);
      const totalDebitAdj = adjustments.reduce((sum, adj) => sum + adj.debitAdjustment, 0);
      const totalCreditAdj = adjustments.reduce((sum, adj) => sum + adj.creditAdjustment, 0);

      return {
        ...acc,
        debit: acc.debit + totalDebitAdj,
        credit: acc.credit + totalCreditAdj,
      };
    });

    // Add new accounts from adjusting entries
    adjustingEntries.forEach(entry => {
      if (!adjustedAccounts.find(acc => acc.name === entry.accountName)) {
        adjustedAccounts.push({
          id: generateId(),
          name: entry.accountName,
          category: categorizeBySuggestion(entry.accountName),
          debit: entry.debitAdjustment,
          credit: entry.creditAdjustment,
        });
      }
    });

    const totalDebits = adjustedAccounts.reduce((sum, acc) => sum + acc.debit, 0);
    const totalCredits = adjustedAccounts.reduce((sum, acc) => sum + acc.credit, 0);
    const difference = totalDebits - totalCredits;

    return {
      accounts: adjustedAccounts,
      totalDebits,
      totalCredits,
      isBalanced: Math.abs(difference) < 0.01,
      difference,
    };
  }, [accounts, adjustingEntries, showAdjusted, trialBalance]);

  const currentBalance = showAdjusted ? adjustedTrialBalance : trialBalance;
  const errorSuggestions = detectErrorType(currentBalance.difference, currentBalance.accounts);

  // Sorted accounts
  const sortedAccounts = useMemo(() => {
    const accountsToSort = [...currentBalance.accounts];

    if (sortBy === 'category') {
      const categoryOrder: Record<AccountCategory, number> = {
        Asset: 1,
        Liability: 2,
        Equity: 3,
        Revenue: 4,
        Expense: 5,
      };
      return accountsToSort.sort((a, b) => {
        const catDiff = categoryOrder[a.category] - categoryOrder[b.category];
        if (catDiff !== 0) return catDiff;
        return a.name.localeCompare(b.name);
      });
    } else {
      return accountsToSort.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [currentBalance.accounts, sortBy]);

  // Group by category
  const groupedAccounts = useMemo(() => {
    const groups: Record<AccountCategory, Account[]> = {
      Asset: [],
      Liability: [],
      Equity: [],
      Revenue: [],
      Expense: [],
    };

    sortedAccounts.forEach(acc => {
      groups[acc.category].push(acc);
    });

    return groups;
  }, [sortedAccounts]);

  // Handlers
  const addNewAccount = () => {
    const newAccount: Account = {
      id: generateId(),
      name: '',
      category: 'Asset',
      debit: 0,
      credit: 0,
    };
    setAccounts([...accounts, newAccount]);
  };

  const updateAccount = (id: string, field: keyof Account, value: any) => {
    setAccounts(accounts.map(acc =>
      acc.id === id ? { ...acc, [field]: value } : acc
    ));
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const loadScenario = (scenarioId: string) => {
    const scenario = PRACTICE_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setAccounts([...scenario.accounts]);
      setSelectedScenario(scenarioId);
      setAdjustingEntries([]);
      setShowAdjusted(false);
      setShowAdjustments(false);
    }
  };

  const resetWorksheet = () => {
    setAccounts([]);
    setAdjustingEntries([]);
    setShowAdjustments(false);
    setShowAdjusted(false);
    setSelectedScenario('');
    if (inputMode === 'manual') {
      addNewAccount();
    }
  };

  const addAdjustingEntry = () => {
    const newEntry: AdjustingEntry = {
      id: generateId(),
      description: '',
      accountName: '',
      debitAdjustment: 0,
      creditAdjustment: 0,
    };
    setAdjustingEntries([...adjustingEntries, newEntry]);
  };

  const updateAdjustingEntry = (id: string, field: keyof AdjustingEntry, value: any) => {
    setAdjustingEntries(adjustingEntries.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const deleteAdjustingEntry = (id: string) => {
    setAdjustingEntries(adjustingEntries.filter(entry => entry.id !== id));
  };

  const exportToCSV = () => {
    let csv = 'Account Name,Category,Debit,Credit\n';
    currentBalance.accounts.forEach(acc => {
      csv += `${acc.name},${acc.category},${acc.debit},${acc.credit}\n`;
    });
    csv += `\nTotals,,${currentBalance.totalDebits},${currentBalance.totalCredits}\n`;
    csv += `Difference,,${currentBalance.difference}\n`;
    csv += `Status,,${currentBalance.isBalanced ? 'Balanced' : 'Unbalanced'}\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trial-balance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const exportToPDF = () => {
    const rows = currentBalance.accounts
      .map(
        (acc) => `
          <tr>
            <td>${escapeHtml(acc.name)}</td>
            <td>${escapeHtml(acc.category)}</td>
            <td class="num">${acc.debit ? formatCurrency(acc.debit) : ''}</td>
            <td class="num">${acc.credit ? formatCurrency(acc.credit) : ''}</td>
          </tr>`
      )
      .join('');
    const html = `
      <!doctype html>
      <html>
        <head>
          <title>Trial Balance Worksheet</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 32px; color: #111827; }
            h1 { margin: 0 0 4px; font-size: 24px; }
            .meta { color: #6b7280; margin-bottom: 20px; font-size: 12px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #d1d5db; padding: 8px; font-size: 12px; }
            th { background: #f3f4f6; text-align: left; }
            .num { text-align: right; font-variant-numeric: tabular-nums; }
            .totals td { font-weight: 700; background: #f9fafb; }
            .status { margin-top: 14px; font-weight: 700; }
            .balanced { color: #047857; }
            .unbalanced { color: #b91c1c; }
            @media print { button { display: none; } body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>Trial Balance Worksheet</h1>
          <div class="meta">Generated ${escapeHtml(new Date().toLocaleString())}</div>
          <table>
            <thead>
              <tr><th>Account</th><th>Category</th><th>Debit</th><th>Credit</th></tr>
            </thead>
            <tbody>
              ${rows}
              <tr class="totals">
                <td colspan="2">Totals</td>
                <td class="num">${formatCurrency(currentBalance.totalDebits)}</td>
                <td class="num">${formatCurrency(currentBalance.totalCredits)}</td>
              </tr>
              <tr class="totals">
                <td colspan="2">Difference</td>
                <td colspan="2" class="num">${formatCurrency(Math.abs(currentBalance.difference))}</td>
              </tr>
            </tbody>
          </table>
          <div class="status ${currentBalance.isBalanced ? 'balanced' : 'unbalanced'}">
            Status: ${currentBalance.isBalanced ? 'Balanced' : 'Unbalanced'}
          </div>
          <script>window.addEventListener('load', () => window.print());</script>
        </body>
      </html>`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.opener = null;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const selectedScenarioData = PRACTICE_SCENARIOS.find(s => s.id === selectedScenario);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Trial Balance Worksheet</CardTitle>
          <CardDescription>
            Practice creating and analyzing trial balances. Choose a scenario or create your own.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Mode Toggle */}
          <div className="flex gap-4 items-center">
            <label className="font-semibold">Input Mode:</label>
            <div className="flex gap-2">
              <Button
                variant={inputMode === 'manual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setInputMode('manual');
                  resetWorksheet();
                }}
              >
                Manual Entry
              </Button>
              <Button
                variant={inputMode === 'scenario' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('scenario')}
              >
                Load Scenario
              </Button>
            </div>
          </div>

          {/* Scenario Selector */}
          {inputMode === 'scenario' && (
            <div className="flex gap-4 items-center">
              <label className="font-semibold min-w-[120px]">Select Scenario:</label>
              <Select value={selectedScenario} onValueChange={loadScenario}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a practice scenario..." />
                </SelectTrigger>
                <SelectContent>
                  {PRACTICE_SCENARIOS.map(scenario => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Scenario Description */}
          {selectedScenarioData && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium mb-1">{selectedScenarioData.description}</p>
              {selectedScenarioData.hint && (
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Hint:</strong> {selectedScenarioData.hint}
                </p>
              )}
            </div>
          )}

          {/* Sort Options */}
          <div className="flex gap-4 items-center">
            <label className="font-semibold">Sort By:</label>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'category' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('category')}
              >
                Category
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('name')}
              >
                Name
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {inputMode === 'manual' && (
              <Button onClick={addNewAccount} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            )}
            <Button onClick={resetWorksheet} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={() => setShowAdjustments(!showAdjustments)} size="sm" variant="outline">
              <Save className="h-4 w-4 mr-2" />
              {showAdjustments ? 'Hide' : 'Show'} Adjustments
            </Button>
            <Button onClick={exportToCSV} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={exportToPDF} size="sm" variant="outline">
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Balance Status Card */}
      <Card className={cn(
        'border-2',
        currentBalance.isBalanced
          ? 'border-green-500 bg-green-50 dark:bg-green-950'
          : 'border-red-500 bg-red-50 dark:bg-red-950'
      )}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            {currentBalance.isBalanced ? (
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold">
                {currentBalance.isBalanced ? 'Trial Balance is Balanced!' : 'Trial Balance is NOT Balanced'}
              </h3>
              {!currentBalance.isBalanced && (
                <p className="text-sm mt-1">
                  Your trial balance is off by ${formatCurrency(Math.abs(currentBalance.difference))}
                  {currentBalance.difference > 0 ? ' (Debits exceed Credits)' : ' (Credits exceed Debits)'}
                </p>
              )}
            </div>
            <Badge
              variant={currentBalance.isBalanced ? 'default' : 'destructive'}
              className="text-lg px-4 py-2"
            >
              {currentBalance.isBalanced ? 'Balanced' : 'Unbalanced'}
            </Badge>
          </div>

          {/* Error Suggestions */}
          {!currentBalance.isBalanced && errorSuggestions.length > 0 && (
            <div className="mt-4 pl-12">
              <p className="font-semibold text-sm mb-2">Suggestions:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {errorSuggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trial Balance Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {showAdjusted ? 'Adjusted Trial Balance' : 'Unadjusted Trial Balance'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 font-bold">Account Name</th>
                  <th className="text-left p-3 font-bold">Category</th>
                  <th className="text-right p-3 font-bold font-mono">Debit</th>
                  <th className="text-right p-3 font-bold font-mono">Credit</th>
                  {inputMode === 'manual' && !showAdjusted && (
                    <th className="text-center p-3 font-bold">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sortBy === 'category' ? (
                  // Grouped by category
                  Object.entries(groupedAccounts).map(([category, categoryAccounts]) => (
                    categoryAccounts.length > 0 && (
                      <React.Fragment key={category}>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                          <td colSpan={inputMode === 'manual' && !showAdjusted ? 5 : 4} className="p-2 font-bold">
                            {category}
                          </td>
                        </tr>
                        {categoryAccounts.map(account => (
                          <AccountRow
                            key={account.id}
                            account={account}
                            onUpdate={updateAccount}
                            onDelete={deleteAccount}
                            isEditable={inputMode === 'manual' && !showAdjusted}
                          />
                        ))}
                      </React.Fragment>
                    )
                  ))
                ) : (
                  // Sorted by name
                  sortedAccounts.map(account => (
                    <AccountRow
                      key={account.id}
                      account={account}
                      onUpdate={updateAccount}
                      onDelete={deleteAccount}
                      isEditable={inputMode === 'manual' && !showAdjusted}
                    />
                  ))
                )}

                {/* Totals Row */}
                <tr className="border-t-4 border-gray-800 font-bold bg-gray-50 dark:bg-gray-900">
                  <td className="p-3">TOTALS</td>
                  <td className="p-3"></td>
                  <td className="text-right p-3 font-mono text-lg">
                    ${formatCurrency(currentBalance.totalDebits)}
                  </td>
                  <td className="text-right p-3 font-mono text-lg">
                    ${formatCurrency(currentBalance.totalCredits)}
                  </td>
                  {inputMode === 'manual' && !showAdjusted && <td></td>}
                </tr>

                {/* Difference Row */}
                {!currentBalance.isBalanced && (
                  <tr className="border-t-2 border-red-500 bg-red-50 dark:bg-red-950">
                    <td className="p-3 font-bold">DIFFERENCE</td>
                    <td className="p-3"></td>
                    <td className="text-right p-3 font-mono font-bold text-red-600 dark:text-red-400">
                      {currentBalance.difference > 0 && `$${formatCurrency(currentBalance.difference)}`}
                    </td>
                    <td className="text-right p-3 font-mono font-bold text-red-600 dark:text-red-400">
                      {currentBalance.difference < 0 && `$${formatCurrency(Math.abs(currentBalance.difference))}`}
                    </td>
                    {inputMode === 'manual' && !showAdjusted && <td></td>}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Adjusting Entries Section */}
      {showAdjustments && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle>Adjusting Entries</CardTitle>
            <CardDescription>
              Add adjusting entries to create an adjusted trial balance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left p-3 font-bold">Description</th>
                    <th className="text-left p-3 font-bold">Account Name</th>
                    <th className="text-right p-3 font-bold font-mono">Debit</th>
                    <th className="text-right p-3 font-bold font-mono">Credit</th>
                    <th className="text-center p-3 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adjustingEntries.map(entry => (
                    <AdjustingEntryRow
                      key={entry.id}
                      entry={entry}
                      onUpdate={updateAdjustingEntry}
                      onDelete={deleteAdjustingEntry}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2">
              <Button onClick={addAdjustingEntry} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Adjusting Entry
              </Button>
              <Button
                onClick={() => setShowAdjusted(!showAdjusted)}
                size="sm"
                disabled={adjustingEntries.length === 0}
              >
                {showAdjusted ? 'Show Unadjusted' : 'Generate Adjusted Trial Balance'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface AccountRowProps {
  account: Account;
  onUpdate: (id: string, field: keyof Account, value: any) => void;
  onDelete: (id: string) => void;
  isEditable: boolean;
}

function AccountRow({ account, onUpdate, onDelete, isEditable }: AccountRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900">
      <td className="p-3">
        {isEditable ? (
          <Input
            value={account.name}
            onChange={(e) => {
              const newName = e.target.value;
              onUpdate(account.id, 'name', newName);
              // Auto-categorize on name change
              if (newName.length > 2) {
                onUpdate(account.id, 'category', categorizeBySuggestion(newName));
              }
            }}
            placeholder="Account name"
            className="min-w-[200px]"
          />
        ) : (
          <span>{account.name}</span>
        )}
      </td>
      <td className="p-3">
        {isEditable ? (
          <Select
            value={account.category}
            onValueChange={(value) => onUpdate(account.id, 'category', value)}
          >
            <SelectTrigger className="w-[140px]">
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
        ) : (
          <Badge variant="outline">{account.category}</Badge>
        )}
      </td>
      <td className="p-3 text-right">
        {isEditable ? (
          <Input
            type="number"
            value={account.debit || ''}
            onChange={(e) => onUpdate(account.id, 'debit', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="text-right font-mono w-[120px] ml-auto"
            step="0.01"
            min="0"
          />
        ) : (
          <span className="font-mono">
            {account.debit > 0 ? `$${formatCurrency(account.debit)}` : ''}
          </span>
        )}
      </td>
      <td className="p-3 text-right">
        {isEditable ? (
          <Input
            type="number"
            value={account.credit || ''}
            onChange={(e) => onUpdate(account.id, 'credit', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="text-right font-mono w-[120px] ml-auto"
            step="0.01"
            min="0"
          />
        ) : (
          <span className="font-mono">
            {account.credit > 0 ? `$${formatCurrency(account.credit)}` : ''}
          </span>
        )}
      </td>
      {isEditable && (
        <td className="p-3 text-center">
          <Button
            onClick={() => onDelete(account.id)}
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </td>
      )}
    </tr>
  );
}

interface AdjustingEntryRowProps {
  entry: AdjustingEntry;
  onUpdate: (id: string, field: keyof AdjustingEntry, value: any) => void;
  onDelete: (id: string) => void;
}

function AdjustingEntryRow({ entry, onUpdate, onDelete }: AdjustingEntryRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900">
      <td className="p-3">
        <Input
          value={entry.description}
          onChange={(e) => onUpdate(entry.id, 'description', e.target.value)}
          placeholder="Description (e.g., Insurance expired)"
          className="min-w-[200px]"
        />
      </td>
      <td className="p-3">
        <Input
          value={entry.accountName}
          onChange={(e) => onUpdate(entry.id, 'accountName', e.target.value)}
          placeholder="Account name"
          className="min-w-[180px]"
        />
      </td>
      <td className="p-3 text-right">
        <Input
          type="number"
          value={entry.debitAdjustment || ''}
          onChange={(e) => onUpdate(entry.id, 'debitAdjustment', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          className="text-right font-mono w-[120px] ml-auto"
          step="0.01"
          min="0"
        />
      </td>
      <td className="p-3 text-right">
        <Input
          type="number"
          value={entry.creditAdjustment || ''}
          onChange={(e) => onUpdate(entry.id, 'creditAdjustment', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          className="text-right font-mono w-[120px] ml-auto"
          step="0.01"
          min="0"
        />
      </td>
      <td className="p-3 text-center">
        <Button
          onClick={() => onDelete(entry.id)}
          size="sm"
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}
