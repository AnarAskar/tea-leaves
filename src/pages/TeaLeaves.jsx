"use client";
import { useState, useRef, useEffect, useCallback } from "react";

/* ─── TRANSLATIONS ─── */
const T = {
  en: {
    appName: "Tea Leaves",
    search: "Search menu…",
    viewOrder: "View Order",
    yourOrder: "Your Order",
    empty: "Your order is empty.\nAdd some items from the menu!",
    specialNote: "Special instructions",
    notePlaceholder: "e.g. no sugar, extra hot…",
    subtotal: "Subtotal",
    service: "Service (10%)",
    total: "Total",
    placeOrder: "Place Order",
    orderPlaced: "Order Placed!",
    orderMsg: "Your order has been sent to our team.\nSit back and relax!",
    orderMore: "Order More Items",
    each: "each",
    hot: "Hot",
    cold: "Cold",
    vegan: "Vegan",
    new: "New",
    noItems: "No items found",
    results: "results for",
  },
  ar: {
    appName: "تي ليفز",
    search: "ابحث في القائمة…",
    viewOrder: "عرض الطلب",
    yourOrder: "طلبك",
    empty: "طلبك فارغ.\nأضف بعض العناصر من القائمة!",
    specialNote: "ملاحظات خاصة",
    notePlaceholder: "مثال: بدون سكر، ساخن جداً…",
    subtotal: "المجموع الجزئي",
    service: "رسوم الخدمة (10%)",
    total: "الإجمالي",
    placeOrder: "تأكيد الطلب",
    orderPlaced: "تم الطلب!",
    orderMsg: "تم إرسال طلبك إلى فريقنا.\nاسترخِ وانتظر!",
    orderMore: "طلب المزيد",
    each: "للواحدة",
    hot: "ساخن",
    cold: "بارد",
    vegan: "نباتي",
    new: "جديد",
    noItems: "لا توجد عناصر",
    results: "نتائج لـ",
  },
  ku: {
    appName: "تی لیڤز",
    search: "گەڕان لە مێنیوو…",
    viewOrder: "بینینی داواکاری",
    yourOrder: "داواکارییەکەت",
    empty: "داواکارییەکەت بەتاڵە.\nشتێک لە مێنیوی زیاد بکە!",
    specialNote: "تێبینی تایبەت",
    notePlaceholder: "مەسەلەن: بێ شەکر، زۆر گەرم…",
    subtotal: "کۆی بەشەکان",
    service: "خزمەتگوزاری (10%)",
    total: "کۆی گشتی",
    placeOrder: "پشتڕاستکردنەوەی داواکاری",
    orderPlaced: "داواکاری تۆمارکرا!",
    orderMsg: "داواکارییەکەت نێردرا بۆ تیمەکەمان.\nئارام بە!",
    orderMore: "داواکاری زیاتر",
    each: "بۆ هەریەک",
    hot: "گەرم",
    cold: "سارد",
    vegan: "ڤێگان",
    new: "نوێ",
    noItems: "هیچ بابەتێک نەدۆزرایەوە",
    results: "ئەنجام بۆ",
  },
};

const LANG_OPTS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇮🇶" },
  { code: "ku", label: "کوردی", flag: "🏔️" },
];

/* ─── CATEGORIES ─── */
const CATS = [
  {
    id: "blacktea",
    emoji: "🍵",
    label: { en: "Black Tea", ar: "الشاي الأسود", ku: "چای ڕەش" },
  },
  {
    id: "herbal",
    emoji: "🌿",
    label: { en: "Herbal Teas", ar: "الأعشاب", ku: "چای گیایی" },
  },
  {
    id: "hotdrinks",
    emoji: "☕",
    label: { en: "Hot Drinks", ar: "مشروبات ساخنة", ku: "خواردنەوەی گەرم" },
  },
  {
    id: "milktea",
    emoji: "🥛",
    label: { en: "Milk Teas", ar: "شاي الحليب", ku: "چای شیر" },
  },
  {
    id: "matcha",
    emoji: "🍃",
    label: { en: "Matcha", ar: "ماتشا", ku: "ماتچا" },
  },
  {
    id: "fruittea",
    emoji: "🍓",
    label: { en: "Fruit Teas", ar: "شاي الفاكهة", ku: "چای میوە" },
  },
  {
    id: "iced",
    emoji: "🧊",
    label: { en: "Iced Drinks", ar: "مشروبات باردة", ku: "خواردنەوەی سارد" },
  },
  {
    id: "salads",
    emoji: "🥗",
    label: { en: "Salads", ar: "سلطات", ku: "سەلاتە" },
  },
  {
    id: "bites",
    emoji: "🥐",
    label: { en: "Light Bites", ar: "وجبات خفيفة", ku: "خواردنی سووک" },
  },
];

