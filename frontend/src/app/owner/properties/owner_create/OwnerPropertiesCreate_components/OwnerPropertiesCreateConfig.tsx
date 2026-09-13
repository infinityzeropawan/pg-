// RESPONSIBILITY: Renders the OwnerPropertiesCreateConfig component. Receives data via props/hooks.

import { Settings2 } from 'lucide-react';

export interface OwnerPropertiesCreateConfigProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function OwnerPropertiesCreateConfig({ formData, handleInputChange }: OwnerPropertiesCreateConfigProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border bg-[rgba(99,102,241,0.02)] flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-primary">Configuration & Rules</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">Total Floors *</label>
          <input required type="number" min="0" name="floorsCount" value={(formData as any).floorsCount} onChange={handleInputChange}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">Night Entry Time</label>
          <input type="time" name="nightEntryTime" value={(formData as any).nightEntryTime} onChange={handleInputChange}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">Visitor Cutoff Time</label>
          <input type="time" name="visitorCutoff" value={(formData as any).visitorCutoff} onChange={handleInputChange}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">Notice Period (Days)</label>
          <input type="number" min="0" name="noticePeriodDays" value={(formData as any).noticePeriodDays} onChange={handleInputChange}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">Default Deposit (₹)</label>
          <input type="number" min="0" name="defaultDeposit" value={(formData as any).defaultDeposit} onChange={handleInputChange}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">Rent Cycle Date (1-28)</label>
          <input type="number" min="1" max="28" name="rentCycleDate" value={(formData as any).rentCycleDate} onChange={handleInputChange}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all"
          />
        </div>

        <div className="md:col-span-3 pt-2">
          <label className="flex items-center gap-3 p-3 bg-[rgba(99,102,241,0.05)] border border-[rgba(99,102,241,0.2)] rounded-md cursor-pointer hover:bg-[rgba(99,102,241,0.1)] motion-safe:transition-colors">
            <input type="checkbox" name="messEnabled" checked={(formData as any).messEnabled} onChange={handleInputChange} className="w-5 h-5 rounded accent-[var(--primary)]" />
            <div>
              <div className="text-sm font-semibold text-primary">Enable Mess / Cafeteria Module</div>
              <div className="text-[11px] text-secondary">Turns on menus, meal QR scanning, and mess wallets for this property.</div>
            </div>
          </label>
        </div>

        <div className="md:col-span-3 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-primary mb-4">Auto-Provision Rooms (Optional)</h3>
          <p className="text-xs text-secondary mb-4">Specify how many rooms you want to generate automatically. They will be created sequentially starting from Room 101 on Floor 1.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-secondary">Single Bed Rooms</label>
              <input type="number" min="0" name="singleRoomsCount" value={(formData as any).singleRoomsCount || ''} onChange={handleInputChange}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all"
                placeholder="e.g. 2"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-secondary">Double Sharing Rooms</label>
              <input type="number" min="0" name="doubleRoomsCount" value={(formData as any).doubleRoomsCount || ''} onChange={handleInputChange}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all"
                placeholder="e.g. 5"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-secondary">Triple Sharing Rooms</label>
              <input type="number" min="0" name="tripleRoomsCount" value={(formData as any).tripleRoomsCount || ''} onChange={handleInputChange}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary motion-safe:transition-all"
                placeholder="e.g. 3"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
