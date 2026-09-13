// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminOwnerProfileActions.ts]
'use client';

import { useState } from 'react';

import { superadminOwnersApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminOwners';

export function SuperadminUseSuperAdminOwnerProfileActions(id: string, refetch: () => void, currentStatus?: string) {
  const [resetModal, setResetModal] = useState(false);

  const handleResetPassword = async (newPass: string) => {
    if (!newPass) return;
    await superadminOwnersApi.resetPassword(id, newPass);
    setResetModal(false);
    alert('Password reset successfully and audit log created.');
  };

  const handleToggleStatus = async () => {
    if (!currentStatus) return;
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    if(confirm(`Are you sure you want to ${newStatus === 'Suspended' ? 'suspend' : 'activate'} this owner?`)) {
      await superadminOwnersApi.setSuspended(id, newStatus === 'Suspended');
      await refetch();
    }
  };

  const handleAddNote = (_note: string) => {};

  return {
    resetModal,
    setResetModal,
    handleResetPassword,
    handleToggleStatus,
    handleAddNote
  };
}
