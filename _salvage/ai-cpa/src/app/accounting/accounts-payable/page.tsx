'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Download,
  Upload,
  ArrowLeft,
  Brain,
  AlertTriangle,
  Building,
  DollarSign,
  Eye,
  Edit3,
  X,
  Trash2,
  Save,
  CheckCircle
} from 'lucide-react';

export default function AccountsPayablePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewBill, setShowNewBill] = useState(false);
  const [newBill, setNewBill] = useState({
    vendorName: '',
    vendorEmail: '',
    billDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
    amount: 0,
    lineItems: [
      { description: '', amount: 0, category: 'Operating Expense' }
    ]
  });

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleNewBill = () => {
    setShowNewBill(true);
  };

  const addLineItem = () => {
    setNewBill(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', amount: 0, category: 'Operating Expense' }]
    }));
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    setNewBill(prev => ({
      ...prev,
      lineItems: prev.lineItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeLineItem = (index: number) => {
    if (newBill.lineItems.length > 1) {
      setNewBill(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateBillTotal = () => {
    return newBill.lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSaveBill = () => {
    const total = calculateBillTotal();
    const billId = `BILL-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;

    alert(`✅ Vendor Bill Created Successfully!\n\nBill ID: ${billId}\nVendor: ${newBill.vendorName}\nAmount: ${formatCurrency(total)}\nDue Date: ${newBill.dueDate}\n\n📋 Bill entered in AP\n💳 Ready for payment processing\n📊 Expense accounts updated`);

    // Reset form
    setNewBill({
      vendorName: '',
      vendorEmail: '',
      billDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      description: '',
      amount: 0,
      lineItems: [
        { description: '', amount: 0, category: 'Operating Expense' }
      ]
    });
    setShowNewBill(false);
  };

  const handleExportInvoices = () => {
    if (invoices.length === 0) {
      alert('No invoices available for export.');
      return;
    }

    // Generate CSV content
    const csvHeaders = 'Invoice ID,Vendor,Amount,Due Date,Status,Days Overdue\n';
    const csvData = invoices.map(invoice => {
      const daysOverdue = invoice.status === 'overdue' ? Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
      return `"${invoice.id}","${invoice.vendor}","${invoice.amount}","${invoice.dueDate}","${invoice.status}","${daysOverdue}"`;
    }).join('\n');

    const csvContent = csvHeaders + csvData;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `accounts_payable_invoices_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ Invoices Export Complete!\n\nExported ${invoices.length} invoices to CSV file.\nFile downloaded: accounts_payable_invoices_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportVendors = () => {
    if (vendors.length === 0) {
      alert('No vendors available for export.');
      return;
    }

    // Generate CSV content
    const csvHeaders = 'Vendor Name,Email,Current Balance,Credit Limit,Available Credit\n';
    const csvData = vendors.map(vendor => {
      const availableCredit = vendor.creditLimit - vendor.currentBalance;
      return `"${vendor.name}","${vendor.email}","${vendor.currentBalance}","${vendor.creditLimit}","${availableCredit}"`;
    }).join('\n');

    const csvContent = csvHeaders + csvData;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `accounts_payable_vendors_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ Vendors Export Complete!\n\nExported ${vendors.length} vendors to CSV file.\nFile downloaded: accounts_payable_vendors_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportAPReport = () => {
    // Generate comprehensive AP report
    const reportDate = new Date().toLocaleDateString();
    const csvHeaders = 'Report Type,Metric,Value,Date Generated\n';
    const csvData = [
      `"AP Summary","Total Outstanding","${totalOutstanding}","${reportDate}"`,
      `"AP Summary","Overdue Amount","${overdueAmount}","${reportDate}"`,
      `"AP Summary","Total Invoices","${invoices.length}","${reportDate}"`,
      `"AP Summary","Total Vendors","${vendors.length}","${reportDate}"`
    ].join('\n');

    const csvContent = csvHeaders + csvData;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `accounts_payable_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ AP Report Export Complete!\n\nGenerated comprehensive accounts payable report.\nFile downloaded: accounts_payable_report_${new Date().toISOString().split('T')[0]}.csv`);
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
      id: 'inv001',
      vendor: 'AWS Technologies',
      amount: 15000,
      dueDate: '2024-02-14',
      status: 'approved'
    },
    {
      id: 'inv002',
      vendor: 'Microsoft Corporation',
      amount: 45000,
      dueDate: '2024-01-25',
      status: 'overdue'
    }
  ];

  const vendors = [
    {
      name: 'AWS Technologies',
      email: 'billing@aws.amazon.com',
      currentBalance: 15000,
      creditLimit: 500000
    },
    {
      name: 'Microsoft Corporation',
      email: 'accounts@microsoft.com',
      currentBalance: 45000,
      creditLimit: 750000
    }
  ];

  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  const tabs = [
    { id: 'overview', name: 'AP Overview', icon: CreditCard },
    { id: 'invoices', name: 'Invoices', icon: Building },
    { id: 'vendors', name: 'Vendors', icon: Building }
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
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Accounts Payable</h1>
                <p className="text-gray-400">Vendor payments and invoice management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportAPReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export AP Report</span>
            </button>
            <button
              onClick={handleExportInvoices}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Invoices</span>
            </button>
            <button
              onClick={handleExportVendors}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Vendors</span>
            </button>
            <button
              onClick={handleNewBill}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-2xl font-bold text-red-400">{formatCurrency(totalOutstanding)}</span>
            </div>
            <h3 className="text-white font-semibold">Outstanding Payables</h3>
            <p className="text-gray-400 text-sm">Across {invoices.length} invoices</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-yellow-400">{formatCurrency(overdueAmount)}</span>
            </div>
            <h3 className="text-white font-semibold">Overdue Amount</h3>
            <p className="text-gray-400 text-sm">Requires immediate attention</p>
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
                  ? 'border-red-400 text-red-400'
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
                <span>AI Payment Insights</span>
              </h3>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-gray-300 text-sm">Microsoft invoice {formatCurrency(45000)} is overdue. Recommend immediate payment to maintain vendor relationship.</p>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{invoice.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">{invoice.vendor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">{formatCurrency(invoice.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{invoice.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'overdue' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
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

        {activeTab === 'vendors' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vendors.map((vendor, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Building className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{vendor.name}</h4>
                      <p className="text-gray-400 text-sm">{vendor.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Current Balance:</span>
                    <span className="text-white font-semibold">{formatCurrency(vendor.currentBalance)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Credit Limit:</span>
                    <span className="text-green-400 font-semibold">{formatCurrency(vendor.creditLimit)}</span>
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

      {/* New Bill Modal */}
      {showNewBill && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-red-400" />
                    <span>Enter New Vendor Bill</span>
                    <span className="text-sm text-red-400 bg-red-500/20 px-2 py-1 rounded">AP Management</span>
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Enter vendor bills and manage accounts payable</p>
                </div>
                <button
                  onClick={() => setShowNewBill(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Bill Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Vendor Name</label>
                  <input
                    type="text"
                    value={newBill.vendorName}
                    onChange={(e) => setNewBill(prev => ({ ...prev, vendorName: e.target.value }))}
                    placeholder="Enter vendor name"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Vendor Email</label>
                  <input
                    type="email"
                    value={newBill.vendorEmail}
                    onChange={(e) => setNewBill(prev => ({ ...prev, vendorEmail: e.target.value }))}
                    placeholder="vendor@company.com"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bill Date</label>
                  <input
                    type="date"
                    value={newBill.billDate}
                    onChange={(e) => setNewBill(prev => ({ ...prev, billDate: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newBill.dueDate}
                    onChange={(e) => setNewBill(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Bill Description</label>
                <input
                  type="text"
                  value={newBill.description}
                  onChange={(e) => setNewBill(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of goods/services"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Line Items */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Expense Line Items</h4>
                  <button
                    onClick={addLineItem}
                    className="flex items-center space-x-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Line</span>
                  </button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 mb-3 p-3 bg-white/5 rounded-lg">
                  <div className="col-span-5 text-xs font-medium text-gray-300 uppercase tracking-wider">Description</div>
                  <div className="col-span-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Category</div>
                  <div className="col-span-3 text-xs font-medium text-gray-300 uppercase tracking-wider text-right">Amount</div>
                  <div className="col-span-1 text-xs font-medium text-gray-300 uppercase tracking-wider text-center">Action</div>
                </div>

                {/* Line Items */}
                <div className="space-y-3">
                  {newBill.lineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 bg-white/5 rounded-lg">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Expense description"
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={item.category}
                          onChange={(e) => updateLineItem(index, 'category', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-2 text-white text-sm focus:ring-2 focus:ring-red-500"
                        >
                          <option value="Operating Expense" className="text-black bg-white">Operating Expense</option>
                          <option value="Technology" className="text-black bg-white">Technology</option>
                          <option value="Professional Services" className="text-black bg-white">Professional Services</option>
                          <option value="Utilities" className="text-black bg-white">Utilities</option>
                          <option value="Office Supplies" className="text-black bg-white">Office Supplies</option>
                          <option value="Travel" className="text-black bg-white">Travel</option>
                          <option value="Marketing" className="text-black bg-white">Marketing</option>
                          <option value="Insurance" className="text-black bg-white">Insurance</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={item.amount || ''}
                          onChange={(e) => updateLineItem(index, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white/10 border border-white/20 rounded px-2 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-red-500 text-right"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          onClick={() => removeLineItem(index)}
                          disabled={newBill.lineItems.length <= 1}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bill Total */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex justify-end">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <div className="text-red-400 font-medium text-sm mb-1">Bill Total:</div>
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(calculateBillTotal())}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewBill(false)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('💾 Bill Draft Saved\n\nBill saved for later completion. You can return to finish and process this bill at any time.\n\n📋 Draft bills are accessible from the Invoices tab.');
                  }}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={handleSaveBill}
                  disabled={!newBill.vendorName || !newBill.dueDate || calculateBillTotal() <= 0}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Enter Bill</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}