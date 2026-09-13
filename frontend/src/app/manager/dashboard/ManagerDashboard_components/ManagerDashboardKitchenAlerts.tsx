// RESPONSIBILITY: Renders the ManagerDashboardKitchenAlerts component.
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

import type { StockRequest } from '@/app/staff/staff_lib/staff_api/StaffStockRequests';
interface ManagerDashboardKitchenAlertsProps {
  kitchenRequests: StockRequest[];
}
export function ManagerDashboardKitchenAlerts({ kitchenRequests }: ManagerDashboardKitchenAlertsProps) {
  if (kitchenRequests.length === 0) return null;
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-danger" />
        Urgent Kitchen Requests ({kitchenRequests.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kitchenRequests.map(req => (
          <div key={req.id} className="bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.3)] rounded-[var(--radius-lg,12px)] p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-primary text-lg">{req.itemName}</h3>
                <p className="text-sm text-danger font-medium">
                  Requested: {req.quantityRequested} {req.unit}
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-[rgba(239,68,68,0.1)] text-danger uppercase">
                NEW REQUEST
              </span>
            </div>
            <div className="flex gap-2 mt-4">
              <Link href="/manager/inventory" className="flex-1 bg-primary text-white px-3 py-2 rounded text-xs font-bold text-center hover:bg-primary-hover motion-safe:transition-colors">
                Fulfill in Inventory
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}