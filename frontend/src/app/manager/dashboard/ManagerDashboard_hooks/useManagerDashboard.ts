// DATA FLOW: ManagerPropertyContext → multiple APIs → ManagerDashboardStats → ManagerDashboardMain
// [DATA HOOK] useManagerDashboard
// Responsibility: Aggregates all dashboard KPIs (rent, attendance, meals, stock alerts) for the selected property.
import { useState, useEffect, useCallback } from 'react';

import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { getSession } from '@/app/manager/manager_lib/manager_auth/ManagerSession';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { attendanceApi } from '@/app/owner/owner_lib/owner_api/OwnerAttendance';
import { mealsApi } from '@/app/manager/manager_lib/manager_api/ManagerMeals';

import type { SessionUser } from '@/lib/types';
import type { MealStatus } from '@/app/manager/manager_lib/manager_api/ManagerMeals';
import type { StockRequest } from '@/app/staff/staff_lib/staff_api/StaffStockRequests';
import type { ManagerDashboardStats, UseManagerDashboardReturn } from '@/app/manager/dashboard/ManagerDashboard_types/ManagerDashboard.types';

export function useManagerDashboard(): UseManagerDashboardReturn {
  const [user, setUser] = useState<SessionUser | null>(null);
  const { properties, selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const [stats, setStats] = useState<ManagerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [kitchenRequests, setKitchenRequests] = useState<StockRequest[]>([]);
  const [readyMeals, setReadyMeals] = useState<MealStatus[]>([]);
  const [isPresent, setIsPresent] = useState(false);

  useEffect(() => {
    const s = getSession();
    setUser(s);
  }, []);

  const loadData = useCallback(async () => {
    if (!selectedPropertyId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const backendStats = await api.managerDashboard.fetchBackendStats(selectedPropertyId);
      if (backendStats) {
        setStats(backendStats as ManagerDashboardStats);
      } else {
        setStats(api.managerDashboard.getStats(selectedPropertyId) as ManagerDashboardStats);
      }
      setKitchenRequests(api.stockRequests.getByProperty(selectedPropertyId).filter((r: StockRequest) => ['pending'].includes(r.status)));
      setReadyMeals(mealsApi.getAllTodayStatuses(selectedPropertyId).filter((m: MealStatus) => m.status === 'ready'));
      if (user) {
        setIsPresent(attendanceApi.getTodayStatus(selectedPropertyId, user.id));
      }
    } catch (e) {
      console.error('loadData error', e);
    }
    setLoading(false);
  }, [selectedPropertyId, user]);

  useEffect(() => {
    if (!ctxLoading && selectedPropertyId) loadData();
  }, [selectedPropertyId, ctxLoading, loadData]);

  const handleAnnounceMeal = (mealType: 'Breakfast'|'Lunch'|'Dinner') => {
    if (!user || !selectedPropertyId) return;
    mealsApi.announceMeal(selectedPropertyId, mealType, user.id);
    loadData();
  };

  const handleMarkPresent = () => {
    if (!user || !selectedPropertyId) return;
    attendanceApi.markPresent(selectedPropertyId, user.id);
    loadData();
  };

  return {
    stats,
    loading,
    kitchenRequests,
    readyMeals,
    isPresent,
    handleAnnounceMeal,
    handleMarkPresent,
    selectedPropertyId,
    ctxLoading,
    properties,
    user
  };
}