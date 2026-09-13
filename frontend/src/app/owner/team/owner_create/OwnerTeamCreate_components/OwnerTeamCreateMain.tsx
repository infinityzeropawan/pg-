'use client';

// RESPONSIBILITY: Renders the OwnerTeamCreateMain component. Receives data via props/hooks.

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { teamApi } from '@/app/owner/owner_lib/owner_api/OwnerTeam';

;
import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { useOwnerPropertyContext } from '@/app/owner/owner_components/OwnerPropertyContext';

import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { OwnerTeamCreateSuccess } from '@/app/owner/team/owner_create/OwnerTeamCreate_components/OwnerTeamCreateSuccess';
import { OwnerTeamCreatePersonalDetails } from '@/app/owner/team/owner_create/OwnerTeamCreate_components/OwnerTeamCreatePersonalDetails';
import { OwnerTeamCreatePropertyAssignment } from '@/app/owner/team/owner_create/OwnerTeamCreate_components/OwnerTeamCreatePropertyAssignment';
import { OwnerTeamCreateCredentials } from '@/app/owner/team/owner_create/OwnerTeamCreate_components/OwnerTeamCreateCredentials';
import { OwnerTeamCreateEmploymentTerms } from '@/app/owner/team/owner_create/OwnerTeamCreate_components/OwnerTeamCreateEmploymentTerms';
import { OwnerTeamCreateManagerPermissions } from '@/app/owner/team/owner_create/OwnerTeamCreate_components/OwnerTeamCreateManagerPermissions';

import type { StaffRoleType } from '@/app/owner/owner_lib/owner_api/OwnerTeam';

export function OwnerTeamCreateMain() {
  const router = useRouter();
  const user = typeof window !== 'undefined' ? getSession() : null;
  const { properties } = useOwnerPropertyContext();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<{ email: string, password: string, loginUrl: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    roleType: 'manager' as StaffRoleType,
    assignedPropertyIds: [] as string[],
    salary: 15000,
    joinDate: new Date().toISOString().split('T')[0],
    shift: 'Flexible' as 'Morning' | 'Evening' | 'Night' | 'Flexible',
    permissions: {
      canEditRent: false,
      canAddExpense: false,
      canOnboardStudent: false,
      canBroadcast: false,
      canCollectCash: false
    }
  });

  const handlePropertyToggle = (propId: string) => {
    setFormData(prev => {
      const isSelected = prev.assignedPropertyIds.includes(propId);
      if (isSelected) {
        return { ...prev, assignedPropertyIds: prev.assignedPropertyIds.filter(id => id !== propId) };
      } else {
        return { ...prev, assignedPropertyIds: [...prev.assignedPropertyIds, propId] };
      }
    });
  };

  const handlePermissionToggle = (key: any) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
// @ts-expect-error
        [key]: !prev.permissions[key]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');

    if ((formData as any).assignedPropertyIds.length === 0) {
      setError('Please assign at least one property to this staff member.');
      return;
    }

    setSubmitting(true);
    try {
      teamApi.createTeamMember({...formData, joinDate: formData.joinDate || ''}, user.id);
      
      const loginUrl = (formData as any).roleType === 'manager' ? '/manager/login' : '/staff/login';
      setSuccessData({
        email: (formData as any).email,
        password: (formData as any).password,
        loginUrl
      });

    } catch (err: any) {
      setError((err as any).message || 'Failed to create team member.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successData) {
    return <OwnerTeamCreateSuccess successData={successData} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/owner/team" className="p-2 hover:bg-card rounded-full motion-safe:transition-colors text-secondary hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-[22px] font-bold text-primary">Onboard New Team Member</h1>
          <p className="text-sm text-secondary">Create a profile for a manager or staff member and generate their login.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger-bg border border-danger text-danger rounded-md flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <OwnerTeamCreatePersonalDetails formData={formData} setFormData={setFormData} />
        <OwnerTeamCreatePropertyAssignment properties={properties} formData={formData} handlePropertyToggle={handlePropertyToggle} />
        <OwnerTeamCreateCredentials formData={formData} setFormData={setFormData} />
        <OwnerTeamCreateEmploymentTerms formData={formData} setFormData={setFormData} />
        <OwnerTeamCreateManagerPermissions formData={formData} handlePermissionToggle={handlePermissionToggle} />

        <div className="pt-4 flex justify-end gap-4">
          <Link 
            href="/owner/team"
            className="px-6 py-2.5 text-sm font-medium text-secondary hover:text-primary motion-safe:transition-colors"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-8 py-2.5 rounded-md font-bold hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-50 text-sm"
          >
            {submitting ? 'Creating...' : 'Create Team Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
