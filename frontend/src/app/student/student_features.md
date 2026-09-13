# Student Module Feature Map

## Module Purpose
The Student module provides interfaces for PG students to manage their daily stay, view rent dues, see the food menu, raise complaints, and file notices/SOS alerts.

## Directory Structure
- `components/`: Generic UI components shared across the student module.
- `lib/`: Student-specific utilities and API wrappers.
- `student_url_config.ts`: Centralized URL configuration.
- `loading.tsx` / `error.tsx`: Module-level skeleton loaders and error boundaries.
- `[FeatureName]_components/`: Feature-specific logic hooks and views.

## Feature Inventory
| Feature | Path | Purpose |
|---|---|---|
| Dashboard | `/student/dashboard` | Main overview, quick actions |
| Profile | `/student/profile` | Student details, bed info, KYC |
| Rent | `/student/rent` | Rent history, upcoming dues |
| Mess | `/student/mess` | Weekly food menu |
| Documents | `/student/documents` | Uploaded IDs, rent agreements |
| Notices | `/student/notices` | Announcements from the owner |
| Complaints | `/student/complaints` | Raise and track issues |
| Notice Period | `/student/notice-period` | Submit intent to leave |
| SOS | `/student/sos` | Emergency alerts |
| Auth | `/student/login` | Student authentication |

## Rule Compliance Checklist
- [x] Rule 1: Micro-modularization (Extracted views and hooks)
- [x] Rule 4: Theme Independence (No inline CSS variables, `bg-card` used)
- [x] Rule 6: Separation of Logic (Custom hooks for complex UI states)
- [x] Rule 9: `loading.tsx` and `error.tsx` present
- [x] Rule 11: Centralized `student_url_config.ts`
- [x] Rule 65: Numeric input hardening (`onKeyDown` applied)
