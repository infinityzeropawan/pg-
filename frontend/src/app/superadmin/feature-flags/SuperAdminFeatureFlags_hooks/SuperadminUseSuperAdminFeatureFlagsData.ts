// DATA FLOW: backend /api/v1/superadmin/feature-matrix -> hook state -> owner + plan matrix tables.
'use client';

import { useCallback, useEffect, useState } from 'react';

import { featureFlagsApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminFeatureFlags';
import { featureMatrixApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminFeatureMatrix';

import type { FeatureMatrix } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminFeatureMatrix';

const EMPTY_MATRIX: FeatureMatrix = { features: [], plans: [], owners: [] };

export function SuperadminUseSuperAdminFeatureFlagsData() {
  const [matrix, setMatrix] = useState<FeatureMatrix>(EMPTY_MATRIX);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const data = await featureMatrixApi.get();
    setMatrix(data);
  }, []);

  useEffect(() => {
    void refresh()
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load feature matrix'))
      .finally(() => setLoading(false));
  }, [refresh]);

  // Owner-level toggle writes a FeatureFlag override, which always wins over the plan.
  const handleOwnerToggle = async (ownerId: string, featureKey: string, nextEnabled: boolean) => {
    setPendingKey(`${ownerId}:${featureKey}`);
    setError(null);
    try {
      await featureFlagsApi.update(featureKey, ownerId, nextEnabled);
      setMatrix(prev => ({
        ...prev,
        owners: prev.owners.map(owner =>
          owner.ownerId === ownerId
            ? {
                ...owner,
                effective: {
                  ...owner.effective,
                  [featureKey]: { key: featureKey, enabled: nextEnabled, source: 'OVERRIDE' },
                },
              }
            : owner,
        ),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update owner feature');
      await refresh().catch(() => undefined);
    } finally {
      setPendingKey(null);
    }
  };

  // Plan-level toggle changes the entitlement every owner on that plan inherits.
  const handlePlanToggle = async (planId: string, featureKey: string, nextEnabled: boolean) => {
    setPendingKey(`${planId}:${featureKey}`);
    setError(null);
    try {
      await featureMatrixApi.updatePlanFeatures(planId, [{ featureKey, isEnabled: nextEnabled }]);
      // Re-fetch: owners with an override keep it, the rest follow the plan.
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update plan feature');
    } finally {
      setPendingKey(null);
    }
  };

  const filtered = matrix.owners.filter(owner => {
    if (!search) return true;
    const term = search.toLowerCase();
    return owner.name?.toLowerCase().includes(term) || owner.email?.toLowerCase().includes(term);
  });

  return {
    matrix,
    filtered,
    features: matrix.features,
    plans: matrix.plans,
    loading,
    error,
    search,
    setSearch,
    pendingKey,
    handleOwnerToggle,
    handlePlanToggle,
  };
}


