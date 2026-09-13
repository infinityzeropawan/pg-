import { db } from '@/lib/storage/db';
import { MOCK_REQUESTS } from '../superadmin_mock_data';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

import type { BaseEntity } from '@/lib/types/models';

export interface OwnerRequest extends BaseEntity {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  city: string;
  pgCount: number;
  bedCount: number;
  planId?: string;
  gst?: string;
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Hold';
  [key: string]: unknown;
}

export const ownerRequestsApi = {
  create(data: Omit<OwnerRequest, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isDeleted' | 'status'>) {
    const req = {
      
      id: createId('req'),
      
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'public',
      updatedBy: 'public',
      isDeleted: false
    };
    return db.insert(STORAGE_KEYS.OWNER_REQUESTS, req as unknown as import('@/lib/storage/db').BaseEntity);
  },
  
  list() {
    return db.query<OwnerRequest>(STORAGE_KEYS.OWNER_REQUESTS, r => !r.isDeleted)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  
  getById(id: string) {
    return db.getById<OwnerRequest>(STORAGE_KEYS.OWNER_REQUESTS, id);
  },
  
  updateStatus(id: string, status: 'Approved' | 'Rejected' | 'Hold', reason?: string) {
    const patch: Partial<OwnerRequest> = { status };
    if (reason) patch.message = reason; // Storing reject reason in message for now
    return db.update<OwnerRequest>(STORAGE_KEYS.OWNER_REQUESTS, id, patch);
  }
};

