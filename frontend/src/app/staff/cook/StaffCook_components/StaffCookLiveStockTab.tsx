import React from 'react';
import { Archive, Plus, AlertCircle, TrendingUp, CheckCircle, Package } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';

export function StaffCookLiveStockTab({
  liveStock,
  paginatedStock,
  stockPage,
  stockTotalPages,
  setStockPage
}: {
  liveStock: any[];
  paginatedStock: any[];
  stockPage: number;
  stockTotalPages: number;
  setStockPage: (page: number) => void;
}) {
  const lowStockCount = liveStock.filter(s => parseFloat(s.currentQuantity) < 10).length; // mock threshold

  return (
    <div className="space-y-6">
      
      {/* Inventory Dashboard Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
          <Archive className="w-5 h-5 text-[#8E44AD]" /> Inventory Dashboard
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#F8F9FA] p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-3xl mb-2">📦</div>
            <div className="font-bold text-gray-800 text-lg">{liveStock.length || 15}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Items</div>
          </div>
          <div className="bg-[#E8F5E9] p-4 rounded-xl border border-[#27AE60]/30 text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-bold text-[#27AE60] text-lg">{(liveStock.length || 15) - lowStockCount - 2}</div>
            <div className="text-xs text-[#27AE60] font-medium uppercase tracking-wider">In Stock</div>
          </div>
          <div className="bg-[#FEF9E7] p-4 rounded-xl border border-[#F1C40F]/30 text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="font-bold text-[#F39C12] text-lg">{lowStockCount || 3}</div>
            <div className="text-xs text-[#E67E22] font-medium uppercase tracking-wider">Low Stock</div>
          </div>
          <div className="bg-[#FFF5F5] p-4 rounded-xl border border-[#FFE3E3] text-center">
            <div className="text-3xl mb-2">🔴</div>
            <div className="font-bold text-[#E74C3C] text-lg">2</div>
            <div className="text-xs text-[#E74C3C] font-medium uppercase tracking-wider">Out of Stock</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Categories / Live Stock Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#F8F9FA] flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#3498DB]" /> Grains & Cereals
            </h3>
            <button className="text-sm font-bold bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:text-[#3498DB]">
              <Plus className="w-4 h-4"/> Add Item
            </button>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F8F9FA] text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Item</th>
                  <th className="px-4 py-3 font-bold">Current</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedStock.length > 0 ? (
                  paginatedStock.map(stock => {
                    const isLow = parseFloat(stock.currentQuantity) < 10;
                    return (
                      <tr key={stock.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{stock.itemName}</td>
                        <td className="px-4 py-3 text-gray-600 font-bold">{stock.currentQuantity} {stock.unit}</td>
                        <td className="px-4 py-3">
                          {isLow ? (
                            <span className="text-[#E67E22] font-bold text-xs bg-[#FEF9E7] px-2 py-1 rounded-full border border-[#F1C40F]/30 flex items-center w-fit gap-1"><AlertCircle className="w-3 h-3"/> Low</span>
                          ) : (
                            <span className="text-[#27AE60] font-bold text-xs bg-[#E8F5E9] px-2 py-1 rounded-full flex items-center w-fit gap-1"><CheckCircle className="w-3 h-3"/> OK</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-[#3498DB] hover:underline font-medium">Update</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">Rice</td>
                      <td className="px-4 py-3 text-gray-600 font-bold">45 KG</td>
                      <td className="px-4 py-3"><span className="text-[#27AE60] font-bold text-xs bg-[#E8F5E9] px-2 py-1 rounded-full flex items-center w-fit gap-1"><CheckCircle className="w-3 h-3"/> OK</span></td>
                      <td className="px-4 py-3 text-right"><button className="text-[#3498DB] hover:underline font-medium">Update</button></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">Flour</td>
                      <td className="px-4 py-3 text-gray-600 font-bold">15 KG</td>
                      <td className="px-4 py-3"><span className="text-[#E67E22] font-bold text-xs bg-[#FEF9E7] px-2 py-1 rounded-full border border-[#F1C40F]/30 flex items-center w-fit gap-1"><AlertCircle className="w-3 h-3"/> Low</span></td>
                      <td className="px-4 py-3 text-right"><button className="bg-[#3498DB] text-white px-3 py-1 rounded-md text-xs font-bold hover:bg-blue-600">Order</button></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          {stockTotalPages > 1 && (
            <div className="p-4 border-t border-gray-100">
              <Pagination currentPage={stockPage} totalPages={stockTotalPages} onPageChange={setStockPage} />
            </div>
          )}
        </div>

        {/* Low Stock Alerts & History */}
        <div className="space-y-6">
          <div className="bg-[#FFF5F5] rounded-2xl border border-[#FFE3E3] shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#FFE3E3] bg-[#FFF5F5]">
              <h3 className="font-bold text-[#E74C3C] flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> Low Stock Alerts
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#C0392B] uppercase mb-2">🔴 Out of Stock</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex justify-between items-center bg-white p-2 rounded border border-[#FFE3E3]"><span>Ginger (Req: 2 KG)</span> <button className="text-xs font-bold text-[#E74C3C] underline">Order</button></li>
                  <li className="flex justify-between items-center bg-white p-2 rounded border border-[#FFE3E3]"><span>Garlic (Req: 2 KG)</span> <button className="text-xs font-bold text-[#E74C3C] underline">Order</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#D35400] uppercase mb-2">🟡 Low Stock</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex justify-between items-center bg-white p-2 rounded border border-[#F1C40F]/30"><span>Oil - 15 L</span> <button className="text-xs font-bold text-[#E67E22] underline">Order</button></li>
                  <li className="flex justify-between items-center bg-white p-2 rounded border border-[#F1C40F]/30"><span>Sugar - 8 KG</span> <button className="text-xs font-bold text-[#E67E22] underline">Order</button></li>
                </ul>
              </div>
              <button className="w-full bg-[#E74C3C] text-white py-2 rounded-lg text-sm font-bold shadow-sm">
                Order All Low Stock Items
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
             <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-[#27AE60]" /> Usage History
             </h3>
             <ul className="space-y-3 text-sm text-gray-600">
               <li className="flex justify-between border-b border-gray-50 pb-2"><span>Rice (Used: 120 KG)</span> <button className="text-[#3498DB] font-medium">View</button></li>
               <li className="flex justify-between border-b border-gray-50 pb-2"><span>Oil (Used: 40 L)</span> <button className="text-[#3498DB] font-medium">View</button></li>
             </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
