'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import { SuperadminUseSuperAdminOwnerProfileData } from '@/app/superadmin/owners/[id]/SuperAdminOwnerProfile_hooks/SuperadminUseSuperAdminOwnerProfileData';
import { SuperadminUseSuperAdminOwnerProfileActions } from '@/app/superadmin/owners/[id]/SuperAdminOwnerProfile_hooks/SuperadminUseSuperAdminOwnerProfileActions';
import { SuperAdminOwnerProfileHeader } from '@/app/superadmin/owners/[id]/SuperAdminOwnerProfile_components/SuperAdminOwnerProfileHeader';
import { SuperAdminOwnerProfileSidebar } from '@/app/superadmin/owners/[id]/SuperAdminOwnerProfile_components/SuperAdminOwnerProfileSidebar';
import { SuperAdminOwnerProfileMain } from '@/app/superadmin/owners/[id]/SuperAdminOwnerProfile_components/SuperAdminOwnerProfileMain';

export default function Owner360Page() {
  const params = useParams();
  const id = params.id as string;

  const { data, loading, refetch } = SuperadminUseSuperAdminOwnerProfileData(id);
  const actionsHook = SuperadminUseSuperAdminOwnerProfileActions(id, refetch, data?.user?.status);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-secondary">
        Loading 360 view...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <SuperAdminOwnerProfileHeader data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Actions & Contact */}
        <div className="lg:col-span-1">
          <SuperAdminOwnerProfileSidebar 
            data={data}
            onResetPasswordClick={() => actionsHook.setResetModal(true)}
            onToggleStatus={actionsHook.handleToggleStatus}
            onAddNote={actionsHook.handleAddNote}
          />
        </div>

        {/* Right Col: Usage & Lists */}
        <div className="lg:col-span-2">
          <SuperAdminOwnerProfileMain data={data} />
        </div>
      </div>

      {/* Reset Modal */}
      {actionsHook.resetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-overlay border border rounded-[var(--radius-xl,16px)] p-7 max-w-sm w-full shadow-2xl motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
            <h3 className="text-lg font-bold text-primary mb-2">Reset Password</h3>
            <p className="text-sm text-secondary mb-4">Set a temporary password. The owner will be forced to change it on their next login.</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              actionsHook.handleResetPassword((formData as any).get('newPass') as string);
            }}>
              <input 
                type="text" 
                name="newPass"
                className="w-full bg-input border border rounded-[var(--radius-md,8px)] p-3 text-primary text-sm mb-5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
                placeholder="New Temporary Password"
                required
              />
              <div className="flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => actionsHook.setResetModal(false)} 
                  className="px-4 py-2 text-sm font-medium text-primary bg-transparent border border hover:bg-card rounded-[var(--radius-md,8px)] motion-safe:transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-hover rounded-[var(--radius-md,8px)] motion-safe:transition-colors shadow-sm"
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}