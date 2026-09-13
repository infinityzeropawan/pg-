// RESPONSIBILITY: Renders the SuperAdminDashboardKpiGrid component.
import React from 'react';
import { Users, Clock, Building2, UserCircle, CreditCard, Activity, Ticket, TrendingUp, TrendingDown } from 'lucide-react';

import type { SuperAdminDashboardKpiGridProps } from '@/app/superadmin/dashboard/SuperAdminDashboard_types/SuperAdminDashboard.types';

export const SuperAdminDashboardKpiGrid: React.FC<SuperAdminDashboardKpiGridProps> = ({ data }) => {
  const kpis = [
    { label: 'Total Owners', value: data.activeOwnersCount, icon: Users, iconColor: '#2D7D9A', iconBg: '#E6F0F4', borderColor: '#2D7D9A', trend: '+12%', trendUp: true },
    { label: 'Pending Requests', value: data.pendingRequestsCount, icon: Clock, iconColor: '#F5A623', iconBg: '#FEF6E8', borderColor: '#F5A623', trend: '-2%', trendUp: false },
    { label: 'Active Properties', value: data.activePropertiesCount, icon: Building2, iconColor: '#27AE60', iconBg: '#E8F8F0', borderColor: '#27AE60', trend: '+5%', trendUp: true },
    { label: 'Total Students', value: data.totalStudentsCount, icon: UserCircle, iconColor: '#8E44AD', iconBg: '#F4EAF7', borderColor: '#8E44AD', trend: '+18%', trendUp: true },
    { label: 'MRR (Dummy)', value: `₹${(data.mrr / 1000).toFixed(1)}k`, icon: CreditCard, iconColor: '#27AE60', iconBg: '#E8F8F0', borderColor: '#27AE60', trend: '+8.4%', trendUp: true },
    { label: 'Network Occupancy', value: `${data.occupancyPercentage}%`, icon: Activity, iconColor: '#2D7D9A', iconBg: '#E6F0F4', borderColor: '#2D7D9A', trend: '+2.1%', trendUp: true },
    { label: 'Open Tickets', value: data.openTicketsCount, icon: Ticket, iconColor: '#E74C3C', iconBg: '#FDEDED', borderColor: '#E74C3C', trend: '-14%', trendUp: false },
    { label: 'Expiring Plans', value: data.expiringPlansCount, icon: Clock, iconColor: '#F5A623', iconBg: '#FEF6E8', borderColor: '#F5A623', trend: 'Next 30d', trendUp: null },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <div
          key={i}
          className="bg-card border rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[130px] group motion-safe:hover:-translate-y-1 hover:shadow-md motion-safe:transition-all relative overflow-hidden"
          style={{ borderLeft: `4px solid ${kpi.borderColor}`, borderTop: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
        >
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-5" style={{ background: kpi.iconColor }}></div>
          
          <div className="relative z-10">
            {/* Icon + Label */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: kpi.iconBg }}>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.iconColor }} />
              </div>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider leading-tight">
                {kpi.label}
              </span>
            </div>
            {/* Value */}
            <div className="text-3xl font-extrabold leading-none tracking-tight" style={{ color: kpi.iconColor }}>
              {kpi.value}
            </div>
          </div>

          {/* Trend */}
          {kpi.trend && (
            <div className={`text-xs mt-3 font-semibold flex items-center gap-1 ${kpi.trendUp === true ? 'text-success' : kpi.trendUp === false ? 'text-danger' : 'text-secondary'}`}>
              {kpi.trendUp === true ? <TrendingUp className="w-3 h-3" /> : kpi.trendUp === false ? <TrendingDown className="w-3 h-3" /> : null}
              {kpi.trend} vs last month
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


