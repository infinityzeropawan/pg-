import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

import type { BaseEntity } from '@/lib/types/contract';

export interface FoodMenu extends BaseEntity {
  propertyId: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  monthEndSpecial: string;
}

export const foodApi = {
  getByProperty: (propertyId: string): FoodMenu | null => {
    const menus = db.getAll<FoodMenu>(STORAGE_KEYS.MENUS || 'spg_food_menus');
    return menus.find(m => m.propertyId === propertyId && !m.isDeleted) || null;
  },
  
  save: (propertyId: string, data: Partial<FoodMenu>) => {
    const existing = foodApi.getByProperty(propertyId);
    if (existing) {
      db.update(STORAGE_KEYS.MENUS || 'spg_food_menus', existing.id, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { ...existing, ...data };
    } else {
      const newMenu: FoodMenu = {
        id: createId('StaffFood'),
        propertyId,
        monday: data.monday || '',
        tuesday: data.tuesday || '',
        wednesday: data.wednesday || '',
        thursday: data.thursday || '',
        friday: data.friday || '',
        saturday: data.saturday || '',
        sunday: data.sunday || '',
        monthEndSpecial: data.monthEndSpecial || '',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isDeleted: false
      };
      db.insert(STORAGE_KEYS.MENUS || 'spg_food_menus', newMenu);
      return newMenu;
    }
  }
};
