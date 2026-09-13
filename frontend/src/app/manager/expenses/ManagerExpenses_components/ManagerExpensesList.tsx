// @ts-nocheck
// RESPONSIBILITY: Renders the ManagerExpensesList component.
import { Receipt, IndianRupee } from 'lucide-react';

import { formatDateOnly } from '@/lib/utils/formatters';
import { Pagination } from '@/components/ui/Pagination';
interface Props {
  expenses: unknown[];
  paginatedData: unknown[];
  categoryLabels: Record<string, string>;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}
export function ManagerExpensesList({
  expenses, paginatedData, categoryLabels, currentPage, totalPages, setCurrentPage
}: Props) {
  return (
    <>
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border bg-input">
          <h2 className="font-bold text-primary flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" /> Recent Expenses
          </h2>
        </div>
        {expenses.length === 0 ? (
          <div className="p-12 text-center text-secondary flex flex-col items-center">
            <Receipt className="w-12 h-12 mb-3 opacity-20" />
            <p>No expenses logged for this property yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-card border-b border text-secondary sticky top-0 z-10 shadow-sm shadow-black/5">
                <tr>
                  <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Date</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Description</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Category</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-[11px] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {paginatedData.map((exp) => (                  <tr key={(exp as unknown).id} className="hover:bg-page motion-safe:transition-colors">

                    <td className="p-4 whitespace-nowrap text-secondary">                      {formatDateOnly((exp as unknown).date)}
                    </td>

                    <td className="p-4">
                      <span className="font-medium text-primary">{(exp as unknown).description}</span>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-card border border rounded-full text-xs text-secondary">
                        {categoryLabels[(exp as unknown).category] || (exp as unknown).category}
                      </span>

                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-danger flex items-center justify-end gap-1">
                        <IndianRupee className="w-3.5 h-3.5" /> {(exp as unknown).amount.toLocaleString('en-IN')}
                      </span>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
}