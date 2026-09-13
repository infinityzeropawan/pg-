import React from 'react';
import { ShieldCheck, CheckSquare, Wrench, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

export function StaffCookHygieneTab() {
  return (
    <div className="space-y-6">
      
      {/* Hygiene Dashboard */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#27AE60]" /> Hygiene & Safety Dashboard
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#E8F5E9] p-4 rounded-xl border border-[#27AE60]/30 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-bold text-[#27AE60] text-lg">15/15</div>
            <div className="text-xs text-[#27AE60] font-medium uppercase tracking-wider">Tasks Done</div>
          </div>
          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl mb-2">⏳</div>
            <div className="font-bold text-gray-800 text-lg">0</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Pending</div>
          </div>
          <div className="bg-[#FEF9E7] p-4 rounded-xl border border-[#F1C40F]/30 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="font-bold text-[#F39C12] text-lg">4.8</div>
            <div className="text-xs text-[#E67E22] font-medium uppercase tracking-wider">Hygiene Rating</div>
          </div>
          <div className="bg-[#F0F8FF] p-4 rounded-xl border border-[#D4E6F1] text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold text-[#2980B9] text-lg">100%</div>
            <div className="text-xs text-[#2980B9] font-medium uppercase tracking-wider">Compliance</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Checklists */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
               <CheckSquare className="w-5 h-5 text-[#3498DB]" /> Daily Hygiene Checklist
             </h3>
             <ul className="space-y-3 text-sm text-gray-700 mb-4">
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]"/> Kitchen floor cleaned & mopped</li>
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]"/> Countertops sanitized</li>
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]"/> Utensils washed & sanitized</li>
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]"/> Refrigerator cleaned & organized</li>
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]"/> Garbage disposed properly</li>
             </ul>
             <button className="w-full bg-[#3498DB] text-white py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-600">
               Mark All Complete
             </button>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
               <ShieldCheck className="w-5 h-5 text-[#E67E22]" /> Food Safety Checklist
             </h3>
             <ul className="space-y-3 text-sm text-gray-700 mb-4">
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]"/> Food storage temperatures checked</li>
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]"/> Perishable items stored properly</li>
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]"/> Food expiration dates checked</li>
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#27AE60]"/> Cross contamination prevented</li>
             </ul>
             <button className="w-full bg-[#E67E22] text-white py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-orange-600">
               Mark All Complete
             </button>
          </div>
        </div>

        {/* Maintenance & Incidents */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <Wrench className="w-5 h-5 text-[#8E44AD]" /> Equipment Maintenance
               </h3>
            </div>
            <div className="p-0 flex-1 overflow-x-auto">
               <table className="w-full text-sm text-left">
                <thead className="bg-[#F8F9FA] text-gray-600 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 font-bold">Equipment</th>
                    <th className="px-4 py-3 font-bold">Next Due</th>
                    <th className="px-4 py-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   <tr className="hover:bg-gray-50">
                     <td className="px-4 py-3 font-medium text-gray-800">Oven (Cleaning)</td>
                     <td className="px-4 py-3 text-gray-600">15/09/24</td>
                     <td className="px-4 py-3 text-right"><button className="text-[#3498DB] hover:underline font-medium text-xs">View</button></td>
                   </tr>
                   <tr className="hover:bg-gray-50">
                     <td className="px-4 py-3 font-medium text-gray-800">Freezer (Defrost)</td>
                     <td className="px-4 py-3 text-gray-600">11/09/24</td>
                     <td className="px-4 py-3 text-right"><button className="text-[#3498DB] hover:underline font-medium text-xs">View</button></td>
                   </tr>
                </tbody>
               </table>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-[#FFF5F5] flex justify-between items-center">
               <h3 className="font-bold text-[#E74C3C] flex items-center gap-2">
                 <AlertTriangle className="w-5 h-5" /> Safety Incidents
               </h3>
               <button className="text-xs bg-white border border-gray-200 text-[#E74C3C] px-3 py-1.5 rounded-lg font-bold">
                 Report Incident
               </button>
            </div>
            <div className="p-0 flex-1 overflow-x-auto">
               <table className="w-full text-sm text-left">
                <thead className="bg-[#FFF5F5] text-gray-600 border-b border-[#FFE3E3]">
                  <tr>
                    <th className="px-4 py-3 font-bold">Incident</th>
                    <th className="px-4 py-3 font-bold">Severity</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   <tr className="hover:bg-gray-50">
                     <td className="px-4 py-3 font-medium text-gray-800">Oil Spill (05/09)</td>
                     <td className="px-4 py-3 font-bold text-[#F39C12]">🟡 Med</td>
                     <td className="px-4 py-3 text-[#27AE60] font-medium"><CheckCircle className="w-3 h-3 inline"/> Resolved</td>
                   </tr>
                   <tr className="hover:bg-gray-50">
                     <td className="px-4 py-3 font-medium text-gray-800">Knife Cut (03/09)</td>
                     <td className="px-4 py-3 font-bold text-[#27AE60]">🟢 Low</td>
                     <td className="px-4 py-3 text-[#27AE60] font-medium"><CheckCircle className="w-3 h-3 inline"/> Resolved</td>
                   </tr>
                </tbody>
               </table>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
             <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
               <FileText className="w-4 h-4 text-[#8E44AD]" /> Hygiene Reports
             </h3>
             <ul className="space-y-3 text-sm text-gray-600">
               <li className="flex justify-between border-b border-gray-50 pb-2"><span>Weekly Hygiene Report</span> <button className="text-[#3498DB] font-medium">Generate</button></li>
               <li className="flex justify-between border-b border-gray-50 pb-2"><span>Equipment Maintenance Report</span> <button className="text-[#3498DB] font-medium">Generate</button></li>
             </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
