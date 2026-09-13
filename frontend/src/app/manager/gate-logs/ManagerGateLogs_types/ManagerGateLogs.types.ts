// [TYPES] ManagerGateLogs
import { z } from 'zod';

export interface GateLog {
  id: string;
  propertyId: string;
  studentId: string;
  studentName?: string;
  roomNumber?: string;
  type: 'entry' | 'exit';
  reason?: string;
  destination?: string;
  expectedReturnTime?: string;
  timestamp: string;
  createdAt?: string;
  isLate: boolean;
  managerId?: string;
}

export const GateLogFormSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  type: z.enum(['entry', 'exit']),
  reason: z.string().optional(),
  destination: z.string().optional(),
  expectedReturnTime: z.string().optional(),
  isLate: z.boolean(),
});

export type GateLogFormData = z.infer<typeof GateLogFormSchema>;

export interface ManagerGateLogsData {
  logs: GateLog[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  paginatedData: GateLog[];
}

export interface UseManagerGateLogsReturn extends ManagerGateLogsData {
  setCurrentPage: (p: number) => void;
  handleAdd: (studentId: string, type: 'entry' | 'exit', isLate: boolean, reason?: string, destination?: string, expectedReturnTime?: string) => void;
  selectedPropertyId: string | null;
  ctxLoading: boolean;
  students: any[];
}