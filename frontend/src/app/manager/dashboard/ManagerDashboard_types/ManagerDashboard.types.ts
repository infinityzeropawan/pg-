export interface ManagerRecentStay {
  id: string;
  tenantName: string;
  propertyName: string;
  roomNumber: string;
  bedNumber: string;
  status: string;
}

export interface ManagerRecentGateLog {
  id?: string;
  visitorName?: string;
  entryType?: string;
  createdAt?: string;
}

export interface ManagerLatestEnquiry {
  name: string;
  date: string;
  status: string;
  property: string;
}

export interface ManagerDashboardStats {
  // Row 1
  todayCheckins: number;
  todayCheckouts: number;
  openComplaints: number;
  pendingVisitors: number;
  occupiedBeds: number;
  // Row 2 Summary
  occupancyRate: number;
  rentCollected: number;
  rentTarget: number;
  housekeepingDone: number;
  housekeepingTotal: number;
  maintenanceOpen: number;
  maintenanceTotal: number;
  // General (kept from old)
  activeStudents: number;
  vacantBeds: number;
  activeSos: number;
  staffPresent: number;
  pendingRent: number;
  // Real activity feeds supplied by the backend dashboard endpoint
  recentStays: ManagerRecentStay[];
  recentGateLogs: ManagerRecentGateLog[];
  latestEnquiries: ManagerLatestEnquiry[];
}
export interface ManagerDashboardData {
  stats: ManagerDashboardStats | null;
  isPresent: boolean;
  /** Populated when the dashboard request fails, so failures are never masked. */
  error: string | null;
  loading: boolean;
}
export interface UseManagerDashboardReturn extends ManagerDashboardData {
  handleMarkPresent: () => Promise<void>;
  selectedPropertyId: string | null;
  ctxLoading: boolean;
  properties: unknown[];
  user: unknown;
}