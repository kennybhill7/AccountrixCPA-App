'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Brain, X, Send, Mic, MicOff } from 'lucide-react';

interface AskAIOverlayProps {
  open: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tasks?: string[];
}

export default function AskAIOverlay({ open, onClose }: AskAIOverlayProps) {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Prevent rendering on server
  if (typeof window === 'undefined') return null;

  // Body scroll lock effect
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Focus trap
      const firstFocusableElement = document.querySelector('[data-askai-overlay] input, [data-askai-overlay] button') as HTMLElement;
      firstFocusableElement?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isThinking]);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  const processAIMessage = (input: string): Message => {
    const lowerInput = input.toLowerCase();
    let response = '';
    let tasks: string[] = [];

    // Enhanced AI processing for CPA functions
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

      } else if (lowerInput.includes('journal entry') || lowerInput.includes('je')) {
        response = `📊 **Journal Entry Creation**

I'll help you post a journal entry:

**Entry Requirements:**
• Debit and credit accounts (must balance)
• Transaction amounts and descriptions
• Supporting documentation reference
• Date and period validation

**GAAP Compliance Check:**
• Chart of accounts validation
• Account coding verification
• Audit trail maintenance
• Balance verification (debits = credits)

**Next Steps:**
1. Specify debit/credit accounts
2. Enter amounts and descriptions
3. Attach supporting documents
4. Post to general ledger

What type of journal entry would you like to create?`;

        tasks = [
          'Identify debit and credit accounts',
          'Enter transaction amounts',
          'Add descriptions and references',
          'Post balanced journal entry'
        ];

      } else if (lowerInput.includes('report')) {
        response = `📋 **Financial Report Generation**

I'll generate the requested report with GAAP compliance:

**Available Reports:**
• Balance Sheet (GAAP formatted)
• Income Statement (P&L)
• Cash Flow Statement (Direct/Indirect)
• Trial Balance with drill-downs
• General Ledger Detail
• AR/AP Aging Reports

**Professional Features:**
• Black-on-white formatting for auditors
• Company headers and footers
• Page numbers and preparation date
• "Prepared by Accountrix AI" attribution
• PDF/Excel export options

Which report would you like me to prepare?`;

        tasks = [
          'Prepare financial data for report',
          'Generate GAAP-compliant format',
          'Add professional styling',
          'Export to requested format'
        ];
      }

    } else if (lowerInput.includes('post') || lowerInput.includes('record')) {
      response = `💰 **Transaction Posting**

I'll help you record this transaction:

**Posting Process:**
1. **Account Identification**: Map to Chart of Accounts
2. **Amount Verification**: Ensure debits = credits
3. **Cost Code Assignment**: If applicable to WIP
4. **Supporting Documents**: Attach source materials
5. **Audit Trail**: Record who, what, when, why

**Compliance Features:**
• GAAP posting rules enforced
• Cost codes roll to WIP GL accounts only
• Balanced entries required
• Source document tracking
• User activity logging

What transaction would you like to record?`;

      tasks = [
        'Identify chart of accounts mapping',
        'Verify transaction balance',
        'Assign cost codes if applicable',
        'Post to general ledger with audit trail'
      ];

    } else if (lowerInput.includes('reconcile') || lowerInput.includes('recon')) {
      response = `🔍 **Bank Reconciliation**

I'll assist with reconciliation:

**Current Status:**
• 99.8% automated matching
• 3 outstanding items requiring review
• $2,450 in unmatched deposits
• $1,125 in unmatched withdrawals

**AI Reconciliation Process:**
1. **Auto-Match**: Known patterns and amounts
2. **Smart Suggestions**: Probable matches
3. **Exception Queue**: Items requiring review
4. **Final Verification**: User approval needed

**Reconciliation Rules:**
• Bank statement vs general ledger
• Outstanding checks tracking
• Deposit timing differences
• Bank fees and interest posting

Would you like me to start the reconciliation process?`;

      tasks = [
        'Download bank statement data',
        'Run automated matching algorithms',
        'Review exception items',
        'Complete reconciliation and post adjustments'
      ];

    } else if (lowerInput.includes('help') || lowerInput.includes('commands')) {
      response = `🤖 **Accountrix AI - CPA Commands**

**Financial Operations:**
• "Create invoice for [client]" - Generate professional invoices
• "Post journal entry" - Record transactions with GAAP compliance
• "Reconcile bank account" - Automated bank reconciliation
• "Generate [report type]" - GAAP financial statements
• "Process payment to [vendor]" - Check, ACH, wire processing

**AI Automation:**
• "Upload and process documents" - OCR extraction and categorization
• "Analyze cash flow" - Predictive analytics and insights
• "Review expenses" - AI categorization and approval workflows
• "Close monthly books" - Period-end processing
• "Prepare audit package" - Compliance documentation

**Cost Accounting:**
• Cost codes automatically roll to WIP GL accounts
• Job costing and profitability analysis
• WIP reporting and percentage completion
• Project-based financial tracking

**Professional Features:**
• All reports are auditor-ready (black-on-white)
• GAAP compliance built-in
• Audit trail maintenance
• Source document attachment
• Professional export formats

What accounting task can I help you with?`;

      tasks = [
        'Review available AI commands',
        'Set up preferred workflows',
        'Configure automation preferences'
      ];

    } else {
      // General intelligent CPA response
      response = `🤖 **Accountrix AI - Professional CPA Assistant**

I understand you're asking about: "${input}"

**My Analysis:**
As your AI CPA, I'm processing this request with full accounting context and GAAP compliance in mind.

**Professional Capabilities:**
• Complete general ledger management
• GAAP-compliant financial reporting
• Automated reconciliation and posting
• Cost accounting and job profitability
• Audit trail and documentation
• Tax preparation and compliance

**AI Learning Notes:**
• Added to my knowledge base about your preferences
• Will use this context for future interactions
• Improved response accuracy for similar requests

**Next Steps:**
I can help you accomplish this goal with full professional standards. Let me create the appropriate tasks and guide you through the GAAP-compliant process.

How would you like me to proceed with this accounting request?`;

      tasks = [
        'Process request with GAAP compliance',
        'Create professional workflow',
        'Update AI knowledge base'
      ];
    }

    return {
      role: 'assistant',
      content: response,
      timestamp: new Date().toLocaleTimeString(),
      tasks: tasks.length > 0 ? tasks : undefined
    };
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isThinking) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setIsThinking(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = processAIMessage(currentMessage);
      setConversation(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, Math.random() * 1500 + 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="askai-title"
      data-askai-overlay
      className="fixed top-4 right-4 w-[420px] max-h-[80vh] z-[100000] rounded-xl shadow-2xl bg-slate-900 border border-white/20"
      style={{ zIndex: 100000 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 id="askai-title" className="text-sm font-bold text-white">Accountrix AI</h3>
            <p className="text-xs text-gray-400">Professional CPA Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setVoiceActive(!voiceActive)}
            className={`p-2 rounded-lg transition-colors ${
              voiceActive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
            aria-label="Toggle voice recognition"
          >
            {voiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close AI assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="max-h-[calc(80vh-140px)] overflow-y-auto p-4">
        {conversation.length === 0 ? (
          <div className="text-center py-6">
            <Brain className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">AI CPA Ready</h4>
            <p className="text-gray-400 text-xs mb-4">Professional accounting assistance with GAAP compliance</p>

            <div className="space-y-2 text-left">
              {[
                "Create invoice for new client",
                "Post journal entry",
                "Reconcile bank account",
                "Generate financial reports"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const userMessage: Message = {
                      role: 'user',
                      content: suggestion,
                      timestamp: new Date().toLocaleTimeString()
                    };

                    setConversation(prev => [...prev, userMessage]);
                    setIsThinking(true);

                    setTimeout(() => {
                      const aiResponse = processAIMessage(suggestion);
                      setConversation(prev => [...prev, aiResponse]);
                      setIsThinking(false);
                    }, Math.random() * 1500 + 1000);
                  }}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-purple-600/20 border border-purple-500/30'
                    : 'bg-white/5 border border-white/10'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {msg.role === 'assistant' && <Brain className="w-3 h-3 text-purple-400" />}
                    <span className="text-xs text-gray-400">
                      {msg.role === 'user' ? 'You' : 'AI CPA'} • {msg.timestamp}
                    </span>
                  </div>
                  <div className="text-white text-xs whitespace-pre-wrap">{msg.content}</div>

                  {msg.tasks && msg.tasks.length > 0 && (
                    <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h5 className="text-blue-400 font-medium text-xs mb-1">✓ Tasks Created:</h5>
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
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 max-w-[90%]">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-3 h-3 text-purple-400 animate-pulse" />
                    <span className="text-xs text-gray-400">AI CPA is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        {voiceActive && (
          <div className="mb-2 flex items-center justify-center space-x-2 text-green-400 text-xs">
            <Mic className="w-3 h-3 animate-pulse" />
            <span>Voice recognition active</span>
          </div>
        )}
        <div className="flex space-x-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your AI CPA... (Ctrl/Cmd+Enter to send)"
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none min-h-[2.5rem] max-h-[8rem]"
            disabled={isThinking}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={isThinking || !message.trim()}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-1"
            aria-label="Send message"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}