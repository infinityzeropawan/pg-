import { getStats } from '@/app/owner/owner_lib/owner_api/owner_finance/OwnerStats';
import { listInvoices, recordCashPayment, updateElectricityBill, createExpense } from '@/app/owner/owner_lib/owner_api/owner_finance/OwnerTransactions';
export * from '@/app/owner/owner_lib/owner_api/owner_finance/OwnerTypes';

// NOTE: the browser-side invoice/mock seeding helpers (OwnerSeed.ts) were deleted.
// They generated invoices and referral discounts inside localStorage, so the data
// was private to one browser and never reached the database.
export const financeApi = {
  getStats,
  listInvoices,
  recordCashPayment,
  updateElectricityBill,
  createExpense
};
