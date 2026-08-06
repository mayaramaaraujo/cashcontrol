# Finkith — React Native Spec

Same product, same Supabase backend, new client. This is a build spec for a React Native app that
talks to the **same Supabase project** as the Next.js app (same tables, same RLS, same auth users) —
not a rewrite of the backend. You'll be building the client yourself; this doc is the reference, not
generated code.

## 0. Ground rules

- **One Supabase backend for both apps.** Don't fork the schema. If you add a mobile-only table
  (push tokens — see §5), it lives in the same project via a new migration, additive only.
- **Auth is shared.** A user who signed up on the web can log into the RN app with the same
  email/password, land in the same group, see the same data. Supabase Auth already handles this;
  no new auth backend needed.
- **RLS already does the heavy lifting.** Every read/write goes through the existing
  `is_active_group_member` / `is_group_admin` policies. The mobile client doesn't need its own
  authorization logic beyond "call the RPC / query the table the same way the web app does."
- **No AI-generated code for this build** — this document is scope/reference only, written so you
  can implement it by hand.

## 1. Suggested stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Expo (React Native) + TypeScript | Managed workflow gets you push notifications, deep linking (invite links), and OTA updates without native build pain |
| Navigation | React Navigation (bottom tabs + native stack) | Maps directly to the web app's 4 tabs + modals |
| Backend client | `@supabase/supabase-js` with `expo-secure-store` as the auth storage adapter | Session persistence on-device; same query/RPC surface as the web app |
| Forms | `react-hook-form` + `zod` (`@hookform/resolvers/zod`) | Matches the web app's convention (`AGENTS.md`); reuse schema shapes conceptually (can't literally import `src/features/*/types.ts` since dictionaries are web-only, but mirror the validation rules) |
| Styling | NativeWind (Tailwind for RN) | Closest parity to the web app's Tailwind tokens in `globals.css` — otherwise hand-port the token scale into a theme object |
| Server state | TanStack Query (`@tanstack/react-query`) | Web app uses Server Components for this; RN has no equivalent, so Query fills the "fetch + cache + revalidate" role that `revalidatePath` played server-side |
| Push notifications | `expo-notifications` + Expo Push Tokens | Web app uses raw Web Push (VAPID); Expo apps use Expo's push service instead — different token shape, see §5 |
| i18n | `i18next` + `react-i18next`, or port the existing `dictionaries/en.ts` / `pt-BR.ts` structure | Web app already has en/pt-BR dictionaries — reuse the same key structure so translations stay in sync |

## 2. What's identical to the web app (reuse as-is)

These Supabase tables and RPCs are consumed unchanged — no migration needed:

- **Tables**: `groups`, `group_members`, `income_entries`, `bills`, `categories`
- **RPCs**: `create_group_with_owner`, `join_group_by_code`, `get_group_by_invite_code`,
  `delete_own_account`
- **RLS policies**: all of them — a mobile client authenticated via the same Supabase Auth user
  automatically gets the same row visibility.
