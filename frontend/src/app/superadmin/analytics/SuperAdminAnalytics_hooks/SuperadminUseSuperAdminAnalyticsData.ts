// DATA FLOW: Backend API → SuperAdmin Analytics Page
'use client';

import { useEffect, useState } from 'react';
import { platformApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminPlatform';
import type { SuperAdminAnalyticsStats } from '@/app/superadmin/analytics/SuperAdminAnalytics_types/SuperAdminAnalytics.types';

export function SuperadminUseSuperAdminAnalyticsData() {
  const [stats, setStats] = useState<SuperAdminAnalyticsStats | null>(null);
  const [planData, setPlanData] = useState<{ name: string; value: number }[]>([]);
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void platformApi.getAnalytics().then((data: any) => {
      const raw = data.stats || {};
      const computedStats: SuperAdminAnalyticsStats = {
        activeOwnersCount: raw.totalOwners || 0,
        pendingRequestsCount: raw.pendingRequests || 0,
        activePropertiesCount: raw.totalProperties || 0,
        totalStudentsCount: raw.totalTenants !== undefined ? raw.totalTenants : (raw.occupiedBeds || 0),
        mrr: raw.mrr || 0,
        occupancyPercentage: raw.occupancyRate || 0,
        openTicketsCount: raw.openTicketsCount || 0,
        expiringPlansCount: raw.expiringPlansCount || 0,
        latestRequests: raw.latestRequests || [],
        recentAuditLogs: raw.recentAuditLogs || [],
        ownersByPlan: (data.planStats || []).map((plan: any) => ({ plan: plan.planName, count: plan.subscriberCount })),
      };
      setStats(computedStats);

      const plans = (data.planStats || []).map((plan: any) => ({
        name: plan.planName,
        value: plan.subscriberCount || 0,
      }));
      setPlanData(plans);

      if (data.revenueData && Array.isArray(data.revenueData)) {
        setRevenueData(data.revenueData);
      } else {
        const currentMrr = raw.mrr || 0;
        const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep'];
        setRevenueData(months.map(m => ({ month: m, revenue: currentMrr })));
      }
    }).catch(e => console.error('Analytics load error:', e)).finally(() => setLoading(false));
  }, []);

  return { stats, planData, revenueData, loading };
}
