// RESPONSIBILITY: Renders the ManagerInventoryBatches component.
import type { StockBatch } from '@/app/staff/staff_lib/staff_api/StaffStock';
interface Props {
  batches: StockBatch[];
}
export function ManagerInventoryBatches({ batches }: Props) {
  return (
    <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm">
      <div className="p-6 border-b border bg-[rgba(99,102,241,0.02)] flex justify-between items-center">
        <h2 className="text-base font-semibold text-primary">Cook's Usage Logs & Batches</h2>
        <p className="text-sm text-secondary">Track exact dates when items were ordered, opened, and expired.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-card border-b border text-secondary">
            <tr>
              <th className="p-4 font-semibold uppercase text-xs tracking-wider">Item</th>
              <th className="p-4 font-semibold uppercase text-xs tracking-wider">Qty/Unit</th>
              <th className="p-4 font-semibold uppercase text-xs tracking-wider">Status</th>
              <th className="p-4 font-semibold uppercase text-xs tracking-wider">Received</th>
              <th className="p-4 font-semibold uppercase text-xs tracking-wider">Opened</th>
              <th className="p-4 font-semibold uppercase text-xs tracking-wider">Expiry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {batches.map(batch => (
              <tr key={batch.id} className="hover:bg-[rgba(0,0,0,0.01)] motion-safe:transition-colors">
                <td className="p-4">
                  <div className="font-bold text-primary">{batch.itemName}</div>
                  <div className="text-xs text-secondary mt-0.5">{batch.category || 'Groceries'}</div>
                </td>
                <td className="p-4 font-medium">{batch.quantity} {batch.unit}</td>
                <td className="p-4">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${
                    batch.status === 'unopened' ? 'bg-primary-subtle text-primary' : 
                    batch.status === 'opened' ? 'bg-warning-bg text-warning border border-warning/20' : 
                    'bg-input text-secondary'
                  }`}>
                    {batch.status}
                  </span>
                </td>
                <td className="p-4 text-secondary font-medium">
                  {batch.receivedAt ? new Date(batch.receivedAt).toLocaleDateString() : '-'}
                </td>
                <td className="p-4 text-secondary font-medium">
                  {batch.openedAt ? (
                    <span className="text-warning">{new Date(batch.openedAt).toLocaleDateString()}</span>
                  ) : '-'}
                </td>
                <td className="p-4 text-secondary font-medium">
                  {batch.expiryDate ? (
                    <span className={new Date(batch.expiryDate) < new Date() ? 'text-danger font-bold' : ''}>
                      {new Date(batch.expiryDate).toLocaleDateString()}
                    </span>
                  ) : '-'}
                </td>
              </tr>
            ))}
            {batches.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-secondary">No usage logs available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}