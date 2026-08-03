# bills

Bills tab (`/bills`) and the Add/Edit Bill sheet, opened either from a bill row (edit) or the shell's FAB via `?sheet=bill` (create), wired into `AppChrome`.

- `types.ts` — `Bill`, `BILL_CATEGORIES`, `BILL_CATEGORY_COLORS` (Chip accent tokens), `billSchema`/`BillValues` (react-hook-form + zod).
- `lib.ts` — row mapping, paid/pending summary math, fixed/variable filtering, `computeCategoryBreakdown` (this cycle's paid bills grouped by category, sorted descending, returns `CategoryBreakdownRow[]` from `@/shared/components/CategoryBreakdown`), and `getBillDueInfo` (upcoming/due-soon/overdue status computed from `dueDay` + `paidAt`, clamped for month-end days). `paidAt` (set by `toggleBillPaid`) scopes "paid" to the current monthly cycle for `repeatMonthly` bills, so a bill marked paid last month is correctly treated as unpaid again this month — no separate reset job needed. Every consumer (`PaidToggle`, `BillsList`, `computeBillsSummary`, `computeCategoryBreakdown`, the reminders cron) reads `isPaidThisCycle` from this same function.
- `api/actions.ts` — `addBill`, `updateBill`, `deleteBill`, `toggleBillPaid` Server Actions.
- `components/BillsSummary.tsx` — paid/pending cards + progress bar.
- The Bills page also renders the shared `CategoryBreakdown` component below `BillsSummary`, showing this month's paid spend per category.
- `components/BillsList.tsx` — filter chips + bill rows (tap to edit), overdue/due-soon `Chip` badges, empty state.
- `components/PaidToggle.tsx` — per-row paid/unpaid checkbox button, calls `toggleBillPaid`.
- `components/BillSheet.tsx` — shared Add/Edit sheet, mounted in the Bills tab (edit), the Home activity feed (edit, via `dashboard/components/ActivitySection.tsx`), and `AppChrome` (create).
