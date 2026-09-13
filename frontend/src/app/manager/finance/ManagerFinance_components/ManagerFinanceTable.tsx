// RESPONSIBILITY: Renders the ManagerFinanceTable component.
import { IndianRupee, CheckCircle, Receipt, Bell, User as UserIcon, Calendar } from 'lucide-react';

import type { EnrichedInvoice, ManagerFinanceFilter } from '@/app/manager/finance/ManagerFinance_types/ManagerFinance.types';
interface ManagerFinanceTableProps {
  invoices: EnrichedInvoice[];
  paginatedData: EnrichedInvoice[];
  filter: ManagerFinanceFilter;
  setFilter: (f: ManagerFinanceFilter) => void;
  handleSendReminder: (studentName: string) => void;
  handleMarkPaid: (invId: string) => void;
}
export function ManagerFinanceTable({ 
  invoices, 
  paginatedData, 
  filter, 
  setFilter, 
  handleSendReminder, 
  handleMarkPaid 
}: ManagerFinanceTableProps) {
  return (
    <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm">
      <div className="p-4 border-b border flex gap-2 overflow-x-auto">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap motion-safe:transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-input text-secondary hover:text-primary'}`}
        >
          All Invoices
        </button>
        <button 
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap motion-safe:transition-colors ${filter === 'pending' ? 'bg-warning text-white' : 'bg-input text-secondary hover:text-primary'}`}
        >
          Pending ({invoices.filter(i => i.status.toLowerCase() !== 'paid').length})
        </button>
        <button 
          onClick={() => setFilter('paid')}
          className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap motion-safe:transition-colors ${filter === 'paid' ? 'bg-success text-white' : 'bg-input text-secondary hover:text-primary'}`}
        >
          Paid ({invoices.filter(i => i.status.toLowerCase() === 'paid').length})
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-card border-b border text-secondary sticky top-0 z-10 shadow-sm shadow-black/5">
            <tr>
              <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Student</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Month</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Due Date</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Amount</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Status</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[11px] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginatedData.map(inv => (
              <tr key={inv.id} className="hover:bg-page motion-safe:transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-input flex items-center justify-center shrink-0">
                      <UserIcon className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <div className="font-bold text-primary">{inv.studentName}</div>
                      <div className="text-xs text-secondary">{inv.roomBed}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-secondary font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {inv.month}
                  </div>
                </td>
                <td className="p-4 text-secondary">
                  {new Date(inv.dueDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="font-black text-primary flex items-center">
                    <IndianRupee className="w-3.5 h-3.5"/> {inv.amount.toLocaleString('en-IN')}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${inv.status.toLowerCase() === 'paid' ? 'bg-[rgba(16,185,129,0.1)] text-success' : 'bg-[rgba(239,68,68,0.1)] text-danger'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {inv.status.toLowerCase() !== 'paid' ? (
                      <>
                        <button 
                          onClick={() => handleSendReminder(inv.studentName || 'Student')} 
                          className="p-2 text-warning hover:bg-warning-bg rounded-md motion-safe:transition-colors"
                          title="Send Reminder"
                        >
                          <Bell className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleMarkPaid(inv.id)} 
                          className="px-3 py-1.5 bg-success text-white rounded font-bold hover:bg-success-hover motion-safe:transition-colors text-xs flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Collect Cash
                        </button>
                      </>
                    ) : (
                      <span className="text-success text-xs font-bold flex items-center gap-1 opacity-70">
                        <CheckCircle className="w-3.5 h-3.5" /> Settled
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center">
                  <Receipt className="w-10 h-10 text-secondary opacity-30 mx-auto mb-3" />
                  <div className="text-primary font-bold">No invoices found</div>
                  <div className="text-secondary text-sm">Try changing the filter or check back later.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}