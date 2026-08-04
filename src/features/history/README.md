# history

History tab (`/history`): 6-month income trend, current-month category breakdown, and an earlier-months list. Read-only — no mutations, no `api/` actions.

- `lib.ts` — plain functions: `lastSixMonths`/`monthLabel` (date helpers, reused by the Bills page for its own category breakdown), `computeTrend` (per-month totals + bar heights relative to the 6-month max), `computeCategoryBreakdown(entries, month, colorsByCategory)` (current month's income grouped by category, sorted descending, returns `CategoryBreakdownRow[]` from `@/shared/components/CategoryBreakdown`; `colorsByCategory` comes from `colorsByCategoryName()` in `@/features/categories/lib`), `earlierMonths` (the trend's non-current months, most recent first, year-qualified labels).
- `components/TrendChart.tsx` — 6 bars (current month highlighted), empty state if the whole range has zero income.
- Category breakdown rendering uses the shared `CategoryBreakdown` component (`@/shared/components/CategoryBreakdown`), not a feature-local one.
- `components/EarlierMonths.tsx` — label + total rows, empty state if there's no prior history.

`src/app/(app)/history/page.tsx` is the async Server Component that reads `?month=YYYY-MM` (shared with the other tabs via `AppChrome`), queries `income_entries` for the resulting 6-month range, and passes the results into the above.
