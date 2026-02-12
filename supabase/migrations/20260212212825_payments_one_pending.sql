-- A1: Enforce at most one pending payment per user (created/redirected).
-- Safe: expires older pending rows; does not delete anything.

do $$
begin
  -- Keep the newest pending row per user; expire the rest.
  with ranked as (
    select
      id,
      user_id,
      row_number() over (
        partition by user_id
        order by created_at desc, id desc
      ) as rn
    from public.payments
    where status in ('created','redirected')
  )
  update public.payments p
     set status = 'expired',
         updated_at = now()
    from ranked r
   where p.id = r.id
     and r.rn > 1;
end $$;

-- Prevent duplicates going forward:
create unique index if not exists payments_one_pending_per_user
  on public.payments (user_id)
  where status in ('created','redirected');
