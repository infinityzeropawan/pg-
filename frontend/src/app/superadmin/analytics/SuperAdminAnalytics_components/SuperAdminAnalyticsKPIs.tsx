// RESPONSIBILITY: Renders the SuperAdminAnalyticsKPIs component.
import React from 'react';
import { TrendingUp, Users, Activity, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

import type { SuperAdminAnalyticsKPIsProps } from '@/app/superadmin/analytics/SuperAdminAnalytics_types/SuperAdminAnalytics.types';

export const SuperAdminAnalyticsKPIs: React.FC<SuperAdminAnalyticsKPIsProps> = ({ stats }) => {
  const kpis = [
    { label: 'Network MRR', value: `₹${(stats.mrr/100000).toFixed(2)}L`, trend: '+12.5%', isUp: true, icon: CreditCard, color: 'text-success' },
    { label: 'Platform Occupancy', value: `${stats.occupancyPercentage}%`, trend: '+2.1%', isUp: true, icon: Activity, color: 'text-primary' },
    { label: 'Active Students', value: stats.totalStudentsCount.toLocaleString(), trend: '+45', isUp: true, icon: Users, color: 'text-info' },
    { label: 'Churn Rate', value: '1.2%', trend: '-0.3%', isUp: false, icon: TrendingUp, color: 'text-danger' } // simulated trend
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k, i) => (
        <div key={k.label || i} className="bg-card border border p-5 rounded-[var(--radius-lg,12px)] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-page rounded-[var(--radius-md,8px)]">
              <k.icon className={`w-5 h-5 ${k.color}`} />
            </div>
            <div className={`flex items-center gap-1 text-[12px] font-bold px-2 py-1 rounded-full ${k.isUp ? (k.label === 'Churn Rate' ? 'bg-danger-bg text-danger' : 'bg-success-bg text-success') : 'bg-success-bg text-success'}`}>
              {k.trend} {k.isUp ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
            </div>
          </div>
          <div className="text-[28px] font-bold text-primary">{k.value}</div>
          <div className="text-[12px] text-secondary font-medium mt-1">{k.label}</div>
        </div>
      ))}
    </div>
  );
};
