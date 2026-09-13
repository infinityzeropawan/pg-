export type Role = 'superadmin' | 'owner' | 'manager' | 'staff' | 'student' | 'parent';

import type { BaseEntity } from '@/lib/storage/db';
export type { BaseEntity };

export interface SessionUser {
  id: string;
  role: Role;
  name: string;
  email: string;
  ownerId?: string;
  propertyId?: string;
  linkedStudentId?: string;
  mustChangePassword?: boolean;
  assignedPropertyIds?: string[];
}

export interface User extends BaseEntity {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  status: 'Active' | 'Pending' | 'Suspended';
  mustChangePassword?: boolean;
  ownerId?: string;
  propertyId?: string;
  assignedPropertyIds?: string[];
  linkedStudentId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
}
