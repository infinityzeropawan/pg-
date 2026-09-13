import React from 'react';
import { Calendar, CheckCircle, Edit, Utensils, Plus, Copy, Send } from 'lucide-react';
import type { MealType, MealStatusType } from '@/app/staff/staff_lib/staff_api/StaffMeals';

export function StaffCookLiveMealsTab({
  todayMenu,
  mealStatuses,
  handleMarkMealReady,
  orders,
  paginatedOrders,
  handleMarkServed,
  ordersPage,
  ordersTotalPages,
  setOrdersPage
}: {
  todayMenu: any;
  mealStatuses: Record<MealType, MealStatusType>;
  handleMarkMealReady: (meal: MealType) => void;
  orders: any[];
  paginatedOrders: any[];
  handleMarkServed: (id: string) => void;
  ordersPage: number;
  ordersTotalPages: number;
  setOrdersPage: (page: number) => void;
}) {
  return (
    <div className="space-y-6">
      
      {/* Today's Menu */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#F8F9FA]">
          <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#F39C12]" /> Today's Menu
          </h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:text-[#D35400]">
              <Edit className="w-4 h-4" /> Edit Menu
            </button>
            <button className="flex items-center gap-1 text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:text-[#D35400]">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Breakfast */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#FEF9E7] p-3 border-b border-[#F1C40F]/30 flex justify-between items-center">
              <h3 className="font-bold text-[#D35400] flex items-center gap-2">🍳 Breakfast</h3>
              <span className="text-xs font-bold text-gray-500">8:00 - 9:30 AM</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-sm">
                <span className="block text-gray-500 font-medium mb-1">Item</span>
                <span className="font-bold text-gray-800">{todayMenu?.breakfast || 'Poha with Peas'}</span>
              </div>
              <div className="text-sm">
                <span className="block text-gray-500 font-medium mb-1">Accompaniments</span>
                <span className="text-gray-700">Masala Chai, Fresh Fruits</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>Calories: 350</span>
                <span>Prep Time: 30 mins</span>
              </div>
              {mealStatuses['Breakfast'] === 'pending' ? (
                 <button onClick={() => handleMarkMealReady('Breakfast')} className="w-full mt-2 bg-[#F39C12] text-white py-2 rounded-lg text-sm font-bold shadow-sm">
                   Mark Ready
                 </button>
              ) : (
                <div className="mt-2 bg-[#E8F5E9] text-[#27AE60] text-center py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Ready
                </div>
              )}
            </div>
          </div>

          {/* Lunch */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#FFF5F5] p-3 border-b border-[#FFE3E3] flex justify-between items-center">
              <h3 className="font-bold text-[#E74C3C] flex items-center gap-2">🍛 Lunch</h3>
              <span className="text-xs font-bold text-gray-500">12:00 - 2:00 PM</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-sm">
                <span className="block text-gray-500 font-medium mb-1">Main</span>
                <span className="font-bold text-gray-800">{todayMenu?.lunch || 'Dal Tadka, Jeera Rice, Mix Veg'}</span>
              </div>
              <div className="text-sm">
                <span className="block text-gray-500 font-medium mb-1">Accompaniments</span>
                <span className="text-gray-700">Roti, Salad</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>Calories: 550</span>
                <span>Prep Time: 90 mins</span>
              </div>
              {mealStatuses['Lunch'] === 'pending' ? (
                 <button onClick={() => handleMarkMealReady('Lunch')} className="w-full mt-2 bg-[#E74C3C] text-white py-2 rounded-lg text-sm font-bold shadow-sm">
                   Mark Ready
                 </button>
              ) : (
                <div className="mt-2 bg-[#E8F5E9] text-[#27AE60] text-center py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Ready
                </div>
              )}
            </div>
          </div>

          {/* Dinner */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#F0F8FF] p-3 border-b border-[#D4E6F1] flex justify-between items-center">
              <h3 className="font-bold text-[#2980B9] flex items-center gap-2">🍽️ Dinner</h3>
              <span className="text-xs font-bold text-gray-500">8:00 - 10:00 PM</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-sm">
                <span className="block text-gray-500 font-medium mb-1">Main</span>
                <span className="font-bold text-gray-800">{todayMenu?.dinner || 'Paneer Butter Masala, Butter Naan'}</span>
              </div>
              <div className="text-sm">
                <span className="block text-gray-500 font-medium mb-1">Accompaniments</span>
                <span className="text-gray-700">Green Salad, Gulab Jamun</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>Calories: 600</span>
                <span>Prep Time: 75 mins</span>
              </div>
              {mealStatuses['Dinner'] === 'pending' ? (
                 <button onClick={() => handleMarkMealReady('Dinner')} className="w-full mt-2 bg-[#3498DB] text-white py-2 rounded-lg text-sm font-bold shadow-sm">
                   Mark Ready
                 </button>
              ) : (
                <div className="mt-2 bg-[#E8F5E9] text-[#27AE60] text-center py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Ready
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Menu Preview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
         <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#F8F9FA]">
          <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            📆 Weekly Menu Preview
          </h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:text-[#D35400]">
              <Copy className="w-4 h-4" /> Copy Week
            </button>
            <button className="flex items-center gap-1 text-sm bg-[#F39C12] text-white px-3 py-1.5 rounded-lg font-bold shadow-sm">
              <Send className="w-4 h-4" /> Submit for Approval
            </button>
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F8F9FA] text-gray-600">
              <tr>
                <th className="px-4 py-3 rounded-l-lg font-bold">Day</th>
                <th className="px-4 py-3 font-bold">Breakfast</th>
                <th className="px-4 py-3 font-bold">Lunch</th>
                <th className="px-4 py-3 font-bold">Dinner</th>
                <th className="px-4 py-3 rounded-r-lg font-bold">Snacks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                 <tr key={day} className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-bold text-gray-800">{day}</td>
                   <td className="px-4 py-3 text-gray-600">Poha + Tea</td>
                   <td className="px-4 py-3 text-gray-600">Dal + Rice</td>
                   <td className="px-4 py-3 text-gray-600">Roti + Paneer</td>
                   <td className="px-4 py-3 text-gray-600">Samosa</td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Menu Analytics */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          📊 Menu Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-200">
             <h4 className="font-bold text-[#27AE60] mb-3">Most Popular Items</h4>
             <ul className="space-y-2 text-sm">
               <li className="flex justify-between"><span>Dal + Rice</span> <strong>95% attendance</strong></li>
               <li className="flex justify-between"><span>Paneer Butter Masala</span> <strong>92% attendance</strong></li>
               <li className="flex justify-between"><span>Biryani</span> <strong>88% attendance</strong></li>
             </ul>
           </div>
           <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-200">
             <h4 className="font-bold text-[#E74C3C] mb-3">Least Popular Items</h4>
             <ul className="space-y-2 text-sm">
               <li className="flex justify-between"><span>Upma</span> <strong>65% attendance</strong></li>
               <li className="flex justify-between"><span>Khichdi</span> <strong>70% attendance</strong></li>
             </ul>
             <div className="mt-4 p-2 bg-[#FFF3E0] text-[#D35400] text-xs font-bold rounded-lg flex items-start gap-2">
                <span>💡</span> Suggestion: Replace Upma with something more popular
             </div>
           </div>
        </div>
      </div>

    </div>
  );
}
