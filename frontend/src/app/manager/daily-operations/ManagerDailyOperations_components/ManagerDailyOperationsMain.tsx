'use client';
import { useManagerDailyOperations } from '../ManagerDailyOperations_hooks/useManagerDailyOperations';
import { ManagerDailyOperationsStats } from './ManagerDailyOperationsStats';
import { ManagerDailyOperationsHousekeeping } from './ManagerDailyOperationsHousekeeping';
import { ManagerDailyOperationsMaintenance } from './ManagerDailyOperationsMaintenance';
import { ManagerDailyOperationsInspections } from './ManagerDailyOperationsInspections';

export function ManagerDailyOperationsMain() {
  const {
    loading,
    housekeeping,
    maintenance,
    inspections,
    stats,
    markHousekeepingDone,
    markMaintenanceResolved,
    updateInspectionStatus
  } = useManagerDailyOperations();

  if (loading) {
    return <div className="p-6 text-secondary motion-safe:animate-pulse">Loading daily operations...</div>;
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Daily Operations</h1>
        <p className="text-sm text-secondary mt-1">Manage today's housekeeping, maintenance, and inspections.</p>
      </div>

      <ManagerDailyOperationsStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ManagerDailyOperationsHousekeeping 
          tasks={housekeeping} 
          onMarkDone={markHousekeepingDone} 
        />
        <ManagerDailyOperationsMaintenance 
          tasks={maintenance} 
          onMarkResolved={markMaintenanceResolved} 
        />
      </div>

      <div className="grid grid-cols-1">
        <ManagerDailyOperationsInspections 
          inspections={inspections} 
          onUpdateStatus={updateInspectionStatus} 
        />
      </div>
    </div>
  );
}
