// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminOwnerProfileActions.ts]
'use client';

import { useState } from 'react';

import { ownersApi } from '@/app/owner/owner_lib/owner_api/owners';

export function SuperadminUseSuperAdminOwnerProfileActions(id: string, refetch: () => void, currentStatus?: string) {
  const [resetModal, setResetModal] = useState(false);

  const handleResetPassword = (newPass: string) => {
    if (!newPass) return;
    ownersApi.resetPassword(id, newPass);
    setResetModal(false);
    alert('Password reset successfully and audit log created.');
  };

  const handleToggleStatus = () => {
    if (!currentStatus) return;
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    if(confirm(`Are you sure you want to ${newStatus === 'Suspended' ? 'suspend' : 'activate'} this owner?`)) {
      ownersApi.updateStatus(id, newStatus);
      refetch();
    }
  };

  const handleAddNote = (note: string) => {
    if (!note) return;
    ownersApi.addInternalNote(id, note);
    alert('Internal note added to audit logs.');
  };

  return {
    resetModal,
    setResetModal,
    handleResetPassword,
    handleToggleStatus,
    handleAddNote
  };
}
