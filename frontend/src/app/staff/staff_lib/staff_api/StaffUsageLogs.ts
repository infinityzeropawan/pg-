
import { db } from '@/lib/storage/db';
import { createId } from '@/lib/utils/id';

import type { BaseEntity } from '@/lib/types/contract';

export interface UsageLog extends BaseEntity {
  id: string;
  propertyId: string;
  itemName: string;
  quantity: number;
  unit: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Other';
  loggedBy: string; // Cook's ID
  date: string;
  createdAt: string;
}

export const usageLogsApi = {
  getByProperty: (propertyId: string): UsageLog[] => {
    return db.getAll<UsageLog>('spg_usage_logs')
      .filter(l => l.propertyId === propertyId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  create: (data: Omit<UsageLog, 'id' | 'createdAt'>) => {
    const newLog = {
      ...data,
      id: createId('usg'),
      createdAt: new Date().toISOString()
    } as UsageLog;
    db.insert('spg_usage_logs', newLog);
    return newLog;
  }
};
