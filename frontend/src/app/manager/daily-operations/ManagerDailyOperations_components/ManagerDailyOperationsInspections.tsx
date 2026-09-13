import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { RoomInspection } from '../ManagerDailyOperations_types/DailyOperations.types';

interface Props {
  inspections: RoomInspection[];
  onUpdateStatus: (id: string, status: 'Pass' | 'Fail', issues: string) => void;
}

export function ManagerDailyOperationsInspections({ inspections, onUpdateStatus }: Props) {
  return (
    <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 h-full">
      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
        <h2 className="text-lg font-black text-primary">Room Inspections</h2>
        <button className="text-xs font-bold text-theme-primary hover:text-theme-primary-hover bg-theme-primary/10 px-3 py-1.5 rounded-[var(--radius-sm)] motion-safe:transition-colors">
          Start Inspection
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-xs uppercase text-secondary bg-input/50">
            <tr>
              <th className="px-3 py-2 rounded-l-md">Room</th>
              <th className="px-3 py-2">Inspected By</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Issues</th>
              <th className="px-3 py-2 rounded-r-md text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {inspections.map(ins => (
              <tr key={ins.id} className="hover:bg-input/30 transition-colors">
                <td className="px-3 py-3 font-medium text-primary">Room {ins.room}</td>
                <td className="px-3 py-3 text-secondary">{ins.inspectedBy}</td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-max ${
                    ins.status === 'Pass' ? 'bg-success-bg text-success' :
                    ins.status === 'Fail' ? 'bg-danger-bg text-danger' : 'bg-warning-bg text-warning'
                  }`}>
                    {ins.status === 'Pass' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {ins.status === 'Fail' && <XCircle className="w-3.5 h-3.5" />}
                    {ins.status === 'Pending' && <AlertCircle className="w-3.5 h-3.5" />}
                    {ins.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-secondary truncate max-w-[150px]" title={ins.issues}>
                  {ins.issues || '-'}
                </td>
                <td className="px-3 py-3 text-right">
                  {ins.status === 'Pending' ? (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onUpdateStatus(ins.id, 'Pass', '')}
                        className="text-xs font-bold text-success bg-success-bg px-2 py-1 rounded hover:bg-success hover:text-white transition-colors"
                      >
                        Pass
                      </button>
                      <button 
                        onClick={() => {
                          const issue = window.prompt('Enter issues found:');
                          if (issue !== null) onUpdateStatus(ins.id, 'Fail', issue);
                        }}
                        className="text-xs font-bold text-danger bg-danger-bg px-2 py-1 rounded hover:bg-danger hover:text-white transition-colors"
                      >
                        Fail
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        const issue = window.prompt('Update issues:', ins.issues);
                        if (issue !== null) onUpdateStatus(ins.id, issue ? 'Fail' : 'Pass', issue);
                      }}
                      className="text-xs font-bold text-secondary hover:text-primary transition-colors underline"
                    >
                      Update
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {inspections.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-secondary text-sm">No inspections scheduled.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
