-- Give real, appropriate photos to menu items that had no image (they were all
-- rendering the same fallback placeholder). Images are hotlinked from Unsplash
-- (free for commercial use, no attribution required).
--
-- Each UPDATE only fills the photo when it is still empty, so it will not
-- overwrite an image you set later. Matched by category + exact English name.
begin;

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1694071049321-ca04e17d779d?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'hookahoutsidearea' and btrim(name_en) = 'Lemon Mint' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1662805522314-d316b95046b1?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'hookahoutsidearea' and btrim(name_en) = 'Gum Mint' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1655855055440-bb76fc92e1ba?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'hookahoutsidearea' and btrim(name_en) = '2 Apples' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1662468527222-e4edb1cda938?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'hookahoutsidearea' and btrim(name_en) = 'Pesca La Felce' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1685003227041-49af807c0113?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'hookahoutsidearea' and btrim(name_en) = 'Havana Sky' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1630175772812-3368aad7982d?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'hookahoutsidearea' and btrim(name_en) = 'English Special' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1574238752695-675b86d49267?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'hookahoutsidearea' and btrim(name_en) = 'Natural' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1635547821500-77542481940c?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'hookahoutsidearea' and btrim(name_en) = 'VIP' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1753954559759-480c89ba99d6?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'hotdrinks' and btrim(name_en) = 'Mate' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1641919089328-5d5063828c4f?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'hotdrinks' and btrim(name_en) = 'Tropical Mate' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1607811253515-57ef7723099d?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'pizza' and btrim(name_en) = 'Margherita' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1568309344402-e55115e869fe?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'signaturedrinks' and btrim(name_en) = 'Rooibos Vanilla Ice Tea' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1606444006818-3e66c09f2724?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'signaturedrinks' and btrim(name_en) = 'Roibos chocolate truffle Ice Tea' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1584587727565-a486d45d58b4?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'signaturedrinks' and btrim(name_en) = 'Mint Melange' and coalesce(btrim(photo_url), '') = '';

update public.menu_items set photo_url = 'https://images.unsplash.com/photo-1641919089328-5d5063828c4f?w=800&h=800&fit=crop&q=70&fm=jpg&auto=format'
  where category_id = 'herbalteas' and btrim(name_en) = 'Tropical Mate' and coalesce(btrim(photo_url), '') = '';

commit;
