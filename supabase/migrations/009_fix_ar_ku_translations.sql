-- Tea Leaves menu translation fixes (scraped from MYNU source of truth)
-- Corrects Arabic and Kurdish item names and descriptions in menu_items table

UPDATE menu_items SET name_ar = 'سلطة الدجاج الذهبية', name_ku = 'سەڵاتەی مریشکی زێڕین', ing_ar = 'لولو روسو، آيسبرغ، ذرة حلوة، فاصوليا حمراء، دجاج، خردل ذهبي، شرائح بارميزان.', ing_ku = 'لۆلۆ رۆسۆ، کاهووی ئایسبێرگ، گەنمەشامی شیرین، فاسۆلیای سوور، مریشک، خەردەلی زێڕین، و دنکی پارمیسان.'
  WHERE name_en ILIKE 'Golden Chicken Salad';

UPDATE menu_items SET name_ar = 'سلطة الطماطم والرمان', ing_ar = 'طماطم طازجة، فلفل أخضر حار، جوز مقرمش، ورمان طري، ممزوجة بصلصة رمان منعشة، وزيت الزيتون، ولمسة من الليمون — مزيج حلو وحار ومنعش! 🍅🌶️✨'
  WHERE name_en ILIKE 'Tomato & Pomegranate Salad';

UPDATE menu_items SET name_ar = 'سلطة سيزر بالدجاج', ing_ar = 'خس عربي، طماطم كرزية، أوراق لولو، مكعبات خبز محمّصة، دجاج طري، جبنة بارميزان، ولمسة من البرتقال المجفف، جميعها ممزوجة بصلصة سيزر الكريمية — لمسة منعشة على طبق كلاسيكي! 🥗✨'
  WHERE name_en ILIKE 'Chicken Ceasar Salad';

UPDATE menu_items SET name_ar = 'متعة الأفوكادو بالحمضيات', ing_ar = 'مزيج مرح من خس الآيسبرغ المقرمش، ممزوج ببيستو الليمون المنعش، ومزيّن بجبنة فيتا اللاذعة، ورشة من الزعتر الأخضر، وأفوكادو، ومانجو، وحبات رمان متفجرة بالنكهة. 🥑🥭✨'
  WHERE name_en ILIKE 'Avocado Citrus Delight';

UPDATE menu_items SET name_ar = 'سلطة روكا بلوم', name_ku = 'سەڵاتەی رووکا بلۆم', ing_ar = 'أوراق جرجير الطازجة ممزوجة مع جبنة الحلوم المشوية، وشرائح التفاح، والجوز المحمص، وصوص بالساميك الرقيق.', ing_ku = 'گەڵای جەرجیری تازە تێکەڵ بە پەنیری حەلومی برژاو و پارچەی سێو و گوێزی برژاو و سۆسێکی بەلسەمیک.'
  WHERE name_en ILIKE 'Rocca Bloom Salad';

UPDATE menu_items SET name_ar = 'شوربة فطر الشيتاكي', name_ku = 'شۆربای قارچکی شیتاکی'
  WHERE name_en ILIKE 'Shiitake Mushroom Soup';

UPDATE menu_items SET name_ar = 'دجاج بوب كورن بالفلفل الحلو الحار', name_ku = 'مریشکی گەنمەشامی بیبەری شیرین', ing_ar = 'قطع دجاج مقرمشة بحجم لقمة متبلة بمزيج من التوابل، مغطاة بصوص الفلفل الحار الحلو ومزينة برشة من بذور السمسم المحمصة', ing_ku = 'پارچەی مریشکی بچووک و خر تێکەڵکراو بە بەهارات و بە سۆسی بیبەری شیرین  و کونجی برژاو.'
  WHERE name_en ILIKE 'Sweet Chili Popcorn Chicken';

UPDATE menu_items SET name_ar = 'بطاطس مقلية مقرمشة بدون قشر', name_ku = 'بطاطس مقلية مقرمشة بدون قشر'
  WHERE name_en ILIKE 'Crunchy Skin off Fries';

UPDATE menu_items SET name_ar = 'تارتين الدجاج بكريمة ألفريدو', name_ku = 'تارتینی مریشکی کرێمی ئەلفرێدۆ', ing_ar = 'مریشک، قارچک، مۆزارێلا، پارمیسان، و کرێمی چێشتلێنانی بەتام لەسەر پانکەیکێکی نەرم', ing_ku = 'فطيرة مملحة مغطاة بالدجاج والفطر وموزريلا وجبنة بارميزان وكريمة الطهي اللذيذة.'
  WHERE name_en ILIKE 'Creamy Alfredo Chicken Tartine';

UPDATE menu_items SET name_ar = 'تارتين فطيرة الدجاج اليابانية', name_ku = 'تارتینی پانکەیکی مریشکی ژاپۆنی'
  WHERE name_en ILIKE 'Japanese Chicken Tartine';

UPDATE menu_items SET name_ar = 'تارتين فطيرة الأومليت مع جبنة', name_ku = 'تارتینی پانکەیکی ئۆمێلێت لەگەڵ پەنیر'
  WHERE name_en ILIKE 'Cheese Omelette Tartine';

