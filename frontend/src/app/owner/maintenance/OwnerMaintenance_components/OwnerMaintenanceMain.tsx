// @ts-nocheck
'use client';

// RESPONSIBILITY: Renders the OwnerMaintenanceMain component with Complaints, AMC Contracts, and Preventive Schedule.

import { useState, useEffect } from 'react';
import { Wrench, Shield, Calendar, AlertTriangle, CheckCircle2, Clock, Phone, Plus, RefreshCw } from 'lucide-react';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  Active:      { color: 'text-success', bg: 'bg-success-bg',  label: 'Active' },
  Expiring:    { color: 'text-warning', bg: 'bg-warning-bg',  label: 'Expiring Soon' },
  Expired:     { color: 'text-danger',  bg: 'bg-danger-bg',   label: 'Expired' },
  Scheduled:   { color: 'text-[#2D7D9A]', bg: 'bg-[rgba(45,125,154,0.1)]', label: 'Scheduled' },
  Completed:   { color: 'text-success', bg: 'bg-success-bg',  label: 'Completed' },
  'Due Soon':  { color: 'text-warning', bg: 'bg-warning-bg',  label: 'Due Soon' },
  Overdue:     { color: 'text-danger',  bg: 'bg-danger-bg',   label: 'Overdue' },
};

type MainTab = 'amc' | 'preventive' | 'log';

export function OwnerMaintenanceMain() {
  const { properties, selectedPropertyId } = useOwnerPropertyContext();
  const [activeTab, setActiveTab] = useState<MainTab>('amc');
  const [amcContracts, setAmcContracts] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const propFilter = (arr: any[]) => selectedPropertyId === 'all' ? arr : arr.filter(x => x.propertyId === selectedPropertyId);
    setAmcContracts(propFilter(JSON.parse(localStorage.getItem('spg_amc_contracts') || '[]')).filter(a => !a.isDeleted));
    setSchedule(propFilter(JSON.parse(localStorage.getItem('spg_preventive_schedule') || '[]')));
    setComplaints(propFilter(JSON.parse(localStorage.getItem('spg_complaints') || '[]')).filter(c => !c.isDeleted));
    setLoading(false);
  };

  useEffect(() => { load(); }, [selectedPropertyId]);

  const totalAmcValue = amcContracts.reduce((s, a) => s + a.amount, 0);
  const activeAmc = amcContracts.filter(a => a.status === 'Active').length;
  const expiringAmc = amcContracts.filter(a => a.status === 'Expiring').length;
  const overdueSchedule = schedule.filter(s => s.status === 'Overdue').length;

  const statusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status] || { color: 'text-secondary', bg: 'bg-page', label: status };
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color} ${cfg.bg}`}>{cfg.label}</span>;
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#2D7D9A]" /> Maintenance Management
          </h1>
          <p className="text-sm text-secondary mt-1">AMC contracts, preventive schedule, and complaint log.</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-md text-sm font-medium text-primary hover:border-primary transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Shield,       label: 'Active AMC',       value: activeAmc,                     color: 'text-success',   bg: 'bg-success-bg' },
          { icon: AlertTriangle,label: 'Expiring Soon',    value: expiringAmc,                   color: 'text-warning',   bg: 'bg-warning-bg' },
          { icon: Clock,        label: 'Overdue Tasks',    value: overdueSchedule,               color: 'text-danger',    bg: 'bg-danger-bg' },
          { icon: Wrench,       label: 'Total Complaints', value: complaints.length,             color: 'text-[#2D7D9A]', bg: 'bg-[rgba(45,125,154,0.1)]' },
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

      {/* Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 w-fit">
        {([
          { key: 'amc',        label: 'AMC Contracts',        icon: Shield },
          { key: 'preventive', label: 'Preventive Schedule',  icon: Calendar },
          { key: 'log',        label: 'Complaint Log',        icon: Wrench },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${activeTab === key ? 'bg-[#2D7D9A] text-white' : 'text-secondary hover:text-primary'}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* AMC Contracts Tab */}
      {activeTab === 'amc' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-primary">Annual Maintenance Contracts</h2>
              <p className="text-xs text-secondary mt-0.5">Total value: ₹{(totalAmcValue / 1000).toFixed(0)}K/year</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-page border-b border-border">
                  {['Service', 'Vendor', 'Contract Value', 'Frequency', 'Next Service', 'Expiry', 'Status', 'Contact'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {amcContracts.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-16 text-secondary">No AMC contracts found.</td></tr>
                ) : amcContracts.map(contract => (
                  <tr key={contract.id} className="border-b border-border hover:bg-page/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(45,125,154,0.1)] flex items-center justify-center shrink-0">
                          <Shield className="w-4 h-4 text-[#2D7D9A]" />
                        </div>
                        <span className="font-semibold text-primary">{contract.service}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary">{contract.vendor}</td>
                    <td className="px-4 py-3 font-bold text-primary">₹{contract.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-secondary text-xs">{contract.frequency}</td>
                    <td className="px-4 py-3 text-secondary text-xs">
                      {contract.nextServiceDate ? new Date(contract.nextServiceDate).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3 text-secondary text-xs">
                      {new Date(contract.endDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">{statusBadge(contract.status)}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${contract.contactPhone}`} className="flex items-center gap-1 text-[#2D7D9A] hover:underline text-xs font-medium">
                        <Phone className="w-3 h-3" /> {contract.contactPhone}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preventive Schedule Tab */}
      {activeTab === 'preventive' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-base font-bold text-primary">Preventive Maintenance Schedule</h2>
            <p className="text-xs text-secondary mt-0.5">Recurring asset maintenance tasks</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-page border-b border-border">
                  {['Asset', 'Task', 'Frequency', 'Last Done', 'Next Due', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16 text-secondary">No preventive schedule found.</td></tr>
                ) : schedule.map(item => (
                  <tr key={item.id} className="border-b border-border hover:bg-page/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-[rgba(45,125,154,0.1)] flex items-center justify-center shrink-0">
                          <Wrench className="w-3.5 h-3.5 text-[#2D7D9A]" />
                        </div>
                        <span className="font-semibold text-primary">{item.asset}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary">{item.task}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-[rgba(45,125,154,0.1)] text-[#2D7D9A] font-medium px-2 py-0.5 rounded-full">{item.frequency}</span>
                    </td>
                    <td className="px-4 py-3 text-secondary text-xs">
                      {item.lastDone ? new Date(item.lastDone).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium">
                      {item.nextDue ? new Date(item.nextDue).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3">{statusBadge(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Complaint Log Tab */}
      {activeTab === 'log' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-base font-bold text-primary">Complaint Log ({complaints.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-page border-b border-border">
                  {['Category', 'Title', 'Priority', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-16 text-secondary">No complaints found.</td></tr>
                ) : complaints.map(c => (
                  <tr key={c.id} className="border-b border-border hover:bg-page/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium bg-[rgba(45,125,154,0.1)] text-[#2D7D9A] px-2 py-0.5 rounded-full capitalize">{c.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-primary">{c.title}</div>
                      <div className="text-xs text-secondary line-clamp-1">{c.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.priority === 'high' ? 'text-danger bg-danger-bg' : c.priority === 'medium' ? 'text-warning bg-warning-bg' : 'text-success bg-success-bg'}`}>
                        {c.priority?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.status === 'resolved' ? 'text-success bg-success-bg' : c.status === 'in_progress' ? 'text-warning bg-warning-bg' : 'text-danger bg-danger-bg'}`}>
                        {c.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-secondary">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
