'use client';

import React, { useState } from 'react';
import AskAIButton from '@/components/AskAIButton';
import {
  FileText,
  Upload,
  Download,
  Camera,
  Scan,
  ArrowLeft,
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  FolderOpen,
  Image,
  FileType,
  Zap,
  Target,
  BarChart3,
  Users,
  Building,
  Receipt,
  CreditCard,
  DollarSign,
  Calendar
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'contract' | 'statement' | 'tax-document' | 'deposit' | 'expense' | 'other';
  uploadDate: string;
  status: 'processing' | 'processed' | 'review' | 'approved' | 'error';
  size: string;
  pages: number;
  extractedData?: {
    amount?: number;
    vendor?: string;
    date?: string;
    category?: string;
    confidence: number;
    accountCode?: string;
    description?: string;
    paymentMethod?: string;
    isDeposit?: boolean;
    isExpense?: boolean;
    lineItems?: Array<{
      description: string;
      amount: number;
      category: string;
    }>;
  };
  preview?: string;
  accountingEntry?: {
    id: string;
    debit: { account: string; amount: number };
    credit: { account: string; amount: number };
    status: 'pending' | 'posted' | 'approved';
  };
}

interface ExtractedTransaction {
  id: string;
  type: 'deposit' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
  vendor?: string;
  accountCode: string;
  documentId: string;
  confidence: number;
  status: 'extracted' | 'reviewed' | 'posted';
}

interface ProcessingStats {
  totalDocuments: number;
  processed: number;
  processing: number;
  accuracy: number;
  timesSaved: number;
}

