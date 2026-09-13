// RESPONSIBILITY: Renders the SuperAdminDashboardAcquisitionChart component.
import React from 'react';

import { BarChart } from '@/components/ui/charts/BarChart';

import type { SuperAdminDashboardAcquisitionChartProps } from '@/app/superadmin/dashboard/SuperAdminDashboard_types/SuperAdminDashboard.types';

export const SuperAdminDashboardAcquisitionChart: React.FC<SuperAdminDashboardAcquisitionChartProps> = ({ data }) => {
  return (
    <div className="bg-card border border rounded-[var(--radius-lg,12px)] shadow-sm p-4 h-full">
      <h3 className="font-semibold text-primary mb-1">Student Acquisition</h3>
      <p className="text-xs text-secondary mb-6">New students joining the platform.</p>
      <div className="h-[280px]">
        <BarChart 
          data={data as any} 
          xAxisKey="month" 
          dataKey="students" 
          color="var(--primary)" 
          height={280} 
        />
      </div>
    </div>
  );
};
