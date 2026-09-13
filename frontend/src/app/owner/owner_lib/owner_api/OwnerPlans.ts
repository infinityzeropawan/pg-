import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';

export const plansApi = {
  listPlans: () => {
    const plans = db.getAll<any>(STORAGE_KEYS.PLANS);
    return plans.map(p => ({
      ...p,
      features: p.features || []
    }));
  }
};
