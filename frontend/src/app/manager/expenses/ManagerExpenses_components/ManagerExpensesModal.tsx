// RESPONSIBILITY: Renders the ManagerExpensesModal component.
// [COMPONENT] ManagerExpensesModal
// Responsibility: Renders the expense creation modal wired to React Hook Form.
// Receives: RHF UseFormReturn to register fields and display inline errors.
import { IndianRupee, Loader2 } from 'lucide-react';

import type { UseFormReturn } from 'react-hook-form';
import type { ExpenseFormData } from '@/app/manager/expenses/ManagerExpenses_types/ManagerExpenses.types';
interface Props {
  isModalOpen: boolean;
  onModalClose: () => void;
  isSubmitting: boolean;
  form: UseFormReturn<ExpenseFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => void;
  categoryLabels: Record<string, string>;
}
export function ManagerExpensesModal({
  isModalOpen, onModalClose, isSubmitting, form, handleSubmit, categoryLabels
}: Props) {
  if (!isModalOpen) return null;
  const { register, formState: { errors } } = form;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card rounded-[var(--radius-lg,12px)] w-full max-w-md shadow-2xl border border overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border flex justify-between items-center bg-input">
          <h2 className="text-xl font-bold text-primary">Log New Expense</h2>
          <button onClick={onModalClose} className="text-secondary hover:text-primary">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Category</label>
              <select
                {...register('category')}
                className="w-full bg-input border border rounded-[var(--radius-md,8px)] px-4 py-2.5 text-primary focus:outline-none focus:border-primary"
              >
                {Object.entries(categoryLabels).filter(([k]) => k !== 'staff_salary').map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-danger mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Amount (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                <input
                  type="number"
                  {...register('amount')}
                  className="w-full bg-input border border rounded-[var(--radius-md,8px)] pl-10 pr-4 py-2.5 text-primary focus:outline-none focus:border-primary"
                  placeholder="e.g. 500"
                  min="1"
                />
              </div>
              {errors.amount && <p className="text-xs text-danger mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Description</label>
              <textarea
                {...register('description')}
                className="w-full bg-input border border rounded-[var(--radius-md,8px)] px-4 py-2.5 text-primary focus:outline-none focus:border-primary"
                placeholder="What was this expense for?"
                rows={3}
              />
              {errors.description && <p className="text-xs text-danger mt-1">{errors.description.message}</p>}
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onModalClose}
              className="flex-1 px-4 py-2.5 bg-input text-primary rounded-[var(--radius-md,8px)] font-bold hover:bg-border motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-[var(--radius-md,8px)] font-bold hover:bg-primary-hover motion-safe:transition-colors shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 motion-safe:animate-spin" /> : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}