'use client';

import React, { useState, useEffect } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  Brain,
  ArrowLeft,
  Zap,
  CheckCircle,
  Clock,
  RefreshCw,
  Activity,
  Settings,
  Play,
  Pause,
  BarChart3,
  FileText,
  DollarSign,
  CreditCard,
  Receipt,
  AlertTriangle,
  TrendingUp,
  Shield,
  Cpu,
  Database,
  Network,
  Target,
  Award
} from 'lucide-react';

interface AutomationTask {
  id: string;
  name: string;
  type: 'processing' | 'analysis' | 'reconciliation' | 'reporting';
  status: 'running' | 'completed' | 'scheduled' | 'paused';
  progress: number;
  eta: string;
  lastRun: string;
  frequency: string;
  efficiency: number;
  savings: string;
}

export default function AutonomousAIPage() {
  const [systemStatus, setSystemStatus] = useState<'active' | 'paused' | 'maintenance'>('active');
  const [automationLevel, setAutomationLevel] = useState(95);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const [automationTasks] = useState<AutomationTask[]>([
    {
      id: 'inv_process',
      name: 'Invoice Processing & Data Extraction',
      type: 'processing',
      status: 'running',
      progress: 78,
      eta: '12 minutes',
      lastRun: '2 minutes ago',
      frequency: 'Continuous',
      efficiency: 98.5,
      savings: '$45K/year'
    },
    {
      id: 'bank_recon',
      name: 'Bank Reconciliation Automation',
      type: 'reconciliation',
      status: 'completed',
      progress: 100,
      eta: 'Complete',
      lastRun: '15 minutes ago',
      frequency: 'Real-time',
      efficiency: 99.2,
      savings: '$32K/year'
    },
    {
      id: 'expense_cat',
      name: 'Expense Categorization & Analysis',
      type: 'analysis',
      status: 'running',
      progress: 92,
      eta: '3 minutes',
      lastRun: '1 minute ago',
      frequency: 'Real-time',
      efficiency: 96.8,
      savings: '$28K/year'
    },
    {
      id: 'report_gen',
      name: 'Financial Report Generation',
      type: 'reporting',
      status: 'scheduled',
      progress: 0,
      eta: '6:00 AM tomorrow',
      lastRun: '1 day ago',
      frequency: 'Daily',
      efficiency: 100,
      savings: '$18K/year'
    },
    {
      id: 'compliance',
      name: 'Compliance Monitoring & Alerts',
      type: 'analysis',
      status: 'running',
      progress: 100,
      eta: 'Continuous',
      lastRun: 'Real-time',
      frequency: 'Continuous',
      efficiency: 94.3,
      savings: '$22K/year'
    },
    {
      id: 'forecast',
      name: 'Predictive Cash Flow Analysis',
      type: 'analysis',
      status: 'completed',
      progress: 100,
      eta: 'Complete',
      lastRun: '30 minutes ago',
      frequency: 'Hourly',
      efficiency: 87.6,
      savings: '$65K/year'
    }
  ]);

  const performanceMetrics = {
    tasksCompleted: 12847,
    hoursAutomated: 2156,
    accuracyRate: 97.8,
    costSavings: 186000,
    errorReduction: 89.4,
    speedImprovement: 94.7
  };

  const aiCapabilities = [
    {
      title: 'Document Processing',
      icon: FileText,
      automation: 98,
      description: 'Intelligent extraction and processing of financial documents',
      features: ['OCR with 99.2% accuracy', 'Smart categorization', 'Duplicate detection', 'Data validation'],
      status: 'Active'
    },
    {
      title: 'Financial Analysis',
      icon: BarChart3,
      automation: 95,
      description: 'Real-time analysis and insights generation',
      features: ['Trend analysis', 'Anomaly detection', 'Performance metrics', 'Predictive modeling'],
      status: 'Active'
    },
    {
      title: 'Reconciliation Engine',
      icon: CheckCircle,
      automation: 99,
      description: 'Automated matching and reconciliation processes',
      features: ['Bank reconciliation', 'Account matching', 'Exception handling', 'Variance analysis'],
      status: 'Active'
    },
    {
      title: 'Compliance Monitoring',
      icon: Shield,
      automation: 94,
      description: 'Continuous monitoring of regulatory compliance',
      features: ['Rule-based checking', 'Alert systems', 'Audit trails', 'Regulatory updates'],
      status: 'Active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      case 'scheduled': return 'text-yellow-400 bg-yellow-500/20';
      case 'paused': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'processing': return <FileText className="w-4 h-4" />;
      case 'analysis': return <BarChart3 className="w-4 h-4" />;
      case 'reconciliation': return <CheckCircle className="w-4 h-4" />;
      case 'reporting': return <Receipt className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  const toggleSystemStatus = () => {
    setSystemStatus(prev => prev === 'active' ? 'paused' : 'active');
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
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Autonomous AI Accountant</h1>
                <p className="text-gray-400">95% automated accounting operations with intelligent decision-making</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <div className="flex items-center space-x-2 text-white">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{currentTime.toLocaleTimeString()}</span>
            </div>
            <button
              onClick={toggleSystemStatus}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                systemStatus === 'active'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {systemStatus === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{systemStatus === 'active' ? 'Pause AI' : 'Activate AI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status Dashboard */}
      <div className="p-6 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-purple-400">{automationLevel}%</span>
            </div>
            <h3 className="text-white font-semibold">Automation Level</h3>
            <p className="text-gray-400 text-sm">Tasks automated</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-400">{performanceMetrics.tasksCompleted.toLocaleString()}</span>
            </div>
            <h3 className="text-white font-semibold">Tasks Completed</h3>
            <p className="text-gray-400 text-sm">Since deployment</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-400">${performanceMetrics.costSavings.toLocaleString()}</span>
            </div>
            <h3 className="text-white font-semibold">Annual Savings</h3>
            <p className="text-gray-400 text-sm">Cost reduction</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Target className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-yellow-400">{performanceMetrics.accuracyRate}%</span>
            </div>
            <h3 className="text-white font-semibold">Accuracy Rate</h3>
            <p className="text-gray-400 text-sm">AI precision</p>
          </div>
        </div>
      </div>

      {/* Active Automation Tasks */}
      <div className="px-6 pb-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Active Automation Tasks</span>
            <span className={`text-sm px-2 py-1 rounded ${
              systemStatus === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {systemStatus === 'active' ? 'Running' : 'Paused'}
            </span>
          </h3>

          <div className="space-y-4">
            {automationTasks.map((task) => (
              <div key={task.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      {getTypeIcon(task.type)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{task.name}</h4>
                      <p className="text-gray-400 text-sm">
                        {task.frequency} • Efficiency: {task.efficiency}% • Savings: {task.savings}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <p className="text-gray-400 text-sm mt-1">Last: {task.lastRun}</p>
                  </div>
                </div>

                {task.status === 'running' && task.progress < 100 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Progress</span>
                      <span className="text-white">{task.progress}% • ETA: {task.eta}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {task.status === 'scheduled' && (
                  <div className="text-sm text-yellow-400">
                    <strong>Next run:</strong> {task.eta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {aiCapabilities.map((capability, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <capability.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{capability.title}</h4>
                    <p className="text-gray-400 text-sm">{capability.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-purple-400 font-bold text-lg">{capability.automation}%</span>
                  <p className="text-xs text-gray-400">Automated</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${capability.automation}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-white font-medium text-sm">Key Features:</h5>
                <ul className="text-gray-300 text-xs space-y-1">
                  {capability.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Analytics */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span>AI Performance Analytics</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h4 className="text-green-400 font-semibold">Efficiency Gains</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Speed Improvement:</span>
                  <span className="text-white font-semibold">{performanceMetrics.speedImprovement}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Error Reduction:</span>
                  <span className="text-white font-semibold">{performanceMetrics.errorReduction}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Hours Automated:</span>
                  <span className="text-white font-semibold">{performanceMetrics.hoursAutomated.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Database className="w-5 h-5 text-blue-400" />
                <h4 className="text-blue-400 font-semibold">Learning Progress</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Pattern Recognition:</span>
                  <span className="text-white font-semibold">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Decision Accuracy:</span>
                  <span className="text-white font-semibold">96.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Model Updates:</span>
                  <span className="text-white font-semibold">147</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Network className="w-5 h-5 text-purple-400" />
                <h4 className="text-purple-400 font-semibold">System Health</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Uptime:</span>
                  <span className="text-white font-semibold">99.97%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Response Time:</span>
                  <span className="text-white font-semibold">0.23s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Load Capacity:</span>
                  <span className="text-white font-semibold">23%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <h4 className="text-yellow-400 font-semibold mb-2">🤖 AI System Status</h4>
            <p className="text-gray-300 text-sm">
              Autonomous AI Accountant is operating at peak efficiency with 95% task automation. The system has
              processed {performanceMetrics.tasksCompleted.toLocaleString()} tasks, saving ${performanceMetrics.costSavings.toLocaleString()} annually.
              All AI modules are functioning optimally with continuous learning and improvement cycles active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}