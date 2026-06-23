'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  Smartphone,
  ArrowLeft,
  Brain,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Users,
  Target,
  Shield,
  Zap,
  Clock,
  Eye,
  RefreshCw,
  Download,
  Bell,
  MessageSquare,
  Calendar,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
  Globe,
  Building
} from 'lucide-react';

export default function MobileExecutivePage() {
  const [activeView, setActiveView] = useState('dashboard');
  const [timeframe, setTimeframe] = useState('today');

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const executiveMetrics = [
    {
      title: 'Revenue',
      value: 2840000,
      change: 15.8,
      trend: 'up',
      icon: DollarSign,
      subtitle: 'Monthly recurring',
      color: 'green'
    },
    {
      title: 'Cash Position',
      value: 5700000,
      change: 8.2,
      trend: 'up',
      icon: Shield,
      subtitle: '36 month runway',
      color: 'blue'
    },
    {
      title: 'Active Customers',
      value: 12847,
      change: 23.4,
      trend: 'up',
      icon: Users,
      subtitle: 'Paying subscribers',
      color: 'purple'
    },
    {
      title: 'Burn Rate',
      value: 158000,
      change: -12.3,
      trend: 'up',
      icon: TrendingDown,
      subtitle: 'Monthly expenses',
      color: 'orange'
    }
  ];

  const alerts = [
    {
      type: 'critical',
      title: 'Q1 Revenue Target',
      message: 'On track to exceed Q1 revenue target by 18%',
      time: '2 hours ago',
      action: 'View Details'
    },
    {
      type: 'warning',
      title: 'Customer Churn Alert',
      message: '3 enterprise accounts at risk - intervention needed',
      time: '4 hours ago',
      action: 'Contact Sales'
    },
    {
      type: 'info',
      title: 'Market Opportunity',
      message: 'New geographic expansion opportunity identified',
      time: '6 hours ago',
      action: 'Review Analysis'
    },
    {
      type: 'success',
      title: 'Automation Milestone',
      message: 'AI automation achieved 94% processing accuracy',
      time: '1 day ago',
      action: 'View Report'
    }
  ];

  const quickActions = [
    { name: 'Approve Expenses', count: 12, icon: FileText, color: 'bg-blue-500' },
    { name: 'Review Contracts', count: 3, icon: Building, color: 'bg-purple-500' },
    { name: 'Team Messages', count: 8, icon: MessageSquare, color: 'bg-green-500' },
    { name: 'Schedule Review', count: 2, icon: Calendar, color: 'bg-orange-500' }
  ];

  const insights = [
    {
      title: 'Revenue Acceleration',
      description: 'MRR growth rate increased 34% this quarter',
      impact: 'High',
      confidence: 94,
      timeframe: 'Current Quarter'
    },
    {
      title: 'Cost Optimization',
      description: 'AI automation reduced operational costs by $42K/month',
      impact: 'Medium',
      confidence: 91,
      timeframe: 'Last 90 Days'
    },
    {
      title: 'Market Expansion',
      description: 'Pacific Northwest showing 67% higher conversion rates',
      impact: 'High',
      confidence: 87,
      timeframe: 'Market Analysis'
    },
    {
      title: 'Customer Satisfaction',
      description: 'NPS score improved to 73 (+12 points YoY)',
      impact: 'Medium',
      confidence: 96,
      timeframe: 'Customer Survey'
    }
  ];

  const recentActivity = [
    { action: 'Board deck generated for Q1 review', time: '1 hour ago', type: 'report' },
    { action: 'Enterprise contract approved: $240K ARR', time: '3 hours ago', type: 'revenue' },
    { action: 'Team performance review completed', time: '5 hours ago', type: 'team' },
    { action: 'Competitive analysis updated', time: '8 hours ago', type: 'analysis' },
    { action: 'Cash flow forecast refreshed', time: '12 hours ago', type: 'finance' }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500/30 bg-red-500/10 text-red-400';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'info': return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
      case 'success': return 'border-green-500/30 bg-green-500/10 text-green-400';
      default: return 'border-gray-500/30 bg-gray-500/10 text-gray-400';
    }
  };

  const getMetricColor = (color: string) => {
    switch (color) {
      case 'green': return 'from-green-500 to-emerald-500';
      case 'blue': return 'from-blue-500 to-cyan-500';
      case 'purple': return 'from-purple-500 to-pink-500';
      case 'orange': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

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
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mobile Executive Dashboard</h1>
                <p className="text-gray-400">AI-powered executive insights and mobile command center</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="today" className="text-black bg-white">Today</option>
              <option value="week" className="text-black bg-white">This Week</option>
              <option value="month" className="text-black bg-white">This Month</option>
              <option value="quarter" className="text-black bg-white">This Quarter</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/10 backdrop-blur-md border-b border-white/10">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'dashboard', name: 'Executive Dashboard', icon: BarChart3 },
            { id: 'insights', name: 'AI Insights', icon: Brain },
            { id: 'alerts', name: 'Smart Alerts', icon: Bell },
            { id: 'mobile', name: 'Mobile Features', icon: Smartphone }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeView === tab.id
                  ? 'border-indigo-400 text-indigo-400'
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
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Executive Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {executiveMetrics.map((metric, index) => {
                const MetricIcon = metric.icon;
                return (
                  <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${getMetricColor(metric.color)} rounded-lg bg-opacity-20`}>
                        <MetricIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`p-1 rounded ${metric.trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {metric.title.includes('Revenue') || metric.title.includes('Cash') || metric.title.includes('Burn')
                        ? formatCurrency(metric.value)
                        : metric.value.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm mb-2">{metric.subtitle}</div>
                    <div className={`text-sm ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}% vs last period
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const ActionIcon = action.icon;
                    return (
                      <div key={index} className="relative bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                          <ActionIcon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-white font-medium text-sm">{action.name}</h4>
                        {action.count > 0 && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{action.count}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-white text-sm">{activity.action}</div>
                        <div className="text-gray-400 text-xs">{activity.time}</div>
                      </div>
                      <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                        <Activity className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI-Powered Executive Insights</span>
                <span className="text-sm text-purple-400 bg-purple-500/20 px-2 py-1 rounded">Live Analysis</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {insights.map((insight, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-white font-semibold">{insight.title}</h4>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        insight.impact === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {insight.impact} Impact
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{insight.description}</p>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Confidence</span>
                        <span className="text-white text-sm">{insight.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${insight.confidence}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Analysis Period</span>
                        <span className="text-gray-300 text-sm">{insight.timeframe}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Predictive Analytics */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Predictive Analytics Summary</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">Revenue Forecast</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">$3.2M</div>
                  <div className="text-green-400 text-sm">+18% projected growth</div>
                  <div className="text-gray-400 text-xs mt-1">Next quarter prediction</div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-medium">Customer Growth</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">15,200</div>
                  <div className="text-blue-400 text-sm">+28% customer base</div>
                  <div className="text-gray-400 text-xs mt-1">6-month projection</div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 font-medium">Efficiency Gains</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">34%</div>
                  <div className="text-purple-400 text-sm">Cost reduction potential</div>
                  <div className="text-gray-400 text-xs mt-1">AI automation impact</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'alerts' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Bell className="w-5 h-5 text-orange-400" />
                <span>Smart Executive Alerts</span>
                <span className="text-sm text-orange-400 bg-orange-500/20 px-2 py-1 rounded">Real-time</span>
              </h3>

              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {alert.type === 'critical' && <AlertTriangle className="w-4 h-4" />}
                        {alert.type === 'warning' && <Clock className="w-4 h-4" />}
                        {alert.type === 'info' && <Eye className="w-4 h-4" />}
                        {alert.type === 'success' && <CheckCircle className="w-4 h-4" />}
                        <h4 className="font-semibold">{alert.title}</h4>
                      </div>
                      <span className="text-xs opacity-70">{alert.time}</span>
                    </div>
                    <p className="text-sm opacity-90 mb-3">{alert.message}</p>
                    <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors">
                      {alert.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'mobile' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <span>Mobile Executive Features</span>
                <span className="text-sm text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded">Touch Optimized</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Voice Commands',
                    description: 'Control your dashboard with voice commands',
                    features: ['Financial queries', 'Report generation', 'Data navigation', 'Quick actions'],
                    icon: MessageSquare,
                    status: 'Available'
                  },
                  {
                    title: 'Push Notifications',
                    description: 'Real-time alerts for critical business events',
                    features: ['Revenue milestones', 'Risk alerts', 'Team updates', 'Market changes'],
                    icon: Bell,
                    status: 'Active'
                  },
                  {
                    title: 'Offline Mode',
                    description: 'Access key metrics without internet connection',
                    features: ['Cached reports', 'Local storage', 'Sync when online', 'Emergency access'],
                    icon: Shield,
                    status: 'Beta'
                  },
                  {
                    title: 'Gesture Navigation',
                    description: 'Intuitive touch gestures for mobile navigation',
                    features: ['Swipe actions', 'Pinch to zoom', 'Long press menus', 'Shake to refresh'],
                    icon: Activity,
                    status: 'Available'
                  },
                  {
                    title: 'Smart Widgets',
                    description: 'Customizable home screen widgets',
                    features: ['KPI summary', 'Alert counter', 'Quick metrics', 'Action shortcuts'],
                    icon: BarChart3,
                    status: 'Coming Soon'
                  },
                  {
                    title: 'Biometric Security',
                    description: 'Secure access with fingerprint or face recognition',
                    features: ['TouchID/FaceID', 'Secure storage', 'Auto-lock', 'Privacy protection'],
                    icon: Shield,
                    status: 'Available'
                  }
                ].map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-cyan-500/20 rounded-lg">
                            <FeatureIcon className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{feature.title}</h4>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              feature.status === 'Available' ? 'bg-green-500/20 text-green-400' :
                              feature.status === 'Active' ? 'bg-blue-500/20 text-blue-400' :
                              feature.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {feature.status}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-4">{feature.description}</p>

                      <div className="space-y-2">
                        <h5 className="text-white font-medium text-sm">Features:</h5>
                        <ul className="space-y-1">
                          {feature.features.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-gray-300 text-sm flex items-center space-x-2">
                              <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}