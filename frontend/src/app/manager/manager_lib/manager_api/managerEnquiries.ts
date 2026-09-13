import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

import type { BaseEntity } from '@/lib/types';
export type EnquiryStatus = 'new' | 'contacted' | 'visited' | 'interested' | 'booked' | 'lost' | 'converted';
export interface Enquiry extends BaseEntity {
  propertyId: string;
  name: string;
  phone: string;
  email?: string;
  expectedMoveIn?: string;
  budget?: number;
  status: EnquiryStatus;
  lossReason?: string;
  notes?: string;
  assignedManagerId?: string;
  referredByStudentId?: string;
}
export const managerEnquiriesApi = {
  listByProperty: (propertyId: string): Enquiry[] => {
    if (!propertyId) return [];
    // Auto-seed to ensure page isn't empty for demo
    const existing = db.getAll<Enquiry>(STORAGE_KEYS.ENQUIRIES).filter(e => e.propertyId === propertyId);
    if (existing.length === 0) {
      db.insert(STORAGE_KEYS.ENQUIRIES, {
        id: createId('enq'), propertyId, name: 'Vikram Singh', phone: '9988776655', email: 'vikram@example.com',
        status: 'new', expectedMoveIn: new Date().toISOString(), budget: 9000, notes: 'Looking for a single room.', isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'system', updatedBy: 'system'
      });
      db.insert(STORAGE_KEYS.ENQUIRIES, {
        id: createId('enq'), propertyId, name: 'Priya Verma', phone: '9123456789',
        status: 'contacted', budget: 7000, isDeleted: false, createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString(), createdBy: 'system', updatedBy: 'system'
      });
      db.insert(STORAGE_KEYS.ENQUIRIES, {
        id: createId('enq'), propertyId, name: 'Rohan Gupta', phone: '9876543210',
        status: 'visited', isDeleted: false, createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date().toISOString(), createdBy: 'system', updatedBy: 'system'
      });
    }
    return db.getAll<Enquiry>(STORAGE_KEYS.ENQUIRIES)
             .filter(e => e.propertyId === propertyId && !e.isDeleted)
             .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getById: (id: string): Enquiry | null => {
    return db.getById<Enquiry>(STORAGE_KEYS.ENQUIRIES, id) || null;
  },
  create: (data: Partial<Enquiry> & { propertyId: string, assignedManagerId?: string }): Enquiry => {
    const newEnquiry: Enquiry = {
      id: createId('enq'),
      propertyId: (data as Record<string, unknown>).propertyId as string,
      name: ((data as Record<string, unknown>).name as string) || '',
      phone: ((data as Record<string, unknown>).phone as string) || '',
      email: ((data as Record<string, unknown>).email as string) || '',
      expectedMoveIn: ((data as Record<string, unknown>).expectedMoveIn as string) || '',
      budget: ((data as Record<string, unknown>).budget as number) || 0,
      status: ((data as Record<string, unknown>).status as EnquiryStatus) || 'new',
      notes: ((data as Record<string, unknown>).notes as string) || '',
      assignedManagerId: (data as Record<string, unknown>).assignedManagerId as string | undefined,
      referredByStudentId: (data as Record<string, unknown>).referredByStudentId as string | undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: ((data as Record<string, unknown>).assignedManagerId as string) || 'system',
      updatedBy: ((data as Record<string, unknown>).assignedManagerId as string) || 'system',
      isDeleted: false
    };
    db.insert(STORAGE_KEYS.ENQUIRIES, newEnquiry);
    db.insert(STORAGE_KEYS.AUDIT_LOGS, {
      id: createId('aud'),
      action: 'ENQUIRY_CREATED',
      actorId: (data as Record<string, unknown>).assignedManagerId || 'system',
      targetId: newEnquiry.id,
      details: `Created enquiry for ${newEnquiry.name}${data.referredByStudentId ? ' (Referral)' : ''}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: ((data as Record<string, unknown>).assignedManagerId as string) || 'system',
      updatedBy: ((data as Record<string, unknown>).assignedManagerId as string) || 'system',
      isDeleted: false
    });
    return newEnquiry;
  },
  updateStatus: (id: string, status: EnquiryStatus, managerId: string, lossReason?: string) => {
    const enq = db.getById<Enquiry>(STORAGE_KEYS.ENQUIRIES, id);
    if (!enq) return;
    const updateData: unknown = { 
      status, 
      updatedAt: new Date().toISOString(),
      updatedBy: managerId
    };
    if (lossReason !== undefined) {
      (updateData as Record<string, unknown>).lossReason = lossReason;
    }
    db.update<Enquiry>(STORAGE_KEYS.ENQUIRIES, id, updateData as Partial<Enquiry>);
    // If converted/booked and it was a referral, grant reward
    if ((status === 'booked' || status === 'converted') && enq.referredByStudentId && enq.status !== 'booked' && enq.status !== 'converted') {
      const allStudents = db.getAll<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.STUDENTS);
      const student = allStudents.find((t: BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }) => t.userId === enq.referredByStudentId);
      if (student) {
        db.update<BaseEntity & { propertyId?: string; isDeleted?: boolean; [key: string]: unknown }>(STORAGE_KEYS.STUDENTS, student.id, {
          pendingReferralRewards: (Number(student.pendingReferralRewards) || 0) + 1
        });
      }
    }
    db.insert(STORAGE_KEYS.AUDIT_LOGS, {
      id: createId('aud'),
      action: 'ENQUIRY_STATUS_UPDATE',
      actorId: managerId,
      targetId: id,
      details: `Status changed to ${status}${lossReason ? ` (Reason: ${lossReason})` : ''}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: managerId,
      updatedBy: managerId,
      isDeleted: false
    });
  }
};