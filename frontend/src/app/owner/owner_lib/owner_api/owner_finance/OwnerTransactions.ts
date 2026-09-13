import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { createId } from '@/lib/utils/id';

import type { Invoice, Payment, Expense } from '@/app/owner/owner_lib/owner_api/owner_finance/OwnerTypes';

export function listInvoices(propertyId: string) {
  return db.getAll<Invoice>(STORAGE_KEYS.INVOICES).filter(i => i.propertyId === propertyId && !i.isDeleted);
}

export function recordCashPayment(data: Partial<Payment>, actorId: string, invoiceId?: string) {
  const payment: Payment = {
    id: createId('pay'),
    propertyId: data.propertyId!,
    studentId: data.studentId!,
    amount: data.amount!,
// @ts-expect-error
    method: data.method as unknown,
    date: new Date().toISOString(),
    referenceNo: data.referenceNo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: actorId,
    updatedBy: actorId,
    isDeleted: false
  };
  db.insert(STORAGE_KEYS.PAYMENTS, payment);

  if (invoiceId) {
    db.update<Invoice>(STORAGE_KEYS.INVOICES, invoiceId, {
      status: 'paid',
      updatedAt: new Date().toISOString(),
      updatedBy: actorId
    });
    // Also deduct from student dues
    const student = db.getById<any>(STORAGE_KEYS.STUDENTS, data.studentId!);
    if (student) {
      db.update<any>(STORAGE_KEYS.STUDENTS, data.studentId!, {
        duesAmount: Math.max(0, (student.duesAmount || 0) - data.amount!),
        updatedAt: new Date().toISOString()
      });
    }
  }
}

export function updateElectricityBill(invoiceId: string, amount: number, imageUrl: string, actorId: string) {
  db.update<Invoice>(STORAGE_KEYS.INVOICES, invoiceId, {
    electricityBillAmount: amount,
    electricityBillImage: imageUrl,
    updatedAt: new Date().toISOString(),
    updatedBy: actorId
  });

  const invoice = db.getById<Invoice>(STORAGE_KEYS.INVOICES, invoiceId);
  if (invoice && invoice.studentId) {
    const student = db.getById<any>(STORAGE_KEYS.STUDENTS, invoice.studentId);
    if (student) {
      db.update<any>(STORAGE_KEYS.STUDENTS, student.id, {
        duesAmount: (student.duesAmount || 0) + amount,
        updatedAt: new Date().toISOString()
      });
    }
  }
}

export function createExpense(data: Partial<Expense>, actorId: string) {
  const expense: Expense = {
    id: createId('exp'),
    propertyId: data.propertyId!,
// @ts-expect-error
    category: data.category as unknown,
    amount: data.amount!,
    date: new Date().toISOString(),
    description: data.description!,
    recordedBy: actorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: actorId,
    updatedBy: actorId,
    isDeleted: false
  };
  db.insert(STORAGE_KEYS.EXPENSES, expense);
}
