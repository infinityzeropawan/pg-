// RESPONSIBILITY: Renders the ManagerFinanceStats component.
import { IndianRupee, PieChart } from 'lucide-react';

import type { ManagerFinanceStats as StatsType } from '@/app/manager/finance/ManagerFinance_types/ManagerFinance.types';
export function ManagerFinanceStats({ stats }: { stats: StatsType | null }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><PieChart className="w-20 h-20" /></div>
        <div className="text-sm font-bold text-secondary mb-2">Total Expected (This Month)</div>
        <div className="text-3xl font-black text-primary flex items-center"><IndianRupee className="w-6 h-6"/> {stats.totalExpectedRent.toLocaleString('en-IN')}</div>
        <div className="text-xs text-secondary mt-2">{stats.totalStudents} Active Students</div>
      </div>
      <div className="bg-gradient-to-br from-[rgba(16,185,129,0.05)] to-transparent border border-[rgba(16,185,129,0.2)] rounded-[var(--radius-lg,12px)] p-5 shadow-sm">
        <div className="text-sm font-bold text-success mb-2">Rent Collected</div>
        <div className="text-3xl font-black text-success flex items-center"><IndianRupee className="w-6 h-6"/> {stats.totalCollectedRent.toLocaleString('en-IN')}</div>
        <div className="text-xs text-success opacity-80 mt-2 font-medium">{stats.studentsPaidCount} students paid</div>
      </div>
      <div className="bg-gradient-to-br from-[rgba(239,68,68,0.05)] to-transparent border border-[rgba(239,68,68,0.2)] rounded-[var(--radius-lg,12px)] p-5 shadow-sm">
        <div className="text-sm font-bold text-danger mb-2">Pending Rent</div>
        <div className="text-3xl font-black text-danger flex items-center"><IndianRupee className="w-6 h-6"/> {stats.pendingRentAmount.toLocaleString('en-IN')}</div>
        <div className="text-xs text-danger opacity-80 mt-2 font-medium">{stats.studentsPendingCount} students pending</div>
      </div>
    </div>
  );
}