import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './modules/auth/auth.routes';
import superadminRoutes from './modules/superadmin/superadmin.routes';
import adminRoutes from './modules/admin/admin.routes';
import parentRoutes from './modules/parent/parent.routes';
import staffRoutes from './modules/staff/staff.routes';
import studentRoutes from './modules/student/student.routes';
import { ENV } from './config/env';
import { sendSuccess, sendError } from './utils/response';

const app = express();

// ── Security headers ───────────────────────────────────────────
app.use(helmet());

// ── CORS allow-list ────────────────────────────────────────────
// In production CORS_ORIGINS must be set; an unconfigured origin is rejected.
// Previously `app.use(cors())` answered with `Access-Control-Allow-Origin: *`.
app.use(
  cors({
    origin(origin, callback) {
      if (!ENV.IS_PRODUCTION || ENV.CORS_ORIGINS.length === 0) return callback(null, true);
      if (!origin) return callback(null, true); // non-browser clients (curl, mobile)
      if (ENV.CORS_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);

// ── Body parsing (bounded) ─────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ── Rate limiting ──────────────────────────────────────────────
// Brute-force protection on the credential endpoints.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

// General API budget to absorb abusive traffic.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});

app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1', apiLimiter);

// ── Health Check ───────────────────────────────────────────────
app.get('/health', (req: Request, res: Response) => {
  return sendSuccess(res, 'Smart PG Management Backend API is healthy', {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── API v1 Routes ──────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/superadmin', superadminRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/parent', parentRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/student', studentRoutes);

// ── 404 Handler ────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
});

// ── Global Error Handler ───────────────────────────────────────
// Catches thrown errors (including the CORS rejection above) so the process never
// returns an HTML stack trace to a client.
app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : 'Internal server error';
  const status = message.startsWith('Origin ') && message.includes('not allowed by CORS') ? 403 : 500;

  if (!ENV.IS_PRODUCTION) {
    console.error('[api] Unhandled error:', error);
  }

  if (!res.headersSent) {
    return sendError(res, status === 403 ? message : 'Internal server error', status);
  }
  return undefined;
});

export default app;
