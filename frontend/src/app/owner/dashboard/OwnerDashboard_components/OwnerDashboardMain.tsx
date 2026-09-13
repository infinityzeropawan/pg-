// @ts-nocheck
'use client';

// RESPONSIBILITY: Renders the OwnerDashboardMain component. Receives data via props/hooks.

import { useState, useEffect } from 'react';
import { 
  Building2, BarChart, TrendingUp, TrendingDown,
  PieChart, Filter, Activity, AlertTriangle, Zap,
  MessageSquare, Bell, Users, ArrowRight, Shield, Megaphone
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { dashboardApi } from '@/app/owner/owner_lib/owner_api/OwnerDashboard';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';

import { OwnerDashboardStatCards } from './OwnerDashboardStatCards';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function OwnerDashboardMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties, loading: propsLoading } = useOwnerPropertyContext();
  
  const [filterPropId, setFilterPropId] = useState<string>('all');
  
  // Use dashboard API
  const globalMetrics = dashboardApi.getOwnerMetrics(user?.id || '', 'all');
  const propMetrics = dashboardApi.getOwnerMetrics(user?.id || '', filterPropId === 'all' ? properties[0]?.id || '' : filterPropId);

  useEffect(() => {
    if (filterPropId === 'all' && properties.length > 0) {
      setFilterPropId(properties[0].id);
    }
  }, [properties, filterPropId]);

  if (propsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full motion-safe:animate-spin"></div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-[rgba(99,102,241,0.1)] rounded-full flex items-center justify-center mb-6">
          <Building2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Welcome to SmartPG!</h2>
        <p className="text-secondary mb-8 max-w-md">
          You haven't added any properties yet. Create your first PG to start managing students, rent, and staff.
        </p>
        <Link 
          href="/owner/properties/create"
          className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary-hover motion-safe:transition-colors"
        >
          ➕ Create your first PG
        </Link>
      </div>
    );
  }

  // --- CHART CONFIGURATIONS ---
  const incomeTrendOptions: unknown = {
    chart: { type: 'area', height: 320, toolbar: { show: false }, background: 'transparent' },
    colors: ['#10B981', '#EF4444'], // Success green for collected, Danger red for pending
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { 
      categories: propMetrics.collectionVsPending.map((d: any) => d.month),
      labels: { style: { colors: '#94A3B8' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#94A3B8' },
        formatter: (val: number) => `₹${val.toLocaleString()}`
      }
    },
    grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
    theme: { mode: 'dark' },
    legend: { position: 'top', horizontalAlign: 'right', labels: { colors: '#94A3B8' } },
    tooltip: { theme: 'dark', y: { formatter: (val: number) => `₹${val.toLocaleString()}` } },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.0, stops: [0, 90, 100] } }
  };
  
  const incomeTrendSeries = [
    { name: 'Collected', data: propMetrics.collectionVsPending.map((d: any) => d.collected) },
    { name: 'Pending', data: propMetrics.collectionVsPending.map((d: any) => d.pending) }
  ];

  const expenseBreakdownOptions: unknown = {
    chart: { type: 'donut', background: 'transparent' },
    labels: globalMetrics.expenseBreakdown.map((e: any) => e.category.replace('_', ' ').toUpperCase()),
    colors: ['#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#6366F1'],
    theme: { mode: 'dark' },
    plotOptions: {
      pie: {
        donut: { size: '75%', labels: { show: true, name: { color: '#94A3B8', fontSize: '12px' }, value: { color: '#F0F0FF', fontSize: '24px', fontWeight: 800, formatter: (val: number) => `₹${val.toLocaleString()}` } } }
      }
    },
    stroke: { show: false },
    legend: { position: 'right', labels: { colors: '#94A3B8' }, markers: { radius: 12 } },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (val: number) => `₹${val.toLocaleString()}` } }
  };

  const expenseBreakdownSeries = globalMetrics.expenseBreakdown.map((e: any) => e.amount);

  const profitMargin = globalMetrics.thisMonthCollection > 0 
    ? Math.round((globalMetrics.netProfit / globalMetrics.thisMonthCollection) * 100) 
    : 0;

  return (
    <div className="pb-20 space-y-10 animate-in fade-in motion-safe:duration-300">

      {/* --------------------------------------------------------------------- */}
      {/* SECTION 0: BUSINESS HEALTH + ALERTS + QUICK ACTIONS                   */}
      {/* --------------------------------------------------------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Health Score */}
        <div className="bg-gradient-to-br from-[#1a3a4a] to-[#0d1f2a] border border-[#2D7D9A]/30 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#F5A623]" />
            <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest">Business Health</h2>
          </div>
          {(() => {
            const occ = propMetrics.occupancyPercent || 0;
            const open = propMetrics.openComplaints || 0;
            const pending = globalMetrics.pendingRent || 0;
            const score = Math.max(0, Math.min(100, Math.round(occ * 0.5 + (open === 0 ? 30 : open < 3 ? 20 : 10) + (pending === 0 ? 20 : pending < 10000 ? 15 : 5))));
            const grade = score >= 85 ? { label: 'Excellent', color: '#27AE60' } : score >= 70 ? { label: 'Good', color: '#2D7D9A' } : score >= 55 ? { label: 'Fair', color: '#F5A623' } : { label: 'Needs Attention', color: '#E74C3C' };
            return (
              <>
                <div className="flex items-end gap-3 mb-4">
                  <div className="text-7xl font-black" style={{ color: grade.color }}>{score}</div>
                  <div className="text-white/60 text-sm pb-2 font-medium">/100</div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold" style={{ backgroundColor: `${grade.color}20`, color: grade.color }}>
                  <Zap className="w-3.5 h-3.5" /> {grade.label}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-white/60"><span>Occupancy</span><span className="text-white font-medium">{occ}%</span></div>
                  <div className="w-full bg-white/10 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-[#2D7D9A]" style={{ width: `${occ}%` }} /></div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Important Alerts */}
        <div className="bg-card border border-border rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-danger" />
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Important Alerts</h2>
          </div>
          <div className="space-y-3">
            {propMetrics.openComplaints > 0 && (
              <Link href="/owner/complaints" className="flex items-start gap-3 p-3 bg-danger-bg border border-danger/30 rounded-xl hover:border-danger transition-colors group">
                <AlertTriangle className="w-4 h-4 text-danger mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-primary">{propMetrics.openComplaints} Open Complaints</div>
                  <div className="text-xs text-secondary">Tenant issues need attention</div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondary group-hover:text-danger transition-colors" />
              </Link>
            )}
            {propMetrics.pendingRent > 0 && (
              <Link href="/owner/finance" className="flex items-start gap-3 p-3 bg-warning-bg border border-warning/30 rounded-xl hover:border-warning transition-colors group">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-primary">₹{propMetrics.pendingRent.toLocaleString('en-IN')} Pending Rent</div>
                  <div className="text-xs text-secondary">Collect overdue payments</div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondary group-hover:text-warning transition-colors" />
              </Link>
            )}
            {propMetrics.vacantBeds > 0 && (
              <Link href="/owner/rooms" className="flex items-start gap-3 p-3 bg-[rgba(45,125,154,0.1)] border border-[#2D7D9A]/30 rounded-xl hover:border-[#2D7D9A] transition-colors group">
                <Building2 className="w-4 h-4 text-[#2D7D9A] mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-primary">{propMetrics.vacantBeds} Vacant Beds</div>
                  <div className="text-xs text-secondary">Fill to improve revenue</div>
                </div>
                <ArrowRight className="w-4 h-4 text-secondary group-hover:text-[#2D7D9A] transition-colors" />
              </Link>
            )}
            {propMetrics.openComplaints === 0 && propMetrics.pendingRent === 0 && propMetrics.vacantBeds === 0 && (
              <div className="text-center py-8 text-success"><div className="text-3xl mb-2">✅</div><div className="font-semibold">All clear!</div><div className="text-xs text-secondary mt-1">No urgent issues</div></div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[#F5A623]" />
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Add Student', href: '/owner/students', icon: Users, color: 'text-[#2D7D9A]', bg: 'bg-[rgba(45,125,154,0.1)]' },
              { label: 'View Finance', href: '/owner/finance', icon: BarChart, color: 'text-success', bg: 'bg-success-bg' },
              { label: 'Complaints', href: '/owner/complaints', icon: MessageSquare, color: 'text-warning', bg: 'bg-warning-bg' },
              { label: 'Notices', href: '/owner/notices', icon: Megaphone, color: 'text-primary', bg: 'bg-primary-subtle' },
              { label: 'Reports', href: '/owner/reports', icon: Activity, color: 'text-[#2D7D9A]', bg: 'bg-[rgba(45,125,154,0.1)]' },
              { label: 'Tax & Compliance', href: '/owner/tax', icon: Shield, color: 'text-success', bg: 'bg-success-bg' },
            ].map(({ label, href, icon: Icon, color, bg }) => (
              <Link key={href} href={href} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/40 transition-all hover:shadow-sm group text-center">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-xs font-semibold text-secondary group-hover:text-primary transition-colors leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <section>
        <div className="mb-6">
          <h1 className="text-3xl font-black text-primary tracking-tight">Executive Summary</h1>
          <p className="text-sm font-medium text-secondary uppercase tracking-wider mt-1">Global Financial Performance • {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* NET PROFIT CARD (HERO) */}
          <div className="lg:col-span-3 bg-gradient-to-br from-[var(--primary)] to-indigo-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-2 opacity-80">
                  <BarChart className="w-6 h-6" />
                  <h2 className="text-sm font-bold uppercase tracking-widest">True Net Profit</h2>
                </div>
                <div className="text-5xl md:text-7xl font-black tracking-tighter">
                  ₹{globalMetrics.netProfit.toLocaleString('en-IN')}
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm font-medium">
                  <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${profitMargin >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {profitMargin >= 0 ? <TrendingUp className="w-4 h-4"/> : <TrendingDown className="w-4 h-4"/>}
                    {profitMargin}% Margin
                  </div>
                  <span className="opacity-75">After all expenses</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 min-w-[280px] bg-black/20 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <div className="text-xs font-bold opacity-70 uppercase tracking-wider mb-1 border-b border-white/10 pb-2">Profit Calculation</div>
                
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="opacity-80">Total Revenue</span>
                  <span className="text-green-400">+ ₹{globalMetrics.thisMonthCollection.toLocaleString('en-IN')}</span>
                </div>
                
    // @ts-expect-error - unresolved TS error
                {globalMetrics.expenseBreakdown.map((exp: any, idx: any) => (
                  <div key={idx} className="flex justify-between items-center text-sm font-medium">
                    <span className="opacity-80 capitalize">{exp.category.replace('_', ' ')}</span>
                    <span className="text-red-400">- ₹{exp.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}

                {globalMetrics.expenseBreakdown.length === 0 && (
                   <div className="text-xs opacity-50 italic text-center py-2">No expenses yet</div>
                )}
                
                <div className="border-t border-white/10 mt-1 pt-2 flex justify-between items-center text-base font-bold">
                  <span>Net Profit</span>
                  <span className={globalMetrics.netProfit >= 0 ? "text-green-400" : "text-red-400"}>= ₹{globalMetrics.netProfit.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --------------------------------------------------------------------- */}
      {/* SECTION 2: EXPENSES & INCOME CHARTS                                   */}
      {/* --------------------------------------------------------------------- */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Where is my money going? (Expense Breakdown) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <PieChart className="w-5 h-5 text-warning" /> Expense Breakdown
              </h2>
              <p className="text-xs text-secondary mt-1">Where your money is going this month</p>
            </div>
          </div>
          
          {globalMetrics.expenseBreakdown && globalMetrics.expenseBreakdown.length > 0 ? (
            <div className="h-[280px] w-full flex items-center justify-center">
              {(typeof window !== 'undefined') && (
                <ReactApexChart options={expenseBreakdownOptions as any} series={expenseBreakdownSeries} type="donut" height={280} />
              )}
            </div>
          ) : (
            <div className="h-[280px] flex flex-col items-center justify-center text-secondary">
              <PieChart className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-medium">No expenses recorded yet</p>
            </div>
          )}
        </div>

        {/* Income Trend Chart */}
        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <Activity className="w-5 h-5 text-success" /> Revenue Health
              </h2>
              <p className="text-xs text-secondary mt-1">Collection vs Pending dues over time</p>
            </div>
          </div>
          <div className="h-[280px] w-full">
            {(typeof window !== 'undefined') && (
              <ReactApexChart options={incomeTrendOptions} series={incomeTrendSeries} type="area" height={280} />
            )}
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* --------------------------------------------------------------------- */}
      {/* SECTION 3: PROPERTY SPECIFIC OPERATIONS                               */}
      {/* --------------------------------------------------------------------- */}
      <section className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              Operational View
            </h2>
            <p className="text-sm text-secondary mt-1">Drill down into specific branch metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-secondary" />
            <select
              value={filterPropId}
              onChange={(e) => setFilterPropId(e.target.value)}
              className="bg-card border border-border text-primary font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary shadow-sm min-w-[200px]"
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>{(p as any).name}</option>
              ))}
            </select>
          </div>
        </div>

        <OwnerDashboardStatCards propMetrics={propMetrics} />
      </section>

    </div>
  );
}
