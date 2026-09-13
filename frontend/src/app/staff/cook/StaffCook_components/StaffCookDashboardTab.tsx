import React from 'react';
import { AlertCircle, CheckCircle, Clock, CalendarDays, ChefHat, Bell, Star } from 'lucide-react';

export function StaffCookDashboardTab({ 
  todayMenu, 
  liveStock,
  orders 
}: { 
  todayMenu: any;
  liveStock: any[];
  orders: any[];
}) {
  const breakfastOrders = orders.filter(o => o.mealType === 'Breakfast');
  const lunchOrders = orders.filter(o => o.mealType === 'Lunch');
  const dinnerOrders = orders.filter(o => o.mealType === 'Dinner');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#FEF9E7] p-6 rounded-2xl border border-[#F1C40F]/30 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#D35400] flex items-center gap-2">
              <ChefHat className="w-8 h-8" />
              Good Morning, Chef! 👋
            </h2>
            <p className="text-[#E67E22] mt-1 flex items-center gap-2 font-medium">
              <CalendarDays className="w-4 h-4" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} | 🏢 Green Valley PG
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm text-[#F39C12] font-bold text-sm">
              <Star className="w-4 h-4 fill-current" /> Today's Rating: 4.5
            </div>
          </div>
        </div>
      </div>

      {/* Meal Summary */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📊</span> Today's Meal Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl mb-2">🍳</div>
            <div className="font-bold text-gray-800 text-lg">{breakfastOrders.length}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Breakfast</div>
          </div>
          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl mb-2">🍛</div>
            <div className="font-bold text-gray-800 text-lg">{lunchOrders.length}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Lunch</div>
          </div>
          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl mb-2">🍽️</div>
            <div className="font-bold text-gray-800 text-lg">{dinnerOrders.length}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Dinner</div>
          </div>
          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl mb-2">🍲</div>
            <div className="font-bold text-[#3498DB] text-lg">5</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Special</div>
          </div>
          <div className="bg-[#FEF9E7] p-4 rounded-xl border border-[#F1C40F]/30 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="font-bold text-[#F39C12] text-lg">92%</div>
            <div className="text-xs text-[#E67E22] font-medium uppercase tracking-wider">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Today's Menu */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">📝 Today's Menu</h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Breakfast</span>
              <p className="text-sm font-medium text-gray-700">{todayMenu?.breakfast || 'Poha + Tea'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Lunch</span>
              <p className="text-sm font-medium text-gray-700">{todayMenu?.lunch || 'Dal + Rice + Sabji'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Dinner</span>
              <p className="text-sm font-medium text-gray-700">{todayMenu?.dinner || 'Roti + Paneer'}</p>
            </div>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">📦 Inventory</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {liveStock.slice(0, 5).map((item, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{item.itemName}</span>
                <span className="font-bold">{item.currentQuantity} {item.unit}</span>
              </li>
            ))}
            {liveStock.length === 0 && (
              <>
                <li className="flex justify-between items-center"><span>Rice</span> <span className="font-bold">45 KG</span></li>
                <li className="flex justify-between items-center"><span>Dal</span> <span className="font-bold">30 KG</span></li>
                <li className="flex justify-between items-center text-[#E74C3C]"><span>Oil</span> <span className="font-bold flex items-center gap-1">15 L <AlertCircle className="w-3 h-3"/></span></li>
                <li className="flex justify-between items-center text-[#E74C3C]"><span>Sugar</span> <span className="font-bold flex items-center gap-1">8 KG <AlertCircle className="w-3 h-3"/></span></li>
              </>
            )}
          </ul>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-[#FFF5F5] rounded-2xl p-5 border border-[#FFE3E3] shadow-sm lg:col-span-2">
          <h3 className="font-bold text-[#E74C3C] mb-3 border-b border-[#FFE3E3] pb-2 flex items-center gap-2">
            <Bell className="w-4 h-4" /> Alerts & Notifications
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2 items-start text-gray-700">
              <AlertCircle className="w-5 h-5 text-[#E74C3C] shrink-0" />
              <span><strong className="text-gray-800">Oil stock below 10L</strong> - Needs reordering immediately.</span>
            </li>
            <li className="flex gap-2 items-start text-gray-700">
              <AlertCircle className="w-5 h-5 text-[#F39C12] shrink-0" />
              <span><strong className="text-gray-800">Sugar stock low 8KG</strong> - Plan to restock this week.</span>
            </li>
            <li className="flex gap-2 items-start text-gray-700">
              <CheckCircle className="w-5 h-5 text-[#3498DB] shrink-0" />
              <span><strong className="text-gray-800">3 students opted out</strong> of lunch today.</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Prep Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          📋 Today's Meal Preparation Checklist
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#27AE60] flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">Breakfast prepared (Poha + Tea)</p>
              <p className="text-xs text-gray-500">Ready by 7:30 AM</p>
            </div>
            <span className="px-3 py-1 bg-[#E8F5E9] text-[#27AE60] text-xs font-bold rounded-full">Done</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[#FEF9E7] rounded-lg border border-[#F1C40F]/30">
            <div className="w-8 h-8 rounded-full bg-[#FFF3E0] text-[#F39C12] flex items-center justify-center shrink-0 animate-pulse">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">Lunch in progress (Dal + Rice + Sabji)</p>
              <p className="text-xs text-gray-500">Target: 11:00 AM</p>
            </div>
            <span className="px-3 py-1 bg-[#FFF3E0] text-[#E67E22] text-xs font-bold rounded-full">In Progress</span>
          </div>
        </div>
      </div>

    </div>
  );
}
