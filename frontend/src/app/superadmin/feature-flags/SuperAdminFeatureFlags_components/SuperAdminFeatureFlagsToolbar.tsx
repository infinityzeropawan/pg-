// RESPONSIBILITY: Renders the SuperAdminFeatureFlagsToolbar component.
import React from 'react';
import { Search, Settings2 } from 'lucide-react';

import type { SuperAdminFeatureFlagsToolbarProps } from '@/app/superadmin/feature-flags/SuperAdminFeatureFlags_types/SuperAdminFeatureFlags.types';

export const SuperAdminFeatureFlagsToolbar: React.FC<SuperAdminFeatureFlagsToolbarProps> = ({ search, setSearch }) => {
  return (
    <div className="p-4 border-b border flex justify-between items-center bg-page rounded-t-[var(--radius-lg,12px)]">
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-secondary" />
        <input 
          type="text" 
          placeholder="Find owner..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-input border border pl-9 pr-4 py-2 rounded-[var(--radius-md,8px)] text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-colors"
        />
      </div>
      <button className="flex items-center gap-2 text-sm text-primary font-medium bg-primary-subtle px-4 py-2 rounded-[var(--radius-md,8px)] hover:bg-[rgba(99,102,241,0.2)] motion-safe:transition-colors">
        <Settings2 className="w-4 h-4"/> Global Defaults
      </button>
    </div>
  );
};
