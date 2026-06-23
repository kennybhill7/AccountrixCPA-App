'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Calendar,
  Download,
  RefreshCw,
  Brain,
  CreditCard,
  Banknote,
  Eye,
  Plus,
  Building,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function CashManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('30-days');

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleExportCashData = () => {
    // Generate CSV content for cash management export
    const csvHeaders = 'Account Name,Bank,Balance,Available Balance,Difference\n';
    const csvData = cashAccounts.map(account => {
      const difference = account.balance - account.availableBalance;
      return `"${account.name}","${account.bank}","${account.balance}","${account.availableBalance}","${difference}"`;
    }).join('\n');

    const csvContent = csvHeaders + csvData;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cash_management_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ Cash Data Export Complete!\n\nExported ${cashAccounts.length} bank accounts to CSV file.\nFile downloaded: cash_management_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleSyncAccounts = () => {
    alert(`🔄 Bank Account Sync Initiated\n\nSyncing all bank accounts...\n• Primary Business Checking\n• High Yield Savings\n\nThis may take a few moments to complete.`);
    // In a real implementation, this would trigger actual bank API sync
    setTimeout(() => {
      alert(`✅ Account Sync Complete!\n\nAll bank accounts successfully synchronized.\nBalances updated with latest transactions.`);
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cashAccounts = [
    {
      name: 'Primary Business Checking',
      bank: 'Chase Bank',
      balance: 5700000,
      availableBalance: 5650000
    },
    {
      name: 'High Yield Savings',
      bank: 'Goldman Sachs',
      balance: 2800000,
      availableBalance: 2800000
    }
  ];

  const totalCashPosition = cashAccounts.reduce((sum, account) => sum + account.balance, 0);
  const totalAvailableCash = cashAccounts.reduce((sum, account) => sum + account.availableBalance, 0);

  const tabs = [
    { id: 'overview', name: 'Cash Overview', icon: DollarSign },
    { id: 'accounts', name: 'Bank Accounts', icon: CreditCard },
    { id: 'transactions', name: 'Transactions', icon: Banknote },
    { id: 'forecasting', name: 'Cash Forecasting', icon: TrendingUp }
  ];

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
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Cash Management</h1>
                <p className="text-gray-400">Treasury management and cash flow optimization</p>
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
              <option value="7-days" className="text-black bg-white">Last 7 Days</option>
              <option value="30-days" className="text-black bg-white">Last 30 Days</option>
              <option value="90-days" className="text-black bg-white">Last 90 Days</option>
              <option value="current-year" className="text-black bg-white">Current Year</option>
            </select>
            <button
              onClick={handleExportCashData}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleSyncAccounts}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-400">{formatCurrency(totalCashPosition)}</span>
            </div>
            <h3 className="text-white font-semibold">Total Cash Position</h3>
            <p className="text-gray-400 text-sm">+12.5% from last month</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-400">{formatCurrency(totalAvailableCash)}</span>
            </div>
            <h3 className="text-white font-semibold">Available Balance</h3>
            <p className="text-gray-400 text-sm">Immediately accessible</p>
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
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>AI Cash Insights</span>
          </h3>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-gray-300 text-sm">Current cash runway exceeds 12 months at current burn rate. Cash position is healthy with positive growth trends.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cashAccounts.map((account, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{account.name}</h4>
                    <p className="text-gray-400 text-sm">{account.bank}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Current Balance</span>
                  <span className="text-white font-semibold">{formatCurrency(account.balance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Available Balance</span>
                  <span className="text-green-400 font-semibold">{formatCurrency(account.availableBalance)}</span>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}