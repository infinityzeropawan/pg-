// RESPONSIBILITY: Renders the ManagerAttendanceSummary component.
import { format } from 'date-fns';
import { ClipboardCheck } from 'lucide-react';
interface Props {
  presentCount: number;
  absentCount: number;
  pendingCount: number;
}
export function ManagerAttendanceSummary({ presentCount, absentCount, pendingCount }: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h1 className="text-[24px] font-bold text-primary flex items-center gap-2 tracking-tight">
          <ClipboardCheck className="w-6 h-6 text-theme-primary" />
          Student Roll Call
        </h1>
        <p className="text-sm text-secondary mt-1">Mark night attendance for {format(new Date(), 'MMMM d, yyyy')}</p>
      </div>
      <div className="flex gap-3">
        <div className="bg-card px-4 py-2.5 rounded-[var(--radius-md,8px)] border border shadow-sm flex flex-col items-center min-w-[80px]">
          <span className="text-[10px] font-bold text-success uppercase tracking-wider mb-1">Present</span>
          <span className="text-2xl font-black text-primary">{presentCount}</span>
        </div>
        <div className="bg-card px-4 py-2.5 rounded-[var(--radius-md,8px)] border border shadow-sm flex flex-col items-center min-w-[80px]">
          <span className="text-[10px] font-bold text-danger uppercase tracking-wider mb-1">Absent</span>
          <span className="text-2xl font-black text-primary">{absentCount}</span>
        </div>
        <div className="bg-card px-4 py-2.5 rounded-[var(--radius-md,8px)] border border shadow-sm flex flex-col items-center min-w-[80px]">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Pending</span>
          <span className="text-2xl font-black text-primary">{pendingCount}</span>
        </div>
      </div>
    </div>
  );
}