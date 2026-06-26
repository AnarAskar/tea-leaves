import { useNavigate, useSearchParams } from "react-router-dom";
import SplashScreen from "../components/SplashScreen";
import { MAX_TABLE } from "../constants/config";

export default function SplashPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const raw = parseInt(searchParams.get("table"), 10);
  const table = Number.isInteger(raw) && raw >= 1 && raw <= MAX_TABLE ? raw : null;

  const handlePickLang = (lang) => {
    const p = new URLSearchParams({ lang });
    if (table) p.set("table", String(table));
    navigate(`/menu?${p.toString()}`);
  };

  return <SplashScreen onPickLang={handlePickLang} />;
}
