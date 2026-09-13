# Owner Module Forbidden Patterns

1. **No Inline Colors**: Never use `bg-[var(--bg-card)]` or `text-[#FFF]`. Define tokens in `globals.css`, map in `tailwind.config.ts`, and use standard classes like `bg-card`.
2. **No Hardcoded URLs**: Never use inline string URLs (e.g. `href="/owner/dashboard"`). Use `owner_url_config.ts`.
3. **No Mixed Components/Logic**: UI components (.tsx) must use hooks (.ts) for logic.
4. **No Naked Inputs**: `<input type="number">` must have `min="0"` and an `onKeyDown` block for invalid characters.
5. **No Single-Click Destructive Actions**: Deletes, suspension, and payroll must use a double-verification modal.
6. **No Any Types**: `any` is strictly forbidden.
