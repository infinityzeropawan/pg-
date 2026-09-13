// RESPONSIBILITY: Renders the ManagerComplaintsMain component.
'use client';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { Pagination } from '@/components/ui/Pagination';
import { useManagerComplaints } from '@/app/manager/complaints/ManagerComplaints_hooks/useManagerComplaints';
import { ManagerComplaintsKPIs } from '@/app/manager/complaints/ManagerComplaints_components/ManagerComplaintsKPIs';
import { ManagerComplaintsActive } from '@/app/manager/complaints/ManagerComplaints_components/ManagerComplaintsActive';
import { ManagerComplaintsLog } from '@/app/manager/complaints/ManagerComplaints_components/ManagerComplaintsLog';
import { ManagerComplaintsResolveModal } from '@/app/manager/complaints/ManagerComplaints_components/ManagerComplaintsResolveModal';
export function ManagerComplaintsMain() {
  const { selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const {
    activeTab, setActiveTab,
    resolvingComplaint,
    onOpenResolveModal, onCloseResolveModal,
    resolveForm,
    currentPage, setCurrentPage,
    totalPages, paginatedData,
    activeComplaintsCount, resolvedComplaintsCount,
    handleResolveSubmit, handleStartWork
  } = useManagerComplaints(selectedPropertyId, ctxLoading);
  if (ctxLoading) return <div className="p-6 text-secondary">Loading...</div>;
  if (!selectedPropertyId) return <div className="p-6 text-secondary text-center">Property Required</div>;
  return (
    <div className="space-y-6 pb-20 manager-theme animate-fade-in">
      <div>
        <h1 className="text-[24px] font-bold text-primary tracking-tight">Maintenance & Complaints</h1>
        <p className="text-sm text-secondary">Manage student issues and track repair costs.</p>
      </div>
      
      <ManagerComplaintsKPIs activeCount={activeComplaintsCount} resolvedCount={resolvedComplaintsCount} />

      <div className="flex border-b border gap-6">
        <button 
          onClick={() => setActiveTab('active')} 
          className={`pb-3 font-bold motion-safe:transition-colors ${activeTab === 'active' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}
        >
          Active Requests ({activeComplaintsCount})
        </button>
        <button 
          onClick={() => setActiveTab('log')} 
          className={`pb-3 font-bold motion-safe:transition-colors ${activeTab === 'log' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary'}`}
        >
          Maintenance Log
        </button>
      </div>
      {activeTab === 'active' && (
        <ManagerComplaintsActive 
          paginatedData={paginatedData}
          activeComplaintsCount={activeComplaintsCount}
          handleStartWork={handleStartWork}
          setResolvingComplaint={onOpenResolveModal}
        />
      )}
      {activeTab === 'log' && (
        <ManagerComplaintsLog 
          paginatedData={paginatedData}
          resolvedComplaintsCount={resolvedComplaintsCount}
        />
      )}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
      {resolvingComplaint && (
        <ManagerComplaintsResolveModal 
          resolvingComplaint={resolvingComplaint}
          onClose={onCloseResolveModal}

          resolveForm={resolveForm as any}
          handleResolveSubmit={handleResolveSubmit as any}
        />
      )}
    </div>
  );
}