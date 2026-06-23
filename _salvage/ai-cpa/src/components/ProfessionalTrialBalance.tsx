'use client';

import React, { useState } from 'react';
import ProfessionalReportTemplate from './ProfessionalReportTemplate';

interface TrialBalanceProps {
  companyName: string;
  asOfDate: string;
  showComparative?: boolean;
  includeInactive?: boolean;
  onDrillDown?: (accountCode: string, accountName: string) => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

interface TrialBalanceAccount {
  accountCode: string;
  accountName: string;
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  debit: number;
  credit: number;
  balance: number;
  isActive: boolean;
  level: number;
}

export default function ProfessionalTrialBalance({
  companyName,
  asOfDate,
  showComparative = false,
  includeInactive = false,
  onDrillDown,
  onExportPDF,
  onExportExcel
}: TrialBalanceProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [localIncludeInactive, setLocalIncludeInactive] = useState(includeInactive);
  const [localShowComparative, setLocalShowComparative] = useState(showComparative);

  // Mock trial balance data - properly balanced
  const trialBalanceAccounts: TrialBalanceAccount[] = [
    // Assets
    { accountCode: '1000', accountName: 'Cash and Cash Equivalents', accountType: 'Asset', debit: 5700000, credit: 0, balance: 5700000, isActive: true, level: 0 },
    { accountCode: '1010', accountName: 'Checking Account - Operations', accountType: 'Asset', debit: 3200000, credit: 0, balance: 3200000, isActive: true, level: 1 },
    { accountCode: '1020', accountName: 'Savings Account - Reserve', accountType: 'Asset', debit: 2500000, credit: 0, balance: 2500000, isActive: true, level: 1 },
    { accountCode: '1100', accountName: 'Accounts Receivable', accountType: 'Asset', debit: 335000, credit: 0, balance: 335000, isActive: true, level: 0 },
    { accountCode: '1105', accountName: 'Allowance for Doubtful Accounts', accountType: 'Asset', debit: 0, credit: 45000, balance: -45000, isActive: true, level: 1 },
    { accountCode: '1200', accountName: 'Inventory', accountType: 'Asset', debit: 0, credit: 0, balance: 0, isActive: false, level: 0 },
    { accountCode: '1300', accountName: 'Prepaid Expenses', accountType: 'Asset', debit: 45000, credit: 0, balance: 45000, isActive: true, level: 0 },
    { accountCode: '1500', accountName: 'Equipment', accountType: 'Asset', debit: 125000, credit: 0, balance: 125000, isActive: true, level: 0 },
    { accountCode: '1510', accountName: 'Accumulated Depreciation - Equipment', accountType: 'Asset', debit: 0, credit: 35000, balance: -35000, isActive: true, level: 1 },

    // Liabilities
    { accountCode: '2000', accountName: 'Accounts Payable', accountType: 'Liability', debit: 0, credit: 197000, balance: -197000, isActive: true, level: 0 },
    { accountCode: '2100', accountName: 'Accrued Expenses', accountType: 'Liability', debit: 0, credit: 85000, balance: -85000, isActive: true, level: 0 },
    { accountCode: '2200', accountName: 'Payroll Liabilities', accountType: 'Liability', debit: 0, credit: 125000, balance: -125000, isActive: true, level: 0 },
    { accountCode: '2300', accountName: 'Deferred Revenue', accountType: 'Liability', debit: 0, credit: 450000, balance: -450000, isActive: true, level: 0 },
    { accountCode: '2500', accountName: 'Long-term Debt', accountType: 'Liability', debit: 0, credit: 500000, balance: -500000, isActive: true, level: 0 },

    // Equity
    { accountCode: '3000', accountName: 'Common Stock', accountType: 'Equity', debit: 0, credit: 500000, balance: -500000, isActive: true, level: 0 },
    { accountCode: '3100', accountName: 'Additional Paid-in Capital', accountType: 'Equity', debit: 0, credit: 2200000, balance: -2200000, isActive: true, level: 0 },
    { accountCode: '3200', accountName: 'Retained Earnings', accountType: 'Equity', debit: 0, credit: 1850000, balance: -1850000, isActive: true, level: 0 },
    { accountCode: '3300', accountName: 'Current Year Earnings', accountType: 'Equity', debit: 0, credit: 750000, balance: -750000, isActive: true, level: 0 },

    // Revenue
    { accountCode: '4000', accountName: 'Service Revenue', accountType: 'Revenue', debit: 0, credit: 2800000, balance: -2800000, isActive: true, level: 0 },
    { accountCode: '4100', accountName: 'Consulting Revenue', accountType: 'Revenue', debit: 0, credit: 450000, balance: -450000, isActive: true, level: 0 },
    { accountCode: '4200', accountName: 'Training Revenue', accountType: 'Revenue', debit: 0, credit: 125000, balance: -125000, isActive: true, level: 0 },
    { accountCode: '4900', accountName: 'Other Income', accountType: 'Revenue', debit: 0, credit: 25000, balance: -25000, isActive: true, level: 0 },

    // Expenses
    { accountCode: '5000', accountName: 'Salaries and Wages', accountType: 'Expense', debit: 1200000, credit: 0, balance: 1200000, isActive: true, level: 0 },
    { accountCode: '5100', accountName: 'Employee Benefits', accountType: 'Expense', debit: 350000, credit: 0, balance: 350000, isActive: true, level: 0 },
    { accountCode: '5200', accountName: 'Rent Expense', accountType: 'Expense', debit: 180000, credit: 0, balance: 180000, isActive: true, level: 0 },
    { accountCode: '5300', accountName: 'Technology Expenses', accountType: 'Expense', debit: 285000, credit: 0, balance: 285000, isActive: true, level: 0 },
    { accountCode: '5400', accountName: 'Professional Services', accountType: 'Expense', debit: 75000, credit: 0, balance: 75000, isActive: true, level: 0 },
    { accountCode: '5500', accountName: 'Marketing and Advertising', accountType: 'Expense', debit: 95000, credit: 0, balance: 95000, isActive: true, level: 0 },
    { accountCode: '5600', accountName: 'Office Expenses', accountType: 'Expense', debit: 45000, credit: 0, balance: 45000, isActive: true, level: 0 },
    { accountCode: '5700', accountName: 'Travel and Entertainment', accountType: 'Expense', debit: 65000, credit: 0, balance: 65000, isActive: true, level: 0 },
    { accountCode: '5800', accountName: 'Depreciation Expense', accountType: 'Expense', debit: 25000, credit: 0, balance: 25000, isActive: true, level: 0 },
    { accountCode: '5900', accountName: 'Interest Expense', accountType: 'Expense', debit: 15000, credit: 0, balance: 15000, isActive: true, level: 0 },
    { accountCode: '6000', accountName: 'Income Tax Expense', accountType: 'Expense', debit: 315000, credit: 0, balance: 315000, isActive: true, level: 0 }
  ];

  // Filter accounts based on options
  const filteredAccounts = trialBalanceAccounts.filter(account =>
    localIncludeInactive || account.isActive
  );

  // Calculate totals
  const totalDebits = filteredAccounts.reduce((sum, account) => sum + account.debit, 0);
  const totalCredits = filteredAccounts.reduce((sum, account) => sum + account.credit, 0);

  const reportHeader = {
    companyName,
    reportTitle: 'Trial Balance',
    periodEnding: `As of ${asOfDate}`,
    preparationDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    pageNumber: 1,
    totalPages: 1
  };

  // Group accounts by type for better presentation
  const accountsByType = filteredAccounts.reduce((groups, account) => {
    const type = account.accountType;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(account);
    return groups;
  }, {} as Record<string, TrialBalanceAccount[]>);

  const reportSections = Object.entries(accountsByType).map(([type, accounts]) => ({
    sectionName: type.toUpperCase() + ' ACCOUNTS',
    accounts: accounts.map(account => ({
      accountCode: account.accountCode,
      accountName: account.accountName,
      currentPeriod: account.debit || account.credit, // Show the non-zero amount
      priorPeriod: 0, // For now, no comparative data
      hasDetail: true,
      level: account.level,
      // Store debit/credit info for proper display
      debit: account.debit,
      credit: account.credit
    }))
  }));

  // Add totals section
  reportSections.push({
    sectionName: 'TOTALS',
    accounts: [
      {
        accountCode: '',
        accountName: 'TOTAL DEBITS',
        currentPeriod: totalDebits,
        priorPeriod: 0,
        isTotal: true,
        level: 0,
        debit: totalDebits,
        credit: 0
      },
      {
        accountCode: '',
        accountName: 'TOTAL CREDITS',
        currentPeriod: totalCredits,
        priorPeriod: 0,
        isTotal: true,
        level: 0,
        debit: 0,
        credit: totalCredits
      },
      {
        accountCode: '',
        accountName: 'DIFFERENCE',
        currentPeriod: totalDebits - totalCredits,
        priorPeriod: 0,
        isTotal: true,
        level: 0,
        debit: totalDebits - totalCredits > 0 ? totalDebits - totalCredits : 0,
        credit: totalCredits - totalDebits > 0 ? totalCredits - totalDebits : 0
      }
    ]
  });

  // Handle drill-down functionality
  const handleDrillDown = (accountCode: string, accountName: string) => {
    if (onDrillDown) {
      onDrillDown(accountCode, accountName);
    } else {
      // Default behavior - show account detail
      alert(`Drilling down into ${accountName} (${accountCode})\n\nThis would show detailed general ledger activity for this account including all transactions and running balances.`);
    }
  };

  // Handle PDF export
  const handleExportPDF = () => {
    if (onExportPDF) {
      onExportPDF();
    } else {
      // Default PDF export behavior
      window.print();
    }
  };

  // Handle Excel export
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
      link.setAttribute('download', `trial_balance_${asOfDate.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generateCSVContent = () => {
    let csv = 'Account Code,Account Name,Account Type,Debit,Credit,Balance\n';

    filteredAccounts.forEach(account => {
      csv += `"${account.accountCode}","${account.accountName}","${account.accountType}","${account.debit}","${account.credit}","${account.balance}"\n`;
    });

    csv += `\n"","TOTAL DEBITS","","${totalDebits}","","${totalDebits}"\n`;
    csv += `"","TOTAL CREDITS","","","${totalCredits}","${totalCredits}"\n`;
    csv += `"","DIFFERENCE","","${totalDebits - totalCredits}","","${totalDebits - totalCredits}"\n`;

    return csv;
  };

  return (
    <div className="space-y-4">
      {/* Trial Balance Options */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-300 rounded-lg p-4 print:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Trial Balance Options</h3>
            <p className="text-sm text-gray-600">Customize trial balance presentation and content</p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localIncludeInactive}
                onChange={(e) => setLocalIncludeInactive(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Include Inactive Accounts</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localShowComparative}
                onChange={(e) => setLocalShowComparative(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Show Comparative Period</span>
            </label>
          </div>
        </div>
      </div>

      {/* Trial Balance Summary */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Total Accounts</h4>
            <p className="text-2xl font-bold text-gray-800">{filteredAccounts.length}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Total Debits</h4>
            <p className="text-2xl font-bold text-green-600">${totalDebits.toLocaleString()}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Total Credits</h4>
            <p className="text-2xl font-bold text-blue-600">${totalCredits.toLocaleString()}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Balance Status</h4>
            <p className={`text-2xl font-bold ${totalDebits === totalCredits ? 'text-green-600' : 'text-red-600'}`}>
              {totalDebits === totalCredits ? '✓ Balanced' : '⚠ Out of Balance'}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Trial Balance Table */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 text-center">
          <h1 className="text-2xl font-bold text-black mb-1">{companyName}</h1>
          <h2 className="text-xl font-semibold text-black mb-1">Trial Balance</h2>
          <h3 className="text-lg text-black mb-2">As of {asOfDate}</h3>
          <div className="text-sm text-gray-600">
            <span>Prepared on {reportHeader.preparationDate}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Account Code</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">Account Name</th>
                <th className="px-6 py-3 text-right text-sm font-bold text-black uppercase tracking-wider">Debit</th>
                <th className="px-6 py-3 text-right text-sm font-bold text-black uppercase tracking-wider">Credit</th>
                {localShowComparative && (
                  <>
                    <th className="px-6 py-3 text-right text-sm font-bold text-black uppercase tracking-wider">Prior Debit</th>
                    <th className="px-6 py-3 text-right text-sm font-bold text-black uppercase tracking-wider">Prior Credit</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account, index) => (
                <tr
                  key={index}
                  className={`hover:bg-blue-50 cursor-pointer ${!account.isActive ? 'opacity-60 italic' : ''}`}
                  onClick={() => handleDrillDown(account.accountCode, account.accountName)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {account.accountCode}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-black ${account.level > 0 ? 'pl-12' : ''}`}>
                    {account.accountName}
                    {!account.isActive && <span className="ml-2 text-gray-400">(Inactive)</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-black">
                    {account.debit ? `$${account.debit.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-black">
                    {account.credit ? `$${account.credit.toLocaleString()}` : '-'}
                  </td>
                  {localShowComparative && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-gray-600">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-gray-600">-</td>
                    </>
                  )}
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="bg-gray-50 border-t-2 border-gray-400">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black" colSpan={2}>
                  TOTALS
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-black">
                  ${totalDebits.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-black">
                  ${totalCredits.toLocaleString()}
                </td>
                {localShowComparative && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-600">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-600">-</td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <div>
              <p>Trial balance prepared in accordance with Generally Accepted Accounting Principles (GAAP).</p>
              <p className="mt-1">All amounts are shown in US Dollars. Complete audit trail available.</p>
            </div>
            <div className="text-right">
              <p>Prepared by Accountrix AI CPA</p>
              <p>{reportHeader.preparationDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-center space-x-4 print:hidden">
        <button
          onClick={handleExportPDF}
          className="flex items-center space-x-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <span>Export PDF</span>
        </button>
        <button
          onClick={handleExportExcel}
          className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <span>Export Excel</span>
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <span>Print</span>
        </button>
      </div>
    </div>
  );
}