// RESPONSIBILITY: Renders the StaffCookMain component.
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, LayoutDashboard, Utensils, Users, Archive, ShoppingCart, ChefHat, Sparkles, ShieldCheck, MessageSquare, FileBarChart, Settings } from 'lucide-react';

import { useStaffContext } from '@/app/staff/staff_components/StaffContext';
import { getSession } from '@/app/staff/staff_lib/staff_auth/StaffSession';
import { staffOperationsApi } from '@/app/staff/staff_lib/staff_api/staffOperations';
import { stockApi } from "@/app/staff/staff_lib/staff_api/StaffStock";
import { authApi as api } from '@/app/staff/staff_lib/staff_api/StaffAuth';
import { mealsApi } from '@/app/staff/staff_lib/staff_api/StaffMeals';
import { stockRequestsApi } from '@/app/staff/staff_lib/staff_api/StaffStockRequests';
import { attendanceApi } from '@/app/owner/owner_lib/owner_api/OwnerAttendance';

// Existing Tabs
import { StaffCookLiveMealsTab } from './StaffCookLiveMealsTab';
import { StaffCookRequestTab } from './StaffCookRequestTab';
import { StaffCookIncomingTab } from './StaffCookIncomingTab';
import { StaffCookLiveStockTab } from './StaffCookLiveStockTab';

// New Tabs
import { StaffCookDashboardTab } from './StaffCookDashboardTab';
import { StaffCookMealAttendanceTab } from './StaffCookMealAttendanceTab';
import { StaffCookMealPrepTab } from './StaffCookMealPrepTab';
import { StaffCookSpecialReqTab } from './StaffCookSpecialReqTab';
import { StaffCookHygieneTab } from './StaffCookHygieneTab';
import { StaffCookFeedbackTab } from './StaffCookFeedbackTab';
import { StaffCookReportsTab } from './StaffCookReportsTab';
import { StaffCookSettingsTab } from './StaffCookSettingsTab';

import type { MealStatusType, MealType } from '@/app/staff/staff_lib/staff_api/StaffMeals';

type TabKey = 
  'dashboard' | 'menu' | 'attendance' | 'inventory' | 'purchase' | 
  'meal_prep' | 'special_req' | 'hygiene' | 'feedback' | 'reporting' | 'settings';

