// RESPONSIBILITY: Renders the OwnerTeamCreatePersonalDetails component. Receives data via props/hooks.

import { UserPlus } from 'lucide-react';

import type { StaffRoleType } from '@/app/owner/owner_lib/owner_api/OwnerTeam';

export interface OwnerTeamCreatePersonalDetailsProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function OwnerTeamCreatePersonalDetails({ formData, setFormData }: OwnerTeamCreatePersonalDetailsProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border bg-[rgba(99,102,241,0.02)] flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-primary" />
        <h2 className="text-base font-semibold text-primary">Personal Details & Role</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary">Full Name *</label>
          <input 
            required type="text" placeholder="e.g. Rahul Kumar"
// @ts-expect-error
            value={(formData as any).name} onChange={e => setFormData((p: unknown) => ({...p, name: e.target.value}))}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-secondary">Phone Number *</label>
          <input 
            required type="text" placeholder="e.g. +91 9876543210"
// @ts-expect-error
            value={(formData as any).phone} onChange={e => setFormData((p: unknown) => ({...p, phone: e.target.value}))}
            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-primary focus:border-primary outline-none"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-secondary">Role Profile *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1">
            {[
              { id: 'manager', label: 'Manager' },
              { id: 'cook', label: 'Cook / Chef' }
            ].map(role => (
              <label 
                key={role.id}
                className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer motion-safe:transition-colors ${
                  (formData as any).roleType === role.id 
                    ? 'border-primary bg-primary-subtle' 
                    : 'border-border bg-input hover:border-primary-subtle'
                }`}
              >
                <input 
                  type="radio" name="roleType" value={role.id}
                  checked={(formData as any).roleType === role.id}
// @ts-expect-error
                  onChange={() => setFormData((p: unknown) => ({...p, roleType: role.id as StaffRoleType}))}
                  className="accent-[var(--primary)]"
                />
                <span className={`text-sm font-medium ${(formData as any).roleType === role.id ? 'text-primary' : 'text-primary'}`}>
                  {role.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
