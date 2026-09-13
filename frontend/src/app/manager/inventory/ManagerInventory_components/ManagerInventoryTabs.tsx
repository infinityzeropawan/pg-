// RESPONSIBILITY: Renders the ManagerInventoryTabs component.
import { Archive, ShoppingCart, Clock, AlertTriangle } from 'lucide-react';

import type { ManagerInventoryTab } from '@/app/manager/inventory/ManagerInventory_types/ManagerInventory.types';
interface Props {
  activeTab: ManagerInventoryTab;
  setActiveTab: (tab: ManagerInventoryTab) => void;
  pendingCount: number;
  alertCount: number;
}
export function ManagerInventoryTabs({ activeTab, setActiveTab, pendingCount, alertCount }: Props) {
  return (
    <div className="flex border-b border mb-6">
      <button
        onClick={() => setActiveTab('requests')}
        className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 motion-safe:transition-colors ${
          activeTab === 'requests' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-secondary hover:text-primary'
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        Kitchen Requests
        {pendingCount > 0 && (
          <span className="bg-danger text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{pendingCount}</span>
        )}
      </button>
      <button
        onClick={() => setActiveTab('live')}
        className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 motion-safe:transition-colors ${
          activeTab === 'live' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-secondary hover:text-primary'
        }`}
      >
        <Archive className="w-4 h-4" />
        Live Inventory
      </button>
      <button
        onClick={() => setActiveTab('batches')}
        className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 motion-safe:transition-colors ${
          activeTab === 'batches' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-secondary hover:text-primary'
        }`}
      >
        <Clock className="w-4 h-4" />
        Usage Logs (Batches)
      </button>
      <button
        onClick={() => setActiveTab('alerts')}
        className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 motion-safe:transition-colors ${
          activeTab === 'alerts' 
            ? 'border-danger text-danger' 
            : 'border-transparent text-secondary hover:text-primary'
        }`}
      >
        <AlertTriangle className="w-4 h-4" />
        Alerts
        {alertCount > 0 && (
          <span className="bg-danger text-white text-[10px] px-2 py-0.5 rounded-full ml-1">{alertCount}</span>
        )}
      </button>
    </div>
  );
}