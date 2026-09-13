// RESPONSIBILITY: Renders the StaffTasksMain component.
'use client';

import { useState, useEffect } from 'react';
import { ListTodo, CheckSquare, Square } from 'lucide-react';

import { staffOperationsApi } from '@/app/staff/staff_lib/staff_api/staffOperations';
import { useStaffContext } from '@/app/staff/staff_components/StaffContext';
import { getSession } from '@/app/staff/staff_lib/staff_auth/StaffSession';
import { Pagination } from '@/components/ui/Pagination';

export function StaffTasksMain() {
  const { propertyId } = useStaffContext();
  const session = typeof window !== 'undefined' ? getSession() : null;
  const [tasks, setTasks] = useState<any[]>([]);

  const loadData = () => {
    if (session && propertyId) {
      setTasks(staffOperationsApi.getTasks(propertyId, session.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [propertyId, session?.id]);

  const handleToggle = (id: string, currentStatus: string) => {
    if (!session) return;
    staffOperationsApi.updateTask(id, currentStatus === 'done' ? 'pending' : 'done', session.id);
    loadData();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const paginatedTasks = tasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!propertyId) return <div className="p-6">Loading or Property not assigned...</div>;

  return (
    <div className="space-y-6 pb-20 max-w-3xl">
      <div>
        <h1 className="text-[24px] font-bold text-primary">General Tasks</h1>
        <p className="text-sm text-secondary">Your assigned checklists and ad-hoc tasks.</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-primary" />
          Task List
        </h2>
        <div className="space-y-2">
          {paginatedTasks.map(t => (
            <button 
              key={t.id} 
              onClick={() => handleToggle(t.id, t.status)}
              className={`w-full flex items-center gap-3 p-4 rounded text-left motion-safe:transition-colors border ${
                t.status === 'done' 
                  ? 'bg-card opacity-60 border-border' 
                  : 'bg-input hover:bg-primary-subtle border-transparent'
              }`}
            >
              {t.status === 'done' ? <CheckSquare className="w-5 h-5 text-success" /> : <Square className="w-5 h-5 text-secondary" />}
              <div>
                <div className={`font-medium ${t.status === 'done' ? 'line-through text-secondary' : 'text-primary'}`}>
                  {t.title}
                </div>
                {t.desc && <div className="text-sm text-secondary mt-0.5">{t.desc}</div>}
              </div>
            </button>
          ))}
          {tasks.length === 0 && (
            <p className="text-sm text-secondary py-4 text-center">No tasks assigned to you right now.</p>
          )}
        </div>
        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
      </div>
    </div>
  );
}
