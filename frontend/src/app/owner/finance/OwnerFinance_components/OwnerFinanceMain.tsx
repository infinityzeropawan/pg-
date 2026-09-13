'use client';

// RESPONSIBILITY: Renders the OwnerFinanceMain component. Receives data via props/hooks.

import { useState, useEffect } from 'react';
import { TrendingDown } from 'lucide-react';

import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { financeApi } from '@/app/owner/owner_lib/owner_api/OwnerFinance';
import { OwnerFinanceCards } from '@/app/owner/finance/OwnerFinance_components/OwnerFinanceCards';
import { OwnerFinanceCharts } from '@/app/owner/finance/OwnerFinance_components/OwnerFinanceCharts';
import { OwnerFinanceTabs } from '@/app/owner/finance/OwnerFinance_components/OwnerFinanceTabs';
import { useTableSync } from '@/lib/hooks/useTableSync';

import type { Expense } from '@/app/owner/owner_lib/owner_api/OwnerFinance';

export function OwnerFinanceMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { selectedPropertyId } = useOwnerPropertyContext();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices' | 'expenses' | 'deposits'>('payments');
  
  const { page: currentPage, setPage: setCurrentPage } = useTableSync();
  const itemsPerPage = 10;

  const loadData = () => {
    if (!user) return;
    setLoading(true);
    const data = financeApi.getStats(user.id, selectedPropertyId);
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user?.id, selectedPropertyId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedPropertyId, setCurrentPage]);

  if (loading || !stats) {
    return <div className="p-6 motion-safe:animate-pulse">Loading finance data...</div>;
  }

  const getPaginatedData = (array: unknown[]) => {
    const totalPages = Math.ceil(array.length / itemsPerPage);
    const paginated = array.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return { paginated, totalPages };
  };

  const paymentsData = getPaginatedData(stats.payments);
  const expensesData = getPaginatedData(stats.expenses);
  const invoicesData = getPaginatedData(stats.invoices);

  const netProfit = stats.revenue - stats.totalExpenses;
  const profitMargin = stats.revenue > 0 ? ((netProfit / stats.revenue) * 100).toFixed(1) : 0;
  const isProfitable = netProfit >= 0;

  // Group expenses by category for pie chart
  const expenseCategories = stats.expenses.reduce((acc: unknown, exp: Expense) => {
// @ts-expect-error
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  
  const expenseLabels = Object.keys(expenseCategories).map(k => k.replace('_', ' ').toUpperCase());
  const expenseSeries = Object.values(expenseCategories) as number[];

  // Chart configs
  const expensePieOptions: unknown = {
    chart: { type: 'donut', fontFamily: 'inherit', background: 'transparent' },
    labels: expenseLabels,
    colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'],
    stroke: { show: false },
    theme: { mode: 'dark' },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { show: true },
            value: { show: true, formatter: (val: number) => `₹${val.toLocaleString()}` },
            total: {
              show: true,
              label: 'Total Expenses',
              formatter: () => `₹${stats.totalExpenses.toLocaleString()}`
            }
          }
        }
      }
    },
    legend: { position: 'bottom' }
  };

  const trendOptions: unknown = {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', background: 'transparent' },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yaxis: { title: { text: '₹ (INR)' } },
    fill: { opacity: 1 },
    colors: ['#10b981', '#ef4444'], // Green for Income, Red for Expense
    theme: { mode: 'dark' },
    tooltip: { y: { formatter: (val: number) => `₹${val.toLocaleString()}` } }
  };
  
  const trendSeries = [
    { name: 'Income', data: [45000, 52000, 48000, 60000, 58000, stats.revenue] },
    { name: 'Expenses', data: [20000, 22000, 18000, 25000, 24000, stats.totalExpenses] }
  ];

  return (
    <div className="space-y-6 pb-20 print:pb-0 print:space-y-4 animate-in fade-in motion-safe:duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-[22px] font-bold text-primary">Financial Dashboard</h1>
          <p className="text-sm text-secondary">Track enterprise-grade financial metrics, revenue, and expenses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover shadow-md transition-all flex items-center gap-2">
            <TrendingDown className="w-4 h-4" /> Record Expense
          </button>
        </div>
      </div>

      <OwnerFinanceCards 
        stats={stats}
        netProfit={netProfit}
        profitMargin={profitMargin}
        isProfitable={isProfitable}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Content Area (Tabs) */}
        <div className="xl:col-span-8 space-y-6">
          <OwnerFinanceTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
// @ts-expect-error
            paymentsData={paymentsData}
// @ts-expect-error
            expensesData={expensesData}
// @ts-expect-error
            invoicesData={invoicesData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>

        {/* Side Panel (Charts & Info) */}
        <div className="xl:col-span-4 space-y-6">
          <OwnerFinanceCharts 
            trendOptions={trendOptions}
            trendSeries={trendSeries}
            expenseSeries={expenseSeries}
            expensePieOptions={expensePieOptions}
          />
          
          {/* Additional Side Panel Info */}
          <div className="bg-gradient-to-br from-[#1a3a4a] to-[#0d1f2a] rounded-xl p-6 shadow-md text-white">
            <h3 className="text-sm font-bold text-white/90 uppercase tracking-widest mb-4 flex items-center gap-2">
              Banking Info
            </h3>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                <div className="text-xs font-bold text-white/60 mb-1">Primary Settlement Account</div>
                <div className="text-sm font-semibold tracking-wider">HDFC Bank •••• 4521</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                <div className="text-xs font-bold text-white/60 mb-1">UPI ID for Collection</div>
                <div className="text-sm font-semibold">smartpg@hdfcbank</div>
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed mt-4">
              All digital payments collected via the Student App are settled to this account within T+1 working days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
