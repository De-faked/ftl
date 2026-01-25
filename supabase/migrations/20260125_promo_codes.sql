-- Promo codes (server-validated, DB-backed)
create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  active boolean not null default true,

  -- Exactly one of these must be set:
  percent_off numeric(5,2),
  amount_off numeric(12,2),

  -- Amount discounts are in this currency (keep USD for now)
  currency text not null default 'USD',

  starts_at timestamptz,
  ends_at timestamptz,

  min_order_amount numeric(12,2),
  max_discount_amount numeric(12,2),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint promo_codes_one_discount_type
    check ( ((percent_off is not null)::int + (amount_off is not null)::int) = 1 ),

  constraint promo_codes_percent_range
    check (percent_off is null or (percent_off > 0 and percent_off <= 100)),

  constraint promo_codes_amount_positive
    check (amount_off is null or amount_off > 0),

  constraint promo_codes_min_amount_nonnegative
    check (min_order_amount is null or min_order_amount >= 0),

  constraint promo_codes_max_discount_nonnegative
    check (max_discount_amount is null or max_discount_amount >= 0),

  constraint promo_codes_dates_valid
    check (starts_at is null or ends_at is null or starts_at <= ends_at)
);

-- Case-insensitive uniqueness for promo codes
create unique index if not exists promo_codes_code_upper_uniq
  on public.promo_codes (upper(code));

-- updated_at helper
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.promo_codes;
create trigger set_updated_at
before update on public.promo_codes
for each row execute function public.tg_set_updated_at();

-- Lock table from client access (server/service_role will manage it)
alter table public.promo_codes enable row level security;

revoke all on table public.promo_codes from anon, authenticated;
grant select, insert, update, delete on table public.promo_codes to service_role;

-- Track discounts in payments
alter table public.payments add column if not exists promo_code text;
alter table public.payments add column if not exists original_amount numeric(12,2);
alter table public.payments add column if not exists discount_amount numeric(12,2);
