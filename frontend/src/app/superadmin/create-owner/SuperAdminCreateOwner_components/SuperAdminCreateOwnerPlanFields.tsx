// RESPONSIBILITY: Renders the SuperAdminCreateOwnerPlanFields component.
import React from 'react';
import { Package } from 'lucide-react';

import type { SuperAdminCreateOwnerPlanFieldsProps } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_types/SuperAdminCreateOwner.types';

export const SuperAdminCreateOwnerPlanFields: React.FC<SuperAdminCreateOwnerPlanFieldsProps> = ({ formData, setFormData, onPlanChange }) => {
  return (
    <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm">
      <div className="bg-page border-b border p-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-primary">Subscription Plan</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Select Plan</label>
            <select 
              value={(formData as any).planId} 
              onChange={onPlanChange} 
              className="w-full p-2.5 rounded-md border border bg-input text-primary text-sm"
            >
              <option value="none">No Plan (Require Purchase)</option>
              <option value="basic">Basic (1 PG, 50 Beds)</option>
              <option value="pro">Pro (3 PGs, 200 Beds)</option>
              <option value="enterprise">Enterprise (Unlimited)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Billing Cycle</label>
            <select 
              value={(formData as any).billingCycle} 
              onChange={e => setFormData({ ...(formData as any), billingCycle: e.target.value })} 
              className="w-full p-2.5 rounded-md border border bg-input text-primary text-sm"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        
        <div className="bg-page border border rounded-md p-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-secondary mb-1">Max Properties</div>
            <input 
              type="number" 
              value={(formData as any).maxProperties} 
              onChange={e => setFormData({ ...(formData as any), maxProperties: parseInt(e.target.value) || 0 })} 
              className="w-full bg-transparent border-b border text-center font-bold text-lg text-primary focus:outline-none" 
            />
          </div>
          <div>
            <div className="text-xs text-secondary mb-1">Max Beds</div>
            <input 
              type="number" 
              value={(formData as any).maxBeds} 
              onChange={e => setFormData({ ...(formData as any), maxBeds: parseInt(e.target.value) || 0 })} 
              className="w-full bg-transparent border-b border text-center font-bold text-lg text-primary focus:outline-none" 
            />
          </div>
          <div>
            <div className="text-xs text-secondary mb-1">Max Staff</div>
            <input 
              type="number" 
              value={(formData as any).maxStaff} 
              onChange={e => setFormData({ ...(formData as any), maxStaff: parseInt(e.target.value) || 0 })} 
              className="w-full bg-transparent border-b border text-center font-bold text-lg text-primary focus:outline-none" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
