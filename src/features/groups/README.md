# groups

Group setup (name), the People tab (`/people`: invite link, invite-by-email, members list), joining via an invite link (`/join/[code]`), roles (admin/member).

- **`lib.ts`** — `GROUP_MEMBER_COLUMNS` (the `group_members` select-column list) and `mapGroupMemberRow` (DB row → `GroupMember`), shared by every query that reads members so the mapping only lives in one place.
- **`api/actions.ts`** — `createGroup` server action, calling the `create_group_with_owner` Postgres RPC (a security-definer function; see `supabase/migrations/0002_create_group_rpc.sql` for why a plain two-step insert doesn't work under this schema's RLS); `inviteByEmail`, which inserts a `status: "invited"`, `user_id: null` member row (no accept-invite flow yet — see the "known scope gaps" note in the implementation plan — this is a *different* row than what joining via the invite link creates); `joinGroupByCode`, calling the `join_group_by_code` RPC (`supabase/migrations/0005_join_group.sql`).
- **`components/GroupSetupForm.tsx`** — the `/setup` screen's form.
- **`components/InviteLinkCard.tsx`** — shareable invite-link display with a "Copy"/"Copied!" toggle (client component, local state). The Setup screen deliberately doesn't show this — the invite code only exists once the group is created — so the People tab is the one place users see it.
- **`components/InviteByEmailForm.tsx`** — email input + Add button, react-hook-form + zod, calling `inviteByEmail`.
- **`components/MembersList.tsx`** — one row per `group_members` row (active or invited), with a "YOU" pill, per-person monthly income total, and role/invited status.
- **`components/JoinGroupCard.tsx`** — the "Join {group}?" confirmation + button shown to an already-authenticated visitor on `/join/[code]`, calling `joinGroupByCode`.

`src/app/(app)/people/page.tsx` is the async Server Component that resolves the invite URL from the request's `host` header, fetches members + this month's `income_entries` (scoped by the shared `?month=` param), and computes each member's monthly total inline (duplicated from `dashboard`'s own computation on purpose — small enough to keep the feature boundary clean, per `AGENTS.md`).

`src/app/join/[code]/page.tsx` is a public route (`src/proxy.ts` exempts `/join/*` from the login redirect) that looks the code up via the `get_group_by_invite_code` RPC (safe for an unauthenticated caller — it only returns the group's name, nothing else, since `groups`' normal RLS requires active membership). Three states: invalid code, not signed in (Sign in/Create account links carrying `?next=/join/{code}` so `LoginForm`/`SignupForm` land back here after auth), or signed in (`JoinGroupCard`).
