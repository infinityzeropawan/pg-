import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';

import type { Property } from '@/app/owner/owner_lib/owner_api/owner_properties/OwnerTypes';

export function listAll(): Property[] {
  return db.getAll<Property>(STORAGE_KEYS.PROPERTIES).filter(p => !p.isDeleted);
}

export function listByOwner(ownerId: string): Property[] {
  const props = db.getAll<Property>(STORAGE_KEYS.PROPERTIES);
  return props.filter(p => p.ownerId === ownerId && !p.isDeleted);
}

export function getById(id: string): Property | null {
  return db.getById<Property>(STORAGE_KEYS.PROPERTIES, id) || null;
}
