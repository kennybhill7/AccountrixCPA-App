'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, X, Plus, Trash2, AlertCircle, RotateCcw } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Represents a single journal entry line
 */
interface Entry {
  id: string;
  account: string;
  amount: number;
  type: 'debit' | 'credit';
}

/**
 * Represents a complete journal entry solution
 */
interface JournalEntrySolution {
  entries: Omit<Entry, 'id'>[];
}

/**
 * Represents a practice scenario
 */
interface JEScenario {
  id: string;
  difficulty: 'simple' | 'medium' | 'hard' | 'expert';
  description: string;
  solution: JournalEntrySolution;
  hint?: string;
}

/**
 * Validation result interface
 */
interface ValidationResult {
  isValid: boolean;
  isBalanced: boolean;
  isCorrect: boolean;
  totalDebits: number;
  totalCredits: number;
  errors: string[];
  incorrectAccounts: string[];
}

/**
 * Chart of Accounts structure
 */
interface ChartOfAccounts {
  [category: string]: string[];
}

/**
 * Component props
 */
interface JournalEntrySimulatorProps {
  scenario?: JEScenario;
  onComplete?: (success: boolean, attempts: number) => void;
}

// ============================================================================
// CHART OF ACCOUNTS
// ============================================================================

const CHART_OF_ACCOUNTS: ChartOfAccounts = {
  Assets: [
    'Cash',
    'Accounts Receivable',
    'Retainage Receivable',
    'Materials Inventory',
    'Equipment',
    'Accumulated Depreciation',
  ],
  Liabilities: [
    'Accounts Payable',
    'Retainage Payable',
    'Notes Payable',
    'Accrued Expenses',
  ],
  Equity: [
    'Owner\'s Capital',
    'Retained Earnings',
    'Draws',
  ],
  Revenue: [
    'Construction Revenue',
    'Service Revenue',
  ],
  Expenses: [
    'Cost of Goods Sold',
    'Materials Expense',
    'Labor Expense',
    'Equipment Expense',
    'Depreciation Expense',
  ],
};

// ============================================================================
// PRE-BUILT SCENARIOS
// ============================================================================

