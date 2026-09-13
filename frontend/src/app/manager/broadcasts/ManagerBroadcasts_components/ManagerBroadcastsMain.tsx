// @ts-nocheck
// RESPONSIBILITY: Renders the ManagerBroadcastsMain component.
'use client';
import { useState, useEffect } from 'react';
import { Radio, Users, Building, AlertTriangle, Send, BellRing } from 'lucide-react';

import { useManagerUrlPagination } from '@/app/manager/manager_components/manager_hooks/useManagerUrlPagination';
import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';
import { Pagination } from '@/components/ui/Pagination';
export function ManagerBroadcastsMain() {
  const { selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const [broadcasts, setBroadcasts] = useState<unknown[]>([]);
  const user = useManagerSession();
  const [formData, setFormData] = useState({ title: '', message: '', audience: 'all', targetFloor: '' });
  const loadData = () => {
    if (!ctxLoading && selectedPropertyId) {
      setBroadcasts(api.managerOperations.listBroadcasts(selectedPropertyId));
    }
  };
  useEffect(() => {
    loadData();
  }, [selectedPropertyId, ctxLoading]);
  // Pagination
  const { currentPage, setCurrentPage } = useManagerUrlPagination(1);
  const itemsPerPage = 10;
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPropertyId]);
  const totalPages = Math.ceil(broadcasts.length / itemsPerPage);
  const paginatedData = broadcasts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPropertyId) return;
    api.managerOperations.createBroadcast({
      ...formData,      audience: formData.audience as unknown,

      propertyId: selectedPropertyId,
      managerId: user.id
    });
    setFormData({ title: '', message: '', audience: 'all', targetFloor: '' });
    loadData();
  };
  if (ctxLoading) return <div className="p-6 text-secondary">Loading...</div>;
  if (!selectedPropertyId) return <div className="p-6 text-center text-secondary">Property Required</div>;
  return (
    <div className="space-y-6 pb-20 manager-theme animate-fade-in flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3 shrink-0 mt-2">
        <div className="bg-card border border p-6 rounded-[var(--radius-xl,16px)] sticky top-6 shadow-sm hover:border-theme-primary transition-colors">
          <h2 className="font-bold text-lg text-primary mb-6 flex items-center gap-2">
            <Radio className="w-5 h-5 text-theme-primary" />
            New Broadcast
          </h2>
          <form onSubmit={handleSend} className="space-y-5">
             <div>
               <label className="block text-sm font-bold text-secondary mb-1.5 uppercase tracking-wider text-[11px]">Title</label>
               <input required type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="e.g. Water Supply Update" className="w-full bg-input/50 border border-transparent focus:border-theme-primary px-4 py-3 rounded-[var(--radius-md,8px)] text-primary focus:outline-none transition-colors shadow-sm" />
             </div>
             <div>
               <label className="block text-sm font-bold text-secondary mb-1.5 uppercase tracking-wider text-[11px]">Message</label>
               <textarea required rows={4} value={formData.message} onChange={e=>setFormData({...formData, message: e.target.value})} placeholder="Type your announcement here..." className="w-full bg-input/50 border border-transparent focus:border-theme-primary px-4 py-3 rounded-[var(--radius-md,8px)] text-primary focus:outline-none transition-colors resize-none shadow-sm" />
             </div>
             <div>
               <label className="block text-sm font-bold text-secondary mb-1.5 uppercase tracking-wider text-[11px]">Target Audience</label>
               <select value={formData.audience} onChange={e=>setFormData({...formData, audience: e.target.value})} className="w-full bg-input/50 border border-transparent focus:border-theme-primary px-4 py-3 rounded-[var(--radius-md,8px)] text-primary focus:outline-none transition-colors shadow-sm appearance-none">
                 <option value="all">📢 All Students</option>
                 <option value="floor">🏢 Specific Floor</option>
                 <option value="defaulters">⚠️ Rent Defaulters</option>
               </select>
             </div>
             {formData.audience === 'floor' && (
               <div className="animate-fade-in">
                 <label className="block text-sm font-bold text-secondary mb-1.5 uppercase tracking-wider text-[11px]">Target Floor</label>
                 <input required type="text" value={formData.targetFloor} onChange={e=>setFormData({...formData, targetFloor: e.target.value})} placeholder="e.g. 2nd Floor" className="w-full bg-input/50 border border-transparent focus:border-theme-primary px-4 py-3 rounded-[var(--radius-md,8px)] text-primary focus:outline-none transition-colors shadow-sm" />
               </div>
             )}
             <button type="submit" className="w-full py-3 bg-theme-primary text-white rounded-[var(--radius-md,8px)] font-bold mt-2 hover:bg-theme-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2">
               <Send className="w-4 h-4" /> Broadcast Message
             </button>
          </form>
        </div>
      </div>
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[24px] font-bold text-primary tracking-tight">Broadcast History</h1>
            <p className="text-sm text-secondary">Past announcements sent to students.</p>
          </div>
        </div>
        <div className="space-y-4">
          {paginatedData.map(b => (
            <div key={(b as Record<string, unknown>).id} className="bg-card border border p-5 rounded-[var(--radius-lg,12px)] shadow-sm hover:border-border transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-primary text-lg">{(b as Record<string, unknown>).title}</h3>
                <span className="text-xs font-medium text-secondary bg-input px-2 py-1 rounded">{new Date((b as Record<string, unknown>).createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <p className="text-sm text-secondary mb-5 leading-relaxed bg-input/30 p-4 rounded-[var(--radius-md,8px)] border border-dashed">
                {(b as Record<string, unknown>).message}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Audience:</span>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  (b as Record<string, unknown>).audience === 'all' ? 'bg-theme-primary/10 text-theme-primary' : 
                  (b as Record<string, unknown>).audience === 'floor' ? 'bg-info-bg text-info' : 'bg-danger-bg text-danger'
                }`}>
                  {(b as Record<string, unknown>).audience === 'all' && <Users className="w-3 h-3" />}
                  {(b as Record<string, unknown>).audience === 'floor' && <Building className="w-3 h-3" />}
                  {(b as Record<string, unknown>).audience === 'defaulters' && <AlertTriangle className="w-3 h-3" />}
                  Target: {(b as Record<string, unknown>).audience === 'floor' ? (b as Record<string, unknown>).targetFloor : (b as Record<string, unknown>).audience === 'defaulters' ? 'Defaulters' : 'All Students'}
                </div>
              </div>
            </div>
          ))}
          {broadcasts.length === 0 && (
            <div className="text-center p-12 text-secondary bg-card rounded-[var(--radius-xl,16px)] border border border-dashed flex flex-col items-center justify-center">
              <Radio className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold">No broadcasts yet</p>
              <p className="text-sm mt-1">Send your first announcement using the form.</p>
            </div>
          )}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}