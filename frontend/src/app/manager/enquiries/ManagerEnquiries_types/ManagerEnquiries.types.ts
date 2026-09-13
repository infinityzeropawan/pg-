import type { EnquiryStatus } from '@/app/manager/manager_lib/manager_api/managerEnquiries';
export interface EnquiryFormData {
  name: string;
  phone: string;
  email: string;
  expectedMoveIn: string;
  budget: string;
  notes: string;
}
export type EnquiriesTab = 'pipeline' | 'lost';
export interface ManagerEnquiriesState {
  enquiries: unknown[];
  loading: boolean;
  showAddModal: boolean;
  searchQuery: string;
  activeTab: EnquiriesTab;
  waMenuEnquiry: unknown | null;
  formData: EnquiryFormData;
  currentPage: number;
}