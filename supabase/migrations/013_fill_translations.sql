-- 013_fill_translations.sql
-- Fill missing Arabic (ar) and Central Kurdish / Sorani (ku) translations for
-- menu items that were seeded with English-only text. Matched by trimmed
-- English name. Each column is only overwritten when it is still empty or an
-- exact copy of the English (the CASE guards), so any real translation you have
-- already entered is left untouched. Safe to run more than once.
-- Run in the Supabase SQL editor (or: supabase db push).

begin;

-- ===== Item names =====
update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'سلطة الطماطم والرمان' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'سالادی تەماتە و هەنار' else name_ku end
where btrim(name_en) = 'Tomato & Pomegranate Salad';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'سلطة سيزر بالدجاج' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'سالادی سیزەری مریشک' else name_ku end
where btrim(name_en) = 'Chicken Ceasar Salad';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'متعة الأفوكادو والحمضيات' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'خۆشیی ئەڤۆکادۆ و سیتراس' else name_ku end
where btrim(name_en) = 'Avocado Citrus Delight';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'بطاطس سيزر' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'پەتاتەی سیزەر' else name_ku end
where btrim(name_en) = 'Cesar Fries';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'بطاطس مقرمشة بالقشرة' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'پەتاتەی قرچە بە توێکڵەوە' else name_ku end
where btrim(name_en) = 'Super crunch skin on fries';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'بيتزا ألفريدو' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'پیتزای ئەلفرێدۆ' else name_ku end
where btrim(name_en) = 'Alfredo Pizza';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'بيتزا مارغريتا' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'پیتزای مارگەریتا' else name_ku end
where btrim(name_en) = 'Margherita pizza';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'بيتزا الخضار' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'پیتزای سەوزە' else name_ku end
where btrim(name_en) = 'Veggie pizza';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'بيتزا دوريتوس الحارة' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'پیتزای دۆریتۆسی تیژ' else name_ku end
where btrim(name_en) = 'Chilli Doritos pizza';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'بيتزا الدجاج بصلصة الباربكيو' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'پیتزای مریشکی بەربەکیو' else name_ku end
where btrim(name_en) = 'BBQ Chicken Pizza';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'بيتزا الجبن والزيتون' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'پیتزای پەنیر و زەیتوون' else name_ku end
where btrim(name_en) = 'Cheese & Olive Pizza';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'ماتيه استوائي' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'ماتێی گەرمسێری' else name_ku end
where btrim(name_en) = 'Tropical Mate';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'ماتيه' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'ماتێ' else name_ku end
where btrim(name_en) = 'Mate';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'سحلب هوجيتشا' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'سەحلەبی هۆجیچا' else name_ku end
where btrim(name_en) = 'Hojicha Selap';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'سحلب ماتشا' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'سەحلەبی ماچا' else name_ku end
where btrim(name_en) = 'Matcha Salep';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'شاي كرك' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'چای کەرەک' else name_ku end
where btrim(name_en) = 'Karak Tea';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'سحلب' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'سەحلەب' else name_ku end
where btrim(name_en) = 'Salep';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'شروق البرتقال' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'خۆرهەڵاتی پرتەقاڵ' else name_ku end
where btrim(name_en) = 'Orange Sunrise';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'فرابيه الخوخ' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'فراپێی خۆخ' else name_ku end
where btrim(name_en) = 'Peach Frappe';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'فرابيه الباشن فروت' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'فراپێی پاشن فروت' else name_ku end
where btrim(name_en) = 'Passionfruit Frappe';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'فرابيه المانجو' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'فراپێی مانگۆ' else name_ku end
where btrim(name_en) = 'Mango Frappe';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'مافن ريد فيلفيت' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'مافینی ڕێد ڤێلڤێت' else name_ku end
where btrim(name_en) = 'Muffin Red Velvet';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'تيراميسو' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'تیرامیسو' else name_ku end
where btrim(name_en) = 'Tiramisu';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'تيراميسو ماتشا' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'تیرامیسوی ماچا' else name_ku end
where btrim(name_en) = 'Matcha tiramisu';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'ماتشا بوست' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'ماچا بووست' else name_ku end
where btrim(name_en) = 'Matcha Boost';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'ماتشا بلوسوم' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'ماچا بلۆسۆم' else name_ku end
where btrim(name_en) = 'Matcha Blossom';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'ماتشا بليس' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'ماچا بلیس' else name_ku end
where btrim(name_en) = 'Matcha Bliss';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'صودا ماتشا' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'سۆدای ماچا' else name_ku end
where btrim(name_en) = 'Matcha Soda';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'ليمون ونعناع' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'لیمۆ و پونگ' else name_ku end
where btrim(name_en) = 'Lemon Mint';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'علكة ونعناع' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'بنێشت و پونگ' else name_ku end
where btrim(name_en) = 'Gum Mint';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'تفاحتان' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'دوو سێو' else name_ku end
where btrim(name_en) = '2 Apples';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'إنجليش سبيشال' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'ئینگلیش سپێشاڵ' else name_ku end
where btrim(name_en) = 'English Special';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'هافانا سكاي' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'هاڤانا سکای' else name_ku end
where btrim(name_en) = 'Havana Sky';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'بيسكا لا فيلتشي' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'پێسکا لا فێلچە' else name_ku end
where btrim(name_en) = 'Pesca La Felce';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'طبيعي' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'سروشتی' else name_ku end
where btrim(name_en) = 'Natural';

