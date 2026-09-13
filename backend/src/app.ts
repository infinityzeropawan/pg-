import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import superadminRoutes from './modules/superadmin/superadmin.routes';
import adminRoutes from './modules/admin/admin.routes';
import { sendSuccess, sendError } from './utils/response';

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req: Request, res: Response) => {
  return sendSuccess(res, 'Smart PG Management Backend API is healthy', {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/superadmin', superadminRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
});

export default app;
