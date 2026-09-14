'use client';

import React from 'react';

import { SuperadminUseSuperAdminAnalyticsData } from '@/app/superadmin/analytics/SuperAdminAnalytics_hooks/SuperadminUseSuperAdminAnalyticsData';
import { SuperAdminAnalyticsHeader } from '@/app/superadmin/analytics/SuperAdminAnalytics_components/SuperAdminAnalyticsHeader';
import { SuperAdminAnalyticsKPIs } from '@/app/superadmin/analytics/SuperAdminAnalytics_components/SuperAdminAnalyticsKPIs';
import { SuperAdminAnalyticsCharts } from '@/app/superadmin/analytics/SuperAdminAnalytics_components/SuperAdminAnalyticsCharts';
import { SuperAdminAnalyticsTopProperties } from '@/app/superadmin/analytics/SuperAdminAnalytics_components/SuperAdminAnalyticsTopProperties';
import { SUPER_ADMIN_MOCK_REVENUE_DATA, SUPER_ADMIN_MOCK_PLAN_DATA } from '@/app/superadmin/analytics/SuperAdminAnalytics_utils/SuperAdminAnalytics.constants';

export default function AnalyticsPage() {
  const { stats, planData, revenueData } = SuperadminUseSuperAdminAnalyticsData();

  if (!stats) return null;

  return (
    <div className="space-y-6 pb-20">
      <SuperAdminAnalyticsHeader />
      
      <SuperAdminAnalyticsKPIs stats={stats} />
      
      <SuperAdminAnalyticsCharts 
        revenueData={revenueData} 
        planData={planData} 
      />
      
      <SuperAdminAnalyticsTopProperties />
    </div>
  );
}