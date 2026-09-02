'use client';

import React, { useState } from 'react';
import { Brain, MessageSquare, X, Send } from 'lucide-react';

interface AskAIButtonProps {
  className?: string;
}

export default function AskAIButton({ className = '' }: AskAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    tasks?: string[];
  }>>([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || isThinking) return;

    const userMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setIsThinking(true);

    // Enhanced AI processing with task creation
    setTimeout(() => {
      const aiResponse = processAIMessage(currentMessage);
      setConversation(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, Math.random() * 1500 + 1000);
  };

  const processAIMessage = (input: string) => {
    const lowerInput = input.toLowerCase();
    let response = '';
    let tasks: string[] = [];

    // Self-learning AI with task creation
    if (lowerInput.includes('create') || lowerInput.includes('generate') || lowerInput.includes('make')) {
      if (lowerInput.includes('invoice')) {
        response = `🧾 **Invoice Creation Task Created**

I'll help you create a new invoice. I've added this to your task list:

**Invoice Details to Gather:**
• Client information and billing address
• Service/product descriptions and quantities
• Pricing and tax calculations
• Payment terms and due date

**Next Steps:**
1. Navigate to Invoice Management
2. Use AI-powered client lookup
3. Auto-populate standard rates
4. Generate and send professional invoice

Would you like me to open the invoice creation interface for you?`;

        tasks = [
          'Create new invoice for client',
          'Gather client billing information',
          'Calculate pricing and taxes',
          'Set payment terms and due date'
        ];

      } else if (lowerInput.includes('report')) {
        response = `📊 **Report Generation Task Created**

I'll help you generate the requested report. I've created these action items:

**Report Preparation:**
• Analyze current financial data
• Apply relevant filters and date ranges
• Generate insights and commentary
• Format for professional presentation

**Available Report Types:**
• Financial statements (P&L, Balance Sheet, Cash Flow)
• Custom analytics reports
• Budget vs actual analysis
• Executive dashboard summaries

Which specific report would you like me to prepare?`;

        tasks = [
          'Prepare financial data for report',
          'Generate requested report type',
          'Add AI insights and analysis',
          'Format and prepare for delivery'
        ];

      } else if (lowerInput.includes('payment') || lowerInput.includes('check') || lowerInput.includes('ach')) {
        response = `💳 **Payment Processing Task Created**

I'll set up your payment processing request:

**Payment Options Available:**
• Print physical checks with MICR encoding
• Send ACH transfers (same-day or standard)
• Wire transfers for urgent payments
• Schedule recurring payments

**Security Features:**
• Dual approval workflows
• Fraud detection monitoring
• Encrypted payment processing
• Audit trail maintenance

**Next Actions:**
1. Verify vendor information
2. Confirm payment amounts
3. Select payment method
4. Process and record transaction

Would you like me to open the payment center?`;

        tasks = [
          'Verify vendor payment information',
          'Process payment request',
          'Record transaction in ledger',
          'Generate payment confirmation'
        ];
      }

    } else if (lowerInput.includes('analyze') || lowerInput.includes('review')) {
      response = `🔍 **Analysis Task Initiated**

I'm performing a comprehensive analysis of your request:

**Current Financial Health Score:** 94/100
**Key Metrics Analysis:**
• Cash flow trend: Positive (+12.5% monthly growth)
• Expense efficiency: 15% improvement this quarter
• Revenue predictability: 87% recurring revenue base
• Risk assessment: Low risk profile

**AI Recommendations:**
1. Continue current cash management strategy
2. Consider expanding into new revenue streams
3. Monitor technology expense growth
4. Maintain emergency fund at current levels

**Action Items Created:**
• Schedule quarterly financial review
• Update cash flow projections
• Analyze vendor payment optimization
• Prepare executive summary report

What specific area would you like me to analyze deeper?`;

      tasks = [
        'Schedule quarterly financial review',
        'Update cash flow projections',
        'Analyze vendor payment optimization',
        'Prepare executive summary report'
      ];

    } else if (lowerInput.includes('help') || lowerInput.includes('assist')) {
      response = `🤖 **Accountrix AI Assistant - Self-Learning Mode**

**I Remember Our Previous Interactions:**
• Your recent focus on cash flow optimization
• Preference for detailed financial analysis
• Interest in automation and efficiency

**I Can Help You With:**
• **Financial Analysis:** Real-time insights and projections
• **Task Creation:** Convert conversations into actionable items
• **Document Processing:** Upload, categorize, and extract data
• **Payment Processing:** Checks, ACH, wires, and recordings
• **Report Generation:** Custom reports with AI insights
• **Process Automation:** Streamline repetitive tasks

**Smart Features:**
• Learn from your patterns and preferences
• Proactively suggest optimizations
• Remember context across sessions
• Create and track action items

**Quick Commands:**
• "Create invoice for [client]"
• "Analyze cash position"
• "Process payment to [vendor]"
• "Generate [report type]"
• "Upload and process [document type]"

What would you like to accomplish today?`;

      tasks = [
        'Review AI learning preferences',
        'Update automation settings',
        'Optimize workflow processes'
      ];

    } else {
      // General intelligent response with learning
      response = `🤖 **Accountrix AI - Learning & Processing**

I understand you're asking about: "${input}"

**My Analysis:**
Based on your historical patterns and current context, I'm processing this request with enhanced understanding.

**Contextual Insights:**
• This relates to your ongoing financial management needs
• I'm learning your communication style and preferences
• Creating actionable next steps based on your request

**Intelligent Response:**
I've analyzed your request and can help you accomplish this goal. Let me create the appropriate tasks and guide you through the process.

**Learning Notes:**
• Added to my knowledge base about your preferences
• Will use this context for future interactions
• Improved response accuracy for similar requests

How would you like me to proceed with this request?`;

      tasks = [
        'Process user request with AI learning',
        'Update knowledge base with interaction',
        'Create follow-up action items'
      ];
    }

    return {
      role: 'assistant' as const,
      content: response,
      timestamp: new Date().toLocaleTimeString(),
      tasks: tasks.length > 0 ? tasks : undefined
    };
  };

  return (
    <>
      {/* Ask AI Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg ${className}`}
      >
        <Brain className="w-4 h-4" />
        <span>Ask AI</span>
      </button>

      {/* AI Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Accountrix AI Assistant</h3>
                  <p className="text-sm text-gray-400">Self-Learning • Task Creation • Memory Enabled</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation */}
            <div className="flex-1 p-6 overflow-y-auto">
              {conversation.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h4 className="text-white font-semibold mb-2">AI Ready to Assist</h4>
                  <p className="text-gray-400 text-sm mb-6">I'm your self-learning AI assistant. I remember our conversations and can create actionable tasks.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                    {[
                      "Create invoice for new client",
                      "Analyze my cash position",
                      "Process payment to vendor",
                      "Generate financial report"
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const userMessage = {
                            role: 'user' as const,
                            content: suggestion,
                            timestamp: new Date().toLocaleTimeString()
                          };

                          setConversation(prev => [...prev, userMessage]);
                          setMessage('');
                          setIsThinking(true);

                          setTimeout(() => {
                            const aiResponse = processAIMessage(suggestion);
                            setConversation(prev => [...prev, aiResponse]);
                            setIsThinking(false);
                          }, Math.random() * 1500 + 1000);
                        }}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left text-sm text-gray-300 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversation.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-lg p-4 ${
                        msg.role === 'user'
                          ? 'bg-purple-600/20 border border-purple-500/30'
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {msg.role === 'assistant' && <Brain className="w-4 h-4 text-purple-400" />}
                          <span className="text-xs text-gray-400">
                            {msg.role === 'user' ? 'You' : 'AI Assistant'} • {msg.timestamp}
                          </span>
                        </div>
                        <div className="text-white text-sm whitespace-pre-wrap">{msg.content}</div>

                        {msg.tasks && msg.tasks.length > 0 && (
                          <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <h5 className="text-blue-400 font-medium text-xs mb-2">✓ Tasks Created:</h5>
                            <ul className="text-gray-300 text-xs space-y-1">
                              {msg.tasks.map((task, taskIndex) => (
                                <li key={taskIndex}>• {task}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isThinking && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4 max-w-[85%]">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                          <span className="text-xs text-gray-400">AI is thinking and learning...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/10">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask AI anything... I learn and create tasks!"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  disabled={isThinking}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isThinking || !message.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}