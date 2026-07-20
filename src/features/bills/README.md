# bills

Bills tab (`/bills`) and the Add/Edit Bill sheet, opened either from a bill row (edit) or the shell's FAB via `?sheet=bill` (create), wired into `AppChrome`.

- `types.ts` — `Bill`, `BILL_CATEGORIES`, `BILL_CATEGORY_COLORS` (Chip accent tokens), `billSchema`/`BillValues` (react-hook-form + zod).
- `lib.ts` — row mapping, paid/pending summary math, fixed/variable filtering.
- `api/actions.ts` — `addBill`, `updateBill`, `deleteBill`, `toggleBillPaid` Server Actions.
- `components/BillsSummary.tsx` — paid/pending cards + progress bar.
- `components/BillsList.tsx` — filter chips + bill rows (tap to edit), empty state.
- `components/PaidToggle.tsx` — per-row paid/unpaid checkbox button, calls `toggleBillPaid`.
- `components/BillSheet.tsx` — shared Add/Edit sheet, mounted both in the Bills tab (edit) and `AppChrome` (create).
