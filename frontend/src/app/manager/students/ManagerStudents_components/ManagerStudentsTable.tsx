// RESPONSIBILITY: Renders the ManagerStudentsTable component.
import { ChevronRight, IndianRupee } from 'lucide-react';

import type { ManagerStudentData } from '@/app/manager/students/ManagerStudents_types/ManagerStudents.types';
interface Props {
  students: ManagerStudentData[];
  onRowClick?: (student: ManagerStudentData) => void;
}
export function ManagerStudentsTable({ students, onRowClick }: Props) {
  return (
    <div className="bg-card border border-border rounded-[var(--radius-lg,12px)] overflow-x-auto shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-input/50 border-b border-border text-secondary text-xs uppercase tracking-wider font-bold">
          <tr>
            <th className="p-4 py-3">Student Info</th>
            <th className="p-4 py-3">Contact</th>
            <th className="p-4 py-3">Payment Status</th>
            <th className="p-4 py-3">Trust Score</th>
            <th className="p-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {students.map(t => (
            <tr 
              key={t.profile.id} 
              onClick={() => onRowClick?.(t)}
              className="hover:bg-input/50 motion-safe:transition-colors group cursor-pointer"
            >
              <td className="p-4">
                <div className="font-medium text-primary">{t.user?.name || 'Unknown'}</div>
                <div className="text-xs text-secondary">ID: {t.profile.id.slice(-6)}</div>
              </td>
              <td className="p-4">
                <div className="text-primary">{t.user?.phone || '-'}</div>
                <div className="text-xs text-secondary truncate max-w-[150px]">{t.user?.email || '-'}</div>
              </td>
              <td className="p-4">
                {t.profile.duesAmount > 0 ? (
                  <div className="inline-flex flex-col gap-1">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-danger-bg text-danger border border-danger/20 uppercase tracking-wider w-fit">
                      Pending Dues
                    </span>
                    <span className="text-danger font-bold flex items-center text-sm">
                      <IndianRupee className="w-3.5 h-3.5"/> {t.profile.duesAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-success-bg text-success border border-success/20 uppercase tracking-wider flex items-center w-fit">
                    Rent Cleared
                  </span>
                )}
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-[var(--radius-sm,4px)] text-xs font-bold ${t.profile.pgScore >= 80 ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
                  {t.profile.pgScore}/100
                </span>
              </td>
              <td className="p-4 text-right">
                <button className="inline-flex items-center gap-1 text-theme-primary hover:text-theme-primary-hover hover:underline text-xs font-bold bg-theme-primary/10 px-3 py-1.5 rounded-[var(--radius-md,8px)] transition-colors opacity-0 group-hover:opacity-100">
                  View Profile <ChevronRight className="w-3 h-3" />
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-secondary">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}