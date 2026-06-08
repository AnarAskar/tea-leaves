const MYNU_BASE = "https://voyager.mynu.app/api/v1/menu";

export const DEFAULT_MYNU_RESTAURANT_ID = "67c05717d8908969203b54ba";
export const DEFAULT_MYNU_MENU_TYPE = "dining";

export function decodeMynu(value) {
  if (!value) return "";
  try {
    return decodeURIComponent(String(value).replace(/\+/g, " "));
  } catch {
    return String(value);
  }
}

export function slugifyCategory(name, used) {
  let base = decodeMynu(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 40);
  if (!base) base = "category";
  let slug = base;
  let n = 2;
  while (used.has(slug)) {
    slug = `${base}${n}`;
    n += 1;
  }
  used.add(slug);
  return slug;
}

function decodeCategory(category) {
  return {
    ...category,
    name: decodeMynu(category.name),
    items: (category.items || []).map((item) => ({
      ...item,
      name: decodeMynu(item.name),
      dName: decodeMynu(item.dName),
      description: decodeMynu(item.description),
    })),
  };
}

export async function fetchMynuLanguage(
  restaurantId,
  language,
  menuType = DEFAULT_MYNU_MENU_TYPE,
) {
  const url = `${MYNU_BASE}/${restaurantId}?language=${language}&menuType=${menuType}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`MYNU HTTP ${res.status} for language=${language}`);
  }
  const data = await res.json();
  if (data.status !== 200) {
    throw new Error(data.message || `MYNU error for language=${language}`);
  }
  return (data.result.categories || []).map(decodeCategory);
}

export async function fetchMergedMynuMenu(
  restaurantId = DEFAULT_MYNU_RESTAURANT_ID,
  menuType = DEFAULT_MYNU_MENU_TYPE,
) {
  const [enCats, arCats, kuCats] = await Promise.all([
    fetchMynuLanguage(restaurantId, "en", menuType),
    fetchMynuLanguage(restaurantId, "ar", menuType),
    fetchMynuLanguage(restaurantId, "ku", menuType),
  ]);

  const arById = new Map(arCats.map((c) => [c._id, c]));
  const kuById = new Map(kuCats.map((c) => [c._id, c]));
  const usedSlugs = new Set();

  return enCats.map((enCat, index) => {
    const arCat = arById.get(enCat._id);
    const kuCat = kuById.get(enCat._id);
    const arItems = new Map((arCat?.items || []).map((i) => [i._id, i]));
    const kuItems = new Map((kuCat?.items || []).map((i) => [i._id, i]));

    const id = slugifyCategory(enCat.name, usedSlugs);

    return {
      id,
      image_url: enCat.image_sm || enCat.image_big || null,
      label_en: enCat.name,
      label_ar: arCat?.name || "",
      label_ku: kuCat?.name || "",
      sort_order: enCat.position ?? index,
      items: (enCat.items || []).map((enItem) => {
        const arItem = arItems.get(enItem._id);
        const kuItem = kuItems.get(enItem._id);
        const photo =
          enItem.images?.[0]?.url || enItem.images?.[0]?.thumbnail || null;
        const tags = [];
        if (enItem.isNew) tags.push("new");

        return {
          category_id: id,
          name_en: enItem.name || enItem.dName,
          name_ar: arItem?.name || arItem?.dName || "",
          name_ku: kuItem?.name || kuItem?.dName || "",
          ing_en: enItem.description || null,
          ing_ar: arItem?.description || null,
          ing_ku: kuItem?.description || null,
          price: enItem.price ?? enItem.minPrice ?? 0,
          photo_url: photo || "",
          tags,
          is_available: enItem.isActive !== false,
        };
      }),
    };
  });
}

export async function importMynuToSupabase(supabase, options = {}) {
  const {
    restaurantId = DEFAULT_MYNU_RESTAURANT_ID,
    menuType = DEFAULT_MYNU_MENU_TYPE,
    replace = false,
  } = options;

  const categories = await fetchMergedMynuMenu(restaurantId, menuType);

  if (replace) {
    const { error: itemsError } = await supabase
      .from("menu_items")
      .delete()
      .gte("id", 0);
    if (itemsError) throw itemsError;

    const { error: catsError } = await supabase
      .from("categories")
      .delete()
      .neq("id", "");
    if (catsError) throw catsError;
  }

  const categoryRows = categories.map(
    ({ id, image_url, label_en, label_ar, label_ku, sort_order }) => ({
      id,
      image_url,
      emoji: "📦",
      label_en,
      label_ar,
      label_ku,
      sort_order,
    }),
  );

  const { error: catUpsertError } = await supabase
    .from("categories")
    .upsert(categoryRows, { onConflict: "id" });
  if (catUpsertError) throw catUpsertError;

  const itemRows = categories.flatMap((c) => c.items);
  let insertedItems = 0;

  if (itemRows.length > 0) {
    if (replace) {
      const { error: insertError } = await supabase
        .from("menu_items")
        .insert(itemRows);
      if (insertError) throw insertError;
      insertedItems = itemRows.length;
    } else {
      for (const item of itemRows) {
        const { data: existing } = await supabase
          .from("menu_items")
          .select("id")
          .eq("category_id", item.category_id)
          .eq("name_en", item.name_en)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("menu_items")
            .update(item)
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("menu_items").insert([item]);
          if (error) throw error;
          insertedItems += 1;
        }
      }
    }
  }

  return {
    categories: categoryRows.length,
    items: itemRows.length,
    insertedItems,
    replace,
  };
}
