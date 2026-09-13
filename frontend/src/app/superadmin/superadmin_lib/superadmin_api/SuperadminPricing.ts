
import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

import type { PricingRule } from '@/lib/types/contract';

export const pricingApi = {
  listByProperty: (propertyId: string): PricingRule[] => {
    return db.getAll<PricingRule>(STORAGE_KEYS.PRICING_RULES).filter(r => r.propertyId === propertyId && !r?.isDeleted);
  },

  create: (data: Omit<PricingRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isDeleted'>, actorId: string): PricingRule => {
    const newRule = {
      ...data,
      id: createId('prc'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: actorId,
      updatedBy: actorId,
      isDeleted: false
    } as PricingRule;
    db.insert(STORAGE_KEYS.PRICING_RULES, newRule as unknown as import('@/lib/storage/db').BaseEntity as unknown as import('@/lib/storage/db').BaseEntity);
    return newRule;
  },

  delete: (id: string, actorId: string) => {
    db.update<PricingRule>(STORAGE_KEYS.PRICING_RULES, id, { 
      isDeleted: true,
      updatedAt: new Date().toISOString(),
      updatedBy: actorId
    });
  }
};
