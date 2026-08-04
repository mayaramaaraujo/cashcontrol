# bills

Bills tab (`/bills`) and the Add/Edit Bill sheet, opened either from a bill row (edit) or the shell's FAB via `?sheet=bill` (create), wired into `AppChrome`.

- `types.ts` — `Bill`, `DefaultBillCategory` (the literal names seeded for every group, kept only so `dict.categories.bill` can translate them — not the source of truth for what categories exist), `billSchema`/`BillValues` (react-hook-form + zod; `category` is a free string). Actual categories live in the `categories` table/feature (see `@/features/categories`), scoped per group.
- `lib.ts` — row mapping, paid/pending summary math, fixed/variable filtering, `computeCategoryBreakdown(bills, colorsByCategory)` (this cycle's paid bills grouped by category, sorted descending, returns `CategoryBreakdownRow[]` from `@/shared/components/CategoryBreakdown`; `colorsByCategory` comes from `colorsByCategoryName()` in `@/features/categories/lib`), and `getBillDueInfo` (upcoming/due-soon/overdue status computed from `dueDay` + `paidAt`, clamped for month-end days). `paidAt` (set by `toggleBillPaid`) scopes "paid" to the current monthly cycle for `repeatMonthly` bills, so a bill marked paid last month is correctly treated as unpaid again this month — no separate reset job needed. Every consumer (`PaidToggle`, `BillsList`, `computeBillsSummary`, `computeCategoryBreakdown`, the reminders cron) reads `isPaidThisCycle` from this same function.
- `api/actions.ts` — `addBill`, `updateBill`, `deleteBill`, `toggleBillPaid` Server Actions.
- `components/BillsSummary.tsx` — paid/pending cards + progress bar.
- The Bills page also renders the shared `CategoryBreakdown` component below `BillsSummary`, showing this month's paid spend per category.
- `components/BillsList.tsx` — filter chips + bill rows (tap to edit), overdue/due-soon `Chip` badges, empty state.
- `components/PaidToggle.tsx` — per-row paid/unpaid checkbox button, calls `toggleBillPaid`.
- `components/BillSheet.tsx` — shared Add/Edit sheet, mounted in the Bills tab (edit), the Home activity feed (edit, via `dashboard/components/ActivitySection.tsx`), and `AppChrome` (create). Takes a `categories: Category[]` prop (this group's `type: "bill"` categories, fetched server-side) instead of a hardcoded list — the caller filters by type via `categoriesByType()`.
