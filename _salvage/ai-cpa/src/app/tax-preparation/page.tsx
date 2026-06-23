'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  Calculator,
  FileText,
  Upload,
  Download,
  Calendar,
  ArrowLeft,
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Building,
  Zap,
  Eye,
  Edit3,
  Send,
  Shield,
  Target,
  BookOpen,
  RefreshCw,
  X
} from 'lucide-react';

interface TaxForm {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'review' | 'filed' | 'extended';
  estimatedRefund?: number;
  estimatedOwed?: number;
  lastUpdated: string;
}

interface TaxInsight {
  type: 'savings' | 'deduction' | 'alert' | 'tip';
  title: string;
  description: string;
  amount?: number;
  priority: 'high' | 'medium' | 'low';
}

export default function TaxPreparationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedForm, setSelectedForm] = useState<TaxForm | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const [taxForms] = useState<TaxForm[]>([
    {
      id: 'form-1120',
      name: 'Form 1120 - Corporation Income Tax',
      description: 'Corporate income tax return for C-corporations',
      dueDate: '2024-03-15',
      status: 'in-progress',
      estimatedOwed: 185000,
      lastUpdated: '2024-01-18'
    },
    {
      id: 'form-941',
      name: 'Form 941 - Quarterly Payroll Tax',
      description: 'Quarterly federal tax return for payroll taxes',
      dueDate: '2024-01-31',
      status: 'filed',
      lastUpdated: '2024-01-28'
    },
    {
      id: 'state-franchise',
      name: 'State Franchise Tax Return',
      description: 'Annual state franchise tax filing',
      dueDate: '2024-05-15',
      status: 'not-started',
      estimatedOwed: 12000,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'form-1099',
      name: '1099 Information Returns',
      description: 'Annual information returns for contractors',
      dueDate: '2024-01-31',
      status: 'filed',
      lastUpdated: '2024-01-29'
    }
  ]);

  const [taxInsights] = useState<TaxInsight[]>([
    {
      type: 'savings',
      title: 'R&D Tax Credit Opportunity',
      description: 'Software development activities qualify for R&D credits. Potential savings of $75,000.',
      amount: 75000,
      priority: 'high'
    },
    {
      type: 'deduction',
      title: 'Equipment Depreciation',
      description: 'Section 179 deduction available for recent equipment purchases.',
      amount: 45000,
      priority: 'medium'
    },
    {
      type: 'alert',
      title: 'Estimated Payment Due',
      description: 'Q1 2024 estimated tax payment due February 15th.',
      amount: 62000,
      priority: 'high'
    },
    {
      type: 'tip',
      title: 'Document Retention',
      description: 'Ensure all supporting documents are organized for potential audit.',
      priority: 'medium'
    }
  ]);

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleOpenForm = (form: TaxForm) => {
    setSelectedForm(form);
    setShowFormModal(true);
  };

  const handleGeneratePlan = () => {
    alert('Tax planning report generated! This would create a comprehensive tax strategy document with recommendations.');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filed': return 'bg-green-500/20 text-green-400';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400';
      case 'review': return 'bg-yellow-500/20 text-yellow-400';
      case 'extended': return 'bg-purple-500/20 text-purple-400';
      case 'not-started': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'savings': return <DollarSign className="w-4 h-4 text-green-400" />;
      case 'deduction': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'tip': return <BookOpen className="w-4 h-4 text-purple-400" />;
      default: return <Calculator className="w-4 h-4 text-gray-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'savings': return 'bg-green-500/10 border-green-500/20';
      case 'deduction': return 'bg-blue-500/10 border-blue-500/20';
      case 'alert': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'tip': return 'bg-purple-500/10 border-purple-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const totalEstimatedOwed = taxForms.reduce((sum, form) => sum + (form.estimatedOwed || 0), 0);
  const totalEstimatedRefund = taxForms.reduce((sum, form) => sum + (form.estimatedRefund || 0), 0);
  const formsCompleted = taxForms.filter(form => form.status === 'filed').length;
  const potentialSavings = taxInsights.filter(insight => insight.type === 'savings' || insight.type === 'deduction')
    .reduce((sum, insight) => sum + (insight.amount || 0), 0);

  const tabs = [
    { id: 'overview', name: 'Tax Overview', icon: Calculator },
    { id: 'forms', name: 'Tax Forms', icon: FileText },
    { id: 'planning', name: 'Tax Planning', icon: Target },
    { id: 'compliance', name: 'Compliance', icon: Shield }
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
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Accountrix Tax Preparation</h1>
                <p className="text-gray-400">AI-powered tax planning and compliance for $500M+ enterprises</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500"
            >
              {Array.from({length: 51}, (_, i) => 2025 - i).map(year => (
                <option key={year} value={year.toString()} className="text-black bg-white">Tax Year {year}</option>
              ))}
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              <span>Upload Documents</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
              <Brain className="w-4 h-4" />
              <span>AI Tax Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Calculator className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-2xl font-bold text-red-400">{formatCurrency(totalEstimatedOwed)}</span>
            </div>
            <h3 className="text-white font-semibold">Estimated Tax Owed</h3>
            <p className="text-gray-400 text-sm">Current year liability</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-400">{formatCurrency(potentialSavings)}</span>
            </div>
            <h3 className="text-white font-semibold">Potential Savings</h3>
            <p className="text-gray-400 text-sm">AI-identified opportunities</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-400">{formsCompleted}/{taxForms.length}</span>
            </div>
            <h3 className="text-white font-semibold">Forms Completed</h3>
            <p className="text-gray-400 text-sm">Filing progress</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-purple-400">97%</span>
            </div>
            <h3 className="text-white font-semibold">AI Automation</h3>
            <p className="text-gray-400 text-sm">Tax calculations automated</p>
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
                  ? 'border-emerald-400 text-emerald-400'
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
            {/* AI Tax Insights */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Tax Optimization Insights</span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {taxInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {getInsightIcon(insight.type)}
                      <span className="font-medium text-white">{insight.title}</span>
                      {insight.amount && (
                        <span className="text-green-400 font-bold ml-auto">{formatCurrency(insight.amount)}</span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">{insight.description}</p>
                    {insight.priority === 'high' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 mt-2">
                        High Priority
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span>Upcoming Tax Deadlines</span>
              </h3>
              <div className="space-y-3">
                {taxForms.filter(form => form.status !== 'filed').map((form) => (
                  <div key={form.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Calendar className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{form.name}</p>
                        <p className="text-gray-400 text-sm">Due: {form.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                        {form.status.replace('-', ' ').toUpperCase()}
                      </span>
                      {form.estimatedOwed && (
                        <p className="text-red-400 font-semibold text-sm mt-1">{formatCurrency(form.estimatedOwed)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span>Tax Position Summary</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Federal Tax Liability:</span>
                    <span className="text-white font-semibold">{formatCurrency(185000)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">State Tax Liability:</span>
                    <span className="text-white font-semibold">{formatCurrency(12000)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Potential Credits:</span>
                    <span className="text-green-400 font-semibold">-{formatCurrency(75000)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Net Tax Position:</span>
                      <span className="text-white font-bold text-lg">{formatCurrency(122000)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span>Quick Actions</span>
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <span>Review R&D Credit Application</span>
                    <DollarSign className="w-4 h-4" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <span>Schedule Estimated Payment</span>
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    <span>Generate Tax Projections</span>
                    <TrendingUp className="w-4 h-4" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                    <span>AI Tax Strategy Review</span>
                    <Brain className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span>Tax Forms Management</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Form</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {taxForms.map((form) => (
                      <tr key={form.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{form.name}</td>
                        <td className="px-6 py-4 text-gray-300 max-w-xs">{form.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{form.dueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                            {form.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {form.estimatedOwed && (
                            <span className="text-red-400 font-semibold">{formatCurrency(form.estimatedOwed)}</span>
                          )}
                          {form.estimatedRefund && (
                            <span className="text-green-400 font-semibold">{formatCurrency(form.estimatedRefund)}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleOpenForm(form)}
                              className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenForm(form)}
                              className="p-1 text-green-400 hover:text-green-300 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {form.status === 'review' && (
                              <button className="p-1 text-purple-400 hover:text-purple-300 transition-colors">
                                <Send className="w-4 h-4" />
                              </button>
                            )}
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

        {activeTab === 'planning' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span>Strategic Tax Planning</span>
                <span className="text-sm text-green-400 bg-green-500/20 px-2 py-1 rounded">AI-Powered</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="text-green-400 font-semibold mb-2">Tax Optimization Strategies</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Maximize R&D credit claims for software development</li>
                      <li>• Consider Section 199A deduction for business income</li>
                      <li>• Optimize equipment purchases for Section 179</li>
                      <li>• Review charitable contribution opportunities</li>
                    </ul>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">Cash Flow Planning</h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Q1 estimated payment: {formatCurrency(62000)}</li>
                      <li>• Annual tax projection: {formatCurrency(185000)}</li>
                      <li>• Safe harbor requirement: {formatCurrency(166500)}</li>
                      <li>• Recommended quarterly payment: {formatCurrency(46250)}</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">Entity Structure Review</h4>
                    <p className="text-gray-300 text-sm mb-3">AI analysis suggests potential tax savings through entity optimization.</p>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                      Schedule Consultation
                    </button>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-semibold mb-2">Year-End Planning</h4>
                    <p className="text-gray-300 text-sm mb-3">Consider accelerating expenses and deferring income for optimal tax position.</p>
                    <button
                      onClick={handleGeneratePlan}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                    >
                      Generate Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {/* Compliance Overview */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>Tax Compliance Dashboard</span>
                <span className="text-sm text-blue-400 bg-blue-500/20 px-2 py-1 rounded">CPA Professional</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h4 className="text-green-400 font-semibold mb-2">Compliant</h4>
                  <p className="text-2xl font-bold text-white">96%</p>
                  <p className="text-gray-400 text-sm">Federal & State requirements</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                  <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <h4 className="text-yellow-400 font-semibold mb-2">Pending</h4>
                  <p className="text-2xl font-bold text-white">2</p>
                  <p className="text-gray-400 text-sm">Action items</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                  <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h4 className="text-blue-400 font-semibold mb-2">Automated</h4>
                  <p className="text-2xl font-bold text-white">94%</p>
                  <p className="text-gray-400 text-sm">Compliance monitoring</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
                  <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="text-purple-400 font-semibold mb-2">Risk Score</h4>
                  <p className="text-2xl font-bold text-white">Low</p>
                  <p className="text-gray-400 text-sm">Overall compliance risk</p>
                </div>
              </div>
            </div>

            {/* Regulatory Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-6 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span>Regulatory Calendar</span>
                </h4>
                <div className="space-y-4">
                  {[
                    { date: 'Jan 31, 2025', task: 'Form 1099 Distribution Deadline', status: 'upcoming', priority: 'high' },
                    { date: 'Feb 15, 2025', task: 'Q4 2024 Estimated Tax Payment', status: 'pending', priority: 'high' },
                    { date: 'Mar 15, 2025', task: 'Form 1120 Corporate Return Due', status: 'pending', priority: 'medium' },
                    { date: 'Apr 15, 2025', task: 'Individual Tax Return Deadline', status: 'scheduled', priority: 'medium' },
                    { date: 'May 15, 2025', task: 'State Franchise Tax Due', status: 'scheduled', priority: 'low' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.task}</p>
                        <p className="text-gray-400 text-sm">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {item.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-6 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span>Compliance Alerts</span>
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-medium">Critical</span>
                    </div>
                    <p className="text-white text-sm">Form 941 Q4 2024 due in 5 days</p>
                    <button className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
                      Review Now
                    </button>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Warning</span>
                    </div>
                    <p className="text-white text-sm">State sales tax reconciliation pending</p>
                    <button className="mt-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors">
                      View Details
                    </button>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">AI Recommendation</span>
                    </div>
                    <p className="text-white text-sm">Consider quarterly estimated payment increase based on revenue growth</p>
                    <button className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance History & Reports */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-6 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-400" />
                <span>Compliance History & Documentation</span>
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h5 className="text-emerald-400 font-medium">Federal Compliance</h5>
                  {[
                    { form: 'Form 1120 - 2023', status: 'Filed', date: '03/15/2024' },
                    { form: 'Form 941 Q3 2024', status: 'Filed', date: '10/31/2024' },
                    { form: 'Form 1099-MISC 2023', status: 'Filed', date: '01/31/2024' },
                    { form: 'Form 940 - 2023', status: 'Filed', date: '01/31/2024' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <span className="text-gray-300 text-sm">{item.form}</span>
                      <div className="text-right">
                        <span className="text-green-400 text-xs">{item.status}</span>
                        <p className="text-gray-400 text-xs">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h5 className="text-blue-400 font-medium">State Compliance</h5>
                  {[
                    { form: 'State Income Tax 2023', status: 'Filed', date: '03/15/2024' },
                    { form: 'Sales Tax Q3 2024', status: 'Filed', date: '10/20/2024' },
                    { form: 'Franchise Tax 2024', status: 'Pending', date: '05/15/2025' },
                    { form: 'Employer Tax Report Q3', status: 'Filed', date: '10/31/2024' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                      <span className="text-gray-300 text-sm">{item.form}</span>
                      <div className="text-right">
                        <span className={`text-xs ${item.status === 'Filed' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {item.status}
                        </span>
                        <p className="text-gray-400 text-xs">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h5 className="text-purple-400 font-medium">Audit & Documentation</h5>
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
                    <p className="text-green-400 font-medium text-sm">No Active Audits</p>
                    <p className="text-gray-300 text-xs">Last audit: 2022 - Cleared</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                    <p className="text-blue-400 font-medium text-sm">Documentation Score</p>
                    <p className="text-white text-lg font-bold">97%</p>
                    <p className="text-gray-300 text-xs">Audit-ready documentation</p>
                  </div>
                  <button className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors">
                    Generate Compliance Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tax Form Modal */}
      {showFormModal && selectedForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedForm.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedForm.description}</p>
                </div>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">Form Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Form ID:</span>
                        <span className="text-white">{selectedForm.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Due Date:</span>
                        <span className="text-white">{selectedForm.dueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedForm.status)}`}>
                          {selectedForm.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Last Updated:</span>
                        <span className="text-white">{selectedForm.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">AI Form Assistant</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      AI has pre-filled 87% of this form based on your financial data. Review and approve the entries below.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">Revenue data imported</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">Expense categories matched</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">3 items need review</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Financial Summary</h4>
                    <div className="space-y-2 text-sm">
                      {selectedForm.estimatedOwed && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Estimated Tax Owed:</span>
                          <span className="text-red-400 font-semibold">{formatCurrency(selectedForm.estimatedOwed)}</span>
                        </div>
                      )}
                      {selectedForm.estimatedRefund && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Estimated Refund:</span>
                          <span className="text-green-400 font-semibold">{formatCurrency(selectedForm.estimatedRefund)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-300">Gross Income:</span>
                        <span className="text-white">{formatCurrency(2800000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Total Deductions:</span>
                        <span className="text-white">{formatCurrency(1890000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Taxable Income:</span>
                        <span className="text-white">{formatCurrency(910000)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                      <Brain className="w-4 h-4" />
                      <span>AI Review & Complete</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Full Form</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Export PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h4 className="text-white font-semibold mb-4">Form Sections Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { section: 'Income', status: 'completed', progress: 100 },
                    { section: 'Deductions', status: 'in-progress', progress: 75 },
                    { section: 'Credits', status: 'pending', progress: 0 },
                    { section: 'Tax Calculation', status: 'completed', progress: 100 },
                    { section: 'Payments', status: 'in-progress', progress: 50 },
                    { section: 'Signatures', status: 'pending', progress: 0 }
                  ].map((item, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">{item.section}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          item.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.progress === 100 ? 'bg-green-500' :
                            item.progress > 0 ? 'bg-yellow-500' : 'bg-gray-600'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}