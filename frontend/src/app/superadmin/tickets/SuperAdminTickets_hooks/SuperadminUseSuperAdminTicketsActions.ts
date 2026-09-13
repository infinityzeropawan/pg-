// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminTicketsActions.ts]
'use client';

import { useState } from 'react';

import { ticketsApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminTickets';
import { DEFAULT_CREATE_TICKET_FORM_DATA } from '@/app/superadmin/tickets/SuperAdminTickets_utils/SuperAdminTickets.constants';

import type { CreateTicketFormData } from '@/app/superadmin/tickets/SuperAdminTickets_types/SuperAdminTickets.types';

export function SuperadminUseSuperAdminTicketsActions(refetch: () => void) {
  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState<CreateTicketFormData>(DEFAULT_CREATE_TICKET_FORM_DATA);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!(formData as any).ownerId || !(formData as any).title || !(formData as any).description) return;
    
    ticketsApi.createTicketOnBehalf(formData);
    setCreateModal(false);
    setFormData(DEFAULT_CREATE_TICKET_FORM_DATA);
    refetch();
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    ticketsApi.updateTicketStatus(id, newStatus);
    refetch();
  };

  return {
    createModal,
    setCreateModal,
    formData,
    setFormData,
    handleCreate,
    handleStatusChange
  };
}
