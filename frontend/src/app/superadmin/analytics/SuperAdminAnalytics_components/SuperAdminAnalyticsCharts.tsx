// RESPONSIBILITY: Renders the SuperAdminAnalyticsCharts component.
import React from 'react';

import { AreaChart } from '@/components/ui/charts/AreaChart';
import { DonutChart } from '@/components/ui/charts/DonutChart';

import type { SuperAdminAnalyticsChartsProps } from '@/app/superadmin/analytics/SuperAdminAnalytics_types/SuperAdminAnalytics.types';

export const SuperAdminAnalyticsCharts: React.FC<SuperAdminAnalyticsChartsProps> = ({ revenueData, planData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Trend Chart */}
      <div className="lg:col-span-2 bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm p-5">
        <div className="mb-4">
          <h2 className="font-bold text-primary">Revenue Growth (MRR)</h2>
          <p className="text-xs text-secondary">Simulated month-over-month recurring revenue.</p>
        </div>
        <AreaChart data={revenueData} xAxisKey="month" dataKey="revenue" color="var(--primary)" height={300} />
      </div>

      {/* Plan Distribution Donut */}
      <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm p-5">
        <div className="mb-4">
          <h2 className="font-bold text-primary">Owners by Plan</h2>
          <p className="text-xs text-secondary">Distribution of active subscriptions.</p>
        </div>
        <DonutChart data={planData} height={300} />
      </div>
    </div>
  );
};
