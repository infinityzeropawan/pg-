'use client';

// RESPONSIBILITY: Renders the Student Rent & Payments UI.
// DATA FLOW: useStudentRent.ts -> StudentRentMain.tsx

import { useState } from 'react';
import {
  IndianRupee,
  CheckCircle,
  Download,
  Clock,
  CreditCard,
  Smartphone,
  Banknote,
  AlertTriangle,
} from 'lucide-react';

import { useStudentRent } from '@/app/student/rent/StudentRent_hooks/useStudentRent';
import { formatPaise } from '@/lib/utils/money';
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from '@/lib/constants/domain';
import type { StudentInvoice } from '@/app/student/student_lib/student_api/StudentTypes';

const METHOD_ICONS: Record<PaymentMethod, typeof Smartphone> = {
  UPI: Smartphone,
  CARD: CreditCard,
  BANK_TRANSFER: Banknote,
};

function formatDay(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN');
}

function formatMonth(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}

function invoiceLabel(invoice: StudentInvoice): string {
  return invoice.invoiceNumber || `#${invoice.id.substring(0, 8).toUpperCase()}`;
}

export function StudentRentMain() {
  const {
    loading,
    paying,
    error,
    pendingInvoices,
    paidInvoices,
    totalDuePaise,
    securityDepositPaise,
    paymentMethod,
    setPaymentMethod,
    payInvoice,
    paymentMethods,
  } = useStudentRent();

  const [payTarget, setPayTarget] = useState<StudentInvoice | null>(null);

  if (loading) {
    return (
      <div className="p-4 md:p-6 motion-safe:animate-pulse text-secondary">
        Loading rent details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-card border border-border rounded-[var(--radius-lg)] text-center">
        <AlertTriangle className="w-8 h-8 text-danger mx-auto mb-3" />
        <p className="font-bold text-primary">Unable to load your invoices</p>
        <p className="text-sm text-secondary mt-1">{error}</p>
      </div>
    );
  }

  const oldestDue = pendingInvoices[0] ?? null;

  const handleConfirmPay = async () => {
    if (!payTarget) return;
    const ok = await payInvoice(payTarget);
    if (ok) setPayTarget(null);
  };

  return (
    <div className="space-y-6 w-full pb-20 print:pb-0">
      <div className="print:hidden">
        <h1 className="text-[24px] font-black text-primary flex items-center gap-2">
          💳 Rent &amp; Payments
        </h1>
        <p className="text-sm text-secondary mt-1">
          Manage your monthly rent, security deposit, and payment history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
        {/* Pending Dues */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Clock className="w-5 h-5 text-danger" /> Pending Rent &amp; Dues
            </h3>
            {oldestDue ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Invoice {invoiceLabel(oldestDue)}</span>
                  <span className="font-medium text-primary text-xs">
                    {oldestDue.billingMonth || formatMonth(oldestDue.dueDate)}
                  </span>
                </div>

                {oldestDue.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-secondary">{item.title}</span>
                    <span className="font-medium text-primary">{formatPaise(item.amountPaise)}</span>
                  </div>
                ))}

                <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                  <span className="font-black text-primary uppercase text-sm">Total Due</span>
                  <span className="font-black text-2xl text-danger">{formatPaise(totalDuePaise)}</span>
                </div>

                {pendingInvoices.length > 1 && (
                  <div className="text-xs text-secondary">
                    Across {pendingInvoices.length} open invoices
                  </div>
                )}

                <div className="text-xs font-bold text-danger bg-danger-bg p-2 rounded text-center">
                  Due Date: {formatDay(oldestDue.dueDate)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center h-full">
                <CheckCircle className="w-12 h-12 text-success mb-3" />
                <div className="font-black text-lg text-primary">No Pending Dues!</div>
                <div className="text-sm text-secondary mt-1">
                  You are all caught up on your rent.
                </div>
              </div>
            )}
          </div>

          {oldestDue && (
            <button
              onClick={() => setPayTarget(oldestDue)}
              className="mt-6 w-full py-3 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-primary-hover transition-colors"
            >
              Pay {formatPaise(oldestDue.duePaise)}
            </button>
          )}
        </div>

        {/* Security Deposit */}
        <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
          <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
            <IndianRupee className="w-5 h-5 text-primary" /> Security Deposit
          </h3>
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="text-3xl font-black text-primary">{formatPaise(securityDepositPaise)}</div>
            <div className="text-xs font-bold text-secondary uppercase mt-2">Held with the PG</div>
            <div className="text-xs text-secondary mt-4 bg-input p-3 rounded-[var(--radius-sm)] border border-border">
              Refundable after clearance, subject to the notice period and a joint room inspection.
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-card border border-border rounded-[var(--radius-lg)] p-6 shadow-sm">
        <h3 className="font-black text-primary text-lg mb-4 flex items-center gap-2 border-b border-border pb-3">
          <Download className="w-5 h-5 text-secondary" /> Payment History
        </h3>

        {paidInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-input text-secondary text-xs uppercase font-bold">
                <tr>
                  <th className="px-4 py-3 rounded-tl-[var(--radius-sm)] text-left">Invoice</th>
                  <th className="px-4 py-3 text-left">Month</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Due Date</th>
                  <th className="px-4 py-3 rounded-tr-[var(--radius-sm)] text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paidInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-input transition-colors">
                    <td className="px-4 py-3 font-medium text-primary">{invoiceLabel(invoice)}</td>
                    <td className="px-4 py-3 text-secondary">
                      {invoice.billingMonth || formatMonth(invoice.dueDate)}
                    </td>
                    <td className="px-4 py-3 font-bold text-primary">
                      {formatPaise(invoice.paidPaise)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-success font-bold text-xs bg-success-bg px-2 py-1 rounded">
                        <CheckCircle className="w-3 h-3" /> Paid
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary">{formatDay(invoice.dueDate)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => window.print()}
                        className="text-primary hover:underline font-bold text-xs inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-secondary bg-input p-4 rounded-lg text-center">
            No payment history available yet.
          </div>
        )}
      </div>
{/* Pay Modal */}
      {payTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-[var(--radius-lg)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-border flex justify-between items-center bg-input">
              <h2 className="text-lg font-black text-primary flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" /> Complete Payment
              </h2>
              <button
                onClick={() => setPayTarget(null)}
                className="text-secondary hover:text-primary font-bold"
              >
                X
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="text-center">
                <div className="text-sm font-bold text-secondary uppercase mb-1">Total Amount</div>
                <div className="text-4xl font-black text-primary">{formatPaise(payTarget.duePaise)}</div>
                <div className="text-xs text-secondary mt-2">Invoice {invoiceLabel(payTarget)}</div>
              </div>

              <div>
                <div className="text-sm font-bold text-secondary uppercase mb-3 border-b border-border pb-1">
                  Select Payment Method
                </div>
                <div className="space-y-2">
                  {paymentMethods.map(method => {
                    const Icon = METHOD_ICONS[method];
                    const isSelected = paymentMethod === method;
                    return (
                      <label
                        key={method}
                        className={`flex items-center gap-3 p-3 rounded-[var(--radius-md)] border cursor-pointer transition-colors ${
                          isSelected ? 'border-primary bg-primary-subtle' : 'border-border hover:bg-input'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pay_method"
                          checked={isSelected}
                          onChange={() => setPaymentMethod(method)}
                          className="accent-primary"
                        />
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-secondary'}`} />
                        <span className={`font-bold text-sm ${isSelected ? 'text-primary' : 'text-secondary'}`}>
                          {PAYMENT_METHOD_LABELS[method]}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-border bg-input">
              <button
                onClick={handleConfirmPay}
                disabled={paying}
                className="w-full py-3 bg-primary text-white rounded-[var(--radius-md)] font-bold shadow-md hover:bg-primary-hover transition-colors disabled:opacity-60"
              >
                {paying ? 'Processing...' : `Pay ${formatPaise(payTarget.duePaise)} via ${paymentMethod}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
