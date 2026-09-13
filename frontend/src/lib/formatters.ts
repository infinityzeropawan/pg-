// RESPONSIBILITY: Provides centralized data formatting utilities (Currency, Numbers, Dates).

/**
 * Formats a number as Indian Currency (INR).
 * Example: 123456 -> "?1,23,456.00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a number as compact Indian Currency (INR) for KPIs.
 * Example: 125000 -> "?1.2L"
 */
export function formatCompactCurrency(amount: number): string {
  if (amount >= 10000000) {
    return '₹' + (amount / 10000000).toFixed(2) + 'Cr';
  }
  if (amount >= 100000) {
    return '₹' + (amount / 100000).toFixed(2) + 'L';
  }
  if (amount >= 1000) {
    return '₹' + (amount / 1000).toFixed(2) + 'K';
  }
  return '₹' + amount;
}

/**
 * Formats a number as a percentage.
 * Example: 12.5 -> "12.5%"
 */
export function formatPercentage(value: number): string {
  return value + '%';
}

/**
 * Masks a phone number for privacy (Kanban board requirement).
 * Example: "9876543210" -> "98****3210"
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 10) return phone;
  return phone.slice(0, 2) + '****' + phone.slice(-4);
}
