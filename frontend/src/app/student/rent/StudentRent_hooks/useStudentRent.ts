// RESPONSIBILITY: Business logic + state for the Student Rent & Payments screen.
// DATA FLOW: GET /student/invoices + POST /student/invoices/:id/pay -> useStudentRent -> StudentRentMain

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import {
  normalizeInvoices,
  type StudentInvoice,
} from '@/app/student/student_lib/student_api/StudentTypes';
import { useStudentContext } from '@/app/student/student_components/StudentContext';
import {
  isInvoiceOutstanding,
  isInvoicePaid,
  PAYMENT_METHODS,
  type PaymentMethod,
} from '@/lib/constants/domain';

export interface UseStudentRentResult {
  loading: boolean;
  paying: boolean;
  error: string | null;
  pendingInvoices: StudentInvoice[];
  paidInvoices: StudentInvoice[];
  totalDuePaise: number;
  totalPaidPaise: number;
  securityDepositPaise: number;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  payInvoice: (invoice: StudentInvoice) => Promise<boolean>;
  refetch: () => Promise<void>;
  paymentMethods: readonly PaymentMethod[];
}

export function useStudentRent(): UseStudentRentResult {
  const { profile } = useStudentContext();
  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentOperationsApi.getInvoices();
      setInvoices(normalizeInvoices(data));
    } catch (e: unknown) {
      console.error('[useStudentRent] Failed to load invoices:', e);
      setInvoices([]);
      setError(e instanceof Error ? e.message : 'Failed to load your invoices.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInvoices();
  }, [loadInvoices]);

  const { pendingInvoices, paidInvoices, totalDuePaise, totalPaidPaise } = useMemo(() => {
    const pending = invoices
      .filter(invoice => isInvoiceOutstanding(invoice.status))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const paid = invoices
      .filter(invoice => isInvoicePaid(invoice.status))
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    return {
      pendingInvoices: pending,
      paidInvoices: paid,
      totalDuePaise: pending.reduce((sum, invoice) => sum + invoice.duePaise, 0),
      totalPaidPaise: paid.reduce((sum, invoice) => sum + invoice.paidPaise, 0),
    };
  }, [invoices]);

  const payInvoice = useCallback(
    async (invoice: StudentInvoice): Promise<boolean> => {
      setPaying(true);
      try {
        await studentOperationsApi.payInvoice(invoice.id, undefined, paymentMethod);
        toast.success(`Payment of ${invoice.invoiceNumber || invoice.id.slice(0, 8)} recorded via ${paymentMethod}.`);
        await loadInvoices();
        return true;
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Payment failed');
        return false;
      } finally {
        setPaying(false);
      }
    },
    [paymentMethod, loadInvoices]
  );

  return {
    loading,
    paying,
    error,
    pendingInvoices,
    paidInvoices,
    totalDuePaise,
    totalPaidPaise,
    securityDepositPaise: profile?.securityDeposit ?? 0,
    paymentMethod,
    setPaymentMethod,
    payInvoice,
    refetch: loadInvoices,
    paymentMethods: PAYMENT_METHODS,
  };
}