import { listAll, listByOwner, getById } from '@/app/owner/owner_lib/owner_api/owner_properties/OwnerRead';
import { OwnerCreate as create } from '@/app/owner/owner_lib/owner_api/owner_properties/OwnerCreate';
import { adminRequest } from '@/app/owner/owner_lib/owner_api/AdminClient';
export * from '@/app/owner/owner_lib/owner_api/owner_properties/OwnerTypes';

export const propertiesApi = {
  listAll,
  listByOwner,
  getById,
  create,

  // Backend API async methods
  fetchProperties: async () => {
    try {
      const data = await adminRequest<any[]>('/properties');
      return data;
    } catch (e) {
      return listAll();
    }
  },

  fetchPropertyById: async (id: string) => {
    try {
      const data = await adminRequest<any>(`/properties/${id}`);
      return data;
    } catch (e) {
      return getById(id);
    }
  },

  createBackendProperty: async (propertyData: Record<string, unknown>) => {
    return adminRequest<any>('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  updateBackendProperty: async (id: string, propertyData: Record<string, unknown>) => {
    return adminRequest<any>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  },

  deleteBackendProperty: async (id: string) => {
    return adminRequest<any>(`/properties/${id}`, {
      method: 'DELETE',
    });
  }
};
