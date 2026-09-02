'use client';

import React, { useState } from 'react';
import ProfessionalReportTemplate from './ProfessionalReportTemplate';

interface CashFlowStatementProps {
  companyName: string;
  periodEnding: string;
  method?: 'indirect' | 'direct';
  showComparative?: boolean;
  onDrillDown?: (accountCode: string, accountName: string) => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export default function ProfessionalCashFlowStatement({
  companyName,
  periodEnding,
  method = 'indirect',
  showComparative = true,
  onDrillDown,
  onExportPDF,
  onExportExcel
}: CashFlowStatementProps) {
  const [selectedMethod, setSelectedMethod] = useState<'indirect' | 'direct'>(method);

  // Mock data - ASC 230 Cash Flow Statement Format
  const currentPeriodData = {
    // Operating Activities (Indirect Method)
    netIncome: 750000,
    adjustments: {
      depreciation: 25000,
      badDebtExpense: 5000,
      deferredTaxes: 15000,
      totalNonCashAdjustments: 45000
    },
    workingCapitalChanges: {
      accountsReceivable: -20000, // Increase in AR
      prepaidExpenses: -5000,    // Increase in prepaid
      accountsPayable: 22000,    // Increase in AP
      accruedExpenses: 10000,    // Increase in accrued
      deferredRevenue: 50000,    // Increase in deferred revenue
      totalWorkingCapitalChanges: 57000
    },
    netCashFromOperating: 852000,

    // Operating Activities (Direct Method)
    directOperating: {
      cashFromCustomers: 3380000,
      cashToSuppliers: -1850000,
      cashToEmployees: -550000,
      cashForOperatingExpenses: -128000,
      netCashFromOperating: 852000
    },

    // Investing Activities
    investing: {
      equipmentPurchases: -35000,
      equipmentSales: 5000,
      investments: 0,
      netCashFromInvesting: -30000
    },

    // Financing Activities
    financing: {
      debtProceeds: 0,
      debtRepayments: -80000,
      dividendsPaid: -242000,
      stockIssuance: 0,
      netCashFromFinancing: -322000
    },

    // Net Change and Cash Position
    netChangeInCash: 500000,
    cashBeginning: 5200000,
    cashEnding: 5700000
  };

  const priorPeriodData = {
    netIncome: 685000,
    adjustments: {
      depreciation: 22000,
      badDebtExpense: 8000,
      deferredTaxes: 12000,
      totalNonCashAdjustments: 42000
    },
    workingCapitalChanges: {
      accountsReceivable: -15000,
      prepaidExpenses: -3000,
      accountsPayable: 18000,
      accruedExpenses: 8000,
      deferredRevenue: 35000,
      totalWorkingCapitalChanges: 43000
    },
    netCashFromOperating: 770000,
    directOperating: {
      cashFromCustomers: 3085000,
      cashToSuppliers: -1680000,
      cashToEmployees: -485000,
      cashForOperatingExpenses: -150000,
      netCashFromOperating: 770000
    },
    investing: {
      equipmentPurchases: -28000,
      equipmentSales: 0,
      investments: 0,
      netCashFromInvesting: -28000
    },
    financing: {
      debtProceeds: 0,
      debtRepayments: -75000,
      dividendsPaid: -200000,
      stockIssuance: 0,
      netCashFromFinancing: -275000
    },
    netChangeInCash: 467000,
    cashBeginning: 4733000,
    cashEnding: 5200000
  };

  const reportHeader = {
    companyName,
    reportTitle: `Statement of Cash Flows (${selectedMethod === 'indirect' ? 'Indirect' : 'Direct'} Method)`,
    periodEnding: `For the Year Ended ${periodEnding}`,
    preparationDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    pageNumber: 1,
    totalPages: 1
  };

  const getIndirectMethodSections = () => [
    {
      sectionName: 'CASH FLOWS FROM OPERATING ACTIVITIES',
      accounts: [
        {
          accountCode: '',
          accountName: 'Net Income',
          currentPeriod: currentPeriodData.netIncome,
          priorPeriod: priorPeriodData.netIncome,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '',
          accountName: 'Adjustments to reconcile net income to net cash provided by operating activities:',
          currentPeriod: 0,
          priorPeriod: 0,
          level: 0
        },
        {
          accountCode: '5800',
          accountName: 'Depreciation expense',
          currentPeriod: currentPeriodData.adjustments.depreciation,
          priorPeriod: priorPeriodData.adjustments.depreciation,
          hasDetail: true,
          level: 1,
          note: 'Note A'
        },
        {
          accountCode: '1105',
          accountName: 'Bad debt expense',
          currentPeriod: currentPeriodData.adjustments.badDebtExpense,
          priorPeriod: priorPeriodData.adjustments.badDebtExpense,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '6100',
          accountName: 'Deferred tax expense',
          currentPeriod: currentPeriodData.adjustments.deferredTaxes,
          priorPeriod: priorPeriodData.adjustments.deferredTaxes,
          hasDetail: true,
          level: 1,
          note: 'Note B'
        },
        {
          accountCode: '',
          accountName: 'Changes in operating assets and liabilities:',
          currentPeriod: 0,
          priorPeriod: 0,
          level: 0
        },
        {
          accountCode: '1100',
          accountName: 'Accounts receivable',
          currentPeriod: currentPeriodData.workingCapitalChanges.accountsReceivable,
          priorPeriod: priorPeriodData.workingCapitalChanges.accountsReceivable,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '1300',
          accountName: 'Prepaid expenses',
          currentPeriod: currentPeriodData.workingCapitalChanges.prepaidExpenses,
          priorPeriod: priorPeriodData.workingCapitalChanges.prepaidExpenses,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '2000',
          accountName: 'Accounts payable',
          currentPeriod: currentPeriodData.workingCapitalChanges.accountsPayable,
          priorPeriod: priorPeriodData.workingCapitalChanges.accountsPayable,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '2100',
          accountName: 'Accrued expenses',
          currentPeriod: currentPeriodData.workingCapitalChanges.accruedExpenses,
          priorPeriod: priorPeriodData.workingCapitalChanges.accruedExpenses,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '2300',
          accountName: 'Deferred revenue',
          currentPeriod: currentPeriodData.workingCapitalChanges.deferredRevenue,
          priorPeriod: priorPeriodData.workingCapitalChanges.deferredRevenue,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '',
          accountName: 'Net cash provided by operating activities',
          currentPeriod: currentPeriodData.netCashFromOperating,
          priorPeriod: priorPeriodData.netCashFromOperating,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'CASH FLOWS FROM INVESTING ACTIVITIES',
      accounts: [
        {
          accountCode: '1500',
          accountName: 'Purchases of equipment',
          currentPeriod: currentPeriodData.investing.equipmentPurchases,
          priorPeriod: priorPeriodData.investing.equipmentPurchases,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '1500',
          accountName: 'Proceeds from sale of equipment',
          currentPeriod: currentPeriodData.investing.equipmentSales,
          priorPeriod: priorPeriodData.investing.equipmentSales,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '',
          accountName: 'Net cash used in investing activities',
          currentPeriod: currentPeriodData.investing.netCashFromInvesting,
          priorPeriod: priorPeriodData.investing.netCashFromInvesting,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'CASH FLOWS FROM FINANCING ACTIVITIES',
      accounts: [
        {
          accountCode: '2500',
          accountName: 'Repayments of long-term debt',
          currentPeriod: currentPeriodData.financing.debtRepayments,
          priorPeriod: priorPeriodData.financing.debtRepayments,
          hasDetail: true,
          level: 0,
          note: 'Note C'
        },
        {
          accountCode: '3200',
          accountName: 'Dividends paid',
          currentPeriod: currentPeriodData.financing.dividendsPaid,
          priorPeriod: priorPeriodData.financing.dividendsPaid,
          hasDetail: true,
          level: 0,
          note: 'Note D'
        },
        {
          accountCode: '',
          accountName: 'Net cash used in financing activities',
          currentPeriod: currentPeriodData.financing.netCashFromFinancing,
          priorPeriod: priorPeriodData.financing.netCashFromFinancing,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'NET INCREASE IN CASH AND CASH EQUIVALENTS',
      sectionTotal: currentPeriodData.netChangeInCash,
      accounts: [
        {
          accountCode: '',
          accountName: 'Net increase in cash and cash equivalents',
          currentPeriod: currentPeriodData.netChangeInCash,
          priorPeriod: priorPeriodData.netChangeInCash,
          isTotal: true,
          level: 0
        },
        {
          accountCode: '1000',
          accountName: 'Cash and cash equivalents, beginning of year',
          currentPeriod: currentPeriodData.cashBeginning,
          priorPeriod: priorPeriodData.cashBeginning,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '1000',
          accountName: 'Cash and cash equivalents, end of year',
          currentPeriod: currentPeriodData.cashEnding,
          priorPeriod: priorPeriodData.cashEnding,
          isTotal: true,
          level: 0,
          note: 'Note E'
        }
      ]
    }
  ];

  const getDirectMethodSections = () => [
    {
      sectionName: 'CASH FLOWS FROM OPERATING ACTIVITIES',
      accounts: [
        {
          accountCode: '4000',
          accountName: 'Cash received from customers',
          currentPeriod: currentPeriodData.directOperating.cashFromCustomers,
          priorPeriod: priorPeriodData.directOperating.cashFromCustomers,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '2000',
          accountName: 'Cash paid to suppliers',
          currentPeriod: currentPeriodData.directOperating.cashToSuppliers,
          priorPeriod: priorPeriodData.directOperating.cashToSuppliers,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '5000',
          accountName: 'Cash paid to employees',
          currentPeriod: currentPeriodData.directOperating.cashToEmployees,
          priorPeriod: priorPeriodData.directOperating.cashToEmployees,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '5200',
          accountName: 'Cash paid for operating expenses',
          currentPeriod: currentPeriodData.directOperating.cashForOperatingExpenses,
          priorPeriod: priorPeriodData.directOperating.cashForOperatingExpenses,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '',
          accountName: 'Net cash provided by operating activities',
          currentPeriod: currentPeriodData.directOperating.netCashFromOperating,
          priorPeriod: priorPeriodData.directOperating.netCashFromOperating,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    // Investing and Financing sections are the same for both methods
    ...getIndirectMethodSections().slice(1)
  ];

  const reportSections = selectedMethod === 'indirect' ? getIndirectMethodSections() : getDirectMethodSections();

  // Handle drill-down functionality
  const handleDrillDown = (accountCode: string, accountName: string) => {
    if (onDrillDown) {
      onDrillDown(accountCode, accountName);
    } else {
      // Default behavior - show cash flow details
      alert(`Drilling down into ${accountName} (${accountCode})\n\nThis would show detailed cash flow transactions and supporting schedules for this line item.`);
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
      link.setAttribute('download', `cash_flow_statement_${selectedMethod}_${periodEnding.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generateCSVContent = () => {
    let csv = `Cash Flow Statement (${selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} Method)\n`;
    csv += 'Account Code,Account Name,Current Period,Prior Period\n';

    reportSections.forEach(section => {
      csv += `\n"${section.sectionName}","","",""\n`;
      section.accounts.forEach(account => {
        const indent = '  '.repeat(account.level);
        csv += `"${account.accountCode}","${indent}${account.accountName}","${account.currentPeriod}","${account.priorPeriod || ''}"\n`;
      });
    });

    return csv;
  };

  return (
    <div className="space-y-4">
      {/* Method Selector */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-300 rounded-lg p-4 print:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">ASC 230 Method Selection</h3>
            <p className="text-sm text-gray-600">Choose reporting method for cash flows from operating activities</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedMethod('indirect')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMethod === 'indirect'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Indirect Method
            </button>
            <button
              onClick={() => setSelectedMethod('direct')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMethod === 'direct'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Direct Method
            </button>
          </div>
        </div>
      </div>

      {/* Professional Cash Flow Statement */}
      <ProfessionalReportTemplate
        header={reportHeader}
        sections={reportSections}
        showComparative={showComparative}
        reportType="cash-flow"
        gaapCompliant={true}
        auditTrail={true}
        onDrillDown={handleDrillDown}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />

      {/* Supplemental Cash Flow Information */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Supplemental Cash Flow Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Cash paid during the year for:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Interest</span>
                <span className="font-mono">$15,000</span>
              </div>
              <div className="flex justify-between">
                <span>Income taxes</span>
                <span className="font-mono">$300,000</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Non-cash investing and financing activities:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Equipment acquired through capital lease</span>
                <span className="font-mono">$-</span>
              </div>
              <div className="flex justify-between">
                <span>Stock issued for debt conversion</span>
                <span className="font-mono">$-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}