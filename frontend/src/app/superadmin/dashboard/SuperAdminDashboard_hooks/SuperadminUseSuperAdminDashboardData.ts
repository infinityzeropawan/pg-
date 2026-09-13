// DATA FLOW: Mock data → useState (synchronous) → DashboardPage
'use client';

import { useCallback, useEffect, useState } from 'react';
import { platformApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminPlatform';
import type { SuperAdminDashboardData } from '@/app/superadmin/dashboard/SuperAdminDashboard_types/SuperAdminDashboard.types';

export function SuperadminUseSuperAdminDashboardData() {
  const [data, setData] = useState<SuperAdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const raw: any = await platformApi.getDashboardStats();
      setData({
        activeOwnersCount: raw.totalOwners,
        pendingRequestsCount: raw.pendingRequests,
        activePropertiesCount: raw.totalProperties,
        totalStudentsCount: raw.occupiedBeds,
        mrr: raw.mrr,
        occupancyPercentage: raw.occupancyRate,
        openTicketsCount: raw.openTicketsCount,
        expiringPlansCount: raw.expiringPlansCount,
        latestRequests: (raw.latestRequests || []).map((request: any) => ({ ...request, name: request.fullName, pgCount: request.propertyCount, bedCount: request.totalBeds, status: request.status === 'UNDER_REVIEW' ? 'Hold' : request.status[0] + request.status.slice(1).toLowerCase() })),
        recentAuditLogs: raw.recentAuditLogs || [],
        ownersByPlan: [],
      });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void refetch(); }, [refetch]);

  return { data, loading, refetch };
}