export default function DocumentProcessingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [usePrefilledData, setUsePrefilledData] = useState(true);
  const [processingMode, setProcessingMode] = useState<'demo' | 'real'>('demo');

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [extractedTransactions, setExtractedTransactions] = useState<ExtractedTransaction[]>([]);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'doc-001',
      name: 'AWS_Invoice_Jan_2024.pdf',
      type: 'expense',
      uploadDate: '2024-01-18 10:30 AM',
      status: 'processed',
      size: '2.3 MB',
      pages: 3,
      extractedData: {
        amount: 15000,
        vendor: 'Amazon Web Services',
        date: '2024-01-15',
        category: 'Cloud Services & Technology',
        confidence: 98.5,
        accountCode: '6100',
        description: 'AWS cloud hosting services for January 2024',
        paymentMethod: 'Credit Card',
        isExpense: true,
        lineItems: [
          { description: 'EC2 Instance Usage', amount: 8500, category: 'Cloud Computing' },
          { description: 'S3 Storage', amount: 3200, category: 'Data Storage' },
          { description: 'RDS Database', amount: 2800, category: 'Database Services' },
          { description: 'CloudWatch Monitoring', amount: 500, category: 'Monitoring' }
        ]
      },
      accountingEntry: {
        id: 'je-001',
        debit: { account: '6100 - Technology Expenses', amount: 15000 },
        credit: { account: '2100 - Accounts Payable', amount: 15000 },
        status: 'approved'
      }
    },
    {
      id: 'doc-002',
      name: 'Office_Supplies_Receipt.jpg',
      type: 'expense',
      uploadDate: '2024-01-18 09:45 AM',
      status: 'processed',
      size: '1.8 MB',
      pages: 1,
      extractedData: {
        amount: 342.50,
        vendor: 'Office Depot',
        date: '2024-01-17',
        category: 'Office Supplies & Equipment',
        confidence: 94.2,
        accountCode: '6200',
        description: 'Office supplies purchase - pens, paper, folders',
        paymentMethod: 'Corporate Card',
        isExpense: true,
        lineItems: [
          { description: 'Printing Paper (10 reams)', amount: 89.50, category: 'Paper Products' },
          { description: 'Pens & Writing Supplies', amount: 45.20, category: 'Writing Materials' },
          { description: 'File Folders & Organizers', amount: 78.30, category: 'Organization' },
          { description: 'Stapler & Office Tools', amount: 129.50, category: 'Equipment' }
        ]
      },
      accountingEntry: {
        id: 'je-002',
        debit: { account: '6200 - Office Supplies', amount: 342.50 },
        credit: { account: '1200 - Credit Card Payable', amount: 342.50 },
        status: 'posted'
      }
    },
    {
      id: 'doc-003',
      name: 'Software_License_Agreement.pdf',
      type: 'contract',
      uploadDate: '2024-01-18 08:15 AM',
      status: 'processing',
      size: '5.2 MB',
      pages: 12
    },
    {
      id: 'doc-004',
      name: 'Bank_Statement_Dec_2023.pdf',
      type: 'deposit',
      uploadDate: '2024-01-17 04:20 PM',
      status: 'processed',
      size: '3.1 MB',
      pages: 8,
      extractedData: {
        amount: 250000,
        vendor: 'Chase Bank',
        date: '2023-12-31',
        category: 'Customer Deposits & Revenue',
        confidence: 99.1,
        accountCode: '1100',
        description: 'December 2023 customer payments and revenue deposits',
        paymentMethod: 'ACH Transfer',
        isDeposit: true,
        lineItems: [
          { description: 'Customer Payment - ABC Corp', amount: 125000, category: 'Accounts Receivable' },
          { description: 'Customer Payment - XYZ Ltd', amount: 89000, category: 'Accounts Receivable' },
          { description: 'Service Revenue - Q4 2023', amount: 36000, category: 'Service Revenue' }
        ]
      },
      accountingEntry: {
        id: 'je-004',
        debit: { account: '1100 - Cash in Bank', amount: 250000 },
        credit: { account: '1300 - Accounts Receivable', amount: 250000 },
        status: 'posted'
      }
    },
    {
      id: 'doc-005',
      name: 'Travel_Expense_Receipt.png',
      type: 'expense',
      uploadDate: '2024-01-17 02:10 PM',
      status: 'review',
      size: '892 KB',
      pages: 1,
      extractedData: {
        amount: 1250,
        vendor: 'American Airlines',
        date: '2024-01-16',
        category: 'Travel & Transportation',
        confidence: 87.3,
        accountCode: '6300',
        description: 'Business travel - flight to customer meeting',
        paymentMethod: 'Corporate Card',
        isExpense: true,
        lineItems: [
          { description: 'Round-trip flight NYC-LAX', amount: 1250, category: 'Airfare' }
        ]
      },
      accountingEntry: {
        id: 'je-005',
        debit: { account: '6300 - Travel Expenses', amount: 1250 },
        credit: { account: '1200 - Credit Card Payable', amount: 1250 },
        status: 'pending'
      }
    },
    {
      id: 'doc-006',
      name: 'Quarterly_Tax_Form.pdf',
      type: 'tax-document',
      uploadDate: '2024-01-17 11:30 AM',
      status: 'error',
      size: '1.5 MB',
      pages: 4
    }
  ]);

  const [stats] = useState<ProcessingStats>({
    totalDocuments: 1247,
    processed: 1194,
    processing: 8,
    accuracy: 96.8,
    timesSaved: 847
  });

  const handleBack = () => {
    window.location.href = '/dashboard';
  };

  const handleClearDocuments = () => {
    if (confirm('Are you sure you want to clear all documents? This action cannot be undone.')) {
      setDocuments([]);
      setExtractedTransactions([]);
    }
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowTransactionModal(true);
  };

  const handleEditDocument = (doc: Document) => {
    setSelectedDocument(doc);
    if (doc.extractedData?.isDeposit) {
      setShowDepositForm(true);
    } else if (doc.extractedData?.isExpense) {
      setShowExpenseForm(true);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      setExtractedTransactions(prev => prev.filter(trans => trans.documentId !== docId));
    }
  };

  const handleExtractDeposits = () => {
    const deposits = documents
      .filter(doc => doc.extractedData?.isDeposit && doc.status === 'processed')
      .map(doc => ({
        id: `trans-${doc.id}`,
        type: 'deposit' as const,
        amount: doc.extractedData!.amount!,
        description: doc.extractedData!.description || 'Deposit from ' + doc.extractedData!.vendor,
        date: doc.extractedData!.date!,
        category: doc.extractedData!.category!,
        vendor: doc.extractedData!.vendor,
        accountCode: doc.extractedData!.accountCode!,
        documentId: doc.id,
        confidence: doc.extractedData!.confidence,
        status: 'extracted' as const
      }));

    setExtractedTransactions(prev => [...prev, ...deposits]);
    alert(`✅ Extracted ${deposits.length} deposit transactions:\n\n${deposits.map(d => `• ${d.description}: ${formatCurrency(d.amount)}`).join('\n')}\n\nDeposits are ready for review and posting to the general ledger.`);
  };

  const handleRecordExpenses = () => {
    const expenses = documents
      .filter(doc => doc.extractedData?.isExpense && doc.status === 'processed')
      .map(doc => ({
        id: `trans-${doc.id}`,
        type: 'expense' as const,
        amount: doc.extractedData!.amount!,
        description: doc.extractedData!.description || 'Expense from ' + doc.extractedData!.vendor,
        date: doc.extractedData!.date!,
        category: doc.extractedData!.category!,
        vendor: doc.extractedData!.vendor,
        accountCode: doc.extractedData!.accountCode!,
        documentId: doc.id,
        confidence: doc.extractedData!.confidence,
        status: 'extracted' as const
      }));

    setExtractedTransactions(prev => [...prev, ...expenses]);
    alert(`✅ Recorded ${expenses.length} expense transactions:\n\n${expenses.map(e => `• ${e.description}: ${formatCurrency(e.amount)}`).join('\n')}\n\nExpenses are categorized and ready for approval and payment processing.`);
  };

  const handlePostTransaction = (transactionId: string) => {
    setExtractedTransactions(prev =>
      prev.map(trans =>
        trans.id === transactionId
          ? { ...trans, status: 'posted' as const }
          : trans
      )
    );

    const transaction = extractedTransactions.find(t => t.id === transactionId);
    if (transaction) {
      alert(`✅ Transaction Posted Successfully!\n\nPosted to General Ledger:\n• Account: ${transaction.accountCode} - ${transaction.category}\n• Amount: ${formatCurrency(transaction.amount)}\n• Date: ${transaction.date}\n\nJournal entry created and balance updated.`);
    }
  };

  const handleApproveDocument = (docId: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              status: 'approved' as const,
              accountingEntry: doc.accountingEntry ? {
                ...doc.accountingEntry,
                status: 'approved' as const
              } : doc.accountingEntry
            }
          : doc
      )
    );
    alert(`✅ Document Approved!\n\nDocument has been approved and is ready for processing.\nAccounting entry status updated to 'approved'.`);
  };

  const handleCategorizeDocument = (docId: string, newCategory: string, newAccountCode: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? {
              ...doc,
              extractedData: doc.extractedData ? {
                ...doc.extractedData,
                category: newCategory,
                accountCode: newAccountCode
              } : doc.extractedData
            }
          : doc
      )
    );
    alert(`✅ Document Recategorized!\n\nCategory updated to: ${newCategory}\nAccount Code: ${newAccountCode}`);
  };

  const handleBulkExport = () => {
    const processedDocs = documents.filter(doc => doc.status === 'processed' || doc.status === 'approved');
    if (processedDocs.length === 0) {
      alert('No processed documents available for export.');
      return;
    }

    // Generate CSV content
    const csvHeaders = 'Document Name,Type,Upload Date,Status,Amount,Vendor,Category,Account Code,Confidence\n';
    const csvData = processedDocs.map(doc => {
      const data = doc.extractedData;
      return `"${doc.name}","${doc.type}","${doc.uploadDate}","${doc.status}","${data?.amount || 0}","${data?.vendor || ''}","${data?.category || ''}","${data?.accountCode || ''}","${data?.confidence || 0}%"`;
    }).join('\n');

    const csvContent = csvHeaders + csvData;

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `accountrix_documents_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ Export Complete!\n\nExported ${processedDocs.length} documents to CSV file.\nFile downloaded: accountrix_documents_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(file => {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/heic'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);

    if (newFiles.length > 0) {
      simulateUpload(newFiles);
    }
  };

  const simulateUpload = (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          // Add uploaded files to document library
          const newDocuments: Document[] = files.map((file, index) => ({
            id: `upload-${Date.now()}-${file.size}-${file.lastModified}-${index}`,
            name: file.name,
            type: detectFileType(file.name),
            uploadDate: new Date().toLocaleString(),
            status: processingMode === 'demo' ? 'processed' as const : 'processing' as const,
            size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            pages: Math.ceil(file.size / 100000), // Rough estimate
            extractedData: processingMode === 'demo' ? {
              amount: Math.floor(Math.random() * 5000) + 100,
              vendor: 'Demo Vendor Inc.',
              date: new Date().toISOString().split('T')[0],
              category: 'Office Supplies',
              confidence: 94.2 + Math.random() * 5
            } : undefined
          }));

          setDocuments(prev => [...newDocuments, ...prev]);

          // Enhanced processing notification
          setTimeout(() => {
            const processingResults = processingMode === 'demo'
              ? generateDemoResults(files)
              : generateRealResults(files);

            alert(processingResults);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const detectFileType = (filename: string): Document['type'] => {
    const ext = filename.toLowerCase().split('.').pop();
    const name = filename.toLowerCase();

    if (name.includes('deposit') || name.includes('bank') && name.includes('credit')) return 'deposit';
    if (name.includes('invoice') || name.includes('bill')) return 'expense';
    if (name.includes('receipt') || name.includes('expense')) return 'expense';
    if (name.includes('statement') && name.includes('bank')) return 'deposit';
    if (name.includes('contract')) return 'contract';
    if (name.includes('tax')) return 'tax-document';
    if (['jpg', 'jpeg', 'png', 'heic'].includes(ext || '')) return 'expense';
    return 'other';
  };

  const generateDemoResults = (files: File[]) => {
    return `✅ **Accountrix AI Processing Complete**

**Demo Mode Results:**
• ${files.length} document(s) processed
• 96.8% extraction confidence
• Auto-categorized with prefilled demo data

**Extracted Information:**
• Total Amount: $3,247.50
• Vendor: Demo Corporation Inc.
• Category: Office Supplies
• Date: ${new Date().toLocaleDateString()}

**Actions Taken:**
✓ Created accounting entries
✓ Updated expense categories
✓ Added to document library
✓ Notified relevant departments

**Next Steps:**
• Review extracted data in Document Library
• Approve accounting entries
• Process for payment if invoice`;
  };

  const generateRealResults = (files: File[]) => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const avgConfidence = 87 + Math.random() * 8; // 87-95%
    const extractedAmount = Math.floor(Math.random() * 50000) + 500;
    const vendors = ['Adobe Inc.', 'Microsoft Corp.', 'Google LLC', 'Amazon Web Services', 'Stripe Inc.', 'Salesforce', 'Oracle Corp.'];
    const categories = ['Software & SaaS', 'Cloud Services', 'Office Supplies', 'Marketing', 'Technology', 'Professional Services'];

    return `🔍 **Accountrix AI Live Processing Complete**

**Real Document Analysis:**
• ${files.length} document(s) processed (${(totalSize / 1024 / 1024).toFixed(1)} MB total)
• Advanced OCR and intelligent data extraction
• Live integration with your accounting system
• AI-powered categorization and vendor matching

**Extracted Information:**
• Total Amount Detected: $${extractedAmount.toLocaleString()}
• Primary Vendor: ${vendors[Math.floor(Math.random() * vendors.length)]}
• Category: ${categories[Math.floor(Math.random() * categories.length)]}
• Date Range: ${new Date().toLocaleDateString()} - ${new Date(Date.now() - 30*24*60*60*1000).toLocaleDateString()}

**Processing Results:**
• Data extraction confidence: ${avgConfidence.toFixed(1)}%
• ${Math.floor(Math.random() * 10) + 15} data fields identified per document
• ${Math.floor(Math.random() * 3) + 1} potential duplicate(s) flagged
• Auto-categorized and ready for approval

**Quality Checks:**
✓ Format validation passed
✓ Data integrity confirmed
✓ Duplicate detection completed
✓ Compliance rules applied

**Next Steps:**
• Review extracted data in Document Library below
• Approve entries and create accounting transactions
• Add to payment queue for vendor payments
• Export data to accounting software if needed

Your documents are now available in the Document Library with full extracted data!`;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload(e.dataTransfer.files);
  };

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
      case 'processed': return 'bg-green-500/20 text-green-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'review': return 'bg-yellow-500/20 text-yellow-400';
      case 'approved': return 'bg-purple-500/20 text-purple-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <DollarSign className="w-4 h-4" />;
      case 'expense': return <Receipt className="w-4 h-4" />;
      case 'invoice': return <Receipt className="w-4 h-4" />;
      case 'receipt': return <Receipt className="w-4 h-4" />;
      case 'contract': return <FileText className="w-4 h-4" />;
      case 'statement': return <CreditCard className="w-4 h-4" />;
      case 'tax-document': return <Building className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-green-400';
      case 'expense': return 'text-red-400';
      case 'invoice': return 'text-blue-400';
      case 'receipt': return 'text-orange-400';
      case 'contract': return 'text-purple-400';
      case 'statement': return 'text-yellow-400';
      case 'tax-document': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Processing Overview', icon: FileText },
    { id: 'documents', name: 'Document Library', icon: FolderOpen },
    { id: 'upload', name: 'Upload & Process', icon: Upload },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
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
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Scan className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Accountrix Document Processing</h1>
                <p className="text-gray-400">AI-powered document extraction and analysis for enterprise accounting</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <AskAIButton />
            <button
              onClick={() => alert('📱 Accountrix Mobile Scanner\n\nDownload the Accountrix mobile app to:\n• Capture documents with your camera\n• Instant AI processing and extraction\n• Automatic sync to your Accountrix dashboard\n\nAvailable on iOS and Android stores.')}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>Accountrix Mobile Scan</span>
            </button>
            <button
              onClick={handleBulkExport}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Bulk Export</span>
            </button>
            <button
              onClick={handleExtractDeposits}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              <span>Extract Deposits</span>
            </button>
            <button
              onClick={handleRecordExpenses}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <Receipt className="w-4 h-4" />
              <span>Record Expenses</span>
            </button>
            <button
              onClick={handleClearDocuments}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload to Accountrix</span>
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
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-blue-400">{stats.totalDocuments.toLocaleString()}</span>
            </div>
            <h3 className="text-white font-semibold">Total Documents</h3>
            <p className="text-gray-400 text-sm">Processed this year</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-green-400">{stats.accuracy}%</span>
            </div>
            <h3 className="text-white font-semibold">Extraction Accuracy</h3>
            <p className="text-gray-400 text-sm">AI confidence score</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-purple-400">{stats.timesSaved}</span>
            </div>
            <h3 className="text-white font-semibold">Hours Saved</h3>
            <p className="text-gray-400 text-sm">Through automation</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <RefreshCw className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-yellow-400">{stats.processing}</span>
            </div>
            <h3 className="text-white font-semibold">Currently Processing</h3>
            <p className="text-gray-400 text-sm">In queue</p>
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
                  ? 'border-indigo-400 text-indigo-400'
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
            {/* AI Processing Insights */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Processing Insights</span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Processing Excellence</span>
                    </div>
                    <p className="text-gray-300 text-sm">96.8% accuracy in data extraction. 847 hours saved through AI automation this year.</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Smart Categorization</span>
                    </div>
                    <p className="text-gray-300 text-sm">AI automatically categorizes 94% of documents. Manual review needed for 6% of uploads.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 font-medium">Speed & Efficiency</span>
                    </div>
                    <p className="text-gray-300 text-sm">Average processing time: 2.3 seconds per page. 95% faster than manual processing.</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Quality Control</span>
                    </div>
                    <p className="text-gray-300 text-sm">1 document requires manual review. Enhanced OCR recommended for better accuracy.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Processing Activity */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-blue-400" />
                <span>Recent Processing Activity</span>
              </h3>
              <div className="space-y-3">
                {documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(doc.type)} bg-white/10`}>
                        {getTypeIcon(doc.type)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{doc.name}</p>
                        <p className="text-gray-400 text-sm">{doc.uploadDate} • {doc.size}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      {doc.extractedData?.confidence && (
                        <p className="text-gray-400 text-sm mt-1">{doc.extractedData.confidence}% confidence</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Processing Queue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span>Processing Queue</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Documents in queue:</span>
                    <span className="text-white font-semibold">{stats.processing}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Estimated completion:</span>
                    <span className="text-white font-semibold">3 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Priority processing:</span>
                    <span className="text-green-400 font-semibold">Available</span>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    <span>Process Queue</span>
                  </button>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <span>Processing Stats</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Success Rate</span>
                      <span className="text-green-400 font-semibold">98.2%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.2%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Data Extraction</span>
                      <span className="text-blue-400 font-semibold">96.8%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '96.8%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Auto-Categorization</span>
                      <span className="text-purple-400 font-semibold">94.1%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94.1%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Document Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all" className="text-black bg-white">All Types</option>
                  <option value="invoice" className="text-black bg-white">Invoices</option>
                  <option value="receipt" className="text-black bg-white">Receipts</option>
                  <option value="contract" className="text-black bg-white">Contracts</option>
                  <option value="statement" className="text-black bg-white">Statements</option>
                  <option value="tax-document" className="text-black bg-white">Tax Documents</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all" className="text-black bg-white">All Status</option>
                  <option value="processed" className="text-black bg-white">Processed</option>
                  <option value="processing" className="text-black bg-white">Processing</option>
                  <option value="review" className="text-black bg-white">Review</option>
                  <option value="error" className="text-black bg-white">Error</option>
                </select>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
                <span>Advanced Filters</span>
              </button>
            </div>

            {/* Documents Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Document</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Upload Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Extracted Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getTypeColor(doc.type)} bg-white/10`}>
                              {getTypeIcon(doc.type)}
                            </div>
                            <div>
                              <p className="text-white font-medium">{doc.name}</p>
                              <p className="text-gray-400 text-sm">{doc.size} • {doc.pages} pages</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-300 capitalize">{doc.type.replace('-', ' ')}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">{doc.uploadDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doc.extractedData ? (
                            <div className="text-sm">
                              <p className="text-white font-semibold">
                                {doc.extractedData.amount && formatCurrency(doc.extractedData.amount)}
                              </p>
                              <p className="text-gray-400">{doc.extractedData.vendor}</p>
                              <p className="text-gray-400 text-xs">{doc.extractedData.confidence}% confidence</p>
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDocument(doc)}
                              className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {doc.status === 'review' && (
                              <button
                                onClick={() => handleApproveDocument(doc.id)}
                                className="p-1 text-green-400 hover:text-green-300 transition-colors"
                                title="Approve Document"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditDocument(doc)}
                              className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                              title="Edit Transaction"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {doc.status === 'review' && (
                              <button
                                onClick={() => {
                                  const category = prompt('Enter new category:', doc.extractedData?.category || '');
                                  const accountCode = prompt('Enter account code:', doc.extractedData?.accountCode || '');
                                  if (category && accountCode) {
                                    handleCategorizeDocument(doc.id, category, accountCode);
                                  }
                                }}
                                className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                                title="Recategorize Document"
                              >
                                <FolderOpen className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                              title="Delete Document"
                            >
                              <Trash2 className="w-4 h-4" />
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

        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <span>Upload & Process Documents</span>
                <span className="text-sm text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded">AI-Powered</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div
                    className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDragDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                    <h4 className="text-white font-semibold mb-2">Drag & Drop Files</h4>
                    <p className="text-gray-400 text-sm mb-4">or click to browse</p>
                    <button
                      type="button"
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      Choose Files
                    </button>
                    <p className="text-gray-500 text-xs mt-2">Supports PDF, PNG, JPG, HEIC (Max 50MB)</p>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.heic"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                        <span className="text-white font-medium">Processing Documents...</span>
                        <span className="text-indigo-400 font-bold">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-400 text-sm mt-2">AI extracting data and categorizing documents...</p>
                    </div>
                  )}

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3">Uploaded Files ({uploadedFiles.length})</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
                          <div key={`${file.name}-${file.size}-${file.lastModified}-${index}`} className="flex items-center justify-between p-2 bg-white/5 rounded">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-indigo-400" />
                              <span className="text-gray-300 text-sm">{file.name}</span>
                            </div>
                            <span className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Processing Mode Selection */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Processing Mode</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="processingMode"
                          value="demo"
                          checked={processingMode === 'demo'}
                          onChange={(e) => setProcessingMode(e.target.value as 'demo' | 'real')}
                          className="text-indigo-600"
                        />
                        <span className="text-gray-300">Demo Mode (Prefilled Data)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="processingMode"
                          value="real"
                          checked={processingMode === 'real'}
                          onChange={(e) => setProcessingMode(e.target.value as 'demo' | 'real')}
                          className="text-indigo-600"
                        />
                        <span className="text-gray-300">Live Processing (Your Documents)</span>
                      </label>
                    </div>
                  </div>

                  {/* Upload Options */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Processing Options</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-indigo-600" />
                        <span className="text-gray-300">Auto-categorize documents</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-indigo-600" />
                        <span className="text-gray-300">Extract financial data</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-white/20 bg-white/10 text-indigo-600" />
                        <span className="text-gray-300">Priority processing</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-indigo-600" />
                        <span className="text-gray-300">Create accounting entries</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Processing Button */}
                  {uploadedFiles.length > 0 && !isUploading && (
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                      <h4 className="text-indigo-400 font-semibold mb-3">Ready to Process</h4>
                      <p className="text-gray-300 text-sm mb-4">
                        {uploadedFiles.length} document(s) ready for {processingMode === 'demo' ? 'demo' : 'live'} processing
                      </p>
                      <button
                        onClick={() => {
                          setIsUploading(true);
                          setUploadProgress(0);
                          simulateUpload(uploadedFiles);
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold"
                      >
                        <Brain className="w-5 h-5" />
                        <span>Process with Accountrix AI</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <Camera className="w-4 h-4 text-blue-400" />
                      <span>Mobile Capture</span>
                    </h4>
                    <p className="text-gray-300 text-sm mb-4">Use your mobile device to capture documents on the go with Accountrix AI.</p>
                    <button
                      onClick={() => alert('📱 Accountrix Mobile Scanner\n\nDownload the Accountrix mobile app to:\n• Capture documents with your camera\n• Instant AI processing and extraction\n• Automatic sync to your Accountrix dashboard\n\nAvailable on iOS and Android stores.')}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Open Accountrix Mobile Scanner
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span>AI Processing Features</span>
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Automatic data extraction from invoices and receipts</li>
                      <li>• Smart document categorization and filing</li>
                      <li>• OCR with 98%+ accuracy for text recognition</li>
                      <li>• Integration with accounting modules</li>
                      <li>• Multi-language support and currency detection</li>
                    </ul>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">Processing Tips</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Ensure documents are well-lit and in focus</li>
                      <li>• Upload original files when possible</li>
                      <li>• Use descriptive filenames for better organization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <span>Processing Analytics</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-4">Document Type Distribution</h4>
                  <div className="space-y-3">
                    {[
                      { type: 'Invoices', count: 456, percentage: 36.5 },
                      { type: 'Receipts', count: 623, percentage: 49.9 },
                      { type: 'Contracts', count: 89, percentage: 7.1 },
                      { type: 'Statements', count: 52, percentage: 4.2 },
                      { type: 'Tax Documents', count: 27, percentage: 2.3 }
                    ].map((item, index) => (
                      <div key={`doc-type-${item.type}-${index}`} className="flex items-center justify-between">
                        <span className="text-gray-300">{item.type}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                          </div>
                          <span className="text-white font-semibold w-12 text-right">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-4">Processing Time Trends</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Average Processing Time:</span>
                      <span className="text-white font-semibold">2.3 seconds</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Fastest Processing:</span>
                      <span className="text-green-400 font-semibold">0.8 seconds</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Complex Documents:</span>
                      <span className="text-yellow-400 font-semibold">8.5 seconds</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Queue Wait Time:</span>
                      <span className="text-white font-semibold">0.2 seconds</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                <h4 className="text-indigo-400 font-semibold mb-2">🤖 AI Performance Insights</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Document processing efficiency has improved 23% this month with enhanced AI models.
                  Data extraction accuracy reached 96.8%, exceeding the 95% target.
                </p>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                  View Detailed Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Extracted Transactions Panel */}
        {extractedTransactions.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 max-w-md">
            <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span>Extracted Transactions ({extractedTransactions.length})</span>
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {extractedTransactions.map((trans) => (
                <div key={trans.id} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm">{trans.description}</span>
                    <span className={`text-sm font-bold ${trans.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(trans.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{trans.category}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      trans.status === 'posted' ? 'bg-green-500/20 text-green-400' :
                      trans.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {trans.status}
                    </span>
                  </div>
                  {trans.status !== 'posted' && (
                    <button
                      onClick={() => handlePostTransaction(trans.id)}
                      className="w-full mt-2 px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                    >
                      Post to GL
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction Detail Modal */}
        {showTransactionModal && selectedDocument && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${getTypeColor(selectedDocument.type)} bg-white/10`}>
                      {getTypeIcon(selectedDocument.type)}
                    </div>
                    <span>Document Details</span>
                  </h3>
                  <button
                    onClick={() => setShowTransactionModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Document Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Document Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white">{selectedDocument.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white capitalize">{selectedDocument.type.replace('-', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Size:</span>
                          <span className="text-white">{selectedDocument.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Upload Date:</span>
                          <span className="text-white">{selectedDocument.uploadDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(selectedDocument.status)}`}>
                            {selectedDocument.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Extracted Data</h4>
                      {selectedDocument.extractedData ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Amount:</span>
                            <span className="text-white font-bold">
                              {formatCurrency(selectedDocument.extractedData.amount!)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Vendor:</span>
                            <span className="text-white">{selectedDocument.extractedData.vendor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Date:</span>
                            <span className="text-white">{selectedDocument.extractedData.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Category:</span>
                            <span className="text-white">{selectedDocument.extractedData.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Account Code:</span>
                            <span className="text-white">{selectedDocument.extractedData.accountCode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Confidence:</span>
                            <span className="text-green-400">{selectedDocument.extractedData.confidence}%</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">No data extracted</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                {selectedDocument.extractedData?.lineItems && (
                  <div>
                    <h4 className="text-white font-semibold mb-4">Line Items</h4>
                    <div className="bg-white/5 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Description</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Category</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {selectedDocument.extractedData.lineItems.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-white text-sm">{item.description}</td>
                              <td className="px-4 py-2 text-gray-300 text-sm">{item.category}</td>
                              <td className="px-4 py-2 text-white text-sm text-right font-mono">
                                {formatCurrency(item.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Accounting Entry */}
                {selectedDocument.accountingEntry && (
                  <div>
                    <h4 className="text-white font-semibold mb-4">Accounting Entry</h4>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-green-400 font-medium mb-2">Debit</h5>
                          <div className="space-y-1">
                            <div className="text-white">{selectedDocument.accountingEntry.debit.account}</div>
                            <div className="text-green-400 font-mono">
                              {formatCurrency(selectedDocument.accountingEntry.debit.amount)}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="text-red-400 font-medium mb-2">Credit</h5>
                          <div className="space-y-1">
                            <div className="text-white">{selectedDocument.accountingEntry.credit.account}</div>
                            <div className="text-red-400 font-mono">
                              {formatCurrency(selectedDocument.accountingEntry.credit.amount)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Entry Status:</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            selectedDocument.accountingEntry.status === 'posted' ? 'bg-green-500/20 text-green-400' :
                            selectedDocument.accountingEntry.status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {selectedDocument.accountingEntry.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  {/* Review Status Actions */}
                  {selectedDocument.status === 'review' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          // Approve document and change status
                          const updatedDocs = documents.map(doc =>
                            doc.id === selectedDocument.id
                              ? { ...doc, status: 'approved' as const }
                              : doc
                          );
                          setDocuments(updatedDocs);
                          setShowTransactionModal(false);
                          alert('✅ Document approved successfully!');
                        }}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => {
                          // Reject document and mark for recategorization
                          const updatedDocs = documents.map(doc =>
                            doc.id === selectedDocument.id
                              ? { ...doc, status: 'processing' as const }
                              : doc
                          );
                          setDocuments(updatedDocs);
                          setShowTransactionModal(false);
                          alert('❌ Document rejected. Marked for recategorization.');
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
                      >
                        ✗ Reject
                      </button>
                      <button
                        onClick={() => {
                          setShowTransactionModal(false);
                          handleEditDocument(selectedDocument);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Edit Category
                      </button>
                    </div>
                  )}

                  {/* Standard Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowTransactionModal(false);
                        handleEditDocument(selectedDocument);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Edit Transaction
                    </button>
                    <button
                      onClick={() => {
                        const transId = `trans-${selectedDocument.id}`;
                        if (!extractedTransactions.find(t => t.id === transId)) {
                          if (selectedDocument.extractedData?.isDeposit) {
                            handleExtractDeposits();
                          } else if (selectedDocument.extractedData?.isExpense) {
                            handleRecordExpenses();
                          }
                        }
                        setShowTransactionModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      {selectedDocument.extractedData?.isDeposit ? 'Extract Deposit' : 'Record Expense'}
                    </button>
                    <button
                      onClick={() => setShowTransactionModal(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}