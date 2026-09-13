import type { Invoice } from '@/app/owner/owner_lib/owner_api/OwnerFinance';
export type ManagerFinanceFilter = 'all' | 'paid' | 'pending';
export interface EnrichedInvoice extends Invoice {
  studentName?: string;
  roomBed?: string;
}
export interface ManagerFinanceStats {
  totalExpectedRent: number;
  totalCollectedRent: number;
  pendingRentAmount: number;
  totalStudents: number;
  studentsPaidCount: number;
  studentsPendingCount: number;
}
export interface ManagerFinanceData {
  invoices: EnrichedInvoice[];
  stats: ManagerFinanceStats | null;
  loading: boolean;
  filter: ManagerFinanceFilter;
  currentPage: number;
  totalPages: number;
  paginatedData: EnrichedInvoice[];
}
export interface UseManagerFinanceReturn extends ManagerFinanceData {
  setFilter: (f: ManagerFinanceFilter) => void;
  setCurrentPage: (p: number) => void;
  handleMarkPaid: (invId: string) => void;
  handleSendReminder: (studentName: string) => void;
  selectedPropertyId: string | null;
  ctxLoading: boolean;
}