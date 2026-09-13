import { Users, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

interface Props {
  pendingCount: number;
  activeCount: number;
  totalToday: number;
}

export function ManagerVisitorsKPIs({ pendingCount, activeCount, totalToday }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Total Today</span>
        </div>
        <p className="text-2xl font-black text-primary">{totalToday}</p>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-warning-bg flex items-center justify-center text-warning">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Pending</span>
        </div>
        <p className="text-2xl font-black text-primary">{pendingCount}</p>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-info-bg flex items-center justify-center text-info">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Checked In</span>
        </div>
        <p className="text-2xl font-black text-primary">{activeCount}</p>
      </div>

      <div className="bg-danger-bg border border-danger/20 rounded-[var(--radius-lg,12px)] p-5 shadow-sm relative overflow-hidden group cursor-pointer hover:bg-danger/20 transition-colors">
        <div className="absolute right-0 top-0 h-full w-24 bg-danger/10 blur-xl group-hover:bg-danger/30 transition-colors"></div>
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center text-danger">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-danger uppercase tracking-wider">Overstaying</span>
        </div>
        <p className="text-2xl font-black text-danger relative z-10">0</p>
      </div>
    </div>
  );
}
