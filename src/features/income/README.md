# income

Income entries and the Add Income sheet, opened from the shell's FAB via `?sheet=income`, wired into `AppChrome`.

- `types.ts` — `IncomeEntry`, `INCOME_CATEGORIES`, `INCOME_CATEGORY_COLORS` (Chip accent tokens), `addIncomeSchema`/`AddIncomeValues` (react-hook-form + zod).
- `api/actions.ts` — `addEntry` Server Action.
- `components/AddIncomeSheet.tsx` — amount + member picker + category chips + note, mounted in `AppChrome` (create-only; there's no edit/history-editing flow for income entries).
