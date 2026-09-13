// DATA FLOW: [AI_TODO: Document data flow direction for SuperadminUseSuperAdminCreateOwner.ts]
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { ownerRequestsApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminOwnerRequests';
import { superadminOwnersApi } from '@/app/superadmin/superadmin_lib/superadmin_api/SuperadminOwners';
import { DEFAULT_CREATE_OWNER_FORM_DATA, PLAN_LIMITS } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_utils/SuperAdminCreateOwner.constants';

import type { OwnerFormData, OwnerFormErrors, CreatedCredentials } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_types/SuperAdminCreateOwner.types';


export function SuperadminUseSuperAdminCreateOwner() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('requestId');
  

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<OwnerFormErrors>({});
  const [createdCreds, setCreatedCreds] = useState<CreatedCredentials | null>(null);
  const [formData, setFormData] = useState<OwnerFormData>(DEFAULT_CREATE_OWNER_FORM_DATA);

  // Load from request ID if present
  useEffect(() => {
    if (requestId) {
      void ownerRequestsApi.list().then((requests) => {
      const req = requests.find((request) => request.id === requestId);
      if (req) {
        const planId = req.planId || 'none';
        const limits = PLAN_LIMITS[planId] || PLAN_LIMITS.none;
        
        setFormData(prev => ({
          ...prev,
          name: req.name || '',
          email: req.email || '',
          phone: req.phone || '',
          city: req.city || '',
          businessName: req.businessName || '',
          expectedPgs: req.pgCount || 1,
          expectedBeds: req.bedCount || 50,
          gst: req.gst || '',
          planId,
          ...limits
        }));
      }
      });
    }
  }, [requestId]);

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const p = e.target.value;
    const limits = PLAN_LIMITS[p] || PLAN_LIMITS.none;
    setFormData(prev => ({ ...prev, planId: p, ...limits }));
  };

  const validate = (): boolean => {
    const newErrors: OwnerFormErrors = {};
    if (!(formData as any).name) newErrors.name = 'Name is required';
    if (!(formData as any).phone || (formData as any).phone.length < 10) newErrors.phone = 'Valid phone required';
    if (!(formData as any).email || !/^\S+@\S+\.\S+$/.test((formData as any).email)) newErrors.email = 'Valid email required';
    if (!(formData as any).temporaryPassword || (formData as any).temporaryPassword.length < 6) {
      newErrors.temporaryPassword = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors before submitting.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await superadminOwnersApi.create({
        fullName: (formData as any).name,
        email: (formData as any).email,
        phone: (formData as any).phone,
        temporaryPassword: (formData as any).temporaryPassword,
        planId: (formData as any).planId === 'none' ? undefined : (formData as any).planId,
        requestId: requestId || undefined,
      });
      setCreatedCreds({ email: (formData as any).email, password: (formData as any).temporaryPassword });
      setSuccess(true);
    } catch (err: any) {
      toast.error((err as any).message || 'Failed to create owner.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    loading,
    success,
    createdCreds,
    handlePlanChange,
    handleSubmit
  };
}
