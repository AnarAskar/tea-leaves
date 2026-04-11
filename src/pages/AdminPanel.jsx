import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export default function AdminPanel() {
  const { session, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("items");

  // Item form state
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    category_id: "",
    name_en: "",
    name_ar: "",
    name_ku: "",
    ing_en: "",
    ing_ar: "",
    ing_ku: "",
    price: "",
    photo_url: "",
    tags: "",
    is_available: true,
  });

  // Category form state
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    emoji: "",
    label_en: "",
    label_ar: "",
    label_ku: "",
    sort_order: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, itemRes] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase
          .from("menu_items")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);
      if (catRes.error) throw catRes.error;
      if (itemRes.error) throw itemRes.error;
      setCategories(catRes.data || []);
      setItems(itemRes.data || []);
      if (catRes.data?.length > 0 && !itemForm.category_id && !editingItem) {
        setItemForm((prev) => ({ ...prev, category_id: catRes.data[0].id }));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [itemForm.category_id, editingItem]);

  useEffect(() => {
    if (session) fetchData();
  }, [session, fetchData]);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  // ------------------- ITEM HANDLERS -------------------
  const resetItemForm = () => {
    setItemForm({
      category_id: categories[0]?.id || "",
      name_en: "",
      name_ar: "",
      name_ku: "",
      ing_en: "",
      ing_ar: "",
      ing_ku: "",
      price: "",
      photo_url: "",
      tags: "",
      is_available: true,
    });
    setEditingItem(null);
    setError(null);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      category_id: item.category_id,
      name_en: item.name_en,
      name_ar: item.name_ar,
      name_ku: item.name_ku,
      ing_en: item.ing_en || "",
      ing_ar: item.ing_ar || "",
      ing_ku: item.ing_ku || "",
      price: item.price.toString(),
      photo_url: item.photo_url || "",
      tags: (item.tags || []).join(", "),
      is_available: item.is_available,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitItem = async (e) => {
    e.preventDefault();
    setError(null);
    if (!itemForm.name_en.trim() || !itemForm.price || !itemForm.category_id) {
      setError("English name, price, and category are required.");
      return;
    }
    const itemData = {
      category_id: itemForm.category_id,
      name_en: itemForm.name_en.trim(),
      name_ar: itemForm.name_ar.trim(),
      name_ku: itemForm.name_ku.trim(),
      ing_en: itemForm.ing_en.trim() || null,
      ing_ar: itemForm.ing_ar.trim() || null,
      ing_ku: itemForm.ing_ku.trim() || null,
      price: parseInt(itemForm.price, 10),
      photo_url: itemForm.photo_url.trim() || null,
      tags: itemForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      is_available: itemForm.is_available,
    };
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("menu_items")
          .update(itemData)
          .eq("id", editingItem.id);
        if (error) throw error;
        alert("Item updated!");
      } else {
        const { error } = await supabase.from("menu_items").insert([itemData]);
        if (error) throw error;
        alert("Item added!");
      }
      resetItemForm();
      fetchData();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) setError(error.message);
    else fetchData();
  };

  // ------------------- CATEGORY HANDLERS -------------------
  const resetCategoryForm = () => {
    setCategoryForm({
      id: "",
      emoji: "",
      label_en: "",
      label_ar: "",
      label_ku: "",
      sort_order: categories.length,
    });
    setEditingCategory(null);
    setError(null);
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      id: cat.id,
      emoji: cat.emoji,
      label_en: cat.label_en,
      label_ar: cat.label_ar,
      label_ku: cat.label_ku,
      sort_order: cat.sort_order,
    });
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setError(null);
    if (!categoryForm.id.trim() || !categoryForm.label_en.trim()) {
      setError("ID and English label are required.");
      return;
    }
    const catData = {
      id: categoryForm.id.trim().toLowerCase().replace(/\s+/g, ""),
      emoji: categoryForm.emoji || "📦",
      label_en: categoryForm.label_en.trim(),
      label_ar: categoryForm.label_ar.trim(),
      label_ku: categoryForm.label_ku.trim(),
      sort_order: parseInt(categoryForm.sort_order, 10) || 0,
    };
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(catData)
          .eq("id", editingCategory.id);
        if (error) throw error;
        alert("Category updated!");
      } else {
        const { error } = await supabase.from("categories").insert([catData]);
        if (error) throw error;
        alert("Category added!");
      }
      resetCategoryForm();
      fetchData();
    } catch (err) {
      console.error("Category error:", err);
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id, label) => {
    if (
      !window.confirm(
        `Delete category "${label}"? This will also delete all its items.`,
      )
    )
      return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) setError(error.message);
    else fetchData();
  };

  // Loading state while checking auth
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#1b3a2d",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // If not logged in, should not happen due to ProtectedRoute, but handle anyway
  if (!session) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#1b3a2d",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#1e3d2f",
            padding: 30,
            borderRadius: 12,
            maxWidth: 400,
          }}
        >
          <h2>Not logged in</h2>
          <button onClick={() => navigate("/admin/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 20,
        color: "white",
        background: "#1b3a2d",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0 }}>🔧 Menu Admin Panel</h2>
        <button
          onClick={handleLogout}
          style={{
            background: "#2d5a42",
            border: "1px solid #40916c",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#e63946",
            padding: "12px 16px",
            marginBottom: 20,
            borderRadius: 6,
          }}
        >
          Error: {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab("items")}
          style={{
            padding: "10px 20px",
            background: activeTab === "items" ? "#40916c" : "#1e3d2f",
            border: "none",
            borderRadius: "8px 8px 0 0",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Menu Items
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          style={{
            padding: "10px 20px",
            background: activeTab === "categories" ? "#40916c" : "#1e3d2f",
            border: "none",
            borderRadius: "8px 8px 0 0",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Categories
        </button>
      </div>

      {activeTab === "items" && (
        <>
          <form
            onSubmit={handleSubmitItem}
            style={{
              background: "#1e3d2f",
              padding: 20,
              marginBottom: 30,
              borderRadius: 12,
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {editingItem ? "✏️ Edit Item" : "➕ Add New Item"}
            </h3>
            <div style={{ display: "grid", gap: 12 }}>
              <select
                value={itemForm.category_id}
                onChange={(e) =>
                  setItemForm({ ...itemForm, category_id: e.target.value })
                }
                required
                style={inputStyle}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.label_en} / {c.label_ar}
                  </option>
                ))}
              </select>
              <input
                placeholder="Name (English) *"
                value={itemForm.name_en}
                onChange={(e) =>
                  setItemForm({ ...itemForm, name_en: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                placeholder="Name (Arabic)"
                value={itemForm.name_ar}
                onChange={(e) =>
                  setItemForm({ ...itemForm, name_ar: e.target.value })
                }
                style={inputStyle}
              />
              <input
                placeholder="Name (Kurdish)"
                value={itemForm.name_ku}
                onChange={(e) =>
                  setItemForm({ ...itemForm, name_ku: e.target.value })
                }
                style={inputStyle}
              />
              <textarea
                placeholder="Ingredients (English)"
                value={itemForm.ing_en}
                onChange={(e) =>
                  setItemForm({ ...itemForm, ing_en: e.target.value })
                }
                rows={2}
                style={inputStyle}
              />
              <textarea
                placeholder="Ingredients (Arabic)"
                value={itemForm.ing_ar}
                onChange={(e) =>
                  setItemForm({ ...itemForm, ing_ar: e.target.value })
                }
                rows={2}
                style={inputStyle}
              />
              <textarea
                placeholder="Ingredients (Kurdish)"
                value={itemForm.ing_ku}
                onChange={(e) =>
                  setItemForm({ ...itemForm, ing_ku: e.target.value })
                }
                rows={2}
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 12 }}>
                <input
                  type="number"
                  placeholder="Price (IQD) *"
                  value={itemForm.price}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, price: e.target.value })
                  }
                  required
                  min="0"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  placeholder="Photo URL"
                  value={itemForm.photo_url}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, photo_url: e.target.value })
                  }
                  style={{ ...inputStyle, flex: 2 }}
                />
              </div>
              <input
                placeholder="Tags (comma separated: hot, cold, vegan, new)"
                value={itemForm.tags}
                onChange={(e) =>
                  setItemForm({ ...itemForm, tags: e.target.value })
                }
                style={inputStyle}
              />
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#fff",
                }}
              >
                <input
                  type="checkbox"
                  checked={itemForm.is_available}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, is_available: e.target.checked })
                  }
                />
                Available (visible to customers)
              </label>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={primaryButtonStyle}
                >
                  {editingItem ? "Update Item" : "Save Item"}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    onClick={resetItemForm}
                    style={secondaryButtonStyle}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          <h3>Current Items ({items.length})</h3>
          {loading && <p>Loading...</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#1e3d2f",
                  padding: "12px 16px",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {item.photo_url && (
                    <img
                      src={item.photo_url}
                      alt={item.name_en}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 6,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div>
                    <strong>{item.name_en}</strong>{" "}
                    <span style={{ color: "#52b788" }}>{item.price} IQD</span>
                    <div style={{ fontSize: 12, color: "#8ab8a0" }}>
                      {categories.find((c) => c.id === item.category_id)
                        ?.label_en || item.category_id}
                      {!item.is_available && (
                        <span style={{ color: "#e63946", marginLeft: 8 }}>
                          (Hidden)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleEditItem(item)}
                    style={{
                      background: "#2d6a4f",
                      border: "none",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id, item.name_en)}
                    style={{
                      background: "#aa2222",
                      border: "none",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "categories" && (
        <>
          <form
            onSubmit={handleSubmitCategory}
            style={{
              background: "#1e3d2f",
              padding: 20,
              marginBottom: 30,
              borderRadius: 12,
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {editingCategory ? "✏️ Edit Category" : "➕ Add New Category"}
            </h3>
            <div style={{ display: "grid", gap: 12 }}>
              <input
                placeholder="ID (e.g., blacktea) *"
                value={categoryForm.id}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, id: e.target.value })
                }
                required
                disabled={!!editingCategory}
                style={inputStyle}
              />
              <input
                placeholder="Emoji (e.g., 🍵)"
                value={categoryForm.emoji}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, emoji: e.target.value })
                }
                style={inputStyle}
              />
              <input
                placeholder="Label (English) *"
                value={categoryForm.label_en}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, label_en: e.target.value })
                }
                required
                style={inputStyle}
              />
              <input
                placeholder="Label (Arabic)"
                value={categoryForm.label_ar}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, label_ar: e.target.value })
                }
                style={inputStyle}
              />
              <input
                placeholder="Label (Kurdish)"
                value={categoryForm.label_ku}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, label_ku: e.target.value })
                }
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Sort Order"
                value={categoryForm.sort_order}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    sort_order: e.target.value,
                  })
                }
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={primaryButtonStyle}
                >
                  {editingCategory ? "Update Category" : "Save Category"}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={resetCategoryForm}
                    style={secondaryButtonStyle}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          <h3>Categories ({categories.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  background: "#1e3d2f",
                  padding: "12px 16px",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span style={{ fontSize: 24, marginRight: 12 }}>
                    {cat.emoji}
                  </span>
                  <strong>{cat.label_en}</strong>{" "}
                  <span style={{ color: "#8ab8a0" }}>
                    / {cat.label_ar} / {cat.label_ku}
                  </span>
                  <span
                    style={{ marginLeft: 12, fontSize: 12, color: "#6ba882" }}
                  >
                    Order: {cat.sort_order}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleEditCategory(cat)}
                    style={{
                      background: "#2d6a4f",
                      border: "none",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.label_en)}
                    style={{
                      background: "#aa2222",
                      border: "none",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #2d5a42",
  background: "#243f30",
  color: "#fff",
  fontSize: 14,
  width: "100%",
  outline: "none",
};

const primaryButtonStyle = {
  padding: "10px 20px",
  background: "#40916c",
  border: "none",
  borderRadius: 6,
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  flex: 1,
};

const secondaryButtonStyle = {
  padding: "10px 20px",
  background: "#2d5a42",
  border: "1px solid #40916c",
  borderRadius: 6,
  color: "#fff",
  cursor: "pointer",
  flex: 1,
};
