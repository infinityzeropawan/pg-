// RESPONSIBILITY: Renders the SuperAdminPlansCard component.
import React from 'react';
import { Check } from 'lucide-react';

import type { SuperAdminPlansCardProps } from '@/app/superadmin/plans/SuperAdminPlans_types/SuperAdminPlans.types';

export const SuperAdminPlansCard: React.FC<SuperAdminPlansCardProps> = ({ plan, onEditClick }) => {
  return (
    <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm flex flex-col hover:shadow-lg transition-shadow">
      <div className={`p-6 border-b border text-center ${plan.id === 'platinum' ? 'bg-[rgba(99,102,241,0.05)]' : ''}`}>
        <h2 className="text-xl font-bold text-primary uppercase">{plan.name}</h2>
        <div className="mt-4 flex items-baseline justify-center gap-1">
          <span className="text-3xl font-extrabold text-primary">₹{plan.price.toLocaleString()}</span>
          <span className="text-secondary font-medium">/mo</span>
        </div>
        <button 
          onClick={() => onEditClick(plan)}
          className="mt-6 w-full py-2 border border-primary text-primary font-medium rounded-[var(--radius-md,8px)] hover:bg-primary hover:text-white motion-safe:transition-colors"
        >
          Edit Configuration
        </button>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center text-sm border-b border pb-2">
            <span className="text-secondary">Max Properties</span>
            <span className="font-bold text-primary">{plan.maxProperties === 999 ? 'Unlimited' : plan.maxProperties}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border pb-2">
            <span className="text-secondary">Max Beds</span>
            <span className="font-bold text-primary">{plan.maxBeds === 9999 ? 'Unlimited' : plan.maxBeds.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border pb-2">
            <span className="text-secondary">Max Staff</span>
            <span className="font-bold text-primary">{plan.maxStaff === 999 ? 'Unlimited' : plan.maxStaff}</span>
          </div>
        </div>

        <div className="text-[11px] font-bold text-secondary uppercase tracking-wider mb-3">Included Features</div>
        <ul className="space-y-3 flex-1">
          {plan.features.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm text-primary">
              <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <span className="capitalize">{f.replace('_', ' ')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
