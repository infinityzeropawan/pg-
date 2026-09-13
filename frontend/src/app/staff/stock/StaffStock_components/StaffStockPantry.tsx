// RESPONSIBILITY: Renders the pantry batches tab for Staff Stock page.
'use client';

import { Package } from 'lucide-react';

import { stockBatchesApi } from '@/app/staff/staff_lib/staff_api/StaffStock';

import type { StockBatch } from '@/app/staff/staff_lib/staff_api/StaffStock';

interface StaffStockPantryProps {
  batches: StockBatch[];
  onRefresh: () => void;
}

export function StaffStockPantry({ batches, onRefresh }: StaffStockPantryProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border bg-[rgba(99,102,241,0.02)] flex justify-between items-center">
        <h2 className="text-base font-semibold text-primary">Pantry Batches</h2>
        <p className="text-sm text-secondary">Items received from the manager.</p>
      </div>
      <div className="p-6 space-y-4">
        {batches.length === 0 ? (
          <div className="text-center py-12 text-secondary">
            <Package className="w-10 h-10 mx-auto opacity-30 mb-3" />
            <p>No batches found in the pantry.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map(batch => (
              <div key={batch.id} className="border border-border rounded-xl p-4 bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-primary">{batch.itemName}</h3>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    batch.status === 'unopened' ? 'bg-primary-subtle text-primary' : 
                    batch.status === 'opened' ? 'bg-warning-bg text-warning border border-warning/20' : 
                    'bg-input text-secondary'
                  }`}>
                    {batch.status}
                  </span>
                </div>
                <div className="text-sm text-secondary mb-4">
                  {batch.quantity} {batch.unit} &bull; {batch.category || 'Groceries'}
                </div>
                
                <div className="space-y-1.5 text-xs">
                  {batch.receivedAt && (
                    <div className="flex justify-between">
                      <span className="text-secondary">Received:</span>
                      <span className="font-medium">{new Date(batch.receivedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {batch.openedAt && (
                    <div className="flex justify-between">
                      <span className="text-secondary">Opened:</span>
                      <span className="font-medium text-warning">{new Date(batch.openedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {batch.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-secondary">Expires:</span>
                      <span className="font-medium text-danger">{new Date(batch.expiryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-border flex gap-2">
                  {batch.status === 'unopened' && (
                    <button 
                      onClick={() => { stockBatchesApi.openBatch(batch.id); onRefresh(); }}
                      className="flex-1 bg-primary-subtle text-primary font-bold text-xs py-2 rounded-lg hover:bg-primary hover:text-white motion-safe:transition-colors"
                    >
                      Open Box
                    </button>
                  )}
                  {batch.status === 'opened' && (
                    <button 
                      onClick={() => {
                        if (confirm('Mark this batch as empty?')) {
                          stockBatchesApi.emptyBatch(batch.id);
                          onRefresh();
                        }
                      }}
                      className="flex-1 bg-[rgba(239,68,68,0.1)] text-danger font-bold text-xs py-2 rounded-lg hover:bg-danger hover:text-white motion-safe:transition-colors"
                    >
                      Mark Empty
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
