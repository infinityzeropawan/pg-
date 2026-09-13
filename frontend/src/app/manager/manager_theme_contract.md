# Manager Module — Theme Contract

> This document defines the visual design rules for every component in the `manager` module.
> No component may deviate from this contract. Any new UI must reference this file first.

---

## Color Palette (Core 5)

| Token | CSS Variable | Usage |
|-------|-------------|-------|
| Primary | `var(--primary)` | Action buttons, active nav items, key CTAs |
| Surface | `var(--surface)` | Card backgrounds, table rows, modal backgrounds |
| Border | `var(--border)` | Dividers, table borders, input borders |
| Muted | `var(--muted)` | Secondary text, placeholder text, disabled states |
| Danger | `var(--danger)` | Destructive actions, overdue/critical badges |

**Rules:**
- ❌ NO gradients in ERP dashboard components (Rule: no-gradients-in-dashboard)
- ❌ NO hardcoded hex/rgb colors — always use CSS variables
- ❌ NO Tailwind arbitrary values like `text-[#123]` or `bg-[rgb(...)]`
- ✅ Status badges may use semantic color pairs (success/warning/danger/info) only from the design token set

---

## Typography

| Role | Class / Token | Size |
|------|--------------|------|
| Page title | `text-2xl font-bold` | 24px |
| Section heading | `text-lg font-semibold` | 18px |
| Table header | `text-xs font-medium uppercase tracking-wide` | 12px |
| Body text | `text-sm` | 14px |
| Muted / caption | `text-xs text-muted` | 12px |

---

## Spacing System

- Card padding: `p-4` (16px) or `p-6` (24px) for dashboards
- Table row height: `py-3 px-4`
- Section gap: `gap-4` or `gap-6`
- Page content max-width: `max-w-7xl mx-auto px-4`

---

## Component Patterns

### Cards
```tsx
<div className="bg-surface border border-border rounded-lg p-4 shadow-sm">
```

### Status Badges
```tsx
// Use semantic variant props — never raw color classes
<Badge variant="success" | "warning" | "danger" | "info" | "default" />
```

### Action Buttons
```tsx
// Primary action
<button className="btn-primary">Save</button>
// Destructive
<button className="btn-danger">Delete</button>
// Ghost/secondary
<button className="btn-ghost">Cancel</button>
```

### Tables
- Always wrapped in `overflow-x-auto`
- Headers: `text-muted text-xs uppercase`
- Striped rows: `even:bg-surface/50`

---

## Animation Rules
- Transitions: `transition-colors duration-150` for hover states
- Modals: fade-in with `opacity-0 → opacity-100` over `200ms`
- Loading skeletons: pulse animation via `animate-pulse`
- ❌ NO spring/bounce animations in data tables

---

## Responsive Breakpoints
- Mobile-first: default styles for mobile
- `md:` for tablet (768px+)
- `lg:` for desktop (1024px+)
- Tables collapse to card-list on mobile using `hidden md:table-cell`
