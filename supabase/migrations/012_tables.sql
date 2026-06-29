-- 012_tables.sql
-- Opaque per-table tokens. The QR code encodes /?t=<token>; the menu resolves
-- the token to a table number. Guessed/edited tokens simply don't resolve.

create table if not exists public.tables (
  token text primary key,
  number integer not null,
  created_at timestamptz not null default now()
);

create unique index if not exists tables_number_key on public.tables (number);

alter table public.tables enable row level security;

-- Public read so the customer menu can resolve a token to a table number.
drop policy if exists "tables_public_read" on public.tables;
create policy "tables_public_read"
  on public.tables
  for select
  to anon, authenticated
  using (true);

-- Admin (authenticated) full write.
drop policy if exists "tables_admin_insert" on public.tables;
create policy "tables_admin_insert"
  on public.tables
  for insert
  to authenticated
  with check (true);

drop policy if exists "tables_admin_update" on public.tables;
create policy "tables_admin_update"
  on public.tables
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "tables_admin_delete" on public.tables;
create policy "tables_admin_delete"
  on public.tables
  for delete
  to authenticated
  using (true);
