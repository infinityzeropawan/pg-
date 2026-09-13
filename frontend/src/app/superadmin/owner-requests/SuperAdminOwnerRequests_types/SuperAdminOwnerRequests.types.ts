import type { OwnerRequest } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminOwnerRequests';

export type { OwnerRequest };

export type OwnerRequestStatus = 'All' | 'Pending' | 'Hold' | 'Approved' | 'Rejected';

export interface SuperAdminOwnerRequestsFiltersProps {
  filter: OwnerRequestStatus;
  setFilter: (f: OwnerRequestStatus) => void;
  search: string;
  setSearch: (s: string) => void;
}

export interface SuperAdminOwnerRequestsTableProps {
  requests: OwnerRequest[];
  loading: boolean;
  onApprove: (id: string) => void;
  onHold: (id: string) => void;
  onReject: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface SuperAdminOwnerRequestsReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}
