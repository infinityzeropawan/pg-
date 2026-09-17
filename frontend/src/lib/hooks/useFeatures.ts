'use client';

import { useEffect, useState } from 'react';

import { apiClient } from '@/lib/api/apiClient';

export interface FeatureAccess {
  key: string;
  enabled: boolean;
  /** CORE | OVERRIDE | PLAN | DEFAULT — where the decision came from. */
  source: string;
}

interface FeaturesMeResponse {
  role: string;
  ownerId: string | null;
  features: FeatureAccess[];
}

type FeatureMap = Record<string, FeatureAccess>;

// Module-level cache so every component shares one request per session.
let cache: FeatureMap | null = null;
let inflight: Promise<FeatureMap> | null = null;

async function requestFeatures(): Promise<FeatureMap> {
  const response = await apiClient<FeaturesMeResponse>('/api/v1/features/me');
  const map: FeatureMap = {};
  for (const feature of response.data?.features || []) map[feature.key] = feature;
  return map;
}

export function resetFeatureCache() {
  cache = null;
  inflight = null;
}

/**
 * Effective plan features for the signed-in tenant.
 * `isEnabled` fails open for unknown keys so a missing catalog entry never locks the UI.
 */
export function useFeatures() {
  const [features, setFeatures] = useState<FeatureMap | null>(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    let active = true;

    inflight = inflight || requestFeatures();
    inflight
      .then((map) => {
        cache = map;
        inflight = null;
        if (active) {
          setFeatures(map);
          setLoading(false);
        }
      })
      .catch(() => {
        inflight = null;
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const isEnabled = (key: string) => (features ? features[key]?.enabled ?? true : true);

  return { features, loading, isEnabled };
}
