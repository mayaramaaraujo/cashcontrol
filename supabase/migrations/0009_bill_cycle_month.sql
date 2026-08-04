-- Non-repeating bills had no month scoping at all: the bills table only
-- stores a day-of-month (due_day), so every one-off bill ever created kept
-- being summed into every future month's totals forever (repeat_monthly
-- bills already reset their "paid" status per cycle via paid_at, but the
-- amount itself was never scoped to a month for either kind).
-- cycle_month records which month a bill belongs to. repeat_monthly bills
-- ignore it (they recur every month by due_day); non-repeating bills are
-- only included in the month matching cycle_month.
alter table bills add column cycle_month text;

update bills set cycle_month = to_char(created_at, 'YYYY-MM');

alter table bills
  alter column cycle_month set default to_char(now(), 'YYYY-MM'),
  alter column cycle_month set not null,
  add constraint bills_cycle_month_format check (cycle_month ~ '^\d{4}-\d{2}$');
