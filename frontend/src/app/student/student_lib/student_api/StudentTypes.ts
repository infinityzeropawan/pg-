/**
 * RESPONSIBILITY: Student portal domain types + normalisers.
 *
 * The API returns raw Prisma records (UPPERCASE enums, paise amounts, nested `items`).
 * Every screen must consume the normalised types below so field/enum drift cannot
 * reintroduce the "wrong casing shows the wrong number" class of bug.
 */

import { outstandingPaise as calcOutstanding } from '@/lib/utils/money';

// ── Raw API shapes ──────────────────────────────────────────────
export interface ApiInvoiceItem {
  id?: string;
  title?: string;
  amount?: number;
}

export interface ApiInvoice {
  id?: string;
  invoiceNumber?: string;
  billingMonth?: string;
  status?: string;
  dueDate?: string;
  totalAmount?: number;
  paidAmount?: number;
  items?: ApiInvoiceItem[];
}

// ── Normalised domain shapes ────────────────────────────────────
export interface StudentInvoiceLine {
  id: string;
  title: string;
  amountPaise: number;
}

export interface StudentInvoice {
  id: string;
  invoiceNumber: string;
  billingMonth: string;
  /** UPPERCASE Prisma enum value, e.g. 'ISSUED'. */
  status: string;
  dueDate: string;
  totalPaise: number;
  paidPaise: number;
  /** Remaining balance in paise. */
  duePaise: number;
  items: StudentInvoiceLine[];
}

export interface StudentMealOrder {
  id: string;
  mealType: string;
  date: string;
  rating: number | null;
  feedback: string | null;
}

export interface StudentMessWallet {
  balancePaise: number;
}

export interface StudentMessPayload {
  menu: { today: Record<string, string> | null; week?: Record<string, unknown> } | null;
  messMenuItems: unknown[];
  wallet: StudentMessWallet | null;
  recentOrders: StudentMealOrder[];
}

export interface StudentLeave {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface StudentVisitor {
  id: string;
  visitorName: string;
  visitorPhone: string;
  purpose: string;
  checkInTime: string;
  checkOutTime: string | null;
}

export interface StudentComplaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  resolvedAt: string | null;
}

export interface StudentDocumentRecord {
  id: string;
  type: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export interface StudentRentAgreement {
  id: string;
  agreementUrl: string;
  startDate: string;
  endDate: string;
  isSignedByTenant: boolean;
  isSignedByOwner: boolean;
}

export interface StudentHistoryEntry {
  type: string;
  action: string;
  date: string;
  data: unknown;
}

export interface StudentGateLog {
  id: string;
  type: string;
  reason: string | null;
  destination: string | null;
  expectedReturnTime: string | null;
  isLate: boolean;
  loggedBy: string | null;
  timestamp: string;
  createdAt: string;
}

export interface StudentNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  sentAt: string;
}

// ── Normalisers ────────────────────────────────────────────────
export function normalizeInvoice(raw: ApiInvoice | null | undefined): StudentInvoice | null {
  if (!raw?.id) return null;
  const totalPaise = Number(raw.totalAmount ?? 0);
  const paidPaise = Number(raw.paidAmount ?? 0);
  return {
    id: String(raw.id),
    invoiceNumber: String(raw.invoiceNumber ?? ''),
    billingMonth: String(raw.billingMonth ?? ''),
    status: String(raw.status ?? '').toUpperCase(),
    dueDate: String(raw.dueDate ?? new Date().toISOString()),
    totalPaise,
    paidPaise,
    duePaise: calcOutstanding(totalPaise, paidPaise),
    items: (raw.items ?? []).map((item, index) => ({
      id: String(item.id ?? `item-${index}`),
      title: String(item.title ?? 'Charge'),
      amountPaise: Number(item.amount ?? 0),
    })),
  };
}

export function normalizeInvoices(raw: unknown): StudentInvoice[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(invoice => normalizeInvoice(invoice as ApiInvoice))
    .filter((invoice): invoice is StudentInvoice => invoice !== null);
}

export function normalizeMessPayload(raw: unknown): StudentMessPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const payload = raw as Record<string, any>;
  const walletRaw = payload.wallet;
  return {
    menu: payload.menu ?? null,
    messMenuItems: Array.isArray(payload.messMenuItems) ? payload.messMenuItems : [],
    wallet: walletRaw ? { balancePaise: Number(walletRaw.balance ?? 0) } : null,
    recentOrders: Array.isArray(payload.recentOrders)
      ? payload.recentOrders.map((order: any) => ({
          id: String(order.id),
          mealType: String(order.mealType ?? ''),
          date: String(order.date ?? order.createdAt ?? ''),
          rating: order.rating ?? null,
          feedback: order.feedback ?? null,
        }))
      : [],
  };
}

export function normalizeComplaints(raw: unknown): StudentComplaint[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((c: any) => ({
    id: String(c.id),
    title: String(c.title ?? ''),
    description: String(c.description ?? ''),
    category: String(c.category ?? ''),
    status: String(c.status ?? '').toUpperCase(),
    priority: String(c.priority ?? '').toUpperCase(),
    createdAt: String(c.createdAt ?? ''),
    resolvedAt: c.resolvedAt ?? null,
  }));
}

export function normalizeLeaves(raw: unknown): StudentLeave[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((l: any) => ({
    id: String(l.id),
    startDate: String(l.startDate ?? ''),
    endDate: String(l.endDate ?? ''),
    reason: String(l.reason ?? ''),
    status: String(l.status ?? '').toUpperCase(),
    createdAt: String(l.createdAt ?? ''),
  }));
}

export function normalizeVisitors(raw: unknown): StudentVisitor[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((v: any) => ({
    id: String(v.id),
    visitorName: String(v.visitorName ?? ''),
    visitorPhone: String(v.visitorPhone ?? ''),
    purpose: String(v.purpose ?? ''),
    checkInTime: String(v.checkInTime ?? ''),
    checkOutTime: v.checkOutTime ?? null,
  }));
}

export function normalizeGateLogs(raw: unknown): StudentGateLog[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((g: any) => ({
    id: String(g.id),
    type: String(g.type ?? '').toUpperCase(),
    reason: g.reason ?? null,
    destination: g.destination ?? null,
    expectedReturnTime: g.expectedReturnTime ?? null,
    isLate: Boolean(g.isLate),
    loggedBy: g.loggedBy ?? null,
    timestamp: String(g.timestamp ?? g.createdAt ?? ''),
    createdAt: String(g.createdAt ?? ''),
  }));
}