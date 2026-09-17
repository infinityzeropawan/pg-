import { LogIn, LogOut, ClipboardList } from 'lucide-react';

import type { ManagerDashboardStats } from '@/app/manager/dashboard/ManagerDashboard_types/ManagerDashboard.types';

interface Props {
  stats: ManagerDashboardStats | null;
}

interface ActivityItem {
  id: string;
  text: string;
  meta: string;
  icon: typeof LogIn;
  color: string;
  bg: string;
}

/**
 * Renders real recent stay / gate activity returned by the backend dashboard.
 * The previous version showed a fabricated feed ("Rahul Kumar completed check-in
 * for Room 101", "₹5,000 received from Amit Singh") with invented timestamps.
 */
export function ManagerDashboardActivity({ stats }: Props) {
  const activities: ActivityItem[] = [];

  (stats?.recentStays ?? []).slice(0, 3).forEach((stay, i) => {
    activities.push({
      id: `stay-${stay.id ?? i}`,
      text: `${stay.tenantName} — ${stay.propertyName}, Room ${stay.roomNumber} / Bed ${stay.bedNumber}`,
      meta: String(stay.status || '').replace(/_/g, ' ').toLowerCase(),
      icon: StayIcon(stay.status),
      color: stay.status === 'CHECKED_OUT' ? 'text-warning' : 'text-success',
      bg: stay.status === 'CHECKED_OUT' ? 'bg-warning-bg' : 'bg-success-bg',
    });
  });

  (stats?.recentGateLogs ?? []).slice(0, 3).forEach((log, i) => {
    activities.push({
      id: `gate-${log.id ?? i}`,
      text: `${log.visitorName || 'Gate entry'} — ${String(log.entryType || '').replace(/_/g, ' ').toLowerCase()}`,
      meta: log.createdAt ? new Date(log.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '',
      icon: LogIn,
      color: 'text-info',
      bg: 'bg-info-bg',
    });
  });

  (stats?.latestEnquiries ?? []).slice(0, 3).forEach((enq, i) => {
    activities.push({
      id: `enq-${i}`,
      text: `Enquiry from ${enq.name} (${enq.property})`,
      meta: enq.status,
      icon: ClipboardList,
      color: enq.status === 'Resolved' ? 'text-success' : 'text-theme-primary',
      bg: enq.status === 'Resolved' ? 'bg-success-bg' : 'bg-theme-primary/10',
    });
  });

  const visible = activities.slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 h-full shadow-sm">
      <h3 className="font-black text-primary text-lg border-b border-border pb-3 mb-4 flex items-center gap-2">Recent Activity</h3>
      {visible.length === 0 ? (
        <p className="text-sm text-secondary">No recent activity recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {visible.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-primary">{item.text}</p>
                  {item.meta && <span className="text-xs font-bold text-secondary capitalize">{item.meta}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StayIcon(status: string) {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'CHECKED_OUT') return LogOut;
  return LogIn;
}
