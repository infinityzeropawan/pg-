// DATA FLOW: Mock data → useState → filter/search/paginate → UI
'use client';

import { useState, useEffect, useCallback } from 'react';
import { superadminOwnersApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminOwners';
import { ITEMS_PER_PAGE } from '@/app/superadmin/owners/SuperAdminOwners_utils/SuperAdminOwners.constants';
import type { OwnerDirectoryItem, OwnerStatus } from '@/app/superadmin/owners/SuperAdminOwners_types/SuperAdminOwners.types';

export function SuperadminUseSuperAdminOwnersData() {
  const [owners, setOwners] = useState<OwnerDirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OwnerStatus>('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, search]);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await superadminOwnersApi.list();
      setOwners(data.map((owner: any) => ({ ...owner, businessName: owner.name, userId: owner.id, planId: owner.planId || 'None', propertiesCount: owner.propertyCount || 0, bedsCount: owner.maxBeds || 0, occupancy: 0, collectionThisMonth: 0 })));
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void refetch(); }, [refetch]);

  const filtered = owners.filter(o => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.name.toLowerCase().includes(q) ||
        o.businessName.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return {
    owners: paginatedData,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    currentPage,
    totalPages,
    setCurrentPage,
    refetch,
  };
}
