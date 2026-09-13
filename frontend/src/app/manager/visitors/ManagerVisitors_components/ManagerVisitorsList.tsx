// RESPONSIBILITY: Renders the ManagerVisitorsList component.
import { Check, X, LogIn, LogOut } from 'lucide-react';

import type { Visitor } from '@/app/manager/visitors/ManagerVisitors_types/ManagerVisitors.types';
interface ManagerVisitorsListProps {
  visitors: Visitor[];
  handleStatus: (id: string, status: string) => void;
}
export function ManagerVisitorsList({ visitors, handleStatus }: ManagerVisitorsListProps) {
  return (
    <div className="space-y-4">
      {visitors.map(v => (
        <div key={v.id} className="bg-card border border p-4 rounded-[var(--radius-lg,12px)] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-primary">{v.name}</h3>
            <p className="text-sm text-secondary">Visiting: {v.studentName || 'Student'} (Room {v.roomNumber || '-'})</p>
            <div className="text-xs text-secondary mt-1">Phone: {v.phone} • Relation: {v.relation}</div>
            <div className="mt-2 text-xs font-medium px-2 py-1 bg-input inline-block rounded text-primary">
              Status: {v.status}
            </div>
          </div>
          <div className="flex gap-2">
            {v.status === 'pending' && (
              <>
                <button onClick={() => handleStatus(v.id, 'approved')} className="px-3 py-1.5 bg-success-bg text-success rounded flex items-center gap-1 hover:bg-green-900 border border-success"><Check className="w-4 h-4"/> Approve</button>
                <button onClick={() => handleStatus(v.id, 'rejected')} className="px-3 py-1.5 bg-danger-bg text-danger rounded flex items-center gap-1 hover:bg-red-900 border border-danger"><X className="w-4 h-4"/> Reject</button>
              </>
            )}
            {v.status === 'approved' && (
              <button onClick={() => handleStatus(v.id, 'checked_in')} className="px-3 py-1.5 bg-primary-subtle text-primary rounded flex items-center gap-1 border border-primary"><LogIn className="w-4 h-4"/> Check-in</button>
            )}
            {v.status === 'checked_in' && (
              <button onClick={() => handleStatus(v.id, 'checked_out')} className="px-3 py-1.5 bg-input text-primary rounded flex items-center gap-1 border border hover:bg-primary-subtle hover:text-primary"><LogOut className="w-4 h-4"/> Check-out</button>
            )}
          </div>
        </div>
      ))}
      {visitors.length === 0 && (
        <div className="text-center p-8 text-secondary bg-card rounded-[var(--radius-lg,12px)] border border">
          No visitors found.
        </div>
      )}
    </div>
  );
}