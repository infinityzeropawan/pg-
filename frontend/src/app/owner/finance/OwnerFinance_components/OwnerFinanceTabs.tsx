'use client';
// RESPONSIBILITY: Renders the OwnerFinanceTabs component. Receives data via props/hooks.

import { useState, useEffect } from 'react';
import { Receipt, TrendingDown, FileText, Shield, ChevronDown } from 'lucide-react';

import { formatINR, formatDateOnly } from '@/lib/utils/formatters';
import { Pagination } from '@/components/ui/Pagination';

import type { Payment, Expense, Invoice } from '@/app/owner/owner_lib/owner_api/OwnerFinance';
import type { Dispatch, SetStateAction } from 'react';

export interface OwnerFinanceTabsProps {
  activeTab: 'payments' | 'invoices' | 'expenses' | 'deposits';
  setActiveTab: Dispatch<SetStateAction<'payments' | 'invoices' | 'expenses' | 'deposits'>>;
  paymentsData: { paginated: Payment[]; totalPages: number };
  expensesData: { paginated: Expense[]; totalPages: number };
  invoicesData: { paginated: Invoice[]; totalPages: number };
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function OwnerFinanceTabs({
  activeTab,
  setActiveTab,
  paymentsData,
  expensesData,
  invoicesData,
  currentPage,
  setCurrentPage
}: OwnerFinanceTabsProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex border-b border-border">
        {[
          { id: 'payments', label: 'Income', icon: Receipt },
          { id: 'expenses', label: 'Expenses', icon: TrendingDown },
          { id: 'invoices', label: 'Invoices', icon: FileText },
          { id: 'deposits', label: 'Security Deposits', icon: Shield },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
// @ts-expect-error
              onClick={() => setActiveTab(tab.id as unknown)}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 motion-safe:transition-colors relative ${
                activeTab === tab.id ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
            </button>
          );
        })}
      </div>

