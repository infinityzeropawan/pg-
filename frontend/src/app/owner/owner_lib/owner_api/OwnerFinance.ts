import { getStats } from '@/app/owner/owner_lib/owner_api/owner_finance/OwnerStats';
import { listInvoices, recordCashPayment, updateElectricityBill, createExpense } from '@/app/owner/owner_lib/owner_api/owner_finance/OwnerTransactions';
import { seedMocksIfEmpty, seedMonthlyInvoices } from '@/app/owner/owner_lib/owner_api/owner_finance/OwnerSeed';
export * from '@/app/owner/owner_lib/owner_api/owner_finance/OwnerTypes';

export const financeApi = {
  getStats,
  listInvoices,
  recordCashPayment,
  updateElectricityBill,
  createExpense,
  seedMocksIfEmpty,
  seedMonthlyInvoices
};
