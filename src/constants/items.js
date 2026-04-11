export const ITEMS = {
  blacktea: [
    {
      id: 1,
      photo:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
      name: { en: "Kurdish Chai", ar: "الشاي الكردي", ku: "چای کوردی" },
      ingredients: {
        en: "Black tea, cardamom, sugar cubes, hot water",
        ar: "شاي أسود، هيل، قطع سكر، ماء ساخن",
        ku: "چای ڕەش، هێل، شەکر، ئاوی گەرم",
      },
      price: 2500,
      tags: ["hot", "vegan"],
    },
    {
      id: 2,
      photo:
        "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=600&q=80",
      name: { en: "Earl Grey", ar: "إيرل غراي", ku: "ئیرل گری" },
      ingredients: {
        en: "Ceylon black tea, bergamot oil, lemon slice",
        ar: "شاي سيلاني، زيت البرغموت، شريحة ليمون",
        ku: "چای سیلۆن، رۆنی بێرگامۆت، لیمۆن",
      },
      price: 4000,
      tags: ["hot", "vegan"],
    },
    {
      id: 3,
      photo:
        "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600&q=80",
      name: { en: "Saffron Tea", ar: "شاي الزعفران", ku: "چای زەعفەران" },
      ingredients: {
        en: "White tea, Herat saffron, wildflower honey, rose petals",
        ar: "شاي أبيض، زعفران هراة، عسل أزهار، بتلات ورد",
        ku: "چای سپی، زەعفەران، عەسڵی گوڵ، گوڵی گوڵاو",
      },
      price: 5500,
      tags: ["hot", "vegan"],
    },
    {
      id: 4,
      photo:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80",
      name: { en: "Cardamom Latte", ar: "لاتيه بالهيل", ku: "لاتێی هێل" },
      ingredients: {
        en: "Strong black tea, steamed full-cream milk, fresh cardamom",
        ar: "شاي أسود قوي، حليب مبخر كامل الدسم، هيل طازج",
        ku: "چای ڕەشی قووڵ، شیری بخارکراو، هێلی تازە",
      },
      price: 4500,
      tags: ["hot"],
    },
  ],
  herbal: [
    {
      id: 5,
      photo:
        "https://images.unsplash.com/photo-1587796697483-2b6d98d35f16?w=600&q=80",
      name: { en: "Rose Hibiscus", ar: "الورد والكركديه", ku: "گوڵ و ڕووکەند" },
      ingredients: {
        en: "Dried rose buds, hibiscus flowers, wildflower honey, hot water",
        ar: "براعم ورد مجففة، كركديه، عسل أزهار برية، ماء ساخن",
        ku: "گوڵی وشک، گوڵی ڕووکەند، عەسڵ، ئاوی گەرم",
      },
      price: 5000,
      tags: ["hot", "vegan"],
    },
    {
      id: 6,
      photo:
        "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80",
      name: { en: "Fresh Mint Tea", ar: "شاي النعناع", ku: "چای نەعنا" },
      ingredients: {
        en: "Fresh garden mint leaves, hot water, honey (optional)",
        ar: "أوراق نعناع طازجة، ماء ساخن، عسل (اختياري)",
        ku: "گەڵای نەعنای تازە، ئاوی گەرم، عەسڵ (ئارەزووی)",
      },
      price: 3500,
      tags: ["hot", "vegan"],
    },
    {
      id: 7,
      photo:
        "https://images.unsplash.com/photo-1571934811356-5cc061b6d7c3?w=600&q=80",
      name: {
        en: "Chamomile Honey",
        ar: "البابونج بالعسل",
        ku: "کامیۆمیل و عەسڵ",
      },
      ingredients: {
        en: "Chamomile flowers, wildflower honey, lemon juice, hot water",
        ar: "زهور بابونج، عسل أزهار برية، عصير ليمون، ماء ساخن",
        ku: "گوڵی کامیۆمیل، عەسڵ، ئاوی لیمۆن، ئاوی گەرم",
      },
      price: 4500,
      tags: ["hot", "vegan"],
    },
    {
      id: 8,
      photo:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
      name: {
        en: "Ginger Lemon",
        ar: "الزنجبيل والليمون",
        ku: "زەنجەفیل و لیمۆن",
      },
      ingredients: {
        en: "Fresh ginger root, lemon juice, raw honey, hot water",
        ar: "جذر زنجبيل طازج، عصير ليمون، عسل خام، ماء ساخن",
        ku: "ڕەگی زەنجەفیلی تازە، ئاوی لیمۆن، عەسڵی خام",
      },
      price: 4000,
      tags: ["hot", "vegan", "new"],
    },
  ],
  hotdrinks: [
    {
      id: 9,
      photo:
        "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80",
      name: {
        en: "Masala Chai Latte",
        ar: "ماسالا تشاي",
        ku: "ماسالا چای لاتێ",
      },
      ingredients: {
        en: "Black tea, ginger, cinnamon, cloves, cardamom, steamed milk",
        ar: "شاي أسود، زنجبيل، قرفة، قرنفل، هيل، حليب مبخر",
        ku: "چای ڕەش، زەنجەفیل، دارچین، قرنفل، هێل، شیر",
      },
      price: 5500,
      tags: ["hot"],
    },
    {
      id: 10,
      photo:
        "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=600&q=80",
      name: { en: "London Fog", ar: "ضباب لندن", ku: "لۆندن فۆگ" },
      ingredients: {
        en: "Earl Grey tea, vanilla syrup, lavender, steamed milk, foam",
        ar: "شاي إيرل غراي، شراب فانيليا، لافندر، حليب مبخر، رغوة",
        ku: "چای ئیرل گری، شەربەتی وانیلا، لافەندر، شیر، فۆم",
      },
      price: 6000,
      tags: ["hot"],
    },
    {
      id: 11,
      photo:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80",
      name: {
        en: "Hot Chocolate Tea",
        ar: "شوكولاتة ساخنة",
        ku: "چۆکلاتی گەرم",
      },
      ingredients: {
        en: "Valrhona dark chocolate, rooibos tea, oat milk, cinnamon",
        ar: "شوكولاتة داكنة فالرونا، شاي رويبوس، حليب شوفان، قرفة",
        ku: "چۆکلاتی تاریک، چای رووییبۆس، شیری جۆ، دارچین",
      },
      price: 6500,
      tags: ["hot"],
    },
  ],
  milktea: [
    {
      id: 12,
      photo:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      name: {
        en: "Brown Sugar Milk Tea",
        ar: "شاي الحليب بسكر بني",
        ku: "چای شیری شەکری قاوەیی",
      },
      ingredients: {
        en: "Loose-leaf black tea, tiger-stripe brown sugar caramel, full-cream milk",
        ar: "شاي أسود، كراميل سكر بني، حليب كامل الدسم",
        ku: "چای ڕەش، کارامێلی شەکری قاوەیی، شیری تەواو",
      },
      price: 6000,
      tags: ["hot", "cold"],
    },
    {
      id: 13,
      photo:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80",
      name: {
        en: "Taro Milk Tea",
        ar: "شاي الحليب بالتارو",
        ku: "چای شیری تارۆ",
      },
      ingredients: {
        en: "Oolong tea, taro powder, oat milk, honey, ice (optional)",
        ar: "شاي أولونج، مسحوق التارو، حليب الشوفان، عسل، ثلج (اختياري)",
        ku: "چای ئوولۆنگ، پووری تارۆ، شیری جۆ، عەسڵ، یەخ",
      },
      price: 6500,
      tags: ["hot", "cold", "new"],
    },
    {
      id: 14,
      photo:
        "https://images.unsplash.com/photo-1571934811356-5cc061b6d7c3?w=600&q=80",
      name: {
        en: "Rose Milk Tea",
        ar: "شاي الورد بالحليب",
        ku: "چای گوڵ و شیر",
      },
      ingredients: {
        en: "Assam black tea, rose water, rose syrup, steamed full-cream milk",
        ar: "شاي أسام، ماء ورد، شراب ورد، حليب كامل الدسم مبخر",
        ku: "چای ئاسام، ئاوی گوڵ، شەربەتی گوڵ، شیر",
      },
      price: 5500,
      tags: ["hot"],
    },
    {
      id: 15,
      photo:
        "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80",
      name: {
        en: "Chestnut Milk Tea",
        ar: "شاي الحليب بالكستناء",
        ku: "چای شیری بالحاء",
      },
      ingredients: {
        en: "Houji-cha green tea, roasted chestnut syrup, silky steamed milk",
        ar: "شاي هايجيشا الأخضر، شراب كستناء محمص، حليب مبخر",
        ku: "چای هووجیچا، شەربەتی بالحاء، شیری نوشتک",
      },
      price: 6000,
      tags: ["hot"],
    },
  ],
  matcha: [
    {
      id: 16,
      photo:
        "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80",
      name: {
        en: "Ceremonial Matcha",
        ar: "ماتشا احتفالية",
        ku: "ماتچای رەسمی",
      },
      ingredients: {
        en: "100% Japanese ceremonial grade matcha powder, hot water (70°C)",
        ar: "مسحوق ماتشا ياباني احتفالي 100%، ماء ساخن (70 درجة)",
        ku: "پووری ماتچای ژاپۆنی %100، ئاوی گەرم (70°C)",
      },
      price: 7000,
      tags: ["hot", "vegan"],
    },
    {
      id: 17,
      photo:
        "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&q=80",
      name: { en: "Matcha Latte", ar: "لاتيه الماتشا", ku: "ماتچا لاتێ" },
      ingredients: {
        en: "Ceremonial matcha, wildflower honey, steamed full-cream milk, soft foam",
        ar: "ماتشا احتفالية، عسل أزهار برية، حليب مبخر كامل الدسم، رغوة",
        ku: "ماتچای رەسمی، عەسڵ، شیری بخارکراو، فۆم",
      },
      price: 6500,
      tags: ["hot"],
    },
    {
      id: 18,
      photo:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
      name: {
        en: "Iced Matcha Latte",
        ar: "لاتيه الماتشا البارد",
        ku: "ماتچا لاتێی سارد",
      },
      ingredients: {
        en: "Double-shot matcha, oat milk, vanilla syrup, ice cubes",
        ar: "ماتشا مزدوجة، حليب الشوفان، شراب فانيليا، مكعبات ثلج",
        ku: "ماتچای دووتا، شیری جۆ، شەربەتی وانیلا، یەخ",
      },
      price: 7000,
      tags: ["cold", "vegan"],
    },
    {
      id: 19,
      photo:
        "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=600&q=80",
      name: {
        en: "Matcha Yuzu Fizz",
        ar: "ماتشا اليوزو الفوار",
        ku: "ماتچا یووزو فیز",
      },
      ingredients: {
        en: "Sparkling water, matcha, yuzu citrus juice, lychee foam, ice",
        ar: "ماء فوار، ماتشا، عصير يوزو، رغوة ليتشي، ثلج",
        ku: "ئاوی فوارە، ماتچا، ئاوی یووزو، فۆمی لیچی، یەخ",
      },
      price: 7500,
      tags: ["cold", "vegan", "new"],
    },
  ],
  fruittea: [
    {
      id: 20,
      photo:
        "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=600&q=80",
      name: {
        en: "Strawberry Hibiscus",
        ar: "الفراولة والكركديه",
        ku: "تۆوی فریز و ڕووکەند",
      },
      ingredients: {
        en: "Hibiscus flowers, fresh strawberries, wild berry mix, honey, ice",
        ar: "أزهار الكركديه، فراولة طازجة، مزيج توت بري، عسل، ثلج",
        ku: "گوڵی ڕووکەند، تۆوی فریزی تازە، تۆوی کێوی، عەسڵ، یەخ",
      },
      price: 5500,
      tags: ["cold", "vegan"],
    },
    {
      id: 21,
      photo:
        "https://images.unsplash.com/photo-1587796697483-2b6d98d35f16?w=600&q=80",
      name: {
        en: "Mango Passion Tea",
        ar: "شاي المانغو والباشن",
        ku: "چای مانگا و پاشن",
      },
      ingredients: {
        en: "Green tea, mango puree, passion fruit, honey, ice cubes",
        ar: "شاي أخضر، هريس مانغو، باشن فروت، عسل، ثلج",
        ku: "چای سەوز، پووری مانگا، پاشن فرووت، عەسڵ، یەخ",
      },
      price: 5500,
      tags: ["cold", "vegan"],
    },
    {
      id: 22,
      photo:
        "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80",
      name: { en: "Peach Oolong", ar: "الخوخ والأولونج", ku: "خۆخ و ئوولۆنگ" },
      ingredients: {
        en: "Premium oolong tea, sun-ripened peach slices, wildflower honey, ice",
        ar: "أولونج فاخر، شرائح خوخ ناضج، عسل أزهار برية، ثلج",
        ku: "ئوولۆنگی باشتر، بڕچکەی خۆخ، عەسڵ، یەخ",
      },
      price: 6000,
      tags: ["cold", "vegan"],
    },
    {
      id: 23,
      photo:
        "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=600&q=80",
      name: {
        en: "Blueberry Lemonade",
        ar: "ليمونادة التوت الأزرق",
        ku: "لیمۆناتی بلووبێری",
      },
      ingredients: {
        en: "Iced white tea, blueberry compote, fresh lemon juice, mint, ice",
        ar: "شاي أبيض بارد، كومبوت توت أزرق، عصير ليمون طازج، نعناع، ثلج",
        ku: "چای سپی سارد، کۆمپۆتی بلووبێری، ئاوی لیمۆن، نەعنا",
      },
      price: 6000,
      tags: ["cold", "vegan", "new"],
    },
  ],
  iced: [
    {
      id: 24,
      photo:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      name: {
        en: "Thai Iced Tea",
        ar: "الشاي التايلاندي",
        ku: "چای تایلاندی سارد",
      },
      ingredients: {
        en: "Ceylon black tea, sweetened condensed milk, star anise, crushed ice",
        ar: "شاي سيلاني، حليب مكثف محلى، يانسون نجمي، ثلج مجروش",
        ku: "چای سیلۆن، شیری کۆنداسدی شیرین، ئانیسی ئەستێرە، یەخ",
      },
      price: 5000,
      tags: ["cold"],
    },
    {
      id: 25,
      photo:
        "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80",
      name: {
        en: "Cold Brew Jasmine",
        ar: "الياسمين البارد",
        ku: "چای یاسمین سارد",
      },
      ingredients: {
        en: "Jasmine green tea, cold-filtered water (12hr steep), light honey",
        ar: "شاي الياسمين الأخضر، ماء مفلتر بارد (نقيع 12 ساعة)، عسل خفيف",
        ku: "چای سەوزی یاسمین، ئاوی سارد (12 کاتژمێر), عەسڵی سووک",
      },
      price: 5500,
      tags: ["cold", "vegan"],
    },
    {
      id: 26,
      photo:
        "https://images.unsplash.com/photo-1571934811356-5cc061b6d7c3?w=600&q=80",
      name: {
        en: "Honey Lemon Iced Tea",
        ar: "شاي الليمون والعسل",
        ku: "چای لیمۆن و عەسڵ",
      },
      ingredients: {
        en: "Black tea, wildflower honey, fresh lemon slices, mint leaves, ice",
        ar: "شاي أسود، عسل أزهار برية، شرائح ليمون طازجة، نعناع، ثلج",
        ku: "چای ڕەش، عەسڵ، لیمۆنی تازە، گەڵای نەعنا، یەخ",
      },
      price: 4500,
      tags: ["cold", "vegan"],
    },
  ],
  salads: [
    {
      id: 27,
      photo:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
      name: {
        en: "Golden Chicken Salad",
        ar: "سلطة الدجاج الذهبية",
        ku: "سەلاتەی مریشکی زێرین",
      },
      ingredients: {
        en: "Lollo rosso, iceberg, sweet corn, red beans, grilled chicken, lemon dressing",
        ar: "لولو روسو، خس جبل الثلج، ذرة حلوة، فاصولياء حمراء، دجاج مشوي، صلصة ليمون",
        ku: "لۆلۆ ڕۆسۆ، خاس، گەنمی شیرین، لوبیای سوور، مریشک، سۆسی لیمۆن",
      },
      price: 12500,
      tags: [],
    },
    {
      id: 28,
      photo:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
      name: {
        en: "Tomato Pomegranate",
        ar: "سلطة الطماطم والرمان",
        ku: "سەلاتەی تاماتی ئەنار",
      },
      ingredients: {
        en: "Fresh tomatoes, hot green peppers, crunchy walnuts, pomegranate seeds, olive oil",
        ar: "طماطم طازجة، فلفل أخضر حار، جوز مقرمش، بذور رمان، زيت زيتون",
        ku: "تاماتی تازە، مریچی سەوزی تیژ، گوێزی ئینگلیزی، تۆی ئەنار، رۆنی زەیتوون",
      },
      price: 7000,
      tags: ["vegan"],
    },
    {
      id: 29,
      photo:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80",
      name: {
        en: "Chicken Caesar",
        ar: "سلطة سيزر بالدجاج",
        ku: "سەلاتەی سیزەری مریشک",
      },
      ingredients: {
        en: "Romaine lettuce, grilled chicken, parmesan, croutons, Caesar dressing, anchovies",
        ar: "خس روماني، دجاج مشوي، جبن بارميزان، خبز محمص، صلصة سيزر، أنشوفة",
        ku: "خاسی رۆمانی، مریشک، پەنیری پارمیزان، کرووتۆن، سۆسی سیزار",
      },
      price: 13000,
      tags: [],
    },
    {
      id: 30,
      photo:
        "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=600&q=80",
      name: {
        en: "Avocado Citrus",
        ar: "سلطة الأفوكادو",
        ku: "سەلاتەی ئاڤۆکادۆ",
      },
      ingredients: {
        en: "Fresh avocado, grapefruit segments, cucumber, arugula, citrus vinaigrette",
        ar: "أفوكادو طازج، قطع جريب فروت، خيار، جرجير، خل الحمضيات",
        ku: "ئاڤۆکادۆی تازە، تاێفا، خیار، ئارووگولا، سۆسی سیتروس",
      },
      price: 11000,
      tags: ["vegan", "new"],
    },
  ],
  bites: [
    {
      id: 31,
      photo:
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80",
      name: {
        en: "Butter Croissant",
        ar: "كرواسان بالزبدة",
        ku: "کرواسانی کەرە",
      },
      ingredients: {
        en: "French butter, T45 flour, fresh yeast, milk, sea salt, egg wash",
        ar: "زبدة فرنسية، دقيق T45، خميرة طازجة، حليب، ملح بحري، طلاء بيض",
        ku: "کەرەی فەرەنسی، ئارد، خەمیرەی تازە، شیر، خوێی بەحری",
      },
      price: 5000,
      tags: [],
    },
    {
      id: 32,
      photo:
        "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80",
      name: { en: "Cheesecake Slice", ar: "تشيز كيك", ku: "چیزکێک" },
      ingredients: {
        en: "Cream cheese, digestive biscuit base, eggs, vanilla, sour cream, sugar",
        ar: "جبن كريمي، قاعدة بسكويت، بيض، فانيليا، كريمة حامضة، سكر",
        ku: "پەنیری کریمی، قاعدەی بیسکووت، هێلکە، وانیلا، شیری ترش",
      },
      price: 7000,
      tags: [],
    },
    {
      id: 33,
      photo:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
      name: {
        en: "Chocolate Brownie",
        ar: "براوني الشوكولاتة",
        ku: "براونی چۆکلاتی",
      },
      ingredients: {
        en: "Valrhona dark chocolate, unsalted butter, eggs, sugar, flour, walnuts",
        ar: "شوكولاتة داكنة فالرونا، زبدة غير مملحة، بيض، سكر، دقيق، جوز",
        ku: "چۆکلاتی تاریک، کەرە، هێلکە، شەکر، ئارد، گوێزی ئینگلیزی",
      },
      price: 5500,
      tags: [],
    },
    {
      id: 34,
      photo:
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
      name: { en: "Pistachio Cookie", ar: "كوكيز الفستق", ku: "کووکیز پیستە" },
      ingredients: {
        en: "Pistachio paste, white chocolate chips, butter, flour, brown sugar, sea salt",
        ar: "معجون فستق، قطع شوكولاتة بيضاء، زبدة، دقيق، سكر بني، ملح بحري",
        ku: "پەیستی پیستە، چۆکلاتی سپی، کەرە، ئارد، شەکری قاوەیی، خوێ",
      },
      price: 3500,
      tags: ["vegan", "new"],
    },
  ],
};

export const ALL_ITEMS = Object.values(ITEMS).flat();
