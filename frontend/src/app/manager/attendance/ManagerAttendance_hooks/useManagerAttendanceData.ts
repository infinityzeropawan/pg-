// DATA FLOW: [AI_TODO: Document data flow direction for useManagerAttendanceData.ts]
// [DATA HOOK] useManagerAttendanceData
// Responsibility: Fetches today's student roster and attendance records for the selected property.
// Data Flow: ManagerPropertyContext (selectedPropertyId) â†’ api.managerOperations â†’ local state â†’ consumers (ManagerAttendanceMain)
import { useState, useEffect } from 'react';

import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';

import type { ManagerAttendanceStudent, ManagerAttendanceRecord } from '@/app/manager/attendance/ManagerAttendance_types/ManagerAttendance.types';
export function useManagerAttendanceData(selectedPropertyId: string | null, ctxLoading: boolean) {
  const [students, setStudents] = useState<ManagerAttendanceStudent[]>([]);
  const [attendance, setAttendance] = useState<ManagerAttendanceRecord[]>([]);
  const loadData = () => {
    if (!ctxLoading && selectedPropertyId) {
      const rawStudents = api.managerOperations.listStudents(selectedPropertyId) as unknown as ManagerAttendanceStudent[];
      const mapped = rawStudents.map((s: any) => ({
        id: s.profile.id,
        userId: s.profile.userId,
        name: s.user.name,
        phone: s.user.phone,
        roomNumber: s.roomNumber
      }));
      setStudents(mapped as unknown as ManagerAttendanceStudent[]);
      setAttendance(api.managerOperations.listStudentAttendanceToday(selectedPropertyId) as unknown as ManagerAttendanceRecord[]);
    }
  };
  // Re-fetch when the property selection changes or context finishes loading.
  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPropertyId, ctxLoading]);
  return { students, attendance, loadData };
}