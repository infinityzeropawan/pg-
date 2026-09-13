// RESPONSIBILITY: Renders the ManagerFinanceMain component.
'use client';
import { Pagination } from '@/components/ui/Pagination';
import { useManagerFinance } from '@/app/manager/finance/ManagerFinance_hooks/useManagerFinance';
import { ManagerFinanceStats } from '@/app/manager/finance/ManagerFinance_components/ManagerFinanceStats';
import { ManagerFinanceTable } from '@/app/manager/finance/ManagerFinance_components/ManagerFinanceTable';
export function ManagerFinanceMain() {
  const {
    invoices,
    stats,
    loading,
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    handleMarkPaid,
    handleSendReminder,
    selectedPropertyId,
    ctxLoading
  } = useManagerFinance();
  if (ctxLoading || loading) return <div className="p-6 text-secondary motion-safe:animate-pulse">Loading Rent Management...</div>;
  if (!selectedPropertyId) return <div className="p-6 text-center text-secondary">Property Required</div>;
  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto manager-theme animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-primary flex items-center gap-2 tracking-tight">
            Rent & Financials
          </h1>
          <p className="text-sm text-secondary">Track expected rent, collect payments, and manage dues.</p>
        </div>
      </div>
      <ManagerFinanceStats stats={stats} />
      <ManagerFinanceTable 
        invoices={invoices}
        paginatedData={paginatedData}
        filter={filter}
        setFilter={setFilter}
        handleSendReminder={handleSendReminder}
        handleMarkPaid={handleMarkPaid}
      />
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}