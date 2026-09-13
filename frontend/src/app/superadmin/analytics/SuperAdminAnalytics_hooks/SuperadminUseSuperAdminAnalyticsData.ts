// DATA FLOW: Mock data → useState (synchronous) → AnalyticsPage
'use client';

import { useEffect, useState } from 'react';
import { platformApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminPlatform';
import type { SuperAdminAnalyticsStats } from '@/app/superadmin/analytics/SuperAdminAnalytics_types/SuperAdminAnalytics.types';

export function SuperadminUseSuperAdminAnalyticsData() {
  const [stats, setStats] = useState<SuperAdminAnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void platformApi.getAnalytics().then((data: any) => {
      const raw = data.stats;
      setStats({ activeOwnersCount: raw.totalOwners, pendingRequestsCount: raw.pendingRequests, activePropertiesCount: raw.totalProperties, totalStudentsCount: raw.occupiedBeds, mrr: raw.mrr, occupancyPercentage: raw.occupancyRate, openTicketsCount: raw.openTicketsCount, expiringPlansCount: raw.expiringPlansCount, latestRequests: raw.latestRequests || [], recentAuditLogs: raw.recentAuditLogs || [], ownersByPlan: (data.planStats || []).map((plan: any) => ({ plan: plan.planName, count: plan.subscriberCount })) });
    }).finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
