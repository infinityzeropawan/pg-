export interface SuperAdminFeatureFlagOwner {
  id: string;
  businessName: string;
  planId: string;
  // Other fields exist from listOwners but these are what we use in UI
}

export interface SuperAdminFeatureFlagsHeaderProps {}

export interface SuperAdminFeatureFlagsToolbarProps {
  search: string;
  setSearch: (val: string) => void;
}

export interface SuperAdminFeatureFlagsTableProps {
  owners: SuperAdminFeatureFlagOwner[];
  availableFeatures: string[];
  onToggle: (ownerId: string, feature: string) => void;
}
