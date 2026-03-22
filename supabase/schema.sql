-- Secure cloud persistence for Nepiz
-- Run in Supabase SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.couple_data (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  data_key text not null,
  payload jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner, data_key)
);

create index if not exists couple_data_owner_idx on public.couple_data(owner);
create index if not exists couple_data_key_idx on public.couple_data(data_key);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_couple_data_updated_at on public.couple_data;
create trigger trg_couple_data_updated_at
before update on public.couple_data
for each row
execute function public.set_updated_at();

alter table public.couple_data enable row level security;

drop policy if exists "couple_data_select_own" on public.couple_data;
create policy "couple_data_select_own"
on public.couple_data
for select
to authenticated
using (auth.uid() = owner);

drop policy if exists "couple_data_insert_own" on public.couple_data;
create policy "couple_data_insert_own"
on public.couple_data
for insert
to authenticated
with check (auth.uid() = owner);

drop policy if exists "couple_data_update_own" on public.couple_data;
create policy "couple_data_update_own"
on public.couple_data
for update
to authenticated
using (auth.uid() = owner)
with check (auth.uid() = owner);

drop policy if exists "couple_data_delete_own" on public.couple_data;
create policy "couple_data_delete_own"
on public.couple_data
for delete
to authenticated
using (auth.uid() = owner);

