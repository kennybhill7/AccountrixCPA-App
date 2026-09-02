'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  BarChart3,
  ArrowLeft,
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Zap,
  Users,
  Globe,
  Star,
  AlertTriangle,
  CheckCircle,
  Eye,
  RefreshCw,
  Download,
  Building,
  DollarSign,
  Activity,
  Calendar
} from 'lucide-react';

export default function CompetitiveAnalysisPage() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedCompetitor, setSelectedCompetitor] = useState('competitor-1');

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const competitors = [
    {
      id: 'competitor-1',
      name: 'TechSoft Solutions',
      marketShare: 18.5,
      revenue: 125000000,
      employeeCount: 850,
      strengths: ['Strong enterprise sales', 'Established partnerships', 'Global presence'],
      weaknesses: ['Legacy technology', 'Slow innovation cycle', 'High customer churn'],
      threats: ['Aggressive pricing', 'Market expansion', 'Talent acquisition'],
      opportunities: ['Outdated product line', 'Customer satisfaction gaps', 'Technology debt'],
      score: 78
    },
    {
      id: 'competitor-2',
      name: 'InnovateCore',
      marketShare: 14.2,
      revenue: 89000000,
      employeeCount: 420,
      strengths: ['Modern architecture', 'Fast development', 'Good UX design'],
      weaknesses: ['Limited enterprise features', 'Small team', 'Funding constraints'],
      threats: ['Rapid growth', 'VC backing', 'Aggressive hiring'],
      opportunities: ['Scale limitations', 'Support challenges', 'Enterprise gaps'],
      score: 82
    },
    {
      id: 'competitor-3',
      name: 'Enterprise Systems Inc',
      marketShare: 22.1,
      revenue: 187000000,
      employeeCount: 1200,
      strengths: ['Enterprise focus', 'Compliance expertise', 'Industry partnerships'],
      weaknesses: ['Expensive pricing', 'Complex implementation', 'Poor user experience'],
      threats: ['Market dominance', 'Deep pockets', 'Acquisition ability'],
      opportunities: ['Price sensitivity', 'User experience gaps', 'Agility limitations'],
      score: 74
    }
  ];

  const marketMetrics = [
    { name: 'Market Share', value: '12.8%', change: '+2.3%', trend: 'up', target: '15%' },
    { name: 'Brand Recognition', value: '67%', change: '+12%', trend: 'up', target: '75%' },
    { name: 'Customer Satisfaction', value: '4.7/5', change: '+0.3', trend: 'up', target: '4.8/5' },
    { name: 'Price Competitiveness', value: '85%', change: '+5%', trend: 'up', target: '90%' },
    { name: 'Feature Parity', value: '91%', change: '+8%', trend: 'up', target: '95%' },
    { name: 'Market Growth Rate', value: '24%', change: '+3%', trend: 'up', target: '25%' }
  ];

  const threatAnalysis = [
    {
      threat: 'Price War Initiation',
      probability: 'High',
      impact: 'High',
      timeframe: '3-6 months',
      mitigation: 'Value differentiation strategy',
      status: 'monitoring'
    },
    {
      threat: 'Key Personnel Poaching',
      probability: 'Medium',
      impact: 'Medium',
      timeframe: 'Ongoing',
      mitigation: 'Retention program enhancement',
      status: 'active'
    },
    {
      threat: 'Patent Infringement Claims',
      probability: 'Low',
      impact: 'High',
      timeframe: '12+ months',
      mitigation: 'IP portfolio strengthening',
      status: 'prepared'
    },
    {
      threat: 'Market Consolidation',
      probability: 'Medium',
      impact: 'High',
      timeframe: '6-12 months',
      mitigation: 'Strategic partnership development',
      status: 'planning'
    }
  ];

  const opportunities = [
    {
      opportunity: 'AI Integration Gap',
      description: 'Competitors lack advanced AI capabilities in financial analysis',
      potential: 'High',
      effort: 'Medium',
      timeframe: '6-9 months',
      recommendation: 'Accelerate AI feature development'
    },
    {
      opportunity: 'SMB Market Underserved',
      description: 'Most competitors focus on enterprise, leaving SMB gap',
      potential: 'High',
      effort: 'Low',
      timeframe: '3-6 months',
      recommendation: 'Launch SMB-focused product tier'
    },
    {
      opportunity: 'Mobile Experience Deficiency',
      description: 'Industry-wide weakness in mobile user experience',
      potential: 'Medium',
      effort: 'High',
      timeframe: '9-12 months',
      recommendation: 'Mobile-first redesign initiative'
    },
    {
      opportunity: 'Integration Ecosystem',
      description: 'Limited third-party integrations across competitors',
      potential: 'Medium',
      effort: 'Medium',
      timeframe: '6-12 months',
      recommendation: 'Marketplace and API platform'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400 bg-green-500/20';
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
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
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Competitive Intelligence</h1>
                <p className="text-gray-400">AI-powered competitive analysis and market positioning</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Analysis</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Update Intelligence</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/10 backdrop-blur-md border-b border-white/10">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'overview', name: 'Market Overview', icon: Globe },
            { id: 'competitors', name: 'Competitor Profiles', icon: Building },
            { id: 'threats', name: 'Threat Analysis', icon: AlertTriangle },
            { id: 'opportunities', name: 'Market Opportunities', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeView === tab.id
                  ? 'border-orange-400 text-orange-400'
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
            {/* Market Position */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Target className="w-5 h-5 text-orange-400" />
                <span>Market Position & Performance</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketMetrics.map((metric, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{metric.name}</h4>
                      <div className={`p-1 rounded ${metric.trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="flex justify-between text-sm">
                      <span className={metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                        {metric.change} vs last quarter
                      </span>
                      <span className="text-gray-400">Target: {metric.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Landscape */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Competitive Landscape</h3>
                <div className="space-y-4">
                  {competitors.map((competitor) => (
                    <div key={competitor.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{competitor.name}</h4>
                          <p className="text-gray-400 text-sm">{competitor.marketShare}% market share</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(competitor.score)}`}>
                          Threat Score: {competitor.score}
                        </div>
                        <div className="text-gray-400 text-sm mt-1">{formatCurrency(competitor.revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span>AI Market Intelligence</span>
                </h3>

                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Competitive Advantage</span>
                    </div>
                    <p className="text-gray-300 text-sm">Superior AI capabilities provide 18-month lead over nearest competitor in automated financial analysis.</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Market Positioning</span>
                    </div>
                    <p className="text-gray-300 text-sm">Strong position in mid-market segment with growing enterprise penetration. Price-performance leadership established.</p>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Emerging Threats</span>
                    </div>
                    <p className="text-gray-300 text-sm">Well-funded startup with similar AI approach raised $50M Series B. Monitor for aggressive market entry.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'competitors' && (
          <div className="space-y-6">
            {/* Competitor Selection */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Detailed Competitor Analysis</h3>
                <select
                  value={selectedCompetitor}
                  onChange={(e) => setSelectedCompetitor(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-orange-500"
                >
                  {competitors.map((competitor) => (
                    <option key={competitor.id} value={competitor.id} className="text-black bg-white">
                      {competitor.name}
                    </option>
                  ))}
                </select>
              </div>

              {competitors
                .filter(comp => comp.id === selectedCompetitor)
                .map(competitor => (
                  <div key={competitor.id} className="space-y-6">
                    {/* Competitor Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Market Share</h4>
                        <div className="text-2xl font-bold text-white">{competitor.marketShare}%</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Revenue</h4>
                        <div className="text-2xl font-bold text-white">{formatCurrency(competitor.revenue)}</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Employees</h4>
                        <div className="text-2xl font-bold text-white">{competitor.employeeCount.toLocaleString()}</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Threat Score</h4>
                        <div className={`text-2xl font-bold ${competitor.score >= 80 ? 'text-red-400' : competitor.score >= 70 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {competitor.score}/100
                        </div>
                      </div>
                    </div>

                    {/* SWOT Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                          <h4 className="text-green-400 font-semibold mb-3 flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Strengths</span>
                          </h4>
                          <ul className="space-y-2">
                            {competitor.strengths.map((strength, index) => (
                              <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                          <h4 className="text-red-400 font-semibold mb-3 flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Threats</span>
                          </h4>
                          <ul className="space-y-2">
                            {competitor.threats.map((threat, index) => (
                              <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                                <span className="text-red-400 mt-1">•</span>
                                <span>{threat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                          <h4 className="text-yellow-400 font-semibold mb-3 flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span>Weaknesses</span>
                          </h4>
                          <ul className="space-y-2">
                            {competitor.weaknesses.map((weakness, index) => (
                              <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                                <span className="text-yellow-400 mt-1">•</span>
                                <span>{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                          <h4 className="text-blue-400 font-semibold mb-3 flex items-center space-x-2">
                            <Target className="w-4 h-4" />
                            <span>Opportunities</span>
                          </h4>
                          <ul className="space-y-2">
                            {competitor.opportunities.map((opportunity, index) => (
                              <li key={index} className="text-gray-300 text-sm flex items-start space-x-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span>{opportunity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeView === 'threats' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>Threat Assessment Matrix</span>
              </h3>

              <div className="space-y-4">
                {threatAnalysis.map((threat, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-white font-semibold mb-1">{threat.threat}</h4>
                        <p className="text-gray-400 text-sm">Mitigation: {threat.mitigation}</p>
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        threat.status === 'active' ? 'bg-red-500/20 text-red-400' :
                        threat.status === 'monitoring' ? 'bg-yellow-500/20 text-yellow-400' :
                        threat.status === 'planning' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {threat.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wider">Probability</span>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getProbabilityColor(threat.probability)}`}>
                          {threat.probability}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wider">Impact</span>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getProbabilityColor(threat.impact)}`}>
                          {threat.impact}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wider">Timeframe</span>
                        <div className="text-white text-sm mt-1">{threat.timeframe}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'opportunities' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span>Strategic Market Opportunities</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {opportunities.map((opportunity, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-white font-semibold">{opportunity.opportunity}</h4>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        opportunity.potential === 'High' ? 'bg-green-500/20 text-green-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {opportunity.potential} Potential
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{opportunity.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wider">Effort Required</span>
                        <div className="text-white text-sm mt-1">{opportunity.effort}</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wider">Timeframe</span>
                        <div className="text-white text-sm mt-1">{opportunity.timeframe}</div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <span className="text-blue-400 font-medium text-sm">Recommendation:</span>
                      <p className="text-gray-300 text-sm mt-1">{opportunity.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}