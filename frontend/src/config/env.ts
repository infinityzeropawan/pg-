import { z } from 'zod';

import { API_BASE_URL } from '@/lib/config/apiBase';

/**
 * NOTE: NEXT_PUBLIC_API_URL is intentionally NOT validated as a strict URL here.
 * It is allowed to be empty/relative (monorepo same-origin deployment) or to omit the
 * scheme, because API_BASE_URL already normalises and resolves it. Validating it as a
 * hard `.url()` previously threw at import time and crashed any page that used this
 * module whenever the variable was unset or set to ''.
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().default(''),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

let parsedEnv: z.infer<typeof envSchema>;

try {
  parsedEnv = envSchema.parse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  });
} catch (error: unknown) {
  console.error('❌ Invalid environment variables:', error);
  throw new Error('Invalid environment variables');
}

export const env = {
  ...parsedEnv,
  /** Resolved, normalised backend origin. Empty string means same-origin. */
  RESOLVED_API_BASE_URL: API_BASE_URL,
};
