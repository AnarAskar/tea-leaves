-- 010_import_saved_items.sql
-- Imports removed/saved items (isDeleted:true) from the legacy MYNU menu.
-- Creates 4 missing categories, then inserts items hidden (is_available=false).
-- Each item insert is guarded so items already in the menu are not duplicated.

-- 1) Missing categories (idempotent)
insert into public.categories (id, emoji, image_url, label_en, label_ar, label_ku, sort_order)
values ('brunch', '🍳', null, 'Brunch', 'البرانش', 'برانش', 6)
on conflict (id) do nothing;
insert into public.categories (id, emoji, image_url, label_en, label_ar, label_ku, sort_order)
values ('pasta', '🍝', null, 'Pasta', 'الباستا', 'پاستا', 10)
on conflict (id) do nothing;
insert into public.categories (id, emoji, image_url, label_en, label_ar, label_ku, sort_order)
values ('affogato', '☕', null, 'Affogato', 'أفوغاتو', 'ئەفۆگاتۆ', 29)
on conflict (id) do nothing;
insert into public.categories (id, emoji, image_url, label_en, label_ar, label_ku, sort_order)
values ('icecream', '🍨', null, 'Ice Cream', 'آيس كريم', 'ئایسکریم', 31)
on conflict (id) do nothing;

