// RESPONSIBILITY: Renders the SuperAdminTicketsHeader component.
import React from 'react';
import { Plus } from 'lucide-react';

import type { SuperAdminTicketsHeaderProps } from '@/app/superadmin/tickets/SuperAdminTickets_types/SuperAdminTickets.types';

export const SuperAdminTicketsHeader: React.FC<SuperAdminTicketsHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-[22px] font-bold text-primary">Support Tickets</h1>
        <p className="text-secondary text-sm">Manage issues reported by PG Owners.</p>
      </div>
      <button 
        onClick={onCreateClick} 
        className="bg-primary text-white px-4 py-2 rounded-[var(--radius-md,8px)] text-sm font-medium hover:bg-primary-hover motion-safe:transition-colors flex items-center gap-2 shadow-sm"
      >
        <Plus className="w-4 h-4" /> Create on Behalf
      </button>
    </div>
  );
};
