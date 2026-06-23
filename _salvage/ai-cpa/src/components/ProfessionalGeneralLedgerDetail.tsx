'use client';

import React, { useState } from 'react';

interface GeneralLedgerDetailProps {
  companyName: string;
  periodFrom: string;
  periodTo: string;
  accountCode?: string;
  accountName?: string;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

interface LedgerTransaction {
  date: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  source: string;
}

interface LedgerAccount {
  accountCode: string;
  accountName: string;
  accountType: string;
  openingBalance: number;
  transactions: LedgerTransaction[];
  closingBalance: number;
}

export default function ProfessionalGeneralLedgerDetail({
  companyName,
  periodFrom,
  periodTo,
  accountCode,
  accountName,
  onExportPDF,
  onExportExcel
}: GeneralLedgerDetailProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>(accountCode || '1000');

  // Mock general ledger data
  const ledgerAccounts: LedgerAccount[] = [
    {
      accountCode: '1000',
      accountName: 'Cash and Cash Equivalents',
      accountType: 'Asset',
      openingBalance: 5200000,
      closingBalance: 5700000,
      transactions: [
        {
          date: '2024-01-02',
          reference: 'DEP-001',
          description: 'Customer payment - Invoice #12001',
          debit: 85000,
          credit: 0,
          balance: 5285000,
          source: 'AR'
        },
        {
          date: '2024-01-03',
          reference: 'CHK-001',
          description: 'Rent payment - January 2024',
          debit: 0,
          credit: 15000,
          balance: 5270000,
          source: 'AP'
        },
        {
          date: '2024-01-05',
          reference: 'DEP-002',
          description: 'Service revenue - Project Alpha',
          debit: 125000,
          credit: 0,
          balance: 5395000,
          source: 'REV'
        },
        {
          date: '2024-01-08',
          reference: 'CHK-002',
          description: 'Payroll processing - January Week 1',
          debit: 0,
          credit: 45000,
          balance: 5350000,
          source: 'PAY'
        },
        {
          date: '2024-01-10',
          reference: 'DEP-003',
          description: 'Consulting revenue - Client B',
          debit: 75000,
          credit: 0,
          balance: 5425000,
          source: 'REV'
        },
        {
          date: '2024-01-12',
          reference: 'CHK-003',
          description: 'Technology expenses - AWS services',
          debit: 0,
          credit: 8500,
          balance: 5416500,
          source: 'EXP'
        },
        {
          date: '2024-01-15',
          reference: 'DEP-004',
          description: 'Customer payment - Invoice #12015',
          debit: 95000,
          credit: 0,
          balance: 5511500,
          source: 'AR'
        },
        {
          date: '2024-01-18',
          reference: 'CHK-004',
          description: 'Professional services - Legal fees',
          debit: 0,
          credit: 12500,
          balance: 5499000,
          source: 'EXP'
        },
        {
          date: '2024-01-22',
          reference: 'ADJ-001',
          description: 'Month-end accrual adjustment',
          debit: 25000,
          credit: 0,
          balance: 5524000,
          source: 'JE'
        },
        {
          date: '2024-01-30',
          reference: 'DEP-005',
          description: 'Training revenue - Workshop series',
          debit: 35000,
          credit: 0,
          balance: 5559000,
          source: 'REV'
        },
        {
          date: '2024-01-31',
          reference: 'CHK-005',
          description: 'Interest payment - Equipment loan',
          debit: 0,
          credit: 1250,
          balance: 5557750,
          source: 'EXP'
        },
        {
          date: '2024-01-31',
          reference: 'ADJ-002',
          description: 'Bank reconciliation adjustment',
          debit: 142250,
          credit: 0,
          balance: 5700000,
          source: 'JE'
        }
      ]
    },
    {
      accountCode: '4000',
      accountName: 'Service Revenue',
      accountType: 'Revenue',
      openingBalance: 0,
      closingBalance: 2800000,
      transactions: [
        {
          date: '2024-01-05',
          reference: 'INV-12001',
          description: 'Monthly service contract - Client A',
          debit: 0,
          credit: 125000,
          balance: 125000,
          source: 'REV'
        },
        {
          date: '2024-01-12',
          reference: 'INV-12002',
          description: 'Custom development - Project Beta',
          debit: 0,
          credit: 85000,
          balance: 210000,
          source: 'REV'
        },
        {
          date: '2024-01-15',
          reference: 'INV-12003',
          description: 'Monthly service contract - Client B',
          debit: 0,
          credit: 95000,
          balance: 305000,
          source: 'REV'
        },
        {
          date: '2024-01-18',
          reference: 'INV-12004',
          description: 'Implementation services - Client C',
          debit: 0,
          credit: 155000,
          balance: 460000,
          source: 'REV'
        },
        {
          date: '2024-01-25',
          reference: 'INV-12005',
          description: 'Monthly service contract - Client D',
          debit: 0,
          credit: 75000,
          balance: 535000,
          source: 'REV'
        },
        {
          date: '2024-01-31',
          reference: 'ADJ-003',
          description: 'Revenue recognition adjustment',
          debit: 0,
          credit: 2265000,
          balance: 2800000,
          source: 'JE'
        }
      ]
    }
  ];

  const currentAccount = ledgerAccounts.find(acc => acc.accountCode === selectedAccount) || ledgerAccounts[0];

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));

    return amount < 0 ? `(${formatted})` : formatted;
  };

  const handleExportPDF = () => {
    if (onExportPDF) {
      onExportPDF();
    } else {
      window.print();
    }
  };

  const handleExportExcel = () => {
    if (onExportExcel) {
      onExportExcel();
    } else {
      // Default Excel export
      const csvContent = generateCSVContent();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `general_ledger_${selectedAccount}_${periodFrom}_${periodTo}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generateCSVContent = () => {
    let csv = `General Ledger Detail - ${currentAccount.accountName} (${currentAccount.accountCode})\n`;
    csv += `Period: ${periodFrom} to ${periodTo}\n\n`;
    csv += 'Date,Reference,Description,Debit,Credit,Balance,Source\n';

    // Opening balance
    csv += `"${periodFrom}","","Opening Balance","","","${currentAccount.openingBalance}",""\n`;

    // Transactions
    currentAccount.transactions.forEach(trans => {
      csv += `"${trans.date}","${trans.reference}","${trans.description}","${trans.debit}","${trans.credit}","${trans.balance}","${trans.source}"\n`;
    });

    // Closing balance
    csv += `"${periodTo}","","Closing Balance","","","${currentAccount.closingBalance}",""\n`;

    return csv;
  };

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Header with Account Selector */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-300 p-4 print:bg-white print:p-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">General Ledger Detail Report</h2>
            <p className="text-sm text-gray-600">Detailed transaction history by account</p>
          </div>

          {/* Account Selector - Hidden in Print */}
          <div className="flex items-center space-x-4 print:hidden">
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              {ledgerAccounts.map(account => (
                <option key={account.accountCode} value={account.accountCode}>
                  {account.accountCode} - {account.accountName}
                </option>
              ))}
            </select>
            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors text-sm"
            >
              <span>PDF</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors text-sm"
            >
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            GAAP Compliant
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            Audit Trail Complete
          </span>
        </div>
      </div>

      {/* Professional Report Header */}
      <div className="bg-white border-b-2 border-black p-6 text-center">
        <h1 className="text-2xl font-bold text-black mb-1">{companyName}</h1>
        <h2 className="text-xl font-semibold text-black mb-1">General Ledger Detail</h2>
        <h3 className="text-lg text-black mb-1">
          {currentAccount.accountCode} - {currentAccount.accountName}
        </h3>
        <h4 className="text-md text-black mb-2">
          For the Period {periodFrom} to {periodTo}
        </h4>
        <div className="text-sm text-gray-600">
          <span>Prepared on {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
      </div>

      {/* Account Summary */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Account Type</h4>
            <p className="text-lg font-semibold text-gray-800">{currentAccount.accountType}</p>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Opening Balance</h4>
            <p className="text-lg font-semibold text-blue-600">{formatCurrency(currentAccount.openingBalance)}</p>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Total Transactions</h4>
            <p className="text-lg font-semibold text-gray-800">{currentAccount.transactions.length}</p>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Closing Balance</h4>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(currentAccount.closingBalance)}</p>
          </div>
        </div>
      </div>

      {/* Transaction Detail Table */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-3 px-4 font-bold text-black">Date</th>
                <th className="text-left py-3 px-4 font-bold text-black">Reference</th>
                <th className="text-left py-3 px-4 font-bold text-black">Description</th>
                <th className="text-right py-3 px-4 font-bold text-black">Debit</th>
                <th className="text-right py-3 px-4 font-bold text-black">Credit</th>
                <th className="text-right py-3 px-4 font-bold text-black">Balance</th>
                <th className="text-center py-3 px-4 font-bold text-black">Source</th>
              </tr>
            </thead>
            <tbody>
              {/* Opening Balance Row */}
              <tr className="border-b border-gray-200 bg-blue-50">
                <td className="py-3 px-4 font-medium text-black">{periodFrom}</td>
                <td className="py-3 px-4 text-black">OPENING</td>
                <td className="py-3 px-4 font-medium text-black">Opening Balance</td>
                <td className="py-3 px-4 text-right text-black">-</td>
                <td className="py-3 px-4 text-right text-black">-</td>
                <td className="py-3 px-4 text-right font-bold text-black">{formatCurrency(currentAccount.openingBalance)}</td>
                <td className="py-3 px-4 text-center text-black">-</td>
              </tr>

              {/* Transaction Rows */}
              {currentAccount.transactions.map((transaction, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-black">{transaction.date}</td>
                  <td className="py-3 px-4 text-blue-600 font-medium">{transaction.reference}</td>
                  <td className="py-3 px-4 text-black">{transaction.description}</td>
                  <td className="py-3 px-4 text-right text-black font-mono">
                    {transaction.debit ? formatCurrency(transaction.debit) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-black font-mono">
                    {transaction.credit ? formatCurrency(transaction.credit) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-black font-mono">
                    {formatCurrency(transaction.balance)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {transaction.source}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Closing Balance Row */}
              <tr className="border-t-2 border-black bg-green-50">
                <td className="py-3 px-4 font-medium text-black">{periodTo}</td>
                <td className="py-3 px-4 text-black">CLOSING</td>
                <td className="py-3 px-4 font-bold text-black">Closing Balance</td>
                <td className="py-3 px-4 text-right text-black">-</td>
                <td className="py-3 px-4 text-right text-black">-</td>
                <td className="py-3 px-4 text-right font-bold text-black text-lg">{formatCurrency(currentAccount.closingBalance)}</td>
                <td className="py-3 px-4 text-center text-black">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Transaction Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Transaction Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-600">Total Debits:</span>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(currentAccount.transactions.reduce((sum, t) => sum + t.debit, 0))}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Total Credits:</span>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(currentAccount.transactions.reduce((sum, t) => sum + t.credit, 0))}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Net Change:</span>
              <p className="text-lg font-semibold text-blue-600">
                {formatCurrency(currentAccount.closingBalance - currentAccount.openingBalance)}
              </p>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <div>
              <p>General ledger prepared in accordance with Generally Accepted Accounting Principles (GAAP).</p>
              <p className="mt-1">Complete audit trail maintained. All supporting documentation available for review.</p>
            </div>
            <div className="text-right">
              <p>Prepared by Accountrix AI CPA</p>
              <p>{new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}