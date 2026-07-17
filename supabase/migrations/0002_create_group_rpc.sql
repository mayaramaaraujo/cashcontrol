-- Group creation needs both the `groups` insert and the creator's own
-- `group_members` insert to happen atomically, and the caller has no active
-- group_members row yet when the first insert happens — so reading the new
-- group row back (e.g. via `.select().single()` after insert) fails the
-- groups_select policy, which requires one. A security definer function
-- does both inserts in one transaction and bypasses RLS internally,
-- avoiding the chicken-and-egg problem entirely.
create or replace function public.create_group_with_owner(p_name text, p_display_name text)
returns public.groups
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_invite_code text := substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);
  v_group public.groups;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.groups (name, invite_code, created_by)
  values (p_name, v_invite_code, v_user_id)
  returning * into v_group;

  insert into public.group_members (group_id, user_id, display_name, role, status, color_index)
  values (v_group.id, v_user_id, p_display_name, 'admin', 'active', 0);

  return v_group;
end;
$$;

revoke all on function public.create_group_with_owner(text, text) from public;
grant execute on function public.create_group_with_owner(text, text) to authenticated;
