# owner Feature Map

## Module Purpose
Handles all owner specific UI, interactions, and data fetching for the PG Management system.

## Directory Structure
- `owner_components/`: Pure UI and presentational components
- `owner_hooks/`: Business logic and data fetching hooks
- `owner_lib/`: Types, API wrappers, and constants

## Feature Inventory
| Feature | Path | Purpose | Main API Calls | Owner |
|---|---|---|---|---|
| Dashboard | /owner/dashboard | Overview | fetchDashboardStats | TBD |

## Data and State Architecture
- Server-state query keys: `['owner', ...]`
- Zustand stores: N/A
- Context providers: N/A

## API Contract
Uses `owner_api.ts` for all network requests.

## Permissions and Security
Restricted to owner role only.

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
