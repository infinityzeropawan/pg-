// RESPONSIBILITY: Renders the SuperAdminTicketsCreateModal component.
import React from 'react';

import type { SuperAdminTicketsCreateModalProps } from '@/app/superadmin/tickets/SuperAdminTickets_types/SuperAdminTickets.types';

export const SuperAdminTicketsCreateModal: React.FC<SuperAdminTicketsCreateModalProps> = ({
  isOpen,
  onClose,
  owners,
  formData,
  setFormData,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-card border border rounded-[var(--radius-xl,16px)] p-6 max-w-md w-full shadow-2xl motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
        <h3 className="text-lg font-bold text-primary mb-4">Create Ticket on Behalf</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Select Owner *</label>
            <select 
              required 
              value={(formData as any).ownerId} 
              onChange={e => setFormData({ ...(formData as any), ownerId: e.target.value })} 
              className="w-full bg-input border border text-primary p-2.5 rounded-[var(--radius-md,8px)] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm motion-safe:transition-colors"
            >
              <option value="">-- Choose Owner --</option>
              {owners.map(o => <option key={o.id} value={o.id}>{o.businessName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Title *</label>
            <input 
              type="text" 
              required 
              value={(formData as any).title} 
              onChange={e => setFormData({ ...(formData as any), title: e.target.value })} 
              className="w-full bg-input border border text-primary p-2.5 rounded-[var(--radius-md,8px)] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm motion-safe:transition-colors" 
              placeholder="E.g. Cannot access dashboard"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Description *</label>
            <textarea 
              required 
              value={(formData as any).description} 
              onChange={e => setFormData({ ...(formData as any), description: e.target.value })} 
              rows={3} 
              className="w-full bg-input border border text-primary p-2.5 rounded-[var(--radius-md,8px)] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm motion-safe:transition-colors resize-none" 
              placeholder="Describe the issue in detail..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Priority *</label>
            <select 
              value={(formData as any).priority} 
              onChange={e => setFormData({ ...(formData as any), priority: e.target.value })} 
              className="w-full bg-input border border text-primary p-2.5 rounded-[var(--radius-md,8px)] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-sm motion-safe:transition-colors"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="pt-4 border-t border flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium text-primary bg-transparent border border hover:bg-page rounded-[var(--radius-md,8px)] motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-hover rounded-[var(--radius-md,8px)] motion-safe:transition-colors shadow-sm"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
