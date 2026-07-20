# history

History tab (`/history`): 6-month income trend, current-month category breakdown, and an earlier-months list. Read-only — no mutations, no `api/` actions.

- `lib.ts` — plain functions: `lastSixMonths`/`monthLabel` (date helpers), `computeTrend` (per-month totals + bar heights relative to the 6-month max), `computeCategoryBreakdown` (current month's income grouped by category, sorted descending), `earlierMonths` (the trend's non-current months, most recent first, year-qualified labels).
- `components/TrendChart.tsx` — 6 bars (current month highlighted), empty state if the whole range has zero income.
- `components/CategoryBreakdown.tsx` — colored dot + name + amount + `ProgressBar` per category, empty state if the current month has no entries.
- `components/EarlierMonths.tsx` — label + total rows, empty state if there's no prior history.

`src/app/(app)/history/page.tsx` is the async Server Component that reads `?month=YYYY-MM` (shared with the other tabs via `AppChrome`), queries `income_entries` for the resulting 6-month range, and passes the results into the above.
