'use client';

import React, { useState } from 'react';
import ProfessionalReportTemplate from './ProfessionalReportTemplate';

interface IncomeStatementProps {
  companyName: string;
  periodEnding: string;
  showComparative?: boolean;
  onDrillDown?: (accountCode: string, accountName: string) => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export default function ProfessionalIncomeStatement({
  companyName,
  periodEnding,
  showComparative = true,
  onDrillDown,
  onExportPDF,
  onExportExcel
}: IncomeStatementProps) {
  // Mock data - In production, this would come from your accounting system
  const currentPeriodData = {
    // Operating Revenues
    serviceRevenue: 2800000,
    consultingRevenue: 450000,
    trainingRevenue: 125000,
    totalOperatingRevenue: 3375000,

    // Other Revenues
    interestIncome: 15000,
    otherIncome: 10000,
    totalOtherRevenue: 25000,
    totalRevenue: 3400000,

    // Cost of Revenues (for service company)
    costOfServices: 0, // Service company - no direct costs
    grossProfit: 3400000,

    // Operating Expenses
    salariesWages: 1200000,
    employeeBenefits: 350000,
    totalPersonnelExpenses: 1550000,

    rent: 180000,
    technology: 285000,
    professionalServices: 75000,
    marketing: 95000,
    officeExpenses: 45000,
    travelEntertainment: 65000,
    depreciation: 25000,
    totalOperatingExpenses: 770000,

    totalExpenses: 2320000,

    // Operating Income
    operatingIncome: 1080000,

    // Non-Operating Items
    interestExpense: 15000,
    totalNonOperatingExpenses: 15000,

    // Income Before Taxes
    incomeBeforeTaxes: 1065000,

    // Income Tax Expense
    incomeTaxExpense: 315000,

    // Net Income
    netIncome: 750000
  };

  const priorPeriodData = {
    serviceRevenue: 2580000,
    consultingRevenue: 400000,
    trainingRevenue: 100000,
    totalOperatingRevenue: 3080000,
    interestIncome: 12000,
    otherIncome: 8000,
    totalOtherRevenue: 20000,
    totalRevenue: 3100000,
    costOfServices: 0,
    grossProfit: 3100000,
    salariesWages: 1100000,
    employeeBenefits: 320000,
    totalPersonnelExpenses: 1420000,
    rent: 180000,
    technology: 265000,
    professionalServices: 70000,
    marketing: 85000,
    officeExpenses: 40000,
    travelEntertainment: 55000,
    depreciation: 22000,
    totalOperatingExpenses: 717000,
    totalExpenses: 2137000,
    operatingIncome: 963000,
    interestExpense: 18000,
    totalNonOperatingExpenses: 18000,
    incomeBeforeTaxes: 945000,
    incomeTaxExpense: 260000,
    netIncome: 685000
  };

  const reportHeader = {
    companyName,
    reportTitle: 'Consolidated Statement of Operations (Income Statement)',
    periodEnding: `For the Year Ended ${periodEnding}`,
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
      sectionName: 'OPERATING REVENUES',
      accounts: [
        {
          accountCode: '4000',
          accountName: 'Service Revenue',
          currentPeriod: currentPeriodData.serviceRevenue,
          priorPeriod: priorPeriodData.serviceRevenue,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '4100',
          accountName: 'Consulting Revenue',
          currentPeriod: currentPeriodData.consultingRevenue,
          priorPeriod: priorPeriodData.consultingRevenue,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '4200',
          accountName: 'Training Revenue',
          currentPeriod: currentPeriodData.trainingRevenue,
          priorPeriod: priorPeriodData.trainingRevenue,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '',
          accountName: 'Total Operating Revenue',
          currentPeriod: currentPeriodData.totalOperatingRevenue,
          priorPeriod: priorPeriodData.totalOperatingRevenue,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'OTHER REVENUES',
      accounts: [
        {
          accountCode: '4900',
          accountName: 'Interest Income',
          currentPeriod: currentPeriodData.interestIncome,
          priorPeriod: priorPeriodData.interestIncome,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '4950',
          accountName: 'Other Income',
          currentPeriod: currentPeriodData.otherIncome,
          priorPeriod: priorPeriodData.otherIncome,
          hasDetail: true,
          level: 0
        },
        {
          accountCode: '',
          accountName: 'Total Other Revenue',
          currentPeriod: currentPeriodData.totalOtherRevenue,
          priorPeriod: priorPeriodData.totalOtherRevenue,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'TOTAL REVENUE',
      sectionTotal: currentPeriodData.totalRevenue,
      accounts: [
        {
          accountCode: '',
          accountName: 'Total Revenue',
          currentPeriod: currentPeriodData.totalRevenue,
          priorPeriod: priorPeriodData.totalRevenue,
          isTotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'OPERATING EXPENSES',
      accounts: [
        {
          accountCode: '',
          accountName: 'Personnel Expenses:',
          currentPeriod: 0,
          priorPeriod: 0,
          level: 0
        },
        {
          accountCode: '5000',
          accountName: 'Salaries and Wages',
          currentPeriod: currentPeriodData.salariesWages,
          priorPeriod: priorPeriodData.salariesWages,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '5100',
          accountName: 'Employee Benefits',
          currentPeriod: currentPeriodData.employeeBenefits,
          priorPeriod: priorPeriodData.employeeBenefits,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '',
          accountName: 'Total Personnel Expenses',
          currentPeriod: currentPeriodData.totalPersonnelExpenses,
          priorPeriod: priorPeriodData.totalPersonnelExpenses,
          isSubtotal: true,
          level: 1
        },
        {
          accountCode: '',
          accountName: 'Other Operating Expenses:',
          currentPeriod: 0,
          priorPeriod: 0,
          level: 0
        },
        {
          accountCode: '5200',
          accountName: 'Rent Expense',
          currentPeriod: currentPeriodData.rent,
          priorPeriod: priorPeriodData.rent,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '5300',
          accountName: 'Technology Expenses',
          currentPeriod: currentPeriodData.technology,
          priorPeriod: priorPeriodData.technology,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '5400',
          accountName: 'Professional Services',
          currentPeriod: currentPeriodData.professionalServices,
          priorPeriod: priorPeriodData.professionalServices,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '5500',
          accountName: 'Marketing and Advertising',
          currentPeriod: currentPeriodData.marketing,
          priorPeriod: priorPeriodData.marketing,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '5600',
          accountName: 'Office Expenses',
          currentPeriod: currentPeriodData.officeExpenses,
          priorPeriod: priorPeriodData.officeExpenses,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '5700',
          accountName: 'Travel and Entertainment',
          currentPeriod: currentPeriodData.travelEntertainment,
          priorPeriod: priorPeriodData.travelEntertainment,
          hasDetail: true,
          level: 1
        },
        {
          accountCode: '5800',
          accountName: 'Depreciation Expense',
          currentPeriod: currentPeriodData.depreciation,
          priorPeriod: priorPeriodData.depreciation,
          hasDetail: true,
          level: 1,
          note: 'Note A'
        },
        {
          accountCode: '',
          accountName: 'Total Other Operating Expenses',
          currentPeriod: currentPeriodData.totalOperatingExpenses,
          priorPeriod: priorPeriodData.totalOperatingExpenses,
          isSubtotal: true,
          level: 1
        },
        {
          accountCode: '',
          accountName: 'Total Operating Expenses',
          currentPeriod: currentPeriodData.totalExpenses,
          priorPeriod: priorPeriodData.totalExpenses,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'OPERATING INCOME',
      sectionTotal: currentPeriodData.operatingIncome,
      accounts: [
        {
          accountCode: '',
          accountName: 'Operating Income',
          currentPeriod: currentPeriodData.operatingIncome,
          priorPeriod: priorPeriodData.operatingIncome,
          isTotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'NON-OPERATING EXPENSES',
      accounts: [
        {
          accountCode: '5900',
          accountName: 'Interest Expense',
          currentPeriod: currentPeriodData.interestExpense,
          priorPeriod: priorPeriodData.interestExpense,
          hasDetail: true,
          level: 0,
          note: 'Note B'
        },
        {
          accountCode: '',
          accountName: 'Total Non-Operating Expenses',
          currentPeriod: currentPeriodData.totalNonOperatingExpenses,
          priorPeriod: priorPeriodData.totalNonOperatingExpenses,
          isSubtotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'INCOME BEFORE INCOME TAXES',
      sectionTotal: currentPeriodData.incomeBeforeTaxes,
      accounts: [
        {
          accountCode: '',
          accountName: 'Income Before Income Taxes',
          currentPeriod: currentPeriodData.incomeBeforeTaxes,
          priorPeriod: priorPeriodData.incomeBeforeTaxes,
          isTotal: true,
          level: 0
        }
      ]
    },
    {
      sectionName: 'INCOME TAX EXPENSE',
      accounts: [
        {
          accountCode: '6000',
          accountName: 'Income Tax Expense',
          currentPeriod: currentPeriodData.incomeTaxExpense,
          priorPeriod: priorPeriodData.incomeTaxExpense,
          hasDetail: true,
          level: 0,
          note: 'Note C'
        }
      ]
    },
    {
      sectionName: 'NET INCOME',
      sectionTotal: currentPeriodData.netIncome,
      accounts: [
        {
          accountCode: '',
          accountName: 'Net Income',
          currentPeriod: currentPeriodData.netIncome,
          priorPeriod: priorPeriodData.netIncome,
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
      // Default behavior - show transaction details
      alert(`Drilling down into ${accountName} (${accountCode})\n\nThis would show detailed transaction history for this account.`);
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
      link.setAttribute('download', `income_statement_${periodEnding.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generateCSVContent = () => {
    let csv = 'Account Code,Account Name,Current Period,Prior Period\n';

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
    <ProfessionalReportTemplate
      header={reportHeader}
      sections={reportSections}
      showComparative={showComparative}
      reportType="income-statement"
      gaapCompliant={true}
      auditTrail={true}
      onDrillDown={handleDrillDown}
      onExportPDF={handleExportPDF}
      onExportExcel={handleExportExcel}
    />
  );
}