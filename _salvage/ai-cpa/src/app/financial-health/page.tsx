'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Brain,
  Shield,
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  PieChart,
  Zap,
  RefreshCw,
  Calendar,
  Users,
  Building,
  CreditCard,
  Activity,
  Heart,
  ThermometerSun,
  Gauge
} from 'lucide-react';

export default function FinancialHealthPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');
  const [healthScore] = useState(92);
  const [refreshing, setRefreshing] = useState(false);

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const healthMetrics = [
    {
      category: 'Cash Flow Health',
      score: 95,
      status: 'excellent',
      trend: 'up',
      value: '$5.7M',
      change: '+12.5%',
      insights: 'Strong cash position with consistent positive flow',
      recommendations: ['Maintain current collection practices', 'Consider strategic investments']
    },
    {
      category: 'Profitability',
      score: 88,
      status: 'good',
      trend: 'up',
      value: '68.5%',
      change: '+3.2%',
      insights: 'Gross margins improving with operational efficiency gains',
      recommendations: ['Optimize high-cost processes', 'Expand profitable service lines']
    },
    {
      category: 'Liquidity Ratio',
      score: 94,
      status: 'excellent',
      trend: 'up',
      value: '2.4:1',
      change: '+0.3',
      insights: 'Excellent liquidity position above industry benchmarks',
      recommendations: ['Maintain emergency reserves', 'Consider growth investments']
    },
    {
      category: 'Debt Management',
      score: 91,
      status: 'excellent',
      trend: 'up',
      value: '0.23',
      change: '-0.05',
      insights: 'Low debt-to-equity ratio indicates financial stability',
      recommendations: ['Current debt levels optimal', 'Strategic leverage opportunities available']
    },
    {
      category: 'Growth Trajectory',
      score: 89,
      status: 'good',
      trend: 'up',
      value: '+22%',
      change: '+5%',
      insights: 'Revenue growth accelerating above market average',
      recommendations: ['Scale operations efficiently', 'Invest in growth enablers']
    },
    {
      category: 'Operational Efficiency',
      score: 87,
      status: 'good',
      trend: 'up',
      value: '92%',
      change: '+15%',
      insights: 'AI automation driving significant efficiency improvements',
      recommendations: ['Expand automation scope', 'Optimize manual processes']
    }
  ];

  const riskAssessment = [
    { risk: 'Market Volatility', level: 'Low', probability: '15%', impact: 'Medium', mitigation: 'Diversified revenue streams' },
    { risk: 'Credit Risk', level: 'Very Low', probability: '3%', impact: 'Low', mitigation: 'Strong client base with good payment history' },
    { risk: 'Operational Risk', level: 'Low', probability: '8%', impact: 'Medium', mitigation: 'Automated processes with backup systems' },
    { risk: 'Regulatory Changes', level: 'Medium', probability: '25%', impact: 'Medium', mitigation: 'Compliance monitoring and adaptability' },
    { risk: 'Technology Disruption', level: 'Low', probability: '12%', impact: 'High', mitigation: 'Investment in AI and modern systems' }
  ];

  const benchmarks = [
    { metric: 'Industry Cash Ratio', your_value: '2.4:1', industry_avg: '1.8:1', percentile: '85th' },
    { metric: 'Profit Margin', your_value: '68.5%', industry_avg: '45.2%', percentile: '92nd' },
    { metric: 'Growth Rate', your_value: '22%', industry_avg: '8.5%', percentile: '88th' },
    { metric: 'Debt-to-Equity', your_value: '0.23', industry_avg: '0.67', percentile: '95th' },
    { metric: 'ROI', your_value: '18.4%', industry_avg: '12.1%', percentile: '78th' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'very low': return 'text-green-400 bg-green-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
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
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Accountrix Financial Health Monitor</h1>
                <p className="text-gray-400">Real-time AI analysis of your financial well-being and performance</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
            >
              <option value="current" className="text-black bg-white">Current Period</option>
              <option value="quarterly" className="text-black bg-white">Quarterly View</option>
              <option value="annual" className="text-black bg-white">Annual Analysis</option>
              <option value="trends" className="text-black bg-white">Multi-Year Trends</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Health Check</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Health Score */}
      <div className="p-6 pb-0">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-6">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-32 h-32 relative">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="url(#healthGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${healthScore * 3.39} 339`}
                  />
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(healthScore)}`}>{healthScore}</div>
                    <div className="text-xs text-gray-400">Health Score</div>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mt-4 mb-2">Excellent Financial Health</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Your business demonstrates strong financial fundamentals with consistent growth, excellent liquidity,
              and low risk profile. All key indicators are performing above industry benchmarks.
            </p>
          </div>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">{metric.category}</h3>
                <div className="flex items-center space-x-2">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-bold ${getScoreColor(metric.score)}`}>
                    {metric.score}/100
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">{metric.value}</span>
                  <span className={`text-sm font-semibold ${
                    metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getScoreBackground(metric.score)}`}
                    style={{ width: `${metric.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-1">AI Insights:</h4>
                  <p className="text-xs text-gray-400">{metric.insights}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-1">Recommendations:</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {metric.recommendations.map((rec, recIndex) => (
                      <li key={recIndex}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Assessment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Risk Assessment</span>
            </h3>
            <div className="space-y-4">
              {riskAssessment.map((risk, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{risk.risk}</h4>
                    <p className="text-xs text-gray-400">{risk.mitigation}</p>
                  </div>
                  <div className="text-right ml-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk.level)}`}>
                      {risk.level}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{risk.probability} probability</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span>Industry Benchmarks</span>
            </h3>
            <div className="space-y-4">
              {benchmarks.map((benchmark, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{benchmark.metric}</h4>
                    <span className="text-sm text-purple-400 font-semibold">{benchmark.percentile} percentile</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400">Your Value: <strong>{benchmark.your_value}</strong></span>
                    <span className="text-gray-400">Industry: {benchmark.industry_avg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Predictions & Alerts */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>AI Predictions & Health Alerts</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h4 className="text-green-400 font-semibold">Health Forecast</h4>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Financial health expected to improve to 94/100 within next quarter based on current trends.
              </p>
              <div className="text-xs text-green-400">
                <strong>Confidence:</strong> 89% • <strong>Timeline:</strong> 90 days
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h4 className="text-blue-400 font-semibold">Growth Opportunity</h4>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                AI identifies potential for 15% revenue increase through optimization of high-performing segments.
              </p>
              <div className="text-xs text-blue-400">
                <strong>ROI Potential:</strong> $420K • <strong>Timeline:</strong> 6 months
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h4 className="text-yellow-400 font-semibold">Monitoring Alert</h4>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Seasonal cash flow dip predicted for Q4. Recommend preparing credit line activation.
              </p>
              <div className="text-xs text-yellow-400">
                <strong>Impact:</strong> Low • <strong>Action Needed:</strong> 60 days
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <h4 className="text-purple-400 font-semibold mb-2">🤖 AI Health Summary</h4>
            <p className="text-gray-300 text-sm">
              Your financial health is exceptional with strong fundamentals across all key metrics. AI analysis
              indicates sustainable growth trajectory with minimal risks. Continue current strategies while
              exploring identified growth opportunities. Next automated health check scheduled in 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}