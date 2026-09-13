// DATA FLOW: Mock data → useState → UI
'use client';

import { useCallback, useEffect, useState } from 'react';
import { plansApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminPlans';
import type { SuperAdminPlan } from '@/app/superadmin/plans/SuperAdminPlans_types/SuperAdminPlans.types';

export function SuperadminUseSuperAdminPlansData() {
  const [plans, setPlans] = useState<SuperAdminPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const refetch = useCallback(async () => {
    setLoading(true);
    try { setPlans(await plansApi.listPlans() as SuperAdminPlan[]); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refetch(); }, [refetch]);

  return {
    plans,
    loading,
    refetch,
  };
}
