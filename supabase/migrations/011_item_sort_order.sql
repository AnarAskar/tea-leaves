-- 011_item_sort_order.sql
-- Adds per-category ordering to menu items so the admin can reorder them
-- and the customer menu renders them in that order.

alter table public.menu_items
  add column if not exists sort_order integer not null default 0;

-- Backfill: number existing items within each category by insertion order (id).
update public.menu_items m
set sort_order = sub.rn
from (
  select id, (row_number() over (partition by category_id order by id) - 1) as rn
  from public.menu_items
) sub
where m.id = sub.id;

create index if not exists menu_items_category_sort_idx
  on public.menu_items (category_id, sort_order);
