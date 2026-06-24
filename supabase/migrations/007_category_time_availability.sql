-- Add optional time-window fields to categories.
-- When both are NULL the category is always visible.
-- When set, the customer menu only shows the category between available_from and available_until.
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS available_from TIME DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS available_until TIME DEFAULT NULL;