update public.menu_items set
  name_ar = case when name_ar is null or btrim(name_ar) = btrim(name_en) then 'في آي بي' else name_ar end,
  name_ku = case when name_ku is null or btrim(name_ku) = btrim(name_en) then 'ڤی ئای پی' else name_ku end
where btrim(name_en) = 'VIP';

-- ===== Item ingredients / descriptions =====
update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'بطاطسنا المميزة برحلة إلى الساحل. مغموسة بكريمة السيزر الغنية ومزينة بجبن البارميزان الحاد لوجبة خفيفة جريئة وحرة الروح.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'پەتاتە تایبەتەکەمان سەفەرێک بۆ کەناری دەریا دەکات. نوقمکراو لە کرێمی سیزەری دەوڵەمەند و کۆتایی پێهاتوو بە پارمیزانی تیژ بۆ خواردنێکی ورووژێنەر و ئازاد.' else ing_ku end
where btrim(name_en) = 'Cesar Fries';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'عجينة بيتزا مع صلصة البيتزا وجبن الموزاريلا وقطع الدجاج الطري وصلصة الباربكيو المدخنة والبارميزان ورشة من الأوريغانو.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'هەویری پیتزا لەگەڵ سۆسی پیتزا، مۆزارێلا، مریشکی نەرم، سۆسی بەربەکیوی دووکەڵاوی، پارمیزان و کەمێک ئۆرێگانۆ.' else ing_ku end
where btrim(name_en) = 'BBQ Chicken Pizza';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'عجينة بيتزا مع صلصة بيضاء كريمية وجبن الموزاريلا وديك رومي مدخن وزيتون أسود ورشة من البارميزان — لذيذة ومدخنة وغنية بالجبن!' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'هەویری پیتزا لەگەڵ سۆسی سپیی کرێمی، مۆزارێلا، پەلەوەری دووکەڵاوی، زەیتوونی ڕەش و کەمێک پارمیزان — بەتام، دووکەڵاوی و پڕ لە پەنیر!' else ing_ku end
where btrim(name_en) = 'Cheese & Olive Pizza';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'مزيج نابض من الماتيه العشبي والفواكه الاستوائية الناضجة — منعش وحلو قليلاً ومنشط طبيعياً بنكهة مشرقة وغريبة.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'تێکەڵەیەکی گیانبەخش لە ماتێی گژوگیایی و میوەی گەرمسێری پێگەیشتوو — ئارامبەخش، کەمێک شیرین و بە سروشتی وزەبەخش بە تامێکی ڕووناک و جیاواز.' else ing_ku end
where btrim(name_en) = 'Tropical Mate';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'نقيع جريء وعشبي مع دفعة طاقة طبيعية — ناعم لكنه مر قليلاً، يمنح طاقة عشبية نقية تدوم بلطف مع كل رشفة.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'دەمکراوێکی بوێر و گژوگیایی لەگەڵ وزەیەکی سروشتی — نەرم بەڵام کەمێک تاڵ، وزەیەکی پاکی گژوگیایی دەبەخشێت کە بە نەرمی لەگەڵ هەر قومێک دەمێنێتەوە.' else ing_ku end
where btrim(name_en) = 'Mate';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'حضن دافئ ومحمص بلمسة حريرية! الهوجيتشا المدخنة تُخفق مع السحلب الكريمي.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'باوەشێکی گەرم و برژاو بە پێچانەوەیەکی ئاوریشمی! هۆجیچای دووکەڵاوی لەگەڵ سەحلەبی کرێمی تێکەڵ دەکرێت.' else ing_ku end
where btrim(name_en) = 'Hojicha Selap';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'الماتشا العشبية تلتقي بحلاوة السحلب المتوسطي الحريرية. لاتيه نباتي كثيف وجميل مثالي للاحتساء بروية.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'ماچای گژوگیایی لەگەڵ شیرینی ئاوریشمیی سەحلەبی ناوەڕاست دەیبینێتەوە. لاتێیەکی ئەستوور و ڕووەکی جوان کە گونجاوە بۆ قومدانی هێواش.' else ing_ku end
where btrim(name_en) = 'Matcha Salep';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'شاي غني وكريمي بالبهارات مع نهاية دافئة ومريحة.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'چایەکی دەوڵەمەند و کرێمی بە بەهارات لەگەڵ کۆتاییەکی گەرم و ئاسوودە.' else ing_ku end
where btrim(name_en) = 'Karak Tea';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'حليب دافئ وكثيف مع السحلب التقليدي ولمسة من القرفة.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'شیری گەرم و ئەستوور لەگەڵ سەحلەبی نەریتی و کەمێک داڕچین.' else ing_ku end
where btrim(name_en) = 'Salep';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'مزيج ناعم ومثلج من الخوخ والحلاوة الكريمية — خفيف ومنعش وحلو بلطف مع نهاية مشمسة.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'تێکەڵەیەکی نەرم و بەفراوی لە خۆخ و شیرینی کرێمی — سووک، ئارامبەخش و بە نەرمی شیرین لەگەڵ کۆتاییەکی خۆراوی.' else ing_ku end
where btrim(name_en) = 'Peach Frappe';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'مزيج نابض ومثلج من الباشن فروت الحامض والحلاوة الكريمية — منعش وجريء واستوائي ولذيذ الحموضة في كل رشفة.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'تێکەڵەیەکی گیانبەخش و بەفراوی لە پاشن فروتی ترش و شیرینی کرێمی — ئارامبەخش، بوێر، گەرمسێری و بە تامی ترشی خۆش لە هەر قومێک.' else ing_ku end
where btrim(name_en) = 'Passionfruit Frappe';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'مزيج كريمي ومثلج من المانجو، مخفوق إلى هروب استوائي ناعم — حلو ومنعش وأشعة شمس في كل رشفة.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'تێکەڵەیەکی کرێمی و بەفراوی لە مانگۆ، لێدراو بۆ دەربازبوونێکی گەرمسێریی نەرم — شیرین، ئارامبەخش و تیشکی خۆر لە هەر قومێک.' else ing_ku end
where btrim(name_en) = 'Mango Frappe';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'مافن ريد فيلفيت ناعم ومخملي بلمسة كاكاو رقيقة — غني ورطب ومتوازن تماماً مع لمحة من الحلاوة في كل قضمة.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'مافینێکی ڕێد ڤێلڤێتی نەرم و ئاوریشمی بە کەمێک کاکاو — دەوڵەمەند، شێدار و بە تەواوی هاوسەنگ بە کەمێک شیرینی لە هەر پارووێک.' else ing_ku end
where btrim(name_en) = 'Muffin Red Velvet';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'متعة بوهيمية ناعمة — طبقات من المسكاربوني والكاكاو بلمسة إسبريسو، غنية وهوائية وشاعرية بهدوء.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'چێژێکی بۆهیمیی نەرم — چینەکانی ماسکارپۆنە و کاکاو بە کەمێک ئێسپرێسۆ، دەوڵەمەند، هەوایی و بە هێمنی شیعری.' else ing_ku end
where btrim(name_en) = 'Tiramisu';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'نسختنا الخضراء من كنز إيطالي كلاسيكي. استبدلنا القهوة بماتشا الاحتفال الممتازة المخفوقة لمتعة كثيفة ومخملية.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'وەشانی سەوزی ئێمە لە گەنجینەیەکی کلاسیکی ئیتاڵی. قاوەمان گۆڕی بە ماچای ڕێوڕەسمیی نایاب بۆ چێژێکی ئەستوور و ئاوریشمی.' else ing_ku end
where btrim(name_en) = 'Matcha tiramisu';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'شاي ماتشا، كاكاو، تمر، قرفة، بروتين البازلاء.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'چای ماچا، کاکاو، خورما، داڕچین، پڕۆتینی نۆک.' else ing_ku end
where btrim(name_en) = 'Matcha Boost';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'شاي ماتشا، شمندر، فراولة، توت أزرق، زنجبيل.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'چای ماچا، چۆغەندر، فڕاولە، بلووبێری، زەنجەفیل.' else ing_ku end
where btrim(name_en) = 'Matcha Blossom';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'شاي ماتشا، قرفة، فراولة، مسحوق حليب جوز الهند.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'چای ماچا، داڕچین، فڕاولە، مژی شیری نارگیل.' else ing_ku end
where btrim(name_en) = 'Matcha Bliss';

update public.menu_items set
  ing_ar = case when ing_ar is null or btrim(ing_ar) = btrim(ing_en) then 'رقصة مشرقة وفوارة من الماتشا الممتازة والصودا الغازية. محلاة طبيعياً بخيط ذهبي من العسل لانتعاش عشبي منعش.' else ing_ar end,
  ing_ku = case when ing_ku is null or btrim(ing_ku) = btrim(ing_en) then 'سەمایەکی ڕووناک و بلقاوی لە ماچای نایاب و سۆدای بلقدار. بە سروشتی شیرینکراو بە دڵۆپەیەکی زێڕینی هەنگوین بۆ ئارامبەخشییەکی ڕووەکیی تازە.' else ing_ku end
where btrim(name_en) = 'Matcha Soda';

commit;
