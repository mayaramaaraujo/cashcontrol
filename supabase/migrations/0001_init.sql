-- Core schema: groups, group_members, income_entries, bills.
-- RLS scopes every row to the requesting user's active group membership.

create table groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  user_id uuid references auth.users(id),
  invited_email text,
  display_name text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  color_index smallint not null default 0 check (color_index between 0 and 5),
  status text not null default 'active' check (status in ('active', 'invited')),
  created_at timestamptz not null default now(),
  unique (group_id, user_id)
);

create table income_entries (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  member_id uuid not null references group_members(id) on delete cascade,
  category text not null,
  amount numeric(10, 2) not null check (amount > 0),
  note text,
  entry_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table bills (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  name text not null,
  category text not null,
  amount numeric(10, 2) not null check (amount > 0),
  due_day smallint not null check (due_day between 1 and 31),
  fixed boolean not null default true,
  paid boolean not null default false,
  repeat_monthly boolean not null default true,
  created_at timestamptz not null default now()
);

alter table groups enable row level security;
alter table group_members enable row level security;
alter table income_entries enable row level security;
alter table bills enable row level security;

-- security definer helpers: group_members policies would otherwise need to
-- query group_members from within their own policy, which is recursive.
-- These functions run with the owner's privileges (bypassing RLS internally)
-- so the recursion never actually re-triggers RLS.
create or replace function public.is_active_group_member(p_group_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from group_members
    where group_id = p_group_id
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.is_group_admin(p_group_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from group_members
    where group_id = p_group_id
      and user_id = auth.uid()
      and status = 'active'
      and role = 'admin'
  );
$$;

-- groups
create policy "groups_select" on groups
  for select using (public.is_active_group_member(id));

create policy "groups_update" on groups
  for update using (public.is_active_group_member(id));

create policy "groups_insert" on groups
  for insert with check (created_by = auth.uid());

-- group_members
create policy "group_members_select" on group_members
  for select using (public.is_active_group_member(group_id));

create policy "group_members_insert" on group_members
  for insert with check (
    public.is_active_group_member(group_id) or user_id = auth.uid()
  );

create policy "group_members_update" on group_members
  for update using (
    public.is_group_admin(group_id) or user_id = auth.uid()
  );

create policy "group_members_delete" on group_members
  for delete using (
    public.is_group_admin(group_id) or user_id = auth.uid()
  );

-- income_entries
create policy "income_entries_all" on income_entries
  for all using (public.is_active_group_member(group_id))
  with check (public.is_active_group_member(group_id));

-- bills
create policy "bills_all" on bills
  for all using (public.is_active_group_member(group_id))
  with check (public.is_active_group_member(group_id));
