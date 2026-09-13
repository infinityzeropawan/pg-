// DATA FLOW: Mock data → useState → filter/paginate → UI
'use client';

import { useState, useEffect } from 'react';
import { MOCK_TICKETS, MOCK_OWNERS } from '@/app/superadmin/superadmin_lib/superadmin_mock_data';
import { SUPER_ADMIN_TICKETS_ITEMS_PER_PAGE } from '@/app/superadmin/tickets/SuperAdminTickets_utils/SuperAdminTickets.constants';
import type { SuperAdminTicket, TicketOwnerContext } from '@/app/superadmin/tickets/SuperAdminTickets_types/SuperAdminTickets.types';

export function SuperadminUseSuperAdminTicketsData() {
  const [tickets] = useState<SuperAdminTicket[]>(MOCK_TICKETS as unknown as SuperAdminTicket[]);
  const [owners] = useState<TicketOwnerContext[]>(
    MOCK_OWNERS.map(o => ({ id: o.id, name: o.name, businessName: o.businessName }))
  );
  const [loading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = tickets.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / SUPER_ADMIN_TICKETS_ITEMS_PER_PAGE);
  const paginatedData = filtered.slice(
    (currentPage - 1) * SUPER_ADMIN_TICKETS_ITEMS_PER_PAGE,
    currentPage * SUPER_ADMIN_TICKETS_ITEMS_PER_PAGE
  );

  const handleStatusChange = (id: string, newStatus: string) => {
    console.log('Status change (mock):', id, newStatus);
  };

  return {
    tickets: paginatedData,
    owners,
    loading,
    search,
    setSearch,
    currentPage,
    totalPages,
    setCurrentPage,
    handleStatusChange,
    refetch: () => {},
  };
}
