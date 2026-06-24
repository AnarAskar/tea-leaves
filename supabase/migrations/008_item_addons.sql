-- Add optional addons array to menu items.
-- Each addon: { id, name_en, name_ar, name_ku, price }
-- Empty array means no addons for that item.
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS addons JSONB NOT NULL DEFAULT '[]'::jsonb;
