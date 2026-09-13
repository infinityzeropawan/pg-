// @ts-nocheck
'use client';

// RESPONSIBILITY: Renders the Owner Reports & Business Intelligence main component.

import { useState, useEffect } from 'react';
import {
  TrendingUp, BarChart3, PieChart, Users, Building2,
  Download, Filter, Star, Target, Zap, ArrowUp, ArrowDown,
  RefreshCw, Clock, Activity, DollarSign
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ReportTab = 'overview' | 'financial' | 'students' | 'operations' | 'bi';

export function OwnerReportsMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties, selectedPropertyId } = useOwnerPropertyContext();

  const [activeTab, setActiveTab] = useState<ReportTab>('overview');
  const [loading, setLoading] = useState(true);

  // Raw data
  const [students, setStudents] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    const load = () => {
      setLoading(true);
      const propFilter = (arr: any[]) => selectedPropertyId === 'all' ? arr : arr.filter(x => x.propertyId === selectedPropertyId);
      setStudents(propFilter(JSON.parse(localStorage.getItem('spg_students') || '[]')).filter((s: any) => !s.isDeleted));
      setInvoices(propFilter(JSON.parse(localStorage.getItem('spg_invoices') || '[]')).filter((i: any) => !i.isDeleted));
      setExpenses(propFilter(JSON.parse(localStorage.getItem('spg_expenses') || '[]')).filter((e: any) => !e.isDeleted));
      setComplaints(propFilter(JSON.parse(localStorage.getItem('spg_complaints') || '[]')).filter((c: any) => !c.isDeleted));
      setRooms(propFilter(JSON.parse(localStorage.getItem('spg_rooms') || '[]')).filter((r: any) => !r.isDeleted));
      setBeds(propFilter(JSON.parse(localStorage.getItem('spg_beds') || '[]')).filter((b: any) => !b.isDeleted));
      setStaff(propFilter(JSON.parse(localStorage.getItem('spg_staff') || '[]')).filter((s: any) => !s.isDeleted));
      setLoading(false);
    };
    load();
  }, [selectedPropertyId]);

  // Derived metrics
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;
  const collectionEfficiency = invoices.length > 0
    ? Math.round((invoices.filter(i => i.status === 'Paid').length / invoices.length) * 100) : 0;

  const handleExport = () => {
    const data = { occupancyRate, totalRevenue, netProfit, profitMargin, totalStudents: students.length, generatedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `pg_report_${new Date().toISOString().split('T')[0]}.json`; a.click();
  };

  // Chart configs
  const occupancyGaugeOptions: any = {
    chart: { type: 'radialBar', background: 'transparent' },
    plotOptions: { radialBar: { hollow: { size: '65%' }, dataLabels: { name: { show: true, color: '#94A3B8', fontSize: '14px' }, value: { show: true, fontSize: '28px', fontWeight: 800, color: '#FFFFFF', formatter: (v: number) => `${v}%` }, total: { show: true, label: 'Occupancy', color: '#94A3B8', fontSize: '13px', formatter: () => `${occupancyRate}%` } } } },
    colors: ['#2D7D9A'],
    stroke: { lineCap: 'round' },
    theme: { mode: 'dark' },
    labels: ['Occupancy Rate'],
  };

  const revenueMonthlyOptions: any = {
    chart: { type: 'area', height: 250, toolbar: { show: false }, background: 'transparent' },
    colors: ['#27AE60', '#E74C3C'],
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.0 } },
    dataLabels: { enabled: false },
    xaxis: { categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], labels: { style: { colors: '#94A3B8' } }, axisBorder: { show: false } },
    yaxis: { labels: { style: { colors: '#94A3B8' }, formatter: (v: number) => `₹${(v / 1000).toFixed(0)}K` } },
    grid: { borderColor: 'rgba(255,255,255,0.05)' },
    theme: { mode: 'dark' },
    legend: { labels: { colors: '#94A3B8' } },
    tooltip: { theme: 'dark', y: { formatter: (v: number) => `₹${v.toLocaleString('en-IN')}` } },
  };
  const revenueMonthlyBase = [totalRevenue * 0.6, totalRevenue * 0.7, totalRevenue * 0.8, totalRevenue * 0.85, totalRevenue * 0.92, totalRevenue];
  const expensesMonthlyBase = [totalExpenses * 0.65, totalExpenses * 0.7, totalExpenses * 0.75, totalExpenses * 0.8, totalExpenses * 0.9, totalExpenses];
  const revenueSeries = [{ name: 'Revenue', data: revenueMonthlyBase }, { name: 'Expenses', data: expensesMonthlyBase }];

  const expenseDonutOptions: any = {
    chart: { type: 'donut', background: 'transparent' },
    labels: expenses.length > 0 ? [...new Set(expenses.map((e: any) => e.category.replace('_', ' ').toUpperCase()))] : ['No Data'],
    colors: ['#2D7D9A', '#F5A623', '#27AE60', '#E74C3C', '#9B59B6', '#1ABC9C'],
    theme: { mode: 'dark' },
    plotOptions: { pie: { donut: { size: '70%', labels: { show: true, total: { show: true, label: 'Total Exp.', color: '#94A3B8', fontSize: '12px', formatter: () => `₹${(totalExpenses / 1000).toFixed(0)}K` } } } } },
    stroke: { show: false },
    legend: { position: 'bottom', labels: { colors: '#94A3B8' } },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark', y: { formatter: (v: number) => `₹${v.toLocaleString('en-IN')}` } },
  };
  const expenseByCategory = expenses.reduce((acc: any, e: any) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});
  const expenseDonutSeries = Object.values(expenseByCategory).length > 0 ? Object.values(expenseByCategory) as number[] : [1];

  const complaintBarOptions: any = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
    colors: ['#2D7D9A'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    xaxis: { categories: ['Maintenance', 'Utilities', 'Food', 'Security', 'Other'], labels: { style: { colors: '#94A3B8' } } },
    yaxis: { labels: { style: { colors: '#94A3B8' } } },
    grid: { borderColor: 'rgba(255,255,255,0.05)' },
    theme: { mode: 'dark' },
    tooltip: { theme: 'dark' },
  };
  const complaintBarSeries = [{
    name: 'Complaints',
    data: ['maintenance', 'utilities', 'food', 'security', 'other'].map(cat => complaints.filter(c => c.category === cat).length)
  }];

  const TABS: { key: ReportTab; label: string; icon: any }[] = [
    { key: 'overview',   label: 'Overview',    icon: Activity },
    { key: 'financial',  label: 'Financial',   icon: DollarSign },
    { key: 'students',   label: 'Students',    icon: Users },
    { key: 'operations', label: 'Operations',  icon: BarChart3 },
    { key: 'bi',         label: 'Business Intelligence', icon: Zap },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#2D7D9A]" /> Reports & Business Intelligence
          </h1>
          <p className="text-sm text-secondary mt-1">Complete analytics, KPIs, and predictive insights for your PG business.</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-[#2D7D9A] text-white rounded-lg text-sm font-semibold hover:bg-[#1a6680] transition-colors shadow-md">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* KPI Hero Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Building2,   label: 'Occupancy Rate',     value: `${occupancyRate}%`,                 sub: `${occupiedBeds}/${totalBeds} beds`,   color: 'text-[#2D7D9A]', bg: 'bg-[rgba(45,125,154,0.1)]', trend: occupancyRate >= 80 ? 'up' : 'down' },
          { icon: DollarSign,  label: 'Revenue Collected',  value: `₹${(totalRevenue / 1000).toFixed(0)}K`, sub: `₹${(pendingRevenue/1000).toFixed(0)}K pending`, color: 'text-success', bg: 'bg-success-bg', trend: 'up' },
          { icon: Target,      label: 'Collection Eff.',    value: `${collectionEfficiency}%`,           sub: 'Of invoices paid',                   color: 'text-warning',   bg: 'bg-warning-bg',             trend: collectionEfficiency >= 80 ? 'up' : 'down' },
          { icon: Star,        label: 'Resolution Rate',    value: `${resolutionRate}%`,                 sub: `${resolvedComplaints}/${totalComplaints} resolved`, color: 'text-success', bg: 'bg-success-bg', trend: 'up' },
        ].map(({ icon: Icon, label, value, sub, color, bg, trend }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              {trend === 'up'
                ? <ArrowUp className="w-4 h-4 text-success opacity-0 group-hover:opacity-100 transition-opacity" />
                : <ArrowDown className="w-4 h-4 text-danger opacity-0 group-hover:opacity-100 transition-opacity" />
              }
            </div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-secondary uppercase tracking-wider mt-1">{label}</div>
            <div className="text-xs text-secondary/60 mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Report Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${activeTab === key ? 'bg-[#2D7D9A] text-white shadow-sm' : 'text-secondary hover:text-primary'}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4">Occupancy Gauge</h2>
            {typeof window !== 'undefined' && (
              <ReactApexChart options={occupancyGaugeOptions} series={[occupancyRate]} type="radialBar" height={260} width="100%" />
            )}
            <div className="grid grid-cols-2 gap-4 w-full mt-2">
              <div className="text-center"><div className="text-lg font-bold text-primary">{occupiedBeds}</div><div className="text-xs text-secondary">Occupied</div></div>
              <div className="text-center"><div className="text-lg font-bold text-secondary">{totalBeds - occupiedBeds}</div><div className="text-xs text-secondary">Vacant</div></div>
            </div>
          </div>
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-success" /> Revenue vs Expenses (Monthly Trend)
            </h2>
            {typeof window !== 'undefined' && (
              <ReactApexChart options={revenueMonthlyOptions} series={revenueSeries} type="area" height={240} />
            )}
          </div>
          {/* Property-wise summary */}
          <div className="lg:col-span-12 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-border"><h2 className="text-base font-bold text-primary">Property-wise Summary</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-page border-b border-border">{['Property', 'Beds', 'Occupied', 'Occupancy', 'Revenue', 'Complaints', 'Staff'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-secondary uppercase tracking-wider">{h}</th>)}</tr></thead>
                <tbody>
                  {properties.map(prop => {
                    const pBeds = beds.filter(b => b.propertyId === prop.id);
                    const pOccupied = pBeds.filter(b => b.status === 'Occupied');
                    const pRate = pBeds.length > 0 ? Math.round((pOccupied.length / pBeds.length) * 100) : 0;
                    const pRev = invoices.filter(i => i.propertyId === prop.id && i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
                    const pComplaints = complaints.filter(c => c.propertyId === prop.id).length;
                    const pStaff = staff.filter(s => s.propertyId === prop.id).length;
                    return (
                      <tr key={prop.id} className="border-b border-border hover:bg-page/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-primary">{(prop as any).name}</td>
                        <td className="px-4 py-3 text-primary">{pBeds.length}</td>
                        <td className="px-4 py-3 text-primary">{pOccupied.length}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-input rounded-full h-1.5 w-20">
                              <div className="h-1.5 rounded-full bg-[#2D7D9A]" style={{ width: `${pRate}%` }} />
                            </div>
                            <span className={`text-xs font-bold ${pRate >= 80 ? 'text-success' : pRate >= 60 ? 'text-warning' : 'text-danger'}`}>{pRate}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-success">₹{(pRev / 1000).toFixed(0)}K</td>
                        <td className="px-4 py-3 text-primary">{pComplaints}</td>
                        <td className="px-4 py-3 text-primary">{pStaff}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Financial Tab */}
      {activeTab === 'financial' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-[#F5A623]" /> Expense Breakdown</h2>
            {typeof window !== 'undefined' && <ReactApexChart options={expenseDonutOptions} series={expenseDonutSeries} type="donut" height={260} />}
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-primary flex items-center gap-2"><DollarSign className="w-4 h-4 text-success" /> P&L Statement</h2>
            {[
              { label: 'Total Revenue', value: totalRevenue, color: 'text-success', prefix: '+' },
              { label: 'Total Expenses', value: totalExpenses, color: 'text-danger', prefix: '-' },
              { label: 'Net Profit', value: netProfit, color: netProfit >= 0 ? 'text-success' : 'text-danger', prefix: '' },
            ].map(({ label, value, color, prefix }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <span className="text-secondary text-sm">{label}</span>
                <span className={`font-bold text-lg ${color}`}>{prefix}₹{Math.abs(value).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="bg-[rgba(45,125,154,0.1)] border border-[#2D7D9A]/30 rounded-xl p-4 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm font-medium">Profit Margin</span>
                <span className={`text-2xl font-black ${profitMargin >= 0 ? 'text-success' : 'text-danger'}`}>{profitMargin}%</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-primary mb-4">Revenue Trend</h2>
            {typeof window !== 'undefined' && <ReactApexChart options={revenueMonthlyOptions} series={revenueSeries} type="area" height={220} />}
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-primary flex items-center gap-2"><Users className="w-4 h-4 text-[#2D7D9A]" /> Student Overview</h2>
            {[
              { label: 'Total Students',   value: students.length },
              { label: 'Active',           value: students.filter(s => s.status === 'active').length },
              { label: 'On Notice',        value: students.filter(s => s.status === 'on_notice').length },
              { label: 'Avg Rent',         value: `₹${students.length > 0 ? Math.round(students.reduce((s, st) => s + st.rentAmount, 0) / students.length).toLocaleString('en-IN') : 0}` },
              { label: 'Total Dues',       value: `₹${students.reduce((s, st) => s + (st.duesAmount || 0), 0).toLocaleString('en-IN')}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-secondary text-sm">{label}</span>
                <span className="font-bold text-primary">{value}</span>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <h2 className="text-sm font-semibold text-primary flex items-center gap-2"><BarChart3 className="w-4 h-4 text-warning" /> Top Debtors</h2>
            {students.filter(s => s.duesAmount > 0).sort((a, b) => b.duesAmount - a.duesAmount).slice(0, 5).map(s => {
              const user = JSON.parse(localStorage.getItem('spg_users') || '[]').find((u: any) => u.id === s.userId);
              return (
                <div key={s.id} className="flex items-center justify-between gap-4 p-3 bg-page border border-border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-danger-bg flex items-center justify-center text-danger text-xs font-bold shrink-0">
                    {user?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-primary truncate">{user?.name || s.userId}</div>
                    <div className="text-xs text-secondary">Room {s.roomId}</div>
                  </div>
                  <span className="text-danger font-bold text-sm shrink-0">₹{s.duesAmount.toLocaleString('en-IN')}</span>
                </div>
              );
            })}
            {students.filter(s => s.duesAmount > 0).length === 0 && <p className="text-secondary text-sm text-center py-8">🎉 No outstanding dues!</p>}
          </div>
        </div>
      )}

      {/* Operations Tab */}
      {activeTab === 'operations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#2D7D9A]" /> Complaints by Category</h2>
            {typeof window !== 'undefined' && <ReactApexChart options={complaintBarOptions} series={complaintBarSeries} type="bar" height={240} />}
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-primary flex items-center gap-2"><Activity className="w-4 h-4 text-success" /> Operations Summary</h2>
            {[
              { label: 'Total Complaints',    value: totalComplaints },
              { label: 'Resolved',            value: resolvedComplaints, color: 'text-success' },
              { label: 'Pending / Open',      value: complaints.filter(c => c.status === 'open').length, color: 'text-danger' },
              { label: 'Resolution Rate',     value: `${resolutionRate}%`, color: resolutionRate >= 80 ? 'text-success' : 'text-warning' },
              { label: 'Staff Count',         value: staff.length },
              { label: 'Active Staff',        value: staff.filter(s => s.status === 'Active').length, color: 'text-success' },
            ].map(({ label, value, color = 'text-primary' }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-secondary text-sm">{label}</span>
                <span className={`font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BI Tab */}
      {activeTab === 'bi' && (
        <div className="space-y-6">
          {/* KPI Dashboard */}
          <div className="bg-gradient-to-br from-[#1a3a4a] to-[#0d1f2a] border border-[#2D7D9A]/30 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#F5A623]" /> Business Intelligence Dashboard
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Revenue / Bed',    value: totalBeds > 0 ? `₹${Math.round(totalRevenue / totalBeds).toLocaleString()}` : '₹0' },
                { label: 'Avg Rent',         value: students.length > 0 ? `₹${Math.round(students.reduce((s, st) => s + st.rentAmount, 0) / students.length).toLocaleString()}` : '₹0' },
                { label: 'Profit Margin',    value: `${profitMargin}%` },
                { label: 'Collection Eff.', value: `${collectionEfficiency}%` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-xl font-black text-white">{value}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictive Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-primary flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2D7D9A]" /> Occupancy Forecast
              </h2>
              {[
                { period: 'Current',         occ: occupancyRate,                           color: 'bg-[#2D7D9A]' },
                { period: 'Next Month (Est.)',occ: Math.min(100, occupancyRate + 5),        color: 'bg-[#48A9C5]' },
                { period: 'Next Quarter',    occ: Math.min(100, occupancyRate + 8),         color: 'bg-success' },
              ].map(({ period, occ, color }) => (
                <div key={period}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-secondary">{period}</span>
                    <span className="text-primary font-bold">{occ}%</span>
                  </div>
                  <div className="w-full bg-input rounded-full h-2">
                    <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${occ}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-primary flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" /> Revenue Forecast
              </h2>
              {[
                { period: 'Current Month',   rev: totalRevenue },
                { period: 'Next Month (Est.)',rev: Math.round(totalRevenue * 1.05) },
                { period: 'Next Quarter',    rev: Math.round(totalRevenue * 3.2) },
              ].map(({ period, rev }) => (
                <div key={period} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <span className="text-secondary text-sm">{period}</span>
                  <span className="font-bold text-success">₹{(rev / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Opportunities */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#F5A623]" /> Growth Opportunities
            </h2>
            <div className="space-y-3">
              {properties.map(prop => {
                const pBeds = beds.filter(b => b.propertyId === prop.id);
                const pOccupied = pBeds.filter(b => b.status === 'Occupied');
                const pRate = pBeds.length > 0 ? Math.round((pOccupied.length / pBeds.length) * 100) : 0;
                const isUnderperforming = pRate < 75;
                return (
                  <div key={prop.id} className={`p-4 rounded-xl border ${isUnderperforming ? 'border-danger/30 bg-danger-bg/30' : 'border-success/30 bg-success-bg/30'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-primary">{(prop as any).name}</div>
                        <div className="text-xs text-secondary mt-0.5">
                          {isUnderperforming
                            ? '💡 Suggested: Marketing campaign, review pricing'
                            : '🌟 High performer — consider expanding capacity'}
                        </div>
                      </div>
                      <div className={`text-2xl font-black ${isUnderperforming ? 'text-danger' : 'text-success'}`}>{pRate}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
