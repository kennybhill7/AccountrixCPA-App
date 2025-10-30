'use client';

import React, { useState } from 'react';
import ChartOfAccountsBuilder, { Account } from '@/components/ChartOfAccountsBuilder';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  validateCOA,
  exportToExcel,
  exportToPDF,
  compareCOAs,
  suggestAccountNumbers,
} from '@/lib/coa-utils';

export default function COABuilderExamplesPage() {
  const [currentCOA, setCurrentCOA] = useState<Account[]>([]);
  const [previousCOA, setPreviousCOA] = useState<Account[]>([]);
  const [validationResults, setValidationResults] = useState<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);

  const handleSave = (accounts: Account[]) => {
    setPreviousCOA(currentCOA);
    setCurrentCOA(accounts);
    console.log('Chart of Accounts saved:', accounts);

    // Show success message
    alert(`Chart of Accounts saved successfully!\n\nTotal Accounts: ${accounts.length}\n- Assets: ${accounts.filter(a => a.type === 'Asset').length}\n- Liabilities: ${accounts.filter(a => a.type === 'Liability').length}\n- Equity: ${accounts.filter(a => a.type === 'Equity').length}\n- Revenue: ${accounts.filter(a => a.type === 'Revenue').length}\n- Expenses: ${accounts.filter(a => a.type === 'Expense').length}`);
  };

  const handleValidate = () => {
    if (currentCOA.length === 0) {
      alert('Please create a Chart of Accounts first');
      return;
    }

    const results = validateCOA(currentCOA);
    setValidationResults(results);

    if (results.valid) {
      alert('✓ Chart of Accounts validation passed!\n\n' +
        (results.warnings.length > 0
          ? `Warnings:\n${results.warnings.join('\n')}`
          : 'No warnings found.'));
    } else {
      alert('✗ Chart of Accounts validation failed!\n\n' +
        `Errors:\n${results.errors.join('\n')}\n\n` +
        (results.warnings.length > 0
          ? `Warnings:\n${results.warnings.join('\n')}`
          : ''));
    }
  };

  const handleExportExcel = () => {
    if (currentCOA.length === 0) {
      alert('Please create a Chart of Accounts first');
      return;
    }

    try {
      exportToExcel(currentCOA);
      alert('Chart of Accounts exported to Excel successfully!');
    } catch (error) {
      alert('Error exporting to Excel: ' + error);
    }
  };

  const handleExportPDF = async () => {
    if (currentCOA.length === 0) {
      alert('Please create a Chart of Accounts first');
      return;
    }

    try {
      await exportToPDF(currentCOA);
      alert('Chart of Accounts exported to PDF successfully!');
    } catch (error) {
      alert('Error exporting to PDF: ' + error);
    }
  };

  const handleCompare = () => {
    if (currentCOA.length === 0 || previousCOA.length === 0) {
      alert('Please save the Chart of Accounts at least twice to compare changes');
      return;
    }

    const comparison = compareCOAs(previousCOA, currentCOA);

    alert(`Chart of Accounts Comparison:\n\n` +
      `Added: ${comparison.added.length} accounts\n` +
      `${comparison.added.map(a => `  + ${a.number} ${a.name}`).join('\n')}\n\n` +
      `Removed: ${comparison.removed.length} accounts\n` +
      `${comparison.removed.map(a => `  - ${a.number} ${a.name}`).join('\n')}\n\n` +
      `Modified: ${comparison.modified.length} accounts\n` +
      `${comparison.modified.map(a => `  * ${a.number} ${a.name}`).join('\n')}`
    );
  };

  const handleSuggestNumbers = () => {
    if (currentCOA.length === 0) {
      alert('Please create a Chart of Accounts first');
      return;
    }

    const assetSuggestions = suggestAccountNumbers('Asset', currentCOA);
    const liabilitySuggestions = suggestAccountNumbers('Liability', currentCOA);
    const equitySuggestions = suggestAccountNumbers('Equity', currentCOA);
    const revenueSuggestions = suggestAccountNumbers('Revenue', currentCOA);
    const expenseSuggestions = suggestAccountNumbers('Expense', currentCOA);

    alert(`Suggested Account Numbers:\n\n` +
      `Assets: ${assetSuggestions.join(', ')}\n` +
      `Liabilities: ${liabilitySuggestions.join(', ')}\n` +
      `Equity: ${equitySuggestions.join(', ')}\n` +
      `Revenue: ${revenueSuggestions.join(', ')}\n` +
      `Expenses: ${expenseSuggestions.join(', ')}`
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Chart of Accounts Builder - Examples</h1>
        <p className="text-muted-foreground">
          Explore different use cases and features of the COA Builder component
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Usage</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="readonly">Read-Only</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="border rounded-lg p-6 bg-muted/50">
            <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
            <p className="text-muted-foreground mb-4">
              This example shows the full-featured Chart of Accounts Builder with all editing
              capabilities enabled. You can:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
              <li>Add new accounts with automatic number suggestions</li>
              <li>Edit existing accounts (except account type)</li>
              <li>Delete accounts with confirmation</li>
              <li>Create sub-accounts under parent accounts</li>
              <li>Search and filter accounts</li>
              <li>Load pre-built templates</li>
              <li>Export to CSV and JSON</li>
            </ul>

            <div className="flex gap-3 mb-6">
              <Button onClick={handleValidate}>Validate COA</Button>
              <Button onClick={handleSuggestNumbers} variant="outline">
                Suggest Account Numbers
              </Button>
              <Button onClick={handleCompare} variant="outline">
                Compare with Previous
              </Button>
            </div>
          </div>

          <ChartOfAccountsBuilder
            onSave={handleSave}
            showTemplates={true}
            readOnly={false}
          />
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <div className="border rounded-lg p-6 bg-muted/50">
            <h2 className="text-2xl font-semibold mb-4">COA Validation</h2>
            <p className="text-muted-foreground mb-4">
              The validation system checks for common issues:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
              <li>Duplicate account numbers</li>
              <li>Accounts outside valid number ranges</li>
              <li>Orphaned sub-accounts (parent doesn't exist)</li>
              <li>Unusual normal balances</li>
              <li>Missing essential accounts</li>
            </ul>

            <Button onClick={handleValidate} className="mb-6">
              Run Validation
            </Button>

            {validationResults && (
              <div className="space-y-4">
                <div className={`border rounded-lg p-4 ${validationResults.valid ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'}`}>
                  <h3 className="font-semibold mb-2">
                    {validationResults.valid ? '✓ Validation Passed' : '✗ Validation Failed'}
                  </h3>

                  {validationResults.errors.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium text-red-800 dark:text-red-200">Errors:</h4>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {validationResults.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validationResults.warnings.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Warnings:</h4>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {validationResults.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <ChartOfAccountsBuilder
            onSave={handleSave}
            showTemplates={true}
            readOnly={false}
          />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="border rounded-lg p-6 bg-muted/50">
            <h2 className="text-2xl font-semibold mb-4">Export Functionality</h2>
            <p className="text-muted-foreground mb-4">
              Export your Chart of Accounts in various formats:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">CSV Export</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Comma-separated values format, compatible with Excel and most accounting software.
                </p>
                <Button variant="outline" className="w-full" disabled={currentCOA.length === 0}>
                  Export CSV
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">JSON Export</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  JavaScript Object Notation format, perfect for backup and data transfer.
                </p>
                <Button variant="outline" className="w-full" disabled={currentCOA.length === 0}>
                  Export JSON
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Excel Export</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Microsoft Excel format (.xlsx) with formatted columns and styling.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleExportExcel}
                  disabled={currentCOA.length === 0}
                >
                  Export Excel
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">PDF Export</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Portable Document Format, great for printing and sharing.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleExportPDF}
                  disabled={currentCOA.length === 0}
                >
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          <ChartOfAccountsBuilder
            onSave={handleSave}
            showTemplates={true}
            readOnly={false}
          />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <div className="border rounded-lg p-6 bg-muted/50">
            <h2 className="text-2xl font-semibold mb-4">COA Comparison</h2>
            <p className="text-muted-foreground mb-4">
              Compare changes between different versions of your Chart of Accounts:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
              <li>See newly added accounts</li>
              <li>Identify removed accounts</li>
              <li>Track modified account details</li>
              <li>Review changes before committing</li>
            </ul>

            <Button onClick={handleCompare} disabled={previousCOA.length === 0}>
              Compare with Previous Version
            </Button>
          </div>

          <ChartOfAccountsBuilder
            onSave={handleSave}
            showTemplates={true}
            readOnly={false}
          />
        </TabsContent>

        <TabsContent value="readonly" className="space-y-6">
          <div className="border rounded-lg p-6 bg-muted/50">
            <h2 className="text-2xl font-semibold mb-4">Read-Only Mode</h2>
            <p className="text-muted-foreground mb-4">
              Display the Chart of Accounts without editing capabilities. Perfect for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Viewing reference COAs</li>
              <li>Educational demonstrations</li>
              <li>Audit and review purposes</li>
              <li>Presenting to stakeholders</li>
            </ul>
          </div>

          <ChartOfAccountsBuilder
            showTemplates={false}
            readOnly={true}
          />
        </TabsContent>
      </Tabs>

      {/* Educational Panel */}
      <div className="mt-12 border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Account Structure</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Understand the five main account types</li>
              <li>Learn proper account numbering conventions</li>
              <li>Master parent-child account relationships</li>
              <li>Recognize account categories</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Normal Balances</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Assets and Expenses = Debit (DR)</li>
              <li>Liabilities, Equity, Revenue = Credit (CR)</li>
              <li>Understand contra-accounts</li>
              <li>Apply to construction scenarios</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Construction-Specific</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Track retainage (receivable and payable)</li>
              <li>Manage work in progress accounts</li>
              <li>Monitor equipment and depreciation</li>
              <li>Separate direct costs from overhead</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Best Practices</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Use consistent numbering increments</li>
              <li>Leave gaps for future accounts</li>
              <li>Create descriptive account names</li>
              <li>Validate regularly for accuracy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
