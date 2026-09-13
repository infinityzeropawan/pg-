import { CheckCircle2, Wrench, ClipboardCheck, Users } from 'lucide-react';
import type { DailyOperationsStats } from '../ManagerDailyOperations_types/DailyOperations.types';

export function ManagerDailyOperationsStats({ stats }: { stats: DailyOperationsStats }) {
  const cards = [
    {
      title: 'Housekeeping',
      value: `${stats.housekeepingDone}/${stats.housekeepingTotal}`,
      sub: 'Rooms Cleaned',
      icon: CheckCircle2,
      color: 'text-success',
      bg: 'bg-success-bg',
      border: 'border-success/20'
    },
    {
      title: 'Maintenance',
      value: `${stats.maintenanceResolved}/${stats.maintenanceTotal}`,
      sub: 'Tasks Resolved',
      icon: Wrench,
      color: 'text-warning',
      bg: 'bg-warning-bg',
      border: 'border-warning/20'
    },
    {
      title: 'Inspections',
      value: `${stats.inspectionsCompleted}/${stats.inspectionsTotal}`,
      sub: 'Rooms Inspected',
      icon: ClipboardCheck,
      color: 'text-primary',
      bg: 'bg-theme-primary/10',
      border: 'border-primary/20'
    },
    {
      title: 'Visitors',
      value: stats.visitorsToday.toString(),
      sub: 'Total Today',
      icon: Users,
      color: 'text-info',
      bg: 'bg-info-bg',
      border: 'border-info/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className={`bg-card border ${card.border} rounded-[var(--radius-lg)] p-4 flex flex-col hover:shadow-md motion-safe:transition-shadow`}>
          <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <span className="text-2xl font-bold text-primary">{card.value}</span>
          </div>
          <h3 className="text-sm font-bold text-primary">{card.title}</h3>
          <p className="text-xs font-medium text-secondary">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
