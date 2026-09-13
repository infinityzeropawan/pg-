'use client';

// RESPONSIBILITY: Renders the OwnerAttendanceMain component. Receives data via props/hooks.

import { useState, useEffect } from 'react';
import { Users, CheckCircle2, XCircle, Search, Building } from 'lucide-react';
import { format } from 'date-fns';

import { teamApi } from '@/app/owner/owner_lib/owner_api/OwnerTeam';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { Pagination } from '@/components/ui/Pagination';
import { useTableSync } from '@/lib/hooks/useTableSync';

import { attendanceApi } from '@/app/owner/owner_lib/owner_api/OwnerAttendance';
import type { StaffAttendance } from '@/app/owner/owner_lib/owner_api/OwnerAttendance';
import type { TeamMember } from '@/app/owner/owner_lib/owner_api/OwnerTeam';
;


export function OwnerAttendanceMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties, selectedPropertyId } = useOwnerPropertyContext();

  const [staff, setStaff] = useState<TeamMember[]>([]);
  const [attendance, setAttendance] = useState<StaffAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateStr, setDateStr] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { page: currentPage, setPage: setCurrentPage, search: searchQuery, setSearch: setSearchQuery, debouncedSearch } = useTableSync();
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    
    // Get all staff members for this owner
    const allStaff = teamApi.listByOwner(user.id);
    setStaff(allStaff);

    // Get attendance for the selected date
    const attData = attendanceApi.getAttendanceByOwner(user.id, dateStr);
    setAttendance(attData);

    setLoading(false);
  }, [user?.id, properties, dateStr]);

  // Reset page when property changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPropertyId, setCurrentPage]);

  const filteredStaff = staff.filter(s => {
    // Property filter (check if assignedPropertyIds includes selectedPropertyId)
    if (selectedPropertyId !== 'all' && !s?.user?.assignedPropertyIds?.includes(selectedPropertyId)) return false;
    
    // Search
    if (debouncedSearch) {
      const sq = debouncedSearch.toLowerCase();
      return s?.user?.name?.toLowerCase().includes(sq) || s?.profile?.staffType?.toLowerCase().includes(sq);
    }
    
    return true;
  });

  const getAttendanceStatus = (staffUserId: string) => {
    const record = attendance.find(a => a.staffUserId === staffUserId);
    return record ? record.markedAt : null;
  };

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedData = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary">Staff Attendance</h1>
          <p className="text-sm text-secondary">Monitor daily attendance of your staff across all properties.</p>
        </div>
      </div>

      <div className="bg-card p-4 border border-border rounded-md flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search staff by name or role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:border-primary text-primary motion-safe:transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-input border border-border rounded-md px-3 py-2">
          <label className="text-sm text-secondary font-medium">Date:</label>
          <input 
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="bg-transparent text-sm focus:outline-none text-primary"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-secondary motion-safe:animate-pulse">Loading attendance records...</div>
      ) : filteredStaff.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-lg text-center">
          <Users className="w-12 h-12 text-secondary opacity-50 mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-1">No Staff Found</h3>
          <p className="text-secondary text-sm max-w-sm">
            We couldn't find any staff members matching your criteria.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-card border-b border-border text-secondary sticky top-0 z-10 shadow-sm shadow-black/5">
                <tr>
                  <th className="px-6 py-4 font-semibold">Staff Member</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Properties</th>
                  <th className="px-6 py-4 font-semibold">Status ({new Date(dateStr).toLocaleDateString()})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {paginatedData.map((s: any) => {
                  const markedAt = getAttendanceStatus(s?.user?.id);
                  const assignedProps = s.user.assignedPropertyIds?.map((pid: any) => properties.find(p => p.id === pid)?.name).filter(Boolean) || [];
                  
                  return (
                    <tr key={s?.user?.id} className="hover:bg-[rgba(99,102,241,0.01)] motion-safe:transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-primary">{s?.user?.name}</div>
                        <div className="text-xs text-secondary">{s.user.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-input rounded text-xs font-bold capitalize text-primary">
                          {s?.profile?.staffType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-secondary text-xs">
                          <Building className="w-4 h-4" />
                          <span className="truncate max-w-[200px]" title={assignedProps.join(', ')}>
                            {assignedProps.length > 0 ? assignedProps.join(', ') : 'None'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {markedAt ? (
                          <div className="flex items-center gap-2 text-success">
                            <CheckCircle2 className="w-5 h-5" />
                            <div>
                              <div className="font-bold">Present</div>
                              <div className="text-[10px] opacity-80">Marked at {new Date(markedAt).toLocaleTimeString()}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-danger">
                            <XCircle className="w-5 h-5" />
                            <span className="font-bold">Pending / Absent</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          )}
        </div>
      )}
    </div>
  );
}
