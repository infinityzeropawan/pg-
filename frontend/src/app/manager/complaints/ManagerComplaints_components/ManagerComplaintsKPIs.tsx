import { AlertCircle, Clock, CheckCircle2, Star } from 'lucide-react';

interface Props {
  activeCount: number;
  resolvedCount: number;
}

export function ManagerComplaintsKPIs({ activeCount, resolvedCount }: Props) {
  const total = activeCount + resolvedCount;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm group hover:border-theme-primary transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Total</span>
        </div>
        <p className="text-2xl font-black text-primary">{total}</p>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm group hover:border-danger transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-danger-bg flex items-center justify-center text-danger">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Active</span>
        </div>
        <p className="text-2xl font-black text-primary">{activeCount}</p>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm group hover:border-success transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-success-bg flex items-center justify-center text-success">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Resolved</span>
        </div>
        <p className="text-2xl font-black text-primary">{resolvedCount}</p>
      </div>

      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-5 shadow-sm group hover:border-warning transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-warning-bg flex items-center justify-center text-warning">
            <Star className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Avg Rating</span>
        </div>
        <p className="text-2xl font-black text-primary">4.8 <span className="text-sm font-medium text-secondary">/ 5.0</span></p>
      </div>
    </div>
  );
}
