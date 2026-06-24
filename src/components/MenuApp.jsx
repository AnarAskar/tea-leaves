import { useState, useRef, useEffect, useCallback } from "react";
import { useMenuData } from "../hooks/useMenuData";
import { SLIDER_IMAGES } from "../constants/sliderImages";
import { T, LANG_OPTS } from "../translations";
import { fmt } from "../utils/formatters";
import {
  sendTelegramOrder,
  sendTelegramBill,
  sendTelegramNote,
  sendTelegramFeedback,
} from "../utils/telegram";

function isCategoryAvailable(cat) {
  const { available_from, available_until } = cat;
  if (!available_from && !available_until) return true;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  if (available_from && available_until)
    return cur >= toMin(available_from) && cur < toMin(available_until);
  if (available_from) return cur >= toMin(available_from);
  return cur < toMin(available_until);
}

function ItemPhoto({ src, alt, className, placeholderClassName = "photo-ph" }) {
  if (!src) {
    return (
      <div
        className={`${className} ${placeholderClassName}`}
        aria-hidden="true"
      >
        🍵
      </div>
    );
  }
  return (
    <img className={className} src={src} alt={alt} loading="lazy" />
  );
}

export default function MenuApp({
  lang,
  onChangeLang,
  tableNum: initialTable,
}) {
  const [langOpen, setLangOpen] = useState(false);
  const langWrapRef = useRef(null);
  const [activeCat, setActiveCat] = useState("");
  const [cart, setCart] = useState({});
  const [cartAddons, setCartAddons] = useState({}); // { [itemId]: addonObject }
  const [selectedAddon, setSelectedAddon] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [note, setNote] = useState("");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [orderNum] = useState(() => Math.floor(Math.random() * 9000) + 1000);
  const [screen, setScreen] = useState("menu"); // "menu" | "success" | "error"
  const [sending, setSending] = useState(false);
  const tableNum = initialTable;
  const [modal, setModal] = useState(null); // null | "bill" | "note" | "feedback"
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [selectedItem, setSelectedItem] = useState(null); // item detail modal
  const [sliderIdx, setSliderIdx] = useState(0);
  const [sliderOffset, setSliderOffset] = useState(0);
  const [noteText, setNoteText] = useState("");
  const [modalSending, setModalSending] = useState(false);
  const [modalDone, setModalDone] = useState(false);
  const [fbStars, setFbStars] = useState({ staff: 0, service: 0, hygiene: 0 });
  const [fbContact, setFbContact] = useState("");
  const [fbComments, setFbComments] = useState("");

  // Fetch live menu data from Supabase
  const {
    categories,
    itemsByCategory,
    allItems,
    loading: menuLoading,
    error: menuError,
  } = useMenuData();

  const visibleCategories = categories.filter(isCategoryAvailable);

  const toastRef = useRef(null);
  const catBarRef = useRef(null);
  const sectionRefs = useRef({});
  const scrollRef = useRef(null);
  const ignoreScrollRef = useRef(false);
  const sliderRef = useRef(null);
  const sliderDrag = useRef({
    active: false,
    startX: 0,
    startIdx: 0,
    offset: 0,
  });

  const t = T[lang];
  const isRTL = lang === "ar" || lang === "ku";

  // Set first category as active when data loads
  useEffect(() => {
    if (visibleCategories.length > 0 && !activeCat) {
      setActiveCat(visibleCategories[0].id);
    }
  }, [visibleCategories, activeCat]);

  // If the active category becomes hidden (e.g. breakfast past noon), switch to the first visible one
  useEffect(() => {
    if (activeCat && !visibleCategories.find((c) => c.id === activeCat)) {
      setActiveCat(visibleCategories[0]?.id ?? null);
    }
  }, [visibleCategories.map((c) => c.id).join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!langOpen) return;
    const onDocClick = (e) => {
      if (!langWrapRef.current?.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [langOpen]);

  const currentLang = LANG_OPTS.find((l) => l.code === lang);

  const totalQty = Object.values(cart).reduce((s, q) => s + q, 0);
  const itemPrice = (item) => item.price + (cartAddons[item.id]?.price || 0);
  const totalIQD = Object.entries(cart).reduce((s, [id, q]) => {
    const item = allItems.find((i) => i.id === id);
    return s + (item ? itemPrice(item) * q : 0);
  }, 0);

  const showToast = (msg) => {
    setToast(msg);
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(""), 2000);
  };

  const add = (item, addon) => {
    setCart((c) => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
    if (addon) setCartAddons((c) => ({ ...c, [item.id]: addon }));
    showToast(`${item.name[lang]} ✓`);
  };

  const remove = (item) => {
    setCart((c) => {
      const n = { ...c };
      if ((n[item.id] || 0) <= 1) {
        delete n[item.id];
        setCartAddons((ca) => { const x = { ...ca }; delete x[item.id]; return x; });
      } else {
        n[item.id]--;
      }
      return n;
    });
  };

  const cartItems = allItems.filter((i) => cart[i.id]);

  const placeOrder = async () => {
    setSending(true);
    try {
      await sendTelegramOrder({
        tableNum,
        cartItems,
        cart,
        cartAddons,
        note,
        totalIQD,
        lang,
      });
      setDrawerOpen(false);
      setSending(false);
      setCart({});
      setNote("");
      setScreen("success");
    } catch {
      setSending(false);
      setDrawerOpen(false);
      setScreen("error");
    }
  };

  const reset = () => setScreen("menu");

  // Slider auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      if (!sliderDrag.current.active) {
        setSliderIdx((i) => (i + 1) % SLIDER_IMAGES.length);
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Scroll to category
  const handleCatClick = (catId) => {
    setActiveCat(catId);
    const el = sectionRefs.current[catId];
    const container = scrollRef.current;
    if (el && container) {
      ignoreScrollRef.current = true;
      container.scrollTo({ top: el.offsetTop - 170, behavior: "smooth" });
      setTimeout(() => {
        ignoreScrollRef.current = false;
      }, 800);
    }
    catBarRef.current?.querySelector(`[data-cat="${catId}"]`)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  // Scroll spy
  const handleScroll = useCallback(() => {
    if (ignoreScrollRef.current || query.trim()) return;
    const container = scrollRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop + 200;
    let current = visibleCategories[0]?.id || "";
    for (const cat of visibleCategories) {
      const el = sectionRefs.current[cat.id];
      if (el && el.offsetTop <= scrollTop) current = cat.id;
    }
    setActiveCat((prev) => (prev !== current ? current : prev));
  }, [query, visibleCategories]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Drag category bar
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
    ? allItems.filter(
        (i) =>
          i.name[lang].toLowerCase().includes(query.toLowerCase()) ||
          i.ingredients[lang].toLowerCase().includes(query.toLowerCase()),
      )
    : null;

  const itemCard = (item) => {
    const qty = cart[item.id] || 0;
    if (viewMode === "list") {
      return (
        <div
          key={item.id}
          className={`l-card${qty > 0 ? " incart" : ""}`}
          onClick={() => { setSelectedItem(item); setSelectedAddon(item.addons?.[0] ?? null); }}
        >
          <div className="l-body">
            <div className="l-name">{item.name[lang]}</div>
            <div className="l-price">IQD {fmt(item.price)}</div>
            <div className="l-ing">{item.ingredients[lang]}</div>
          </div>
          <div className="l-img-wrap">
            <ItemPhoto
              className="l-img"
              src={item.photo}
              alt={item.name[lang]}
            />
            {qty > 0 && <div className="img-badge">{qty}</div>}
          </div>
        </div>
      );
    }
    return (
      <div
        key={item.id}
        className={`g-card${qty > 0 ? " incart" : ""}`}
        onClick={() => { setSelectedItem(item); setSelectedAddon(item.addons?.[0] ?? null); }}
      >
        <ItemPhoto
          className="g-img"
          src={item.photo}
          alt={item.name[lang]}
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
            <div className="qty-r" onClick={(e) => e.stopPropagation()}>
              {!tableNum ? (
                ""
              ) : qty === 0 ? (
                <button className="qb solid" onClick={() => add(item)}>
                  +
                </button>
              ) : (
                <>
                  <button className="qb" onClick={() => remove(item)}>
                    −
                  </button>
                  <span className="qnum">{qty}</span>
                  <button className="qb" onClick={() => add(item)}>
                    +
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (menuLoading) {
    return (
      <div className="app">
        <div className="skel-header" />
        <div className="skel-cats">
          {[...Array(4)].map((_, i) => <div key={i} className="skel-cat-pill" />)}
        </div>
        <div className="skel-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skel-card">
              <div className="skel-img" />
              <div className="skel-body">
                <div className="skel-line skel-line-lg" />
                <div className="skel-line skel-line-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (menuError) {
    return (
      <div
        className="app"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ color: "#e63946", fontSize: 16 }}>
          Failed to load menu. Please refresh.
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#1b3a2d;font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;}
        .app{width:100%;max-width:430px;min-height:100vh;height:100vh;background:#1b3a2d;color:#fff;direction:${isRTL ? "rtl" : "ltr"};display:flex;flex-direction:column;position:relative;overflow:hidden;margin:0 auto;}
        .hdr{background:#1b3a2d;padding:14px 16px 0;flex-shrink:0;border-bottom:1px solid #2d5a42;z-index:10;}
        .hdr-top{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:8px;margin-bottom:12px;}
        .hdr-title{font-size:18px;font-weight:700;color:#fff;text-align:center;justify-self:center;white-space:nowrap;}
        .hdr-right{display:flex;align-items:center;gap:8px;justify-self:end;}
        .lang-wrap{position:relative;z-index:300;justify-self:start;}
        .lang-btn{display:flex;align-items:center;justify-content:center;gap:3px;min-width:34px;height:34px;padding:0 8px;background:#1e3d2f;border:1px solid #2d5a42;border-radius:10px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;color:#52b788;transition:background .2s,border-color .2s;}
        .lang-btn:hover,.lang-btn.open{background:#2d6a4f;border-color:#52b788;color:#fff;}
        .lang-btn-badge{font-size:11px;font-weight:800;line-height:1;letter-spacing:.05em;color:inherit;}
        .chev{transition:transform .2s,color .2s;color:#6ba882;flex-shrink:0;}
        .lang-btn:hover .chev,.lang-btn.open .chev{color:inherit;}
        .chev.open{transform:rotate(180deg);}
        .lang-drop{position:absolute;top:calc(100% + 6px);${isRTL ? "right" : "left"}:0;background:#1a3328;border:1px solid rgba(82,183,136,.3);border-radius:14px;padding:6px;z-index:301;min-width:168px;box-shadow:0 12px 32px rgba(0,0,0,.5);color:#fff;}
        .lang-opt{display:flex;align-items:center;gap:10px;padding:10px 12px;font-size:14px;font-weight:500;cursor:pointer;color:#e8f5ee;border-radius:10px;transition:background .15s,color .15s;}
        .lang-opt:hover{background:rgba(45,106,79,.6);color:#fff;}
        .lang-opt.sel{background:rgba(82,183,136,.18);color:#fff;}
        .lang-opt-badge{font-size:11px;font-weight:800;line-height:1;letter-spacing:.05em;color:#52b788;background:rgba(82,183,136,.12);padding:4px 6px;border-radius:6px;min-width:28px;text-align:center;flex-shrink:0;}
        .lang-opt.sel .lang-opt-badge{color:#fff;background:rgba(82,183,136,.35);}
        .lang-opt-text{flex:1;font-weight:600;color:inherit;}
        .lang-opt-check{color:#52b788;font-size:14px;font-weight:800;opacity:0;}
        .lang-opt.sel .lang-opt-check{opacity:1;}
        .photo-ph{display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#243f30,#1e3d2f);color:#4a7a5a;}
        .g-img.photo-ph{height:130px;font-size:32px;}
        .l-img.photo-ph{min-height:100px;font-size:28px;}
        .d-img.photo-ph{width:42px;height:42px;font-size:18px;border-radius:10px;}
        .det-img.photo-ph{font-size:52px;}
        .icon-btn{background:none;border:none;color:#8ab8a0;cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;position:relative;}
        .search-row{display:flex;align-items:center;gap:8px;background:#1e3d2f;border:1px solid #2d5a42;border-radius:20px;padding:9px 14px;margin-bottom:12px;}
        .search-row input{flex:1;background:none;border:none;outline:none;color:#fff;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;}
        .search-row input::placeholder{color:#5a8c6e;}
        .clr-btn{background:none;border:none;color:#5a8c6e;cursor:pointer;font-size:13px;padding:0;}
        .cats{display:flex;gap:0;padding:14px 16px 0;overflow-x:auto;scrollbar-width:none;cursor:grab;user-select:none;-webkit-overflow-scrolling:touch;}
        .cats::-webkit-scrollbar{display:none;}
        .cats.drag{cursor:grabbing;}
        .cat-item{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:70px;padding:0 4px 12px;cursor:pointer;flex-shrink:0;border-bottom:2.5px solid transparent;transition:border-color .2s;}
        .cat-item.active{border-bottom-color:#52b788;}
        .cat-icon{width:52px;height:52px;background:#1e3d2f;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid #2d5a42;transition:background .2s,border-color .2s;flex-shrink:0;overflow:hidden;}
        .cat-icon img{width:100%;height:100%;object-fit:cover;}
        .cat-icon-fallback{font-size:23px;line-height:1;}
        .cat-item.active .cat-icon{background:#2d6a4f;border-color:#52b788;}
        .cat-lbl{font-size:10px;font-weight:500;color:#6ba882;text-align:center;line-height:1.3;transition:color .2s;white-space:nowrap;}
        .cat-item.active .cat-lbl{color:#52b788;}
        .scroll-body{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;}
        .scroll-body::-webkit-scrollbar{width:3px;}
        .scroll-body::-webkit-scrollbar-thumb{background:#2d5a42;border-radius:2px;}
        .menu-body{padding:16px 12px 140px;}
        .sec-head{display:flex;align-items:center;gap:10px;padding:6px 4px 12px;font-size:15px;font-weight:700;color:#fff;border-bottom:1px solid #2d5a42;margin-bottom:12px;margin-top:8px;}
        .sec-head:first-child{margin-top:0;}
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
        .t-hot{background:#3d1a0d;color:#f4845f;}
        .t-cold{background:#0d1f2e;color:#74c0fc;}
        .t-vegan{background:#0a2010;color:#69db7c;}
        .t-new{background:#1e0e2e;color:#cc5de8;}
        .qty-r{display:flex;align-items:center;gap:4px;}
        .qb{width:26px;height:26px;border-radius:50%;border:1.5px solid #52b788;background:none;color:#52b788;font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;line-height:1;font-family:'Plus Jakarta Sans',sans-serif;}
        .qb:hover,.qb.solid{background:#52b788;color:#1b3a2d;border-color:#52b788;}
        .qnum{font-size:13px;font-weight:800;min-width:14px;text-align:center;}
        .no-order-badge{width:26px;height:26px;border-radius:50%;background:#243f30;border:1.5px solid #2d5a42;display:flex;align-items:center;justify-content:center;font-size:12px;opacity:0.6;}
        .img-badge{position:absolute;top:8px;${isRTL ? "left" : "right"}:8px;background:#40916c;color:#fff;font-size:11px;font-weight:800;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
        .search-results{padding:14px 12px 140px;}
        .sec-lbl{font-size:13px;font-weight:600;color:#6ba882;margin-bottom:12px;padding:0 2px;}
        .btm-bar{position:absolute;bottom:0;left:0;right:0;padding:10px 12px 24px;background:linear-gradient(to top,#1b3a2d 65%,transparent);pointer-events:none;z-index:20;}
        .vob{width:100%;background:#40916c;color:#fff;border:none;border-radius:14px;padding:14px 18px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:flex;justify-content:space-between;align-items:center;pointer-events:all;box-shadow:0 6px 20px rgba(64,145,108,.45);transition:opacity .2s,transform .15s;}
        .vob:hover{opacity:.93;transform:translateY(-2px);}
        .vob-l{display:flex;align-items:center;gap:10px;}
        .vob-n{background:rgba(255,255,255,.25);width:24px;height:24px;border-radius:50%;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;}
        .overlay{position:absolute;inset:0;background:rgba(0,0,0,.6);z-index:30;opacity:0;pointer-events:none;transition:opacity .3s;}
        .overlay.open{opacity:1;pointer-events:all;}
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
        .place-btn{width:100%;background:#40916c;color:#fff;border:none;border-radius:13px;padding:14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;display:flex;align-items:center;justify-content:center;gap:8px;}
        .place-btn:hover:not(:disabled){opacity:.9;transform:translateY(-1px);}
        .place-btn:disabled{opacity:.6;cursor:not-allowed;}
        .empty-c{text-align:center;padding:44px 20px;color:#4a7a5a;}
        .empty-c .e-ico{font-size:50px;margin-bottom:14px;}
        .empty-c p{font-size:14px;line-height:1.7;white-space:pre-line;}
        .toast{position:absolute;bottom:110px;left:50%;transform:translateX(-50%) translateY(8px);background:#1e3d2f;border:1px solid #52b788;color:#52b788;padding:8px 18px;border-radius:30px;font-size:13px;font-weight:600;z-index:50;opacity:0;transition:all .25s;pointer-events:none;white-space:nowrap;}
        .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
        .fullscreen{position:absolute;inset:0;background:#1b3a2d;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 32px;transform:translateY(100%);transition:transform .4s cubic-bezier(.4,0,.2,1);direction:${isRTL ? "rtl" : "ltr"};}
        .fullscreen.show{transform:translateY(0);}
        .s-icon{font-size:68px;margin-bottom:18px;}
        .s-title{font-size:26px;font-weight:800;color:#52b788;margin-bottom:10px;}
        .s-msg{font-size:14px;color:#6ba882;line-height:1.7;margin-bottom:24px;white-space:pre-line;}
        .s-num{font-size:17px;font-weight:700;color:#fff;padding:12px 24px;border:1px solid #2d5a42;border-radius:12px;background:#1e3d2f;margin-bottom:32px;}
        .s-back{background:#40916c;color:#fff;border:none;padding:13px 28px;border-radius:13px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .2s;}
        .s-back:hover{opacity:.9;}
        .err-icon{font-size:60px;margin-bottom:18px;}
        .err-title{font-size:22px;font-weight:800;color:#e63946;margin-bottom:10px;}
        .err-msg{font-size:14px;color:#6ba882;line-height:1.7;margin-bottom:28px;}
        .err-btn{background:#e63946;color:#fff;border:none;padding:13px 28px;border-radius:13px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .2s;}
        .err-btn:hover{opacity:.9;}
        @keyframes spin{to{transform:rotate(360deg)}}

        .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}

        /* SLIDER */
        .slider-wrap{position:relative;width:100%;height:200px;overflow:hidden;border-radius:12px;margin-bottom:20px;user-select:none;-webkit-user-select:none;direction:ltr;}
        .slider-track{display:flex;height:100%;}
        .slide-item{height:100%;flex-shrink:0;}
        .slide-img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;-webkit-user-drag:none;user-drag:none;}
        .slider-dots{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:2;}
        .dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.45);cursor:pointer;transition:background .2s,transform .2s;}
        .dot.active{background:#fff;transform:scale(1.3);}

        /* SECTION HEAD with toggle */
        .list-toggle{background:#1e3d2f;border:1px solid #2d5a42;border-radius:8px;color:#8ab8a0;cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;padding:0;}
        .list-toggle:hover{border-color:#52b788;color:#52b788;}

        /* LIST VIEW CARDS */
        .list-view{display:flex;flex-direction:column;gap:10px;margin-bottom:20px;}
        .l-card{background:#1e3d2f;border-radius:14px;border:1px solid #2d5a42;display:flex;justify-content:space-between;align-items:stretch;overflow:hidden;cursor:pointer;transition:border-color .2s;}
        .l-card:hover{border-color:#3a6a4a;}
        .l-card.incart{border-color:#52b788;}
        .l-body{padding:16px 14px;flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:4px;}
        .l-name{font-size:15px;font-weight:700;color:#fff;line-height:1.3;}
        .l-price{font-size:13px;font-weight:700;color:#fff;}
        .l-ing{font-size:12px;color:#6ba882;line-height:1.5;margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        .l-img-wrap{position:relative;width:120px;flex-shrink:0;}
        .l-img{width:100%;height:100%;object-fit:cover;display:block;}

        /* ITEM DETAIL MODAL */
        @keyframes det-up{from{transform:translateY(100%);opacity:0;}to{transform:translateY(0);opacity:1;}}
        .det-overlay{position:absolute;inset:0;background:rgba(0,0,0,.75);z-index:70;display:flex;align-items:flex-end;}
        .det-sheet{background:#1e3d2f;border-top-left-radius:28px;border-top-right-radius:28px;width:100%;max-height:92%;display:flex;flex-direction:column;overflow:hidden;animation:det-up .28s cubic-bezier(0.32,0.72,0,1);}
        .det-handle{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:40px;height:4px;background:rgba(255,255,255,.4);border-radius:2px;z-index:2;backdrop-filter:blur(4px);}
        .det-img-wrap{position:relative;width:100%;height:260px;flex-shrink:0;overflow:hidden;}
        .det-img-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(18px) brightness(.65);transform:scale(1.12);}
        .det-img{position:relative;z-index:1;width:100%;height:100%;object-fit:contain;display:block;}
        .det-img.photo-ph{font-size:64px;display:flex;align-items:center;justify-content:center;}
        .det-close{position:absolute;top:12px;right:12px;width:36px;height:36px;background:rgba(0,0,0,.55);border:none;border-radius:50%;color:#fff;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);z-index:2;}
        .det-tags{position:absolute;bottom:10px;left:12px;display:flex;gap:4px;z-index:2;}
        .det-body{padding:20px 20px 36px;overflow-y:auto;flex:1;}
        .det-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:6px;}
        .det-name{font-size:22px;font-weight:800;color:#fff;line-height:1.25;flex:1;}
        .det-price{font-size:15px;font-weight:700;color:#52b788;white-space:nowrap;background:#243f30;border-radius:20px;padding:5px 12px;flex-shrink:0;margin-top:3px;}
        .det-divider{height:1px;background:#2a4f3a;margin:14px 0;}
        .det-ing-label{font-size:11px;font-weight:700;color:#6ba882;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;}
        .det-ing{font-size:14px;color:#a8c9b4;line-height:1.75;font-weight:300;}
        .det-addons{margin-top:16px;margin-bottom:4px;}
        .addon-opt{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;border:1.5px solid #2a4f3a;margin-bottom:8px;cursor:pointer;transition:border-color .15s,background .15s;}
        .addon-opt input[type=radio]{accent-color:#52b788;width:16px;height:16px;flex-shrink:0;}
        .addon-opt.selected{border-color:#52b788;background:#1a3828;}
        .addon-name{flex:1;font-size:14px;color:#e0f0e8;font-weight:500;}
        .addon-price{font-size:13px;color:#52b788;font-weight:700;white-space:nowrap;}
        .d-addon-lbl{font-size:12px;color:#6ba882;font-weight:400;}
        .det-actions{margin-top:24px;}
        .det-add{width:100%;background:linear-gradient(135deg,#40916c,#52b788);color:#fff;border:none;border-radius:14px;padding:16px;font-family:'Plus Jakarta Sans',sans-serif;font-size:16px;font-weight:700;cursor:pointer;transition:opacity .2s;}
        .det-add:hover{opacity:.88;}
        .det-qty-row{display:flex;align-items:center;gap:12px;background:#162e20;border-radius:14px;padding:12px 16px;border:1px solid #2a4f3a;}
        .act-btn{background:#1e3d2f;border:1px solid #2d5a42;border-radius:10px;color:#8ab8a0;cursor:pointer;width:34px;height:34px;display:flex;align-items:center;justify-content:center;transition:all .15s;padding:0;flex-shrink:0;}
        .act-btn:hover{border-color:#52b788;color:#52b788;background:#243f30;}
        .m-overlay{position:absolute;inset:0;background:rgba(0,0,0,.65);z-index:80;display:flex;align-items:flex-end;justify-content:center;}
        .m-sheet{background:#1e3d2f;border-top-left-radius:22px;border-top-right-radius:22px;width:100%;padding:0 20px 32px;max-height:80vh;display:flex;flex-direction:column;border-top:1px solid #2d5a42;}
        .m-handle{width:34px;height:4px;background:#2d5a42;border-radius:2px;margin:12px auto 18px;flex-shrink:0;}
        .m-title{font-size:18px;font-weight:700;color:#fff;margin-bottom:18px;flex-shrink:0;}
        .m-textarea{width:100%;background:#243f30;border:1px solid #2d5a42;border-radius:12px;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;padding:12px 14px;outline:none;resize:none;transition:border-color .2s;margin-bottom:14px;}
        .m-textarea:focus{border-color:#52b788;}
        .m-textarea::placeholder{color:#4a7a5a;}
        .m-input{width:100%;background:#243f30;border:1px solid #2d5a42;border-radius:12px;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;padding:12px 14px;outline:none;transition:border-color .2s;margin-bottom:14px;}
        .m-input:focus{border-color:#52b788;}
        .m-input::placeholder{color:#4a7a5a;}
        .m-send-btn{width:100%;background:#40916c;color:#fff;border:none;border-radius:13px;padding:14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .2s;flex-shrink:0;}
        .m-send-btn:hover:not(:disabled){opacity:.9;}
        .m-send-btn:disabled{opacity:.45;cursor:not-allowed;}
        .m-btn-yes{flex:1;background:#40916c;color:#fff;border:none;border-radius:13px;padding:14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .2s;}
        .m-btn-yes:hover{opacity:.9;}
        .m-btn-no{flex:1;background:#243f30;color:#8ab8a0;border:1px solid #2d5a42;border-radius:13px;padding:14px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all .15s;}
        .m-btn-no:hover{border-color:#52b788;color:#fff;}
        .m-done{display:flex;flex-direction:column;align-items:center;padding:12px 0 4px;text-align:center;}
        .m-done-icon{font-size:52px;margin-bottom:14px;}
        .m-done-text{font-size:16px;font-weight:600;color:#52b788;line-height:1.5;}
        .m-scroll{flex:1;overflow-y:auto;margin-bottom:14px;}
        .m-scroll::-webkit-scrollbar{width:3px;}
        .m-scroll::-webkit-scrollbar-thumb{background:#2d5a42;border-radius:2px;}
        .fb-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #2d5a42;}
        .fb-row:last-of-type{border-bottom:none;}
        .fb-label{font-size:15px;font-weight:600;color:#fff;}
        .fb-stars{display:flex;gap:6px;}
        .star-btn{background:none;border:none;font-size:26px;color:#2d5a42;cursor:pointer;padding:2px;line-height:1;transition:color .1s,transform .1s;outline:none;-webkit-tap-highlight-color:transparent;user-select:none;}
        .star-btn span{display:block;line-height:1;pointer-events:none;}
        .star-btn.lit{color:#f4b942;}
        .star-btn:hover{transform:scale(1.15);}
        .star-btn:focus{outline:none;}
        .fb-field-label{font-size:12px;font-weight:600;color:#6ba882;margin-bottom:6px;margin-top:14px;}
        /* skeleton CSS lives in index.html so it works before React mounts */
      `}</style>

      <div className="app">
        {/* HEADER */}
        <div className="hdr">
          <div className="hdr-top">
            <div className="lang-wrap" ref={langWrapRef}>
              <button
                type="button"
                className={`lang-btn${langOpen ? " open" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLangOpen((v) => !v);
                }}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
                aria-label={`Language: ${currentLang?.label}`}
                title={currentLang?.label}
              >
                <span className="lang-btn-badge">{currentLang?.badge}</span>
                <svg
                  className={`chev${langOpen ? " open" : ""}`}
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {langOpen && (
                <div className="lang-drop" role="listbox">
                  {LANG_OPTS.map((lo) => (
                    <div
                      key={lo.code}
                      role="option"
                      aria-selected={lang === lo.code}
                      className={`lang-opt${lang === lo.code ? " sel" : ""}`}
                      onClick={() => {
                        onChangeLang?.(lo.code);
                        setLangOpen(false);
                      }}
                    >
                      <span className="lang-opt-badge">{lo.badge}</span>
                      <span className="lang-opt-text">{lo.label}</span>
                      <span className="lang-opt-check">✓</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hdr-title">{t.appName}</div>

            <div className="hdr-right">
              {tableNum && (
                <>
                  <button
                    className="act-btn"
                    title="Request Bill"
                    onClick={() => {
                      setModal("bill");
                      setModalDone(false);
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </button>
                  <button
                    className="act-btn"
                    title="Leave a Note"
                    onClick={() => {
                      setModal("note");
                      setModalDone(false);
                      setNoteText("");
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </button>
                  <button
                    className="act-btn"
                    title="Give Feedback"
                    onClick={() => {
                      setModal("feedback");
                      setModalDone(false);
                      setFbStars({ staff: 0, service: 0, hygiene: 0 });
                      setFbContact("");
                      setFbComments("");
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => setDrawerOpen(true)}
                  >
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
                </>
              )}
            </div>
          </div>

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

          {!query && visibleCategories.length > 0 && (
            <div className="cats" ref={catBarRef}>
              {visibleCategories.map((c) => (
                <div
                  key={c.id}
                  data-cat={c.id}
                  className={`cat-item${activeCat === c.id ? " active" : ""}`}
                  onClick={() => handleCatClick(c.id)}
                >
                  <div className="cat-icon">
                    {c.image_url?.trim() ? (
                      <img src={c.image_url} alt={c[`label_${lang}`]} />
                    ) : (
                      <span className="cat-icon-fallback">🍵</span>
                    )}
                  </div>
                  <span className="cat-lbl">{c[`label_${lang}`]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="scroll-body" ref={scrollRef}>
          {filtered ? (
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
                <div className="grid">{filtered.map(itemCard)}</div>
              )}
            </div>
          ) : (
            <div className="menu-body">
              {/* SLIDER */}
              {(() => {
                const n = SLIDER_IMAGES.length;
                const startDrag = (clientX) => {
                  sliderDrag.current = {
                    active: true,
                    startX: clientX,
                    startIdx: sliderIdx,
                    offset: 0,
                  };
                };
                const moveDrag = (clientX) => {
                  if (!sliderDrag.current.active) return;
                  const w = sliderRef.current?.offsetWidth || 390;
                  const raw = clientX - sliderDrag.current.startX;
                  const clamped = Math.max(-(w * 0.7), Math.min(w * 0.7, raw));
                  setSliderOffset(clamped);
                };
                const endDrag = (clientX) => {
                  if (!sliderDrag.current.active) return;
                  sliderDrag.current.active = false;
                  const w = sliderRef.current?.offsetWidth || 390;
                  const dx = clientX - sliderDrag.current.startX;
                  setSliderOffset(0);
                  if (Math.abs(dx) > w * 0.18) {
                    setSliderIdx((i) =>
                      Math.max(0, Math.min(n - 1, i + (dx < 0 ? 1 : -1))),
                    );
                  }
                };
                const w = sliderRef.current?.offsetWidth || 390;
                const trackX = -sliderIdx * w + sliderOffset;
                const isDragging = sliderDrag.current.active;
                return (
                  <div
                    className="slider-wrap"
                    ref={sliderRef}
                    style={{
                      cursor: isDragging ? "grabbing" : "grab",
                      direction: "ltr",
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      startDrag(e.clientX);
                    }}
                    onMouseMove={(e) => moveDrag(e.clientX)}
                    onMouseUp={(e) => endDrag(e.clientX)}
                    onMouseLeave={(e) => {
                      if (sliderDrag.current.active) endDrag(e.clientX);
                    }}
                    onTouchStart={(e) => startDrag(e.touches[0].clientX)}
                    onTouchMove={(e) => {
                      e.stopPropagation();
                      moveDrag(e.touches[0].clientX);
                    }}
                    onTouchEnd={(e) => endDrag(e.changedTouches[0].clientX)}
                  >
                    <div
                      className="slider-track"
                      style={{
                        transform: `translateX(${trackX}px)`,
                        transition: sliderDrag.current.active
                          ? "none"
                          : "transform .35s cubic-bezier(.4,0,.2,1)",
                        width: `${n * 100}%`,
                        direction: "ltr",
                      }}
                    >
                      {SLIDER_IMAGES.map((img, i) => (
                        <div
                          key={i}
                          className="slide-item"
                          style={{ width: `${100 / n}%` }}
                        >
                          <img
                            src={img}
                            alt="Tea Leaves Cafe"
                            className="slide-img"
                            draggable="false"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="slider-dots">
                      {SLIDER_IMAGES.map((_, i) => (
                        <div
                          key={i}
                          className={`dot${i === sliderIdx ? " active" : ""}`}
                          onClick={() => setSliderIdx(i)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}

              {visibleCategories.map((cat) => (
                <div
                  key={cat.id}
                  ref={(el) => (sectionRefs.current[cat.id] = el)}
                >
                  <div className="sec-head">
                    <button
                      type="button"
                      className="list-toggle"
                      onClick={() =>
                        setViewMode((v) => (v === "grid" ? "list" : "grid"))
                      }
                      title="Toggle view"
                    >
                      {viewMode === "grid" ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <line x1="3" y1="12" x2="21" y2="12" />
                          <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                        </svg>
                      )}
                    </button>
                    <span>{cat[`label_${lang}`]}</span>
                  </div>
                  <div className={viewMode === "list" ? "list-view" : "grid"}>
                    {(itemsByCategory[cat.id] || []).map(itemCard)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {tableNum && totalQty > 0 && !drawerOpen && (
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
                    <ItemPhoto
                      className="d-img"
                      src={item.photo}
                      alt={item.name[lang]}
                    />
                    <div>
                      <div className="d-name">
                        {item.name[lang]}
                        {cartAddons[item.id] && (
                          <span className="d-addon-lbl"> · {cartAddons[item.id][`name_${lang}`] || cartAddons[item.id].name_en}</span>
                        )}
                      </div>
                      <div className="d-unit">
                        {fmt(itemPrice(item))} IQD {t.each}
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
                      {fmt(itemPrice(item) * cart[item.id])}
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
                <div className="t-row">
                  <span>{t.total}</span>
                  <span>{fmt(totalIQD)} IQD</span>
                </div>
                <button
                  className="place-btn"
                  onClick={placeOrder}
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <div className="spinner" />
                      {t.sending}
                    </>
                  ) : (
                    `${t.placeOrder} · ${fmt(totalIQD)} IQD`
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* MODAL OVERLAY */}
        {modal && (
          <div
            className="m-overlay"
            onClick={() => !modalSending && setModal(null)}
          >
            <div className="m-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="m-handle" />

              {modal === "bill" &&
                (modalDone ? (
                  <div className="m-done">
                    <div className="m-done-icon">💳</div>
                    <div className="m-done-text">{t.billSent}</div>
                  </div>
                ) : (
                  <>
                    <div className="m-title">{t.billTitle}</div>
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                      <button
                        className="m-btn-no"
                        onClick={() => setModal(null)}
                      >
                        {t.billNo}
                      </button>
                      <button
                        className="m-btn-yes"
                        onClick={async () => {
                          setModalSending(true);
                          try {
                            await sendTelegramBill(tableNum);
                          } catch {}
                          setModalSending(false);
                          setModalDone(true);
                          setTimeout(() => setModal(null), 2200);
                        }}
                      >
                        {modalSending ? (
                          <>
                            <div className="spinner" />
                          </>
                        ) : (
                          t.billYes
                        )}
                      </button>
                    </div>
                  </>
                ))}

              {modal === "note" &&
                (modalDone ? (
                  <div className="m-done">
                    <div className="m-done-icon">📝</div>
                    <div className="m-done-text">{t.noteSent}</div>
                  </div>
                ) : (
                  <>
                    <div className="m-title">{t.noteTitle}</div>
                    <textarea
                      className="m-textarea"
                      rows={4}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder={t.noteMsgPlaceholder}
                      autoFocus
                    />
                    <button
                      className="m-send-btn"
                      disabled={!noteText.trim() || modalSending}
                      onClick={async () => {
                        setModalSending(true);
                        try {
                          await sendTelegramNote(tableNum, noteText);
                        } catch {}
                        setModalSending(false);
                        setModalDone(true);
                        setTimeout(() => setModal(null), 2200);
                      }}
                    >
                      {modalSending ? (
                        <>
                          <div className="spinner" />
                          {t.noteSendingNote}
                        </>
                      ) : (
                        t.noteSend
                      )}
                    </button>
                  </>
                ))}

              {modal === "feedback" &&
                (modalDone ? (
                  <div className="m-done">
                    <div className="m-done-icon">⭐</div>
                    <div className="m-done-text">{t.feedbackSent}</div>
                  </div>
                ) : (
                  <>
                    <div className="m-title">{t.feedbackTitle}</div>
                    <div className="m-scroll">
                      {[
                        { key: "staff", label: t.feedbackStaff },
                        { key: "service", label: t.feedbackService },
                        { key: "hygiene", label: t.feedbackHygiene },
                      ].map(({ key, label }) => (
                        <div key={key} className="fb-row">
                          <div className="fb-label">{label}</div>
                          <div className="fb-stars">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button
                                key={`${key}-${n}`}
                                type="button"
                                className={`star-btn${fbStars[key] >= n ? " lit" : ""}`}
                                onClick={() =>
                                  setFbStars((s) => ({ ...s, [key]: n }))
                                }
                              >
                                <span aria-hidden="true">★</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="fb-field-label">{t.feedbackContact}</div>
                      <input
                        className="m-input"
                        type="tel"
                        value={fbContact}
                        onChange={(e) => setFbContact(e.target.value)}
                        placeholder="+964 7XX XXX XXXX"
                      />
                      <div className="fb-field-label">{t.feedbackComments}</div>
                      <textarea
                        className="m-textarea"
                        rows={3}
                        value={fbComments}
                        onChange={(e) => setFbComments(e.target.value)}
                        placeholder="…"
                      />
                    </div>
                    <button
                      className="m-send-btn"
                      disabled={
                        modalSending ||
                        (!fbStars.staff && !fbStars.service && !fbStars.hygiene)
                      }
                      onClick={async () => {
                        setModalSending(true);
                        try {
                          await sendTelegramFeedback(
                            tableNum,
                            fbStars,
                            fbContact,
                            fbComments,
                          );
                        } catch {}
                        setModalSending(false);
                        setModalDone(true);
                        setTimeout(() => setModal(null), 2500);
                      }}
                    >
                      {modalSending ? (
                        <>
                          <div className="spinner" />
                          {t.feedbackSending}
                        </>
                      ) : (
                        t.feedbackSend
                      )}
                    </button>
                  </>
                ))}
            </div>
          </div>
        )}

        {/* ITEM DETAIL MODAL */}
        {selectedItem &&
          (() => {
            const item = selectedItem;
            const qty = cart[item.id] || 0;
            return (
              <div
                className="det-overlay"
                onClick={() => setSelectedItem(null)}
              >
                <div className="det-sheet" onClick={(e) => e.stopPropagation()}>
                  <div className="det-img-wrap">
                    <div className="det-handle" />
                    {item.photo && (
                      <img className="det-img-bg" src={item.photo} alt="" aria-hidden="true" />
                    )}
                    <ItemPhoto
                      className="det-img"
                      src={item.photo}
                      alt={item.name[lang]}
                    />
                    <button
                      className="det-close"
                      onClick={() => setSelectedItem(null)}
                    >
                      ✕
                    </button>
                    {item.tags.length > 0 && (
                      <div className="det-tags">
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
                    )}
                  </div>
                  <div className="det-body">
                    <div className="det-row">
                      <div className="det-name">{item.name[lang]}</div>
                      <div className="det-price">IQD {fmt(item.price + (selectedAddon?.price || 0))}</div>
                    </div>
                    <div className="det-divider" />
                    <div className="det-ing-label">
                      {isRTL
                        ? "المكونات"
                        : lang === "ku"
                          ? "پێکهاتەکان"
                          : "Ingredients"}
                    </div>
                    <div className="det-ing">{item.ingredients[lang]}</div>
                    {item.addons?.length > 0 && (
                      <div className="det-addons">
                        <div className="det-ing-label">
                          {lang === "ar" ? "الإضافات" : lang === "ku" ? "زیادەکان" : "Add-ons"}
                        </div>
                        {item.addons.map((addon) => (
                          <label
                            key={addon.id}
                            className={`addon-opt${selectedAddon?.id === addon.id ? " selected" : ""}`}
                          >
                            <input
                              type="radio"
                              name={`addon-${item.id}`}
                              checked={selectedAddon?.id === addon.id}
                              onChange={() => setSelectedAddon(addon)}
                            />
                            <span className="addon-name">{addon[`name_${lang}`] || addon.name_en}</span>
                            {addon.price > 0 && (
                              <span className="addon-price">+{fmt(addon.price)} IQD</span>
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                    {tableNum && (
                      <div className="det-actions">
                        {qty === 0 ? (
                          <button
                            className="det-add"
                            onClick={() => {
                              add(item, selectedAddon);
                              setSelectedItem(null);
                            }}
                          >
                            +{" "}
                            {lang === "ar"
                              ? "أضف للطلب"
                              : lang === "ku"
                                ? "زیادبکە"
                                : "Add to Order"}
                          </button>
                        ) : (
                          <div className="det-qty-row">
                            <button
                              className="qb"
                              style={{ width: 36, height: 36, fontSize: 20 }}
                              onClick={() => remove(item)}
                            >
                              −
                            </button>
                            <span
                              style={{
                                fontSize: 18,
                                fontWeight: 800,
                                minWidth: 28,
                                textAlign: "center",
                              }}
                            >
                              {qty}
                            </span>
                            <button
                              className="qb solid"
                              style={{ width: 36, height: 36, fontSize: 20 }}
                              onClick={() => add(item)}
                            >
                              +
                            </button>
                            <div style={{ flex: 1 }} />
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#52b788",
                              }}
                            >
                              IQD {fmt(itemPrice(item) * qty)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

        <div className={`toast${toast ? " show" : ""}`}>{toast}</div>

        <div className={`fullscreen${screen === "success" ? " show" : ""}`}>
          <div className="s-icon">☕</div>
          <div className="s-title">{t.orderPlaced}</div>
          <div className="s-msg">{t.orderMsg}</div>
          <div className="s-num">Order #TL-{orderNum}</div>
          <button className="s-back" onClick={reset}>
            {t.orderMore}
          </button>
        </div>

        <div className={`fullscreen${screen === "error" ? " show" : ""}`}>
          <div className="err-icon">⚠️</div>
          <div className="err-title">{t.errorTitle}</div>
          <div className="err-msg">{t.errorMsg}</div>
          <button
            className="err-btn"
            onClick={() => {
              setScreen("menu");
              setDrawerOpen(true);
            }}
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    </>
  );
}
