'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ComprehensiveFinancePage from '../page';

export default function FinanceViewPage() {
  const { view } = useParams() as { view: string };

  const viewMapping: { [key: string]: string } = {
    'transactions': 'transactions',
    'journal-entries': 'ledger',
    'budgets': 'budgets',
    'tax-records': 'taxes',
  };

  const initialTab = viewMapping[view];
  if (!initialTab) {
    return <div className="p-8 text-center text-slate-500">Finance View '{view}' not found.</div>;
  }

  return <ComprehensiveFinancePage initialTab={initialTab} />;
}
