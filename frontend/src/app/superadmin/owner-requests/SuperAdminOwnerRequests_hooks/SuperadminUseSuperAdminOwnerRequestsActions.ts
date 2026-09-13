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

  const handleHold = async () => {
    try {
      await ownerRequestsApi.updateStatus(selectedReqId, 'Hold');
      setHoldModalOpen(false);
      toast.info('Request marked as Hold.');
      await refetch();
    } catch (error: any) { toast.error(error.message || 'Unable to update request.'); }
  };

  const handleRejectSubmit = async (reason: string) => {
    try {
      await ownerRequestsApi.updateStatus(selectedReqId, 'Rejected', reason);
      setRejectModalOpen(false);
      toast.success('Request rejected successfully.');
      await refetch();
    } catch (error: any) { toast.error(error.message || 'Unable to reject request.'); }
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
