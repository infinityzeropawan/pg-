// RESPONSIBILITY: Renders the SuperAdminCreateOwnerAccessFields component.
import React from 'react';
import { Shield } from 'lucide-react';

import { InputError } from '@/components/ui/InputError';

import type { SuperAdminCreateOwnerFieldProps } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_types/SuperAdminCreateOwner.types';

export const SuperAdminCreateOwnerAccessFields: React.FC<SuperAdminCreateOwnerFieldProps> = ({ formData, setFormData, errors }) => {
  return (
    <div className="bg-card border border rounded-[var(--radius-lg,12px)] overflow-hidden shadow-sm">
      <div className="bg-page border-b border p-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-primary">Account Access</h2>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Login Email *</label>
          <input 
            type="email" 
            value={(formData as any).email} 
            onChange={e => setFormData({ ...(formData as any), email: e.target.value })} 
            className={`w-full p-2.5 rounded-md border ${errors.email ? 'border-danger' : 'border'} bg-input text-primary text-sm focus:ring-primary`} 
          />
          <InputError message={errors.email} />
        </div>
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Temporary Password *</label>
          <input 
            type="text" 
            value={(formData as any).temporaryPassword || ''} 
            onChange={e => setFormData({ ...(formData as any), temporaryPassword: e.target.value })} 
            className={`w-full p-2.5 rounded-md border ${errors.temporaryPassword ? 'border-danger' : 'border'} bg-input text-primary text-sm font-mono focus:ring-primary`} 
            placeholder="e.g. Temp@123" 
          />
          <InputError message={errors.temporaryPassword} />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit">
            <input 
              type="checkbox" 
              checked={(formData as any).mustChangePassword} 
              onChange={e => setFormData({ ...(formData as any), mustChangePassword: e.target.checked })} 
              className="rounded text-primary focus:ring-primary bg-input border w-4 h-4" 
            />
            <span className="text-sm text-primary">Force password change on first login</span>
          </label>
        </div>
      </div>
    </div>
  );
};
