// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminPlansActions.ts]
'use client';

import { useState } from 'react';

import { plansApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminPlans';

import type { SuperAdminPlan } from '@/app/superadmin/plans/SuperAdminPlans_types/SuperAdminPlans.types';

export function SuperadminUseSuperAdminPlansActions(refetch: () => void) {
  const [editPlan, setEditPlan] = useState<SuperAdminPlan | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPlan) return;
    
    plansApi.updatePlan(editPlan.id, editPlan as unknown as any);
    setEditPlan(null);
    refetch();
  };

  return {
    editPlan,
    setEditPlan,
    handleSave
  };
}
