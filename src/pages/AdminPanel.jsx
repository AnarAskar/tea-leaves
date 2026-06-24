import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { uploadCategoryImage } from "../utils/uploadCategoryImage";
import { uploadMenuImage } from "../utils/uploadMenuImage";
import { formatSupabaseError } from "../utils/formatSupabaseError";
import "../styles/admin.css";

function AdminLoading() {
  return (
    <div className="admin-loading">
      <div className="admin-spinner" />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      {label && <label className="admin-label">{label}</label>}
      {children}
    </div>
  );
}

export default function AdminPanel() {
  const { session, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("items");

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
    addons: [],
  });
  const [addonDraft, setAddonDraft] = useState({ name_en: "", name_ar: "", name_ku: "", price: "" });

  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    image_url: "",
    label_en: "",
    label_ar: "",
    label_ku: "",
    sort_order: 0,
    available_from: "",
    available_until: "",
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [itemImageUploading, setItemImageUploading] = useState(false);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setError(null);
  };

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 3500);
    return () => clearTimeout(t);
  }, [success]);

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
      setError("Failed to load menu data.");
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
      addons: [],
    });
    setAddonDraft({ name_en: "", name_ar: "", name_ku: "", price: "" });
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
      addons: item.addons || [],
    });
    setAddonDraft({ name_en: "", name_ar: "", name_ku: "", price: "" });
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
      photo_url: itemForm.photo_url.trim() || "",
      tags: itemForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      is_available: itemForm.is_available,
      addons: itemForm.addons,
    };
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("menu_items")
          .update(itemData)
          .eq("id", editingItem.id);
        if (error) throw error;
        showSuccess(`"${itemData.name_en}" updated successfully.`);
      } else {
        const { error } = await supabase.from("menu_items").insert([itemData]);
        if (error) throw error;
        showSuccess(`"${itemData.name_en}" added to the menu.`);
      }
      resetItemForm();
      fetchData();
    } catch (err) {
      console.error("Submit error:", err);
      setError(formatSupabaseError(err));
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) setError(formatSupabaseError(error));
    else {
      showSuccess(`"${name}" removed from the menu.`);
      fetchData();
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      id: "",
      image_url: "",
      label_en: "",
      label_ar: "",
      label_ku: "",
      sort_order: categories.length,
      available_from: "",
      available_until: "",
    });
    setEditingCategory(null);
    setError(null);
  };

  const getCategoryId = () =>
    (editingCategory?.id || categoryForm.id)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

  const handleCategoryImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const categoryId = getCategoryId();
    if (!categoryId) {
      setError("Enter a category ID before uploading an image.");
      e.target.value = "";
      return;
    }

    setImageUploading(true);
    setError(null);
    try {
      const url = await uploadCategoryImage(file, categoryId);
      setCategoryForm((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  const getItemPhotoFolder = () => {
    const categoryId = itemForm.category_id?.trim();
    if (!categoryId) return null;
    const itemKey = editingItem?.id ?? "new";
    return `items/${categoryId}/${itemKey}`;
  };

  const handleItemImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const folder = getItemPhotoFolder();
    if (!folder) {
      setError("Select a category before uploading a photo.");
      e.target.value = "";
      return;
    }

    setItemImageUploading(true);
    setError(null);
    try {
      const url = await uploadMenuImage(file, folder);
      setItemForm((prev) => ({ ...prev, photo_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setItemImageUploading(false);
      e.target.value = "";
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      id: cat.id,
      image_url: cat.image_url || "",
      label_en: cat.label_en,
      label_ar: cat.label_ar,
      label_ku: cat.label_ku,
      sort_order: cat.sort_order,
      available_from: cat.available_from || "",
      available_until: cat.available_until || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      image_url: categoryForm.image_url.trim() || null,
      emoji: "📦",
      label_en: categoryForm.label_en.trim(),
      label_ar: categoryForm.label_ar.trim(),
      label_ku: categoryForm.label_ku.trim(),
      sort_order: parseInt(categoryForm.sort_order, 10) || 0,
      available_from: categoryForm.available_from || null,
      available_until: categoryForm.available_until || null,
    };
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(catData)
          .eq("id", editingCategory.id);
        if (error) throw error;
        showSuccess(`Category "${catData.label_en}" updated.`);
      } else {
        const { error } = await supabase.from("categories").insert([catData]);
        if (error) throw error;
        showSuccess(`Category "${catData.label_en}" created.`);
      }
      resetCategoryForm();
      fetchData();
    } catch (err) {
      console.error("Category error:", err);
      setError(formatSupabaseError(err));
    }
  };

  const handleDeleteCategory = async (id, label) => {
    if (
      !window.confirm(
        `Delete category "${label}"? All items in this category will also be removed.`,
      )
    )
      return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) setError(formatSupabaseError(error));
    else {
      showSuccess(`Category "${label}" deleted.`);
      fetchData();
    }
  };

  if (authLoading) return <AdminLoading />;

  if (!session) {
    return (
      <div className="admin-login-shell">
        <div className="admin-login-card">
          <h1>Session expired</h1>
          <p style={{ color: "#6ba882", marginBottom: 20 }}>
            Please sign in again to continue.
          </p>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            style={{ width: "100%" }}
            onClick={() => navigate("/admin/login")}
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  const availableCount = items.filter((i) => i.is_available).length;

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <div className="admin-brand-icon">🍵</div>
            <div className="admin-brand-text">
              <h1>Tea Leaves</h1>
              <p>Menu management</p>
            </div>
          </div>
          <div className="admin-header-actions">
            <span className="admin-user-email">{session.user.email}</span>
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-label">Menu items</div>
            <div className="admin-stat-value">{items.length}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Live on menu</div>
            <div className="admin-stat-value">{availableCount}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Categories</div>
            <div className="admin-stat-value">{categories.length}</div>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab${activeTab === "items" ? " active" : ""}`}
            onClick={() => setActiveTab("items")}
          >
            Menu items
          </button>
          <button
            type="button"
            className={`admin-tab${activeTab === "categories" ? " active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </button>
        </div>

        {error && (
          <div className="admin-alert admin-alert-error" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="admin-alert admin-alert-success" role="status">
            {success}
          </div>
        )}

        {activeTab === "items" && (
          <>
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2>{editingItem ? "Edit menu item" : "Add menu item"}</h2>
                  <p>
                    {editingItem
                      ? "Update details below and save changes."
                      : "Fill in the details for a new item."}
                  </p>
                </div>
                {editingItem && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={resetItemForm}
                  >
                    Cancel edit
                  </button>
                )}
              </div>
              <div className="admin-card-body">
                <form className="admin-form-grid" onSubmit={handleSubmitItem}>
                  <div className="admin-form-section">
                    <div className="admin-form-section-title">Basic info</div>
                    <Field label="Category">
                      <select
                        className="admin-select"
                        value={itemForm.category_id}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, category_id: e.target.value })
                        }
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label_en}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <div className="admin-field-row admin-field-row-3">
                      <Field label="Name (English) *">
                        <input
                          className="admin-input"
                          value={itemForm.name_en}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, name_en: e.target.value })
                          }
                          required
                        />
                      </Field>
                      <Field label="Name (Arabic)">
                        <input
                          className="admin-input"
                          dir="rtl"
                          value={itemForm.name_ar}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, name_ar: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Name (Kurdish)">
                        <input
                          className="admin-input"
                          dir="rtl"
                          value={itemForm.name_ku}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, name_ku: e.target.value })
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="admin-form-section">
                    <div className="admin-form-section-title">Ingredients</div>
                    <div className="admin-field-row admin-field-row-3">
                      <Field label="English">
                        <textarea
                          className="admin-textarea"
                          value={itemForm.ing_en}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, ing_en: e.target.value })
                          }
                          rows={2}
                        />
                      </Field>
                      <Field label="Arabic">
                        <textarea
                          className="admin-textarea"
                          dir="rtl"
                          value={itemForm.ing_ar}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, ing_ar: e.target.value })
                          }
                          rows={2}
                        />
                      </Field>
                      <Field label="Kurdish">
                        <textarea
                          className="admin-textarea"
                          dir="rtl"
                          value={itemForm.ing_ku}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, ing_ku: e.target.value })
                          }
                          rows={2}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="admin-form-section">
                    <div className="admin-form-section-title">Pricing & media</div>
                    <div className="admin-field-row admin-field-row-price">
                      <Field label="Price (IQD) *">
                        <input
                          className="admin-input"
                          type="text"
                          inputMode="numeric"
                          value={itemForm.price}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, price: e.target.value.replace(/\D/g, "") })
                          }
                          required
                        />
                      </Field>
                      <Field label="Photo URL">
                        <input
                          className="admin-input"
                          type="url"
                          placeholder="https://... or upload below"
                          value={itemForm.photo_url}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, photo_url: e.target.value })
                          }
                        />
                      </Field>
                      <div className="admin-upload-zone">
                        <label className="admin-upload-btn">
                          {itemImageUploading ? "Uploading…" : "Upload photo"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleItemImageSelect}
                            disabled={itemImageUploading}
                          />
                        </label>
                        {itemForm.photo_url && (
                          <img
                            className="admin-preview-img"
                            src={itemForm.photo_url}
                            alt="Preview"
                          />
                        )}
                      </div>
                    </div>
                    <Field label="Tags">
                      <input
                        className="admin-input"
                        placeholder="hot, cold, vegan, new"
                        value={itemForm.tags}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, tags: e.target.value })
                        }
                      />
                    </Field>
                    <div className="admin-addons-section">
                      <div className="admin-form-section-title" style={{ marginBottom: 8 }}>Add-ons (single choice)</div>
                      {itemForm.addons.length > 0 && (
                        <div className="admin-addons-list">
                          {itemForm.addons.map((addon, idx) => (
                            <div key={idx} className="admin-addon-row">
                              <span className="admin-addon-label">{addon.name_en}</span>
                              {addon.price > 0 && <span className="admin-addon-price">+{Number(addon.price).toLocaleString()} IQD</span>}
                              <button
                                type="button"
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                onClick={() =>
                                  setItemForm((f) => ({ ...f, addons: f.addons.filter((_, i) => i !== idx) }))
                                }
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="admin-addon-draft">
                        <div className="admin-field-row admin-field-row-2">
                          <Field label="Name (EN)">
                            <input
                              className="admin-input"
                              placeholder="e.g. Large"
                              value={addonDraft.name_en}
                              onChange={(e) => setAddonDraft((d) => ({ ...d, name_en: e.target.value }))}
                            />
                          </Field>
                          <Field label="Price (IQD)">
                            <input
                              className="admin-input"
                              type="text"
                              inputMode="numeric"
                              placeholder="0"
                              value={addonDraft.price}
                              onChange={(e) => setAddonDraft((d) => ({ ...d, price: e.target.value.replace(/\D/g, "") }))}
                            />
                          </Field>
                        </div>
                        <div className="admin-field-row admin-field-row-2">
                          <Field label="Name (AR)">
                            <input
                              className="admin-input"
                              placeholder="اسم"
                              value={addonDraft.name_ar}
                              onChange={(e) => setAddonDraft((d) => ({ ...d, name_ar: e.target.value }))}
                            />
                          </Field>
                          <Field label="Name (KU)">
                            <input
                              className="admin-input"
                              placeholder="ناو"
                              value={addonDraft.name_ku}
                              onChange={(e) => setAddonDraft((d) => ({ ...d, name_ku: e.target.value }))}
                            />
                          </Field>
                        </div>
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          onClick={() => {
                            if (!addonDraft.name_en.trim()) return;
                            const newAddon = {
                              id: addonDraft.name_en.trim().toLowerCase().replace(/\s+/g, "-"),
                              name_en: addonDraft.name_en.trim(),
                              name_ar: addonDraft.name_ar.trim(),
                              name_ku: addonDraft.name_ku.trim(),
                              price: parseInt(addonDraft.price, 10) || 0,
                            };
                            setItemForm((f) => ({ ...f, addons: [...f.addons, newAddon] }));
                            setAddonDraft({ name_en: "", name_ar: "", name_ku: "", price: "" });
                          }}
                        >
                          + Add option
                        </button>
                      </div>
                    </div>
                    <label className="admin-checkbox-row">
                      <input
                        type="checkbox"
                        checked={itemForm.is_available}
                        onChange={(e) =>
                          setItemForm({
                            ...itemForm,
                            is_available: e.target.checked,
                          })
                        }
                      />
                      Visible to customers
                    </label>
                  </div>

                  <div className="admin-form-actions">
                    <button
                      type="submit"
                      className="admin-btn admin-btn-primary"
                      disabled={loading}
                    >
                      {editingItem ? "Save changes" : "Add item"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2>All items</h2>
                  <p>{items.length} items in your menu</p>
                </div>
              </div>
              {loading ? (
                <div className="admin-empty">
                  <div className="admin-spinner" style={{ margin: "0 auto" }} />
                </div>
              ) : items.length === 0 ? (
                <div className="admin-empty">
                  <div className="admin-empty-icon">🫖</div>
                  <p>No menu items yet. Add your first item above.</p>
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="admin-table-item">
                              {item.photo_url ? (
                                <img
                                  className="admin-table-thumb"
                                  src={item.photo_url}
                                  alt=""
                                />
                              ) : (
                                <div className="admin-table-thumb admin-table-thumb-placeholder">
                                  🍵
                                </div>
                              )}
                              <div>
                                <div className="admin-table-name">
                                  {item.name_en}
                                </div>
                                {(item.name_ar || item.name_ku) && (
                                  <div className="admin-table-meta">
                                    {[item.name_ar, item.name_ku]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="admin-table-meta">
                            {categories.find((c) => c.id === item.category_id)
                              ?.label_en || item.category_id}
                          </td>
                          <td className="admin-price">
                            {item.price.toLocaleString()} IQD
                          </td>
                          <td>
                            <span
                              className={`admin-badge ${item.is_available ? "admin-badge-live" : "admin-badge-hidden"}`}
                            >
                              {item.is_available ? "Live" : "Hidden"}
                            </span>
                          </td>
                          <td>
                            <div className="admin-table-actions">
                              <button
                                type="button"
                                className="admin-btn admin-btn-edit admin-btn-sm"
                                onClick={() => handleEditItem(item)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                onClick={() =>
                                  handleDeleteItem(item.id, item.name_en)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "categories" && (
          <>
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2>{editingCategory ? "Edit category" : "Add category"}</h2>
                  <p>
                    Categories appear in the navigation bar on the customer menu.
                  </p>
                </div>
                {editingCategory && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={resetCategoryForm}
                  >
                    Cancel edit
                  </button>
                )}
              </div>
              <div className="admin-card-body">
                <form className="admin-form-grid" onSubmit={handleSubmitCategory}>
                  <div className="admin-form-section">
                    <div className="admin-form-section-title">Identity</div>
                    <div className="admin-field-row admin-field-row-2">
                      <Field label="ID (slug) *">
                        <input
                          className="admin-input"
                          placeholder="e.g. blacktea"
                          value={categoryForm.id}
                          onChange={(e) =>
                            setCategoryForm({ ...categoryForm, id: e.target.value })
                          }
                          required
                          disabled={!!editingCategory}
                        />
                      </Field>
                      <Field label="Sort order">
                        <input
                          className="admin-input"
                          type="number"
                          value={categoryForm.sort_order}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              sort_order: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="admin-form-section">
                    <div className="admin-form-section-title">Time availability</div>
                    <div className="admin-field-row admin-field-row-2">
                      <Field label="Available from">
                        <input
                          className="admin-input"
                          type="time"
                          value={categoryForm.available_from}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              available_from: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Available until">
                        <input
                          className="admin-input"
                          type="time"
                          value={categoryForm.available_until}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              available_until: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>
                    <p className="admin-hint">Leave blank to always show this category.</p>
                  </div>

                  <div className="admin-form-section">
                    <div className="admin-form-section-title">Icon image</div>
                    <Field label="Image URL">
                      <input
                        className="admin-input"
                        type="url"
                        placeholder="https://... or upload below"
                        value={categoryForm.image_url}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            image_url: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <div className="admin-upload-zone">
                      <label className="admin-upload-btn">
                        {imageUploading ? "Uploading…" : "Upload image"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleCategoryImageSelect}
                          disabled={imageUploading}
                        />
                      </label>
                      {categoryForm.image_url && (
                        <img
                          className="admin-preview-img"
                          src={categoryForm.image_url}
                          alt="Preview"
                        />
                      )}
                    </div>
                  </div>

                  <div className="admin-form-section">
                    <div className="admin-form-section-title">Labels</div>
                    <div className="admin-field-row admin-field-row-3">
                      <Field label="English *">
                        <input
                          className="admin-input"
                          value={categoryForm.label_en}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              label_en: e.target.value,
                            })
                          }
                          required
                        />
                      </Field>
                      <Field label="Arabic">
                        <input
                          className="admin-input"
                          dir="rtl"
                          value={categoryForm.label_ar}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              label_ar: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field label="Kurdish">
                        <input
                          className="admin-input"
                          dir="rtl"
                          value={categoryForm.label_ku}
                          onChange={(e) =>
                            setCategoryForm({
                              ...categoryForm,
                              label_ku: e.target.value,
                            })
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="admin-form-actions">
                    <button
                      type="submit"
                      className="admin-btn admin-btn-primary"
                      disabled={loading}
                    >
                      {editingCategory ? "Save changes" : "Add category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2>All categories</h2>
                  <p>{categories.length} categories configured</p>
                </div>
              </div>
              {categories.length === 0 ? (
                <div className="admin-empty">
                  <div className="admin-empty-icon">📂</div>
                  <p>No categories yet. Create one above to get started.</p>
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>ID</th>
                        <th>Order</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => (
                        <tr key={cat.id}>
                          <td>
                            <div className="admin-table-item">
                              {cat.image_url ? (
                                <img
                                  className="admin-table-thumb admin-table-thumb-round"
                                  src={cat.image_url}
                                  alt=""
                                />
                              ) : (
                                <div className="admin-table-thumb admin-table-thumb-round admin-table-thumb-placeholder">
                                  🍵
                                </div>
                              )}
                              <div>
                                <div className="admin-table-name">
                                  {cat.label_en}
                                </div>
                                <div className="admin-table-meta">
                                  {[cat.label_ar, cat.label_ku]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="admin-table-meta">{cat.id}</td>
                          <td className="admin-table-meta">{cat.sort_order}</td>
                          <td>
                            <div className="admin-table-actions">
                              <button
                                type="button"
                                className="admin-btn admin-btn-edit admin-btn-sm"
                                onClick={() => handleEditCategory(cat)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                onClick={() =>
                                  handleDeleteCategory(cat.id, cat.label_en)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
