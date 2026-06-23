'use client';

import React from 'react';
import ProfessionalReportTemplate from './ProfessionalReportTemplate';

interface BalanceSheetProps {
  companyName: string;
  asOfDate: string;
  showComparative?: boolean;
  onDrillDown?: (accountCode: string, accountName: string) => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export default function ProfessionalBalanceSheet({
  companyName,
  asOfDate,
  showComparative = true,
  onDrillDown,
  onExportPDF,
  onExportExcel
}: BalanceSheetProps) {
  // Mock data - ASC 210 Classified Balance Sheet Format
  const currentPeriodData = {
    // Current Assets
    cashEquivalents: 5700000,
    checkingOperations: 3200000,
    savingsReserve: 2500000,
    accountsReceivable: 335000,
    allowanceDoubtful: -45000,
    netAccountsReceivable: 290000,
    prepaidExpenses: 45000,
    totalCurrentAssets: 6035000,

    // Non-Current Assets
    equipment: 125000,
    accumulatedDepreciation: -35000,
    netEquipment: 90000,
    totalNonCurrentAssets: 90000,
    totalAssets: 6125000,

    // Current Liabilities
    accountsPayable: 197000,
    accruedExpenses: 85000,
    payrollLiabilities: 125000,
    deferredRevenue: 450000,
    currentPortionLTD: 50000,
    totalCurrentLiabilities: 907000,

    // Non-Current Liabilities
    longTermDebt: 450000,
    totalNonCurrentLiabilities: 450000,
    totalLiabilities: 1357000,

    // Stockholders' Equity
    commonStock: 500000,
    additionalPaidIn: 2200000,
    retainedEarnings: 2068000,
    totalStockholdersEquity: 4768000,
    totalLiabilitiesEquity: 6125000
  };

  const priorPeriodData = {
    cashEquivalents: 5200000,
    checkingOperations: 2900000,
    savingsReserve: 2300000,
    accountsReceivable: 315000,
    allowanceDoubtful: -40000,
    netAccountsReceivable: 275000,
    prepaidExpenses: 40000,
    totalCurrentAssets: 5515000,
    equipment: 115000,
    accumulatedDepreciation: -28000,
    netEquipment: 87000,
    totalNonCurrentAssets: 87000,
    totalAssets: 5602000,
    accountsPayable: 175000,
    accruedExpenses: 75000,
    payrollLiabilities: 110000,
    deferredRevenue: 400000,
    currentPortionLTD: 45000,
    totalCurrentLiabilities: 805000,
    longTermDebt: 480000,
    totalNonCurrentLiabilities: 480000,
    totalLiabilities: 1285000,
    commonStock: 500000,
    additionalPaidIn: 2200000,
    retainedEarnings: 1617000,
    totalStockholdersEquity: 4317000,
    totalLiabilitiesEquity: 5602000
  };

  const reportHeader = {
    companyName,
    reportTitle: 'Classified Balance Sheet',
    periodEnding: `As of ${asOfDate}`,
    preparationDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    pageNumber: 1,
    totalPages: 1
  };

  const reportSections = [
    {
      sectionName: 'ASSETS',
      accounts: []
    },
    {
      sectionName: 'Current Assets',
      accounts: [
        {
          accountCode: '1000',
          accountName: 'Cash and Cash Equivalents:',
          currentPeriod: 0,
          priorPeriod: 0,
          level: 0
        },
        {
          accountCode: '1010',
          accountName: 'Checking Account - Operations',
          currentPeriod: currentPeriodData.checkingOperations,
          priorPeriod: priorPeriodData.checkingOperations,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '1020',
          accountName: 'Savings Account - Reserve',
          currentPeriod: currentPeriodData.savingsReserve,
          priorPeriod: priorPeriodData.savingsReserve,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '',
          accountName: 'Total Cash and Cash Equivalents',
          currentPeriod: currentPeriodData.cashEquivalents,
          priorPeriod: priorPeriodData.cashEquivalents,
          isSubtotal: true,
          level: 1
        },
        {
          accountCode: '1100',
          accountName: 'Accounts Receivable',
          currentPeriod: currentPeriodData.accountsReceivable,
          priorPeriod: priorPeriodData.accountsReceivable,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '1105',
          accountName: 'Less: Allowance for Doubtful Accounts',
          currentPeriod: currentPeriodData.allowanceDoubtful,
          priorPeriod: priorPeriodData.allowanceDoubtful,
          hasDetail: true,
          level: 1,
          note: 'Note A'
        },
        {
          accountCode: '',
          accountName: 'Net Accounts Receivable',
          currentPeriod: currentPeriodData.netAccountsReceivable,
          priorPeriod: priorPeriodData.netAccountsReceivable,
          isSubtotal: true,
          level: 1
        },
        {
          accountCode: '1300',
          accountName: 'Prepaid Expenses',
          currentPeriod: currentPeriodData.prepaidExpenses,
          priorPeriod: priorPeriodData.prepaidExpenses,
          hasDetail: true,
          level: 0,
          note: 'Note B'
        },
        {
          accountCode: '',
          accountName: 'Total Current Assets',
          currentPeriod: currentPeriodData.totalCurrentAssets,
          priorPeriod: priorPeriodData.totalCurrentAssets,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'Non-Current Assets',
      accounts: [
        {
          accountCode: '1500',
          accountName: 'Equipment',
          currentPeriod: currentPeriodData.equipment,
          priorPeriod: priorPeriodData.equipment,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '1510',
          accountName: 'Less: Accumulated Depreciation',
          currentPeriod: currentPeriodData.accumulatedDepreciation,
          priorPeriod: priorPeriodData.accumulatedDepreciation,
          hasDetail: true,
          level: 1,
          note: 'Note C'
        },
        {
          accountCode: '',
          accountName: 'Net Equipment',
          currentPeriod: currentPeriodData.netEquipment,
          priorPeriod: priorPeriodData.netEquipment,
          isSubtotal: true,
          level: 1
        },
        {
          accountCode: '',
          accountName: 'Total Non-Current Assets',
          currentPeriod: currentPeriodData.totalNonCurrentAssets,
          priorPeriod: priorPeriodData.totalNonCurrentAssets,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'TOTAL ASSETS',
      sectionTotal: currentPeriodData.totalAssets,
      accounts: [
        {
          accountCode: '',
          accountName: 'TOTAL ASSETS',
          currentPeriod: currentPeriodData.totalAssets,
          priorPeriod: priorPeriodData.totalAssets,
          isTotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'LIABILITIES AND STOCKHOLDERS\' EQUITY',
      accounts: []
    },
    {
      sectionName: 'Current Liabilities',
      accounts: [
        {
          accountCode: '2000',
          accountName: 'Accounts Payable',
          currentPeriod: currentPeriodData.accountsPayable,
          priorPeriod: priorPeriodData.accountsPayable,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '2100',
          accountName: 'Accrued Expenses',
          currentPeriod: currentPeriodData.accruedExpenses,
          priorPeriod: priorPeriodData.accruedExpenses,
          hasDetail: true,
          level: 0,
          note: 'Note D'
        },
        {
          accountCode: '2200',
          accountName: 'Payroll Liabilities',
          currentPeriod: currentPeriodData.payrollLiabilities,
          priorPeriod: priorPeriodData.payrollLiabilities,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '2300',
          accountName: 'Deferred Revenue',
          currentPeriod: currentPeriodData.deferredRevenue,
          priorPeriod: priorPeriodData.deferredRevenue,
          hasDetail: true,
          level: 0,
          note: 'Note E'
        },
        {
          accountCode: '2400',
          accountName: 'Current Portion of Long-term Debt',
          currentPeriod: currentPeriodData.currentPortionLTD,
          priorPeriod: priorPeriodData.currentPortionLTD,
          hasDetail: true,
          level: 0,
          note: 'Note F'
        },
        {
          accountCode: '',
          accountName: 'Total Current Liabilities',
          currentPeriod: currentPeriodData.totalCurrentLiabilities,
          priorPeriod: priorPeriodData.totalCurrentLiabilities,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'Non-Current Liabilities',
      accounts: [
        {
          accountCode: '2500',
          accountName: 'Long-term Debt (net of current portion)',
          currentPeriod: currentPeriodData.longTermDebt,
          priorPeriod: priorPeriodData.longTermDebt,
          hasDetail: true,
          level: 0,
          note: 'Note F'
        },
        {
          accountCode: '',
          accountName: 'Total Non-Current Liabilities',
          currentPeriod: currentPeriodData.totalNonCurrentLiabilities,
          priorPeriod: priorPeriodData.totalNonCurrentLiabilities,
          isSubtotal: true,
          level: 0
        },
        {
          accountCode: '',
          accountName: 'Total Liabilities',
          currentPeriod: currentPeriodData.totalLiabilities,
          priorPeriod: priorPeriodData.totalLiabilities,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'Stockholders\' Equity',
      accounts: [
        {
          accountCode: '3000',
          accountName: 'Common Stock ($1 par value, 1,000,000 shares authorized, 500,000 shares issued and outstanding)',
          currentPeriod: currentPeriodData.commonStock,
          priorPeriod: priorPeriodData.commonStock,
          hasDetail: true,
          level: 0,
          note: 'Note G'
        },
        {
          accountCode: '3100',
          accountName: 'Additional Paid-in Capital',
          currentPeriod: currentPeriodData.additionalPaidIn,
          priorPeriod: priorPeriodData.additionalPaidIn,
          hasDetail: true,
          level: 0,
          note: 'Note G'
        },
        {
          accountCode: '3200',
          accountName: 'Retained Earnings',
          currentPeriod: currentPeriodData.retainedEarnings,
          priorPeriod: priorPeriodData.retainedEarnings,
          hasDetail: true,
          level: 0,
          note: 'Note H'
        },
        {
          accountCode: '',
          accountName: 'Total Stockholders\' Equity',
          currentPeriod: currentPeriodData.totalStockholdersEquity,
          priorPeriod: priorPeriodData.totalStockholdersEquity,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'TOTAL LIABILITIES AND STOCKHOLDERS\' EQUITY',
      sectionTotal: currentPeriodData.totalLiabilitiesEquity,
      accounts: [
        {
          accountCode: '',
          accountName: 'TOTAL LIABILITIES AND STOCKHOLDERS\' EQUITY',
          currentPeriod: currentPeriodData.totalLiabilitiesEquity,
          priorPeriod: priorPeriodData.totalLiabilitiesEquity,
          isTotal: true,
          level: 0
        }
      ]
    }
  ];

  // Handle drill-down functionality
  const handleDrillDown = (accountCode: string, accountName: string) => {
    if (onDrillDown) {
      onDrillDown(accountCode, accountName);
    } else {
      // Default behavior - show account details
      alert(`Drilling down into ${accountName} (${accountCode})\n\nThis would show detailed transaction history and supporting schedules for this account.`);
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
      link.setAttribute('download', `balance_sheet_${asOfDate.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generateCSVContent = () => {
    let csv = 'Account Code,Account Name,Current Period,Prior Period\n';

    reportSections.forEach(section => {
      if (section.accounts.length > 0) {
        csv += `\n"${section.sectionName}","","",""\n`;
        section.accounts.forEach(account => {
          const indent = '  '.repeat(account.level);
          csv += `"${account.accountCode}","${indent}${account.accountName}","${account.currentPeriod}","${account.priorPeriod || ''}"\n`;
        });
      }
    });

    return csv;
  };

  return (
    <ProfessionalReportTemplate
      header={reportHeader}
      sections={reportSections}
      showComparative={showComparative}
      reportType="balance-sheet"
      gaapCompliant={true}
      auditTrail={true}
      onDrillDown={handleDrillDown}
      onExportPDF={handleExportPDF}
      onExportExcel={handleExportExcel}
    />
  );
}