import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';

import type { Invoice, Payment, Expense } from '@/app/owner/owner_lib/owner_api/owner_finance/OwnerTypes';

export function getStats(ownerId: string, propertyId?: string) {
  // Determine relevant properties
  let ownerProps = db.getAll<any>(STORAGE_KEYS.PROPERTIES).filter(p => p.ownerId === ownerId);
  if (propertyId && propertyId !== 'all') {
    ownerProps = ownerProps.filter(p => p.id === propertyId);
  }
  const propIds = ownerProps.map(p => p.id);

  // Sum up data (Using mock logic for now since we don't have full pipelines)
  const invoices = db.getAll<Invoice>(STORAGE_KEYS.INVOICES).filter(i => propIds.includes(i.propertyId) && !i.isDeleted);
  const payments = db.getAll<Payment>(STORAGE_KEYS.PAYMENTS).filter(p => propIds.includes(p.propertyId) && !p.isDeleted);
  const expenses = db.getAll<Expense>(STORAGE_KEYS.EXPENSES).filter(e => propIds.includes(e.propertyId) && !e.isDeleted);

  const revenue = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingDues = invoices.filter(i => i.status.toLowerCase() !== 'paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return { revenue, pendingDues, totalExpenses, invoices, payments, expenses };
}
