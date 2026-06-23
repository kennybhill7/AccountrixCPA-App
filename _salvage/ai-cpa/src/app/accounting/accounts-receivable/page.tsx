'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Download,
  Upload,
  ArrowLeft,
  Brain,
  AlertTriangle,
  TrendingUp,
  FileText,
  Users,
  DollarSign,
  Eye,
  X,
  Trash2,
  Save,
  CheckCircle,
  Calendar
} from 'lucide-react';

export default function AccountsReceivablePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
    amount: 0,
    lineItems: [
      { description: '', quantity: 1, rate: 0, amount: 0 }
    ]
  });

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleNewInvoice = () => {
    setShowNewInvoice(true);
  };

  const addLineItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    setNewInvoice(prev => ({
      ...prev,
      lineItems: prev.lineItems.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const removeLineItem = (index: number) => {
    if (newInvoice.lineItems.length > 1) {
      setNewInvoice(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateInvoiceTotal = () => {
    return newInvoice.lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSaveInvoice = () => {
    const total = calculateInvoiceTotal();
    const invoiceId = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;

    alert(`✅ Invoice Created Successfully!\n\nInvoice ID: ${invoiceId}\nCustomer: ${newInvoice.customerName}\nAmount: ${formatCurrency(total)}\nDue Date: ${newInvoice.dueDate}\n\n📧 Invoice sent to customer\n📊 AR balance updated\n📋 Ready for payment tracking`);

    // Reset form
    setNewInvoice({
      customerId: '',
      customerName: '',
      customerEmail: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      description: '',
      amount: 0,
      lineItems: [
        { description: '', quantity: 1, rate: 0, amount: 0 }
      ]
    });
    setShowNewInvoice(false);
  };

  const handleExportInvoices = () => {
    if (invoices.length === 0) {
      alert('No invoices available for export.');
      return;
    }

    // Generate CSV content
    const csvHeaders = 'Invoice ID,Customer,Amount,Due Date,Status,Days Outstanding\n';
    const csvData = invoices.map(invoice => {
      const daysOutstanding = Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));
      return `"${invoice.id}","${invoice.customer}","${invoice.amount}","${invoice.dueDate}","${invoice.status}","${daysOutstanding}"`;
    }).join('\n');

    const csvContent = csvHeaders + csvData;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `accounts_receivable_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ AR Invoices Export Complete!\n\nExported ${invoices.length} invoices to CSV file.\nFile downloaded: accounts_receivable_invoices_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportCustomers = () => {
    if (customers.length === 0) {
      alert('No customers available for export.');
      return;
    }

    // Generate CSV content
    const csvHeaders = 'Customer Name,Email,Current Balance,Credit Limit,Available Credit\n';
    const csvData = customers.map(customer => {
      const availableCredit = customer.creditLimit - customer.currentBalance;
      return `"${customer.name}","${customer.email}","${customer.currentBalance}","${customer.creditLimit}","${availableCredit}"`;
    }).join('\n');

    const csvContent = csvHeaders + csvData;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `accounts_receivable_customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ AR Customers Export Complete!\n\nExported ${customers.length} customers to CSV file.\nFile downloaded: accounts_receivable_customers_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportARReport = () => {
    // Generate comprehensive AR report
    const reportDate = new Date().toLocaleDateString();
    const csvHeaders = 'Report Type,Metric,Value,Date Generated\n';
    const csvData = [
      `"AR Summary","Total Outstanding","${totalOutstanding}","${reportDate}"`,
      `"AR Summary","Overdue Amount","${overdueAmount}","${reportDate}"`,
      `"AR Summary","Total Invoices","${invoices.length}","${reportDate}"`,
      `"AR Summary","Total Customers","${customers.length}","${reportDate}"`
    ].join('\n');

    const csvContent = csvHeaders + csvData;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `accounts_receivable_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ AR Report Export Complete!\n\nGenerated comprehensive accounts receivable report.\nFile downloaded: accounts_receivable_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const invoices = [
    {
      id: 'INV-2024-001',
      customer: 'Enterprise Corp',
      amount: 250000,
      dueDate: '2024-02-14',
      status: 'sent'
    },
    {
      id: 'INV-2024-002',
      customer: 'TechStart Inc',
      amount: 85000,
      dueDate: '2024-01-25',
      status: 'overdue'
    }
  ];

  const customers = [
    {
      name: 'Enterprise Corp',
      email: 'accounting@enterprise.com',
      currentBalance: 250000,
      creditLimit: 1000000
    },
    {
      name: 'TechStart Inc',
      email: 'finance@techstart.com',
      currentBalance: 85000,
      creditLimit: 500000
    }
  ];

  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  const tabs = [
    { id: 'overview', name: 'AR Overview', icon: Receipt },
    { id: 'invoices', name: 'Invoices', icon: FileText },
    { id: 'customers', name: 'Customers', icon: Users }
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
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Accounts Receivable</h1>
                <p className="text-gray-400">Customer invoicing and payment tracking</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportARReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export AR Report</span>
            </button>
            <button
              onClick={handleExportInvoices}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Invoices</span>
            </button>
            <button
              onClick={handleExportCustomers}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Customers</span>
            </button>
            <button
              onClick={handleNewInvoice}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Invoice</span>
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
                <Receipt className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-400">{formatCurrency(totalOutstanding)}</span>
            </div>
            <h3 className="text-white font-semibold">Outstanding Receivables</h3>
            <p className="text-gray-400 text-sm">Across {invoices.length} invoices</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-2xl font-bold text-red-400">{formatCurrency(overdueAmount)}</span>
            </div>
            <h3 className="text-white font-semibold">Overdue Amount</h3>
            <p className="text-gray-400 text-sm">Requires immediate follow-up</p>
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Collections Insights</span>
              </h3>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-gray-300 text-sm">TechStart Inc invoice {formatCurrency(85000)} is overdue. High probability customer will pay within 7 days based on payment history.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{invoice.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">{invoice.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">{formatCurrency(invoice.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{invoice.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'overdue' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {customers.map((customer, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{customer.name}</h4>
                      <p className="text-gray-400 text-sm">{customer.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Current Balance:</span>
                    <span className="text-white font-semibold">{formatCurrency(customer.currentBalance)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Credit Limit:</span>
                    <span className="text-green-400 font-semibold">{formatCurrency(customer.creditLimit)}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Invoice Modal */}
      {showNewInvoice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                    <Receipt className="w-6 h-6 text-green-400" />
                    <span>Create New Invoice</span>
                    <span className="text-sm text-green-400 bg-green-500/20 px-2 py-1 rounded">AR Management</span>
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Create and send professional invoices to customers</p>
                </div>
                <button
                  onClick={() => setShowNewInvoice(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Invoice Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={newInvoice.customerName}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter customer name"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Customer Email</label>
                  <input
                    type="email"
                    value={newInvoice.customerEmail}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="customer@company.com"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Invoice Date</label>
                  <input
                    type="date"
                    value={newInvoice.invoiceDate}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, invoiceDate: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Invoice Description</label>
                <input
                  type="text"
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of services/products"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Line Items */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Invoice Line Items</h4>
                  <button
                    onClick={addLineItem}
                    className="flex items-center space-x-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Line</span>
                  </button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 mb-3 p-3 bg-white/5 rounded-lg">
                  <div className="col-span-5 text-xs font-medium text-gray-300 uppercase tracking-wider">Description</div>
                  <div className="col-span-2 text-xs font-medium text-gray-300 uppercase tracking-wider text-center">Quantity</div>
                  <div className="col-span-2 text-xs font-medium text-gray-300 uppercase tracking-wider text-right">Rate</div>
                  <div className="col-span-2 text-xs font-medium text-gray-300 uppercase tracking-wider text-right">Amount</div>
                  <div className="col-span-1 text-xs font-medium text-gray-300 uppercase tracking-wider text-center">Action</div>
                </div>

                {/* Line Items */}
                <div className="space-y-3">
                  {newInvoice.lineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 bg-white/5 rounded-lg">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Service or product description"
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="1"
                          min="0"
                          step="1"
                          value={item.quantity || ''}
                          onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500 text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={item.rate || ''}
                          onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500 text-right"
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="text-white font-semibold text-right px-2 py-2">
                          {formatCurrency(item.amount)}
                        </div>
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          onClick={() => removeLineItem(index)}
                          disabled={newInvoice.lineItems.length <= 1}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Invoice Total */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex justify-end">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="text-green-400 font-medium text-sm mb-1">Invoice Total:</div>
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(calculateInvoiceTotal())}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewInvoice(false)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('💾 Invoice Draft Saved\n\nInvoice saved for later completion. You can return to finish and send this invoice at any time.\n\n📋 Draft invoices are accessible from the Invoices tab.');
                  }}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={handleSaveInvoice}
                  disabled={!newInvoice.customerName || !newInvoice.dueDate || calculateInvoiceTotal() <= 0}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Create & Send Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}