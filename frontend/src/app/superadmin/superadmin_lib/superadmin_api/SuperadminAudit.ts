import { superadminRequest } from './SuperadminClient';

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entityType?: string;
  entityId: string;
  details?: string;
  createdAt: string;
  actor?: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  [key: string]: unknown;
}

export const auditApi = {
  async getAll(): Promise<AuditLog[]> {
    try {
      const logs = await superadminRequest<any[]>('/audit-logs');
      if (Array.isArray(logs)) {
        return logs.map((l) => ({
          id: l.id,
          actorId: l.actorId,
          action: l.action,
          entityType: l.entityType,
          entityId: l.entityId,
          details: l.details || '',
          createdAt: l.createdAt,
          actor: l.actor,
        }));
      }
    } catch (e) {
      console.error('Failed to fetch audit logs from backend:', e);
    }
    return [];
  }
};
