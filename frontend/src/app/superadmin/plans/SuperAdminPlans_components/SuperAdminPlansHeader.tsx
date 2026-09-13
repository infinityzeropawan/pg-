// RESPONSIBILITY: Renders the SuperAdminPlansHeader component.
import React from 'react';

import type { SuperAdminPlansHeaderProps } from '@/app/superadmin/plans/SuperAdminPlans_types/SuperAdminPlans.types';

export const SuperAdminPlansHeader: React.FC<SuperAdminPlansHeaderProps> = () => {
  return (
    <div>
      <h1 className="text-[22px] font-bold text-primary">Subscription Plans</h1>
      <p className="text-secondary text-sm">Manage pricing and limits for SaaS subscriptions.</p>
    </div>
  );
};
