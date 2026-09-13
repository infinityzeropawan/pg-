// RESPONSIBILITY: Renders the ManagerInventoryMain component.
'use client';
import { useManagerPropertyContext } from '@/app/manager/manager_components/ManagerPropertyContext';
import { useManagerSession } from '@/app/manager/manager_components/manager_hooks/useManagerSession';
import { useManagerInventory } from '@/app/manager/inventory/ManagerInventory_hooks/useManagerInventory';
import { ManagerInventoryTabs } from '@/app/manager/inventory/ManagerInventory_components/ManagerInventoryTabs';
import { ManagerInventoryRequests } from '@/app/manager/inventory/ManagerInventory_components/ManagerInventoryRequests';
import { ManagerInventoryLive } from '@/app/manager/inventory/ManagerInventory_components/ManagerInventoryLive';
import { ManagerInventoryBatches } from '@/app/manager/inventory/ManagerInventory_components/ManagerInventoryBatches';
import { ManagerInventoryAlerts } from '@/app/manager/inventory/ManagerInventory_components/ManagerInventoryAlerts';
import { ManagerInventoryKPIs } from '@/app/manager/inventory/ManagerInventory_components/ManagerInventoryKPIs';
import { Pagination } from '@/components/ui/Pagination';
import { ClipboardList } from 'lucide-react';
export function ManagerInventoryMain() {
  const user = useManagerSession();
  const { selectedPropertyId, loading: ctxLoading } = useManagerPropertyContext();
  const {
    inventory, requests, batches, activeTab, setActiveTab,
    formData, setFormData, purchaseCost, setPurchaseCost, purchasedQty, setPurchasedQty, purchaseDate, setPurchaseDate,
    currentPage, setCurrentPage, itemsPerPage,
    lowStockAlerts, expiryAlerts, alertCount, pendingCount,
    loadData, handleUpdateQty, handleAdd, handleMarkPurchased
  } = useManagerInventory(selectedPropertyId, ctxLoading, user?.id);
  if (ctxLoading) return <div className="p-6 text-secondary">Loading...</div>;
  if (!selectedPropertyId) return <div className="p-6 text-center text-secondary">Property Required</div>;
  const currentList = activeTab === 'live' ? inventory : requests;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const paginatedRequests = requests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return (
    <div className="space-y-6 pb-20 manager-theme animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-primary flex items-center gap-2 tracking-tight">
            <ClipboardList className="w-6 h-6 text-theme-primary" />
            Inventory & Kitchen Requests
          </h1>
          <p className="text-sm text-secondary">Manage live stock, fulfill cook requests, and track batches.</p>
        </div>
      </div>
      
      <ManagerInventoryKPIs pendingCount={pendingCount} alertCount={alertCount} totalItems={inventory.length} />
      <ManagerInventoryTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingCount={pendingCount} 
        alertCount={alertCount} 
      />
      {activeTab === 'requests' && (
        <ManagerInventoryRequests 
          requests={paginatedRequests}
          purchasedQty={purchasedQty}
          setPurchasedQty={setPurchasedQty as any}
          purchaseDate={purchaseDate}
          setPurchaseDate={setPurchaseDate as any}
          purchaseCost={purchaseCost}
          setPurchaseCost={setPurchaseCost as any}
          handleMarkPurchased={handleMarkPurchased}
        />
      )}
      {activeTab === 'live' && (
        <ManagerInventoryLive 
          inventory={inventory}
          handleUpdateQty={handleUpdateQty}
          formData={formData}
          setFormData={setFormData as any}
          handleAdd={handleAdd}
        />
      )}
      {activeTab === 'batches' && (
        <ManagerInventoryBatches batches={batches} />
      )}
      {activeTab === 'alerts' && (
        <ManagerInventoryAlerts 
          alertCount={alertCount}
          expiryAlerts={expiryAlerts}
          lowStockAlerts={lowStockAlerts}
          requests={requests}
          selectedPropertyId={selectedPropertyId}
          userId={user?.id}
          loadData={loadData}
        />
      )}
      {(activeTab === 'requests' || activeTab === 'live') && totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}