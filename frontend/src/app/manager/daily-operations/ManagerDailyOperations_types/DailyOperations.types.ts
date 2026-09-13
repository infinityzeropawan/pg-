export interface HousekeepingTask {
  id: string;
  room: string;
  task: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface MaintenanceTask {
  id: string;
  title: string;
  location: string;
  assignedTo: string;
  priority: 'Urgent' | 'Normal';
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface RoomInspection {
  id: string;
  room: string;
  inspectedBy: string;
  status: 'Pass' | 'Fail' | 'Pending';
  issues: string;
}

export interface DailyOperationsStats {
  housekeepingDone: number;
  housekeepingTotal: number;
  maintenanceResolved: number;
  maintenanceTotal: number;
  inspectionsCompleted: number;
  inspectionsTotal: number;
  visitorsToday: number;
}
