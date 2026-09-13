// RESPONSIBILITY: Renders the ManagerAttendanceTable component.
import { Search, BedDouble, CheckCircle, XCircle, Clock, Users } from 'lucide-react';

import type { ManagerAttendanceStudent, ManagerAttendanceRecord } from '@/app/manager/attendance/ManagerAttendance_types/ManagerAttendance.types';
interface Props {
  paginatedData: ManagerAttendanceStudent[];
  attendance: ManagerAttendanceRecord[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleMark: (studentId: string, status: 'Present' | 'Absent' | 'On Leave') => void;
}
export function ManagerAttendanceTable({ paginatedData, attendance, searchQuery, setSearchQuery, handleMark }: Props) {
  const getStatusColor = (status: string) => {
    if (status === 'Present') return 'bg-success-bg text-success border-success';
    if (status === 'Absent') return 'bg-danger-bg text-danger border-danger';
    if (status === 'On Leave') return 'bg-warning-bg text-warning border-warning';
    return 'bg-input text-secondary border';
  };
  return (
    <>
      <div className="p-4 border-b border bg-card">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search student by name or room..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-input border border rounded-[var(--radius-md,8px)] text-sm focus:outline-none focus:border-primary text-primary motion-safe:transition-colors"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-card border-b border text-secondary sticky top-0 z-10 shadow-sm shadow-black/5">
            <tr>
              <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Student Name</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Room & Bed</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[11px]">Today's Status</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-[11px] text-right">Quick Mark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginatedData.map(s => {
              const record = attendance.find(a => a.studentId === s.userId || a.studentId === s.id);
              const currentStatus = record?.status || 'Pending';
              return (
                <tr key={s.id} className="hover:bg-page motion-safe:transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-subtle text-primary flex items-center justify-center font-bold text-xs">
                        {s.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-primary">{s.name}</p>
                        <p className="text-xs text-secondary">{s.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-secondary font-medium">
                      <BedDouble className="w-4 h-4" />
                      {s.roomNumber ? `Room ${s.roomNumber}` : 'Not Assigned'}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(currentStatus)}`}>
                      {currentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleMark(s.userId || s.id, 'Present')} 
                        className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-bold motion-safe:transition-all border ${currentStatus === 'Present' ? 'bg-success text-white border-success shadow-sm' : 'bg-input text-primary border hover:border-success hover:text-success'}`}
                      >
                        <CheckCircle className="w-3.5 h-3.5"/> 
                        <span className="hidden sm:inline">Present</span>
                      </button>
                      <button 
                        onClick={() => handleMark(s.userId || s.id, 'Absent')} 
                        className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-bold motion-safe:transition-all border ${currentStatus === 'Absent' ? 'bg-danger text-white border-danger shadow-sm' : 'bg-input text-primary border hover:border-danger hover:text-danger'}`}
                      >
                        <XCircle className="w-3.5 h-3.5"/> 
                        <span className="hidden sm:inline">Absent</span>
                      </button>
                      <button 
                        onClick={() => handleMark(s.userId || s.id, 'On Leave')} 
                        className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-bold motion-safe:transition-all border ${currentStatus === 'On Leave' ? 'bg-warning text-white border-warning shadow-sm' : 'bg-input text-primary border hover:border-warning hover:text-warning'}`}
                      >
                        <Clock className="w-3.5 h-3.5"/> 
                        <span className="hidden sm:inline">Leave</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-secondary">
                    <Users className="w-10 h-10 mb-3 opacity-40" />
                    <p className="font-medium text-base">No students found</p>
                    <p className="text-sm">There are no active students matching your criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}