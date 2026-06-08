-- Fix category-images bucket config (run if uploads return 400)
-- Safe to run multiple times.

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

-- Ensure storage policies exist
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
