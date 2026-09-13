// @ts-nocheck
'use client';

// RESPONSIBILITY: Renders the Owner Complaints Oversight main component.

import { useState, useEffect } from 'react';
import {
  MessageSquare, CheckCircle2, Clock, Star, Timer,
  AlertTriangle, BarChart3, Filter, RefreshCw, Eye,
  ChevronDown, TrendingUp, Zap
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: 'text-danger',   bg: 'bg-danger-bg',   border: 'border-danger' },
  medium: { label: 'Medium', color: 'text-warning',  bg: 'bg-warning-bg',  border: 'border-warning' },
  low:    { label: 'Low',    color: 'text-success',  bg: 'bg-success-bg',  border: 'border-success' },
};

const STATUS_CONFIG = {
  open:        { label: 'Open',        color: 'text-danger',   bg: 'bg-danger-bg' },
  in_progress: { label: 'In Progress', color: 'text-warning',  bg: 'bg-warning-bg' },
  resolved:    { label: 'Resolved',    color: 'text-success',  bg: 'bg-success-bg' },
};

const CATEGORY_LABELS: Record<string, string> = {
  maintenance: 'Maintenance',
  utilities:   'Utilities',
  food:        'Food',
  security:    'Security',
  cleanliness: 'Cleanliness',
  other:       'Other',
};

