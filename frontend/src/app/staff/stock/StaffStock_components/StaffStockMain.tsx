// RESPONSIBILITY: Renders the StaffStockMain component.
'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Search } from 'lucide-react';
import { Edit2, Trash2, Check, X } from 'lucide-react';

import { useStaffContext } from '@/app/staff/staff_components/StaffContext';
import { stockApi } from '@/app/staff/staff_lib/staff_api/StaffStock';
import { Pagination } from '@/components/ui/Pagination';
import { stockBatchesApi } from '@/app/staff/staff_lib/staff_api/StaffStock';

import { StaffStockAddForm } from './StaffStockAddForm';
import { StaffStockPantry } from './StaffStockPantry';

import type { StockItem, StockBatch } from '@/app/staff/staff_lib/staff_api/StaffStock';

export function StaffStockMain() {
  const { propertyId, loading: ctxLoading } = useStaffContext();
  const [items, setItems] = useState<StockItem[]>([]);
  const [batches, setBatches] = useState<StockBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'pantry'>('live');
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('Kg');
  const [newItemThreshold, setNewItemThreshold] = useState('');
  const [newItemExpiry, setNewItemExpiry] = useState('');
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState('');
  
  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, propertyId]);

  const loadStock = () => {
    if (propertyId) {
      setLoading(true);
      const data = stockApi.getByProperty(propertyId);
      const batchesData = stockBatchesApi.getByProperty(propertyId);
      setItems(data);
      setBatches(batchesData);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ctxLoading && propertyId) {
      loadStock();
    }
  }, [ctxLoading, propertyId]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !newItemName.trim() || !newItemQty) return;
    
    stockApi.add({
      propertyId,
      name: newItemName.trim(),
      quantity: parseFloat(newItemQty),
      unit: newItemUnit,
      lowStockThreshold: newItemThreshold ? parseFloat(newItemThreshold) : undefined,
      expiryDate: newItemExpiry ? newItemExpiry : undefined
    });
    
    setNewItemName('');
    setNewItemQty('');
    setNewItemThreshold('');
    setNewItemExpiry('');
    setShowAddForm(false);
    loadStock();
  };

  const handleUpdateQty = (id: string) => {
    if (!editQty) return;
    stockApi.update(id, { quantity: parseFloat(editQty) });
    setEditingId(null);
    setEditQty('');
    loadStock();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      stockApi.delete(id);
      loadStock();
    }
  };

  if (ctxLoading || loading) return <div className="p-6 motion-safe:animate-pulse">Loading stock...</div>;
  if (!propertyId) return <div className="p-6 text-center text-secondary">Property Required</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary">Kitchen Stock</h1>
          <p className="text-sm text-secondary">Manage your daily and monthly kitchen inventory.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('live')}
          className={`px-6 py-3 font-semibold text-sm border-b-2 motion-safe:transition-colors ${
            activeTab === 'live' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          Overview (Live Stock)
        </button>
        <button
          onClick={() => setActiveTab('pantry')}
          className={`px-6 py-3 font-semibold text-sm border-b-2 motion-safe:transition-colors ${
            activeTab === 'pantry' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-secondary hover:text-primary'
          }`}
        >
          Pantry (Boxes & Batches)
        </button>
      </div>

      {activeTab === 'live' && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm text-primary focus:outline-none focus:border-primary w-48"
            />
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-primary text-white px-5 py-2.5 rounded-md text-sm font-bold hover:bg-primary-hover motion-safe:transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {showAddForm && (
        <StaffStockAddForm
          onSubmit={handleAddItem}
          onCancel={() => setShowAddForm(false)}
          name={newItemName} setName={setNewItemName}
          qty={newItemQty} setQty={setNewItemQty}
          unit={newItemUnit} setUnit={setNewItemUnit}
          threshold={newItemThreshold} setThreshold={setNewItemThreshold}
          expiry={newItemExpiry} setExpiry={setNewItemExpiry}
        />
      )}

      {(() => {
        const filteredItems = items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.category?.toLowerCase().includes(searchQuery.toLowerCase()));
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        if (items.length === 0) return (
          <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-lg text-center">
            <Package className="w-12 h-12 text-secondary opacity-50 mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-1">Stock is Empty</h3>
            <p className="text-secondary text-sm max-w-sm mb-4">
              You have not added any items to your kitchen inventory yet.
            </p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="text-primary text-sm font-bold hover:underline"
            >
              Click here to add your first item
            </button>
          </div>
        );

        return (
          <>
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-card border-b border-border sticky top-0 z-10 shadow-sm shadow-black/5">
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-secondary">Item Name</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-secondary">Category</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-secondary">Available Qty</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-secondary">Threshold</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-secondary">Expiry</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-secondary text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {paginatedItems.map((item: any) => {
                      const isLowStock = item.lowStockThreshold !== undefined && item.quantity <= item.lowStockThreshold;
                      
                      let isExpiringSoon = false;
                      let isExpired = false;
                      if (item.expiryDate) {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const expiry = new Date(item.expiryDate);
                        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        if (diffDays < 0) isExpired = true;
                        else if (diffDays <= 3) isExpiringSoon = true;
                      }

                      const rowAlertClass = (isLowStock || isExpired || isExpiringSoon) ? 'bg-[rgba(239,68,68,0.05)] hover:bg-[rgba(239,68,68,0.08)]' : 'hover:bg-[rgba(0,0,0,0.01)] dark:hover:bg-[rgba(255,255,255,0.01)]';

                      return (
                      <tr key={item.id} className={`motion-safe:transition-colors ${rowAlertClass}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${(isLowStock || isExpired || isExpiringSoon) ? 'bg-[rgba(239,68,68,0.1)] text-danger' : 'bg-[rgba(99,102,241,0.1)] text-primary'}`}>
                              <Package className="w-4 h-4" />
                            </div>
                            <span className={`font-bold text-sm ${(isLowStock || isExpired || isExpiringSoon) ? 'text-danger' : 'text-primary'}`}>{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-secondary bg-input px-2 py-1 rounded-full border border-border">{item.category || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                          {editingId === item.id ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="number"
                                step="0.01"
                                min="0"
                                value={editQty}
                                onChange={(e) => setEditQty(e.target.value)}
                                className="w-20 bg-input border border-border rounded px-2 py-1 text-sm focus:border-primary outline-none"
                                autoFocus
                              />
                              <span className="text-sm font-medium text-secondary">{item.unit}</span>
                              <button onClick={() => handleUpdateQty(item.id)} className="text-success ml-2 p-1 hover:bg-success-bg rounded">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingId(null)} className="text-danger p-1 hover:bg-danger-bg rounded">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${isLowStock ? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)] text-danger' : 'bg-input border-border text-primary'}`}>
                              {item.quantity} <span className="text-xs opacity-70">{item.unit}</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-secondary">
                            {item.lowStockThreshold !== undefined ? `${item.lowStockThreshold} ${item.unit}` : '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {item.expiryDate ? (
                            <span className={`text-sm font-bold ${(isExpired || isExpiringSoon) ? 'text-danger' : 'text-primary'}`}>
                              {new Date(item.expiryDate).toLocaleDateString()}
                              {isExpired && ' (Expired)'}
                              {isExpiringSoon && !isExpired && ' (Expiring soon)'}
                            </span>
                          ) : <span className="text-sm font-medium text-secondary">-</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {editingId !== item.id && (
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setEditingId(item.id);
                                  setEditQty(item.quantity.toString());
                                }}
                                className="p-2 text-secondary hover:text-primary hover:bg-primary-subtle rounded-full motion-safe:transition-colors"
                                title="Update Quantity"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-secondary hover:text-danger hover:bg-danger-bg rounded-full motion-safe:transition-colors"
                                title="Delete Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )})}
                    {paginatedItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-secondary">No items match your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
          </>
        );
      })()}
      </>
      )}

      {activeTab === 'pantry' && (
        <StaffStockPantry batches={batches} onRefresh={loadStock} />
      )}
    </div>
  );
}
