# Module Features & Architecture

## 1. Module Purpose
[To Be Defined: Describe the high-level business objective of this module. What problem does it solve and who are the primary users?]

## 2. Directory Structure
`	ext
module_components/ # UI Components (Main, Modals, Cards, Forms)
module_hooks/      # Business logic and state management
module_lib/        # API calls, schemas, and utilities
`

## 3. Feature Inventory
| Feature | Status | Priority | Description |
|---------|--------|----------|-------------|
| Core View | ?? WIP | High | Main entry point for the module |
| [New Feature] | ? Todo | Medium |  |

## 4. API Contract & Data Models
- Data is fetched via module-specific API handlers in ..._lib/..._api.
- [To Be Defined: List the primary data structures and their sources]

## 5. Permissions & Access Control
- [To Be Defined: What specific user roles can access this module? Are there specific permissions required for nested actions?]

## 6. Loading, Error, and Empty States
- **Loading**: Utilizes loading.tsx and inline skeleton loaders for component-level fetching.
- **Error**: Handled by error.tsx for route-level crashes and error toasts for API failures.
- **Empty**: [To Be Defined: How does the UI behave when there is no data?]

## 7. Edge Cases & Constraints
- [To Be Defined: Document any known limitations, race conditions, or edge cases here.]

## 8. Rule Compliance Checklist
- [x] Zero cross-module relative imports
- [x] No ny types or @ts-ignore used
- [x] State management properly decoupled to hooks
- [x] Component length stays under 300 lines
