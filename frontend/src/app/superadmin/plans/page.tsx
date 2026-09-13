'use client';

import React from 'react';

import { SuperAdminPlansHeader } from '@/app/superadmin/plans/SuperAdminPlans_components/SuperAdminPlansHeader';
import { SuperAdminPlansGrid } from '@/app/superadmin/plans/SuperAdminPlans_components/SuperAdminPlansGrid';
import { SuperAdminPlansEditModal } from '@/app/superadmin/plans/SuperAdminPlans_components/SuperAdminPlansEditModal';
import { SuperadminUseSuperAdminPlansData } from '@/app/superadmin/plans/SuperAdminPlans_hooks/SuperadminUseSuperAdminPlansData';
import { SuperadminUseSuperAdminPlansActions } from '@/app/superadmin/plans/SuperAdminPlans_hooks/SuperadminUseSuperAdminPlansActions';

export default function SubscriptionPlansPage() {
  const { plans, loading, refetch } = SuperadminUseSuperAdminPlansData();
  const { editPlan, setEditPlan, handleSave } = SuperadminUseSuperAdminPlansActions(refetch);

  return (
    <div className="space-y-6 pb-20">
      <SuperAdminPlansHeader />
      
      <SuperAdminPlansGrid 
        plans={plans} 
        loading={loading} 
        onEditClick={setEditPlan} 
      />

      <SuperAdminPlansEditModal 
        editPlan={editPlan} 
        setEditPlan={setEditPlan} 
        onSave={handleSave} 
      />
    </div>
  );
}