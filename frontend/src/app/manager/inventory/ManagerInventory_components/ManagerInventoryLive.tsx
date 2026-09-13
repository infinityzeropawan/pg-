// @ts-nocheck
// RESPONSIBILITY: Renders the ManagerInventoryLive component.
import { AlertTriangle, Minus, Plus } from 'lucide-react';

import type { ManagerInventoryItem } from '@/app/manager/inventory/ManagerInventory_types/ManagerInventory.types';
interface Props {
  inventory: ManagerInventoryItem[];
  handleUpdateQty: (id: string, delta: number) => void;
  formData: unknown;
  setFormData: (val: unknown) => void;
  handleAdd: (e: React.FormEvent) => void;
}
export function ManagerInventoryLive({ inventory, handleUpdateQty, formData, setFormData, handleAdd }: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[rgba(99,102,241,0.02)] border-b border text-secondary">
            <tr>
              <th className="p-4 font-medium">Item Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Quantity</th>
              <th className="p-4 font-medium text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-input motion-safe:transition-colors">
                <td className="p-4">
                  <div className="font-medium text-primary">{item.name}</div>
                  {item.expiryDate && (
                    <div className="text-xs text-secondary mt-0.5">Expires: {new Date(item.expiryDate).toLocaleDateString()}</div>
                  )}
                  {item.threshold !== undefined && item.quantity <= item.threshold && (
                    <div className="text-xs text-danger flex items-center gap-1 mt-1"><AlertTriangle className="w-3 h-3"/> Low Stock</div>
                  )}
                </td>
                <td className="p-4 text-secondary">{item.category}</td>
                <td className="p-4">
                  <span className={`font-bold text-lg ${(item.threshold !== undefined && item.quantity <= item.threshold) ? 'text-danger' : 'text-primary'}`}>
                    {item.quantity} {item.unit || ''}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => handleUpdateQty(item.id, -1)} className="p-1.5 bg-card border border text-primary rounded hover:bg-danger-bg hover:text-danger hover:border-danger">
                    <Minus className="w-4 h-4"/>
                  </button>
                  <button onClick={() => handleUpdateQty(item.id, 1)} className="p-1.5 bg-card border border text-primary rounded hover:bg-success-bg hover:text-success hover:border-success">
                    <Plus className="w-4 h-4"/>
                  </button>
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-secondary">No inventory items.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="lg:w-80 space-y-4">
        <div className="bg-card border border rounded-[var(--radius-lg,12px)] p-6">
          <h2 className="font-bold text-lg text-primary mb-4">Add Misc Stock</h2>
          <p className="text-xs text-secondary mb-4 leading-relaxed">Directly add maintenance items. For Groceries, the kitchen will send requests.</p>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Item Name</label>

              <input type="text" required value={String(formData.name || '')} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-input border border rounded p-2 text-sm text-primary" placeholder="e.g. Light Bulbs" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Qty</label>

                <input type="number" required value={String(formData.quantity || '')} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} className="w-full bg-input border border rounded p-2 text-sm text-primary" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Min Threshold</label>

                <input type="number" required value={String(formData.threshold || '')} onChange={e => setFormData({...formData, threshold: parseInt(e.target.value) || 0})} className="w-full bg-input border border rounded p-2 text-sm text-primary" placeholder="0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Category</label>

              <select value={String(formData.category || '')} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-input border border rounded p-2 text-sm text-primary">
                <option>Maintenance</option>
                <option>Cleaning</option>
                <option>Misc</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 rounded font-medium hover:bg-primary-hover motion-safe:transition-colors">
              Add Stock
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}