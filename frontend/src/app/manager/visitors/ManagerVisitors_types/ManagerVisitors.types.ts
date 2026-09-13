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
  selectedPropertyId: string | null;
  ctxLoading: boolean;
}
export interface UseManagerVisitorsReturn extends ManagerVisitorsData {
  handleStatus: (id: string, status: string) => void;
}