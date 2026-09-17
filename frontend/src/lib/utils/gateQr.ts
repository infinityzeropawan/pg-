// RESPONSIBILITY: Parses the text decoded from a gate QR poster.
//
// Mirrors `backend/src/utils/gateQr.ts`: a poster encodes either a bare
// `spg1.<propertyId>.<signature>` token, or a deep link that carries it as `?gate=`.
// The signature itself is verified on the server — the client only extracts it.

export const GATE_TOKEN_PREFIX = 'spg1';

/** Extracts the gate token from raw scan text / deep-link URL, or `null`. */
export function extractGateToken(payload: string | null | undefined): string | null {
  if (typeof payload !== 'string') return null;
  const trimmed = payload.trim();
  if (!trimmed) return null;

  // Bare token: `spg1.<uuid>.<signature>` contains no URL syntax at all.
  if (!trimmed.includes('/') && !trimmed.includes('?')) {
    return trimmed.startsWith(`${GATE_TOKEN_PREFIX}.`) ? trimmed : null;
  }

  try {
    const token = new URL(trimmed).searchParams.get('gate');
    if (token) return token;
  } catch {
    // Not an absolute URL — fall through to the manual parse below.
  }

  const match = /[?&]gate=([^&#]+)/.exec(trimmed);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

/** True when the decoded text looks like a gate poster (token or deep link). */
export function isGateQrPayload(payload: string | null | undefined): boolean {
  return extractGateToken(payload) !== null;
}

/**
 * Absolute URL encoded into the poster QR. The origin defaults to the browser's own
 * origin, so a poster printed from production always links to production.
 */
export function buildScanUrl(scanPath: string, origin?: string): string {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}${scanPath}`;
}