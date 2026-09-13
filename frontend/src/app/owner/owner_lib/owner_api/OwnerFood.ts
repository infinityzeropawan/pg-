import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';

export const foodApi = {
  getByProperty: (propertyId: string) => {
    return db.getAll<any>(STORAGE_KEYS.MENUS).find((m: any) => m.propertyId === propertyId) || {
      id: propertyId, status: 'Active',
      dailyMenu: { monday: {}, tuesday: {}, wednesday: {}, thursday: {}, friday: {}, saturday: {}, sunday: {} }
    };
  },
  save: (propertyId: string, menu: any) => {}
};
