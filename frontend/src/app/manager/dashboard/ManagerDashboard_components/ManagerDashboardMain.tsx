// RESPONSIBILITY: Renders the ManagerDashboardMain component.
'use client';
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
    kitchenRequests,
    readyMeals,
    isPresent,
    handleAnnounceMeal,
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
        <ManagerDashboardTasks />
        <ManagerDashboardActivity />
      </div>

      {/* Row 4: Weekly Performance Summary */}
      <ManagerDashboardPerformance />

      {/* Bottom: Quick Action Buttons */}
      <ManagerDashboardQuickActions />
    </div>
  );
}