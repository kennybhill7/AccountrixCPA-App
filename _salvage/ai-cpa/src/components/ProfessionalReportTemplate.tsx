'use client';

import React, { useState } from 'react';
import {
  Download,
  Printer,
  Mail,
  Eye,
  Calendar,
  Info,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface ReportHeader {
  companyName: string;
  reportTitle: string;
  periodEnding: string;
  preparationDate: string;
  pageNumber?: number;
  totalPages?: number;
}

interface AccountLineItem {
  accountCode: string;
  accountName: string;
  currentPeriod: number;
  priorPeriod?: number;
  note?: string;
  hasDetail?: boolean;
  isSubtotal?: boolean;
  isTotal?: boolean;
  level: number; // For indentation
  parentAccount?: string;
}

interface ReportSection {
  sectionName: string;
  sectionTotal?: number;
  accounts: AccountLineItem[];
}

interface ProfessionalReportTemplateProps {
  header: ReportHeader;
  sections: ReportSection[];
  showComparative?: boolean;
  reportType: 'balance-sheet' | 'income-statement' | 'cash-flow' | 'trial-balance' | 'general-ledger';
  gaapCompliant?: boolean;
  auditTrail?: boolean;
  onDrillDown?: (accountCode: string, accountName: string) => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export default function ProfessionalReportTemplate({
  header,
  sections,
  showComparative = true,
  reportType,
  gaapCompliant = true,
  auditTrail = true,
  onDrillDown,
  onExportPDF,
  onExportExcel
}: ProfessionalReportTemplateProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showNotes, setShowNotes] = useState(false);

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));

    // Add parentheses for negative amounts (GAAP standard)
    return amount < 0 ? `(${formatted.replace('$', '')})`  : formatted;
  };

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const handleDrillDown = (accountCode: string, accountName: string) => {
    if (onDrillDown) {
      onDrillDown(accountCode, accountName);
    }
  };

  const getIndentationClass = (level: number) => {
    const indentMap: { [key: number]: string } = {
      0: 'ml-0',
      1: 'ml-6',
      2: 'ml-12',
      3: 'ml-18',
      4: 'ml-24'
    };
    return indentMap[level] || 'ml-0';
  };

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Modern Header with Accountrix Touch */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-300 p-4 print:bg-white print:p-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center print:hidden">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{header.companyName}</h2>
              <p className="text-sm text-gray-600">Prepared by Accountrix AI CPA</p>
            </div>
          </div>

          {/* Action Buttons - Hidden in Print */}
          <div className="flex items-center space-x-2 print:hidden">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors text-sm"
            >
              <Info className="w-4 h-4" />
              <span>Notes</span>
            </button>
            <button
              onClick={onExportPDF}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={onExportExcel}
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Compliance Badges */}
        {(gaapCompliant || auditTrail) && (
          <div className="flex items-center space-x-2 mb-2">
            {gaapCompliant && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                GAAP Compliant
              </span>
            )}
            {auditTrail && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                Audit Trail Available
              </span>
            )}
          </div>
        )}
      </div>

      {/* Professional Report Header */}
      <div className="bg-white border-b-2 border-black p-6 text-center">
        <h1 className="text-2xl font-bold text-black mb-1">{header.companyName}</h1>
        <h2 className="text-xl font-semibold text-black mb-1">{header.reportTitle}</h2>
        <h3 className="text-lg text-black mb-2">{header.periodEnding}</h3>
        <div className="text-sm text-gray-600">
          <span>Prepared on {header.preparationDate}</span>
          {header.pageNumber && (
            <span className="ml-4">Page {header.pageNumber} of {header.totalPages}</span>
          )}
        </div>
      </div>

      {/* Professional Report Body */}
      <div className="p-6">
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-2">
              {/* Section Header */}
              <div className="flex items-center justify-between py-2 border-b border-gray-400">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSection(section.sectionName)}
                    className="flex items-center text-black font-bold text-lg hover:text-blue-600 transition-colors print:pointer-events-none"
                  >
                    {expandedSections.has(section.sectionName) ? (
                      <ChevronDown className="w-5 h-5 mr-1 print:hidden" />
                    ) : (
                      <ChevronRight className="w-5 h-5 mr-1 print:hidden" />
                    )}
                    <span>{section.sectionName}</span>
                  </button>
                </div>
                {section.sectionTotal !== undefined && (
                  <span className="font-bold text-black text-lg">
                    {formatCurrency(section.sectionTotal)}
                  </span>
                )}
              </div>

              {/* Section Accounts */}
              {(expandedSections.has(section.sectionName) || expandedSections.size === 0) && (
                <div className="space-y-1">
                  {section.accounts.map((account, accountIndex) => (
                    <div
                      key={accountIndex}
                      className={`flex items-center justify-between py-1 ${
                        account.isTotal ? 'border-t border-b border-black font-bold' :
                        account.isSubtotal ? 'border-t border-gray-300 font-semibold' : ''
                      } ${account.hasDetail ? 'hover:bg-blue-50 cursor-pointer' : ''} group`}
                      onClick={() => account.hasDetail && handleDrillDown(account.accountCode, account.accountName)}
                    >
                      <div className={`flex items-center space-x-2 ${getIndentationClass(account.level)}`}>
                        <span className={`${
                          account.isTotal ? 'font-bold text-black' :
                          account.isSubtotal ? 'font-semibold text-black' :
                          'text-black'
                        }`}>
                          {account.accountCode && (
                            <span className="text-gray-600 mr-2 font-mono text-sm">
                              {account.accountCode}
                            </span>
                          )}
                          {account.accountName}
                          {account.note && (
                            <span className="text-blue-600 ml-1 text-sm">({account.note})</span>
                          )}
                        </span>
                        {account.hasDetail && (
                          <ExternalLink className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity print:hidden" />
                        )}
                      </div>

                      <div className="flex items-center space-x-8">
                        {showComparative && account.priorPeriod !== undefined && (
                          <span className={`text-right w-24 ${
                            account.isTotal ? 'font-bold' :
                            account.isSubtotal ? 'font-semibold' : ''
                          } text-gray-600`}>
                            {formatCurrency(account.priorPeriod)}
                          </span>
                        )}
                        <span className={`text-right w-24 ${
                          account.isTotal ? 'font-bold text-black text-lg' :
                          account.isSubtotal ? 'font-semibold text-black' :
                          'text-black'
                        }`}>
                          {formatCurrency(account.currentPeriod)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Professional Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <div>
              <p>These financial statements have been prepared in accordance with Generally Accepted Accounting Principles (GAAP).</p>
              {auditTrail && (
                <p className="mt-1">Complete audit trail available. See accompanying notes to financial statements.</p>
              )}
            </div>
            <div className="text-right">
              <p>Prepared by Accountrix AI CPA</p>
              <p>{header.preparationDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Sidebar - Only visible on screen */}
      {showNotes && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-300 shadow-lg z-50 print:hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">AI Insights & Notes</h3>
              <button
                onClick={() => setShowNotes(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto h-full">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-blue-800 mb-2">GAAP Compliance</h4>
              <p className="text-sm text-blue-700">This report follows ASC presentation standards with proper classification and disclosure requirements.</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-semibold text-green-800 mb-2">Audit Trail</h4>
              <p className="text-sm text-green-700">All transactions link to source documents. Click any account line for detailed transaction history.</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <h4 className="font-semibold text-purple-800 mb-2">AI Analysis</h4>
              <p className="text-sm text-purple-700">Financial ratios and trends automatically calculated. Anomalies flagged for review.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Print Styles */
const printStyles = `
@media print {
  .print\\:hidden { display: none !important; }
  .print\\:bg-white { background-color: white !important; }
  .print\\:p-2 { padding: 0.5rem !important; }
  .print\\:pointer-events-none { pointer-events: none !important; }

  body { print-color-adjust: exact; }

  /* Ensure proper page breaks */
  .page-break { page-break-before: always; }
  .avoid-break { page-break-inside: avoid; }
}
`;

// Inject print styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = printStyles;
  document.head.appendChild(styleElement);
}