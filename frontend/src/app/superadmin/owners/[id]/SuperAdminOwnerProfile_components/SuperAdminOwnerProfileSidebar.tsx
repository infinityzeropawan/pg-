// RESPONSIBILITY: Renders the SuperAdminOwnerProfileSidebar component.
import React, { useState } from 'react';
import { Key, Power } from 'lucide-react';

import type { Owner360Data } from '@/app/superadmin/owners/SuperAdminOwners_types/SuperAdminOwners.types';

interface SidebarProps {
  data: Owner360Data;
  onResetPasswordClick: () => void;
  onToggleStatus: () => void;
  onAddNote: (note: string) => void;
}

export const SuperAdminOwnerProfileSidebar: React.FC<SidebarProps> = ({ 
  data, 
  onResetPasswordClick, 
  onToggleStatus, 
  onAddNote 
}) => {
  const [note, setNote] = useState('');
  const { owner, user } = data;

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNote(note);
    setNote('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-6 shadow-sm">
        <h2 className="text-[16px] font-semibold text-primary mb-4">Contact Info</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border pb-2">
            <span className="text-secondary">Email</span>
            <span className="text-primary font-medium truncate max-w-[200px]" title={owner.email}>{owner.email}</span>
          </div>
          <div className="flex justify-between border-b border pb-2">
            <span className="text-secondary">Phone</span>
            <span className="text-primary font-medium">{owner.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Address</span>
            <span className="text-primary font-medium text-right max-w-[150px] truncate" title={owner.address}>{owner.address || '-'}</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-6 shadow-sm">
        <h2 className="text-[16px] font-semibold text-primary mb-4">Administrative Actions</h2>
        <div className="space-y-3">
          <button 
            onClick={onResetPasswordClick} 
            className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-primary bg-page hover:bg-border border border rounded-[var(--radius-md,8px)] motion-safe:transition-colors"
          >
            <Key className="w-4 h-4 text-info" /> Reset Password
          </button>
          <button 
            onClick={onToggleStatus} 
            className={`w-full flex items-center justify-center gap-2 p-3 text-sm font-medium border rounded-[var(--radius-md,8px)] motion-safe:transition-colors ${
              user?.status === 'Active' 
                ? 'text-danger bg-danger-bg border-danger hover:bg-danger hover:text-white' 
                : 'text-success bg-success-bg border-success hover:bg-success hover:text-white'
            }`}
          >
            <Power className="w-4 h-4" /> {user?.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
          </button>
        </div>
      </div>
      
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-6 shadow-sm">
        <h2 className="text-[16px] font-semibold text-primary mb-4">Internal Notes</h2>
        <form onSubmit={handleNoteSubmit} className="space-y-3">
          <textarea 
            className="w-full bg-input border border rounded-[var(--radius-md,8px)] p-3 text-primary text-sm focus:outline-none focus:border-primary resize-none"
            rows={3} 
            placeholder="Add a note (saved to audit logs)..."
            value={note} 
            onChange={e => setNote(e.target.value)} 
            required
          />
          <button 
            type="submit" 
            className="w-full py-2 bg-page border border text-primary font-medium rounded-[var(--radius-md,8px)] text-sm hover:bg-border motion-safe:transition-colors"
          >
            Save Note
          </button>
        </form>
      </div>
    </div>
  );
};
