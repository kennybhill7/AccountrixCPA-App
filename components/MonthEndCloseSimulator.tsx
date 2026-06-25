"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Clock,
  Pause,
  Play,
  Lightbulb,
  FileText,
  CheckCircle2,
  Circle,
  PlayCircle,
  AlertTriangle,
  Award,
  Download,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface JournalEntry {
  account: string;
  debit: number;
  credit: number;
}

interface CloseTask {
  id: string;
  title: string;
  type: "journal-entry" | "calculation" | "review" | "statement";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scenario: Record<string, any>;
  instruction: string;
  solution: {
    calculation?: string;
    entries?: JournalEntry[];
    answer?: number | string;
    tolerance?: number; // For numeric answers
  };
  points: number;
  timeEstimate: number; // minutes
  hints: string[];
  explanation?: string; // Why this task matters
}

interface CloseAttempt {
  taskId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userAnswer: any;
  isCorrect: boolean;
  pointsEarned: number;
  pointsPossible: number;
  hintsUsed: number;
  timeSpent: number;
  feedback: string;
}

interface CloseScore {
  totalScore: number;
  possibleScore: number;
  percentage: number;
  grade: string;
  letterGrade: "A" | "B" | "C" | "D" | "F";
  timeTaken: number;
  tasksCompleted: number;
  totalTasks: number;
  bonusPoints: number;
  deductions: number;
}

interface Scenario {
  id: string;
  name: string;
  company: string;
  period: string;
  description: string;
  timeLimit: number; // minutes
  difficulty: "basic" | "intermediate" | "advanced";
  tasks: CloseTask[];
  trialBalance: TrialBalanceAccount[];
}

interface TrialBalanceAccount {
  code: string;
  name: string;
  debit: number;
  credit: number;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
}

interface SimulatorState {
  currentTaskIndex: number;
  attempts: CloseAttempt[];
  startTime: number;
  elapsedTime: number; // seconds
  isPaused: boolean;
  pausesUsed: number;
  pauseTimeRemaining: number; // seconds
  hintsUsedInTask: number;
  isComplete: boolean;
}

// ============================================================================
// SCENARIOS DATA
// ============================================================================