-- 2) Saved items
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'soups', 'Onion Soup', 'شوربة البصل', 'شۆربای پیاز', null, null, null, 5000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/81998741.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Onion Soup');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'fries', 'French Fries', 'بطاطس مقلية', 'پەتاتەی فەرەنسی (فینگەر(', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/754988715.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'French Fries');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'fries', 'Cheddar Cheese Fries', 'Cheddar Cheese Fries', 'Cheddar Cheese Fries', 'Hand-cut fries smothered in a rich, artisanal cheddar cream. It’s a bold, savory escape topped with a pinch of rustic charm.', null, null, 8000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/255398668.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Cheddar Cheese Fries');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'fries', 'Potato Wedges', 'بطاطا ويجز', 'پەتاتە ویجز', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/282968966.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Potato Wedges');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'fries', 'Crunchy Crinkle wedges', 'Crunchy Crinkle wedges', 'Crunchy Crinkle wedges', 'Crunchy Crinkle wedges skin on', null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/352206846.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Crunchy Crinkle wedges');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'fries', 'Wavy Fries Garlic & Herbs', 'ویفي فرایز بالثوم و أعشاب', 'وەیڤی فرایز بە سیر و گیا', null, null, null, 8000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/95379202.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Wavy Fries Garlic & Herbs');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'fries', 'Wavy Fries Cheezz Onion Style', 'ویفي فرایز بالجبنة بصل ستایل', 'وەیڤی فرایز بە پەنیر بە ستایلی پیاز', null, null, null, 7500, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/996563930.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Wavy Fries Cheezz Onion Style');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'fries', 'Wavy Fries Paprika', 'ویفي فرایز بابریكا', 'وەیڤی فرایز پاپریكا', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/957255833.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Wavy Fries Paprika');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'roll', 'Beef Bacon Roll', 'لفائف لحم البقر المقدد', 'ڕۆڵی بەیکنی گامێش', 'Beef bacon, scrambled egg, smoked sauce, and fresh greens — wrapped in a soft crepe.', 'بيكون لحم البقر، بيض مخفوق، صلصة مدخنة، وخضروات طازجة — ملفوفة في كريب ناعم.', 'بەیکنی گامێش، هێلکەی تێکەڵکراو، سۆسی سمۆک/دوکەڵاوی و سەوزەی تازە — لەناو کریپێکی نەرم پێچراوە.', 16000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/611861600.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Beef Bacon Roll');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'pasta', 'Tortellini', 'تورتیلیني', 'تۆرتێلینی', 'Creamy pasta with mushrooms, parmesan, a hint of pesto, and a drizzle of truffle oil.', 'مكرونة كريمية مع الفطر والبارميزان، ولمسة من البيستو ورشة زيت الكمأ', 'پاستایەکی کرێمی ، پارمێزان، لەمەیەکی پێستۆ، و کەمێک زەیتی تڕافڵ لەسەر. 🍝✨', 13500, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/570224932.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Tortellini');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'pizza', 'Margherita', 'Margherita', 'Margherita', 'Tomato sauce, fresh mozzarella, basil, and Parmesan.', null, null, 9000, null, '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Margherita');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'brunch', 'Breakfast', 'Breakfast', 'Breakfast', null, null, null, 8000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/32072946.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Breakfast');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'brunch', 'Minced Beef Tartine', 'تارتين فطيرة لحم البقر المفروم', 'تارتینی پانکەیکی  گۆشتی گا وردکراو', 'Salted pancake topped with seasoned minced beef, brought with truffle sauce', 'فطيرة مملحة مغطاة بلحم بقري مفروم متبّل، مع صلصة الترانفيل', 'گۆشتی قیمە، لەگەڵ سۆسی ترەفڵ لەسەر پانکەیکێکی نەرم', 16500, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/186449333.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Minced Beef Tartine');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'matchatea', 'Rooibos and Matcha', 'روبيوس وماتشا', 'ڕویبۆس و ماتچا', null, null, null, 5000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/690927168.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Rooibos and Matcha');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'matchatea', 'Ice Rooibos and Matcha', 'روبيوس وماتشا مثلج', 'ئایس ڕویبۆس و ماتچا', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/486494583.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Ice Rooibos and Matcha');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'greenteas', 'Moroccan Mint', 'نعناع مغربي', 'نەعنای مەغریبی', 'Green Tea leaves, Mint leaves - (Morocco)', 'أوراق الشاي الأخضر، أوراق النعناع - (المغرب)', 'گەڵای چای سەوز، گەڵاکانی نەعنا - (مەغریب)', 4000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/224328207.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Moroccan Mint');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'blacktea', 'The Alchemist''s Tea', 'شاي الكيميائي', 'چای ئەلکەمیست', 'Golden Pu-Erh, Tulsi, Cinnamon Bark, Thistle, Lavender, Organic Clove Essential Oil, Organic Bergamot Essential Oil', 'بو-إيره الذهبي، تولسي، لحاء القرفة، شوك الحليب، اللافندر، زيت القرنفل العضوي، زيت البرغموت العضوي', 'گۆڵدن پو-ئێر، تولسی، توێکڵی دارچین، لاڤێندەر، زەیتی سروشتی مێخەک ئۆرگانیک، زەیتی سروشتی بێرگامۆت ئۆرگانیک', 5000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/743276608.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'The Alchemist''s Tea');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'blacktea', 'Assam', 'آسام', 'ئاسام', 'Black tea leaves - (India)', 'أوراق الشاي الأسود - (الهند)', 'گەڵای چای ڕەش - (هیندستان)', 4000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/808465544.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Assam');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'blacktea', 'Mystic India', 'الهند الغامضة', 'میستیک هیندستان', 'Black tea leaves, apple chips, cinnamon - (India)', 'أوراق الشاي الأسود، رقائق التفاح، قرفة - (الهند)', 'گەڵای چای ڕەش، چپس سێو، دارچین - (هیندستان)', 4000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/160731889.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Mystic India');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'blacktea', 'English Breakfast', 'الإفطار الإنجليزي', 'نانی بەیانی ئینگلیزی', 'Black tea leaves - (India)', 'أوراق الشاي الأسود - (الهند)', 'گەڵای چای ڕەش - (هیندستان)', 4000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/124406360.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'English Breakfast');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'blacktea', 'Presse Pu-erh', 'بو-إيره المضغوط', 'پرێسێ Pu-erh', 'Pressed Pu-erh tea leaf - (China)', 'ورقة شاي بو-إيره المضغوطة - (الصين)', 'گەڵای چای Pu-erh پەستاندار - (چین)', 4000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/529908376.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Presse Pu-erh');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'blacktea', 'Sumatra', 'سومطرة', 'سوماترا', 'Black tea leaves - (Sumatra)', 'أوراق الشاي الأسود - (سومطرة)', 'گەڵای چای ڕەش - (سوماترا)', 4000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/428127819.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Sumatra');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'blacktea', 'Tangerine Pu-erh', 'بو-إيره باليوسفي', 'تەنژین Pu-erh', 'Dried tangerines, Pu-erh tea - (China)', 'يوسفي مجفف، شاي بو-إيره - (الصين)', 'تەنژینی ووشککراوە، چای Pu-erh - (چین)', 18000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/446949624.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Tangerine Pu-erh');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'herbalteas', 'Rooibos Lavender', 'روبيوس باللافندر', 'ڕۆیبۆس لاڤێندەر', 'Rooibos leaves, lavender plant and lavender oil - (South Africa)', 'أوراق الروبيوس، نبات اللافندر وزيت اللافندر - (جنوب أفريقيا)', 'گەڵاکانی ڕویبۆس و ڕووەکی لاڤێندەر و زەیتی لاڤێندەر - (ئەفریقای باشوور)', 4000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/572852420.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Rooibos Lavender');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'hotdrinks', 'White Chocolate', 'شوكولا بيضاء ساخن', 'شوکۆلاتەی سپی گەرم', null, null, null, 6500, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/804166884.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'White Chocolate');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'colddrinks', 'Iced Flavoured Latte', 'لاتيه مثلج بنكهة', 'تامەكانی ئایسد لاتێ', null, null, null, 7500, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/869959097.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Iced Flavoured Latte');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'freshjuice', 'Beetroot Juice', 'عصير الشمندر', 'شەربەتی شەوەندەر', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/679509844.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Beetroot Juice');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'freshjuice', 'beetroot & green apple juice', 'beetroot & green apple juice', 'beetroot & green apple juice', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/148841599.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'beetroot & green apple juice');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'freshjuice', 'Orange & carrot juice', 'Orange & carrot juice', 'Orange & carrot juice', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/568860200.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Orange & carrot juice');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'mojitos', 'Pineapple', 'أناناس', 'ئەنەناس', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/509758921.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Pineapple');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'mojitos', 'Lavender and Rose', 'لافندر وورد', 'لاڤێندەر و ڕۆز', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/461120597.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Lavender and Rose');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'mojitos', 'Blueberry', 'توت أزرق', 'بلوبێری', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/409128161.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Blueberry');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'affogato', 'Affogato', 'افوغاتو', 'ئەفۆگاتۆ', 'A scoop of ice cream drowned in a shot of hot espresso.', 'كرة من الآيس كريم مغمورة في جرعة من الإسبريسو الساخن.', 'سکۆپێک ئایسکرێم لەناو یەک شۆت ئیسپرێسۆی گەرمدا.', 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/87501641.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Affogato');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'affogato', 'Matcha Affogato', 'ماتشا أفوجاتو', 'ماتچا ئەگۆگاتۆ', null, null, null, 8000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/640957481.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Matcha Affogato');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'iceteas', 'Raspberry Ice Tea', 'Raspberry Ice Tea', 'Raspberry Ice Tea', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/608281030.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Raspberry Ice Tea');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'iceteas', 'Tropical Mate Ice Tea', 'شاي يربا ماتيه المثلج الاستوائي', 'ئایس تی ترۆپیکاڵ مات', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/541004645.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Tropical Mate Ice Tea');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'iceteas', 'Istanbul No. 2 Ice Tea', 'شاي إسطنبول رقم 2 المثلج', 'ئایس تی  ژمارە ٢ی ئەستەنبوڵ', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/787370171.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Istanbul No. 2 Ice Tea');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'iceteas', 'Butterfly Pea Ice Tea With Lemon', 'شاي زهرة الفراشة الزرقاء المثلج بالليمون', 'ئایس تی بەتەرفلای پی لەگەڵ لیمۆ', null, null, null, 6500, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/129257674.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Butterfly Pea Ice Tea With Lemon');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'iceteas', 'White Jasmine Ice Tea With Lemon', 'شاي الياسمين الأبيض المثلج بالليمون', 'ئایس تی یاسمین سپی لەگەڵ لیمۆ', null, null, null, 6500, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/261565311.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'White Jasmine Ice Tea With Lemon');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'iceteas', 'Provence Day Dream Ice Tea', 'شاي بروفانس دريم المثلج', 'ئایس تی خەونەکانی ڕۆژی پرۆڤانس', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/114977961.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Provence Day Dream Ice Tea');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'iceteas', 'Butterfly Pea Soda', 'صودا زهرة الفراشة الزرقاء', 'سۆدەی بەتەرفڵای پی', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/509714614.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Butterfly Pea Soda');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'iceteas', 'Matcha Soda', 'صودا الماتشا', 'ماتچا سۆدە', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/963133141.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Matcha Soda');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'frapp', 'Caramel frappe', 'Caramel frappe', 'Caramel frappe', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/84572619.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Caramel frappe');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'frapp', 'Strawberry Frappe', 'فراولة و كريم فرابيه', 'شلیک فراپێ', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/825508249.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Strawberry Frappe');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'frapp', 'Salted Caramel Frappe', 'Salted Caramel Frappe', 'Salted Caramel Frappe', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/829279731.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Salted Caramel Frappe');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'frapp', 'Cream & Strawberry', 'كريمة وفراولة', 'کرێم و شلیك', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/772943478.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Cream & Strawberry');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'frapp', 'Mocha Frappe', 'Mocha Frappe', 'Mocha Frappe', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/342223299.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Mocha Frappe');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'frapp', 'Mango frappe', 'Mango frappe', 'Mango frappe', null, null, null, 8000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/853912058.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Mango frappe');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'frapp', 'White Chocolate Frappe', 'فرابيه شوكولاته بيضاء', 'شوکولاتەی سپی فراپێ', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/710526129.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'White Chocolate Frappe');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'frapp', 'Passion fruit Frappe', 'Passion fruit Frappe', 'Passion fruit Frappe', null, null, null, 8000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/348519511.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Passion fruit Frappe');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'icecream', 'Ice Cream Scoop (2-Scoop)', 'أيس كريم ( 2 سكوب )', 'ئایس کریم ( ٢ سکوپ )', 'Pick a flavor, enjoy the chill.', 'أختار النكهه و استمتع', 'تامەکان هەڵبژێرە و چێژی  لێ وەرگرە', 4000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/335041838.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Ice Cream Scoop (2-Scoop)');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'White Forest Cake', 'كعكة الغابة البيضاء', 'کێکی دارستانی سپی', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/67475375.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'White Forest Cake');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Bahamas Cake', 'كعكة جزر البهاما', 'کێکی بەهاماس', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/736350935.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Bahamas Cake');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Tiramisu Cake', 'كعكة التيراميسو', 'کێکی تیرامیسو', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/737489112.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Tiramisu Cake');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Black Forest Cake', 'كعكة الغابة السوداء', 'کێکی دارستانی ڕەش', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/258993666.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Black Forest Cake');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Chocolate Cake', 'كعكة الشوكولاتة', 'کێکی شوکولاتە', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/454980101.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Chocolate Cake');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Matcha Cake', 'كعكة الماتشا', 'کێکی ماتچا', null, null, null, 6750, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/592263653.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Matcha Cake');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Cheesecake Blueberry', 'تشيز كيك بالتوت الأزرق', 'چیز کێک بلوبێری', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/466723167.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Cheesecake Blueberry');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Chocolate Dubai', 'شوكولا دبي', 'شوکولاتە دوبەی', null, null, null, 7000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/225872728.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Chocolate Dubai');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Cheesecake Strawberry', 'تشيز كيك بالفراولة', 'چیز کێک شلیك', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/299250427.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Cheesecake Strawberry');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Cheesecake Lotus', 'تشيز كيك اللوتس', 'چیز کێکی لۆتوس', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/356625815.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Cheesecake Lotus');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Éclair Vanilla', 'إكلير بالفانيليا', 'ئیکلێری ڤانێلا', null, null, null, 5000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/768620746.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Éclair Vanilla');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Éclair Chocolate', 'إكلير بالشوكولاتة', 'ئیکلێری شوکولاتە', null, null, null, 5000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/137901860.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Éclair Chocolate');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Tart Lemon', 'تارت الليمون', 'تارتی لیمۆ', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/655082589.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Tart Lemon');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Tart Strawberry', 'تارت الفراولة', 'تارتی شلیك', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/20348306.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Tart Strawberry');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'desserts', 'Tart Apple', 'تارت التفاح', 'تارتی سێو', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/369277367.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Tart Apple');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'whitetea', 'Pai Mu Tan Rose Petals', 'باي مو تان ببتلات الورد', 'پای مو تان رۆز پێتاڵس', 'White tea leaves, rose petals - (China)', 'أوراق الشاي الأبيض، بتلات الورد - (الصين)', 'گەڵای چای سپی، گەڵای گوڵ - (چین)', 4500, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/344650537.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Pai Mu Tan Rose Petals');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'signaturedrinks', 'Roibos chocolate truffle Ice Tea', 'Roibos chocolate truffle Ice Tea', 'Roibos chocolate truffle Ice Tea', 'Rooibos Chocolate Truffle Iced Tea
A smooth and indulgent fusion of naturally caffeine-free rooibos tea with rich chocolate truffle notes. Served chilled over ice, it offers earthy warmth balanced by deep cocoa aromas — a comforting treat with a refreshing twist.', null, null, 8000, null, '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Roibos chocolate truffle Ice Tea');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'signaturedrinks', 'Mint Melange', 'Mint Melange', 'Mint Melange', null, null, null, 8000, null, '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Mint Melange');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'signaturedrinks', 'Chill-Cold Brew', 'تشيل - شاي بارد مخمّر', 'چیل بروی سارد', null, null, null, 6000, 'https://r2.mynu.site/images/67c05717d8908969203b54ba/items/hd/702747881.jpeg', '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Chill-Cold Brew');
insert into public.menu_items (category_id, name_en, name_ar, name_ku, ing_en, ing_ar, ing_ku, price, photo_url, tags, is_available)
select 'signaturedrinks', 'Rooibos Vanilla Ice Tea', 'Rooibos Vanilla Ice Tea', 'Rooibos Vanilla Ice Tea', 'Earthy Rooibos meets smooth Vanilla - a chilled sip of serenity', null, null, 8000, null, '{}', false
where not exists (select 1 from public.menu_items where name_en = 'Rooibos Vanilla Ice Tea');
