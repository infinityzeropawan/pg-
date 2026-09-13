import React from 'react';
import { Search } from 'lucide-react';

import { SUPER_ADMIN_OWNER_REQUEST_STATUSES } from '@/app/superadmin/owner-requests/SuperAdminOwnerRequests_utils/SuperAdminOwnerRequests.constants';

import type { SuperAdminOwnerRequestsFiltersProps } from '@/app/superadmin/owner-requests/SuperAdminOwnerRequests_types/SuperAdminOwnerRequests.types';

// RESPONSIBILITY: Renders the search bar and status filter pills. No API calls.

export const SuperAdminOwnerRequestsFilters: React.FC<SuperAdminOwnerRequestsFiltersProps> = ({ filter, setFilter, search, setSearch }) => {
  return (
    <div className="p-4 border-b border flex flex-col sm:flex-row gap-4 justify-between items-center bg-card rounded-t-[var(--radius-lg,12px)]">
      <div className="flex flex-wrap gap-2">
        {SUPER_ADMIN_OWNER_REQUEST_STATUSES.map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full motion-safe:transition-colors ${filter === f ? 'bg-primary text-page' : 'bg-page text-secondary hover:bg-border'}`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="relative w-full sm:w-64">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-secondary" />
        <input 
          type="text" 
          placeholder="Search by name, business, email..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-input border border pl-9 pr-4 py-2 rounded-[var(--radius-md,8px)] text-sm text-primary focus:outline-none focus:border-primary"
        />
      </div>
    </div>
  );
};