UPDATE menu_items SET name_ar = 'بيض بندكت', name_ku = 'هێلکەی بێنادیکت', ing_ar = 'فطيرة بانكيك مملحة مغطاة ببيضة مسلوقة', ing_ku = 'هێلکەی کوڵاو لەسەر پانکەیکێکی نەرم'
  WHERE name_en ILIKE 'Benedict Tartine';

UPDATE menu_items SET name_ar = 'بيض البومودورو', name_ku = '‌هێلکەی پۆمۆدۆرۆ', ing_ar = 'فطيرة طرية مغطاة ببيضة مسلوقة وصوص بومودورو', ing_ku = 'پانکەیکێکی نەرم لەگەڵ هێلکەی کوڵاو و سۆسی پۆمۆدۆرۆ.'
  WHERE name_en ILIKE 'Egg Pomodoro Tartine';

UPDATE menu_items SET name_ar = 'لفائف الديك الرومي والجبن', name_ku = 'ڕۆڵی گۆشتی قەل و پەنیر', ing_ar = 'كريب ناعم ملفوف حول شرائح من الديك الرومي المدخن وجبنة كريمية.', ing_ku = 'گۆشتی قەلی دوکەڵکراو و پەنیری کرێمی لەناو کریپی نەرم'
  WHERE name_en ILIKE 'Turkey & Cheese Roll';

UPDATE menu_items SET name_ar = 'لفائف الدجاج بالأفوكادو', name_ku = 'ڕۆڵی مریشک و ئەڤۆکادۆ', ing_ar = 'كريب ناعم ملفوف حول الأفوكادو، الدجاج، والخضروات الطازجة، وصوص الخردل والعسل.', ing_ku = 'ئەڤۆکادۆ، مریشک، سەوزەی تازە، و سۆسی هانی ماستارد لەناو کریپی نەرم'
  WHERE name_en ILIKE 'Chicken Avocado Roll';

UPDATE menu_items SET name_ar = 'لفائف الأفوكادو', name_ku = 'ڕۆڵی ئەڤۆکادۆ', ing_ar = 'كريب ناعم ملفوف حول البيض المخفوق، الأفوكادو، الخضروات الطازجة، و صوص جواكامولي.', ing_ku = 'هێلکەی تێکەڵکراو، ئەڤۆکادۆ، سەوزەی تازە، و سۆسی گواکامۆل لەناو کریپی نەرم'
  WHERE name_en ILIKE 'Avocado Roll';

UPDATE menu_items SET name_ar = 'لفائف الفطر', name_ku = 'ڕۆڵی قارچک', ing_ar = 'كريب ناعم ملفوف حول البيض المخفوق، فطر، الخضروات الطازجة.', ing_ku = 'هێلکەی تێکەڵکراو، قارچک، سەوزەی تازە لەناو کریپی نەرم'
  WHERE name_en ILIKE 'Mushroom Roll';

UPDATE menu_items SET name_ar = 'بيتزا ألفريدو', ing_ar = 'صلصة بيضاء كريمية، جبن موزاريلا وبارميزان، فطر طازج، ودجاج طري على عجينة بيتزا ذهبية اللون.'
  WHERE name_en ILIKE 'Alfredo Pizza';

UPDATE menu_items SET name_ar = 'بيتزا مارغريتا', ing_ar = 'طبق كلاسيكي محبوب مع صلصة الطماطم، جبن موزاريلا كريمي، ريحان، ولمسة من جبن البارميزان.'
  WHERE name_en ILIKE 'Margherita pizza';

UPDATE menu_items SET name_ar = 'بيتزا الخضار', ing_ar = 'عجينة بيتزا مغطاة بصلصة البيتزا الكلاسيكية، جبن موزاريلا، فطر طازج، ذرة حلوة، فلفل أخضر، زيتون أسود، وطماطم كرزية عصيرية — قضمة مليئة بألوان وروائح حديقة الخضار!'
  WHERE name_en ILIKE 'Veggie pizza';

UPDATE menu_items SET name_ar = 'بيتزا تشيلي دوريتوس', ing_ar = 'عجينة بيتزا مغطاة بصلصة البيتزا، جبن موزاريلا، صلصة ديناميت حارة، دوريتوس، فلفل هالابينو، وجبن شيدر مذاب — انفجار نكهة جريء، مقرمش، وناري!'
  WHERE name_en ILIKE 'Chilli Doritos pizza';

UPDATE menu_items SET name_ar = 'ماتشا ساخن', name_ku = 'ماتچای گەرم'
  WHERE name_en ILIKE 'Hot Matcha';

UPDATE menu_items SET name_ar = 'لاتيه ماتشا ساخن', name_ku = 'ماتچا لاتێی گەرم'
  WHERE name_en ILIKE 'Hot Matcha Latte';

UPDATE menu_items SET name_ar = 'ماتشا مثلج', name_ku = 'ئایس ماتچا'
  WHERE name_en ILIKE 'Ice Matcha';

UPDATE menu_items SET name_ar = 'لاتيه ماتشا مثلج', name_ku = 'ئایس ماتچا لاتێ'
  WHERE name_en ILIKE 'Ice Matcha Latte';

