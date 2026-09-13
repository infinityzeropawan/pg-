'use client';

// RESPONSIBILITY: Renders the Student Complaints & Support UI.

import { useState, useEffect } from 'react';
import { MessageSquareWarning, Plus, Search, Filter, Star } from 'lucide-react';
import Link from 'next/link';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { useStudentContext } from '@/app/student/student_components/StudentContext';
import { Pagination } from '@/components/ui/Pagination';

export function StudentComplaintsMain() {
  const { profile } = useStudentContext();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    if (profile) {
      setComplaints(studentOperationsApi.getComplaints((profile as any).id || (profile as any).userId));
    }
  }, [profile]);

  if (!profile) return <div className="p-4 motion-safe:animate-pulse">Loading...</div>;
  
  const filtered = filterStatus === 'All' ? complaints : complaints.filter(c => c.status === filterStatus);
  const paginatedComplaints = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
            🛠️ Complaint System
          </h1>
          <p className="text-sm text-secondary mt-1">Raise a new complaint or track your reported issues.</p>
        </div>
        <Link href="/student/complaints/new" className="px-5 py-2.5 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md flex items-center gap-2 hover:bg-primary-hover transition-colors whitespace-nowrap">
          <Plus className="w-5 h-5"/> Raise Complaint
        </Link>
      </div>

      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
         <div className="relative w-full sm:w-64">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
           <input type="text" placeholder="Search complaints..." className="w-full bg-input border border-border rounded-[var(--radius-md)] pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary text-primary" />
         </div>
         <div className="flex items-center gap-2 w-full sm:w-auto">
           <Filter className="w-4 h-4 text-secondary" />
           <select 
             value={filterStatus}
             onChange={e => setFilterStatus(e.target.value)}
             className="bg-input border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-primary focus:outline-none focus:border-primary flex-1 sm:flex-none"
           >
             <option value="All">All Status</option>
             <option value="Pending">Open / Pending</option>
             <option value="In Progress">In Progress</option>
             <option value="Resolved">Resolved</option>
           </select>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedComplaints.map(c => (
          <div key={c.id} className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm hover:border-primary transition-colors group">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-primary text-lg capitalize">{c.title || c.category}</h3>
              <span className={`px-3 py-1 rounded-[var(--radius-full)] text-[10px] font-black tracking-wider uppercase shadow-sm ${
                c.status === 'Resolved' ? 'bg-success-bg border border-success/20 text-success' :
                c.status === 'In Progress' ? 'bg-primary-subtle border border-primary/20 text-primary' :
                'bg-danger-bg border border-danger/20 text-danger'
              }`}>
                {c.status || 'Pending'}
              </span>
            </div>
            <p className="text-sm text-secondary mb-5 line-clamp-2">{c.description}</p>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-[var(--radius-sm)] ${c.priority === 'High' ? 'bg-danger-bg text-danger' : c.priority === 'Medium' ? 'bg-warning-bg text-warning' : 'bg-info-bg text-info'}`}>
                  Priority: {c.priority || 'Low'}
                </span>
                <span className="text-xs text-secondary font-medium">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button className="text-xs font-bold text-primary hover:underline">
                View Details
              </button>
            </div>
            {c.status === 'Resolved' && (
              <div className="mt-4 bg-input rounded-[var(--radius-md)] p-3 border border-border flex items-center justify-between">
                <span className="text-xs font-medium text-secondary">Rate Resolution:</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-4 h-4 text-warning cursor-pointer hover:scale-110 transition-transform" />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center p-8 bg-card border border-border rounded-[var(--radius-lg)] col-span-full">
            <MessageSquareWarning className="w-12 h-12 text-secondary mx-auto mb-3 opacity-20" />
            <div className="text-primary font-bold">No complaints found</div>
            <div className="text-sm text-secondary mt-1">Everything seems fine!</div>
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
