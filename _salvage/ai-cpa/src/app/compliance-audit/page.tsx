'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  Shield,
  ArrowLeft,
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  FileText,
  Search,
  Download,
  RefreshCw,
  Calendar,
  Users,
  Building,
  Gavel,
  Target,
  Activity,
  BarChart3,
  Settings,
  Star,
  Zap
} from 'lucide-react';

export default function ComplianceAuditPage() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedFramework, setSelectedFramework] = useState('all');

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const complianceFrameworks = [
    { id: 'sox', name: 'SOX 404', score: 94, status: 'compliant' },
    { id: 'gaap', name: 'US GAAP', score: 98, status: 'compliant' },
    { id: 'ifrs', name: 'IFRS', score: 91, status: 'compliant' },
    { id: 'pcaob', name: 'PCAOB', score: 87, status: 'review' },
    { id: 'coso', name: 'COSO Framework', score: 96, status: 'compliant' },
    { id: 'gdpr', name: 'GDPR', score: 89, status: 'compliant' }
  ];

  const auditFindings = [
    {
      id: 'finding-001',
      severity: 'high',
      category: 'Financial Reporting',
      title: 'Depreciation Schedule Validation',
      description: 'Minor discrepancies found in fixed asset depreciation calculations for Q4',
      impact: 'Material weakness potential',
      status: 'in-progress',
      dueDate: '2024-02-15',
      assignee: 'Sarah Johnson',
      framework: 'SOX 404'
    },
    {
      id: 'finding-002',
      severity: 'medium',
      category: 'Internal Controls',
      title: 'User Access Review',
      description: 'Three terminated employees still have system access after 90 days',
      impact: 'Significant deficiency',
      status: 'open',
      dueDate: '2024-02-10',
      assignee: 'Mike Chen',
      framework: 'SOX 404'
    },
    {
      id: 'finding-003',
      severity: 'low',
      category: 'Documentation',
      title: 'Policy Update Required',
      description: 'Expense reimbursement policy needs annual review and approval',
      impact: 'Control deficiency',
      status: 'resolved',
      dueDate: '2024-01-30',
      assignee: 'Lisa Park',
      framework: 'COSO'
    }
  ];

  const complianceMetrics = [
    { name: 'Overall Compliance Score', value: '94%', change: '+2%', trend: 'up' },
    { name: 'Open Findings', value: '7', change: '-3', trend: 'up' },
    { name: 'Critical Issues', value: '0', change: '0', trend: 'neutral' },
    { name: 'Days to Resolution', value: '12', change: '-4', trend: 'up' },
    { name: 'Control Effectiveness', value: '96%', change: '+1%', trend: 'up' },
    { name: 'Audit Readiness', value: '98%', change: '+3%', trend: 'up' }
  ];

  const controlTests = [
    {
      control: 'Revenue Recognition Controls',
      testDate: '2024-01-15',
      result: 'Passed',
      effectiveness: 98,
      nextTest: '2024-04-15',
      auditor: 'External CPA'
    },
    {
      control: 'Expense Approval Workflow',
      testDate: '2024-01-12',
      result: 'Passed',
      effectiveness: 95,
      nextTest: '2024-04-12',
      auditor: 'Internal Audit'
    },
    {
      control: 'Cash Management Controls',
      testDate: '2024-01-10',
      result: 'Exception',
      effectiveness: 87,
      nextTest: '2024-02-10',
      auditor: 'External CPA'
    },
    {
      control: 'Financial Close Process',
      testDate: '2024-01-08',
      result: 'Passed',
      effectiveness: 92,
      nextTest: '2024-04-08',
      auditor: 'Internal Audit'
    }
  ];

  const regulatoryUpdates = [
    {
      regulation: 'ASC 842 Lease Accounting',
      effectiveDate: '2024-03-01',
      impact: 'High',
      status: 'Implementation Required',
      description: 'New lease accounting standards require updated recognition and measurement'
    },
    {
      regulation: 'FASB ASU 2023-07',
      effectiveDate: '2024-06-15',
      impact: 'Medium',
      status: 'Under Review',
      description: 'Changes to segment reporting disclosure requirements'
    },
    {
      regulation: 'SEC Climate Disclosure',
      effectiveDate: '2024-12-31',
      impact: 'Medium',
      status: 'Monitoring',
      description: 'Enhanced climate-related disclosure requirements for public companies'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-400 bg-green-500/20';
      case 'review': return 'text-yellow-400 bg-yellow-500/20';
      case 'non-compliant': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-400';
    if (score >= 85) return 'text-yellow-400';
    return 'text-red-400';
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
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Compliance & Audit Management</h1>
                <p className="text-gray-400">AI-powered compliance monitoring and audit readiness platform</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <Search className="w-4 h-4" />
              <span>Audit Trail</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Run Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/10 backdrop-blur-md border-b border-white/10">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'overview', name: 'Compliance Overview', icon: BarChart3 },
            { id: 'frameworks', name: 'Frameworks', icon: Building },
            { id: 'findings', name: 'Audit Findings', icon: AlertTriangle },
            { id: 'controls', name: 'Control Testing', icon: Target },
            { id: 'regulatory', name: 'Regulatory Updates', icon: Gavel }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeView === tab.id
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
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Compliance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complianceMetrics.map((metric, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{metric.name}</h3>
                    <div className={`p-1 rounded ${metric.trend === 'up' ? 'bg-green-500/20' : metric.trend === 'down' ? 'bg-red-500/20' : 'bg-gray-500/20'}`}>
                      <Activity className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                    {metric.change} vs last period
                  </div>
                </div>
              ))}
            </div>

            {/* AI Compliance Insights */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Compliance Intelligence</span>
                <span className="text-sm text-purple-400 bg-purple-500/20 px-2 py-1 rounded">Real-time</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Compliance Excellence</span>
                    </div>
                    <p className="text-gray-300 text-sm">94% overall compliance score with continuous improvement trend. All critical controls operating effectively.</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Automated Monitoring</span>
                    </div>
                    <p className="text-gray-300 text-sm">AI continuously monitors 247 control points with 99.7% accuracy. Proactive risk detection enabled.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Upcoming Requirements</span>
                    </div>
                    <p className="text-gray-300 text-sm">3 new regulatory requirements require attention by Q2. Implementation roadmap generated automatically.</p>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-medium">Audit Readiness</span>
                    </div>
                    <p className="text-gray-300 text-sm">98% audit readiness score. Documentation complete and controls tested. Ready for external audit.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Framework Summary */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Compliance Framework Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {complianceFrameworks.map((framework) => (
                  <div key={framework.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{framework.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(framework.status)}`}>
                        {framework.status}
                      </span>
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      <span className={getScoreColor(framework.score)}>{framework.score}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${framework.score >= 95 ? 'bg-green-500' : framework.score >= 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${framework.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'frameworks' && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Compliance Framework Details</h3>

            <div className="space-y-6">
              {complianceFrameworks.map((framework) => (
                <div key={framework.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-emerald-500/20 rounded-lg">
                        <Building className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{framework.name}</h4>
                        <p className="text-gray-400">
                          {framework.id === 'sox' && 'Sarbanes-Oxley Act Section 404 - Internal Controls'}
                          {framework.id === 'gaap' && 'Generally Accepted Accounting Principles'}
                          {framework.id === 'ifrs' && 'International Financial Reporting Standards'}
                          {framework.id === 'pcaob' && 'Public Company Accounting Oversight Board Standards'}
                          {framework.id === 'coso' && 'Committee of Sponsoring Organizations Framework'}
                          {framework.id === 'gdpr' && 'General Data Protection Regulation'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(framework.score)}`}>{framework.score}%</div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(framework.status)}`}>
                        {framework.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Key Requirements</h5>
                      <ul className="text-gray-300 text-sm space-y-1">
                        {framework.id === 'sox' && (
                          <>
                            <li>• Internal control assessment</li>
                            <li>• Management certification</li>
                            <li>• External auditor attestation</li>
                            <li>• Material weakness disclosure</li>
                          </>
                        )}
                        {framework.id === 'gaap' && (
                          <>
                            <li>• Revenue recognition principles</li>
                            <li>• Asset valuation standards</li>
                            <li>• Disclosure requirements</li>
                            <li>• Consistency application</li>
                          </>
                        )}
                        {framework.id === 'ifrs' && (
                          <>
                            <li>• Fair value measurements</li>
                            <li>• Consolidation standards</li>
                            <li>• Impairment testing</li>
                            <li>• First-time adoption</li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Control Areas</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Financial Reporting</span>
                          <span className="text-green-400">98%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Entity Level</span>
                          <span className="text-green-400">95%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">IT Controls</span>
                          <span className="text-yellow-400">87%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Process Level</span>
                          <span className="text-green-400">92%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h5 className="text-white font-semibold mb-2">Recent Activities</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-gray-300">Control testing completed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-gray-300">Documentation updated</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-300">Management review pending</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-gray-300">Remediation in progress</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'findings' && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Audit Findings & Remediation</h3>

            <div className="space-y-4">
              {auditFindings.map((finding) => (
                <div key={finding.id} className={`border rounded-lg p-4 ${getSeverityColor(finding.severity)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{finding.title}</h4>
                        <p className="text-sm opacity-90">{finding.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs opacity-70">
                          <span>Category: {finding.category}</span>
                          <span>Framework: {finding.framework}</span>
                          <span>Impact: {finding.impact}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                        finding.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                        finding.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {finding.status}
                      </div>
                      <div className="text-xs opacity-70">Due: {finding.dueDate}</div>
                      <div className="text-xs opacity-70">Assigned: {finding.assignee}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'controls' && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Control Testing Results</h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Control</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Test Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Effectiveness</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Next Test</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {controlTests.map((test, index) => (
                    <tr key={index} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-white">{test.control}</td>
                      <td className="px-6 py-4 text-gray-300">{test.testDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          test.result === 'Passed' ? 'bg-green-500/20 text-green-400' :
                          test.result === 'Exception' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {test.result}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${getScoreColor(test.effectiveness)}`}>
                            {test.effectiveness}%
                          </span>
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${test.effectiveness >= 95 ? 'bg-green-500' : test.effectiveness >= 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${test.effectiveness}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{test.nextTest}</td>
                      <td className="px-6 py-4 text-gray-300">{test.auditor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'regulatory' && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <Gavel className="w-5 h-5 text-yellow-400" />
              <span>Regulatory Updates & Requirements</span>
            </h3>

            <div className="space-y-6">
              {regulatoryUpdates.map((update, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2">{update.regulation}</h4>
                      <p className="text-gray-300 text-sm mb-3">{update.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                        update.status === 'Implementation Required' ? 'bg-red-500/20 text-red-400' :
                        update.status === 'Under Review' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {update.status}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">Effective Date</span>
                      <div className="text-white font-semibold">{update.effectiveDate}</div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Business Impact</span>
                      <div className={`font-semibold ${
                        update.impact === 'High' ? 'text-red-400' :
                        update.impact === 'Medium' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {update.impact}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Implementation Status</span>
                      <div className="text-white font-semibold">{update.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}