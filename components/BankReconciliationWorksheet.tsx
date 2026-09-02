'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, XCircle, AlertCircle, Download, FileText } from 'lucide-react';

// TypeScript Types
interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'check' | 'deposit' | 'fee' | 'interest' | 'error' | 'other';
  category: 'outstanding' | 'transit' | 'bankError' | 'bookError' | 'uncategorized';
}

interface BankReconciliation {
  bookBalance: number;
  bankBalance: number;
  transactions: Transaction[];
  adjustedBookBalance: number;
  adjustedBankBalance: number;
  isReconciled: boolean;
}

interface JournalEntry {
  date: string;
  account: string;
  debit: number;
  credit: number;
}

interface PracticeScenario {
  id: string;
  name: string;
  difficulty: 'Simple' | 'Medium' | 'Hard' | 'Expert';
  bookBalance: number;
  bankBalance: number;
  transactions: Omit<Transaction, 'category'>[];
  description: string;
}

// Practice Scenarios
const practiceScenarios: PracticeScenario[] = [
  {
    id: 'scenario-1',
    name: 'Basic Reconciliation',
    difficulty: 'Simple',
    bookBalance: 10500,
    bankBalance: 12000,
    description: 'Two outstanding checks and one deposit in transit',
    transactions: [
      { id: 't1', description: 'Check #1234 to ABC Supplier', amount: 500, type: 'check' },
      { id: 't2', description: 'Check #1235 to XYZ Vendor', amount: 1000, type: 'check' },
      { id: 't3', description: 'Deposit from Customer', amount: 2000, type: 'deposit' },
    ],
  },
  {
    id: 'scenario-2',
    name: 'Bank Fees & Interest',
    difficulty: 'Medium',
    bookBalance: 8500,
    bankBalance: 7850,
    description: 'Outstanding checks, bank service charge, and interest earned',
    transactions: [
      { id: 't1', description: 'Check #5001 to Office Supplies', amount: 350, type: 'check' },
      { id: 't2', description: 'Check #5002 to Utilities', amount: 225, type: 'check' },
      { id: 't3', description: 'Deposit in Transit', amount: 1500, type: 'deposit' },
      { id: 't4', description: 'Bank Service Charge', amount: 30, type: 'fee' },
      { id: 't5', description: 'Interest Earned', amount: 45, type: 'interest' },
    ],
  },
  {
    id: 'scenario-3',
    name: 'NSF Check Situation',
    difficulty: 'Hard',
    bookBalance: 15750,
    bankBalance: 14200,
    description: 'Includes NSF check, bank fees, and outstanding items',
    transactions: [
      { id: 't1', description: 'Check #2001 to Rent', amount: 2000, type: 'check' },
      { id: 't2', description: 'Check #2002 to Insurance', amount: 450, type: 'check' },
      { id: 't3', description: 'Deposit in Transit', amount: 3500, type: 'deposit' },
      { id: 't4', description: 'NSF Check from Customer', amount: 600, type: 'error' },
      { id: 't5', description: 'NSF Fee', amount: 25, type: 'fee' },
      { id: 't6', description: 'Bank Service Charge', amount: 35, type: 'fee' },
    ],
  },
  {
    id: 'scenario-4',
    name: 'Bank Error Discovered',
    difficulty: 'Hard',
    bookBalance: 22500,
    bankBalance: 21300,
    description: 'Bank incorrectly charged another company\'s check',
    transactions: [
      { id: 't1', description: 'Check #3001 Outstanding', amount: 800, type: 'check' },
      { id: 't2', description: 'Deposit in Transit', amount: 2500, type: 'deposit' },
      { id: 't3', description: 'Bank Error: Wrong Check Charged', amount: 500, type: 'error' },
      { id: 't4', description: 'Monthly Maintenance Fee', amount: 20, type: 'fee' },
      { id: 't5', description: 'Interest Earned', amount: 80, type: 'interest' },
    ],
  },
  {
    id: 'scenario-5',
    name: 'Recording Error in Books',
    difficulty: 'Hard',
    bookBalance: 18400,
    bankBalance: 16950,
    description: 'Check recorded incorrectly in company books',
    transactions: [
      { id: 't1', description: 'Check #4001 Outstanding', amount: 1200, type: 'check' },
      { id: 't2', description: 'Check #4002 Outstanding', amount: 350, type: 'check' },
      { id: 't3', description: 'Deposit in Transit', amount: 2800, type: 'deposit' },
      { id: 't4', description: 'Book Error: Check #3998 recorded as $180 instead of $810', amount: 630, type: 'error' },
      { id: 't5', description: 'Bank Service Charge', amount: 40, type: 'fee' },
      { id: 't6', description: 'Interest Earned', amount: 60, type: 'interest' },
    ],
  },
  {
    id: 'scenario-6',
    name: 'Multiple Outstanding Items',
    difficulty: 'Medium',
    bookBalance: 32500,
    bankBalance: 28900,
    description: 'Multiple checks and deposits outstanding',
    transactions: [
      { id: 't1', description: 'Check #6001 to Supplier A', amount: 1500, type: 'check' },
      { id: 't2', description: 'Check #6002 to Supplier B', amount: 2300, type: 'check' },
      { id: 't3', description: 'Check #6003 to Utilities', amount: 450, type: 'check' },
      { id: 't4', description: 'Deposit in Transit - Customer X', amount: 3200, type: 'deposit' },
      { id: 't5', description: 'Deposit in Transit - Customer Y', amount: 4500, type: 'deposit' },
      { id: 't6', description: 'Bank Fee', amount: 25, type: 'fee' },
      { id: 't7', description: 'Interest Earned', amount: 75, type: 'interest' },
    ],
  },
  {
    id: 'scenario-7',
    name: 'Complex Multi-Error Scenario',
    difficulty: 'Expert',
    bookBalance: 45200,
    bankBalance: 42850,
    description: 'Multiple errors on both bank and book sides',
    transactions: [
      { id: 't1', description: 'Check #7001 Outstanding', amount: 2800, type: 'check' },
      { id: 't2', description: 'Check #7002 Outstanding', amount: 1500, type: 'check' },
      { id: 't3', description: 'Deposit in Transit', amount: 5600, type: 'deposit' },
      { id: 't4', description: 'NSF Check - Customer ABC', amount: 1200, type: 'error' },
      { id: 't5', description: 'NSF Fee', amount: 30, type: 'fee' },
      { id: 't6', description: 'Bank Error: Deposit credited twice', amount: 800, type: 'error' },
      { id: 't7', description: 'Book Error: Check #6999 recorded as $520 instead of $250', amount: 270, type: 'error' },
      { id: 't8', description: 'Bank Service Charge', amount: 45, type: 'fee' },
      { id: 't9', description: 'Interest Earned', amount: 95, type: 'interest' },
      { id: 't10', description: 'Check #7003 Outstanding', amount: 680, type: 'check' },
    ],
  },
  {
    id: 'scenario-8',
    name: 'Year-End Reconciliation',
    difficulty: 'Expert',
    bookBalance: 67800,
    bankBalance: 63200,
    description: 'Complex year-end scenario with multiple adjustments',
    transactions: [
      { id: 't1', description: 'Check #8001 to Payroll', amount: 5200, type: 'check' },
      { id: 't2', description: 'Check #8002 to Tax Payment', amount: 3800, type: 'check' },
      { id: 't3', description: 'Check #8003 to Supplier', amount: 2100, type: 'check' },
      { id: 't4', description: 'Deposit in Transit - Sales', amount: 7500, type: 'deposit' },
      { id: 't5', description: 'Deposit in Transit - AR Collection', amount: 3200, type: 'deposit' },
      { id: 't6', description: 'NSF Check - Customer XYZ', amount: 1800, type: 'error' },
      { id: 't7', description: 'NSF Fee', amount: 35, type: 'fee' },
      { id: 't8', description: 'Bank Error: Wrong account charge', amount: 450, type: 'error' },
      { id: 't9', description: 'Book Error: Deposit recorded as $1,500 instead of $1,050', amount: 450, type: 'error' },
      { id: 't10', description: 'Electronic Payment Not Recorded', amount: 320, type: 'other' },
      { id: 't11', description: 'Bank Service Charge', amount: 55, type: 'fee' },
      { id: 't12', description: 'Interest Earned', amount: 125, type: 'interest' },
    ],
  },
];

