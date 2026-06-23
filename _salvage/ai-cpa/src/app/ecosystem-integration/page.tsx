'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  Globe,
  ArrowLeft,
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Shield,
  Link,
  Plus,
  Settings,
  RefreshCw,
  Download,
  Eye,
  Edit3,
  Trash2,
  Play,
  Pause,
  Activity,
  Building,
  Database,
  Cloud,
  Smartphone,
  Cpu
} from 'lucide-react';

export default function EcosystemIntegrationPage() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const integrationCategories = [
    { id: 'accounting', name: 'Accounting Software', icon: Building, count: 12 },
    { id: 'banking', name: 'Banking & Payments', icon: Database, count: 8 },
    { id: 'crm', name: 'CRM & Sales', icon: Globe, count: 6 },
    { id: 'cloud', name: 'Cloud Storage', icon: Cloud, count: 5 },
    { id: 'mobile', name: 'Mobile Apps', icon: Smartphone, count: 4 },
    { id: 'ai', name: 'AI & Analytics', icon: Cpu, count: 7 }
  ];

  const integrations = [
    {
      id: 'quickbooks',
      name: 'QuickBooks Online',
      category: 'accounting',
      status: 'connected',
      type: 'bi-directional',
      lastSync: '2 minutes ago',
      health: 98,
      transactions: 15420,
      description: 'Real-time synchronization of chart of accounts, transactions, and financial data',
      features: ['Auto-sync transactions', 'Duplicate detection', 'Error reconciliation', 'Real-time updates'],
      icon: Building
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      category: 'banking',
      status: 'connected',
      type: 'import',
      lastSync: '5 minutes ago',
      health: 95,
      transactions: 8934,
      description: 'Automated payment processing and revenue recognition',
      features: ['Payment reconciliation', 'Fee tracking', 'Chargeback monitoring', 'Revenue analytics'],
      icon: Database
    },
    {
      id: 'salesforce',
      name: 'Salesforce CRM',
      category: 'crm',
      status: 'pending',
      type: 'bi-directional',
      lastSync: 'Setup required',
      health: 0,
      transactions: 0,
      description: 'Customer data and sales pipeline integration',
      features: ['Lead tracking', 'Opportunity sync', 'Customer analytics', 'Sales forecasting'],
      icon: Globe
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      category: 'cloud',
      status: 'connected',
      type: 'import',
      lastSync: '1 hour ago',
      health: 92,
      transactions: 2156,
      description: 'Document storage and automated backup',
      features: ['Auto-backup', 'Document OCR', 'Version control', 'Shared folders'],
      icon: Cloud
    },
    {
      id: 'slack',
      name: 'Slack Notifications',
      category: 'mobile',
      status: 'connected',
      type: 'export',
      lastSync: 'Real-time',
      health: 100,
      transactions: 892,
      description: 'Real-time notifications and alerts',
      features: ['Alert routing', 'Custom channels', 'Bot commands', 'Report delivery'],
      icon: Smartphone
    },
    {
      id: 'power-bi',
      name: 'Microsoft Power BI',
      category: 'ai',
      status: 'error',
      type: 'export',
      lastSync: 'Failed',
      health: 15,
      transactions: 0,
      description: 'Advanced analytics and visualization',
      features: ['Custom dashboards', 'Data modeling', 'Predictive analytics', 'Report automation'],
      icon: Cpu
    }
  ];

  const healthMetrics = [
    { name: 'Total Integrations', value: '42', change: '+3', trend: 'up' },
    { name: 'Active Connections', value: '38', change: '+2', trend: 'up' },
    { name: 'Success Rate', value: '99.2%', change: '+0.1%', trend: 'up' },
    { name: 'Avg Response Time', value: '1.2s', change: '-0.3s', trend: 'up' },
    { name: 'Daily Transactions', value: '28.5K', change: '+2.1K', trend: 'up' },
    { name: 'Error Rate', value: '0.8%', change: '-0.2%', trend: 'up' }
  ];

  const recentActivity = [
    {
      integration: 'QuickBooks Online',
      action: 'Sync completed',
      time: '2 minutes ago',
      status: 'success',
      details: '1,247 transactions processed'
    },
    {
      integration: 'Stripe Payments',
      action: 'Payment processed',
      time: '5 minutes ago',
      status: 'success',
      details: '$15,750 payment reconciled'
    },
    {
      integration: 'Power BI',
      action: 'Connection failed',
      time: '12 minutes ago',
      status: 'error',
      details: 'Authentication expired'
    },
    {
      integration: 'Google Drive',
      action: 'Documents uploaded',
      time: '1 hour ago',
      status: 'success',
      details: '23 files processed via OCR'
    },
    {
      integration: 'Slack',
      action: 'Alert sent',
      time: '2 hours ago',
      status: 'success',
      details: 'Monthly report delivered'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      case 'disconnected': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-400';
    if (health >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredIntegrations = selectedCategory === 'all'
    ? integrations
    : integrations.filter(integration => integration.category === selectedCategory);

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
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Ecosystem Integration</h1>
                <p className="text-gray-400">Connect and manage all your business applications with AI-powered automation</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Logs</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Sync All</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Integration</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/10 backdrop-blur-md border-b border-white/10">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'overview', name: 'Integration Overview', icon: Activity },
            { id: 'marketplace', name: 'App Marketplace', icon: Building },
            { id: 'workflows', name: 'Automation Workflows', icon: Zap },
            { id: 'monitoring', name: 'Health Monitoring', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeView === tab.id
                  ? 'border-cyan-400 text-cyan-400'
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
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthMetrics.map((metric, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{metric.name}</h3>
                    <div className={`p-1 rounded ${metric.trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      <Activity className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change} vs last week
                  </div>
                </div>
              ))}
            </div>

            {/* Category Filters */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Integration Categories</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  All Categories
                </button>
                {integrationCategories.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-cyan-600 text-white'
                          : 'bg-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <CategoryIcon className="w-4 h-4" />
                      <span>{category.name}</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{category.count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Integrations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredIntegrations.map((integration) => {
                  const IntegrationIcon = integration.icon;
                  return (
                    <div key={integration.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-cyan-500/20 rounded-lg">
                            <IntegrationIcon className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{integration.name}</h4>
                            <p className="text-gray-400 text-sm">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-white transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Status</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                            {integration.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Health Score</span>
                          <span className={`font-semibold ${getHealthColor(integration.health)}`}>
                            {integration.health}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Last Sync</span>
                          <span className="text-white text-sm">{integration.lastSync}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Transactions</span>
                          <span className="text-white text-sm">{integration.transactions.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-3">
                        <h5 className="text-white font-medium text-sm mb-2">Features</h5>
                        <div className="flex flex-wrap gap-1">
                          {integration.features.map((feature, index) => (
                            <span key={index} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 mt-4">
                        {integration.status === 'connected' && (
                          <button className="flex items-center space-x-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors">
                            <Pause className="w-3 h-3" />
                            <span>Pause</span>
                          </button>
                        )}
                        {integration.status === 'error' && (
                          <button className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                            <RefreshCw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        )}
                        {integration.status === 'pending' && (
                          <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                            <Play className="w-3 h-3" />
                            <span>Setup</span>
                          </button>
                        )}
                        <button className="flex items-center space-x-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm transition-colors">
                          <Settings className="w-3 h-3" />
                          <span>Configure</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeView === 'marketplace' && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <Building className="w-5 h-5 text-cyan-400" />
              <span>Integration Marketplace</span>
              <span className="text-sm text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded">200+ Apps</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Xero Accounting', category: 'Accounting', popularity: 'Popular', description: 'Full accounting software integration' },
                { name: 'Square Payments', category: 'Payments', popularity: 'New', description: 'Point of sale and payment processing' },
                { name: 'HubSpot CRM', category: 'CRM', popularity: 'Trending', description: 'Customer relationship management' },
                { name: 'Dropbox Business', category: 'Storage', popularity: 'Popular', description: 'File storage and sharing' },
                { name: 'Zoom Meetings', category: 'Communication', popularity: 'Featured', description: 'Video conferencing integration' },
                { name: 'Tableau Analytics', category: 'Analytics', popularity: 'Enterprise', description: 'Advanced data visualization' }
              ].map((app, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{app.name}</h4>
                        <p className="text-gray-400 text-sm">{app.category}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                      {app.popularity}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{app.description}</p>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Install</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'workflows' && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Automation Workflows</span>
              <span className="text-sm text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded">AI-Powered</span>
            </h3>

            <div className="space-y-6">
              {[
                {
                  name: 'Invoice Processing Automation',
                  trigger: 'When new invoice is received',
                  actions: ['Extract data with OCR', 'Validate against PO', 'Route for approval', 'Post to accounting'],
                  status: 'active',
                  runs: 1247
                },
                {
                  name: 'Expense Report Workflow',
                  trigger: 'When expense receipt is uploaded',
                  actions: ['OCR data extraction', 'Category classification', 'Policy compliance check', 'Auto-approve if under $50'],
                  status: 'active',
                  runs: 892
                },
                {
                  name: 'Customer Payment Reconciliation',
                  trigger: 'When payment is received',
                  actions: ['Match to open invoices', 'Apply payments automatically', 'Send confirmation email', 'Update AR aging'],
                  status: 'active',
                  runs: 2156
                }
              ].map((workflow, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-white font-semibold mb-1">{workflow.name}</h4>
                      <p className="text-gray-400 text-sm">Trigger: {workflow.trigger}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        workflow.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {workflow.status}
                      </span>
                      <span className="text-gray-400 text-sm">{workflow.runs} runs</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-white font-medium text-sm">Automation Steps:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {workflow.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="flex items-center space-x-2 text-sm">
                          <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                            <span className="text-cyan-400 text-xs">{actionIndex + 1}</span>
                          </div>
                          <span className="text-gray-300">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <button className="flex items-center space-x-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors">
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors">
                      <Pause className="w-3 h-3" />
                      <span>Pause</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'monitoring' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === 'success' ? 'bg-green-400' :
                        activity.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium text-sm">{activity.integration}</span>
                          <span className="text-gray-400 text-xs">{activity.time}</span>
                        </div>
                        <div className="text-gray-300 text-sm">{activity.action}</div>
                        <div className="text-gray-400 text-xs">{activity.details}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>System Health</span>
                </h3>

                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">All Systems Operational</span>
                    </div>
                    <p className="text-gray-300 text-sm">99.2% uptime over the last 30 days. All critical integrations are functioning normally.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">API Response Time</span>
                      <span className="text-green-400">1.2s avg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Error Rate</span>
                      <span className="text-green-400">0.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Failed Requests</span>
                      <span className="text-yellow-400">23 (last 24h)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Data Sync Status</span>
                      <span className="text-green-400">Real-time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}