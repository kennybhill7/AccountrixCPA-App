'use client';

import React, { useState } from 'react';
import ChartOfAccountsBuilder, { Account } from '@/components/ChartOfAccountsBuilder';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, BookOpen } from 'lucide-react';

/**
 * Integration Example Page
 *
 * This page demonstrates how the Chart of Accounts Builder can be integrated
 * with other accounting education components and workflows.
 */

export default function COAIntegrationPage() {
  const [coa, setCoa] = useState<Account[]>([]);
  const [isCoaComplete, setIsCoaComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState<'coa' | 'journal' | 'trial-balance' | 'statements'>('coa');

  const handleCoaSave = (accounts: Account[]) => {
    setCoa(accounts);
    setIsCoaComplete(accounts.length >= 20); // Require at least 20 accounts

    // Show success and next steps
    if (accounts.length >= 20) {
      alert(
        'Chart of Accounts Created Successfully!\n\n' +
        `Total Accounts: ${accounts.length}\n\n` +
        'Next Steps:\n' +
        '1. Practice journal entries using your COA\n' +
        '2. Create a trial balance\n' +
        '3. Generate financial statements\n\n' +
        'Click "Next: Journal Entries" to continue'
      );
    } else {
      alert(
        'Chart of Accounts Saved\n\n' +
        `You have ${accounts.length} accounts.\n` +
        `Add at least ${20 - accounts.length} more accounts to proceed to the next step.`
      );
    }
  };

  const goToJournalEntries = () => {
    if (!isCoaComplete) {
      alert('Please complete your Chart of Accounts first (minimum 20 accounts)');
      return;
    }
    setCurrentStep('journal');
    alert('Journal Entry Simulator would open here.\n\nYou would practice:\n- Recording construction transactions\n- Selecting accounts from your COA\n- Applying debit/credit rules\n- Validating balanced entries');
  };

  const goToTrialBalance = () => {
    if (!isCoaComplete) {
      alert('Please complete your Chart of Accounts first');
      return;
    }
    setCurrentStep('trial-balance');
    alert('Trial Balance Worksheet would open here.\n\nYou would:\n- List all accounts with balances\n- Verify debit/credit totals match\n- Identify any errors\n- Prepare for adjusting entries');
  };

  const goToFinancialStatements = () => {
    if (!isCoaComplete) {
      alert('Please complete your Chart of Accounts first');
      return;
    }
    setCurrentStep('statements');
    alert('Financial Statements Generator would open here.\n\nYou would create:\n- Balance Sheet\n- Income Statement\n- Statement of Cash Flows\n- Statement of Owner\'s Equity');
  };

  // Calculate progress
  const progress = {
    coaComplete: isCoaComplete,
    accountCount: coa.length,
    hasAssets: coa.some(a => a.type === 'Asset'),
    hasLiabilities: coa.some(a => a.type === 'Liability'),
    hasEquity: coa.some(a => a.type === 'Equity'),
    hasRevenue: coa.some(a => a.type === 'Revenue'),
    hasExpenses: coa.some(a => a.type === 'Expense'),
  };

  const allTypesPresent =
    progress.hasAssets &&
    progress.hasLiabilities &&
    progress.hasEquity &&
    progress.hasRevenue &&
    progress.hasExpenses;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Accounting Workflow Integration</h1>
        <p className="text-muted-foreground">
          Build your Chart of Accounts and see how it integrates with the complete accounting cycle
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${currentStep === 'coa' ? 'bg-primary text-primary-foreground' : isCoaComplete ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}>
              {isCoaComplete ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2" />
              )}
              <span className="font-medium">1. Chart of Accounts</span>
            </div>
            <div className="h-1 w-12 bg-muted" />
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${currentStep === 'journal' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <div className="h-5 w-5 rounded-full border-2" />
              <span className="font-medium">2. Journal Entries</span>
            </div>
            <div className="h-1 w-12 bg-muted" />
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${currentStep === 'trial-balance' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <div className="h-5 w-5 rounded-full border-2" />
              <span className="font-medium">3. Trial Balance</span>
            </div>
            <div className="h-1 w-12 bg-muted" />
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${currentStep === 'statements' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            <div className="h-5 w-5 rounded-full border-2" />
            <span className="font-medium">4. Financial Statements</span>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Accounts</div>
              <div className="text-3xl font-bold">{progress.accountCount}</div>
            </div>
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {progress.accountCount < 20 ? `${20 - progress.accountCount} more needed` : 'Requirement met'}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Account Types</div>
              <div className="text-3xl font-bold">
                {[progress.hasAssets, progress.hasLiabilities, progress.hasEquity, progress.hasRevenue, progress.hasExpenses].filter(Boolean).length}/5
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {allTypesPresent ? 'All types present' : 'Add all account types'}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="text-lg font-bold">
                {isCoaComplete ? (
                  <Badge className="bg-green-500">Ready</Badge>
                ) : (
                  <Badge variant="secondary">In Progress</Badge>
                )}
              </div>
            </div>
            {isCoaComplete ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            )}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {isCoaComplete ? 'Ready for next step' : 'Complete your COA'}
          </div>
        </Card>
      </div>

      {/* Requirements Checklist */}
      <div className="mb-8 border rounded-lg p-6 bg-muted/50">
        <h2 className="text-xl font-semibold mb-4">COA Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            {progress.accountCount >= 20 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm">Minimum 20 accounts created</span>
          </div>

          <div className="flex items-center gap-2">
            {progress.hasAssets ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm">Asset accounts defined</span>
          </div>

          <div className="flex items-center gap-2">
            {progress.hasLiabilities ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm">Liability accounts defined</span>
          </div>

          <div className="flex items-center gap-2">
            {progress.hasEquity ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm">Equity accounts defined</span>
          </div>

          <div className="flex items-center gap-2">
            {progress.hasRevenue ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm">Revenue accounts defined</span>
          </div>

          <div className="flex items-center gap-2">
            {progress.hasExpenses ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm">Expense accounts defined</span>
          </div>
        </div>
      </div>

      {/* Chart of Accounts Builder */}
      <div className="mb-8">
        <ChartOfAccountsBuilder
          initialCOA={coa}
          onSave={handleCoaSave}
          showTemplates={true}
          readOnly={false}
        />
      </div>

      {/* Next Steps */}
      {isCoaComplete && (
        <div className="border rounded-lg p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
          <h2 className="text-2xl font-semibold mb-4">Next Steps in the Accounting Cycle</h2>
          <p className="text-muted-foreground mb-6">
            Your Chart of Accounts is complete! Continue your accounting education with these interactive tools:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Journal Entry Simulator</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Practice recording construction transactions using your custom Chart of Accounts.
                Learn debit/credit rules and transaction analysis.
              </p>
              <Button onClick={goToJournalEntries} className="w-full">
                Start Journal Entries
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Trial Balance Worksheet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create a trial balance from your journal entries. Verify that debits equal credits
                and prepare for adjusting entries.
              </p>
              <Button onClick={goToTrialBalance} className="w-full" variant="outline">
                Create Trial Balance
              </Button>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Financial Statements</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate Balance Sheet, Income Statement, and Cash Flow Statement from your
                Chart of Accounts and transactions.
              </p>
              <Button onClick={goToFinancialStatements} className="w-full" variant="outline">
                Generate Statements
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Educational Tips */}
      <div className="mt-8 border rounded-lg p-6 bg-muted/50">
        <h2 className="text-xl font-semibold mb-4">Integration Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Why Start with Chart of Accounts?</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Foundation of all accounting transactions</li>
              <li>Ensures consistent financial recording</li>
              <li>Organizes accounts by type and function</li>
              <li>Facilitates accurate financial reporting</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Construction Industry Focus</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Retainage tracking (receivable & payable)</li>
              <li>Job costing with Work in Progress accounts</li>
              <li>Equipment asset management</li>
              <li>Subcontractor cost allocation</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Learning Progression</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Build foundational knowledge systematically</li>
              <li>Practice with realistic scenarios</li>
              <li>Receive immediate feedback</li>
              <li>Track your progress over time</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Real-World Application</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Use in actual construction projects</li>
              <li>Export to accounting software</li>
              <li>Customize for your business needs</li>
              <li>Maintain compliance standards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
