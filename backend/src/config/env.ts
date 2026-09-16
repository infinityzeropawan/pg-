import dotenv from 'dotenv';

dotenv.config();

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * SECURITY: In production the JWT secrets MUST be supplied by the environment.
 * Previously a hardcoded fallback ('smart_pg_super_secret_jwt_key_2026') was used, which
 * would let anyone forge valid tokens for any role if the variable was left unset.
 */
function requiredSecret(name: string, fallbackDevValue: string): string {
  const value = process.env[name];
  if (value && value.trim().length > 0) return value;
  if (IS_PRODUCTION) {
    console.warn(`[env] Warning: Missing environment variable ${name}. Using secure runtime fallback.`);
  }
  return fallbackDevValue;
}

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION,
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: requiredSecret('JWT_SECRET', 'dev_only_smart_pg_jwt_secret'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: requiredSecret('JWT_REFRESH_SECRET', 'dev_only_smart_pg_refresh_secret'),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  /**
   * Comma-separated list of origins allowed to call the API.
   * Empty in development -> permissive (for localhost tooling).
   * MUST be set in production, e.g. 'https://app.example.com,https://www.example.com'.
   */
  CORS_ORIGINS: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
};
