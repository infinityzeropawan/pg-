// RESPONSIBILITY: Renders the OwnerPayrollTable component. Receives data via props/hooks.

import { CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

import { Pagination } from '@/components/ui/Pagination';

export interface OwnerPayrollTableProps {
  paginatedData: unknown[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  handleOpenPaymentModal: (item: unknown) => void;
}

export function OwnerPayrollTable({
  paginatedData,
  currentPage,
  totalPages,
  setCurrentPage,
  handleOpenPaymentModal
}: OwnerPayrollTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-card border-b border-border sticky top-0 z-10 shadow-sm shadow-black/5">
            <tr>
              <th className="px-5 py-3 text-[12px] font-bold text-secondary uppercase tracking-wider">Staff Details</th>
              <th className="px-5 py-3 text-[12px] font-bold text-secondary uppercase tracking-wider">Role</th>
              <th className="px-5 py-3 text-[12px] font-bold text-secondary uppercase tracking-wider">Salary</th>
              <th className="px-5 py-3 text-[12px] font-bold text-secondary uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-[12px] font-bold text-secondary uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-secondary text-sm">
                  No staff members found matching the selected filters.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => (
// @ts-expect-error
                <tr key={item.staff?.id || `staff-${idx}`} className="hover:bg-page motion-safe:transition-colors">
                  <td className="px-5 py-4">
// @ts-expect-error
                    <div className="font-semibold text-[14px] text-primary">{(item as any).staff.name}</div>
// @ts-expect-error
                    <div className="text-[12px] text-secondary">{(item as any).staff.phone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="capitalize text-[13px] font-medium text-secondary bg-page border border-border px-2.5 py-1 rounded-full">
// @ts-expect-error
                      {(item as any).staff.staffType}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-[14px] text-primary">
// @ts-expect-error
                      ₹{((item as any).staff.salary || 0).toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-5 py-4">
// @ts-expect-error
                    {(item as any).isPaid ? (
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-success">
                        <CheckCircle2 className="w-4 h-4" /> Paid
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-danger">
                        <AlertCircle className="w-4 h-4" /> Pending
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
// @ts-expect-error
                    {(item as any).isPaid ? (
                      <span className="text-[12px] text-secondary font-medium bg-page border border-border px-3 py-1.5 rounded-md">
// @ts-expect-error
                        {format(new Date((item as any).paymentDetails.paymentDate), 'MMM dd, yyyy')}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenPaymentModal(item)}
                        className="bg-primary text-white text-[12px] font-bold px-4 py-2 rounded-md hover:bg-primary-hover motion-safe:transition-colors shadow-sm"
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}
