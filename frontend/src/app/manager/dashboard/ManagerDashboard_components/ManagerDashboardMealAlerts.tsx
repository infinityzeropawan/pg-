// RESPONSIBILITY: Renders the ManagerDashboardMealAlerts component.
import { Utensils } from 'lucide-react';

import type { MealStatus } from '@/app/manager/manager_lib/manager_api/ManagerMeals';
interface ManagerDashboardMealAlertsProps {
  readyMeals: MealStatus[];
  handleAnnounceMeal: (mealType: 'Breakfast'|'Lunch'|'Dinner') => void;
}
export function ManagerDashboardMealAlerts({ readyMeals, handleAnnounceMeal }: ManagerDashboardMealAlertsProps) {
  if (readyMeals.length === 0) return null;
  return (
    <div className="mb-6 bg-theme-primary/5 border border-primary border-opacity-30 rounded-[var(--radius-lg)] p-6 shadow-sm">
      <h2 className="font-black text-primary text-lg border-b border-primary/20 pb-3 mb-4 flex items-center gap-2">
        <Utensils className="w-5 h-5" />
        Meals Ready for Announcement
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {readyMeals.map(meal => (
          <div key={meal.id} className="bg-card border border-primary/20 rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
            <div className="w-12 h-12 bg-theme-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-primary text-lg mb-1">{meal.mealType} is Ready!</h3>
            <p className="text-sm text-secondary mb-4">The cook has prepared the meal.</p>
            <button 
              onClick={() => handleAnnounceMeal(meal.mealType)}
              className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg text-sm font-bold motion-safe:transition-colors shadow-sm"
            >
              Announce to Students
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}