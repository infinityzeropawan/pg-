import type { OwnerRequestStatus } from '@/app/superadmin/owner-requests/SuperAdminOwnerRequests_types/SuperAdminOwnerRequests.types';

export const SUPER_ADMIN_OWNER_REQUEST_STATUSES: OwnerRequestStatus[] = [
  'All',
  'Pending',
  'Hold',
  'Approved',
  'Rejected'
];

export const ITEMS_PER_PAGE = 10;
