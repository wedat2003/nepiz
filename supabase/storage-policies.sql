-- Secure media bucket policies for Nepiz
-- Run in Supabase SQL Editor after creating a private bucket `nepiz-media`

-- 1) Create private bucket (in Supabase UI):
--    Storage -> New bucket -> name: nepiz-media -> Public bucket: OFF

-- 2) RLS policies for storage.objects

drop policy if exists "media_read_own" on storage.objects;
create policy "media_read_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'nepiz-media'
  and owner = auth.uid()::text
);

drop policy if exists "media_insert_own" on storage.objects;
create policy "media_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'nepiz-media'
  and owner = auth.uid()::text
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "media_update_own" on storage.objects;
create policy "media_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'nepiz-media'
  and owner = auth.uid()::text
)
with check (
  bucket_id = 'nepiz-media'
  and owner = auth.uid()::text
);

drop policy if exists "media_delete_own" on storage.objects;
create policy "media_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'nepiz-media'
  and owner = auth.uid()::text
);

