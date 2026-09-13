// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminOwnerProfileData.ts]
'use client';

import { useState, useEffect } from 'react';
import { MOCK_OWNERS, MOCK_REQUESTS, MOCK_PLANS, MOCK_TICKETS, MOCK_DASHBOARD_STATS } from '@/app/superadmin/superadmin_lib/superadmin_mock_data';

import { useRouter } from 'next/navigation';

import { ownersApi } from '@/app/owner/owner_lib/owner_api/owners';

import type { Owner360Data } from '@/app/superadmin/owners/SuperAdminOwners_types/SuperAdminOwners.types';

export function SuperadminUseSuperAdminOwnerProfileData(id: string) {
  const router = useRouter();
  const [data, setData] = useState<Owner360Data | null>({ owner: MOCK_OWNERS.find(o => o.id === id) || MOCK_OWNERS[0], user: { status: 'Active' }, properties: [], managersCount: 2, studentsCount: 45, recentPayments: [], tickets: [] } as any);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id, router]);

  return { data, loading, refetch: loadData };
}
