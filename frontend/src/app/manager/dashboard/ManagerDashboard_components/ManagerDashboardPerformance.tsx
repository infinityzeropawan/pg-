import { TrendingUp, TrendingDown } from 'lucide-react';

export function ManagerDashboardPerformance() {
  const metrics = [
    { label: 'Occupancy Rate', value: '92%', trend: '+2.5%', isUp: true },
    { label: 'Rent Collection', value: '85%', trend: '-5.2%', isUp: false },
    { label: 'Complaint Resolution', value: '98%', trend: '+1.1%', isUp: true },
  ];

  return (
    <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 h-full flex flex-col justify-between shadow-sm">
      <h3 className="font-black text-primary text-lg border-b border-border pb-3 mb-4 flex items-center gap-2">Weekly Performance</h3>
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {metrics.map((m, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-input/50 border border-transparent">
            <span className="text-sm font-medium text-secondary">{m.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-primary">{m.value}</span>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${m.isUp ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
                {m.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {m.trend}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-xs text-secondary">
          Performance compared to previous week
        </p>
      </div>
    </div>
  );
}
