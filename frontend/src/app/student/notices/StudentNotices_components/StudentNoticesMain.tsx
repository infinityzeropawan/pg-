'use client';

// RESPONSIBILITY: Renders the Student Notices & Alerts UI.

import { useState, useEffect } from 'react';
import { Bell, Search, Filter, Megaphone, Pin, Settings } from 'lucide-react';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { Pagination } from '@/components/ui/Pagination';
import { STUDENT_ROUTES } from '@/app/student/student_url_config';
import Link from 'next/link';

interface StudentNotice {
  id: string;
  title: string;
  content: string;
  category: string;
  target: string;
  isPinned: boolean;
  createdAt: string;
}

function normalizeNotices(raw: unknown): StudentNotice[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((n: any) => ({
    id: String(n.id),
    title: String(n.title ?? ''),
    content: String(n.content ?? ''),
    category: String(n.category ?? 'General'),
    target: String(n.target ?? 'ALL'),
    isPinned: Boolean(n.isPinned),
    createdAt: String(n.createdAt ?? ''),
  }));
}

export function StudentNoticesMain() {
  const [notices, setNotices] = useState<StudentNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;
    studentOperationsApi
      .getNotices()
      .then(fetched => {
        if (isMounted) setNotices(normalizeNotices(fetched));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['ALL', ...Array.from(new Set(notices.map(n => n.category).filter(Boolean)))];

  const filtered = notices
    .filter(n => (filterCategory === 'ALL' ? true : n.category === filterCategory))
    .filter(n => {
      if (!searchTerm.trim()) return true;
      const haystack = `${n.title} ${n.content}`.toLowerCase();
      return haystack.includes(searchTerm.trim().toLowerCase());
    })
    // Pinned notices always float to the top, then newest first.
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const paginatedNotices = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="p-4 md:p-6 motion-safe:animate-pulse text-secondary">Loading notices...</div>;
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
            🔔 Notifications &amp; Notices
          </h1>
          <p className="text-sm text-secondary mt-1">Important updates, alerts, and broadcasts from PG Management.</p>
        </div>
        <Link
          href={STUDENT_ROUTES.SETTINGS}
          className="px-4 py-2 bg-input text-primary rounded-[var(--radius-md)] font-bold border border-border flex items-center justify-center gap-2 hover:bg-border transition-colors"
        >
          <Settings className="w-4 h-4"/> Account Settings
        </Link>
      </div>

      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
         <div className="relative w-full sm:w-64">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
           <input
             type="text"
             value={searchTerm}
             onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
             placeholder="Search notices..."
             className="w-full bg-input border border-border rounded-[var(--radius-md)] pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary text-primary"
           />
         </div>
         <div className="flex items-center gap-2 w-full sm:w-auto">
           <Filter className="w-4 h-4 text-secondary" />
           <select 
             value={filterCategory}
             onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}
             className="bg-input border border-border rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-primary focus:outline-none focus:border-primary flex-1 sm:flex-none"
           >
             {categories.map(category => (
               <option key={category} value={category}>
                 {category === 'ALL' ? 'All Categories' : category}
               </option>
             ))}
           </select>
         </div>
      </div>

      <div className="space-y-4">
        {paginatedNotices.map(n => (
          <div
            key={n.id}
            className={`border rounded-[var(--radius-lg)] p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-start hover:shadow-md transition-shadow ${
              n.isPinned ? 'border-warning/40 bg-warning-bg/20' : 'border-border bg-card'
            }`}
          >
            <div className="w-12 h-12 rounded-[var(--radius-full)] bg-card flex items-center justify-center shrink-0 border border-border shadow-sm">
              {n.isPinned ? <Pin className="w-5 h-5 text-warning" /> : <Megaphone className="w-5 h-5 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                <h3 className="font-bold text-primary text-lg flex items-center gap-2">
                  {n.title}
                  {n.isPinned && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-[var(--radius-sm)] border bg-warning-bg border-warning/20 text-warning">
                      Pinned
                    </span>
                  )}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-[var(--radius-sm)] border bg-info-bg border-info/20 text-info whitespace-nowrap">
                  {n.category}
                </span>
              </div>
              <p className="text-sm text-secondary mb-3 leading-relaxed whitespace-pre-wrap">{n.content}</p>
              <div className="text-xs font-bold text-secondary flex items-center gap-1 flex-wrap">
                <Megaphone className="w-3 h-3" /> Broadcasted on: {new Date(n.createdAt).toLocaleString('en-IN')}
                {n.target && n.target !== 'ALL' ? ` • For: ${n.target}` : ''}
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
