'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import ProfessionalBalanceSheet from '@/components/ProfessionalBalanceSheet';
import ProfessionalIncomeStatement from '@/components/ProfessionalIncomeStatement';
import ProfessionalCashFlowStatement from '@/components/ProfessionalCashFlowStatement';
import ProfessionalTrialBalance from '@/components/ProfessionalTrialBalance';
import ProfessionalGeneralLedgerDetail from '@/components/ProfessionalGeneralLedgerDetail';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  Share,
  Calendar,
  Filter,
  ArrowLeft,
  Brain,
  FileText,
  DollarSign,
  Target,
  Zap,
  Eye,
  RefreshCw,
  Mail,
  Settings,
  Users,
  Building,
  CreditCard,
  Receipt,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  category: string;
  description: string;
  lastGenerated: string;
  schedule: string;
  recipients: string[];
  status: 'current' | 'generating' | 'scheduled';
  icon: any;
}

interface ReportData {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface FinancialStatement {
  id: string;
  name: string;
  category: 'balance-sheet' | 'income-statement' | 'cash-flow' | 'equity' | 'notes';
  gaapCompliant: boolean;
  auditTrail: boolean;
  lastReviewed: string;
  approvedBy: string;
  certification: 'draft' | 'reviewed' | 'approved' | 'filed';
  data: any[];
}

interface ComplianceMetric {
  standard: string;
  requirement: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  lastCheck: string;
  notes?: string;
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedReport, setSelectedReport] = useState('financial-summary');

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleExportReports = () => {
    const date = new Date().toISOString().split('T')[0];
    let csvContent = '';
    let fileName = '';

    if (activeTab === 'financial-statements' && financialStatements.length > 0) {
      // Export financial statements
      const selectedStatement = financialStatements.find(fs => fs.id === selectedReport);
      if (selectedStatement) {
        const csvHeaders = 'Section,Subsection,Account,Amount,Note\n';
        const csvData = selectedStatement.data.map(item =>
          `"${item.section}","${item.subsection}","${item.account}","${item.amount}","${item.note}"`
        ).join('\n');
        csvContent = csvHeaders + csvData;
        fileName = `${selectedStatement.name.replace(/[^a-zA-Z0-9]/g, '_')}_${date}.csv`;
      }
    } else if (activeTab === 'compliance') {
      // Export compliance data
      const csvHeaders = 'Standard,Requirement,Status,Last Check,Notes\n';
      const csvData = complianceMetrics.map(metric =>
        `"${metric.standard}","${metric.requirement}","${metric.status}","${metric.lastCheck}","${metric.notes || ''}"`
      ).join('\n');
      csvContent = csvHeaders + csvData;
      fileName = `compliance_report_${date}.csv`;
    } else {
      // Export general report data
      const csvHeaders = 'Report Name,Category,Description,Last Generated,Schedule,Status\n';
      const csvData = reports.map(report =>
        `"${report.name}","${report.category}","${report.description}","${report.lastGenerated}","${report.schedule}","${report.status}"`
      ).join('\n');
      csvContent = csvHeaders + csvData;
      fileName = `reports_overview_${date}.csv`;
    }

    if (csvContent) {
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

      alert(`✅ Report Export Complete!\n\nExported ${activeTab.replace('-', ' ')} data to CSV file.\nFile downloaded: ${fileName}`);
    } else {
      alert('No data available for export.');
    }
  };

