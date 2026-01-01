-- Gallery CMS: dynamic gallery items (admin-managed)

create extension if not exists pgcrypto;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),

  -- 'photo' and 'video' are stored in R2 (storage_key required)
  -- 'external_video' is a link (public_url required)
  kind text not null check (kind in ('photo', 'video', 'external_video')),

  storage_key text,
  public_url text,
  thumb_url text,

  content_type text,
  size_bytes bigint,
  width int,
  height int,
  duration_seconds numeric,

  caption_ar text,
  caption_en text,
  caption_id text,

  alt_ar text,
  alt_en text,
  alt_id text,

  sort_order int not null default 0,
  is_published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint gallery_items_file_or_url_chk
  check (
    (kind in ('photo','video') and storage_key is not null)
    or
    (kind = 'external_video' and public_url is not null)
  )
);

create index if not exists gallery_items_public_list_idx
  on public.gallery_items (is_published, sort_order, created_at desc);

-- updated_at trigger (safe even if re-run)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_gallery_items_updated_at on public.gallery_items;
create trigger set_gallery_items_updated_at
before update on public.gallery_items
for each row execute function public.set_updated_at();

-- RLS: public can read only published items; no client-side writes.
alter table public.gallery_items enable row level security;

drop policy if exists "Public read published gallery items" on public.gallery_items;
create policy "Public read published gallery items"
on public.gallery_items
for select
to anon, authenticated
using (is_published = true);
