import { Suspense } from 'react';

import { ManagerComplaintsMain } from '@/app/manager/complaints/ManagerComplaints_components/ManagerComplaintsMain';
export default function ManagerComplaintsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-secondary">Loading...</div>}>
      <ManagerComplaintsMain />
    </Suspense>
  );
}