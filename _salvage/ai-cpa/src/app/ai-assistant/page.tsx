'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  Brain,
  MessageSquare,
  ArrowLeft,
  Zap,
  Target,
  TrendingUp,
  FileText,
  DollarSign,
  Calculator,
  Shield,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Mic,
  MicOff,
  Send,
  Plus,
  Settings,
  Download,
  Upload,
  Eye,
  Edit3,
  Search
} from 'lucide-react';

export default function AIAssistantPage() {
  const [chatMessages, setChatMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    actions?: string[];
  }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'voice' | 'automation'>('chat');

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      role: 'user' as const,
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = processAdvancedAI(currentMessage);
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, Math.random() * 1500 + 1000);
  };

  const processAdvancedAI = (input: string) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('automate') || lowerInput.includes('workflow')) {
      return {
        role: 'assistant' as const,
        content: `🤖 **Workflow Automation Analysis**

I've analyzed your current processes and can automate:

**High-Impact Automations Available:**
• Invoice processing: 95% automation potential
• Expense categorization: 98% accuracy
• Bank reconciliation: 99% automation
• Financial reporting: 100% automated generation
• Compliance monitoring: Real-time alerts

**Recommended Automation Sequence:**
1. Set up automatic invoice data extraction
2. Enable smart expense categorization
3. Configure bank feed reconciliation
4. Implement automated report scheduling
5. Deploy predictive cash flow analysis

**ROI Projection:**
• Time savings: 32 hours/week
• Cost reduction: $186,000/year
• Accuracy improvement: 23%
• Compliance score: 99.2%

Would you like me to implement any of these automations?`,
        timestamp: new Date().toLocaleTimeString(),
        actions: ['Start Invoice Automation', 'Configure Bank Reconciliation', 'Set Up Report Scheduling']
      };
    }

    if (lowerInput.includes('predict') || lowerInput.includes('forecast')) {
      return {
        role: 'assistant' as const,
        content: `📈 **Predictive Financial Analysis**

**13-Week Cash Flow Forecast:**
• Week 1-4: $5.7M → $6.2M (Strong growth)
• Week 5-8: $6.2M → $6.8M (Sustained momentum)
• Week 9-13: $6.8M → $7.3M (Accelerated growth)

**AI Confidence Indicators:**
• Revenue prediction: 94% confidence
• Expense forecast: 97% confidence
• Cash flow timing: 89% confidence

**Predictive Insights:**
• 87% probability of exceeding Q1 targets
• Recommended client payment acceleration in Week 6
• Optimal time for major purchases: Week 8-10
• Risk of cash flow dip: 3% (Week 11)

**Scenario Analysis:**
• Best case: +15% above forecast
• Most likely: +8% above forecast
• Conservative: +3% above forecast

**AI Recommendations:**
1. Accelerate collections for top 5 clients
2. Delay non-critical expenses by 2 weeks
3. Consider line of credit activation in Week 10
4. Schedule quarterly tax payment for Week 9

Shall I create automated alerts for these predictions?`,
        timestamp: new Date().toLocaleTimeString(),
        actions: ['Set Prediction Alerts', 'Generate Scenario Reports', 'Configure Cash Flow Monitoring']
      };
    }

    if (lowerInput.includes('analyze') || lowerInput.includes('insight')) {
      return {
        role: 'assistant' as const,
        content: `🔍 **Deep Financial Analysis**

**Performance Analysis:**
• Revenue growth: +22% YoY
• Expense efficiency: Improved 15%
• Profit margins: +3.2 points
• Working capital: Optimized 18%

**Pattern Recognition:**
• Client payment cycles: 23-day average
• Seasonal revenue peaks: March, June, September
• Expense spikes: Technology renewals in January
• Cash flow patterns: Strong first half, moderate Q4

**Risk Assessment:**
• Credit risk exposure: Low (2.1%)
• Operational risk: Minimal
• Market volatility impact: 5% potential variance
• Regulatory compliance: 99.8% current

**Optimization Opportunities:**
1. Vendor payment optimization: $12K annual savings
2. Tax strategy refinement: $31K potential savings
3. Investment reallocation: +4.2% return potential
4. Process automation: 847 hours/year savings

**Competitive Analysis:**
• Industry position: Top 15%
• Efficiency ranking: 92nd percentile
• Growth trajectory: Above market average
• Financial health score: 94/100

Would you like me to dive deeper into any specific area?`,
        timestamp: new Date().toLocaleTimeString(),
        actions: ['Generate Full Report', 'Set Performance Alerts', 'Schedule Monthly Analysis']
      };
    }

    return {
      role: 'assistant' as const,
      content: `🧠 **Advanced AI Assistant Ready**

I understand you're asking about: "${input}"

**Available AI Capabilities:**
• **Predictive Analytics**: 13-week forecasting with 94% accuracy
• **Process Automation**: Workflow optimization and task automation
• **Risk Analysis**: Real-time monitoring and alert systems
• **Pattern Recognition**: Historical data analysis and insights
• **Natural Language Processing**: Complex query understanding
• **Decision Support**: Strategic recommendations and scenario planning

**Smart Features Active:**
✓ Real-time financial monitoring
✓ Anomaly detection systems
✓ Automated compliance checking
✓ Intelligent expense categorization
✓ Predictive cash flow modeling
✓ Advanced report generation

**Learning Capabilities:**
• Adapting to your business patterns
• Improving accuracy through usage
• Customizing insights to your needs
• Building predictive models

How can I help you leverage AI for your financial operations?`,
      timestamp: new Date().toLocaleTimeString(),
      actions: ['Start AI Onboarding', 'Configure Preferences', 'View AI Capabilities']
    };
  };

  const quickActions = [
    { label: 'Automate Invoice Processing', query: 'How can I automate my invoice processing workflow?' },
    { label: 'Predict Cash Flow', query: 'Generate a 13-week cash flow prediction' },
    { label: 'Analyze Financial Performance', query: 'Provide deep analysis of my financial performance' },
    { label: 'Optimize Expenses', query: 'How can I optimize my expense management?' },
    { label: 'Setup Automation', query: 'What processes can I automate to save time?' },
    { label: 'Risk Assessment', query: 'Analyze financial risks and provide recommendations' }
  ];

  const aiCapabilities = [
    {
      title: 'Predictive Analytics',
      icon: TrendingUp,
      description: 'AI forecasting with 94% accuracy',
      features: ['13-week cash flow predictions', 'Revenue trend analysis', 'Risk probability modeling']
    },
    {
      title: 'Process Automation',
      icon: Zap,
      description: 'Intelligent workflow automation',
      features: ['Invoice processing automation', 'Expense categorization', 'Bank reconciliation']
    },
    {
      title: 'Advanced Analytics',
      icon: Target,
      description: 'Deep financial insights',
      features: ['Pattern recognition', 'Anomaly detection', 'Performance optimization']
    },
    {
      title: 'Decision Support',
      icon: Brain,
      description: 'Strategic AI recommendations',
      features: ['Scenario planning', 'Investment analysis', 'Strategic recommendations']
    }
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
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Accountrix AI Assistant</h1>
                <p className="text-gray-400">Advanced conversational AI for enterprise accounting automation</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <button
              onClick={() => setVoiceActive(!voiceActive)}
              className={`p-3 rounded-lg transition-colors ${
                voiceActive ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'
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

      {/* Mode Selection */}
      <div className="bg-black/10 backdrop-blur-md border-b border-white/10">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'chat', name: 'AI Chat', icon: MessageSquare },
            { id: 'voice', name: 'Voice Assistant', icon: Mic },
            { id: 'automation', name: 'Process Automation', icon: Zap }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id as any)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeMode === mode.id
                  ? 'border-purple-400 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <mode.icon className="w-4 h-4" />
              <span>{mode.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeMode === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span>Advanced AI Conversation</span>
                    <span className="text-sm text-purple-400 bg-purple-500/20 px-2 py-1 rounded">Live</span>
                  </h3>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <h4 className="text-white font-semibold mb-2">Advanced AI Ready</h4>
                      <p className="text-gray-400 text-sm mb-6">Ask me anything about automation, predictions, or financial analysis.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {quickActions.slice(0, 4).map((action, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setInputMessage(action.query);
                              handleSendMessage();
                            }}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left text-sm text-gray-300 transition-colors"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-lg p-4 ${
                            message.role === 'user'
                              ? 'bg-purple-600/20 border border-purple-500/30'
                              : 'bg-white/5 border border-white/10'
                          }`}>
                            <div className="flex items-center space-x-2 mb-2">
                              {message.role === 'assistant' && <Brain className="w-4 h-4 text-purple-400" />}
                              <span className="text-xs text-gray-400">
                                {message.role === 'user' ? 'You' : 'AI Assistant'} • {message.timestamp}
                              </span>
                            </div>
                            <div className="text-white text-sm whitespace-pre-wrap">{message.content}</div>

                            {message.actions && message.actions.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {message.actions.map((action, actionIndex) => (
                                  <button
                                    key={actionIndex}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full transition-colors"
                                  >
                                    {action}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                              <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                              <span className="text-xs text-gray-400">AI is analyzing and processing...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about automation, predictions, analytics..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      disabled={isTyping}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isTyping || !inputMessage.trim()}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Capabilities Panel */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">AI Capabilities</h3>
                <div className="space-y-4">
                  {aiCapabilities.map((capability, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <capability.icon className="w-5 h-5 text-purple-400" />
                        <h4 className="text-white font-semibold">{capability.title}</h4>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{capability.description}</p>
                      <ul className="text-gray-300 text-xs space-y-1">
                        {capability.features.map((feature, featureIndex) => (
                          <li key={featureIndex}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {quickActions.slice(4).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputMessage(action.query);
                        handleSendMessage();
                      }}
                      className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMode === 'automation' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Process Automation Center</span>
                <span className="text-sm text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded">Active</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Invoice Processing',
                    automation: 95,
                    status: 'Active',
                    savings: '32 hours/week',
                    description: 'Automatic data extraction and entry'
                  },
                  {
                    name: 'Bank Reconciliation',
                    automation: 99,
                    status: 'Active',
                    savings: '$186K/year',
                    description: 'Real-time transaction matching'
                  },
                  {
                    name: 'Expense Categorization',
                    automation: 98,
                    status: 'Active',
                    savings: '15 hours/week',
                    description: 'Smart AI categorization'
                  },
                  {
                    name: 'Report Generation',
                    automation: 100,
                    status: 'Active',
                    savings: '8 hours/week',
                    description: 'Automated financial reports'
                  },
                  {
                    name: 'Compliance Monitoring',
                    automation: 87,
                    status: 'Learning',
                    savings: '12 hours/month',
                    description: 'Real-time compliance alerts'
                  },
                  {
                    name: 'Cash Flow Forecasting',
                    automation: 94,
                    status: 'Active',
                    savings: 'Strategic insight',
                    description: '13-week predictive modeling'
                  }
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{item.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Automation</span>
                        <span className="text-white font-semibold">{item.automation}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${item.automation}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-xs text-purple-400">
                      <strong>Savings:</strong> {item.savings}
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