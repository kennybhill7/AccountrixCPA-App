'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Download,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  FileText,
  Building2,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  Book,
  Calculator,
  ArrowRight,
} from 'lucide-react';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface Account {
  id: string;
  name: string;
  category: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  isIntercompany?: boolean;
}

interface Entity {
  id: string;
  name: string;
  type: 'parent' | 'subsidiary';
  accounts: Account[];
}

interface IntercompanyTransaction {
  id: string;
  type: 'receivable-payable' | 'sales-purchases' | 'loan' | 'dividend' | 'inventory';
  amount: number;
  fromEntity: string;
  toEntity: string;
  unrealizedProfit?: number;
  description: string;
}

interface EliminationEntry {
  id: string;
  description: string;
  purpose: string;
  debits: { account: string; amount: number }[];
  credits: { account: string; amount: number }[];
  relatedTransaction?: string;
}

interface ConsolidatedAccount {
  name: string;
  category: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parentBalance: number;
  subsidiaryBalance: number;
  eliminationDebit: number;
  eliminationCredit: number;
  consolidatedBalance: number;
}

interface ConsolidationScenario {
  id: string;
  name: string;
  description: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  ownershipPercentage: number;
  parent: Entity;
  subsidiary: Entity;
  intercompanyTransactions: IntercompanyTransaction[];
  eliminationEntries: EliminationEntry[];
}

interface ConsolidationWorksheetProps {
  scenario?: ConsolidationScenario;
  mode?: 'guided' | 'free';
  onComplete?: (result: ConsolidationResult) => void;
  allowMultipleEntities?: boolean;
}