/* ─── MENU ITEMS ─── */
const ITEMS = {
  blacktea: [
    {
      id: 1,
      photo:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
      name: { en: "Kurdish Chai", ar: "الشاي الكردي", ku: "چای کوردی" },
      desc: {
        en: "Traditional black tea with cardamom & sugar cubes",
        ar: "شاي أسود تقليدي مع هيل وسكر",
        ku: "چای ڕەشی کلاسیک لەگەڵ هێل و شەکر",
      },
      price: 2500,
      tags: ["hot", "vegan"],
    },
    {
      id: 2,
      photo:
        "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=400&q=80",
      name: { en: "Earl Grey", ar: "إيرل غراي", ku: "ئیرل گری" },
      desc: {
        en: "Bergamot-scented Ceylon tea in a glass teapot",
        ar: "شاي أسود بنكهة البرغموت",
        ku: "چای ڕەشی سیلۆن بەبۆنی بێرگامۆت",
      },
      price: 4000,
      tags: ["hot", "vegan"],
    },
    {
      id: 3,
      photo:
        "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&q=80",
      name: { en: "Saffron Tea", ar: "شاي الزعفران", ku: "چای زەعفەران" },
      desc: {
        en: "White tea with Herat saffron, honey & rose petals",
        ar: "شاي أبيض مع زعفران هراة والعسل",
        ku: "چای سپی لەگەڵ زەعفەران و گوڵ",
      },
      price: 5500,
      tags: ["hot", "vegan"],
    },
    {
      id: 4,
      photo:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80",
      name: { en: "Cardamom Latte", ar: "لاتيه بالهيل", ku: "لاتێی هێل" },
      desc: {
        en: "Strong black tea with steamed milk & fresh cardamom",
        ar: "شاي قوي مع حليب مبخر وهيل طازج",
        ku: "چای قووڵ لەگەڵ شیر و هێلی تازە",
      },
      price: 4500,
      tags: ["hot"],
    },
  ],
  herbal: [
    {
      id: 5,
      photo:
        "https://images.unsplash.com/photo-1587796697483-2b6d98d35f16?w=400&q=80",
      name: { en: "Rose Hibiscus", ar: "الورد والكركديه", ku: "گوڵ و ڕووکەند" },
      desc: {
        en: "Dried rose buds & hibiscus flowers with honey",
        ar: "براعم الورد والكركديه مع عسل",
        ku: "گوڵی وشک و ڕووکەند لەگەڵ عەسڵ",
      },
      price: 5000,
      tags: ["hot", "vegan"],
    },
    {
      id: 6,
      photo:
        "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80",
      name: { en: "Fresh Mint Tea", ar: "شاي النعناع", ku: "چای نەعنا" },
      desc: {
        en: "Fresh garden mint steeped to perfection",
        ar: "نعناع طازج منقوع بالماء الساخن",
        ku: "نەعنای تازەی باخچە لە ئاوی گەرم",
      },
      price: 3500,
      tags: ["hot", "vegan"],
    },
    {
      id: 7,
      photo:
        "https://images.unsplash.com/photo-1571934811356-5cc061b6d7c3?w=400&q=80",
      name: {
        en: "Chamomile Honey",
        ar: "البابونج بالعسل",
        ku: "کامیۆمیل و عەسڵ",
      },
      desc: {
        en: "Delicate chamomile with wildflower honey & lemon",
        ar: "بابونج لطيف مع عسل الأزهار البرية",
        ku: "کامیۆمیل نازک لەگەڵ عەسڵ و لیمۆن",
      },
      price: 4500,
      tags: ["hot", "vegan"],
    },
    {
      id: 8,
      photo:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
      name: {
        en: "Ginger Lemon",
        ar: "الزنجبيل والليمون",
        ku: "زەنجەفیل و لیمۆن",
      },
      desc: {
        en: "Fresh ginger root, lemon & raw honey infusion",
        ar: "جذر زنجبيل طازج وعصير الليمون والعسل",
        ku: "زەنجەفیلی تازە، لیمۆن و عەسڵی خام",
      },
      price: 4000,
      tags: ["hot", "vegan", "new"],
    },
  ],
  hotdrinks: [
    {
      id: 9,
      photo:
        "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80",
      name: {
        en: "Masala Chai Latte",
        ar: "ماسالا تشاي",
        ku: "ماسالا چای لاتێ",
      },
      desc: {
        en: "Spiced black tea with ginger, cinnamon & steamed milk",
        ar: "شاي مبهر مع حليب مبخر",
        ku: "چای بەرزەواتی لەگەڵ شیر",
      },
      price: 5500,
      tags: ["hot"],
    },
    {
      id: 10,
      photo:
        "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=400&q=80",
      name: { en: "London Fog", ar: "ضباب لندن", ku: "لۆندن فۆگ" },
      desc: {
        en: "Earl Grey with vanilla & lavender steamed milk",
        ar: "إيرل غراي مع حليب الفانيليا واللافندر",
        ku: "ئیرل گری لەگەڵ وانیلا و لافەندر",
      },
      price: 6000,
      tags: ["hot"],
    },
    {
      id: 11,
      photo:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80",
      name: {
        en: "Hot Chocolate Tea",
        ar: "شوكولاتة ساخنة",
        ku: "چۆکلاتی گەرم",
      },
      desc: {
        en: "Dark chocolate blended with rooibos tea & oat milk",
        ar: "شوكولاتة داكنة مع شاي الرويبوس",
        ku: "چۆکلاتی تاریک لەگەڵ چای رووییبۆس",
      },
      price: 6500,
      tags: ["hot"],
    },
  ],
  milktea: [
    {
      id: 12,
      photo:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      name: {
        en: "Brown Sugar Milk Tea",
        ar: "شاي الحليب بسكر بني",
        ku: "چای شیری شەکری قاوەیی",
      },
      desc: {
        en: "Tiger-stripe caramel, full-cream milk & black tea",
        ar: "كراميل وحليب كامل الدسم وشاي أسود",
        ku: "کارامێل لەگەڵ شیر و چای ڕەش",
      },
      price: 6000,
      tags: ["hot", "cold"],
    },
    {
      id: 13,
      photo:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
      name: {
        en: "Taro Milk Tea",
        ar: "شاي الحليب بالتارو",
        ku: "چای شیری تارۆ",
      },
      desc: {
        en: "Velvety taro with oolong tea & oat milk",
        ar: "تارو كريمي مع شاي الأولونج",
        ku: "تارۆی نەرم لەگەڵ چای ئوولۆنگ",
      },
      price: 6500,
      tags: ["hot", "cold", "new"],
    },
    {
      id: 14,
      photo:
        "https://images.unsplash.com/photo-1571934811356-5cc061b6d7c3?w=400&q=80",
      name: {
        en: "Rose Milk Tea",
        ar: "شاي الورد بالحليب",
        ku: "چای گوڵ و شیر",
      },
      desc: {
        en: "Assam black tea, rose water & steamed full-cream milk",
        ar: "شاي أسام مع ماء الورد والحليب",
        ku: "چای ئاسام لەگەڵ ئاوی گوڵ و شیر",
      },
      price: 5500,
      tags: ["hot"],
    },
    {
      id: 15,
      photo:
        "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80",
      name: {
        en: "Chestnut Milk Tea",
        ar: "شاي الحليب بالكستناء",
        ku: "چای شیری بالحاء",
      },
      desc: {
        en: "Roasted chestnut syrup with houji-cha & silky milk",
        ar: "شراب الكستناء المحمص مع الهايجيشا",
        ku: "شەربەتی بالحاء کەپووتوو لەگەڵ شیر",
      },
      price: 6000,
      tags: ["hot"],
    },
  ],
  matcha: [
    {
      id: 16,
      photo:
        "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80",
      name: {
        en: "Ceremonial Matcha",
        ar: "ماتشا احتفالية",
        ku: "ماتچای رەسمی",
      },
      desc: {
        en: "100% Japanese ceremonial grade matcha, whisked fresh",
        ar: "ماتشا يابانية احتفالية 100%",
        ku: "ماتچای ژاپۆنی %100",
      },
      price: 7000,
      tags: ["hot", "vegan"],
    },
    {
      id: 17,
      photo:
        "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=400&q=80",
      name: { en: "Matcha Latte", ar: "لاتيه الماتشا", ku: "ماتچا لاتێ" },
      desc: {
        en: "Ceremonial matcha, honey & full-cream steamed milk",
        ar: "ماتشا احتفالية مع عسل وحليب مبخر",
        ku: "ماتچا لەگەڵ عەسڵ و شیر",
      },
      price: 6500,
      tags: ["hot"],
    },
    {
      id: 18,
      photo:
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
      name: {
        en: "Iced Matcha Latte",
        ar: "لاتيه الماتشا البارد",
        ku: "ماتچا لاتێی سارد",
      },
      desc: {
        en: "Double-shot matcha over ice with oat milk & vanilla",
        ar: "ماتشا مزدوجة مع الثلج وحليب الشوفان",
        ku: "ماتچای دووتا سەر یەخ لەگەڵ شیری جۆ",
      },
      price: 7000,
      tags: ["cold", "vegan"],
    },
    {
      id: 19,
      photo:
        "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=400&q=80",
      name: {
        en: "Matcha Yuzu Fizz",
        ar: "ماتشا اليوزو الفوار",
        ku: "ماتچا یووزو فیز",
      },
      desc: {
        en: "Sparkling matcha soda with yuzu citrus & lychee foam",
        ar: "مشروب ماتشا فوار بنكهة اليوزو",
        ku: "سۆدای ماتچای فوارە لەگەڵ یووزو",
      },
      price: 7500,
      tags: ["cold", "vegan", "new"],
    },
  ],
  fruittea: [
    {
      id: 20,
      photo:
        "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=400&q=80",
      name: {
        en: "Strawberry Hibiscus",
        ar: "الفراولة والكركديه",
        ku: "تۆوی فریز و ڕووکەند",
      },
      desc: {
        en: "Hibiscus flowers, fresh strawberries & wild berry blend",
        ar: "أزهار الكركديه مع الفراولة الطازجة",
        ku: "گوڵی ڕووکەند لەگەڵ تۆوی فریز",
      },
      price: 5500,
      tags: ["cold", "vegan"],
    },
    {
      id: 21,
      photo:
        "https://images.unsplash.com/photo-1587796697483-2b6d98d35f16?w=400&q=80",
      name: {
        en: "Mango Passion Tea",
        ar: "شاي المانغو والباشن",
        ku: "چای مانگا و پاشن",
      },
      desc: {
        en: "Tropical mango & passion fruit with green tea",
        ar: "مانغو وباشن فروت مع شاي أخضر",
        ku: "مانگا و پاشن فرووت لەگەڵ چای سەوز",
      },
      price: 5500,
      tags: ["cold", "vegan"],
    },
    {
      id: 22,
      photo:
        "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80",
      name: { en: "Peach Oolong", ar: "الخوخ والأولونج", ku: "خۆخ و ئوولۆنگ" },
      desc: {
        en: "Premium oolong steeped with sun-ripened peaches & honey",
        ar: "أولونج فاخر مع خوخ ناضج وعسل",
        ku: "ئوولۆنگ لەگەڵ خۆخ و عەسڵ",
      },
      price: 6000,
      tags: ["cold", "vegan"],
    },
    {
      id: 23,
      photo:
        "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&q=80",
      name: {
        en: "Blueberry Lemonade",
        ar: "ليمونادة التوت الأزرق",
        ku: "لیمۆناتی بلووبێری",
      },
      desc: {
        en: "Iced white tea, blueberry compote & house lemonade",
        ar: "شاي أبيض بارد مع كومبوت التوت",
        ku: "چای سپی سارد لەگەڵ بلووبێری",
      },
      price: 6000,
      tags: ["cold", "vegan", "new"],
    },
  ],
  iced: [
    {
      id: 24,
      photo:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      name: {
        en: "Thai Iced Tea",
        ar: "الشاي التايلاندي",
        ku: "چای تایلاندی سارد",
      },
      desc: {
        en: "Ceylon brew with condensed milk over crushed ice",
        ar: "شاي سيلاني مع حليب مكثف وثلج",
        ku: "چای سیلۆن لەگەڵ شیری کۆنداسد سەر یەخ",
      },
      price: 5000,
      tags: ["cold"],
    },
    {
      id: 25,
      photo:
        "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80",
      name: {
        en: "Cold Brew Jasmine",
        ar: "الياسمين البارد",
        ku: "چای یاسمین سارد",
      },
      desc: {
        en: "12-hour cold-brewed jasmine green tea",
        ar: "شاي الياسمين الأخضر المخمر 12 ساعة",
        ku: "١٢ کاتژمێر چای سەوزی یاسمین سارد",
      },
      price: 5500,
      tags: ["cold", "vegan"],
    },
    {
      id: 26,
      photo:
        "https://images.unsplash.com/photo-1571934811356-5cc061b6d7c3?w=400&q=80",
      name: {
        en: "Honey Lemon Iced Tea",
        ar: "شاي الليمون والعسل",
        ku: "چای لیمۆن و عەسڵ",
      },
      desc: {
        en: "Chilled black tea, wildflower honey & fresh lemon",
        ar: "شاي أسود بارد مع عسل وشرائح الليمون",
        ku: "چای ڕەشی سارد لەگەڵ عەسڵ و لیمۆن",
      },
      price: 4500,
      tags: ["cold", "vegan"],
    },
  ],
  salads: [
    {
      id: 27,
      photo:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
      name: {
        en: "Golden Chicken Salad",
        ar: "سلطة الدجاج الذهبية",
        ku: "سەلاتەی مریشکی زێرین",
      },
      desc: {
        en: "Grilled chicken, mixed greens, tomatoes & lemon dressing",
        ar: "دجاج مشوي مع خضار مشكلة وطماطم كرز",
        ku: "مریشکی کەپووتوو لەگەڵ سەوزەی تێکەڵ",
      },
      price: 12500,
      tags: [],
    },
    {
      id: 28,
      photo:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
      name: {
        en: "Tomato Pomegranate",
        ar: "سلطة الطماطم والرمان",
        ku: "سەلاتەی تاماتی ئەنار",
      },
      desc: {
        en: "Heirloom tomatoes, pomegranate, feta & mint dressing",
        ar: "طماطم مع بذور الرمان وجبن الفيتا",
        ku: "تاماتی ئەصیل لەگەڵ تۆی ئەنار و پەنیر",
      },
      price: 7000,
      tags: ["vegan"],
    },
    {
      id: 29,
      photo:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80",
      name: {
        en: "Chicken Caesar",
        ar: "سلطة سيزر بالدجاج",
        ku: "سەلاتەی سیزەری مریشک",
      },
      desc: {
        en: "Romaine, grilled chicken, parmesan & Caesar dressing",
        ar: "خس روماني مع دجاج مشوي وجبن بارميزان",
        ku: "خاسی رۆمانی لەگەڵ مریشک و پەنیر",
      },
      price: 13000,
      tags: [],
    },
    {
      id: 30,
      photo:
        "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&q=80",
      name: {
        en: "Avocado Citrus",
        ar: "سلطة الأفوكادو",
        ku: "سەلاتەی ئاڤۆکادۆ",
      },
      desc: {
        en: "Fresh avocado, grapefruit, cucumber & citrus dressing",
        ar: "أفوكادو طازج مع جريب فروت وخيار وجرجير",
        ku: "ئاڤۆکادۆی تازە لەگەڵ تاێفا و خیار",
      },
      price: 11000,
      tags: ["vegan", "new"],
    },
  ],
  bites: [
    {
      id: 31,
      photo:
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
      name: {
        en: "Butter Croissant",
        ar: "كرواسان بالزبدة",
        ku: "کرواسانی کەرە",
      },
      desc: {
        en: "Freshly baked flaky croissant with French butter",
        ar: "كرواسان طازج بالزبدة الفرنسية",
        ku: "کرواسانی تازەی کەپووتوو",
      },
      price: 5000,
      tags: [],
    },
    {
      id: 32,
      photo:
        "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80",
      name: { en: "Cheesecake Slice", ar: "تشيز كيك", ku: "چیزکێک" },
      desc: {
        en: "Creamy New York-style cheesecake on a biscuit base",
        ar: "تشيز كيك كريمي على قاعدة البسكويت",
        ku: "چیزکێکی نیویۆرکی بە قاعدەی بیسکووت",
      },
      price: 7000,
      tags: [],
    },
    {
      id: 33,
      photo:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80",
      name: {
        en: "Chocolate Brownie",
        ar: "براوني الشوكولاتة",
        ku: "براونی چۆکلاتی",
      },
      desc: {
        en: "Dense dark chocolate brownie with walnuts",
        ar: "براوني شوكولاتة داكنة مع جوز",
        ku: "براونی چۆکلاتی تاریک لەگەڵ گوێزی ئینگلیزی",
      },
      price: 5500,
      tags: [],
    },
    {
      id: 34,
      photo:
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
      name: { en: "Pistachio Cookie", ar: "كوكيز الفستق", ku: "کووکیز پیستە" },
      desc: {
        en: "Crisp-edged chewy pistachio & white chocolate cookie",
        ar: "كوكيز فستق وشوكولاتة بيضاء",
        ku: "کووکیزی نەرم لەگەڵ پیستە",
      },
      price: 3500,
      tags: ["vegan", "new"],
    },
  ],
};