  const [financialStatements] = useState<FinancialStatement[]>([
    {
      id: 'balance-sheet-classified',
      name: 'Classified Balance Sheet (ASC 210)',
      category: 'balance-sheet',
      gaapCompliant: true,
      auditTrail: true,
      lastReviewed: '2024-01-18 11:30 AM',
      approvedBy: 'Chief Financial Officer',
      certification: 'approved',
      data: [
        { section: 'ASSETS', subsection: 'Current Assets', account: 'Cash and Cash Equivalents', amount: 2450000, note: 'Note A' },
        { section: 'ASSETS', subsection: 'Current Assets', account: 'Accounts Receivable (net of allowance $45,000)', amount: 890000, note: 'Note B' },
        { section: 'ASSETS', subsection: 'Current Assets', account: 'Inventory (FIFO method)', amount: 650000, note: 'Note C' },
        { section: 'ASSETS', subsection: 'Current Assets', account: 'Prepaid Expenses', amount: 120000, note: '' },
        { section: 'ASSETS', subsection: 'Non-Current Assets', account: 'Property, Plant & Equipment (net)', amount: 3200000, note: 'Note D' },
        { section: 'ASSETS', subsection: 'Non-Current Assets', account: 'Intangible Assets (net)', amount: 450000, note: 'Note E' },
        { section: 'LIABILITIES', subsection: 'Current Liabilities', account: 'Accounts Payable', amount: 420000, note: '' },
        { section: 'LIABILITIES', subsection: 'Current Liabilities', account: 'Accrued Liabilities', amount: 180000, note: 'Note F' },
        { section: 'LIABILITIES', subsection: 'Current Liabilities', account: 'Current Portion of Long-term Debt', amount: 150000, note: 'Note G' },
        { section: 'LIABILITIES', subsection: 'Non-Current Liabilities', account: 'Long-term Debt (net of current portion)', amount: 1800000, note: 'Note G' },
        { section: 'EQUITY', subsection: 'Stockholders Equity', account: 'Common Stock ($1 par, 1,000,000 authorized, 500,000 issued)', amount: 500000, note: 'Note H' },
        { section: 'EQUITY', subsection: 'Stockholders Equity', account: 'Additional Paid-in Capital', amount: 2200000, note: 'Note H' },
        { section: 'EQUITY', subsection: 'Stockholders Equity', account: 'Retained Earnings', amount: 1510000, note: '' }
      ]
    }
  ]);

  const [complianceMetrics] = useState<ComplianceMetric[]>([
    { standard: 'ASC 210', requirement: 'Balance Sheet Classification', status: 'compliant', lastCheck: '2024-01-18' },
    { standard: 'ASC 220', requirement: 'Income Statement Presentation', status: 'compliant', lastCheck: '2024-01-18' },
    { standard: 'ASC 230', requirement: 'Cash Flow Statement Method', status: 'compliant', lastCheck: '2024-01-18' },
    { standard: 'ASC 235', requirement: 'Notes to Financial Statements', status: 'compliant', lastCheck: '2024-01-17' },
    { standard: 'ASC 820', requirement: 'Fair Value Measurements', status: 'compliant', lastCheck: '2024-01-16' },
    { standard: 'ASC 842', requirement: 'Lease Accounting', status: 'warning', lastCheck: '2024-01-15', notes: 'Review operating lease disclosures' },
    { standard: 'SOX 404', requirement: 'Internal Controls Assessment', status: 'compliant', lastCheck: '2024-01-10' },
    { standard: 'SEC Rule 13a-15', requirement: 'Disclosure Controls', status: 'compliant', lastCheck: '2024-01-12' }
  ]);

