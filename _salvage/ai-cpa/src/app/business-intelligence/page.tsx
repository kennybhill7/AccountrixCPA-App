'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  Target,
  ArrowLeft,
  Brain,
  TrendingUp,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  DollarSign,
  Users,
  Activity,
  Zap,
  Eye,
  Globe,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function BusinessIntelligencePage() {
  const [activeView, setActiveView] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('3-months');

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleExportInsights = () => {
    // Generate CSV content for business intelligence insights
    const csvHeaders = 'Type,Title,Description,Impact,Timeframe,Confidence\n';
    const csvData = insights.map(insight => {
      return `"${insight.type}","${insight.title}","${insight.description}","${insight.impact}","${insight.timeframe}","${insight.confidence}%"`;
    }).join('\n');

    const kpiHeaders = '\n\nKPI Name,Value,Change,Trend\n';
    const kpiData = kpiMetrics.map(kpi => {
      return `"${kpi.name}","${kpi.value}","${kpi.change}","${kpi.trend}"`;
    }).join('\n');

    const predictionHeaders = '\n\nPrediction Type,Current Value,Predicted Value,Confidence,Period,Insight\n';
    const predictionData = predictionCards.map(card => {
      return `"${card.title}","${card.current}","${card.predicted}","${card.confidence}%","${card.period}","${card.insight}"`;
    }).join('\n');

    const csvContent = csvHeaders + csvData + kpiHeaders + kpiData + predictionHeaders + predictionData;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `business_intelligence_insights_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ Business Intelligence Export Complete!\n\nExported ${insights.length} insights, ${kpiMetrics.length} KPIs, and ${predictionCards.length} predictions to CSV file.\nFile downloaded: business_intelligence_insights_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleRefreshAnalysis = () => {
    alert(`🧠 AI Analysis Refresh Initiated\n\nRefreshing business intelligence analysis...\n• Updating market data\n• Recalculating predictions\n• Analyzing new patterns\n• Generating fresh insights\n\nThis may take a few moments to complete.`);

    // Simulate analysis refresh
    setTimeout(() => {
      alert(`✅ Analysis Refresh Complete!\n\nBusiness intelligence data updated with:\n• Latest market trends\n• Updated predictions (94% confidence)\n• New optimization opportunities\n• Refreshed risk assessments\n\nView your updated insights in the dashboard.`);
    }, 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const predictionCards = [
    {
      title: 'Revenue Forecast',
      current: 2800000,
      predicted: 3240000,
      confidence: 94,
      trend: 'up',
      period: 'Next Quarter',
      insight: 'Strong seasonal patterns and customer growth trajectory indicate significant revenue increase'
    },
    {
      title: 'Cash Flow Projection',
      current: 5700000,
      predicted: 6100000,
      confidence: 89,
      trend: 'up',
      period: 'Next 3 Months',
      insight: 'Positive cash flow trend with improved collection cycles and controlled expenses'
    },
    {
      title: 'Market Expansion',
      current: 125,
      predicted: 180,
      confidence: 87,
      trend: 'up',
      period: 'Next 6 Months',
      insight: 'Geographic expansion and new product lines driving customer acquisition'
    },
    {
      title: 'Cost Optimization',
      current: 1890000,
      predicted: 1760000,
      confidence: 91,
      trend: 'down',
      period: 'Implementation',
      insight: 'AI automation and process improvements identified $130K in potential savings'
    }
  ];

  const kpiMetrics = [
    { name: 'Customer Lifetime Value', value: '$45,200', change: '+18%', trend: 'up' },
    { name: 'Customer Acquisition Cost', value: '$1,850', change: '-12%', trend: 'down' },
    { name: 'Monthly Recurring Revenue', value: '$890K', change: '+24%', trend: 'up' },
    { name: 'Churn Rate', value: '2.3%', change: '-0.8%', trend: 'down' },
    { name: 'Net Promoter Score', value: '73', change: '+9', trend: 'up' },
    { name: 'Revenue per Employee', value: '$285K', change: '+15%', trend: 'up' }
  ];

  const insights = [
    {
      type: 'opportunity',
      title: 'Market Expansion Opportunity',
      description: 'AI analysis identifies 23% revenue growth potential in the Pacific Northwest market segment.',
      impact: 'High',
      timeframe: '6-9 months',
      confidence: 87
    },
    {
      type: 'risk',
      title: 'Customer Concentration Risk',
      description: 'Top 3 customers represent 45% of revenue. Diversification recommended.',
      impact: 'Medium',
      timeframe: 'Immediate',
      confidence: 92
    },
    {
      type: 'efficiency',
      title: 'Process Automation Gains',
      description: 'Additional automation opportunities identified in AP processing and customer onboarding.',
      impact: 'Medium',
      timeframe: '3-4 months',
      confidence: 89
    },
    {
      type: 'trend',
      title: 'Seasonal Revenue Pattern',
      description: 'Q4 consistently shows 28% revenue spike. Prepare inventory and staffing accordingly.',
      impact: 'High',
      timeframe: 'Q4 Planning',
      confidence: 96
    }
  ];

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'risk': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'efficiency': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'trend': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return Target;
      case 'risk': return AlertTriangle;
      case 'efficiency': return Zap;
      case 'trend': return TrendingUp;
      default: return Brain;
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
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Predictive Intelligence</h1>
                <p className="text-gray-400">AI-powered business intelligence and predictive analytics</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="1-month" className="text-black bg-white">Last Month</option>
              <option value="3-months" className="text-black bg-white">Last 3 Months</option>
              <option value="6-months" className="text-black bg-white">Last 6 Months</option>
              <option value="12-months" className="text-black bg-white">Last 12 Months</option>
            </select>
            <button
              onClick={handleExportInsights}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Insights</span>
            </button>
            <button
              onClick={handleRefreshAnalysis}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/10 backdrop-blur-md border-b border-white/10">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'dashboard', name: 'Intelligence Dashboard', icon: BarChart3 },
            { id: 'predictions', name: 'Predictive Models', icon: Target },
            { id: 'insights', name: 'AI Insights', icon: Brain },
            { id: 'analytics', name: 'Advanced Analytics', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeView === tab.id
                  ? 'border-purple-400 text-purple-400'
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
            {/* KPI Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kpiMetrics.map((metric, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">{metric.name}</h3>
                    <div className={`p-2 rounded-lg ${metric.trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      <TrendingUp className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400 rotate-180'}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                  <div className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change} vs previous period
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insights Summary */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>Executive AI Intelligence Summary</span>
                <span className="text-sm text-purple-400 bg-purple-500/20 px-2 py-1 rounded">Real-time</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Strong Growth Trajectory</span>
                    </div>
                    <p className="text-gray-300 text-sm">Revenue growth acceleration detected. 94% confidence in Q1 targets being exceeded by 15-20%.</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Efficiency Optimization</span>
                    </div>
                    <p className="text-gray-300 text-sm">AI automation initiatives showing 23% productivity gains. Additional opportunities identified.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-medium">Market Expansion Ready</span>
                    </div>
                    <p className="text-gray-300 text-sm">Financial metrics and market analysis indicate optimal timing for geographic expansion.</p>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Monitor Customer Concentration</span>
                    </div>
                    <p className="text-gray-300 text-sm">Revenue concentration risk identified. Diversification strategy recommended for Q2.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'predictions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {predictionCards.map((prediction, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{prediction.title}</h3>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{prediction.period}</div>
                      <div className="text-xs text-purple-400">{prediction.confidence}% confidence</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Current:</span>
                      <span className="text-white font-semibold">
                        {prediction.title.includes('Rate') || prediction.title.includes('Optimization')
                          ? prediction.current.toLocaleString()
                          : formatCurrency(prediction.current)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Predicted:</span>
                      <span className={`font-semibold ${prediction.trend === 'up' ? 'text-green-400' : 'text-blue-400'}`}>
                        {prediction.title.includes('Rate') || prediction.title.includes('Optimization')
                          ? prediction.predicted.toLocaleString()
                          : formatCurrency(prediction.predicted)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Change:</span>
                      <span className={`font-semibold ${prediction.trend === 'up' ? 'text-green-400' : 'text-blue-400'}`}>
                        {prediction.trend === 'up' ? '+' : ''}
                        {(((prediction.predicted - prediction.current) / prediction.current) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white/5 rounded-lg">
                    <p className="text-gray-300 text-sm">{prediction.insight}</p>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Confidence Level</span>
                      <span>{prediction.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${prediction.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'insights' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.map((insight, index) => {
                const IconComponent = getInsightIcon(insight.type);
                return (
                  <div key={index} className={`border rounded-2xl p-6 ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{insight.title}</h3>
                        <p className="text-sm opacity-90">{insight.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="opacity-70">Impact</div>
                        <div className="font-semibold">{insight.impact}</div>
                      </div>
                      <div>
                        <div className="opacity-70">Timeframe</div>
                        <div className="font-semibold">{insight.timeframe}</div>
                      </div>
                      <div>
                        <div className="opacity-70">Confidence</div>
                        <div className="font-semibold">{insight.confidence}%</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="w-full bg-white/20 rounded-full h-1">
                        <div
                          className="bg-white h-1 rounded-full"
                          style={{ width: `${insight.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Advanced Analytics Dashboard</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-4">Statistical Models</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Revenue Regression Model</span>
                      <span className="text-green-400">R² = 0.94</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Customer Churn Prediction</span>
                      <span className="text-blue-400">Accuracy: 89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Demand Forecasting</span>
                      <span className="text-purple-400">MAPE: 6.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Price Optimization</span>
                      <span className="text-yellow-400">Active</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-4">Data Quality Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Data Completeness</span>
                      <span className="text-green-400">98.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Data Accuracy</span>
                      <span className="text-green-400">99.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Real-time Processing</span>
                      <span className="text-blue-400">&lt; 2 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Model Refresh Rate</span>
                      <span className="text-purple-400">Hourly</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-4">AI Model Performance</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300 text-sm">Revenue Prediction</span>
                        <span className="text-white text-sm">94%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300 text-sm">Cost Forecasting</span>
                        <span className="text-white text-sm">91%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300 text-sm">Market Analysis</span>
                        <span className="text-white text-sm">87%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300 text-sm">Risk Assessment</span>
                        <span className="text-white text-sm">96%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">Next-Gen AI Features</h4>
                  <p className="text-gray-300 text-sm mb-4">Advanced machine learning models coming soon:</p>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Natural language query interface</li>
                    <li>• Automated insight generation</li>
                    <li>• Predictive scenario modeling</li>
                    <li>• Real-time anomaly detection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}