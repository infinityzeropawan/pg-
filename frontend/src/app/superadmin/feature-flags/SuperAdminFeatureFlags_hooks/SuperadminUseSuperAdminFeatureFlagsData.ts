// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminFeatureFlagsData.ts]
'use client';

import { useState, useEffect } from 'react';
import { featureFlagsApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminFeatureFlags';
import { superadminOwnersApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminOwners';

import type { SuperAdminFeatureFlagOwner } from '@/app/superadmin/feature-flags/SuperAdminFeatureFlags_types/SuperAdminFeatureFlags.types';

export function SuperadminUseSuperAdminFeatureFlagsData() {
  const [owners, setOwners] = useState<SuperAdminFeatureFlagOwner[]>([]);
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  
  const availableFeatures = [...new Set(['whatsapp_alerts', 'custom_domain', 'smart_meters', 'payment_gateway', ...flags.map((flag) => flag.key)])];

  useEffect(() => {
    void Promise.all([superadminOwnersApi.list(), featureFlagsApi.list()]).then(([ownerData, flagData]) => {
      setOwners(ownerData.map((owner: any) => ({ id: owner.id, businessName: owner.name, planId: owner.planId || 'None', featureOverrides: flagData.filter((flag: any) => flag.ownerId === owner.id) })) as any);
      setFlags(flagData);
    }).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (ownerId: string, feature: string) => {
    const current = flags.find((flag) => flag.ownerId === ownerId && flag.key === feature);
    const updated = await featureFlagsApi.update(feature, ownerId, !current?.isEnabled);
    const nextFlags = [...flags.filter((flag) => !(flag.ownerId === ownerId && flag.key === feature)), updated];
    setFlags(nextFlags);
    setOwners((prevOwners) =>
      prevOwners.map((owner) => ({
        ...owner,
        featureOverrides: nextFlags.filter((flag) => flag.ownerId === owner.id),
      }))
    );
  };

  const filtered = owners.filter(o => {
    if (!search) return true;
    return o.businessName?.toLowerCase().includes(search.toLowerCase());
  });

  return {
    filtered,
    loading,
    search,
    setSearch,
    handleToggle,
    availableFeatures
  };
}

