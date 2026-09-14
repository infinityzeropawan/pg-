/**
 * RESPONSIBILITY: Single source of truth for the backend API base URL.
 *
 * RULES:
 *  - Never hardcode `http://localhost:5000` in feature code. Import from here.
 *  - `NEXT_PUBLIC_API_URL` is a build-time value, so an empty/unset value is treated
 *    as "not configured" and resolved explicitly per environment.
 *  - In production an unset value resolves to '' (same-origin relative requests) which
 *    works with the monorepo `vercel.json` rewrites of /api/v1 -> backend service.
 *  - In development an unset value falls back to the local Express server.
 *
 * If production sees no configured base URL, a loud console error is emitted so the
 * misconfiguration is caught in Vercel logs instead of silently failing per request.
 */

const RAW_API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').trim();
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const LOCAL_DEV_BACKEND = 'http://localhost:5000';

function normalizeBaseUrl(raw: string): string {
  if (!raw || raw === '/') return '';
  // Allow an explicit relative reverse-proxy prefix, e.g. "/api-gateway"
  if (raw.startsWith('/')) return raw.replace(/\/+$/, '');
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withScheme.replace(/\/+$/, '');
}

const normalized = normalizeBaseUrl(RAW_API_URL);

/** Resolved base URL. Empty string means "use same-origin relative paths". */
export const API_BASE_URL = normalized || (IS_PRODUCTION ? '' : LOCAL_DEV_BACKEND);

/** True when the deployment target did not supply NEXT_PUBLIC_API_URL. */
export const IS_API_BASE_CONFIGURED = RAW_API_URL.length > 0;

/** True when requests are issued against the current origin. */
export const IS_API_BASE_RELATIVE = API_BASE_URL === '';

/**
 * Builds an absolute (or same-origin) URL for a given API path.
 * `apiUrl('/api/v1/student/profile')` -> 'https://api.example.com/api/v1/student/profile'
 */
export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

let hasWarnedAboutMissingBaseUrl = false;

/**
 * Emits a single actionable warning when the API base URL is not configured.
 * Call this from API clients before their first request.
 */
export function warnIfApiBaseUnconfigured(): void {
  if (hasWarnedAboutMissingBaseUrl || IS_API_BASE_CONFIGURED) return;
  hasWarnedAboutMissingBaseUrl = true;
  const message = IS_PRODUCTION
    ? '[APIConfig] NEXT_PUBLIC_API_URL is not set. Falling back to same-origin requests. ' +
      'If your backend is deployed as a separate Vercel project, set NEXT_PUBLIC_API_URL to its origin.'
    : `[APIConfig] NEXT_PUBLIC_API_URL is not set. Falling back to ${LOCAL_DEV_BACKEND} for local development.`;
  if (IS_PRODUCTION) console.error(message);
  else console.warn(message);
}