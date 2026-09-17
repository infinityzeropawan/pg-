export interface Visitor {
  id: string;
  propertyId: string;
  name: string;
  phone: string;
  studentName?: string;
  studentId?: string;
  roomNumber?: string;
  relation: string;
  status: 'pending' | 'approved' | 'rejected' | 'checked_in' | 'checked_out';
}
export interface ManagerVisitorsData {
  visitors: Visitor[];
  loading: boolean;
  /** Populated when the visitor list or a status change fails. */
  error: string | null;
  selectedPropertyId: string | null;
  ctxLoading: boolean;
}
export interface UseManagerVisitorsReturn extends ManagerVisitorsData {
  handleStatus: (id: string, status: string) => Promise<void>;
}