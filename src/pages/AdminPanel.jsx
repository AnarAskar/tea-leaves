import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QRCodeSVG } from "qrcode.react";
import { Languages } from "lucide-react";
import { ADMIN_PATH, BASE_URL, NUM_TABLES } from "../constants/config";
import { supabase } from "../utils/supabaseClient";
import { genTableToken } from "../utils/tableToken";
import { useAuth } from "../contexts/AuthContext";
import { uploadCategoryImage } from "../utils/uploadCategoryImage";
import { uploadMenuImage } from "../utils/uploadMenuImage";
import { translateText } from "../utils/translate";
import { formatSupabaseError } from "../utils/formatSupabaseError";
import "../styles/admin.css";

// The only tags the customer menu renders (hot/cold/vegan/new badges).
const TAG_OPTIONS = [
  { value: "hot", label: "Hot" },
  { value: "cold", label: "Cold" },
  { value: "vegan", label: "Vegan" },
  { value: "new", label: "New" },
];

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

// Prominent "you have unsaved order changes" bar with undo/discard/save.
function OrderBar({ onUndo, onDiscard, onSave }) {
  return (
    <div className="admin-order-bar" role="status">
      <div className="admin-order-bar-msg">
        <span className="admin-order-bar-dot" aria-hidden="true" />
        <div>
          <div className="admin-order-bar-title">Unsaved order changes</div>
          <div className="admin-order-bar-sub">
            Your new order isn’t saved yet — click <strong>Save order</strong> to
            keep it, or undo your changes.
          </div>
        </div>
      </div>
      <div className="admin-order-bar-actions">
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={onUndo}
        >
          ↶ Undo
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={onDiscard}
        >
          Discard
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-primary admin-btn-sm"
          onClick={onSave}
        >
          💾 Save order
        </button>
      </div>
    </div>
  );
}

// A single reorderable row: drag handle + up/down arrows + content.
function SortableRow({ id, index, count, onMoveUp, onMoveDown, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 20 : "auto",
    position: "relative",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`admin-sort-row${isDragging ? " dragging" : ""}`}
    >
      <div className="admin-sort-controls">
        <button
          type="button"
          className="admin-drag-handle"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >
          ⠿
        </button>
        <div className="admin-sort-arrows">
          <button
            type="button"
            className="admin-sort-arrow"
            disabled={index === 0}
            onClick={onMoveUp}
            aria-label="Move up"
            title="Move up"
          >
            ▲
          </button>
          <button
            type="button"
            className="admin-sort-arrow"
            disabled={index === count - 1}
            onClick={onMoveDown}
            aria-label="Move down"
            title="Move down"
          >
            ▼
          </button>
        </div>
      </div>
      <div className="admin-sort-content">{children}</div>
    </div>
  );
}

