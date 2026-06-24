import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { NUM_TABLES } from "../constants/config";
import MenuApp from "../components/MenuApp";

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTable = parseInt(searchParams.get("table"), 10);
  const tableNum =
    Number.isInteger(rawTable) && rawTable >= 1 && rawTable <= NUM_TABLES
      ? rawTable
      : null;
  const [lang, setLang] = useState(searchParams.get("lang") || "en");

  const handleChangeLang = (newLang) => {
    setLang(newLang);
    setSearchParams((p) => { p.set("lang", newLang); return p; }, { replace: true });
  };

  return <MenuApp lang={lang} onChangeLang={handleChangeLang} tableNum={tableNum} />;
}
