// DATA FLOW: Mock data → useState → filter/search/paginate → UI
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ownerRequestsApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminOwnerRequests';
import { ITEMS_PER_PAGE } from '@/app/superadmin/owner-requests/SuperAdminOwnerRequests_utils/SuperAdminOwnerRequests.constants';
import type { OwnerRequest, OwnerRequestStatus } from '@/app/superadmin/owner-requests/SuperAdminOwnerRequests_types/SuperAdminOwnerRequests.types';

export const SuperadminUseSuperAdminOwnerRequestsData = () => {
  const [requests, setRequests] = useState<OwnerRequest[]>([]);
  const [filter, setFilter] = useState<OwnerRequestStatus>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ownerRequestsApi.list();
      setRequests(data.map((request: any) => ({ ...request, businessName: request.businessName || '-', status: request.status === 'UNDER_REVIEW' ? 'Hold' : request.status[0] + request.status.slice(1).toLowerCase() })) as OwnerRequest[]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void refetch(); }, [refetch]);

  const filtered = requests.filter(r => {
    if (filter !== 'All' && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.businessName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return {
    requests: paginatedData,
    loading,
    filter,
    setFilter,
    search,
    setSearch,
    currentPage,
    totalPages,
    setCurrentPage,
    refetch,
  };
};
