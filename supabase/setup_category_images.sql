-- Tea Leaves: category image setup (free-tier safe)
-- Run once in Supabase Dashboard → SQL Editor.
-- Idempotent: safe to re-run if unsure.
--
-- What this does:
--   1. Adds categories.image_url column (stores image link per category)
--   2. Creates public category-images storage bucket (1 GB free tier; ~1–2 MB for all icons)
--   3. Sets storage policies so customers can read and admins can upload
--
-- After running:
--   1. Wait ~10 seconds (or Project Settings → API → Reload schema)
--   2. Sign out of /admin and sign back in
--   3. Categories tab → upload or paste image URL → Save
--   4. Verify: Table Editor → categories → image_url column exists
--   5. Verify: customer menu category bar shows images

alter table public.categories
  add column if not exists image_url text;

-- Legacy emoji column: optional so inserts work without it
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name = 'emoji'
  ) then
    alter table public.categories alter column emoji set default '📦';
    alter table public.categories alter column emoji drop not null;
  end if;
end $$;

-- Ensure admin can insert/update categories (RLS)
alter table public.categories enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories
  for select
  to anon, authenticated
  using (true);

drop policy if exists "categories_admin_insert" on public.categories;
create policy "categories_admin_insert"
  on public.categories
  for insert
  to authenticated
  with check (true);

drop policy if exists "categories_admin_update" on public.categories;
create policy "categories_admin_update"
  on public.categories
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "categories_admin_delete" on public.categories;
create policy "categories_admin_delete"
  on public.categories
  for delete
  to authenticated
  using (true);

-- Force PostgREST to pick up image_url immediately (fixes 400 / PGRST204)
notify pgrst, 'reload schema';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'category-images',
  'category-images',
  true,
  2097152,
  null
)
on conflict (id) do update set
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = null;

drop policy if exists "category_images_public_read" on storage.objects;
create policy "category_images_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'category-images');

drop policy if exists "category_images_admin_insert" on storage.objects;
create policy "category_images_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'category-images'
    and auth.role() = 'authenticated'
  );

drop policy if exists "category_images_admin_update" on storage.objects;
create policy "category_images_admin_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'category-images'
    and auth.role() = 'authenticated'
  )
  with check (bucket_id = 'category-images');

drop policy if exists "category_images_admin_delete" on storage.objects;
create policy "category_images_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'category-images'
    and auth.role() = 'authenticated'
  );

-- Verification (after the script succeeds):
--   [ ] Table Editor → categories → image_url column visible
--   [ ] /admin → Categories → paste URL or upload image → Save (no PGRST204)
--   [ ] Customer menu → category bar shows uploaded images
