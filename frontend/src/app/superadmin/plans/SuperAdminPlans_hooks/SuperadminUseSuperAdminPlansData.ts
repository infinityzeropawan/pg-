// DATA FLOW: Mock data → useState → UI
'use client';

import { useState } from 'react';
import { MOCK_PLANS } from '@/app/superadmin/superadmin_lib/superadmin_mock_data';
import type { SuperAdminPlan } from '@/app/superadmin/plans/SuperAdminPlans_types/SuperAdminPlans.types';

export function SuperadminUseSuperAdminPlansData() {
  const [plans] = useState<SuperAdminPlan[]>(MOCK_PLANS as unknown as SuperAdminPlan[]);
  const [loading] = useState(false);

  return {
    plans,
    loading,
    refetch: () => {},
  };
}
