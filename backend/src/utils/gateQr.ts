import crypto from 'crypto';

import { ENV } from '../config/env';

/**
 * Gate QR tokens for the printed attendance poster.
 *
 * The QR pasted on the PG wall must not simply carry the property id: anyone
 * could then craft a payload for a property they do not live in. The token is
 * therefore signed with a server-side secret.
 *
 * The token is deliberately stateless — `HMAC(secret, prefix:propertyId)` — so a
 * printed poster stays valid for its whole lifetime with no database column and
 * no rotation job:
 *
 *   `spg1.<propertyId>.<base64url(hmac-sha256)>`
 *
 * Only the signature is sent to the browser; the secret never leaves the server.
 */
const TOKEN_PREFIX = 'spg1';

/** Number of parts in a well-formed token: `spg1.<propertyId>.<signature>`. */
const TOKEN_PART_COUNT = 3;

function sign(propertyId: string): string {
  return crypto
    .createHmac('sha256', ENV.GATE_QR_SECRET)
    .update(`${TOKEN_PREFIX}:${propertyId}`)
    .digest('base64url');
}

/** Builds the token embedded in a property's gate QR poster. */
export function signGateToken(propertyId: string): string {
  if (!propertyId) throw new Error('Property ID is required to sign a gate token');
  return `${TOKEN_PREFIX}.${propertyId}.${sign(propertyId)}`;
}

/**
 * Resolves the property a scanned token belongs to, or `null` when the token is
 * malformed or the signature does not match (tampered / forged).
 */
export function verifyGateToken(token: string | null | undefined): string | null {
  if (typeof token !== 'string') return null;

  const parts = token.trim().split('.');
  if (parts.length !== TOKEN_PART_COUNT) return null;

  const [prefix, propertyId, provided] = parts as [string, string, string];
  if (prefix !== TOKEN_PREFIX || !propertyId || !provided) return null;

  const expected = sign(propertyId);
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);

  // timingSafeEqual throws on length mismatch, so compare lengths first.
  if (providedBuf.length !== expectedBuf.length) return null;
  return crypto.timingSafeEqual(providedBuf, expectedBuf) ? propertyId : null;
}

/**
 * Extracts a gate token from whatever the camera decoded: either a bare token or
 * a deep link such as `https://app.example.com/student/attendance?gate=<token>`.
 */
export function extractGateToken(payload: string | null | undefined): string | null {
  if (typeof payload !== 'string') return null;
  const trimmed = payload.trim();
  if (!trimmed) return null;

  // Bare token: `spg1.<uuid>.<signature>` has no URL structure at all.
  if (!trimmed.includes('/') && !trimmed.includes('?')) {
    return trimmed.startsWith(`${TOKEN_PREFIX}.`) ? trimmed : null;
  }

  try {
    const url = new URL(trimmed);
    return url.searchParams.get('gate');
  } catch {
    // Fall back to a manual `?gate=` parse for payloads that are not absolute URLs.
    const match = /[?&]gate=([^&#]+)/.exec(trimmed);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }
}

/** The in-app route a poster QR deep-links to (origin is added by the browser). */
export function gateScanPath(token: string): string {
  return `/student/attendance?gate=${encodeURIComponent(token)}`;
}