UPDATE menu_items SET name_ar = 'لاتيه ماتشا مثلج بنكهة', name_ku = 'تامەكانی ئایس ماتچا لاتێ', ing_ar = 'فانيليا، فراولة، جوز الهند، باشن فروت، مانجو', ing_ku = '(ڤانێلا، شلیك، گوێزی هیندی، پاشن فرووت، مانگۆ)'
  WHERE name_en ILIKE 'Ice Matcha Latte flavoured';

UPDATE menu_items SET name_ar = 'فرابيه ماتشا بالفراولة', name_ku = 'شلیك ماتچا فراپێ'
  WHERE name_en ILIKE 'Strawberry matcha frappe';

UPDATE menu_items SET name_ar = 'فرابيه ماتشا بالفانيليا', name_ku = 'ڤانێلا ماتچا فراپێ'
  WHERE name_en ILIKE 'Vanilla Matcha Frappe';

UPDATE menu_items SET name_ar = 'تشيل برو', name_ku = 'چیل بریو', ing_ar = 'أوراق الشاي الأخضر، تفاح مجفف، نكهة الكراميل الطبيعية وجوز الهند - (اليابان)', ing_ku = 'گەڵای چای سەوز و سێوی وشککراوە و تامی کارامێلی سروشتی و گوێزی هیندی- (ژاپۆن)'
  WHERE name_en ILIKE 'Chill Brew Tea';

UPDATE menu_items SET name_ar = 'سينشا ميازاكي (فوكاموشي)', name_ku = 'سێنچا میازاکی (فوکاموشی)', ing_ar = 'أوراق الشاي الأخضر - (اليابان)', ing_ku = 'گەڵای چای سەوز - (ژاپۆن)'
  WHERE name_en ILIKE 'Sencha Miyazaki (Fukamushi)';

UPDATE menu_items SET name_ar = 'إيرل جراي الأخضر', name_ku = 'ئێرل گرای سەوز', ing_ar = 'أوراق الشاي الأخضر، زيت البرغموت - (اليابان)', ing_ku = 'گەڵای چای سەوز، زەیتی بێرگامۆت - (ژاپۆن)'
  WHERE name_en ILIKE 'Green Earl Grey';

UPDATE menu_items SET name_ar = 'لآلئ الياسمين', name_ku = 'جاسمین پیرڵز', ing_ar = 'أوراق الشاي الأخضر، زهرة الياسمين - (الصين)', ing_ku = 'گەڵای چای سەوز، گوڵی یاسمین - (چین)'
  WHERE name_en ILIKE 'Jasmine Pearls';

UPDATE menu_items SET name_ar = 'شاي الياسمين الأخضر', name_ku = 'چای سەوزی یاسمین', ing_ar = 'أوراق الشاي الأخضر، زهرة الياسمين - (الصين)', ing_ku = 'گەڵای چای سەوز، گوڵی یاسمین - (چین)'
  WHERE name_en ILIKE 'Jasmine Green Tea';

UPDATE menu_items SET name_ar = 'الشاي الأخضر الاستوائي', name_ku = 'ترۆپیكاڵ گرین', ing_ar = 'أوراق الشاي الأخضر، بتلات الورد، جوزة الطيب، نكهات استوائية - (اليابان)', ing_ku = 'گەڵای چای سەوز، گەڵای گوڵ، گوێزی هیندی، بۆنەکانی ناوچە گەرمەکان - (ژاپۆن)'
  WHERE name_en ILIKE 'Tropical Green';

UPDATE menu_items SET name_ar = 'مطر المونسون', name_ku = 'مونیون ڕەین', ing_ar = 'أوراق الشاي الأخضر، قشور البرتقال، الزنجبيل، نكهات طبيعية - (اليابان)', ing_ku = 'گەڵای چای سەوز، توێکڵی پرتەقاڵ، تامی سروشتی زەنجەفیل - (ژاپۆن)'
  WHERE name_en ILIKE 'Monsoon Rain';

UPDATE menu_items SET name_ar = 'كراميل كريم', name_ku = 'کرێم کارامێل', ing_ar = 'أوراق الشاي الأخضر، كراميل - (اليابان)', ing_ku = 'گەڵای چای سەوز، کارامێل - (ژاپۆن)'
  WHERE name_en ILIKE 'Caramel Cream';

UPDATE menu_items SET name_ar = 'هوجيتشا', name_ku = 'هۆجیچا', ing_ar = 'أوراق الشاي الأخضر - (اليابان)', ing_ku = 'گەڵای چای سەوز - (ژاپۆن)'
  WHERE name_en ILIKE 'Hojicha';

UPDATE menu_items SET name_ar = 'الشاي المغربي الأخضر', name_ku = 'چای سەوزی مەغریبی', ing_ar = 'أوراق الشاي الأخضر، أوراق النعناع - (المغرب)', ing_ku = 'گەڵای چای سەوز، گەڵای نەعنا - (مەغریب)'
  WHERE name_en ILIKE 'Moroccan Green';

UPDATE menu_items SET name_ar = 'شاي الأزهار - ياسمين وورد', name_ku = 'چای گوڵ - گوڵی یاسمین', ing_ar = 'أوراق الشاي الأخضر - (اليابان)', ing_ku = 'گەڵای چای سەوز - (ژاپۆن)'
  WHERE name_en ILIKE 'Blossom Tea - Jasmine Rose';

