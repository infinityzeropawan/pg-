// DATA FLOW: Mock data → useState (synchronous) → DashboardPage
'use client';

import { useState } from 'react';
import { MOCK_DASHBOARD_STATS } from '@/app/superadmin/superadmin_lib/superadmin_mock_data';
import type { SuperAdminDashboardData } from '@/app/superadmin/dashboard/SuperAdminDashboard_types/SuperAdminDashboard.types';

export function SuperadminUseSuperAdminDashboardData() {
  const [data] = useState<SuperAdminDashboardData>(MOCK_DASHBOARD_STATS as unknown as SuperAdminDashboardData);
  const [loading] = useState<boolean>(false);

  return { data, loading };
}
