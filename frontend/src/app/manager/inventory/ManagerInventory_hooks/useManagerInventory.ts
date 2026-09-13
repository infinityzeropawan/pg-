// DATA FLOW: ManagerPropertyContext → api + stockRequestsApi + stockBatchesApi → local state → ManagerInventoryMain
// [DATA HOOK] useManagerInventory
// Responsibility: Manages inventory items, kitchen requests, and stock batches for the selected property.
import { useState, useEffect, useCallback } from 'react';

import { useManagerUrlPagination } from '@/app/manager/manager_components/manager_hooks/useManagerUrlPagination';
import { api } from '@/app/manager/manager_lib/manager_api/ManagerApi';
import { stockRequestsApi } from '@/app/staff/staff_lib/staff_api/StaffStockRequests';
import { stockBatchesApi } from '@/app/staff/staff_lib/staff_api/StaffStock';

import type { StockBatch } from '@/app/staff/staff_lib/staff_api/StaffStock';
import type { ManagerInventoryItem, ManagerKitchenRequest, ManagerInventoryTab } from '@/app/manager/inventory/ManagerInventory_types/ManagerInventory.types';

export function useManagerInventory(selectedPropertyId: string | null, ctxLoading: boolean, userId: string | undefined) {
  const [inventory, setInventory] = useState<ManagerInventoryItem[]>([]);
  const [requests, setRequests] = useState<ManagerKitchenRequest[]>([]);
  const [batches, setBatches] = useState<StockBatch[]>([]);
  const [activeTab, setActiveTab] = useState<ManagerInventoryTab>('requests');
  const [formData, setFormData] = useState({ name: '', quantity: '', threshold: '', category: 'Groceries' });
  const [purchaseCost, setPurchaseCost] = useState<{ [key: string]: string }>({});
  const [purchasedQty, setPurchasedQty] = useState<{ [key: string]: string }>({});
  const [purchaseDate, setPurchaseDate] = useState<{ [key: string]: string }>({});
  const { currentPage, setCurrentPage } = useManagerUrlPagination(1);
  const itemsPerPage = 10;

  // Loads all inventory data for the selected property.
  const loadData = useCallback(() => {
    if (!ctxLoading && selectedPropertyId) {
      setInventory(api.managerOperations.listInventory(selectedPropertyId) as unknown as ManagerInventoryItem[]);
      setRequests(stockRequestsApi.getByProperty(selectedPropertyId).filter((r) => r.status !== 'verified') as unknown as ManagerKitchenRequest[]);
      setBatches(stockBatchesApi.getByProperty(selectedPropertyId));
    }
  }, [ctxLoading, selectedPropertyId]);

  // Re-fetch all inventory data when property selection changes or context finishes loading.
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset pagination to page 1 when switching tabs or changing the active property.
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedPropertyId, setCurrentPage]);

  const handleUpdateQty = (id: string, delta: number) => {
    if (!userId) return;
    api.managerOperations.updateInventory(id, delta, userId);
    loadData();
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedPropertyId) return;
    api.managerOperations.addInventoryItem({
      propertyId: selectedPropertyId,
      name: formData.name,
      quantity: parseInt(formData.quantity) || 0,
      threshold: parseInt(formData.threshold) || 0,
      category: formData.category,
      managerId: userId
    });
    setFormData({ name: '', quantity: '', threshold: '', category: 'Groceries' });
    loadData();
  };

  const handleMarkPurchased = (id: string, defaultQty: number) => {
    if (!userId || !selectedPropertyId) return;
    const cost = parseInt(purchaseCost[id] ?? '0');
    if (!cost || isNaN(cost) || cost <= 0) {
      alert('Please enter a valid cost.');
      return;
    }
    const qty = purchasedQty[id] ? parseFloat(purchasedQty[id] ?? '0') : defaultQty;
    const date = purchaseDate[id] || (new Date().toISOString().split('T')[0] as string);
    if (!date) return;
    stockRequestsApi.markPurchased(id, cost, userId, qty, date);
    loadData();
  };

  const lowStockAlerts = inventory.filter(i => i.lowStockThreshold !== undefined && i.quantity <= i.lowStockThreshold);
  const expiryAlerts = inventory.filter(i => {
    if (!i.expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(i.expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  });
  const alertCount = lowStockAlerts.length + expiryAlerts.length;
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return {
    inventory, requests, batches, activeTab, setActiveTab,
    formData, setFormData, purchaseCost, setPurchaseCost, purchasedQty, setPurchasedQty, purchaseDate, setPurchaseDate,
    currentPage, setCurrentPage, itemsPerPage,
    lowStockAlerts, expiryAlerts, alertCount, pendingCount,
    loadData, handleUpdateQty, handleAdd, handleMarkPurchased
  };
}