UPDATE menu_items SET name_ar = 'جينمايشا', name_ku = 'گێنمایچا', ing_ar = 'أوراق الشاي الأخضر، أرز بني محمص - (اليابان)', ing_ku = 'گەڵای چای سەوز، برنجی قاوەیی برژاو- (ژاپۆن)'
  WHERE name_en ILIKE 'Genmaicha';

UPDATE menu_items SET name_ar = 'أولونغ التنين الأخضر', name_ku = 'ئەژدیهای سەوز ئۆلۆنگ', ing_ar = 'أوراق الأولونغ - (الصين)', ing_ku = 'گەڵاکانی OOLONG - (چین)'
  WHERE name_en ILIKE 'Green Dragon Oolong';

UPDATE menu_items SET name_ar = 'أولونغ بالحليب', name_ku = 'شیر ئۆلۆنگ', ing_ar = 'شاي الأولونغ - (تايوان)', ing_ku = 'چای ئۆلۆنگ - (تایوان)'
  WHERE name_en ILIKE 'Milk Oolong';

UPDATE menu_items SET name_ar = 'سينشا فوجي (أساموشي)', name_ku = 'سێنچا فوجی (ئاساموشی)', ing_ar = 'شاي أخضر - (اليابان)', ing_ku = 'چای سەوز - (ژاپۆن)'
  WHERE name_en ILIKE 'Sencha Fuji (Asamushi)';

UPDATE menu_items SET name_ar = 'مورينغا', name_ku = 'مۆرینگا', ing_ar = 'أوراق المورينغا - (تركيا)', ing_ku = 'گەڵاکانی مۆرینگا - (تورکیا)'
  WHERE name_en ILIKE 'Moringa';

UPDATE menu_items SET name_ar = 'شاي تي ليفز', name_ku = 'چای تی لیڤز', ing_ar = 'الشاي الأسود التقليدي والكلاسيكي', ing_ku = 'چای ڕەشی نەریتی و کلاسیکی'
  WHERE name_en ILIKE 'Tea Leaves Tea';

UPDATE menu_items SET name_ar = 'إيرل جراي الأزهار الزرقاء', name_ku = 'گوڵی شین ئێرل گرای', ing_ar = 'أوراق الشاي الأسود، كركديه، برغموت - (الهند)', ing_ku = 'گەڵای چای ڕەش، هیبیسکوس، بێرگامۆت - (هیندستان)'
  WHERE name_en ILIKE 'Blue Flowers Earl Grey';

UPDATE menu_items SET name_ar = 'قبلة الشوكولاتة', name_ku = 'چۆكلەیت كیس', ing_ar = 'أوراق الشاي الأسود، قطع الكاكاو - (الهند)', ing_ku = 'گەڵای چای ڕەش، کۆکاو - (هیندستان)'
  WHERE name_en ILIKE 'Chocolate Kiss';

UPDATE menu_items SET name_ar = 'لابسـانغ سوشونغ', name_ku = 'لاپسانگ سۆچۆنگ', ing_ar = 'أوراق الشاي الأسود - (الهند)', ing_ku = 'گەڵای چای ڕەش - (هیندستان)'
  WHERE name_en ILIKE 'Lapsang Souchong';

UPDATE menu_items SET name_ar = 'أحلام بروفانس', name_ku = 'خەونی ڕۆژانەی پرۆڤانس', ing_ar = 'أوراق الشاي الأسود، اللافندر، قطع الكاكاو - (فرنسا)', ing_ku = 'گەڵای چای ڕەش، لاڤێندەر، پارچە کاکاو - (فەرەنسا)'
  WHERE name_en ILIKE 'Provence Daydream';

UPDATE menu_items SET name_ar = 'الأمير الصغير', name_ku = 'شازادەی بچووک', ing_ar = 'أوراق الشاي الأسود، قشر البرتقال، قرنفل، نعناع خاص، هيل، نكهات طبيعية - (الهند)', ing_ku = 'گەڵای چای ڕەش، توێکڵی پرتەقاڵ، مێخەک، نەعنای تایبەتی گەڵای نەعنا، تامی سروشتی - (هیندستان)'
  WHERE name_en ILIKE 'The Little Prince';

UPDATE menu_items SET name_ar = 'إسطنبول رقم 1', name_ku = 'ئەستەنبوڵ ژمارە: 1', ing_ar = 'أوراق الشاي الأسود، براعم الورد وبتلات الورد، نكهة طبيعية', ing_ku = 'گەڵای چای ڕەش، گوڵەبەڕۆژە و گەڵای گوڵ، بۆنی سروشتی'
  WHERE name_en ILIKE 'Istanbul No: 1';

UPDATE menu_items SET name_ar = 'إسطنبول رقم 2', name_ku = 'ئەستەنبوڵ ژمارە: 2', ing_ar = 'أوراق الشاي الأسود، زيت البرغموت، اللافندر، زهرة الكركديه', ing_ku = 'گەڵای چای ڕەش، زەیتی بێرگامۆت، لاڤێندەر، گوڵی هیبیسکوس'
  WHERE name_en ILIKE 'Istanbul No: 2';

