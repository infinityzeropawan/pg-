// RESPONSIBILITY: Renders the ManagerAttendanceMain component.
'use client';
import { useState } from 'react';
import { Building } from 'lucide-react';

import { useManagerUrlPagination } from '@/app/manager/manager_components/manager_hooks/useManagerUrlPagination';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';
import { Pagination } from '@/components/ui/Pagination';
import { useManagerAttendanceData } from '@/app/manager/attendance/ManagerAttendance_hooks/useManagerAttendanceData';
import { useManagerAttendanceActions } from '@/app/manager/attendance/ManagerAttendance_hooks/useManagerAttendanceActions';
import { ManagerAttendanceSummary } from '@/app/manager/attendance/ManagerAttendance_components/ManagerAttendanceSummary';
import { ManagerAttendanceTable } from '@/app/manager/attendance/ManagerAttendance_components/ManagerAttendanceTable';
export function ManagerAttendanceMain() {
  const { selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const user = useManagerSession();
  const [searchQuery, setSearchQuery] = useState('');
  const { currentPage, setCurrentPage } = useManagerUrlPagination(1);
  const itemsPerPage = 10;
  const { students, attendance, loadData } = useManagerAttendanceData(selectedPropertyId, ctxLoading);
  const { handleMark } = useManagerAttendanceActions(selectedPropertyId, user?.id, loadData);
  if (ctxLoading) return (
    <div className="p-8 text-center text-secondary motion-safe:animate-pulse">
      Loading student roster...
    </div>
  );
  if (!selectedPropertyId) return (
    <div className="p-8 text-center flex flex-col items-center">
      <Building className="w-12 h-12 text-secondary mb-4 opacity-50" />
      <h3 className="text-lg font-bold text-primary">Property Required</h3>
      <p className="text-sm text-secondary">Please select a property from the top navigation to mark attendance.</p>
    </div>
  );
  const filteredStudents = students.filter(s => {
    if (!searchQuery) return true;
    return s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roomNumber?.includes(searchQuery);
  });
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedData = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const pendingCount = students.length - attendance.length;
  return (
    <div className="space-y-6 pb-20 manager-theme animate-fade-in">
      <ManagerAttendanceSummary 
        presentCount={presentCount} 
        absentCount={absentCount} 
        pendingCount={pendingCount} 
      />
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm">
        <ManagerAttendanceTable 
          paginatedData={paginatedData}
          attendance={attendance}
          searchQuery={searchQuery}
          setSearchQuery={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          handleMark={handleMark}
        />
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>
    </div>
  );
}