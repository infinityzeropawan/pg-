// RESPONSIBILITY: Renders the OwnerRoomsAddModal component. Receives data via props/hooks.

import { AlertCircle, CheckCircle2, X } from 'lucide-react';

import type { Dispatch, SetStateAction } from 'react';

export interface OwnerRoomsAddModalProps {
  showAddModal: boolean;
  setShowAddModal: Dispatch<SetStateAction<boolean>>;
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
  properties: unknown[];
  error: string;
  submitting: boolean;
  handleCreateRoom: (e: React.FormEvent) => void;
}

export function OwnerRoomsAddModal({
  showAddModal,
  setShowAddModal,
  formData,
  setFormData,
  properties,
  error,
  submitting,
  handleCreateRoom
}: OwnerRoomsAddModalProps) {
  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border bg-[rgba(99,102,241,0.02)] shrink-0">
          <h2 className="text-lg font-bold text-primary">Add New Room</h2>
          <button onClick={() => setShowAddModal(false)} className="text-secondary hover:text-danger motion-safe:transition-colors p-1 rounded-full hover:bg-page">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {error && (
            <div className="mb-4 p-3 bg-danger-bg text-danger text-sm rounded-md border border-danger flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <form id="addRoomForm" onSubmit={handleCreateRoom} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-secondary">Property *</label>
              <select 
                required 
                value={(formData as any).propertyId} 
// @ts-expect-error
                onChange={e => setFormData((p: unknown) => ({...p, propertyId: e.target.value}))}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
              >
                <option value="" disabled>Select Property</option>
                {properties.map(p => (
// @ts-expect-error
                  <option key={p.id} value={p.id}>{(p as any).name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-secondary">Floor *</label>
                <input 
                  required type="number" min="0"
                  onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                  value={(formData as any).floor} 
// @ts-expect-error
                  onChange={e => setFormData((p: unknown) => ({...p, floor: parseInt(e.target.value)||0}))}
                  className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-secondary">Room Number *</label>
                <input 
                  required type="text" placeholder="e.g. 101"
                  value={(formData as any).number} 
// @ts-expect-error
                  onChange={e => setFormData((p: unknown) => ({...p, number: e.target.value}))}
                  className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-secondary">Sharing *</label>
                <select 
                  required
                  value={(formData as any).sharing} 
// @ts-expect-error
                  onChange={e => setFormData((p: unknown) => ({...p, sharing: parseInt(e.target.value)||1}))}
                  className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
                >
                  <option value="1">1 (Single)</option>
                  <option value="2">2 Sharing</option>
                  <option value="3">3 Sharing</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-secondary">Rent / Bed *</label>
                <input 
                  required type="number" min="0"
                  onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                  value={(formData as any).rentPerBed} 
// @ts-expect-error
                  onChange={e => setFormData((p: unknown) => ({...p, rentPerBed: parseInt(e.target.value)||0}))}
                  className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-secondary">Deposit *</label>
                <input 
                  required type="number" min="0"
                  onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                  value={(formData as any).deposit} 
// @ts-expect-error
                  onChange={e => setFormData((p: unknown) => ({...p, deposit: parseInt(e.target.value)||0}))}
                  className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-secondary">Amenities (comma separated)</label>
              <input 
                type="text" placeholder="AC, Balcony, Attached Washroom"
                value={(formData as any).amenities} 
// @ts-expect-error
                onChange={e => setFormData((p: unknown) => ({...p, amenities: e.target.value}))}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
              />
            </div>

            <div className="pt-4 border-t border-border mt-6 bg-[rgba(16,185,129,0.05)] p-3 rounded-lg flex gap-3 text-success">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div className="text-xs">
                <strong>Auto-generation active:</strong> Saving this will automatically create {(formData as any).sharing} beds ({Array.from({length: (formData as any).sharing}).map((_,i) => String.fromCharCode(65+i)).join(', ')}) attached to this room.
              </div>
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t border-border bg-page shrink-0 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 text-sm font-medium text-secondary hover:text-primary motion-safe:transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="addRoomForm"
            disabled={submitting}
            className="bg-primary text-white px-6 py-2 rounded-md text-sm font-bold hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Room & Beds'}
          </button>
        </div>
      </div>
    </div>
  );
}
