import { AdminClient } from './AdminClient';

export const foodApi = {
  getByPropertyAsync: async (propertyId: string) => {
    try {
      const res = await AdminClient.get('/admin/food-menu');
      if (res.data?.success && res.data.data?.weekMenuJson) {
        return JSON.parse(res.data.data.weekMenuJson);
      }
    } catch (e) {
      console.error('Failed to fetch food menu from backend API:', e);
    }
    return null;
  },
  saveAsync: async (propertyId: string, menu: any) => {
    try {
      await AdminClient.put('/admin/food-menu', {
        weekMenuJson: JSON.stringify(menu),
      });
      return true;
    } catch (e) {
      console.error('Failed to save food menu to backend API:', e);
      return false;
    }
  },
  getByProperty: (propertyId: string) => null,
  save: (propertyId: string, menu: any) => {}
};
