# income

Income entries and the Add/Edit Income sheet, opened either from an activity row on Home (edit) or the shell's FAB via `?sheet=income` (create), wired into `AppChrome`.

- `types.ts` — `IncomeEntry`, `DefaultIncomeCategory` (the literal names seeded for every group, kept only so `dict.categories.income` can translate them — not the source of truth for what categories exist), `addIncomeSchema`/`AddIncomeValues` (react-hook-form + zod; `category` is a free string). Actual categories live in the `categories` table/feature (see `@/features/categories`), scoped per group.
- `api/actions.ts` — `addEntry`, `updateEntry`, `deleteEntry` Server Actions.
- `components/IncomeSheet.tsx` — shared Add/Edit sheet (amount + member picker + category chips + note), mounted both in `ActivitySection` (edit, via clicking an income row) and `AppChrome` (create). Takes a `categories: Category[]` prop (this group's `type: "income"` categories, fetched server-side) instead of a hardcoded list — the caller filters by type via `categoriesByType()`.
