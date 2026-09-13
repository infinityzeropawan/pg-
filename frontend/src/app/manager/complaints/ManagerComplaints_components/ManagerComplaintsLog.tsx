// RESPONSIBILITY: Renders the ManagerComplaintsLog component.
import { IndianRupee } from 'lucide-react';

import type { ManagerComplaintData } from '@/app/manager/complaints/ManagerComplaints_types/ManagerComplaints.types';
interface Props {
  paginatedData: ManagerComplaintData[];
  resolvedComplaintsCount: number;
}
export function ManagerComplaintsLog({ paginatedData, resolvedComplaintsCount }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-secondary uppercase tracking-wider bg-card sticky top-0 z-10">
        <div className="col-span-2">Room</div>
        <div className="col-span-4">Issue</div>
        <div className="col-span-3">Cost</div>
        <div className="col-span-3">Resolved Date</div>
      </div>
      {paginatedData.map(c => (
        <div key={c.id} className="grid grid-cols-12 gap-4 items-center bg-card border border p-4 rounded-xl shadow-sm hover:bg-input motion-safe:transition-colors">
          <div className="col-span-2 font-bold text-primary">
            {c.roomNumber || '-'}
          </div>
          <div className="col-span-4">
            <div className="font-bold text-primary">{c.title || c.category}</div>
            {c.resolutionNotes && <div className="text-xs text-secondary truncate">{c.resolutionNotes}</div>}
          </div>
          <div className="col-span-3 font-bold text-danger flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5"/> {c.repairCost ? c.repairCost.toLocaleString('en-IN') : '0'}
          </div>
          <div className="col-span-3 text-sm text-secondary">
            {c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString() : '-'}
          </div>
        </div>
      ))}
      {resolvedComplaintsCount === 0 && (
        <div className="text-center p-12 bg-card rounded-2xl border border text-secondary">
          No completed maintenance logs found.
        </div>
      )}
    </div>
  );
}