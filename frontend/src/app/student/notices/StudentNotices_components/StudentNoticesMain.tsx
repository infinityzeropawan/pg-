'use client';

// RESPONSIBILITY: Renders the Student Notices & Alerts UI.

import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, Search, Filter, Megaphone, Zap, Settings } from 'lucide-react';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { useStudentContext } from '@/app/student/student_components/StudentContext';
import { Pagination } from '@/components/ui/Pagination';

export function StudentNoticesMain() {
  const { profile } = useStudentContext();
  const [notices, setNotices] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [filterPriority, setFilterPriority] = useState('All');

  useEffect(() => {
    if (profile) {
      // Assuming getNotices returns notices with priority or we mock it.
      const fetched = studentOperationsApi.getNotices((profile as any).propertyId);
      // Mocking priorities for UI if missing
      const mapped = fetched.map((n: any, idx: number) => ({
        ...n,
        priority: n.priority || (idx % 3 === 0 ? 'High' : idx % 2 === 0 ? 'Medium' : 'Low')
      }));
      setNotices(mapped);
    }
  }, [profile]);

  if (!profile) return <div className="p-4 motion-safe:animate-pulse">Loading...</div>;

  const filtered = filterPriority === 'All' ? notices : notices.filter(n => n.priority === filterPriority);
  const paginatedNotices = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertTriangle className="w-5 h-5 text-danger" />;
      case 'Medium': return <Zap className="w-5 h-5 text-warning" />;
      default: return <Info className="w-5 h-5 text-info" />;
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'High': return 'border-danger/30 bg-danger-bg/20';
      case 'Medium': return 'border-warning/30 bg-warning-bg/20';
      default: return 'border-border bg-card';
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
            🔔 Notifications & Alerts
          </h1>
          <p className="text-sm text-secondary mt-1">Important updates, alerts, and broadcasts from PG Management.</p>
        </div>
        <button className="px-4 py-2 bg-input text-primary rounded-[var(--radius-md)] font-bold border border-border flex items-center justify-center gap-2 hover:bg-border transition-colors">
          <Settings className="w-4 h-4"/> Notification Settings
        </button>
      </div>

      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
         <div className="relative w-full sm:w-64">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
           <input type="text" placeholder="Search notices..." className="w-full bg-input border border-border rounded-[var(--radius-md)] pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary text-primary" />
         </div>
         <div className="flex items-center gap-2 w-full sm:w-auto">
           <Filter className="w-4 h-4 text-secondary" />
           <select 
             value={filterPriority}
             onChange={e => setFilterPriority(e.target.value)}
             className="bg-input border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-primary focus:outline-none focus:border-primary flex-1 sm:flex-none"
           >
             <option value="All">All Priorities</option>
             <option value="High">🔴 High Priority</option>
             <option value="Medium">🟡 Medium Priority</option>
             <option value="Low">🟢 Low Priority</option>
           </select>
         </div>
      </div>

      <div className="space-y-4">
        {paginatedNotices.map(n => (
          <div key={n.id} className={`border rounded-[var(--radius-lg)] p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-start hover:shadow-md transition-shadow ${getPriorityBg(n.priority)}`}>
            <div className="w-12 h-12 rounded-[var(--radius-full)] bg-card flex items-center justify-center shrink-0 border border-border shadow-sm">
              {getPriorityIcon(n.priority)}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                <h3 className="font-bold text-primary text-lg flex items-center gap-2">
                  {n.title}
                </h3>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-[var(--radius-sm)] border ${
                  n.priority === 'High' ? 'bg-danger-bg border-danger/20 text-danger' :
                  n.priority === 'Medium' ? 'bg-warning-bg border-warning/20 text-warning' :
                  'bg-info-bg border-info/20 text-info'
                }`}>
                  {n.priority} Priority
                </span>
              </div>
              <p className="text-sm text-secondary mb-3 leading-relaxed">{n.message}</p>
              <div className="text-xs font-bold text-secondary flex items-center gap-1">
                <Megaphone className="w-3 h-3" /> Broadcasted on: {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center p-8 text-secondary bg-card border border-border rounded-[var(--radius-lg)]">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <div className="font-bold text-primary">No notifications found</div>
            <div className="text-sm">You are all caught up!</div>
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filtered.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
