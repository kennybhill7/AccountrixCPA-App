'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  ArrowLeft,
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Edit3,
  Trash2,
  Camera,
  FileText,
  Mail,
  DollarSign,
  Users,
  Building,
  Phone,
  MapPin,
  Printer,
  Send,
  Copy,
  Save,
  RefreshCw,
  Banknote,
  Zap,
  Shield,
  Globe,
  Smartphone,
  X
} from 'lucide-react';

interface Payment {
  id: string;
  type: 'check' | 'ach' | 'wire' | 'transfer' | 'auto-draft';
  vendor: string;
  amount: number;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  method: string;
  reference: string;
  memo?: string;
  approvedBy?: string;
}

interface Vendor {
  id: string;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  address: string;
  paymentPreference: 'check' | 'ach' | 'wire';
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showCheckPreview, setShowCheckPreview] = useState(false);
  const [paymentType, setPaymentType] = useState<'check' | 'ach' | 'wire' | 'transfer'>('check');

  const [payments] = useState<Payment[]>([
    {
      id: 'pay-001',
      type: 'check',
      vendor: 'Office Supply Co',
      amount: 1250.00,
      date: '2024-01-18',
      status: 'completed',
      method: 'Physical Check #1001',
      reference: 'INV-OS-2024-001',
      memo: 'Office supplies for Q1',
      approvedBy: 'John Smith'
    },
    {
      id: 'pay-002',
      type: 'ach',
      vendor: 'AWS Services',
      amount: 15000.00,
      date: '2024-01-17',
      status: 'processing',
      method: 'ACH Credit Transfer',
      reference: 'AUTO-AWS-JAN24',
      memo: 'Monthly cloud services'
    },
    {
      id: 'pay-003',
      type: 'wire',
      vendor: 'International Consulting Ltd',
      amount: 25000.00,
      date: '2024-01-16',
      status: 'completed',
      method: 'Wire Transfer',
      reference: 'WIRE-INT-001',
      memo: 'Consulting services payment',
      approvedBy: 'Sarah Johnson'
    },
    {
      id: 'pay-004',
      type: 'auto-draft',
      vendor: 'Utility Company',
      amount: 450.00,
      date: '2024-01-15',
      status: 'completed',
      method: 'Auto-Draft',
      reference: 'UTIL-JAN24',
      memo: 'Monthly utilities'
    }
  ]);

  const [vendors] = useState<Vendor[]>([
    {
      id: 'vendor-001',
      name: 'Office Supply Co',
      accountNumber: '****1234',
      routingNumber: '021000021',
      address: '123 Supply Street, Business City, BC 12345',
      paymentPreference: 'check'
    },
    {
      id: 'vendor-002',
      name: 'AWS Services',
      accountNumber: '****5678',
      routingNumber: '111000025',
      address: '410 Terry Ave N, Seattle, WA 98109',
      paymentPreference: 'ach'
    }
  ]);

  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    type: 'check',
    date: new Date().toISOString().split('T')[0]
  });

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'check': return <Banknote className="w-4 h-4" />;
      case 'ach': return <Zap className="w-4 h-4" />;
      case 'wire': return <Globe className="w-4 h-4" />;
      case 'transfer': return <RefreshCw className="w-4 h-4" />;
      case 'auto-draft': return <Smartphone className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'check': return 'text-blue-400';
      case 'ach': return 'text-green-400';
      case 'wire': return 'text-purple-400';
      case 'transfer': return 'text-yellow-400';
      case 'auto-draft': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handlePrintCheck = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowCheckPreview(true);
  };

  const handleProcessPayment = () => {
    const processingMessage = {
      'check': '🖨️ **Check Processing**\n\nPrinting check with MICR encoding:\n• Security features activated\n• Void protection enabled\n• Dual signature required\n• Check #1002 generated\n\nCheck ready for signature and mailing.',
      'ach': '⚡ **ACH Transfer Processing**\n\nInitiating electronic transfer:\n• Bank verification completed\n• Same-day processing available\n• Secure encryption applied\n• Transaction ID: ACH20240118001\n\nTransfer will complete within 1-2 business days.',
      'wire': '🌐 **Wire Transfer Processing**\n\nProcessing international wire:\n• SWIFT code verified\n• Compliance checks passed\n• High-priority processing\n• Wire reference: WIRE20240118001\n\nTransfer will complete within 24 hours.',
      'transfer': '🔄 **Internal Transfer Processing**\n\nProcessing account transfer:\n• Account validation completed\n• Real-time processing\n• Audit trail created\n• Transfer ID: TRF20240118001\n\nTransfer completed successfully.'
    };

    alert(processingMessage[paymentType] || 'Payment processing initiated successfully!');
  };

  const handleRecordAutoDraft = () => {
    alert('📱 **Auto-Draft Recording**\n\nRecording automatic payment:\n• Bank draft detected\n• Vendor identification: Utility Company\n• Amount: $450.00\n• Account reconciliation updated\n• Expense category assigned\n\n✅ Auto-draft recorded successfully!\n\nFuture auto-drafts from this vendor will be automatically recorded and categorized.');
  };

  const tabs = [
    { id: 'overview', name: 'Payment Overview', icon: CreditCard },
    { id: 'payments', name: 'All Payments', icon: FileText },
    { id: 'create', name: 'Process Payment', icon: Plus },
    { id: 'vendors', name: 'Vendor Management', icon: Users }
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
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Accountrix Payment Center</h1>
                <p className="text-gray-400">Process checks, ACH, wires, and track auto-drafts with AI automation</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <button
              onClick={handleRecordAutoDraft}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>Record Auto-Draft</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Process Payment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-400">{payments.length}</span>
            </div>
            <h3 className="text-white font-semibold">Total Payments</h3>
            <p className="text-gray-400 text-sm">This month</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-400">
                {formatCurrency(payments.reduce((sum, payment) => sum + payment.amount, 0))}
              </span>
            </div>
            <h3 className="text-white font-semibold">Total Amount</h3>
            <p className="text-gray-400 text-sm">Processed this month</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-yellow-400">
                {payments.filter(p => p.status === 'processing').length}
              </span>
            </div>
            <h3 className="text-white font-semibold">Processing</h3>
            <p className="text-gray-400 text-sm">In progress</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-purple-400">99.8%</span>
            </div>
            <h3 className="text-white font-semibold">Success Rate</h3>
            <p className="text-gray-400 text-sm">Payment reliability</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-black/10 backdrop-blur-md border-b border-white/10">
        <div className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-400 text-green-400'
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
        {activeTab === 'create' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-green-400" />
                <span>Process New Payment</span>
                <span className="text-sm text-green-400 bg-green-500/20 px-2 py-1 rounded">AI-Secured</span>
              </h3>

              {/* Payment Type Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { type: 'check', label: 'Print Check', icon: Banknote, description: 'Physical check with MICR' },
                  { type: 'ach', label: 'ACH Transfer', icon: Zap, description: 'Electronic bank transfer' },
                  { type: 'wire', label: 'Wire Transfer', icon: Globe, description: 'Same-day/international' },
                  { type: 'transfer', label: 'Internal Transfer', icon: RefreshCw, description: 'Between your accounts' }
                ].map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setPaymentType(option.type as any)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      paymentType === option.type
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <option.icon className={`w-8 h-8 mx-auto mb-2 ${
                      paymentType === option.type ? 'text-green-400' : 'text-gray-400'
                    }`} />
                    <h4 className="text-white font-semibold text-sm">{option.label}</h4>
                    <p className="text-gray-400 text-xs mt-1">{option.description}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Details */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4">Payment Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Vendor/Payee</label>
                        <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500">
                          <option value="">Select vendor or add new</option>
                          {vendors.map(vendor => (
                            <option key={vendor.id} value={vendor.id} className="text-black bg-white">{vendor.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Payment Date</label>
                          <input
                            type="date"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Reference/Invoice</label>
                        <input
                          type="text"
                          placeholder="Invoice number or reference"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Memo/Description</label>
                        <textarea
                          placeholder="Payment description or notes..."
                          rows={3}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Specific Options */}
                  {paymentType === 'check' && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-4">Check Options</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-green-600" />
                          <span className="text-gray-300">MICR encoding</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-green-600" />
                          <span className="text-gray-300">Void protection</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-white/20 bg-white/10 text-green-600" />
                          <span className="text-gray-300">Dual signature required</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-green-600" />
                          <span className="text-gray-300">Track delivery</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentType === 'ach' && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-4">ACH Options</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Processing Speed</label>
                          <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500">
                            <option value="standard" className="text-black bg-white">Standard (1-2 days)</option>
                            <option value="same-day" className="text-black bg-white">Same Day (+$5 fee)</option>
                          </select>
                        </div>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-green-600" />
                          <span className="text-gray-300">Email confirmation</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-green-600" />
                          <span className="text-gray-300">Fraud monitoring</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentType === 'wire' && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-4">Wire Transfer Options</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Wire Type</label>
                          <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500">
                            <option value="domestic" className="text-black bg-white">Domestic Wire</option>
                            <option value="international" className="text-black bg-white">International Wire</option>
                          </select>
                        </div>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-green-600" />
                          <span className="text-gray-300">High priority</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-green-600" />
                          <span className="text-gray-300">Compliance verification</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security & Preview */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span>Security & Approval</span>
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-medium text-sm">Security Checks</span>
                        </div>
                        <ul className="text-gray-300 text-xs space-y-1">
                          <li>✓ Vendor verification completed</li>
                          <li>✓ Fraud detection active</li>
                          <li>✓ Dual approval workflow enabled</li>
                          <li>✓ Encryption protocols applied</li>
                        </ul>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Approval Required</label>
                        <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500">
                          <option value="auto" className="text-black bg-white">Auto-approve (under $1,000)</option>
                          <option value="manager" className="text-black bg-white">Manager approval required</option>
                          <option value="executive" className="text-black bg-white">Executive approval required</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Authorized By</label>
                        <input
                          type="text"
                          placeholder="Your name or ID"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4">Payment Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Payment Method:</span>
                        <span className="text-white capitalize">{paymentType.replace('-', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Processing Fee:</span>
                        <span className="text-white">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Estimated Delivery:</span>
                        <span className="text-white">
                          {paymentType === 'check' ? '3-5 business days' :
                           paymentType === 'ach' ? '1-2 business days' :
                           paymentType === 'wire' ? 'Same day' :
                           'Immediate'}
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-white">Total Amount:</span>
                          <span className="text-2xl font-bold text-green-400">$0.00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleProcessPayment}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
                    >
                      <Send className="w-5 h-5" />
                      <span>Process Payment</span>
                    </button>

                    {paymentType === 'check' && (
                      <button
                        onClick={() => handlePrintCheck({
                          id: 'preview',
                          type: 'check',
                          vendor: 'Sample Vendor',
                          amount: 1250.00,
                          date: new Date().toISOString().split('T')[0],
                          status: 'pending',
                          method: 'Check #1002',
                          reference: 'PREVIEW',
                          memo: 'Check preview'
                        })}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Printer className="w-5 h-5" />
                        <span>Preview Check</span>
                      </button>
                    )}

                    <button className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                      <Save className="w-5 h-5" />
                      <span>Save Draft</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Payment Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="all" className="text-black bg-white">All Status</option>
                  <option value="pending" className="text-black bg-white">Pending</option>
                  <option value="processing" className="text-black bg-white">Processing</option>
                  <option value="completed" className="text-black bg-white">Completed</option>
                  <option value="failed" className="text-black bg-white">Failed</option>
                </select>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vendor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getTypeColor(payment.type)} bg-white/10`}>
                              {getTypeIcon(payment.type)}
                            </div>
                            <div>
                              <p className="text-white font-medium capitalize">{payment.type.replace('-', ' ')}</p>
                              <p className="text-gray-400 text-sm">{payment.reference}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-white">{payment.vendor}</p>
                            <p className="text-gray-400 text-sm">{payment.memo}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{payment.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {payment.type === 'check' && (
                              <button
                                onClick={() => handlePrintCheck(payment)}
                                className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                                title="Print Check"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-1 text-green-400 hover:text-green-300 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Payment Insights</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Payment Efficiency</span>
                    </div>
                    <p className="text-gray-300 text-sm">99.8% success rate with AI fraud detection. Average processing time reduced by 65% through automation.</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Cost Optimization</span>
                    </div>
                    <p className="text-gray-300 text-sm">ACH transfers saved $2,400 in fees this quarter. Smart routing recommendations available.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Upcoming Payments</span>
                    </div>
                    <p className="text-gray-300 text-sm">5 scheduled payments due this week. Auto-draft monitoring active for 12 vendors.</p>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-medium">Security Status</span>
                    </div>
                    <p className="text-gray-300 text-sm">All payment channels secured with bank-grade encryption. Fraud monitoring blocked 2 suspicious attempts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Recent Payment Activity</h3>
              <div className="space-y-3">
                {payments.slice(0, 4).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(payment.type)} bg-white/10`}>
                        {getTypeIcon(payment.type)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{payment.vendor}</p>
                        <p className="text-gray-400 text-sm">{payment.method} • {payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{formatCurrency(payment.amount)}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Check Preview Modal */}
      {showCheckPreview && selectedPayment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-slate-100 px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Check Print Preview</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Check</span>
                </button>
                <button
                  onClick={() => alert('Check saved as PDF with MICR encoding and security features.')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Save PDF</span>
                </button>
                <button
                  onClick={() => setShowCheckPreview(false)}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Check Content */}
            <div className="p-8 bg-white text-slate-800 overflow-y-auto">
              <div className="max-w-3xl mx-auto border-2 border-slate-300 p-6" style={{ minHeight: '300px' }}>
                {/* Check Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-1">ACCOUNTRIX CORP</h1>
                    <p className="text-sm text-slate-600">123 Business Street, New York, NY 10001</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold border-2 border-slate-400 px-3 py-1">1002</div>
                    <p className="text-xs text-slate-600 mt-1">Check Number</p>
                  </div>
                </div>

                {/* Date and Pay To */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-slate-600">Date:</span>
                    <span className="border-b border-slate-400 px-4 py-1 min-w-32 text-center">{selectedPayment.date}</span>
                  </div>

                  <div className="flex items-center mb-4">
                    <span className="text-sm text-slate-600 mr-4">Pay to the order of:</span>
                    <span className="border-b border-slate-400 px-4 py-1 flex-1 text-lg font-semibold">{selectedPayment.vendor}</span>
                  </div>

                  <div className="flex justify-end">
                    <div className="border-2 border-slate-400 px-4 py-2">
                      <span className="text-lg font-bold">{formatCurrency(selectedPayment.amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Amount in Words */}
                <div className="mb-6">
                  <div className="border-b border-slate-400 px-4 py-2 text-sm">
                    One thousand two hundred fifty and 00/100 DOLLARS
                  </div>
                </div>

                {/* Memo and Signature */}
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs text-slate-600">Memo:</span>
                    <div className="border-b border-slate-400 px-4 py-1 min-w-48 text-sm">
                      {selectedPayment.memo}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="border-b border-slate-400 px-8 py-2 min-w-48 mb-1"></div>
                    <span className="text-xs text-slate-600">Authorized Signature</span>
                  </div>
                </div>

                {/* MICR Line */}
                <div className="mt-8 pt-4 border-t border-slate-200">
                  <div className="font-mono text-lg tracking-widest text-center bg-slate-100 py-2">
                    ⑆021000021⑆ 1234567890 1002
                  </div>
                  <p className="text-xs text-slate-500 text-center mt-1">MICR Encoded - Bank Routing and Account Information</p>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-slate-600">
                <p>✓ MICR Encoding Applied • ✓ Void Protection Enabled • ✓ Security Features Active</p>
                <p className="mt-1">This check is ready for printing on check stock paper.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}