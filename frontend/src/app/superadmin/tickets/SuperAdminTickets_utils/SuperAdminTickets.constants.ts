import type { CreateTicketFormData } from '@/app/superadmin/tickets/SuperAdminTickets_types/SuperAdminTickets.types';

export const SUPER_ADMIN_TICKETS_ITEMS_PER_PAGE = 10;

export const DEFAULT_CREATE_TICKET_FORM_DATA: CreateTicketFormData = {
  ownerId: '', 
  title: '', 
  description: '', 
  priority: 'Medium'
};
