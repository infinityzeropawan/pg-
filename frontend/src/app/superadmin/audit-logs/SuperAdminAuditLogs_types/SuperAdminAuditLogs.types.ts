export interface SuperAdminAuditLog {
  id: string;
  action: string;
  actorId: string;
  targetId?: string; // used in some manual logs
  entityId?: string; // used in auditApi.write
  details?: string;  // used in some manual logs
  entity?: string;   // used in auditApi.write
  meta?: unknown;
  createdAt: string;
}

export interface SuperAdminAuditLogsHeaderProps {}

export interface SuperAdminAuditLogsFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  roleFilter: string;
  setRoleFilter: (val: string) => void;
  filters: string[];
}

export interface SuperAdminAuditLogsTimelineProps {
  logs: SuperAdminAuditLog[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}
