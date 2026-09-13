// [TYPES] ManagerComplaints
import { z } from 'zod';
export interface ManagerComplaintData {
  id: string;
  category?: string;
  title?: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  roomNumber?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  repairCost?: number;
}
export const ComplaintResolveSchema = z.object({
  repairCost: z
    .string()
    .refine((val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Repair cost must be a non-negative number',
    }),
  resolutionNotes: z.string(),
});
export type ComplaintResolveFormData = z.infer<typeof ComplaintResolveSchema>;