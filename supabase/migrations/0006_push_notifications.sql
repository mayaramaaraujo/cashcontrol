-- Push notifications for bill due/overdue reminders.
--
-- `paid_at` lets "paid" be scoped to a monthly cycle for repeat_monthly
-- bills: instead of a scheduled job resetting `paid` back to false at the
-- start of a new month, every consumer (UI, cron) derives "paid for the
-- current cycle" from whether paid_at falls in the current month. This
-- avoids needing a separate reset job entirely.
alter table bills add column paid_at timestamptz;

create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

create policy "push_subscriptions_own" on push_subscriptions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Log of reminders already sent, keyed so a bill can only trigger one
-- due-soon and one overdue push per user per month cycle. Written only by
-- the cron job via the service-role key (bypasses RLS).
create table bill_reminders_sent (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references bills(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  cycle_month date not null,
  reminder_type text not null check (reminder_type in ('due-soon', 'overdue')),
  sent_at timestamptz not null default now(),
  unique (bill_id, user_id, cycle_month, reminder_type)
);

alter table bill_reminders_sent enable row level security;

create policy "bill_reminders_sent_select_own" on bill_reminders_sent
  for select using (user_id = auth.uid());
