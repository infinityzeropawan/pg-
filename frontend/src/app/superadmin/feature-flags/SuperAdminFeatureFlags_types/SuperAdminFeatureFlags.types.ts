import type {
  FeatureCatalogEntry,
  OwnerFeatureRow,
  SuperadminPlanWithFeatures,
} from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminFeatureMatrix';

export interface SuperAdminFeatureFlagsHeaderProps {}

export interface SuperAdminFeatureFlagsToolbarProps {
  search: string;
  setSearch: (val: string) => void;
}

export interface SuperAdminFeatureFlagsTableProps {
  owners: OwnerFeatureRow[];
  features: FeatureCatalogEntry[];
  onToggle: (ownerId: string, featureKey: string, nextEnabled: boolean) => void;
  pendingKey?: string | null;
}

export interface SuperAdminFeatureFlagsPlanMatrixProps {
  plans: SuperadminPlanWithFeatures[];
  features: FeatureCatalogEntry[];
  onToggle: (planId: string, featureKey: string, nextEnabled: boolean) => void;
  pendingKey?: string | null;
}

