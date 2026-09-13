import { Suspense } from 'react';

import { ManagerAttendanceMain } from '@/app/manager/attendance/ManagerAttendance_components/ManagerAttendanceMain';
export default function ManagerAttendancePage() {
  return (
    <Suspense fallback={<div className="p-6 text-secondary">Loading...</div>}>
      <ManagerAttendanceMain />
    </Suspense>
  );
}