interface ConsolidationResult {
  consolidatedAccounts: ConsolidatedAccount[];
  nciAmount: number;
  totalEliminations: number;
  validated: boolean;
  warnings: string[];
  completionTime: number;
  xpEarned: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// Pre-built Scenarios
// ============================================================================

const SCENARIOS: Record<string, ConsolidationScenario> = {
  simple100: {
    id: 'scenario-1',
    name: 'Simple 100% Consolidation',
    description: 'Parent owns 100% of Subsidiary. Only one elimination entry needed.',
    complexity: 'simple',
    ownershipPercentage: 100,
    parent: {
      id: 'parent-1',
      name: 'Parent Company',
      type: 'parent',
      accounts: [
        { id: 'p-1', name: 'Cash', category: 'asset', balance: 50000 },
        { id: 'p-2', name: 'Accounts Receivable', category: 'asset', balance: 30000 },
        { id: 'p-3', name: 'Investment in Subsidiary', category: 'asset', balance: 100000 },
        { id: 'p-4', name: 'Equipment', category: 'asset', balance: 100000 },
        { id: 'p-5', name: 'Accounts Payable', category: 'liability', balance: 20000 },
        { id: 'p-6', name: 'Notes Payable', category: 'liability', balance: 50000 },
        { id: 'p-7', name: 'Common Stock', category: 'equity', balance: 150000 },
        { id: 'p-8', name: 'Retained Earnings', category: 'equity', balance: 60000 },
      ],
    },
    subsidiary: {
      id: 'sub-1',
      name: 'Subsidiary Company',
      type: 'subsidiary',
      accounts: [
        { id: 's-1', name: 'Cash', category: 'asset', balance: 10000 },
        { id: 's-2', name: 'Accounts Receivable', category: 'asset', balance: 15000 },
        { id: 's-3', name: 'Equipment', category: 'asset', balance: 90000 },
        { id: 's-4', name: 'Accounts Payable', category: 'liability', balance: 15000 },
        { id: 's-5', name: 'Common Stock', category: 'equity', balance: 70000 },
        { id: 's-6', name: 'Retained Earnings', category: 'equity', balance: 30000 },
      ],
    },
    intercompanyTransactions: [
      {
        id: 'ic-1',
        type: 'receivable-payable',
        amount: 100000,
        fromEntity: 'parent-1',
        toEntity: 'sub-1',
        description: 'Investment in Subsidiary vs Subsidiary Equity',
      },
    ],
    eliminationEntries: [
      {
        id: 'elim-1',
        description: 'Eliminate Investment in Subsidiary against Subsidiary Equity',
        purpose: 'Remove investment account and subsidiary equity to avoid double counting',
        debits: [
          { account: 'Common Stock', amount: 70000 },
          { account: 'Retained Earnings', amount: 30000 },
        ],
        credits: [
          { account: 'Investment in Subsidiary', amount: 100000 },
        ],
        relatedTransaction: 'ic-1',
      },
    ],
  },

  ownership80: {
    id: 'scenario-2',
    name: '80% Ownership with Intercompany Debt',
    description: 'Parent owns 80% of Subsidiary. Includes intercompany receivable/payable.',
    complexity: 'intermediate',
    ownershipPercentage: 80,
    parent: {
      id: 'parent-2',
      name: 'Parent Corporation',
      type: 'parent',
      accounts: [
        { id: 'p-1', name: 'Cash', category: 'asset', balance: 75000 },
        { id: 'p-2', name: 'Accounts Receivable', category: 'asset', balance: 40000, isIntercompany: true },
        { id: 'p-3', name: 'Investment in Subsidiary', category: 'asset', balance: 80000 },
        { id: 'p-4', name: 'Equipment', category: 'asset', balance: 150000 },
        { id: 'p-5', name: 'Accounts Payable', category: 'liability', balance: 30000 },
        { id: 'p-6', name: 'Notes Payable', category: 'liability', balance: 80000 },
        { id: 'p-7', name: 'Common Stock', category: 'equity', balance: 100000 },
        { id: 'p-8', name: 'Retained Earnings', category: 'equity', balance: 55000 },
      ],
    },
    subsidiary: {
      id: 'sub-2',
      name: 'Subsidiary Inc',
      type: 'subsidiary',
      accounts: [
        { id: 's-1', name: 'Cash', category: 'asset', balance: 8000 },
        { id: 's-2', name: 'Accounts Receivable', category: 'asset', balance: 20000 },
        { id: 's-3', name: 'Equipment', category: 'asset', balance: 72000 },
        { id: 's-4', name: 'Accounts Payable', category: 'liability', balance: 10000, isIntercompany: true },
        { id: 's-5', name: 'Common Stock', category: 'equity', balance: 60000 },
        { id: 's-6', name: 'Retained Earnings', category: 'equity', balance: 30000 },
      ],
    },
    intercompanyTransactions: [
      {
        id: 'ic-1',
        type: 'receivable-payable',
        amount: 10000,
        fromEntity: 'parent-2',
        toEntity: 'sub-2',
        description: 'Intercompany receivable from parent to subsidiary',
      },
    ],
    eliminationEntries: [
      {
        id: 'elim-1',
        description: 'Eliminate Investment against 80% of Subsidiary Equity',
        purpose: 'Remove investment and recognize non-controlling interest',
        debits: [
          { account: 'Common Stock', amount: 60000 },
          { account: 'Retained Earnings', amount: 30000 },
        ],
        credits: [
          { account: 'Investment in Subsidiary', amount: 80000 },
          { account: 'Non-Controlling Interest', amount: 10000 },
        ],
        relatedTransaction: 'ic-1',
      },
      {
        id: 'elim-2',
        description: 'Eliminate Intercompany Receivable/Payable',
        purpose: 'Remove intercompany debt that cancels within the group',
        debits: [
          { account: 'Accounts Payable', amount: 10000 },
        ],
        credits: [
          { account: 'Accounts Receivable', amount: 10000 },
        ],
      },
    ],
  },

  intercompanySales: {
    id: 'scenario-3',
    name: 'Intercompany Sales with Unrealized Profit',
    description: 'Parent owns 90% of Subsidiary. Subsidiary sold goods to Parent with unrealized profit.',
    complexity: 'intermediate',
    ownershipPercentage: 90,
    parent: {
      id: 'parent-3',
      name: 'Parent Industries',
      type: 'parent',
      accounts: [
        { id: 'p-1', name: 'Cash', category: 'asset', balance: 60000 },
        { id: 'p-2', name: 'Accounts Receivable', category: 'asset', balance: 35000 },
        { id: 'p-3', name: 'Inventory', category: 'asset', balance: 48000, isIntercompany: true },
        { id: 'p-4', name: 'Investment in Subsidiary', category: 'asset', balance: 90000 },
        { id: 'p-5', name: 'Equipment', category: 'asset', balance: 120000 },
        { id: 'p-6', name: 'Accounts Payable', category: 'liability', balance: 25000 },
        { id: 'p-7', name: 'Notes Payable', category: 'liability', balance: 60000 },
        { id: 'p-8', name: 'Common Stock', category: 'equity', balance: 120000 },
        { id: 'p-9', name: 'Retained Earnings', category: 'equity', balance: 58000 },
        { id: 'p-10', name: 'Cost of Goods Sold', category: 'expense', balance: 20000, isIntercompany: true },
        { id: 'p-11', name: 'Sales Revenue', category: 'revenue', balance: 50000 },
      ],
    },
    subsidiary: {
      id: 'sub-3',
      name: 'Manufacturing Sub',
      type: 'subsidiary',
      accounts: [
        { id: 's-1', name: 'Cash', category: 'asset', balance: 12000 },
        { id: 's-2', name: 'Accounts Receivable', category: 'asset', balance: 18000 },
        { id: 's-3', name: 'Inventory', category: 'asset', balance: 30000 },
        { id: 's-4', name: 'Equipment', category: 'asset', balance: 60000 },
        { id: 's-5', name: 'Accounts Payable', category: 'liability', balance: 15000 },
        { id: 's-6', name: 'Common Stock', category: 'equity', balance: 70000 },
        { id: 's-7', name: 'Retained Earnings', category: 'equity', balance: 35000 },
        { id: 's-8', name: 'Sales Revenue', category: 'revenue', balance: 40000, isIntercompany: true },
        { id: 's-9', name: 'Cost of Goods Sold', category: 'expense', balance: 12000 },
      ],
    },
    intercompanyTransactions: [
      {
        id: 'ic-1',
        type: 'sales-purchases',
        amount: 20000,
        fromEntity: 'sub-3',
        toEntity: 'parent-3',
        unrealizedProfit: 8000,
        description: 'Subsidiary sold goods to Parent at markup. Goods still in Parent inventory.',
      },
    ],
    eliminationEntries: [
      {
        id: 'elim-1',
        description: 'Eliminate Investment against 90% of Subsidiary Equity',
        purpose: 'Remove investment and recognize NCI',
        debits: [
          { account: 'Common Stock', amount: 70000 },
          { account: 'Retained Earnings', amount: 35000 },
        ],
        credits: [
          { account: 'Investment in Subsidiary', amount: 90000 },
          { account: 'Non-Controlling Interest', amount: 15000 },
        ],
      },
      {
        id: 'elim-2',
        description: 'Eliminate Intercompany Sales',
        purpose: 'Remove intercompany revenue and expense',
        debits: [
          { account: 'Sales Revenue', amount: 20000 },
        ],
        credits: [
          { account: 'Cost of Goods Sold', amount: 20000 },
        ],
      },
      {
        id: 'elim-3',
        description: 'Eliminate Unrealized Profit in Inventory',
        purpose: 'Remove profit on goods not yet sold to external parties',
        debits: [
          { account: 'Cost of Goods Sold', amount: 8000 },
        ],
        credits: [
          { account: 'Inventory', amount: 8000 },
        ],
      },
    ],
  },

  intercompanyLoan: {
    id: 'scenario-4',
    name: 'Intercompany Loan with Interest',
    description: 'Parent owns 75% of Subsidiary. Parent loaned money to Subsidiary with interest.',
    complexity: 'advanced',
    ownershipPercentage: 75,
    parent: {
      id: 'parent-4',
      name: 'Parent Holdings',
      type: 'parent',
      accounts: [
        { id: 'p-1', name: 'Cash', category: 'asset', balance: 45000 },
        { id: 'p-2', name: 'Accounts Receivable', category: 'asset', balance: 28000 },
        { id: 'p-3', name: 'Note Receivable from Sub', category: 'asset', balance: 50000, isIntercompany: true },
        { id: 'p-4', name: 'Interest Receivable', category: 'asset', balance: 2500, isIntercompany: true },
        { id: 'p-5', name: 'Investment in Subsidiary', category: 'asset', balance: 75000 },
        { id: 'p-6', name: 'Equipment', category: 'asset', balance: 110000 },
        { id: 'p-7', name: 'Accounts Payable', category: 'liability', balance: 22000 },
        { id: 'p-8', name: 'Common Stock', category: 'equity', balance: 180000 },
        { id: 'p-9', name: 'Retained Earnings', category: 'equity', balance: 58500 },
        { id: 'p-10', name: 'Interest Income', category: 'revenue', balance: 2500, isIntercompany: true },
      ],
    },
    subsidiary: {
      id: 'sub-4',
      name: 'Operating Sub',
      type: 'subsidiary',
      accounts: [
        { id: 's-1', name: 'Cash', category: 'asset', balance: 15000 },
        { id: 's-2', name: 'Accounts Receivable', category: 'asset', balance: 22000 },
        { id: 's-3', name: 'Equipment', category: 'asset', balance: 80000 },
        { id: 's-4', name: 'Accounts Payable', category: 'liability', balance: 12000 },
        { id: 's-5', name: 'Note Payable to Parent', category: 'liability', balance: 50000, isIntercompany: true },
        { id: 's-6', name: 'Interest Payable', category: 'liability', balance: 2500, isIntercompany: true },
        { id: 's-7', name: 'Common Stock', category: 'equity', balance: 40000 },
        { id: 's-8', name: 'Retained Earnings', category: 'equity', balance: 60000 },
        { id: 's-9', name: 'Interest Expense', category: 'expense', balance: 2500, isIntercompany: true },
      ],
    },
    intercompanyTransactions: [
      {
        id: 'ic-1',
        type: 'loan',
        amount: 50000,
        fromEntity: 'parent-4',
        toEntity: 'sub-4',
        description: 'Parent loaned $50,000 to Subsidiary at 5% interest',
      },
    ],
    eliminationEntries: [
      {
        id: 'elim-1',
        description: 'Eliminate Investment against 75% of Subsidiary Equity',
        purpose: 'Remove investment and recognize NCI',
        debits: [
          { account: 'Common Stock', amount: 40000 },
          { account: 'Retained Earnings', amount: 60000 },
        ],
        credits: [
          { account: 'Investment in Subsidiary', amount: 75000 },
          { account: 'Non-Controlling Interest', amount: 25000 },
        ],
      },
      {
        id: 'elim-2',
        description: 'Eliminate Intercompany Note Receivable/Payable',
        purpose: 'Remove intercompany loan',
        debits: [
          { account: 'Note Payable to Parent', amount: 50000 },
        ],
        credits: [
          { account: 'Note Receivable from Sub', amount: 50000 },
        ],
      },
      {
        id: 'elim-3',
        description: 'Eliminate Intercompany Interest Receivable/Payable',
        purpose: 'Remove intercompany interest accrual',
        debits: [
          { account: 'Interest Payable', amount: 2500 },
        ],
        credits: [
          { account: 'Interest Receivable', amount: 2500 },
        ],
      },
      {
        id: 'elim-4',
        description: 'Eliminate Intercompany Interest Income/Expense',
        purpose: 'Remove intercompany interest transactions',
        debits: [
          { account: 'Interest Income', amount: 2500 },
        ],
        credits: [
          { account: 'Interest Expense', amount: 2500 },
        ],
      },
    ],
  },

  complexMultiEntity: {
    id: 'scenario-5',
    name: 'Complex Multi-Transaction Consolidation',
    description: 'Parent owns 80% of Subsidiary. Multiple intercompany transactions including sales, dividends, and receivables.',
    complexity: 'advanced',
    ownershipPercentage: 80,
    parent: {
      id: 'parent-5',
      name: 'Apex Corporation',
      type: 'parent',
      accounts: [
        { id: 'p-1', name: 'Cash', category: 'asset', balance: 85000 },
        { id: 'p-2', name: 'Accounts Receivable', category: 'asset', balance: 45000, isIntercompany: true },
        { id: 'p-3', name: 'Inventory', category: 'asset', balance: 60000, isIntercompany: true },
        { id: 'p-4', name: 'Investment in Subsidiary', category: 'asset', balance: 160000 },
        { id: 'p-5', name: 'Equipment', category: 'asset', balance: 200000 },
        { id: 'p-6', name: 'Accounts Payable', category: 'liability', balance: 40000 },
        { id: 'p-7', name: 'Notes Payable', category: 'liability', balance: 100000 },
        { id: 'p-8', name: 'Common Stock', category: 'equity', balance: 250000 },
        { id: 'p-9', name: 'Retained Earnings', category: 'equity', balance: 160000 },
        { id: 'p-10', name: 'Dividend Income', category: 'revenue', balance: 8000, isIntercompany: true },
        { id: 'p-11', name: 'Sales Revenue', category: 'revenue', balance: 150000 },
        { id: 'p-12', name: 'Cost of Goods Sold', category: 'expense', balance: 50000, isIntercompany: true },
      ],
    },
    subsidiary: {
      id: 'sub-5',
      name: 'Beta Industries',
      type: 'subsidiary',
      accounts: [
        { id: 's-1', name: 'Cash', category: 'asset', balance: 20000 },
        { id: 's-2', name: 'Accounts Receivable', category: 'asset', balance: 35000 },
        { id: 's-3', name: 'Inventory', category: 'asset', balance: 45000 },
        { id: 's-4', name: 'Equipment', category: 'asset', balance: 100000 },
        { id: 's-5', name: 'Accounts Payable', category: 'liability', balance: 25000, isIntercompany: true },
        { id: 's-6', name: 'Common Stock', category: 'equity', balance: 120000 },
        { id: 's-7', name: 'Retained Earnings', category: 'equity', balance: 80000 },
        { id: 's-8', name: 'Sales Revenue', category: 'revenue', balance: 100000, isIntercompany: true },
        { id: 's-9', name: 'Cost of Goods Sold', category: 'expense', balance: 40000 },
        { id: 's-10', name: 'Dividends Declared', category: 'equity', balance: -10000, isIntercompany: true },
      ],
    },
    intercompanyTransactions: [
      {
        id: 'ic-1',
        type: 'receivable-payable',
        amount: 15000,
        fromEntity: 'parent-5',
        toEntity: 'sub-5',
        description: 'Intercompany receivable/payable',
      },
      {
        id: 'ic-2',
        type: 'sales-purchases',
        amount: 30000,
        fromEntity: 'sub-5',
        toEntity: 'parent-5',
        unrealizedProfit: 10000,
        description: 'Subsidiary sold goods to Parent',
      },
      {
        id: 'ic-3',
        type: 'dividend',
        amount: 10000,
        fromEntity: 'sub-5',
        toEntity: 'parent-5',
        description: 'Subsidiary paid dividends to Parent (80%)',
      },
    ],
    eliminationEntries: [
      {
        id: 'elim-1',
        description: 'Eliminate Investment against 80% of Subsidiary Equity',
        purpose: 'Remove investment and recognize NCI',
        debits: [
          { account: 'Common Stock', amount: 120000 },
          { account: 'Retained Earnings', amount: 80000 },
        ],
        credits: [
          { account: 'Investment in Subsidiary', amount: 160000 },
          { account: 'Non-Controlling Interest', amount: 40000 },
        ],
      },
      {
        id: 'elim-2',
        description: 'Eliminate Intercompany Receivable/Payable',
        purpose: 'Remove intercompany debt',
        debits: [
          { account: 'Accounts Payable', amount: 15000 },
        ],
        credits: [
          { account: 'Accounts Receivable', amount: 15000 },
        ],
      },
      {
        id: 'elim-3',
        description: 'Eliminate Intercompany Sales',
        purpose: 'Remove intercompany revenue and expense',
        debits: [
          { account: 'Sales Revenue', amount: 30000 },
        ],
        credits: [
          { account: 'Cost of Goods Sold', amount: 30000 },
        ],
      },
      {
        id: 'elim-4',
        description: 'Eliminate Unrealized Profit in Inventory',
        purpose: 'Remove unrealized profit',
        debits: [
          { account: 'Cost of Goods Sold', amount: 10000 },
        ],
        credits: [
          { account: 'Inventory', amount: 10000 },
        ],
      },
      {
        id: 'elim-5',
        description: 'Eliminate Intercompany Dividends',
        purpose: 'Remove dividend income from Parent (80% of $10,000)',
        debits: [
          { account: 'Dividend Income', amount: 8000 },
        ],
        credits: [
          { account: 'Dividends Declared', amount: 8000 },
        ],
      },
    ],
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

function calculateNCI(
  subsidiaryEquity: Account[],
  ownershipPercentage: number
): number {
  const totalEquity = subsidiaryEquity.reduce((sum, acc) => sum + acc.balance, 0);
  const nciPercentage = 100 - ownershipPercentage;
  return (totalEquity * nciPercentage) / 100;
}

function detectIntercompanyTransactions(
  parent: Entity,
  subsidiary: Entity
): IntercompanyTransaction[] {
  const detected: IntercompanyTransaction[] = [];

  // Detect investment account
  const investment = parent.accounts.find(
    (acc) => acc.name.toLowerCase().includes('investment')
  );
  if (investment) {
    detected.push({
      id: `ic-${detected.length + 1}`,
      type: 'receivable-payable',
      amount: investment.balance,
      fromEntity: parent.id,
      toEntity: subsidiary.id,
      description: 'Investment in Subsidiary detected',
    });
  }

  // Detect intercompany receivables/payables
  const intercompanyAccounts = [
    ...parent.accounts.filter((acc) => acc.isIntercompany),
    ...subsidiary.accounts.filter((acc) => acc.isIntercompany),
  ];

  if (intercompanyAccounts.length > 0) {
    detected.push({
      id: `ic-${detected.length + 1}`,
      type: 'receivable-payable',
      amount: 0,
      fromEntity: parent.id,
      toEntity: subsidiary.id,
      description: 'Potential intercompany balances detected',
    });
  }

  return detected;
}

function generateEliminationEntry(
  transaction: IntercompanyTransaction,
  ownershipPercentage: number
): EliminationEntry {
  const entries: EliminationEntry[] = [];

  switch (transaction.type) {
    case 'receivable-payable':
      return {
        id: `elim-${Date.now()}`,
        description: 'Eliminate Intercompany Receivable/Payable',
        purpose: 'Remove intercompany debt',
        debits: [{ account: 'Accounts Payable', amount: transaction.amount }],
        credits: [{ account: 'Accounts Receivable', amount: transaction.amount }],
        relatedTransaction: transaction.id,
      };

    case 'sales-purchases':
      return {
        id: `elim-${Date.now()}`,
        description: 'Eliminate Intercompany Sales',
        purpose: 'Remove intercompany revenue and purchases',
        debits: [{ account: 'Sales Revenue', amount: transaction.amount }],
        credits: [{ account: 'Cost of Goods Sold', amount: transaction.amount }],
        relatedTransaction: transaction.id,
      };

    case 'loan':
      return {
        id: `elim-${Date.now()}`,
        description: 'Eliminate Intercompany Loan',
        purpose: 'Remove intercompany loan',
        debits: [{ account: 'Note Payable', amount: transaction.amount }],
        credits: [{ account: 'Note Receivable', amount: transaction.amount }],
        relatedTransaction: transaction.id,
      };

    case 'dividend':
      const parentShare = (transaction.amount * ownershipPercentage) / 100;
      return {
        id: `elim-${Date.now()}`,
        description: 'Eliminate Intercompany Dividends',
        purpose: 'Remove dividend income recognized by parent',
        debits: [{ account: 'Dividend Income', amount: parentShare }],
        credits: [{ account: 'Dividends Declared', amount: parentShare }],
        relatedTransaction: transaction.id,
      };

    default:
      return {
        id: `elim-${Date.now()}`,
        description: 'Custom Elimination Entry',
        purpose: 'Custom elimination',
        debits: [],
        credits: [],
        relatedTransaction: transaction.id,
      };
  }
}

function consolidate(
  parent: Entity,
  subsidiary: Entity,
  eliminations: EliminationEntry[]
): ConsolidatedAccount[] {
  const accountMap = new Map<string, ConsolidatedAccount>();

  // Add parent accounts
  parent.accounts.forEach((acc) => {
    accountMap.set(acc.name, {
      name: acc.name,
      category: acc.category,
      parentBalance: acc.balance,
      subsidiaryBalance: 0,
      eliminationDebit: 0,
      eliminationCredit: 0,
      consolidatedBalance: acc.balance,
    });
  });

  // Add subsidiary accounts
  subsidiary.accounts.forEach((acc) => {
    if (accountMap.has(acc.name)) {
      const existing = accountMap.get(acc.name)!;
      existing.subsidiaryBalance = acc.balance;
      existing.consolidatedBalance += acc.balance;
    } else {
      accountMap.set(acc.name, {
        name: acc.name,
        category: acc.category,
        parentBalance: 0,
        subsidiaryBalance: acc.balance,
        eliminationDebit: 0,
        eliminationCredit: 0,
        consolidatedBalance: acc.balance,
      });
    }
  });

  // Apply eliminations
  eliminations.forEach((elim) => {
    elim.debits.forEach((debit) => {
      if (accountMap.has(debit.account)) {
        const acc = accountMap.get(debit.account)!;
        acc.eliminationDebit += debit.amount;
        acc.consolidatedBalance -= debit.amount;
      }
    });

    elim.credits.forEach((credit) => {
      if (accountMap.has(credit.account)) {
        const acc = accountMap.get(credit.account)!;
        acc.eliminationCredit += credit.amount;
        acc.consolidatedBalance -= credit.amount;
      }
    });
  });

  return Array.from(accountMap.values());
}

function validateConsolidation(
  parent: Entity,
  subsidiary: Entity,
  eliminations: EliminationEntry[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if trial balances balance
  const parentBalance =
    parent.accounts
      .filter((a) => a.category === 'asset')
      .reduce((sum, a) => sum + a.balance, 0) -
    parent.accounts
      .filter((a) => a.category === 'liability' || a.category === 'equity')
      .reduce((sum, a) => sum + a.balance, 0);

  if (Math.abs(parentBalance) > 0.01) {
    errors.push('Parent trial balance does not balance');
  }

  const subBalance =
    subsidiary.accounts
      .filter((a) => a.category === 'asset')
      .reduce((sum, a) => sum + a.balance, 0) -
    subsidiary.accounts
      .filter((a) => a.category === 'liability' || a.category === 'equity')
      .reduce((sum, a) => sum + a.balance, 0);

  if (Math.abs(subBalance) > 0.01) {
    errors.push('Subsidiary trial balance does not balance');
  }

  // Check if elimination entries balance
  eliminations.forEach((elim, index) => {
    const totalDebits = elim.debits.reduce((sum, d) => sum + d.amount, 0);
    const totalCredits = elim.credits.reduce((sum, c) => sum + c.amount, 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      errors.push(`Elimination entry ${index + 1} does not balance`);
    }
  });

  // Check for investment account
  const hasInvestment = parent.accounts.some((a) =>
    a.name.toLowerCase().includes('investment')
  );
  if (!hasInvestment) {
    warnings.push('No investment account found in parent company');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
}

function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// Export Functions
// ============================================================================

function exportToExcel(
  parent: Entity,
  subsidiary: Entity,
  eliminations: EliminationEntry[],
  consolidated: ConsolidatedAccount[],
  ownershipPercentage: number
): void {
  let csvContent = 'data:text/csv;charset=utf-8,';

  // Sheet 1: Parent Trial Balance
  csvContent += 'PARENT COMPANY TRIAL BALANCE\n';
  csvContent += 'Account,Category,Balance\n';
  parent.accounts.forEach((acc) => {
    csvContent += `"${acc.name}",${acc.category},$${acc.balance}\n`;
  });

  csvContent += '\n\n';

  // Sheet 2: Subsidiary Trial Balance
  csvContent += 'SUBSIDIARY COMPANY TRIAL BALANCE\n';
  csvContent += 'Account,Category,Balance\n';
  subsidiary.accounts.forEach((acc) => {
    csvContent += `"${acc.name}",${acc.category},$${acc.balance}\n`;
  });

  csvContent += '\n\n';

  // Sheet 3: Elimination Entries
  csvContent += 'ELIMINATION ENTRIES\n';
  csvContent += 'Description,Purpose,Debit Account,Debit Amount,Credit Account,Credit Amount\n';
  eliminations.forEach((elim) => {
    const maxLength = Math.max(elim.debits.length, elim.credits.length);
    for (let i = 0; i < maxLength; i++) {
      const debit = elim.debits[i] || { account: '', amount: 0 };
      const credit = elim.credits[i] || { account: '', amount: 0 };
      csvContent += `"${i === 0 ? elim.description : ''}","${i === 0 ? elim.purpose : ''}","${debit.account}",$${debit.amount},"${credit.account}",$${credit.amount}\n`;
    }
  });

  csvContent += '\n\n';

  // Sheet 4: Consolidation Worksheet
  csvContent += 'CONSOLIDATION WORKSHEET\n';
  csvContent +=
    'Account,Parent Balance,Subsidiary Balance,Elimination DR,Elimination CR,Consolidated Balance\n';
  consolidated.forEach((acc) => {
    csvContent += `"${acc.name}",$${acc.parentBalance},$${acc.subsidiaryBalance},$${acc.eliminationDebit},$${acc.eliminationCredit},$${acc.consolidatedBalance}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `Consolidation_Worksheet_${new Date().toISOString().split('T')[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToPDF(
  parent: Entity,
  subsidiary: Entity,
  eliminations: EliminationEntry[],
  consolidated: ConsolidatedAccount[],
  ownershipPercentage: number
): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Consolidation Worksheet</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
        h2 { color: #666; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }
        th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
        th { background-color: #f4f4f4; font-weight: bold; }
        .parent { background-color: #e3f2fd; }
        .sub { background-color: #e8f5e9; }
        .elim { background-color: #fff9c4; }
        .consol { background-color: #f3e5f5; font-weight: bold; }
        .number { text-align: right; font-family: monospace; }
      </style>
    </head>
    <body>
      <h1>Consolidation Worksheet</h1>
      <p><strong>Parent:</strong> ${parent.name}</p>
      <p><strong>Subsidiary:</strong> ${subsidiary.name}</p>
      <p><strong>Ownership:</strong> ${ownershipPercentage}%</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

      <h2>Consolidation Worksheet</h2>
      <table>
        <thead>
          <tr>
            <th>Account</th>
            <th class="parent number">Parent</th>
            <th class="sub number">Subsidiary</th>
            <th class="elim number">Elim DR</th>
            <th class="elim number">Elim CR</th>
            <th class="consol number">Consolidated</th>
          </tr>
        </thead>
        <tbody>
          ${consolidated
            .map(
              (acc) => `
            <tr>
              <td>${acc.name}</td>
              <td class="number">${acc.parentBalance.toLocaleString()}</td>
              <td class="number">${acc.subsidiaryBalance.toLocaleString()}</td>
              <td class="number">${acc.eliminationDebit > 0 ? acc.eliminationDebit.toLocaleString() : '-'}</td>
              <td class="number">${acc.eliminationCredit > 0 ? acc.eliminationCredit.toLocaleString() : '-'}</td>
              <td class="number">${acc.consolidatedBalance.toLocaleString()}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <h2>Elimination Entries</h2>
      ${eliminations
        .map(
          (elim, i) => `
        <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd;">
          <h3>Entry ${i + 1}: ${elim.description}</h3>
          <p><strong>Purpose:</strong> ${elim.purpose}</p>
          <table style="width: 50%;">
            <tr><th>Account</th><th>Debit</th><th>Credit</th></tr>
            ${elim.debits
              .map(
                (d) => `
              <tr>
                <td>${d.account}</td>
                <td class="number">${d.amount.toLocaleString()}</td>
                <td></td>
              </tr>
            `
              )
              .join('')}
            ${elim.credits
              .map(
                (c) => `
              <tr>
                <td>${c.account}</td>
                <td></td>
                <td class="number">${c.amount.toLocaleString()}</td>
              </tr>
            `
              )
              .join('')}
          </table>
        </div>
      `
        )
        .join('')}

      <p style="margin-top: 40px; font-size: 12px; color: #666;">
        Generated by Accountrix Consolidation Worksheet on ${new Date().toLocaleString()}
      </p>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

// ============================================================================
// Main Component
// ============================================================================

export default function ConsolidationWorksheet({
  scenario,
  mode = 'guided',
  onComplete,
  allowMultipleEntities = false,
}: ConsolidationWorksheetProps) {
  const [currentMode, setCurrentMode] = useState<'guided' | 'free'>(mode);
  const [currentStep, setCurrentStep] = useState(1);
  const [parent, setParent] = useState<Entity | null>(
    scenario?.parent || null
  );
  const [subsidiary, setSubsidiary] = useState<Entity | null>(
    scenario?.subsidiary || null
  );
  const [ownershipPercentage, setOwnershipPercentage] = useState(
    scenario?.ownershipPercentage || 80
  );
  const [intercompanyTransactions, setIntercompanyTransactions] = useState<
    IntercompanyTransaction[]
  >(scenario?.intercompanyTransactions || []);
  const [eliminationEntries, setEliminationEntries] = useState<
    EliminationEntry[]
  >(scenario?.eliminationEntries || []);
  const [showHelp, setShowHelp] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    assets: true,
    liabilities: true,
    equity: true,
    revenue: false,
    expense: false,
  });

  // Calculate consolidated accounts
  const consolidatedAccounts = useMemo(() => {
    if (!parent || !subsidiary) return [];
    return consolidate(parent, subsidiary, eliminationEntries);
  }, [parent, subsidiary, eliminationEntries]);

  // Calculate NCI
  const nciAmount = useMemo(() => {
    if (!subsidiary) return 0;
    const equityAccounts = subsidiary.accounts.filter(
      (a) => a.category === 'equity'
    );
    return calculateNCI(equityAccounts, ownershipPercentage);
  }, [subsidiary, ownershipPercentage]);

  // Validation
  const validation = useMemo(() => {
    if (!parent || !subsidiary) {
      return { isValid: false, errors: ['Missing entities'], warnings: [] };
    }
    return validateConsolidation(parent, subsidiary, eliminationEntries);
  }, [parent, subsidiary, eliminationEntries]);

  // Load scenario
  const loadScenario = (scenarioKey: string) => {
    const scen = SCENARIOS[scenarioKey];
    if (scen) {
      setParent(scen.parent);
      setSubsidiary(scen.subsidiary);
      setOwnershipPercentage(scen.ownershipPercentage);
      setIntercompanyTransactions(scen.intercompanyTransactions);
      setEliminationEntries(scen.eliminationEntries);
      setCurrentStep(1);
    }
  };

  // Reset worksheet
  const resetWorksheet = () => {
    if (confirm('Reset the entire worksheet? This cannot be undone.')) {
      setParent(null);
      setSubsidiary(null);
      setIntercompanyTransactions([]);
      setEliminationEntries([]);
      setCurrentStep(1);
    }
  };

  // Add elimination entry
  const addEliminationEntry = () => {
    const newEntry: EliminationEntry = {
      id: generateId(),
      description: '',
      purpose: '',
      debits: [{ account: '', amount: 0 }],
      credits: [{ account: '', amount: 0 }],
    };
    setEliminationEntries([...eliminationEntries, newEntry]);
  };

  // Update elimination entry
  const updateEliminationEntry = (
    id: string,
    updates: Partial<EliminationEntry>
  ) => {
    setEliminationEntries(
      eliminationEntries.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  // Delete elimination entry
  const deleteEliminationEntry = (id: string) => {
    setEliminationEntries(eliminationEntries.filter((e) => e.id !== id));
  };

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Get accounts by category
  const getAccountsByCategory = (
    category: string
  ): ConsolidatedAccount[] => {
    return consolidatedAccounts.filter((acc) => acc.category === category);
  };

  const totalsByCategory = useMemo(() => {
    const totals: Record<string, any> = {};
    ['asset', 'liability', 'equity', 'revenue', 'expense'].forEach(
      (category) => {
        const accounts = getAccountsByCategory(category);
        totals[category] = {
          parent: accounts.reduce((sum, a) => sum + a.parentBalance, 0),
          subsidiary: accounts.reduce((sum, a) => sum + a.subsidiaryBalance, 0),
          elimDR: accounts.reduce((sum, a) => sum + a.eliminationDebit, 0),
          elimCR: accounts.reduce((sum, a) => sum + a.eliminationCredit, 0),
          consolidated: accounts.reduce(
            (sum, a) => sum + a.consolidatedBalance,
            0
          ),
        };
      }
    );
    return totals;
  }, [consolidatedAccounts]);

  const steps = [
    { number: 1, title: 'Enter individual financials', completed: !!parent && !!subsidiary },
    { number: 2, title: 'Identify intercompany transactions', completed: intercompanyTransactions.length > 0 },
    { number: 3, title: 'Record elimination entries', completed: eliminationEntries.length > 0 },
    { number: 4, title: 'Calculate non-controlling interest', completed: ownershipPercentage < 100 },
    { number: 5, title: 'Generate consolidated statements', completed: consolidatedAccounts.length > 0 },
  ];

  return (
    <TooltipProvider>
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-8 h-8" />
              Consolidation Worksheet
            </h1>
            <p className="text-gray-600 mt-1">
              Multi-Entity Consolidation Accounting - Learn how to prepare
              consolidated financial statements
            </p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <Book className="w-4 h-4 mr-2" />
                  Help
                </Button>
              </TooltipTrigger>
              <TooltipContent>View learning resources and guides</TooltipContent>
            </Tooltip>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentMode(currentMode === 'guided' ? 'free' : 'guided')
              }
            >
              {currentMode === 'guided' ? 'Free Mode' : 'Guided Mode'}
            </Button>
          </div>
        </div>

        {/* Help Section */}
        {showHelp && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">
                Consolidation Concepts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">What is Consolidation?</h3>
                <p className="text-sm text-gray-700">
                  When a parent company owns more than 50% of a subsidiary, they
                  must prepare consolidated financial statements. This means
                  combining both entities' accounts and eliminating intercompany
                  transactions to present them as one economic entity.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Key Concepts:</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>
                    <strong>Investment Elimination:</strong> Remove the parent's
                    investment account against the subsidiary's equity
                  </li>
                  <li>
                    <strong>Intercompany Eliminations:</strong> Remove all
                    transactions between the entities (debt, sales, loans)
                  </li>
                  <li>
                    <strong>Non-Controlling Interest (NCI):</strong> If ownership
                    is less than 100%, recognize the minority shareholders' share
                  </li>
                  <li>
                    <strong>Unrealized Profits:</strong> Eliminate profits on
                    inventory/assets not yet sold to external parties
                  </li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF Guide
                </Button>
                <Button variant="outline" size="sm">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Watch Tutorial
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scenario Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(SCENARIOS).map(([key, scen]) => (
                <Button
                  key={key}
                  variant="outline"
                  className="h-auto flex flex-col items-start p-4"
                  onClick={() => loadScenario(key)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        scen.complexity === 'simple'
                          ? 'default'
                          : scen.complexity === 'intermediate'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {scen.complexity}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {scen.ownershipPercentage}% ownership
                    </span>
                  </div>
                  <div className="font-semibold text-left mb-1">
                    {scen.name}
                  </div>
                  <div className="text-xs text-gray-600 text-left">
                    {scen.description}
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps (Guided Mode) */}
        {currentMode === 'guided' && (
          <Card>
            <CardHeader>
              <CardTitle>Consolidation Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    onClick={() => setCurrentStep(step.number)}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        step.completed
                          ? 'bg-green-500 text-white'
                          : currentStep === step.number
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{step.title}</div>
                      {currentStep === step.number && (
                        <div className="text-xs text-blue-600">
                          Current step
                        </div>
                      )}
                    </div>
                    {currentStep === step.number && (
                      <ArrowRight className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Progress
                  value={(steps.filter((s) => s.completed).length / steps.length) * 100}
                  className="h-2"
                />
                <p className="text-sm text-gray-600 mt-2">
                  {steps.filter((s) => s.completed).length} of {steps.length}{' '}
                  steps completed
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validation Warnings */}
        {validation.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Errors:</strong>
              <ul className="list-disc list-inside mt-2">
                {validation.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {validation.warnings.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warnings:</strong>
              <ul className="list-disc list-inside mt-2">
                {validation.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Ownership Percentage */}
        {parent && subsidiary && (
          <Card>
            <CardHeader>
              <CardTitle>Ownership Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <Label>Parent Ownership Percentage</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input
                      type="number"
                      min="50"
                      max="100"
                      value={ownershipPercentage}
                      onChange={(e) =>
                        setOwnershipPercentage(
                          Math.max(50, Math.min(100, parseFloat(e.target.value) || 80))
                        )
                      }
                      className="w-24"
                    />
                    <span className="text-2xl font-bold">%</span>
                    <Progress
                      value={ownershipPercentage}
                      className="flex-1 h-3"
                    />
                  </div>
                </div>
                {ownershipPercentage < 100 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-sm font-semibold text-yellow-900 mb-1">
                      Non-Controlling Interest
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">
                      {100 - ownershipPercentage}%
                    </div>
                    <div className="text-xs text-yellow-700 mt-1">
                      NCI Amount: ${formatCurrency(nciAmount)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Consolidation Worksheet Table */}
        {parent && subsidiary && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Consolidation Worksheet</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      exportToExcel(
                        parent,
                        subsidiary,
                        eliminationEntries,
                        consolidatedAccounts,
                        ownershipPercentage
                      )
                    }
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      exportToPDF(
                        parent,
                        subsidiary,
                        eliminationEntries,
                        consolidatedAccounts,
                        ownershipPercentage
                      )
                    }
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="text-left p-3 font-semibold">Account</th>
                      <th className="text-right p-3 font-semibold bg-blue-50">
                        {parent.name}
                      </th>
                      <th className="text-right p-3 font-semibold bg-green-50">
                        {subsidiary.name}
                      </th>
                      <th className="text-right p-3 font-semibold bg-yellow-50">
                        Elim DR
                      </th>
                      <th className="text-right p-3 font-semibold bg-yellow-50">
                        Elim CR
                      </th>
                      <th className="text-right p-3 font-semibold bg-purple-50">
                        Consolidated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Assets */}
                    <tr
                      className="bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleSection('assets')}
                    >
                      <td className="p-3 font-bold flex items-center gap-2">
                        {expandedSections.assets ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        ASSETS
                      </td>
                      <td className="text-right p-3 font-bold">
                        ${formatCurrency(totalsByCategory.asset?.parent || 0)}
                      </td>
                      <td className="text-right p-3 font-bold">
                        ${formatCurrency(totalsByCategory.asset?.subsidiary || 0)}
                      </td>
                      <td className="text-right p-3 font-bold">
                        ${formatCurrency(totalsByCategory.asset?.elimDR || 0)}
                      </td>
                      <td className="text-right p-3 font-bold">
                        ${formatCurrency(totalsByCategory.asset?.elimCR || 0)}
                      </td>
                      <td className="text-right p-3 font-bold">
                        $
                        {formatCurrency(
                          totalsByCategory.asset?.consolidated || 0
                        )}
                      </td>
                    </tr>
                    {expandedSections.assets &&
                      getAccountsByCategory('asset').map((acc) => (
                        <tr
                          key={acc.name}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-3 pl-8">{acc.name}</td>
                          <td className="text-right p-3 bg-blue-50 font-mono">
                            {acc.parentBalance > 0
                              ? formatCurrency(acc.parentBalance)
                              : '-'}
                          </td>
                          <td className="text-right p-3 bg-green-50 font-mono">
                            {acc.subsidiaryBalance > 0
                              ? formatCurrency(acc.subsidiaryBalance)
                              : '-'}
                          </td>
                          <td className="text-right p-3 bg-yellow-50 font-mono">
                            {acc.eliminationDebit > 0
                              ? formatCurrency(acc.eliminationDebit)
                              : '-'}
                          </td>
                          <td className="text-right p-3 bg-yellow-50 font-mono">
                            {acc.eliminationCredit > 0
                              ? formatCurrency(acc.eliminationCredit)
                              : '-'}
                          </td>
                          <td className="text-right p-3 bg-purple-50 font-mono font-semibold">
                            {acc.consolidatedBalance !== 0
                              ? formatCurrency(acc.consolidatedBalance)
                              : '-'}
                          </td>
                        </tr>
                      ))}

                    {/* Liabilities */}
                    <tr
                      className="bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleSection('liabilities')}
                    >
                      <td className="p-3 font-bold flex items-center gap-2">
                        {expandedSections.liabilities ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        LIABILITIES
                      </td>
                      <td className="text-right p-3 font-bold">
                        $
                        {formatCurrency(totalsByCategory.liability?.parent || 0)}
                      </td>
                      <td className="text-right p-3 font-bold">
                        $
                        {formatCurrency(
                          totalsByCategory.liability?.subsidiary || 0
                        )}
                      </td>
                      <td className="text-right p-3 font-bold">
                        $
                        {formatCurrency(totalsByCategory.liability?.elimDR || 0)}
                      </td>
                      <td className="text-right p-3 font-bold">
                        $
                        {formatCurrency(totalsByCategory.liability?.elimCR || 0)}
                      </td>
                      <td className="text-right p-3 font-bold">
                        $
                        {formatCurrency(
                          totalsByCategory.liability?.consolidated || 0
                        )}
                      </td>
                    </tr>
                    {expandedSections.liabilities &&
                      getAccountsByCategory('liability').map((acc) => (
                        <tr
                          key={acc.name}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-3 pl-8">{acc.name}</td>
                          <td className="text-right p-3 bg-blue-50 font-mono">
                            {acc.parentBalance > 0
                              ? formatCurrency(acc.parentBalance)
                              : '-'}
                          </td>
                          <td className="text-right p-3 bg-green-50 font-mono">
                            {acc.subsidiaryBalance > 0
                              ? formatCurrency(acc.subsidiaryBalance)
                              : '-'}
                          </td>
                          <td className="text-right p-3 bg-yellow-50 font-mono">
                            {acc.eliminationDebit > 0
                              ? formatCurrency(acc.eliminationDebit)
                              : '-'}
                          </td>
                          <td className="text-right p-3 bg-yellow-50 font-mono">
                            {acc.eliminationCredit > 0
                              ? formatCurrency(acc.eliminationCredit)
                              : '-'}
                          </td>
                          <td className="text-right p-3 bg-purple-50 font-mono font-semibold">
                            {acc.consolidatedBalance !== 0
                              ? formatCurrency(acc.consolidatedBalance)
                              : '-'}
                          </td>
                        </tr>
                      ))}

                    {/* NCI Row */}
                    {ownershipPercentage < 100 && (
                      <tr className="border-b border-gray-200 bg-yellow-50">
                        <td className="p-3 pl-8 font-semibold">
                          Non-Controlling Interest
                        </td>
                        <td className="text-right p-3 bg-blue-50 font-mono">
                          -
                        </td>
                        <td className="text-right p-3 bg-green-50 font-mono">
                          -
                        </td>
                        <td className="text-right p-3 bg-yellow-50 font-mono">
                          -
                        </td>
                        <td className="text-right p-3 bg-yellow-50 font-mono">
                          {formatCurrency(nciAmount)}
                        </td>
                        <td className="text-right p-3 bg-purple-50 font-mono font-semibold">
                          {formatCurrency(nciAmount)}
                        </td>
                      </tr>
                    )}

                    {/* Equity */}
                    <tr
                      className="bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleSection('equity')}
                    >
                      <td className="p-3 font-bold flex items-center gap-2">
                        {expandedSections.equity ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        EQUITY
                      </td>
                      <td className="text-right p-3 font-bold">
                        ${formatCurrency(totalsByCategory.equity?.parent || 0)}
                      </td>
                      <td className="text-right p-3 font-bold">
                        $
                        {formatCurrency(totalsByCategory.equity?.subsidiary || 0)}
                      </td>
                      <td className="text-right p-3 font-bold">
                        ${formatCurrency(totalsByCategory.equity?.elimDR || 0)}
                      </td>
                      <td className="text-right p-3 font-bold">
                        ${formatCurrency(totalsByCategory.equity?.elimCR || 0)}
                      </td>
                      <td className="text-right p-3 font-bold">
                        $
                        {formatCurrency(
                          totalsByCategory.equity?.consolidated || 0
                        )}
                      </td>
                    </tr>
                    {expandedSections.equity &&
                      getAccountsByCategory('equity').map((acc) => (
                        <tr
                          key={acc.name}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-3 pl-8">{acc.name}</td>
                          <td className="text-right p-3 bg-blue-50 font-mono">
                            {acc.parentBalance > 0
                              ? formatCurrency(acc.parentBalance)
                              : '-'}
                          </td>
                          <td className="text-right p-3 bg-green-50 font-mono">
                            {acc.subsidiaryBalance > 0
                              ? formatCurrency(acc.subsidiaryBalance)
                              : '-'}
                          </td>
                          <td className="text-right p-3 bg-yellow-50 font-mono">
                            {acc.eliminationDebit > 0
                              ? formatCurrency(acc.eliminationDebit)
                              : '-'}
                          </td>
                          <td className="text-right p-3 bg-yellow-50 font-mono">
                            {acc.eliminationCredit > 0
                              ? formatCurrency(acc.eliminationCredit)
                              : '-'}
                          </td>
                          <td className="text-right p-3 bg-purple-50 font-mono font-semibold">
                            {acc.consolidatedBalance !== 0
                              ? formatCurrency(acc.consolidatedBalance)
                              : '-'}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Elimination Entries */}
        {parent && subsidiary && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Elimination Entries</CardTitle>
                <Button size="sm" onClick={addEliminationEntry}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {eliminationEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No elimination entries yet</p>
                  <p className="text-sm">
                    Add entries to eliminate intercompany transactions
                  </p>
                </div>
              ) : (
                eliminationEntries.map((entry, index) => (
                  <EliminationEntryCard
                    key={entry.id}
                    entry={entry}
                    index={index}
                    onUpdate={updateEliminationEntry}
                    onDelete={deleteEliminationEntry}
                    allAccounts={[
                      ...parent.accounts.map((a) => a.name),
                      ...subsidiary.accounts.map((a) => a.name),
                      'Non-Controlling Interest',
                    ]}
                  />
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-between">
          <Button variant="outline" onClick={resetWorksheet}>
            Reset Worksheet
          </Button>
          <div className="flex gap-3">
            {currentMode === 'guided' && currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous Step
              </Button>
            )}
            {currentMode === 'guided' && currentStep < 5 && (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Next Step
              </Button>
            )}
            {validation.isValid && (
              <Button
                onClick={() => {
                  const result: ConsolidationResult = {
                    consolidatedAccounts,
                    nciAmount,
                    totalEliminations: eliminationEntries.length,
                    validated: true,
                    warnings: validation.warnings,
                    completionTime: Date.now(),
                    xpEarned:
                      scenario?.complexity === 'simple'
                        ? 50
                        : scenario?.complexity === 'intermediate'
                        ? 75
                        : 100,
                  };
                  onComplete?.(result);
                  alert(
                    `Consolidation complete! You earned ${result.xpEarned} XP`
                  );
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Consolidation
              </Button>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ============================================================================
// Elimination Entry Card Component
// ============================================================================

interface EliminationEntryCardProps {
  entry: EliminationEntry;
  index: number;
  onUpdate: (id: string, updates: Partial<EliminationEntry>) => void;
  onDelete: (id: string) => void;
  allAccounts: string[];
}

function EliminationEntryCard({
  entry,
  index,
  onUpdate,
  onDelete,
  allAccounts,
}: EliminationEntryCardProps) {
  const totalDebits = entry.debits.reduce((sum, d) => sum + d.amount, 0);
  const totalCredits = entry.credits.reduce((sum, c) => sum + c.amount, 0);
  const balanced = Math.abs(totalDebits - totalCredits) < 0.01;

  const addDebitLine = () => {
    onUpdate(entry.id, {
      debits: [...entry.debits, { account: '', amount: 0 }],
    });
  };

  const addCreditLine = () => {
    onUpdate(entry.id, {
      credits: [...entry.credits, { account: '', amount: 0 }],
    });
  };

  const updateDebit = (
    idx: number,
    field: 'account' | 'amount',
    value: string | number
  ) => {
    const newDebits = [...entry.debits];
    newDebits[idx] = { ...newDebits[idx], [field]: value };
    onUpdate(entry.id, { debits: newDebits });
  };

  const updateCredit = (
    idx: number,
    field: 'account' | 'amount',
    value: string | number
  ) => {
    const newCredits = [...entry.credits];
    newCredits[idx] = { ...newCredits[idx], [field]: value };
    onUpdate(entry.id, { credits: newCredits });
  };

  const removeDebit = (idx: number) => {
    if (entry.debits.length > 1) {
      onUpdate(entry.id, {
        debits: entry.debits.filter((_, i) => i !== idx),
      });
    }
  };

  const removeCredit = (idx: number) => {
    if (entry.credits.length > 1) {
      onUpdate(entry.id, {
        credits: entry.credits.filter((_, i) => i !== idx),
      });
    }
  };

  return (
    <Card className={balanced ? 'border-green-300' : 'border-red-300'}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold">Entry {index + 1}</span>
              {balanced ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Balanced
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Out of Balance
                </Badge>
              )}
            </div>
            <Input
              value={entry.description}
              onChange={(e) =>
                onUpdate(entry.id, { description: e.target.value })
              }
              placeholder="Entry description"
              className="mb-2"
            />
            <Input
              value={entry.purpose}
              onChange={(e) => onUpdate(entry.id, { purpose: e.target.value })}
              placeholder="Purpose of this elimination"
              className="text-sm"
            />
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* Debits */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="font-semibold">Debits</Label>
              <Button variant="outline" size="sm" onClick={addDebitLine}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-2">
              {entry.debits.map((debit, idx) => (
                <div key={idx} className="flex gap-2">
                  <Select
                    value={debit.account}
                    onValueChange={(value) =>
                      updateDebit(idx, 'account', value)
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {allAccounts.map((acc) => (
                        <SelectItem key={acc} value={acc}>
                          {acc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={debit.amount}
                    onChange={(e) =>
                      updateDebit(idx, 'amount', parseFloat(e.target.value) || 0)
                    }
                    className="w-32"
                    placeholder="Amount"
                  />
                  {entry.debits.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDebit(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t font-semibold text-right">
                Total: ${formatCurrency(totalDebits)}
              </div>
            </div>
          </div>

          {/* Credits */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="font-semibold">Credits</Label>
              <Button variant="outline" size="sm" onClick={addCreditLine}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-2">
              {entry.credits.map((credit, idx) => (
                <div key={idx} className="flex gap-2">
                  <Select
                    value={credit.account}
                    onValueChange={(value) =>
                      updateCredit(idx, 'account', value)
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {allAccounts.map((acc) => (
                        <SelectItem key={acc} value={acc}>
                          {acc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={credit.amount}
                    onChange={(e) =>
                      updateCredit(
                        idx,
                        'amount',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-32"
                    placeholder="Amount"
                  />
                  {entry.credits.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCredit(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t font-semibold text-right">
                Total: ${formatCurrency(totalCredits)}
              </div>
            </div>
          </div>
        </div>

        {!balanced && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Entry is out of balance by $
              {formatCurrency(Math.abs(totalDebits - totalCredits))}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
