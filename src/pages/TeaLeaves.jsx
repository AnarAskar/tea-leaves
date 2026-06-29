import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase, supabaseConfigured } from "../utils/supabaseClient";
import MenuApp from "../components/MenuApp";

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("t");
  const [tableNum, setTableNum] = useState(null);
  const [lang, setLang] = useState(searchParams.get("lang") || "en");

  // Resolve the opaque table token to a table number. No token, an invalid
  // token, or unconfigured Supabase all leave tableNum null => browse-only.
  useEffect(() => {
    if (!token || !supabaseConfigured) return;
    let active = true;
    supabase
      .from("tables")
      .select("number")
      .eq("token", token)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setTableNum(data?.number ?? null);
      });
    return () => {
      active = false;
    };
  }, [token]);

  // Keep <html lang>/<dir> in sync with the chosen language for a11y + correct RTL.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" || lang === "ku" ? "rtl" : "ltr";
    return () => {
      root.lang = "en";
      root.dir = "ltr";
    };
  }, [lang]);

  const handleChangeLang = (newLang) => {
    setLang(newLang);
    setSearchParams((p) => { p.set("lang", newLang); return p; }, { replace: true });
  };

  return <MenuApp lang={lang} onChangeLang={handleChangeLang} tableNum={tableNum} />;
}
