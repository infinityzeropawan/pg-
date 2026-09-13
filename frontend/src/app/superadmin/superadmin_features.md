# superadmin Feature Map

## Module Purpose
Handles all superadmin specific UI, interactions, and data fetching for the PG Management system.

## Directory Structure
- `superadmin_components/`: Pure UI and presentational components
- `superadmin_hooks/`: Business logic and data fetching hooks
- `superadmin_lib/`: Types, API wrappers, and constants

## Feature Inventory
| Feature | Path | Purpose | Main API Calls | Owner |
|---|---|---|---|---|
| Dashboard | /superadmin/dashboard | Overview | fetchDashboardStats | TBD |

## Data and State Architecture
- Server-state query keys: `['superadmin', ...]`
- Zustand stores: N/A
- Context providers: N/A

## API Contract
Uses `superadmin_api.ts` for all network requests.

## Permissions and Security
Restricted to superadmin role only.

## Loading, Empty, Error States
Implements standard `loading.tsx` and `error.tsx` at root levels.

## Edge Cases / AI Warnings
Always use properly prefixed components.

## Rule Compliance Checklist
- [x] Rule 1: Micro-modularization
- [x] Rule 7: Type isolation
- [x] Rule 8: Server/client boundary
- [x] Rule 9: Loading/error/not-found handling
- [x] Rule 14: Backend-driven messages