- **Business logic to port as plain TS functions** (currently in `src/features/*/lib.ts` on web —
  reimplement the same math, don't reinvent it):
  - Hero totals: income total, bills total, bills paid/pending, "projected after bills" (income −
    all bills), "available today" (income − paid bills only)
  - Per-member income totals (member strip)
  - Merged, date-sorted activity feed (income entries + bills as one list)
  - 6-month income trend + current-month category breakdown + earlier-months list
  - Bill due-status derivation (`due-soon` / `overdue` / `paid` / `upcoming` from `due_day` +
    `paid_at` + `repeat_monthly` + `cycle_month`)

## 3. Non-goals for v1

- No offline-first sync — always require network, matching the web app's server-driven model.
- No native widgets/home-screen complications yet.
- No feature the web app doesn't have (this is parity work, not a redesign).

## 4. Milestones

### M1 — Auth + Group shell
Get a logged-in user into a group. No financial data yet.

### M2 — Income & Bills core
The two data types that drive every screen.

### M3 — Home dashboard
Composite screen built from M2 data.

### M4 — History
Read-only trends screen.

### M5 — Settings & group management
Currency, categories, members, invites, account deletion.

### M6 — Push notifications
Bill due/overdue reminders via Expo push.

### M7 — Polish
i18n, empty states, error states, pull-to-refresh.

---

## 5. User stories

Each story includes acceptance criteria and the Supabase call(s) it depends on. Story IDs are
`M<milestone>.<n>`.

### M1 — Auth + Group shell

**M1.1 — Sign up**
As a new user, I can create an account with name, email, password.
- Fields: name (required), email (valid email), password (min 8 chars) — mirrors
  `createSignupSchema` in `src/features/auth/types.ts`.
- Calls `supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })`.
- On success, proceeds to group setup (M1.3) since the user has no group yet.

**M1.2 — Log in**
As a returning user, I can log in with email/password.
- `supabase.auth.signInWithPassword`.
- On success: if the user has an active `group_members` row → go to Home; else → group setup.

**M1.3 — Create a group**
As a user with no group, I can create one by name.
- Calls RPC `create_group_with_owner(p_name, p_display_name)` — display name derived from
  `user_metadata.full_name` or the email local-part, capitalized (same fallback as
  `deriveDisplayName` on web).
- This RPC also seeds the group's default bill/income categories — nothing else to do client-side.

**M1.4 — Join a group via invite link**
As an invited user, I can open an invite link (`finkith://join/{code}` deep link, or a universal
link if you set one up) and join.
- Unauthenticated visitor: call `get_group_by_invite_code(p_invite_code)` to show "You're invited to
  join {group name}" before requiring login/signup.
- After auth: call `join_group_by_code(p_invite_code, p_display_name)`.
- Error cases to surface: invalid/expired code, already in a group.

**M1.5 — Session persistence**
As a user, I stay logged in across app restarts.
- Supabase client configured with `expo-secure-store` as `AsyncStorage`-compatible storage.

**M1.6 — Log out**
- `supabase.auth.signOut()`, clear local Query cache, return to login screen.

### M2 — Income & Bills core

**M2.1 — Add income entry**
As a group member, I can log an income entry.
- Fields: member (defaults to me), category (from group's income categories), amount (> 0),
  date (defaults today), note (optional) — mirrors `createAddIncomeSchema`.
- Insert into `income_entries` with `group_id`, `member_id`, `category`, `amount`, `entry_date`,
  `note`.

**M2.2 — Edit / delete income entry**
- Update/delete by `id`; RLS scopes to group membership already, no extra guard needed client-side.

**M2.3 — Add bill**
As a group member, I can add a bill.
- Fields: name, category, amount (> 0), due day (1–31), fixed (bool), repeat monthly (bool),
  paid (bool) — mirrors `createBillSchema`.
- On insert: if `paid` is true, set `paid_at = now()`; else `null`.
- `cycle_month` defaults server-side (`to_char(now(),'YYYY-MM')`) — don't set it from the client
  unless adding a bill for a past/future cycle explicitly.

**M2.4 — Edit / delete bill**
- Same shape as add; toggling `paid` must also set/clear `paid_at` (this is what scopes "paid" to
  the current monthly cycle for repeating bills — there's no reset job, the month comparison does
  the work).

**M2.5 — Toggle bill paid from a list row**
As a group member, I can mark a bill paid/unpaid with one tap without opening the edit form.
- Same update as M2.4 but a lightweight one-field mutation (`toggleBillPaid` equivalent).

**M2.6 — Bill due-status badge**
As a group member, I can see at a glance which bills are due soon, overdue, or paid.
- Port `getBillDueInfo`-equivalent logic: for `repeat_monthly` bills, compute next due date from
  `due_day` relative to today; status is `overdue` (past due day, unpaid), `due-soon` (within N days,
  unpaid — check the web app's threshold constant), or `upcoming`/`paid` otherwise. Non-repeating
  bills only "belong" to the month in `cycle_month`.

### M3 — Home dashboard

**M3.1 — Hero summary**
As a group member, on Home I see: combined income (with "N contributing" subtext), total bills
(with paid/pending breakdown), projected-after-bills (income − all bills, red if negative), and
available-today (income − paid bills only, red if negative).
- All derived client-side from the month's `income_entries` + `bills` — no new query, just port
  `computeHero`.

**M3.2 — Month switcher**
As a group member, I can switch which month Home/Bills/History show.
- A single month value (`YYYY-MM`) shared across the three screens — equivalent to the web app's
  `?month=` query param living in the shell (`AppChrome`). In RN, hold it in a shared context or
  navigation param at the tab-navigator level.

**M3.3 — Member strip**
As a group member, I see each active member's avatar, name, and their income total for the month,
plus an "add" tile linking to Settings (invite flow).

**M3.4 — Activity feed**
As a group member, I see a merged, date-sorted list of income entries and bills for the month, with
All/Income/Bills filter chips (client-side filter, no refetch). Tapping a row opens that item for
editing (income → income form, bill → bill form).

### M4 — History

**M4.1 — 6-month income trend**
As a group member, I see a bar chart of income totals for the current month + 5 preceding months,
current month highlighted. Empty state if the whole range has zero income.

**M4.2 — Current-month category breakdown**
As a group member, I see this month's income grouped by category, sorted descending by amount, with
percent-of-total.

**M4.3 — Earlier months list**
As a group member, I see the 5 non-current months from the trend, most recent first, each showing a
total, with an empty state if there's no prior history.

### M5 — Settings & group management

**M5.1 — View/edit group members**
As a group admin, I can see all members (active + invited) and their roles.

**M5.2 — Invite a member**
As a group admin, I can share the group's invite link/code (deep link built from `invite_code`).

**M5.3 — Change currency**
As a group admin, I can switch the group's currency between EUR and BRL (only these two are valid —
`isCurrency` guard). This is a group-wide setting, not per-user.

**M5.4 — Manage categories**
As a group member, I can add/delete custom bill or income categories (name + color accent). Deleting
a category never touches historical entries — `category` on `bills`/`income_entries` is plain text,
not a foreign key.

**M5.5 — Delete account**
As a user, I can delete my account. Calls `delete_own_account()`. If I created a group, deleting my
account deletes that whole group (cascades); if I'm just a member elsewhere, only my membership is
removed. Warn the user about this distinction in the confirmation dialog — it's not just "delete my
data."

### M6 — Push notifications

**M6.1 — Register for push**
As a user, on first launch (or from Settings) I can enable notifications; the app registers an Expo
push token and saves it server-side (see §6 schema note — this needs a new table, `expo_push_tokens`,
distinct from the web app's `push_subscriptions`).

**M6.2 — Bill due/overdue reminders**
As a user, I receive a push notification when a repeating bill is due-soon or overdue, once per bill
per user per monthly cycle (same dedupe rule as `bill_reminders_sent`: unique on
`(bill_id, user_id, cycle_month, reminder_type)`).
- The existing cron job (`src/app/api/cron/bill-reminders`) needs to also fan out to
  `expo_push_tokens` via Expo's push API (`exp.host/--/api/v2/push/send`) alongside its existing
  Web Push branch — this is a backend change, not something the RN client does itself.

### M7 — Polish

**M7.1 — Localization** — port `en`/`pt-BR` dictionaries; respect device locale by default with an
in-app override (mirrors the web app's locale switcher).

**M7.2 — Empty states** — every list (bills, income, activity, history) has an explicit
"nothing yet" state, never mock/sample data (per `AGENTS.md`: no mock data in the UI).

**M7.3 — Pull-to-refresh** — since there's no Server Component auto-revalidation in RN, every screen
needs an explicit refetch affordance (pull-to-refresh + on-focus refetch via React Navigation's
`useFocusEffect` + Query's `refetch`).

---

## 6. Schema

### Reused as-is (no changes)

```sql
-- groups, group_members, income_entries, bills, categories,
-- push_subscriptions, bill_reminders_sent
-- — see supabase/migrations/0001_init.sql through 0010_fix_group_members_rls.sql
-- in the web app repo for the authoritative source.
```

Key fields worth knowing going in:

- `groups.currency`: `'EUR' | 'BRL'`, defaults `'EUR'`.
- `group_members.color_index`: 0–5, assigned round-robin (`member_count % 6`) on join — used to pick
  an avatar color, not user-chosen.
- `group_members.status`: `'active' | 'invited'` — an "invited" row has `user_id = null` and
  `invited_email` set; it's a placeholder until that person joins.
- `bills.paid_at`: drives "paid for the current cycle" — a repeating bill's `paid` flag is only
  considered current if `paid_at` falls within the current month; there's no monthly reset job.
- `bills.cycle_month`: `'YYYY-MM'` — only relevant for non-repeating bills (repeating bills recur
  every month via `due_day` regardless of `cycle_month`).
- `categories`: unique per `(group_id, type, name)`; `category` columns on `bills`/`income_entries`
  are free text, not FKs — deleting a category is non-destructive to history.

### New migration needed: Expo push tokens

Web Push (VAPID: endpoint + p256dh + auth keys) and Expo Push (a single opaque token string) are
different delivery mechanisms — you can't reuse `push_subscriptions` for both without overloading
its shape. Add a parallel table:

```sql
create table expo_push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  created_at timestamptz not null default now()
);

alter table expo_push_tokens enable row level security;

create policy "expo_push_tokens_own" on expo_push_tokens
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
```

The cron job then queries both `push_subscriptions` (Web Push branch, unchanged) and
`expo_push_tokens` (new Expo branch) per user and sends through whichever channels they've
registered.

---

## 7. Screen-to-table map (quick reference)

| Screen | Reads | Writes |
|---|---|---|
| Login/Signup | `auth.users` (via Supabase Auth) | — |
| Group setup / Join | `groups` (via RPC) | `groups`, `group_members` (via RPC) |
| Home | `group_members`, `income_entries`, `bills`, `categories` | `income_entries`, `bills` (via activity row taps) |
| Bills tab | `bills`, `categories` | `bills` |
| History | `income_entries` (6-month range) | — |
| Settings | `group_members`, `groups`, `categories` | `group_members`, `groups`, `categories`, `auth.users` (delete) |
| Push opt-in | `expo_push_tokens` | `expo_push_tokens` |
