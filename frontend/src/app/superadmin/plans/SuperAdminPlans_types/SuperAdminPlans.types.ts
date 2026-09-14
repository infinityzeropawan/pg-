export interface SuperAdminPlan {
  id: string;
  name: string;
  price: number;
  maxProperties: number;
  maxBeds: number;
  maxStaff: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
}

// Component Props Interfaces
export interface SuperAdminPlansHeaderProps {
  onCreateClick?: () => void;
}

export interface SuperAdminPlansCardProps {
  plan: SuperAdminPlan;
  onEditClick: (plan: SuperAdminPlan) => void;
}

export interface SuperAdminPlansGridProps {
  plans: SuperAdminPlan[];
  loading: boolean;
  onEditClick: (plan: SuperAdminPlan) => void;
}

export interface SuperAdminPlansEditModalProps {
  editPlan: SuperAdminPlan | null;
  setEditPlan: React.Dispatch<React.SetStateAction<SuperAdminPlan | null>>;
  onSave: (e: React.FormEvent) => void;
}
