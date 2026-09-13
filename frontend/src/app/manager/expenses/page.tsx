import { Suspense } from 'react';

import { ManagerExpensesMain } from '@/app/manager/expenses/ManagerExpenses_components/ManagerExpensesMain';
export default function ManagerExpensesPage() {
  return (
    <Suspense fallback={<div className="p-6 motion-safe:animate-pulse text-secondary">Loading...</div>}>
      <ManagerExpensesMain />
    </Suspense>
  );
}