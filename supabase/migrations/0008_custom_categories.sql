-- Custom categories: previously bill/income categories were a fixed
-- app-hardcoded list. Now each group can add/remove its own. category on
-- bills/income_entries stays plain text (no FK) so renaming or deleting a
-- category never touches historical rows.
create table categories (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  type text not null check (type in ('bill', 'income')),
  name text not null,
  color text not null,
  created_at timestamptz not null default now(),
  unique (group_id, type, name)
);

alter table categories enable row level security;

create policy "categories_all" on categories
  for all using (public.is_active_group_member(group_id))
  with check (public.is_active_group_member(group_id));

-- Seed every existing group with today's fixed categories so current
-- bills/income keep the same colors and translated labels.
insert into categories (group_id, type, name, color)
select id, 'bill', v.name, v.color from groups, (values
  ('Housing', 'primary'),
  ('Utilities', 'positive-dark'),
  ('Insurance', 'violet'),
  ('Subscriptions', 'warning'),
  ('Groceries', 'avatar-2'),
  ('Fuel', 'avatar-4'),
  ('Other', 'neutral-accent')
) as v(name, color);

insert into categories (group_id, type, name, color)
select id, 'income', v.name, v.color from groups, (values
  ('Salary', 'avatar-3'),
  ('Freelance', 'avatar-2'),
  ('Bonus', 'avatar-4'),
  ('Part-time', 'avatar-5'),
  ('Gift', 'avatar-1'),
  ('Other', 'neutral-accent')
) as v(name, color);

-- Re-seed the same defaults for groups created from here on, inside the
-- same atomic transaction as group + owner creation.
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

  insert into public.categories (group_id, type, name, color)
  values
    (v_group.id, 'bill', 'Housing', 'primary'),
    (v_group.id, 'bill', 'Utilities', 'positive-dark'),
    (v_group.id, 'bill', 'Insurance', 'violet'),
    (v_group.id, 'bill', 'Subscriptions', 'warning'),
    (v_group.id, 'bill', 'Groceries', 'avatar-2'),
    (v_group.id, 'bill', 'Fuel', 'avatar-4'),
    (v_group.id, 'bill', 'Other', 'neutral-accent'),
    (v_group.id, 'income', 'Salary', 'avatar-3'),
    (v_group.id, 'income', 'Freelance', 'avatar-2'),
    (v_group.id, 'income', 'Bonus', 'avatar-4'),
    (v_group.id, 'income', 'Part-time', 'avatar-5'),
    (v_group.id, 'income', 'Gift', 'avatar-1'),
    (v_group.id, 'income', 'Other', 'neutral-accent');

  return v_group;
end;
$$;

revoke all on function public.create_group_with_owner(text, text) from public;
grant execute on function public.create_group_with_owner(text, text) to authenticated;
