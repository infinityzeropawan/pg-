// DATA FLOW: [AI_TODO: Document data flow direction for useManagerStudents.ts]
// [DATA HOOK] useManagerStudents
// Responsibility: Fetches enriched student list (profile + user data) for the selected property.
// Data Flow: ManagerPropertyContext â†’ api.students.listByProperty â†’ local state â†’ ManagerStudentsMain
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { adminRequest } from '@/app/owner/owner_lib/owner_api/AdminClient';
import type { ManagerStudentData } from '@/app/manager/students/ManagerStudents_types/ManagerStudents.types';

export function useManagerStudents(selectedPropertyId: string | null, ctxLoading: boolean) {
  const [students, setStudents] = useState<ManagerStudentData[]>([]);

  const fetchStudents = useCallback(async () => {
    if (!ctxLoading && selectedPropertyId) {
      try {
        const backendTenants = await adminRequest<any[]>('/tenants');
        if (Array.isArray(backendTenants) && backendTenants.length > 0) {
          const filtered = backendTenants
            .filter(t => !selectedPropertyId || t.propertyId === selectedPropertyId)
            .map(t => ({
              profile: {
                id: t.id,
                propertyId: t.propertyId,
                status: t.status || 'active',
                duesAmount: t.duesAmount || 0,
                rentAmount: t.rentAmount || 0,
                depositAmount: t.depositAmount || 0,
                bedId: t.bedId,
                roomId: t.roomId,
                pgScore: t.pgScore || 75,
                userId: t.userId || t.user?.id || t.id,
              },
              user: {
                id: t.userId || t.user?.id || t.id,
                name: t.name || t.user?.name || 'Resident',
                phone: t.phone || t.user?.phone || 'N/A',
                email: t.email || t.user?.email || 'N/A'
              },
              roomNumber: t.roomNumber || t.room?.roomNumber || 'N/A'
            }));
          setStudents(filtered as unknown as ManagerStudentData[]);
          return;
        }
      } catch {
        // Fallback
      }
      const data = api.managerOperations.listStudents(selectedPropertyId);
      setStudents(data as unknown as ManagerStudentData[]);
    }
  }, [ctxLoading, selectedPropertyId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, fetchStudents };
}