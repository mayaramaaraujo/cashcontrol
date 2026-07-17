-- Deleting an auth.users row requires elevated privileges the app's anon
-- key doesn't have (normally the service-role admin API). A security
-- definer function lets the user delete their own account without needing
-- a service-role key on the client, reusing the pattern already used for
-- create_group_with_owner and the is_active_group_member/is_group_admin
-- RLS helpers in 0001_init.sql.
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Groups this user created have no other owner to hand off to (no
  -- reassignment flow exists), so deleting the account takes the whole
  -- group with it — cascades to that group's own group_members/
  -- income_entries/bills rows. Membership in groups owned by someone else
  -- is just removed.
  delete from public.groups where created_by = v_user_id;
  delete from public.group_members where user_id = v_user_id;
  delete from auth.users where id = v_user_id;
end;
$$;

revoke all on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;
