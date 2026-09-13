// RESPONSIBILITY: Edit form for the Food Menu planner (Owner).
'use client';

import { Calendar, Save, UtensilsCrossed } from 'lucide-react';

import type { FoodMenu } from '@/app/staff/staff_lib/staff_api/StaffFood';

interface OwnerFoodMenuFormProps {
  menu: Partial<FoodMenu>;
  hasMenu: boolean;
  saving: boolean;
  parseDay: (val?: string) => { breakfast: string; lunch: string; dinner: string };
  onMealChange: (day: keyof FoodMenu, meal: 'breakfast' | 'lunch' | 'dinner', value: string) => void;
  onMonthEndChange: (val: string) => void;
  onFillDummy: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function OwnerFoodMenuForm({
  menu, hasMenu, saving, parseDay, onMealChange, onMonthEndChange, onFillDummy, onSave, onCancel
}: OwnerFoodMenuFormProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm animate-fade-in">
      <div className="p-6 border-b border-border bg-[rgba(99,102,241,0.02)] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[rgba(99,102,241,0.1)] flex items-center justify-center text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">Edit Weekly Schedule</h2>
            <p className="text-xs text-secondary">Set standard items for each day</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onFillDummy}
            className="bg-input border border-border text-secondary hover:text-primary px-4 py-2.5 rounded-md text-sm font-bold motion-safe:transition-colors"
          >
            Fill Dummy Data
          </button>
          <button 
            onClick={onSave}
            disabled={saving}
            className="bg-primary text-white px-5 py-2.5 rounded-md text-sm font-bold hover:bg-primary-hover motion-safe:transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Menu'}
          </button>
          {hasMenu && (
            <button 
              onClick={onCancel}
              className="text-secondary hover:text-primary font-medium text-sm px-3"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
            // @ts-expect-error
            const dayData = parseDay((menu as unknown)[day]);
            return (
              <div key={day} className="space-y-3 bg-page border border-border rounded-lg p-4 shadow-sm">
                <label className="text-sm font-bold text-primary capitalize flex items-center gap-2 mb-2 pb-2 border-b border-border">
                  <span className="w-2 h-2 rounded-full bg-primary opacity-70"></span>
                  {day}
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-secondary mb-1 block">Breakfast</label>
                    <input 
                      value={dayData.breakfast}
                      onChange={(e) => onMealChange(day as keyof FoodMenu, 'breakfast', e.target.value)}
                      placeholder="e.g. Poha, Tea"
                      className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-primary focus:border-primary outline-none motion-safe:transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-secondary mb-1 block">Lunch</label>
                    <input 
                      value={dayData.lunch}
                      onChange={(e) => onMealChange(day as keyof FoodMenu, 'lunch', e.target.value)}
                      placeholder="e.g. Dal, Rice, Roti"
                      className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-primary focus:border-primary outline-none motion-safe:transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-secondary mb-1 block">Dinner</label>
                    <input 
                      value={dayData.dinner}
                      onChange={(e) => onMealChange(day as keyof FoodMenu, 'dinner', e.target.value)}
                      placeholder={day === 'sunday' ? 'e.g. Paneer, Roti' : 'e.g. Chicken, Roti'}
                      className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-primary focus:border-primary outline-none motion-safe:transition-colors"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <div className="bg-gradient-to-br from-[var(--primary-subtle)] to-[var(--bg-card)] border border-primary border-opacity-30 rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <UtensilsCrossed className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                🎉 Month End Special
              </h3>
              <p className="text-sm text-secondary mb-4 max-w-xl">
                Define a special menu for the last day of the month to treat your students. This overrides the regular weekday menu for that specific date.
              </p>
              <textarea 
                value={menu.monthEndSpecial}
                onChange={(e) => onMonthEndChange(e.target.value)}
                placeholder="e.g. Special Chicken Biryani / Mutton / Premium Veg Thali with Dessert"
                className="w-full max-w-2xl bg-white dark:bg-input border border-border rounded-md p-4 text-sm text-primary focus:border-primary outline-none resize-none h-24 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
