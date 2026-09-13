// RESPONSIBILITY: Renders the SuperAdminCreateOwnerForm component.
import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

import { SuperadminUseSuperAdminCreateOwner } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_hooks/SuperadminUseSuperAdminCreateOwner';
import { SuperAdminCreateOwnerPersonalFields } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_components/SuperAdminCreateOwnerPersonalFields';
import { SuperAdminCreateOwnerBusinessFields } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_components/SuperAdminCreateOwnerBusinessFields';
import { SuperAdminCreateOwnerAccessFields } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_components/SuperAdminCreateOwnerAccessFields';
import { SuperAdminCreateOwnerPlanFields } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_components/SuperAdminCreateOwnerPlanFields';
import { SuperAdminCreateOwnerSuccess } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_components/SuperAdminCreateOwnerSuccess';

export const SuperAdminCreateOwnerForm: React.FC = () => {
  const {
    formData,
    setFormData,
    errors,
    loading,
    success,
    createdCreds,
    handlePlanChange,
    handleSubmit
  } = SuperadminUseSuperAdminCreateOwner();

  if (success && createdCreds) {
    return <SuperAdminCreateOwnerSuccess credentials={createdCreds} />;
  }

  const fieldProps = { formData, setFormData, errors };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-primary">Create PG Owner</h1>
        <p className="text-secondary text-sm flex items-center gap-2 mt-1">
          <AlertCircle className="w-4 h-4 text-warning" />
          Owner self-signup nahi karta. Aap account banaake email+password doge.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <SuperAdminCreateOwnerPersonalFields {...fieldProps} />
        <SuperAdminCreateOwnerBusinessFields {...fieldProps} />
        <SuperAdminCreateOwnerAccessFields {...fieldProps} />
        <SuperAdminCreateOwnerPlanFields {...fieldProps} onPlanChange={handlePlanChange} />

        <div className="flex justify-end pt-4 border-t border gap-4">
          <Link 
            href="/superadmin/owners" 
            className="px-6 py-2.5 border border text-secondary rounded-md hover:bg-card font-medium"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-8 py-2.5 bg-primary text-white rounded-md hover:bg-primary-hover font-medium disabled:opacity-50"
          >
            {loading ? 'Provisioning...' : 'Create Owner Account'}
          </button>
        </div>
      </form>
    </div>
  );
};
