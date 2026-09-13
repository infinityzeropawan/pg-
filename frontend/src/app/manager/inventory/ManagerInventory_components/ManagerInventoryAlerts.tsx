// RESPONSIBILITY: Renders the ManagerInventoryAlerts component.
import { AlertTriangle, CheckCircle } from 'lucide-react';

import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';

import type { ManagerInventoryItem, ManagerKitchenRequest } from '@/app/manager/inventory/ManagerInventory_types/ManagerInventory.types';
interface Props {
  alertCount: number;
  expiryAlerts: ManagerInventoryItem[];
  lowStockAlerts: ManagerInventoryItem[];
  requests: ManagerKitchenRequest[];
  selectedPropertyId: string | null;
  userId: string | undefined;
  loadData: () => void;
}
export function ManagerInventoryAlerts({
  alertCount, expiryAlerts, lowStockAlerts, requests, selectedPropertyId, userId, loadData
}: Props) {
  if (alertCount === 0) {
    return (
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-10 text-center">
        <div className="w-16 h-16 bg-[rgba(34,197,94,0.1)] text-success rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-primary mb-2">No Alerts</h2>
        <p className="text-secondary">All stock levels and expiry dates are optimal.</p>
      </div>
    );
  }
  const handleCreateRequest = (item: ManagerInventoryItem) => {
    if (!selectedPropertyId || !userId) return;
    api.managerOperations.addInventoryItem({
      propertyId: selectedPropertyId,
      name: item.name,
      quantity: 0,
      threshold: item.lowStockThreshold || 0,
      category: item.category,
      managerId: userId
    });
    alert('Added to Kitchen Requests!');
    loadData();
  };
  return (
    <div className="space-y-6">
      {expiryAlerts.length > 0 && (
        <div className="bg-card border border-[rgba(239,68,68,0.3)] rounded-[var(--radius-lg,12px)] p-5 shadow-sm">
          <h3 className="font-bold text-danger mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Expiry Alerts
          </h3>
          <div className="space-y-3">
            {expiryAlerts.map(i => {
              const diffDays = Math.ceil((new Date(i.expiryDate!).getTime() - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
              const statusText = diffDays < 0 ? 'is EXPIRED!' : `expires in ${diffDays} days!`;
              return (
                <div key={`exp-${i.id}`} className="bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)] text-danger text-sm rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <strong className="text-base">{i.name}</strong> {statusText}
                    <p className="text-xs text-secondary mt-1">Found in Live Inventory.</p>
                  </div>
                  <button 
                    onClick={() => handleCreateRequest(i)}
                    className="bg-danger text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-danger-hover w-full sm:w-auto text-center"
                  >
                    Order Replacement
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {lowStockAlerts.length > 0 && (
        <div className="bg-card border border-[rgba(239,68,68,0.3)] rounded-[var(--radius-lg,12px)] p-5 shadow-sm">
          <h3 className="font-bold text-danger mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Low Stock Alerts
          </h3>
          <div className="space-y-3">
            {lowStockAlerts.map(i => {
              const activeReq = requests.find(r => r.itemName === i.name);
              return (
                <div key={i.id} className="bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)] text-danger text-sm rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <strong className="text-base">{i.name}</strong> is running low.
                    <p className="text-xs text-secondary mt-1">Current: {i.quantity} {i.unit} (Threshold: {i.lowStockThreshold} {i.unit})</p>
                  </div>
                  {!activeReq ? (
                    <button 
                      onClick={() => handleCreateRequest(i)}
                      className="bg-danger text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-danger-hover w-full sm:w-auto text-center"
                    >
                      Create Purchase Request
                    </button>
                  ) : (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[rgba(239,68,68,0.1)] uppercase w-fit">
                      Already Requested
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}