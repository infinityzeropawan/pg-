// RESPONSIBILITY: Renders the ManagerDashboardMain component.
'use client';
import { TriangleAlert } from 'lucide-react';

import { useManagerDashboard } from '@/app/manager/dashboard/ManagerDashboard_hooks/useManagerDashboard';
import { ManagerDashboardHeader } from '@/app/manager/dashboard/ManagerDashboard_components/ManagerDashboardHeader';
import { ManagerDashboardStatsGrid } from '@/app/manager/dashboard/ManagerDashboard_components/ManagerDashboardStatsGrid';
import { ManagerDashboardSummaryCards } from '@/app/manager/dashboard/ManagerDashboard_components/ManagerDashboardSummaryCards';
import { ManagerDashboardTasks } from '@/app/manager/dashboard/ManagerDashboard_components/ManagerDashboardTasks';
import { ManagerDashboardActivity } from '@/app/manager/dashboard/ManagerDashboard_components/ManagerDashboardActivity';
import { ManagerDashboardPerformance } from '@/app/manager/dashboard/ManagerDashboard_components/ManagerDashboardPerformance';
import { ManagerDashboardQuickActions } from '@/app/manager/dashboard/ManagerDashboard_components/ManagerDashboardQuickActions';
import { ManagerDashboardNoProperty } from '@/app/manager/dashboard/ManagerDashboard_components/ManagerDashboardNoProperty';

export function ManagerDashboardMain() {
  const {
    stats,
    loading,
    error,
    isPresent,
    handleMarkPresent,
    selectedPropertyId,
    ctxLoading,
    properties,
    user
  } = useManagerDashboard();

  if (ctxLoading || loading) {
    return <div className="p-6 motion-safe:animate-pulse text-secondary">Loading operational dashboard...</div>;
  }
  if (properties.length === 0 || !selectedPropertyId) {
    return <ManagerDashboardNoProperty />;
  }

  // Failures are shown explicitly instead of being masked by locally-invented data.
  if (error) {
    return (
      <div className="m-4 rounded-[var(--radius-lg)] border border-danger bg-danger-bg p-5 text-danger">
        <div className="flex items-center gap-2 font-bold mb-1">
          <TriangleAlert className="w-5 h-5" /> Could not load dashboard data
        </div>
        <p className="text-sm">{error}</p>
        <p className="text-xs mt-2 opacity-80">
          No placeholder figures are shown. Retry once the backend is reachable.
        </p>
      </div>
    );
  }

  const selectedProp = properties.find((p) => (p as { id: string }).id === selectedPropertyId);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Top Greeting Bar */}
      <ManagerDashboardHeader 
        user={user}
        selectedProp={selectedProp}
        isPresent={isPresent}
        handleMarkPresent={handleMarkPresent}
      />

      {/* Row 1: 5 Stats Cards */}
      <ManagerDashboardStatsGrid stats={stats} />

      {/* Row 2: 4 Summary Cards */}
      <ManagerDashboardSummaryCards stats={stats} />

      {/* Row 3: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ManagerDashboardTasks stats={stats} />
        <ManagerDashboardActivity stats={stats} />
      </div>

      {/* Row 4: Weekly Performance Summary */}
      <ManagerDashboardPerformance stats={stats} />

      {/* Bottom: Quick Action Buttons */}
      <ManagerDashboardQuickActions />
    </div>
  );
}