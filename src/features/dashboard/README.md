# dashboard

Home screen: income/bills/left hero summary, member strip, activity feed. Month selection itself lives in the shared `AppChrome` shell (`?month=YYYY-MM`); this feature just reads it.

- **`lib.ts`** — plain functions computing everything from server-fetched data: `computeHero` (income/bills/left, all three at once), `computeMemberStrip` (per-member monthly totals), `buildIncomeActivity`/`buildBillActivity`/`mergeActivity` (the merged, date-sorted activity feed). No React state — the source data only changes on a full page refetch.
- **`components/HeroSection.tsx`** — server-renderable hero card showing all three (income headline + bills/left as a secondary row) in one banner — no toggle/tabs, so nothing is hidden behind a click.
- **`components/MemberStrip.tsx`** — server-renderable "by person" horizontal scroll strip.
- **`components/ActivitySection.tsx`** — client component for the All/Income/Bills filter chips (local state, filters/caps the already-fetched lists — no refetch).

`src/app/(app)/home/page.tsx` is the async Server Component that queries Supabase (active members, this month's `income_entries`, all `bills`) and passes results into the above.
