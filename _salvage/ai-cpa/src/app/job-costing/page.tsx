'use client';

import React, { useState } from 'react';
import { ArrowLeft, Plus, FileText, DollarSign, Users, Calendar, Building, Truck, Wrench, Search, Filter, Download, Upload } from 'lucide-react';
import { CostCodePostingEngine, COST_CODES, WIP_GL_ACCOUNTS, type JobPosting } from '@/lib/costCodeMapping';

interface Job {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'On Hold';
  totalBudget: number;
  totalActual: number;
  percentComplete: number;
}

export default function JobCostingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedJob, setSelectedJob] = useState<string>('JOB-2024-001');

  // Sample jobs data
  const [jobs] = useState<Job[]>([
    {
      id: 'JOB-2024-001',
      name: 'Downtown Office Complex - Building A',
      client: 'Metro Development Corp',
      startDate: '2024-01-15',
      endDate: '2024-08-30',
      status: 'Active',
      totalBudget: 2500000,
      totalActual: 1875000,
      percentComplete: 65
    },
    {
      id: 'JOB-2024-002',
      name: 'Residential Subdivision - Phase 2',
      client: 'Hometown Builders',
      startDate: '2024-03-01',
      endDate: '2024-12-15',
      status: 'Active',
      totalBudget: 1800000,
      totalActual: 720000,
      percentComplete: 35
    },
    {
      id: 'JOB-2023-045',
      name: 'Warehouse Renovation Project',
      client: 'Industrial Partners LLC',
      startDate: '2023-09-15',
      endDate: '2024-01-30',
      status: 'Completed',
      totalBudget: 850000,
      totalActual: 832000,
      percentComplete: 100
    }
  ]);

  // Sample job postings (cost code transactions)
  const [jobPostings] = useState<JobPosting[]>([
    {
      id: 'JP-001',
      jobId: 'JOB-2024-001',
      jobName: 'Downtown Office Complex - Building A',
      costCode: 'L001',
      costCodeName: 'Project Manager',
      description: 'Project management services - Week 12',
      amount: 5200,
      date: '2024-01-22',
      wipGLAccount: '1401',
      sourceDocument: 'Timesheet_PM_Week12.pdf',
      postedBy: 'Sarah Johnson',
      timestamp: '2024-01-22T14:30:00Z'
    },
    {
      id: 'JP-002',
      jobId: 'JOB-2024-001',
      jobName: 'Downtown Office Complex - Building A',
      costCode: 'M001',
      costCodeName: 'Lumber - Framing',
      description: 'Framing lumber delivery - Building A Level 3',
      amount: 15750,
      date: '2024-01-20',
      wipGLAccount: '1402',
      sourceDocument: 'Invoice_Lumber_001245.pdf',
      postedBy: 'Mike Chen',
      timestamp: '2024-01-20T09:15:00Z'
    },
    {
      id: 'JP-003',
      jobId: 'JOB-2024-001',
      jobName: 'Downtown Office Complex - Building A',
      costCode: 'E001',
      costCodeName: 'Excavator Rental',
      description: 'Excavator rental - Foundation work',
      amount: 3200,
      date: '2024-01-18',
      wipGLAccount: '1403',
      sourceDocument: 'Equipment_Rental_789.pdf',
      postedBy: 'David Kim',
      timestamp: '2024-01-18T16:45:00Z'
    },
    {
      id: 'JP-004',
      jobId: 'JOB-2024-001',
      jobName: 'Downtown Office Complex - Building A',
      costCode: 'S005',
      costCodeName: 'Electrical',
      description: 'Electrical rough-in - Building A Floors 1-3',
      amount: 45000,
      date: '2024-01-25',
      wipGLAccount: '1404',
      sourceDocument: 'Subcontractor_Invoice_ELC_001.pdf',
      postedBy: 'Lisa Park',
      timestamp: '2024-01-25T11:20:00Z'
    },
    {
      id: 'JP-005',
      jobId: 'JOB-2024-002',
      jobName: 'Residential Subdivision - Phase 2',
      costCode: 'S001',
      costCodeName: 'Site Preparation',
      description: 'Site preparation for lots 15-30',
      amount: 28000,
      date: '2024-01-24',
      wipGLAccount: '1404',
      sourceDocument: 'Site_Prep_Invoice_002.pdf',
      postedBy: 'John Davis',
      timestamp: '2024-01-24T13:10:00Z'
    }
  ]);

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePostJobCost = () => {
    // This would open a form to post new job costs
    alert(`📊 **Job Cost Posting**

**IMPORTANT: Cost Code to WIP GL Mapping**
Cost codes are for tracking only and never appear as GL accounts.

**Cost Code Categories:**
• L### (Labor) → Roll to 1401 - WIP Labor
• M### (Materials) → Roll to 1402 - WIP Materials
• E### (Equipment) → Roll to 1403 - WIP Equipment
• S### (Subcontractor) → Roll to 1404 - WIP Subcontractor
• O### (Other) → Roll to 1405 - WIP Other

**Example Posting:**
Job: ${selectedJob}
Cost Code: L001 - Project Manager
Amount: $5,200

**Journal Entry Created:**
DR: 1401 - WIP Labor         $5,200
CR: 2000 - Accounts Payable  $5,200

Job tracking maintains the cost code detail for reporting.`);
  };

  const handleTransferToCOGS = () => {
    const selectedJobData = jobs.find(j => j.id === selectedJob);
    alert(`🔄 **WIP to COGS Transfer**

**Job:** ${selectedJobData?.name}
**Completion:** ${selectedJobData?.percentComplete}%

**WIP Transfer Process:**
1. Calculate percentage completion
2. Transfer proportional WIP to COGS
3. Maintain cost code detail for analysis

**Sample Transfer Journal Entry:**
DR: 5000 - Cost of Goods Sold    $125,000
CR: 1401 - WIP Labor              $65,000
CR: 1402 - WIP Materials          $45,000
CR: 1404 - WIP Subcontractor      $15,000

This maintains GAAP compliance while preserving job costing detail.`);
  };

  const getJobCostSummary = (jobId: string) => {
    return CostCodePostingEngine.getJobCostSummary(jobId, jobPostings);
  };

  const selectedJobData = jobs.find(j => j.id === selectedJob);
  const jobCostSummary = getJobCostSummary(selectedJob);
  const jobPostingsForSelected = jobPostings.filter(jp => jp.jobId === selectedJob);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={handleBack} className="p-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Job Costing & WIP Management</h1>
                <p className="text-gray-400">Cost code tracking with WIP GL account mapping</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePostJobCost}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Post Job Cost</span>
            </button>
            <button
              onClick={handleTransferToCOGS}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Transfer to COGS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Job Selector & Key Metrics */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Job Selector */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-white mb-2">Active Job</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
            >
              {jobs.map(job => (
                <option key={job.id} value={job.id} className="bg-slate-800 text-white">
                  {job.name} - {job.client}
                </option>
              ))}
            </select>
            {selectedJobData && (
              <div className="mt-3 p-4 bg-white/5 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      selectedJobData.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                      selectedJobData.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {selectedJobData.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">% Complete:</span>
                    <span className="text-white ml-2 font-semibold">{selectedJobData.percentComplete}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Start:</span>
                    <span className="text-white ml-2">{new Date(selectedJobData.startDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">End:</span>
                    <span className="text-white ml-2">{new Date(selectedJobData.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Budget Summary */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-400">
                {selectedJobData ? formatCurrency(selectedJobData.totalBudget) : '$0'}
              </span>
            </div>
            <h3 className="text-white font-semibold">Total Budget</h3>
            <p className="text-gray-400 text-sm">Project budget</p>
          </div>

          {/* Actual Costs */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-400">
                {selectedJobData ? formatCurrency(selectedJobData.totalActual) : '$0'}
              </span>
            </div>
            <h3 className="text-white font-semibold">Actual Costs</h3>
            <p className="text-gray-400 text-sm">Posted to WIP</p>
          </div>
        </div>

        {/* WIP GL Account Summary */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Building className="w-5 h-5 text-blue-400" />
            <span>WIP GL Account Summary - {selectedJobData?.name}</span>
            <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Cost Codes Roll to WIP GLs</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
            {WIP_GL_ACCOUNTS.map((wipAccount) => {
              const summary = jobCostSummary.find(s => s.wipGLAccount === wipAccount.accountCode);
              const amount = summary ? summary.totalAmount : 0;

              return (
                <div key={wipAccount.accountCode} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-center">
                    <div className="p-3 bg-indigo-500/20 rounded-lg mx-auto w-fit mb-3">
                      {wipAccount.category === 'WIP_Labor' && <Users className="w-5 h-5 text-indigo-400" />}
                      {wipAccount.category === 'WIP_Materials' && <Wrench className="w-5 h-5 text-indigo-400" />}
                      {wipAccount.category === 'WIP_Equipment' && <Truck className="w-5 h-5 text-indigo-400" />}
                      {wipAccount.category === 'WIP_Subcontractor' && <Building className="w-5 h-5 text-indigo-400" />}
                      {wipAccount.category === 'WIP_Other' && <FileText className="w-5 h-5 text-indigo-400" />}
                    </div>
                    <h4 className="text-white font-semibold text-sm">{wipAccount.accountCode}</h4>
                    <p className="text-gray-400 text-xs mb-2">{wipAccount.accountName}</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(amount)}</p>
                    <p className="text-gray-400 text-xs">{summary ? summary.costCodeBreakdown.length : 0} cost codes</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cost Code Detail */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Cost Code Detail (Tracking Only - Not GL Accounts)</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Cost Code</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">WIP GL Account</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase">Amount</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-300 uppercase">Postings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {jobCostSummary.flatMap(summary =>
                    summary.costCodeBreakdown.map(breakdown => (
                      <tr key={breakdown.costCode} className="hover:bg-white/5">
                        <td className="px-4 py-2">
                          <span className="text-yellow-400 font-mono font-semibold">{breakdown.costCode}</span>
                        </td>
                        <td className="px-4 py-2 text-white">{breakdown.costCodeName}</td>
                        <td className="px-4 py-2">
                          <span className="text-blue-400 font-mono">{summary.wipGLAccount}</span>
                          <span className="text-gray-400 text-xs block">{summary.wipGLAccountName}</span>
                        </td>
                        <td className="px-4 py-2 text-right text-white font-mono">{formatCurrency(breakdown.amount)}</td>
                        <td className="px-4 py-2 text-center">
                          <span className="text-gray-400">{breakdown.postings.length}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {jobCostSummary.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No cost postings found for this job. Use "Post Job Cost" to add transactions.
              </div>
            )}
          </div>
        </div>

        {/* Recent Job Postings */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-400" />
            <span>Recent Job Postings</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Cost Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">WIP GL</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Posted By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {jobPostingsForSelected.map((posting) => (
                  <tr key={posting.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-gray-300">{new Date(posting.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="text-yellow-400 font-mono font-semibold">{posting.costCode}</span>
                      <span className="text-gray-400 text-xs block">{posting.costCodeName}</span>
                    </td>
                    <td className="px-4 py-3 text-white max-w-xs">
                      <div className="truncate">{posting.description}</div>
                      {posting.sourceDocument && (
                        <span className="text-blue-400 text-xs">{posting.sourceDocument}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-blue-400 font-mono">{posting.wipGLAccount}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-white font-mono font-semibold">
                      {formatCurrency(posting.amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{posting.postedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {jobPostingsForSelected.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No postings found for this job. Use "Post Job Cost" to add transactions.
            </div>
          )}
        </div>

        {/* Architecture Notice */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-2 flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>🏗️ GAAP-Compliant Job Costing Architecture</span>
          </h4>
          <div className="text-gray-300 text-sm space-y-1">
            <p><strong>✅ CORRECT:</strong> Cost codes (L001, M001, etc.) are tracking codes only - they roll up to WIP GL accounts (1401, 1402, etc.)</p>
            <p><strong>✅ CORRECT:</strong> Only WIP GL accounts appear in Chart of Accounts and Trial Balance</p>
            <p><strong>✅ CORRECT:</strong> Job profitability reports show cost code detail while GL shows summarized WIP balances</p>
            <p><strong>❌ WRONG:</strong> Never post cost codes directly as GL accounts - this violates GAAP and breaks financial reporting</p>
          </div>
        </div>
      </div>
    </div>
  );
}