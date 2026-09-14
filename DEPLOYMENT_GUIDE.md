# Smart PG Management Platform — Production Deployment Guide
## Deploying Next.js Frontend + Express Backend on Vercel with Neon PostgreSQL

This document provides a step-by-step guide for deploying the Smart PG Management SaaS application to production using **Vercel** (for Frontend & Express API Backend) and **Neon Serverless PostgreSQL** (for the database).

---

## Architecture Overview

```mermaid
graph TD
    Client[Browser / Web Apps] -->|HTTPS| Frontend[Vercel - Next.js App]
    Client -->|API Requests| Backend[Vercel / Render / Railway - Express API]
    Backend -->|Pooled Connection| NeonDB[(Neon Serverless PostgreSQL)]
    Backend -->|Prisma Client| NeonDB
```

---

## Step 1: Create and Configure Neon PostgreSQL Database

1. Sign up or log in at [Neon Tech](https://neon.tech/).
2. Create a new project (e.g., `smart-pg-production`).
3. Select your preferred cloud region (e.g., `ap-south-1` for India / Asia Pacific).
4. Copy your database connection strings from the Neon Dashboard:
   - **Pooled Connection String** (`DATABASE_URL`):
     ```env
     postgresql://user:password@ep-xyz-pooler.region.aws.neon.tech/neondb?sslmode=require
     ```
   - **Direct Connection String** (`DIRECT_URL`):
     ```env
     postgresql://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require
     ```

---

## Step 2: Configure Environment Variables

### Backend Environment Variables (`backend/.env` & Vercel Backend Project)

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for Express server (local) |
| `NODE_ENV` | `production` | Node environment mode |
| `DATABASE_URL` | `postgresql://user:pass@ep-xyz-pooler.neon.tech/neondb?sslmode=require` | Neon Pooled Connection String |
| `DIRECT_URL` | `postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` | Neon Direct Connection String |
| `JWT_SECRET` | `prod_jwt_super_secret_key_change_in_prod` | Secret key for access token signing |
| `JWT_EXPIRES_IN` | `7d` | Access token lifespan |
| `JWT_REFRESH_SECRET` | `prod_jwt_refresh_secret_key_change_in_prod` | Secret key for refresh token |
| `JWT_REFRESH_EXPIRES_IN` | `30d` | Refresh token lifespan |

### Frontend Environment Variables (`frontend/.env.local` & Vercel Frontend Project)

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://smart-pg-backend.vercel.app` | URL of deployed Express API backend |

---

## Step 3: Run Database Migrations & Seed Data on Neon

From your local machine or CI/CD terminal with `DATABASE_URL` and `DIRECT_URL` pointing to Neon:

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Push Database Schema to Neon Postgres
npx prisma db push

# Seed Initial Data (Superadmin, Plans, Default Categories)
npx prisma db seed
```

---

## Step 4: Deploy Express Backend API to Vercel

1. Install Vercel CLI (or use GitHub Integration):
   ```bash
   npm i -g vercel
   ```
2. Navigate to backend directory:
   ```bash
   cd backend
   npm run build
   vercel
   ```
3. In Vercel Project Settings for Backend:
   - **Framework Preset**: Other / Node.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - Add all environment variables listed in **Step 2 (Backend)**.
4. Copy the assigned backend deployment URL (e.g., `https://smart-pg-backend.vercel.app`).

---

## Step 5: Deploy Next.js Frontend App to Vercel

1. Navigate to frontend directory or connect GitHub repository to Vercel.
2. Create a new Vercel Project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://smart-pg-backend.vercel.app` (your backend API URL from Step 4).
4. Click **Deploy**.

---

## Step 6: Production Verification Checklist

- [x] Prisma datasource configured to `postgresql` with `DATABASE_URL` and `DIRECT_URL`.
- [x] Schema pushed to Neon DB with zero errors.
- [x] `NEXT_PUBLIC_API_URL` configured in Vercel Frontend project settings.
- [x] JWT secrets generated securely for production environment.
- [x] Multi-tenant scoping (`ownerId`, `propertyId`) enforced across all API routes.
- [x] Health check verified at `https://smart-pg-backend.vercel.app/health`.
