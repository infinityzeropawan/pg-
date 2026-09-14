import { formatINR } from '@/lib/utils/formatters';

/**
 * RESPONSIBILITY: Single source of truth for currency handling.
 *
 * CONVENTION: The backend stores every monetary value in the smallest currency unit
 * (paise) as an integer — e.g. `totalAmount: 1250000` means ₹12,500. Never divide
 * amounts ad-hoc inside components; always convert through these helpers so Student,
 * Parent, Owner and Manager screens cannot drift apart.
 */

/** Converts a paise amount to whole rupees. */
export function paiseToRupees(paise: number | null | undefined): number {
  const value = Number(paise);
  if (!Number.isFinite(value)) return 0;
  return Math.round(value / 100);
}

/** Converts a rupee amount to paise (for outbound payloads). */
export function rupeesToPaise(rupees: number | null | undefined): number {
  const value = Number(rupees);
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100);
}

/** Formats a paise amount as an Indian currency string, e.g. "₹12,500". */
export function formatPaise(paise: number | null | undefined): string {
  return formatINR(paiseToRupees(paise));
}

/** Outstanding balance for an invoice, in paise. */
export function outstandingPaise(totalAmount: number, paidAmount: number): number {
  return Math.max(0, (Number(totalAmount) || 0) - (Number(paidAmount) || 0));
}