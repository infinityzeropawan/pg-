import React from 'react';
import { Sparkles, CheckCircle, Clock, FileText, Download } from 'lucide-react';

export function StaffCookSpecialReqTab() {
  return (
    <div className="space-y-6">
      
      {/* Request Dashboard */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#8E44AD]" /> Special Requests Dashboard
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="font-bold text-gray-800 text-lg">25</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Req.</div>
          </div>
          <div className="bg-[#E8F5E9] p-4 rounded-xl border border-[#27AE60]/30 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-bold text-[#27AE60] text-lg">18</div>
            <div className="text-xs text-[#27AE60] font-medium uppercase tracking-wider">Completed</div>
          </div>
          <div className="bg-[#FEF9E7] p-4 rounded-xl border border-[#F1C40F]/30 text-center">
            <div className="text-3xl mb-2">⏳</div>
            <div className="font-bold text-[#F39C12] text-lg">7</div>
            <div className="text-xs text-[#E67E22] font-medium uppercase tracking-wider">Pending</div>
          </div>
          <div className="bg-[#F0F8FF] p-4 rounded-xl border border-[#D4E6F1] text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="font-bold text-[#2980B9] text-lg">4.5</div>
            <div className="text-xs text-[#2980B9] font-medium uppercase tracking-wider">Avg Rating</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Special Dietary Requests */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <FileText className="w-5 h-5 text-[#E67E22]" /> Special Dietary Requests
             </h3>
             <button className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-gray-50">
               <Download className="w-3 h-3"/> Report
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
                   <td className="px-4 py-3 text-gray-600">Jain Food</td>
                   <td className="px-4 py-3 font-bold text-[#E67E22]">No Onion/Garlic</td>
                   <td className="px-4 py-3 text-right">
                     <button className="bg-[#27AE60] text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 inline-flex hover:bg-green-600">
                       <CheckCircle className="w-3 h-3"/> Done
                     </button>
                   </td>
                 </tr>
                 <tr className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-medium text-gray-800">Amit Kumar</td>
                   <td className="px-4 py-3 text-gray-600">Gluten-Free</td>
                   <td className="px-4 py-3 font-bold text-[#F39C12]">Gluten-Free</td>
                   <td className="px-4 py-3 text-right">
                     <button className="bg-[#27AE60] text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 inline-flex hover:bg-green-600">
                       <CheckCircle className="w-3 h-3"/> Done
                     </button>
                   </td>
                 </tr>
                 <tr className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-medium text-gray-800">Sneha Reddy</td>
                   <td className="px-4 py-3 text-gray-600">Low Carb Diet</td>
                   <td className="px-4 py-3 font-bold text-[#3498DB]">Low Carb</td>
                   <td className="px-4 py-3 text-right">
                     <button className="bg-[#27AE60] text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 inline-flex hover:bg-green-600">
                       <CheckCircle className="w-3 h-3"/> Done
                     </button>
                   </td>
                 </tr>
              </tbody>
             </table>
          </div>
        </div>

        {/* Record Special Request & History */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
               📝 Record Special Request
             </h3>
             <form className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Student</label>
                   <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#3498DB]">
                     <option>Select Student...</option>
                     <option>Priya Patel</option>
                     <option>Amit Kumar</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Request Type</label>
                   <div className="flex gap-4">
                     <label className="flex items-center gap-1 text-sm"><input type="checkbox" /> Dietary</label>
                     <label className="flex items-center gap-1 text-sm"><input type="checkbox" /> Allergy</label>
                     <label className="flex items-center gap-1 text-sm"><input type="checkbox" /> Timing</label>
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                   <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#3498DB]" rows={2}></textarea>
                </div>
                <div className="flex gap-2">
                   <button type="button" className="flex-1 bg-[#3498DB] text-white py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-600">Save Request</button>
                   <button type="button" className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold hover:bg-gray-50">Cancel</button>
                </div>
             </form>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
               <Clock className="w-4 h-4 text-[#8E44AD]" /> Request History
             </h3>
             <ul className="space-y-3 text-sm text-gray-600">
               <li className="flex justify-between border-b border-gray-50 pb-2">
                 <span>Priya Patel - Jain Food (05/09)</span> 
                 <span className="text-[#27AE60] font-bold"><CheckCircle className="w-4 h-4 inline"/> Completed</span>
               </li>
               <li className="flex justify-between border-b border-gray-50 pb-2">
                 <span>Amit Kumar - Gluten-Free (04/09)</span> 
                 <span className="text-[#27AE60] font-bold"><CheckCircle className="w-4 h-4 inline"/> Completed</span>
               </li>
             </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