  const [reports] = useState<Report[]>([
    {
      id: 'financial-summary',
      name: 'Audited Financial Statements Package (US GAAP)',
      category: 'Financial',
      description: 'Complete audited financial statements with independent auditor report, management letter, and supplementary schedules',
      lastGenerated: '2024-01-18 09:00 AM',
      schedule: 'Annual',
      recipients: ['cfo@company.com', 'accounting@company.com', 'board@company.com', 'external-auditors@cpa-firm.com'],
      status: 'current',
      icon: DollarSign
    },
    {
      id: 'profit-loss',
      name: 'Consolidated Income Statement (ASC 220 Compliant)',
      category: 'Financial',
      description: 'Multi-period comparative income statement with earnings per share, comprehensive income, and variance analysis per US GAAP',
      lastGenerated: '2024-01-18 08:30 AM',
      schedule: 'Monthly',
      recipients: ['executives@company.com', 'cfo@company.com', 'sec-reporting@company.com'],
      status: 'current',
      icon: TrendingUp
    },
    {
      id: 'balance-sheet',
      name: 'Classified Balance Sheet (ASC 210 Presentation)',
      category: 'Financial',
      description: 'SEC-compliant classified balance sheet with liquidity analysis, debt covenant calculations, and footnote cross-references',
      lastGenerated: '2024-01-17 11:45 PM',
      schedule: 'Monthly',
      recipients: ['board@company.com', 'audit-committee@company.com', 'lenders@bank.com'],
      status: 'current',
      icon: BarChart3
    },
    {
      id: 'cash-flow',
      name: 'Statement of Cash Flows (ASC 230 - Indirect Method)',
      category: 'Financial',
      description: 'Comprehensive cash flow statement with supplemental cash flow information, non-cash investing/financing activities, and cash flow analysis',
      lastGenerated: '2024-01-18 09:15 AM',
      schedule: 'Monthly',
      recipients: ['treasury@company.com', 'cfo@company.com', 'credit-analysts@bank.com'],
      status: 'current',
      icon: RefreshCw
    },
    {
      id: 'notes-to-financials',
      name: 'Notes to Consolidated Financial Statements (ASC 235)',
      category: 'Financial',
      description: 'Complete footnote disclosures including accounting policies, significant estimates, commitments, contingencies, and subsequent events per SEC requirements',
      lastGenerated: '2024-01-17 06:00 PM',
      schedule: 'Quarterly',
      recipients: ['audit-committee@company.com', 'external-auditors@cpa-firm.com', 'sec-counsel@law-firm.com'],
      status: 'current',
      icon: FileText
    },
    {
      id: 'equity-statement',
      name: 'Statement of Changes in Stockholders\' Equity (ASC 505)',
      category: 'Financial',
      description: 'Comprehensive equity rollforward with share-based compensation, treasury stock transactions, dividend declarations, and comprehensive income components',
      lastGenerated: '2024-01-17 07:30 PM',
      schedule: 'Quarterly',
      recipients: ['board@company.com', 'investors@company.com', 'transfer-agent@company.com'],
      status: 'current',
      icon: Users
    },
    {
      id: 'trial-balance-detailed',
      name: 'Trial Balance (Detailed)',
      category: 'Financial',
      description: 'Complete trial balance with supporting schedules and adjustments',
      lastGenerated: '2024-01-18 10:00 AM',
      schedule: 'Monthly',
      recipients: ['accounting@company.com', 'controllers@company.com'],
      status: 'current',
      icon: BarChart3
    },
    {
      id: 'ar-aging',
      name: 'AR Aging Report',
      category: 'Operations',
      description: 'Customer payment aging analysis',
      lastGenerated: '2024-01-18 10:00 AM',
      schedule: 'Daily',
      recipients: ['collections@company.com'],
      status: 'current',
      icon: Clock
    },
    {
      id: 'ap-summary',
      name: 'AP Summary',
      category: 'Operations',
      description: 'Vendor payment obligations and timing',
      lastGenerated: '2024-01-18 09:30 AM',
      schedule: 'Daily',
      recipients: ['payables@company.com'],
      status: 'current',
      icon: CreditCard
    },
    {
      id: 'expense-analysis',
      name: 'Expense Analysis',
      category: 'Management',
      description: 'Department and category expense breakdown',
      lastGenerated: '2024-01-18 08:00 AM',
      schedule: 'Weekly',
      recipients: ['managers@company.com'],
      status: 'generating',
      icon: Receipt
    },
    {
      id: 'budget-variance',
      name: 'Budget vs Actual Performance Analysis',
      category: 'Management',
      description: 'Comprehensive budget variance analysis with statistical significance testing, forecast accuracy metrics, and corrective action recommendations',
      lastGenerated: '2024-01-17 06:00 PM',
      schedule: 'Monthly',
      recipients: ['planning@company.com', 'ceo@company.com', 'board-finance-committee@company.com'],
      status: 'scheduled',
      icon: Target
    },
    {
      id: 'management-letter',
      name: 'Management Letter & Internal Control Deficiencies',
      category: 'Audit',
      description: 'External auditor management letter with internal control findings, management responses, and remediation timelines per SOX requirements',
      lastGenerated: '2024-01-15 02:00 PM',
      schedule: 'Annual',
      recipients: ['audit-committee@company.com', 'cfo@company.com', 'internal-audit@company.com'],
      status: 'current',
      icon: AlertTriangle
    },
    {
      id: 'sox-compliance',
      name: 'SOX 404 Internal Controls Assessment Report',
      category: 'Audit',
      description: 'Comprehensive Sarbanes-Oxley compliance report with testing results, control effectiveness assessment, and management certification',
      lastGenerated: '2024-01-12 04:30 PM',
      schedule: 'Quarterly',
      recipients: ['sox-compliance@company.com', 'audit-committee@company.com', 'external-auditors@cpa-firm.com'],
      status: 'current',
      icon: CheckCircle
    },
    {
      id: 'sec-filing-10k',
      name: 'SEC Form 10-K Annual Report',
      category: 'Regulatory',
      description: 'Annual report to SEC with audited financial statements, MD&A, risk factors, and business overview per SEC regulations',
      lastGenerated: '2024-01-10 11:00 AM',
      schedule: 'Annual',
      recipients: ['sec-reporting@company.com', 'sec-counsel@law-firm.com', 'investor-relations@company.com'],
      status: 'current',
      icon: Building
    },
    {
      id: 'sec-filing-10q',
      name: 'SEC Form 10-Q Quarterly Report',
      category: 'Regulatory',
      description: 'Quarterly report to SEC with unaudited financial statements, MD&A, and legal proceedings per SEC requirements',
      lastGenerated: '2024-01-08 03:15 PM',
      schedule: 'Quarterly',
      recipients: ['sec-reporting@company.com', 'sec-counsel@law-firm.com'],
      status: 'current',
      icon: Calendar
    }
  ]);

