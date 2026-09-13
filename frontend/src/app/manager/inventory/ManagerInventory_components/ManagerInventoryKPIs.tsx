import { PackageOpen, ShoppingCart, AlertOctagon, Timer } from 'lucide-react';

interface Props {
  pendingCount: number;
  alertCount: number;
  totalItems: number;
}

export function ManagerInventoryKPIs({ pendingCount, alertCount, totalItems }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm group hover:border-theme-primary transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary">
            <PackageOpen className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Live Stock Items</span>
        </div>
        <p className="text-2xl font-black text-primary">{totalItems}</p>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm group hover:border-warning transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-warning-bg flex items-center justify-center text-warning">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Pending Requests</span>
        </div>
        <p className="text-2xl font-black text-primary">{pendingCount}</p>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm group hover:border-danger transition-colors relative overflow-hidden">
        {alertCount > 0 && <div className="absolute right-0 top-0 h-full w-24 bg-danger/10 blur-xl"></div>}
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="w-8 h-8 rounded-full bg-danger-bg flex items-center justify-center text-danger">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Low Stock/Expiry Alerts</span>
        </div>
        <p className="text-2xl font-black text-danger relative z-10">{alertCount}</p>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm group hover:border-info transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-info-bg flex items-center justify-center text-info">
            <Timer className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Recent Batches</span>
        </div>
        <p className="text-2xl font-black text-primary">5</p>
      </div>
    </div>
  );
}
