import React from 'react';
import { ShoppingCart, Send, Save, FileText, CheckCircle, Clock } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';

export function StaffCookRequestTab({
  formData,
  setFormData,
  handleRequestStock,
  pendingRequests,
  paginatedPendingRequests,
  requestsPage,
  requestsTotalPages,
  setRequestsPage
}: {
  formData: any;
  setFormData: (data: any) => void;
  handleRequestStock: (e: React.FormEvent) => void;
  pendingRequests: any[];
  paginatedPendingRequests: any[];
  requestsPage: number;
  requestsTotalPages: number;
  setRequestsPage: (page: number) => void;
}) {
  return (
    <div className="space-y-6">
      
      {/* Purchase Dashboard */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[#3498DB]" /> Purchase Dashboard
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="font-bold text-gray-800 text-lg">{pendingRequests.length + 5}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Req.</div>
          </div>
          <div className="bg-[#E8F5E9] p-4 rounded-xl border border-[#27AE60]/30 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-bold text-[#27AE60] text-lg">3</div>
            <div className="text-xs text-[#27AE60] font-medium uppercase tracking-wider">Approved</div>
          </div>
          <div className="bg-[#FEF9E7] p-4 rounded-xl border border-[#F1C40F]/30 text-center">
            <div className="text-3xl mb-2">⏳</div>
            <div className="font-bold text-[#F39C12] text-lg">{pendingRequests.length}</div>
            <div className="text-xs text-[#E67E22] font-medium uppercase tracking-wider">Pending</div>
          </div>
          <div className="bg-[#F0F8FF] p-4 rounded-xl border border-[#D4E6F1] text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="font-bold text-[#2980B9] text-lg">₹15,000</div>
            <div className="text-xs text-[#2980B9] font-medium uppercase tracking-wider">This Month</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Create Request Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <FileText className="w-5 h-5 text-[#8E44AD]" /> Create Purchase Request
             </h3>
          </div>
          <form onSubmit={handleRequestStock} className="p-6 space-y-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Item Name</label>
               <input type="text" value={formData.itemName} onChange={(e) => setFormData({...formData, itemName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#3498DB] motion-safe:transition-colors" placeholder="e.g. Rice, Oil" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                 <input type="number" value={formData.quantityRequested} onChange={(e) => setFormData({...formData, quantityRequested: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#3498DB]" placeholder="0" required />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit</label>
                 <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#3498DB]">
                   <option value="kg">KG</option>
                   <option value="l">Liters</option>
                   <option value="pieces">Pieces</option>
                 </select>
              </div>
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
               <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#3498DB]">
                 <option>🟢 Low</option>
                 <option>🟡 Normal</option>
                 <option>🔴 High</option>
               </select>
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reason</label>
               <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-[#3498DB]" placeholder="⚠️ Stock Low" />
            </div>
            <div className="pt-4 flex gap-3">
               <button type="submit" className="flex-1 bg-[#3498DB] text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-blue-600">
                 <Send className="w-4 h-4"/> Submit Request
               </button>
               <button type="button" className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50">
                 <Save className="w-4 h-4"/> Save Draft
               </button>
            </div>
          </form>
        </div>

        {/* Pending Requests List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <Clock className="w-5 h-5 text-[#F39C12]" /> Pending Requests
             </h3>
             <button className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-bold text-[#F39C12] hover:bg-orange-50 flex items-center gap-1">
               <Send className="w-3 h-3"/> Submit All
             </button>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="bg-[#F8F9FA] text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Item</th>
                  <th className="px-4 py-3 font-bold">Qty</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedPendingRequests.map(req => (
                   <tr key={req.id} className="hover:bg-gray-50">
                     <td className="px-4 py-3 font-medium text-gray-800">{req.itemName}</td>
                     <td className="px-4 py-3 text-gray-600">{req.quantityRequested} {req.unit}</td>
                     <td className="px-4 py-3"><span className="text-[#F39C12] font-bold text-xs bg-[#FEF9E7] px-2 py-1 rounded-full flex items-center gap-1 w-fit"><Clock className="w-3 h-3"/> Pending</span></td>
                     <td className="px-4 py-3 text-right">
                       <button className="text-[#3498DB] hover:underline font-medium">View</button>
                     </td>
                   </tr>
                ))}
                {pendingRequests.length === 0 && (
                   <tr className="hover:bg-gray-50">
                     <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No pending requests</td>
                   </tr>
                )}
              </tbody>
             </table>
          </div>
          {requestsTotalPages > 1 && (
            <div className="p-4 border-t border-gray-100">
              <Pagination currentPage={requestsPage} totalPages={requestsTotalPages} onPageChange={setRequestsPage} />
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
