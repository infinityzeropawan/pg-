import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

import type { BaseEntity, Role } from '@/lib/types/models';
export interface AuditLog extends BaseEntity {
  [key: string]: unknown;
  actorId: string;
  actorRole: Role;
  action: string;
  entity: string;
  entityId: string;
  meta?: unknown;
}

export const auditApi = {
  write(params: Omit<AuditLog, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isDeleted'>) {
    const log = {
      id: createId('log'),
      ...params,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: params.actorId as string,
      updatedBy: params.actorId as string,
      isDeleted: false
    } as AuditLog;
    return db.insert(STORAGE_KEYS.AUDIT_LOGS, log);
  },
  
  getAll() {
    return db.getAll<AuditLog>(STORAGE_KEYS.AUDIT_LOGS);
  }
};
