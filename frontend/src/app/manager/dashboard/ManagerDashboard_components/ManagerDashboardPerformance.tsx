import type { ManagerDashboardStats } from '@/app/manager/dashboard/ManagerDashboard_types/ManagerDashboard.types';

interface Props {
  stats: ManagerDashboardStats | null;
}

interface Metric {
  label: string;
  value: string;
  hint: string;
  isPositive: boolean;
}

function percent(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

/**
 * Metrics are computed from the live backend counters. The previous version showed
 * fixed values (92% / 85% / 98%) with fabricated week-over-week trends.
 * Trend deltas are intentionally omitted: the API exposes no prior-period figures,
 * so showing one would be invented data.
 */
export function ManagerDashboardPerformance({ stats }: Props) {
  const rentPct = stats ? percent(stats.rentCollected, stats.rentTarget) : 0;
  const hkPct = stats ? percent(stats.housekeepingDone, stats.housekeepingTotal) : 0;

  const metrics: Metric[] = [
    {
      label: 'Occupancy Rate',
      value: `${stats?.occupancyRate ?? 0}%`,
      hint: `${stats?.occupiedBeds ?? 0} of ${(stats?.occupiedBeds ?? 0) + (stats?.vacantBeds ?? 0)} beds occupied`,
      isPositive: (stats?.occupancyRate ?? 0) >= 50,
    },
    {
      label: 'Rent Collection',
      value: `${rentPct}%`,
      hint: `₹${(stats?.rentCollected ?? 0).toLocaleString('en-IN')} of ₹${(stats?.rentTarget ?? 0).toLocaleString('en-IN')} billed`,
      isPositive: rentPct >= 50,
    },
    {
      label: 'Housekeeping',
      value: `${hkPct}%`,
      hint: `${stats?.housekeepingDone ?? 0} of ${stats?.housekeepingTotal ?? 0} tasks completed`,
      isPositive: hkPct >= 50,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 h-full flex flex-col justify-between shadow-sm">
      <h3 className="font-black text-primary text-lg border-b border-border pb-3 mb-4 flex items-center gap-2">Property Performance</h3>
      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {metrics.map((m, i) => (
          <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-input/50 border border-transparent">
            <div className="min-w-0">
              <div className="text-sm font-medium text-secondary">{m.label}</div>
              <div className="text-xs text-secondary opacity-80 mt-0.5">{m.hint}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-lg font-bold text-primary">{m.value}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.isPositive ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
                {m.isPositive ? 'On Track' : 'Needs Attention'}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-xs text-secondary">
          Live figures for the selected property
        </p>
      </div>
    </div>
  );
}
