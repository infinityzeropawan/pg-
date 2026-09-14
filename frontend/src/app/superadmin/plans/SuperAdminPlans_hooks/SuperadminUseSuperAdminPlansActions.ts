// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminPlansActions.ts]
'use client';

import { useState } from 'react';

import { plansApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminPlans';

import type { SuperAdminPlan } from '@/app/superadmin/plans/SuperAdminPlans_types/SuperAdminPlans.types';

export function SuperadminUseSuperAdminPlansActions(refetch: () => void) {
  const [editPlan, setEditPlan] = useState<SuperAdminPlan | null>(null);

  const handleCreateNew = () => {
    setEditPlan({
      id: '',
      name: 'Custom Plan',
      price: 1999,
      maxProperties: 2,
      maxBeds: 50,
      maxStaff: 5,
      features: ['Basic Support', 'Standard Reports'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'SuperAdmin',
      updatedBy: 'SuperAdmin',
      isDeleted: false,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPlan) return;
    
    if (editPlan.id) {
      await plansApi.updatePlan(editPlan.id, editPlan as unknown as any);
    } else {
      const code = editPlan.name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
      await plansApi.createPlan({
        name: editPlan.name,
        code: code || 'CUSTOM',
        priceMonthly: editPlan.price,
        priceYearly: editPlan.price * 10,
        maxProperties: editPlan.maxProperties,
        maxBeds: editPlan.maxBeds,
        features: editPlan.features,
      });
    }
    setEditPlan(null);
    await refetch();
  };

  return {
    editPlan,
    setEditPlan,
    handleCreateNew,
    handleSave,
  };
}
