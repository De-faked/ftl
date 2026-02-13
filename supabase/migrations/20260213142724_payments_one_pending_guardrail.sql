-- Guardrails for checkout stability (SAFE)
-- 1) Ensure cart_id has a default (helps avoid manual insert mistakes)
-- 2) Expire duplicate pending rows (keeps newest)
-- 3) Enforce "only one pending payment per application" going forward

begin;

-- 1) Default cart_id to a random UUID text (only used if insert omits cart_id)
alter table public.payments
  alter column cart_id set default (gen_random_uuid()::text);

-- 2) Expire duplicates: keep newest pending per (user_id, application_id)
with ranked as (
  select
    id,
    row_number() over (
      partition by user_id, application_id
      order by created_at desc
    ) as rn
  from public.payments
  where status in ('created', 'redirected')
)
update public.payments p
set
  status = 'expired',
  updated_at = now()
from ranked r
where p.id = r.id
  and r.rn > 1;

-- 3) Prevent future duplicates (partial unique index)
create unique index if not exists payments_one_pending_per_application
  on public.payments (user_id, application_id)
  where status in ('created', 'redirected');

commit;
