import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

import type { BaseEntity } from '@/lib/types';

export interface Enquiry extends BaseEntity {
  propertyId: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  status: 'new' | 'contacted' | 'closed';
}

export const enquiriesApi = {
  create(data: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isDeleted' | 'status'>) {
// @ts-expect-error
    const enq: Enquiry = {
      id: createId('enq'),
      ...data,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'public',
      updatedBy: 'public',
      isDeleted: false
    };
    return db.insert(STORAGE_KEYS.ENQUIRIES, enq);
  }
};
