// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminOwnerRequestsActions.ts]
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { ownerRequestsApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminOwnerRequests';

export const SuperadminUseSuperAdminOwnerRequestsActions = (refetch: () => void) => {
  const router = useRouter();
  
  
  // Modals state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [holdModalOpen, setHoldModalOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState('');

  const onApproveClick = (id: string) => {
    router.push(`/superadmin/create-owner?requestId=${id}`);
  };

  const onHoldClick = (id: string) => {
    setSelectedReqId(id);
    setHoldModalOpen(true);
  };

  const onRejectClick = (id: string) => {
    setSelectedReqId(id);
    setRejectModalOpen(true);
  };

  const handleHold = () => {
    ownerRequestsApi.updateStatus(selectedReqId, 'Hold');
    setHoldModalOpen(false);
    toast.info('Request marked as Hold.');
    refetch();
  };

  const handleRejectSubmit = (reason: string) => {
    ownerRequestsApi.updateStatus(selectedReqId, 'Rejected', reason);
    setRejectModalOpen(false);
    toast.success('Request rejected successfully.');
    refetch();
  };

  return {
    rejectModalOpen,
    setRejectModalOpen,
    holdModalOpen,
    setHoldModalOpen,
    onApproveClick,
    onHoldClick,
    onRejectClick,
    handleHold,
    handleRejectSubmit
  };
};
