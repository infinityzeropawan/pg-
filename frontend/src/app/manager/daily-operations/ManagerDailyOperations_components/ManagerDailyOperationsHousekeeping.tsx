import { CheckCircle2, Circle } from 'lucide-react';
import type { HousekeepingTask } from '../ManagerDailyOperations_types/DailyOperations.types';

interface Props {
  tasks: HousekeepingTask[];
  onMarkDone: (id: string) => void;
}

export function ManagerDailyOperationsHousekeeping({ tasks, onMarkDone }: Props) {
  return (
    <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 h-full">
      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
        <h2 className="text-lg font-black text-primary">Housekeeping Tasks</h2>
        <button className="text-xs font-bold text-white bg-primary hover:bg-primary-hover px-3 py-1.5 rounded-[var(--radius-sm)] motion-safe:transition-colors">
          + Add Task
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-xs uppercase text-secondary bg-input/50">
            <tr>
              <th className="px-3 py-2 rounded-l-md">Task</th>
              <th className="px-3 py-2">Room</th>
              <th className="px-3 py-2">Assigned</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 rounded-r-md text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks.map(task => (
              <tr key={task.id} className="hover:bg-input/30 transition-colors">
                <td className="px-3 py-3 font-medium text-primary">{task.task}</td>
                <td className="px-3 py-3 text-secondary">{task.room}</td>
                <td className="px-3 py-3 text-secondary">{task.assignedTo}</td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    task.status === 'Completed' ? 'bg-success-bg text-success' :
                    task.status === 'In Progress' ? 'bg-info-bg text-info' : 'bg-warning-bg text-warning'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  {task.status !== 'Completed' ? (
                    <button 
                      onClick={() => onMarkDone(task.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-success bg-success-bg px-2 py-1 rounded hover:bg-success hover:text-white transition-colors"
                    >
                      <Circle className="w-3.5 h-3.5" /> Mark Done
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
                      <CheckCircle2 className="w-4 h-4" /> Done
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-secondary text-sm">No housekeeping tasks for today.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
