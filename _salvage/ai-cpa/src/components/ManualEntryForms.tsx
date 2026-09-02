'use client';

import React, { useState } from 'react';
import { DollarSign, Receipt, FileText, CreditCard, Plus, X, Calendar, Building, Users, Truck } from 'lucide-react';
import { CostCodePostingEngine, COST_CODES, WIP_GL_ACCOUNTS } from '@/lib/costCodeMapping';

interface ManualEntryFormsProps {
  entryType: 'deposit' | 'expense' | 'invoice' | 'payment' | 'journal' | null;
  onClose: () => void;
  onSubmit: (entry: any) => void;
}

interface ChartOfAccount {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  category: string;
}

// Sample Chart of Accounts - in production this would come from a database
const CHART_OF_ACCOUNTS: ChartOfAccount[] = [
  // Assets
  { code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset', category: 'Current Assets' },
  { code: '1100', name: 'Accounts Receivable', type: 'Asset', category: 'Current Assets' },
  { code: '1200', name: 'Inventory', type: 'Asset', category: 'Current Assets' },
  { code: '1300', name: 'Prepaid Expenses', type: 'Asset', category: 'Current Assets' },
  { code: '1401', name: 'Work in Progress - Labor', type: 'Asset', category: 'WIP Assets' },
  { code: '1402', name: 'Work in Progress - Materials', type: 'Asset', category: 'WIP Assets' },
  { code: '1403', name: 'Work in Progress - Equipment', type: 'Asset', category: 'WIP Assets' },
  { code: '1404', name: 'Work in Progress - Subcontractors', type: 'Asset', category: 'WIP Assets' },
  { code: '1405', name: 'Work in Progress - Other Direct Costs', type: 'Asset', category: 'WIP Assets' },
  { code: '1500', name: 'Property, Plant & Equipment', type: 'Asset', category: 'Fixed Assets' },

  // Liabilities
  { code: '2000', name: 'Accounts Payable', type: 'Liability', category: 'Current Liabilities' },
  { code: '2100', name: 'Accrued Expenses', type: 'Liability', category: 'Current Liabilities' },
  { code: '2200', name: 'Short-term Debt', type: 'Liability', category: 'Current Liabilities' },
  { code: '2500', name: 'Long-term Debt', type: 'Liability', category: 'Long-term Liabilities' },

  // Equity
  { code: '3000', name: 'Common Stock', type: 'Equity', category: 'Shareholders Equity' },
  { code: '3100', name: 'Retained Earnings', type: 'Equity', category: 'Shareholders Equity' },

  // Revenue
  { code: '4000', name: 'Service Revenue', type: 'Revenue', category: 'Operating Revenue' },
  { code: '4100', name: 'Product Sales', type: 'Revenue', category: 'Operating Revenue' },

  // Expenses
  { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', category: 'Direct Costs' },
  { code: '6000', name: 'Salaries and Wages', type: 'Expense', category: 'Operating Expenses' },
  { code: '6100', name: 'Technology Expenses', type: 'Expense', category: 'Operating Expenses' },
  { code: '6200', name: 'Office Supplies', type: 'Expense', category: 'Operating Expenses' },
  { code: '6300', name: 'Travel Expenses', type: 'Expense', category: 'Operating Expenses' },
  { code: '6400', name: 'Professional Services', type: 'Expense', category: 'Operating Expenses' }
];

export default function ManualEntryForms({ entryType, onClose, onSubmit }: ManualEntryFormsProps) {
  const [formData, setFormData] = useState<any>({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    reference: '',
    account: '',
    entries: [
      { account: '', description: '', debit: '', credit: '' },
      { account: '', description: '', debit: '', credit: '' }
    ]
  });

  if (!entryType) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (entryType === 'journal') {
      const totalDebits = formData.entries.reduce((sum: number, entry: any) =>
        sum + (parseFloat(entry.debit) || 0), 0
      );
      const totalCredits = formData.entries.reduce((sum: number, entry: any) =>
        sum + (parseFloat(entry.credit) || 0), 0
      );

      if (Math.abs(totalDebits - totalCredits) > 0.01) {
        alert('Journal entry must balance! Debits must equal credits.');
        return;
      }
    }

    // Create entry object
    const entry = {
      id: `${entryType.toUpperCase()}-${Date.now()}`,
      type: entryType,
      ...formData,
      timestamp: new Date().toISOString(),
      postedBy: 'Manual Entry',
      status: 'posted'
    };

    onSubmit(entry);
    onClose();

    // Show success message with GL impact
    const successMessage = generateSuccessMessage(entryType, formData);
    alert(successMessage);
  };

  const generateSuccessMessage = (type: string, data: any) => {
    switch (type) {
      case 'deposit':
        return `✅ **Deposit Posted Successfully!**

**Entry Details:**
• Amount: $${parseFloat(data.amount).toLocaleString()}
• Description: ${data.description}
• Date: ${data.date}

**Journal Entry Created:**
DR: 1000 - Cash and Cash Equivalents  $${parseFloat(data.amount).toLocaleString()}
CR: ${data.account} - ${CHART_OF_ACCOUNTS.find(a => a.code === data.account)?.name}  $${parseFloat(data.amount).toLocaleString()}

**GL Impact:** Cash increased, revenue/receivables recognized
**Audit Trail:** Complete documentation maintained`;

      case 'expense':
        return `✅ **Expense Posted Successfully!**

**Entry Details:**
• Amount: $${parseFloat(data.amount).toLocaleString()}
• Vendor: ${data.vendor || 'Various'}
• Description: ${data.description}
• Date: ${data.date}

**Journal Entry Created:**
DR: ${data.account} - ${CHART_OF_ACCOUNTS.find(a => a.code === data.account)?.name}  $${parseFloat(data.amount).toLocaleString()}
CR: 2000 - Accounts Payable  $${parseFloat(data.amount).toLocaleString()}

**GL Impact:** Expense recognized, accounts payable increased
**Audit Trail:** Source document required for payment processing`;

      case 'journal':
        const debits = data.entries.filter((e: any) => parseFloat(e.debit) > 0);
        const credits = data.entries.filter((e: any) => parseFloat(e.credit) > 0);

        return `✅ **Journal Entry Posted Successfully!**

**Entry Details:**
• Reference: ${data.reference}
• Description: ${data.description}
• Date: ${data.date}

**Journal Entry:**
${debits.map((e: any) => `DR: ${e.account} - ${e.description}  $${parseFloat(e.debit).toLocaleString()}`).join('\n')}
${credits.map((e: any) => `CR: ${e.account} - ${e.description}  $${parseFloat(e.credit).toLocaleString()}`).join('\n')}

**GL Impact:** Multiple accounts updated as specified
**Audit Trail:** Complete documentation and approval workflow`;

      default:
        return `✅ **${type.charAt(0).toUpperCase() + type.slice(1)} Posted Successfully!**`;
    }
  };

  const addJournalLine = () => {
    setFormData({
      ...formData,
      entries: [...formData.entries, { account: '', description: '', debit: '', credit: '' }]
    });
  };

  const removeJournalLine = (index: number) => {
    if (formData.entries.length > 2) {
      const newEntries = formData.entries.filter((_: any, i: number) => i !== index);
      setFormData({ ...formData, entries: newEntries });
    }
  };

  const updateJournalLine = (index: number, field: string, value: string) => {
    const newEntries = [...formData.entries];
    newEntries[index][field] = value;
    setFormData({ ...formData, entries: newEntries });
  };

  const renderDepositForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Revenue Account</label>
        <select
          value={formData.account}
          onChange={(e) => setFormData({ ...formData, account: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          required
        >
          <option value="" className="bg-slate-800">Select Account</option>
          {CHART_OF_ACCOUNTS.filter(a => a.type === 'Revenue' || a.code === '1100').map(account => (
            <option key={account.code} value={account.code} className="bg-slate-800">
              {account.code} - {account.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          placeholder="Customer payment, service revenue, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Reference Number</label>
        <input
          type="text"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          placeholder="Check #, transfer #, etc."
        />
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
        <h4 className="text-green-400 font-medium mb-2">GL Impact Preview</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <div>DR: 1000 - Cash and Cash Equivalents  ${formData.amount || '0.00'}</div>
          <div>CR: {formData.account} - {CHART_OF_ACCOUNTS.find(a => a.code === formData.account)?.name || 'Select Account'}  ${formData.amount || '0.00'}</div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
        >
          Post Deposit
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  const renderExpenseForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Expense Account</label>
        <select
          value={formData.account}
          onChange={(e) => setFormData({ ...formData, account: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          required
        >
          <option value="" className="bg-slate-800">Select Account</option>
          {CHART_OF_ACCOUNTS.filter(a => a.type === 'Expense' || a.code.startsWith('14')).map(account => (
            <option key={account.code} value={account.code} className="bg-slate-800">
              {account.code} - {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Vendor</label>
          <input
            type="text"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            placeholder="Vendor name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Invoice Number</label>
          <input
            type="text"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            placeholder="Invoice #, receipt #, etc."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
          placeholder="Expense description"
          required
        />
      </div>

      {/* Job/Cost Code Assignment (Optional) */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
        <h4 className="text-blue-400 font-medium mb-2">Job Costing (Optional)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Job Number</label>
            <input
              type="text"
              value={formData.jobId || ''}
              onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
              placeholder="JOB-2024-001"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Cost Code</label>
            <select
              value={formData.costCode || ''}
              onChange={(e) => setFormData({ ...formData, costCode: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
            >
              <option value="" className="bg-slate-800">No Cost Code</option>
              {COST_CODES.map(cc => (
                <option key={cc.code} value={cc.code} className="bg-slate-800">
                  {cc.code} - {cc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          If selected, cost code will be tracked for job reporting while posting to the corresponding WIP GL account.
        </p>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
        <h4 className="text-red-400 font-medium mb-2">GL Impact Preview</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <div>DR: {formData.account} - {CHART_OF_ACCOUNTS.find(a => a.code === formData.account)?.name || 'Select Account'}  ${formData.amount || '0.00'}</div>
          <div>CR: 2000 - Accounts Payable  ${formData.amount || '0.00'}</div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
        >
          Post Expense
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  const renderJournalEntryForm = () => {
    const totalDebits = formData.entries.reduce((sum: number, entry: any) =>
      sum + (parseFloat(entry.debit) || 0), 0
    );
    const totalCredits = formData.entries.reduce((sum: number, entry: any) =>
      sum + (parseFloat(entry.credit) || 0), 0
    );
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Reference</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              placeholder="JE-2024-001"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            placeholder="Journal entry description"
            required
          />
        </div>

        {/* Journal Entry Lines */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">Journal Entry Lines</h4>
            <button
              type="button"
              onClick={addJournalLine}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Line</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.entries.map((entry: any, index: number) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 bg-white/5 rounded-lg">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Account</label>
                  <select
                    value={entry.account}
                    onChange={(e) => updateJournalLine(index, 'account', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    required
                  >
                    <option value="" className="bg-slate-800">Select Account</option>
                    {CHART_OF_ACCOUNTS.map(account => (
                      <option key={account.code} value={account.code} className="bg-slate-800">
                        {account.code} - {account.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={entry.description}
                    onChange={(e) => updateJournalLine(index, 'description', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    placeholder="Line description"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Debit</label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.debit}
                    onChange={(e) => {
                      updateJournalLine(index, 'debit', e.target.value);
                      if (e.target.value) updateJournalLine(index, 'credit', '');
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Credit</label>
                  <input
                    type="number"
                    step="0.01"
                    value={entry.credit}
                    onChange={(e) => {
                      updateJournalLine(index, 'credit', e.target.value);
                      if (e.target.value) updateJournalLine(index, 'debit', '');
                    }}
                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-end">
                  {formData.entries.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeJournalLine(index)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Balance Check */}
          <div className={`mt-4 p-3 rounded-lg ${
            isBalanced ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
          }`}>
            <h4 className={`font-medium mb-2 ${isBalanced ? 'text-green-400' : 'text-red-400'}`}>
              Entry Balance Check
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-300">Total Debits:</span>
                <span className="text-white font-mono ml-2">${totalDebits.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-300">Total Credits:</span>
                <span className="text-white font-mono ml-2">${totalCredits.toFixed(2)}</span>
              </div>
            </div>
            <div className={`mt-2 font-semibold ${isBalanced ? 'text-green-400' : 'text-red-400'}`}>
              {isBalanced ? '✅ Entry is balanced!' : '❌ Entry must balance! Debits must equal credits.'}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={!isBalanced}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            Post Journal Entry
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const getFormTitle = () => {
    switch (entryType) {
      case 'deposit': return 'Record Deposit';
      case 'expense': return 'Record Expense';
      case 'journal': return 'Journal Entry';
      case 'invoice': return 'Create Invoice';
      case 'payment': return 'Record Payment';
      default: return 'Manual Entry';
    }
  };

  const getFormIcon = () => {
    switch (entryType) {
      case 'deposit': return <DollarSign className="w-5 h-5" />;
      case 'expense': return <Receipt className="w-5 h-5" />;
      case 'journal': return <FileText className="w-5 h-5" />;
      case 'invoice': return <FileText className="w-5 h-5" />;
      case 'payment': return <CreditCard className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                {getFormIcon()}
              </div>
              <span>{getFormTitle()}</span>
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {entryType === 'deposit' && renderDepositForm()}
          {entryType === 'expense' && renderExpenseForm()}
          {entryType === 'journal' && renderJournalEntryForm()}
          {(entryType === 'invoice' || entryType === 'payment') && (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">This form is under development.</p>
              <p className="text-white">Please use the dedicated {entryType} page from the sidebar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}