const SCENARIOS: Scenario[] = [
  {
    id: "basic-month-end",
    name: "Basic Month-End Close",
    company: "Summit Services LLC",
    period: "November 2024",
    description: "Standard monthly close with common adjusting entries",
    timeLimit: 45,
    difficulty: "basic",
    trialBalance: [
      { code: "1010", name: "Cash", debit: 45000, credit: 0, type: "asset" },
      { code: "1020", name: "Accounts Receivable", debit: 28000, credit: 0, type: "asset" },
      { code: "1030", name: "Prepaid Insurance", debit: 6000, credit: 0, type: "asset" },
      { code: "1040", name: "Prepaid Rent", debit: 9000, credit: 0, type: "asset" },
      { code: "1500", name: "Equipment", debit: 120000, credit: 0, type: "asset" },
      {
        code: "1510",
        name: "Accumulated Depreciation - Equipment",
        debit: 0,
        credit: 40000,
        type: "asset",
      },
      { code: "2010", name: "Accounts Payable", debit: 0, credit: 15000, type: "liability" },
      { code: "2020", name: "Accrued Payroll", debit: 0, credit: 0, type: "liability" },
      { code: "2030", name: "Unearned Revenue", debit: 0, credit: 12000, type: "liability" },
      { code: "3010", name: "Common Stock", debit: 0, credit: 50000, type: "equity" },
      { code: "3020", name: "Retained Earnings", debit: 0, credit: 35000, type: "equity" },
      { code: "4010", name: "Service Revenue", debit: 0, credit: 85000, type: "revenue" },
      { code: "5010", name: "Salaries Expense", debit: 32000, credit: 0, type: "expense" },
      { code: "5020", name: "Rent Expense", debit: 6000, credit: 0, type: "expense" },
      { code: "5030", name: "Utilities Expense", debit: 1000, credit: 0, type: "expense" },
      { code: "5040", name: "Insurance Expense", debit: 0, credit: 0, type: "expense" },
      { code: "5050", name: "Depreciation Expense", debit: 0, credit: 0, type: "expense" },
    ],
    tasks: [
      {
        id: "review-tb",
        title: "Review Unadjusted Trial Balance",
        type: "review",
        scenario: {
          instruction:
            "Review the trial balance and confirm it balances before making adjustments.",
        },
        instruction:
          "Verify that total debits equal total credits in the unadjusted trial balance.",
        solution: {
          answer: "balanced",
        },
        points: 5,
        timeEstimate: 3,
        hints: [
          "Add up all debit balances and all credit balances",
          "Debits should equal credits in a balanced trial balance",
          "Total debits: $247,000, Total credits: $237,000 - Check for errors",
        ],
        explanation:
          "Always verify the trial balance is mathematically correct before making adjustments.",
      },
      {
        id: "depreciation",
        title: "Record Depreciation Expense",
        type: "journal-entry",
        scenario: {
          equipment: 120000,
          salvageValue: 0,
          usefulLife: 10,
          monthsInYear: 12,
          method: "straight-line",
        },
        instruction:
          "Equipment was purchased at the beginning of the year. Calculate and record monthly depreciation using the straight-line method.",
        solution: {
          calculation: "(120,000 - 0) / (10 years * 12 months) = $1,000 per month",
          entries: [
            { account: "Depreciation Expense", debit: 1000, credit: 0 },
            { account: "Accumulated Depreciation - Equipment", debit: 0, credit: 1000 },
          ],
          tolerance: 50,
        },
        points: 10,
        timeEstimate: 5,
        hints: [
          "Use the straight-line formula: (Cost - Salvage Value) / Useful Life",
          "Useful life is 10 years, but you need monthly depreciation",
          "Annual depreciation is $12,000, so monthly is $12,000 / 12 = $1,000",
        ],
        explanation: "Depreciation allocates the cost of long-term assets over their useful lives.",
      },
      {
        id: "prepaid-insurance",
        title: "Adjust Prepaid Insurance",
        type: "journal-entry",
        scenario: {
          prepaidBalance: 6000,
          policyPeriod: "6 months (Sept 1 - Feb 28)",
          currentMonth: "November (Month 3 of 6)",
          monthsExpired: 1,
        },
        instruction:
          "A 6-month insurance policy was purchased on September 1 for $6,000. Record the insurance expense for November.",
        solution: {
          calculation: "$6,000 / 6 months = $1,000 per month",
          entries: [
            { account: "Insurance Expense", debit: 1000, credit: 0 },
            { account: "Prepaid Insurance", debit: 0, credit: 1000 },
          ],
          tolerance: 50,
        },
        points: 8,
        timeEstimate: 4,
        hints: [
          "Divide the total prepaid amount by the number of months in the policy period",
          "Each month, 1/6 of the prepaid amount expires",
          "$6,000 / 6 months = $1,000 per month",
        ],
        explanation:
          "Prepaid expenses must be adjusted each period to match expenses with the period benefited.",
      },
      {
        id: "accrue-payroll",
        title: "Accrue Payroll Expense",
        type: "journal-entry",
        scenario: {
          lastPayDate: "November 26",
          payPeriodEnd: "November 30",
          daysUnpaid: 4,
          dailyPayroll: 800,
        },
        instruction:
          "Employees are paid bi-weekly. The last pay date was November 26. Accrue payroll expense for the last 4 days of November at $800 per day.",
        solution: {
          calculation: "$800 * 4 days = $3,200",
          entries: [
            { account: "Salaries Expense", debit: 3200, credit: 0 },
            { account: "Accrued Payroll", debit: 0, credit: 3200 },
          ],
          tolerance: 100,
        },
        points: 10,
        timeEstimate: 5,
        hints: [
          "Calculate the total payroll for the unpaid days",
          "Multiply daily payroll by number of unpaid days",
          "$800/day * 4 days = $3,200",
        ],
        explanation:
          "Accrued payroll ensures expenses are recorded in the period they are incurred, not when paid.",
      },
      {
        id: "unearned-revenue",
        title: "Adjust Unearned Revenue",
        type: "journal-entry",
        scenario: {
          unearnedBalance: 12000,
          totalServices: 12000,
          servicesPerformed: 3000,
        },
        instruction:
          "The company received $12,000 in advance for services. During November, $3,000 of services were performed. Record the adjustment.",
        solution: {
          calculation: "$3,000 of services performed should be recognized as revenue",
          entries: [
            { account: "Unearned Revenue", debit: 3000, credit: 0 },
            { account: "Service Revenue", debit: 0, credit: 3000 },
          ],
          tolerance: 100,
        },
        points: 8,
        timeEstimate: 4,
        hints: [
          "Unearned revenue is a liability that decreases when services are performed",
          "Transfer the earned portion from liability to revenue",
          "Debit Unearned Revenue and credit Service Revenue for $3,000",
        ],
        explanation: "Revenue should be recognized when earned, not when cash is received.",
      },
      {
        id: "prepaid-rent",
        title: "Adjust Prepaid Rent",
        type: "journal-entry",
        scenario: {
          prepaidBalance: 9000,
          monthsCovered: 3,
          currentMonth: "November (Month 2 of 3)",
        },
        instruction:
          "Prepaid rent of $9,000 covers October, November, and December. Record the rent expense for November.",
        solution: {
          calculation: "$9,000 / 3 months = $3,000 per month",
          entries: [
            { account: "Rent Expense", debit: 3000, credit: 0 },
            { account: "Prepaid Rent", debit: 0, credit: 3000 },
          ],
          tolerance: 100,
        },
        points: 8,
        timeEstimate: 4,
        hints: [
          "Divide total prepaid rent by number of months",
          "Each month, one month of rent expires",
          "$9,000 / 3 months = $3,000",
        ],
        explanation: "Prepaid rent must be expensed in the period the rental space is used.",
      },
      {
        id: "income-calculation",
        title: "Calculate Net Income",
        type: "calculation",
        scenario: {
          instruction: "Based on all adjustments made, calculate the net income for November.",
        },
        instruction:
          "Calculate net income after all adjusting entries. Use the formula: Total Revenues - Total Expenses.",
        solution: {
          calculation: "Service Revenue: $88,000 - Total Expenses: $46,200 = $41,800",
          answer: 41800,
          tolerance: 500,
        },
        points: 12,
        timeEstimate: 8,
        hints: [
          "Add up all revenue accounts (Service Revenue)",
          "Add up all expense accounts (Salaries, Rent, Utilities, Insurance, Depreciation)",
          "Revenue: $88,000; Expenses: Salaries $35,200 + Rent $9,000 + Utilities $1,000 + Insurance $1,000 + Depreciation $1,000 = $47,200",
        ],
        explanation:
          "Net income is the difference between total revenues and total expenses for the period.",
      },
      {
        id: "verify-balance",
        title: "Verify Adjusted Trial Balance",
        type: "review",
        scenario: {
          instruction:
            "Confirm that the adjusted trial balance still balances after all adjustments.",
        },
        instruction: "Verify that total debits equal total credits in the adjusted trial balance.",
        solution: {
          answer: "balanced",
        },
        points: 8,
        timeEstimate: 5,
        hints: [
          "Re-calculate total debits and total credits including adjustments",
          "Each adjusting entry should maintain the balance (debits = credits)",
          "If done correctly, the trial balance should still be in balance",
        ],
        explanation: "The trial balance must balance after adjustments to ensure accuracy.",
      },
      {
        id: "review-sign-off",
        title: "Final Review and Sign-Off",
        type: "review",
        scenario: {
          checkpoints: [
            "All adjusting entries recorded",
            "Trial balance verified",
            "Income calculated correctly",
            "Documentation complete",
          ],
        },
        instruction:
          "Perform a final review of all work and confirm the month-end close is complete.",
        solution: {
          answer: "complete",
        },
        points: 6,
        timeEstimate: 3,
        hints: [
          "Review your checklist - all tasks should be completed",
          "Ensure all journal entries are properly recorded",
          "Confirm trial balance is balanced",
        ],
        explanation: "A final review ensures nothing was missed and all work is accurate.",
      },
    ],
  },
  {
    id: "year-end-close",
    name: "Year-End Close",
    company: "Summit Construction Co.",
    period: "December 2024",
    description: "Comprehensive year-end close with complex adjustments and closing entries",
    timeLimit: 60,
    difficulty: "intermediate",
    trialBalance: [
      { code: "1010", name: "Cash", debit: 125000, credit: 0, type: "asset" },
      { code: "1020", name: "Accounts Receivable", debit: 85000, credit: 0, type: "asset" },
      {
        code: "1025",
        name: "Allowance for Doubtful Accounts",
        debit: 0,
        credit: 3000,
        type: "asset",
      },
      { code: "1030", name: "Inventory", debit: 45000, credit: 0, type: "asset" },
      { code: "1040", name: "Prepaid Insurance", debit: 12000, credit: 0, type: "asset" },
      { code: "1050", name: "Work in Progress", debit: 95000, credit: 0, type: "asset" },
      { code: "1500", name: "Equipment", debit: 250000, credit: 0, type: "asset" },
      {
        code: "1510",
        name: "Accumulated Depreciation - Equipment",
        debit: 0,
        credit: 80000,
        type: "asset",
      },
      { code: "1600", name: "Building", debit: 500000, credit: 0, type: "asset" },
      {
        code: "1610",
        name: "Accumulated Depreciation - Building",
        debit: 0,
        credit: 100000,
        type: "asset",
      },
      { code: "2010", name: "Accounts Payable", debit: 0, credit: 42000, type: "liability" },
      { code: "2020", name: "Accrued Payroll", debit: 0, credit: 0, type: "liability" },
      { code: "2030", name: "Accrued Interest", debit: 0, credit: 0, type: "liability" },
      { code: "2040", name: "Unearned Revenue", debit: 0, credit: 30000, type: "liability" },
      { code: "2500", name: "Notes Payable", debit: 0, credit: 200000, type: "liability" },
      { code: "3010", name: "Common Stock", debit: 0, credit: 300000, type: "equity" },
      { code: "3020", name: "Retained Earnings", debit: 0, credit: 180000, type: "equity" },
      { code: "3030", name: "Dividends", debit: 50000, credit: 0, type: "equity" },
      { code: "4010", name: "Construction Revenue", debit: 0, credit: 750000, type: "revenue" },
      { code: "5010", name: "Cost of Construction", debit: 380000, credit: 0, type: "expense" },
      { code: "5020", name: "Salaries Expense", debit: 185000, credit: 0, type: "expense" },
      { code: "5030", name: "Rent Expense", debit: 48000, credit: 0, type: "expense" },
      { code: "5040", name: "Insurance Expense", debit: 0, credit: 0, type: "expense" },
      {
        code: "5050",
        name: "Depreciation Expense - Equipment",
        debit: 0,
        credit: 0,
        type: "expense",
      },
      {
        code: "5060",
        name: "Depreciation Expense - Building",
        debit: 0,
        credit: 0,
        type: "expense",
      },
      { code: "5070", name: "Interest Expense", debit: 0, credit: 0, type: "expense" },
      { code: "5080", name: "Bad Debt Expense", debit: 0, credit: 0, type: "expense" },
      { code: "5090", name: "Utilities Expense", debit: 15000, credit: 0, type: "expense" },
    ],
    tasks: [
      {
        id: "review-tb-year-end",
        title: "Review Unadjusted Trial Balance",
        type: "review",
        scenario: {
          instruction: "Review the year-end trial balance before making adjustments.",
        },
        instruction:
          "Verify that total debits equal total credits in the unadjusted trial balance.",
        solution: {
          answer: "balanced",
        },
        points: 5,
        timeEstimate: 3,
        hints: [
          "Sum all debit and credit balances",
          "A balanced trial balance is essential before adjustments",
          "Check that debits = credits",
        ],
        explanation: "The trial balance must be in balance before making year-end adjustments.",
      },
      {
        id: "equipment-depreciation",
        title: "Record Equipment Depreciation",
        type: "journal-entry",
        scenario: {
          equipment: 250000,
          salvageValue: 10000,
          usefulLife: 10,
          method: "straight-line",
        },
        instruction:
          "Calculate and record annual depreciation for equipment using straight-line method.",
        solution: {
          calculation: "(250,000 - 10,000) / 10 years = $24,000 per year",
          entries: [
            { account: "Depreciation Expense - Equipment", debit: 24000, credit: 0 },
            { account: "Accumulated Depreciation - Equipment", debit: 0, credit: 24000 },
          ],
          tolerance: 500,
        },
        points: 10,
        timeEstimate: 5,
        hints: [
          "Use straight-line: (Cost - Salvage Value) / Useful Life",
          "Calculate for the full year",
          "($250,000 - $10,000) / 10 = $24,000",
        ],
        explanation: "Equipment depreciation allocates the cost over its useful life.",
      },
      {
        id: "building-depreciation",
        title: "Record Building Depreciation",
        type: "journal-entry",
        scenario: {
          building: 500000,
          salvageValue: 50000,
          usefulLife: 30,
          method: "straight-line",
        },
        instruction:
          "Calculate and record annual depreciation for the building using straight-line method.",
        solution: {
          calculation: "(500,000 - 50,000) / 30 years = $15,000 per year",
          entries: [
            { account: "Depreciation Expense - Building", debit: 15000, credit: 0 },
            { account: "Accumulated Depreciation - Building", debit: 0, credit: 15000 },
          ],
          tolerance: 500,
        },
        points: 10,
        timeEstimate: 5,
        hints: [
          "Buildings typically have longer useful lives than equipment",
          "Use the same straight-line formula",
          "($500,000 - $50,000) / 30 years = $15,000",
        ],
        explanation: "Buildings depreciate over their useful lives, typically 20-40 years.",
      },
      {
        id: "year-end-insurance",
        title: "Adjust Prepaid Insurance",
        type: "journal-entry",
        scenario: {
          prepaidBalance: 12000,
          policyPeriod: "12 months (Jan 1 - Dec 31)",
          monthsExpired: 12,
        },
        instruction:
          "The company paid $12,000 for annual insurance on January 1. Record the full year's insurance expense.",
        solution: {
          calculation: "Full year policy has expired: $12,000",
          entries: [
            { account: "Insurance Expense", debit: 12000, credit: 0 },
            { account: "Prepaid Insurance", debit: 0, credit: 12000 },
          ],
          tolerance: 200,
        },
        points: 8,
        timeEstimate: 4,
        hints: [
          "At year-end, the entire annual policy has expired",
          "All prepaid insurance should be expensed",
          "The full $12,000 becomes expense",
        ],
        explanation: "At year-end, prepaid insurance for the year is fully expensed.",
      },
      {
        id: "accrue-year-end-payroll",
        title: "Accrue Year-End Payroll",
        type: "journal-entry",
        scenario: {
          lastPayDate: "December 26",
          yearEnd: "December 31",
          daysUnpaid: 5,
          dailyPayroll: 2500,
        },
        instruction:
          "Employees are paid bi-weekly. The last pay date was December 26. Accrue payroll for the last 5 working days of the year at $2,500 per day.",
        solution: {
          calculation: "$2,500 * 5 days = $12,500",
          entries: [
            { account: "Salaries Expense", debit: 12500, credit: 0 },
            { account: "Accrued Payroll", debit: 0, credit: 12500 },
          ],
          tolerance: 300,
        },
        points: 10,
        timeEstimate: 5,
        hints: [
          "Calculate total unpaid payroll for 5 days",
          "Daily rate * number of days",
          "$2,500 * 5 = $12,500",
        ],
        explanation:
          "Year-end accrued payroll ensures all expenses are recorded in the correct year.",
      },
      {
        id: "accrue-interest",
        title: "Accrue Interest Expense",
        type: "journal-entry",
        scenario: {
          notesPayable: 200000,
          annualRate: 0.06,
          lastPaymentDate: "October 1",
          monthsAccrued: 3,
        },
        instruction:
          "Notes payable of $200,000 carry a 6% annual interest rate. Interest was last paid on October 1. Accrue interest for October, November, and December.",
        solution: {
          calculation: "$200,000 * 6% * (3/12) = $3,000",
          entries: [
            { account: "Interest Expense", debit: 3000, credit: 0 },
            { account: "Accrued Interest", debit: 0, credit: 3000 },
          ],
          tolerance: 100,
        },
        points: 12,
        timeEstimate: 6,
        hints: [
          "Calculate interest for 3 months",
          "Annual interest = Principal * Rate",
          "$200,000 * 6% = $12,000 annual; $12,000 * 3/12 = $3,000",
        ],
        explanation:
          "Interest expense must be accrued for the period it has been incurred but not paid.",
      },
      {
        id: "bad-debt-expense",
        title: "Record Bad Debt Expense",
        type: "journal-entry",
        scenario: {
          accountsReceivable: 85000,
          estimatedUncollectible: 0.04,
          currentAllowance: 3000,
        },
        instruction:
          "Estimate bad debts at 4% of accounts receivable. The current allowance balance is $3,000. Record the adjustment needed.",
        solution: {
          calculation: "$85,000 * 4% = $3,400 desired balance; $3,400 - $3,000 = $400 adjustment",
          entries: [
            { account: "Bad Debt Expense", debit: 400, credit: 0 },
            { account: "Allowance for Doubtful Accounts", debit: 0, credit: 400 },
          ],
          tolerance: 50,
        },
        points: 12,
        timeEstimate: 7,
        hints: [
          "Calculate the desired ending balance in the allowance account",
          "The adjustment is the difference between desired and current balance",
          "Desired: $85,000 * 4% = $3,400; Adjustment: $3,400 - $3,000 = $400",
        ],
        explanation:
          "Bad debt expense is estimated based on accounts receivable and the allowance method.",
      },
      {
        id: "wip-revenue-recognition",
        title: "Review WIP and Record Revenue",
        type: "journal-entry",
        scenario: {
          wipBalance: 95000,
          projectCompletion: 0.8,
          totalContractValue: 150000,
          revenueRecognizedToDate: 120000,
        },
        instruction:
          "A construction project is 80% complete. Total contract value is $150,000. Revenue recognized to date is $120,000. Calculate additional revenue to recognize.",
        solution: {
          calculation:
            "$150,000 * 80% = $120,000 total revenue; Already recognized $120,000; No additional revenue",
          entries: [
            { account: "Work in Progress", debit: 0, credit: 0 },
            { account: "Construction Revenue", debit: 0, credit: 0 },
          ],
          tolerance: 1000,
        },
        points: 10,
        timeEstimate: 8,
        hints: [
          "Calculate total revenue based on percentage complete",
          "Compare to revenue already recognized",
          "80% of $150,000 = $120,000; Already recognized $120,000, so no adjustment needed",
        ],
        explanation: "Construction revenue is recognized based on percentage of completion.",
      },
      {
        id: "unearned-revenue-adjust",
        title: "Adjust Unearned Revenue",
        type: "journal-entry",
        scenario: {
          unearnedBalance: 30000,
          servicesCompleted: 18000,
        },
        instruction:
          "The company received $30,000 in customer deposits. During the year, $18,000 of services were completed. Record the earned revenue.",
        solution: {
          calculation: "$18,000 of services completed",
          entries: [
            { account: "Unearned Revenue", debit: 18000, credit: 0 },
            { account: "Construction Revenue", debit: 0, credit: 18000 },
          ],
          tolerance: 500,
        },
        points: 8,
        timeEstimate: 5,
        hints: [
          "Transfer earned portion from liability to revenue",
          "Debit the liability, credit revenue",
          "$18,000 has been earned and should be recognized",
        ],
        explanation: "Unearned revenue becomes earned revenue when services are performed.",
      },
      {
        id: "close-revenue",
        title: "Close Revenue to Retained Earnings",
        type: "journal-entry",
        scenario: {
          totalRevenue: 768000,
        },
        instruction:
          "Close all revenue accounts to Retained Earnings. Total revenue (including adjustments) is $768,000.",
        solution: {
          calculation: "Close Construction Revenue to Retained Earnings",
          entries: [
            { account: "Construction Revenue", debit: 768000, credit: 0 },
            { account: "Retained Earnings", debit: 0, credit: 768000 },
          ],
          tolerance: 1000,
        },
        points: 8,
        timeEstimate: 5,
        hints: [
          "Revenue accounts have credit balances that need to be closed",
          "Debit revenue to bring it to zero",
          "Credit Retained Earnings to transfer the balance",
        ],
        explanation: "Closing revenue accounts transfers the balance to Retained Earnings.",
      },
      {
        id: "close-expenses",
        title: "Close Expenses to Retained Earnings",
        type: "journal-entry",
        scenario: {
          totalExpenses: 679400,
        },
        instruction:
          "Close all expense accounts to Retained Earnings. Total expenses (including adjustments) is $679,400.",
        solution: {
          calculation: "Close all expense accounts to Retained Earnings",
          entries: [
            { account: "Retained Earnings", debit: 679400, credit: 0 },
            { account: "Cost of Construction", debit: 0, credit: 380000 },
          ],
          tolerance: 2000,
        },
        points: 10,
        timeEstimate: 7,
        hints: [
          "Expense accounts have debit balances that need to be closed",
          "Credit each expense account to bring to zero",
          "Debit Retained Earnings for the total",
        ],
        explanation: "Closing expense accounts transfers balances to Retained Earnings.",
      },
      {
        id: "close-dividends",
        title: "Close Dividends to Retained Earnings",
        type: "journal-entry",
        scenario: {
          dividends: 50000,
        },
        instruction:
          "Close the Dividends account to Retained Earnings. Dividends declared during the year were $50,000.",
        solution: {
          calculation: "Transfer dividends to Retained Earnings",
          entries: [
            { account: "Retained Earnings", debit: 50000, credit: 0 },
            { account: "Dividends", debit: 0, credit: 50000 },
          ],
          tolerance: 100,
        },
        points: 8,
        timeEstimate: 4,
        hints: [
          "Dividends reduce Retained Earnings",
          "Debit Retained Earnings, credit Dividends",
          "This brings the Dividends account to zero",
        ],
        explanation:
          "Closing dividends reduces Retained Earnings and closes the temporary account.",
      },
      {
        id: "net-income-calc",
        title: "Calculate Net Income",
        type: "calculation",
        scenario: {
          instruction: "Calculate net income for the year.",
        },
        instruction: "Based on all adjustments and closing entries, calculate net income for 2024.",
        solution: {
          calculation: "Revenue: $768,000 - Expenses: $679,400 = $88,600",
          answer: 88600,
          tolerance: 1000,
        },
        points: 12,
        timeEstimate: 8,
        hints: [
          "Net Income = Total Revenue - Total Expenses",
          "Include all adjusting entries in your calculation",
          "Revenue: $768,000; Expenses: $679,400",
        ],
        explanation: "Net income represents the profitability of the company for the year.",
      },
      {
        id: "final-review-year-end",
        title: "Final Review and Sign-Off",
        type: "review",
        scenario: {
          checkpoints: [
            "All adjusting entries recorded",
            "Temporary accounts closed",
            "Financial statements prepared",
            "Net income calculated",
          ],
        },
        instruction: "Perform final review of year-end close procedures and sign off.",
        solution: {
          answer: "complete",
        },
        points: 7,
        timeEstimate: 5,
        hints: [
          "Verify all tasks are completed",
          "Check that temporary accounts are closed",
          "Confirm financial statements are accurate",
        ],
        explanation: "Final review ensures the year-end close is complete and accurate.",
      },
    ],
  },
  {
    id: "construction-advanced",
    name: "Construction Company Close",
    company: "Summit Construction Co.",
    period: "December 2024",
    description:
      "Advanced construction company close with WIP, percentage of completion, and retention payables",
    timeLimit: 75,
    difficulty: "advanced",
    trialBalance: [
      { code: "1010", name: "Cash", debit: 145000, credit: 0, type: "asset" },
      { code: "1020", name: "Accounts Receivable", debit: 120000, credit: 0, type: "asset" },
      {
        code: "1025",
        name: "Allowance for Doubtful Accounts",
        debit: 0,
        credit: 4000,
        type: "asset",
      },
      { code: "1030", name: "Retention Receivable", debit: 45000, credit: 0, type: "asset" },
      { code: "1040", name: "Inventory - Materials", debit: 65000, credit: 0, type: "asset" },
      {
        code: "1050",
        name: "Work in Progress - Project A",
        debit: 125000,
        credit: 0,
        type: "asset",
      },
      {
        code: "1051",
        name: "Work in Progress - Project B",
        debit: 85000,
        credit: 0,
        type: "asset",
      },
      {
        code: "1052",
        name: "Work in Progress - Project C",
        debit: 45000,
        credit: 0,
        type: "asset",
      },
      { code: "1060", name: "Prepaid Insurance", debit: 18000, credit: 0, type: "asset" },
      { code: "1500", name: "Equipment", debit: 450000, credit: 0, type: "asset" },
      {
        code: "1510",
        name: "Accumulated Depreciation - Equipment",
        debit: 0,
        credit: 135000,
        type: "asset",
      },
      { code: "1600", name: "Vehicles", debit: 180000, credit: 0, type: "asset" },
      {
        code: "1610",
        name: "Accumulated Depreciation - Vehicles",
        debit: 0,
        credit: 54000,
        type: "asset",
      },
      { code: "2010", name: "Accounts Payable", debit: 0, credit: 58000, type: "liability" },
      { code: "2020", name: "Accrued Payroll", debit: 0, credit: 0, type: "liability" },
      { code: "2030", name: "Accrued Interest", debit: 0, credit: 0, type: "liability" },
      { code: "2040", name: "Retention Payable", debit: 0, credit: 22000, type: "liability" },
      { code: "2050", name: "Unearned Revenue", debit: 0, credit: 40000, type: "liability" },
      { code: "2060", name: "Warranty Liability", debit: 0, credit: 15000, type: "liability" },
      {
        code: "2500",
        name: "Notes Payable - Equipment",
        debit: 0,
        credit: 180000,
        type: "liability",
      },
      { code: "2510", name: "Line of Credit", debit: 0, credit: 75000, type: "liability" },
      { code: "3010", name: "Common Stock", debit: 0, credit: 400000, type: "equity" },
      { code: "3020", name: "Retained Earnings", debit: 0, credit: 235000, type: "equity" },
      { code: "3030", name: "Dividends", debit: 60000, credit: 0, type: "equity" },
      { code: "4010", name: "Construction Revenue", debit: 0, credit: 1250000, type: "revenue" },
      { code: "4020", name: "Change Order Revenue", debit: 0, credit: 85000, type: "revenue" },
      { code: "5010", name: "Direct Labor", debit: 425000, credit: 0, type: "expense" },
      { code: "5020", name: "Direct Materials", debit: 380000, credit: 0, type: "expense" },
      { code: "5030", name: "Subcontractor Costs", debit: 215000, credit: 0, type: "expense" },
      { code: "5040", name: "Equipment Rental", debit: 45000, credit: 0, type: "expense" },
      {
        code: "5050",
        name: "Salaries - Administrative",
        debit: 125000,
        credit: 0,
        type: "expense",
      },
      { code: "5060", name: "Insurance Expense", debit: 0, credit: 0, type: "expense" },
      {
        code: "5070",
        name: "Depreciation Expense - Equipment",
        debit: 0,
        credit: 0,
        type: "expense",
      },
      {
        code: "5080",
        name: "Depreciation Expense - Vehicles",
        debit: 0,
        credit: 0,
        type: "expense",
      },
      { code: "5090", name: "Interest Expense", debit: 0, credit: 0, type: "expense" },
      { code: "5100", name: "Bad Debt Expense", debit: 0, credit: 0, type: "expense" },
      { code: "5110", name: "Warranty Expense", debit: 0, credit: 0, type: "expense" },
      { code: "5120", name: "Office Expense", debit: 28000, credit: 0, type: "expense" },
      { code: "5130", name: "Utilities", debit: 18000, credit: 0, type: "expense" },
    ],
    tasks: [
      {
        id: "review-tb-construction",
        title: "Review Unadjusted Trial Balance",
        type: "review",
        scenario: {
          instruction: "Review the construction company trial balance.",
        },
        instruction: "Verify the trial balance is in balance before proceeding with adjustments.",
        solution: {
          answer: "balanced",
        },
        points: 5,
        timeEstimate: 3,
        hints: [
          "Sum all debits and credits",
          "Ensure mathematical accuracy",
          "Trial balance must balance before adjustments",
        ],
        explanation: "Always verify trial balance accuracy before making adjustments.",
      },
      {
        id: "equipment-depreciation-construction",
        title: "Record Equipment Depreciation",
        type: "journal-entry",
        scenario: {
          equipment: 450000,
          salvageValue: 45000,
          usefulLife: 10,
        },
        instruction:
          "Calculate annual depreciation for construction equipment using straight-line method.",
        solution: {
          calculation: "(450,000 - 45,000) / 10 = $40,500 per year",
          entries: [
            { account: "Depreciation Expense - Equipment", debit: 40500, credit: 0 },
            { account: "Accumulated Depreciation - Equipment", debit: 0, credit: 40500 },
          ],
          tolerance: 1000,
        },
        points: 10,
        timeEstimate: 5,
        hints: [
          "Use straight-line method",
          "(Cost - Salvage) / Life",
          "($450,000 - $45,000) / 10 = $40,500",
        ],
        explanation: "Equipment depreciation allocates cost over useful life.",
      },
      {
        id: "vehicle-depreciation",
        title: "Record Vehicle Depreciation",
        type: "journal-entry",
        scenario: {
          vehicles: 180000,
          salvageValue: 18000,
          usefulLife: 5,
        },
        instruction:
          "Calculate annual depreciation for company vehicles using straight-line method.",
        solution: {
          calculation: "(180,000 - 18,000) / 5 = $32,400 per year",
          entries: [
            { account: "Depreciation Expense - Vehicles", debit: 32400, credit: 0 },
            { account: "Accumulated Depreciation - Vehicles", debit: 0, credit: 32400 },
          ],
          tolerance: 500,
        },
        points: 10,
        timeEstimate: 5,
        hints: [
          "Vehicles typically have shorter lives than equipment",
          "Use straight-line method",
          "($180,000 - $18,000) / 5 = $32,400",
        ],
        explanation: "Vehicle depreciation reflects wear and tear over time.",
      },
      {
        id: "insurance-adjustment",
        title: "Adjust Prepaid Insurance",
        type: "journal-entry",
        scenario: {
          prepaidBalance: 18000,
          policyPeriod: "12 months",
          monthsExpired: 12,
        },
        instruction:
          "Record the full year's insurance expense. The annual policy expires December 31.",
        solution: {
          calculation: "Full year: $18,000",
          entries: [
            { account: "Insurance Expense", debit: 18000, credit: 0 },
            { account: "Prepaid Insurance", debit: 0, credit: 18000 },
          ],
          tolerance: 300,
        },
        points: 8,
        timeEstimate: 4,
        hints: [
          "Annual policy fully expires at year-end",
          "Expense the entire prepaid amount",
          "Full $18,000 becomes expense",
        ],
        explanation: "Year-end insurance adjustment expenses the full annual premium.",
      },
      {
        id: "accrue-payroll-construction",
        title: "Accrue Payroll Expense",
        type: "journal-entry",
        scenario: {
          lastPayDate: "December 27",
          yearEnd: "December 31",
          daysUnpaid: 4,
          dailyPayroll: 3200,
        },
        instruction: "Accrue payroll for the last 4 working days of the year at $3,200 per day.",
        solution: {
          calculation: "$3,200 * 4 = $12,800",
          entries: [
            { account: "Salaries - Administrative", debit: 12800, credit: 0 },
            { account: "Accrued Payroll", debit: 0, credit: 12800 },
          ],
          tolerance: 300,
        },
        points: 10,
        timeEstimate: 5,
        hints: ["Calculate for 4 days", "Daily rate * days", "$3,200 * 4 = $12,800"],
        explanation: "Accrued payroll matches expenses with the period incurred.",
      },
      {
        id: "accrue-equipment-interest",
        title: "Accrue Interest on Equipment Note",
        type: "journal-entry",
        scenario: {
          notesPayable: 180000,
          annualRate: 0.05,
          lastPayment: "September 30",
          monthsAccrued: 3,
        },
        instruction:
          "Notes payable for equipment is $180,000 at 5% annual interest. Interest was last paid September 30. Accrue interest for Q4.",
        solution: {
          calculation: "$180,000 * 5% * 3/12 = $2,250",
          entries: [
            { account: "Interest Expense", debit: 2250, credit: 0 },
            { account: "Accrued Interest", debit: 0, credit: 2250 },
          ],
          tolerance: 100,
        },
        points: 12,
        timeEstimate: 6,
        hints: [
          "Calculate for 3 months (Oct, Nov, Dec)",
          "Principal * Rate * Time",
          "$180,000 * 5% * 3/12 = $2,250",
        ],
        explanation:
          "Interest expense accrues over time and must be recorded in the period incurred.",
      },
      {
        id: "accrue-loc-interest",
        title: "Accrue Interest on Line of Credit",
        type: "journal-entry",
        scenario: {
          lineOfCredit: 75000,
          annualRate: 0.07,
          monthsAccrued: 1,
        },
        instruction:
          "The line of credit balance is $75,000 with 7% annual interest. Accrue December interest.",
        solution: {
          calculation: "$75,000 * 7% * 1/12 = $437.50",
          entries: [
            { account: "Interest Expense", debit: 438, credit: 0 },
            { account: "Accrued Interest", debit: 0, credit: 438 },
          ],
          tolerance: 50,
        },
        points: 10,
        timeEstimate: 5,
        hints: [
          "Calculate for 1 month",
          "Principal * Rate * 1/12",
          "$75,000 * 7% * 1/12 = $437.50",
        ],
        explanation: "Line of credit interest accrues monthly.",
      },
      {
        id: "bad-debt-construction",
        title: "Record Bad Debt Expense",
        type: "journal-entry",
        scenario: {
          accountsReceivable: 120000,
          retentionReceivable: 45000,
          estimatedRate: 0.03,
          currentAllowance: 4000,
        },
        instruction:
          "Estimate bad debts at 3% of total receivables (A/R + Retention). Current allowance is $4,000. Record the adjustment.",
        solution: {
          calculation: "(120,000 + 45,000) * 3% = $4,950; Adjustment: $4,950 - $4,000 = $950",
          entries: [
            { account: "Bad Debt Expense", debit: 950, credit: 0 },
            { account: "Allowance for Doubtful Accounts", debit: 0, credit: 950 },
          ],
          tolerance: 100,
        },
        points: 12,
        timeEstimate: 7,
        hints: [
          "Include both A/R and retention receivable",
          "Calculate desired ending balance",
          "Total receivables: $165,000; 3% = $4,950; Adjust by $950",
        ],
        explanation: "Bad debt expense estimates uncollectible receivables.",
      },
      {
        id: "warranty-expense",
        title: "Record Warranty Expense",
        type: "journal-entry",
        scenario: {
          totalRevenue: 1335000,
          warrantyRate: 0.02,
          currentWarrantyLiability: 15000,
        },
        instruction:
          "Estimate warranty expense at 2% of total revenue. Current warranty liability is $15,000. Calculate the adjustment needed.",
        solution: {
          calculation: "$1,335,000 * 2% = $26,700; Adjustment: $26,700 - $15,000 = $11,700",
          entries: [
            { account: "Warranty Expense", debit: 11700, credit: 0 },
            { account: "Warranty Liability", debit: 0, credit: 11700 },
          ],
          tolerance: 500,
        },
        points: 12,
        timeEstimate: 7,
        hints: [
          "Calculate desired warranty liability based on revenue",
          "Total revenue * 2%",
          "$1,335,000 * 2% = $26,700; Increase liability by $11,700",
        ],
        explanation: "Warranty expense is accrued based on estimated future claims.",
      },
      {
        id: "project-a-completion",
        title: "Record Revenue - Project A",
        type: "journal-entry",
        scenario: {
          contractValue: 200000,
          percentComplete: 0.9,
          costsIncurred: 125000,
          revenueRecognizedToDate: 160000,
        },
        instruction:
          "Project A is 90% complete with a contract value of $200,000. Revenue recognized to date is $160,000. Record additional revenue.",
        solution: {
          calculation:
            "$200,000 * 90% = $180,000 total; Already recognized $160,000; Additional $20,000",
          entries: [
            { account: "Work in Progress - Project A", debit: 0, credit: 20000 },
            { account: "Construction Revenue", debit: 0, credit: 20000 },
          ],
          tolerance: 1000,
        },
        points: 12,
        timeEstimate: 8,
        hints: [
          "Calculate total revenue based on % complete",
          "Subtract revenue already recognized",
          "90% of $200,000 = $180,000; Additional: $20,000",
        ],
        explanation: "Percentage-of-completion method recognizes revenue as work progresses.",
      },
      {
        id: "project-b-completion",
        title: "Record Revenue - Project B",
        type: "journal-entry",
        scenario: {
          contractValue: 180000,
          percentComplete: 0.7,
          costsIncurred: 85000,
          revenueRecognizedToDate: 108000,
        },
        instruction:
          "Project B is 70% complete with a contract value of $180,000. Revenue recognized to date is $108,000. Record additional revenue.",
        solution: {
          calculation:
            "$180,000 * 70% = $126,000 total; Already recognized $108,000; Additional $18,000",
          entries: [
            { account: "Work in Progress - Project B", debit: 0, credit: 18000 },
            { account: "Construction Revenue", debit: 0, credit: 18000 },
          ],
          tolerance: 1000,
        },
        points: 12,
        timeEstimate: 8,
        hints: [
          "Use percentage-of-completion method",
          "Total revenue * % complete - recognized",
          "70% of $180,000 = $126,000; Additional: $18,000",
        ],
        explanation: "Revenue recognition matches the progress of construction work.",
      },
      {
        id: "project-c-completion",
        title: "Record Revenue - Project C",
        type: "journal-entry",
        scenario: {
          contractValue: 150000,
          percentComplete: 0.4,
          costsIncurred: 45000,
          revenueRecognizedToDate: 45000,
        },
        instruction:
          "Project C is 40% complete with a contract value of $150,000. Revenue recognized to date is $45,000. Record additional revenue.",
        solution: {
          calculation:
            "$150,000 * 40% = $60,000 total; Already recognized $45,000; Additional $15,000",
          entries: [
            { account: "Work in Progress - Project C", debit: 0, credit: 15000 },
            { account: "Construction Revenue", debit: 0, credit: 15000 },
          ],
          tolerance: 1000,
        },
        points: 12,
        timeEstimate: 8,
        hints: [
          "Apply percentage-of-completion",
          "Calculate total then subtract recognized",
          "40% of $150,000 = $60,000; Additional: $15,000",
        ],
        explanation: "Construction revenue is recognized proportionally as projects progress.",
      },
      {
        id: "unearned-revenue-construction",
        title: "Adjust Unearned Revenue",
        type: "journal-entry",
        scenario: {
          unearnedBalance: 40000,
          servicesPerformed: 25000,
        },
        instruction:
          "Customer deposits total $40,000. During the year, $25,000 of services were performed. Recognize the earned revenue.",
        solution: {
          calculation: "$25,000 earned",
          entries: [
            { account: "Unearned Revenue", debit: 25000, credit: 0 },
            { account: "Construction Revenue", debit: 0, credit: 25000 },
          ],
          tolerance: 500,
        },
        points: 8,
        timeEstimate: 5,
        hints: [
          "Transfer earned portion to revenue",
          "Debit liability, credit revenue",
          "$25,000 has been earned",
        ],
        explanation: "Unearned revenue becomes revenue when services are performed.",
      },
      {
        id: "net-income-construction",
        title: "Calculate Net Income",
        type: "calculation",
        scenario: {
          instruction: "Calculate net income for the year including all adjustments.",
        },
        instruction: "Calculate net income for 2024 after all adjusting entries.",
        solution: {
          calculation: "Total Revenue - Total Expenses",
          answer: 178350,
          tolerance: 2000,
        },
        points: 15,
        timeEstimate: 10,
        hints: [
          "Add all revenue accounts including adjustments",
          "Add all expense accounts including adjustments",
          "Revenue - Expenses = Net Income",
        ],
        explanation: "Net income represents the company's profitability for the period.",
      },
      {
        id: "final-review-construction",
        title: "Final Review and Sign-Off",
        type: "review",
        scenario: {
          checkpoints: [
            "All adjusting entries completed",
            "WIP and revenue properly recognized",
            "All accruals recorded",
            "Depreciation calculated",
          ],
        },
        instruction: "Perform final review of all closing procedures.",
        solution: {
          answer: "complete",
        },
        points: 8,
        timeEstimate: 5,
        hints: [
          "Review all completed tasks",
          "Verify accuracy of entries",
          "Confirm all adjustments made",
        ],
        explanation: "Final review ensures completeness and accuracy of the close process.",
      },
    ],
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface MonthEndCloseSimulatorProps {
  onComplete?: (score: CloseScore) => void;
  onSaveProgress?: (state: SimulatorState) => void;
  initialState?: Partial<SimulatorState>;
}

export default function MonthEndCloseSimulator({
  onComplete,
  onSaveProgress,
  initialState,
}: MonthEndCloseSimulatorProps) {
  // State management
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [simulatorState, setSimulatorState] = useState<SimulatorState>({
    currentTaskIndex: 0,
    attempts: [],
    startTime: Date.now(),
    elapsedTime: 0,
    isPaused: false,
    pausesUsed: 0,
    pauseTimeRemaining: 600, // 10 minutes total pause time
    hintsUsedInTask: 0,
    isComplete: false,
    ...initialState,
  });

  const [showScenarioSelect, setShowScenarioSelect] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [showTrialBalance, setShowTrialBalance] = useState(false);
  const [showQuickReference, setShowQuickReference] = useState(false);
  const [showFinalReport, setShowFinalReport] = useState(false);

  // Task input state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [taskInput, setTaskInput] = useState<any>({});
  const [taskFeedback, setTaskFeedback] = useState<string>("");
  const [taskError, setTaskError] = useState<string>("");

  // Timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // TIMER LOGIC
  // ============================================================================

  useEffect(() => {
    if (!selectedScenario || simulatorState.isPaused || simulatorState.isComplete) {
      return;
    }

    timerRef.current = setInterval(() => {
      setSimulatorState((prev) => {
        const newElapsed = prev.elapsedTime + 1;
        const timeLimit = selectedScenario.timeLimit * 60; // Convert to seconds

        // Auto-submit if time expires
        if (newElapsed >= timeLimit) {
          handleTimeExpired();
          return { ...prev, elapsedTime: timeLimit, isComplete: true };
        }

        return { ...prev, elapsedTime: newElapsed };
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [selectedScenario, simulatorState.isPaused, simulatorState.isComplete]);

  // ============================================================================
  // SCENARIO SELECTION
  // ============================================================================

  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setShowScenarioSelect(false);
    setSimulatorState({
      currentTaskIndex: 0,
      attempts: [],
      startTime: Date.now(),
      elapsedTime: 0,
      isPaused: false,
      pausesUsed: 0,
      pauseTimeRemaining: 600,
      hintsUsedInTask: 0,
      isComplete: false,
    });
    setTaskInput({});
  };

  // ============================================================================
  // TIMER CONTROLS
  // ============================================================================

  const handlePause = () => {
    if (simulatorState.pausesUsed >= 2) {
      setTaskError("Maximum pauses (2) already used");
      return;
    }

    if (simulatorState.pauseTimeRemaining <= 0) {
      setTaskError("No pause time remaining");
      return;
    }

    setSimulatorState((prev) => ({
      ...prev,
      isPaused: true,
    }));
  };

  const handleResume = () => {
    setSimulatorState((prev) => ({
      ...prev,
      isPaused: false,
      pausesUsed: prev.pausesUsed + 1,
    }));
  };

  const handleTimeExpired = () => {
    // Calculate final score with incomplete tasks
    const score = calculateFinalScore();
    setShowFinalReport(true);
    if (onComplete) {
      onComplete(score);
    }
  };

  // ============================================================================
  // TASK HANDLING
  // ============================================================================

  const currentTask = selectedScenario?.tasks[simulatorState.currentTaskIndex];

  const handleTaskSubmit = () => {
    if (!currentTask || !selectedScenario) return;

    setTaskError("");
    setTaskFeedback("");

    let isCorrect = false;
    let pointsEarned = 0;
    let feedback = "";

    // Validate based on task type
    switch (currentTask.type) {
      case "journal-entry":
        const result = validateJournalEntry(currentTask, taskInput);
        isCorrect = result.isCorrect;
        pointsEarned = result.pointsEarned;
        feedback = result.feedback;
        break;

      case "calculation":
        const calcResult = validateCalculation(currentTask, taskInput);
        isCorrect = calcResult.isCorrect;
        pointsEarned = calcResult.pointsEarned;
        feedback = calcResult.feedback;
        break;

      case "review":
        const reviewResult = validateReview(currentTask, taskInput);
        isCorrect = reviewResult.isCorrect;
        pointsEarned = reviewResult.pointsEarned;
        feedback = reviewResult.feedback;
        break;

      case "statement":
        // Statement validation would go here
        isCorrect = true;
        pointsEarned = currentTask.points;
        feedback = "Statement preparation validated";
        break;
    }

    // Apply hint penalty
    if (simulatorState.hintsUsedInTask > 0) {
      const penalty = simulatorState.hintsUsedInTask * 2;
      pointsEarned = Math.max(0, pointsEarned - penalty);
      feedback += ` (-${penalty} points for using ${simulatorState.hintsUsedInTask} hint${simulatorState.hintsUsedInTask > 1 ? "s" : ""})`;
    }

    // Record attempt
    const attempt: CloseAttempt = {
      taskId: currentTask.id,
      userAnswer: { ...taskInput },
      isCorrect,
      pointsEarned,
      pointsPossible: currentTask.points,
      hintsUsed: simulatorState.hintsUsedInTask,
      timeSpent: simulatorState.elapsedTime,
      feedback,
    };

    setTaskFeedback(feedback);

    // Update state
    setSimulatorState((prev) => {
      const newAttempts = [...prev.attempts, attempt];
      const newTaskIndex = prev.currentTaskIndex + 1;
      const isComplete = newTaskIndex >= selectedScenario.tasks.length;

      const newState = {
        ...prev,
        attempts: newAttempts,
        currentTaskIndex: newTaskIndex,
        hintsUsedInTask: 0,
        isComplete,
      };

      // Save progress
      if (onSaveProgress) {
        onSaveProgress(newState);
      }

      // Show final report if complete
      if (isComplete) {
        setTimeout(() => setShowFinalReport(true), 1000);
        const finalScore = calculateFinalScore(newAttempts);
        if (onComplete) {
          onComplete(finalScore);
        }
      }

      return newState;
    });

    // Reset task input
    setTaskInput({});
  };

  const handleSkipTask = () => {
    if (!currentTask || !selectedScenario) return;

    // Record skipped attempt
    const attempt: CloseAttempt = {
      taskId: currentTask.id,
      userAnswer: null,
      isCorrect: false,
      pointsEarned: 0,
      pointsPossible: currentTask.points,
      hintsUsed: simulatorState.hintsUsedInTask,
      timeSpent: simulatorState.elapsedTime,
      feedback: "Task skipped",
    };

    setSimulatorState((prev) => {
      const newAttempts = [...prev.attempts, attempt];
      const newTaskIndex = prev.currentTaskIndex + 1;
      const isComplete = newTaskIndex >= selectedScenario.tasks.length;

      const newState = {
        ...prev,
        attempts: newAttempts,
        currentTaskIndex: newTaskIndex,
        hintsUsedInTask: 0,
        isComplete,
      };

      if (isComplete) {
        setTimeout(() => setShowFinalReport(true), 1000);
        const finalScore = calculateFinalScore(newAttempts);
        if (onComplete) {
          onComplete(finalScore);
        }
      }

      return newState;
    });

    setTaskInput({});
    setTaskFeedback("");
    setTaskError("");
  };

  const handleUseHint = () => {
    if (!currentTask) return;

    if (simulatorState.hintsUsedInTask >= currentTask.hints.length) {
      setTaskError("No more hints available for this task");
      return;
    }

    setSimulatorState((prev) => ({
      ...prev,
      hintsUsedInTask: prev.hintsUsedInTask + 1,
    }));

    setShowHints(true);
  };

  // ============================================================================
  // VALIDATION FUNCTIONS
  // ============================================================================

  const validateJournalEntry = (
    task: CloseTask,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any
  ): { isCorrect: boolean; pointsEarned: number; feedback: string } => {
    const solution = task.solution.entries || [];
    const tolerance = task.solution.tolerance || 0;

    if (!input.entries || input.entries.length === 0) {
      return {
        isCorrect: false,
        pointsEarned: 0,
        feedback: "No journal entries provided",
      };
    }

    const errors = [];
    let deductions = 0;

    // Check each entry
    for (let i = 0; i < solution.length; i++) {
      const expected = solution[i];
      const actual = input.entries[i] || {};

      // Check account
      if (actual.account !== expected.account) {
        errors.push(
          `Entry ${i + 1}: Expected account "${expected.account}", got "${actual.account || "none"}"`
        );
        deductions += task.points * 0.5; // 50% penalty for wrong account
      }

      // Check debit amount
      const debitDiff = Math.abs((actual.debit || 0) - expected.debit);
      if (debitDiff > tolerance) {
        const percentOff = expected.debit > 0 ? debitDiff / expected.debit : 1;
        if (percentOff > 0.1) {
          errors.push(
            `Entry ${i + 1}: Debit amount significantly off (expected ${expected.debit}, got ${actual.debit || 0})`
          );
          deductions += task.points * 0.5; // 50% penalty if off by >10%
        } else {
          errors.push(
            `Entry ${i + 1}: Debit amount slightly off (expected ${expected.debit}, got ${actual.debit || 0})`
          );
          deductions += task.points * 0.25; // 25% penalty if within 10%
        }
      }

      // Check credit amount
      const creditDiff = Math.abs((actual.credit || 0) - expected.credit);
      if (creditDiff > tolerance) {
        const percentOff = expected.credit > 0 ? creditDiff / expected.credit : 1;
        if (percentOff > 0.1) {
          errors.push(
            `Entry ${i + 1}: Credit amount significantly off (expected ${expected.credit}, got ${actual.credit || 0})`
          );
          deductions += task.points * 0.5;
        } else {
          errors.push(
            `Entry ${i + 1}: Credit amount slightly off (expected ${expected.credit}, got ${actual.credit || 0})`
          );
          deductions += task.points * 0.25;
        }
      }
    }

    const pointsEarned = Math.max(0, task.points - deductions);
    const isCorrect = errors.length === 0;

    return {
      isCorrect,
      pointsEarned: Math.round(pointsEarned),
      feedback: isCorrect
        ? `Correct! Full points: ${task.points}`
        : `Incorrect. Errors: ${errors.join("; ")}. Points earned: ${Math.round(pointsEarned)}/${task.points}`,
    };
  };

  const validateCalculation = (
    task: CloseTask,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any
  ): { isCorrect: boolean; pointsEarned: number; feedback: string } => {
    const expected = Number(task.solution.answer);
    const actual = Number(input.answer);
    const tolerance = task.solution.tolerance || 0;

    if (isNaN(actual)) {
      return {
        isCorrect: false,
        pointsEarned: 0,
        feedback: "Invalid number provided",
      };
    }

    const diff = Math.abs(actual - expected);

    if (diff <= tolerance) {
      return {
        isCorrect: true,
        pointsEarned: task.points,
        feedback: `Correct! The answer is ${expected.toLocaleString()}`,
      };
    }

    const percentOff = expected > 0 ? diff / expected : 1;

    if (percentOff <= 0.1) {
      // Within 10%
      const pointsEarned = Math.round(task.points * 0.75);
      return {
        isCorrect: false,
        pointsEarned,
        feedback: `Close, but not exact. Expected ${expected.toLocaleString()}, got ${actual.toLocaleString()}. Partial credit: ${pointsEarned}/${task.points}`,
      };
    }

    return {
      isCorrect: false,
      pointsEarned: 0,
      feedback: `Incorrect. Expected ${expected.toLocaleString()}, got ${actual.toLocaleString()}`,
    };
  };

  const validateReview = (
    task: CloseTask,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any
  ): { isCorrect: boolean; pointsEarned: number; feedback: string } => {
    // Simple validation for review tasks
    const isCorrect = input.confirmed === true;

    return {
      isCorrect,
      pointsEarned: isCorrect ? task.points : 0,
      feedback: isCorrect ? "Review completed" : "Review not confirmed",
    };
  };

  // ============================================================================
  // SCORING
  // ============================================================================

  const calculateFinalScore = (attempts?: CloseAttempt[]): CloseScore => {
    if (!selectedScenario) {
      return {
        totalScore: 0,
        possibleScore: 100,
        percentage: 0,
        grade: "Incomplete",
        letterGrade: "F",
        timeTaken: 0,
        tasksCompleted: 0,
        totalTasks: 0,
        bonusPoints: 0,
        deductions: 0,
      };
    }

    const finalAttempts = attempts || simulatorState.attempts;
    const totalTasks = selectedScenario.tasks.length;
    const tasksCompleted = finalAttempts.length;

    // Calculate base score
    let totalPoints = 0;
    let possiblePoints = 0;

    selectedScenario.tasks.forEach((task, index) => {
      possiblePoints += task.points;
      const attempt = finalAttempts[index];
      if (attempt) {
        totalPoints += attempt.pointsEarned;
      }
    });

    // Calculate time bonus
    const timeTaken = simulatorState.elapsedTime;
    const timeLimit = selectedScenario.timeLimit * 60;
    let timeBonus = 0;

    if (simulatorState.isComplete && timeTaken < timeLimit) {
      if (timeTaken < timeLimit * 0.75) {
        // Finished in <45 min (75% of time)
        timeBonus = 10;
      } else if (timeTaken < timeLimit * 0.83) {
        // Finished in <50 min (83% of time)
        timeBonus = 5;
      }
    }

    // Calculate accuracy bonus
    const correctTasks = finalAttempts.filter((a) => a.isCorrect).length;
    const accuracy = tasksCompleted > 0 ? correctTasks / tasksCompleted : 0;
    let accuracyBonus = 0;

    if (accuracy === 1.0) {
      accuracyBonus = 15;
    } else if (accuracy >= 0.9) {
      accuracyBonus = 10;
    }

    const bonusPoints = timeBonus + accuracyBonus;
    const totalScore = totalPoints + bonusPoints;
    const percentage = (totalScore / 100) * 100;

    // Determine grade
    let letterGrade: "A" | "B" | "C" | "D" | "F";
    let grade: string;

    if (percentage >= 90) {
      letterGrade = "A";
      grade = "A - Outstanding";
    } else if (percentage >= 80) {
      letterGrade = "B";
      grade = "B - Proficient";
    } else if (percentage >= 70) {
      letterGrade = "C";
      grade = "C - Competent";
    } else if (percentage >= 60) {
      letterGrade = "D";
      grade = "D - Needs Practice";
    } else {
      letterGrade = "F";
      grade = "F - Insufficient";
    }

    return {
      totalScore: Math.round(totalScore),
      possibleScore: 100,
      percentage: Math.round(percentage),
      grade,
      letterGrade,
      timeTaken,
      tasksCompleted,
      totalTasks,
      bonusPoints,
      deductions: possiblePoints - totalPoints,
    };
  };

  // ============================================================================
  // FORMAT HELPERS
  // ============================================================================

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimeLimit = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // ============================================================================
  // RENDER: SCENARIO SELECTION
  // ============================================================================

  if (showScenarioSelect) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Month-End Close Simulator</CardTitle>
            <p className="text-muted-foreground mt-2">
              Select a scenario to practice month-end closing procedures
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SCENARIOS.map((scenario) => (
                <Card
                  key={scenario.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleScenarioSelect(scenario)}
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{scenario.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {formatTimeLimit(scenario.timeLimit)}
                      <span className="ml-2 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                        {scenario.difficulty}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Company:</span> {scenario.company}
                      </div>
                      <div>
                        <span className="font-medium">Period:</span> {scenario.period}
                      </div>
                      <div>
                        <span className="font-medium">Tasks:</span> {scenario.tasks.length}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // RENDER: FINAL REPORT
  // ============================================================================

  if (showFinalReport && selectedScenario) {
    const score = calculateFinalScore();
    const correctTasks = simulatorState.attempts.filter((a) => a.isCorrect).length;
    const accuracy = (correctTasks / simulatorState.attempts.length) * 100;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <Award className="w-8 h-8" />
              Month-End Close Performance Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center p-6 bg-primary/5 rounded-lg">
              <div className="text-6xl font-bold text-primary mb-2">
                {score.totalScore}
                <span className="text-3xl text-muted-foreground">/100</span>
              </div>
              <div className="text-2xl font-semibold mb-1">{score.grade}</div>
              <div className="text-muted-foreground">Time Taken: {formatTime(score.timeTaken)}</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{score.tasksCompleted}</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{correctTasks}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{Math.round(accuracy)}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">+{score.bonusPoints}</div>
                <div className="text-sm text-muted-foreground">Bonus Points</div>
              </div>
            </div>

            {/* Task Breakdown */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Task Results</h3>
              <div className="space-y-2">
                {selectedScenario.tasks.map((task, index) => {
                  const attempt = simulatorState.attempts[index];
                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {attempt?.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : attempt ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <div className="text-sm">
                        {attempt ? (
                          <span
                            className={attempt.isCorrect ? "text-green-600" : "text-yellow-600"}
                          >
                            {attempt.pointsEarned}/{task.points} points
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Skipped</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600">Strengths</h3>
                <ul className="space-y-2">
                  {accuracy >= 90 && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Excellent accuracy rate</span>
                    </li>
                  )}
                  {score.bonusPoints >= 10 && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Good time management</span>
                    </li>
                  )}
                  {correctTasks >= score.totalTasks * 0.8 && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Strong understanding of closing procedures</span>
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-600">
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {accuracy < 70 && (
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <span>Review adjusting entry concepts</span>
                    </li>
                  )}
                  {score.tasksCompleted < score.totalTasks && (
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <span>Complete all tasks for better results</span>
                    </li>
                  )}
                  {score.bonusPoints === 0 && (
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <span>Work on time efficiency</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={() => setShowScenarioSelect(true)} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Another Scenario
              </Button>
              <Button
                onClick={() => {
                  setShowFinalReport(false);
                  handleScenarioSelect(selectedScenario);
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry This Scenario
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // RENDER: MAIN SIMULATOR
  // ============================================================================

  if (!selectedScenario || !currentTask) {
    return null;
  }

  const timeRemaining = selectedScenario.timeLimit * 60 - simulatorState.elapsedTime;
  const timeWarning = timeRemaining <= 300; // 5 minutes
  const timeCritical = timeRemaining <= 60; // 1 minute
  const progress = ((simulatorState.currentTaskIndex + 1) / selectedScenario.tasks.length) * 100;
  const currentScore = calculateFinalScore();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid lg:grid-cols-[1fr,300px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Month-End Close Simulator</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {selectedScenario.company} - {selectedScenario.period}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setShowScenarioSelect(true)}>
                  Change Scenario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Status Bar */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Clock
                    className={`w-5 h-5 ${timeCritical ? "text-red-600" : timeWarning ? "text-yellow-600" : ""}`}
                  />
                  <span
                    className={`font-mono text-lg ${timeCritical ? "text-red-600" : timeWarning ? "text-yellow-600" : ""}`}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">{currentScore.totalScore}/100</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Progress: {simulatorState.currentTaskIndex + 1}/{selectedScenario.tasks.length}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex gap-2 mt-4">
                {simulatorState.isPaused ? (
                  <Button onClick={handleResume} variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    size="sm"
                    disabled={simulatorState.pausesUsed >= 2}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause ({2 - simulatorState.pausesUsed} left)
                  </Button>
                )}
                <Button onClick={handleUseHint} variant="outline" size="sm">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Hint
                </Button>
                <Button onClick={() => setShowTrialBalance(true)} variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Trial Balance
                </Button>
                <Button
                  onClick={() => setShowQuickReference(!showQuickReference)}
                  variant="outline"
                  size="sm"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Quick Reference
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Task Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{currentTask.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentTask.points} points • Est. {currentTask.timeEstimate} minutes
                  </p>
                </div>
                {currentTask.explanation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      alert(currentTask.explanation);
                    }}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Task Instruction */}
              <Alert className="mb-4">
                <AlertDescription>{currentTask.instruction}</AlertDescription>
              </Alert>

              {/* Scenario Info */}
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Scenario Information</h4>
                <div className="space-y-1 text-sm">
                  {Object.entries(currentTask.scenario).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>{" "}
                      {typeof value === "number" ? value.toLocaleString() : String(value)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Input Based on Type */}
              {currentTask.type === "journal-entry" && (
                <JournalEntryInput
                  task={currentTask}
                  value={taskInput}
                  onChange={setTaskInput}
                  accounts={selectedScenario.trialBalance.map((a) => a.name)}
                />
              )}

              {currentTask.type === "calculation" && (
                <CalculationInput task={currentTask} value={taskInput} onChange={setTaskInput} />
              )}

              {currentTask.type === "review" && (
                <ReviewInput task={currentTask} value={taskInput} onChange={setTaskInput} />
              )}

              {/* Feedback */}
              {taskFeedback && (
                <Alert
                  className={
                    taskFeedback.includes("Correct") ? "border-green-600" : "border-yellow-600"
                  }
                >
                  <AlertDescription>{taskFeedback}</AlertDescription>
                </Alert>
              )}

              {/* Error */}
              {taskError && (
                <Alert variant="destructive">
                  <AlertDescription>{taskError}</AlertDescription>
                </Alert>
              )}

              {/* Hints */}
              {showHints && simulatorState.hintsUsedInTask > 0 && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Lightbulb className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Hint {simulatorState.hintsUsedInTask}:</strong>{" "}
                    {currentTask.hints[simulatorState.hintsUsedInTask - 1]}
                  </AlertDescription>
                </Alert>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button onClick={handleTaskSubmit} className="flex-1">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit Answer
                </Button>
                <Button onClick={handleSkipTask} variant="outline">
                  Skip Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Checklist Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Closing Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedScenario.tasks.map((task, index) => {
                  const attempt = simulatorState.attempts[index];
                  const isCurrent = index === simulatorState.currentTaskIndex;

                  return (
                    <div
                      key={task.id}
                      className={`flex items-start gap-2 p-2 rounded ${isCurrent ? "bg-primary/10" : ""}`}
                    >
                      {attempt?.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : attempt ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      ) : isCurrent ? (
                        <PlayCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${isCurrent ? "font-medium" : ""}`}>
                        {task.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          {showQuickReference && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Quick Reference</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowQuickReference(false)}>
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">Depreciation</h4>
                  <p className="text-muted-foreground text-xs">
                    Straight-line: (Cost - Salvage) / Useful Life
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Interest Accrual</h4>
                  <p className="text-muted-foreground text-xs">Principal × Rate × (Time / 12)</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Prepaid Adjustments</h4>
                  <p className="text-muted-foreground text-xs">
                    Debit: Expense
                    <br />
                    Credit: Prepaid Asset
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Accruals</h4>
                  <p className="text-muted-foreground text-xs">
                    Debit: Expense
                    <br />
                    Credit: Accrued Liability
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Trial Balance Dialog */}
      <Dialog open={showTrialBalance} onOpenChange={setShowTrialBalance}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Unadjusted Trial Balance</DialogTitle>
            <DialogDescription>
              {selectedScenario.company} - {selectedScenario.period}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Account</th>
                  <th className="text-right py-2">Debit</th>
                  <th className="text-right py-2">Credit</th>
                </tr>
              </thead>
              <tbody>
                {selectedScenario.trialBalance.map((account) => (
                  <tr key={account.code} className="border-b">
                    <td className="py-2">
                      {account.code} - {account.name}
                    </td>
                    <td className="text-right py-2">
                      {account.debit > 0 ? account.debit.toLocaleString() : ""}
                    </td>
                    <td className="text-right py-2">
                      {account.credit > 0 ? account.credit.toLocaleString() : ""}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold border-t-2">
                  <td className="py-2">Total</td>
                  <td className="text-right py-2">
                    {selectedScenario.trialBalance
                      .reduce((sum, a) => sum + a.debit, 0)
                      .toLocaleString()}
                  </td>
                  <td className="text-right py-2">
                    {selectedScenario.trialBalance
                      .reduce((sum, a) => sum + a.credit, 0)
                      .toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================================
// TASK INPUT COMPONENTS
// ============================================================================

interface JournalEntryInputProps {
  task: CloseTask;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
  accounts: string[];
}

function JournalEntryInput({ task, value, onChange, accounts }: JournalEntryInputProps) {
  const entries = value.entries || [
    { account: "", debit: 0, credit: 0 },
    { account: "", debit: 0, credit: 0 },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateEntry = (index: number, field: string, val: any) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: val };
    onChange({ ...value, entries: newEntries });
  };

  const addEntry = () => {
    onChange({
      ...value,
      entries: [...entries, { account: "", debit: 0, credit: 0 }],
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Create Journal Entry</h4>
      {entries.map(
        (
          entry: any,
          index: number // eslint-disable-line @typescript-eslint/no-explicit-any
        ) => (
          <div key={index} className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="col-span-3">
              <Label>Account</Label>
              <Select
                value={entry.account}
                onValueChange={(val) => updateEntry(index, "account", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account..." />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Debit</Label>
              <Input
                type="number"
                value={entry.debit || ""}
                onChange={(e) => updateEntry(index, "debit", Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Credit</Label>
              <Input
                type="number"
                value={entry.credit || ""}
                onChange={(e) => updateEntry(index, "credit", Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div className="flex items-end">
              <span className="text-sm text-muted-foreground">Entry {index + 1}</span>
            </div>
          </div>
        )
      )}
      <Button onClick={addEntry} variant="outline" size="sm">
        Add Another Entry
      </Button>
    </div>
  );
}

interface CalculationInputProps {
  task: CloseTask;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
}

function CalculationInput({ task, value, onChange }: CalculationInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Your Answer</Label>
        <Input
          type="number"
          value={value.answer || ""}
          onChange={(e) => onChange({ ...value, answer: e.target.value })}
          placeholder="Enter amount..."
          className="text-lg"
        />
      </div>
      <div className="text-sm text-muted-foreground">
        Enter the calculated amount without commas or dollar signs.
      </div>
    </div>
  );
}

interface ReviewInputProps {
  task: CloseTask;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
}

function ReviewInput({ task, value, onChange }: ReviewInputProps) {
  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-semibold mb-3">Review Checklist</h4>
        {task.scenario.checkpoints && (
          <div className="space-y-2">
            {task.scenario.checkpoints.map((checkpoint: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{checkpoint}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="confirm-review"
          checked={value.confirmed || false}
          onChange={(e) => onChange({ ...value, confirmed: e.target.checked })}
          className="w-4 h-4"
        />
        <Label htmlFor="confirm-review" className="cursor-pointer">
          I have completed this review and confirm all items are accurate
        </Label>
      </div>
    </div>
  );
}
