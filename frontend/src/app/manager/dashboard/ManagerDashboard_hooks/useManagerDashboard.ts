// DATA FLOW: ManagerPropertyContext → admin API → ManagerDashboardStats → ManagerDashboardMain
// [DATA HOOK] useManagerDashboard
// Responsibility: Aggregates all dashboard KPIs (rent, occupancy, complaints, staff) for the selected property.
import { useState, useEffect, useCallback } from 'react';

import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { adminRequest } from '@/app/owner/owner_lib/owner_api/AdminClient';
import { getSession } from '@/app/manager/manager_lib/manager_auth/ManagerSession';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';

import type { SessionUser } from '@/lib/types';
import type { ManagerDashboardStats, UseManagerDashboardReturn } from '@/app/manager/dashboard/ManagerDashboard_types/ManagerDashboard.types';

/** Attendance status accepted by POST /api/v1/admin/staff/attendance. */
const ATTENDANCE_PRESENT = 'PRESENT';

export function useManagerDashboard(): UseManagerDashboardReturn {
  const [user, setUser] = useState<SessionUser | null>(null);
  const { properties, selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const [stats, setStats] = useState<ManagerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPresent, setIsPresent] = useState(false);

  useEffect(() => {
    const s = getSession();
    setUser(s);
  }, []);

  /**
   * Reads today's attendance for the signed-in manager from the backend.
   * Returns false when the record cannot be determined.
   */
  const loadTodayAttendance = useCallback(async (propertyId: string, userId: string) => {
    const records = await adminRequest<any[]>(
      `/staff/attendance?propertyId=${encodeURIComponent(propertyId)}`
    );
    if (!Array.isArray(records)) return false;

    const today = new Date().toISOString().split('T')[0];
    return records.some(r => {
      const recordUser = r.staffUserId || r.staffId || r.userId;
      const recordDate = typeof r.date === 'string' ? r.date.split('T')[0] : '';
      const status = String(r.status || '').toUpperCase();
      return recordUser === userId && recordDate === today && status === ATTENDANCE_PRESENT;
    });
  }, []);

  const loadData = useCallback(async () => {
    if (!selectedPropertyId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Backend is the single source of truth. A failure surfaces an error rather
      // than falling back to locally-invented numbers.
      const backendStats = await api.managerDashboard.fetchBackendStats(selectedPropertyId);
      setStats(backendStats);

      if (user) {
        try {
          setIsPresent(await loadTodayAttendance(selectedPropertyId, user.id));
        } catch {
          setIsPresent(false);
        }
      }
    } catch (e) {
      setStats(null);
      setError(e instanceof Error ? e.message : 'Failed to load dashboard data');
    }
    setLoading(false);
  }, [selectedPropertyId, user, loadTodayAttendance]);

  useEffect(() => {
    if (!ctxLoading && selectedPropertyId) loadData();
  }, [selectedPropertyId, ctxLoading, loadData]);

  const handleMarkPresent = useCallback(async () => {
    if (!user || !selectedPropertyId) return;
    try {
      await adminRequest('/staff/attendance', {
        method: 'POST',
        body: JSON.stringify({
          propertyId: selectedPropertyId,
          userId: user.id,
          date: new Date().toISOString(),
          status: ATTENDANCE_PRESENT,
        }),
      });
      setIsPresent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to record attendance');
    }
  }, [user, selectedPropertyId]);

  return {
    stats,
    loading,
    error,
    isPresent,
    handleMarkPresent,
    selectedPropertyId,
    ctxLoading,
    properties,
    user
  };
}