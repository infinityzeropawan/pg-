// RESPONSIBILITY: Renders the SuperAdminSettingsHeader component.
import React from 'react';

import type { SuperAdminSettingsHeaderProps } from '@/app/superadmin/settings/SuperAdminSettings_types/SuperAdminSettings.types';

export const SuperAdminSettingsHeader: React.FC<SuperAdminSettingsHeaderProps> = () => {
  return (
    <div>
      <h1 className="text-[22px] font-bold text-primary">Platform Settings</h1>
      <p className="text-secondary text-sm">Configure core behaviors for the SmartPG network.</p>
    </div>
  );
};
