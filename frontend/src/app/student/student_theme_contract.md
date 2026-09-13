# Student Module Theme Portability Contract

This module relies on the following CSS variables being defined in the global CSS (e.g., `globals.css`) and mapped in `tailwind.config.ts`.
Do NOT use inline variables like `bg-[var(--primary)]`. Use standard Tailwind classes.

## Required Variables
- `--primary`, `--primary-hover`, `--primary-subtle`
- `--bg-page`, `--bg-card`, `--bg-input`, `--bg-sidebar`, `--bg-header`
- `--text-primary`, `--text-secondary`, `--text-disabled`
- `--border`, `--border-focus`
- `--success`, `--success-bg`
- `--danger`, `--danger-bg`, `--danger-hover`
- `--warning`, `--warning-bg`
- `--info`, `--info-bg`
- `--skeleton-base`, `--skeleton-highlight`
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`

## Tailwind Configuration mapping
```js
// tailwind.config.ts snippet
theme: {
  extend: {
    colors: {
      primary: 'var(--primary)',
      'primary-hover': 'var(--primary-hover)',
      'primary-subtle': 'var(--primary-subtle)',
      'bg-card': 'var(--bg-card)',
      // ... etc
    }
  }
}
```
