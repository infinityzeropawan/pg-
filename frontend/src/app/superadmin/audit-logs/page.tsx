'use client';

import React from 'react';

import { SuperadminUseSuperAdminAuditLogsData } from '@/app/superadmin/audit-logs/SuperAdminAuditLogs_hooks/SuperadminUseSuperAdminAuditLogsData';
import { SuperAdminAuditLogsHeader } from '@/app/superadmin/audit-logs/SuperAdminAuditLogs_components/SuperAdminAuditLogsHeader';
import { SuperAdminAuditLogsFilters } from '@/app/superadmin/audit-logs/SuperAdminAuditLogs_components/SuperAdminAuditLogsFilters';
import { SuperAdminAuditLogsTimeline } from '@/app/superadmin/audit-logs/SuperAdminAuditLogs_components/SuperAdminAuditLogsTimeline';

export default function AuditLogsPage() {
  const {
    loading,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    filters
  } = SuperadminUseSuperAdminAuditLogsData();

  if (loading) return null; // Let loading.tsx handle it

  return (
    <div className="space-y-6 pb-20">
      <SuperAdminAuditLogsHeader />

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm">
        <SuperAdminAuditLogsFilters 
          search={search} 
          setSearch={setSearch} 
          roleFilter={roleFilter} 
          setRoleFilter={setRoleFilter} 
          filters={filters} 
        />

        <SuperAdminAuditLogsTimeline 
          logs={paginatedData} 
          currentPage={currentPage} 
          totalPages={totalPages} 
          setCurrentPage={setCurrentPage} 
        />
      </div>
    </div>
  );
}