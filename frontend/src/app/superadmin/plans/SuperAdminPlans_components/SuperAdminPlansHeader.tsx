// RESPONSIBILITY: Renders the SuperAdminPlansHeader component.
import React from 'react';

import type { SuperAdminPlansHeaderProps } from '@/app/superadmin/plans/SuperAdminPlans_types/SuperAdminPlans.types';

export const SuperAdminPlansHeader: React.FC<SuperAdminPlansHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-[22px] font-bold text-primary">Subscription Plans</h1>
        <p className="text-secondary text-sm">Manage pricing and limits for SaaS subscriptions.</p>
      </div>
      {onCreateClick && (
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-[var(--radius-md,8px)] font-medium text-sm hover:opacity-90 transition-opacity"
        >
          + Add Custom Plan
        </button>
      )}
    </div>
  );
};
