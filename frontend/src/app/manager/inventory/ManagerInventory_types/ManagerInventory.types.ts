export interface ManagerInventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit?: string;
  threshold?: number;
  lowStockThreshold?: number;
  expiryDate?: string;
}
export interface ManagerKitchenRequest {
  id: string;
  itemName: string;
  quantityRequested: number;
  unit?: string;
  status: 'pending' | 'verified' | string;
  createdAt: string;
}
export type ManagerInventoryTab = 'live' | 'requests' | 'batches' | 'alerts';