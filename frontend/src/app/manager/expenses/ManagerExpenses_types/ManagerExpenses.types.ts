// [TYPES] ManagerExpenses
// Defines validated form shape and component return types for the expenses feature.
import { z } from 'zod';
export const ExpenseFormSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});
export type ExpenseFormData = z.infer<typeof ExpenseFormSchema>;
export interface ManagerExpensesState {
  expenses: unknown[];
  studentCount: number;
  loading: boolean;
  isModalOpen: boolean;
  isSubmitting: boolean;
  currentPage: number;
}