// RESPONSIBILITY: Renders the ManagerExpensesHeader component.
import { Plus } from 'lucide-react';

import { formatINR } from '@/lib/utils/formatters';
interface Props {
  groceryExpenses: number;
  costPerStudent: number;
  studentCount: number;
  setIsModalOpen: (open: boolean) => void;
}
export function ManagerExpensesHeader({ groceryExpenses, costPerStudent, studentCount, setIsModalOpen }: Props) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-primary">Operating Expenses</h1>
          <p className="text-secondary">Log and track daily expenses for this property.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-[var(--radius-md,8px)] font-bold flex items-center gap-2 hover:bg-primary-hover motion-safe:transition-colors shadow-lg shadow-primary-subtle w-fit"
        >
          <Plus className="w-5 h-5" /> Log Expense
        </button>
      </div>
      {/* Grocery Budget Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm">
          <p className="text-xs uppercase font-bold text-secondary mb-1">Total Grocery Exp. (This Month)</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-black text-primary">{formatINR(groceryExpenses)}</h2>
          </div>
          <p className="text-xs text-secondary mt-2">Sum of all 'groceries' expenses.</p>
        </div>
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm">
          <p className="text-xs uppercase font-bold text-secondary mb-1">Grocery Cost Per Student</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-black text-primary">{formatINR(costPerStudent)}</h2>
            <span className="text-sm font-medium text-secondary">/ student</span>
          </div>
          <p className="text-xs text-secondary mt-2">Based on {studentCount} active students.</p>
        </div>
      </div>
    </>
  );
}