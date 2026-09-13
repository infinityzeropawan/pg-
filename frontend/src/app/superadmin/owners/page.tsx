'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SuperAdminOwnersFilters } from '@/app/superadmin/owners/SuperAdminOwners_components/SuperAdminOwnersFilters';
import { SuperAdminOwnersTable } from '@/app/superadmin/owners/SuperAdminOwners_components/SuperAdminOwnersTable';
import { SuperadminUseSuperAdminOwnersData } from '@/app/superadmin/owners/SuperAdminOwners_hooks/SuperadminUseSuperAdminOwnersData';

export default function SuperAdminOwnersDirectoryPage() {
  const router = useRouter();
  const dataHook = SuperadminUseSuperAdminOwnersData();

  const handleRowClick = (id: string) => {
    router.push(`/superadmin/owners/${id}`);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary">PG Owners Directory</h1>
          <p className="text-secondary text-sm">Manage registered owners and their platform usage.</p>
        </div>
        <Link 
          href="/superadmin/create-owner" 
          className="bg-primary text-white px-4 py-2 rounded-[var(--radius-md,8px)] text-sm font-medium hover:bg-primary-hover motion-safe:transition-colors shadow-sm"
        >
          + Add New Owner
        </Link>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm">
        <SuperAdminOwnersFilters 
          statusFilter={dataHook.statusFilter}
          setStatusFilter={dataHook.setStatusFilter}
          search={dataHook.search}
          setSearch={dataHook.setSearch}
        />
        <SuperAdminOwnersTable 
          owners={dataHook.owners}
          loading={dataHook.loading}
          currentPage={dataHook.currentPage}
          totalPages={dataHook.totalPages}
          onPageChange={dataHook.setCurrentPage}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
}