// DATA FLOW: [AI_TODO: Document data flow direction for useManagerAttendanceActions.ts]
// [ACTION HOOK] useManagerAttendanceActions
// Responsibility: Handles write operations for student attendance (mark present/absent/on-leave).
// Data Flow: handleMark â†’ api.managerOperations.markStudentAttendance â†’ loadData() to refresh UI
import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
export function useManagerAttendanceActions(selectedPropertyId: string | null, userId: string | undefined, loadData: () => void) {
  const handleMark = (studentId: string, status: 'Present' | 'Absent' | 'On Leave') => {
    if (!userId || !selectedPropertyId) return;
    api.managerOperations.markStudentAttendance(studentId, selectedPropertyId, status, userId);
    loadData();
  };
  return { handleMark };
}