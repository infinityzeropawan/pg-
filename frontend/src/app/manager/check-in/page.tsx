import { Suspense } from 'react';

import { ManagerCheckinMain } from '@/app/manager/check-in/ManagerCheckin_components/ManagerCheckinMain';
export default function ManagerCheckinPage() {
  return (
    <Suspense fallback={<div className="p-6 text-secondary">Loading...</div>}>
      <ManagerCheckinMain />
    </Suspense>
  );
}