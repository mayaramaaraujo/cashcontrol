-- group_members_insert allowed `user_id = auth.uid()` as a standalone
-- clause, so any authenticated user could insert themselves directly into
-- *any* group_id as an active admin, skipping join_group_by_code's invite
-- code validation entirely. The only legitimate direct-insert path is
-- inviteByEmail creating an invited placeholder row (no user_id, status
-- 'invited') while already an active member of that group; real
-- memberships are created by the create_group_with_owner and
-- join_group_by_code security-definer functions, which run as the table
-- owner and bypass RLS, so they don't need this policy's help.
drop policy "group_members_insert" on group_members;
create policy "group_members_insert" on group_members
  for insert with check (
    public.is_active_group_member(group_id)
    and status = 'invited'
    and user_id is null
  );

-- group_members_update had no explicit with check, so its using clause
-- (is_group_admin(group_id) or user_id = auth.uid()) doubled as the check,
-- letting a non-admin member update their own row to role = 'admin' with
-- nothing to stop them. Admins can still change anything; members can only
-- update their own row while keeping role/status unchanged.
drop policy "group_members_update" on group_members;
create policy "group_members_update" on group_members
  for update using (
    public.is_group_admin(group_id) or user_id = auth.uid()
  )
  with check (
    public.is_group_admin(group_id)
    or (user_id = auth.uid() and role = 'member' and status = 'active')
  );
