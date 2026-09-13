// RESPONSIBILITY: Renders the ManagerVisitorsMain component.
'use client';
import { useState } from 'react';
import { useManagerVisitors } from '@/app/manager/visitors/ManagerVisitors_hooks/useManagerVisitors';
import { ManagerVisitorsList } from '@/app/manager/visitors/ManagerVisitors_components/ManagerVisitorsList';
import { ManagerVisitorsKPIs } from '@/app/manager/visitors/ManagerVisitors_components/ManagerVisitorsKPIs';
import { UserPlus } from 'lucide-react';
export function ManagerVisitorsMain() {
  const { visitors, loading, handleStatus, selectedPropertyId, ctxLoading } = useManagerVisitors();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  
  if (ctxLoading || loading) return <div className="p-6 text-secondary motion-safe:animate-pulse">Loading visitors...</div>;
  if (!selectedPropertyId) return <div className="p-6 text-center text-secondary">Property Required</div>;
  
  const pendingCount = visitors.filter(v => v.status === 'pending').length;
  const activeCount = visitors.filter(v => v.status === 'approved').length;
  const totalToday = visitors.length; // Approximated for UI

  const filteredVisitors = visitors.filter(v => 
    activeTab === 'pending' ? v.status === 'pending' : v.status !== 'pending'
  );

  return (
    <div className="space-y-6 pb-20 manager-theme animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-primary flex items-center gap-2 tracking-tight">
            <UserPlus className="w-6 h-6 text-theme-primary" />
            Visitor Management
          </h1>
          <p className="text-sm text-secondary">Monitor entries, approve requests, and manage security.</p>
        </div>
      </div>

      <ManagerVisitorsKPIs pendingCount={pendingCount} activeCount={activeCount} totalToday={totalToday} />

      <div className="flex border-b border gap-6 mt-6">
        <button 
          onClick={() => setActiveTab('pending')} 
          className={`pb-3 font-bold motion-safe:transition-colors ${activeTab === 'pending' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}
        >
          Pending Approvals ({pendingCount})
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`pb-3 font-bold motion-safe:transition-colors ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}
        >
          Visitor History
        </button>
      </div>

      <ManagerVisitorsList visitors={filteredVisitors} handleStatus={handleStatus} />
    </div>
  );
}