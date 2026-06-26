import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MAX_TABLE } from "../constants/config";
import MenuApp from "../components/MenuApp";

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTable = parseInt(searchParams.get("table"), 10);
  const tableNum =
    Number.isInteger(rawTable) && rawTable >= 1 && rawTable <= MAX_TABLE
      ? rawTable
      : null;
  const [lang, setLang] = useState(searchParams.get("lang") || "en");

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
