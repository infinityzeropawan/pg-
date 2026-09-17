import { superadminRequest } from './SuperadminClient';

export interface FeatureCatalogEntry {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  category: string;
  isCore: boolean;
  defaultEnabled: boolean;
  /** false = catalog-only placeholder with no runtime gate yet. */
  enforced: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface PlanEntitlement {
  featureKey: string;
  isEnabled: boolean;
}

export interface SuperadminPlanWithFeatures {
  id: string;
  name: string;
  code: string;
  priceMonthly: number;
  priceYearly: number;
  maxProperties: number;
  maxBeds: number;
  entitlements: PlanEntitlement[];
}

export type FeatureSource = 'CORE' | 'OVERRIDE' | 'PLAN' | 'DEFAULT';

export interface EffectiveFeature {
  key: string;
  enabled: boolean;
  source: FeatureSource;
}

export interface OwnerFeatureRow {
  ownerId: string;
  name: string;
  email: string;
  isSuspended: boolean;
  plan: { code: string; name: string } | null;
  effective: Record<string, EffectiveFeature>;
}

export interface FeatureMatrix {
  features: FeatureCatalogEntry[];
  plans: SuperadminPlanWithFeatures[];
  owners: OwnerFeatureRow[];
}

export const featureMatrixApi = {
  get: () => superadminRequest<FeatureMatrix>('/feature-matrix'),
  listCatalog: () => superadminRequest<FeatureCatalogEntry[]>('/features'),
  saveFeature: (payload: Partial<FeatureCatalogEntry> & { key: string }) =>
    superadminRequest<FeatureCatalogEntry>('/features', { method: 'POST', body: JSON.stringify(payload) }),
  updatePlanFeatures: (planId: string, features: PlanEntitlement[]) =>
    superadminRequest<PlanEntitlement[]>(`/plans/${planId}/features`, {
      method: 'PUT',
      body: JSON.stringify({ features }),
    }),
};
