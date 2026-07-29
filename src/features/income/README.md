# income

Income entries and the Add/Edit Income sheet, opened either from an activity row on Home (edit) or the shell's FAB via `?sheet=income` (create), wired into `AppChrome`.

- `types.ts` — `IncomeEntry`, `INCOME_CATEGORIES`, `INCOME_CATEGORY_COLORS` (Chip accent tokens), `addIncomeSchema`/`AddIncomeValues` (react-hook-form + zod).
- `api/actions.ts` — `addEntry`, `updateEntry`, `deleteEntry` Server Actions.
- `components/IncomeSheet.tsx` — shared Add/Edit sheet (amount + member picker + category chips + note), mounted both in `ActivitySection` (edit, via clicking an income row) and `AppChrome` (create).
