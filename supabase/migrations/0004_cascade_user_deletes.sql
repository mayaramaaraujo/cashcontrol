-- groups.created_by and group_members.user_id referenced auth.users(id)
-- with the default ON DELETE NO ACTION, so deleting a user (via the
-- Supabase Dashboard's "Delete user", the Admin API, or delete_own_account()
-- reaching auth.users before its own manual cleanup finished) hit a foreign
-- key violation whenever that user owned a group or belonged to one.
-- Cascading here matches delete_own_account()'s existing intent (deleting
-- the account takes groups the user created with it, and removes their
-- membership from groups they don't own) for every deletion path, not just
-- the RPC.
alter table public.groups
  drop constraint groups_created_by_fkey,
  add constraint groups_created_by_fkey
    foreign key (created_by) references auth.users(id) on delete cascade;

alter table public.group_members
  drop constraint group_members_user_id_fkey,
  add constraint group_members_user_id_fkey
    foreign key (user_id) references auth.users(id) on delete cascade;
