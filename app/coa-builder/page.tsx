'use client';

import React from 'react';
import ChartOfAccountsBuilder from '@/components/ChartOfAccountsBuilder';

export default function COABuilderPage() {
  const handleSave = (accounts: any[]) => {
    console.log('Saving Chart of Accounts:', accounts);
    // Here you would typically save to a database or API
    alert(`Chart of Accounts saved successfully! Total accounts: ${accounts.length}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <ChartOfAccountsBuilder
        onSave={handleSave}
        showTemplates={true}
        readOnly={false}
      />
    </div>
  );
}