UPDATE menu_items SET name_ar = 'إسطنبول رقم 3', name_ku = 'ئەستەنبوڵ ژمارە: 3', ing_ar = 'أوراق الشاي الأسود، روبيوس، هيل، قرنفل، فانيليا', ing_ku = 'گەڵای چای ڕەش، ڕویبۆس، مێخەک، ڤانێلا'
  WHERE name_en ILIKE 'Istanbul No: 3';

UPDATE menu_items SET name_ar = 'شاي الاستيقاظ', name_ku = 'وەیك ئەپ چای', ing_ar = 'أوراق الشاي الأسود، روبيوس، حبوب القهوة، قطع الكاكاو، زيت البرتقال والكاكاو - (الهند)', ing_ku = 'گەڵای چای ڕەش، ڕویبۆس، دانەوێڵەی قاوە، نیبەکانی کاکاو، کاکاو و زەیتی پرتەقاڵ - (هیندستان)'
  WHERE name_en ILIKE 'Wake-Up Tea';

UPDATE menu_items SET name_ar = 'شاي ماسالا تشاي', name_ku = 'چای ماسالا', ing_ar = 'أوراق الشاي الأسود من آسام (الهند)، قرفة، زنجبيل، قرنفل، هيل - (الهند)', ing_ku = 'گەڵای چای ڕەش لە ئاسام (هیندستان)، دارچین، زەنجەفیل، مێخەک  - (هیندستان)'
  WHERE name_en ILIKE 'Chai Masala';

UPDATE menu_items SET name_ar = 'ساكورا الأسود', name_ku = 'ساکورا ڕەش', ing_ar = 'أوراق الشاي الأسود، أوراق الساكورا، مستخلص الساكورا - (اليابان)', ing_ku = 'گەڵای چای ڕەش، گەڵاکانی ساکورا، دەرهاویشتەی ساکورا - (ژاپۆن)'
  WHERE name_en ILIKE 'Sakura Black';

UPDATE menu_items SET name_ar = 'كريم اللوز', name_ku = 'کرێمی بادەم', ing_ar = 'أوراق الشاي الأسود، زهر البرتقال، زيت اللوز، نكهة الحليب - (الهند)', ing_ku = 'گەڵای چای ڕەش و گوڵی پرتەقاڵ و زەیتی بادەم و تامی شیر - (هیندستان)'
  WHERE name_en ILIKE 'Cream of Almond';

UPDATE menu_items SET name_ar = 'بو-إيره الذهبي', name_ku = 'زێڕین Pu-erh', ing_ar = 'أوراق شاي بو-إيره - (الصين)', ing_ku = 'گەڵای چای Pu-er (Pu-erh) - (چین)'
  WHERE name_en ILIKE 'Golden Pu-erh';

UPDATE menu_items SET name_ar = 'آسام مائل', name_ku = 'ماڵتی ئاسام', ing_ar = 'أوراق الشاي الأسود - (الهند)', ing_ku = 'گەڵای چای ڕەش - (هیندستان)'
  WHERE name_en ILIKE 'Malty Assam';

UPDATE menu_items SET name_ar = 'يونان - طرف ذهبي', name_ku = 'یونان - گۆڵدن تیپ', ing_ar = 'أوراق شاي بو-إيره الأسود - (الصين)', ing_ku = 'گەڵای چای ڕەش Pu Erh - (چین)'
  WHERE name_en ILIKE 'Yunnan - Golden Tip';

UPDATE menu_items SET name_ar = 'الشاي الأسود بنكهة الليتشي', name_ku = 'لیچی ڕەش', ing_ar = 'أوراق الشاي الأسود - (الصين)', ing_ku = 'گەڵای چای ڕەش - (چین)'
  WHERE name_en ILIKE 'Lychee Black';

UPDATE menu_items SET name_ar = 'لكمة التوت', name_ku = 'بێری پانچ', ing_ar = 'توت العليق، فراولة، بتلات الورد، كركديه، برتقال مجفف - (ألمانيا)', ing_ku = 'ڕەشکە، شلیك، گەڵای گوڵ، هیبیسکوس، پرتەقاڵی ووشککراوە - (ئەڵمانیا)'
  WHERE name_en ILIKE 'Berry Punch';

UPDATE menu_items SET name_ar = 'تعزيز الطاقة', name_ku = 'وزە زیادکردن', ing_ar = 'كركديه، قشر الليمون، قطع التفاح، وردة المسك، خوخ، قشرة القهوة، ورقة عباد الشمس - (ألمانيا)', ing_ku = 'هیبیسکوس، توێکڵی لیمۆ، پارچە سێو، گوڵەبەڕۆژە، هەنجیر، کاسکارا، گەڵای گوڵەبەڕۆژە - (ئەڵمانیا)'
  WHERE name_en ILIKE 'Energy Boost';

UPDATE menu_items SET name_ar = 'شاي الهضم', name_ku = 'دایجس-چای', ing_ar = 'شمر، أوراق الروبيوس، زنجبيل، قشر البرتقال، لافندر', ing_ku = 'ڕەشکە، گەڵاکانی ڕویبۆس، زەنجەفیل، توێکڵی پرتەقاڵ، لاڤێندەر'
  WHERE name_en ILIKE 'Diges-Tea';

