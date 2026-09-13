// DATA FLOW: Mock data → useState → filter/search/paginate → UI
'use client';

import { useState, useEffect } from 'react';
import { MOCK_REQUESTS } from '@/app/superadmin/superadmin_lib/superadmin_mock_data';
import { ITEMS_PER_PAGE } from '@/app/superadmin/owner-requests/SuperAdminOwnerRequests_utils/SuperAdminOwnerRequests.constants';
import type { OwnerRequest, OwnerRequestStatus } from '@/app/superadmin/owner-requests/SuperAdminOwnerRequests_types/SuperAdminOwnerRequests.types';

export const SuperadminUseSuperAdminOwnerRequestsData = () => {
  const [requests] = useState<OwnerRequest[]>(MOCK_REQUESTS as unknown as OwnerRequest[]);
  const [filter, setFilter] = useState<OwnerRequestStatus>('All');
  const [search, setSearch] = useState('');
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

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
    refetch: () => {},
  };
};
