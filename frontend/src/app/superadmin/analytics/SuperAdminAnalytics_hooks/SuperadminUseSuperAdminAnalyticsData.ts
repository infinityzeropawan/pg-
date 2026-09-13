// DATA FLOW: Mock data → useState (synchronous) → AnalyticsPage
'use client';

import { useState } from 'react';
import { MOCK_DASHBOARD_STATS } from '@/app/superadmin/superadmin_lib/superadmin_mock_data';
import type { SuperAdminAnalyticsStats } from '@/app/superadmin/analytics/SuperAdminAnalytics_types/SuperAdminAnalytics.types';

export function SuperadminUseSuperAdminAnalyticsData() {
  const [stats] = useState<SuperAdminAnalyticsStats>(MOCK_DASHBOARD_STATS as unknown as SuperAdminAnalyticsStats);
  const [loading] = useState(false);

  return { stats, loading };
}
