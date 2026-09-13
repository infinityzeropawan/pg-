import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

import type { Invoice, Payment, Expense } from '@/app/owner/owner_lib/owner_api/owner_finance/OwnerTypes';

export function seedMocksIfEmpty(ownerId: string) {
  const expenses = db.getAll<Expense>(STORAGE_KEYS.EXPENSES);
  if (expenses.length > 0) return;

  const ownerProps = db.getAll<any>(STORAGE_KEYS.PROPERTIES).filter(p => p.ownerId === ownerId);
  if (ownerProps.length === 0) return;

  const propId = ownerProps[0].id;
  
  // Seed diverse expenses for pie chart
  const dummyExpenses = [
    { category: 'maintenance', amount: 4500, desc: 'Plumbing repair' },
    { category: 'electricity', amount: 12000, desc: 'Monthly EB Bill' },
    { category: 'staff_salary', amount: 45000, desc: 'Manager & Guard Salary' },
    { category: 'groceries', amount: 32000, desc: 'Mess Rations' },
    { category: 'water', amount: 3000, desc: 'Water Tanker' }
  ];

  dummyExpenses.forEach(exp => {
    db.insert(STORAGE_KEYS.EXPENSES, {
      id: createId('exp'), propertyId: propId, category: exp.category as unknown, amount: exp.amount, date: new Date().toISOString(),
      description: exp.desc, recordedBy: 'system', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      createdBy: 'system', updatedBy: 'system', isDeleted: false
    });
  });

  // Seed diverse payments for income metrics
  db.insert(STORAGE_KEYS.PAYMENTS, {
    id: createId('pay'), propertyId: propId, studentId: 'dummy1', amount: 25000, method: 'upi', date: new Date().toISOString(),
    referenceNo: 'UPI123456789', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    createdBy: 'system', updatedBy: 'system', isDeleted: false
  });
  db.insert(STORAGE_KEYS.PAYMENTS, {
    id: createId('pay'), propertyId: propId, studentId: 'dummy2', amount: 45000, method: 'bank_transfer', date: new Date().toISOString(),
    referenceNo: 'TRX987654321', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    createdBy: 'system', updatedBy: 'system', isDeleted: false
  });
  
  // Seed a pending invoice
  db.insert(STORAGE_KEYS.INVOICES, {
    id: createId('inv'), propertyId: propId, studentId: 'dummy3', amount: 12000, status: 'pending', dueDate: new Date().toISOString(), month: 'August 2026',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'system', updatedBy: 'system', isDeleted: false
  });
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
