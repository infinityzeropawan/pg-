import { superadminRequest } from './SuperadminClient';
import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';

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

export const plansApi = {
  async listPlans(): Promise<Plan[]> {
    try {
      const plans = await superadminRequest<any[]>('/plans');
      if (Array.isArray(plans) && plans.length > 0) {
        return plans.map((plan) => ({
          ...plan,
          price: (plan.priceMonthly || plan.price || 0) > 1000 ? plan.priceMonthly / 100 : (plan.priceMonthly || plan.price || 0),
          maxStaff: plan.maxStaff || 0,
          createdBy: plan.createdBy || 'system',
          updatedBy: plan.updatedBy || 'system',
          isDeleted: false,
        }));
      }
    } catch {
      // Fallback to local db
    }
    return db.getAll<Plan>(STORAGE_KEYS.PLANS) || [];
  },

  listPlansSync(): Plan[] {
    return db.getAll<Plan>(STORAGE_KEYS.PLANS) || [];
  },
  
  async updatePlan(id: string, data: Partial<Plan>) {
    return superadminRequest(`/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: data.name,
        maxProperties: data.maxProperties,
        maxBeds: data.maxBeds,
        priceMonthly: data.price,
        features: data.features,
      }),
    });
  }
};
