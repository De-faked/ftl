create extension if not exists "pgcrypto";

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  application_id uuid null,
  cart_id text not null unique,
  tran_ref text null,
  amount numeric not null,
  currency text not null,
  status text not null default 'created',
  redirect_url text null,
  paypage_ttl int null,
  callback_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
before update on public.payments
for each row execute procedure public.set_updated_at();

alter table public.payments enable row level security;

drop policy if exists "Payments select own" on public.payments;
create policy "Payments select own" on public.payments
for select
using (auth.uid() = user_id);

drop policy if exists "Payments select admin" on public.payments;
create policy "Payments select admin" on public.payments
for select
using (is_admin());
