// RESPONSIBILITY: Renders the OwnerPayrollStats component. Receives data via props/hooks.

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export interface OwnerPayrollStatsProps {
  currentDate: Date;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  selectedPropertyId: string;
  setSelectedPropertyId: (id: string) => void;
  properties: unknown[];
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  totalPayout: number;
  paidPayout: number;
  pendingPayout: number;
  paidCount: number;
  totalStaff: number;
}

export function OwnerPayrollStats({
  currentDate,
  handlePrevMonth,
  handleNextMonth,
  selectedPropertyId,
  setSelectedPropertyId,
  properties,
  roleFilter,
  setRoleFilter,
  totalPayout,
  paidPayout,
  pendingPayout,
  paidCount,
  totalStaff
}: OwnerPayrollStatsProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-border gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-page rounded-full text-secondary motion-safe:transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 px-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-[18px] font-bold text-primary">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
          </div>
          
          <button onClick={handleNextMonth} className="p-2 hover:bg-page rounded-full text-secondary motion-safe:transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="bg-input border border-border rounded-md px-4 py-2 text-sm text-primary focus:outline-none focus:border-primary font-medium"
          >
            <option value="all">All Properties</option>
            {properties.map(p => (
// @ts-expect-error
              <option key={p.id} value={p.id}>{(p as any).name}</option>
            ))}
          </select>
          
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-input border border-border rounded-md px-4 py-2 text-sm text-primary focus:outline-none focus:border-primary font-medium"
          >
            <option value="all">All Roles</option>
            <option value="manager">Managers</option>
            <option value="cook">Cooks</option>
            <option value="guard">Guards</option>
            <option value="cleaner">Cleaners</option>
            <option value="maintenance">Maintenance</option>
            <option value="accountant">Accountants</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-page p-4 rounded-md border border-border">
          <p className="text-[12px] text-secondary mb-1">Total Payroll</p>
          <p className="text-[20px] font-bold text-primary">₹{totalPayout.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-page p-4 rounded-md border border-border">
          <p className="text-[12px] text-secondary mb-1">Cleared</p>
          <p className="text-[20px] font-bold text-success">₹{paidPayout.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-page p-4 rounded-md border border-border">
          <p className="text-[12px] text-secondary mb-1">Pending</p>
          <p className="text-[20px] font-bold text-danger">₹{pendingPayout.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-page p-4 rounded-md border border-border">
          <p className="text-[12px] text-secondary mb-1">Staff Paid</p>
          <p className="text-[20px] font-bold text-primary">{paidCount} / {totalStaff}</p>
        </div>
      </div>
    </div>
  );
}
