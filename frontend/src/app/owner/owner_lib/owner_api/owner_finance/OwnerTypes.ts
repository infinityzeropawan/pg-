import type { BaseEntity } from '@/lib/types';

export interface Invoice extends BaseEntity {
  propertyId: string;
  studentId: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  month: string;
  notes?: string;
  electricityBillAmount?: number;
  electricityBillImage?: string;
}

export interface Payment extends BaseEntity {
  propertyId: string;
  studentId: string;
  amount: number;
  method: 'cash' | 'upi' | 'bank_transfer';
  date: string;
  referenceNo?: string;
}

export interface Expense extends BaseEntity {
  propertyId: string;
  category: 'maintenance' | 'electricity' | 'water' | 'staff_salary' | 'groceries' | 'other';
  amount: number;
  date: string;
  description: string;
  recordedBy: string;
}
