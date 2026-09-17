import { adminRequest } from '@/app/owner/owner_lib/owner_api/AdminClient';

import type { ManagerDashboardStats } from '@/app/manager/dashboard/ManagerDashboard_types/ManagerDashboard.types';

/**
 * Dashboard KPIs are computed exclusively by the backend from real DB tables
 * (backend/src/modules/admin/admin.service.ts -> getDashboardStats).
 *
 * The previous implementation aggregated localStorage records and substituted
 * hardcoded placeholder values ("todayCheckins: 1", housekeeping 8/12, maintenance
 * 3/5, pendingVisitors || 1) whenever the backend call failed — rendering fabricated
 * numbers as if they were real. It also auto-created invoices inside the browser via
 * seedMonthlyInvoices(). Both are removed: a failing request now surfaces an error
 * instead of inventing data.
 */
export const managerDashboardApi = {
  async fetchBackendStats(propertyId?: string): Promise<ManagerDashboardStats | null> {
    if (!propertyId) return null;

    const res = await adminRequest<any>(`/dashboard?propertyId=${encodeURIComponent(propertyId)}`);
    if (!res) return null;

    return {
      // Row 1
      todayCheckins: res.todayCheckins ?? 0,
      todayCheckouts: res.todayCheckouts ?? 0,
      openComplaints: res.openComplaints ?? 0,
      pendingVisitors: res.pendingVisitors ?? 0,
      occupiedBeds: res.occupiedBeds ?? 0,
      // Row 2
      occupancyRate: res.occupancyRate ?? 0,
      rentCollected: res.thisMonthCollection ?? 0,
      rentTarget: res.rentTarget ?? 0,
      housekeepingDone: res.housekeepingDone ?? 0,
      housekeepingTotal: res.housekeepingTotal ?? 0,
      maintenanceOpen: res.maintenanceOpen ?? 0,
      maintenanceTotal: res.maintenanceTotal ?? 0,
      // General
      activeStudents: res.totalTenants ?? 0,
      vacantBeds: res.vacantBeds ?? 0,
      activeSos: res.activeSos ?? 0,
      staffPresent: res.staffPresent ?? 0,
      pendingRent: res.pendingRent ?? 0,
      // Real activity feeds used by the dashboard widgets
      recentStays: Array.isArray(res.recentStays) ? res.recentStays : [],
      recentGateLogs: Array.isArray(res.recentGateLogs) ? res.recentGateLogs : [],
      latestEnquiries: Array.isArray(res.latestEnquiries) ? res.latestEnquiries : [],
    };
  }
};