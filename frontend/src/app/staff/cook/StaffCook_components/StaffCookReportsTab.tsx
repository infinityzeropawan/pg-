import React from 'react';
import { FileBarChart, Download, Calendar, PieChart, TrendingUp, Archive, FileText } from 'lucide-react';

export function StaffCookReportsTab() {
  return (
    <div className="space-y-6">
      
      {/* Reports Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-[#3498DB]" /> Reports & Analytics
          </h2>
          <div className="flex gap-2">
             <input type="month" className="border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-[#3498DB]" defaultValue="2024-09"/>
             <button className="bg-[#3498DB] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-600 flex items-center gap-2">
               <Download className="w-4 h-4"/> Export All
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Consumption Report */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
           <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
             <Archive className="w-5 h-5 text-[#F39C12]" /> Inventory Consumption
           </h3>
           <div className="flex justify-center py-6">
             {/* Mock chart placeholder */}
             <div className="relative w-40 h-40 rounded-full border-8 border-gray-100 flex items-center justify-center">
               <div className="absolute top-0 right-0 w-1/2 h-1/2 border-t-8 border-r-8 border-[#F39C12] rounded-tr-full"></div>
               <div className="absolute bottom-0 right-0 w-1/2 h-1/2 border-b-8 border-r-8 border-[#27AE60] rounded-br-full"></div>
               <div className="absolute bottom-0 left-0 w-1/2 h-1/2 border-b-8 border-l-8 border-[#3498DB] rounded-bl-full"></div>
               <span className="font-bold text-gray-800">450 KG</span>
             </div>
           </div>
           <div className="space-y-2 mt-4">
             <div className="flex justify-between items-center text-sm">
               <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#F39C12]"></span> Grains</span>
               <span className="font-bold">200 KG (44%)</span>
             </div>
             <div className="flex justify-between items-center text-sm">
               <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#27AE60]"></span> Vegetables</span>
               <span className="font-bold">150 KG (33%)</span>
             </div>
             <div className="flex justify-between items-center text-sm">
               <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#3498DB]"></span> Dairy/Spices</span>
               <span className="font-bold">100 KG (23%)</span>
             </div>
           </div>
           <button className="w-full mt-6 text-sm font-bold text-[#3498DB] py-2 border border-[#3498DB] rounded-lg hover:bg-blue-50 flex justify-center items-center gap-2">
             <Download className="w-4 h-4"/> Download Consumption Report
           </button>
        </div>

        {/* Meal Attendance Trends */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
           <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
             <TrendingUp className="w-5 h-5 text-[#8E44AD]" /> Attendance Trends
           </h3>
           <div className="h-48 flex items-end gap-2 justify-between py-4 border-b border-gray-100">
             {/* Mock Bar Chart */}
             {[85, 90, 88, 82, 95, 75, 80].map((h, i) => (
                <div key={i} className="w-full flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-[#8E44AD] rounded-t-md opacity-80 hover:opacity-100 transition-all cursor-pointer relative group" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">{h}%</div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{'MTWTFSS'[i]}</span>
                </div>
             ))}
           </div>
           <div className="grid grid-cols-2 gap-4 mt-4 text-center">
             <div className="bg-[#F8F9FA] p-3 rounded-lg border border-gray-100">
               <div className="text-xs text-gray-500 font-bold uppercase">Avg. Attendance</div>
               <div className="font-bold text-lg text-gray-800">85%</div>
             </div>
             <div className="bg-[#F8F9FA] p-3 rounded-lg border border-gray-100">
               <div className="text-xs text-gray-500 font-bold uppercase">Peak Day</div>
               <div className="font-bold text-lg text-gray-800">Friday (95%)</div>
             </div>
           </div>
           <button className="w-full mt-4 text-sm font-bold text-[#3498DB] py-2 border border-[#3498DB] rounded-lg hover:bg-blue-50 flex justify-center items-center gap-2">
             <Download className="w-4 h-4"/> Download Attendance Report
           </button>
        </div>

        {/* Expenses & Purchasing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:col-span-2">
           <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
             <PieChart className="w-5 h-5 text-[#E74C3C]" /> Purchasing & Expenses
           </h3>
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="bg-[#F8F9FA] text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-bold rounded-l-lg">Report Type</th>
                  <th className="px-4 py-3 font-bold">Generated</th>
                  <th className="px-4 py-3 font-bold">Size</th>
                  <th className="px-4 py-3 font-bold text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 <tr className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2"><FileText className="w-4 h-4 text-[#E74C3C]"/> Monthly Grocery Expense</td>
                   <td className="px-4 py-3 text-gray-600">01/09/2024</td>
                   <td className="px-4 py-3 text-gray-600">2.4 MB</td>
                   <td className="px-4 py-3 text-right">
                     <button className="text-[#3498DB] hover:underline font-bold text-xs flex items-center gap-1 justify-end w-full"><Download className="w-3 h-3"/> PDF</button>
                   </td>
                 </tr>
                 <tr className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2"><FileText className="w-4 h-4 text-[#27AE60]"/> Vendor Payment Summary</td>
                   <td className="px-4 py-3 text-gray-600">31/08/2024</td>
                   <td className="px-4 py-3 text-gray-600">1.1 MB</td>
                   <td className="px-4 py-3 text-right">
                     <button className="text-[#3498DB] hover:underline font-bold text-xs flex items-center gap-1 justify-end w-full"><Download className="w-3 h-3"/> Excel</button>
                   </td>
                 </tr>
              </tbody>
             </table>
           </div>
        </div>

      </div>

    </div>
  );
}
