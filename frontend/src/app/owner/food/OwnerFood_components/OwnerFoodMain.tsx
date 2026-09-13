'use client';

// RESPONSIBILITY: Renders the OwnerFoodMain component. Receives data via props/hooks.

import { useState, useEffect } from 'react';
import { UtensilsCrossed, CheckCircle2, PlusCircle } from 'lucide-react';

import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';
import { foodApi } from '@/app/owner/owner_lib/owner_api/OwnerFood';
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';


import { OwnerFoodMenuForm } from './OwnerFoodMenuForm';
import { OwnerFoodMenuReadView } from './OwnerFoodMenuReadView';

import type { FoodMenu } from '@/app/staff/staff_lib/staff_api/StaffFood';

const defaultMenu = {
  monday: '',
  tuesday: '',
  wednesday: '',
  thursday: '',
  friday: '',
  saturday: '',
  sunday: '',
  monthEndSpecial: ''
};

export function OwnerFoodMain() {
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties, selectedPropertyId, setSelectedPropertyId } = useOwnerPropertyContext();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [menu, setMenu] = useState<Partial<FoodMenu>>(defaultMenu);
  const [isEditing, setIsEditing] = useState(false);
  const [hasMenu, setHasMenu] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    if (selectedPropertyId === 'all' && properties.length > 0) {
// @ts-expect-error
      if (setSelectedPropertyId) setSelectedPropertyId(properties[0].id);
      return;
    }

    if (selectedPropertyId && selectedPropertyId !== 'all') {
      setLoading(true);
      const data = foodApi.getByProperty(selectedPropertyId);
      if (data) {
        setMenu(data);
        setHasMenu(true);
        setIsEditing(false);
      } else {
        setMenu(defaultMenu);
        setHasMenu(false);
        setIsEditing(false); // Show empty state first
      }
      setLoading(false);
      setSuccessMsg('');
    }
  }, [selectedPropertyId, properties.length, user?.id, setSelectedPropertyId]);

  const handleFillDummyData = () => {
    const dummyDay = JSON.stringify({ breakfast: 'Poha & Tea', lunch: 'Dal, Rice, Roti, Sabji', dinner: 'Paneer Butter Masala, Naan' });
    const dummySunday = JSON.stringify({ breakfast: 'Aloo Paratha & Curd', lunch: 'Rajma Chawal', dinner: 'Chicken Curry, Roti' });
    setMenu({
      monday: dummyDay,
      tuesday: dummyDay,
      wednesday: dummyDay,
      thursday: dummyDay,
      friday: dummyDay,
      saturday: dummyDay,
      sunday: dummySunday,
      monthEndSpecial: 'Special Veg/Non-Veg Thali with Gulab Jamun & Ice Cream'
    });
  };

  const handleSave = () => {
    if (!selectedPropertyId || selectedPropertyId === 'all') return;
    setSaving(true);
    try {
      foodApi.save(selectedPropertyId, menu);
      setSuccessMsg('Food Menu saved successfully!');
      setHasMenu(true);
      setTimeout(() => {
        setSuccessMsg('');
        setIsEditing(false); // Switch to read-only view after save
      }, 1500);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const parseDay = (val: string = '') => {
    try {
      return JSON.parse(val);
    } catch (e: any) {
      return { breakfast: '', lunch: '', dinner: val };
    }
  };

  const handleMealChange = (day: keyof FoodMenu, meal: 'breakfast'|'lunch'|'dinner', value: string) => {
// @ts-expect-error
    const current = parseDay((menu as unknown)[day]);
    current[meal] = value;
    setMenu(prev => ({ ...prev, [day]: JSON.stringify(current) }));
  };

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-secondary">
        <UtensilsCrossed className="w-12 h-12 mb-4 opacity-50" />
        <p>No properties found. Add a property to manage the food menu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-primary">Food Menu Planner</h1>
          <p className="text-sm text-secondary">Plan your weekly food schedule and month-end specials per PG.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-secondary">Select PG:</label>
          <select 
            value={selectedPropertyId === 'all' ? properties[0]?.id : selectedPropertyId}
            onChange={(e) => {
              if (setSelectedPropertyId) setSelectedPropertyId(e.target.value);
            }}
            className="bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none min-w-[200px] font-medium"
          >
            {properties.map(p => (
              <option key={p.id} value={p.id}>{(p as any).name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="motion-safe:animate-pulse h-[400px] bg-card rounded-lg border border-border"></div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 2xl:col-span-9 space-y-6">
            {successMsg && (
              <div className="p-4 bg-success-bg border border-[rgba(16,185,129,0.2)] rounded-md flex items-center gap-3 text-success animate-fade-in shadow-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="font-bold text-sm">{successMsg}</span>
              </div>
            )}

            {/* Empty State */}
            {!hasMenu && !isEditing && (
              <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-xl text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-primary-subtle rounded-full flex items-center justify-center mb-6">
                  <UtensilsCrossed className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">No Menu Found</h3>
                <p className="text-secondary text-sm max-w-sm mb-8">
                  You haven't created a food menu for this property yet. Managers and Kitchen staff cannot see any menu.
                </p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-primary-hover motion-safe:transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add Your Food Menu
                </button>
              </div>
            )}

            {/* Form View */}
            {isEditing && (
              <OwnerFoodMenuForm
                menu={menu}
                hasMenu={hasMenu}
                saving={saving}
                parseDay={parseDay}
                onMealChange={handleMealChange}
                onMonthEndChange={(val) => setMenu(prev => ({ ...prev, monthEndSpecial: val }))}
                onFillDummy={handleFillDummyData}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            )}

            {/* Read-only View */}
            {hasMenu && !isEditing && (
              <OwnerFoodMenuReadView
                menu={menu}
                parseDay={parseDay}
                onEdit={() => setIsEditing(true)}
              />
            )}
          </div>

          {/* Right Side Panel */}
          <div className="xl:col-span-4 2xl:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> Kitchen Insights
              </h3>
              <div className="space-y-4">
                <div className="bg-success-bg p-4 rounded-lg border border-[rgba(16,185,129,0.2)]">
                  <div className="text-xs text-success font-bold uppercase tracking-wider mb-1">Active Meal Subscribers</div>
                  <div className="text-2xl font-black text-primary">84<span className="text-sm font-medium text-secondary ml-1">/ 100</span></div>
                </div>
                
                <div className="p-4 rounded-lg border border-border">
                  <div className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Est. Monthly Cost</div>
                  <div className="text-xl font-bold text-primary">₹1,24,000</div>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <div className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Kitchen Staff</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-8 h-8 rounded-full bg-[#2D7D9A]/20 flex items-center justify-center text-[#2D7D9A] font-bold text-xs">SK</div>
                    <div className="text-sm font-medium text-primary">Suresh (Head Cook)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--primary)] to-indigo-900 rounded-xl p-6 shadow-md text-white">
              <h3 className="text-sm font-bold text-white/90 uppercase tracking-widest mb-3">Notice</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Changes to the menu will instantly reflect on the Manager App and Student App for this PG branch. 
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