      <div className="p-0 overflow-x-auto max-h-[500px] overflow-y-auto">
        {activeTab === 'payments' && (
          <>
          <table className="w-full text-sm text-left">
            <thead className="bg-card border-b border-border text-secondary text-xs uppercase sticky top-0 z-10 shadow-sm shadow-black/5">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Source / Student</th>
                <th className="px-6 py-3 font-medium">Method</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Ref No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {paymentsData.paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-secondary">No income records found.</td>
                </tr>
              ) : (
                paymentsData.paginated.map((p: Payment) => (
                  <tr key={p.id} className="hover:bg-page motion-safe:transition-colors">
                    <td className="px-6 py-4 text-primary">{formatDateOnly(p.date)}</td>
                    <td className="px-6 py-4 text-primary font-medium">{p.studentId === 'dummy' ? 'Unknown Student' : p.studentId}</td>
                    <td className="px-6 py-4 uppercase text-xs font-bold text-secondary">{p.method.replace('_', ' ')}</td>
                    <td className="px-6 py-4 font-bold text-success">+{formatINR(p.amount)}</td>
                    <td className="px-6 py-4 text-xs font-mono">{p.referenceNo || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {paymentsData.totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={paymentsData.totalPages} onPageChange={setCurrentPage} />
          )}
          </>
        )}

        {activeTab === 'expenses' && (
          <>
          <table className="w-full text-sm text-left">
            <thead className="bg-card border-b border-border text-secondary text-xs uppercase sticky top-0 z-10 shadow-sm shadow-black/5">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {expensesData.paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-secondary">No expense records found.</td>
                </tr>
              ) : (
                expensesData.paginated.map((e: Expense) => (
                  <tr key={e.id} className="hover:bg-page motion-safe:transition-colors">
                    <td className="px-6 py-4 text-primary">{formatDateOnly(e.date)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-input rounded border border-border text-xs font-bold uppercase tracking-wider text-secondary">
                        {e.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-primary max-w-xs truncate">{e.description}</td>
                    <td className="px-6 py-4 font-bold text-danger">-{formatINR(e.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {expensesData.totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={expensesData.totalPages} onPageChange={setCurrentPage} />
          )}
          </>
        )}
        
        {activeTab === 'invoices' && (
          <>
          <table className="w-full text-sm text-left">
            <thead className="bg-card border-b border-border text-secondary text-xs uppercase sticky top-0 z-10 shadow-sm shadow-black/5">
              <tr>
                <th className="px-6 py-3 font-medium">Month</th>
                <th className="px-6 py-3 font-medium">Due Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {invoicesData.paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-secondary">No invoices found.</td>
                </tr>
              ) : (
                invoicesData.paginated.map((i: Invoice) => (
                  <tr key={i.id} className="hover:bg-page motion-safe:transition-colors">
                    <td className="px-6 py-4 font-medium text-primary">{i.month}</td>
                    <td className="px-6 py-4 text-primary">{formatDateOnly(i.dueDate)}</td>
                    <td className="px-6 py-4 font-bold">{formatINR(i.amount)}</td>
                    <td className="px-6 py-4">
                      {i.status.toLowerCase() === 'paid' ? <span className="text-success bg-success-bg px-2 py-1 rounded text-xs font-semibold border border-success">Paid</span> :
                       i.status.toLowerCase() === 'pending' ? <span className="text-warning bg-warning-bg px-2 py-1 rounded text-xs font-semibold border border-warning">Pending</span> :
                       <span className="text-danger bg-danger-bg px-2 py-1 rounded text-xs font-semibold border border-danger">Overdue</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {invoicesData.totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={invoicesData.totalPages} onPageChange={setCurrentPage} />
          )}
          </>
        )}

        {activeTab === 'deposits' && (
          <SecurityDepositsTab />
        )}
      </div>
    </div>
  );
}

// ─── Security Deposits Tab ───────────────────────────────────────────────────
function SecurityDepositsTab() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const deps: any[] = JSON.parse(localStorage.getItem('spg_deposits') || '[]');
    const usrs: any[] = JSON.parse(localStorage.getItem('spg_users') || '[]');
    setDeposits(deps.filter(d => !d.isDeleted));
    setUsers(usrs);
  }, []);

  const getStudentName = (id: string) => users.find(u => u.id === id)?.name || id;

  const filtered = filterStatus === 'all' ? deposits : deposits.filter(d => d.status === filterStatus);
  const totalAmount = deposits.reduce((s, d) => s + d.amount, 0);
  const activeCount = deposits.filter(d => d.status === 'Active').length;
  const pendingRefund = deposits.filter(d => d.status === 'Refund Pending').length;
  const refundedTotal = deposits.filter(d => d.status === 'Refunded').reduce((s, d) => s + (d.refundAmount || 0), 0);

  const statusBadge = (status: string) => {
    if (status === 'Active') return <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-success bg-success-bg">✅ Active</span>;
    if (status === 'Refund Pending') return <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-warning bg-warning-bg">⏳ Refund Pending</span>;
    if (status === 'Refunded') return <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-secondary bg-page border border-border">↩ Refunded</span>;
    return <span className="text-xs text-secondary">{status}</span>;
  };

  return (
    <div className="p-5 space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Collected',  value: `₹${(totalAmount / 1000).toFixed(0)}K`,      color: 'text-[#2D7D9A]' },
          { label: 'Active Deposits',  value: String(activeCount),                           color: 'text-success' },
          { label: 'Pending Refunds',  value: String(pendingRefund),                         color: 'text-warning' },
          { label: 'Refunded',         value: `₹${(refundedTotal / 1000).toFixed(0)}K`,      color: 'text-secondary' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-page border border-border rounded-xl p-4">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-secondary uppercase tracking-wider mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-secondary font-semibold uppercase tracking-wider">Filter:</span>
        {['all', 'Active', 'Refund Pending', 'Refunded'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              filterStatus === s ? 'bg-[#2D7D9A] text-white' : 'bg-page border border-border text-secondary hover:text-primary'
            }`}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-page border-b border-border">
              {['Student', 'Deposit Amount', 'Paid Date', 'Status', 'Deductions', 'Refund Amount'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-secondary">No deposits found</td></tr>
            ) : filtered.map(dep => (
              <tr key={dep.id} className="border-b border-border hover:bg-page/50 transition-colors">
                <td className="px-4 py-3 font-medium text-primary">{getStudentName(dep.studentId)}</td>
                <td className="px-4 py-3 font-bold text-primary">₹{dep.amount.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-secondary text-xs">{new Date(dep.paidDate).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3">{statusBadge(dep.status)}</td>
                <td className="px-4 py-3">
                  {dep.deductions?.length > 0 ? (
                    <div className="text-xs text-danger">
                      {dep.deductions.map((d: any, i: number) => (
                        <div key={i}>-₹{d.amount.toLocaleString('en-IN')} ({d.reason})</div>
                      ))}
                    </div>
                  ) : <span className="text-xs text-secondary">—</span>}
                </td>
                <td className="px-4 py-3 font-semibold">
                  {dep.refundAmount ? (
                    <span className="text-success">₹{dep.refundAmount.toLocaleString('en-IN')}</span>
                  ) : dep.status === 'Active' ? (
                    <span className="text-secondary text-xs">—</span>
                  ) : (
                    <span className="text-warning text-xs">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
