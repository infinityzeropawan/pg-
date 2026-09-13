import React, { useState } from 'react';

import type { SuperAdminOwnerRequestsReviewModalProps } from '@/app/superadmin/owner-requests/SuperAdminOwnerRequests_types/SuperAdminOwnerRequests.types';

// RESPONSIBILITY: Renders the Reject Modal form. Form submit calls onSubmit prop.

export const SuperAdminOwnerRequestsReviewModal: React.FC<SuperAdminOwnerRequestsReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    onSubmit(rejectReason);
    setRejectReason('');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-overlay border border rounded-[var(--radius-xl,16px)] p-6 max-w-sm w-full shadow-2xl motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
        <h3 className="text-lg font-bold text-primary mb-2">Reject Request</h3>
        <p className="text-sm text-secondary mb-4">Provide a reason for rejecting this owner request. This will be recorded.</p>
        <form onSubmit={handleSubmit}>
          <textarea 
            className="w-full bg-input border border rounded-md p-3 text-primary text-sm mb-4 focus:outline-none focus:border-danger focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-overlay)]"
            rows={3}
            placeholder="Reason for rejection..."
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            required
          />
          <div className="flex gap-3 justify-end">
            <button 
              type="button" 
              onClick={() => {
                setRejectReason('');
                onClose();
              }} 
              className="px-4 py-2 text-sm font-medium text-primary bg-transparent border border hover:bg-card rounded-[var(--radius-md,8px)] motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium bg-danger text-white hover:opacity-90 motion-safe:active:scale-95 motion-safe:transition-all rounded-[var(--radius-md,8px)]"
            >
              Reject Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
