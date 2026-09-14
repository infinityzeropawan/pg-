
import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

import type { BaseEntity } from '@/lib/types/contract';

export interface StockItem extends BaseEntity {
  id: string;
  propertyId: string;
  name: string;
  quantity: number;
  unit: string;
  category?: string;
  lowStockThreshold?: number;
  expiryDate?: string;
  updatedAt: string;
}

export const stockApi = {
  getByPropertyAsync: async (propertyId: string): Promise<StockItem[]> => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const res = await fetch('http://localhost:5000/api/v1/staff/stock', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data.map((item: any) => ({
          id: item.id,
          propertyId: item.propertyId,
          name: item.itemName,
          quantity: item.currentQuantity,
          unit: item.unit,
          category: item.category,
          lowStockThreshold: item.minThreshold,
          updatedAt: item.updatedAt,
        }));
      }
    } catch (e) {
      console.error('Failed to fetch staff stock from backend API:', e);
    }
    return [];
  },

  getByProperty: (propertyId: string): StockItem[] => {
    return db.getAll<StockItem>(STORAGE_KEYS.INVENTORY || 'spg_inventory')
      .filter(i => i.propertyId === propertyId)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  add: (data: Omit<StockItem, 'id' | 'updatedAt'>) => {
    const newItem = {
      ...data,
      id: createId('stk'),
      updatedAt: new Date().toISOString()
    } as StockItem;
    db.insert(STORAGE_KEYS.INVENTORY || 'spg_inventory', newItem);
    return newItem;
  },

  update: (id: string, updates: Partial<Omit<StockItem, 'id' | 'propertyId'>>) => {
    const existing = db.getById<StockItem>(STORAGE_KEYS.INVENTORY || 'spg_inventory', id);
    if (!existing) throw new Error('Stock item not found');
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    db.update(STORAGE_KEYS.INVENTORY || 'spg_inventory', id, updated);
    return updated;
  },

  delete: (id: string) => {
    db.remove(STORAGE_KEYS.INVENTORY || 'spg_inventory', id);
  }
};

export type StockBatchStatus = 'unopened' | 'opened' | 'empty';

export interface StockBatch extends BaseEntity {
  id: string;
  propertyId: string;
  itemName: string;
  category?: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  status: StockBatchStatus;
  receivedAt: string; // Date manager fulfilled it
  openedAt?: string;  // Date cook opened it
  emptiedAt?: string; // Date cook emptied it
  isDeleted?: boolean;
}

export const stockBatchesApi = {
  getByProperty: (propertyId: string): StockBatch[] => {
    return db.getAll<StockBatch>(STORAGE_KEYS.STOCK_BATCHES || 'spg_stock_batches')
      .filter(b => b.propertyId === propertyId && !b.isDeleted)
      .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  },

  addBatch: (data: Omit<StockBatch, 'id' | 'status' | 'receivedAt'>) => {
    const newBatch = {
      ...data,
      id: createId('sbat'),
      status: 'unopened',
      receivedAt: new Date().toISOString()
    } as StockBatch;
    db.insert(STORAGE_KEYS.STOCK_BATCHES || 'spg_stock_batches', newBatch);
    return newBatch;
  },

  openBatch: (id: string) => {
    const existing = db.getById<StockBatch>(STORAGE_KEYS.STOCK_BATCHES || 'spg_stock_batches', id);
    if (!existing) throw new Error('Batch not found');
    db.update(STORAGE_KEYS.STOCK_BATCHES || 'spg_stock_batches', id, {
      status: 'opened',
      openedAt: new Date().toISOString()
    });
  },

  emptyBatch: (id: string) => {
    const existing = db.getById<StockBatch>(STORAGE_KEYS.STOCK_BATCHES || 'spg_stock_batches', id);
    if (!existing) throw new Error('Batch not found');
    db.update(STORAGE_KEYS.STOCK_BATCHES || 'spg_stock_batches', id, {
      status: 'empty',
      emptiedAt: new Date().toISOString()
    });
  }
};
