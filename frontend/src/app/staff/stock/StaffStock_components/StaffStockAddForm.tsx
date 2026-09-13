// RESPONSIBILITY: Add-item form for the Staff Stock page.
'use client';

interface StaffStockAddFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  name: string;
  setName: (v: string) => void;
  qty: string;
  setQty: (v: string) => void;
  unit: string;
  setUnit: (v: string) => void;
  threshold: string;
  setThreshold: (v: string) => void;
  expiry: string;
  setExpiry: (v: string) => void;
}

export function StaffStockAddForm({
  onSubmit, onCancel,
  name, setName, qty, setQty, unit, setUnit, threshold, setThreshold, expiry, setExpiry
}: StaffStockAddFormProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm animate-fade-in">
      <h3 className="text-sm font-bold text-primary mb-4">Add New Stock Item</h3>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-secondary mb-1 block">Item Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rice, Oil, Dal"
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold text-secondary mb-1 block">Quantity</label>
          <input
            type="number" step="0.01" min="0"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="0"
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold text-secondary mb-1 block">Threshold</label>
          <input
            type="number" step="0.01" min="0"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="e.g. 2"
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-secondary mb-1 block">Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
          >
            <option value="Kg">Kg</option>
            <option value="Liters">Liters</option>
            <option value="Packets">Packets</option>
            <option value="Pieces">Pieces</option>
            <option value="Grams">Grams</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-secondary mb-1 block">Expiry Date</label>
          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm focus:border-primary outline-none"
          />
        </div>
        <div className="md:col-span-6 flex items-center justify-end gap-3 mt-2">
          <button type="button" onClick={onCancel} className="text-sm text-secondary hover:text-primary font-medium px-4 py-2">
            Cancel
          </button>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded text-sm font-bold hover:bg-primary-hover">
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
}
