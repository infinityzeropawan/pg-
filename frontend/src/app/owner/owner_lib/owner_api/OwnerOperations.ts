import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';

export const managerOperationsApi = {
  listComplaints: (propertyId: string) => {
    return db.getAll<any>(STORAGE_KEYS.COMPLAINTS).filter((c: any) => c.propertyId === propertyId);
  }
};
