'use client';
import { useManagerStaff } from '../ManagerStaff_hooks/useManagerStaff';
import { ManagerStaffList } from './ManagerStaffList';

export function ManagerStaffMain() {
  const { loading, staff, attendance, markAttendance } = useManagerStaff();

  if (loading) {
    return <div className="p-6 text-secondary motion-safe:animate-pulse">Loading staff directory...</div>;
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Staff Management</h1>
        <p className="text-sm text-secondary mt-1">Manage property staff, shifts, and daily attendance.</p>
      </div>

      <ManagerStaffList 
        staff={staff}
        attendance={attendance}
        onMarkAttendance={markAttendance}
      />
    </div>
  );
}
