'use client';

// RESPONSIBILITY: Renders the Staff Dashboard UI layer.
// DATA FLOW: StaffUseStaffDashboard.ts -> StaffDashboardMain.tsx

import { Utensils, ListTodo, Package, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { useStaffDashboard } from '@/app/staff/dashboard/StaffDashboard_hooks/useStaffDashboard';
import { STAFF_ROUTES } from '@/app/staff/staff_url_config';

export function StaffDashboardMain() {
  const {
    staffRole,
    loading,
    menu,
    isPresent,
    stockItems,
    selectedStockName,
    setSelectedStockName,
    usageQty,
    setUsageQty,
    usageMeal,
    setUsageMeal,
    customReqName,
    setCustomReqName,
    customReqQty,
    setCustomReqQty,
    handleCustomRequest,
    handleMarkPresent,
    handleLogUsage,
    todayMenu,
    isMonthEnd
  } = useStaffDashboard();

  if (loading) return <div className="p-6 motion-safe:animate-pulse">Loading dashboard...</div>;

  const roles = [
    { role: 'cook', title: 'Food & Menu', icon: Utensils, href: STAFF_ROUTES.COOK, desc: 'View the full weekly food schedule.' },
    { role: 'cook', title: 'Kitchen Stock', icon: Package, href: STAFF_ROUTES.STOCK, desc: 'Manage kitchen inventory.' },
    { role: 'cook', title: 'Alerts & Refills', icon: AlertTriangle, href: STAFF_ROUTES.ALERTS, desc: 'View low stock and expiry alerts.' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-primary">Staff Overview</h1>
          <p className="text-sm text-secondary">Your daily dashboard and quick actions.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-card border border-border rounded-md p-2 pr-4 shadow-sm">
          {isPresent ? (
            <>
              <div className="w-10 h-10 rounded bg-success-bg text-success flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-secondary uppercase">Attendance</p>
                <p className="text-sm font-bold text-success">Marked Present ✅</p>
              </div>
            </>
          ) : (
            <button 
              onClick={handleMarkPresent}
              className="bg-primary text-white hover:bg-primary-hover px-6 py-2.5 rounded-md font-bold text-sm motion-safe:transition-colors shadow-sm"
            >
              Mark Attendance for Today
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {staffRole === 'cook' && todayMenu && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary to-transparent opacity-[0.05] rounded-bl-full pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary">Today's Menu</h2>
                  <p className="text-sm text-secondary capitalize">{todayMenu.day} {isMonthEnd ? ' (Month End Special!)' : ''}</p>
                </div>
              </div>

              {isMonthEnd && menu?.monthEndSpecial ? (
                <div className="bg-gradient-to-br from-primary-subtle to-bg-page border border-primary border-opacity-30 p-5 rounded-md">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-2">Month End Special Meal</p>
                  <p className="text-base font-medium text-primary whitespace-pre-wrap">{menu.monthEndSpecial}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                  <div className="bg-page border border-border rounded-md p-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-secondary mb-1">Breakfast</p>
                    <p className="text-sm font-medium text-primary">{todayMenu.data.breakfast || '-'}</p>
                  </div>
                  <div className="bg-page border border-border rounded-md p-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-secondary mb-1">Lunch</p>
                    <p className="text-sm font-medium text-primary">{todayMenu.data.lunch || '-'}</p>
                  </div>
                  <div className="bg-page border border-border rounded-md p-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-secondary mb-1">Dinner</p>
                    <p className="text-sm font-medium text-primary">{todayMenu.data.dinner || '-'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {staffRole === 'cook' && !menu && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col items-center justify-center text-center h-full">
              <Utensils className="w-12 h-12 text-secondary opacity-50 mb-3" />
              <h2 className="text-lg font-bold text-primary">No Menu Set</h2>
              <p className="text-sm text-secondary">The owner has not set a food menu for this property yet.</p>
            </div>
          )}
        </div>

        {staffRole === 'cook' && (
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-primary-subtle text-primary flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-primary">Log Daily Usage</h2>
            </div>
            
            <form onSubmit={handleLogUsage} className="flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-xs font-bold text-secondary mb-1 block">Search & Select Item</label>
                  <input 
                    list="stock-items-list"
                    value={selectedStockName}
                    onChange={e => setSelectedStockName((e.target as any).value)}
                    placeholder="Type to search items..."
                    className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:border-primary outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
                    required
                  />
                  <datalist id="stock-items-list">
                    {stockItems.map(i => (
                      <option key={i.id} value={`${i.name} (Avail: ${i.quantity} ${i.unit})`} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary mb-1 block">Quantity Used</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={usageQty}
                    onChange={e => setUsageQty((e.target as any).value)}
                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                    placeholder="e.g. 2.5"
                    className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:border-primary outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary mb-1 block">Meal Type</label>
                  <select 
                    value={usageMeal}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUsageMeal(e.target.value as any)}
                    className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:border-primary outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit"
                disabled={!selectedStockName || !usageQty}
                className="w-full mt-6 bg-primary text-white px-4 py-2.5 rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed motion-safe:transition-all"
              >
                <Send className="w-4 h-4" />
                Update Stock
              </button>
            </form>
          </div>
        )}
        
        {staffRole === 'cook' && (
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-full bg-danger-bg text-danger flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-primary">Request Stock Manually</h2>
            </div>
            
            <form onSubmit={handleCustomRequest} className="flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-xs font-bold text-secondary mb-1 block">Item Name</label>
                  <input 
                    list="stock-items-list-2"
                    value={customReqName}
                    onChange={e => setCustomReqName((e.target as any).value)}
                    placeholder="Type new or select existing..."
                    className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:border-primary outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
                    required
                  />
                  <datalist id="stock-items-list-2">
                    {stockItems.map(i => (
                      <option key={i.id} value={i.name} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary mb-1 block">Quantity Needed</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={customReqQty}
                    onChange={e => setCustomReqQty((e.target as any).value)}
                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                    placeholder="e.g. 10"
                    className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:border-primary outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={!customReqName || !customReqQty}
                className="w-full mt-6 bg-danger text-white px-4 py-2.5 rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-danger-hover disabled:opacity-50 disabled:cursor-not-allowed motion-safe:transition-all"
              >
                <Send className="w-4 h-4" />
                Submit Request
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.filter(r => r.role === staffRole).map(r => {
          const Icon = r.icon;
          return (
            <Link key={r.href} href={r.href} className="block p-6 border rounded-lg motion-safe:transition-all bg-card text-primary border-border hover:border-primary motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg">
              <Icon className="w-8 h-8 mb-4 text-primary" />
              <h2 className="text-xl font-bold mb-2">{r.title}</h2>
              <p className="text-sm text-secondary">{r.desc}</p>
            </Link>
          );
        })}
      </div>

      <Link href={STAFF_ROUTES.TASKS} className="block mt-6 p-6 bg-card border border-border hover:border-primary rounded-lg motion-safe:transition-colors motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-input flex items-center justify-center">
            <ListTodo className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">General Tasks</h2>
            <p className="text-sm text-secondary">View other assigned tasks and checklists.</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
