# superadmin Forbidden Patterns

1. **DO NOT** use inline Tailwind colors (e.g., `text-[#333]`). Always use variables (e.g., `text-primary`).
2. **DO NOT** import from other modules (e.g., `import { X } from '@/app/student/...'` inside the superadmin module).
3. **DO NOT** use `any` types.
4. **DO NOT** leave `console.log` in production code.
5. **DO NOT** use relative paths like `../../`. Use `@/app/superadmin/...`.
6. **DO NOT** mix heavy data fetching logic in `.tsx` files. Use custom hooks.
