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
  console.log('useManagerDashboard render');
  // Store user in state so SSR hydration triggers a re-render with the real session.
  const [user, setUser] = useState<SessionUser | null>(null);
  const { properties, selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const [stats, setStats] = useState<ManagerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [kitchenRequests, setKitchenRequests] = useState<StockRequest[]>([]);
  const [readyMeals, setReadyMeals] = useState<MealStatus[]>([]);
  const [isPresent, setIsPresent] = useState(false);

  // Load session client-side only (localStorage is not available on server).
  useEffect(() => {
    const s = getSession();
    console.log('useManagerDashboard useEffect set user', s);
    setUser(s);
  }, []);

  const loadData = useCallback(() => {
    console.log('loadData called', { ctxLoading, selectedPropertyId, user });
    if (!selectedPropertyId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setStats(api.managerDashboard.getStats(selectedPropertyId) as ManagerDashboardStats);
      console.log('loadData got stats');
      setKitchenRequests(api.stockRequests.getByProperty(selectedPropertyId).filter((r: StockRequest) => ['pending'].includes(r.status)));
      console.log('loadData got kitchenRequests');
      setReadyMeals(mealsApi.getAllTodayStatuses(selectedPropertyId).filter((m: MealStatus) => m.status === 'ready'));
      console.log('loadData got readyMeals');
      if (user) {
        setIsPresent(attendanceApi.getTodayStatus(selectedPropertyId, user.id));
      }
      console.log('loadData finished');
    } catch (e) {
      console.error('loadData error', e);
    }
    setLoading(false);
  }, [selectedPropertyId, user]);

  // Re-fetch all KPI data when the selected property changes or context finishes loading.
  useEffect(() => {
    console.log('useEffect triggered', { selectedPropertyId, ctxLoading });
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