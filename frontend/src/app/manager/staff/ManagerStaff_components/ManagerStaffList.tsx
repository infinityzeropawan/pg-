import { ShieldAlert, Utensils, Wrench, Broom, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { StaffMember, StaffAttendance } from '../ManagerStaff_types/Staff.types';

interface Props {
  staff: StaffMember[];
  attendance: StaffAttendance[];
  onMarkAttendance: (id: string, status: 'Present' | 'Absent' | 'On Leave') => void;
}

export function ManagerStaffList({ staff, attendance, onMarkAttendance }: Props) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Security': return <ShieldAlert className="w-4 h-4 text-info" />;
      case 'Kitchen': return <Utensils className="w-4 h-4 text-warning" />;
      case 'Maintenance': return <Wrench className="w-4 h-4 text-theme-primary" />;
      case 'Housekeeping': return <Broom className="w-4 h-4 text-success" />;
      default: return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5">
      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
        <h2 className="text-lg font-black text-primary">Property Staff</h2>
        <button className="text-xs font-bold text-white bg-primary hover:bg-primary-hover px-3 py-1.5 rounded-[var(--radius-sm)] motion-safe:transition-colors">
          + Add Staff
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-xs uppercase text-secondary bg-input/50">
            <tr>
              <th className="px-3 py-2 rounded-l-md">Staff Details</th>
              <th className="px-3 py-2">Role & Shift</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 rounded-r-md text-right">Today's Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {staff.map(member => {
              const todayAtt = attendance.find(a => a.staffId === member.id);
              return (
                <tr key={member.id} className="hover:bg-input/30 transition-colors">
                  <td className="px-3 py-3">
                    <p className="font-medium text-primary">{member.name}</p>
                    <p className="text-xs text-secondary">{member.phone}</p>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      {getRoleIcon(member.role)}
                      <span className="font-bold text-primary">{member.role}</span>
                    </div>
                    <p className="text-xs text-secondary flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {member.shift}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      member.status === 'Active' ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    {todayAtt ? (
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${
                        todayAtt.status === 'Present' ? 'bg-success-bg text-success' :
                        todayAtt.status === 'Absent' ? 'bg-danger-bg text-danger' : 'bg-warning-bg text-warning'
                      }`}>
                        {todayAtt.status === 'Present' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {todayAtt.status === 'Absent' && <XCircle className="w-3.5 h-3.5" />}
                        {todayAtt.status}
                      </span>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => onMarkAttendance(member.id, 'Present')}
                          className="text-xs font-bold text-success bg-success-bg px-2 py-1 rounded hover:bg-success hover:text-white transition-colors"
                        >
                          Present
                        </button>
                        <button 
                          onClick={() => onMarkAttendance(member.id, 'Absent')}
                          className="text-xs font-bold text-danger bg-danger-bg px-2 py-1 rounded hover:bg-danger hover:text-white transition-colors"
                        >
                          Absent
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {staff.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-secondary text-sm">No staff members found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
