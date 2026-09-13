import { useState, useEffect, useMemo } from 'react';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import type { 
  HousekeepingTask, 
  MaintenanceTask, 
  RoomInspection, 
  DailyOperationsStats 
} from '../ManagerDailyOperations_types/DailyOperations.types';

export function useManagerDailyOperations() {
  const { selectedPropertyId } = useManagerPropertyContext();
  const [loading, setLoading] = useState(true);

  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceTask[]>([]);
  const [inspections, setInspections] = useState<RoomInspection[]>([]);
  const [visitorsToday, setVisitorsToday] = useState(0);

  useEffect(() => {
    if (!selectedPropertyId) {
      setHousekeeping([]);
      setMaintenance([]);
      setInspections([]);
      setVisitorsToday(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Mock fetching data for the selected property
    setTimeout(() => {
      setHousekeeping([
        { id: 'hk-1', room: '101', task: 'Deep Cleaning', assignedTo: 'Ramesh', priority: 'High', status: 'Pending' },
        { id: 'hk-2', room: '102', task: 'Regular Sweep', assignedTo: 'Suresh', priority: 'Medium', status: 'In Progress' },
        { id: 'hk-3', room: '201', task: 'Bathroom Wash', assignedTo: 'Ramesh', priority: 'High', status: 'Completed' },
      ]);
      setMaintenance([
        { id: 'mnt-1', title: 'AC Filter Change', location: 'Room 304', assignedTo: 'Technician A', priority: 'Normal', status: 'Open' },
        { id: 'mnt-2', title: 'Leaking Tap', location: 'Room 105', assignedTo: 'Plumber', priority: 'Urgent', status: 'In Progress' },
        { id: 'mnt-3', title: 'Broken Chair', location: 'Dining Area', assignedTo: 'Carpenter', priority: 'Normal', status: 'Resolved' },
      ]);
      setInspections([
        { id: 'insp-1', room: '101', inspectedBy: 'Manager', status: 'Pending', issues: '' },
        { id: 'insp-2', room: '102', inspectedBy: 'Manager', status: 'Fail', issues: 'Dust on fan, floor not clean' },
        { id: 'insp-3', room: '103', inspectedBy: 'Manager', status: 'Pass', issues: 'Clean' },
      ]);
      setVisitorsToday(12);
      setLoading(false);
    }, 500);
  }, [selectedPropertyId]);

  const stats = useMemo<DailyOperationsStats>(() => {
    return {
      housekeepingDone: housekeeping.filter(h => h.status === 'Completed').length,
      housekeepingTotal: housekeeping.length,
      maintenanceResolved: maintenance.filter(m => m.status === 'Resolved').length,
      maintenanceTotal: maintenance.length,
      inspectionsCompleted: inspections.filter(i => i.status !== 'Pending').length,
      inspectionsTotal: inspections.length,
      visitorsToday
    };
  }, [housekeeping, maintenance, inspections, visitorsToday]);

  const markHousekeepingDone = (id: string) => {
    setHousekeeping(prev => prev.map(h => h.id === id ? { ...h, status: 'Completed' } : h));
  };

  const markMaintenanceResolved = (id: string) => {
    setMaintenance(prev => prev.map(m => m.id === id ? { ...m, status: 'Resolved' } : m));
  };

  const updateInspectionStatus = (id: string, status: 'Pass' | 'Fail', issues: string) => {
    setInspections(prev => prev.map(i => i.id === id ? { ...i, status, issues } : i));
  };

  return {
    loading,
    housekeeping,
    maintenance,
    inspections,
    stats,
    markHousekeepingDone,
    markMaintenanceResolved,
    updateInspectionStatus
  };
}