// Wraps a list of SortableRows with drag-and-drop context.
function SortableList({ ids, onReorder, children }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    if (oldIndex !== -1 && newIndex !== -1) onReorder(oldIndex, newIndex);
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
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

  // Table QR generator state. The table count is remembered in the browser.
  const [qrCount, setQrCount] = useState(() => {
    const saved = parseInt(localStorage.getItem("tl_qr_count"), 10);
    return Number.isInteger(saved) && saved > 0 ? Math.min(saved, 999) : NUM_TABLES;
  });
  const [printQueue, setPrintQueue] = useState([]);
  const [tables, setTables] = useState([]); // [{ number, token }] from Supabase
  const [generating, setGenerating] = useState(false);
  const [wifiName, setWifiName] = useState(
    () => localStorage.getItem("tl_wifi_name") || "",
  );
  const [wifiPass, setWifiPass] = useState(
    () => localStorage.getItem("tl_wifi_pass") || "",
  );
  const qrBaseUrl = (
    BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  ).replace(/\/+$/, "");
  const tableUrl = (token) => `${qrBaseUrl}/?t=${token}`;
  const tokenByNumber = useMemo(() => {
    const m = new Map();
    tables.forEach((t) => m.set(t.number, t.token));
    return m;
  }, [tables]);

  useEffect(() => {
    localStorage.setItem("tl_qr_count", String(qrCount));
  }, [qrCount]);
  useEffect(() => {
    localStorage.setItem("tl_wifi_name", wifiName);
  }, [wifiName]);
  useEffect(() => {
    localStorage.setItem("tl_wifi_pass", wifiPass);
  }, [wifiPass]);

  // When a print is queued, let the print-only DOM render, then open the dialog.
  // The queue must NOT be cleared synchronously after window.print(): on mobile
  // print() returns immediately (it doesn't block like on desktop), so clearing
  // right away wipes the content before the OS captures it → blank page. Instead
  // we clear on the `afterprint` event (with a long fallback).
  useEffect(() => {
    if (!printQueue.length) return;
    const clear = () => setPrintQueue([]);
    window.addEventListener("afterprint", clear, { once: true });
    const printId = setTimeout(() => window.print(), 120);
    const fallbackId = setTimeout(clear, 120000);
    return () => {
      clearTimeout(printId);
      clearTimeout(fallbackId);
      window.removeEventListener("afterprint", clear);
    };
  }, [printQueue]);

  // Ensure a table row (with a stable, unguessable token) exists for each
  // number 1..qrCount. Existing tables keep their tokens, so printed QR codes
  // stay valid — only missing numbers get a freshly generated token.
  const generateCodes = async () => {
    setGenerating(true);
    setError(null);
    try {
      const existing = new Set(tables.map((t) => t.number));
      const toCreate = [];
      for (let n = 1; n <= qrCount; n++) {
        if (!existing.has(n)) toCreate.push({ number: n, token: genTableToken() });
      }
      if (toCreate.length) {
        const { error } = await supabase.from("tables").insert(toCreate);
        if (error) throw error;
      }
      const { data, error } = await supabase
        .from("tables")
        .select("number, token")
        .order("number");
      if (error) throw error;
      setTables(data || []);
      showSuccess(
        toCreate.length
          ? `Generated ${toCreate.length} new code${toCreate.length > 1 ? "s" : ""}.`
          : "All tables already have codes.",
      );
    } catch (err) {
      console.error("Generate codes error:", err);
      setError(formatSupabaseError(err));
    } finally {
      setGenerating(false);
    }
  };

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
    tags: [],
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
    hours_enabled: false,
    available_from: "",
    available_until: "",
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [itemImageUploading, setItemImageUploading] = useState(false);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setError(null);
  };

  // Auto-translate: fill one language field from whichever sibling field is
  // already filled. `keyId` (e.g. "name_ar") tracks which button is spinning.
  const [translating, setTranslating] = useState("");
  const runTranslate = async (form, setForm, prefix, target, keyId) => {
    const order = ["en", "ar", "ku"];
    const srcLang = order.find(
      (l) => l !== target && String(form[`${prefix}_${l}`] || "").trim(),
    );
    if (!srcLang) {
      setError("Type text in another language first, then translate.");
      return;
    }
    setError(null);
    setTranslating(keyId);
    try {
      const out = await translateText(
        String(form[`${prefix}_${srcLang}`]).trim(),
        srcLang,
        target,
      );
      setForm((prev) => ({ ...prev, [`${prefix}_${target}`]: out }));
    } catch (err) {
      setError(err?.message || "Translation failed.");
    } finally {
      setTranslating("");
    }
  };

  const transBtn = (form, setForm, prefix, target) => {
    const keyId = `${prefix}_${target}`;
    return (
      <button
        type="button"
        className="admin-trans-btn"
        title="Auto-translate from a filled language"
        aria-label="Auto-translate"
        disabled={!!translating}
        onClick={() => runTranslate(form, setForm, prefix, target, keyId)}
      >
        {translating === keyId ? (
          <span className="admin-trans-spin" />
        ) : (
          <Languages size={14} />
        )}
      </button>
    );
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
      const [catRes, itemRes, tableRes] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase
          .from("menu_items")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("tables").select("number, token").order("number"),
      ]);
      if (catRes.error) throw catRes.error;
      if (itemRes.error) throw itemRes.error;
      setCategories(catRes.data || []);
      setItems(itemRes.data || []);
      // Table QR rows are optional (migration 012); ignore errors if absent.
      if (!tableRes.error) setTables(tableRes.data || []);
      // Fresh data replaces any in-progress reorder drafts.
      setCatUndo([]);
      setItemUndo([]);
      // Default the new-item form's category to the first one, without
      // depending on form state (which would refetch the whole menu on edits).
      const firstCat = catRes.data?.[0]?.id;
      if (firstCat) {
        setItemForm((prev) =>
          prev.category_id ? prev : { ...prev, category_id: firstCat },
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load menu data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) fetchData();
  }, [session, fetchData]);

  // Items grouped by category, each sorted by sort_order (for reordering UI).
  const itemsByCategory = useMemo(() => {
    const grouped = {};
    for (const it of items) {
      (grouped[it.category_id] ||= []).push(it);
    }
    for (const key in grouped) {
      grouped[key].sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id,
      );
    }
    return grouped;
  }, [items]);

  // Draft reordering: drags/moves only change local state and push a snapshot
  // onto an undo stack. Nothing is written to the DB until "Save order" is
  // pressed, so accidental drags can be undone or discarded.
  const [catUndo, setCatUndo] = useState([]);
  const [itemUndo, setItemUndo] = useState([]);
  const catDirty = catUndo.length > 0;
  const itemDirty = itemUndo.length > 0;

  const reorderCategories = (oldIndex, newIndex) => {
    if (oldIndex === newIndex) return;
    setCatUndo((s) => [...s, categories]);
    setCategories(
      arrayMove(categories, oldIndex, newIndex).map((c, i) => ({
        ...c,
        sort_order: i,
      })),
    );
  };

  const moveCategory = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= categories.length) return;
    reorderCategories(index, target);
  };

  const undoCategories = () => {
    setCatUndo((s) => {
      if (!s.length) return s;
      setCategories(s[s.length - 1]);
      return s.slice(0, -1);
    });
  };

  const discardCategories = () => {
    setCatUndo((s) => {
      if (!s.length) return s;
      setCategories(s[0]);
      return [];
    });
  };

  const saveCategories = async () => {
    const baseline = catUndo[0] || categories;
    const baseMap = new Map(baseline.map((c) => [c.id, c.sort_order]));
    const changed = categories.filter((c) => baseMap.get(c.id) !== c.sort_order);
    try {
      const results = await Promise.all(
        changed.map((c) =>
          supabase
            .from("categories")
            .update({ sort_order: c.sort_order })
            .eq("id", c.id),
        ),
      );
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
      setCatUndo([]);
      showSuccess("Category order saved.");
    } catch (err) {
      console.error("Save order error:", err);
      setError(formatSupabaseError(err));
    }
  };

  const reorderItems = (catId, oldIndex, newIndex) => {
    if (oldIndex === newIndex) return;
    const catItems = itemsByCategory[catId] || [];
    const reordered = arrayMove(catItems, oldIndex, newIndex);
    const orderMap = new Map(reordered.map((it, i) => [it.id, i]));
    setItemUndo((s) => [...s, items]);
    setItems((prev) =>
      prev.map((it) =>
        orderMap.has(it.id) ? { ...it, sort_order: orderMap.get(it.id) } : it,
      ),
    );
  };

  const moveItem = (catId, index, dir) => {
    const target = index + dir;
    const catItems = itemsByCategory[catId] || [];
    if (target < 0 || target >= catItems.length) return;
    reorderItems(catId, index, target);
  };

  const undoItems = () => {
    setItemUndo((s) => {
      if (!s.length) return s;
      setItems(s[s.length - 1]);
      return s.slice(0, -1);
    });
  };

  const discardItems = () => {
    setItemUndo((s) => {
      if (!s.length) return s;
      setItems(s[0]);
      return [];
    });
  };

  const saveItems = async () => {
    const baseline = itemUndo[0] || items;
    const baseMap = new Map(baseline.map((it) => [it.id, it.sort_order]));
    const changed = items.filter((it) => baseMap.get(it.id) !== it.sort_order);
    try {
      const results = await Promise.all(
        changed.map((it) =>
          supabase
            .from("menu_items")
            .update({ sort_order: it.sort_order })
            .eq("id", it.id),
        ),
      );
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
      setItemUndo([]);
      showSuccess("Item order saved.");
    } catch (err) {
      console.error("Save order error:", err);
      setError(formatSupabaseError(err));
    }
  };

  // Warn before leaving/refreshing with unsaved order changes.
  useEffect(() => {
    if (!catDirty && !itemDirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [catDirty, itemDirty]);

  const handleLogout = async () => {
    await signOut();
    navigate(`/${ADMIN_PATH}/login`);
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
      tags: [],
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
      tags: item.tags || [],
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
      tags: itemForm.tags,
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
      hours_enabled: false,
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
      hours_enabled: !!(cat.available_from || cat.available_until),
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
      sort_order: editingCategory ? editingCategory.sort_order : categories.length,
      available_from: categoryForm.hours_enabled
        ? categoryForm.available_from || null
        : null,
      available_until: categoryForm.hours_enabled
        ? categoryForm.available_until || null
        : null,
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
            onClick={() => navigate(`/${ADMIN_PATH}/login`)}
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  const availableCount = items.filter((i) => i.is_available).length;

  return (
    <>
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
          <button
            type="button"
            className={`admin-tab${activeTab === "qr" ? " active" : ""}`}
            onClick={() => setActiveTab("qr")}
          >
            Table QR codes
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
                        <div className="admin-field-trans">
                          <input
                            className="admin-input"
                            value={itemForm.name_en}
                            onChange={(e) =>
                              setItemForm({ ...itemForm, name_en: e.target.value })
                            }
                            required
                          />
                          {transBtn(itemForm, setItemForm, "name", "en")}
                        </div>
                      </Field>
                      <Field label="Name (Arabic)">
                        <div className="admin-field-trans">
                          <input
                            className="admin-input"
                            dir="rtl"
                            value={itemForm.name_ar}
                            onChange={(e) =>
                              setItemForm({ ...itemForm, name_ar: e.target.value })
                            }
                          />
                          {transBtn(itemForm, setItemForm, "name", "ar")}
                        </div>
                      </Field>
                      <Field label="Name (Kurdish)">
                        <div className="admin-field-trans">
                          <input
                            className="admin-input"
                            dir="rtl"
                            value={itemForm.name_ku}
                            onChange={(e) =>
                              setItemForm({ ...itemForm, name_ku: e.target.value })
                            }
                          />
                          {transBtn(itemForm, setItemForm, "name", "ku")}
                        </div>
                      </Field>
                    </div>
                  </div>

                  <div className="admin-form-section">
                    <div className="admin-form-section-title">Ingredients</div>
                    <div className="admin-field-row admin-field-row-3">
                      <Field label="English">
                        <div className="admin-field-trans admin-field-trans-ta">
                          <textarea
                            className="admin-textarea"
                            value={itemForm.ing_en}
                            onChange={(e) =>
                              setItemForm({ ...itemForm, ing_en: e.target.value })
                            }
                            rows={2}
                          />
                          {transBtn(itemForm, setItemForm, "ing", "en")}
                        </div>
                      </Field>
                      <Field label="Arabic">
                        <div className="admin-field-trans admin-field-trans-ta">
                          <textarea
                            className="admin-textarea"
                            dir="rtl"
                            value={itemForm.ing_ar}
                            onChange={(e) =>
                              setItemForm({ ...itemForm, ing_ar: e.target.value })
                            }
                            rows={2}
                          />
                          {transBtn(itemForm, setItemForm, "ing", "ar")}
                        </div>
                      </Field>
                      <Field label="Kurdish">
                        <div className="admin-field-trans admin-field-trans-ta">
                          <textarea
                            className="admin-textarea"
                            dir="rtl"
                            value={itemForm.ing_ku}
                            onChange={(e) =>
                              setItemForm({ ...itemForm, ing_ku: e.target.value })
                            }
                            rows={2}
                          />
                          {transBtn(itemForm, setItemForm, "ing", "ku")}
                        </div>
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
                      <div className="admin-tag-chips">
                        {TAG_OPTIONS.map((opt) => {
                          const active = itemForm.tags.includes(opt.value);
                          return (
                            <button
                              type="button"
                              key={opt.value}
                              className={`admin-tag-chip admin-tag-chip-${opt.value}${active ? " active" : ""}`}
                              aria-pressed={active}
                              onClick={() =>
                                setItemForm((f) => ({
                                  ...f,
                                  tags: active
                                    ? f.tags.filter((t) => t !== opt.value)
                                    : [...f.tags, opt.value],
                                }))
                              }
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
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

            {itemDirty && (
              <OrderBar
                onUndo={undoItems}
                onDiscard={discardItems}
                onSave={saveItems}
              />
            )}
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h2>Menu items by category</h2>
                  <p>Drag rows or use ▲▼ to reorder items within a category</p>
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
                <div className="admin-sort-groups">
                  {[
                    ...categories.map((c) => ({ id: c.id, label: c.label_en })),
                    ...Object.keys(itemsByCategory)
                      .filter((k) => !categories.some((c) => c.id === k))
                      .map((k) => ({ id: k, label: `${k} (no category)` })),
                  ].map((group) => {
                    const catItems = itemsByCategory[group.id] || [];
                    if (catItems.length === 0) return null;
                    const ids = catItems.map((it) => it.id);
                    return (
                      <div key={group.id} className="admin-sort-group">
                        <div className="admin-sort-group-head">
                          <span className="admin-sort-group-title">
                            {group.label}
                          </span>
                          <span className="admin-sort-group-count">
                            {catItems.length}
                          </span>
                        </div>
                        <SortableList
                          ids={ids}
                          onReorder={(o, n) => reorderItems(group.id, o, n)}
                        >
                          {catItems.map((item, idx) => (
                            <SortableRow
                              key={item.id}
                              id={item.id}
                              index={idx}
                              count={catItems.length}
                              onMoveUp={() => moveItem(group.id, idx, -1)}
                              onMoveDown={() => moveItem(group.id, idx, 1)}
                            >
                              <div className="admin-sort-main">
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
                                <div className="admin-sort-side">
                                  <span className="admin-price">
                                    {item.price.toLocaleString()} IQD
                                  </span>
                                  <span
                                    className={`admin-badge ${item.is_available ? "admin-badge-live" : "admin-badge-hidden"}`}
                                  >
                                    {item.is_available ? "Live" : "Hidden"}
                                  </span>
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
                                </div>
                              </div>
                            </SortableRow>
                          ))}
                        </SortableList>
                      </div>
                    );
                  })}
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
                    <p className="admin-hint">
                      Drag rows or use the ▲▼ arrows in the list below to change
                      the order categories appear on the menu.
                    </p>
                  </div>

                  <div className="admin-form-section">
                    <div className="admin-form-section-title">Time availability</div>
                    <label className="admin-checkbox-row">
                      <input
                        type="checkbox"
                        checked={categoryForm.hours_enabled}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            hours_enabled: e.target.checked,
                          })
                        }
                      />
                      Only show this category during certain hours
                    </label>
                    {categoryForm.hours_enabled && (
                      <>
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
                        <p className="admin-hint">
                          The category is hidden from the customer menu outside
                          this window. Leave a field blank for an open-ended
                          start or end.
                        </p>
                      </>
                    )}
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
                        <div className="admin-field-trans">
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
                          {transBtn(categoryForm, setCategoryForm, "label", "en")}
                        </div>
                      </Field>
                      <Field label="Arabic">
                        <div className="admin-field-trans">
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
                          {transBtn(categoryForm, setCategoryForm, "label", "ar")}
                        </div>
                      </Field>
                      <Field label="Kurdish">
                        <div className="admin-field-trans">
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
                          {transBtn(categoryForm, setCategoryForm, "label", "ku")}
                        </div>
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

            {catDirty && (
              <OrderBar
                onUndo={undoCategories}
                onDiscard={discardCategories}
                onSave={saveCategories}
              />
            )}
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
                <div className="admin-sort-groups">
                  <SortableList
                    ids={categories.map((c) => c.id)}
                    onReorder={reorderCategories}
                  >
                    {categories.map((cat, idx) => (
                      <SortableRow
                        key={cat.id}
                        id={cat.id}
                        index={idx}
                        count={categories.length}
                        onMoveUp={() => moveCategory(idx, -1)}
                        onMoveDown={() => moveCategory(idx, 1)}
                      >
                        <div className="admin-sort-main">
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
                                  .join(" · ") || cat.id}
                              </div>
                            </div>
                          </div>
                          <div className="admin-sort-side">
                            <span className="admin-table-meta admin-sort-id">
                              {cat.id}
                            </span>
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
                          </div>
                        </div>
                      </SortableRow>
                    ))}
                  </SortableList>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "qr" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2>Table QR codes</h2>
                <p>
                  One QR per table. Scanning it opens the menu already set to
                  that table so guests can order.
                </p>
              </div>
            </div>
            <div className="admin-card-body">
              <div className="admin-qr-controls">
                <Field label="Number of tables">
                  <input
                    className="admin-input"
                    type="number"
                    min="1"
                    max="999"
                    value={qrCount}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      setQrCount(
                        Number.isInteger(v) ? Math.max(1, Math.min(999, v)) : 1,
                      );
                    }}
                  />
                </Field>
                <Field label="WiFi name (optional)">
                  <input
                    className="admin-input"
                    value={wifiName}
                    onChange={(e) => setWifiName(e.target.value)}
                    placeholder="e.g. Tea Leaves"
                  />
                </Field>
                <Field label="WiFi password (optional)">
                  <input
                    className="admin-input"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="e.g. tealeaves123"
                  />
                </Field>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={generateCodes}
                  disabled={generating}
                >
                  {generating ? "Generating…" : "Generate codes"}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() =>
                    setPrintQueue(
                      Array.from({ length: qrCount }, (_, i) => i + 1).filter(
                        (n) => tokenByNumber.has(n),
                      ),
                    )
                  }
                >
                  🖨 Print all
                </button>
              </div>

              <p className="admin-hint" style={{ marginTop: 10 }}>
                Each table gets one permanent QR code. Set the count, click{" "}
                <strong>Generate codes</strong> to create any missing ones
                (existing codes are never changed), then print.
                {!BASE_URL && (
                  <>
                    {" "}
                    Tip: set <code>VITE_BASE_URL</code> to your live domain so the
                    codes point off your phone — currently using{" "}
                    <code>{qrBaseUrl || "this page's origin"}</code>.
                  </>
                )}
              </p>

              <div className="admin-qr-grid">
                {Array.from({ length: qrCount }, (_, i) => i + 1).map((n) => {
                  const token = tokenByNumber.get(n);
                  return (
                    <div className="admin-qr-card" key={n}>
                      {token ? (
                        <div className="admin-qr-code">
                          <QRCodeSVG
                            value={tableUrl(token)}
                            size={132}
                            level="M"
                            marginSize={2}
                          />
                        </div>
                      ) : (
                        <div className="admin-qr-missing">Not generated yet</div>
                      )}
                      <div className="admin-qr-label">Table {n}</div>
                      {(wifiName || wifiPass) && (
                        <div className="admin-qr-wifi">
                          {wifiName && <div>📶 {wifiName}</div>}
                          {wifiPass && <div>🔑 {wifiPass}</div>}
                        </div>
                      )}
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => setPrintQueue([n])}
                        disabled={!token}
                      >
                        🖨 Print
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>

    {/* Print-only area: rendered for whatever is queued, shown only when printing. */}
    <div className="qr-print-area" aria-hidden="true">
      {printQueue.map((n) => {
        const token = tokenByNumber.get(n);
        if (!token) return null;
        return (
        <div className="qr-print-card" key={n}>
          <QRCodeSVG value={tableUrl(token)} size={140} level="M" marginSize={2} />
          <div className="qr-print-table">T{n}</div>
          {(wifiName || wifiPass) && (
            <div className="qr-print-wifi">
              {wifiName && <div>{wifiName}</div>}
              {wifiPass && (
                <div>
                  <strong>WIFI PASS:</strong> {wifiPass}
                </div>
              )}
            </div>
          )}
        </div>
        );
      })}
    </div>
    </>
  );
}
