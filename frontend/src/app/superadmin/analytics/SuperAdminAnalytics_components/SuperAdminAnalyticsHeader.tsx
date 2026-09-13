// RESPONSIBILITY: Renders the SuperAdminAnalyticsHeader component.
import React from 'react';

import type { SuperAdminAnalyticsHeaderProps } from '@/app/superadmin/analytics/SuperAdminAnalytics_types/SuperAdminAnalytics.types';

export const SuperAdminAnalyticsHeader: React.FC<SuperAdminAnalyticsHeaderProps> = () => {
  return (
    <div>
      <h1 className="text-[22px] font-bold text-primary">Platform Analytics</h1>
      <p className="text-secondary text-sm">Real-time aggregate network performance.</p>
    </div>
  );
};
