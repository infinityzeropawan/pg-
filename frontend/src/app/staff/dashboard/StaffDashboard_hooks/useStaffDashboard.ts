// RESPONSIBILITY: Provides business logic and state management for the Staff Dashboard.
// DATA FLOW: API -> useStaffDashboard -> StaffDashboardMain

import { useState, useEffect } from 'react';

import { useStaffContext } from '@/app/staff/staff_components/StaffContext';
import { authApi as api } from '@/app/staff/staff_lib/staff_api/StaffAuth';
import { foodApi } from '@/app/staff/staff_lib/staff_api/StaffFood';
import { stockApi } from '@/app/staff/staff_lib/staff_api/StaffStock';
import { stockRequestsApi } from '@/app/staff/staff_lib/staff_api/StaffStockRequests';
import { usageLogsApi } from '@/app/staff/staff_lib/staff_api/StaffUsageLogs';
import { getSession } from '@/app/staff/staff_lib/staff_auth/StaffSession';
import { attendanceApi } from '@/app/owner/owner_lib/owner_api/OwnerAttendance';

import type { StockRequest } from '@/app/staff/staff_lib/staff_api/StaffStockRequests';
import type { StockItem } from '@/app/staff/staff_lib/staff_api/StaffStock';
import type { FoodMenu } from '@/app/staff/staff_lib/staff_api/StaffFood';

export function useStaffDashboard() {
  const { staffRole, propertyId, loading } = useStaffContext();
  const user = typeof window !== 'undefined' ? getSession() : null;
  const [menu, setMenu] = useState<FoodMenu | null>(null);
  const [isPresent, setIsPresent] = useState(false);
  
  // Stock State
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [selectedStockName, setSelectedStockName] = useState('');
  const [usageQty, setUsageQty] = useState('');
  const [usageMeal, setUsageMeal] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Other'>('Breakfast');

  // Custom Request State
  const [customReqName, setCustomReqName] = useState('');
  const [customReqQty, setCustomReqQty] = useState('');

  const loadData = () => {
    if (staffRole === 'cook' && propertyId) {
      setMenu(foodApi.getByProperty(propertyId));
      setStockItems(stockApi.getByProperty(propertyId));
      setRequests(stockRequestsApi.getByProperty(propertyId).filter((r: unknown) => (r as any).status !== 'verified'));
    }
    if (propertyId && user) {
      setIsPresent(attendanceApi.getTodayStatus(propertyId, user.id));
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffRole, propertyId]);

  const handleNotifyManager = (item: StockItem) => {
    if (!user) return;
    
    stockRequestsApi.create({
      propertyId: propertyId!,
      itemName: item.name,
      quantityRequested: item.lowStockThreshold && item.lowStockThreshold > 0 ? item.lowStockThreshold * 2 : 10,
      unit: item.unit,
      requestedBy: user.id
    });
    loadData();
  };

  const handleCustomRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !propertyId || !customReqName || !customReqQty) return;
    
    const item = stockItems.find(i => `${i.name} (Avail: ${i.quantity} ${i.unit})` === customReqName || i.name === customReqName);
    
    stockRequestsApi.create({
      propertyId,
      itemName: item ? item.name : customReqName,
      quantityRequested: parseFloat(customReqQty),
      unit: item ? item.unit : 'kg',
      requestedBy: user.id
    });
    setCustomReqName('');
    setCustomReqQty('');
    loadData();
    alert('Request sent to manager!');
  };

  const handleMarkPresent = () => {
    if (propertyId && user) {
      attendanceApi.markPresent(propertyId, user.id);
      setIsPresent(true);
    }
  };

  const handleLogUsage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockName || !usageQty) return;
    
    const item = stockItems.find(i => `${i.name} (Avail: ${i.quantity} ${i.unit})` === selectedStockName || i.name === selectedStockName);
    if (!item) {
      alert('Please select a valid item from the list.');
      return;
    }

    const used = parseFloat(usageQty);
    if (used > 0 && item.quantity >= used) {
      stockApi.update(item.id, { quantity: item.quantity - used });
      
      usageLogsApi.create({
        propertyId: propertyId!,
        itemName: item.name,
        quantity: used,
        unit: item.unit,
        mealType: usageMeal,
        loggedBy: user!.id,
        date: new Date().toISOString().split('T')[0]
      });

      setSelectedStockName('');
      setUsageQty('');
      setUsageMeal('Breakfast');
      loadData();
    } else {
      alert('Invalid quantity or not enough stock available!');
    }
  };

  // Helper to get today's day key and data
  const getTodayMenu = () => {
    if (!menu) return null;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof FoodMenu;
    const rawVal = menu[today] as string;
    
    let dayData = { breakfast: '', lunch: '', dinner: rawVal || 'No menu set' };
    try {
      if (rawVal) {
        const parsed = JSON.parse(rawVal);
        if (parsed.breakfast !== undefined) dayData = parsed;
      }
    } catch (e: any) {}

    return { day: today, data: dayData };
  };

  const isMonthEnd = (() => {
    const d = new Date();
    const nextDay = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    return nextDay.getMonth() !== d.getMonth();
  })();

  const lowStockAlerts = stockItems.filter(i => i.lowStockThreshold !== undefined && i.quantity <= i.lowStockThreshold);
  const expiryAlerts = stockItems.filter(i => {
    if (!i.expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(i.expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  });

  return {
    staffRole,
    propertyId,
    loading,
    user,
    menu,
    isPresent,
    stockItems,
    requests,
    selectedStockName,
    setSelectedStockName,
    usageQty,
    setUsageQty,
    usageMeal,
    setUsageMeal,
    customReqName,
    setCustomReqName,
    customReqQty,
    setCustomReqQty,
    handleCustomRequest,
    handleMarkPresent,
    handleLogUsage,
    todayMenu: getTodayMenu(),
    isMonthEnd,
    lowStockAlerts,
    expiryAlerts
  };
}
