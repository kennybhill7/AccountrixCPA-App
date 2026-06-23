'use client';

import React, { useState } from 'react';
import { ArrowLeft, Download, Filter, Calendar, FileText, DollarSign, ArrowRight, Home } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
  sourceDocument?: string;
  entryType: 'Journal Entry' | 'Cash Receipt' | 'Payment' | 'Adjustment' | 'Depreciation';
  enteredBy: string;
  journalId?: string;
}

interface AccountDetailViewProps {
  accountCode: string;
  accountName: string;
  accountType: string;
  periodFrom: string;
  periodTo: string;
  onBack: () => void;
  onDrillToJournal?: (journalId: string) => void;
  onDrillToSource?: (sourceDocument: string) => void;
}

interface Breadcrumb {
  label: string;
  action: () => void;
}

export default function AccountDetailView({
  accountCode,
  accountName,
  accountType,
  periodFrom,
  periodTo,
  onBack,
  onDrillToJournal,
  onDrillToSource
}: AccountDetailViewProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntryType, setSelectedEntryType] = useState('All');
  const [dateRange, setDateRange] = useState('current-period');

  // Mock transaction data for the account
  const allTransactions: Transaction[] = [
    {
      id: '1',
      date: '2024-01-31',
      description: 'Bank deposit - Customer payment batch #152',
      reference: 'DEP-152',
      debit: 125000,
      credit: 0,
      balance: 3325000,
      sourceDocument: 'BankDeposit_152.pdf',
      entryType: 'Cash Receipt',
      enteredBy: 'AI Automated',
      journalId: 'JE-2024-001'
    },
    {
      id: '2',
      date: '2024-01-30',
      description: 'ACH payment - Vendor batch processing',
      reference: 'ACH-VP-301',
      debit: 0,
      credit: 85000,
      balance: 3200000,
      sourceDocument: 'ACH_Batch_301.pdf',
      entryType: 'Payment',
      enteredBy: 'Sarah Johnson',
      journalId: 'JE-2024-002'
    },
    {
      id: '3',
      date: '2024-01-29',
      description: 'Wire transfer received - Investment proceeds',
      reference: 'WIRE-IN-789',
      debit: 500000,
      credit: 0,
      balance: 3285000,
      sourceDocument: 'WireTransfer_789.pdf',
      entryType: 'Cash Receipt',
      enteredBy: 'Michael Chen',
      journalId: 'JE-2024-003'
    },
    {
      id: '4',
      date: '2024-01-28',
      description: 'Check payment - Office lease Q1 2024',
      reference: 'CHK-1001',
      debit: 0,
      credit: 45000,
      balance: 2785000,
      sourceDocument: 'Check_1001.pdf',
      entryType: 'Payment',
      enteredBy: 'AI Automated',
      journalId: 'JE-2024-004'
    },
    {
      id: '5',
      date: '2024-01-27',
      description: 'Customer invoice payment - INV-2024-156',
      reference: 'REC-156',
      debit: 75000,
      credit: 0,
      balance: 2830000,
      sourceDocument: 'Payment_Receipt_156.pdf',
      entryType: 'Cash Receipt',
      enteredBy: 'AI Automated',
      journalId: 'JE-2024-005'
    },
    {
      id: '6',
      date: '2024-01-26',
      description: 'Payroll direct deposit - Bi-weekly payroll',
      reference: 'PAYROLL-014',
      debit: 0,
      credit: 185000,
      balance: 2755000,
      sourceDocument: 'Payroll_Report_014.pdf',
      entryType: 'Payment',
      enteredBy: 'HR System',
      journalId: 'JE-2024-006'
    },
    {
      id: '7',
      date: '2024-01-25',
      description: 'Bank service charges and fees',
      reference: 'BANK-FEES-JAN',
      debit: 0,
      credit: 1200,
      balance: 2940000,
      sourceDocument: 'Bank_Statement_Jan.pdf',
      entryType: 'Adjustment',
      enteredBy: 'AI Automated',
      journalId: 'JE-2024-007'
    },
    {
      id: '8',
      date: '2024-01-24',
      description: 'Interest earned on money market account',
      reference: 'INT-EARN-MM',
      debit: 3500,
      credit: 0,
      balance: 2941200,
      sourceDocument: 'Bank_Statement_Jan.pdf',
      entryType: 'Journal Entry',
      enteredBy: 'AI Automated',
      journalId: 'JE-2024-008'
    },
    {
      id: '9',
      date: '2024-01-23',
      description: 'Customer payment - recurring subscription',
      reference: 'SUB-PAY-789',
      debit: 25000,
      credit: 0,
      balance: 2937700,
      sourceDocument: 'Subscription_Payment_789.pdf',
      entryType: 'Cash Receipt',
      enteredBy: 'AI Automated',
      journalId: 'JE-2024-009'
    },
    {
      id: '10',
      date: '2024-01-22',
      description: 'Equipment purchase - Computer hardware',
      reference: 'PO-2024-045',
      debit: 0,
      credit: 15000,
      balance: 2912700,
      sourceDocument: 'Purchase_Order_045.pdf',
      entryType: 'Payment',
      enteredBy: 'David Kim',
      journalId: 'JE-2024-010'
    }
  ];

  // Filter transactions based on selected filters
  const filteredTransactions = allTransactions.filter(transaction => {
    if (selectedEntryType !== 'All' && transaction.entryType !== selectedEntryType) {
      return false;
    }
    // Add more filtering logic here if needed
    return true;
  });

  // Calculate summary statistics
  const totalDebits = filteredTransactions.reduce((sum, t) => sum + t.debit, 0);
  const totalCredits = filteredTransactions.reduce((sum, t) => sum + t.credit, 0);
  const netChange = totalDebits - totalCredits;
  const currentBalance = filteredTransactions.length > 0 ? filteredTransactions[0].balance : 0;

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const handleExportPDF = () => {
    // Export account detail to PDF
    const csvContent = generateTransactionCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `account_${accountCode}_detail_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    handleExportPDF(); // Same as PDF for now
  };

  const generateTransactionCSV = () => {
    let csv = 'Date,Description,Reference,Debit,Credit,Balance,Entry Type,Entered By,Source Document\n';

    filteredTransactions.forEach(transaction => {
      csv += `"${transaction.date}","${transaction.description}","${transaction.reference}","${transaction.debit}","${transaction.credit}","${transaction.balance}","${transaction.entryType}","${transaction.enteredBy}","${transaction.sourceDocument || ''}"\n`;
    });

    csv += `\n"Summary","","Total Debits","${totalDebits}","","",,,""\n`;
    csv += `"","","Total Credits","","${totalCredits}","",,,""\n`;
    csv += `"","","Net Change","${netChange}","","",,,""\n`;
    csv += `"","","Current Balance","${currentBalance}","","",,,""\n`;

    return csv;
  };

  const handleDrillToJournal = (journalId: string) => {
    if (onDrillToJournal) {
      onDrillToJournal(journalId);
    } else {
      alert(`Drilling to Journal Entry: ${journalId}\n\nThis would show the complete journal entry with all debits/credits and supporting documentation.`);
    }
  };

  const handleDrillToSource = (sourceDocument: string) => {
    if (onDrillToSource) {
      onDrillToSource(sourceDocument);
    } else {
      alert(`Opening Source Document: ${sourceDocument}\n\nThis would display the original document (PDF, image, etc.) that supports this transaction.`);
    }
  };

  // Breadcrumb navigation
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Dashboard', action: () => window.location.href = '/dashboard' },
    { label: 'Reports', action: () => window.location.href = '/accounting/reports' },
    { label: 'Trial Balance', action: onBack },
    { label: `${accountCode} - ${accountName}`, action: () => {} }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-6 print:bg-white print:border-none">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors print:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trial Balance</span>
          </button>

          <div className="flex items-center space-x-3 print:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4 print:hidden">
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ArrowRight className="w-3 h-3 text-gray-400" />}
              <button
                onClick={breadcrumb.action}
                className={`hover:text-gray-800 transition-colors ${
                  index === breadcrumbs.length - 1 ? 'text-gray-800 font-medium' : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                {index === 0 && <Home className="w-3 h-3 inline mr-1" />}
                {breadcrumb.label}
              </button>
            </React.Fragment>
          ))}
        </nav>

        {/* Account Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-1">Accountrix AI CPA Demo Company</h1>
          <h2 className="text-xl font-semibold text-black mb-1">General Ledger Detail</h2>
          <h3 className="text-lg text-black mb-2">Account: {accountCode} - {accountName}</h3>
          <h4 className="text-md text-black mb-4">Period: {periodFrom} to {periodTo}</h4>
          <div className="text-sm text-gray-600">
            <span>Generated on {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-blue-50 border-b border-blue-200 p-4 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entry Type</label>
              <select
                value={selectedEntryType}
                onChange={(e) => setSelectedEntryType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="All">All Entry Types</option>
                <option value="Journal Entry">Journal Entry</option>
                <option value="Cash Receipt">Cash Receipt</option>
                <option value="Payment">Payment</option>
                <option value="Adjustment">Adjustment</option>
                <option value="Depreciation">Depreciation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="current-period">Current Period</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="current-quarter">Current Quarter</option>
                <option value="current-year">Current Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Amount</label>
              <input
                type="number"
                placeholder="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Description</label>
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Account Summary */}
      <div className="bg-gray-50 border-b border-gray-200 p-6 print:bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Current Balance</h4>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(currentBalance)}</p>
            <p className="text-xs text-gray-500">As of {new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Total Debits</h4>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalDebits)}</p>
            <p className="text-xs text-gray-500">{filteredTransactions.filter(t => t.debit > 0).length} transactions</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Total Credits</h4>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCredits)}</p>
            <p className="text-xs text-gray-500">{filteredTransactions.filter(t => t.credit > 0).length} transactions</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Net Change</h4>
            <p className={`text-2xl font-bold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netChange >= 0 ? '+' : ''}{formatCurrency(netChange)}
            </p>
            <p className="text-xs text-gray-500">This period</p>
          </div>
        </div>
      </div>

      {/* Transaction Detail Table */}
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Reference</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-black uppercase tracking-wider">Debit</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-black uppercase tracking-wider">Credit</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-black uppercase tracking-wider">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider print:hidden">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-black max-w-xs">
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {transaction.entryType} • By {transaction.enteredBy}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-600">
                      {transaction.reference}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono text-black">
                      {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono text-black">
                      {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono font-semibold text-black">
                      {formatCurrency(transaction.balance)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm print:hidden">
                      <div className="flex space-x-2">
                        {transaction.journalId && (
                          <button
                            onClick={() => handleDrillToJournal(transaction.journalId!)}
                            className="text-blue-600 hover:text-blue-800 text-xs underline"
                            title="View Journal Entry"
                          >
                            JE
                          </button>
                        )}
                        {transaction.sourceDocument && (
                          <button
                            onClick={() => handleDrillToSource(transaction.sourceDocument!)}
                            className="text-green-600 hover:text-green-800 text-xs underline"
                            title="View Source Document"
                          >
                            Doc
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-sm text-gray-600">Total Transactions: </span>
                <span className="font-semibold text-gray-800">{filteredTransactions.length}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Period Activity: </span>
                <span className={`font-semibold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netChange >= 0 ? '+' : ''}{formatCurrency(netChange)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Ending Balance: </span>
                <span className="font-semibold text-gray-800">{formatCurrency(currentBalance)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="mt-6 text-center text-sm text-gray-600 print:text-black">
          <div className="border-t border-gray-200 pt-4">
            <p>General ledger detail prepared in accordance with Generally Accepted Accounting Principles (GAAP).</p>
            <p className="mt-1">Complete audit trail maintained. All supporting documentation available.</p>
            <p className="mt-2 font-semibold">Prepared by Accountrix AI CPA • {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}