-- Row Level Security for Tea Leaves menu
-- Public: read categories + available menu items only
-- Authenticated admins: full CRUD on both tables

alter table public.categories enable row level security;
alter table public.menu_items enable row level security;

-- categories: public read
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories
  for select
  to anon, authenticated
  using (true);

-- categories: admin write
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

-- menu_items: public read available items only
drop policy if exists "menu_items_public_read" on public.menu_items;
create policy "menu_items_public_read"
  on public.menu_items
  for select
  to anon
  using (is_available = true);

-- menu_items: admin read all (including unavailable)
drop policy if exists "menu_items_admin_read" on public.menu_items;
create policy "menu_items_admin_read"
  on public.menu_items
  for select
  to authenticated
  using (true);

-- menu_items: admin write
drop policy if exists "menu_items_admin_insert" on public.menu_items;
create policy "menu_items_admin_insert"
  on public.menu_items
  for insert
  to authenticated
  with check (true);

drop policy if exists "menu_items_admin_update" on public.menu_items;
create policy "menu_items_admin_update"
  on public.menu_items
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "menu_items_admin_delete" on public.menu_items;
create policy "menu_items_admin_delete"
  on public.menu_items
  for delete
  to authenticated
  using (true);