const ALL_ITEMS = Object.values(ITEMS).flat();
const fmt = (n) => n.toLocaleString();

export default function TeaLeaves() {
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("blacktea");
  const [cart, setCart] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [note, setNote] = useState("");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [done, setDone] = useState(false);
  const [orderNum] = useState(() => Math.floor(Math.random() * 9000) + 1000);

  const toastRef = useRef(null);
  const catBarRef = useRef(null); // the horizontal cat strip
  const sectionRefs = useRef({}); // { catId: DOM element }
  const scrollRef = useRef(null); // the main scrollable area
  const ignoreScrollRef = useRef(false); // prevent scroll-spy fighting click

  const t = T[lang];
  const isRTL = lang === "ar" || lang === "ku";

  const totalQty = Object.values(cart).reduce((s, q) => s + q, 0);
  const totalIQD = Object.entries(cart).reduce((s, [id, q]) => {
    const item = ALL_ITEMS.find((i) => i.id === Number(id));
    return s + (item ? item.price * q : 0);
  }, 0);
  const tax = Math.round(totalIQD * 0.1);
  const grand = totalIQD + tax;

  const showToast = (msg) => {
    setToast(msg);
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(""), 2000);
  };
  const add = (item) => {
    setCart((c) => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
    showToast(`${item.name[lang]} ✓`);
  };
  const remove = (item) => {
    setCart((c) => {
      const n = { ...c };
      if ((n[item.id] || 0) <= 1) delete n[item.id];
      else n[item.id]--;
      return n;
    });
  };
  const placeOrder = () => {
    setDrawerOpen(false);
    setTimeout(() => setDone(true), 350);
  };
  const reset = () => {
    setCart({});
    setNote("");
    setDone(false);
  };

  /* ── CLICK CATEGORY → smooth scroll to section ── */
  const handleCatClick = (catId) => {
    setActiveCat(catId);
    const el = sectionRefs.current[catId];
    const container = scrollRef.current;
    if (el && container) {
      ignoreScrollRef.current = true;
      // offset for sticky header (~170px)
      const top = el.offsetTop - 170;
      container.scrollTo({ top, behavior: "smooth" });
      setTimeout(() => {
        ignoreScrollRef.current = false;
      }, 800);
    }
    // also scroll the cat pill into view
    const catEl = catBarRef.current?.querySelector(`[data-cat="${catId}"]`);
    catEl?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  /* ── SCROLL SPY: highlight cat as you scroll ── */
  const handleScroll = useCallback(() => {
    if (ignoreScrollRef.current || query.trim()) return;
    const container = scrollRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop + 200;
    let current = CATS[0].id;
    for (const cat of CATS) {
      const el = sectionRefs.current[cat.id];
      if (el && el.offsetTop <= scrollTop) current = cat.id;
    }
    setActiveCat((prev) => (prev !== current ? current : prev));
  }, [query]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ── DRAG SCROLL for cat bar ── */
  useEffect(() => {
    const el = catBarRef.current;
    if (!el) return;
    let down = false,
      startX = 0,
      sl = 0;
    const onDown = (e) => {
      down = true;
      el.classList.add("drag");
      startX = e.pageX - el.offsetLeft;
      sl = el.scrollLeft;
    };
    const onUp = () => {
      down = false;
      el.classList.remove("drag");
    };
    const onMove = (e) => {
      if (!down) return;
      e.preventDefault();
      el.scrollLeft = sl - (e.pageX - el.offsetLeft - startX);
    };
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseleave", onUp);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseleave", onUp);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("mousemove", onMove);
    };
  }, []);

  const filtered = query.trim()
    ? ALL_ITEMS.filter(
        (i) =>
          i.name[lang].toLowerCase().includes(query.toLowerCase()) ||
          i.desc[lang].toLowerCase().includes(query.toLowerCase()),
      )
    : null;

  const cartItems = ALL_ITEMS.filter((i) => cart[i.id]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#1b3a2d;font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;}

        /* ── APP FRAME ── */
        .phone-frame{
          width:100%;
          max-width:430px;
          min-height:100vh;
          height:100vh;
          background:#1b3a2d;
          color:#fff;
          direction:${isRTL ? "rtl" : "ltr"};
          display:flex;
          flex-direction:column;
          position:relative;
          overflow:hidden;
          margin:0 auto;
        }

        /* ── HEADER (fixed inside frame) ── */
        .hdr{
          background:#1b3a2d;
          padding:14px 16px 0;
          flex-shrink:0;
          border-bottom:1px solid #2d5a42;
          z-index:10;
        }
        .hdr-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
        .hdr-title{font-size:18px;font-weight:700;color:#fff;text-align:center;flex:1;}

        /* language */
        .lang-wrap{position:relative;}
        .lang-btn{
          display:flex;align-items:center;gap:5px;
          background:#1e3d2f;border:1px solid #2d5a42;border-radius:20px;
          padding:6px 10px;cursor:pointer;font-size:13px;font-weight:600;
          color:#52b788;font-family:'Plus Jakarta Sans',sans-serif;transition:border-color .2s;
        }
        .lang-btn:hover{border-color:#52b788;}
        .chev{transition:transform .2s;}
        .chev.open{transform:rotate(180deg);}
        .lang-drop{
          position:absolute;top:calc(100% + 8px);${isRTL ? "right" : "left"}:0;
          background:#1e3d2f;border:1px solid #2d5a42;border-radius:12px;
          overflow:hidden;z-index:300;min-width:145px;
          box-shadow:0 8px 24px rgba(0,0,0,.55);
        }
        .lang-opt{display:flex;align-items:center;gap:10px;padding:11px 14px;font-size:14px;font-weight:500;cursor:pointer;color:#fff;transition:background .15s;}
        .lang-opt:hover{background:#2d6a4f;}
        .lang-opt.sel{color:#52b788;}

        .icon-btn{background:none;border:none;color:#8ab8a0;cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;position:relative;}

        /* search */
        .search-row{display:flex;align-items:center;gap:8px;background:#1e3d2f;border:1px solid #2d5a42;border-radius:20px;padding:9px 14px;margin-bottom:12px;}
        .search-row input{flex:1;background:none;border:none;outline:none;color:#fff;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;}
        .search-row input::placeholder{color:#5a8c6e;}
        .clr-btn{background:none;border:none;color:#5a8c6e;cursor:pointer;font-size:13px;padding:0;}

        /* cats */
        .cats{display:flex;gap:0;padding:14px 16px 0;overflow-x:auto;scrollbar-width:none;cursor:grab;user-select:none;-webkit-overflow-scrolling:touch;}
        .cats::-webkit-scrollbar{display:none;}
        .cats.drag{cursor:grabbing;}
        .cat-item{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:70px;padding:0 4px 12px;cursor:pointer;flex-shrink:0;border-bottom:2.5px solid transparent;transition:border-color .2s;}
        .cat-item.active{border-bottom-color:#52b788;}
        .cat-icon{width:52px;height:52px;background:#1e3d2f;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:23px;border:1px solid #2d5a42;transition:background .2s,border-color .2s;flex-shrink:0;}
        .cat-item.active .cat-icon{background:#2d6a4f;border-color:#52b788;}
        .cat-lbl{font-size:10px;font-weight:500;color:#6ba882;text-align:center;line-height:1.3;transition:color .2s;white-space:nowrap;}
        .cat-item.active .cat-lbl{color:#52b788;}

        /* ── SCROLLABLE BODY ── */
        .scroll-body{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;}
        .scroll-body::-webkit-scrollbar{width:3px;}
        .scroll-body::-webkit-scrollbar-thumb{background:#2d5a42;border-radius:2px;}

        .menu-body{padding:16px 12px 140px;}

        /* section header */
        .sec-head{
          display:flex;align-items:center;gap:10px;
          padding:6px 4px 12px;
          font-size:15px;font-weight:700;color:#fff;
          border-bottom:1px solid #2d5a42;
          margin-bottom:12px;margin-top:8px;
        }
        .sec-head:first-child{margin-top:0;}
        .sec-emoji{font-size:20px;}
        .sec-spacer{flex:1;height:1px;background:transparent;}

        /* grid */
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;}
        .g-card{background:#1e3d2f;border-radius:14px;overflow:hidden;border:1px solid #2d5a42;transition:border-color .2s,transform .15s;position:relative;}
        .g-card:hover{transform:translateY(-2px);}
        .g-card.incart{border-color:#52b788;}
        .g-img{width:100%;height:130px;object-fit:cover;display:block;}
        .g-body{padding:10px 10px 11px;}
        .g-name{font-size:13px;font-weight:700;color:#fff;line-height:1.3;margin-bottom:4px;}
        .g-price{font-size:13px;font-weight:700;color:#fff;margin-bottom:8px;}
        .g-foot{display:flex;justify-content:space-between;align-items:center;gap:4px;}
        .g-tags{display:flex;gap:3px;flex-wrap:wrap;flex:1;}
        .tag{font-size:9px;font-weight:700;padding:2px 5px;border-radius:6px;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;}
        .t-hot  {background:#3d1a0d;color:#f4845f;}
        .t-cold {background:#0d1f2e;color:#74c0fc;}
        .t-vegan{background:#0a2010;color:#69db7c;}
        .t-new  {background:#1e0e2e;color:#cc5de8;}

        /* qty */
        .qty-r{display:flex;align-items:center;gap:4px;}
        .qb{width:26px;height:26px;border-radius:50%;border:1.5px solid #52b788;background:none;color:#52b788;font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;line-height:1;font-family:'Plus Jakarta Sans',sans-serif;}
        .qb:hover,.qb.solid{background:#52b788;color:#1b3a2d;border-color:#52b788;}
        .qnum{font-size:13px;font-weight:800;min-width:14px;text-align:center;}
        .img-badge{position:absolute;top:8px;${isRTL ? "left" : "right"}:8px;background:#40916c;color:#fff;font-size:11px;font-weight:800;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;}

        /* search results */
        .search-results{padding:14px 12px 140px;}
        .sec-lbl{font-size:13px;font-weight:600;color:#6ba882;margin-bottom:12px;padding:0 2px;}

        /* bottom bar */
        .btm-bar{position:absolute;bottom:0;left:0;right:0;padding:10px 12px 24px;background:linear-gradient(to top,#1b3a2d 65%,transparent);pointer-events:none;z-index:20;}
        .vob{width:100%;background:#40916c;color:#fff;border:none;border-radius:14px;padding:14px 18px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:flex;justify-content:space-between;align-items:center;pointer-events:all;box-shadow:0 6px 20px rgba(64,145,108,.45);transition:opacity .2s,transform .15s;}
        .vob:hover{opacity:.93;transform:translateY(-2px);}
        .vob-l{display:flex;align-items:center;gap:10px;}
        .vob-n{background:rgba(255,255,255,.25);width:24px;height:24px;border-radius:50%;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;}

        /* overlay */
        .overlay{position:absolute;inset:0;background:rgba(0,0,0,.6);z-index:30;opacity:0;pointer-events:none;transition:opacity .3s;}
        .overlay.open{opacity:1;pointer-events:all;}

        /* drawer */
        .drawer{position:absolute;bottom:0;left:0;right:0;background:#1e3d2f;border-top-left-radius:22px;border-top-right-radius:22px;z-index:40;max-height:88%;display:flex;flex-direction:column;transition:transform .35s cubic-bezier(.4,0,.2,1);transform:translateY(100%);direction:${isRTL ? "rtl" : "ltr"};}
        .drawer.open{transform:translateY(0);}
        .d-handle{width:34px;height:4px;background:#2d5a42;border-radius:2px;margin:11px auto 0;flex-shrink:0;}
        .d-head{padding:13px 18px;border-bottom:1px solid #2d5a42;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
        .d-title{font-size:18px;font-weight:700;}
        .d-close{width:28px;height:28px;background:#2d6a4f;border:1px solid #2d5a42;border-radius:50%;color:#6ba882;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;}
        .d-close:hover{color:#fff;}
        .d-list{flex:1;overflow-y:auto;padding:12px 18px;}
        .d-list::-webkit-scrollbar{width:3px;}
        .d-list::-webkit-scrollbar-thumb{background:#2d5a42;border-radius:2px;}
        .d-item{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid #2d5a42;gap:10px;}
        .d-item:last-child{border-bottom:none;}
        .d-l{display:flex;align-items:center;gap:10px;flex:1;min-width:0;}
        .d-img{width:42px;height:42px;border-radius:10px;object-fit:cover;flex-shrink:0;}
        .d-name{font-size:13px;font-weight:600;}
        .d-unit{font-size:11px;color:#6ba882;margin-top:1px;}
        .d-r{display:flex;align-items:center;gap:8px;}
        .d-tot{font-size:13px;font-weight:700;color:#52b788;min-width:65px;text-align:${isRTL ? "left" : "right"};}
        .note-sec{padding:0 18px 10px;flex-shrink:0;}
        .note-lbl{font-size:11px;color:#6ba882;margin-bottom:5px;}
        .note-ta{width:100%;background:#243f30;border:1px solid #2d5a42;border-radius:10px;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;padding:9px 12px;outline:none;resize:none;transition:border-color .2s;}
        .note-ta:focus{border-color:#52b788;}
        .note-ta::placeholder{color:#4a7a5a;}
        .d-foot{padding:12px 18px 24px;border-top:1px solid #2d5a42;flex-shrink:0;}
        .s-row{display:flex;justify-content:space-between;font-size:13px;color:#6ba882;margin-bottom:5px;}
        .t-row{display:flex;justify-content:space-between;font-size:16px;font-weight:700;margin:10px 0 14px;padding-top:10px;border-top:1px solid #2d5a42;}
        .t-row span:last-child{color:#52b788;}
        .place-btn{width:100%;background:#40916c;color:#fff;border:none;border-radius:13px;padding:14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;}
        .place-btn:hover{opacity:.9;transform:translateY(-1px);}
        .empty-c{text-align:center;padding:44px 20px;color:#4a7a5a;}
        .empty-c .e-ico{font-size:50px;margin-bottom:14px;}
        .empty-c p{font-size:14px;line-height:1.7;white-space:pre-line;}

        /* toast */
        .toast{position:absolute;bottom:110px;left:50%;transform:translateX(-50%) translateY(8px);background:#1e3d2f;border:1px solid #52b788;color:#52b788;padding:8px 18px;border-radius:30px;font-size:13px;font-weight:600;z-index:50;opacity:0;transition:all .25s;pointer-events:none;white-space:nowrap;}
        .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

        /* success */
        .success{position:absolute;inset:0;background:#1b3a2d;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 32px;transform:translateY(100%);transition:transform .4s cubic-bezier(.4,0,.2,1);direction:${isRTL ? "rtl" : "ltr"};}
        .success.show{transform:translateY(0);}
        .s-icon{font-size:68px;margin-bottom:18px;}
        .s-title{font-size:26px;font-weight:800;color:#52b788;margin-bottom:10px;}
        .s-msg{font-size:14px;color:#6ba882;line-height:1.7;margin-bottom:24px;white-space:pre-line;}
        .s-num{font-size:17px;font-weight:700;color:#fff;padding:12px 24px;border:1px solid #2d5a42;border-radius:12px;background:#1e3d2f;margin-bottom:32px;}
        .s-back{background:#40916c;color:#fff;border:none;padding:13px 28px;border-radius:13px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .2s;}
        .s-back:hover{opacity:.9;}


      `}</style>

      <div className="phone-frame">
        {/* HEADER */}
        <div className="hdr">
          <div className="hdr-top">
            {/* Language */}
            <div className="lang-wrap">
              <button
                className="lang-btn"
                onClick={() => setLangOpen((v) => !v)}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                </svg>
                <span>{LANG_OPTS.find((l) => l.code === lang)?.flag}</span>
                <svg
                  className={`chev${langOpen ? " open" : ""}`}
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {langOpen && (
                <div className="lang-drop">
                  {LANG_OPTS.map((lo) => (
                    <div
                      key={lo.code}
                      className={`lang-opt${lang === lo.code ? " sel" : ""}`}
                      onClick={() => {
                        setLang(lo.code);
                        setLangOpen(false);
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{lo.flag}</span>
                      <span>{lo.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hdr-title">{t.appName}</div>

            {/* Cart */}
            <button className="icon-btn" onClick={() => setDrawerOpen(true)}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalQty > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -5,
                    background: "#e63946",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 800,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {totalQty}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="search-row">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
            />
            {query && (
              <button className="clr-btn" onClick={() => setQuery("")}>
                ✕
              </button>
            )}
          </div>

          {/* Category strip */}
          {!query && (
            <div className="cats" ref={catBarRef}>
              {CATS.map((c) => (
                <div
                  key={c.id}
                  data-cat={c.id}
                  className={`cat-item${activeCat === c.id ? " active" : ""}`}
                  onClick={() => handleCatClick(c.id)}
                >
                  <div className="cat-icon">{c.emoji}</div>
                  <span className="cat-lbl">{c.label[lang]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="scroll-body" ref={scrollRef}>
          {filtered ? (
            /* Search results */
            <div className="search-results">
              <div className="sec-lbl">
                {filtered.length} {t.results} "{query}"
              </div>
              {filtered.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#4a7a5a",
                    padding: "44px 0",
                  }}
                >
                  <div style={{ fontSize: 44, marginBottom: 12 }}>🫖</div>
                  <div style={{ fontSize: 14 }}>{t.noItems}</div>
                </div>
              ) : (
                <div className="grid">
                  {filtered.map((item) => {
                    const qty = cart[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className={`g-card${qty > 0 ? " incart" : ""}`}
                      >
                        <img
                          className="g-img"
                          src={item.photo}
                          alt={item.name[lang]}
                          loading="lazy"
                        />
                        {qty > 0 && <div className="img-badge">{qty}</div>}
                        <div className="g-body">
                          <div className="g-name">{item.name[lang]}</div>
                          <div className="g-price">{fmt(item.price)}</div>
                          <div className="g-foot">
                            <div className="g-tags">
                              {item.tags.includes("hot") && (
                                <span className="tag t-hot">{t.hot}</span>
                              )}
                              {item.tags.includes("cold") && (
                                <span className="tag t-cold">{t.cold}</span>
                              )}
                              {item.tags.includes("vegan") && (
                                <span className="tag t-vegan">{t.vegan}</span>
                              )}
                              {item.tags.includes("new") && (
                                <span className="tag t-new">{t.new}</span>
                              )}
                            </div>
                            <div className="qty-r">
                              {qty === 0 ? (
                                <button
                                  className="qb solid"
                                  onClick={() => add(item)}
                                >
                                  +
                                </button>
                              ) : (
                                <>
                                  <button
                                    className="qb"
                                    onClick={() => remove(item)}
                                  >
                                    −
                                  </button>
                                  <span className="qnum">{qty}</span>
                                  <button
                                    className="qb"
                                    onClick={() => add(item)}
                                  >
                                    +
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Full menu — all sections */
            <div className="menu-body">
              {CATS.map((cat) => (
                <div
                  key={cat.id}
                  ref={(el) => (sectionRefs.current[cat.id] = el)}
                >
                  <div className="sec-head">
                    <span className="sec-emoji">{cat.emoji}</span>
                    <span>{cat.label[lang]}</span>
                  </div>
                  <div className="grid">
                    {(ITEMS[cat.id] || []).map((item) => {
                      const qty = cart[item.id] || 0;
                      return (
                        <div
                          key={item.id}
                          className={`g-card${qty > 0 ? " incart" : ""}`}
                        >
                          <img
                            className="g-img"
                            src={item.photo}
                            alt={item.name[lang]}
                            loading="lazy"
                          />
                          {qty > 0 && <div className="img-badge">{qty}</div>}
                          <div className="g-body">
                            <div className="g-name">{item.name[lang]}</div>
                            <div className="g-price">{fmt(item.price)}</div>
                            <div className="g-foot">
                              <div className="g-tags">
                                {item.tags.includes("hot") && (
                                  <span className="tag t-hot">{t.hot}</span>
                                )}
                                {item.tags.includes("cold") && (
                                  <span className="tag t-cold">{t.cold}</span>
                                )}
                                {item.tags.includes("vegan") && (
                                  <span className="tag t-vegan">{t.vegan}</span>
                                )}
                                {item.tags.includes("new") && (
                                  <span className="tag t-new">{t.new}</span>
                                )}
                              </div>
                              <div className="qty-r">
                                {qty === 0 ? (
                                  <button
                                    className="qb solid"
                                    onClick={() => add(item)}
                                  >
                                    +
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      className="qb"
                                      onClick={() => remove(item)}
                                    >
                                      −
                                    </button>
                                    <span className="qnum">{qty}</span>
                                    <button
                                      className="qb"
                                      onClick={() => add(item)}
                                    >
                                      +
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM BAR */}
        {totalQty > 0 && !drawerOpen && (
          <div className="btm-bar">
            <button className="vob" onClick={() => setDrawerOpen(true)}>
              <div className="vob-l">
                <span className="vob-n">{totalQty}</span>
                <span>{t.viewOrder}</span>
              </div>
              <span>{fmt(totalIQD)} IQD</span>
            </button>
          </div>
        )}

        {/* OVERLAY */}
        <div
          className={`overlay${drawerOpen ? " open" : ""}`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* CART DRAWER */}
        <div className={`drawer${drawerOpen ? " open" : ""}`}>
          <div className="d-handle" />
          <div className="d-head">
            <div className="d-title">🍵 {t.yourOrder}</div>
            <button className="d-close" onClick={() => setDrawerOpen(false)}>
              ✕
            </button>
          </div>
          <div className="d-list">
            {cartItems.length === 0 ? (
              <div className="empty-c">
                <div className="e-ico">🫖</div>
                <p>{t.empty}</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="d-item">
                  <div className="d-l">
                    <img
                      className="d-img"
                      src={item.photo}
                      alt={item.name[lang]}
                    />
                    <div>
                      <div className="d-name">{item.name[lang]}</div>
                      <div className="d-unit">
                        {fmt(item.price)} IQD {t.each}
                      </div>
                    </div>
                  </div>
                  <div className="d-r">
                    <div className="qty-r">
                      <button
                        className="qb"
                        style={{ width: 23, height: 23, fontSize: 14 }}
                        onClick={() => remove(item)}
                      >
                        −
                      </button>
                      <span className="qnum">{cart[item.id]}</span>
                      <button
                        className="qb"
                        style={{ width: 23, height: 23, fontSize: 14 }}
                        onClick={() => add(item)}
                      >
                        +
                      </button>
                    </div>
                    <div className="d-tot">
                      {fmt(item.price * cart[item.id])}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {cartItems.length > 0 && (
            <>
              <div className="note-sec">
                <div className="note-lbl">📝 {t.specialNote}</div>
                <textarea
                  className="note-ta"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t.notePlaceholder}
                />
              </div>
              <div className="d-foot">
                <div className="s-row">
                  <span>{t.subtotal}</span>
                  <span>{fmt(totalIQD)} IQD</span>
                </div>
                <div className="s-row">
                  <span>{t.service}</span>
                  <span>{fmt(tax)} IQD</span>
                </div>
                <div className="t-row">
                  <span>{t.total}</span>
                  <span>{fmt(grand)} IQD</span>
                </div>
                <button className="place-btn" onClick={placeOrder}>
                  {t.placeOrder} · {fmt(grand)} IQD
                </button>
              </div>
            </>
          )}
        </div>

        {/* TOAST */}
        <div className={`toast${toast ? " show" : ""}`}>{toast}</div>

        {/* SUCCESS */}
        <div className={`success${done ? " show" : ""}`}>
          <div className="s-icon">☕</div>
          <div className="s-title">{t.orderPlaced}</div>
          <div className="s-msg">{t.orderMsg}</div>
          <div className="s-num">Order #TL-{orderNum}</div>
          <button className="s-back" onClick={reset}>
            {t.orderMore}
          </button>
        </div>
      </div>
      {/* /phone-frame */}
    </>
  );
}
