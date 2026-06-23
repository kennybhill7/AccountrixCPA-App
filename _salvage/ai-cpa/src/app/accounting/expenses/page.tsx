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
  Car,
  Coffee,
  Plane,
  Wifi,
  Home,
  Users,
  Zap,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react';

interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  subcategory: string;
  vendor: string;
  employee: string;
  status: 'draft' | 'submitted' | 'approved' | 'paid' | 'rejected';
  paymentMethod: string;
  receiptUrl?: string;
  isRecurring: boolean;
  project?: string;
  notes?: string;
  approvedBy?: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  budget: number;
  spent: number;
  subcategories: string[];
}

interface Employee {
  id: string;
  name: string;
  department: string;
  totalExpenses: number;
  pendingExpenses: number;
  status: 'active' | 'inactive';
}

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('current-month');

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleExportExpenses = () => {
    if (expenses.length === 0) {
      alert('No expenses available for export.');
      return;
    }

    // Generate CSV content
    const csvHeaders = 'Expense ID,Date,Description,Amount,Category,Subcategory,Vendor,Employee,Status,Payment Method,Project,Approved By,Notes\n';
    const csvData = expenses.map(expense => {
      return `"${expense.id}","${expense.date}","${expense.description}","${expense.amount}","${expense.category}","${expense.subcategory}","${expense.vendor}","${expense.employee}","${expense.status}","${expense.paymentMethod}","${expense.project || ''}","${expense.approvedBy || ''}","${expense.notes || ''}"`;
    }).join('\n');

    const csvContent = csvHeaders + csvData;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ Expenses Export Complete!\n\nExported ${expenses.length} expenses to CSV file.\nFile downloaded: expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const [expenses] = useState<Expense[]>([
    {
      id: 'exp001',
      date: '2024-01-18',
      description: 'AWS Cloud Infrastructure - January',
      amount: 15000,
      category: 'Technology',
      subcategory: 'Cloud Services',
      vendor: 'Amazon Web Services',
      employee: 'System Admin',
      status: 'approved',
      paymentMethod: 'Corporate Card',
      receiptUrl: '/receipts/aws-jan-2024.pdf',
      isRecurring: true,
      project: 'Infrastructure',
      approvedBy: 'John Smith'
    },
    {
      id: 'exp002',
      date: '2024-01-17',
      description: 'Team lunch meeting with Enterprise Corp',
      amount: 450,
      category: 'Meals & Entertainment',
      subcategory: 'Business Meals',
      vendor: 'The Capital Grille',
      employee: 'Sarah Johnson',
      status: 'submitted',
      paymentMethod: 'Personal - Reimbursement',
      receiptUrl: '/receipts/lunch-jan-17.jpg',
      isRecurring: false,
      project: 'Sales'
    },
    {
      id: 'exp003',
      date: '2024-01-16',
      description: 'Flight to SF for client meeting',
      amount: 850,
      category: 'Travel',
      subcategory: 'Airfare',
      vendor: 'American Airlines',
      employee: 'Michael Chen',
      status: 'approved',
      paymentMethod: 'Corporate Card',
      receiptUrl: '/receipts/flight-sf-jan-16.pdf',
      isRecurring: false,
      project: 'Client Services',
      approvedBy: 'David Wilson'
    },
    {
      id: 'exp004',
      date: '2024-01-15',
      description: 'Office supplies and equipment',
      amount: 1200,
      category: 'Office Supplies',
      subcategory: 'General Supplies',
      vendor: 'Staples Business',
      employee: 'Office Manager',
      status: 'paid',
      paymentMethod: 'Corporate Card',
      receiptUrl: '/receipts/office-supplies-jan-15.pdf',
      isRecurring: false,
      project: 'Operations'
    },
    {
      id: 'exp005',
      date: '2024-01-14',
      description: 'Uber rides for client visits',
      amount: 125,
      category: 'Transportation',
      subcategory: 'Local Transport',
      vendor: 'Uber',
      employee: 'Sarah Johnson',
      status: 'rejected',
      paymentMethod: 'Personal - Reimbursement',
      notes: 'Receipts not provided for all rides',
      isRecurring: false,
      project: 'Sales'
    }
  ]);

  const [categories] = useState<Category[]>([
    {
      id: 'tech',
      name: 'Technology',
      icon: Wifi,
      color: 'blue',
      budget: 50000,
      spent: 35000,
      subcategories: ['Cloud Services', 'Software Licenses', 'Hardware', 'IT Support']
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: Plane,
      color: 'green',
      budget: 25000,
      spent: 18500,
      subcategories: ['Airfare', 'Hotels', 'Car Rental', 'Ground Transport']
    },
    {
      id: 'meals',
      name: 'Meals & Entertainment',
      icon: Coffee,
      color: 'yellow',
      budget: 8000,
      spent: 5200,
      subcategories: ['Business Meals', 'Team Events', 'Client Entertainment']
    },
    {
      id: 'office',
      name: 'Office Supplies',
      icon: Home,
      color: 'purple',
      budget: 5000,
      spent: 3200,
      subcategories: ['General Supplies', 'Furniture', 'Equipment']
    },
    {
      id: 'transport',
      name: 'Transportation',
      icon: Car,
      color: 'red',
      budget: 3000,
      spent: 1800,
      subcategories: ['Local Transport', 'Parking', 'Fuel']
    }
  ]);

  const [employees] = useState<Employee[]>([
    {
      id: 'emp001',
      name: 'Sarah Johnson',
      department: 'Sales',
      totalExpenses: 8500,
      pendingExpenses: 450,
      status: 'active'
    },
    {
      id: 'emp002',
      name: 'Michael Chen',
      department: 'Engineering',
      totalExpenses: 12000,
      pendingExpenses: 0,
      status: 'active'
    },
    {
      id: 'emp003',
      name: 'David Wilson',
      department: 'Operations',
      totalExpenses: 6200,
      pendingExpenses: 0,
      status: 'active'
    },
    {
      id: 'emp004',
      name: 'Emma Davis',
      department: 'Marketing',
      totalExpenses: 4500,
      pendingExpenses: 850,
      status: 'active'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'submitted': return 'bg-yellow-500/20 text-yellow-400';
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'paid': return 'bg-blue-500/20 text-blue-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'yellow': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'purple': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'red': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingApproval = expenses.filter(exp => exp.status === 'submitted').reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const budgetUtilization = (totalExpenses / monthlyBudget) * 100;

  const tabs = [
    { id: 'overview', name: 'Expense Overview', icon: Receipt },
    { id: 'expenses', name: 'All Expenses', icon: FileText },
    { id: 'categories', name: 'Categories', icon: PieChart },
    { id: 'employees', name: 'By Employee', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Accountrix Expense Management</h1>
                <p className="text-gray-400">Track and manage business expenses with Accountrix AI automation</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <AskAIButton />
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="current-month" className="text-black bg-white">Current Month</option>
              <option value="last-month" className="text-black bg-white">Last Month</option>
              <option value="current-quarter" className="text-black bg-white">Current Quarter</option>
              <option value="current-year" className="text-black bg-white">Current Year</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <Camera className="w-4 h-4" />
              <span>Scan Receipt</span>
            </button>
            <button
              onClick={handleExportExpenses}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Expense</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Receipt className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-purple-400">{formatCurrency(totalExpenses)}</span>
            </div>
            <h3 className="text-white font-semibold">Total Expenses</h3>
            <p className="text-gray-400 text-sm">Current month</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-yellow-400">{formatCurrency(pendingApproval)}</span>
            </div>
            <h3 className="text-white font-semibold">Pending Approval</h3>
            <p className="text-gray-400 text-sm">{expenses.filter(exp => exp.status === 'submitted').length} expenses</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-400">{budgetUtilization.toFixed(1)}%</span>
            </div>
            <h3 className="text-white font-semibold">Budget Utilization</h3>
            <p className="text-gray-400 text-sm">{formatCurrency(monthlyBudget)} total budget</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-400">92%</span>
            </div>
            <h3 className="text-white font-semibold">Auto-Processing</h3>
            <p className="text-gray-400 text-sm">AI receipt analysis</p>
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
                  ? 'border-purple-400 text-purple-400'
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
            {/* AI Expense Insights */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Expense Insights</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Budget Alert</span>
                    </div>
                    <p className="text-gray-300 text-sm">Technology expenses are 70% of monthly budget. Monitor cloud costs to avoid overage.</p>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Policy Compliance</span>
                    </div>
                    <p className="text-gray-300 text-sm">98% of expenses comply with company policy. Automated checks detected 2 anomalies requiring review.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Spending Trend</span>
                    </div>
                    <p className="text-gray-300 text-sm">Monthly expenses decreased 15% compared to last month. Travel costs reduced significantly.</p>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-medium">Quick Actions</span>
                    </div>
                    <p className="text-gray-300 text-sm">1 expense needs approval. 3 receipts missing from submitted expenses.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Budget Overview */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-blue-400" />
                <span>Budget vs Actual by Category</span>
              </h3>

              <div className="space-y-4">
                {categories.map((category) => {
                  const utilization = (category.spent / category.budget) * 100;
                  return (
                    <div key={category.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg border ${getCategoryColor(category.color)}`}>
                            <category.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{category.name}</h4>
                            <p className="text-gray-400 text-sm">{formatCurrency(category.spent)} of {formatCurrency(category.budget)}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${
                          utilization > 90 ? 'text-red-400' :
                          utilization > 75 ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {utilization.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            utilization > 90 ? 'bg-red-500' :
                            utilization > 75 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-400" />
                <span>Recent Expense Activity</span>
              </h3>

              <div className="space-y-3">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        expense.status === 'approved' ? 'bg-green-500/20' :
                        expense.status === 'submitted' ? 'bg-yellow-500/20' :
                        expense.status === 'rejected' ? 'bg-red-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{expense.description}</p>
                        <p className="text-gray-400 text-sm">{expense.employee} • {expense.category} • {expense.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{formatCurrency(expense.amount)}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-6">
            {/* Expense Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>More Filters</span>
                </button>
              </div>
            </div>

            {/* Expenses Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{expense.date}</td>
                        <td className="px-6 py-4 text-white">
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-gray-400 text-sm">{expense.vendor}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{expense.employee}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-300">{expense.category}</span>
                          <p className="text-gray-400 text-sm">{expense.subcategory}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">{formatCurrency(expense.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                            {expense.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-400 hover:text-blue-300">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-400 hover:text-green-300">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {expense.status === 'submitted' && (
                              <button className="text-purple-400 hover:text-purple-300">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
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

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Expense Categories</h3>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categories.map((category) => {
                const utilization = (category.spent / category.budget) * 100;
                return (
                  <div key={category.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg border ${getCategoryColor(category.color)}`}>
                          <category.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{category.name}</h4>
                          <p className="text-gray-400 text-sm">{category.subcategories.length} subcategories</p>
                        </div>
                      </div>
                      <span className={`text-lg font-bold ${
                        utilization > 90 ? 'text-red-400' :
                        utilization > 75 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {utilization.toFixed(1)}%
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Budget:</span>
                        <span className="text-white font-semibold">{formatCurrency(category.budget)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Spent:</span>
                        <span className="text-white font-semibold">{formatCurrency(category.spent)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Remaining:</span>
                        <span className={`font-semibold ${
                          (category.budget - category.spent) > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {formatCurrency(category.budget - category.spent)}
                        </span>
                      </div>

                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            utilization > 90 ? 'bg-red-500' :
                            utilization > 75 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        ></div>
                      </div>

                      <div className="pt-2">
                        <p className="text-gray-400 text-sm mb-2">Subcategories:</p>
                        <div className="flex flex-wrap gap-2">
                          {category.subcategories.map((sub, index) => (
                            <span key={index} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Employee Expense Summary</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {employees.map((employee) => (
                  <div key={employee.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                          <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{employee.name}</h4>
                          <p className="text-gray-400 text-sm">{employee.department}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Total Expenses:</span>
                        <span className="text-white font-semibold">{formatCurrency(employee.totalExpenses)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Pending:</span>
                        <span className={`font-semibold ${employee.pendingExpenses > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {formatCurrency(employee.pendingExpenses)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Expense Analytics by Employee</span>
              </h3>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-white mb-2">🤖 Employee Spending Insights:</p>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Sarah Johnson has highest travel expenses due to client visits in Q1</li>
                  <li>• Michael Chen consistently stays within technology budget limits</li>
                  <li>• Average processing time per expense: 2.3 hours (85% improvement with AI)</li>
                  <li>• 94% compliance rate across all employees with company expense policy</li>
                </ul>
                <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  View Detailed Analytics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}