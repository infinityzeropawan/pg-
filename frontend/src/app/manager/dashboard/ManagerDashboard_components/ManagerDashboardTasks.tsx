import Link from 'next/link';
import { CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

import type { ManagerDashboardStats } from '@/app/manager/dashboard/ManagerDashboard_types/ManagerDashboard.types';

interface Props {
  stats: ManagerDashboardStats | null;
}

/**
 * Action items are derived from the backend's live counters. The previous version
 * rendered a hardcoded list ("Approve pending check-ins", "Room 102 plumbing
 * complaint") with a dead "View All Tasks" button.
 */
export function ManagerDashboardTasks({ stats }: Props) {
  const tasks = [
    { id: 'complaints', title: 'Resolve pending complaints', count: stats?.openComplaints ?? 0, href: '/manager/complaints' },
    { id: 'visitors', title: 'Approve pending visitor requests', count: stats?.pendingVisitors ?? 0, href: '/manager/visitors' },
    { id: 'maintenance', title: 'Follow up on open maintenance tickets', count: stats?.maintenanceOpen ?? 0, href: '/manager/daily-operations' },
    { id: 'vacant', title: 'Vacant beds available to fill', count: stats?.vacantBeds ?? 0, href: '/manager/rooms' },
  ];

  const pendingCount = tasks.filter(t => t.count > 0).length;

  return (
    <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 h-full shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <h3 className="font-black text-primary text-lg flex items-center gap-2">Today's Tasks</h3>
        <span className="bg-theme-primary/10 text-theme-primary text-xs font-bold px-2 py-1 rounded-full">
          {pendingCount} Pending
        </span>
      </div>
      <div className="space-y-2">
        {tasks.length === 0 && (
          <p className="text-sm text-secondary">Nothing pending right now.</p>
        )}
        {tasks.map(task => {
          const isClear = task.count === 0;
          return (
            <Link
              key={task.id}
              href={task.href}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-input motion-safe:transition-colors group border border-transparent hover:border-border"
            >
              {isClear ? (
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
              ) : task.id === 'complaints' || task.id === 'maintenance' ? (
                <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              ) : (
                <Clock className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isClear ? 'text-secondary' : 'text-primary'}`}>
                  {task.title}
                </p>
                <p className="text-xs text-secondary mt-1">
                  {isClear ? 'All clear' : `${task.count} awaiting action`}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-secondary shrink-0 mt-1 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