export function StaffCookMain() {
  const { propertyId } = useStaffContext();
  const session = typeof window !== 'undefined' ? getSession() : null;
  
  const [orders, setOrders] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [liveStock, setLiveStock] = useState<any[]>([]);
  const [mealStatuses, setMealStatuses] = useState<Record<MealType, MealStatusType>>({
    Breakfast: 'pending', Lunch: 'pending', Dinner: 'pending'
  });
  const [todayMenu, setTodayMenu] = useState<any>(null);
  const [isPresent, setIsPresent] = useState(false);
  
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  
  const [formData, setFormData] = useState({ itemName: '', quantityRequested: '', unit: 'kg' });
  const [expiryDates, setExpiryDates] = useState<{ [key: string]: string }>({});

  // Pagination state
  const [stockPage, setStockPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const [requestsPage, setRequestsPage] = useState(1);
  const [incomingPage, setIncomingPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setStockPage(1); setOrdersPage(1); setRequestsPage(1); setIncomingPage(1);
  }, [activeTab, propertyId]);

  const loadData = () => {
    if (propertyId) {
      setOrders(staffOperationsApi.getLiveOrders(propertyId));
      setRequests(stockRequestsApi.getByProperty(propertyId));
      setLiveStock(stockApi.getByProperty(propertyId).filter((s: any) => s.category?.toLowerCase() === 'groceries'));
      setMealStatuses(mealsApi.getTodayMealStatus(propertyId));
      setTodayMenu(staffOperationsApi.getTodayMenu(propertyId));
      if (session) setIsPresent(attendanceApi.getTodayStatus(propertyId, session.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [propertyId]);

  const handleMarkPresent = () => {
    if (!session || !propertyId) return;
    attendanceApi.markPresent(propertyId, session.id);
    loadData();
  };

  const handleMarkMealReady = (mealType: MealType) => {
    if (!session || !propertyId) return;
    mealsApi.markMealReady(propertyId, mealType, session.id);
    loadData();
  };

  const handleMarkServed = (orderId: string) => {
    if (!session) return;
    staffOperationsApi.updateOrderStatus(orderId, 'Served', session.id);
    loadData();
  };

  const handleRequestStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !propertyId) return;
    
    stockRequestsApi.create({
      propertyId,
      itemName: (formData as any).itemName,
      quantityRequested: parseFloat((formData as any).quantityRequested) || 0,
      unit: (formData as any).unit,
      requestedBy: session.id
    });
    
    setFormData({ itemName: '', quantityRequested: '', unit: 'kg' });
    alert('Request sent to manager!');
    setActiveTab('purchase');
    loadData();
  };

  const handleVerifyReceipt = (id: string, quantity: number, unit: string) => {
    const expiry = expiryDates[id];
    stockRequestsApi.verifyReceipt(id, quantity, unit, expiry);
    alert('Item verified and added to live stock!');
    loadData();
  };

  if (!propertyId) return <div className="p-6">Loading or Property not assigned...</div>;

  const incomingCount = requests.filter(r => r.status === 'purchased').length;
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const incomingDeliveries = requests.filter(r => r.status === 'purchased');

  // Paginated slices
  const paginatedOrders = orders.slice((ordersPage - 1) * itemsPerPage, ordersPage * itemsPerPage);
  const ordersTotalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedPendingRequests = pendingRequests.slice((requestsPage - 1) * itemsPerPage, requestsPage * itemsPerPage);
  const requestsTotalPages = Math.ceil(pendingRequests.length / itemsPerPage);
  const paginatedIncomingDeliveries = incomingDeliveries.slice((incomingPage - 1) * itemsPerPage, incomingPage * itemsPerPage);
  const incomingTotalPages = Math.ceil(incomingDeliveries.length / itemsPerPage);
  const paginatedStock = liveStock.slice((stockPage - 1) * itemsPerPage, stockPage * itemsPerPage);
  const stockTotalPages = Math.ceil(liveStock.length / itemsPerPage);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'menu', label: 'Menu Management', icon: <Utensils className="w-4 h-4" /> },
    { key: 'attendance', label: 'Meal Attendance', icon: <Users className="w-4 h-4" /> },
    { key: 'inventory', label: 'Kitchen Inventory', icon: <Archive className="w-4 h-4" /> },
    { key: 'purchase', label: 'Purchase Requests', icon: <ShoppingCart className="w-4 h-4" /> },
    { key: 'meal_prep', label: 'Meal Preparation', icon: <ChefHat className="w-4 h-4" /> },
    { key: 'special_req', label: 'Special Requests', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'hygiene', label: 'Hygiene & Safety', icon: <ShieldCheck className="w-4 h-4" /> },
    { key: 'feedback', label: 'Mess Feedback', icon: <MessageSquare className="w-4 h-4" /> },
    { key: 'reporting', label: 'Reporting', icon: <FileBarChart className="w-4 h-4" /> },
    { key: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-[1600px] mx-auto">
      {/* Tab Bar - Matching homepage Teal palette */}
      <div className="flex gap-1.5 p-1.5 rounded-2xl w-full overflow-x-auto border shadow-sm items-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        {tabs.map((tab) => (
          <button 
            key={tab.key}
            onClick={() => setActiveTab(tab.key)} 
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-xl motion-safe:transition-all whitespace-nowrap
              ${activeTab === tab.key 
                ? 'text-white shadow-md' 
                : 'text-secondary hover:bg-[#E6F0F4] hover:text-[#2D7D9A]'
              }`}
            style={activeTab === tab.key ? { background: '#2D7D9A' } : {}}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'dashboard' && (
          <StaffCookDashboardTab todayMenu={todayMenu} liveStock={liveStock} orders={orders} />
        )}
        
        {activeTab === 'menu' && (
          <StaffCookLiveMealsTab
            todayMenu={todayMenu}
            mealStatuses={mealStatuses}
            handleMarkMealReady={handleMarkMealReady}
            orders={orders}
            paginatedOrders={paginatedOrders}
            handleMarkServed={handleMarkServed}
            ordersPage={ordersPage}
            ordersTotalPages={ordersTotalPages}
            setOrdersPage={setOrdersPage}
          />
        )}
        
        {activeTab === 'attendance' && <StaffCookMealAttendanceTab />}
        
        {activeTab === 'inventory' && (
          <StaffCookLiveStockTab
            liveStock={liveStock}
            paginatedStock={paginatedStock}
            stockPage={stockPage}
            stockTotalPages={stockTotalPages}
            setStockPage={setStockPage}
          />
        )}
        
        {activeTab === 'purchase' && (
          <div className="space-y-6">
            <StaffCookRequestTab
              formData={formData}
              setFormData={setFormData}
              handleRequestStock={handleRequestStock}
              pendingRequests={pendingRequests}
              paginatedPendingRequests={paginatedPendingRequests}
              requestsPage={requestsPage}
              requestsTotalPages={requestsTotalPages}
              setRequestsPage={setRequestsPage}
            />
            <StaffCookIncomingTab
              incomingDeliveries={incomingDeliveries}
              paginatedIncomingDeliveries={paginatedIncomingDeliveries}
              expiryDates={expiryDates}
              setExpiryDates={setExpiryDates}
              handleVerifyReceipt={handleVerifyReceipt}
              incomingPage={incomingPage}
              incomingTotalPages={incomingTotalPages}
              setIncomingPage={setIncomingPage}
            />
          </div>
        )}
        
        {activeTab === 'meal_prep' && <StaffCookMealPrepTab />}
        {activeTab === 'special_req' && <StaffCookSpecialReqTab />}
        {activeTab === 'hygiene' && <StaffCookHygieneTab />}
        {activeTab === 'feedback' && <StaffCookFeedbackTab />}
        {activeTab === 'reporting' && <StaffCookReportsTab />}
        {activeTab === 'settings' && <StaffCookSettingsTab />}
      </div>
    </div>
  );
}
