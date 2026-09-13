import { CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export function ManagerDashboardTasks() {
  const tasks = [
    { id: 1, title: 'Approve pending check-ins', time: '10:00 AM', status: 'pending', type: 'urgent' },
    { id: 2, title: 'Review weekly kitchen expenses', time: '12:30 PM', status: 'pending', type: 'normal' },
    { id: 3, title: 'Assign room to new student', time: '02:00 PM', status: 'completed', type: 'normal' },
    { id: 4, title: 'Follow up on Room 102 plumbing complaint', time: '04:00 PM', status: 'pending', type: 'urgent' },
  ];

  return (
    <div className="bg-card border border-border rounded-[var(--radius-lg)] p-5 h-full shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <h3 className="font-black text-primary text-lg flex items-center gap-2">Today's Tasks</h3>
        <span className="bg-theme-primary/10 text-theme-primary text-xs font-bold px-2 py-1 rounded-full">
          {tasks.filter(t => t.status === 'pending').length} Pending
        </span>
      </div>
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-input motion-safe:transition-colors group cursor-pointer border border-transparent hover:border-border">
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
            ) : task.type === 'urgent' ? (
              <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-secondary' : 'text-primary'}`}>
                {task.title}
              </p>
              <p className="text-xs text-secondary mt-1">{task.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-sm font-medium text-theme-primary hover:text-theme-primary-hover p-2 text-center rounded-lg hover:bg-theme-primary/5 transition-colors">
        View All Tasks
      </button>
    </div>
  );
}
