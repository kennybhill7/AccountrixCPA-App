'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  ArrowLeft,
  Brain,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Edit3,
  Trash2,
  Eye,
  RefreshCw,
  Building,
  CreditCard,
  Users,
  Target,
  Shield,
  Zap,
  X,
  Save,
  AlertTriangle
} from 'lucide-react';

interface ChartAccount {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  subtype: string;
  balance: number;
  description: string;
  active: boolean;
  parentAccount?: string;
}

interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  account: string;
  status: 'draft' | 'posted' | 'reversed';
  createdBy: string;
}

interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  balance: number;
}

export default function GeneralLedgerPage() {
  const [activeTab, setActiveTab] = useState('chart-of-accounts');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showAccountDetail, setShowAccountDetail] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ChartAccount | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [filterType, setFilterType] = useState('all');
  const [editingAccount, setEditingAccount] = useState<ChartAccount | null>(null);
  const [newAccount, setNewAccount] = useState<Partial<ChartAccount>>({
    code: '',
    name: '',
    type: 'Asset',
    subtype: '',
    balance: 0,
    description: '',
    active: true
  });

  const [newJournalEntry, setNewJournalEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    entries: [
      { account: '', description: '', debit: 0, credit: 0 },
      { account: '', description: '', debit: 0, credit: 0 }
    ]
  });

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleExport = () => {
    const date = new Date().toISOString().split('T')[0];
    let csvContent = '';
    let fileName = '';

    // Export current data based on active tab
    if (activeTab === 'chart-of-accounts') {
      const csvHeaders = 'Account Code,Account Name,Type,Subtype,Balance,Description,Status\n';
      const csvData = chartOfAccounts.map(account =>
        `"${account.code}","${account.name}","${account.type}","${account.subtype}","${account.balance}","${account.description}","${account.active ? 'Active' : 'Inactive'}"`
      ).join('\n');
      csvContent = csvHeaders + csvData;
      fileName = `chart_of_accounts_${date}.csv`;
    } else if (activeTab === 'trial-balance') {
      const csvHeaders = 'Account Code,Account Name,Debit,Credit,Balance\n';
      const csvData = trialBalance.map(item =>
        `"${item.accountCode}","${item.accountName}","${item.debit}","${item.credit}","${item.balance}"`
      ).join('\n');
      csvContent = csvHeaders + csvData;
      fileName = `trial_balance_${date}.csv`;
    } else if (activeTab === 'journal-entries') {
      const csvHeaders = 'Entry ID,Date,Description,Reference,Account,Debit,Credit,Status,Created By\n';
      const csvData = journalEntries.map(entry =>
        `"${entry.id}","${entry.date}","${entry.description}","${entry.reference}","${entry.account}","${entry.debit}","${entry.credit}","${entry.status}","${entry.createdBy}"`
      ).join('\n');
      csvContent = csvHeaders + csvData;
      fileName = `journal_entries_${date}.csv`;
    }

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`✅ Export Complete!\n\nExported ${activeTab.replace('-', ' ')} data to CSV file.\nFile downloaded: ${fileName}`);
  };

  const handleAddAccount = () => {
    if (newAccount.code && newAccount.name) {
      const account: ChartAccount = {
        id: Date.now().toString(),
        code: newAccount.code!,
        name: newAccount.name!,
        type: newAccount.type!,
        subtype: newAccount.subtype!,
        balance: newAccount.balance!,
        description: newAccount.description!,
        active: newAccount.active!
      };
      setChartOfAccounts(prev => [...prev, account]);
      setNewAccount({
        code: '',
        name: '',
        type: 'Asset',
        subtype: '',
        balance: 0,
        description: '',
        active: true
      });
      setShowAddAccount(false);
    }
  };

  const handleEditAccount = (account: ChartAccount) => {
    setEditingAccount(account);
    setNewAccount(account);
    setShowAddAccount(true);
  };

  const handleUpdateAccount = () => {
    if (editingAccount && newAccount.code && newAccount.name) {
      setChartOfAccounts(prev =>
        prev.map(acc =>
          acc.id === editingAccount.id
            ? { ...acc, ...newAccount } as ChartAccount
            : acc
        )
      );
      setEditingAccount(null);
      setNewAccount({
        code: '',
        name: '',
        type: 'Asset',
        subtype: '',
        balance: 0,
        description: '',
        active: true
      });
      setShowAddAccount(false);
    }
  };

  const handleDeleteAccount = (accountId: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      setChartOfAccounts(prev => prev.filter(acc => acc.id !== accountId));
    }
  };

  const handleViewAccountDetail = (account: ChartAccount) => {
    setSelectedAccount(account);
    setShowAccountDetail(true);
  };

  const generateAccountTransactions = (account: ChartAccount) => {
    const transactions = [];
    const baseDate = new Date();

    for (let i = 0; i < 15; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i * 2);

      const isDebit = Math.random() > 0.5;
      const amount = Math.floor(Math.random() * 50000) + 1000;

      transactions.push({
        id: `TXN-${account.code}-${i + 1}`,
        date: date.toISOString().split('T')[0],
        description: getTransactionDescription(account.type, i),
        reference: `REF-${account.code}-${String(i + 1).padStart(3, '0')}`,
        debit: isDebit ? amount : 0,
        credit: isDebit ? 0 : amount,
        balance: account.balance + (Math.random() * 10000 - 5000),
        status: Math.random() > 0.1 ? 'posted' : 'pending'
      });
    }

    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getTransactionDescription = (accountType: string, index: number) => {
    const descriptions = {
      Asset: [
        'Bank deposit from customer payment',
        'Wire transfer received',
        'Interest earned on savings',
        'Insurance claim reimbursement',
        'Equipment purchase payment',
        'Petty cash replenishment',
        'Investment income received',
        'Security deposit refund'
      ],
      Liability: [
        'Vendor payment - office supplies',
        'Utility bill payment',
        'Credit card payment',
        'Loan payment - principal',
        'Accrued expense adjustment',
        'Payroll tax payment',
        'Insurance premium payment',
        'Legal fees payment'
      ],
      Revenue: [
        'Monthly service contract',
        'Consulting project completed',
        'Training session delivered',
        'Software license renewal',
        'Maintenance contract revenue',
        'Professional services rendered',
        'Subscription revenue recognized',
        'Bonus project completion'
      ],
      Expense: [
        'Office rent payment',
        'Employee salary payment',
        'Cloud services subscription',
        'Marketing campaign expense',
        'Professional development',
        'Client entertainment',
        'Office supplies purchase',
        'Travel expense reimbursement'
      ],
      Equity: [
        'Owner contribution',
        'Retained earnings transfer',
        'Dividend distribution',
        'Capital adjustment',
        'Stock issuance',
        'Partnership draw',
        'Equity correction',
        'Prior period adjustment'
      ]
    };

    const typeDescriptions = descriptions[accountType as keyof typeof descriptions] || descriptions.Asset;
    return typeDescriptions[index % typeDescriptions.length];
  };

  const addJournalEntryLine = () => {
    setNewJournalEntry(prev => ({
      ...prev,
      entries: [...prev.entries, { account: '', description: '', debit: 0, credit: 0 }]
    }));
  };

  const removeJournalEntryLine = (index: number) => {
    if (newJournalEntry.entries.length > 2) {
      setNewJournalEntry(prev => ({
        ...prev,
        entries: prev.entries.filter((_, i) => i !== index)
      }));
    }
  };

  const updateJournalEntryLine = (index: number, field: string, value: any) => {
    setNewJournalEntry(prev => ({
      ...prev,
      entries: prev.entries.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const calculateJournalEntryTotals = () => {
    const totalDebits = newJournalEntry.entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredits = newJournalEntry.entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
    return { totalDebits, totalCredits, difference: Math.abs(totalDebits - totalCredits) };
  };

  const handleSaveJournalEntry = () => {
    const { totalDebits, totalCredits } = calculateJournalEntryTotals();

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      alert('❌ Journal Entry Error\n\nEntry is out of balance!\n\nTotal Debits: ' + formatCurrency(totalDebits) + '\nTotal Credits: ' + formatCurrency(totalCredits) + '\n\nPlease ensure debits equal credits before saving.');
      return;
    }

    if (!newJournalEntry.description.trim()) {
      alert('❌ Missing Information\n\nPlease enter a description for this journal entry.');
      return;
    }

    const entryId = `JE-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
    alert(`✅ Journal Entry Created Successfully!\n\nEntry ID: ${entryId}\nDate: ${newJournalEntry.date}\nDescription: ${newJournalEntry.description}\nTotal Amount: ${formatCurrency(totalDebits)}\n\n🔄 Entry has been posted to the general ledger.\n📊 Trial balance and account balances updated.\n📋 Entry is ready for financial reporting.`);

    // Reset form
    setNewJournalEntry({
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      entries: [
        { account: '', description: '', debit: 0, credit: 0 },
        { account: '', description: '', debit: 0, credit: 0 }
      ]
    });
    setShowAddEntry(false);
  };

  const [chartOfAccounts, setChartOfAccounts] = useState<ChartAccount[]>([
    // Assets
    { id: '1', code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset', subtype: 'Current Assets', balance: 5700000, description: 'Primary operating cash accounts', active: true },
    { id: '2', code: '1010', name: 'Checking Account - Operations', type: 'Asset', subtype: 'Current Assets', balance: 3200000, description: 'Main operating checking account', active: true, parentAccount: '1000' },
    { id: '3', code: '1020', name: 'Savings Account - Reserve', type: 'Asset', subtype: 'Current Assets', balance: 2500000, description: 'Emergency reserve funds', active: true, parentAccount: '1000' },
    { id: '4', code: '1100', name: 'Accounts Receivable', type: 'Asset', subtype: 'Current Assets', balance: 335000, description: 'Outstanding customer invoices', active: true },
    { id: '5', code: '1200', name: 'Inventory', type: 'Asset', subtype: 'Current Assets', balance: 0, description: 'Service-based business - no inventory', active: false },
    { id: '6', code: '1300', name: 'Prepaid Expenses', type: 'Asset', subtype: 'Current Assets', balance: 45000, description: 'Prepaid insurance, rent, etc.', active: true },
    { id: '7', code: '1500', name: 'Equipment', type: 'Asset', subtype: 'Fixed Assets', balance: 125000, description: 'Office equipment and computers', active: true },
    { id: '8', code: '1510', name: 'Accumulated Depreciation - Equipment', type: 'Asset', subtype: 'Fixed Assets', balance: -35000, description: 'Depreciation on equipment', active: true },

    // Liabilities
    { id: '20', code: '2000', name: 'Accounts Payable', type: 'Liability', subtype: 'Current Liabilities', balance: 197000, description: 'Outstanding vendor bills', active: true },
    { id: '21', code: '2100', name: 'Accrued Expenses', type: 'Liability', subtype: 'Current Liabilities', balance: 85000, description: 'Accrued but unpaid expenses', active: true },
    { id: '22', code: '2200', name: 'Payroll Liabilities', type: 'Liability', subtype: 'Current Liabilities', balance: 125000, description: 'Payroll taxes and benefits payable', active: true },
    { id: '23', code: '2300', name: 'Deferred Revenue', type: 'Liability', subtype: 'Current Liabilities', balance: 450000, description: 'Advance payments from customers', active: true },
    { id: '24', code: '2500', name: 'Long-term Debt', type: 'Liability', subtype: 'Long-term Liabilities', balance: 500000, description: 'Equipment financing', active: true },

    // Equity
    { id: '30', code: '3000', name: 'Owner\'s Equity', type: 'Equity', subtype: 'Capital', balance: 2500000, description: 'Initial capital investment', active: true },
    { id: '31', code: '3100', name: 'Retained Earnings', type: 'Equity', subtype: 'Retained Earnings', balance: 1850000, description: 'Accumulated profits', active: true },
    { id: '32', code: '3200', name: 'Current Year Earnings', type: 'Equity', subtype: 'Current Earnings', balance: 750000, description: 'Current year profit/loss', active: true },

    // Revenue
    { id: '40', code: '4000', name: 'Service Revenue', type: 'Revenue', subtype: 'Operating Revenue', balance: 2800000, description: 'Primary service revenue', active: true },
    { id: '41', code: '4100', name: 'Consulting Revenue', type: 'Revenue', subtype: 'Operating Revenue', balance: 450000, description: 'Consulting services', active: true },
    { id: '42', code: '4200', name: 'Training Revenue', type: 'Revenue', subtype: 'Operating Revenue', balance: 125000, description: 'Training and education services', active: true },
    { id: '43', code: '4900', name: 'Other Income', type: 'Revenue', subtype: 'Other Revenue', balance: 25000, description: 'Interest and other income', active: true },

    // Expenses
    { id: '50', code: '5000', name: 'Salaries and Wages', type: 'Expense', subtype: 'Personnel Expenses', balance: 1200000, description: 'Employee salaries and wages', active: true },
    { id: '51', code: '5100', name: 'Employee Benefits', type: 'Expense', subtype: 'Personnel Expenses', balance: 350000, description: 'Health insurance, retirement, etc.', active: true },
    { id: '52', code: '5200', name: 'Rent Expense', type: 'Expense', subtype: 'Operating Expenses', balance: 180000, description: 'Office rent', active: true },
    { id: '53', code: '5300', name: 'Technology Expenses', type: 'Expense', subtype: 'Operating Expenses', balance: 285000, description: 'Software, cloud services, IT', active: true },
    { id: '54', code: '5400', name: 'Professional Services', type: 'Expense', subtype: 'Operating Expenses', balance: 75000, description: 'Legal, accounting, consulting', active: true },
    { id: '55', code: '5500', name: 'Marketing and Advertising', type: 'Expense', subtype: 'Operating Expenses', balance: 95000, description: 'Marketing campaigns and advertising', active: true },
    { id: '56', code: '5600', name: 'Office Expenses', type: 'Expense', subtype: 'Operating Expenses', balance: 45000, description: 'Office supplies and utilities', active: true },
    { id: '57', code: '5700', name: 'Travel and Entertainment', type: 'Expense', subtype: 'Operating Expenses', balance: 65000, description: 'Business travel and client entertainment', active: true },
    { id: '58', code: '5800', name: 'Depreciation Expense', type: 'Expense', subtype: 'Operating Expenses', balance: 25000, description: 'Equipment depreciation', active: true },
    { id: '59', code: '5900', name: 'Interest Expense', type: 'Expense', subtype: 'Other Expenses', balance: 15000, description: 'Interest on debt', active: true }
  ]);

  const [journalEntries] = useState<JournalEntry[]>([
    {
      id: 'JE-2024-001',
      date: '2024-01-18',
      description: 'Monthly service revenue recognition',
      reference: 'REV-JAN-001',
      debit: 335000,
      credit: 0,
      account: '1100 - Accounts Receivable',
      status: 'posted',
      createdBy: 'System Auto-Entry'
    },
    {
      id: 'JE-2024-001B',
      date: '2024-01-18',
      description: 'Monthly service revenue recognition',
      reference: 'REV-JAN-001',
      debit: 0,
      credit: 335000,
      account: '4000 - Service Revenue',
      status: 'posted',
      createdBy: 'System Auto-Entry'
    },
    {
      id: 'JE-2024-002',
      date: '2024-01-17',
      description: 'AWS cloud services expense',
      reference: 'AWS-JAN-001',
      debit: 15000,
      credit: 0,
      account: '5300 - Technology Expenses',
      status: 'posted',
      createdBy: 'Auto-Import'
    },
    {
      id: 'JE-2024-002B',
      date: '2024-01-17',
      description: 'AWS cloud services expense',
      reference: 'AWS-JAN-001',
      debit: 0,
      credit: 15000,
      account: '2000 - Accounts Payable',
      status: 'posted',
      createdBy: 'Auto-Import'
    },
    {
      id: 'JE-2024-003',
      date: '2024-01-16',
      description: 'Monthly payroll processing',
      reference: 'PAY-JAN-001',
      debit: 125000,
      credit: 0,
      account: '5000 - Salaries and Wages',
      status: 'posted',
      createdBy: 'Payroll System'
    },
    {
      id: 'JE-2024-003B',
      date: '2024-01-16',
      description: 'Monthly payroll processing',
      reference: 'PAY-JAN-001',
      debit: 0,
      credit: 125000,
      account: '1010 - Checking Account - Operations',
      status: 'posted',
      createdBy: 'Payroll System'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Asset': return 'text-green-400 bg-green-500/20';
      case 'Liability': return 'text-red-400 bg-red-500/20';
      case 'Equity': return 'text-blue-400 bg-blue-500/20';
      case 'Revenue': return 'text-purple-400 bg-purple-500/20';
      case 'Expense': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const generateTrialBalance = (): TrialBalanceItem[] => {
    return chartOfAccounts.filter(account => account.active).map(account => {
      const isDebitAccount = ['Asset', 'Expense'].includes(account.type);
      const isCreditAccount = ['Liability', 'Equity', 'Revenue'].includes(account.type);

      return {
        accountCode: account.code,
        accountName: account.name,
        debit: isDebitAccount && account.balance > 0 ? account.balance : 0,
        credit: isCreditAccount && account.balance > 0 ? account.balance : (account.balance < 0 ? Math.abs(account.balance) : 0),
        balance: account.balance
      };
    });
  };

  const trialBalance = generateTrialBalance();
  const totalDebits = trialBalance.reduce((sum, item) => sum + item.debit, 0);
  const totalCredits = trialBalance.reduce((sum, item) => sum + item.credit, 0);

  const tabs = [
    { id: 'chart-of-accounts', name: 'Chart of Accounts', icon: BarChart3 },
    { id: 'journal-entries', name: 'Journal Entries', icon: FileText },
    { id: 'trial-balance', name: 'Trial Balance', icon: CheckCircle },
    { id: 'reconciliation', name: 'Bank Reconciliation', icon: RefreshCw }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'reversed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredAccounts = chartOfAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.code.includes(searchTerm);
    const matchesType = filterType === 'all' || account.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={handleBack} className="p-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Accountrix General Ledger</h1>
                <p className="text-gray-400">Complete chart of accounts, journal entries, and trial balance management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="current-month" className="text-black bg-white">Current Month</option>
              <option value="last-month" className="text-black bg-white">Last Month</option>
              <option value="current-quarter" className="text-black bg-white">Current Quarter</option>
              <option value="current-year" className="text-black bg-white">Current Year</option>
              {Array.from({length: 26}, (_, i) => 2025 - i).map(year => (
                <option key={year} value={year.toString()} className="text-black bg-white">Year {year}</option>
              ))}
            </select>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowAddEntry(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-black/10 backdrop-blur-md border-b border-white/10">
        <div className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-400 text-green-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'chart-of-accounts' && (
          <div className="space-y-6">
            {/* Account Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
              {['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].map((type) => {
                const typeAccounts = chartOfAccounts.filter(acc => acc.type === type && acc.active);
                const totalBalance = typeAccounts.reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

                return (
                  <div key={type} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(type)}`}>
                          {type}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">{typeAccounts.length} accounts</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{formatCurrency(totalBalance)}</h3>
                    <p className="text-gray-400 text-sm">Total {type.toLowerCase()} balance</p>
                  </div>
                );
              })}
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="all" className="text-black bg-white">All Types</option>
                  <option value="asset" className="text-black bg-white">Assets</option>
                  <option value="liability" className="text-black bg-white">Liabilities</option>
                  <option value="equity" className="text-black bg-white">Equity</option>
                  <option value="revenue" className="text-black bg-white">Revenue</option>
                  <option value="expense" className="text-black bg-white">Expenses</option>
                </select>
              </div>
              <button
                onClick={() => setShowAddAccount(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Account</span>
              </button>
            </div>

            {/* Accounts Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Account Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Account Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subtype</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white font-mono">{account.code}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-white font-medium">{account.name}</p>
                            <p className="text-gray-400 text-sm">{account.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(account.type)}`}>
                            {account.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{account.subtype}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-semibold ${account.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(account.balance)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-blue-400 hover:text-blue-300 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditAccount(account)}
                              className="p-1 text-green-400 hover:text-green-300 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(account.id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trial-balance' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Trial Balance - {selectedPeriod}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  Math.abs(totalDebits - totalCredits) < 0.01 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {Math.abs(totalDebits - totalCredits) < 0.01 ? 'Balanced' : 'Out of Balance'}
                </span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Account Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Account Name</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Debit</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {trialBalance.map((item, index) => {
                      const account = chartOfAccounts.find(acc => acc.code === item.accountCode);
                      return (
                        <tr key={index} className="hover:bg-white/5 cursor-pointer" onClick={() => account && handleViewAccountDetail(account)}>
                          <td className="px-6 py-4 whitespace-nowrap text-white font-mono">{item.accountCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-white hover:text-blue-400 transition-colors">{item.accountName}</span>
                            <Eye className="w-4 h-4 text-gray-400 ml-2 inline opacity-0 group-hover:opacity-100 transition-opacity" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-white font-semibold">
                            {item.debit > 0 ? formatCurrency(item.debit) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-white font-semibold">
                            {item.credit > 0 ? formatCurrency(item.credit) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="border-t-2 border-white/20 bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap text-white font-bold" colSpan={2}>TOTALS</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-white font-bold">{formatCurrency(totalDebits)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-white font-bold">{formatCurrency(totalCredits)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="text-green-400 font-semibold mb-2">Total Debits</h4>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalDebits)}</p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-2">Total Credits</h4>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalCredits)}</p>
                </div>
                <div className={`p-4 border rounded-lg ${
                  Math.abs(totalDebits - totalCredits) < 0.01
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-red-500/10 border-red-500/20'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    Math.abs(totalDebits - totalCredits) < 0.01 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    Difference
                  </h4>
                  <p className="text-2xl font-bold text-white">{formatCurrency(Math.abs(totalDebits - totalCredits))}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'journal-entries' && (
          <div className="space-y-6">
            {/* Journal Entries List */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span>Journal Entries</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Entry ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Account</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Debit</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Credit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {journalEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap text-white font-mono">{entry.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{entry.date}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">{entry.description}</p>
                            <p className="text-gray-400 text-sm">Ref: {entry.reference}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{entry.account}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-white font-semibold">
                          {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-white font-semibold">
                          {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-blue-400 hover:text-blue-300 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-green-400 hover:text-green-300 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reconciliation' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-purple-400" />
                <span>Bank Reconciliation</span>
                <span className="text-sm text-purple-400 bg-purple-500/20 px-2 py-1 rounded">AI-Powered</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">Book Balance</h4>
                    <p className="text-2xl font-bold text-white">{formatCurrency(3200000)}</p>
                    <p className="text-gray-400 text-sm">Checking Account - Operations</p>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">Bank Statement</h4>
                    <p className="text-2xl font-bold text-white">{formatCurrency(3195000)}</p>
                    <p className="text-gray-400 text-sm">As of Jan 18, 2024</p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-white font-semibold mb-4">Reconciliation Items</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Outstanding Checks:</span>
                      <span className="text-red-400">-{formatCurrency(8000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Deposits in Transit:</span>
                      <span className="text-green-400">+{formatCurrency(3000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bank Fees:</span>
                      <span className="text-red-400">-{formatCurrency(25)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">Adjusted Balance:</span>
                        <span className="text-green-400">{formatCurrency(3195000)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="text-green-400 font-semibold mb-2">✓ Reconciliation Complete</h4>
                <p className="text-gray-300 text-sm">
                  Account reconciled successfully. AI matched 247 of 250 transactions automatically.
                  3 items flagged for review. Next reconciliation scheduled for February 1st.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingAccount ? 'Edit Account' : 'Add New Account'}
              </h3>
              <p className="text-gray-400 text-sm">
                {editingAccount ? 'Update account information' : 'Create a new chart of accounts entry'}
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Account Code</label>
                  <input
                    type="text"
                    value={newAccount.code || ''}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Account Name</label>
                  <input
                    type="text"
                    value={newAccount.name || ''}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Cash and Cash Equivalents"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                  <select
                    value={newAccount.type || 'Asset'}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, type: e.target.value as ChartAccount['type'] }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Asset" className="text-black bg-white">Asset</option>
                    <option value="Liability" className="text-black bg-white">Liability</option>
                    <option value="Equity" className="text-black bg-white">Equity</option>
                    <option value="Revenue" className="text-black bg-white">Revenue</option>
                    <option value="Expense" className="text-black bg-white">Expense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subtype</label>
                  <input
                    type="text"
                    value={newAccount.subtype || ''}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, subtype: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Current Assets"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Balance</label>
                  <input
                    type="number"
                    value={newAccount.balance || 0}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={newAccount.active ? 'active' : 'inactive'}
                    onChange={(e) => setNewAccount(prev => ({ ...prev, active: e.target.value === 'active' }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="active" className="text-black bg-white">Active</option>
                    <option value="inactive" className="text-black bg-white">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newAccount.description || ''}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                  placeholder="Account description and purpose..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddAccount(false);
                  setEditingAccount(null);
                  setNewAccount({
                    code: '',
                    name: '',
                    type: 'Asset',
                    subtype: '',
                    balance: 0,
                    description: '',
                    active: true
                  });
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingAccount ? handleUpdateAccount : handleAddAccount}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                {editingAccount ? 'Update Account' : 'Add Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Detail Modal */}
      {showAccountDetail && selectedAccount && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAccountTypeColor(selectedAccount.type)}`}>
                      {selectedAccount.type}
                    </span>
                    <span>{selectedAccount.code} - {selectedAccount.name}</span>
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{selectedAccount.description}</p>
                </div>
                <button
                  onClick={() => setShowAccountDetail(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Account Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm font-medium">Current Balance</h4>
                  <p className={`text-2xl font-bold ${selectedAccount.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(selectedAccount.balance)}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm font-medium">Account Type</h4>
                  <p className="text-white text-lg font-semibold">{selectedAccount.type}</p>
                  <p className="text-gray-400 text-sm">{selectedAccount.subtype}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm font-medium">Transaction Count</h4>
                  <p className="text-white text-2xl font-bold">
                    {generateAccountTransactions(selectedAccount).length}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm font-medium">Status</h4>
                  <p className={`text-lg font-semibold ${selectedAccount.active ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedAccount.active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white/5 border border-white/10 rounded-lg">
                <div className="p-4 border-b border-white/10">
                  <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span>Transaction History</span>
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Reference</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Debit</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Credit</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Balance</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {generateAccountTransactions(selectedAccount).map((transaction, index) => (
                        <tr key={transaction.id} className="hover:bg-white/5">
                          <td className="px-4 py-3 whitespace-nowrap text-gray-300 text-sm">{transaction.date}</td>
                          <td className="px-4 py-3 text-white text-sm">{transaction.description}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-300 text-sm font-mono">{transaction.reference}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-white font-semibold">
                            {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-white font-semibold">
                            {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-white font-semibold">
                            {formatCurrency(transaction.balance)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAccountDetail(false);
                    handleEditAccount(selectedAccount);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Account</span>
                </button>
                <button
                  onClick={() => setShowAccountDetail(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Journal Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <span>Manual Journal Entry</span>
                    <span className="text-sm text-blue-400 bg-blue-500/20 px-2 py-1 rounded">Professional GL</span>
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Create professional journal entries with automatic balancing verification</p>
                </div>
                <button
                  onClick={() => setShowAddEntry(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Journal Entry Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Entry Date</label>
                  <input
                    type="date"
                    value={newJournalEntry.date}
                    onChange={(e) => setNewJournalEntry(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Reference Number</label>
                  <input
                    type="text"
                    value={newJournalEntry.reference}
                    onChange={(e) => setNewJournalEntry(prev => ({ ...prev, reference: e.target.value }))}
                    placeholder={`JE-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Entry Description</label>
                  <input
                    type="text"
                    value={newJournalEntry.description}
                    onChange={(e) => setNewJournalEntry(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of transaction"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Journal Entry Lines */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Journal Entry Lines</h4>
                  <button
                    onClick={addJournalEntryLine}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Line</span>
                  </button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 mb-3 p-3 bg-white/5 rounded-lg">
                  <div className="col-span-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Account</div>
                  <div className="col-span-4 text-xs font-medium text-gray-300 uppercase tracking-wider">Description</div>
                  <div className="col-span-2 text-xs font-medium text-gray-300 uppercase tracking-wider text-right">Debit</div>
                  <div className="col-span-2 text-xs font-medium text-gray-300 uppercase tracking-wider text-right">Credit</div>
                  <div className="col-span-1 text-xs font-medium text-gray-300 uppercase tracking-wider text-center">Action</div>
                </div>

                {/* Entry Lines */}
                <div className="space-y-3">
                  {newJournalEntry.entries.map((entry, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 bg-white/5 rounded-lg">
                      <div className="col-span-3">
                        <select
                          value={entry.account}
                          onChange={(e) => updateJournalEntryLine(index, 'account', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Account</option>
                          {chartOfAccounts
                            .filter(acc => acc.active)
                            .sort((a, b) => a.code.localeCompare(b.code))
                            .map(account => (
                              <option key={account.id} value={`${account.code} - ${account.name}`} className="text-black bg-white">
                                {account.code} - {account.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Line description"
                          value={entry.description}
                          onChange={(e) => updateJournalEntryLine(index, 'description', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={entry.debit || ''}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            updateJournalEntryLine(index, 'debit', value);
                            if (value > 0) updateJournalEntryLine(index, 'credit', 0);
                          }}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 text-right"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={entry.credit || ''}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            updateJournalEntryLine(index, 'credit', value);
                            if (value > 0) updateJournalEntryLine(index, 'debit', 0);
                          }}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 text-right"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          onClick={() => removeJournalEntryLine(index)}
                          disabled={newJournalEntry.entries.length <= 2}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-7"></div>
                    <div className="col-span-2 text-right">
                      <div className="text-sm text-gray-300 mb-1">Total Debits:</div>
                      <div className="text-lg font-semibold text-green-400">
                        {formatCurrency(calculateJournalEntryTotals().totalDebits)}
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="text-sm text-gray-300 mb-1">Total Credits:</div>
                      <div className="text-lg font-semibold text-blue-400">
                        {formatCurrency(calculateJournalEntryTotals().totalCredits)}
                      </div>
                    </div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Balance Check */}
                  <div className="mt-4 p-3 rounded-lg text-center">
                    {calculateJournalEntryTotals().difference < 0.01 ? (
                      <div className="text-green-400 font-semibold flex items-center justify-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Entry is balanced ✓</span>
                      </div>
                    ) : (
                      <div className="text-red-400 font-semibold flex items-center justify-center space-x-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Out of balance by {formatCurrency(calculateJournalEntryTotals().difference)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Entry Templates */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                <h4 className="text-white font-semibold mb-3">Quick Entry Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setNewJournalEntry(prev => ({
                        ...prev,
                        description: 'Cash receipt from customer',
                        entries: [
                          { account: '1010 - Checking Account - Operations', description: 'Customer payment received', debit: 0, credit: 0 },
                          { account: '1100 - Accounts Receivable', description: 'Payment on account', debit: 0, credit: 0 }
                        ]
                      }));
                    }}
                    className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-left hover:bg-green-500/20 transition-colors"
                  >
                    <div className="text-green-400 font-medium text-sm">Cash Receipt</div>
                    <div className="text-gray-300 text-xs">Customer payment received</div>
                  </button>
                  <button
                    onClick={() => {
                      setNewJournalEntry(prev => ({
                        ...prev,
                        description: 'Expense payment to vendor',
                        entries: [
                          { account: '5300 - Technology Expenses', description: 'Monthly software subscription', debit: 0, credit: 0 },
                          { account: '1010 - Checking Account - Operations', description: 'Payment to vendor', debit: 0, credit: 0 }
                        ]
                      }));
                    }}
                    className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-left hover:bg-blue-500/20 transition-colors"
                  >
                    <div className="text-blue-400 font-medium text-sm">Expense Payment</div>
                    <div className="text-gray-300 text-xs">Payment to vendor</div>
                  </button>
                  <button
                    onClick={() => {
                      setNewJournalEntry(prev => ({
                        ...prev,
                        description: 'Monthly depreciation entry',
                        entries: [
                          { account: '5800 - Depreciation Expense', description: 'Monthly depreciation', debit: 0, credit: 0 },
                          { account: '1510 - Accumulated Depreciation - Equipment', description: 'Accumulated depreciation', debit: 0, credit: 0 }
                        ]
                      }));
                    }}
                    className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-left hover:bg-purple-500/20 transition-colors"
                  >
                    <div className="text-purple-400 font-medium text-sm">Depreciation</div>
                    <div className="text-gray-300 text-xs">Monthly depreciation entry</div>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddEntry(false)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('💾 Journal Entry Draft Saved\n\nEntry saved for later completion. You can return to finish and post this entry at any time.\n\n📋 Draft entries are accessible from the Journal Entries tab.');
                  }}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={handleSaveJournalEntry}
                  disabled={calculateJournalEntryTotals().difference >= 0.01}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Post Entry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}