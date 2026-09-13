export interface OwnerFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  businessName: string;
  gst: string;
  pan: string;
  expectedPgs: number;
  expectedBeds: number;
  temporaryPassword?: string;
  mustChangePassword?: boolean;
  planId: string;
  billingCycle: string;
  maxProperties: number;
  maxBeds: number;
  maxStaff: number;
  features: string[];
}

export type OwnerFormErrors = Partial<Record<keyof OwnerFormData, string>>;

export interface PlanLimits {
  maxProperties: number;
  maxBeds: number;
  maxStaff: number;
}

export interface CreatedCredentials {
  email: string;
  password?: string;
}

// Component Props Interfaces
export interface SuperAdminCreateOwnerFieldProps {
  formData: OwnerFormData;
  setFormData: React.Dispatch<React.SetStateAction<OwnerFormData>>;
  errors: OwnerFormErrors;
}

export interface SuperAdminCreateOwnerPlanFieldsProps extends SuperAdminCreateOwnerFieldProps {
  onPlanChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface SuperAdminCreateOwnerSuccessProps {
  credentials: CreatedCredentials;
}