UPDATE menu_items SET name_ar = 'يربا ماتيه الاستوائي', name_ku = 'ترۆپیکاڵ مات', ing_ar = 'شاي الماتيه، قطع الأناناس، زهرة الذرة، فواكه استوائية ونكهات - (البرازيل)', ing_ku = 'چای مات، پارچە ئەناناس، گوڵی گەنمەشامی، میوەی گەرم و تامەکانی - (بەرازیل)'
  WHERE name_en ILIKE 'Tropical Mate';

UPDATE menu_items SET name_ar = 'روبيوس بالفانيليا', name_ku = 'ڕویبۆس ڤانێلا', ing_ar = 'أوراق الروبيوس، قطع الفانيليا، نكهة الفانيليا - (جنوب أفريقيا)', ing_ku = 'گەڵاکانی ڕویبۆس، پارچەی ڤانێلا، تامی ڤانێلا - (ئەفریقای باشوور)'
  WHERE name_en ILIKE 'Rooibos Vanilla';

UPDATE menu_items SET name_ar = 'روبيوس تشاي', name_ku = 'ڕویبۆس چای', ing_ar = 'أوراق الروبيوس النقية، قرفة، هيل، نعناع، قرنفل، قشر البرتقال - (جنوب أفريقيا)', ing_ku = 'گەڵای پاکی ڕویبۆس، دارچین، هێلکە، نەعنا، مێخەک، توێکڵی پرتەقاڵ - (ئەفریقای باشوور)'
  WHERE name_en ILIKE 'Rooibos Chai';

UPDATE menu_items SET name_ar = 'روبيوس إيرل جراي', name_ku = 'ڕویبۆس ئێرل گرای', ing_ar = 'أوراق الروبيوس، زهرة الكركديه، زيت البرغموت - (جنوب أفريقيا)', ing_ku = 'گەڵاکانی ڕویبۆس، گوڵی هیبیسکوس، زەیتی بێرگامۆت - (ئەفریقای باشوور)'
  WHERE name_en ILIKE 'Rooibos Earl Grey';

UPDATE menu_items SET name_ar = 'يلباشي هارماني', name_ku = 'یڵباشی هەرمانی', ing_ar = 'أوراق الروبيوس، تفاح، وردة المسك، قشر البرتقال، قرنفل، قرفة، زهر البرتقال - (جنوب أفريقيا)', ing_ku = 'گەڵاکانی ڕویبۆس، سێو، گوڵەبەڕۆژە، توێکڵی پرتەقاڵ، مێخەک، دارچین، گوڵی پرتەقاڵ - (ئەفریقای باشوور)'
  WHERE name_en ILIKE 'Yilbaşi Harmani';

UPDATE menu_items SET name_ar = 'الكركم تشاي', name_ku = 'چای زەردەچەوە', ing_ar = 'كركم، زنجبيل، قرفة، هيل، بتلات الورد، جوزة الطيب - (الهند)', ing_ku = 'زەردەچەوە، زەنجەفیل، دارچین، گەڵای گوڵ، گوێزی هیندی - (هیندستان)'
  WHERE name_en ILIKE 'Turmeric Chai';

UPDATE menu_items SET name_ar = 'زهرة الفراشة الزرقاء', name_ku = 'بلو بەتەرفلای پی', ing_ar = 'زهرة الفراشة الزرقاء - (تايلاند)', ing_ku = 'گوڵی ترێی پەپوولەی شین - (تایلەند)'
  WHERE name_en ILIKE 'Blue Butterfly Pea';

UPDATE menu_items SET name_ar = 'احصل على العافية', name_ku = 'گێت وێڵنس', ing_ar = 'أوراق الروبيوس الأخضر، عشب الليمون، زنجبيل، قشر البرتقال - (جنوب أفريقيا)', ing_ku = 'گەڵای سەوزی ڕویبۆس، لیمۆ، زەنجەفیل، توێکڵی پرتەقاڵ - (ئەفریقای باشوور)'
  WHERE name_en ILIKE 'Get Wellness';

UPDATE menu_items SET name_ar = 'روبيوس شوكولاتة ترافل', name_ku = 'تروفێلی شوکولاتەی ڕویبۆس', ing_ar = 'أوراق شاي الروبيوس، قطع الكاكاو، قطع الكراميل، تفاح - (جنوب أفريقيا)', ing_ku = 'گەڵای چای ڕویبۆس، پارچە کاکاو، پارچە کارامێل، سێو - (ئەفریقای باشوور)'
  WHERE name_en ILIKE 'Rooibos Chocolate Truffle';

UPDATE menu_items SET name_ar = 'شاي المناعة', name_ku = 'بەرگری-چای', ing_ar = 'مريمية، زعتر، لسان الحمل، ورقة الأوكالبتوس، زنجبيل، جذر الهندباء، فطر شيتاكي، لافندر، ورقة عباد الشمس', ing_ku = 'زەنجەفیل، زەنجەفیل، کاڵان، گەڵای یوکالیپتوس، زەنجەفیل، ڕەگی قاوەی، قارچکی شیتاکە، لاڤێندەر، گەڵای گوڵەبەڕۆژە'
  WHERE name_en ILIKE 'Immuni-Tea';