const BankReconciliationWorksheet: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [bookBalance, setBookBalance] = useState<number>(0);
  const [bankBalance, setBankBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [showAdjustingEntries, setShowAdjustingEntries] = useState(false);

  // Load a practice scenario
  const loadScenario = (scenarioId: string) => {
    const scenario = practiceScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenarioId);
      setBookBalance(scenario.bookBalance);
      setBankBalance(scenario.bankBalance);
      setTransactions(
        scenario.transactions.map(t => ({ ...t, category: 'uncategorized' as const }))
      );
      setSelectedTransactions(new Set());
      setShowAdjustingEntries(false);
    }
  };

  // Toggle transaction selection
  const toggleTransactionSelection = (id: string) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  // Move selected transactions to a category
  const moveToCategory = (category: Transaction['category']) => {
    setTransactions(prev =>
      prev.map(t =>
        selectedTransactions.has(t.id) ? { ...t, category } : t
      )
    );
    setSelectedTransactions(new Set());
  };

  // Move single transaction to category
  const moveSingleTransaction = (id: string, category: Transaction['category']) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, category } : t))
    );
  };

  // Calculate adjusted balances
  const calculations = useMemo(() => {
    const outstanding = transactions
      .filter(t => t.category === 'outstanding')
      .reduce((sum, t) => sum + t.amount, 0);

    const transit = transactions
      .filter(t => t.category === 'transit')
      .reduce((sum, t) => sum + t.amount, 0);

    const bankErrors = transactions.filter(t => t.category === 'bankError');
    const bankErrorAdjustment = bankErrors.reduce((sum, t) => {
      // Bank errors that need to be added back (bank charged us incorrectly)
      if (t.type === 'error' && t.description.toLowerCase().includes('bank error')) {
        return sum + t.amount;
      }
      return sum - t.amount;
    }, 0);

    const bookErrors = transactions.filter(t => t.category === 'bookError');
    const bookErrorAdjustment = bookErrors.reduce((sum, t) => {
      // For NSF checks - subtract from book
      if (t.type === 'error' && t.description.toLowerCase().includes('nsf')) {
        return sum - t.amount;
      }
      // For fees - subtract from book
      if (t.type === 'fee') {
        return sum - t.amount;
      }
      // For interest - add to book
      if (t.type === 'interest') {
        return sum + t.amount;
      }
      // For book errors where we recorded wrong amount - adjust accordingly
      if (t.type === 'error' && t.description.toLowerCase().includes('book error')) {
        // If we recorded too much, subtract; if too little, add
        if (t.description.toLowerCase().includes('instead of')) {
          return sum - t.amount;
        }
      }
      // For other payments not recorded
      if (t.type === 'other') {
        return sum - t.amount;
      }
      return sum;
    }, 0);

    const adjustedBankBalance = bankBalance - outstanding + transit + bankErrorAdjustment;
    const adjustedBookBalance = bookBalance + bookErrorAdjustment;

    const difference = Math.abs(adjustedBankBalance - adjustedBookBalance);
    const isReconciled = difference < 0.01;

    const uncategorizedCount = transactions.filter(t => t.category === 'uncategorized').length;

    return {
      outstanding,
      transit,
      bankErrorAdjustment,
      bookErrorAdjustment,
      adjustedBankBalance,
      adjustedBookBalance,
      difference,
      isReconciled,
      uncategorizedCount,
    };
  }, [transactions, bookBalance, bankBalance]);

  // Generate adjusting journal entries
  const generateAdjustingEntries = (): JournalEntry[] => {
    const entries: JournalEntry[] = [];
    const today = new Date().toISOString().split('T')[0];

    transactions
      .filter(t => t.category === 'bookError')
      .forEach(t => {
        if (t.type === 'fee') {
          entries.push({
            date: today,
            account: 'Bank Service Charges Expense',
            debit: t.amount,
            credit: 0,
          });
          entries.push({
            date: today,
            account: 'Cash',
            debit: 0,
            credit: t.amount,
          });
        } else if (t.type === 'interest') {
          entries.push({
            date: today,
            account: 'Cash',
            debit: t.amount,
            credit: 0,
          });
          entries.push({
            date: today,
            account: 'Interest Revenue',
            debit: 0,
            credit: t.amount,
          });
        } else if (t.type === 'error' && t.description.toLowerCase().includes('nsf')) {
          entries.push({
            date: today,
            account: 'Accounts Receivable',
            debit: t.amount,
            credit: 0,
          });
          entries.push({
            date: today,
            account: 'Cash',
            debit: 0,
            credit: t.amount,
          });
        } else if (t.type === 'error' && t.description.toLowerCase().includes('book error')) {
          entries.push({
            date: today,
            account: 'Cash',
            debit: 0,
            credit: t.amount,
          });
          entries.push({
            date: today,
            account: 'Accounts Payable (or related account)',
            debit: t.amount,
            credit: 0,
          });
        } else if (t.type === 'other') {
          entries.push({
            date: today,
            account: 'Expense (or related account)',
            debit: t.amount,
            credit: 0,
          });
          entries.push({
            date: today,
            account: 'Cash',
            debit: 0,
            credit: t.amount,
          });
        }
      });

    return entries;
  };

  // Export reconciliation
  const exportReconciliation = () => {
    const content = `
BANK RECONCILIATION WORKSHEET
Date: ${new Date().toLocaleDateString()}
${selectedScenario ? `Scenario: ${practiceScenarios.find(s => s.id === selectedScenario)?.name}` : ''}

STARTING BALANCES:
Book Balance: $${bookBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Bank Balance: $${bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}

OUTSTANDING CHECKS (Subtract from Bank):
${transactions
  .filter(t => t.category === 'outstanding')
  .map(t => `  ${t.description}: -$${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
  .join('\n') || '  None'}

DEPOSITS IN TRANSIT (Add to Bank):
${transactions
  .filter(t => t.category === 'transit')
  .map(t => `  ${t.description}: +$${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
  .join('\n') || '  None'}

BANK ERRORS:
${transactions
  .filter(t => t.category === 'bankError')
  .map(t => `  ${t.description}: ${t.amount >= 0 ? '+' : ''}$${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
  .join('\n') || '  None'}

BOOK ADJUSTMENTS:
${transactions
  .filter(t => t.category === 'bookError')
  .map(t => {
    const sign = t.type === 'interest' ? '+' : '-';
    return `  ${t.description}: ${sign}$${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  })
  .join('\n') || '  None'}

ADJUSTED BALANCES:
Adjusted Bank Balance: $${calculations.adjustedBankBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Adjusted Book Balance: $${calculations.adjustedBookBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}

STATUS: ${calculations.isReconciled ? 'RECONCILED âœ“' : `Difference: $${calculations.difference.toFixed(2)}`}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank-reconciliation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentScenario = practiceScenarios.find(s => s.id === selectedScenario);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bank Reconciliation Worksheet</h1>
          <p className="text-muted-foreground mt-1">
            Reconcile book and bank balances by categorizing transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportReconciliation} variant="outline" disabled={!selectedScenario}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={showAdjustingEntries} onOpenChange={setShowAdjustingEntries}>
            <DialogTrigger asChild>
              <Button
                disabled={!calculations.isReconciled}
                variant={calculations.isReconciled ? 'default' : 'outline'}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Adjusting Entries
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adjusting Journal Entries</DialogTitle>
                <DialogDescription>
                  Required journal entries to update the book balance
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {generateAdjustingEntries().length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No adjusting entries required
                  </p>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left">Date</th>
                          <th className="p-3 text-left">Account</th>
                          <th className="p-3 text-right">Debit</th>
                          <th className="p-3 text-right">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generateAdjustingEntries().map((entry, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-3">{entry.date}</td>
                            <td className="p-3">{entry.account}</td>
                            <td className="p-3 text-right">
                              {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : ''}
                            </td>
                            <td className="p-3 text-right">
                              {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Practice Scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {practiceScenarios.map(scenario => (
              <div
                key={scenario.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedScenario === scenario.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
                onClick={() => loadScenario(scenario.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{scenario.name}</h3>
                  <Badge
                    variant={
                      scenario.difficulty === 'Simple'
                        ? 'default'
                        : scenario.difficulty === 'Medium'
                        ? 'secondary'
                        : scenario.difficulty === 'Hard'
                        ? 'destructive'
                        : 'outline'
                    }
                  >
                    {scenario.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedScenario && (
        <>
          {/* Status Indicator */}
          <Card
            className={`border-2 ${
              calculations.isReconciled
                ? 'border-green-500 bg-green-50'
                : calculations.uncategorizedCount > 0
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-red-500 bg-red-50'
            }`}
          >
            <CardContent className="py-6">
              <div className="flex items-center justify-center gap-4">
                {calculations.isReconciled ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-green-700">RECONCILED!</h2>
                      <p className="text-green-600">
                        Adjusted balances match: $
                        {calculations.adjustedBankBalance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </>
                ) : calculations.uncategorizedCount > 0 ? (
                  <>
                    <AlertCircle className="w-8 h-8 text-yellow-600" />
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-yellow-700">IN PROGRESS</h2>
                      <p className="text-yellow-600">
                        {calculations.uncategorizedCount} transaction(s) need to be categorized
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-red-600" />
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-red-700">NOT RECONCILED</h2>
                      <p className="text-red-600">
                        Difference: $
                        {calculations.difference.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Starting Balances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="bg-accent">
                <CardTitle className="text-foreground">Book Balance (Per Records)</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-primary">
                  ${bookBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-900">Bank Balance (Per Statement)</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-4xl font-bold text-purple-700">
                  ${bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Uncategorized Transactions */}
          {transactions.filter(t => t.category === 'uncategorized').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Uncategorized Transactions</span>
                  {selectedTransactions.size > 0 && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveToCategory('outstanding')}
                      >
                        Move to Outstanding Checks
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveToCategory('transit')}
                      >
                        Move to Deposits in Transit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveToCategory('bankError')}
                      >
                        Move to Bank Errors
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveToCategory('bookError')}
                      >
                        Move to Book Adjustments
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transactions
                    .filter(t => t.category === 'uncategorized')
                    .map(transaction => (
                      <div
                        key={transaction.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedTransactions.has(transaction.id)}
                          onCheckedChange={() => toggleTransactionSelection(transaction.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Type: {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </p>
                        </div>
                        <p className="text-lg font-semibold">
                          ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <Select
                          value={transaction.category}
                          onValueChange={(value) =>
                            moveSingleTransaction(transaction.id, value as Transaction['category'])
                          }
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Categorize" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="outstanding">Outstanding Checks</SelectItem>
                            <SelectItem value="transit">Deposits in Transit</SelectItem>
                            <SelectItem value="bankError">Bank Errors</SelectItem>
                            <SelectItem value="bookError">Book Adjustments</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reconciliation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank Side */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-900">Bank Side Adjustments</h2>

              {/* Outstanding Checks */}
              <Card>
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-red-900">Outstanding Checks (-)</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {transactions.filter(t => t.category === 'outstanding').length === 0 ? (
                      <p className="text-muted-foreground text-sm">No outstanding checks</p>
                    ) : (
                      transactions
                        .filter(t => t.category === 'outstanding')
                        .map(transaction => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 cursor-pointer"
                            onClick={() => moveSingleTransaction(transaction.id, 'uncategorized')}
                          >
                            <span className="text-sm">{transaction.description}</span>
                            <span className="font-semibold text-red-600">
                              -${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                  {transactions.filter(t => t.category === 'outstanding').length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total Outstanding:</span>
                        <span className="text-red-600">
                          -${calculations.outstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Deposits in Transit */}
              <Card>
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-green-900">Deposits in Transit (+)</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {transactions.filter(t => t.category === 'transit').length === 0 ? (
                      <p className="text-muted-foreground text-sm">No deposits in transit</p>
                    ) : (
                      transactions
                        .filter(t => t.category === 'transit')
                        .map(transaction => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 cursor-pointer"
                            onClick={() => moveSingleTransaction(transaction.id, 'uncategorized')}
                          >
                            <span className="text-sm">{transaction.description}</span>
                            <span className="font-semibold text-green-600">
                              +${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                  {transactions.filter(t => t.category === 'transit').length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total in Transit:</span>
                        <span className="text-green-600">
                          +${calculations.transit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bank Errors */}
              <Card>
                <CardHeader className="bg-orange-50">
                  <CardTitle className="text-orange-900">Bank Errors</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {transactions.filter(t => t.category === 'bankError').length === 0 ? (
                      <p className="text-muted-foreground text-sm">No bank errors</p>
                    ) : (
                      transactions
                        .filter(t => t.category === 'bankError')
                        .map(transaction => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 cursor-pointer"
                            onClick={() => moveSingleTransaction(transaction.id, 'uncategorized')}
                          >
                            <span className="text-sm">{transaction.description}</span>
                            <span className="font-semibold text-orange-600">
                              +${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Adjusted Bank Balance */}
              <Card className="border-2 border-purple-500">
                <CardHeader className="bg-purple-100">
                  <CardTitle className="text-purple-900">Adjusted Bank Balance</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Bank Statement Balance:</span>
                      <span className="font-semibold">
                        ${bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Less: Outstanding Checks</span>
                      <span className="font-semibold">
                        -${calculations.outstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Add: Deposits in Transit</span>
                      <span className="font-semibold">
                        +${calculations.transit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {calculations.bankErrorAdjustment !== 0 && (
                      <div
                        className={`flex justify-between ${
                          calculations.bankErrorAdjustment > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        <span>Bank Errors:</span>
                        <span className="font-semibold">
                          {calculations.bankErrorAdjustment > 0 ? '+' : ''}$
                          {calculations.bankErrorAdjustment.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 border-t flex justify-between text-lg font-bold text-purple-700">
                      <span>Adjusted Bank Balance:</span>
                      <span>
                        $
                        {calculations.adjustedBankBalance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Book Side */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Book Side Adjustments</h2>

              {/* Book Adjustments */}
              <Card>
                <CardHeader className="bg-accent">
                  <CardTitle className="text-foreground">Book Adjustments</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {transactions.filter(t => t.category === 'bookError').length === 0 ? (
                      <p className="text-muted-foreground text-sm">No book adjustments needed</p>
                    ) : (
                      transactions
                        .filter(t => t.category === 'bookError')
                        .map(transaction => {
                          const isAddition = transaction.type === 'interest';
                          const isSubtraction =
                            transaction.type === 'fee' ||
                            transaction.type === 'other' ||
                            (transaction.type === 'error' &&
                              transaction.description.toLowerCase().includes('nsf'));

                          return (
                            <div
                              key={transaction.id}
                              className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 cursor-pointer"
                              onClick={() =>
                                moveSingleTransaction(transaction.id, 'uncategorized')
                              }
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  {transaction.type === 'fee'
                                    ? 'Bank Fee'
                                    : transaction.type === 'interest'
                                    ? 'Interest Earned'
                                    : transaction.type === 'error' &&
                                      transaction.description.toLowerCase().includes('nsf')
                                    ? 'NSF Check'
                                    : transaction.type === 'error'
                                    ? 'Book Error'
                                    : 'Other Adjustment'}
                                </p>
                              </div>
                              <span
                                className={`font-semibold ${
                                  isAddition
                                    ? 'text-green-600'
                                    : isSubtraction
                                    ? 'text-red-600'
                                    : 'text-orange-600'
                                }`}
                              >
                                {isAddition ? '+' : isSubtraction ? '-' : ''}$
                                {transaction.amount.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          );
                        })
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Adjusted Book Balance */}
              <Card className="border-2 border-primary">
                <CardHeader className="bg-accent">
                  <CardTitle className="text-foreground">Adjusted Book Balance</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Book Balance (Per Records):</span>
                      <span className="font-semibold">
                        ${bookBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Interest */}
                    {transactions.filter(t => t.category === 'bookError' && t.type === 'interest')
                      .length > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Add: Interest Earned</span>
                        <span className="font-semibold">
                          +$
                          {transactions
                            .filter(t => t.category === 'bookError' && t.type === 'interest')
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    {/* Fees */}
                    {transactions.filter(t => t.category === 'bookError' && t.type === 'fee')
                      .length > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Less: Bank Fees</span>
                        <span className="font-semibold">
                          -$
                          {transactions
                            .filter(t => t.category === 'bookError' && t.type === 'fee')
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    {/* NSF Checks */}
                    {transactions.filter(
                      t =>
                        t.category === 'bookError' &&
                        t.type === 'error' &&
                        t.description.toLowerCase().includes('nsf')
                    ).length > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Less: NSF Checks</span>
                        <span className="font-semibold">
                          -$
                          {transactions
                            .filter(
                              t =>
                                t.category === 'bookError' &&
                                t.type === 'error' &&
                                t.description.toLowerCase().includes('nsf')
                            )
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    {/* Book Errors */}
                    {transactions.filter(
                      t =>
                        t.category === 'bookError' &&
                        t.type === 'error' &&
                        !t.description.toLowerCase().includes('nsf')
                    ).length > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Adjust: Book Errors</span>
                        <span className="font-semibold">
                          -$
                          {transactions
                            .filter(
                              t =>
                                t.category === 'bookError' &&
                                t.type === 'error' &&
                                !t.description.toLowerCase().includes('nsf')
                            )
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    {/* Other */}
                    {transactions.filter(t => t.category === 'bookError' && t.type === 'other')
                      .length > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Less: Other Items</span>
                        <span className="font-semibold">
                          -$
                          {transactions
                            .filter(t => t.category === 'bookError' && t.type === 'other')
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t flex justify-between text-lg font-bold text-primary">
                      <span>Adjusted Book Balance:</span>
                      <span>
                        $
                        {calculations.adjustedBookBalance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Helpful Hints */}
              {!calculations.isReconciled && calculations.uncategorizedCount === 0 && (
                <Card className="border-yellow-500 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-900 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Helpful Hints
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-sm text-yellow-800">
                      <li>Outstanding checks reduce the bank balance</li>
                      <li>Deposits in transit increase the bank balance</li>
                      <li>Bank fees and NSF checks reduce the book balance</li>
                      <li>Interest earned increases the book balance</li>
                      <li>Bank errors should be corrected by the bank</li>
                      <li>Book errors require adjusting journal entries</li>
                      <li>
                        Review each transaction carefully to ensure correct categorization
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}

      {!selectedScenario && (
        <Card className="border-dashed">
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground text-lg">
              Select a practice scenario above to begin the bank reconciliation exercise
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankReconciliationWorksheet;
