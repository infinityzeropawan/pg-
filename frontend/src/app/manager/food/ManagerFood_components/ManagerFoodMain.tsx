// RESPONSIBILITY: Renders the ManagerFoodMain component.
'use client';
import { useManagerFood } from '@/app/manager/food/ManagerFood_hooks/useManagerFood';
import { ManagerFoodEmptyState } from '@/app/manager/food/ManagerFood_components/ManagerFoodEmptyState';
import { ManagerFoodWeeklySchedule } from '@/app/manager/food/ManagerFood_components/ManagerFoodWeeklySchedule';
export function ManagerFoodMain() {
  const { loading, menu, selectedPropertyId, ctxLoading } = useManagerFood();
  if (ctxLoading || loading) {
    return <div className="p-6 motion-safe:animate-pulse">Loading menu...</div>;
  }
  if (!selectedPropertyId) {
    return <div className="p-6 text-center text-secondary">Property Required</div>;
  }
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary">PG Food Menu</h1>
          <p className="text-sm text-secondary">View the weekly food schedule set by the owner.</p>
        </div>
      </div>
      {!menu ? (
        <ManagerFoodEmptyState />
      ) : (
        <ManagerFoodWeeklySchedule menu={menu} />
      )}
    </div>
  );
}