// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminOwnerProfileActions.ts]
'use client';

import { useState } from 'react';

import { superadminOwnersApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminOwners';

export function SuperadminUseSuperAdminOwnerProfileActions(id: string, refetch: () => void, currentStatus?: string) {
  const [resetModal, setResetModal] = useState(false);
  const [toggleConfirm, setToggleConfirm] = useState<'SUSPEND' | 'ACTIVATE' | null>(null);

  const handleResetPassword = async (newPass: string) => {
    if (!newPass) return;
    await superadminOwnersApi.resetPassword(id, newPass);
    setResetModal(false);
    alert('Password reset successfully and audit log created.');
  };

  // Opens the in-app confirmation modal (no native window dialogs).
  const handleToggleStatus = () => {
    if (!currentStatus) return;
    setToggleConfirm(currentStatus === 'Active' ? 'SUSPEND' : 'ACTIVATE');
  };

  const confirmToggleStatus = async () => {
    if (!toggleConfirm) return;
    const suspend = toggleConfirm === 'SUSPEND';
    setToggleConfirm(null);
    try {
      await superadminOwnersApi.setSuspended(id, suspend);
      await refetch();
      alert(`Owner ${suspend ? 'suspended' : 'activated'} successfully.`);
    } catch (error: any) {
      alert(error.message || 'Failed to update owner status.');
    }
  };

  const cancelToggleStatus = () => setToggleConfirm(null);

  const handleAddNote = async (note: string) => {
    if (!note || !note.trim()) return;
    try {
      await superadminOwnersApi.addNote(id, note);
      alert('Internal note saved to audit logs successfully!');
      await refetch();
    } catch (error: any) {
      alert(error.message || 'Failed to save note.');
    }
  };

  return {
    resetModal,
    setResetModal,
    handleResetPassword,
    handleToggleStatus,
    confirmToggleStatus,
    cancelToggleStatus,
    toggleConfirm,
    handleAddNote
  };
}