UPDATE menu_items SET name_ar = 'سوانجي سيلا', name_ku = 'سوانگی سیلا', ing_ar = 'أوراق ليمون سوانجي، لافندر، ليمون، ورد فرنسي، زهرة الأميروث، شاي أسود - (إندونيسيا)', ing_ku = 'گەڵای لیمۆی سوانگی، لاڤێندەر، لیمۆ، گوڵی فەرەنسی، ئامارانت، چای ڕەش - (ئیندۆنیزیا)'
  WHERE name_en ILIKE 'Swangi Sila';

UPDATE menu_items SET name_ar = 'تايلان كوملي #1', name_ku = 'تایلان کومێلی #1', ing_ar = 'شاي أبيض، شاي أخضر، بقدونس، تفاح مجفف، قشر ليمون مجفف، فلفل أسود', ing_ku = 'چای سپی، چای سەوز، جەرجیر، سێوی وشککراوە، توێکڵی لیمۆی وشککراوە، بیبەری ڕەش'
  WHERE name_en ILIKE 'Taylan Kümeli #1';

UPDATE menu_items SET name_ar = 'إسبرسو', name_ku = 'ئیسپرێسۆ'
  WHERE name_en ILIKE 'Espresso';

UPDATE menu_items SET name_ar = 'إسبرسو مزدوج', name_ku = 'ئیسپرێسۆی دەبڵ'
  WHERE name_en ILIKE 'Double Espresso';

UPDATE menu_items SET name_ar = 'قهوة تركية', name_ku = 'قاوەی تورکی'
  WHERE name_en ILIKE 'Turkish Coffee';

UPDATE menu_items SET name_ar = 'أمريكانو', name_ku = 'ئەمریکانۆ'
  WHERE name_en ILIKE 'Americano';

UPDATE menu_items SET name_ar = 'قهوة قازوان', name_ku = 'قاوەی قەزوان'
  WHERE name_en ILIKE 'Qazwan';

UPDATE menu_items SET name_ar = 'كابتشينو', name_ku = 'کاپاچینۆ'
  WHERE name_en ILIKE 'Cappaccino';

UPDATE menu_items SET name_ar = 'كافي لاتيه', name_ku = 'کافێ لاتێ'
  WHERE name_en ILIKE 'Caffe Latte';

UPDATE menu_items SET name_ar = 'لاتيه إسباني', name_ku = 'لاتی ئیسپانی'
  WHERE name_en ILIKE 'Spanish Latte';

UPDATE menu_items SET name_ar = 'ماكياتو', name_ku = 'ماکیاتۆ'
  WHERE name_en ILIKE 'Macchiato';

UPDATE menu_items SET name_ar = 'موكا', name_ku = 'مۆچا'
  WHERE name_en ILIKE 'Mocha';

UPDATE menu_items SET name_ar = 'شوكولاتة ساخنة', name_ku = 'شوکولاتەی گەرم'
  WHERE name_en ILIKE 'Hot Chocolate';

UPDATE menu_items SET name_ar = 'أمريكانو مثلج', name_ku = 'ئەمریکانۆی سارد'
  WHERE name_en ILIKE 'Iced Americano';

UPDATE menu_items SET name_ar = 'لاتي مثلج', name_ku = 'لاتیێ سارد'
  WHERE name_en ILIKE 'Iced Latte';

UPDATE menu_items SET name_ar = 'عصير برتقال', name_ku = 'شەربەتی پرتەقاڵ'
  WHERE name_en ILIKE 'Orange Juice';

UPDATE menu_items SET name_ar = 'عصیر جزر', name_ku = 'شەربەتی گێزەر'
  WHERE name_en ILIKE 'Carrot juice';

UPDATE menu_items SET name_ar = 'عصير تفاح', name_ku = 'شەربەتی سێو'
  WHERE name_en ILIKE 'Apple Juice';

UPDATE menu_items SET name_ar = 'عادي (ليمون)', name_ku = 'ئاسایی (لیمۆ)'
  WHERE name_en ILIKE 'Normal (Lemon)';

UPDATE menu_items SET name_ar = 'باشن فروت', name_ku = 'پاشن فرووت'
  WHERE name_en ILIKE 'Passion Fruit';

UPDATE menu_items SET name_ar = 'شاي الخوخ المثلج', name_ku = 'چای خۆخی سارد'
  WHERE name_en ILIKE 'Peach Iced Tea';

UPDATE menu_items SET name_ar = 'شاي الليمون المثلج', name_ku = 'چای سارد لەگەڵ لیمۆ'
  WHERE name_en ILIKE 'Lemon Iced Tea';

UPDATE menu_items SET name_ar = 'شوكولاتة فرابيه', name_ku = 'شوکولاتە فراپێ'
  WHERE name_en ILIKE 'Chocolate Frappe';

UPDATE menu_items SET name_ar = 'فانيليا فرابيه', name_ku = 'ڤانێلا  فراپێ'
  WHERE name_en ILIKE 'Vanilla Frappe';

