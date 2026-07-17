# groups

Group setup (name + invite link), members list, roles (admin/member), invite-by-email.

- **`lib.ts`** — `GROUP_MEMBER_COLUMNS` (the `group_members` select-column list) and `mapGroupMemberRow` (DB row → `GroupMember`), shared by every query that reads members so the mapping only lives in one place.
- **`api/actions.ts`** — `createGroup` server action, calling the `create_group_with_owner` Postgres RPC (a security-definer function; see `supabase/migrations/0002_create_group_rpc.sql` for why a plain two-step insert doesn't work under this schema's RLS).
- **`components/GroupSetupForm.tsx`** — the `/setup` screen's form.
