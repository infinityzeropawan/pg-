// RESPONSIBILITY: Renders the SuperAdminFeatureFlagsHeader component.
import React from 'react';

import type { SuperAdminFeatureFlagsHeaderProps } from '@/app/superadmin/feature-flags/SuperAdminFeatureFlags_types/SuperAdminFeatureFlags.types';

export const SuperAdminFeatureFlagsHeader: React.FC<SuperAdminFeatureFlagsHeaderProps> = () => {
  return (
    <div>
      <h1 className="text-[22px] font-bold text-primary">Feature Flags</h1>
      <p className="text-secondary text-sm">Manage experimental and premium features per owner.</p>
    </div>
  );
};
