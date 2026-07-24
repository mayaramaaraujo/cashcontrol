-- The invite link (People tab) pointed at /join/{invite_code}, but no
-- route or backend support for actually joining via that link existed —
-- visiting it just 404'd. These two functions back that flow:

-- Public-safe lookup: returns just the group's name for a given invite
-- code, so an unauthenticated visitor can see what they're being invited
-- to before signing in. No group_members/financial data exposed, and it's
-- the only way an anonymous/non-member request can read anything from
-- `groups` (groups_select's RLS otherwise requires active membership).
create or replace function public.get_group_by_invite_code(p_invite_code text)
returns table(id uuid, name text)
language sql
security definer
set search_path = public
stable
as $$
  select id, name from public.groups where invite_code = p_invite_code;
$$;

revoke all on function public.get_group_by_invite_code(text) from public;
grant execute on function public.get_group_by_invite_code(text) to anon, authenticated;

-- Joins the current user into a group by invite code. Security definer for
-- the same reason as create_group_with_owner: keeps the color_index
-- derivation server-side in one round trip, run as the calling user's own
-- identity via auth.uid() (not a client-supplied id).
create or replace function public.join_group_by_code(p_invite_code text, p_display_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_group_id uuid;
  v_member_count int;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if exists (
    select 1 from public.group_members
    where user_id = v_user_id and status = 'active'
  ) then
    raise exception 'You''re already in a group';
  end if;

  select id into v_group_id from public.groups where invite_code = p_invite_code;
  if v_group_id is null then
    raise exception 'Invalid or expired invite link';
  end if;

  select count(*) into v_member_count from public.group_members where group_id = v_group_id;

  insert into public.group_members (group_id, user_id, display_name, role, status, color_index)
  values (v_group_id, v_user_id, p_display_name, 'member', 'active', v_member_count % 6);
end;
$$;

revoke all on function public.join_group_by_code(text, text) from public;
grant execute on function public.join_group_by_code(text, text) to authenticated;
