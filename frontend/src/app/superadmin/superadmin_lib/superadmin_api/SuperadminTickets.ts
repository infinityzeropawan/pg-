import { superadminRequest } from './SuperadminClient';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
  [key: string]: unknown;
}

export const ticketsApi = {
  async listTickets(): Promise<Ticket[]> {
    const tickets = await superadminRequest<any[]>('/tickets');
    return tickets.map((ticket) => ({ ...ticket, status: ticket.status.replaceAll('_', ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase()), priority: ticket.priority.replace(/\b\w/g, (letter: string) => letter.toUpperCase()), createdBy: ticket.createdBy || 'system', updatedBy: ticket.updatedBy || 'system', isDeleted: false }));
  },
  
  createTicketOnBehalf(data: { ownerId: string, title: string, description: string, priority: string }) { return superadminRequest('/tickets', { method: 'POST', body: JSON.stringify(data) }); },
  
  updateTicketStatus(id: string, status: string) { return superadminRequest(`/tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); }
};
