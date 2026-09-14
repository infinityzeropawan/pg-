import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

import type { BaseEntity } from '@/lib/storage/db';
import { financeApi } from '@/app/owner/owner_lib/owner_api/OwnerFinance';

export const managerDashboardApi = {
  seedMocksIfEmpty: (_propertyId?: string) => {
    // No-op: mock seeding deleted
  },
  getStats: (propertyId: string) => {
    if (!propertyId) return null;
    const students = db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.STUDENTS).filter(t => t.propertyId === propertyId && !t.isDeleted);
    const activeStudents = students.filter(t => t.status === 'active' || t.status === 'on_notice').length;
    const beds = db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.BEDS).filter(b => b.propertyId === propertyId && !b.isDeleted);
    const vacantBeds = beds.filter(b => b.status === 'available' || b.status === 'vacant').length;
    const complaints = db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.COMPLAINTS).filter(c => c.propertyId === propertyId && !c.isDeleted);
    const openComplaints = complaints.filter(c => c.status !== 'resolved').length;
    const activeSos = db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.SOS || 'spg_sos').filter(s => s.propertyId === propertyId && s.status === 'active' && !s.isDeleted).length;
    // Rent Statistics
    financeApi.seedMonthlyInvoices(propertyId); // Ensure current month invoices exist
    const now = new Date();
    const currentMonthStr = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
    const allInvoices = db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.INVOICES).filter(i => i.propertyId === propertyId && i.month === currentMonthStr && !i.isDeleted);
    const totalExpectedRent = allInvoices.reduce((acc, curr) => acc + (curr.amount as number), 0);
    const totalCollectedRent = allInvoices.filter(i => (i.status as string).toLowerCase() === 'paid').reduce((acc, curr) => acc + (curr.amount as number), 0);
    const pendingRentAmount = allInvoices.filter(i => (i.status as string).toLowerCase() !== 'paid').reduce((acc, curr) => acc + (curr.amount as number), 0);
    const paidStudentIds = new Set(allInvoices.filter(i => (i.status as string).toLowerCase() === 'paid').map(i => i.studentId));
    const pendingStudentIds = new Set(allInvoices.filter(i => (i.status as string).toLowerCase() !== 'paid').map(i => i.studentId));
    const occupiedBeds = beds.length - vacantBeds;
    const occupancyRate = beds.length > 0 ? Math.round((occupiedBeds / beds.length) * 100) : 0;

    return {
      // Row 1
      todayCheckins: 1, // Simulated fixed
      todayCheckouts: 0,
      openComplaints,
      pendingVisitors: db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.VISITORS || 'spg_visitors').filter(v => v.propertyId === propertyId && v.status === 'pending').length || 1, 
      occupiedBeds,
      // Row 2
      occupancyRate,
      rentCollected: totalCollectedRent,
      rentTarget: totalExpectedRent,
      housekeepingDone: 8,
      housekeepingTotal: 12,
      maintenanceOpen: 3,
      maintenanceTotal: 5,
      // General
      activeStudents,
      vacantBeds,
      activeSos,
    };
  },
  async fetchBackendStats(propertyId?: string) {
    try {
      const { adminRequest } = await import('@/app/owner/owner_lib/owner_api/AdminClient');
      const url = propertyId ? `/dashboard?propertyId=${encodeURIComponent(propertyId)}` : '/dashboard';
      const res = await adminRequest<any>(url);
      if (res) {
        // All KPIs are computed by the backend from real DB tables
        return {
          todayCheckins: res.todayCheckins || 0,
          todayCheckouts: res.todayCheckouts || 0,
          openComplaints: res.openComplaints || 0,
          pendingVisitors: res.pendingVisitors || 0,
          occupiedBeds: res.occupiedBeds || 0,
          occupancyRate: res.occupancyRate || 0,
          rentCollected: res.thisMonthCollection || 0,
          rentTarget: res.rentTarget || 0,
          housekeepingDone: res.housekeepingDone || 0,
          housekeepingTotal: res.housekeepingTotal || 0,
          maintenanceOpen: res.maintenanceOpen || 0,
          maintenanceTotal: res.maintenanceTotal || 0,
          activeStudents: res.totalTenants || 0,
          vacantBeds: res.vacantBeds || 0,
          activeSos: res.activeSos || 0,
        };
      }
    } catch {
      // Fallback
    }
    return null;
  }
};