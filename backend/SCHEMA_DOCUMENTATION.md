# Smart PG Management — Comprehensive Database Schema Documentation

This document describes the canonical database architecture for the Smart PG Management platform implemented in [prisma/schema.prisma](file:///home/pawan/Desktop/pg%20management/backend/prisma/schema.prisma).

---

## 1. Core Domain Modules & Models Overview

| Module | Model Name | Primary Responsibility | Isolation Field |
| :--- | :--- | :--- | :--- |
| **Accounts** | `User` | Authenticated actors (7 roles: `SUPERADMIN`, `OWNER`, `MANAGER`, `STAFF`, `STUDENT`, `PARENT`) | `ownerId` |
| | `UserSession` | JWT refresh tokens and active sessions | `userId` |
| | `OwnerRequest` | Public onboarding requests pipeline | — |
| | `AuditLog` | Audit log of security and financial actions | `ownerId`, `propertyId` |
| **Platform** | `PlatformPlan` | SaaS pricing plans and property/bed limits | — |
| | `Subscription` | Owner subscription history and status | `ownerId` |
| | `FeatureFlag` | Per-owner or global feature toggles | `ownerId` |
| **Properties** | `Property` | PG / Hostel entity (Address, rules, amenities) | `ownerId` |
| | `Floor` | Property floor levels | `propertyId` |
| | `Room` | Rooms per floor (Rent defaults, room type) | `floorId` |
| | `Bed` | Individual beds with availability states (`VACANT`, `OCCUPIED`, `UNDER_MAINTENANCE`, `RESERVED`) | `roomId` |
| | `StaffAssignment` | Property-level permission assignments for Managers & Staff | `propertyId` |
| **Tenancies** | `TenantProfile` | Tenant KYC info, emergency contacts, permanent address | `userId` |
| | `ParentProfile` | Linked parent contact information | `userId` |
| | `TenantStay` | Active/historical stay allocations (Agreed rent, deposit, dates) | `ownerId`, `propertyId` |
| | `CheckoutRecord` | Inspection notes, damage deductions, refund summary | `stayId` |
| **Finance** | `Invoice` | Monthly rent/utility billing records | `ownerId`, `propertyId` |
| | `InvoiceItem` | Itemized invoice breakdown (Rent, electricity, mess, late fee) | `invoiceId` |
| | `Payment` | Idempotent payment transactions (UPI, Cash, Razorpay, Cashfree) | `ownerId` |
| | `SecurityDeposit` | Deposit tracking and refund ledger | `stayId` |
| | `Expense` | Property operational costs and expenses | `ownerId`, `propertyId` |
| **Operations**| `Enquiry` | Vacant room public leads & enquiries | `propertyId` |
| | `Complaint` | Maintenance ticket tracking & SLA status | `ownerId`, `propertyId` |
| | `Attendance` | Daily tenant and staff attendance | `propertyId` |
| | `VisitorLog` | Guest entry/exit gate log | `propertyId` |
| **Mess** | `MessMenu` | Weekly meal schedules | `propertyId` |
| | `MealOrder` | Daily meal bookings & feedback ratings | `propertyId` |
| | `MessWallet` | Food wallet balance for extra meals | `tenantId` |
| **Safety** | `SOSAlert` | Emergency SOS trigger logs | `ownerId`, `propertyId` |
| | `GateLog` | Biometric / QR gate entry logs | `propertyId` |
| | `PoliceVerification`| Tenant verification document status | `tenantId` |
| **Documents** | `Document` | Uploaded KYC proof documents (Aadhaar, PAN, College ID) | `tenantId` |
| | `RentAgreement` | E-signed rent agreements | `tenantId` |
| **Alerts** | `NotificationLog` | Outbound SMS, Email, Push logs | `userId` |

---

## 2. Multi-Tenancy & Authorization Rules

1. **Owner Isolation (`ownerId`)**:
   - Every tenant-owned table (`Property`, `TenantStay`, `Invoice`, `Payment`, `Expense`, `Complaint`, `SOSAlert`, `AuditLog`) contains an explicit `ownerId` column.
   - Queries executed on behalf of an Owner or Manager MUST include `WHERE owner_id = :active_owner_id`.

2. **Property Scoping (`propertyId`)**:
   - Managers and Staff can only access resources where `propertyId` matches their explicitly assigned properties in `StaffAssignment`.

3. **Financial Invariants**:
   - All monetary amounts (`monthlyRent`, `securityDeposit`, `totalAmount`, `amount`, `balance`) are stored in **integer Paise** (e.g., ₹5,000.00 = `500000`) to avoid floating point precision errors.
   - Payments carry a strict `@unique` `idempotencyKey` and `transactionRef` to prevent double-charging.
