import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

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
  listTickets() {
    let SuperadminTickets = db.getAll<Ticket>('spg_tickets');
    if (SuperadminTickets.length === 0) {
      // Seed dummy SuperadminTickets
      const dummy = [
        { id: createId('tkt'), title: 'App not loading on mobile', description: 'Students are complaining app is stuck on white screen.', status: 'Open', priority: 'High', ownerId: 'own_1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: createId('tkt'), title: 'Need custom GST format', description: 'Can you change the invoice format for my state?', status: 'Resolved', priority: 'Low', ownerId: 'own_1', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString() }
      ];
      dummy.forEach(d => db.insert('spg_tickets', d as unknown as import('@/lib/storage/db').BaseEntity));
      SuperadminTickets = dummy as Ticket[];
    }
    return SuperadminTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  
  createTicketOnBehalf(data: { ownerId: string, title: string, description: string, priority: string }) {
    const ticket = {
      id: createId('tkt'),
      ...data,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'superadmin',
      updatedBy: 'superadmin',
      isDeleted: false
    };
    db.insert('spg_tickets', ticket as unknown as import('@/lib/storage/db').BaseEntity);
    return ticket;
  },
  
  updateTicketStatus(id: string, status: string) {
    db.update<Ticket>('spg_tickets', id, { status } as unknown as Partial<Ticket>);
  }
};
