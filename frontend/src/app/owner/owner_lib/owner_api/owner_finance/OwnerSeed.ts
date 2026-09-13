import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

import type { Invoice, Payment, Expense } from '@/app/owner/owner_lib/owner_api/owner_finance/OwnerTypes';

export function seedMocksIfEmpty(_ownerId?: string) {
  // No-op: mock seeding deleted
}

export function seedMonthlyInvoices(propertyId: string) {
  if (!propertyId) return;
  const now = new Date();
  const currentMonthStr = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
  
  const activeStudents = db.getAll<any>(STORAGE_KEYS.STUDENTS).filter(t => t.propertyId === propertyId && (t.status === 'active' || t.status === 'on_notice') && !t.isDeleted);
  const existingInvoices = db.getAll<Invoice>(STORAGE_KEYS.INVOICES).filter(i => i.propertyId === propertyId && i.month === currentMonthStr && !i.isDeleted);
  
  let createdCount = 0;
  activeStudents.forEach(student => {
    const hasInvoice = existingInvoices.some(i => i.studentId === student.id);
    if (!hasInvoice) {
      let invAmount = student.rentAmount || 0;
      let isDiscounted = false;

      // Apply 20% Referral Discount if applicable
      if (student.pendingReferralRewards && student.pendingReferralRewards > 0) {
        const discount = Math.round(invAmount * 0.20);
        invAmount = invAmount - discount;
        isDiscounted = true;
        
        db.update<any>(STORAGE_KEYS.STUDENTS, student.id, {
          pendingReferralRewards: student.pendingReferralRewards - 1,
          duesAmount: (student.duesAmount || 0) + invAmount,
          updatedAt: now.toISOString()
        });
      } else {
        db.update<any>(STORAGE_KEYS.STUDENTS, student.id, {
          duesAmount: (student.duesAmount || 0) + invAmount,
          updatedAt: now.toISOString()
        });
      }

      db.insert(STORAGE_KEYS.INVOICES, {
        id: createId('inv'),
        propertyId,
        studentId: student.id,
        amount: invAmount,
        status: 'pending',
        dueDate: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(), // 5th of the month
        month: currentMonthStr,
        notes: isDiscounted ? 'Includes -20% Referral Bonus' : '',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isDeleted: false
      });
      createdCount++;
    }
  });
  return createdCount;
}