UPDATE menu_items SET name_ar = 'قهوة فرابيه', name_ku = 'قاوە  فراپێ'
  WHERE name_en ILIKE 'Coffee Frappe';

UPDATE menu_items SET name_ar = 'تشيز كيك بالفستق الحلبي', name_ku = 'چیز کێک فستق'
  WHERE name_en ILIKE 'Cheesecake Pistachio';

UPDATE menu_items SET name_ar = 'سان سيباستيان', name_ku = 'سان سێباستیان'
  WHERE name_en ILIKE 'San Sebastien';

UPDATE menu_items SET name_ar = 'مافن شوكولاتة', name_ku = 'مەفینی چۆکڵێت'
  WHERE name_en ILIKE 'Chocolate muffin';

UPDATE menu_items SET name_ar = 'كيكة الفوندان', name_ku = 'لاڤا کێک'
  WHERE name_en ILIKE 'Fondant (Lava cake)';

UPDATE menu_items SET name_ar = 'كريسبي لاتيه', name_ku = 'کریسپی لاتێ'
  WHERE name_en ILIKE 'Crispy latte';

UPDATE menu_items SET name_ar = 'باهاماس', name_ku = 'بەهاماس'
  WHERE name_en ILIKE 'Bahamas';

UPDATE menu_items SET name_ar = 'كعكة اسفنجية', name_ku = 'کێکی مافین'
  WHERE name_en ILIKE 'Muffin';

UPDATE menu_items SET name_ar = 'كعكة باونتي', name_ku = 'کێکی باونتی'
  WHERE name_en ILIKE 'Bounty Cake';

UPDATE menu_items SET name_ar = 'كعكة ميتيس', name_ku = 'کێکی مێیتس'
  WHERE name_en ILIKE 'Meites Cake';

UPDATE menu_items SET name_ar = 'كعكة البراونيز', name_ku = 'کێکی براونیز'
  WHERE name_en ILIKE 'Brownies Cake';

UPDATE menu_items SET name_ar = 'كعكة المجرة', name_ku = 'کێکی گالاکسی'
  WHERE name_en ILIKE 'Galaxy cake';

UPDATE menu_items SET name_ar = 'كعكة كاكوبوت', name_ku = 'کێکی کاکۆپوت'
  WHERE name_en ILIKE 'Cacoput Cake';

UPDATE menu_items SET name_ar = 'ريد فيلفيت', name_ku = 'ڕێد ڤاڵڤێت'
  WHERE name_en ILIKE 'Red Velvet';

UPDATE menu_items SET name_ar = 'إيرل جراي الأبيض', name_ku = 'وایت ئێرل گرای', ing_ar = 'أوراق الشاي الأبيض، زيت البرغموت - (الصين)', ing_ku = 'گەڵای چای سپی، زەیتی بێرگامۆت - (چین)'
  WHERE name_en ILIKE 'White Earl Grey';

UPDATE menu_items SET name_ar = 'ياسمين أبيض', name_ku = 'یاسمین سپی', ing_ar = 'أوراق الشاي الأبيض، زهرة الياسمين - (الصين)', ing_ku = 'گەڵای چای سپی، گوڵی یاسمین - (چین)'
  WHERE name_en ILIKE 'White Jasmine';

UPDATE menu_items SET name_ar = 'إبرة الفضة', name_ku = 'دەرزی زیوین', ing_ar = 'أوراق الشاي الأبيض - (الصين)', ing_ku = 'گەڵای چای سپی - (چین)'
  WHERE name_en ILIKE 'Silver Needle';

UPDATE menu_items SET name_ar = 'الشاي الأبيض بنكهة البطيخ', name_ku = 'کاڤنلو بێاز چای', ing_ar = 'أوراق الشاي الأبيض، مستخلص البطيخ - (الصين)', ing_ku = 'گەڵای چای سپی، دەرهاویشتەی خەڵوز - (چین)'
  WHERE name_en ILIKE 'Kavunlu Beyaz Çay';

UPDATE menu_items SET name_ar = 'شاي مثلج تعزيز الطاقة', name_ku = 'ئێنێرجی بوست ئایس تی'
  WHERE name_en ILIKE 'Energy Boost Ice Tea';

UPDATE menu_items SET name_ar = 'شاي مثلج يوغا', name_ku = 'یۆگا ئایس تی'
  WHERE name_en ILIKE 'Yoga Ice tea';

UPDATE menu_items SET name_ar = 'بيج', name_ku = 'بێج'
  WHERE name_en ILIKE 'Beije';

UPDATE menu_items SET name_ar = 'لاتيه هوجيتشا بارد', name_ku = 'ئایس هۆجیچا لاتێ'
  WHERE name_en ILIKE 'Ice Hojicha Latte';

UPDATE menu_items SET name_ar = 'لاتيه هوجيتشا ساخن', name_ku = 'هۆجیچا لاتێی گەرم'
  WHERE name_en ILIKE 'Hot Hojicha Latte';

UPDATE menu_items SET name_ar = 'شاي مثلج بيري بانش', name_ku = 'بێری پەنچ ئایس تی'
  WHERE name_en ILIKE 'Beery Punch Iea Tea';
