# Manager Module — Forbidden Patterns

> Hard rules. Any PR/commit violating these patterns will be rejected.
> These rules apply to ALL files under `src/app/manager/`.

---

## 1. Import Rules

| ❌ FORBIDDEN | ✅ CORRECT |
|-------------|-----------|
| `import { Foo } from '../types/Foo'` | `import type { Foo } from '@/app/manager/.../Foo'` |
| `import { Foo } from './Foo'` (from hook to sibling component) | Use absolute `@/app/manager/...` paths |
| `import { useState } from 'react'; import type { Foo }...` (mixing) | Group all `import type` together |

**Rule:** All cross-folder imports MUST be absolute (`@/app/manager/...`). Intra-folder sibling imports in `_components/` are acceptable ONLY for same-folder files.

---

## 2. Type Import Rules

| ❌ FORBIDDEN | ✅ CORRECT |
|-------------|-----------|
| `import { MyType } from './types'` | `import type { MyType } from '@/app/manager/...'` |
| Declaring inline `interface` in a component file | Move to `_types/` file |
| Using `any` for API response types | Define a typed interface in `_types/` |

---

## 3. State Rules

| ❌ FORBIDDEN | ✅ CORRECT |
|-------------|-----------|
| Fetching data directly in `page.tsx` | Delegate to a `use*` hook in `_hooks/` |
| Using `localStorage` directly in a component | Abstract behind an API utility |
| Defining form state in `page.tsx` | Use `_hooks/useManager*Form.ts` |
| `useEffect` with empty `[]` deps but referencing outer variables | Fix deps or use `useCallback` |

---

## 4. Component Rules

| ❌ FORBIDDEN | ✅ CORRECT |
|-------------|-----------|
| Logic (API calls, filtering, sorting) inside JSX component body | Move to hook |
| `console.log` left in production code | Remove before commit |
| Hardcoded property IDs or user IDs | Always read from `ManagerPropertyContext` or `getSession()` |
| Direct DOM mutation (`document.getElementById`) | Use React refs |

---

## 5. Design Rules

| ❌ FORBIDDEN | ✅ CORRECT |
|-------------|-----------|
| Gradients in ERP dashboard (`bg-gradient-*`) | Flat color backgrounds |
| Hardcoded hex colors (`text-[#abc123]`) | CSS variable tokens |
| `style={{ color: 'red' }}` inline styles | Utility classes or CSS variables |
| Creating a new color that does not exist in the design system | Add to global design tokens first |

---

## 6. Form Rules (Post-Phase 3)

| ❌ FORBIDDEN | ✅ CORRECT |
|-------------|-----------|
| `useState` for every form field | React Hook Form with `useForm()` |
| Manual validation (`if (!email.includes('@'))`) | Zod schema with `.parse()` / `safeParse()` |
| Inline error message strings | Centralized Zod error messages in schema |

---

## 7. Routing / URL Rules (Post-Phase 4)

| ❌ FORBIDDEN | ✅ CORRECT |
|-------------|-----------|
| Pagination stored in component `useState` | URL search params (`?page=2`) |
| Filters stored in component `useState` | URL search params (`?filter=paid`) |
| `useRouter().push()` for filter changes (full navigation) | `useSearchParams` + `router.replace()` |

---

## 8. Server Boundary Rules (Post-Phase 4)

| ❌ FORBIDDEN | ✅ CORRECT |
|-------------|-----------|
| `page.tsx` with `'use client'` for data-only rendering | `page.tsx` as Server Component, child gets `'use client'` |
| No `loading.tsx` on a route with async data | Add `loading.tsx` skeleton |
| No `error.tsx` on a route with potential failures | Add `error.tsx` boundary |
