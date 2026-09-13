# Staff Module Feature Map

## Module Purpose
The Staff module provides role-specific interfaces for PG staff (like Cooks, Cleaners, and Wardens) to manage daily operations such as stock requests, meal tracking, attendance, and tasks.

## Directory Structure
- `staff_components/`: Generic UI components shared across the staff module (e.g., Layout, Sidebar, Header).
- `staff_url_config.ts`: Centralized URL configuration.
- `loading.tsx` / `error.tsx`: Module-level skeleton loaders and error boundaries.
- `[FeatureName]_components/`: Feature-specific logic hooks and views.

## Feature Inventory
| Feature | Path | Purpose | Main API Calls | Owner |
|---|---|---|---|---|
| Dashboard | `/staff/dashboard` | Daily overview, attendance, quick actions | `food-menu`, `usage-logs` | Staff |
| Cook | `/staff/cook` | Weekly menu management and meal counts | `food-menu` | Cook |
| Stock | `/staff/stock` | View inventory and make stock requests | `stock`, `stock-requests` | Staff |
| Alerts | `/staff/alerts` | Low stock and expiry warnings | `stock` | Staff |
| Tasks | `/staff/tasks` | Daily checklists and assigned jobs | `tasks` | Staff |
| Auth | `/staff/login` | Staff authentication | `auth` | Public |

## Rule Compliance Checklist
- [x] Rule 1: Micro-modularization (Extracted views and hooks)
- [x] Rule 4: Theme Independence (No inline CSS variables, `bg-card` used)
- [x] Rule 6: Separation of Logic (Custom hooks for complex UI states)
- [x] Rule 9: `loading.tsx` and `error.tsx` present
- [x] Rule 11: Centralized `staff_url_config.ts`
- [x] Rule 65: Numeric input hardening (`onKeyDown` applied)
