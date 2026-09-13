// RESPONSIBILITY: Read-only view of the Food Menu for the Owner page.
'use client';

import { Calendar, Edit3, UtensilsCrossed } from 'lucide-react';

import type { FoodMenu } from '@/app/staff/staff_lib/staff_api/StaffFood';

interface OwnerFoodMenuReadViewProps {
  menu: Partial<FoodMenu>;
  parseDay: (val?: string) => { breakfast: string; lunch: string; dinner: string };
  onEdit: () => void;
}

export function OwnerFoodMenuReadView({ menu, parseDay, onEdit }: OwnerFoodMenuReadViewProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm animate-fade-in">
      <div className="p-6 border-b border-border bg-[rgba(99,102,241,0.02)] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[rgba(99,102,241,0.1)] flex items-center justify-center text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">Current Weekly Schedule</h2>
            <p className="text-xs text-secondary">This menu is currently active</p>
          </div>
        </div>
        <button 
          onClick={onEdit}
          className="bg-input border border-border text-primary px-4 py-2 rounded-md text-sm font-bold hover:bg-border motion-safe:transition-colors flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          Edit Menu
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
            // @ts-expect-error
            const dayData = parseDay((menu as unknown)[day]);
            return (
              <div key={day} className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md hover:border-primary/50 motion-safe:transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--primary)] to-transparent opacity-[0.03] group-hover:opacity-[0.06] rounded-bl-full pointer-events-none transition-opacity"></div>
                
                <h3 className="text-sm font-black text-primary capitalize mb-4 flex items-center gap-2 pb-3 border-b border-border">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                  {day}
                </h3>
                
                <div className="space-y-4 relative z-10">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-secondary mb-1">Breakfast</p>
                    <p className="text-sm font-medium text-primary">{dayData.breakfast || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-secondary mb-1">Lunch</p>
                    <p className="text-sm font-medium text-primary">{dayData.lunch || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-secondary mb-1">Dinner</p>
                    <p className="text-sm font-medium text-primary">{dayData.dinner || '-'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {menu.monthEndSpecial && (
          <div className="mt-8 border-t border-border pt-8">
            <div className="bg-gradient-to-br from-[var(--primary-subtle)] to-[var(--bg-card)] border border-primary border-opacity-30 rounded-lg p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <UtensilsCrossed className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                  🎉 Month End Special
                </h3>
                <div className="w-full max-w-2xl bg-white dark:bg-input border border-border rounded-md p-4 text-sm text-primary shadow-sm whitespace-pre-wrap">
                  {menu.monthEndSpecial}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
