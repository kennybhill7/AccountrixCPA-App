'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AccountDetailView from '@/components/AccountDetailView';

// Mock account data mapping
const accountData: Record<string, {
  code: string;
  name: string;
  type: string;
}> = {
  '1000': { code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset' },
  '1100': { code: '1100', name: 'Accounts Receivable', type: 'Asset' },
  '2000': { code: '2000', name: 'Accounts Payable', type: 'Liability' },
  '3000': { code: '3000', name: 'Common Stock', type: 'Equity' },
  '4000': { code: '4000', name: 'Service Revenue', type: 'Revenue' },
  '5000': { code: '5000', name: 'Salaries and Wages', type: 'Expense' },
};

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState<{code: string; name: string; type: string} | null>(null);

  useEffect(() => {
    if (params.id) {
      const accountId = Array.isArray(params.id) ? params.id[0] : params.id;
      const accountInfo = accountData[accountId];
      if (accountInfo) {
        setAccount(accountInfo);
      } else {
        // Default account if not found
        setAccount({ code: accountId, name: 'Account Not Found', type: 'Unknown' });
      }
    }
  }, [params.id]);

  const handleBack = () => {
    router.push('/accounting/reports');
  };

  const handleDrillToJournal = (journalId: string) => {
    // Navigate to journal entry detail
    router.push(`/accounting/journal/${journalId}`);
  };

  const handleDrillToSource = (sourceDocument: string) => {
    // Open source document viewer
    alert(`Opening Source Document: ${sourceDocument}\n\nThis would open the document viewer with the source document.`);
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Account Details...</h2>
          <p className="text-gray-600">Please wait while we fetch the account information.</p>
        </div>
      </div>
    );
  }

  return (
    <AccountDetailView
      accountCode={account.code}
      accountName={account.name}
      accountType={account.type}
      periodFrom="January 1, 2024"
      periodTo="December 31, 2024"
      onBack={handleBack}
      onDrillToJournal={handleDrillToJournal}
      onDrillToSource={handleDrillToSource}
    />
  );
}