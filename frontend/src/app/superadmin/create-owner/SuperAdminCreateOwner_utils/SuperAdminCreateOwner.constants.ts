import type { OwnerFormData, PlanLimits } from '@/app/superadmin/create-owner/SuperAdminCreateOwner_types/SuperAdminCreateOwner.types';

export const DEFAULT_CREATE_OWNER_FORM_DATA: OwnerFormData = {
  name: '', 
  email: '', 
  phone: '', 
  city: '', 
  address: '',
  businessName: '', 
  gst: '', 
  pan: '', 
  expectedPgs: 1, 
  expectedBeds: 50,
  temporaryPassword: '', 
  mustChangePassword: true,
  planId: 'none', 
  billingCycle: 'monthly',
  maxProperties: 0, 
  maxBeds: 0, 
  maxStaff: 0,
  features: ['student_portal', 'mess_basic']
};

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  none: { maxProperties: 0, maxBeds: 0, maxStaff: 0 },
  basic: { maxProperties: 1, maxBeds: 50, maxStaff: 2 },
  pro: { maxProperties: 3, maxBeds: 200, maxStaff: 10 },
  enterprise: { maxProperties: 999, maxBeds: 9999, maxStaff: 999 }
};
