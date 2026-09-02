'use client';

import React, { useState, useEffect } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  FileText,
  BarChart3,
  Brain,
  Menu,
  X,
  MessageSquare,
  Mic,
  MicOff,
  Settings,
  Building,
  CreditCard,
  Receipt,
  Users,
  Shield,
  Target,
  Globe,
  Smartphone,
  ChevronDown,
  ChevronRight,
  Home,
  Calendar
} from 'lucide-react';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [systemMode, setSystemMode] = useState<'demo' | 'live'>('demo');
  const [coreAccountingOpen, setCoreAccountingOpen] = useState(true);
  const [aiFeaturesOpen, setAiFeaturesOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: string}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState({
    cashPosition: 5700000,
    revenue: 2800000,
    expenses: 1890000,
    netIncome: 750000,
    arTotal: 335000,
    apTotal: 197000,
    monthlyBurn: 158000,
    aiAutomation: 95.3
  });

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const processAiCommand = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Simulate realistic AI responses based on actual accounting queries
    if (lowerMessage.includes('cash') && (lowerMessage.includes('position') || lowerMessage.includes('flow'))) {
      return `📊 **Current Cash Position Analysis**

**Total Cash:** ${formatCurrency(currentMetrics.cashPosition)}
**Monthly Burn Rate:** ${formatCurrency(currentMetrics.monthlyBurn)}
**Cash Runway:** ${Math.floor(currentMetrics.cashPosition / currentMetrics.monthlyBurn)} months

**90-Day Cash Forecast:**
• Month 1: ${formatCurrency(currentMetrics.cashPosition - currentMetrics.monthlyBurn)}
• Month 2: ${formatCurrency(currentMetrics.cashPosition - (currentMetrics.monthlyBurn * 2))}
• Month 3: ${formatCurrency(currentMetrics.cashPosition - (currentMetrics.monthlyBurn * 3))}

🔍 **AI Insights:** Cash position is healthy with strong runway. Recommend maintaining $2M minimum balance for operations.`;

    } else if (lowerMessage.includes('revenue') || lowerMessage.includes('income')) {
      const margin = ((currentMetrics.revenue - currentMetrics.expenses) / currentMetrics.revenue * 100);
      return `💰 **Revenue & Profitability Analysis**

**Total Revenue:** ${formatCurrency(currentMetrics.revenue)}
**Operating Expenses:** ${formatCurrency(currentMetrics.expenses)}
**Net Income:** ${formatCurrency(currentMetrics.netIncome)}
**Profit Margin:** ${margin.toFixed(1)}%

**YTD Performance:**
• Q1 Revenue: ${formatCurrency(currentMetrics.revenue * 0.9)}
• Growth Rate: +12.5% vs prior year
• Recurring Revenue: 78% of total

🎯 **AI Recommendation:** Revenue growth is strong. Consider expanding into new markets based on current profitability.`;

    } else if (lowerMessage.includes('expenses') || lowerMessage.includes('costs')) {
      return `📈 **Expense Analysis**

**Total Operating Expenses:** ${formatCurrency(currentMetrics.expenses)}
**Breakdown by Category:**
• Personnel: ${formatCurrency(currentMetrics.expenses * 0.65)} (65%)
• Technology: ${formatCurrency(currentMetrics.expenses * 0.15)} (15%)
• Facilities: ${formatCurrency(currentMetrics.expenses * 0.12)} (12%)
• Other: ${formatCurrency(currentMetrics.expenses * 0.08)} (8%)

**Cost Efficiency:**
• Cost per employee: ${formatCurrency(currentMetrics.expenses * 0.65 / 125)}
• Technology ROI: 340%

⚡ **AI Alert:** Technology spending up 8% month-over-month. Review AWS usage for optimization opportunities.`;

    } else if (lowerMessage.includes('receivable') || lowerMessage.includes('ar')) {
      return `🧾 **Accounts Receivable Status**

**Total AR:** ${formatCurrency(currentMetrics.arTotal)}
**Aging Analysis:**
• 0-30 days: ${formatCurrency(currentMetrics.arTotal * 0.75)} (75%)
• 31-60 days: ${formatCurrency(currentMetrics.arTotal * 0.18)} (18%)
• 61-90 days: ${formatCurrency(currentMetrics.arTotal * 0.05)} (5%)
• 90+ days: ${formatCurrency(currentMetrics.arTotal * 0.02)} (2%)

**DSO (Days Sales Outstanding):** 28 days
**Collection Efficiency:** 96.8%

🤖 **AI Prediction:** ${formatCurrency(currentMetrics.arTotal * 0.23)} expected to be collected within 7 days based on payment patterns.`;

    } else if (lowerMessage.includes('payable') || lowerMessage.includes('ap')) {
      return `💳 **Accounts Payable Summary**

**Total AP:** ${formatCurrency(currentMetrics.apTotal)}
**Payment Schedule:**
• Due within 7 days: ${formatCurrency(currentMetrics.apTotal * 0.45)}
• Due 8-30 days: ${formatCurrency(currentMetrics.apTotal * 0.40)}
• Due 30+ days: ${formatCurrency(currentMetrics.apTotal * 0.15)}

**Top Vendors:**
• AWS Technologies: ${formatCurrency(45000)}
• Microsoft Corp: ${formatCurrency(32000)}
• Office Solutions: ${formatCurrency(18000)}

💡 **AI Optimization:** Early payment discounts available on ${formatCurrency(85000)} - potential savings of ${formatCurrency(1700)}.`;

    } else if (lowerMessage.includes('report') || lowerMessage.includes('financial')) {
      return `📋 **Financial Reports Available**

**Standard Reports:**
• Balance Sheet (Current)
• Profit & Loss (MTD/YTD)
• Cash Flow Statement
• Trial Balance
• AR/AP Aging

**AI-Generated Insights:**
• Executive Dashboard (Real-time)
• Variance Analysis
• Budget vs Actual
• Trend Analysis
• Predictive Forecasting

**Recent Activity:**
• Monthly close: Completed ✅
• Bank reconciliation: 99.8% automated
• Journal entries: ${Math.floor(Math.random() * 50 + 150)} this month

📊 Click 'Reports' in the sidebar to generate any financial statement with real-time data.`;

    } else if (lowerMessage.includes('ai') || lowerMessage.includes('automation')) {
      return `🤖 **Accountrix AI Performance**

**Automation Rate:** ${currentMetrics.aiAutomation}%
**Time Saved:** 847 hours this year
**Accuracy Rate:** 98.7%

**AI Capabilities:**
• Transaction categorization: 94% automated
• Bank reconciliation: 99% automated
• Invoice processing: 92% automated
• Expense approval: 88% automated
• Report generation: 100% automated

**Recent AI Activities:**
• Processed 1,247 documents this month
• Detected 3 anomalies (all resolved)
• Generated 156 journal entries
• Completed 24 reconciliations

🎯 **Productivity Impact:** Your accounting team is 340% more efficient with Accountrix AI automation.`;

    } else if (lowerMessage.includes('help') || lowerMessage.includes('commands')) {
      return `🎯 **Accountrix AI Assistant Commands**

**Financial Queries:**
• "What's my cash position?"
• "Show revenue analysis"
• "Accounts receivable status"
• "Expense breakdown"
• "Generate financial reports"

**AI Functions:**
• "Process uploaded documents"
• "Reconcile bank accounts"
• "Close monthly books"
• "Generate audit pack"
• "AI automation status"

**Quick Actions:**
• "Upload previous financials"
• "Export reports to PDF"
• "Show top vendors"
• "Budget vs actual analysis"

💬 **Natural Language:** Ask me anything about your finances in plain English! I understand context and can provide detailed analysis.`;

    } else {
      return `🤖 **Accountrix AI Understanding**

I can help you with:
• Financial analysis and reporting
• Cash flow and profitability insights
• Accounts receivable/payable status
• Expense analysis and optimization
• AI automation and efficiency metrics

**Try asking:**
• "What's my current cash position?"
• "Show me revenue analysis"
• "How are my receivables doing?"
• "Generate financial reports"
• "AI automation status"

**Current Company Status:** ${formatCurrency(currentMetrics.cashPosition)} cash, ${formatCurrency(currentMetrics.revenue)} revenue, ${currentMetrics.aiAutomation}% AI automated.

What specific financial information would you like to know about?`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isAiTyping) return;

    const userMessage = {
      role: 'user' as const,
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    const currentMessage = inputMessage;
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAiTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant' as const,
        content: processAiCommand(currentMessage),
        timestamp: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => [...prev, aiResponse]);
      setIsAiTyping(false);
    }, Math.random() * 1000 + 1000); // 1-2 second delay
  };

  const coreAccountingItems = [
    { name: 'Company', icon: Building, path: '/accounting/company', description: 'Company setup and management' },
    { name: 'General Ledger', icon: FileText, path: '/accounting/general-ledger', description: 'Complete general ledger management' },
    { name: 'Cash Management', icon: DollarSign, path: '/accounting/cash-management', description: 'Cash flow and treasury management' },
    { name: 'Accounts Payable', icon: CreditCard, path: '/accounting/accounts-payable', description: 'Vendor payments and management' },
    { name: 'Accounts Receivable', icon: Receipt, path: '/accounting/accounts-receivable', description: 'Customer invoicing and payments' },
    { name: 'Invoices', icon: Receipt, path: '/accounting/invoices', description: 'Invoice creation and management' },
    { name: 'Payments', icon: CreditCard, path: '/accounting/payments', description: 'Check, ACH, wire transfers' },
    { name: 'Expenses', icon: Receipt, path: '/accounting/expenses', description: 'Expense tracking and reporting' },
    { name: 'Tax Preparation', icon: Calculator, path: '/tax-preparation', description: 'AI-powered tax preparation' },
    { name: 'Reports', icon: BarChart3, path: '/accounting/reports', description: 'Financial reports and analytics' }
  ];

  const aiAdvancedItems = [
    { name: 'Document Processing', icon: FileText, path: '/document-processing', description: 'AI document extraction and processing' },
    { name: 'AI Assistant', icon: Brain, path: '/ai-assistant', description: 'Conversational AI accounting assistant' },
    { name: 'Financial Health Monitor', icon: TrendingUp, path: '/financial-health', description: 'Real-time financial health monitoring' },
    { name: 'Autonomous AI Accountant', icon: Brain, path: '/autonomous-ai', description: '95% automated accounting processes' },
    { name: 'Compliance & Audit Center', icon: Shield, path: '/compliance-audit', description: 'Automated compliance and audit tools' },
    { name: 'Predictive Intelligence', icon: Target, path: '/business-intelligence', description: 'AI-powered business insights' },
    { name: 'Competitive Analysis', icon: TrendingUp, path: '/competitive-analysis', description: 'Market and competitive intelligence' },
    { name: 'Ecosystem Integration', icon: Globe, path: '/ecosystem-integration', description: '500+ business integrations' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 bg-black/30 backdrop-blur-md border-r border-white/10 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ACCOUNTRIX
                  </h1>
                  <p className="text-xs text-gray-400 -mt-1">AI-Powered Accounting</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Dashboard Home */}
          <div className="mb-6">
            <button
              onClick={() => handleNavigation('/dashboard')}
              className="w-full flex items-center space-x-3 p-3 rounded-lg bg-purple-600/20 border border-purple-500/30 text-white hover:bg-purple-600/30 transition-colors"
            >
              <Home className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">Dashboard Home</span>}
            </button>
          </div>

          {/* Core Accounting Section */}
          <div className="mb-6">
            <button
              onClick={() => setCoreAccountingOpen(!coreAccountingOpen)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <Building className="w-5 h-5" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left font-medium">Core Accounting</span>
                  {coreAccountingOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </button>

            {sidebarOpen && coreAccountingOpen && (
              <div className="mt-2 space-y-1 ml-4">
                {coreAccountingItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center space-x-3 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    <item.icon className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI & Advanced Features Section */}
          <div className="mb-6">
            <button
              onClick={() => setAiFeaturesOpen(!aiFeaturesOpen)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <Brain className="w-5 h-5" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left font-medium">AI & Advanced Features</span>
                  {aiFeaturesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </button>

            {sidebarOpen && aiFeaturesOpen && (
              <div className="mt-2 space-y-1 ml-4">
                {aiAdvancedItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center space-x-3 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    <item.icon className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Executive */}
          <div className="mb-6">
            <button
              onClick={() => handleNavigation('/mobile-executive')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <Smartphone className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">Mobile Executive</span>}
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm focus:ring-2 focus:ring-purple-500"
              >
                {Array.from({length: 26}, (_, i) => 2025 - i).map(year => (
                  <option key={year} value={year.toString()} className="text-black bg-white">{year}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">System Mode:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSystemMode('demo')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    systemMode === 'demo'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  Demo
                </button>
                <button
                  onClick={() => setSystemMode('live')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    systemMode === 'live'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  Live Data
                </button>
              </div>
            </div>

            <div className="mb-3">
              <button
                onClick={() => {
                  if (systemMode === 'demo') {
                    alert(`📊 Demo Mode - Upload Previous Financials\n\nDemo mode will use sample data for years ${selectedYear} and prior.\n\nIn Live Data mode, you can upload:\n• QuickBooks exports (.qbw, .qbb)\n• Excel spreadsheets (.xlsx, .csv)\n• PDF financial statements\n• Bank statements and transactions\n\nSwitch to 'Live Data' mode to upload real files.`);
                  } else {
                    window.location.href = '/document-processing';
                  }
                }}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>📊 {systemMode === 'demo' ? 'Demo Financials' : 'Upload Financials'}</span>
              </button>
            </div>

            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Executive Dashboard</h2>
              <p className="text-gray-400 mt-1">Revolutionary AI System • Enterprise Grade • $500M Valuation</p>
            </div>

            <div className="flex items-center space-x-4">
              <AskAIButton />
              <button
                onClick={() => setVoiceActive(!voiceActive)}
                className={`p-3 rounded-lg transition-colors ${
                  voiceActive
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-white/10 text-gray-400 border border-white/20'
                }`}
              >
                {voiceActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button className="p-3 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-2xl font-bold text-green-400">$5.7M</span>
              </div>
              <h3 className="text-white font-semibold">Cash Position</h3>
              <p className="text-gray-400 text-sm">+12.5% from last month</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-blue-400">$2.8M</span>
              </div>
              <h3 className="text-white font-semibold">Monthly Revenue</h3>
              <p className="text-gray-400 text-sm">+8.3% growth trend</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-purple-400">95%</span>
              </div>
              <h3 className="text-white font-semibold">AI Automation</h3>
              <p className="text-gray-400 text-sm">Tasks automated</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-2xl font-bold text-yellow-400">92/100</span>
              </div>
              <h3 className="text-white font-semibold">Health Score</h3>
              <p className="text-gray-400 text-sm">Excellent financial health</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div
              onClick={() => handleNavigation('/tax-preparation')}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                    Tax Preparation {selectedYear}
                  </h3>
                  <p className="text-gray-400 text-sm">AI-powered tax filing</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Expected Refund:</span>
                  <span className="text-green-400 font-semibold">$3,220</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Documents Processed:</span>
                  <span className="text-white">15</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => handleNavigation('/financial-health')}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    Financial Health Monitor
                  </h3>
                  <p className="text-gray-400 text-sm">Real-time AI analysis</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Health Score:</span>
                  <span className="text-green-400 font-semibold">92/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Prediction Accuracy:</span>
                  <span className="text-blue-400">87%</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => handleNavigation('/autonomous-ai')}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                    Autonomous AI Accountant
                  </h3>
                  <p className="text-gray-400 text-sm">95% task automation</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Annual Savings:</span>
                  <span className="text-green-400 font-semibold">$186K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Processing Speed:</span>
                  <span className="text-purple-400">Real-time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
            <h3 className="text-2xl font-bold text-green-400 mb-2">Accountrix AI is LIVE!</h3>
            <p className="text-gray-300 mb-4">
              All revolutionary features are ready for immediate use. Navigate using the sidebar to access any feature.
            </p>
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <div className="text-lg font-bold text-white">$500M</div>
                <div className="text-xs text-gray-400">Platform Valuation</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">95%</div>
                <div className="text-xs text-gray-400">Automation Level</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">500+</div>
                <div className="text-xs text-gray-400">Integrations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Interface */}
      {chatOpen && (
        <div className="w-96 bg-black/30 backdrop-blur-md border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-white">AI Assistant</span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <>
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <p className="text-white text-sm">
                    👋 Hello! I'm your AI accounting assistant. I can help you with:
                  </p>
                  <ul className="text-gray-300 text-xs mt-2 space-y-1">
                    <li>• Financial analysis and reporting</li>
                    <li>• Cash flow forecasting</li>
                    <li>• Accounts receivable/payable status</li>
                    <li>• AI automation insights</li>
                    <li>• Real-time financial metrics</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const message = "What should I focus on this month?";
                      setInputMessage(message);
                      handleSendMessage();
                    }}
                    className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <p className="text-white text-xs">💡 What should I focus on this month?</p>
                  </button>

                  <button
                    onClick={() => {
                      const message = "Show me my cash position";
                      setInputMessage(message);
                      handleSendMessage();
                    }}
                    className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <p className="text-white text-xs">📊 Show me my cash position</p>
                  </button>

                  <button
                    onClick={() => {
                      const message = "Revenue analysis";
                      setInputMessage(message);
                      handleSendMessage();
                    }}
                    className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <p className="text-white text-xs">💰 Revenue analysis</p>
                  </button>

                  <button
                    onClick={() => {
                      const message = "AI automation status";
                      setInputMessage(message);
                      handleSendMessage();
                    }}
                    className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <p className="text-white text-xs">🤖 AI automation status</p>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-purple-600/20 border border-purple-500/30'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {message.role === 'assistant' && <Brain className="w-3 h-3 text-purple-400" />}
                        <span className="text-xs text-gray-400">
                          {message.role === 'user' ? 'You' : 'AI Assistant'} • {message.timestamp}
                        </span>
                      </div>
                      <div className="text-white text-xs whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}

                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-3 h-3 text-purple-400 animate-pulse" />
                        <span className="text-xs text-gray-400">AI Assistant is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                disabled={isAiTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isAiTyping || !inputMessage.trim()}
                className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <Brain className="w-4 h-4 text-white" />
              </button>
            </div>

            {voiceActive && (
              <div className="mt-2 flex items-center justify-center space-x-2 text-green-400 text-xs">
                <Mic className="w-3 h-3 animate-pulse" />
                <span>Voice recognition active</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}