import type { BaseEntity } from '@/lib/types/contract';
export interface User extends BaseEntity {
  role: 'owner' | 'manager' | 'staff' | 'student';
  name: string;
  email: string;
  phone: string;
  password?: string;
  status: 'Active' | 'Pending' | 'Suspended' | 'Inactive';
  mustChangePassword?: boolean;
  ownerId?: string; // Optional, if user is an owner, this links to their owner profile
}

export interface OwnerProfile extends BaseEntity {
  userId: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  gst?: string;
  pan?: string;
  expectedPgs?: number;
  expectedBeds?: number;
}

export type OwnerStatus = 'All' | 'Active' | 'Pending' | 'Suspended' | 'Inactive';

export interface OwnerDirectoryItem extends OwnerProfile {
  status: string;
  lastLogin?: string;
  planId: string;
  propertiesCount: number;
  bedsCount: number;
  occupancy: number;
  collectionThisMonth: number;
}

export interface Owner360Data {
  owner: OwnerProfile;
  user?: User;
  subscription?: unknown; // To be strictly typed when subscription module is refactored
  properties: unknown[];
  managersCount: number;
  studentsCount: number;
  recentPayments: unknown[];
  tickets: unknown[];
}

// Props Interfaces for Components

export interface SuperAdminOwnersFiltersProps {
  statusFilter: OwnerStatus;
  setStatusFilter: (f: OwnerStatus) => void;
  search: string;
  setSearch: (s: string) => void;
}

export interface SuperAdminOwnersTableProps {
  owners: OwnerDirectoryItem[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRowClick: (id: string) => void;
}

export interface SuperAdminOwnerProfileHeaderProps {
  owner: OwnerProfile;
  userStatus?: string;
  onStatusChange: (status: 'Active' | 'Pending' | 'Suspended') => void;
  onResetPassword: () => void;
}

export interface SuperAdminOwnerProfileStatsGridProps {
  data: Owner360Data;
}

export interface SuperAdminOwnerProfilePropertiesProps {
  properties: unknown[];
}

export interface SuperAdminOwnerProfileSubscriptionProps {
  subscription: unknown;
  payments: unknown[];
  onUpgradePlan: (planId: string) => void;
}

export interface SuperAdminOwnerProfileAuditLogsProps {
  logs: unknown[];
  onAddNote: (note: string) => void;
}
