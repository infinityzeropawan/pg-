# Smart PG Management Platform — Production Deployment Guide
## Deploying Next.js Frontend + Express Backend on Vercel with Neon PostgreSQL

This document provides instructions for deploying the Smart PG Management multi-tenant SaaS application to **Vercel** with **Neon Serverless PostgreSQL**.

---

## 2 Supported Vercel Deployment Options

### Option A: Monorepo Unified Deployment (Single Vercel Project) — Recommended
Use the root [`vercel.json`](file:///home/pawan/Desktop/pg%20management/vercel.json) file to deploy both the Next.js frontend and Express backend under a single domain.

- **How it works:**
  - Requests starting with `/api/v1/*` are routed to the Express Serverless Function (`backend/dist/index.js`).
  - All other routes are served by the Next.js frontend app (`frontend`).

- **Vercel Project Setup:**
  1. Connect your GitHub repository (`infinityzeropawan/pg-`) to Vercel.
  2. Leave **Root Directory** as `./` (project root).
  3. Add Environment Variables (see `backend/.env.example` and `frontend/.env.example`):

     **Backend project / environment:**
     - `DATABASE_URL` = `postgresql://user:pass@ep-xyz-pooler.neon.tech/neondb?sslmode=require` *(pooled)*
     - `DIRECT_URL` = `postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` *(direct)*
     - `JWT_SECRET` = a long random secret (`openssl rand -base64 48`)
     - `JWT_REFRESH_SECRET` = a different long random secret
     - `CORS_ORIGINS` = your frontend origin(s), e.g. `https://smartpg.vercel.app`
     - `NODE_ENV` = `production`

     **Frontend project / environment:**
     - `NEXT_PUBLIC_API_URL` — for the monorepo option **leave it unset**. The shared
       resolver (`frontend/src/lib/config/apiBase.ts`) then issues same-origin requests
       and the `vercel.json` rewrites route `/api/v1/*` to the backend service.
       *(Only set it if you deploy the backend as a separate project.)*
     - `NEXT_PUBLIC_APP_ENV` = `production`

> ⚠️ **Never set `NEXT_PUBLIC_API_URL` to an empty string and expect a fallback.**
> An earlier revision of this guide suggested "leave empty or set to `/`", which
> silently resolved to `http://localhost:5000` in production and broke every API call.
> The resolver now handles an unset value correctly, but do not set it to `/`.


---

### Option B: Two Separate Vercel Projects (Frontend + Backend)

#### Project 1: Express Backend (`smart-pg-backend`)
1. Create a Vercel project with **Root Directory**: `backend`.
2. Set **Build Command**: `npm run build`.
3. Add Environment Variables: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`.
4. Copy assigned URL (e.g., `https://smart-pg-backend.vercel.app`).

#### Project 2: Next.js Frontend (`smart-pg-frontend`)
1. Create a Vercel project with **Root Directory**: `frontend`.
2. Set **Framework**: Next.js.
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://smart-pg-backend.vercel.app`

---

## Neon Database Setup Steps

1. Create a Neon Postgres database at [neon.tech](https://neon.tech/).
2. Copy the pooled connection string (`DATABASE_URL`) and direct connection string (`DIRECT_URL`).
3. Run migrations and seed data from your terminal:
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

---

## Production Verification Checklist

- [x] Root [`vercel.json`](file:///home/pawan/Desktop/pg%20management/vercel.json) created for unified monorepo routing.
- [x] Backend [`vercel.json`](file:///home/pawan/Desktop/pg%20management/backend/vercel.json) created for standalone backend project.
- [x] Prisma configured for PostgreSQL with `DATABASE_URL` and `DIRECT_URL`.
- [x] All TypeScript code passes build checks (`0 errors`).
