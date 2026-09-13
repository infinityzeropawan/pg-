import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';

export const pricingApi = {
  listByProperty: (propertyId: string) => {
    return db.getAll<any>(STORAGE_KEYS.PRICING_RULES).filter((r: any) => r.propertyId === propertyId);
  },
  create: (rule: any, ownerId: string) => { return { ...rule, id: Date.now().toString() }; },
  delete: (id: string, ownerId: string) => {}
};
