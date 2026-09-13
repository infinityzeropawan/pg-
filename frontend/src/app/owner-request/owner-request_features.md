# owner-request Feature Map

## Module Purpose
Handles all owner-request specific UI, interactions, and data fetching for the PG Management system.

## Directory Structure
- `owner-request_components/`: Pure UI and presentational components
- `owner-request_hooks/`: Business logic and data fetching hooks
- `owner-request_lib/`: Types, API wrappers, and constants

## Feature Inventory
| Feature | Path | Purpose | Main API Calls | Owner |
|---|---|---|---|---|
| Dashboard | /owner-request/dashboard | Overview | fetchDashboardStats | TBD |

## Data and State Architecture
- Server-state query keys: `['owner-request', ...]`
- Zustand stores: N/A
- Context providers: N/A

## API Contract
Uses `owner-request_api.ts` for all network requests.

## Permissions and Security
Restricted to owner-request role only.

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
