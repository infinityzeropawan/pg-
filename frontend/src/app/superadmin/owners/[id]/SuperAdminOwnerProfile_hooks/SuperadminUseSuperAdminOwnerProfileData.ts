// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminOwnerProfileData.ts]
'use client';

import { useState, useEffect, useCallback } from 'react';
import { superadminOwnersApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminOwners';

import type { Owner360Data } from '@/app/superadmin/owners/SuperAdminOwners_types/SuperAdminOwners.types';

export function SuperadminUseSuperAdminOwnerProfileData(id: string) {
  const [data, setData] = useState<Owner360Data | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await superadminOwnersApi.get(id);
      setData({ ...result, owner: { ...result.owner, name: result.owner.fullName, businessName: result.owner.fullName, userId: result.owner.id, status: result.owner.isSuspended ? 'Suspended' : 'Active' }, user: { ...result.owner, name: result.owner.fullName, status: result.owner.isSuspended ? 'Suspended' : 'Active' } } as Owner360Data);
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return { data, loading, refetch: loadData };
}
