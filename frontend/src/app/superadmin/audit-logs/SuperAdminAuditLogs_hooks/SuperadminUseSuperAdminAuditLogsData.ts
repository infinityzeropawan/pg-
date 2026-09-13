// DATA FLOW: Mock data → useState → filter/paginate → UI
'use client';

import { useState, useEffect } from 'react';
import { MOCK_AUDIT_LOGS } from '@/app/superadmin/superadmin_lib/superadmin_mock_data';
import type { SuperAdminAuditLog } from '@/app/superadmin/audit-logs/SuperAdminAuditLogs_types/SuperAdminAuditLogs.types';

export function SuperadminUseSuperAdminAuditLogsData() {
  const [logs] = useState<SuperAdminAuditLog[]>(MOCK_AUDIT_LOGS as SuperAdminAuditLog[]);
  const [loading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, search]);

  const filtered = logs.filter(l => {
    if (roleFilter !== 'All') {
      const actionText = l.action ? l.action.toLowerCase() : '';
      if (!actionText.includes(roleFilter.toLowerCase())) return false;
    }

    if (search) {
      const q = search.toLowerCase();
      const actionText = l.action ? l.action.toLowerCase() : '';
      const detailsText = l.details ? l.details.toLowerCase() : (l.entity ? l.entity.toLowerCase() : '');
      return actionText.includes(q) || detailsText.includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return {
    loading,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    filters: ['All', 'Auth', 'Settings', 'Owners'],
  };
}
