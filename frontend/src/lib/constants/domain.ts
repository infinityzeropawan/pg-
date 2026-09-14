/**
 * RESPONSIBILITY: Shared domain enums mirroring the Prisma models in
 * `backend/prisma/schema.prisma`. The API always returns the UPPERCASE enum value,
 * so components must compare against these constants instead of hand-typed strings.
 */

export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  ISSUED: 'ISSUED',
  PAID: 'PAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
} as const;

export type InvoiceStatus = (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

/** Invoices that still need money from the resident. */
export const OUTSTANDING_INVOICE_STATUSES: InvoiceStatus[] = [
  INVOICE_STATUS.DRAFT,
  INVOICE_STATUS.ISSUED,
  INVOICE_STATUS.PARTIALLY_PAID,
  INVOICE_STATUS.OVERDUE,
];

export function isInvoiceOutstanding(status: string | null | undefined): boolean {
  if (!status) return false;
  return OUTSTANDING_INVOICE_STATUSES.includes(status.toUpperCase() as InvoiceStatus);
}

export function isInvoicePaid(status: string | null | undefined): boolean {
  return (status || '').toUpperCase() === INVOICE_STATUS.PAID;
}

export const COMPLAINT_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED',
} as const;

export type ComplaintStatus = (typeof COMPLAINT_STATUS)[keyof typeof COMPLAINT_STATUS];

export const COMPLAINT_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export type ComplaintPriority = (typeof COMPLAINT_PRIORITY)[keyof typeof COMPLAINT_PRIORITY];

/** Human-readable labels for complaint statuses. */
export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
};

export const COMPLAINT_PRIORITY_LABELS: Record<ComplaintPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const STAY_STATUS = {
  BOOKED: 'BOOKED',
  CHECKED_IN: 'CHECKED_IN',
  ACTIVE: 'ACTIVE',
  NOTICE_PERIOD: 'NOTICE_PERIOD',
  CHECKED_OUT: 'CHECKED_OUT',
  CANCELLED: 'CANCELLED',
} as const;

export const LEAVE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

/** Payment methods accepted by the backend `PaymentMethod` enum. */
export const PAYMENT_METHODS = ['UPI', 'CARD', 'BANK_TRANSFER'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  UPI: 'UPI (GPay, PhonePe, Paytm)',
  CARD: 'Credit / Debit Card',
  BANK_TRANSFER: 'Net Banking',
};