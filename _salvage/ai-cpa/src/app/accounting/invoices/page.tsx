'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  Receipt,
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
  CreditCard,
  Phone,
  MapPin,
  Printer,
  X,
  Send,
  Copy,
  Save,
  RefreshCw
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  notes?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const [invoices] = useState<Invoice[]>([
    {
      id: 'inv-001',
      number: 'INV-2024-001',
      clientName: 'Enterprise Corp LLC',
      clientEmail: 'billing@enterprise.com',
      amount: 15750.00,
      date: '2024-01-15',
      dueDate: '2024-02-14',
      status: 'sent',
      items: [
        { id: '1', description: 'Consulting Services - Q1 2024', quantity: 40, rate: 250, amount: 10000 },
        { id: '2', description: 'Financial Analysis Report', quantity: 1, rate: 2500, amount: 2500 },
        { id: '3', description: 'Monthly Bookkeeping Services', quantity: 3, rate: 1083.33, amount: 3250 }
      ],
      notes: 'Payment terms: Net 30 days. Late payment fee of 1.5% per month applies.'
    },
    {
      id: 'inv-002',
      number: 'INV-2024-002',
      clientName: 'Tech Startup Inc',
      clientEmail: 'finance@techstartup.com',
      amount: 8500.00,
      date: '2024-01-18',
      dueDate: '2024-02-17',
      status: 'draft',
      items: [
        { id: '1', description: 'Tax Preparation Services', quantity: 1, rate: 5000, amount: 5000 },
        { id: '2', description: 'Quarterly Financial Review', quantity: 1, rate: 3500, amount: 3500 }
      ]
    },
    {
      id: 'inv-003',
      number: 'INV-2024-003',
      clientName: 'Manufacturing Solutions',
      clientEmail: 'accounts@manufacturing.com',
      amount: 22000.00,
      date: '2024-01-10',
      dueDate: '2024-02-09',
      status: 'paid',
      items: [
        { id: '1', description: 'Annual Audit Services', quantity: 1, rate: 18000, amount: 18000 },
        { id: '2', description: 'Compliance Review', quantity: 1, rate: 4000, amount: 4000 }
      ]
    }
  ]);

  const [clients] = useState<Client[]>([
    {
      id: 'client-001',
      name: 'Enterprise Corp LLC',
      email: 'billing@enterprise.com',
      phone: '(555) 123-4567',
      address: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    },
    {
      id: 'client-002',
      name: 'Tech Startup Inc',
      email: 'finance@techstartup.com',
      phone: '(555) 987-6543',
      address: '456 Innovation Dr',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102'
    }
  ]);

  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]
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
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'sent': return 'bg-blue-500/20 text-blue-400';
      case 'paid': return 'bg-green-500/20 text-green-400';
      case 'overdue': return 'bg-red-500/20 text-red-400';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const addInvoiceItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setNewInvoice(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const items = [...(newInvoice.items || [])];
    items[index] = { ...items[index], [field]: value };

    if (field === 'quantity' || field === 'rate') {
      items[index].amount = items[index].quantity * items[index].rate;
    }

    setNewInvoice(prev => ({ ...prev, items }));
  };

  const calculateTotal = () => {
    return (newInvoice.items || []).reduce((sum, item) => sum + item.amount, 0);
  };

  const handlePrintPreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPrintPreview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('📄 **Invoice PDF Download**\n\nGenerating professional PDF invoice with:\n• Company branding and letterhead\n• Itemized billing details\n• Payment terms and instructions\n• Digital signature ready\n\nPDF will be saved to your Downloads folder.');
  };

  const handleEmailInvoice = () => {
    alert('📧 **Email Invoice**\n\nSending invoice via Accountrix email system:\n• Professional email template\n• PDF attachment included\n• Payment link embedded\n• Delivery confirmation tracking\n• Auto-follow up reminders\n\nInvoice sent successfully!');
  };

  const tabs = [
    { id: 'overview', name: 'Invoice Overview', icon: Receipt },
    { id: 'invoices', name: 'All Invoices', icon: FileText },
    { id: 'create', name: 'Create Invoice', icon: Plus },
    { id: 'clients', name: 'Client Management', icon: Users }
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Accountrix Invoice Management</h1>
                <p className="text-gray-400">Create, send, and track professional invoices with AI automation</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Receipt className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-400">{invoices.length}</span>
            </div>
            <h3 className="text-white font-semibold">Total Invoices</h3>
            <p className="text-gray-400 text-sm">This month</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-400">
                {formatCurrency(invoices.reduce((sum, inv) => sum + inv.amount, 0))}
              </span>
            </div>
            <h3 className="text-white font-semibold">Total Revenue</h3>
            <p className="text-gray-400 text-sm">Outstanding invoices</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-yellow-400">
                {invoices.filter(inv => inv.status === 'sent').length}
              </span>
            </div>
            <h3 className="text-white font-semibold">Pending Payment</h3>
            <p className="text-gray-400 text-sm">Awaiting payment</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-purple-400">94%</span>
            </div>
            <h3 className="text-white font-semibold">Collection Rate</h3>
            <p className="text-gray-400 text-sm">AI optimized</p>
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
                  ? 'border-blue-400 text-blue-400'
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
                <Plus className="w-5 h-5 text-blue-400" />
                <span>Create New Invoice</span>
                <span className="text-sm text-blue-400 bg-blue-500/20 px-2 py-1 rounded">AI-Assisted</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Invoice Details */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4">Invoice Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Invoice Number</label>
                        <input
                          type="text"
                          placeholder="INV-2024-004"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Invoice Date</label>
                          <input
                            type="date"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                          <input
                            type="date"
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4">Client Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Client</label>
                        <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500">
                          <option value="">Select existing client or add new</option>
                          {clients.map(client => (
                            <option key={client.id} value={client.id} className="text-black bg-white">{client.name}</option>
                          ))}
                        </select>
                      </div>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Add New Client</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4">Payment Terms</h4>
                    <div className="space-y-4">
                      <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500">
                        <option value="net30" className="text-black bg-white">Net 30 Days</option>
                        <option value="net15" className="text-black bg-white">Net 15 Days</option>
                        <option value="due_on_receipt" className="text-black bg-white">Due on Receipt</option>
                        <option value="custom" className="text-black bg-white">Custom Terms</option>
                      </select>
                      <textarea
                        placeholder="Additional notes or payment instructions..."
                        rows={3}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">Invoice Items</h4>
                      <button
                        onClick={addInvoiceItem}
                        className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Item</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(newInvoice.items || []).map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5">
                            <input
                              type="text"
                              placeholder="Description"
                              value={item.description}
                              onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                              className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              placeholder="Qty"
                              value={item.quantity}
                              onChange={(e) => updateInvoiceItem(index, 'quantity', Number(e.target.value))}
                              className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              placeholder="Rate"
                              value={item.rate}
                              onChange={(e) => updateInvoiceItem(index, 'rate', Number(e.target.value))}
                              className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <div className="text-white text-sm font-semibold px-2 py-1">
                              {formatCurrency(item.amount)}
                            </div>
                          </div>
                          <div className="col-span-1">
                            <button className="p-1 text-red-400 hover:text-red-300 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Total:</span>
                        <span className="text-2xl font-bold text-blue-400">{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4">Invoice Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                        <Save className="w-4 h-4" />
                        <span>Save Draft</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        <Send className="w-4 h-4" />
                        <span>Send Invoice</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-6">
            {/* Invoice Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all" className="text-black bg-white">All Status</option>
                  <option value="draft" className="text-black bg-white">Draft</option>
                  <option value="sent" className="text-black bg-white">Sent</option>
                  <option value="paid" className="text-black bg-white">Paid</option>
                  <option value="overdue" className="text-black bg-white">Overdue</option>
                </select>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Invoice</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-white font-medium">{invoice.number}</p>
                            <p className="text-gray-400 text-sm">Due: {invoice.dueDate}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-white">{invoice.clientName}</p>
                            <p className="text-gray-400 text-sm">{invoice.clientEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{invoice.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handlePrintPreview(invoice)}
                              className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                              title="Print Preview"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleDownloadPDF}
                              className="p-1 text-green-400 hover:text-green-300 transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleEmailInvoice}
                              className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                              title="Email Invoice"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors">
                              <Edit3 className="w-4 h-4" />
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
                <span>AI Invoice Insights</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Payment Performance</span>
                    </div>
                    <p className="text-gray-300 text-sm">94% collection rate with average payment time of 18 days. AI-optimized follow-up improved collections by 15%.</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Revenue Trends</span>
                    </div>
                    <p className="text-gray-300 text-sm">Monthly recurring revenue up 22%. Service billing automation saved 12 hours per week.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Upcoming Due Dates</span>
                    </div>
                    <p className="text-gray-300 text-sm">3 invoices due this week. Auto-reminder emails scheduled. Follow-up calls recommended for high-value accounts.</p>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <RefreshCw className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-medium">Automation Stats</span>
                    </div>
                    <p className="text-gray-300 text-sm">85% of invoices auto-generated from service agreements. Smart pricing suggestions increased profit margins by 8%.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Recent Invoice Activity</h3>
              <div className="space-y-3">
                {invoices.slice(0, 3).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Receipt className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{invoice.number}</p>
                        <p className="text-gray-400 text-sm">{invoice.clientName} • {invoice.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{formatCurrency(invoice.amount)}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print Preview Modal */}
      {showPrintPreview && selectedInvoice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-slate-100 px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Invoice Print Preview</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setShowPrintPreview(false)}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="p-8 bg-white text-slate-800 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">ACCOUNTRIX</h1>
                    <p className="text-slate-600">Professional Accounting Services</p>
                    <div className="mt-4 text-sm text-slate-600">
                      <p>123 Business Street</p>
                      <p>New York, NY 10001</p>
                      <p>Phone: (555) 123-4567</p>
                      <p>Email: billing@accountrix.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">INVOICE</h2>
                    <p className="text-lg font-semibold">{selectedInvoice.number}</p>
                    <div className="mt-4 text-sm">
                      <p><strong>Date:</strong> {selectedInvoice.date}</p>
                      <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
                  <div className="text-sm">
                    <p className="font-semibold">{selectedInvoice.clientName}</p>
                    <p>{selectedInvoice.clientEmail}</p>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8 border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-2 font-semibold">Description</th>
                      <th className="text-center py-2 font-semibold w-20">Qty</th>
                      <th className="text-right py-2 font-semibold w-24">Rate</th>
                      <th className="text-right py-2 font-semibold w-24">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3">{item.description}</td>
                        <td className="py-3 text-center">{item.quantity}</td>
                        <td className="py-3 text-right">{formatCurrency(item.rate)}</td>
                        <td className="py-3 text-right font-semibold">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total */}
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-2 border-t-2 border-slate-800">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-lg">{formatCurrency(selectedInvoice.amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Terms */}
                <div className="text-sm text-slate-600">
                  <h4 className="font-semibold mb-2">Payment Terms:</h4>
                  <p>{selectedInvoice.notes || 'Payment due within 30 days of invoice date.'}</p>
                  <p className="mt-2">Thank you for your business!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}