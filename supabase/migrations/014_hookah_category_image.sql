-- Replace the Hookah (Outside Area) category image with a flat hookah icon that
-- matches the illustrated style of the other category icons.
-- Asset is bundled with the app at public/category-icons/hookah.svg.
begin;

update public.categories
set image_url = '/category-icons/hookah.svg'
where id = 'hookahoutsidearea';

commit;