export function OwnerComplaintsMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { selectedPropertyId } = useOwnerPropertyContext();

  const [complaints, setComplaints] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const load = () => {
    setLoading(true);
    const all: any[] = JSON.parse(localStorage.getItem('spg_complaints') || '[]');
    const allUsers: any[] = JSON.parse(localStorage.getItem('spg_users') || '[]');
    const filtered = selectedPropertyId === 'all'
      ? all.filter(c => !c.isDeleted)
      : all.filter(c => c.propertyId === selectedPropertyId && !c.isDeleted);
    setComplaints(filtered);
    setUsers(allUsers);
    setLoading(false);
  };

  useEffect(() => { load(); }, [selectedPropertyId]);

  const updateStatus = (id: string, newStatus: string) => {
    const all: any[] = JSON.parse(localStorage.getItem('spg_complaints') || '[]');
    const updated = all.map(c => c.id === id ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c);
    localStorage.setItem('spg_complaints', JSON.stringify(updated));
    load();
    if (selectedComplaint?.id === id) setSelectedComplaint({ ...selectedComplaint, status: newStatus });
  };

  const getStudentName = (studentId: string) => users.find(u => u.id === studentId)?.name || 'Unknown';

  const filtered = complaints.filter(c => {
    const statusOk = filterStatus === 'all' || c.status === filterStatus;
    const priorityOk = filterPriority === 'all' || c.priority === filterPriority;
    return statusOk && priorityOk;
  });

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const pending = complaints.filter(c => c.status === 'open').length;
  const inProgress = complaints.filter(c => c.status === 'in_progress').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Category analysis
  const categories = ['maintenance', 'utilities', 'food', 'security', 'cleanliness', 'other'];
  const categoryData = categories.map(cat => ({
    name: CATEGORY_LABELS[cat] || cat,
    count: complaints.filter(c => c.category === cat).length
  })).filter(d => d.count > 0);

  const barOptions: any = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '60%' } },
    colors: ['#2D7D9A'],
    dataLabels: { enabled: true, formatter: (val: number) => val, style: { colors: ['#fff'], fontSize: '12px' } },
    xaxis: { categories: categoryData.map(d => d.name), labels: { style: { colors: '#94A3B8' } } },
    yaxis: { labels: { style: { colors: '#94A3B8' } } },
    grid: { borderColor: 'rgba(255,255,255,0.05)' },
    theme: { mode: 'dark' },
    tooltip: { theme: 'dark' },
  };

  const barSeries = [{ name: 'Complaints', data: categoryData.map(d => d.count) }];

  const donutOptions: any = {
    chart: { type: 'donut', background: 'transparent' },
    labels: ['Open', 'In Progress', 'Resolved'],
    colors: ['#EF4444', '#F59E0B', '#22C55E'],
    theme: { mode: 'dark' },
    plotOptions: { pie: { donut: { size: '70%', labels: { show: true, total: { show: true, label: 'Total', color: '#94A3B8', fontSize: '13px', formatter: () => String(total) } } } } },
    stroke: { show: false },
    legend: { position: 'bottom', labels: { colors: '#94A3B8' } },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark' },
  };
  const donutSeries = [pending, inProgress, resolved];

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#2D7D9A]" />
            Complaint Oversight
          </h1>
          <p className="text-sm text-secondary mt-1">Monitor, assign and resolve all tenant complaints.</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium text-primary hover:border-primary transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: MessageSquare, label: 'Total',       value: total,           color: 'text-[#2D7D9A]',  bg: 'bg-[rgba(45,125,154,0.1)]' },
          { icon: CheckCircle2,  label: 'Resolved',    value: resolved,        color: 'text-success',    bg: 'bg-success-bg' },
          { icon: Clock,         label: 'In Progress', value: inProgress,      color: 'text-warning',    bg: 'bg-warning-bg' },
          { icon: AlertTriangle, label: 'Open',        value: pending,         color: 'text-danger',     bg: 'bg-danger-bg' },
          { icon: TrendingUp,    label: 'Resolution %',value: `${resolutionRate}%`, color: 'text-success', bg: 'bg-success-bg' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg} mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-primary">{value}</div>
            <div className="text-xs text-secondary uppercase tracking-wider mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#2D7D9A]" /> By Category
          </h2>
          {categoryData.length > 0 ? (
            <div className="h-[220px]">
              {typeof window !== 'undefined' && (
                <ReactApexChart options={barOptions} series={barSeries} type="bar" height={220} />
              )}
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-secondary text-sm">No complaints data</div>
          )}
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-warning" /> Status Breakdown
          </h2>
          {total > 0 ? (
            <div className="h-[220px]">
              {typeof window !== 'undefined' && (
                <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={220} />
              )}
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-secondary text-sm">No complaints data</div>
          )}
        </div>
      </div>

      {/* Filters + Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-primary flex items-center gap-2">
            <Filter className="w-4 h-4 text-secondary" /> All Complaints ({filtered.length})
          </h2>
          <div className="flex gap-2 flex-wrap">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="bg-input border border-border text-primary text-sm rounded-md px-3 py-1.5 outline-none focus:border-primary">
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
              className="bg-input border border-border text-primary text-sm rounded-md px-3 py-1.5 outline-none focus:border-primary">
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-page">
                {['Category', 'Title', 'Student', 'Priority', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-secondary">No complaints found</td></tr>
              ) : filtered.map(c => {
                const pri = PRIORITY_CONFIG[c.priority] || PRIORITY_CONFIG.low;
                const sts = STATUS_CONFIG[c.status] || STATUS_CONFIG.open;
                return (
                  <tr key={c.id} className="border-b border-border hover:bg-page/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-medium bg-[rgba(45,125,154,0.1)] text-[#2D7D9A] px-2 py-0.5 rounded-full">
                        {CATEGORY_LABELS[c.category] || c.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="font-medium text-primary truncate">{c.title}</div>
                      <div className="text-xs text-secondary truncate">{c.description?.slice(0, 50)}...</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-primary">{getStudentName(c.studentId)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${pri.color} ${pri.bg} ${pri.border}`}>
                        {pri.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sts.color} ${sts.bg}`}>
                        {sts.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-secondary text-xs">
                      {new Date(c.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedComplaint(c)}
                          className="p-1.5 bg-[rgba(45,125,154,0.1)] text-[#2D7D9A] rounded-md hover:bg-[rgba(45,125,154,0.2)] transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {c.status !== 'resolved' && (
                          <button onClick={() => updateStatus(c.id, c.status === 'open' ? 'in_progress' : 'resolved')}
                            className="p-1.5 bg-success-bg text-success rounded-md hover:opacity-80 transition-colors text-xs font-medium px-2">
                            {c.status === 'open' ? 'Start' : 'Resolve'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedComplaint(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-primary">{selectedComplaint.title}</h3>
                <p className="text-xs text-secondary mt-1">Filed by {getStudentName(selectedComplaint.studentId)} · {new Date(selectedComplaint.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="text-secondary hover:text-primary p-1 rounded-md transition-colors text-xl leading-none">&times;</button>
            </div>
            <div className="space-y-3 mb-5">
              <div className="flex gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${PRIORITY_CONFIG[selectedComplaint.priority]?.color} ${PRIORITY_CONFIG[selectedComplaint.priority]?.bg} ${PRIORITY_CONFIG[selectedComplaint.priority]?.border}`}>
                  {selectedComplaint.priority?.toUpperCase()} Priority
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[selectedComplaint.status]?.color} ${STATUS_CONFIG[selectedComplaint.status]?.bg}`}>
                  {STATUS_CONFIG[selectedComplaint.status]?.label}
                </span>
              </div>
              <div className="bg-page border border-border rounded-lg p-4">
                <p className="text-sm text-primary leading-relaxed">{selectedComplaint.description}</p>
              </div>
              <div className="text-xs text-secondary">Category: <span className="text-primary font-medium">{CATEGORY_LABELS[selectedComplaint.category] || selectedComplaint.category}</span></div>
            </div>
            <div className="flex gap-2">
              {selectedComplaint.status === 'open' && (
                <button onClick={() => updateStatus(selectedComplaint.id, 'in_progress')}
                  className="flex-1 bg-warning-bg text-warning border border-warning rounded-md py-2 text-sm font-medium hover:opacity-80 transition-opacity">
                  Mark In Progress
                </button>
              )}
              {selectedComplaint.status !== 'resolved' && (
                <button onClick={() => updateStatus(selectedComplaint.id, 'resolved')}
                  className="flex-1 bg-success text-white rounded-md py-2 text-sm font-medium hover:opacity-90 transition-opacity">
                  Mark Resolved
                </button>
              )}
              {selectedComplaint.status === 'resolved' && (
                <div className="flex-1 text-center text-success font-medium text-sm py-2">✅ Already Resolved</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