  const [kpiData] = useState<ReportData[]>([
    { metric: 'Total Revenue', current: 2800000, previous: 2580000, change: 8.5, trend: 'up' },
    { metric: 'Net Income', current: 750000, previous: 685000, change: 9.5, trend: 'up' },
    { metric: 'Cash Position', current: 5700000, previous: 5200000, change: 9.6, trend: 'up' },
    { metric: 'Operating Expenses', current: 1890000, previous: 1950000, change: -3.1, trend: 'down' },
    { metric: 'Gross Margin', current: 68.5, previous: 65.2, change: 3.3, trend: 'up' },
    { metric: 'DSO (Days)', current: 28, previous: 32, change: -12.5, trend: 'down' }
  ]);

  const handleExport = () => {
    // Export report data as CSV
    const csvContent = activeTab === 'overview' ?
      'Metric,Current,Previous,Change\n' +
      kpiData.map(kpi => `${kpi.metric},${kpi.current},${kpi.previous},${kpi.change}%`).join('\n') :
      'Report Name,Category,Status,Last Generated\n' +
      reports.map(report => `${report.name},${report.category},${report.status},${report.lastGenerated}`).join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `accountrix-reports-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-500/20 text-green-400';
      case 'generating': return 'bg-yellow-500/20 text-yellow-400';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <DollarSign className="w-4 h-4 text-gray-400" />;
    }
  };

  const getChangeColor = (change: number, isExpense = false) => {
    if (isExpense) {
      return change > 0 ? 'text-red-400' : 'text-green-400';
    }
    return change > 0 ? 'text-green-400' : 'text-red-400';
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'non-compliant': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Reports Overview', icon: BarChart3 },
    { id: 'financial', name: 'GAAP Financial Statements', icon: DollarSign },
    { id: 'management', name: 'Management Reports', icon: Users },
    { id: 'audit', name: 'Audit & Compliance', icon: CheckCircle },
    { id: 'regulatory', name: 'SEC & Regulatory', icon: Building },
    { id: 'statements', name: 'Professional Statements', icon: FileText },
    { id: 'custom', name: 'Custom Reports', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Professional CPA Financial Reporting Suite</h1>
                <p className="text-gray-400">GAAP-compliant financial statements, SEC filings, and audit-ready reports with AI-powered analytics</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <AskAIButton />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="current-month" className="text-black bg-white">Current Month</option>
              <option value="last-month" className="text-black bg-white">Last Month</option>
              <option value="current-quarter" className="text-black bg-white">Current Quarter</option>
              <option value="current-year" className="text-black bg-white">Current Year</option>
              <option value="2025" className="text-black bg-white">Year 2025</option>
              <option value="2024" className="text-black bg-white">Year 2024</option>
              <option value="2023" className="text-black bg-white">Year 2023</option>
              <option value="2022" className="text-black bg-white">Year 2022</option>
              <option value="2021" className="text-black bg-white">Year 2021</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handleExportReports}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Generate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="p-6 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {kpiData.slice(0, 6).map((kpi, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    {getTrendIcon(kpi.trend)}
                  </div>
                  <h3 className="text-white font-semibold">{kpi.metric}</h3>
                </div>
                <span className={`text-sm font-medium ${getChangeColor(kpi.change, kpi.metric.includes('Expenses'))}`}>
                  {kpi.change > 0 ? '+' : ''}{kpi.change}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">
                  {kpi.metric.includes('Margin') || kpi.metric.includes('DSO') ?
                    (kpi.metric.includes('DSO') ? `${kpi.current}` : formatPercentage(kpi.current)) :
                    formatCurrency(kpi.current)
                  }
                </span>
                <span className="text-gray-400 text-sm">
                  vs {kpi.metric.includes('Margin') || kpi.metric.includes('DSO') ?
                    (kpi.metric.includes('DSO') ? `${kpi.previous}` : formatPercentage(kpi.previous)) :
                    formatCurrency(kpi.previous)
                  }
                </span>
              </div>
            </div>
          ))}
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
                  ? 'border-blue-400 text-blue-400'
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* AI Reporting Insights */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Reporting Insights</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">GAAP Compliance Status</span>
                    </div>
                    <p className="text-gray-300 text-sm">All financial statements fully compliant with ASC standards. Independent auditor review completed with unqualified opinion.</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Financial Performance</span>
                    </div>
                    <p className="text-gray-300 text-sm">Net income increased 149% year-over-year. Strong cash generation and improved working capital management.</p>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-medium">SEC Filing Status</span>
                    </div>
                    <p className="text-gray-300 text-sm">10-K and 10-Q filings current and compliant. No material weaknesses identified in internal controls assessment.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Audit Recommendations</span>
                    </div>
                    <p className="text-gray-300 text-sm">Review lease accounting disclosures for ASC 842 compliance. Update revenue recognition policies for new contracts.</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Automation & Controls</span>
                    </div>
                    <p className="text-gray-300 text-sm">SOX 404 testing 98% automated. Enhanced control effectiveness with AI-powered transaction monitoring and exception reporting.</p>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Professional Standards</span>
                    </div>
                    <p className="text-gray-300 text-sm">All reports meet AICPA professional standards. Audit trail documentation complete and accessible for regulatory review.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Generation Status */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-400" />
                <span>Report Generation Status</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h4 className="text-green-400 font-semibold mb-2">Current Reports</h4>
                  <p className="text-2xl font-bold text-white">6</p>
                  <p className="text-gray-400 text-sm">Up to date</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                  <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <h4 className="text-yellow-400 font-semibold mb-2">Generating</h4>
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-gray-400 text-sm">In progress</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h4 className="text-blue-400 font-semibold mb-2">Scheduled</h4>
                  <p className="text-2xl font-bold text-white">1</p>
                  <p className="text-gray-400 text-sm">Next run tomorrow</p>
                </div>
              </div>
            </div>

            {/* Recent Reports Activity */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-blue-400" />
                <span>Recent Report Activity</span>
              </h3>

              <div className="space-y-3">
                {reports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <report.icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{report.name}</p>
                        <p className="text-gray-400 text-sm">{report.category} • {report.lastGenerated}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <p className="text-gray-400 text-sm mt-1">{report.schedule}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reports.filter(r => r.category === 'Financial').map((report) => (
                <div key={report.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <report.icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{report.name}</h4>
                        <p className="text-gray-400 text-sm">{report.description}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Last Generated:</span>
                      <span className="text-white text-sm">{report.lastGenerated}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Schedule:</span>
                      <span className="text-white text-sm">{report.schedule}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Recipients:</span>
                      <span className="text-white text-sm">{report.recipients.length} users</span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Report</span>
                    </button>
                    <button
                      onClick={handleExportReports}
                      className="flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      title="Export Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'management' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reports.filter(r => r.category === 'Management' || r.category === 'Operations').map((report) => (
                <div key={report.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <report.icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{report.name}</h4>
                        <p className="text-gray-400 text-sm">{report.description}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Category:</span>
                      <span className="text-white text-sm">{report.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Last Generated:</span>
                      <span className="text-white text-sm">{report.lastGenerated}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Schedule:</span>
                      <span className="text-white text-sm">{report.schedule}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Report</span>
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            {/* GAAP Compliance Dashboard */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>GAAP Compliance Dashboard</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {complianceMetrics.map((metric, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm font-medium">{metric.standard}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getComplianceStatusColor(metric.status)}`}>
                        {metric.status}
                      </span>
                    </div>
                    <p className="text-white text-sm font-semibold mb-1">{metric.requirement}</p>
                    <p className="text-gray-400 text-xs">Last Check: {metric.lastCheck}</p>
                    {metric.notes && <p className="text-yellow-400 text-xs mt-1">{metric.notes}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reports.filter(r => r.category === 'Audit').map((report) => (
                <div key={report.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-red-500/20 rounded-lg">
                        <report.icon className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{report.name}</h4>
                        <p className="text-gray-400 text-sm">{report.description}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Last Generated:</span>
                      <span className="text-white text-sm">{report.lastGenerated}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Schedule:</span>
                      <span className="text-white text-sm">{report.schedule}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Recipients:</span>
                      <span className="text-white text-sm">{report.recipients.length} users</span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Report</span>
                    </button>
                    <button
                      onClick={handleExportReports}
                      className="flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      title="Export Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'regulatory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reports.filter(r => r.category === 'Regulatory').map((report) => (
                <div key={report.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-indigo-500/20 rounded-lg">
                        <report.icon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{report.name}</h4>
                        <p className="text-gray-400 text-sm">{report.description}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Last Filed:</span>
                      <span className="text-white text-sm">{report.lastGenerated}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Filing Schedule:</span>
                      <span className="text-white text-sm">{report.schedule}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Distribution:</span>
                      <span className="text-white text-sm">{report.recipients.length} recipients</span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Filing</span>
                    </button>
                    <button
                      onClick={handleExportReports}
                      className="flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      title="Export Report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'statements' && (
          <div className="space-y-6">
            {/* Professional Financial Statements Selector */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>Professional GAAP Financial Statements</span>
                <span className="text-sm text-green-400 bg-green-500/20 px-2 py-1 rounded">Auditor Ready</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                <button
                  onClick={() => setSelectedReport('balance-sheet')}
                  className={`p-4 rounded-lg border transition-colors ${
                    selectedReport === 'balance-sheet'
                      ? 'bg-blue-600/20 border-blue-400 text-blue-400'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold">Balance Sheet</h4>
                    <p className="text-sm opacity-75">ASC 210 Classified</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedReport('income-statement')}
                  className={`p-4 rounded-lg border transition-colors ${
                    selectedReport === 'income-statement'
                      ? 'bg-green-600/20 border-green-400 text-green-400'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold">Income Statement</h4>
                    <p className="text-sm opacity-75">ASC 220 Compliant</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedReport('cash-flow')}
                  className={`p-4 rounded-lg border transition-colors ${
                    selectedReport === 'cash-flow'
                      ? 'bg-purple-600/20 border-purple-400 text-purple-400'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold">Cash Flow</h4>
                    <p className="text-sm opacity-75">ASC 230 Standard</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedReport('trial-balance')}
                  className={`p-4 rounded-lg border transition-colors ${
                    selectedReport === 'trial-balance'
                      ? 'bg-orange-600/20 border-orange-400 text-orange-400'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="text-center">
                    <PieChart className="w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold">Trial Balance</h4>
                    <p className="text-sm opacity-75">GAAP Format</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedReport('general-ledger')}
                  className={`p-4 rounded-lg border transition-colors ${
                    selectedReport === 'general-ledger'
                      ? 'bg-indigo-600/20 border-indigo-400 text-indigo-400'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2" />
                    <h4 className="font-semibold">General Ledger</h4>
                    <p className="text-sm opacity-75">Detail Report</p>
                  </div>
                </button>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-gray-400 text-sm mb-4">
                  Select a financial statement to view in professional GAAP format. All reports include drill-down capability and export to PDF/Excel.
                </p>
              </div>
            </div>

            {/* Render Selected Professional Statement */}
            {selectedReport === 'balance-sheet' && (
              <div className="bg-white rounded-2xl shadow-2xl">
                <ProfessionalBalanceSheet
                  companyName="Accountrix AI CPA Demo Company"
                  asOfDate="December 31, 2024"
                  showComparative={true}
                  onDrillDown={(accountCode, accountName) => {
                    window.location.href = `/accounting/reports/account/${accountCode}?name=${encodeURIComponent(accountName)}`;
                  }}
                  onExportPDF={() => {
                    alert('Exporting Balance Sheet to PDF...\n\nThis would generate a professional PDF report.');
                  }}
                  onExportExcel={() => {
                    alert('Exporting Balance Sheet to Excel...\n\nThis would generate a detailed Excel workbook.');
                  }}
                />
              </div>
            )}

            {selectedReport === 'income-statement' && (
              <div className="bg-white rounded-2xl shadow-2xl">
                <ProfessionalIncomeStatement
                  companyName="Accountrix AI CPA Demo Company"
                  periodEnding="December 31, 2024"
                  showComparative={true}
                  onDrillDown={(accountCode, accountName) => {
                    window.location.href = `/accounting/reports/account/${accountCode}?name=${encodeURIComponent(accountName)}`;
                  }}
                  onExportPDF={() => {
                    alert('Exporting Income Statement to PDF...\n\nThis would generate a professional PDF report.');
                  }}
                  onExportExcel={() => {
                    alert('Exporting Income Statement to Excel...\n\nThis would generate a detailed Excel workbook.');
                  }}
                />
              </div>
            )}

            {selectedReport === 'cash-flow' && (
              <div className="bg-white rounded-2xl shadow-2xl">
                <ProfessionalCashFlowStatement
                  companyName="Accountrix AI CPA Demo Company"
                  periodEnding="December 31, 2024"
                  method="indirect"
                  showComparative={true}
                  onDrillDown={(accountCode, accountName) => {
                    window.location.href = `/accounting/reports/account/${accountCode}?name=${encodeURIComponent(accountName)}`;
                  }}
                  onExportPDF={() => {
                    alert('Exporting Cash Flow Statement to PDF...\n\nThis would generate a professional PDF report with ASC 230 compliance.');
                  }}
                  onExportExcel={() => {
                    alert('Exporting Cash Flow Statement to Excel...\n\nThis would generate a detailed Excel workbook with both direct and indirect methods.');
                  }}
                />
              </div>
            )}

            {selectedReport === 'trial-balance' && (
              <div className="bg-white rounded-2xl shadow-2xl">
                <ProfessionalTrialBalance
                  companyName="Accountrix AI CPA Demo Company"
                  asOfDate="December 31, 2024"
                  showComparative={false}
                  includeInactive={false}
                  onDrillDown={(accountCode, accountName) => {
                    window.location.href = `/accounting/reports/account/${accountCode}?name=${encodeURIComponent(accountName)}`;
                  }}
                  onExportPDF={() => {
                    alert('Exporting Trial Balance to PDF...\n\nThis would generate a professional PDF report with GAAP formatting.');
                  }}
                  onExportExcel={() => {
                    alert('Exporting Trial Balance to Excel...\n\nThis would generate a detailed Excel workbook with account details.');
                  }}
                />
              </div>
            )}

            {selectedReport === 'general-ledger' && (
              <div className="bg-white rounded-2xl shadow-2xl">
                <ProfessionalGeneralLedgerDetail
                  companyName="Accountrix AI CPA Demo Company"
                  periodFrom="January 1, 2024"
                  periodTo="December 31, 2024"
                  accountCode="1000"
                  accountName="Cash and Cash Equivalents"
                  onExportPDF={() => {
                    alert('Exporting General Ledger Detail to PDF...\n\nThis would generate a professional PDF report with complete transaction history.');
                  }}
                  onExportExcel={() => {
                    alert('Exporting General Ledger Detail to Excel...\n\nThis would generate a detailed Excel workbook with transaction details.');
                  }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-purple-400" />
                <span>Custom Report Builder</span>
                <span className="text-sm text-purple-400 bg-purple-500/20 px-2 py-1 rounded">AI-Powered</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Report Name</label>
                    <input
                      type="text"
                      placeholder="Enter report name..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Data Sources</label>
                    <div className="space-y-2">
                      {['General Ledger', 'Accounts Receivable', 'Accounts Payable', 'Cash Management', 'Expenses'].map((source) => (
                        <label key={source} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-white/20 bg-white/10 text-purple-600" />
                          <span className="text-gray-300">{source}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time Period</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500">
                      <option value="current-month">Current Month</option>
                      <option value="last-month">Last Month</option>
                      <option value="current-quarter">Current Quarter</option>
                      <option value="current-year">Current Year</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Report Format</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500">
                      <option value="pdf">PDF Document</option>
                      <option value="excel">Excel Spreadsheet</option>
                      <option value="dashboard">Interactive Dashboard</option>
                      <option value="csv">CSV Export</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Schedule</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500">
                      <option value="manual">Manual Generation</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Recipients</label>
                    <input
                      type="text"
                      placeholder="Enter email addresses..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex space-x-4">
                <button className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  <Brain className="w-4 h-4" />
                  <span>Generate with AI</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>Preview Report</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>Save Template</span>
                </button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Report Suggestions</span>
              </h3>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-white mb-2">🤖 Recommended Reports Based on Your Data:</p>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• <strong>Vendor Performance Analysis:</strong> Track payment terms, discounts, and relationship metrics</li>
                  <li>• <strong>Customer Profitability Report:</strong> Revenue, costs, and margin analysis by customer</li>
                  <li>• <strong>Cash Flow Forecasting:</strong> 13-week rolling cash flow predictions with scenarios</li>
                  <li>• <strong>Department Budget Variance:</strong> Real-time budget vs actual with variance explanations</li>
                  <li>• <strong>AI Automation ROI:</strong> Cost savings and efficiency gains from AI features</li>
                </ul>
                <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  Create Suggested Reports
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}