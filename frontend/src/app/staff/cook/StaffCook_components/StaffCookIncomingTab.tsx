import React from 'react';
import { Truck, CheckCircle, Store } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';

export function StaffCookIncomingTab({
  incomingDeliveries,
  paginatedIncomingDeliveries,
  expiryDates,
  setExpiryDates,
  handleVerifyReceipt,
  incomingPage,
  incomingTotalPages,
  setIncomingPage
}: {
  incomingDeliveries: any[];
  paginatedIncomingDeliveries: any[];
  expiryDates: { [key: string]: string };
  setExpiryDates: (dates: any) => void;
  handleVerifyReceipt: (id: string, qty: number, unit: string) => void;
  incomingPage: number;
  incomingTotalPages: number;
  setIncomingPage: (page: number) => void;
}) {
  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Incoming Deliveries */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <Truck className="w-5 h-5 text-[#8E44AD]" /> Incoming Deliveries
             </h3>
             <span className="bg-[#8E44AD] text-white text-xs px-2 py-1 rounded-full font-bold">{incomingDeliveries.length} Pending</span>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="bg-[#F8F9FA] text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Item</th>
                  <th className="px-4 py-3 font-bold">Qty</th>
                  <th className="px-4 py-3 font-bold">Expiry Date</th>
                  <th className="px-4 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedIncomingDeliveries.map(req => (
                   <tr key={req.id} className="hover:bg-gray-50">
                     <td className="px-4 py-3 font-medium text-gray-800">{req.itemName}</td>
                     <td className="px-4 py-3 text-gray-600">{req.quantityRequested} {req.unit}</td>
                     <td className="px-4 py-3">
                       <input 
                         type="date" 
                         value={expiryDates[req.id] || ''}
                         onChange={(e) => setExpiryDates({...expiryDates, [req.id]: e.target.value})}
                         className="border border-gray-200 rounded p-1 text-xs outline-none focus:border-[#3498DB]" 
                       />
                     </td>
                     <td className="px-4 py-3 text-right">
                       <button onClick={() => handleVerifyReceipt(req.id, req.quantityRequested, req.unit)} className="bg-[#27AE60] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 flex items-center gap-1 inline-flex">
                         <CheckCircle className="w-3 h-3"/> Receive
                       </button>
                     </td>
                   </tr>
                ))}
                {incomingDeliveries.length === 0 && (
                   <tr className="hover:bg-gray-50">
                     <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No incoming deliveries at the moment</td>
                   </tr>
                )}
              </tbody>
             </table>
          </div>
          {incomingTotalPages > 1 && (
            <div className="p-4 border-t border-gray-100">
              <Pagination currentPage={incomingPage} totalPages={incomingTotalPages} onPageChange={setIncomingPage} />
            </div>
          )}
        </div>

        {/* Vendor Management */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
             <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <Store className="w-5 h-5 text-[#3498DB]" /> Vendor Management
             </h3>
             <button className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-bold text-[#3498DB] hover:bg-blue-50">
               + Add Vendor
             </button>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="bg-[#F8F9FA] text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Vendor</th>
                  <th className="px-4 py-3 font-bold">Category</th>
                  <th className="px-4 py-3 font-bold">Rating</th>
                  <th className="px-4 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 <tr className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-medium text-gray-800">Ram General</td>
                   <td className="px-4 py-3 text-gray-600">Grains</td>
                   <td className="px-4 py-3 font-bold text-[#F39C12]">4.5 ⭐</td>
                   <td className="px-4 py-3 text-right">
                     <button className="text-[#3498DB] hover:underline font-medium text-xs mr-3">View</button>
                     <button className="bg-[#3498DB] text-white px-2 py-1 rounded-md text-xs font-bold hover:bg-blue-600">Order</button>
                   </td>
                 </tr>
                 <tr className="hover:bg-gray-50">
                   <td className="px-4 py-3 font-medium text-gray-800">Sharma Store</td>
                   <td className="px-4 py-3 text-gray-600">Veg</td>
                   <td className="px-4 py-3 font-bold text-[#F39C12]">4.8 ⭐</td>
                   <td className="px-4 py-3 text-right">
                     <button className="text-[#3498DB] hover:underline font-medium text-xs mr-3">View</button>
                     <button className="bg-[#3498DB] text-white px-2 py-1 rounded-md text-xs font-bold hover:bg-blue-600">Order</button>
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
