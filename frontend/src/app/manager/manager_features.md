# Manager Module — Feature Documentation

## Overview
The `manager` module provides the operational dashboard for PG property managers. It is role-isolated and only accessible after manager authentication via `/manager/login`.

---

## Feature Inventory

| Route | Feature | Hook |
|-------|---------|------|
| `/manager/dashboard` | Overview KPIs, meal alerts, stock alerts | `useManagerDashboard` |
| `/manager/attendance` | Daily student attendance marking | `useManagerAttendanceData`, `useManagerAttendanceActions` |
| `/manager/check-in` | Multi-step student onboarding wizard (10 steps) | `useManagerCheckinData`, `useManagerCheckinForm` |
| `/manager/complaints` | View and resolve student complaints with cost tracking | `useManagerComplaints` |
| `/manager/enquiries` | Kanban board for enquiry pipeline management | `useManagerEnquiries` |
| `/manager/expenses` | Log and view property-level expenses | `useManagerExpenses` |
| `/manager/finance` | Rent invoice tracking and mark-paid actions | `useManagerFinance` |
| `/manager/food` | View weekly meal schedule for property | `useManagerFood` |
| `/manager/gate-logs` | Log student entry/exit with late detection | `useManagerGateLogs` |
| `/manager/inventory` | Stock levels, kitchen requests, batch history, alerts | `useManagerInventory` |
| `/manager/rooms` | Room occupancy overview with bed-level detail | `useManagerRooms` |
| `/manager/students` | Active student list with rent status | `useManagerStudents` |
| `/manager/visitors` | Visitor approval queue and check-in/out | `useManagerVisitors` |

---

## Architecture

### Module Structure (per feature)
All imports MUST be absolute paths (@/app/manager/...). NO relative ../ imports.
All type imports MUST use 'import type { ... }' syntax.
