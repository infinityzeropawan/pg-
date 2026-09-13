// DATA FLOW: Mock data → useState → filter/paginate → UI
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ticketsApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminTickets';
import { superadminOwnersApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminOwners';
import { SUPER_ADMIN_TICKETS_ITEMS_PER_PAGE } from '@/app/superadmin/tickets/SuperAdminTickets_utils/SuperAdminTickets.constants';
import type { SuperAdminTicket, TicketOwnerContext } from '@/app/superadmin/tickets/SuperAdminTickets_types/SuperAdminTickets.types';

export function SuperadminUseSuperAdminTicketsData() {
  const [tickets, setTickets] = useState<SuperAdminTicket[]>([]);
  const [owners, setOwners] = useState<TicketOwnerContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const [ticketData, ownerData] = await Promise.all([ticketsApi.listTickets(), superadminOwnersApi.list()]);
      setTickets(ticketData as SuperAdminTicket[]);
      setOwners(ownerData.map((owner: any) => ({ id: owner.id, name: owner.name, businessName: owner.name })));
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void refetch(); }, [refetch]);

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
    void ticketsApi.updateTicketStatus(id, newStatus).then(refetch);
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
    refetch,
  };
}