const DEFAULT_SCENARIOS: JEScenario[] = [
  {
    id: 'scenario-1',
    difficulty: 'simple',
    description: 'Received $10,000 cash for services rendered',
    solution: {
      entries: [
        { account: 'Cash', amount: 10000, type: 'debit' },
        { account: 'Service Revenue', amount: 10000, type: 'credit' },
      ],
    },
    hint: 'Cash increases (debit), Revenue increases (credit)',
  },
  {
    id: 'scenario-2',
    difficulty: 'simple',
    description: 'Paid $3,000 cash for materials inventory',
    solution: {
      entries: [
        { account: 'Materials Inventory', amount: 3000, type: 'debit' },
        { account: 'Cash', amount: 3000, type: 'credit' },
      ],
    },
    hint: 'Materials Inventory increases (debit), Cash decreases (credit)',
  },
  {
    id: 'scenario-3',
    difficulty: 'simple',
    description: 'Owner invested $25,000 cash into the business',
    solution: {
      entries: [
        { account: 'Cash', amount: 25000, type: 'debit' },
        { account: 'Owner\'s Capital', amount: 25000, type: 'credit' },
      ],
    },
    hint: 'Cash increases (debit), Owner\'s Capital increases (credit)',
  },
  {
    id: 'scenario-4',
    difficulty: 'medium',
    description: 'Purchased equipment for $50,000, paid $10,000 cash and signed a note for the balance',
    solution: {
      entries: [
        { account: 'Equipment', amount: 50000, type: 'debit' },
        { account: 'Cash', amount: 10000, type: 'credit' },
        { account: 'Notes Payable', amount: 40000, type: 'credit' },
      ],
    },
    hint: 'Equipment increases (debit), Cash decreases (credit), Notes Payable increases (credit)',
  },
  {
    id: 'scenario-5',
    difficulty: 'medium',
    description: 'Purchased materials on account for $8,500',
    solution: {
      entries: [
        { account: 'Materials Inventory', amount: 8500, type: 'debit' },
        { account: 'Accounts Payable', amount: 8500, type: 'credit' },
      ],
    },
    hint: 'Materials Inventory increases (debit), Accounts Payable increases (credit)',
  },
  {
    id: 'scenario-6',
    difficulty: 'medium',
    description: 'Paid $5,000 cash to reduce accounts payable',
    solution: {
      entries: [
        { account: 'Accounts Payable', amount: 5000, type: 'debit' },
        { account: 'Cash', amount: 5000, type: 'credit' },
      ],
    },
    hint: 'Accounts Payable decreases (debit), Cash decreases (credit)',
  },
  {
    id: 'scenario-7',
    difficulty: 'hard',
    description: 'Billed customer $100,000 for work completed, with 10% retainage withheld',
    solution: {
      entries: [
        { account: 'Accounts Receivable', amount: 90000, type: 'debit' },
        { account: 'Retainage Receivable', amount: 10000, type: 'debit' },
        { account: 'Construction Revenue', amount: 100000, type: 'credit' },
      ],
    },
    hint: 'Accounts Receivable for 90% (debit), Retainage Receivable for 10% (debit), Construction Revenue for full amount (credit)',
  },
  {
    id: 'scenario-8',
    difficulty: 'hard',
    description: 'Recorded cost of materials used in construction project: $15,000',
    solution: {
      entries: [
        { account: 'Cost of Goods Sold', amount: 15000, type: 'debit' },
        { account: 'Materials Inventory', amount: 15000, type: 'credit' },
      ],
    },
    hint: 'Cost of Goods Sold increases (debit), Materials Inventory decreases (credit)',
  },
  {
    id: 'scenario-9',
    difficulty: 'expert',
    description: 'Record depreciation expense of $5,000',
    solution: {
      entries: [
        { account: 'Depreciation Expense', amount: 5000, type: 'debit' },
        { account: 'Accumulated Depreciation', amount: 5000, type: 'credit' },
      ],
    },
    hint: 'Depreciation Expense increases (debit), Accumulated Depreciation increases (credit)',
  },
  {
    id: 'scenario-10',
    difficulty: 'expert',
    description: 'Accrued $2,500 in labor expenses not yet paid',
    solution: {
      entries: [
        { account: 'Labor Expense', amount: 2500, type: 'debit' },
        { account: 'Accrued Expenses', amount: 2500, type: 'credit' },
      ],
    },
    hint: 'Labor Expense increases (debit), Accrued Expenses increases (credit)',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function JournalEntrySimulator({
  scenario = DEFAULT_SCENARIOS[0],
  onComplete,
}: JournalEntrySimulatorProps) {
  // State management
  const [entries, setEntries] = useState<Entry[]>([
    { id: crypto.randomUUID(), account: '', amount: 0, type: 'debit' },
    { id: crypto.randomUUID(), account: '', amount: 0, type: 'credit' },
  ]);
  const [attempts, setAttempts] = useState(0);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');

  // Reset validation when entries change
  useEffect(() => {
    setValidationResult(null);
    setFeedbackMessage('');
  }, [entries]);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Calculate total debits and credits
   */
  const calculateTotals = () => {
    const totalDebits = entries
      .filter((e) => e.type === 'debit')
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalCredits = entries
      .filter((e) => e.type === 'credit')
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    return { totalDebits, totalCredits };
  };

  /**
   * Validate the journal entry
   */
  const validateEntry = (): ValidationResult => {
    const errors: string[] = [];
    const incorrectAccounts: string[] = [];
    const { totalDebits, totalCredits } = calculateTotals();

    // Check minimum entries
    if (entries.length < 2) {
      errors.push('At least 2 entries are required');
    }

    // Check for empty accounts
    const emptyAccounts = entries.filter((e) => !e.account);
    if (emptyAccounts.length > 0) {
      errors.push('All entries must have an account selected');
    }

    // Check for zero or negative amounts
    const invalidAmounts = entries.filter((e) => e.amount <= 0);
    if (invalidAmounts.length > 0) {
      errors.push('All amounts must be greater than 0');
    }

    // Check if debits equal credits
    const isBalanced = totalDebits === totalCredits && totalDebits > 0;
    if (!isBalanced) {
      errors.push(
        `Total debits ($${totalDebits.toLocaleString()}) must equal total credits ($${totalCredits.toLocaleString()})`
      );
    }

    // Check correctness against solution
    let isCorrect = false;
    if (isBalanced && errors.length === 0) {
      isCorrect = checkAgainstSolution();
      if (!isCorrect) {
        errors.push('The entry is balanced but does not match the correct solution');
        // Identify incorrect accounts
        entries.forEach((entry) => {
          const matchingEntry = scenario.solution.entries.find(
            (se) =>
              se.account === entry.account &&
              se.amount === entry.amount &&
              se.type === entry.type
          );
          if (!matchingEntry) {
            incorrectAccounts.push(entry.id);
          }
        });
      }
    }

    return {
      isValid: errors.length === 0,
      isBalanced,
      isCorrect,
      totalDebits,
      totalCredits,
      errors,
      incorrectAccounts,
    };
  };

  /**
   * Check if user's entry matches the solution
   */
  const checkAgainstSolution = (): boolean => {
    const solution = scenario.solution.entries;

    // Must have same number of entries
    if (entries.length !== solution.length) {
      return false;
    }

    // Check if each entry in the solution exists in the user's entries
    return solution.every((solutionEntry) => {
      return entries.some(
        (userEntry) =>
          userEntry.account === solutionEntry.account &&
          userEntry.amount === solutionEntry.amount &&
          userEntry.type === solutionEntry.type
      );
    });
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Add a new entry row
   */
  const addEntry = () => {
    setEntries([
      ...entries,
      { id: crypto.randomUUID(), account: '', amount: 0, type: 'debit' },
    ]);
  };

  /**
   * Remove an entry row
   */
  const removeEntry = (id: string) => {
    if (entries.length > 2) {
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  /**
   * Update an entry field
   */
  const updateEntry = (id: string, field: keyof Entry, value: any) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  /**
   * Check user's work
   */
  const checkWork = () => {
    const result = validateEntry();
    setValidationResult(result);
    setAttempts(attempts + 1);

    if (result.isCorrect) {
      setFeedbackMessage('Great! Your entry is balanced and correct!');
      setFeedbackType('success');
      onComplete?.(true, attempts + 1);
    } else if (result.isBalanced && !result.isCorrect) {
      setFeedbackMessage(
        'Your entry is balanced, but some accounts are incorrect. Try again!'
      );
      setFeedbackType('error');
    } else {
      setFeedbackMessage(result.errors.join('. '));
      setFeedbackType('error');
    }
  };

  /**
   * Show the solution
   */
  const handleShowSolution = () => {
    setShowSolution(true);
    setFeedbackMessage('Solution revealed. Study it carefully!');
    setFeedbackType('info');
    onComplete?.(false, attempts);
  };

  /**
   * Reset the simulator
   */
  const resetSimulator = () => {
    setEntries([
      { id: crypto.randomUUID(), account: '', amount: 0, type: 'debit' },
      { id: crypto.randomUUID(), account: '', amount: 0, type: 'credit' },
    ]);
    setAttempts(0);
    setValidationResult(null);
    setShowSolution(false);
    setFeedbackMessage('');
  };

  // ============================================================================
  // RENDERING
  // ============================================================================

  const { totalDebits, totalCredits } = calculateTotals();
  const isBalanced = totalDebits === totalCredits && totalDebits > 0;

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">Journal Entry Simulator</CardTitle>
            <CardDescription className="text-base">
              Practice recording transactions with proper debits and credits
            </CardDescription>
          </div>
          <Badge
            variant={
              scenario.difficulty === 'simple'
                ? 'default'
                : scenario.difficulty === 'medium'
                ? 'secondary'
                : 'destructive'
            }
            className="ml-4"
          >
            {scenario.difficulty.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Transaction Scenario */}
        <div className="bg-accent border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-2">Transaction Scenario:</h3>
          <p className="text-primary-dark">{scenario.description}</p>
          {scenario.hint && attempts > 0 && !validationResult?.isCorrect && (
            <div className="mt-3 text-sm text-primary italic">
              <strong>Hint:</strong> {scenario.hint}
            </div>
          )}
        </div>

        {/* Journal Entry Table */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Your Journal Entry:</h3>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-4 py-2 bg-gray-50 rounded-t-lg border border-border font-semibold text-sm">
            <div className="col-span-5">Account</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Debit</div>
            <div className="col-span-2">Credit</div>
            <div className="col-span-1">Action</div>
          </div>

          {/* Entry Rows */}
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const isIncorrect =
                validationResult?.incorrectAccounts.includes(entry.id);
              return (
                <div
                  key={entry.id}
                  className={`grid grid-cols-12 gap-3 px-4 py-3 border rounded-lg items-center transition-colors ${
                    isIncorrect
                      ? 'border-red-300 bg-red-50'
                      : 'border-border bg-card'
                  }`}
                >
                  {/* Account Selector */}
                  <div className="col-span-5">
                    <Select
                      value={entry.account}
                      onValueChange={(value) =>
                        updateEntry(entry.id, 'account', value)
                      }
                      disabled={showSolution}
                    >
                      <SelectTrigger
                        className={isIncorrect ? 'border-red-400' : ''}
                      >
                        <SelectValue placeholder="Select account..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CHART_OF_ACCOUNTS).map(
                          ([category, accounts]) => (
                            <SelectGroup key={category}>
                              <SelectLabel>{category}</SelectLabel>
                              {accounts.map((account) => (
                                <SelectItem key={account} value={account}>
                                  {account}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Input */}
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={entry.amount || ''}
                      onChange={(e) =>
                        updateEntry(
                          entry.id,
                          'amount',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0.00"
                      className={isIncorrect ? 'border-red-400' : ''}
                      disabled={showSolution}
                    />
                  </div>

                  {/* Debit Radio */}
                  <div className="col-span-2 flex justify-center">
                    <input
                      type="radio"
                      name={`type-${entry.id}`}
                      checked={entry.type === 'debit'}
                      onChange={() => updateEntry(entry.id, 'type', 'debit')}
                      className="w-5 h-5 cursor-pointer"
                      disabled={showSolution}
                    />
                  </div>

                  {/* Credit Radio */}
                  <div className="col-span-2 flex justify-center">
                    <input
                      type="radio"
                      name={`type-${entry.id}`}
                      checked={entry.type === 'credit'}
                      onChange={() => updateEntry(entry.id, 'type', 'credit')}
                      className="w-5 h-5 cursor-pointer"
                      disabled={showSolution}
                    />
                  </div>

                  {/* Delete Button */}
                  <div className="col-span-1 flex justify-center">
                    {entries.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEntry(entry.id)}
                        disabled={showSolution}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Entry Button */}
          {!showSolution && (
            <Button
              variant="outline"
              onClick={addEntry}
              className="w-full"
              disabled={showSolution}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          )}
        </div>

        {/* Totals Display */}
        <div className="bg-gray-50 border border-border rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Debits</p>
              <p className="text-2xl font-bold text-foreground">
                ${totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Credits</p>
              <p className="text-2xl font-bold text-foreground">
                ${totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Balance Status</p>
              <div className="flex items-center gap-2">
                {isBalanced ? (
                  <>
                    <Check className="h-6 w-6 text-green-500" />
                    <span className="text-xl font-bold text-green-600">
                      Balanced
                    </span>
                  </>
                ) : (
                  <>
                    <X className="h-6 w-6 text-red-500" />
                    <span className="text-xl font-bold text-red-600">
                      Unbalanced
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        {feedbackMessage && (
          <div
            className={`rounded-lg p-4 flex items-start gap-3 ${
              feedbackType === 'success'
                ? 'bg-green-50 border border-green-200'
                : feedbackType === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-accent border border-border'
            }`}
          >
            {feedbackType === 'success' ? (
              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : feedbackType === 'error' ? (
              <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            )}
            <p
              className={`text-sm font-medium ${
                feedbackType === 'success'
                  ? 'text-green-800'
                  : feedbackType === 'error'
                  ? 'text-red-800'
                  : 'text-primary-dark'
              }`}
            >
              {feedbackMessage}
            </p>
          </div>
        )}

        {/* Solution Display */}
        {showSolution && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-3">Solution:</h3>
            <div className="space-y-2">
              {scenario.solution.entries.map((entry, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 text-sm bg-card p-3 rounded border border-yellow-300"
                >
                  <div className="col-span-2 font-medium">{entry.account}</div>
                  <div className="text-right">
                    {entry.type === 'debit'
                      ? `$${entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : ''}
                  </div>
                  <div className="text-right">
                    {entry.type === 'credit'
                      ? `$${entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={checkWork}
            disabled={showSolution || validationResult?.isCorrect}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-2" />
            Check My Work
          </Button>

          {attempts >= 3 && !validationResult?.isCorrect && !showSolution && (
            <Button
              variant="secondary"
              onClick={handleShowSolution}
              className="flex-1"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Show Solution
            </Button>
          )}

          <Button variant="outline" onClick={resetSimulator} className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Attempt Counter */}
        <div className="text-center text-sm text-muted-foreground">
          Attempts: {attempts}
          {attempts >= 3 && !validationResult?.isCorrect && !showSolution && (
            <span className="text-yellow-600 ml-2">
              (You can now view the solution)
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Export scenarios for use in other components
export { DEFAULT_SCENARIOS, CHART_OF_ACCOUNTS };
export type { JEScenario, Entry, ValidationResult, JournalEntrySolution };
