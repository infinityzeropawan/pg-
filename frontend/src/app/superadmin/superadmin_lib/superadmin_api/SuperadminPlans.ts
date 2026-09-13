import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

export interface Plan {
  id: string;
  name: string;
  price: number;
  maxProperties: number;
  maxBeds: number;
  maxStaff: number;
  features: string[];
  [key: string]: unknown;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
}

const baseFields = { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'system', updatedBy: 'system', isDeleted: false };
const SEEDED_PLANS: Plan[] = [
  { id: 'basic', name: 'Basic', price: 999, maxProperties: 1, maxBeds: 50, maxStaff: 2, features: ['student_portal', 'mess_basic'], ...baseFields },
  { id: 'gold', name: 'Gold', price: 2999, maxProperties: 3, maxBeds: 200, maxStaff: 10, features: ['student_portal', 'mess_basic', 'whatsapp_alerts'], ...baseFields },
  { id: 'platinum', name: 'Platinum', price: 5999, maxProperties: 999, maxBeds: 9999, maxStaff: 999, features: ['student_portal', 'mess_basic', 'whatsapp_alerts', 'custom_domain'], ...baseFields }
];

export const plansApi = {
  listPlans(): Plan[] {
    const records = db.getAll<Plan>('spg_plans');
    if (records.length === 0) {
      // Seed them
      SEEDED_PLANS.forEach(p => db.insert('spg_plans', { ...p, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'system', updatedBy: 'system', isDeleted: false } as unknown as import('@/lib/storage/db').BaseEntity));
      return SEEDED_PLANS;
    }
    return records;
  },
  
  updatePlan(id: string, data: Partial<Plan>) {
    db.update('spg_plans', id, data);
    
    db.insert(STORAGE_KEYS.AUDIT_LOGS, {
      id: createId('aud'),
      action: 'PLAN_UPDATED',
      actorId: 'superadmin',
      targetId: id,
      details: `Updated plan limits/pricing for ${id}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'superadmin',
      updatedBy: 'superadmin',
      isDeleted: false
    });
  }
};
