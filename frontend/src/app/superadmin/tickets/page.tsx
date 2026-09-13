'use client';

import React from 'react';

import { SuperAdminTicketsHeader } from '@/app/superadmin/tickets/SuperAdminTickets_components/SuperAdminTicketsHeader';
import { SuperAdminTicketsTable } from '@/app/superadmin/tickets/SuperAdminTickets_components/SuperAdminTicketsTable';
import { SuperAdminTicketsCreateModal } from '@/app/superadmin/tickets/SuperAdminTickets_components/SuperAdminTicketsCreateModal';
import { SuperadminUseSuperAdminTicketsData } from '@/app/superadmin/tickets/SuperAdminTickets_hooks/SuperadminUseSuperAdminTicketsData';
import { SuperadminUseSuperAdminTicketsActions } from '@/app/superadmin/tickets/SuperAdminTickets_hooks/SuperadminUseSuperAdminTicketsActions';

export default function TicketsPage() {
  const {
    tickets,
    owners,
    loading,
    search,
    setSearch,
    currentPage,
    totalPages,
    setCurrentPage,
    refetch
  } = SuperadminUseSuperAdminTicketsData();

  const {
    createModal,
    setCreateModal,
    formData,
    setFormData,
    handleCreate,
    handleStatusChange
  } = SuperadminUseSuperAdminTicketsActions(refetch);

  return (
    <div className="space-y-6 pb-20">
      <SuperAdminTicketsHeader onCreateClick={() => setCreateModal(true)} />
      
      <SuperAdminTicketsTable 
        tickets={tickets}
        owners={owners}
        loading={loading}
        search={search}
        setSearch={setSearch}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onStatusChange={handleStatusChange}
      />

      <SuperAdminTicketsCreateModal 
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        owners={owners}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreate}
      />
    </div>
  );
}