import React from 'react';
import { ChefHat, CheckCircle, Clock, Utensils, Wrench, RefreshCw, Eye } from 'lucide-react';

export function StaffCookMealPrepTab() {
  return (
    <div className="space-y-6">
      
      {/* Today's Preparation Schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-[#E67E22]" /> Today's Preparation Schedule
        </h2>
        
        <div className="space-y-4">
          
          {/* Breakfast */}
          <div className="border border-gray-200 rounded-xl p-4 bg-[#F8F9FA]">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">🍳 Breakfast</h3>
                <span className="text-xs text-gray-500">8:00 - 9:30 AM</span>
              </div>
              <span className="bg-[#E8F5E9] text-[#27AE60] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Ready</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-[#27AE60]" /> Prep Time: 30 mins (6:30 - 7:00 AM)</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-[#27AE60]" /> Items: Poha with Peas, Masala Chai, Fruits</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-[#27AE60]" /> Quantity: 80 servings</li>
            </ul>
          </div>
          
          {/* Lunch */}
          <div className="border border-[#F1C40F]/30 rounded-xl p-4 bg-[#FEF9E7]">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">🍛 Lunch</h3>
                <span className="text-xs text-gray-500">12:00 - 2:00 PM</span>
              </div>
              <span className="bg-[#FFF3E0] text-[#E67E22] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin"/> In Progress (60%)</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li className="flex gap-2 items-center"><RefreshCw className="w-4 h-4 text-[#E67E22]" /> Prep Time: 90 mins (10:00 - 11:30 AM)</li>
              <li className="flex gap-2 items-center"><RefreshCw className="w-4 h-4 text-[#E67E22]" /> Items: Dal Tadka, Jeera Rice, Mix Veg Sabji</li>
              <li className="flex gap-2 items-center"><RefreshCw className="w-4 h-4 text-[#E67E22]" /> Quantity: 85 servings</li>
            </ul>
            
            <div className="bg-white p-3 rounded-lg border border-[#F1C40F]/30 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-[#27AE60] font-medium"><CheckCircle className="w-4 h-4"/> Dal prepared</div>
              <div className="flex items-center gap-2 text-[#27AE60] font-medium"><CheckCircle className="w-4 h-4"/> Rice cooking</div>
              <div className="flex items-center gap-2 text-[#E67E22] font-medium"><RefreshCw className="w-4 h-4"/> Sabji in progress</div>
              <div className="flex items-center gap-2 text-[#F39C12] font-medium"><Clock className="w-4 h-4"/> Roti dough ready</div>
            </div>
          </div>
          
          {/* Dinner */}
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">🍽️ Dinner</h3>
                <span className="text-xs text-gray-500">8:00 - 10:00 PM</span>
              </div>
              <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3"/> Not Started</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex gap-2 items-center"><Clock className="w-4 h-4" /> Prep Time: 75 mins (6:30 - 7:45 PM)</li>
              <li className="flex gap-2 items-center"><Clock className="w-4 h-4" /> Items: Paneer Butter Masala, Butter Naan, Salad</li>
              <li className="flex gap-2 items-center"><Clock className="w-4 h-4" /> Quantity: 85 servings</li>
            </ul>
          </div>
          
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Special Meal Requests */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <Utensils className="w-5 h-5 text-[#8E44AD]" /> Special Meal Requests
             </h3>
             <button className="text-xs bg-[#8E44AD] text-white px-3 py-1.5 rounded-lg font-bold shadow-sm">
               Prepare All
             </button>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="bg-[#F8F9FA] text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Student</th>
                  <th className="px-4 py-3 font-bold">Meal</th>
                  <th className="px-4 py-3 font-bold">Request</th>
                  <th className="px-4 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 <tr className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-medium text-gray-800">Priya Patel</td>
                   <td className="px-4 py-3 text-gray-600">Lunch</td>
                   <td className="px-4 py-3 font-bold text-[#E67E22]">Jain - No Onion/Garlic</td>
                   <td className="px-4 py-3 text-right">
                     <button className="text-[#8E44AD] hover:underline font-medium text-xs">Prepare</button>
                   </td>
                 </tr>
                 <tr className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-medium text-gray-800">Amit Kumar</td>
                   <td className="px-4 py-3 text-gray-600">Dinner</td>
                   <td className="px-4 py-3 font-bold text-[#F39C12]">Gluten-Free</td>
                   <td className="px-4 py-3 text-right">
                     <button className="text-[#8E44AD] hover:underline font-medium text-xs">Prepare</button>
                   </td>
                 </tr>
              </tbody>
             </table>
          </div>
        </div>

        {/* Kitchen Equipment */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <Wrench className="w-5 h-5 text-[#3498DB]" /> Kitchen Equipment
             </h3>
             <button className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-bold">
               Report Issue
             </button>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="bg-[#F8F9FA] text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Equipment</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Cleaning</th>
                  <th className="px-4 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 <tr className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-medium text-gray-800">Oven</td>
                   <td className="px-4 py-3 text-[#27AE60] font-bold">🟢 OK</td>
                   <td className="px-4 py-3 text-[#27AE60] font-medium"><CheckCircle className="w-3 h-3 inline"/> Done</td>
                   <td className="px-4 py-3 text-right"><button className="text-[#3498DB] hover:underline font-medium text-xs"><Eye className="w-4 h-4"/></button></td>
                 </tr>
                 <tr className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-medium text-gray-800">Mixer</td>
                   <td className="px-4 py-3 text-[#F39C12] font-bold">⚠️ Issue</td>
                   <td className="px-4 py-3 text-[#27AE60] font-medium"><CheckCircle className="w-3 h-3 inline"/> Done</td>
                   <td className="px-4 py-3 text-right"><button className="text-[#3498DB] hover:underline font-medium text-xs"><Eye className="w-4 h-4"/></button></td>
                 </tr>
                 <tr className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-medium text-gray-800">Grinder</td>
                   <td className="px-4 py-3 text-[#27AE60] font-bold">🟢 OK</td>
                   <td className="px-4 py-3 text-[#E67E22] font-medium"><Clock className="w-3 h-3 inline"/> Due</td>
                   <td className="px-4 py-3 text-right"><button className="text-[#3498DB] hover:underline font-medium text-xs"><Eye className="w-4 h-4"/></button></td>
                 </tr>
              </tbody>
             </table>
          </div>
        </div>

      </div>
    </div>
  );
}
