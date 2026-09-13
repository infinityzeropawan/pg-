import { Building2, Wallet, Broom, Wrench } from 'lucide-react';
import type { ManagerDashboardStats } from '@/app/manager/dashboard/ManagerDashboard_types/ManagerDashboard.types';

interface Props {
  stats: ManagerDashboardStats | null;
}

export function ManagerDashboardSummaryCards({ stats }: Props) {
  if (!stats) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Room Status */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5">
        <h3 className="text-xs font-bold text-secondary uppercase mb-3 flex items-center gap-1">
          <Building2 className="w-4 h-4" /> Room Status
        </h3>
        <div className="flex justify-between items-end mb-2">
          <p className="text-3xl font-bold text-primary">{stats.occupancyRate}%</p>
          <p className="text-xs text-secondary font-medium pb-1">Occupancy</p>
        </div>
        <div className="w-full bg-input rounded-full h-2">
          <div className="bg-theme-primary h-2 rounded-full" style={{ width: `${stats.occupancyRate}%` }}></div>
        </div>
      </div>

      {/* Rent Collection */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5">
        <h3 className="text-xs font-bold text-secondary uppercase mb-3 flex items-center gap-1">
          <Wallet className="w-4 h-4" /> Rent Collection
        </h3>
        <div className="flex justify-between items-end mb-2">
          <p className="text-xl font-bold text-success">₹{(stats.rentCollected / 1000).toFixed(1)}k</p>
          <p className="text-xs text-secondary font-medium pb-1">/ ₹{(stats.rentTarget / 1000).toFixed(1)}k</p>
        </div>
        <div className="w-full bg-input rounded-full h-2">
          <div className="bg-success h-2 rounded-full" style={{ width: `${stats.rentTarget ? (stats.rentCollected/stats.rentTarget)*100 : 0}%` }}></div>
        </div>
      </div>

      {/* Housekeeping */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5">
        <h3 className="text-xs font-bold text-secondary uppercase mb-3 flex items-center gap-1">
          <Broom className="w-4 h-4" /> Housekeeping
        </h3>
        <div className="flex justify-between items-end mb-2">
          <p className="text-3xl font-bold text-info">{stats.housekeepingDone}</p>
          <p className="text-xs text-secondary font-medium pb-1">/ {stats.housekeepingTotal} Rooms</p>
        </div>
        <div className="w-full bg-input rounded-full h-2">
          <div className="bg-info h-2 rounded-full" style={{ width: `${stats.housekeepingTotal ? (stats.housekeepingDone/stats.housekeepingTotal)*100 : 0}%` }}></div>
        </div>
      </div>

      {/* Maintenance */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5">
        <h3 className="text-xs font-bold text-secondary uppercase mb-3 flex items-center gap-1">
          <Wrench className="w-4 h-4" /> Maintenance
        </h3>
        <div className="flex justify-between items-end mb-2">
          <p className="text-3xl font-bold text-danger">{stats.maintenanceOpen}</p>
          <p className="text-xs text-secondary font-medium pb-1">Open Tickets</p>
        </div>
        <p className="text-xs font-medium text-danger bg-danger-bg inline-block px-2 py-1 rounded mt-2">
          Requires Attention
        </p>
      </div>
    </div>
  );
}
