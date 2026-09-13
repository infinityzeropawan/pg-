# Student Module Forbidden Patterns

> This document lists architectural patterns that are explicitly **FORBIDDEN** in the `/student` module.

## 1. No Inline Tailwind Variables
**❌ BAD:** `<div className="bg-[var(--bg-card)]">`
**✅ GOOD:** `<div className="bg-card">`
**Rule:** Ensure all CSS variables are mapped in `tailwind.config.ts` and use standard classes.

## 2. No Naked Numeric Inputs
**❌ BAD:** `<input type="number" />`
**✅ GOOD:** `<input type="number" min="0" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }} />`
**Rule:** Prevent negative numbers and invalid characters at the DOM level.

## 3. No Hardcoded URLs
**❌ BAD:** `router.push('/student/dashboard')`
**✅ GOOD:** `router.push(STUDENT_ROUTES.DASHBOARD)`
**Rule:** Use `student_url_config.ts`.

## 4. No Missing Error Boundaries or Skeleton Loaders
**Rule:** Every page or complex component must be wrapped in `error.tsx` and have a `loading.tsx` skeleton. Never use generic full-page spinners.

## 5. No Logic Mixed in Views
**❌ BAD:** Mixing `useEffect`, `useState`, and 300 lines of JSX in `page.tsx`.
**✅ GOOD:** Extracting logic to `useStudentDashboard.ts` and keeping `StudentDashboardMain.tsx` pure.
