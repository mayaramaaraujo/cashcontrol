-- Multi-currency support: currency is a per-group setting since income/bills
-- are shared across a group's members.
alter table groups
  add column currency text not null default 'EUR' check (currency in ('EUR', 'BRL'));
