// DATA FLOW: [AI_TODO: Document data flow direction for useManagerVisitors.ts]
// [DATA HOOK] useManagerVisitors
// Responsibility: Fetches visitor list and handles approval/rejection/check-in/check-out status updates.
// Data Flow: ManagerPropertyContext â†’ api.managerOperations.listVisitors â†’ local state â†’ ManagerVisitorsPage
import { useState, useEffect } from 'react';

import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';

import type { Visitor, UseManagerVisitorsReturn } from '@/app/manager/visitors/ManagerVisitors_types/ManagerVisitors.types';
export function useManagerVisitors(): UseManagerVisitorsReturn {
  const { selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useManagerSession();
  const loadData = () => {
    if (!ctxLoading && selectedPropertyId) {
      setLoading(true);
      setVisitors(api.managerOperations.listVisitors(selectedPropertyId) as unknown as Visitor[]);
      setLoading(false);
    }
  };
  // Re-fetch visitors when property selection changes or context finishes loading.
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPropertyId, ctxLoading]);
  const handleStatus = (id: string, status: string) => {
    if (!user) return;
    api.managerOperations.updateVisitorStatus(id, status as 'approved' | 'rejected' | 'checked_in' | 'checked_out', user.id);
    loadData();
  };
  return {
    visitors,
    loading,
    handleStatus,
    selectedPropertyId,
    ctxLoading
  };
}