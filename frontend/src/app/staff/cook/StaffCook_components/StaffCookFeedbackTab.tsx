import React from 'react';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, TrendingUp, AlertCircle, FileText } from 'lucide-react';

export function StaffCookFeedbackTab() {
  return (
    <div className="space-y-6">
      
      {/* Feedback Dashboard */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-[#F1C40F]" /> Mess Feedback Dashboard
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#FEF9E7] p-4 rounded-xl border border-[#F1C40F]/30 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="font-bold text-[#F39C12] text-lg">4.2/5.0</div>
            <div className="text-xs text-[#E67E22] font-medium uppercase tracking-wider">Avg Rating</div>
          </div>
          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="font-bold text-gray-800 text-lg">128</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Reviews</div>
          </div>
          <div className="bg-[#E8F5E9] p-4 rounded-xl border border-[#27AE60]/30 text-center">
            <div className="text-3xl mb-2">👍</div>
            <div className="font-bold text-[#27AE60] text-lg">85%</div>
            <div className="text-xs text-[#27AE60] font-medium uppercase tracking-wider">Positive</div>
          </div>
          <div className="bg-[#FFF5F5] p-4 rounded-xl border border-[#FFE3E3] text-center">
            <div className="text-3xl mb-2">👎</div>
            <div className="font-bold text-[#E74C3C] text-lg">15%</div>
            <div className="text-xs text-[#E74C3C] font-medium uppercase tracking-wider">Needs Impr.</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Reviews */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <MessageSquare className="w-5 h-5 text-[#3498DB]" /> Recent Reviews
             </h3>
             <select className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-bold text-gray-600 outline-none">
               <option>All Meals</option>
               <option>Breakfast</option>
               <option>Lunch</option>
               <option>Dinner</option>
             </select>
          </div>
          <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
             
             <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
               <div className="flex justify-between items-start mb-2">
                 <div>
                   <h4 className="font-bold text-gray-800">Lunch (Dal + Rice)</h4>
                   <span className="text-xs text-gray-500">Today, 2:30 PM • Student: Rahul S.</span>
                 </div>
                 <div className="flex gap-1 text-[#F1C40F]">
                   <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/>
                 </div>
               </div>
               <p className="text-sm text-gray-600">Dal was excellent today! Really enjoyed the meal.</p>
             </div>

             <div className="p-4 border border-[#FFE3E3] rounded-xl bg-[#FFF5F5] shadow-sm">
               <div className="flex justify-between items-start mb-2">
                 <div>
                   <h4 className="font-bold text-gray-800">Breakfast (Poha)</h4>
                   <span className="text-xs text-gray-500">Today, 9:30 PM • Student: Anonymous</span>
                 </div>
                 <div className="flex gap-1 text-[#F1C40F]">
                   <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 text-gray-300"/><Star className="w-4 h-4 text-gray-300"/><Star className="w-4 h-4 text-gray-300"/>
                 </div>
               </div>
               <p className="text-sm text-gray-600">Poha was a bit dry today. Needs more peanuts.</p>
               <div className="mt-3 flex gap-2">
                 <button className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-lg font-bold text-gray-600 hover:bg-gray-50">Reply</button>
               </div>
             </div>
             
             <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
               <div className="flex justify-between items-start mb-2">
                 <div>
                   <h4 className="font-bold text-gray-800">Dinner (Paneer)</h4>
                   <span className="text-xs text-gray-500">Yesterday, 9:00 PM • Student: Sneha R.</span>
                 </div>
                 <div className="flex gap-1 text-[#F1C40F]">
                   <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 text-gray-300"/>
                 </div>
               </div>
               <p className="text-sm text-gray-600">Good, but rotis could be softer.</p>
             </div>

          </div>
        </div>

        {/* Feedback Analytics */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-[#8E44AD]" /> Dish Popularity
               </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#27AE60] uppercase mb-2">🏆 Top Rated Dishes</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex justify-between items-center bg-[#E8F5E9] p-2 rounded border border-[#27AE60]/30"><span>1. Paneer Butter Masala</span> <span className="font-bold text-[#27AE60]">4.8 ⭐</span></li>
                  <li className="flex justify-between items-center bg-[#E8F5E9] p-2 rounded border border-[#27AE60]/30"><span>2. Dal Tadka</span> <span className="font-bold text-[#27AE60]">4.6 ⭐</span></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#E74C3C] uppercase mb-2">📉 Needs Improvement</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex justify-between items-center bg-[#FFF5F5] p-2 rounded border border-[#FFE3E3]"><span>1. Upma</span> <span className="font-bold text-[#E74C3C]">2.5 ⭐</span></li>
                  <li className="flex justify-between items-center bg-[#FFF5F5] p-2 rounded border border-[#FFE3E3]"><span>2. Khichdi</span> <span className="font-bold text-[#E74C3C]">3.1 ⭐</span></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-[#FFF5F5] flex justify-between items-center">
               <h3 className="font-bold text-[#E74C3C] flex items-center gap-2">
                 <AlertCircle className="w-5 h-5" /> Common Complaints
               </h3>
            </div>
            <div className="p-4 space-y-2">
               <div className="flex items-start gap-2 p-3 bg-white border border-gray-100 rounded-lg">
                 <span className="text-xl">🧂</span>
                 <div>
                   <h4 className="font-bold text-gray-800 text-sm">"Too salty"</h4>
                   <p className="text-xs text-gray-500">Reported 5 times this week (mostly for dinner)</p>
                 </div>
               </div>
               <div className="flex items-start gap-2 p-3 bg-white border border-gray-100 rounded-lg">
                 <span className="text-xl">🌶️</span>
                 <div>
                   <h4 className="font-bold text-gray-800 text-sm">"Too spicy"</h4>
                   <p className="text-xs text-gray-500">Reported 3 times this week (lunch)</p>
                 </div>
               </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
