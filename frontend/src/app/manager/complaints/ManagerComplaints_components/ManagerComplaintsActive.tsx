// RESPONSIBILITY: Renders the ManagerComplaintsActive component.
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

import type { ManagerComplaintData } from '@/app/manager/complaints/ManagerComplaints_types/ManagerComplaints.types';
interface Props {
  paginatedData: ManagerComplaintData[];
  activeComplaintsCount: number;
  handleStartWork: (id: string) => void;
  setResolvingComplaint: (c: ManagerComplaintData) => void;
}
export function ManagerComplaintsActive({ 
  paginatedData, activeComplaintsCount, handleStartWork, setResolvingComplaint 
}: Props) {
  return (
    <div className="space-y-4">
      {paginatedData.map(c => (
        <div key={c.id} className="bg-card border border p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-bold text-lg text-primary">{c.title || c.category}</h3>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                c.status === 'In Progress' ? 'bg-primary-subtle text-primary' : 'bg-danger-bg text-danger'
              }`}>
                {c.status === 'In Progress' ? <Clock className="w-3 h-3"/> : <AlertCircle className="w-3 h-3"/>}
                {c.status}
              </span>
            </div>
            <p className="text-sm text-secondary mb-3">{c.description}</p>
            <div className="flex gap-2">
              <span className="text-xs px-2.5 py-1 bg-input text-secondary font-medium rounded border border">Room {c.roomNumber || '-'}</span>
              <span className="text-xs px-2.5 py-1 bg-input text-secondary font-medium rounded border border">{new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="shrink-0 flex gap-2 w-full md:w-auto">
            {c.status === 'Open' && (
              <button 
                onClick={() => handleStartWork(c.id)}
                className="flex-1 md:flex-none px-4 py-2 bg-primary-subtle text-primary rounded font-bold text-sm shadow-sm hover:bg-primary hover:text-white motion-safe:transition-colors"
              >
                Start Work
              </button>
            )}
            <button 
              onClick={() => setResolvingComplaint(c)}
              className="flex-1 md:flex-none px-4 py-2 bg-success text-white rounded font-bold text-sm shadow-sm hover:bg-success-hover,green motion-safe:transition-colors"
            >
              Mark Resolved
            </button>
          </div>
        </div>
      ))}
      {activeComplaintsCount === 0 && (
        <div className="text-center p-12 bg-card rounded-2xl border border">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-3 opacity-50" />
          <div className="text-primary font-bold text-lg">No active requests</div>
          <div className="text-sm text-secondary mt-1">All maintenance issues are resolved.</div>
        </div>
      )}
    </div>
  );
}