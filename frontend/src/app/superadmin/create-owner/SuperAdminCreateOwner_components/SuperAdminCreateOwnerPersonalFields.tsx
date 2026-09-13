// RESPONSIBILITY: Renders the SuperAdminCreateOwnerPersonalFields component.
import React from 'react';
import { User } from 'lucide-react';

import { InputError } from '@/components/ui/InputError';

import type { SuperAdminCreateOwnerFieldProps } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_types/SuperAdminCreateOwner.types';

export const SuperAdminCreateOwnerPersonalFields: React.FC<SuperAdminCreateOwnerFieldProps> = ({ formData, setFormData, errors }) => {
  return (
    <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm">
      <div className="bg-page border-b border p-4 flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-primary">Personal Details</h2>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Full Name *</label>
          <input 
            type="text" 
            value={(formData as any).name} 
            onChange={e => setFormData({ ...(formData as any), name: e.target.value })} 
            className={`w-full p-2.5 rounded-md border ${errors.name ? 'border-danger' : 'border'} bg-input text-primary text-sm focus:ring-primary`} 
          />
          <InputError message={errors.name} />
        </div>
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Phone Number *</label>
          <input 
            type="text" 
            value={(formData as any).phone} 
            onChange={e => setFormData({ ...(formData as any), phone: e.target.value })} 
            className={`w-full p-2.5 rounded-md border ${errors.phone ? 'border-danger' : 'border'} bg-input text-primary text-sm focus:ring-primary`} 
          />
          <InputError message={errors.phone} />
        </div>
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">City *</label>
          <input 
            required 
            type="text" 
            value={(formData as any).city} 
            onChange={e => setFormData({ ...(formData as any), city: e.target.value })} 
            className="w-full p-2.5 rounded-md border border bg-input text-primary text-sm" 
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-secondary mb-1">Address</label>
          <input 
            type="text" 
            value={(formData as any).address} 
            onChange={e => setFormData({ ...(formData as any), address: e.target.value })} 
            className="w-full p-2.5 rounded-md border border bg-input text-primary text-sm" 
          />
        </div>
      </div>
    </div>
  );
};
