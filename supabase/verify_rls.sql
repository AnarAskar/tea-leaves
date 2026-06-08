-- Run in Supabase SQL Editor to audit RLS is enabled and policies exist.
-- Expected: rls_enabled = true for both tables, 8 policies total.

select
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public'
  and tablename in ('categories', 'menu_items');

select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('categories', 'menu_items')
order by tablename, policyname;
