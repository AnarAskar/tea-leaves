import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export function useMenuData() {
  const [categories, setCategories] = useState([]);
  const [itemsByCategory, setItemsByCategory] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [catRes, itemRes] = await Promise.all([
          supabase.from("categories").select("*").order("sort_order"),
          supabase.from("menu_items").select("*").eq("is_available", true),
        ]);

        if (catRes.error) throw catRes.error;
        if (itemRes.error) throw itemRes.error;

        const cats = catRes.data || [];
        const rawItems = itemRes.data || [];

        // Transform items to match UI structure
        const transformedItems = rawItems.map((item) => ({
          id: item.id,
          photo: item.photo_url, // rename for UI
          name: {
            en: item.name_en,
            ar: item.name_ar,
            ku: item.name_ku,
          },
          ingredients: {
            en: item.ing_en || "",
            ar: item.ing_ar || "",
            ku: item.ing_ku || "",
          },
          price: item.price,
          tags: item.tags || [],
        }));

        // Group by category
        const grouped = {};
        transformedItems.forEach((item) => {
          const catId = rawItems.find((ri) => ri.id === item.id).category_id;
          if (!grouped[catId]) grouped[catId] = [];
          grouped[catId].push(item);
        });

        setCategories(cats);
        setItemsByCategory(grouped);
        setAllItems(transformedItems);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { categories, itemsByCategory, allItems, loading, error };
}
